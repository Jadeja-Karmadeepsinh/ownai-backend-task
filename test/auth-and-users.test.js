const path = require('path');
const fs = require('fs');
const request = require('supertest');
const { expect } = require('chai');

process.env.NODE_ENV = 'test';
process.env.DB_PATH = path.join(__dirname, '..', 'data', 'test.sqlite');
process.env.JWT_SECRET = 'test_secret';

const app = require('../src/app');
const { AppDataSource } = require('../src/data-source');

describe('Auth and Users API', function () {
  this.timeout(10000);

  before(async () => {
    const dbDir = path.dirname(process.env.DB_PATH);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    if (fs.existsSync(process.env.DB_PATH)) {
      fs.unlinkSync(process.env.DB_PATH);
    }

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const runner = AppDataSource.createQueryRunner();
    await runner.query(`
      CREATE TABLE "users" (
        "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "name" varchar(255) NOT NULL,
        "email" varchar(255) NOT NULL UNIQUE,
        "password" varchar(255) NOT NULL,
        "role" varchar(20) NOT NULL,
        "phone" varchar(50),
        "city" varchar(100),
        "country" varchar(100),
        "createdAt" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await runner.release();
  });

  after(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    if (fs.existsSync(process.env.DB_PATH)) {
      fs.unlinkSync(process.env.DB_PATH);
    }
  });

  let adminToken;
  let staffToken;
  let staffId;

  it('should register an admin user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
        phone: '1234567890',
        city: 'AdminCity',
        country: 'AdminCountry'
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
    expect(res.body.email).to.equal('admin@example.com');
  });

  it('should login as admin', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'password123'
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
    adminToken = res.body.token;
  });

  it('should register a staff user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Staff User',
        email: 'staff@example.com',
        password: 'password123',
        role: 'staff',
        phone: '9999999999',
        city: 'StaffCity',
        country: 'StaffCountry'
      });

    expect(res.status).to.equal(201);
    staffId = res.body.id;
  });

  it('should login as staff', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'staff@example.com',
        password: 'password123'
      });

    expect(res.status).to.equal(200);
    staffToken = res.body.token;
  });

  it('should allow admin to list users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.at.least(2);
  });

  it('should allow admin to filter users by country', async () => {
    const res = await request(app)
      .get('/api/users')
      .query({ country: 'StaffCountry' })
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body[0].country).to.equal('StaffCountry');
  });

  it('should allow admin to search users by email', async () => {
    const res = await request(app)
      .get('/api/users')
      .query({ search: 'staff@example.com' })
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body[0].email).to.equal('staff@example.com');
  });

  it('should forbid staff from listing all users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${staffToken}`);

    expect(res.status).to.equal(403);
  });

  it('should allow staff to view only their own details', async () => {
    const res = await request(app)
      .get(`/api/users/${staffId}`)
      .set('Authorization', `Bearer ${staffToken}`);

    expect(res.status).to.equal(200);
    expect(res.body.email).to.equal('staff@example.com');
  });

  it('should forbid staff from viewing another user details', async () => {
    const res = await request(app)
      .get('/api/users/1')
      .set('Authorization', `Bearer ${staffToken}`);

    // 1 is admin id in this test, staff should not be able to see it
    if (staffId === 1) {
      // In case auto increment starts differently; this ensures the test remains meaningful
      expect(res.status).to.be.oneOf([403, 200]);
    } else {
      expect(res.status).to.equal(403);
    }
  });
});

