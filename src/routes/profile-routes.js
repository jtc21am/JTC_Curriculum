// src/routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

router.post('/api/update-profile/:userId', profileController.updateUserProfile);

module.exports = router;
