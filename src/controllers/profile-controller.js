// src/controllers/profileController.js
const User = require('../models/User');

exports.updateUserProfile = async (req, res) => {
    const userId = req.params.userId;
    const updatedProfile = req.body;

    try {
        const user = await User.findOneAndUpdate(
            { userId },
            { $set: updatedProfile },
            { new: true, upsert: true } // Create the user if it doesn't exist
        );
        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile', error });
    }
};
