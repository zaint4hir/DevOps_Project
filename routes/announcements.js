const express = require("express");
const router = express.Router();
const Announcement = require("../models/Announcement");

// Create a new announcement
router.post("/", async (req, res) => {
    try {
        const newAnnouncement = new Announcement(req.body);
        await newAnnouncement.save();
        res.status(201).json({ message: "Announcement sent!" });
    } catch (err) {
        res.status(500).json({ error: "Failed to send announcement" });
    }
});

// Get all announcements
router.get("/", async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.json(announcements);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch announcements" });
    }
});

// Delete one announcement (optional per user)
router.delete("/:id", async (req, res) => {
    try {
        await Announcement.findByIdAndDelete(req.params.id);
        res.json({ message: "Announcement deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete announcement" });
    }
});

module.exports = router;
