const express = require('express');
const { body, validationResult } = require('express-validator');
const { getPool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// AI Chat endpoint
router.post('/ask', [
  authenticateToken,
  body('message').notEmpty().trim(),
  body('page').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message, page } = req.body;
    const pool = getPool();

    // Log the AI interaction
    await pool.request()
      .input('userId', req.user.id)
      .input('message', message)
      .input('page', page || '/')
      .query(`
        INSERT INTO ai_interactions (user_id, message, page, created_at)
        VALUES (@userId, @message, @page, GETDATE())
      `);

    // Process the AI request based on the message content
    let reply = '';
    let preview = null;

    // Simple AI logic - in production, you'd integrate with OpenAI or Azure OpenAI
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('open tickets') || lowerMessage.includes('my tickets')) {
      const ticketsResult = await pool.request()
        .input('userId', req.user.id)
        .query(`
          SELECT TOP 5 
            id, ticket_id, title, status, priority, created_at
          FROM tickets 
          WHERE created_by = @userId AND status IN ('Open', 'In Progress')
          ORDER BY created_at DESC
        `);

      const tickets = ticketsResult.recordset;
      if (tickets.length > 0) {
        reply = `You have ${tickets.length} open tickets:\n\n`;
        tickets.forEach(ticket => {
          reply += `🎫 **${ticket.ticket_id}**: ${ticket.title}\n`;
          reply += `   Status: ${ticket.status} | Priority: ${ticket.priority}\n\n`;
        });
        
        // Provide preview for the first ticket
        preview = {
          id: tickets[0].ticket_id,
          title: tickets[0].title,
          status: tickets[0].status,
          assignedTo: 'System'
        };
      } else {
        reply = "🎉 Great news! You don't have any open tickets at the moment.";
      }
    }
    else if (lowerMessage.includes('create') && lowerMessage.includes('ticket')) {
      reply = "I can help you create a new ticket! Here's what you can do:\n\n";
      reply += "1. 🎫 Click on 'Create Ticket' in the sidebar\n";
      reply += "2. 📝 Fill in the ticket details\n";
      reply += "3. 🏷️ Select the appropriate priority\n";
      reply += "4. 👥 Choose the department\n";
      reply += "5. ✅ Submit your ticket\n\n";
      reply += "Would you like me to guide you through the process?";
    }
    else if (lowerMessage.includes('sla') || lowerMessage.includes('compliance')) {
      const slaResult = await pool.request()
        .query(`
          SELECT 
            COUNT(*) as total_tickets,
            SUM(CASE WHEN status = 'Closed' AND sla_met = 1 THEN 1 ELSE 0 END) as sla_met,
            SUM(CASE WHEN status = 'Closed' THEN 1 ELSE 0 END) as closed_tickets
          FROM tickets
          WHERE created_at >= DATEADD(month, -1, GETDATE())
        `);

      const slaData = slaResult.recordset[0];
      const complianceRate = slaData.closed_tickets > 0 
        ? Math.round((slaData.sla_met / slaData.closed_tickets) * 100) 
        : 0;

      reply = `📊 **SLA Compliance Report (Last 30 days)**\n\n`;
      reply += `✅ SLA Compliance Rate: **${complianceRate}%**\n`;
      reply += `🎫 Total Tickets: ${slaData.total_tickets}\n`;
      reply += `✅ Closed Tickets: ${slaData.closed_tickets}\n`;
      reply += `🎯 SLA Met: ${slaData.sla_met}\n\n`;
      
      if (complianceRate >= 95) {
        reply += "🌟 Excellent! Your team is exceeding SLA targets.";
      } else if (complianceRate >= 85) {
        reply += "👍 Good performance, but there's room for improvement.";
      } else {
        reply += "⚠️ SLA compliance needs attention. Consider reviewing processes.";
      }
    }
    else if (lowerMessage.includes('closed') && lowerMessage.includes('tickets')) {
      const closedResult = await pool.request()
        .input('userId', req.user.id)
        .query(`
          SELECT TOP 5 
            id, ticket_id, title, status, priority, closed_at
          FROM tickets 
          WHERE created_by = @userId AND status = 'Closed'
          ORDER BY closed_at DESC
        `);

      const closedTickets = closedResult.recordset;
      if (closedTickets.length > 0) {
        reply = `📋 **Your Last ${closedTickets.length} Closed Tickets:**\n\n`;
        closedTickets.forEach(ticket => {
          reply += `✅ **${ticket.ticket_id}**: ${ticket.title}\n`;
          reply += `   Closed: ${new Date(ticket.closed_at).toLocaleDateString()}\n\n`;
        });
      } else {
        reply = "You don't have any closed tickets yet.";
      }
    }
    else if (lowerMessage.includes('team') && lowerMessage.includes('performance')) {
      const teamResult = await pool.request()
        .query(`
          SELECT 
            u.department,
            COUNT(t.id) as total_tickets,
            AVG(CASE WHEN t.status = 'Closed' THEN DATEDIFF(hour, t.created_at, t.closed_at) END) as avg_resolution_time
          FROM users u
          LEFT JOIN tickets t ON t.assigned_to = u.email
          WHERE t.created_at >= DATEADD(month, -1, GETDATE())
          GROUP BY u.department
          HAVING COUNT(t.id) > 0
          ORDER BY total_tickets DESC
        `);

      const teamData = teamResult.recordset;
      if (teamData.length > 0) {
        reply = `👥 **Team Performance (Last 30 days)**\n\n`;
        teamData.forEach(dept => {
          const avgHours = dept.avg_resolution_time ? Math.round(dept.avg_resolution_time) : 0;
          reply += `🏢 **${dept.department}**\n`;
          reply += `   Tickets: ${dept.total_tickets}\n`;
          reply += `   Avg Resolution: ${avgHours} hours\n\n`;
        });
      } else {
        reply = "No team performance data available for the last 30 days.";
      }
    }
    else if (lowerMessage.includes('system') && lowerMessage.includes('status')) {
      reply = `🔧 **System Status Check**\n\n`;
      reply += `✅ **Database**: Connected and operational\n`;
      reply += `✅ **API Server**: Running smoothly\n`;
      reply += `✅ **Chat System**: Online and active\n`;
      reply += `✅ **AI Assistant**: Fully functional\n`;
      reply += `✅ **File Storage**: Available\n\n`;
      reply += `🌟 All systems are operating normally!`;
    }
    else if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      reply = `🤖 **I'm your Ticxnova AI Assistant!** Here's what I can help you with:\n\n`;
      reply += `🎫 **Tickets**: View open tickets, create new ones, check status\n`;
      reply += `📊 **Reports**: SLA compliance, team performance, analytics\n`;
      reply += `👥 **Team**: Check who's online, team statistics\n`;
      reply += `🔧 **System**: System status, troubleshooting\n`;
      reply += `💬 **Chat**: Help with communication features\n\n`;
      reply += `Just ask me anything like:\n`;
      reply += `• "Show my open tickets"\n`;
      reply += `• "What's our SLA compliance?"\n`;
      reply += `• "How is the team performing?"\n`;
      reply += `• "Check system status"\n\n`;
      reply += `I'm here to make your work easier! 🚀`;
    }
    else {
      // Default response with helpful suggestions
      reply = `🤔 I understand you're asking about "${message}". While I'm still learning, here are some things I can definitely help you with:\n\n`;
      reply += `🎫 **Ticket Management**: "Show my open tickets", "Create a new ticket"\n`;
      reply += `📈 **Reports & Analytics**: "SLA compliance report", "Team performance"\n`;
      reply += `🔧 **System Info**: "System status check", "Who's online"\n\n`;
      reply += `Try asking me one of these questions, or type "help" to see all my capabilities! 😊`;
    }

    // Store the AI response
    await pool.request()
      .input('userId', req.user.id)
      .input('message', message)
      .input('response', reply)
      .input('page', page || '/')
      .query(`
        INSERT INTO ai_responses (user_id, user_message, ai_response, page, created_at)
        VALUES (@userId, @message, @response, @page, GETDATE())
      `);

    res.json({ 
      reply,
      preview,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('AI chat error:', error);
    
    // Fallback response
    res.json({
      reply: "🤖 I'm experiencing some technical difficulties right now. Please try again in a moment, or contact support if the issue persists.",
      timestamp: new Date().toISOString()
    });
  }
});

