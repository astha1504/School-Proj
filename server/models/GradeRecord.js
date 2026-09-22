const mongoose = require('mongoose');

const gradeRecordSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  admissionNo: { type: String, required: true },
  tier: { type: String, required: true },
  classOrDept: { type: String, required: true },
  subjectCode: { type: String, required: true },
  subjectName: { type: String, required: true },
  ca1Score: { type: Number, default: 0 },
  ca2Score: { type: Number, default: 0 },
  examScore: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0 },
  grade: { type: String },
  gradePoint: { type: Number },
  creditUnits: { type: Number },
  remarks: { type: String },
  session: { type: String },
  termOrSemester: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('GradeRecord', gradeRecordSchema);
