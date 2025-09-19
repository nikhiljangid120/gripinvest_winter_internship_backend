// Investments business logic
const { createInvestment, getUserPortfolio } = require('../models/investmentModel');
const { getProductById } = require('../models/productModel');

const invest = async (req, res) => {
  try {
    const investmentId = await createInvestment(req.body, req.user.id);
    res.status(201).json({ id: investmentId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const portfolio = async (req, res) => {
  try {
    const portfolio = await getUserPortfolio(req.user.id);
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { invest, portfolio };