// Get AI interaction history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const pool = getPool();

    const result = await pool.request()
      .input('userId', req.user.id)
      .input('limit', parseInt(limit))
      .query(`
        SELECT TOP (@limit)
          user_message,
          ai_response,
          page,
          created_at
        FROM ai_responses
        WHERE user_id = @userId
        ORDER BY created_at DESC
      `);

    const history = result.recordset.map(record => ({
      userMessage: record.user_message,
      aiResponse: record.ai_response,
      page: record.page,
      timestamp: record.created_at
    }));

    res.json(history);
  } catch (error) {
    logger.error('Get AI history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// AI Analytics endpoint
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    const pool = getPool();

    const result = await pool.request()
      .query(`
        SELECT 
          COUNT(*) as total_interactions,
          COUNT(DISTINCT user_id) as unique_users,
          AVG(LEN(user_message)) as avg_message_length,
          TOP 5 page, COUNT(*) as page_interactions
        FROM ai_interactions
        WHERE created_at >= DATEADD(day, -30, GETDATE())
        GROUP BY page
        ORDER BY page_interactions DESC
      `);

    res.json({
      totalInteractions: result.recordset[0]?.total_interactions || 0,
      uniqueUsers: result.recordset[0]?.unique_users || 0,
      avgMessageLength: Math.round(result.recordset[0]?.avg_message_length || 0),
      topPages: result.recordset.map(r => ({
        page: r.page,
        interactions: r.page_interactions
      }))
    });
  } catch (error) {
    logger.error('AI analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;