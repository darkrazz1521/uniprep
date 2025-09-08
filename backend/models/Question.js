const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false }
});

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },            // questionText
  options: [optionSchema],                           // array of options with isCorrect flag
  difficulty: { type: String, enum: ["easy","medium","hard"], default: "easy" },
  unitNo: { type: Number },
  topic: { type: String },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Question", questionSchema);
