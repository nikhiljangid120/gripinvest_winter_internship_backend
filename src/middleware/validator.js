// Input validation with Joi - Prevents bad data
const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

const signupSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  risk_appetite: Joi.string().valid('low', 'moderate', 'high').default('moderate')
});

const productSchema = Joi.object({
  name: Joi.string().required(),
  investment_type: Joi.string().valid('bond', 'fd', 'mf', 'etf', 'other').required(),
  tenure_months: Joi.number().integer().min(1).required(),
  annual_yield: Joi.number().precision(2).min(0).required(),
  risk_level: Joi.string().valid('low', 'moderate', 'high').required(),
  min_investment: Joi.number().precision(2).min(0).default(1000),
  max_investment: Joi.number().precision(2).min(0).allow(null),
  description: Joi.string().allow('')
});

const investmentSchema = Joi.object({
  product_id: Joi.string().required(),
  amount: Joi.number().precision(2).min(0).required()
});

module.exports = { validate, signupSchema, productSchema, investmentSchema };