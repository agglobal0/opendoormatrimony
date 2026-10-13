const db = require('../config/db');
const { createNotification } = require('../services/notificationService');
const { logAdminAction } = require('../services/auditService');

exports.getDashboardStats = async (req, res, next) => {
  try {
    if (db.isMock()) {
      const mock = require('../config/mockDb');
      const totalMembers = mock.tables.users.filter(u => u.role === 'USER').length;
      const maleMembers = mock.tables.profiles.filter(p => p.gender === 'MALE').length;
      const femaleMembers = mock.tables.profiles.filter(p => p.gender === 'FEMALE').length;
      const pendingProfiles = mock.tables.profiles.filter(p => p.verification_status === 'PENDING' || p.verification_status === 'UNDER_REVIEW').length;
      const verifiedProfiles = mock.tables.profiles.filter(p => p.verification_status === 'VERIFIED').length;
      const activeInterests = mock.tables.interests.length;
      const mutualMatches = mock.tables.interests.filter(i => i.status === 'ACCEPTED').length;
      const totalReports = mock.tables.reports.filter(r => r.status === 'PENDING').length;

      // Age distribution
      const ageDistribution = [
        { name: '20-25', count: 12 },
        { name: '26-30', count: 20 },
        { name: '31-35', count: 6 },
        { name: '36+', count: 2 }
      ];

      // Location distribution
      const locationDistribution = [
        { name: 'Jalandhar', count: 10 },
        { name: 'Ludhiana', count: 6 },
        { name: 'Chandigarh', count: 5 },
        { name: 'Kapurthala', count: 4 },
        { name: 'Amritsar', count: 4 },
        { name: 'International', count: 4 }
      ];

      return res.json({
        success: true,
        stats: {
          totalMembers,
          maleMembers,
          femaleMembers,
          pendingProfiles,
          verifiedProfiles,
          activeInterests,
          mutualMatches,
          totalReports
        },
        distributions: {
          age: ageDistribution,
          locations: locationDistribution
        },
        recentActivity: [
          { id: '1', action: 'New Registration', details: 'Joshua Masih registered from Jalandhar', time: '10 mins ago' },
          { id: '2', action: 'Interest Accepted', details: 'David Gill & Priya Sahota mutual match confirmed', time: '1 hour ago' },
          { id: '3', action: 'Verification Requested', details: 'Nathan Bhagat submitted legal credentials', time: '3 hours ago' }
        ]
      });
    }

    // Standard MySQL dashboard metrics
    const [userCounts] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN role = 'USER' THEN 1 ELSE 0 END) as members,
        SUM(CASE WHEN is_verified = 1 THEN 1 ELSE 0 END) as verified
      FROM users
    `);

    const [genderCounts] = await db.query(`
      SELECT gender, COUNT(*) as count FROM profiles GROUP BY gender
    `);

    const [interestCounts] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'ACCEPTED' THEN 1 ELSE 0 END) as mutual
      FROM interests
    `);

    const [reportCounts] = await db.query(`
      SELECT COUNT(*) as pending FROM reports WHERE status = 'PENDING'
    `);

    res.json({
      success: true,
      stats: {
        totalMembers: userCounts[0]?.members || 0,
        verifiedProfiles: userCounts[0]?.verified || 0,
        pendingProfiles: (userCounts[0]?.members || 0) - (userCounts[0]?.verified || 0),
        activeInterests: interestCounts[0]?.total || 0,
        mutualMatches: interestCounts[0]?.mutual || 0,
        totalReports: reportCounts[0]?.pending || 0
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const { search, role, status, verification_status, page = 1, limit = 20 } = req.query;

    if (db.isMock()) {
      const mock = require('../config/mockDb');
      let users = mock.tables.users.map(u => {
        const p = mock.tables.profiles.find(prof => prof.user_id === u.id);
        const f = mock.tables.faith_information.find(faith => faith.profile_id === (p ? p.id : null));
        return {
          id: u.id,
          email: u.email,
          mobile_number: u.mobile_number,
          role: u.role,
          status: u.status,
          is_verified: u.is_verified,
          created_at: u.created_at,
          profile_id: p ? p.id : null,
          first_name: p ? p.first_name : '',
          last_name: p ? p.last_name : '',
          gender: p ? p.gender : '',
          city: p ? p.city : '',
          state: p ? p.state : '',
          occupation: p ? p.occupation : '',
          education_level: p ? p.education_level : '',
          verification_status: p ? p.verification_status : 'PENDING',
          church_name: f ? f.church_name : '',
          denomination: f ? f.denomination : ''
        };
      });

      if (role) users = users.filter(u => u.role === role);
      if (status) users = users.filter(u => u.status === status);
      if (verification_status) users = users.filter(u => u.verification_status === verification_status);
      if (search) {
        const s = search.toLowerCase();
        users = users.filter(u =>
          u.email.toLowerCase().includes(s) ||
          u.first_name.toLowerCase().includes(s) ||
          u.last_name.toLowerCase().includes(s) ||
          u.city.toLowerCase().includes(s)
        );
      }

      return res.json({
        success: true,
        data: users,
        total: users.length
      });
    }

    const [results] = await db.query(`
      SELECT u.id, u.email, u.mobile_number, u.role, u.status, u.is_verified, u.created_at,
             p.id as profile_id, p.first_name, p.last_name, p.gender, p.city, p.state, p.occupation, p.verification_status,
             f.church_name, f.denomination
      FROM users u
      LEFT JOIN profiles p ON p.user_id = u.id
      LEFT JOIN faith_information f ON f.profile_id = p.id
      ORDER BY u.created_at DESC
    `);

    res.json({ success: true, data: results, total: results.length });
  } catch (err) {
    next(err);
  }
};

exports.updateVerificationStatus = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    const { id } = req.params; // profile_id or user_id
    const { status, notes } = req.body; // 'VERIFIED', 'REJECTED', 'UNDER_REVIEW', 'SUSPENDED'

    if (!['VERIFIED', 'REJECTED', 'UNDER_REVIEW', 'SUSPENDED', 'PENDING'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid verification status.' });
    }

    if (db.isMock()) {
      const mock = require('../config/mockDb');
      const profile = mock.tables.profiles.find(p => p.id === id || p.user_id === id);
      if (!profile) return res.status(404).json({ success: false, message: 'Profile not found.' });

      profile.verification_status = status;
      profile.verification_notes = notes || profile.verification_notes;

      const user = mock.tables.users.find(u => u.id === profile.user_id);
      if (user) {
        user.is_verified = status === 'VERIFIED';
        if (status === 'SUSPENDED') user.status = 'SUSPENDED';
        else if (user.status === 'SUSPENDED') user.status = 'ACTIVE';
      }

      // Log action
      await logAdminAction(adminId, `PROFILE_${status}`, 'PROFILE', profile.id, { notes });

      // Notify User
      if (status === 'VERIFIED') {
        await createNotification(
          profile.user_id,
          'Profile Verified by Church Bureau ✓',
          'Congratulations! Your profile has been officially reviewed and verified by The Open Door Church Matrimonial Bureau.',
          'PROFILE_VERIFIED',
          '/dashboard/profile'
        );
      } else if (status === 'REJECTED' || status === 'UNDER_REVIEW') {
        await createNotification(
          profile.user_id,
          'Profile Verification Status Update',
          `Your profile status has been updated to: ${status}. ${notes ? `Note from Bureau: ${notes}` : ''}`,
          'PROFILE_UNDER_REVIEW',
          '/dashboard/edit-profile'
        );
      }

      return res.json({
        success: true,
        message: `Profile verification status successfully set to ${status}.`,
        profile
      });
    }

    // Standard MySQL update
    const [profs] = await db.query('SELECT id, user_id FROM profiles WHERE id = ? OR user_id = ?', [id, id]);
    if (!profs || profs.length === 0) return res.status(404).json({ success: false, message: 'Profile not found.' });

    const p = profs[0];
    await db.query('UPDATE profiles SET verification_status = ?, verification_notes = ? WHERE id = ?', [status, notes || '', p.id]);
    await db.query('UPDATE users SET is_verified = ? WHERE id = ?', [status === 'VERIFIED', p.user_id]);

    await logAdminAction(adminId, `PROFILE_${status}`, 'PROFILE', p.id, { notes });

    res.json({ success: true, message: `Profile verification status updated to ${status}.` });
  } catch (err) {
    next(err);
  }
};

