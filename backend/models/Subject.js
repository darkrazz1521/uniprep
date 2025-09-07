const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Data Structures"
  code: { type: String, required: true, unique: true }, // e.g., "CS201"
  semester: { type: mongoose.Schema.Types.ObjectId, ref: "Semester", required: true }
});

module.exports = mongoose.model("Subject", subjectSchema);
