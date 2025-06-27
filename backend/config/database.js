const sql = require('mssql');
const logger = require('../utils/logger');

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: true, // Use encryption for Azure SQL
    trustServerCertificate: false,
    enableArithAbort: true,
    requestTimeout: 30000,
    connectionTimeout: 30000,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool;

const connectDB = async () => {
  try {
    if (pool) {
      return pool;
    }
    
    pool = await sql.connect(config);
    logger.info('✅ Connected to Azure SQL Database');
    
    // Test the connection
    const result = await pool.request().query('SELECT 1 as test');
    logger.info('✅ Database connection test successful');
    
    return pool;
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    throw error;
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error('Database not connected. Call connectDB() first.');
  }
  return pool;
};

const closeDB = async () => {
  try {
    if (pool) {
      await pool.close();
      pool = null;
      logger.info('✅ Database connection closed');
    }
  } catch (error) {
    logger.error('❌ Error closing database connection:', error);
  }
};

module.exports = {
  connectDB,
  getPool,
  closeDB,
  sql
};