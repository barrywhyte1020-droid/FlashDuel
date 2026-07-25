const request = require('supertest');
const app = require('../src/app');

describe('GET /api/health', () => {
  test('responds ok without needing a database connection', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', service: 'flashduel-api' });
  });
});

describe('unknown routes', () => {
  test('returns 404 with a JSON error body', async () => {
    const res = await request(app).get('/api/not-a-real-route');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Not found' });
  });
});

describe('POST /api/auth/register — input validation', () => {
  test('rejects a request missing required fields before touching the database', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'a@b.com' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/required/i);
  });
});

describe('protected deck routes', () => {
  test('reject requests with no auth token', async () => {
    const res = await request(app).get('/api/decks');
    expect(res.status).toBe(401);
  });

  test('reject requests with a malformed auth token', async () => {
    const res = await request(app).get('/api/decks').set('Authorization', 'Bearer not-a-real-token');
    expect(res.status).toBe(401);
  });
});
