const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { 
    type: String, 
    enum: ['super_admin', 'principal_head', 'teacher_lecturer', 'student', 'parent', 'bursar', 'getocore_admin'], 
    default: 'student' 
  },
  tier: { type: String, default: 'all' },
  avatar: { type: String },
  phone: { type: String },
  identifierId: { type: String },
  wardIds: [{ type: String }],
  officeTitle: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
