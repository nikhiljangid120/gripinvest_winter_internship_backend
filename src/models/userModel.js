// DB queries for users - Keep queries simple and parameterized to avoid SQL injection
const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const createUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const [result] = await pool.execute(
    'INSERT INTO users (first_name, last_name, email, password_hash, risk_appetite) VALUES (?, ?, ?, ?, ?)',
    [userData.first_name, userData.last_name, userData.email, hashedPassword, userData.risk_appetite]
  );
  return result.insertId;
};

const findUserByEmail = async (email) => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

const comparePassword = async (password, hash) => bcrypt.compare(password, hash);

module.exports = { createUser, findUserByEmail, comparePassword };