// Unit tests with Jest + Supertest
const request = require('supertest');
const app = require('../app');
const pool = require('../config/database');
const bcrypt = require('bcryptjs');

describe('Auth Tests', () => {
  beforeAll(async () => {
    // Seed test user
    const hashed = await bcrypt.hash('password123', 10);
    await pool.execute('INSERT INTO users (id, first_name, email, password_hash) VALUES (UUID(), "Test", "test@example.com", ?)', [hashed]);
  });

  afterAll(async () => {
    await pool.execute('DELETE FROM users WHERE email = "test@example.com"');
  });

  test('POST /auth/signup - Valid signup', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({ first_name: 'New', email: 'new@example.com', password: 'StrongPass1!' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /auth/login - Valid login', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /auth/login - Invalid credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'wrong' });
    expect(res.status).toBe(401);
  });
});