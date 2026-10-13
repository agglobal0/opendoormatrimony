const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticate, requireRole } = require('../middleware/authMiddleware');

router.post('/', contactController.submitContact);
router.get('/', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), contactController.getContactSubmissions);

module.exports = router;
