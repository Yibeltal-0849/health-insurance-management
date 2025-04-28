const db = require("../config/db");

async function logUserAction(userId, action, details, ipAddress) {
  try {
    const sql = `
      INSERT INTO logs (user_id, action, details, ip_address)
      VALUES (?, ?, ?, ?)
    `;

    await db.execute(sql, [
      userId, // can be NULL if unknown
      action, // short string like 'login_success', 'claim_created', etc.
      details, // more detailed description
      ipAddress, // IP address from req.ip
    ]);
  } catch (error) {
    console.error("Failed to log user action:", error);
    // Important: DO NOT throw error here, just log it!
    // We don't want log failure to break the app flow.
  }
}

module.exports = {
  logUserAction,
};
