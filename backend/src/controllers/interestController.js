const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { createNotification } = require('../services/notificationService');
const { sanitizeProfileForPublic } = require('../utils/privacy');

exports.sendInterest = async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const { receiver_id, message } = req.body;

    if (!receiver_id) {
      return res.status(400).json({ success: false, message: 'Receiver user ID is required.' });
    }

    if (senderId === receiver_id) {
      return res.status(400).json({ success: false, message: 'You cannot express interest in your own profile.' });
    }

    if (db.isMock()) {
      const mock = require('../config/mockDb');
      const senderUser = mock.tables.users.find(u => u.id === senderId);

      // Membership Gate Check: Sender must have an active membership or credits (unless Admin)
      const hasActiveMembership = senderUser && (
        senderUser.is_membership_active || 
        senderUser.membership_tier !== 'FREE' || 
        (senderUser.connect_credits && senderUser.connect_credits > 0)
      );

      if (!hasActiveMembership && req.user.role !== 'SUPER_ADMIN' && req.user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          requires_membership: true,
          message: 'A Church Bureau Matrimonial Membership is required to initiate connection requests. Please choose a membership plan.'
        });
      }

      const existing = mock.tables.interests.find(
        i => (i.sender_id === senderId && i.receiver_id === receiver_id) ||
             (i.sender_id === receiver_id && i.receiver_id === senderId)
      );

      if (existing) {
        if (existing.status === 'ACCEPTED') {
          return res.status(400).json({ success: false, message: 'You already have mutual interest with this profile.' });
        }
        if (existing.sender_id === senderId) {
          return res.status(400).json({ success: false, message: 'You have already sent an interest request to this profile.' });
        }
      }

      // Deduct credit if non-unlimited plan
      if (senderUser && senderUser.connect_credits > 0 && senderUser.connect_credits < 900) {
        senderUser.connect_credits -= 1;
      }

      const senderProfile = mock.tables.profiles.find(p => p.user_id === senderId);
      const interestId = uuidv4();
      const newInterest = {
        id: interestId,
        sender_id: senderId,
        receiver_id,
        status: 'PENDING',
        message: message || 'Praise the Lord. I am interested in your matrimonial profile.',
        introduction_requested: false,
        created_at: new Date()
      };

      mock.tables.interests.push(newInterest);

      const senderName = senderProfile ? `${senderProfile.first_name} ${senderProfile.last_name ? senderProfile.last_name[0] + '.' : ''}` : 'A member';
      await createNotification(
        receiver_id,
        'New Express Interest Received',
        `${senderName} expressed matrimonial interest in your profile. Review in your dashboard.`,
        'INTEREST_RECEIVED',
        '/dashboard/interests'
      );

      return res.status(201).json({
        success: true,
        message: 'Interest expressed successfully. The candidate has been notified.',
        interest: newInterest,
        remaining_credits: senderUser ? senderUser.connect_credits : 0
      });
    }

    // MySQL flow
    const [existing] = await db.query(
      'SELECT id, status, sender_id FROM interests WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)',
      [senderId, receiver_id, receiver_id, senderId]
    );

    if (existing && existing.length > 0) {
      return res.status(400).json({ success: false, message: 'An interest relationship already exists between these profiles.' });
    }

    const interestId = uuidv4();
    await db.query(
      'INSERT INTO interests (id, sender_id, receiver_id, status, message, created_at) VALUES (?, ?, ?, "PENDING", ?, NOW())',
      [interestId, senderId, receiver_id, message || 'Praise the Lord. I am interested in your profile.']
    );

    const [senderProf] = await db.query('SELECT first_name, last_name FROM profiles WHERE user_id = ?', [senderId]);
    const name = senderProf.length > 0 ? `${senderProf[0].first_name} ${senderProf[0].last_name[0]}.` : 'A member';

    await createNotification(
      receiver_id,
      'New Express Interest Received',
      `${name} expressed matrimonial interest in your profile.`,
      'INTEREST_RECEIVED',
      '/dashboard/interests'
    );

    res.status(201).json({ success: true, message: 'Interest expressed successfully.' });
  } catch (err) {
    next(err);
  }
};

exports.getReceivedInterests = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (db.isMock()) {
      const mock = require('../config/mockDb');
      const received = mock.tables.interests.filter(i => i.receiver_id === userId);

      const mapped = received.map(item => {
        const senderProf = mock.tables.profiles.find(p => p.user_id === item.sender_id);
        const user = mock.tables.users.find(u => u.id === item.sender_id);
        const faith = mock.tables.faith_information.find(f => f.profile_id === (senderProf ? senderProf.id : null));

        const fullProf = senderProf ? { ...senderProf, ...(faith || {}), user_email: user?.email, user_phone: user?.mobile_number } : null;
        return {
          ...item,
          sender: fullProf ? sanitizeProfileForPublic(fullProf, req.user, item.status === 'ACCEPTED') : null
        };
      });

      return res.json({ success: true, data: mapped });
    }

    const [results] = await db.query(`
      SELECT i.*, p.first_name, p.last_name, p.city, p.state, p.occupation, p.education_level, p.dob, p.profile_photo, p.verification_status,
             f.church_name, f.denomination
      FROM interests i
      JOIN profiles p ON p.user_id = i.sender_id
      LEFT JOIN faith_information f ON f.profile_id = p.id
      WHERE i.receiver_id = ?
      ORDER BY i.created_at DESC
    `, [userId]);

    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
};

