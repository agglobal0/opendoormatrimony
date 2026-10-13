const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, matchController.discoverMatches);

module.exports = router;
