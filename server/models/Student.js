const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  admissionNo: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  otherName: { type: String },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  dob: { type: String },
  tier: { type: String, required: true },
  classOrDept: { type: String, required: true },
  armOrStream: { type: String },
  stateOfOrigin: { type: String },
  guardianName: { type: String, required: true },
  guardianPhone: { type: String, required: true },
  guardianEmail: { type: String, required: true },
  feeStatus: { type: String, enum: ['paid', 'partial', 'unpaid'], default: 'unpaid' },
  feeBalance: { type: Number, default: 0 },
  termAverage: { type: Number },
  cgpa: { type: Number },
  attendanceRate: { type: Number, default: 100 },
  status: { type: String, enum: ['active', 'graduated', 'suspended'], default: 'active' },
  avatarUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
