const express = require("express");
const multer = require("multer");
const LostItem = require("../models/LostItem");

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save images in "uploads" folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });

// POST - Report a Lost Item
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

module.exports = router;
