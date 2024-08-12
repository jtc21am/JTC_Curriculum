const express = require('express');
const router = express.Router();
const CurriculumItem = require('./curriculumItems');

// Get all curriculum items
router.get('/', async (req, res) => {
  try {
    const curriculumItems = await CurriculumItem.find();
    res.json(curriculumItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching curriculum data', error: error.message });
  }
});

// Request a lesson
router.post('/:lessonId/request', async (req, res) => {
  try {
    const lessonId = req.params.lessonId;
    const userId = req.user.sub; // Auth0 uses 'sub' for user ID
    const lesson = await CurriculumItem.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    lesson.selectedUser = userId;
    await lesson.save();
    res.json({ message: 'Lesson requested successfully', lesson });
  } catch (error) {
    res.status(500).json({ message: 'Error requesting lesson', error: error.message });
  }
});

module.exports = router;