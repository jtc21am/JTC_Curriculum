const User = require('./User'); // Mongoose model for User

// Update User Profile
async function updateUserProfile(req, res) {
    try {
        const { id, name, bio } = req.body;
        let updateData = { name, bio };

        if (req.file) {
            // Handle profile picture upload
            updateData.profilePic = `/uploads/${req.file.filename}`;
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: 'Error updating profile' });
    }
}

// Get Users (Admin only)
async function getUsers(req, res) {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching users' });
    }
}

// Delete User (Admin only)
async function deleteUser(req, res) {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting user' });
    }
}

module.exports = {
    updateUserProfile,
    getUsers,
    deleteUser,
};
