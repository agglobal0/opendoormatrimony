const express = require('express');
const router = express.Router();
const membershipController = require('../controllers/membershipController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/plans', membershipController.getPlans);
router.get('/my-status', authenticate, membershipController.getMyStatus);
router.post('/upgrade', authenticate, membershipController.upgradeMembership);

module.exports = router;
