// Logs every API call to transaction_logs - Called after response
const pool = require('../config/database');

const logTransaction = async (req, res, next) => {
  const { method, path } = req;
  const userId = req.user?.id || null;
  const email = req.user?.email || req.body.email || null; // Fallback for public endpoints
  const startTime = new Date();

  // Proxy to log after response
  const originalSend = res.send;
  res.send = function (body) {
    const statusCode = res.statusCode;
    const errorMessage = statusCode >= 400 ? (body.error || 'Unknown error') : null;
    const endTime = new Date();
    const duration = endTime - startTime;

    // Insert log
    pool.execute(
      'INSERT INTO transaction_logs (user_id, email, endpoint, http_method, status_code, error_message) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, email, path, method, statusCode, errorMessage]
    ).catch(err => console.error('Log error:', err)); // Fire-and-forget

    return originalSend.call(this, body);
  };

  next();
};

module.exports = logTransaction;