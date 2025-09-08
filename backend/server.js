const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

// Routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const semesterRoutes = require("./routes/semesterRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const questionRoutes = require("./routes/questionRoutes");

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/uniprep";
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/semesters", semesterRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/questions", questionRoutes);



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