exports.getSentInterests = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (db.isMock()) {
      const mock = require('../config/mockDb');
      const sent = mock.tables.interests.filter(i => i.sender_id === userId);

      const mapped = sent.map(item => {
        const receiverProf = mock.tables.profiles.find(p => p.user_id === item.receiver_id);
        const user = mock.tables.users.find(u => u.id === item.receiver_id);
        const faith = mock.tables.faith_information.find(f => f.profile_id === (receiverProf ? receiverProf.id : null));

        const fullProf = receiverProf ? { ...receiverProf, ...(faith || {}), user_email: user?.email, user_phone: user?.mobile_number } : null;
        return {
          ...item,
          receiver: fullProf ? sanitizeProfileForPublic(fullProf, req.user, item.status === 'ACCEPTED') : null
        };
      });

      return res.json({ success: true, data: mapped });
    }

    const [results] = await db.query(`
      SELECT i.*, p.first_name, p.last_name, p.city, p.state, p.occupation, p.education_level, p.dob, p.profile_photo, p.verification_status,
             f.church_name, f.denomination
      FROM interests i
      JOIN profiles p ON p.user_id = i.receiver_id
      LEFT JOIN faith_information f ON f.profile_id = p.id
      WHERE i.sender_id = ?
      ORDER BY i.created_at DESC
    `, [userId]);

    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
};

exports.respondToInterest = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { status } = req.body; // 'ACCEPTED' or 'DECLINED'

    if (!['ACCEPTED', 'DECLINED', 'WITHDRAWN'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid interest status.' });
    }

    if (db.isMock()) {
      const mock = require('../config/mockDb');
      const interest = mock.tables.interests.find(i => i.id === id);

      if (!interest) return res.status(404).json({ success: false, message: 'Interest record not found.' });

      if (status === 'WITHDRAWN' && interest.sender_id !== userId) {
        return res.status(403).json({ success: false, message: 'Only the sender can withdraw an interest request.' });
      }
      if ((status === 'ACCEPTED' || status === 'DECLINED') && interest.receiver_id !== userId) {
        return res.status(403).json({ success: false, message: 'Only the recipient can accept or decline.' });
      }

      interest.status = status;
      interest.updated_at = new Date();

      if (status === 'ACCEPTED') {
        const receiverProfile = mock.tables.profiles.find(p => p.user_id === userId);
        const name = receiverProfile ? `${receiverProfile.first_name} ${receiverProfile.last_name ? receiverProfile.last_name[0] + '.' : ''}` : 'Your match';
        await createNotification(
          interest.sender_id,
          'Interest Accepted! Mutual Match Established',
          `${name} accepted your matrimonial interest. You can now request a church-facilitated introduction.`,
          'INTEREST_ACCEPTED',
          '/dashboard/interests'
        );
      }

      return res.json({ success: true, message: `Interest marked as ${status.toLowerCase()}.`, interest });
    }

    await db.query('UPDATE interests SET status = ?, updated_at = NOW() WHERE id = ?', [status, id]);
    res.json({ success: true, message: `Interest marked as ${status.toLowerCase()}.` });
  } catch (err) {
    next(err);
  }
};

exports.requestIntroduction = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (db.isMock()) {
      const mock = require('../config/mockDb');
      const interest = mock.tables.interests.find(i => i.id === id);

      if (!interest || (interest.sender_id !== userId && interest.receiver_id !== userId)) {
        return res.status(404).json({ success: false, message: 'Interest not found or unauthorized.' });
      }

      if (interest.status !== 'ACCEPTED') {
        return res.status(400).json({ success: false, message: 'Introduction can only be requested after mutual interest is accepted.' });
      }

      interest.introduction_requested = true;

      // Notify the church admin & pastoral committee
      const otherUserId = interest.sender_id === userId ? interest.receiver_id : interest.sender_id;
      await createNotification(
        otherUserId,
        'Pastoral Introduction Requested',
        'Your mutual match has requested pastoral bureau assistance for a family introduction.',
        'INTRODUCTION_FACILITATED',
        '/dashboard/interests'
      );

      return res.json({
        success: true,
        message: 'Introduction requested. The Church Matrimonial Bureau has been notified to facilitate family contact.'
      });
    }

    await db.query('UPDATE interests SET introduction_requested = TRUE WHERE id = ?', [id]);
    res.json({ success: true, message: 'Introduction requested successfully.' });
  } catch (err) {
    next(err);
  }
};
