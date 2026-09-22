const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  targetTier: { type: String, default: 'all' },
  priority: { type: String, enum: ['normal', 'important', 'urgent'], default: 'normal' },
  author: { type: String, required: true },
  date: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
