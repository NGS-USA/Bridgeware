const express = require('express')
const router = express.Router()
const supabase = require('../lib/supabase')
const { logAudit } = require('../lib/audit')

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('tickets')
    .select('*, companies(name), users(full_name), teams(name)')
    .order('created_at', { ascending: false })
  if (error) return res.status(400).json({ error })
  res.json(data)
})

router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('tickets')
    .select('*, companies(*), contacts(*), users(full_name), teams(name)')
    .eq('id', req.params.id)
    .single()
  if (error) return res.status(400).json({ error })
  res.json(data)
})

router.post('/', async (req, res) => {
  const { data, error } = await supabase
    .from('tickets')
    .insert([req.body])
    .select()
  if (error) return res.status(400).json({ error })
  await logAudit({
    action: 'ticket.created',
    recordType: 'ticket',
    recordId: data[0].id,
    newValues: data[0],
    ipAddress: req.ip
  })
  res.status(201).json(data[0])
})

router.patch('/:id', async (req, res) => {
  const { data: old } = await supabase.from('tickets').select().eq('id', req.params.id).single()
  const { data, error } = await supabase
    .from('tickets')
    .update({ ...req.body, updated_at: new Date() })
    .eq('id', req.params.id)
    .select()
  if (error) return res.status(400).json({ error })
  await logAudit({
    action: 'ticket.updated',
    recordType: 'ticket',
    recordId: req.params.id,
    oldValues: old,
    newValues: data[0],
    ipAddress: req.ip
  })
  res.json(data[0])
})

router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('tickets').delete().eq('id', req.params.id)
  if (error) return res.status(400).json({ error })
  await logAudit({
    action: 'ticket.deleted',
    recordType: 'ticket',
    recordId: req.params.id,
    ipAddress: req.ip
  })
  res.status(204).send()
})

// Get replies for a ticket
router.get('/:id/replies', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ticket_replies')
      .select('*')
      .eq('ticket_id', req.params.id)
      .order('created_at', { ascending: true })
    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Post a reply to a ticket
router.post('/:id/replies', async (req, res) => {
  const { message, author_name } = req.body
  try {
    const { data, error } = await supabase
      .from('ticket_replies')
      .insert([{ ticket_id: req.params.id, message, author_name }])
      .select()
      .single()
    if (error) throw error
    res.status(201).json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router