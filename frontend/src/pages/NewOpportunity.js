import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import client from '../api/client'

function NewOpportunity() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    title: '',
    status: 'Prospect',
    value: '',
    probability: '',
    close_date: '',
    company_id: '',
    contact_id: '',
    assigned_to: '',
    team_id: ''
  })

  const { data: companiesData } = useQuery({
    queryKey: ['companies'],
    queryFn: () => client.get('/companies').then(res => res.data)
  })

  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => client.get('/users').then(res => res.data)
  })

  const { data: teamsData } = useQuery({
    queryKey: ['teams'],
    queryFn: () => client.get('/teams').then(res => res.data)
  })

  const { data: contactsData } = useQuery({
    queryKey: ['contacts', form.company_id],
    queryFn: () => client.get('/contacts').then(res => res.data),
    enabled: !!form.company_id
  })

  const companies = Array.isArray(companiesData) ? companiesData : []
  const users = Array.isArray(usersData) ? usersData : []
  const teams = Array.isArray(teamsData) ? teamsData : []
  const contacts = Array.isArray(contactsData)
    ? contactsData.filter(c => c.company_id === form.company_id)
    : []

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload = Object.fromEntries(
        Object.entries(form).filter(([_, v]) => v !== '')
      )
      if (payload.value) payload.value = parseFloat(payload.value)
      if (payload.probability) payload.probability = parseInt(payload.probability)
      await client.post('/opportunities', payload)
      navigate('/sales')
    } catch (err) {
      setError('Failed to create opportunity. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/sales')} className="text-gray-400 hover:text-gray-600 text-sm">
          ← Back
        </button>
        <h1 className="text-xl font-medium text-gray-900">New opportunity</h1>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-1">Title <span className="text-red-400">*</span></label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            placeholder="e.g. Managed IT renewal 2027"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            >
              <option>Prospect</option>
              <option>Qualify</option>
              <option>Propose</option>
              <option>Negotiate</option>
              <option>Won</option>
              <option>Lost</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Close date</label>
            <input
              type="date"
              name="close_date"
              value={form.close_date}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Value ($)</label>
            <input
              type="number"
              name="value"
              value={form.value}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Probability (%)</label>
            <input
              type="number"
              name="probability"
              value={form.probability}
              onChange={handleChange}
              min="0"
              max="100"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Company</label>
            <select
              name="company_id"
              value={form.company_id}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            >
              <option value="">Select company...</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Contact</label>
            <select
              name="contact_id"
              value={form.contact_id}
              onChange={handleChange}
              disabled={!form.company_id}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">Select contact...</option>
              {contacts.map(c => (
                <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Assigned to</label>
            <select
              name="assigned_to"
              value={form.assigned_to}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            >
              <option value="">Select user...</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.full_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Team</label>
            <select
              name="team_id"
              value={form.team_id}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            >
              <option value="">Select team...</option>
              {teams.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create opportunity'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/sales')}
            className="text-sm text-gray-500 px-5 py-2 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewOpportunity