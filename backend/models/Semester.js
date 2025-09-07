const mongoose = require("mongoose");

const semesterSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Semester 1"
  number: { type: Number, required: true, unique: true } // 1–8
});

module.exports = mongoose.model("Semester", semesterSchema);
