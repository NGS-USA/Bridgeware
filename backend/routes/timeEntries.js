const express = require('express')
const router = express.Router()
const supabase = require('../lib/supabase')
const { logAudit } = require('../lib/audit')

router.get('/', async (req, res) => {
  const { recordType, recordId } = req.query
  let query = supabase
    .from('time_entries')
    .select('*, users(full_name)')
    .order('date', { ascending: false })

  if (recordType) query = query.eq('record_type', recordType)
  if (recordId) query = query.eq('record_id', recordId)

  const { data, error } = await query
  if (error) return res.status(400).json({ error })
  res.json(data)
})

router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('time_entries')
    .select('*, users(full_name)')
    .eq('id', req.params.id)
    .single()
  if (error) return res.status(400).json({ error })
  res.json(data)
})

router.post('/', async (req, res) => {
  const { data, error } = await supabase
    .from('time_entries')
    .insert([req.body])
    .select()
  if (error) return res.status(400).json({ error })
  await logAudit({
    action: 'time_entry.created',
    recordType: req.body.record_type,
    recordId: req.body.record_id,
    newValues: data[0],
    ipAddress: req.ip
  })
  res.status(201).json(data[0])
})

router.patch('/:id', async (req, res) => {
  const { data: old } = await supabase.from('time_entries').select().eq('id', req.params.id).single()
  const { data, error } = await supabase
    .from('time_entries')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
  if (error) return res.status(400).json({ error })
  await logAudit({
    action: 'time_entry.updated',
    recordType: 'time_entry',
    recordId: req.params.id,
    oldValues: old,
    newValues: data[0],
    ipAddress: req.ip
  })
  res.json(data[0])
})

router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('time_entries').delete().eq('id', req.params.id)
  if (error) return res.status(400).json({ error })
  res.status(204).send()
})

module.exports = router