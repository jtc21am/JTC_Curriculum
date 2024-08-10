const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: String,
  email: { type: String, unique: true, required: true },
  linkedIn: String,
  workTitle: String,
  employer: String,
  jobTitle: String,
  profilePic: {
    data: Buffer,   // Binary data for the profile picture
    contentType: String  // The MIME type of the image (e.g., 'image/jpeg', 'image/png')
  },
  bio: String,
  lessonsPreferred: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CurriculumItem' }]  // References to preferred lessons
});

const User = mongoose.model('User', userSchema);
module.exports = User;
