const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

async function logAdminAction(adminId, action, targetType, targetId, details = {}, ipAddress = null) {
  const id = uuidv4();
  const sql = `
    INSERT INTO admin_audit_logs (id, admin_id, action, target_type, target_id, details_json, ip_address, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
  `;
  try {
    if (db.isMock()) {
      const mock = require('../config/mockDb');
      mock.tables.admin_audit_logs.unshift({
        id,
        admin_id: adminId,
        action,
        target_type: targetType,
        target_id: targetId,
        details_json: details,
        ip_address: ipAddress,
        created_at: new Date()
      });
      return true;
    }
    await db.query(sql, [id, adminId, action, targetType, targetId, JSON.stringify(details), ipAddress]);
    return true;
  } catch (err) {
    console.error('Audit Log Error:', err.message);
    return false;
  }
}

module.exports = {
  logAdminAction
};
