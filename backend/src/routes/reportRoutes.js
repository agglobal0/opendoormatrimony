const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/', authenticate, reportController.reportProfile);
router.post('/block', authenticate, reportController.blockUser);

module.exports = router;
