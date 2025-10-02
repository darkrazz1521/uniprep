const express = require("express");
const Subject = require("../models/Subject");

const router = express.Router();

// Get all subjects
router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: "Error fetching subjects", error: err.message });
  }
});

// Get a subject by ID
router.get("/:subjectId", async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.subjectId);
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.json(subject);
  } catch (err) {
    res.status(500).json({ message: "Error fetching subject", error: err.message });
  }
});

// ✅ Get subjects by semester
router.get("/semester/:semesterId", async (req, res) => {
  try {
    const subjects = await Subject.find({ semester: req.params.semesterId });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: "Error fetching subjects by semester", error: err.message });
  }
});

// Create subject
router.post("/", async (req, res) => {
  const { name, code, semester } = req.body;
  if (!name || !code || !semester) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const subject = new Subject({ name, code, semester });
    await subject.save();
    res.status(201).json(subject);
  } catch (err) {
    res.status(500).json({ message: "Error creating subject", error: err.message });
  }
});

module.exports = router;
