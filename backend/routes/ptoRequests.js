const express = require('express')
const router = express.Router()
const supabase = require('../lib/supabase')
const { logAudit } = require('../lib/audit')

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('pto_requests')
    .select('*, users(full_name)')
    .order('created_at', { ascending: false })
  if (error) return res.status(400).json({ error })
  res.json(data)
})

router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('pto_requests')
    .select('*, users(full_name)')
    .eq('id', req.params.id)
    .single()
  if (error) return res.status(400).json({ error })
  res.json(data)
})

router.post('/', async (req, res) => {
  const { data, error } = await supabase
    .from('pto_requests')
    .insert([req.body])
    .select()
  if (error) return res.status(400).json({ error })
  await logAudit({
    action: 'pto_request.created',
    recordType: 'pto_request',
    recordId: data[0].id,
    newValues: data[0],
    ipAddress: req.ip
  })
  res.status(201).json(data[0])
})

router.patch('/:id', async (req, res) => {
  const { data: old } = await supabase.from('pto_requests').select().eq('id', req.params.id).single()
  const { data, error } = await supabase
    .from('pto_requests')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
  if (error) return res.status(400).json({ error })
  await logAudit({
    action: 'pto_request.updated',
    recordType: 'pto_request',
    recordId: req.params.id,
    oldValues: old,
    newValues: data[0],
    ipAddress: req.ip
  })
  res.json(data[0])
})

router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('pto_requests').delete().eq('id', req.params.id)
  if (error) return res.status(400).json({ error })
  res.status(204).send()
})

module.exports = router