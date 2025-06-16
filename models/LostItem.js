const mongoose = require("mongoose");

const LostItemSchema = new mongoose.Schema
({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    dateLost: { type: Date, required: true },
    image: { type: String }, // Store image filename
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("LostItem", LostItemSchema);
