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


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected!"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// Import Routes
const authRoutes = require("./routes/auth");
const lostItemRoutes = require("./routes/lostitems");
const foundItemRoutes = require("./routes/foundItems"); // <-- Added the combined foundItems.js

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/lost-items", lostItemRoutes);
app.use("/api/found-items", foundItemRoutes); // <-- Added the found items routes
app.use("/api/matches", require("./routes/matches"));
app.use("/api/announcements", require("./routes/announcements"));


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
