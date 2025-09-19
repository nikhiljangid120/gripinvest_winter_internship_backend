// Investments routes
const express = require('express');
const { invest, portfolio } = require('../controllers/investmentController');
const { authenticateToken } = require('../config/jwt');
const { validate, investmentSchema } = require('../middleware/validator');
router.get('/portfolio', authenticateToken, investmentController.getPortfolio);
const logTransaction = require('../middleware/logger');

const router = express.Router();

router.use(authenticateToken);
router.use(logTransaction);

router.post('/', validate(investmentSchema), invest);
router.get('/portfolio', portfolio);

module.exports = router;