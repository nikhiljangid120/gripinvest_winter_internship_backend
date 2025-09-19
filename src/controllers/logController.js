// Logs business logic
const { getLogsByUser } = require('../models/logModel');

const getLogs = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const data = await getLogsByUser(userId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getLogs };