const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

/**
 * Generate stylized Christian Matrimony Transactional Email Template
 */
function buildMatrimonyEmailHtml(recipientName, title, messageBody, actionLabel, actionUrl) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }
      .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
      .header { background-color: #0B1B3D; padding: 28px; text-align: center; color: #ffffff; }
      .church-title { font-size: 20px; font-weight: bold; margin: 0; font-family: Georgia, serif; color: #f8fafc; }
      .church-subtitle { font-size: 11px; text-transform: uppercase; color: #d4af37; letter-spacing: 1.5px; margin-top: 4px; }
      .scripture { font-style: italic; font-size: 11px; color: #cbd5e1; margin-top: 10px; }
      .content { padding: 32px 28px; color: #334155; line-height: 1.6; font-size: 14px; }
      .greeting { font-size: 16px; font-weight: bold; color: #0B1B3D; margin-bottom: 12px; }
      .btn { display: inline-block; background-color: #0B1B3D; color: #ffffff !important; padding: 12px 24px; border-radius: 10px; font-weight: bold; font-size: 13px; text-decoration: none; margin-top: 20px; box-shadow: 0 2px 6px rgba(11,27,61,0.2); }
      .footer { background-color: #f1f5f9; padding: 18px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 class="church-title">THE OPEN DOOR CHURCH</h1>
        <div class="church-subtitle">Christian Matrimonial Bureau • Khojewala</div>
        <div class="scripture">“Therefore what God has joined together, let no one separate.” — Mark 10:9</div>
      </div>
      <div class="content">
        <div class="greeting">Praise the Lord, ${recipientName || 'Beloved in Christ'}!</div>
        <h3 style="color: #0B1B3D; margin-top: 0;">${title}</h3>
        <p>${messageBody}</p>
        ${actionUrl ? `<div style="text-align: center;"><a href="${actionUrl}" class="btn">${actionLabel || 'View in Dashboard'} →</a></div>` : ''}
      </div>
      <div class="footer">
        <strong>The Open Door Church, Khojewala</strong><br>
        Kapurthala - Jalandhar Road, Punjab, India<br>
        Confidential & Supervised Christian Matrimonial Ministry
      </div>
    </div>
  </body>
  </html>
  `;
}

/**
 * Dispatch Transactional Email (Logs & Hooks for SMTP / SendGrid / AWS SES)
 */
async function sendTransactionalEmail(toEmail, recipientName, title, messageBody, actionLabel, actionUrl) {
  const htmlContent = buildMatrimonyEmailHtml(recipientName, title, messageBody, actionLabel, actionUrl);
  
  console.log(`\n===========================================================`);
  console.log(`[TRANSACTIONAL EMAIL ALERT]`);
  console.log(`To: ${toEmail} (${recipientName || 'Member'})`);
  console.log(`Subject: [Open Door Matrimony] ${title}`);
  console.log(`Action Link: ${actionUrl || 'N/A'}`);
  console.log(`===========================================================\n`);
  
  return { success: true, dispatchedAt: new Date() };
}

/**
 * Create In-App Notification & Trigger Email Alert
 */
async function createNotification(userId, title, message, type, linkUrl = null) {
  const id = uuidv4();
  const sql = `
    INSERT INTO notifications (id, user_id, title, message, type, link_url, is_read, created_at)
    VALUES (?, ?, ?, ?, ?, ?, FALSE, NOW())
  `;
  try {
    let targetEmail = null;
    let targetName = 'Member';

    if (db.isMock()) {
      const mock = require('../config/mockDb');
      const user = mock.tables.users.find(u => u.id === userId);
      const profile = mock.tables.profiles.find(p => p.user_id === userId);

      if (user) targetEmail = user.email;
      if (profile) targetName = profile.first_name;

      mock.tables.notifications.unshift({
        id,
        user_id: userId,
        title,
        message,
        type,
        link_url: linkUrl,
        is_read: false,
        created_at: new Date()
      });
    } else {
      await db.query(sql, [id, userId, title, message, type, linkUrl]);
      const [users] = await db.query(
        'SELECT u.email, p.first_name FROM users u LEFT JOIN profiles p ON p.user_id = u.id WHERE u.id = ?',
        [userId]
      );
      if (users && users.length > 0) {
        targetEmail = users[0].email;
        targetName = users[0].first_name || 'Member';
      }
    }

    // Trigger Automated Email Alert if recipient has an email address
    if (targetEmail) {
      const fullLink = linkUrl ? `http://localhost:5173${linkUrl}` : 'http://localhost:5173/dashboard';
      await sendTransactionalEmail(
        targetEmail,
        targetName,
        title,
        message,
        'Open Matrimonial Portal',
        fullLink
      );
    }

    return { id, success: true };
  } catch (err) {
    console.error('Error creating notification:', err.message);
    return { success: false, error: err.message };
  }
}

module.exports = {
  createNotification,
  sendTransactionalEmail
};
