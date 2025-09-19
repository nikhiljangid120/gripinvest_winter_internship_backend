// DB queries for products
const pool = require('../config/database');

// AI Mock: Generate description from fields (in real: call OpenAI)
const generateDescription = (product) => {
  const types = { bond: 'Secure', fd: 'Fixed deposit', mf: 'Mutual fund', etf: 'Exchange-traded fund', other: 'Alternative' };
  return `${types[product.investment_type]} investment offering ${product.annual_yield}% yield over ${product.tenure_months} months with ${product.risk_level} risk.`;
};

// AI Mock: Recommend products by risk/yield match
const recommendProducts = (products, userRisk) => {
  return products
    .filter(p => p.risk_level === userRisk)
    .sort((a, b) => b.annual_yield - a.annual_yield)
    .slice(0, 3);
};

const createProduct = async (productData) => {
  productData.description = generateDescription(productData); // AI integration
  const [result] = await pool.execute(
    'INSERT INTO investment_products SET ?',
    [productData]
  );
  return result.insertId;
};

const getAllProducts = async () => {
  const [rows] = await pool.execute('SELECT * FROM investment_products');
  return rows;
};

const getProductById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM investment_products WHERE id = ?', [id]);
  return rows[0];
};

const updateProduct = async (id, updates) => {
  if (updates.description === undefined) updates.description = generateDescription(updates);
  await pool.execute('UPDATE investment_products SET ? WHERE id = ?', [updates, id]);
};

const deleteProduct = async (id) => {
  await pool.execute('DELETE FROM investment_products WHERE id = ?', [id]);
};

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, recommendProducts };