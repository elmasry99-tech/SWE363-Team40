import test, { after, before, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { connectDB, disconnectDB } from '../db.js';
import { createApp } from '../server.js';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
import Room from '../models/Room.js';
import Message from '../models/Message.js';

let mongoServer;
let app;

process.env.JWT_SECRET = 'test-secret';

function createToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
      orgId: user.orgId ? user.orgId.toString() : null,
      name: user.name,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '8h' },
  );
}

async function createUser(overrides = {}) {
  const passwordHash = await bcrypt.hash(overrides.password || 'Password#123', 12);
  return User.create({
    name: overrides.name || 'Test User',
    email: overrides.email || `user-${Date.now()}@example.com`,
    passwordHash,
    role: overrides.role || 'general',
    orgId: overrides.orgId || null,
    status: overrides.status || 'active',
    publicKey: overrides.publicKey || null,
  });
}

before(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  await connectDB();
  app = createApp();
});

beforeEach(async () => {
  await Promise.all(
    Object.values(mongoose.connection.collections).map((collection) => collection.deleteMany({})),
  );
});

after(async () => {
  await disconnectDB();
  if (mongoServer) await mongoServer.stop();
});

test('auth signup validates email and requires orgId for internal users', async () => {
  const invalidEmail = await request(app)
    .post('/auth/signup')
    .send({
      name: 'Belal',
      email: 'not-an-email',
      password: 'Password#123',
      role: 'general',
    });

  assert.equal(invalidEmail.status, 400);

  const missingOrg = await request(app)
    .post('/auth/signup')
    .send({
      name: 'Belal',
      email: 'belal@example.com',
      password: 'Password#123',
      role: 'internal',
    });

  assert.equal(missingOrg.status, 400);
});

test('auth signup/login handles pending internal users and active general users', async () => {
  const organization = await Organization.create({ name: 'Northstar Legal' });

  const pendingSignup = await request(app)
    .post('/auth/signup')
    .send({
      name: 'Internal User',
      email: 'internal@example.com',
      password: 'Password#123',
      role: 'internal',
      orgId: organization._id.toString(),
    });

  assert.equal(pendingSignup.status, 201);
  assert.equal(pendingSignup.body.status, 'pending');

  const blockedLogin = await request(app)
    .post('/auth/login')
    .send({ email: 'internal@example.com', password: 'Password#123' });

  assert.equal(blockedLogin.status, 403);

  const generalSignup = await request(app)
    .post('/auth/signup')
    .send({
      name: 'General User',
      email: 'general@example.com',
      password: 'Password#123',
      role: 'general',
    });

  assert.equal(generalSignup.status, 201);

  const generalLogin = await request(app)
    .post('/auth/login')
    .send({ email: 'general@example.com', password: 'Password#123' });

  assert.equal(generalLogin.status, 200);
  assert.ok(generalLogin.body.token);
});

test('admin organization APIs create, list, and update organizations with validation', async () => {
  const admin = await createUser({ role: 'admin', email: 'admin@example.com' });
  const token = createToken(admin);

  const invalidCreate = await request(app)
    .post('/orgs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Acme',
      officer: {
        name: 'Officer',
        email: 'bad-email',
        password: 'weak',
      },
    });

  assert.equal(invalidCreate.status, 400);

  const createResponse = await request(app)
    .post('/orgs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Acme',
      status: 'active',
      policies: {
        retentionDays: 90,
        sessionExpiry: 30,
        messageRateLimit: 200,
        fileSharing: true,
      },
      officer: {
        name: 'Officer One',
        email: 'officer@acme.com',
        password: 'Password#123',
      },
    });

  assert.equal(createResponse.status, 201);
  assert.equal(createResponse.body.organization.name, 'Acme');
  assert.equal(createResponse.body.officer.status, 'active');

  const listResponse = await request(app)
    .get('/orgs')
    .set('Authorization', `Bearer ${token}`);

  assert.equal(listResponse.status, 200);
  assert.equal(listResponse.body.organizations.length, 1);

  const orgId = createResponse.body.organization._id;
  const updateResponse = await request(app)
    .patch(`/orgs/${orgId}`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      status: 'suspended',
      policies: {
        retentionDays: 120,
      },
    });

  assert.equal(updateResponse.status, 200);
  assert.equal(updateResponse.body.organization.status, 'suspended');
  assert.equal(updateResponse.body.organization.policies.retentionDays, 120);
});

