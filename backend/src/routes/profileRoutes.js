const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticate, optionalAuth } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.put('/me', authenticate, profileController.updateProfile);
router.post('/photo', authenticate, upload.single('photo'), profileController.uploadPhoto);
router.get('/:id', optionalAuth, profileController.getProfileById);

module.exports = router;
