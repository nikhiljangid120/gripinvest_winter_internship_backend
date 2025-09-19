const request = require('supertest');
const app = require('../src/app');
const { authenticateToken, signToken } = require('../src/config/jwt');
const pool = require('../src/config/database');

// Mock a test user/token
let testToken;

beforeAll(async () => {
  // Assume test user from auth seeds
  const testUser = { id: 'test-uuid', email: 'admin@example.com' }; // Replace with real from DB
  testToken = signToken(testUser);
});

describe('Products Tests', () => {
  test('GET /products - List products (auth required)', async () => {
    const res = await request(app)
      .get('/products')
      .set('Authorization', `Bearer ${testToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('products');
    expect(res.body.products.length).toBeGreaterThan(0);
  });

  test('POST /products - Create product (admin auth)', async () => {
    const newProduct = {
      name: 'Test Bond',
      investment_type: 'bond',
      tenure_months: 24,
      annual_yield: 7.00,
      risk_level: 'moderate',
      min_investment: 2000
    };
    const res = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${testToken}`)
      .send(newProduct);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  test('GET /health - Service health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
  });
});