import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import client from '../api/client'

function NewContact() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    title: '',
    company_id: '',
    is_primary: false
  })

  const { data: companiesData } = useQuery({
    queryKey: ['companies'],
    queryFn: () => client.get('/companies').then(res => res.data)
  })

  const companies = Array.isArray(companiesData) ? companiesData : []

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm({ ...form, [e.target.name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload = Object.fromEntries(
        Object.entries(form).filter(([_, v]) => v !== '')
      )
      await client.post('/contacts', payload)
      navigate('/crm')
    } catch (err) {
      setError('Failed to create contact. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/crm')} className="text-gray-400 hover:text-gray-600 text-sm">
          ← Back
        </button>
        <h1 className="text-xl font-medium text-gray-900">New contact</h1>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">First name <span className="text-red-400">*</span></label>
            <input
              type="text"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              placeholder="John"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Last name <span className="text-red-400">*</span></label>
            <input
              type="text"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              placeholder="Smith"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-1">Company <span className="text-red-400">*</span></label>
          <select
            name="company_id"
            value={form.company_id}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
          >
            <option value="">Select company...</option>
            {companies.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-1">Job title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            placeholder="e.g. IT Manager"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              placeholder="john@acmecorp.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_primary"
              checked={form.is_primary}
              onChange={handleChange}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-600">Set as primary contact for this company</span>
          </label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create contact'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/crm')}
            className="text-sm text-gray-500 px-5 py-2 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewContact