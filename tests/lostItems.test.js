const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const LostItem = require('../models/LostItem');
const fs = require('fs');
const path = require('path');

// Test data
const testUserId = new mongoose.Types.ObjectId();
const testItemData = {
  title: "Lost Wallet",
  description: "Black leather wallet with cards",
  location: "Main Campus",
  dateLost: new Date("2025-04-28"),
  userId: testUserId
};

describe("Lost Items API", () => {
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
    // Clear and seed database before each test
    await LostItem.deleteMany();
    await LostItem.create(testItemData);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("POST /api/lost-items/report", () => {
    it("should report a lost item with all required fields", async () => {
      const newItem = {
        title: "Lost Phone",
        description: "iPhone 13 Pro Max",
        location: "Library",
        dateLost: "2025-04-28",
        userId: testUserId.toString()
      };

      const res = await request(app)
        .post("/api/lost-items/report")
        .send(newItem);

      expect(res.status).toBe(201);
      expect(res.body.msg).toBe("Lost item reported successfully!");

      // Verify database state
      const items = await LostItem.find();
      expect(items.length).toBe(2);
      expect(items[1].title).toBe(newItem.title);
    });

    it("should report a lost item with image", async () => {
      // Create a dummy test image
      const testImagePath = path.join(__dirname, 'test-image.jpg');
      fs.writeFileSync(testImagePath, 'dummy content');

      const res = await request(app)
        .post("/api/lost-items/report")
        .field("title", "Lost Keys")
        .field("description", "House keys with keychain")
        .field("location", "Parking Lot")
        .field("dateLost", "2025-04-28")
        .field("userId", testUserId.toString())
        .attach("image", testImagePath);

      expect(res.status).toBe(201);
      
      // Clean up test file
      fs.unlinkSync(testImagePath);
    });

    it("should reject reports with missing required fields", async () => {
      const invalidItems = [
        { description: "No title", location: "Campus", dateLost: "2025-04-28", userId: testUserId },
        { title: "No description", location: "Campus", dateLost: "2025-04-28", userId: testUserId },
        { title: "No location", description: "Test", dateLost: "2025-04-28", userId: testUserId },
        { title: "No date", description: "Test", location: "Campus", userId: testUserId }
      ];

      for (const item of invalidItems) {
        const res = await request(app)
          .post("/api/lost-items/report")
          .send(item);
        expect(res.status).toBe(500);
      }
    });
  });

  describe("GET /api/lost-items", () => {
    it("should retrieve all lost items", async () => {
      const res = await request(app).get("/api/lost-items");
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].title).toBe(testItemData.title);
    });
  });

  describe("GET /api/lost-items/search", () => {
    it("should find items by search query", async () => {
      const res = await request(app)
        .get("/api/lost-items/search")
        .query({ q: "wallet" });
      
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].title).toBe("Lost Wallet");
    });

    it("should return empty array for non-matching query", async () => {
      const res = await request(app)
        .get("/api/lost-items/search")
        .query({ q: "nonexistent" });
      
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(0);
    });
  });

  describe("DELETE /api/lost-items/:id", () => {
    it("should delete an existing lost item", async () => {
      const item = await LostItem.findOne();
      const res = await request(app)
        .delete(`/api/lost-items/${item._id}`);
      
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Lost item deleted successfully");
      
      // Verify deletion
      const items = await LostItem.find();
      expect(items.length).toBe(0);
    });

    it("should return 404 for non-existent ID", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/lost-items/${fakeId}`);
      
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Lost item not found");
    });
  });

  describe("Analytics Endpoints", () => {
    beforeEach(async () => {
      // Add more items for analytics testing
      await LostItem.create([
        {
          title: "Lost Bag",
          description: "Backpack",
          location: "Cafeteria",
          dateLost: new Date("2025-01-15"),
          userId: testUserId
        },
        {
          title: "Lost Textbook",
          description: "Physics 101",
          location: "Library",
          dateLost: new Date("2025-02-20"),
          userId: testUserId
        }
      ]);
    });

    describe("GET /api/lost-items/reports-per-month", () => {
      it("should return monthly report counts", async () => {
        const res = await request(app)
          .get("/api/lost-items/reports-per-month");
        
        expect(res.status).toBe(200);
        expect(res.body.lostReports).toBeInstanceOf(Array);
        expect(res.body.lostReports.length).toBeGreaterThan(0);
      });
    });

    describe("GET /api/lost-items/heatmap", () => {
      it("should return location frequency data", async () => {
        const res = await request(app)
          .get("/api/lost-items/heatmap");
        
        expect(res.status).toBe(200);
        expect(res.body.locations).toBeInstanceOf(Array);
        expect(res.body.locations.length).toBeGreaterThan(0);
      });
    });
  });
});