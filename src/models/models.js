const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    sub: String,
    linkedin: String,
    bio: String,
    employer: String,
    title: String,
    gitHub: String,
    picture: String,
    isAdmin: { type: Boolean, default: false }
});

const LessonSchema = new mongoose.Schema({
    Code: String,
    DATE: String,
    HRS: Number,
    DOW: String,
    Type: String,
    "Lesson Name": String,
    "Concepts Covered": String,
    Purpose: String,
    requests: [{
        userId: String,
        userName: String,
        timestamp: Date
    }],
    confirmedLecturer: String
});

const User = mongoose.model('User', UserSchema, 'users');
const Lesson = mongoose.model('Lesson', LessonSchema, 'curriculum_items');

module.exports = { User, Lesson };