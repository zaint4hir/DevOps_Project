const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
    lostItemId: { type: mongoose.Schema.Types.ObjectId, ref: "LostItem", required: true },
    foundItemId: { type: mongoose.Schema.Types.ObjectId, ref: "FoundItem", required: true },
    lostUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    foundUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lostUserName: { type: String, required: true },
    foundUserName: { type: String, required: true },
    dateMatched: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Match", matchSchema);
