const express = require('express')
const router = express.Router()
const supabase = require('../lib/supabase')
const { logAudit } = require('../lib/audit')

router.get('/', async (req, res) => {
  const { recordType, recordId } = req.query
  let query = supabase
    .from('notes')
    .select('*, users(full_name)')
    .order('created_at', { ascending: false })

  if (recordType) query = query.eq('record_type', recordType)
  if (recordId) query = query.eq('record_id', recordId)

  const { data, error } = await query
  if (error) return res.status(400).json({ error })
  res.json(data)
})

router.post('/', async (req, res) => {
  const { data, error } = await supabase
    .from('notes')
    .insert([req.body])
    .select()
  if (error) return res.status(400).json({ error })
  await logAudit({
    action: 'note.created',
    recordType: req.body.record_type,
    recordId: req.body.record_id,
    newValues: data[0],
    ipAddress: req.ip
  })
  res.status(201).json(data[0])
})

router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('notes').delete().eq('id', req.params.id)
  if (error) return res.status(400).json({ error })
  res.status(204).send()
})

module.exports = router