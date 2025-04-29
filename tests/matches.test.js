const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Match = require('../models/Match');

// Sample test data
const dummyLostItemId = new mongoose.Types.ObjectId();
const dummyFoundItemId = new mongoose.Types.ObjectId();
const dummyLostUserId = new mongoose.Types.ObjectId();
const dummyFoundUserId = new mongoose.Types.ObjectId();

describe('Match API', () => {
  beforeAll(async () => {
    // Only connect if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/testdb', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  });

  beforeEach(async () => {
    await Match.deleteMany();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/matches', () => {
    it('should create a new match with all required fields', async () => {
      const matchData = {
        lostItemId: dummyLostItemId,
        foundItemId: dummyFoundItemId,
        lostUserId: dummyLostUserId,
        foundUserId: dummyFoundUserId,
        lostUserName: "Test Lost User",
        foundUserName: "Test Found User",
      };

      const res = await request(app)
        .post('/api/matches')
        .send(matchData);

      console.log('Response body:', res.body);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.lostItemId).toBe(dummyLostItemId.toString());
      expect(res.body.foundItemId).toBe(dummyFoundItemId.toString());
    });

    it('should return 400 when missing required fields', async () => {
      const invalidData = {
        lostItemId: dummyLostItemId,
        // Missing foundItemId, etc.
      };

      const res = await request(app)
        .post('/api/matches')
        .send(invalidData);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /api/matches', () => {
    it('should retrieve all matches', async () => {
      await Match.create({
        lostItemId: dummyLostItemId,
        foundItemId: dummyFoundItemId,
        lostUserId: dummyLostUserId,
        foundUserId: dummyFoundUserId,
        lostUserName: "Test User 1",
        foundUserName: "Test User 2",
      });

      const res = await request(app).get('/api/matches');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0]).toHaveProperty('lostItemId');
      expect(res.body[0]).toHaveProperty('foundItemId');
    });
  });
});
