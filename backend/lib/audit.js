const supabase = require('./supabase')

async function logAudit({ userId, userEmail, action, recordType, recordId, oldValues, newValues, ipAddress, userAgent }) {
  await supabase.from('audit_log').insert([{
    user_id: userId,
    user_email: userEmail,
    action,
    record_type: recordType,
    record_id: recordId,
    old_values: oldValues || null,
    new_values: newValues || null,
    ip_address: ipAddress || null,
    user_agent: userAgent || null
  }])
}

module.exports = { logAudit }