test('room and message APIs support create, join, admit, and history flows', async () => {
  const organization = await Organization.create({ name: 'Secure Org' });
  const host = await createUser({ role: 'internal', orgId: organization._id, email: 'host@example.com' });
  const guest = await createUser({ role: 'guest', orgId: organization._id, email: 'guest@example.com' });
  const hostToken = createToken(host);
  const guestToken = createToken(guest);

  const roomResponse = await request(app)
    .post('/rooms')
    .set('Authorization', `Bearer ${hostToken}`)
    .send({ name: 'Review Room', orgId: organization._id.toString() });

  assert.equal(roomResponse.status, 201);
  const roomId = roomResponse.body.room.id;
  const roomCode = roomResponse.body.room.code;

  const invalidRoomLookup = await request(app)
    .get('/rooms/not-a-real-id')
    .set('Authorization', `Bearer ${hostToken}`);

  assert.equal(invalidRoomLookup.status, 400);

  const joinResponse = await request(app)
    .post('/rooms/join')
    .set('Authorization', `Bearer ${guestToken}`)
    .send({ code: roomCode });

  assert.equal(joinResponse.status, 200);

  const admitResponse = await request(app)
    .post(`/rooms/${roomId}/admit`)
    .set('Authorization', `Bearer ${hostToken}`)
    .send({ userId: guest._id.toString(), status: 'admitted' });

  assert.equal(admitResponse.status, 200);

  const messageResponse = await request(app)
    .post('/messages')
    .set('Authorization', `Bearer ${hostToken}`)
    .send({ roomId, content: 'Hello room', type: 'text' });

  assert.equal(messageResponse.status, 201);

  const historyResponse = await request(app)
    .get(`/messages/${roomId}?limit=10`)
    .set('Authorization', `Bearer ${guestToken}`);

  assert.equal(historyResponse.status, 200);
  assert.equal(historyResponse.body.messages.length, 1);
  assert.equal(historyResponse.body.messages[0].content, 'Hello room');
});

test('file and user APIs handle upload, public keys, and status changes', async () => {
  const organization = await Organization.create({ name: 'File Org' });
  const admin = await createUser({ role: 'admin', email: 'sysadmin@example.com' });
  const host = await createUser({ role: 'internal', orgId: organization._id, email: 'host2@example.com', publicKey: 'PUBKEY123' });
  const target = await createUser({ role: 'internal', orgId: organization._id, email: 'target@example.com', status: 'pending' });
  const adminToken = createToken(admin);
  const hostToken = createToken(host);

  const room = await Room.create({
    code: 'CN-TEST01',
    name: 'Files',
    orgId: organization._id,
    hostId: host._id,
    participants: [{ userId: host._id, name: host.name, role: 'host', status: 'admitted' }],
  });

  const uploadResponse = await request(app)
    .post('/files/upload')
    .set('Authorization', `Bearer ${hostToken}`)
    .field('roomId', room._id.toString())
    .attach('file', Buffer.from('%PDF-1.4 test'), { filename: 'brief.pdf', contentType: 'application/pdf' });

  assert.equal(uploadResponse.status, 201);
  assert.ok(uploadResponse.body.file._id);

  const saveKeyResponse = await request(app)
    .post('/users/me/public-key')
    .set('Authorization', `Bearer ${hostToken}`)
    .send({ publicKey: 'UPDATED_PUBLIC_KEY' });

  assert.equal(saveKeyResponse.status, 200);

  const fetchKeyResponse = await request(app)
    .get(`/users/${host._id.toString()}/public-key`)
    .set('Authorization', `Bearer ${hostToken}`);

  assert.equal(fetchKeyResponse.status, 200);
  assert.equal(fetchKeyResponse.body.publicKey, 'UPDATED_PUBLIC_KEY');

  const statusResponse = await request(app)
    .patch(`/users/${target._id.toString()}/status`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ status: 'active' });

  assert.equal(statusResponse.status, 200);
  assert.equal(statusResponse.body.user.status, 'active');

  const allUsersResponse = await request(app)
    .get('/users')
    .set('Authorization', `Bearer ${adminToken}`);

  assert.equal(allUsersResponse.status, 200);
  assert.equal(allUsersResponse.body.users.length, 3);
});
