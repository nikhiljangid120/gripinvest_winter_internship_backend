// Products routes - CRUD with auth/admin
const express = require('express');
const { create, list, getOne, update, remove } = require('../controllers/productController');
const { authenticateToken, isAdmin } = require('../config/jwt');
const { validate, productSchema } = require('../middleware/validator');
const logTransaction = require('../middleware/logger');

const router = express.Router();

router.use(authenticateToken); // All protected
router.use(logTransaction);

router.get('/', list);
router.get('/:id', getOne);

router.post('/', isAdmin, validate(productSchema), create);
router.put('/:id', isAdmin, validate(productSchema), update);
router.delete('/:id', isAdmin, remove);

module.exports = router;