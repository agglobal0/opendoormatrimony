const express = require('express');
const router = express.Router();
const interestController = require('../controllers/interestController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/', authenticate, interestController.sendInterest);
router.get('/received', authenticate, interestController.getReceivedInterests);
router.get('/sent', authenticate, interestController.getSentInterests);
router.put('/:id/status', authenticate, interestController.respondToInterest);
router.post('/:id/introduction', authenticate, interestController.requestIntroduction);

module.exports = router;
