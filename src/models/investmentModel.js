// DB queries for investments
const pool = require('../config/database');

// Mock user balance (in real: add balance field to users)
const getUserBalance = async (userId) => 100000.00; // Placeholder

// AI Mock: Portfolio insights (risk distro, etc.)
const generateInsights = (investments) => {
  const total = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const riskDist = investments.reduce((acc, inv) => {
    acc[inv.risk_level] = (acc[inv.risk_level] || 0) + inv.amount;
    return acc;
  }, {});
  return {
    totalValue: total,
    riskDistribution: riskDist,
    avgYield: investments.length ? investments.reduce((sum, inv) => sum + (inv.amount * inv.yield / 100), 0) / total : 0,
    suggestion: total > 50000 ? 'Diversify more!' : 'Start small and build.'
  };
};

const createInvestment = async (investmentData, userId) => {
  const product = await require('./productModel').getProductById(investmentData.product_id);
  if (!product) throw new Error('Product not found');
  if (investmentData.amount < product.min_investment || (product.max_investment && investmentData.amount > product.max_investment)) {
    throw new Error('Amount out of range');
  }
  const balance = await getUserBalance(userId);
  if (investmentData.amount > balance) throw new Error('Insufficient balance');

  const expectedReturn = investmentData.amount * (product.annual_yield / 100) * (product.tenure_months / 12);
  const maturityDate = new Date();
  maturityDate.setMonth(maturityDate.getMonth() + product.tenure_months);

  const [result] = await pool.execute(
    'INSERT INTO investments (user_id, product_id, amount, expected_return, maturity_date) VALUES (?, ?, ?, ?, ?)',
    [userId, investmentData.product_id, investmentData.amount, expectedReturn, maturityDate]
  );
  return result.insertId;
};

const getUserPortfolio = async (userId) => {
  const [rows] = await pool.execute(`
    SELECT i.*, p.name, p.annual_yield, p.risk_level 
    FROM investments i 
    JOIN investment_products p ON i.product_id = p.id 
    WHERE i.user_id = ? AND i.status = 'active'
  `, [userId]);
  return { investments: rows, insights: generateInsights(rows) };
};

module.exports = { createInvestment, getUserPortfolio };