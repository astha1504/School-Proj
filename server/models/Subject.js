const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  name: { type: String, required: true },
  tier: { type: String, required: true },
  level: { type: String, required: true },
  creditUnits: { type: Number },
  category: { type: String },
  periodsPerWeek: { type: Number, default: 4 },
  assignedTeacherId: { type: String },
  teacherName: { type: String },
  syllabusOutline: { type: String },
  status: { type: String, default: 'active' },
  approvedByOffice: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
