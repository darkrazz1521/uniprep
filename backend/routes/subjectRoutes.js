const express = require("express");
const Subject = require("../models/Subject");

const router = express.Router();

// ✅ Get subjects by semester
router.get("/:semesterId", async (req, res) => {
  try {
    const subjects = await Subject.find({ semester: req.params.semesterId });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subjects", error });
  }
});

// ✅ Add a subject
router.post("/", async (req, res) => {
  try {
    const { name, code, semester } = req.body;
    const subject = new Subject({ name, code, semester });
    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    res.status(400).json({ message: "Error creating subject", error });
  }
});

module.exports = router;
