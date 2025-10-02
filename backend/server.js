const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/uniprep";
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("MongoDB error:", err));

// Routes
app.get("/", (req, res) => res.send("Backend is running 🚀"));
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
