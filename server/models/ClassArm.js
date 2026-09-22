const mongoose = require('mongoose');

const classArmSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  tier: { type: String, required: true },
  gradeLevel: { type: String, required: true },
  armOrStream: { type: String, required: true },
  capacity: { type: Number, default: 40 },
  enrolledCount: { type: Number, default: 0 },
  formTeacherId: { type: String },
  formTeacherName: { type: String },
  classroomBlock: { type: String },
  classPrefect: { type: String },
  status: { type: String, enum: ['active', 'archived'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('ClassArm', classArmSchema);
