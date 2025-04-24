// routes/lostItemsRoutes.js
const express = require("express");
const router = express.Router();
const LostItem = require("../models/LostItem");

// Search route for Lost Items
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

// Route to get all Lost Items
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

module.exports = router;
