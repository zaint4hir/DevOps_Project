const express = require("express");
const multer = require("multer");
const LostItem = require("../models/LostItem");

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

const upload = multer({ storage: storage });

// Route to search for Lost Items (GET /api/lost-items/search)
router.get("/search", async (req, res) => {
    const { q } = req.query;  // 'q' is the query parameter for search

    try {
        // Find lost items based on title, description, or location
        const results = await LostItem.find({
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

// Route to get all Lost Items (GET /api/lost-items)
router.get("/", async (req, res) => {
    try {
        // Fetch all lost items from the database
        const lostItems = await LostItem.find();
        
        if (!lostItems) {
            return res.status(404).json({ message: "No lost items available" });
        }

        res.json(lostItems);  // Send all lost items as a response
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

// Route to report a Lost Item (POST /api/lost-items/report)
router.post("/report", upload.single("image"), async (req, res) => {
    try {
        const { title, description, location, dateLost, userId } = req.body;
        const image = req.file ? req.file.filename : null; // Store filename if image exists

        const lostItem = new LostItem({ title, description, location, dateLost, image, userId });
        await lostItem.save();

        res.status(201).json({ msg: "Lost item reported successfully!" });
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
});
// Route to delete a Lost Item by ID (DELETE /api/lost-items/:id)
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const deletedItem = await LostItem.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({ message: "Lost item not found" });
        }

        res.json({ message: "Lost item deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});


router.get("/reports-per-month", async (req, res) => {
    try {
        const lostReports = await LostItem.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({ lostReports });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch lost item reports per month." });
    }
});

router.get("/heatmap", async (req, res) => {
    try {
        const locations = await LostItem.aggregate([
            {
                $group: {
                    _id: { $toLower: "$location" }, // Normalize case
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }, // Most frequent first
            { $limit: 10 } // Return top 10
        ]);

        res.json({ locations });
    } catch (err) {
        res.status(500).json({ error: "Failed to generate lost item location heatmap." });
    }
});

module.exports = router;
