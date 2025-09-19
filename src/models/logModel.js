// DB queries for logs
const pool = require('../config/database');

// AI Mock: Summarize errors (group by type)
const summarizeErrors = (logs) => {
  const errors = logs.filter(log => log.error_message).reduce((acc, log) => {
    const type = log.error_message.includes('balance') ? 'balance' : 'other';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  return { summary: errors, total: logs.length, suggestion: Object.keys(errors).length > 1 ? 'Review frequent balance issues' : 'All good!' };
};

const getLogsByUser = async (userIdOrEmail) => {
  const [rows] = await pool.execute(
    'SELECT * FROM transaction_logs WHERE user_id = ? OR email = ? ORDER BY created_at DESC',
    [userIdOrEmail, userIdOrEmail]
  );
  return { logs: rows, summary: summarizeErrors(rows) };
};

module.exports = { getLogsByUser };