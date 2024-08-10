const mongoose = require('mongoose');

const curriculumItemSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  code: String,
  type: String,
  phases: String,
  moduleName: String,
  lessonName: String,
  conceptsCovered: String,
  purpose: String,
  preReqs: String,
  requestedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  adminConfirmed: { type: Boolean, default: false },
  selectedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const CurriculumItem = mongoose.model('CurriculumItem', curriculumItemSchema);
module.exports = CurriculumItem;
