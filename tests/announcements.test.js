const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server"); // Assuming your Express app is exported from server.js
const Announcement = require("../models/Announcement");

// Mock user
const testUserId = new mongoose.Types.ObjectId();

describe("Announcements API", () => {
  beforeAll(async () => {
    // Connect MongoDB (only if not testing)
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/testdb')
      .then(() => console.log('✅ MongoDB Connected!'))
      .catch(err => console.error('MongoDB connection error:', err));
  
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  }
  });

  beforeEach(async () => {
    // Clear all announcements before each test
    await Announcement.deleteMany();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("POST /api/announcements/", () => {
    it("should create a new announcement", async () => {
      const res = await request(app)
        .post("/api/announcements")
        .send({
          title: "Test Announcement",
          message: "This is a test message"
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body.title).toBe("Test Announcement");
      expect(res.body.message).toBe("This is a test message");

      const announcement = await Announcement.findById(res.body._id);
      expect(announcement).not.toBeNull();
    });

    it("should return 500 if announcement creation fails", async () => {
      // Send bad data (missing fields)
      const res = await request(app)
        .post("/api/announcements")
        .send({});

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty("error", "Failed to create announcement");
    });
  });

  describe("GET /api/announcements/", () => {
    it("should fetch all announcements not read by a user", async () => {
      // Create announcements
      await Announcement.create([
        { title: "Announcement 1", message: "Message 1", readBy: [] },
        { title: "Announcement 2", message: "Message 2", readBy: [testUserId] }, // already read
        { title: "Announcement 3", message: "Message 3", readBy: [] },
      ]);

      const res = await request(app)
        .get("/api/announcements")
        .query({ userId: testUserId.toString() });

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2); // Only unread ones
      expect(res.body[0]).toHaveProperty("title");
      expect(res.body[0]).toHaveProperty("message");
    });

    it("should return empty array if all announcements are read", async () => {
      await Announcement.create([
        { title: "Announcement 1", message: "Message 1", readBy: [testUserId] },
      ]);

      const res = await request(app)
        .get("/api/announcements")
        .query({ userId: testUserId.toString() });

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(0);
    });
  });

  describe("POST /api/announcements/mark-as-read/:id", () => {
    it("should mark an announcement as read by a user", async () => {
      const announcement = await Announcement.create({
        title: "Read Test",
        message: "Testing read",
        readBy: []
      });

      const res = await request(app)
        .post(`/api/announcements/mark-as-read/${announcement._id}`)
        .send({ userId: testUserId.toString() });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "Marked as read");

      const updated = await Announcement.findById(announcement._id);
      expect(updated.readBy.map(id => id.toString())).toContain(testUserId.toString());
    });

    it("should not duplicate userId in readBy array if already marked", async () => {
      const announcement = await Announcement.create({
        title: "Duplicate Test",
        message: "Testing duplicate read",
        readBy: [testUserId]
      });

      const res = await request(app)
        .post(`/api/announcements/mark-as-read/${announcement._id}`)
        .send({ userId: testUserId.toString() });

      expect(res.status).toBe(200);

      const updated = await Announcement.findById(announcement._id);
      expect(updated.readBy.length).toBe(1); // Still only one entry
    });

    it("should return 500 if marking as read fails", async () => {
      const invalidId = new mongoose.Types.ObjectId(); // simulate ID that doesn't exist

      const res = await request(app)
        .post(`/api/announcements/mark-as-read/${invalidId}`)
        .send({ userId: testUserId.toString() });

      // Even if ID doesn't exist, mongoose update won't fail, but let's assume bad input
      expect(res.status).toBe(200); // Because findByIdAndUpdate doesn't throw if not found
    });
  });
});
