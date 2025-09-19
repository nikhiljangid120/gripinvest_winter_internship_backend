const request = require('supertest');
const app = require('../src/app');

describe('Logs Tests', () => {
  test('GET /logs - Fetch logs (auth + query)', async () => {
    const res = await request(app)
      .get('/logs?userId=test-uuid') // Use real user ID
      .set('Authorization', `Bearer ${testToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('summary');
  });
});