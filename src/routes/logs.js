// Logs routes
const express = require('express');
const { getLogs } = require('../controllers/logController');
const { authenticateToken } = require('../config/jwt');
const logTransaction = require('../middleware/logger');

const router = express.Router();

router.use(authenticateToken);
router.use(logTransaction);

router.get('/', getLogs);

module.exports = router;