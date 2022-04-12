import supertest from 'supertest';
import app from '../src/app';
import { connect, disconnect } from './db';
import seedUsers from './seeds/users';

const request = supertest(app);

describe('Test Refresh Token Endpoint', () => {
  beforeAll(async () => {
    await connect();
    await seedUsers();
  });

  afterAll(async () => {
    await disconnect();
  });

  describe('given no payload', () => {
    test('should respond with an error', async () => {
      const response = await request.post('/users/refreshToken').send({});

      expect(response.statusCode).toBe(400);
      expect(response.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('given valid payload', () => {
    test('should respond with valid token', async () => {
      const response = await request
        .post('/users/refreshToken')
        .send({ email: 'admin@admin.pl', password: 'admin' });

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
      expect(response.body.token).toBeDefined();
      expect(response.body.expiresAt).toBeDefined();
    });
  });
});
