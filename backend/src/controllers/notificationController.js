const db = require('../config/db');

exports.getMyNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (db.isMock()) {
      const mock = require('../config/mockDb');
      const userNotifs = mock.tables.notifications.filter(n => n.user_id === userId);
      userNotifs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      const unreadCount = userNotifs.filter(n => !n.is_read).length;

      return res.json({
        success: true,
        data: userNotifs,
        unread_count: unreadCount
      });
    }

    const [results] = await db.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [userId]
    );

    const unreadCount = (results || []).filter(n => !n.is_read).length;

    res.json({
      success: true,
      data: results || [],
      unread_count: unreadCount
    });
  } catch (err) {
    next(err);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (db.isMock()) {
      const mock = require('../config/mockDb');
      if (id === 'all') {
        mock.tables.notifications.forEach(n => {
          if (n.user_id === userId) n.is_read = true;
        });
      } else {
        const notif = mock.tables.notifications.find(n => n.id === id && n.user_id === userId);
        if (notif) notif.is_read = true;
      }
      return res.json({ success: true, message: 'Notification marked as read.' });
    }

    if (id === 'all') {
      await db.query('UPDATE notifications SET is_read = TRUE WHERE user_id = ?', [userId]);
    } else {
      await db.query('UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?', [id, userId]);
    }

    res.json({ success: true, message: 'Notification marked as read.' });
  } catch (err) {
    next(err);
  }
};