exports.getReports = async (req, res, next) => {
  try {
    if (db.isMock()) {
      const mock = require('../config/mockDb');
      const reports = mock.tables.reports.map(r => {
        const reporter = mock.tables.profiles.find(p => p.user_id === r.reporter_id);
        const reported = mock.tables.profiles.find(p => p.user_id === r.reported_user_id);
        return {
          ...r,
          reporter_name: reporter ? `${reporter.first_name} ${reporter.last_name}` : 'Member',
          reported_name: reported ? `${reported.first_name} ${reported.last_name}` : 'Member'
        };
      });
      return res.json({ success: true, data: reports });
    }

    const [results] = await db.query(`
      SELECT r.*, 
             p1.first_name as reporter_first, p1.last_name as reporter_last,
             p2.first_name as reported_first, p2.last_name as reported_last
      FROM reports r
      LEFT JOIN profiles p1 ON p1.user_id = r.reporter_id
      LEFT JOIN profiles p2 ON p2.user_id = r.reported_user_id
      ORDER BY r.created_at DESC
    `);

    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
};

exports.updateReport = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    const { id } = req.params;
    const { status, admin_notes } = req.body;

    if (db.isMock()) {
      const mock = require('../config/mockDb');
      const report = mock.tables.reports.find(r => r.id === id);
      if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });

      report.status = status || report.status;
      report.admin_notes = admin_notes || report.admin_notes;
      report.resolved_by = adminId;
      report.resolved_at = new Date();

      await logAdminAction(adminId, `REPORT_${status}`, 'REPORT', report.id, { admin_notes });
      return res.json({ success: true, message: 'Report updated successfully.', report });
    }

    await db.query(
      'UPDATE reports SET status = ?, admin_notes = ?, resolved_by = ?, resolved_at = NOW() WHERE id = ?',
      [status, admin_notes, adminId, id]
    );

    res.json({ success: true, message: 'Report updated successfully.' });
  } catch (err) {
    next(err);
  }
};

