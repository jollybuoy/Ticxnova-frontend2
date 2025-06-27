const jwt = require('jsonwebtoken');
const { getPool } = require('../config/database');
const logger = require('../utils/logger');

const socketHandler = (io) => {
  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user details from database
      const pool = getPool();
      const result = await pool.request()
        .input('userId', decoded.userId)
        .query('SELECT id, email, name, role, department FROM users WHERE id = @userId AND active = 1');

      if (result.recordset.length === 0) {
        return next(new Error('User not found'));
      }

      socket.user = result.recordset[0];
      next();
    } catch (error) {
      logger.error('Socket authentication error:', error);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    logger.info(`User connected: ${socket.user.email} (${socket.id})`);

    // Join user to their personal room
    socket.join(`user_${socket.user.id}`);

    // Update user's online status
    try {
      const pool = getPool();
      await pool.request()
        .input('userId', socket.user.id)
        .query('UPDATE users SET last_activity = GETDATE(), is_online = 1 WHERE id = @userId');

      // Broadcast user online status to all connected clients
      socket.broadcast.emit('user_online', {
        userId: socket.user.id,
        name: socket.user.name,
        email: socket.user.email
      });
    } catch (error) {
      logger.error('Error updating user online status:', error);
    }

    // Handle chat events
    socket.on('join_chat', (data) => {
      const { otherUserId } = data;
      const roomName = [socket.user.id, otherUserId].sort().join('_');
      socket.join(`chat_${roomName}`);
      logger.info(`User ${socket.user.email} joined chat room: ${roomName}`);
    });

    socket.on('leave_chat', (data) => {
      const { otherUserId } = data;
      const roomName = [socket.user.id, otherUserId].sort().join('_');
      socket.leave(`chat_${roomName}`);
      logger.info(`User ${socket.user.email} left chat room: ${roomName}`);
    });

    socket.on('send_message', async (data) => {
      try {
        const { receiverId, message, type = 'text' } = data;
        const pool = getPool();

        // Insert message into database
        const result = await pool.request()
          .input('senderId', socket.user.id)
          .input('receiverId', receiverId)
          .input('message', message)
          .input('messageType', type)
          .query(`
            INSERT INTO chat_messages (sender_id, receiver_id, message, message_type, created_at)
            OUTPUT INSERTED.id, INSERTED.created_at
            VALUES (@senderId, @receiverId, @message, @messageType, GETDATE())
          `);

        const newMessage = {
          id: result.recordset[0].id,
          senderId: socket.user.id,
          receiverId: receiverId,
          text: message,
          type: type,
          timestamp: result.recordset[0].created_at,
          senderName: socket.user.name
        };

        // Send to receiver
        io.to(`user_${receiverId}`).emit('new_message', newMessage);
        
        // Confirm to sender
        socket.emit('message_sent', newMessage);

        logger.info(`Message sent from ${socket.user.email} to user ${receiverId}`);
      } catch (error) {
        logger.error('Send message error:', error);
        socket.emit('message_error', { error: 'Failed to send message' });
      }
    });

    socket.on('typing_start', (data) => {
      const { receiverId } = data;
      io.to(`user_${receiverId}`).emit('user_typing', {
        userId: socket.user.id,
        name: socket.user.name,
        typing: true
      });
    });

    socket.on('typing_stop', (data) => {
      const { receiverId } = data;
      io.to(`user_${receiverId}`).emit('user_typing', {
        userId: socket.user.id,
        name: socket.user.name,
        typing: false
      });
    });

    // Handle presence updates
    socket.on('update_presence', async (data) => {
      try {
        const { status } = data; // online, away, busy, offline
        const pool = getPool();
        
        await pool.request()
          .input('userId', socket.user.id)
          .input('status', status)
          .query('UPDATE users SET presence_status = @status, last_activity = GETDATE() WHERE id = @userId');

        // Broadcast presence update
        socket.broadcast.emit('presence_update', {
          userId: socket.user.id,
          name: socket.user.name,
          status: status
        });

        logger.info(`User ${socket.user.email} updated presence to: ${status}`);
      } catch (error) {
        logger.error('Update presence error:', error);
      }
    });

    // Handle ticket events
    socket.on('join_ticket', (data) => {
      const { ticketId } = data;
      socket.join(`ticket_${ticketId}`);
      logger.info(`User ${socket.user.email} joined ticket room: ${ticketId}`);
    });

    socket.on('leave_ticket', (data) => {
      const { ticketId } = data;
      socket.leave(`ticket_${ticketId}`);
      logger.info(`User ${socket.user.email} left ticket room: ${ticketId}`);
    });

    // Handle AI chat events
    socket.on('ai_chat_start', () => {
      socket.join('ai_chat');
      logger.info(`User ${socket.user.email} started AI chat session`);
    });

    socket.on('ai_chat_end', () => {
      socket.leave('ai_chat');
      logger.info(`User ${socket.user.email} ended AI chat session`);
    });

    // Handle notifications
    socket.on('mark_notification_read', async (data) => {
      try {
        const { notificationId } = data;
        const pool = getPool();
        
        await pool.request()
          .input('notificationId', notificationId)
          .input('userId', socket.user.id)
          .query('UPDATE notifications SET read_at = GETDATE() WHERE id = @notificationId AND user_id = @userId');

        socket.emit('notification_marked_read', { notificationId });
      } catch (error) {
        logger.error('Mark notification read error:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      logger.info(`User disconnected: ${socket.user.email} (${socket.id})`);

      try {
        const pool = getPool();
        await pool.request()
          .input('userId', socket.user.id)
          .query('UPDATE users SET is_online = 0, last_activity = GETDATE() WHERE id = @userId');

        // Broadcast user offline status
        socket.broadcast.emit('user_offline', {
          userId: socket.user.id,
          name: socket.user.name,
          email: socket.user.email
        });
      } catch (error) {
        logger.error('Error updating user offline status:', error);
      }
    });

    // Handle errors
    socket.on('error', (error) => {
      logger.error(`Socket error for user ${socket.user.email}:`, error);
    });
  });

  // Periodic cleanup of inactive connections
  setInterval(async () => {
    try {
      const pool = getPool();
      await pool.request()
        .query(`
          UPDATE users 
          SET is_online = 0 
          WHERE last_activity < DATEADD(minute, -5, GETDATE()) AND is_online = 1
        `);
    } catch (error) {
      logger.error('Error in periodic cleanup:', error);
    }
  }, 60000); // Run every minute

  return io;
};

module.exports = socketHandler;