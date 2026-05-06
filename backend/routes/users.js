const express = require('express')
const router = express.Router()
const supabase = require('../lib/supabase')
const { logAudit } = require('../lib/audit')

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('*, departments(name), teams(name)')
    .order('full_name')
  if (error) return res.status(400).json({ error })
  res.json(data)
})

router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('*, departments(name), teams(name)')
    .eq('id', req.params.id)
    .single()
  if (error) return res.status(400).json({ error })
  res.json(data)
})

router.post('/', async (req, res) => {
  const { email, full_name, role, password, ...employeeData } = req.body

  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email,
    password: password || 'TempPassword123!',
    email_confirm: true,
    user_metadata: { full_name }
  })

  if (authError) return res.status(400).json({ error: authError })

  const { data: userData, error: userError } = await supabase
    .from('users')
    .insert([{
      id: authUser.user.id,
      email,
      full_name,
      role: role || 'user',
      avatar_initials: full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }])
    .select()

  if (userError) return res.status(400).json({ error: userError })

  const { data: employeeRecord, error: empError } = await supabase
    .from('employees')
    .insert([{
      user_id: authUser.user.id,
      ...employeeData
    }])
    .select()

  if (empError) return res.status(400).json({ error: empError })

  await logAudit({
    action: 'user.created',
    recordType: 'user',
    recordId: authUser.user.id,
    newValues: userData[0],
    ipAddress: req.ip
  })

  res.status(201).json({ ...userData[0], employee: employeeRecord[0] })
})

router.patch('/:id', async (req, res) => {
  const { data: old } = await supabase.from('users').select().eq('id', req.params.id).single()
  const { data, error } = await supabase
    .from('users')
    .update({ ...req.body, updated_at: new Date() })
    .eq('id', req.params.id)
    .select()
  if (error) return res.status(400).json({ error })
  await logAudit({
    action: 'user.updated',
    recordType: 'user',
    recordId: req.params.id,
    oldValues: old,
    newValues: data[0],
    ipAddress: req.ip
  })
  res.json(data[0])
})

router.delete('/:id', async (req, res) => {
  const { data: old } = await supabase.from('users').select().eq('id', req.params.id).single()
  const { error } = await supabase.from('users').delete().eq('id', req.params.id)
  if (error) return res.status(400).json({ error })
  await logAudit({
    action: 'user.deleted',
    recordType: 'user',
    recordId: req.params.id,
    oldValues: old,
    ipAddress: req.ip
  })
  res.status(204).send()
})

module.exports = router