const express = require("express");
const multer = require("multer");
const fs = require("fs");
const Question = require("../models/Question");
const Subject = require("../models/Subject");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Upload JSON questions for a subject
router.post("/:subjectId/upload", upload.single("questionsFile"), async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.subjectId);
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    const data = JSON.parse(fs.readFileSync(req.file.path, "utf-8"));
    if (!Array.isArray(data)) {
      return res.status(400).json({ message: "Invalid JSON format: must be an array" });
    }

    const questions = data.map(q => ({
      text: q.questionText,
      options: q.options.map(opt => ({
        text: opt,
        isCorrect: opt === q.correctAnswer,
      })),
      difficulty: q.difficulty,
      unitNo: q.unitNo,
      topic: q.topic,
      subject: subject._id,
      createdAt: q.createdAt || Date.now(),
    }));

    await Question.insertMany(questions);
    fs.unlinkSync(req.file.path);

    res.json({ message: "Questions uploaded successfully!", count: questions.length });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all questions for a subject
router.get("/subject/:subjectId", async (req, res) => {
  try {
    const questions = await Question.find({ subject: req.params.subjectId });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


module.exports = router;
