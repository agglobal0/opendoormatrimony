const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

exports.submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    const id = uuidv4();

    if (db.isMock()) {
      const mock = require('../config/mockDb');
      const item = {
        id,
        name,
        email,
        phone: phone || '',
        subject: subject || 'General Inquiry',
        message,
        status: 'NEW',
        created_at: new Date()
      };
      mock.tables.contact_requests.unshift(item);
      return res.status(201).json({
        success: true,
        message: 'Your message has been sent to The Open Door Church Matrimonial Bureau. We will respond shortly.',
        data: item
      });
    }

    await db.query(`
      INSERT INTO contact_requests (id, name, email, phone, subject, message, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'NEW', NOW())
    `, [id, name, email, phone || '', subject || 'General Inquiry', message]);

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been submitted. The church matrimonial bureau will contact you.'
    });
  } catch (err) {
    next(err);
  }
};

exports.getContactSubmissions = async (req, res, next) => {
  try {
    if (db.isMock()) {
      const mock = require('../config/mockDb');
      return res.json({ success: true, data: mock.tables.contact_requests });
    }

    const [rows] = await db.query('SELECT * FROM contact_requests ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};
