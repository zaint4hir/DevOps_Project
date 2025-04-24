const mongoose = require("mongoose");

const FoundItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    dateFound: { type: Date, required: true },
    image: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("FoundItem", FoundItemSchema);
