const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const FoundItem = require("../models/FoundItem");
const fs = require('fs');
const path = require('path');

// Mock data
const testUserId = new mongoose.Types.ObjectId();
const testItemData = {
  title: "Test Wallet",
  description: "Black leather wallet with cards",
  location: "Main Campus, Building A",
  dateFound: new Date("2025-04-28"),
  userId: testUserId
};

describe("Found Items API", () => {
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
    // Clear database and add test item before each test
    await FoundItem.deleteMany();
    await FoundItem.create(testItemData);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });



  describe("GET /api/found-items", () => {
    it("should retrieve all found items", async () => {
      // Add one more item for testing
      await FoundItem.create({
        title: "Second Item",
        description: "Test description",
        location: "Test location",
        dateFound: new Date(),
        userId: testUserId
      });

      const res = await request(app).get("/api/found-items");
      
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toMatchObject({
        title: expect.any(String),
        description: expect.any(String),
        location: expect.any(String)
      });
    });

    it("should return empty array when no items exist", async () => {
      await FoundItem.deleteMany();
      const res = await request(app).get("/api/found-items");
      
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "No found items available");
    });
  });

  describe("DELETE /api/found-items/:id", () => {
    it("should delete an existing item", async () => {
      const item = await FoundItem.findOne();
      const res = await request(app)
        .delete(`/api/found-items/${item._id}`);
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "Found item deleted successfully");
      
      // Verify deletion
      const deletedItem = await FoundItem.findById(item._id);
      expect(deletedItem).toBeNull();
    });

    it("should return 404 for non-existent ID", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/found-items/${fakeId}`);
      
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Found item not found");
    });
  });

  // Additional tests for your analytics endpoints
  describe("Analytics Endpoints", () => {
    beforeEach(async () => {
      // Create items with different dates for analytics testing
      await FoundItem.create([
        {
          title: "Item 1",
          description: "Test",
          location: "Location A",
          dateFound: new Date("2025-01-15"),
          userId: testUserId
        },
        {
          title: "Item 2",
          description: "Test",
          location: "Location B",
          dateFound: new Date("2025-02-20"),
          userId: testUserId
        }
      ]);
    });

    describe("GET /api/found-items/reports-per-month", () => {
      it("should return monthly report counts", async () => {
        const res = await request(app)
          .get("/api/found-items/reports-per-month");
        
        expect(res.status).toBe(200);
        expect(res.body.foundReports).toBeInstanceOf(Array);
        expect(res.body.foundReports.length).toBeGreaterThan(0);
        expect(res.body.foundReports[0]).toHaveProperty("_id", expect.any(Number));
        expect(res.body.foundReports[0]).toHaveProperty("count", expect.any(Number));
      });
    });

    describe("GET /api/found-items/heatmap", () => {
      it("should return location frequency data", async () => {
        const res = await request(app)
          .get("/api/found-items/heatmap");
        
        expect(res.status).toBe(200);
        expect(res.body.locations).toBeInstanceOf(Array);
        expect(res.body.locations.length).toBeGreaterThan(0);
        expect(res.body.locations[0]).toHaveProperty("_id", expect.any(String));
        expect(res.body.locations[0]).toHaveProperty("count", expect.any(Number));
      });
    });
  });
});