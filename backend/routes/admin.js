const express = require("express");
const multer = require("multer");
const Semester = require("../models/Semester");
const Subject = require("../models/Subject");
const router = express.Router();

// storage for question uploads
const upload = multer({ dest: "uploads/" });

// GET all semesters
router.get("/semesters", async (req, res) => {
  const semesters = await Semester.find();
  res.json(semesters); // if none, returns []
});

// ADD new semester
router.post("/semesters", async (req, res) => {
  const { name, number } = req.body;
  const semester = new Semester({ name, number });
  await semester.save();
  res.json(semester);
});

// GET subjects by semester
router.get("/subjects/:semesterId", async (req, res) => {
  const { semesterId } = req.params;
  const subjects = await Subject.find({ semester: semesterId });
  res.json(subjects); // [] if none
});

// ADD subject
router.post("/subjects", async (req, res) => {
  const { name, code, semester } = req.body;
  const subject = new Subject({ name, code, semester });
  await subject.save();
  res.json(subject);
});

// UPLOAD questions for a subject
router.post("/subjects/:subjectId/upload", upload.single("questionsFile"), async (req, res) => {
  try {
    const subjectId = req.params.subjectId;
    const fileData = require("fs").readFileSync(req.file.path, "utf-8");
    const questions = JSON.parse(fileData);

    // Here you would save questions to DB, e.g. Question.insertMany(...)
    res.json({ message: "Questions uploaded successfully!", questionsCount: questions.length });
  } catch (err) {
    res.status(400).json({ error: "Invalid JSON file" });
  }
});

module.exports = router;
