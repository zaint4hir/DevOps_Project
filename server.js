const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded images


// Connect to MongoDB for database
// Connect MongoDB (only if not testing)
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lostandfounddb')
    .then(() => console.log('✅ MongoDB Connected!'))
    .catch(err => console.error('MongoDB connection error:', err));
}
// Import Routes
const authRoutes = require("./routes/auth");
const lostItemRoutes = require("./routes/lostItems");
const foundItemRoutes = require("./routes/foundItems"); // <-- Added the combined foundItems.js

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/lost-items", lostItemRoutes);
app.use("/api/found-items", foundItemRoutes); // <-- Added the found items routes
app.use("/api/matches", require("./routes/matches"));
app.use("/api/announcements", require("./routes/announcements"));
// Serve frontend (after all API routes)


app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


// Start Server
if (process.env.NODE_ENV !== 'test') {  // <-- important line
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}



module.exports = app; // <-- export the app