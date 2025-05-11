const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema
({
    title: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // NEW FIELD
});

module.exports = mongoose.model("Announcement", announcementSchema);
