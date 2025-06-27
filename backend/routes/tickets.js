const express = require('express');
const { body, validationResult } = require('express-validator');
const { getPool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// Get all tickets with filtering
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { filterBy = 'all', status, priority, department, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    
    const pool = getPool();
    let query = `
      SELECT 
        t.id,
        t.ticket_id,
        t.title,
        t.description,
        t.status,
        t.priority,
        t.ticket_type,
        t.department,
        t.assigned_to,
        t.created_by,
        t.created_at,
        t.updated_at,
        t.closed_at,
        u1.name as created_by_name,
        u2.name as assigned_to_name
      FROM tickets t
      LEFT JOIN users u1 ON u1.email = t.created_by
      LEFT JOIN users u2 ON u2.email = t.assigned_to
      WHERE 1=1
    `;

    const request = pool.request();

    // Apply filters
    if (filterBy === 'mine') {
      query += ' AND (t.created_by = @userEmail OR t.assigned_to = @userEmail)';
      request.input('userEmail', req.user.email);
    }

    if (status) {
      query += ' AND t.status = @status';
      request.input('status', status);
    }

    if (priority) {
      query += ' AND t.priority = @priority';
      request.input('priority', priority);
    }

    if (department) {
      query += ' AND t.department = @department';
      request.input('department', department);
    }

    query += ' ORDER BY t.created_at DESC';
    query += ' OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY';

    request.input('offset', offset);
    request.input('limit', parseInt(limit));

    const result = await request.query(query);

    const tickets = result.recordset.map(ticket => ({
      id: ticket.id,
      ticketId: ticket.ticket_id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      ticketType: ticket.ticket_type,
      department: ticket.department,
      assignedTo: ticket.assigned_to,
      assignedToName: ticket.assigned_to_name,
      createdBy: ticket.created_by,
      createdByName: ticket.created_by_name,
      createdAt: ticket.created_at,
      updatedAt: ticket.updated_at,
      closedAt: ticket.closed_at
    }));

    res.json(tickets);
  } catch (error) {
    logger.error('Get tickets error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single ticket by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    // Get ticket details
    const ticketResult = await pool.request()
      .input('ticketId', id)
      .query(`
        SELECT 
          t.*,
          u1.name as created_by_name,
          u2.name as assigned_to_name
        FROM tickets t
        LEFT JOIN users u1 ON u1.email = t.created_by
        LEFT JOIN users u2 ON u2.email = t.assigned_to
        WHERE t.id = @ticketId
      `);

    if (ticketResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const ticket = ticketResult.recordset[0];

    // Get ticket notes
    const notesResult = await pool.request()
      .input('ticketId', id)
      .query(`
        SELECT 
          n.*,
          u.name as created_by_name
        FROM ticket_notes n
        LEFT JOIN users u ON u.email = n.created_by
        WHERE n.ticket_id = @ticketId
        ORDER BY n.created_at ASC
      `);

    const notes = notesResult.recordset.map(note => ({
      id: note.id,
      comment: note.comment,
      status: note.status,
      createdBy: note.created_by,
      createdByName: note.created_by_name,
      createdAt: note.created_at
    }));

    res.json({
      id: ticket.id,
      ticketId: ticket.ticket_id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      ticketType: ticket.ticket_type,
      department: ticket.department,
      assignedTo: ticket.assigned_to,
      assignedToName: ticket.assigned_to_name,
      createdBy: ticket.created_by,
      createdByName: ticket.created_by_name,
      createdAt: ticket.created_at,
      updatedAt: ticket.updated_at,
      closedAt: ticket.closed_at,
      notes: notes
    });
  } catch (error) {
    logger.error('Get ticket error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new ticket
router.post('/', [
  authenticateToken,
  body('title').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('priority').isIn(['P1', 'P2', 'P3', 'P4']),
  body('department').notEmpty(),
  body('ticketType').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      priority,
      department,
      assignedTo,
      ticketType,
      plannedStart,
      plannedEnd,
      requestedItem,
      justification,
      dueDate,
      responseETA,
      resolutionETA
    } = req.body;

    const pool = getPool();

    // Generate ticket ID
    const ticketIdResult = await pool.request()
      .query(`
        SELECT 
          CASE 
            WHEN @ticketType = 'Incident' THEN 'INC'
            WHEN @ticketType = 'Service Request' THEN 'SR'
            WHEN @ticketType = 'Change Request' THEN 'CHG'
            WHEN @ticketType = 'Problem' THEN 'PRB'
            WHEN @ticketType = 'Task' THEN 'TSK'
            ELSE 'TKT'
          END + '-' + FORMAT(GETDATE(), 'yyyy') + '-' + 
          RIGHT('000' + CAST(ISNULL(MAX(CAST(RIGHT(ticket_id, 3) AS INT)), 0) + 1 AS VARCHAR), 3) as next_id
        FROM tickets 
        WHERE ticket_id LIKE 
          CASE 
            WHEN @ticketType = 'Incident' THEN 'INC'
            WHEN @ticketType = 'Service Request' THEN 'SR'
            WHEN @ticketType = 'Change Request' THEN 'CHG'
            WHEN @ticketType = 'Problem' THEN 'PRB'
            WHEN @ticketType = 'Task' THEN 'TSK'
            ELSE 'TKT'
          END + '-' + FORMAT(GETDATE(), 'yyyy') + '-%'
      `)
      .input('ticketType', ticketType);

    const ticketId = ticketIdResult.recordset[0].next_id;

    // Insert ticket
    const result = await pool.request()
      .input('ticketId', ticketId)
      .input('title', title)
      .input('description', description)
      .input('priority', priority)
      .input('department', department)
      .input('assignedTo', assignedTo)
      .input('ticketType', ticketType)
      .input('createdBy', req.user.email)
      .input('plannedStart', plannedStart || null)
      .input('plannedEnd', plannedEnd || null)
      .input('requestedItem', requestedItem || null)
      .input('justification', justification || null)
      .input('dueDate', dueDate || null)
      .input('responseETA', responseETA || null)
      .input('resolutionETA', resolutionETA || null)
      .query(`
        INSERT INTO tickets (
          ticket_id, title, description, priority, department, assigned_to, 
          ticket_type, created_by, status, planned_start, planned_end,
          requested_item, justification, due_date, response_eta, resolution_eta,
          created_at, updated_at
        )
        OUTPUT INSERTED.id, INSERTED.ticket_id
        VALUES (
          @ticketId, @title, @description, @priority, @department, @assignedTo,
          @ticketType, @createdBy, 'Open', @plannedStart, @plannedEnd,
          @requestedItem, @justification, @dueDate, @responseETA, @resolutionETA,
          GETDATE(), GETDATE()
        )
      `);

    const newTicket = result.recordset[0];

    // Emit socket event for real-time updates
    req.io.emit('ticket_created', {
      id: newTicket.id,
      ticketId: newTicket.ticket_id,
      title,
      department,
      assignedTo,
      createdBy: req.user.email
    });

    logger.info(`Ticket created: ${newTicket.ticket_id} by ${req.user.email}`);

    res.status(201).json({
      id: newTicket.id,
      ticketId: newTicket.ticket_id,
      message: 'Ticket created successfully'
    });
  } catch (error) {
    logger.error('Create ticket error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update ticket
router.patch('/:id', [
  authenticateToken,
  body('status').optional().isIn(['Open', 'In Progress', 'Completed', 'Closed']),
  body('priority').optional().isIn(['P1', 'P2', 'P3', 'P4']),
  body('assignedTo').optional().isEmail(),
  body('department').optional().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status, priority, assignedTo, department } = req.body;
    const pool = getPool();

    // Build update query dynamically
    let updateFields = [];
    let request = pool.request().input('ticketId', id);

    if (status) {
      updateFields.push('status = @status');
      request.input('status', status);
      
      if (status === 'Closed') {
        updateFields.push('closed_at = GETDATE()');
      }
    }

    if (priority) {
      updateFields.push('priority = @priority');
      request.input('priority', priority);
    }

    if (assignedTo) {
      updateFields.push('assigned_to = @assignedTo');
      request.input('assignedTo', assignedTo);
    }

    if (department) {
      updateFields.push('department = @department');
      request.input('department', department);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updateFields.push('updated_at = GETDATE()');

    const query = `
      UPDATE tickets 
      SET ${updateFields.join(', ')}
      OUTPUT INSERTED.ticket_id, INSERTED.status
      WHERE id = @ticketId
    `;

    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const updatedTicket = result.recordset[0];

    // Emit socket event for real-time updates
    req.io.emit('ticket_updated', {
      id,
      ticketId: updatedTicket.ticket_id,
      status: updatedTicket.status,
      updatedBy: req.user.email
    });

    logger.info(`Ticket updated: ${updatedTicket.ticket_id} by ${req.user.email}`);

    res.json({ message: 'Ticket updated successfully' });
  } catch (error) {
    logger.error('Update ticket error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add note to ticket
router.post('/:id/notes', [
  authenticateToken,
  body('comment').notEmpty().trim(),
  body('status').optional().isIn(['Open', 'In Progress', 'Completed', 'Closed'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { comment, status } = req.body;
    const pool = getPool();

    // Insert note
    const result = await pool.request()
      .input('ticketId', id)
      .input('comment', comment)
      .input('status', status || null)
      .input('createdBy', req.user.email)
      .query(`
        INSERT INTO ticket_notes (ticket_id, comment, status, created_by, created_at)
        OUTPUT INSERTED.id
        VALUES (@ticketId, @comment, @status, @createdBy, GETDATE())
      `);

    // Update ticket status if provided
    if (status) {
      await pool.request()
        .input('ticketId', id)
        .input('status', status)
        .query(`
          UPDATE tickets 
          SET status = @status, updated_at = GETDATE()
          ${status === 'Closed' ? ', closed_at = GETDATE()' : ''}
          WHERE id = @ticketId
        `);
    }

    logger.info(`Note added to ticket ${id} by ${req.user.email}`);

    res.status(201).json({ 
      id: result.recordset[0].id,
      message: 'Note added successfully' 
    });
  } catch (error) {
    logger.error('Add note error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Dashboard endpoints
router.get('/dashboard/summary', authenticateToken, async (req, res) => {
  try {
    const { filterBy = 'all' } = req.query;
    const pool = getPool();
    
    let whereClause = '';
    const request = pool.request();
    
    if (filterBy === 'mine') {
      whereClause = 'WHERE (created_by = @userEmail OR assigned_to = @userEmail)';
      request.input('userEmail', req.user.email);
    }

    const result = await request.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status IN ('Open', 'In Progress') THEN 1 ELSE 0 END) as open,
        SUM(CASE WHEN status = 'Closed' THEN 1 ELSE 0 END) as closed
      FROM tickets ${whereClause}
    `);

    res.json(result.recordset[0]);
  } catch (error) {
    logger.error('Dashboard summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get metadata for dropdowns
router.get('/metadata/departments', authenticateToken, async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .query('SELECT DISTINCT department FROM users WHERE department IS NOT NULL ORDER BY department');
    
    const departments = result.recordset.map(row => row.department);
    res.json(departments);
  } catch (error) {
    logger.error('Get departments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/metadata/users', authenticateToken, async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .query(`
        SELECT name, email, department 
        FROM users 
        WHERE active = 1 
        ORDER BY name
      `);
    
    res.json(result.recordset);
  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;