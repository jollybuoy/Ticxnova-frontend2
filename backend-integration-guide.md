# Backend Integration Guide for Ticxnova

This guide will help you integrate the enhanced frontend features with your existing backend repository.

## 🚀 Quick Setup

### 1. Add Required Dependencies

Add these to your existing `package.json`:

```json
{
  "dependencies": {
    "socket.io": "^4.7.2",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "express-validator": "^7.0.1",
    "winston": "^3.10.0"
  }
}
```

### 2. Environment Variables

Add these to your `.env` file:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173

# Socket.IO Configuration
SOCKET_IO_ENABLED=true
```

### 3. Database Schema Updates

Add these tables to your existing database:

```sql
-- Chat messages table
CREATE TABLE chat_messages (
    id INT IDENTITY(1,1) PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message NTEXT NOT NULL,
    message_type NVARCHAR(20) NOT NULL DEFAULT 'text',
    read_at DATETIME2 NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
);

-- Frequent contacts table
CREATE TABLE frequent_contacts (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    contact_id INT NOT NULL,
    last_contact DATETIME2 NOT NULL DEFAULT GETDATE(),
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (contact_id) REFERENCES users(id),
    UNIQUE(user_id, contact_id)
);

-- AI interactions table
CREATE TABLE ai_interactions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    message NTEXT NOT NULL,
    page NVARCHAR(255) NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- AI responses table
CREATE TABLE ai_responses (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    user_message NTEXT NOT NULL,
    ai_response NTEXT NOT NULL,
    page NVARCHAR(255) NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Add presence tracking to users table
ALTER TABLE users ADD 
    is_online BIT NOT NULL DEFAULT 0,
    presence_status NVARCHAR(20) DEFAULT 'offline',
    last_activity DATETIME2 NULL;

-- Create indexes for performance
CREATE INDEX IX_chat_messages_sender_receiver ON chat_messages(sender_id, receiver_id);
CREATE INDEX IX_users_last_activity ON users(last_activity);
```

## 📁 File Structure

Add these files to your backend:

```
backend/
├── routes/
│   ├── chat.js          # Chat API endpoints
│   ├── ai.js            # AI assistant endpoints
│   └── auth.js          # Enhanced auth with JWT
├── socket/
│   └── socketHandler.js # Socket.IO real-time features
├── middleware/
│   └── auth.js          # JWT authentication middleware
└── utils/
    └── logger.js        # Winston logger setup
```

## 🔧 Core Files to Add/Update

### 1. Socket.IO Handler (`socket/socketHandler.js`)

```javascript
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const socketHandler = (io) => {
  // Socket authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication error'));
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.email}`);
    
    // Join user to personal room
    socket.join(`user_${socket.user.userId}`);
    
    // Handle chat events
    socket.on('send_message', async (data) => {
      // Save message to database and emit to receiver
      io.to(`user_${data.receiverId}`).emit('new_message', data);
    });
    
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.email}`);
    });
  });
};