exports.getAuditLogs = async (req, res, next) => {
  try {
    if (db.isMock()) {
      const mock = require('../config/mockDb');
      return res.json({ success: true, data: mock.tables.admin_audit_logs });
    }

    const [results] = await db.query(`
      SELECT a.*, u.email as admin_email
      FROM admin_audit_logs a
      JOIN users u ON u.id = a.admin_id
      ORDER BY a.created_at DESC
      LIMIT 100
    `);

    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
};

exports.getInterests = async (req, res, next) => {
  try {
    if (db.isMock()) {
      const mock = require('../config/mockDb');
      const list = mock.tables.interests.map(item => {
        const senderUser = mock.tables.users.find(u => u.id === item.sender_id);
        const senderProf = mock.tables.profiles.find(p => p.user_id === item.sender_id);
        const receiverUser = mock.tables.users.find(u => u.id === item.receiver_id);
        const receiverProf = mock.tables.profiles.find(p => p.user_id === item.receiver_id);
        return {
          id: item.id,
          sender_id: item.sender_id,
          receiver_id: item.receiver_id,
          status: item.status,
          message: item.message,
          introduction_requested: item.introduction_requested,
          created_at: item.created_at,
          sender: senderProf ? {
            ...senderProf,
            email: senderUser?.email,
            mobile_number: senderUser?.mobile_number
          } : null,
          receiver: receiverProf ? {
            ...receiverProf,
            email: receiverUser?.email,
            mobile_number: receiverUser?.mobile_number
          } : null
        };
      });
      return res.json({ success: true, data: list });
    }

    const [results] = await db.query(`
      SELECT i.*, 
             s.email as sender_email, s.mobile_number as sender_mobile,
             sp.first_name as sender_first_name, sp.last_name as sender_last_name, sp.city as sender_city, sp.profile_photo as sender_photo,
             r.email as receiver_email, r.mobile_number as receiver_mobile,
             rp.first_name as receiver_first_name, rp.last_name as receiver_last_name, rp.city as receiver_city, rp.profile_photo as receiver_photo
      FROM interests i
      LEFT JOIN users s ON s.id = i.sender_id
      LEFT JOIN profiles sp ON sp.user_id = i.sender_id
      LEFT JOIN users r ON r.id = i.receiver_id
      LEFT JOIN profiles rp ON rp.user_id = i.receiver_id
      ORDER BY i.created_at DESC
    `);
    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
};

exports.updateInterest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, introduction_requested } = req.body;
    if (db.isMock()) {
      const mock = require('../config/mockDb');
      const item = mock.tables.interests.find(i => i.id === id);
      if (!item) return res.status(404).json({ success: false, message: 'Connection not found.' });
      if (status) item.status = status;
      if (typeof introduction_requested === 'boolean') item.introduction_requested = introduction_requested;
      return res.json({ success: true, message: 'Connection updated successfully.', data: item });
    }
    await db.query('UPDATE interests SET status = COALESCE(?, status), introduction_requested = COALESCE(?, introduction_requested) WHERE id = ?', [status, introduction_requested, id]);
    res.json({ success: true, message: 'Connection updated successfully.' });
  } catch (err) {
    next(err);
  }
};
