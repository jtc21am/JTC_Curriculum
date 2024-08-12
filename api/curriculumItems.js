const mongoose = require('mongoose');

const CurriculumItemSchema = new mongoose.Schema({
    date: Date,
    moduleName: String,
    lessonName: String,
    adminConfirmed: Boolean,
    selectedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('CurriculumItem', CurriculumItemSchema);