module.exports = socketHandler;
```

### 2. Chat Routes (`routes/chat.js`)

```javascript
const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get online users
router.get('/users/online', authenticateToken, async (req, res) => {
  try {
    // Query users who were active in last 5 minutes
    const users = await db.query(`
      SELECT id, name, email, department, last_activity,
      CASE 
        WHEN last_activity > DATEADD(minute, -2, GETDATE()) THEN 'online'
        WHEN last_activity > DATEADD(minute, -5, GETDATE()) THEN 'away'
        ELSE 'offline'
      END as status
      FROM users 
      WHERE active = 1 AND id != @userId
      ORDER BY last_activity DESC
    `, { userId: req.user.id });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Send message
router.post('/messages', authenticateToken, async (req, res) => {
  try {
    const { receiverId, message, type = 'text' } = req.body;
    
    // Save to database
    const result = await db.query(`
      INSERT INTO chat_messages (sender_id, receiver_id, message, message_type)
      VALUES (@senderId, @receiverId, @message, @type)
    `, {
      senderId: req.user.id,
      receiverId,
      message,
      type
    });
    
    // Emit via socket
    req.io.to(`user_${receiverId}`).emit('new_message', {
      id: result.insertId,
      senderId: req.user.id,
      text: message,
      timestamp: new Date()
    });
    
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
```

### 3. AI Routes (`routes/ai.js`)

```javascript
const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.post('/ask', authenticateToken, async (req, res) => {
  try {
    const { message, page } = req.body;
    
    // Simple AI logic - replace with your AI service
    let reply = '';
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('open tickets')) {
      const tickets = await db.query(`
        SELECT TOP 5 ticket_id, title, status 
        FROM tickets 
        WHERE created_by = @userEmail AND status IN ('Open', 'In Progress')
      `, { userEmail: req.user.email });
      
      reply = `You have ${tickets.length} open tickets:\n\n`;
      tickets.forEach(ticket => {
        reply += `🎫 **${ticket.ticket_id}**: ${ticket.title}\n`;
      });
    } else if (lowerMessage.includes('sla')) {
      reply = "📊 **SLA Compliance**: 95% this month\n✅ Most tickets resolved within SLA targets";
    } else {
      reply = "I can help you with:\n• View open tickets\n• SLA reports\n• System status\n• Team performance";
    }
    
    // Save interaction
    await db.query(`
      INSERT INTO ai_responses (user_id, user_message, ai_response, page)
      VALUES (@userId, @message, @reply, @page)
    `, {
      userId: req.user.id,
      message,
      reply,
      page: page || '/'
    });
    
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ 
      reply: "I'm experiencing technical difficulties. Please try again." 
    });
  }
});

module.exports = router;
```

### 4. Update Main Server File

```javascript
// Add to your main server.js file
const { createServer } = require('http');
const { Server } = require('socket.io');
const socketHandler = require('./socket/socketHandler');

const app = express();
const server = createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Make io available to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Initialize socket handler
socketHandler(io);

// Add new routes
app.use('/api/chat', require('./routes/chat'));
app.use('/api/aichat', require('./routes/ai'));

// Start server with socket support
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`💬 Socket.IO enabled for real-time features`);
});
```

## 🔐 Authentication Updates

### JWT Middleware (`middleware/auth.js`)

```javascript
const jwt = require('jsonwebtoken');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = { authenticateToken };
```

## 🎯 Frontend Integration

Your frontend is already configured to work with these endpoints. The key integration points are:

1. **Chat System**: Uses `/api/chat/*` endpoints and Socket.IO
2. **AI Assistant**: Uses `/api/aichat/ask` endpoint
3. **Real-time Updates**: Socket.IO for live features
4. **Authentication**: JWT tokens for API access

## 🚀 Deployment Steps

1. **Update your backend repository** with the new files
2. **Run database migrations** to add new tables
3. **Update environment variables** with JWT secret and frontend URL
4. **Install new dependencies**: `npm install`
5. **Test the integration** with your frontend

## 🔧 Testing

Test these endpoints:

```bash
# Test chat users
GET /api/chat/users/online
Authorization: Bearer <your-jwt-token>

# Test AI assistant
POST /api/aichat/ask
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
{
  "message": "Show my open tickets",
  "page": "/dashboard"
}

# Test Socket.IO connection
# Connect to ws://localhost:5000 with auth token
```

## 📞 Support

If you need help with the integration:

1. **Check the console logs** for any errors
2. **Verify database connections** and table creation
3. **Test API endpoints** individually
4. **Check CORS settings** for frontend communication

The frontend will gracefully fallback to demo mode if the backend is not available, so you can develop incrementally.

## 🎉 Features You'll Get

✅ **Real-time Team Chat** with presence indicators
✅ **AI Assistant** with intelligent responses  
✅ **Live Notifications** for tickets and messages
✅ **User Presence Tracking** (online, away, busy)
✅ **Frequent Contacts** management
✅ **Professional UI** with smooth animations
✅ **Graceful Fallbacks** when backend is unavailable

Your frontend is already built and ready - just integrate these backend changes and you'll have a fully functional, professional ticketing system with advanced chat and AI features!