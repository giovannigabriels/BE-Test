const request = require('supertest');
const app = require('../../server'); // Mengimpor instance Express dari server.js
const db = require('../models');
const jwt = require('../utils/jwt');

describe('API Authentication and Authorization Tests', () => {
  let adminToken, userToken, user;

  beforeAll(async () => {
    try {
      // Mock data untuk user dan admin tanpa menentukan ID secara manual
      user = await db.sequelize.query(
        `
        INSERT INTO "users" ("digits", "isLogin", "createdAt", "updatedAt") 
        VALUES (:digits, false, NOW(), NOW()) RETURNING "id", "digits"
        `,
        {
          replacements: { digits: '123456' },
          type: db.Sequelize.QueryTypes.INSERT,
        }
      );

      const admin = await db.sequelize.query(
        `
        INSERT INTO "users" ("digits", "positionTitle", "createdAt", "updatedAt") 
        VALUES (:digits, :positionTitle, NOW(), NOW()) RETURNING "id"
        `,
        {
          replacements: { digits: 'admin123', positionTitle: 'admin' },
          type: db.Sequelize.QueryTypes.INSERT,
        }
      );

      const normalUser = await db.sequelize.query(
        `
        INSERT INTO "users" ("digits", "positionTitle", "createdAt", "updatedAt") 
        VALUES (:digits, :positionTitle, NOW(), NOW()) RETURNING "id"
        `,
        {
          replacements: { digits: 'user123', positionTitle: 'user' },
          type: db.Sequelize.QueryTypes.INSERT,
        }
      );

      // Generate JWT token untuk admin dan user
      adminToken = jwt.generateToken({ id: admin[0][0].id });
      userToken = jwt.generateToken({ id: normalUser[0][0].id });
    } catch (error) {
      console.error("Error in beforeAll: ", error);
    }
  });

  afterAll(async () => {
    try {
      // Hapus data setelah test selesai
      await db.sequelize.query('DELETE FROM "users" WHERE "digits" IN (:digits)', {
        replacements: { digits: ['123456', 'admin123', 'user123'] },
        type: db.Sequelize.QueryTypes.DELETE,
      });
      await db.sequelize.close();
    } catch (error) {
      console.error("Error in afterAll: ", error);
    }
  });

  // Auth Tests
  describe('POST /api/auth/login', () => {
    it('should login successfully and return a token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ digits: '123456' });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();

      // Verify that the user is updated to isLogin = true
      const [updatedUser] = await db.sequelize.query(
        'SELECT "isLogin" FROM "users" WHERE "id" = :id',
        {
          replacements: { id: user[0][0].id },
          type: db.Sequelize.QueryTypes.SELECT,
        }
      );

      expect(updatedUser.isLogin).toBe(true);
    });

    it('should fail to login if digits are wrong', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ digits: 'wrongdigits' });

      expect(res.statusCode).toEqual(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toEqual('wrong digits');
    });
  });

  // GetData Tests
  describe('GET /api/data/getdata', () => {
    it('should return 200 for authorized admin', async () => {
      const res = await request(app)
        .get('/api/data/getdata')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
    });

    it('should return 403 for non-admin user', async () => {
      const res = await request(app)
        .get('/api/data/getdata')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toEqual('Forbidden Access');
    });

    it('should return 401 for missing or invalid token', async () => {
      const res = await request(app)
        .get('/api/data/getdata');

      expect(res.statusCode).toEqual(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toEqual('Unauthorized');
    });
  });
});
