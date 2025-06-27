# Ticxnova Backend API

A comprehensive backend solution for the Ticxnova ticketing platform with Azure SQL integration, real-time chat, and AI features.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Microsoft Azure AD integration
- Role-based access control (Admin, Manager, User)
- Secure password hashing with bcrypt

### 🎫 Ticket Management
- Complete CRUD operations for tickets
- Multiple ticket types (Incident, Service Request, Change Request, Problem, Task)
- Priority levels (P1-P4) with SLA tracking
- Department-based assignment
- Ticket notes and status updates
- Real-time notifications

### 💬 Real-time Chat System
- User presence tracking (online, away, busy, offline)
- Direct messaging between users
- Frequent contacts management
- Typing indicators
- Message read receipts
- Emoji support

### 🤖 AI Assistant
- Intelligent ticket queries
- SLA compliance reporting
- Team performance analytics
- System status checks
- Natural language processing
- Context-aware responses

### 📊 Analytics & Reporting
- Dashboard metrics
- SLA compliance tracking
- Team performance reports
- Ticket trends analysis
- Real-time activity feeds

### 🔄 Real-time Features
- Socket.IO integration
- Live ticket updates
- Instant messaging
- Presence indicators
- Real-time notifications

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Azure SQL Database
- **Real-time**: Socket.IO
- **Authentication**: JWT + bcrypt
- **Validation**: express-validator
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting

## Setup Instructions

### 1. Prerequisites
- Node.js 16+ installed
- Azure SQL Database instance
- Azure Storage Account (optional, for file uploads)

### 2. Installation
```bash
cd backend
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env` and configure:

```env
# Database
DB_SERVER=your-azure-sql-server.database.windows.net
DB_DATABASE=ticxnova
DB_USER=your-username
DB_PASSWORD=your-password

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 4. Database Setup
Run the SQL script to create tables:
```bash
# Connect to your Azure SQL Database and run:
# backend/scripts/createTables.sql
```

### 5. Start the Server
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/microsoft-login` - Microsoft SSO login
- `POST /api/auth/register` - User registration

### Tickets
- `GET /api/tickets` - Get tickets (with filtering)
- `GET /api/tickets/:id` - Get single ticket
- `POST /api/tickets` - Create new ticket
- `PATCH /api/tickets/:id` - Update ticket
- `POST /api/tickets/:id/notes` - Add note to ticket

### Chat
- `GET /api/chat/users/online` - Get online users
- `GET /api/chat/messages/:userId` - Get chat messages
- `POST /api/chat/messages` - Send message
- `POST /api/chat/activity` - Update user activity

### AI Assistant
- `POST /api/aichat/ask` - Ask AI question
- `GET /api/aichat/history` - Get AI chat history
- `GET /api/aichat/analytics` - AI usage analytics

## Socket.IO Events

### Connection Events
- `connection` - User connects
- `disconnect` - User disconnects
- `user_online` - User comes online
- `user_offline` - User goes offline

### Chat Events
- `send_message` - Send chat message
- `new_message` - Receive new message
- `typing_start` - User starts typing
- `typing_stop` - User stops typing

### Ticket Events
- `ticket_created` - New ticket created
- `ticket_updated` - Ticket updated
- `join_ticket` - Join ticket room
- `leave_ticket` - Leave ticket room

## Security Features

### 🔒 Authentication
- JWT tokens with expiration
- Password hashing with bcrypt (12 rounds)
- Microsoft Azure AD integration
- Session management

### 🛡️ Security Middleware
- Helmet for security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- Input validation and sanitization
- SQL injection prevention

### 🔐 Authorization
- Role-based access control
- Resource-level permissions
- User isolation for sensitive data

## Database Schema

### Core Tables
- `users` - User accounts and profiles
- `tickets` - Support tickets
- `ticket_notes` - Ticket comments and updates
- `chat_messages` - Direct messages
- `frequent_contacts` - User contact preferences
- `ai_interactions` - AI chat history
- `notifications` - System notifications

### Indexes
Optimized indexes for:
- Ticket queries by status, priority, department
- Chat message retrieval
- User lookups and presence
- AI interaction tracking

## Monitoring & Logging

### 📊 Logging
- Winston logger with multiple transports
- Structured JSON logging
- Error tracking and debugging
- Performance monitoring

### 🔍 Health Checks
- `/health` endpoint for monitoring
- Database connection status
- System uptime tracking

## Deployment

### Azure App Service
1. Create Azure App Service
2. Configure environment variables
3. Deploy from GitHub repository
4. Set up Azure SQL Database connection

### Environment Variables
```env
NODE_ENV=production
PORT=80
DB_SERVER=your-server.database.windows.net
DB_DATABASE=ticxnova
DB_USER=your-username
DB_PASSWORD=your-secure-password
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=https://your-frontend-domain.com
```

## Development

### 🧪 Testing
```bash
npm test
```

### 🔄 Development Mode
```bash
npm run dev
```

### 📝 Code Style
- ESLint configuration
- Prettier formatting
- Consistent error handling
- Comprehensive logging

## Support

For technical support or questions:
- Email: support@ticxnova.com
- Documentation: [API Docs](./docs/api.md)
- Issues: GitHub Issues

## License

Copyright © 2024 Ticxnova. All rights reserved.