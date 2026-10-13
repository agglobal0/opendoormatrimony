const express = require('express');
const router = express.Router();
const savedController = require('../controllers/savedController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', authenticate, savedController.getSavedProfiles);
router.post('/toggle/:profileId', authenticate, savedController.toggleSaveProfile);

module.exports = router;
