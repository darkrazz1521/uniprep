const express = require("express");
const Semester = require("../models/Semester");

const router = express.Router();

// ✅ Get all semesters
router.get("/", async (req, res) => {
  try {
    const semesters = await Semester.find();
    res.json(semesters);
  } catch (error) {
    res.status(500).json({ message: "Error fetching semesters", error });
  }
});

// ✅ Add a new semester
router.post("/", async (req, res) => {
  try {
    const { name, number } = req.body;
    const semester = new Semester({ name, number });
    await semester.save();
    res.status(201).json(semester);
  } catch (error) {
    res.status(400).json({ message: "Error creating semester", error });
  }
});

module.exports = router;
