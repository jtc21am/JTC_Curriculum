const Curriculum = require('./CurriculumItems'); // Mongoose model for Curriculum
const { broadcast } = require('./websocket'); // Import the broadcast function

// Get Curriculum Data
async function getCurriculum(req, res) {
    try {
        const curriculum = await Curriculum.find({}).sort({ DateCode: 1 });
        res.status(200).json(curriculum);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching curriculum' });
    }
}

// Request to Lecture on a Lesson
async function requestLecture(req, res) {
    try {
        const { code, name } = req.body;
        const lesson = await Curriculum.findOne({ Code: code });

        if (!lesson || lesson.Locked) {
            return res.status(400).json({ error: 'Lesson is locked or does not exist' });
        }

        lesson.Requests.push({ name, timestamp: new Date() });
        await lesson.save();

        // Broadcast the update to all connected clients
        broadcast({ type: 'update', payload: lesson });

        res.status(200).json(lesson);
    } catch (err) {
        res.status(500).json({ error: 'Error requesting to lecture' });
    }
}

// Confirm a Lecturer for a Lesson (Admin only)
async function confirmLecturer(req, res) {
    try {
        const { code, name } = req.body;
        const lesson = await Curriculum.findOne({ Code: code });

        if (!lesson || lesson.Locked) {
            return res.status(400).json({ error: 'Lesson is locked or does not exist' });
        }

        lesson.ConfirmedLecturer = name;
        lesson.Locked = true;
        await lesson.save();

        // Broadcast the update to all connected clients
        broadcast({ type: 'confirm', payload: lesson });

        res.status(200).json(lesson);
    } catch (err) {
        res.status(500).json({ error: 'Error confirming lecturer' });
    }
}

module.exports = {
    getCurriculum,
    requestLecture,
    confirmLecturer,
};
