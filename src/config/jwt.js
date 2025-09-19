// JWT config - Use a strong secret in .env
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'your-super-secret-key-change-me';
const expiresIn = '7d'; // Token expiry

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user; // Attach user to req
    next();
  });
};

// Admin check (mock: email starts with 'admin')
const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.email.startsWith('admin')) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

module.exports = { authenticateToken, isAdmin, signToken: (user) => jwt.sign(user, secret, { expiresIn }) };