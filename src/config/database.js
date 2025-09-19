// Database connection setup - Keep credentials in .env for security
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: 'grip_invest',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection on startup
pool.getConnection().then(conn => {
  console.log('✅ MySQL connected');
  conn.release();
}).catch(err => console.error('❌ DB connection failed:', err));

module.exports = pool;