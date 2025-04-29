const express = require("express");
const router = express.Router();
const Announcement = require("../models/Announcement");

// Create a new announcement
router.post("/", async (req, res) => {
    try {
        const { title, message } = req.body;
        const announcement = new Announcement({ title, message });
        await announcement.save();
        res.status(201).json(announcement);
    } catch (err) {
        res.status(500).json({ error: "Failed to create announcement" });
    }
});

// Get announcements for a user (excluding read ones)
router.get("/", async (req, res) => {
    const { userId } = req.query;
    try {
        const announcements = await Announcement.find({ readBy: { $ne: userId } });
        res.json(announcements);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch announcements" });
    }
});

// Mark announcement as read
router.post("/mark-as-read/:id", async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    try {
        await Announcement.findByIdAndUpdate(id, { $addToSet: { readBy: userId } });
        res.json({ message: "Marked as read" });
    } catch (err) {
        res.status(500).json({ error: "Failed to mark announcement as read" });
    }
});

module.exports = router;
