const mongoose = require('mongoose');

const cbtQuestionSchema = new mongoose.Schema({
  id: String,
  questionText: String,
  options: [String],
  correctOptionIndex: Number,
  explanation: String,
  marks: Number
});

const cbtExamSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subject: { type: String, required: true },
  tier: { type: String, required: true },
  classLevel: { type: String, required: true },
  durationMinutes: { type: Number, default: 30 },
  totalMarks: { type: Number, default: 100 },
  questionsCount: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'upcoming', 'completed'], default: 'active' },
  passPercentage: { type: Number, default: 50 },
  instructions: { type: String },
  questions: [cbtQuestionSchema]
}, { timestamps: true });

module.exports = mongoose.model('CBTExam', cbtExamSchema);
