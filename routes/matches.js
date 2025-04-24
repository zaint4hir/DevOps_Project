const express = require("express");
const router = express.Router();
const Match = require("../models/Match");

router.post("/", async (req, res) => {
    try {
        const match = new Match(req.body);
        await match.save();
        res.status(201).json(match);
    } catch (err) {
        res.status(400).json({ error: "Error saving match", details: err });
    }
});

router.get("/", async (req, res) => {
    const matches = await Match.find().populate("lostItemId foundItemId lostUserId foundUserId");
    res.json(matches);
});

module.exports = router;
