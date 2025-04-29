const request = require('supertest');
const app = require('../server'); // <-- Assuming your Express app is exported
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

let token = "";
let createdUserId = "";

beforeAll(async () => {
  // Connect MongoDB
  if (process.env.NODE_ENV !== 'test') {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/testdb');
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth Routes', () => {

  const testUser = {
    name: "Test User",
    email: "testuser@example.com",
    password: "Password123",
    role: "user"
  };

  beforeEach(async () => {
    await User.deleteMany({ email: testUser.email });
  });

  test('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.msg).toBe("User registered successfully!");
  });

  test('should not register the same user again', async () => {
    await new User({
      name: testUser.name,
      email: testUser.email,
      password: testUser.password,
      role: testUser.role
    }).save();

    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("User already exists");
  });

  test('should login an existing user', async () => {
    const passwordHash = await bcrypt.hash(testUser.password, 10);

    const user = new User({
      name: testUser.name,
      email: testUser.email,
      password: passwordHash,
      role: testUser.role
    });
    await user.save();
    createdUserId = user._id; // Save the ID to use later

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(testUser.email);

    token = res.body.token;
  });

  test('should fail login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: "WrongPassword123" });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Invalid credentials");
  });

  test('should get user info after login', async () => {
    const res = await request(app)
      .get(`/api/auth/user/${createdUserId}`); // using saved user ID!

    expect(res.statusCode).toBe(404);

  });

});
