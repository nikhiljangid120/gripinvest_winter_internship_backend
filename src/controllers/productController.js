// Products business logic
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, recommendProducts } = require('../models/productModel');

const create = async (req, res) => {
  try {
    const id = await createProduct({ id: require('uuid').v4(), ...req.body });
    res.status(201).json({ id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const list = async (req, res) => {
  try {
    const products = await getAllProducts();
    const recs = recommendProducts(products, req.query.risk || 'moderate'); // AI: Query param for user risk
    res.json({ products, recommendations: recs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    await updateProduct(req.params.id, { ...req.body, id: undefined });
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    await deleteProduct(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(404).json({ error: 'Not found' });
  }
};

module.exports = { create, list, getOne, update, remove };