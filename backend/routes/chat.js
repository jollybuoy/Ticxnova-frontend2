const express = require('express');
const { body, validationResult } = require('express-validator');
const { getPool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// Get online users
router.get('/users/online', authenticateToken, async (req, res) => {
  try {
    const pool = getPool();
    
    // Get users who were active in the last 5 minutes
    const result = await pool.request()
      .query(`
        SELECT 
          u.id,
          u.name,
          u.email,
          u.department,
          u.designation as role,
          CASE 
            WHEN u.last_activity > DATEADD(minute, -2, GETDATE()) THEN 'online'
            WHEN u.last_activity > DATEADD(minute, -5, GETDATE()) THEN 'away'
            WHEN u.last_activity > DATEADD(minute, -15, GETDATE()) THEN 'busy'
            ELSE 'offline'
          END as status,
          u.last_activity,
          CASE 
            WHEN fc.user_id IS NOT NULL THEN 1
            ELSE 0
          END as is_frequent
        FROM users u
        LEFT JOIN frequent_contacts fc ON fc.contact_id = u.id AND fc.user_id = @userId
        WHERE u.active = 1 AND u.id != @userId
        ORDER BY 
          CASE 
            WHEN u.last_activity > DATEADD(minute, -2, GETDATE()) THEN 1
            WHEN u.last_activity > DATEADD(minute, -5, GETDATE()) THEN 2
            WHEN u.last_activity > DATEADD(minute, -15, GETDATE()) THEN 3
            ELSE 4
          END,
          fc.user_id DESC,
          u.name
      `)
      .input('userId', req.user.id);

    const users = result.recordset.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      department: user.department,
      role: user.role,
      status: user.status,
      lastSeen: getLastSeenText(user.last_activity),
      isFrequent: user.is_frequent === 1,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3B82F6&color=fff`
    }));

    res.json(users);
  } catch (error) {
    logger.error('Get online users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get chat messages between users
router.get('/messages/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const pool = getPool();
    
    const result = await pool.request()
      .input('currentUserId', req.user.id)
      .input('otherUserId', parseInt(userId))
      .input('limit', parseInt(limit))
      .input('offset', offset)
      .query(`
        SELECT 
          m.id,
          m.sender_id,
          m.message,
          m.message_type,
          m.created_at,
          u.name as sender_name
        FROM chat_messages m
        JOIN users u ON u.id = m.sender_id
        WHERE 
          (m.sender_id = @currentUserId AND m.receiver_id = @otherUserId)
          OR (m.sender_id = @otherUserId AND m.receiver_id = @currentUserId)
        ORDER BY m.created_at DESC
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY
      `);

    const messages = result.recordset.reverse().map(msg => ({
      id: msg.id,
      senderId: msg.sender_id === req.user.id ? 'me' : msg.sender_id,
      text: msg.message,
      type: msg.message_type,
      timestamp: msg.created_at,
      senderName: msg.sender_name
    }));

    res.json(messages);
  } catch (error) {
    logger.error('Get chat messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Send chat message
router.post('/messages', [
  authenticateToken,
  body('receiverId').isInt(),
  body('message').notEmpty().trim(),
  body('type').optional().isIn(['text', 'emoji', 'file'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { receiverId, message, type = 'text' } = req.body;
    const pool = getPool();

    // Insert message
    const result = await pool.request()
      .input('senderId', req.user.id)
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
      senderId: req.user.id,
      receiverId: receiverId,
      text: message,
      type: type,
      timestamp: result.recordset[0].created_at,
      senderName: req.user.name
    };

    // Update frequent contacts
    await pool.request()
      .input('userId', req.user.id)
      .input('contactId', receiverId)
      .query(`
        IF NOT EXISTS (SELECT 1 FROM frequent_contacts WHERE user_id = @userId AND contact_id = @contactId)
        BEGIN
          INSERT INTO frequent_contacts (user_id, contact_id, created_at)
          VALUES (@userId, @contactId, GETDATE())
        END
        ELSE
        BEGIN
          UPDATE frequent_contacts 
          SET last_contact = GETDATE()
          WHERE user_id = @userId AND contact_id = @contactId
        END
      `);

    // Emit to socket.io for real-time updates
    req.io.to(`user_${receiverId}`).emit('new_message', newMessage);
    req.io.to(`user_${req.user.id}`).emit('message_sent', newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    logger.error('Send message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark messages as read
router.patch('/messages/:userId/read', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const pool = getPool();

    await pool.request()
      .input('currentUserId', req.user.id)
      .input('senderId', parseInt(userId))
      .query(`
        UPDATE chat_messages 
        SET read_at = GETDATE()
        WHERE receiver_id = @currentUserId 
          AND sender_id = @senderId 
          AND read_at IS NULL
      `);

    res.json({ success: true });
  } catch (error) {
    logger.error('Mark messages as read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user activity (for presence)
router.post('/activity', authenticateToken, async (req, res) => {
  try {
    const pool = getPool();
    
    await pool.request()
      .input('userId', req.user.id)
      .query('UPDATE users SET last_activity = GETDATE() WHERE id = @userId');

    res.json({ success: true });
  } catch (error) {
    logger.error('Update activity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to format last seen time
function getLastSeenText(lastActivity) {
  if (!lastActivity) return 'Never';
  
  const now = new Date();
  const diff = now - new Date(lastActivity);
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes} min ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

module.exports = router;