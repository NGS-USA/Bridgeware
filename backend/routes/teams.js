const express = require('express')
const router = express.Router()
const supabase = require('../lib/supabase')
const { logAudit } = require('../lib/audit')

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('teams')
    .select('*, departments(name), users(full_name), team_members(user_id, users(full_name))')
    .order('name')
  if (error) return res.status(400).json({ error })
  res.json(data)
})

router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('teams')
    .select('*, departments(name), users(full_name), team_members(user_id, users(full_name))')
    .eq('id', req.params.id)
    .single()
  if (error) return res.status(400).json({ error })
  res.json(data)
})

router.post('/', async (req, res) => {
  const { data, error } = await supabase
    .from('teams')
    .insert([req.body])
    .select()
  if (error) return res.status(400).json({ error })
  await logAudit({
    action: 'team.created',
    recordType: 'team',
    recordId: data[0].id,
    newValues: data[0],
    ipAddress: req.ip
  })
  res.status(201).json(data[0])
})

router.patch('/:id', async (req, res) => {
  const { data: old } = await supabase.from('teams').select().eq('id', req.params.id).single()
  const { data, error } = await supabase
    .from('teams')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
  if (error) return res.status(400).json({ error })
  await logAudit({
    action: 'team.updated',
    recordType: 'team',
    recordId: req.params.id,
    oldValues: old,
    newValues: data[0],
    ipAddress: req.ip
  })
  res.json(data[0])
})

router.delete('/:id', async (req, res) => {
  const { data: old } = await supabase.from('teams').select().eq('id', req.params.id).single()
  const { error } = await supabase.from('teams').delete().eq('id', req.params.id)
  if (error) return res.status(400).json({ error })
  await logAudit({
    action: 'team.deleted',
    recordType: 'team',
    recordId: req.params.id,
    oldValues: old,
    ipAddress: req.ip
  })
  res.status(204).send()
})

module.exports = router