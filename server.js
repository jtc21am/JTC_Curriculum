require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const { User, Lesson } = require('./models');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'pages')));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

// Fetch curriculum data
app.get('/api/curriculum', async (req, res) => {
    try {
        const lessons = await Lesson.find().sort({ Code: 1 });
        res.json(lessons);
    } catch (error) {
        console.error('Error fetching curriculum data:', error);
        res.status(500).json({ error: 'Error fetching curriculum data' });
    }
});

// Request to teach a lesson
app.post('/api/request-lesson', async (req, res) => {
    const { lessonId, userId, userName, timestamp, request } = req.body;
    try {
        const lesson = await Lesson.findById(lessonId);
        if (!lesson) {
            return res.status(404).json({ success: false, error: 'Lesson not found' });
        }
        if (request) {
            lesson.requests.push({ userId, userName, timestamp: new Date(timestamp) });
        } else {
            lesson.requests = lesson.requests.filter(req => req.userId !== userId);
        }
        await lesson.save();
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating lesson request:', error);
        res.status(500).json({ success: false, error: 'Error updating lesson request' });
    }
});

// Confirm lecturer for a lesson
app.post('/api/confirm-lecturer', async (req, res) => {
    const { lessonId, confirmedLecturer } = req.body;
    try {
        const lesson = await Lesson.findById(lessonId);
        if (!lesson) {
            return res.status(404).json({ success: false, error: 'Lesson not found' });
        }
        lesson.confirmedLecturer = confirmedLecturer;
        await lesson.save();
        res.json({ success: true });
    } catch (error) {
        console.error('Error confirming lecturer:', error);
        res.status(500).json({ success: false, error: 'Error confirming lecturer' });
    }
});

// Get user profile
app.get('/api/user/:sub', async (req, res) => {
    try {
        const user = await User.findOne({ sub: req.params.sub });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Error fetching user profile' });
    }
});

// Update user profile
app.put('/api/user/:sub', async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { sub: req.params.sub },
            req.body,
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.json(user);
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Error updating user profile' });
    }
});

// Get user's lesson requests
app.get('/api/user-lessons/:userId', async (req, res) => {
    try {
        const lessons = await Lesson.find({ 'requests.userId': req.params.userId });
        res.json(lessons);
    } catch (error) {
        console.error('Error fetching user lessons:', error);
        res.status(500).json({ error: 'Error fetching user lessons' });
    }
});

// Catch-all handler for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;