const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

exports.reportProfile = async (req, res, next) => {
  try {
    const reporterId = req.user.id;
    const { reported_user_id, reason, description } = req.body;

    if (!reported_user_id || !reason || !description) {
      return res.status(400).json({ success: false, message: 'Reported user ID, reason, and description are required.' });
    }

    if (reporterId === reported_user_id) {
      return res.status(400).json({ success: false, message: 'You cannot report your own profile.' });
    }

    if (db.isMock()) {
      const mock = require('../config/mockDb');
      const newReport = {
        id: uuidv4(),
        reporter_id: reporterId,
        reported_user_id,
        reason,
        description,
        status: 'PENDING',
        admin_notes: '',
        created_at: new Date()
      };
      mock.tables.reports.push(newReport);
      return res.status(201).json({
        success: true,
        message: 'Your report has been received and will be reviewed confidentially by the church administrative committee.',
        report: newReport
      });
    }

    const reportId = uuidv4();
    await db.query(
      'INSERT INTO reports (id, reporter_id, reported_user_id, reason, description, status, created_at) VALUES (?, ?, ?, ?, ?, "PENDING", NOW())',
      [reportId, reporterId, reported_user_id, reason, description]
    );

    res.status(201).json({ success: true, message: 'Report submitted for church review.' });
  } catch (err) {
    next(err);
  }
};

exports.blockUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { blocked_user_id, reason } = req.body;

    if (!blocked_user_id) {
      return res.status(400).json({ success: false, message: 'Target user ID is required.' });
    }

    if (db.isMock()) {
      const mock = require('../config/mockDb');
      const existing = mock.tables.blocked_profiles.find(b => b.user_id === userId && b.blocked_user_id === blocked_user_id);
      if (!existing) {
        mock.tables.blocked_profiles.push({
          id: uuidv4(),
          user_id: userId,
          blocked_user_id,
          reason: reason || 'User requested block',
          created_at: new Date()
        });
      }
      return res.json({ success: true, message: 'User blocked. You will not see each other in recommendations.' });
    }

    await db.query(
      'INSERT IGNORE INTO blocked_profiles (id, user_id, blocked_user_id, reason, created_at) VALUES (?, ?, ?, ?, NOW())',
      [uuidv4(), userId, blocked_user_id, reason || 'User requested block']
    );

    res.json({ success: true, message: 'User blocked successfully.' });
  } catch (err) {
    next(err);
  }
};
