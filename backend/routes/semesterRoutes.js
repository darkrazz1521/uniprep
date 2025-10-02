const express = require("express");
const Semester = require("../models/Semester");
const Subject = require("../models/Subject");

const router = express.Router();

// Get all semesters
router.get("/", async (req, res) => {
  const semesters = await Semester.find();
  res.json(semesters);
});

// Create semester
router.post("/", async (req, res) => {
  const semester = new Semester(req.body);
  await semester.save();
  res.status(201).json(semester);
});

// Get subjects for a semester
router.get("/:semesterId/subjects", async (req, res) => {
  const subjects = await Subject.find({ semester: req.params.semesterId });
  res.json(subjects);
});

module.exports = router;
