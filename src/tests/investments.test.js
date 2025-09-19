const request = require('supertest');
const app = require('../src/app');

describe('Investments Tests', () => {
  // Assume logged-in token from beforeAll in other tests
  test('POST /investments - Invest (valid)', async () => {
    // Get token first (or mock)
    const loginRes = await request(app).post('/auth/login').send({ email: 'john@example.com', password: 'password123' });
    const token = loginRes.body.token;
    const res = await request(app)
      .post('/investments')
      .set('Authorization', `Bearer ${token}`)
      .send({ product_id: 'govt-bond-uuid', amount: 5000 }); // Use real UUID from seeds
    expect(res.status).toBe(201);
  });

  test('GET /investments/portfolio - Fetch portfolio', async () => {
    // Similar auth
    const res = await request(app)
      .get('/investments/portfolio')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('insights');
  });
});