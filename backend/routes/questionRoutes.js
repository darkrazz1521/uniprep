const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const Subject = require("../models/Subject");
const Question = require("../models/Question");

// Multer setup
const upload = multer({ dest: "uploads/" });

// Upload JSON questions
router.post("/:subjectId/upload", upload.single("questionsFile"), async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.subjectId);
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    const filePath = req.file.path;
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: "Invalid JSON format: must be an array" });
    }

    const questions = data.map(q => ({
      text: q.questionText,
      options: q.options.map(opt => ({
        text: opt,
        isCorrect: opt === q.correctAnswer
      })),
      difficulty: q.difficulty,
      unitNo: q.unitNo,
      topic: q.topic,
      subject: subject._id,
      createdAt: q.createdAt || Date.now()
    }));

    await Question.insertMany(questions);

    // Remove temp file
    fs.unlinkSync(filePath);

    res.json({ message: "Questions uploaded successfully!", count: questions.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Fetch all questions for a subject
router.get("/:subjectId", async (req, res) => {
  try {
    const questions = await Question.find({ subject: req.params.subjectId });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
