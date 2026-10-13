const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { sanitizeProfileForPublic } = require('../utils/privacy');

exports.getSavedProfiles = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (db.isMock()) {
      const mock = require('../config/mockDb');
      const saved = mock.tables.saved_profiles.filter(s => s.user_id === userId);

      const mapped = saved.map(item => {
        const prof = mock.tables.profiles.find(p => p.user_id === item.saved_user_id);
        const faith = mock.tables.faith_information.find(f => f.profile_id === (prof ? prof.id : null));
        const fullProf = prof ? { ...prof, ...(faith || {}) } : null;

        return {
          id: item.id,
          saved_at: item.created_at,
          profile: fullProf ? sanitizeProfileForPublic(fullProf, req.user) : null
        };
      }).filter(i => i.profile !== null);

      return res.json({ success: true, data: mapped });
    }

    const [results] = await db.query(`
      SELECT s.id as saved_id, s.created_at as saved_at,
             p.*, f.church_name, f.denomination
      FROM saved_profiles s
      JOIN profiles p ON p.user_id = s.saved_user_id
      LEFT JOIN faith_information f ON f.profile_id = p.id
      WHERE s.user_id = ?
      ORDER BY s.created_at DESC
    `, [userId]);

    const mapped = (results || []).map(r => ({
      id: r.saved_id,
      saved_at: r.saved_at,
      profile: sanitizeProfileForPublic(r, req.user)
    }));

    res.json({ success: true, data: mapped });
  } catch (err) {
    next(err);
  }
};

exports.toggleSaveProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { profileId } = req.params; // Can be user_id or profile_id

    if (db.isMock()) {
      const mock = require('../config/mockDb');
      const targetProf = mock.tables.profiles.find(p => p.id === profileId || p.user_id === profileId);
      if (!targetProf) return res.status(404).json({ success: false, message: 'Profile not found.' });

      const targetUserId = targetProf.user_id;
      const index = mock.tables.saved_profiles.findIndex(s => s.user_id === userId && s.saved_user_id === targetUserId);

      if (index >= 0) {
        mock.tables.saved_profiles.splice(index, 1);
        return res.json({ success: true, is_saved: false, message: 'Profile removed from your saved list.' });
      } else {
        mock.tables.saved_profiles.push({
          id: uuidv4(),
          user_id: userId,
          saved_user_id: targetUserId,
          created_at: new Date()
        });
        return res.json({ success: true, is_saved: true, message: 'Profile saved to your bookmarked list.' });
      }
    }

    // Standard MySQL flow
    const [profs] = await db.query('SELECT user_id FROM profiles WHERE id = ? OR user_id = ?', [profileId, profileId]);
    if (!profs || profs.length === 0) return res.status(404).json({ success: false, message: 'Profile not found.' });

    const targetUserId = profs[0].user_id;
    const [existing] = await db.query('SELECT id FROM saved_profiles WHERE user_id = ? AND saved_user_id = ?', [userId, targetUserId]);

    if (existing && existing.length > 0) {
      await db.query('DELETE FROM saved_profiles WHERE id = ?', [existing[0].id]);
      return res.json({ success: true, is_saved: false, message: 'Profile removed from saved list.' });
    } else {
      await db.query('INSERT INTO saved_profiles (id, user_id, saved_user_id, created_at) VALUES (?, ?, ?, NOW())', [uuidv4(), userId, targetUserId]);
      return res.json({ success: true, is_saved: true, message: 'Profile saved successfully.' });
    }
  } catch (err) {
    next(err);
  }
};
