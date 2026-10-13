const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, requireRole } = require('../middleware/authMiddleware');

router.use(authenticate, requireRole('ADMIN', 'SUPER_ADMIN'));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/users', adminController.getUsers);
router.post('/verify/:id', adminController.updateVerificationStatus);
router.put('/verify/:id', adminController.updateVerificationStatus);
router.post('/profiles/:id/verify', adminController.updateVerificationStatus);
router.put('/profiles/:id/verify', adminController.updateVerificationStatus);
router.get('/reports', adminController.getReports);
router.put('/reports/:id', adminController.updateReport);
router.get('/interests', adminController.getInterests);
router.put('/interests/:id', adminController.updateInterest);
router.get('/audit-logs', adminController.getAuditLogs);

module.exports = router;
