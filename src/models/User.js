const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String },
  email: { type: String, unique: true, required: true },
  linkedIn: { type: String },
  workTitle: { type: String },
  employer: { type: String },
  jobTitle: { type: String },
  profilePic: {
    data: Buffer,   // Binary data for the profile picture
    contentType: String  // The MIME type of the image (e.g., 'image/jpeg', 'image/png')
  },
  bio: { type: String },
  lessonsPreferred: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CurriculumItem' }],  // References to preferred lessons
  createdAt: { type: Date, default: Date.now },  // Automatically store the creation date
  updatedAt: { type: Date, default: Date.now }   // Automatically update this field when the document is updated
});

// Middleware to automatically set `updatedAt` before saving the document
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Optionally, you can add instance methods or static methods to the schema for reusable logic
userSchema.methods.getFullName = function () {
  return `${this.firstName} ${this.lastName}`;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
