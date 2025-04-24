const express = require("express");
const multer = require("multer");
const FoundItem = require("../models/FoundItem");

const router = express.Router();

// Multer config for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads"); // Store files in the "uploads" folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname); // Create unique filenames
    }
});

const upload = multer({ storage });

// POST: Report a Found Item (POST /api/found-items/report)
router.post("/report", upload.single("image"), async (req, res) => {
    try {
        const { title, description, location, dateFound, userId } = req.body;
        const image = req.file ? req.file.filename : null;

        const foundItem = new FoundItem({
            title,
            description,
            location,
            dateFound,
            image,
            userId
        });

        await foundItem.save();

        res.status(201).json({ msg: "Found item reported successfully!" });
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
});

// GET: Fetch all Found Items (GET /api/found-items)
router.get("/", async (req, res) => {
    try {
        // Fetch all found items from the database
        const foundItems = await FoundItem.find();

        if (!foundItems || foundItems.length === 0) {
            return res.status(404).json({ message: "No found items available" });
        }

        res.json(foundItems);  // Send all found items as a response
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

// GET: Search for Found Items (GET /api/found-items/search)
router.get("/search", async (req, res) => {
    const { q } = req.query;  // 'q' is the query parameter for search

    try {
        // Find found items based on title, description, or location
        const results = await FoundItem.find({
            $or: [
                { title: new RegExp(q, "i") },
                { description: new RegExp(q, "i") },
                { location: new RegExp(q, "i") }
            ]
        });

        res.json(results);  // Send back the search results
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const deletedItem = await FoundItem.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({ message: "Found item not found" });
        }

        res.json({ message: "Found item deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

module.exports = router;
