const express = require('express')
const router = express.Router()
const supabase = require('../lib/supabase')
const { logAudit } = require('../lib/audit')

// Get permissions for a company
router.get('/:companyId', async (req, res) => {
  const { data, error } = await supabase
    .from('portal_permissions')
    .select('*')
    .eq('company_id', req.params.companyId)
    .single()

  if (error && error.code === 'PGRST116') {
    // No row yet — return defaults
    return res.json({
      company_id: req.params.companyId,
      show_tickets: true,
      show_invoices: true,
      show_quotes: true,
      show_documents: true
    })
  }

  if (error) return res.status(400).json({ error })
  res.json(data)
})

// Save (upsert) permissions for a company
router.post('/:companyId', async (req, res) => {
  const { show_tickets, show_invoices, show_quotes, show_documents } = req.body

  const { data, error } = await supabase
    .from('portal_permissions')
    .upsert({
      company_id: req.params.companyId,
      show_tickets,
      show_invoices,
      show_quotes,
      show_documents,
      updated_at: new Date()
    }, { onConflict: 'company_id' })
    .select()
    .single()

  if (error) return res.status(400).json({ error })

  await logAudit({
    action: 'portal_permissions.updated',
    recordType: 'portal_permissions',
    recordId: data.id,
    newValues: data,
    ipAddress: req.ip
  })

  res.json(data)
})

module.exports = router