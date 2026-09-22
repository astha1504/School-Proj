const mongoose = require('mongoose');

const staffMemberSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  staffId: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  tier: { type: String, default: 'all' },
  qualification: { type: String },
  departmentOrClass: { type: String },
  assignedSubjects: [{ type: String }],
  assignedClassArm: { type: String },
  trcnNumber: { type: String },
  trcnStatus: { type: String, enum: ['certified', 'pending', 'exempt'], default: 'certified' },
  employmentDate: { type: String },
  salaryGrade: { type: String },
  periodsPerWeek: { type: Number },
  officeJurisdiction: { type: String },
  email: { type: String, required: true },
  phone: { type: String },
  status: { type: String, enum: ['active', 'on_leave'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('StaffMember', staffMemberSchema);
