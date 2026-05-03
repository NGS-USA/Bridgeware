const express = require('express')
const router = express.Router()
const supabase = require('../lib/supabase')
const { logAudit } = require('../lib/audit')

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('companies')
    .select('*, contacts(id, first_name, last_name, email)')
    .order('name')
  if (error) return res.status(400).json({ error })
  res.json(data)
})

router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('companies')
    .select('*, contacts(*)')
    .eq('id', req.params.id)
    .single()
  if (error) return res.status(400).json({ error })
  res.json(data)
})

router.post('/', async (req, res) => {
  const { data, error } = await supabase
    .from('companies')
    .insert([req.body])
    .select()
  if (error) return res.status(400).json({ error })
  await logAudit({
    action: 'company.created',
    recordType: 'company',
    recordId: data[0].id,
    newValues: data[0],
    ipAddress: req.ip
  })
  res.status(201).json(data[0])
})

router.patch('/:id', async (req, res) => {
  const { data: old } = await supabase.from('companies').select().eq('id', req.params.id).single()
  const { data, error } = await supabase
    .from('companies')
    .update({ ...req.body, updated_at: new Date() })
    .eq('id', req.params.id)
    .select()
  if (error) return res.status(400).json({ error })
  await logAudit({
    action: 'company.updated',
    recordType: 'company',
    recordId: req.params.id,
    oldValues: old,
    newValues: data[0],
    ipAddress: req.ip
  })
  res.json(data[0])
})

router.delete('/:id', async (req, res) => {
  const { data: old } = await supabase.from('companies').select().eq('id', req.params.id).single()
  const { error } = await supabase.from('companies').delete().eq('id', req.params.id)
  if (error) return res.status(400).json({ error })
  await logAudit({
    action: 'company.deleted',
    recordType: 'company',
    recordId: req.params.id,
    oldValues: old,
    ipAddress: req.ip
  })
  res.status(204).send()
})

module.exports = router