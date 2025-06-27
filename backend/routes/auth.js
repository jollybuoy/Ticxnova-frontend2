const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { getPool } = require('../config/database');
const logger = require('../utils/logger');

const router = express.Router();

// Login endpoint
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const pool = getPool();

    // Check if user exists
    const userResult = await pool.request()
      .input('email', email)
      .query('SELECT id, email, name, password_hash, role, department, active FROM users WHERE email = @email');

    if (userResult.recordset.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userResult.recordset[0];

    if (!user.active) {
      return res.status(401).json({ error: 'Account is disabled' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        name: user.name,
        role: user.role,
        department: user.department
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Update last login
    await pool.request()
      .input('userId', user.id)
      .query('UPDATE users SET last_login = GETDATE(), last_activity = GETDATE() WHERE id = @userId');

    logger.info(`User logged in: ${user.email}`);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Microsoft login endpoint
router.post('/microsoft-login', [
  body('email').isEmail().normalizeEmail(),
  body('name').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, name, designation, department } = req.body;
    const pool = getPool();

    // Check if user exists
    let userResult = await pool.request()
      .input('email', email)
      .query('SELECT id, email, name, role, department, active FROM users WHERE email = @email');

    let user;
    if (userResult.recordset.length === 0) {
      // Create new user
      const insertResult = await pool.request()
        .input('email', email)
        .input('name', name)
        .input('designation', designation || 'User')
        .input('department', department || 'General')
        .input('role', 'user')
        .input('auth_provider', 'microsoft')
        .query(`
          INSERT INTO users (email, name, designation, department, role, auth_provider, active, created_at)
          OUTPUT INSERTED.id, INSERTED.email, INSERTED.name, INSERTED.role, INSERTED.department
          VALUES (@email, @name, @designation, @department, @role, @auth_provider, 1, GETDATE())
        `);
      
      user = insertResult.recordset[0];
      logger.info(`New Microsoft user created: ${email}`);
    } else {
      user = userResult.recordset[0];
      
      if (!user.active) {
        return res.status(401).json({ error: 'Account is disabled' });
      }

      // Update user info and last login
      await pool.request()
        .input('userId', user.id)
        .input('name', name)
        .input('designation', designation)
        .input('department', department)
        .query(`
          UPDATE users 
          SET name = @name, designation = @designation, department = @department, 
              last_login = GETDATE(), last_activity = GETDATE()
          WHERE id = @userId
        `);
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        name: user.name,
        role: user.role,
        department: user.department
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    logger.error('Microsoft login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register endpoint (for demo purposes)
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, department = 'General' } = req.body;
    const pool = getPool();

    // Check if user already exists
    const existingUser = await pool.request()
      .input('email', email)
      .query('SELECT id FROM users WHERE email = @email');

    if (existingUser.recordset.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await pool.request()
      .input('email', email)
      .input('name', name)
      .input('passwordHash', passwordHash)
      .input('department', department)
      .input('role', 'user')
      .query(`
        INSERT INTO users (email, name, password_hash, department, role, active, created_at)
        OUTPUT INSERTED.id, INSERTED.email, INSERTED.name, INSERTED.role, INSERTED.department
        VALUES (@email, @name, @passwordHash, @department, @role, 1, GETDATE())
      `);

    const user = result.recordset[0];

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        name: user.name,
        role: user.role,
        department: user.department
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;