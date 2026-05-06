const express = require('express')
const router = express.Router()
const supabase = require('../lib/supabase')

router.get('/', async (req, res) => {
  const { limit = 100, offset = 0, record_type, action } = req.query

  let query = supabase
    .from('audit_log')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (record_type) query = query.eq('record_type', record_type)
  if (action) query = query.ilike('action', `%${action}%`)

  const { data, error } = await query
  if (error) return res.status(400).json({ error })
  res.json(data)
})

module.exports = router