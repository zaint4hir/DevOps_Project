// routes/foundItemsRoutes.js
const express = require("express");
const router = express.Router();
const FoundItem = require("../models/FoundItem");

// Search route for Found Items
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

module.exports = router;
