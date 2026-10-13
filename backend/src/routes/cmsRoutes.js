const express = require('express');
const router = express.Router();
const cmsController = require('../controllers/cmsController');
const { authenticate, requireRole } = require('../middleware/authMiddleware');

router.get('/settings', cmsController.getSettings);
router.put('/settings', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), cmsController.updateSettings);

router.get('/faqs', cmsController.getFaqs);
router.get('/success-stories', cmsController.getSuccessStories);
router.post('/success-stories', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), cmsController.createSuccessStory);
router.put('/success-stories/:id', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), cmsController.updateSuccessStory);
router.delete('/success-stories/:id', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), cmsController.deleteSuccessStory);

module.exports = router;
