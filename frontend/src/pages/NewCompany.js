import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../api/client'

function NewCompany() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    name: '',
    category: '',
    status: 'Lead',
    website: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    mrr: ''
  })

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
      await client.post('/companies', payload)
      navigate('/crm')
    } catch (err) {
      setError('Failed to create company. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/crm')} className="text-gray-400 hover:text-gray-600 text-sm">
          ← Back
        </button>
        <h1 className="text-xl font-medium text-gray-900">New company</h1>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-1">Company name <span className="text-red-400">*</span></label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            placeholder="e.g. Acme Corp"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            >
              <option value="">Select category...</option>
              <option>MSP</option>
              <option>SMB</option>
              <option>Enterprise</option>
              <option>Government</option>
              <option>Non-profit</option>
              <option>Partner</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            >
              <option>Lead</option>
              <option>Prospect</option>
              <option>Active client</option>
              <option>Churned</option>
              <option>Partner</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Website</label>
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              placeholder="acmecorp.com"
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

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            placeholder="info@acmecorp.com"
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            placeholder="123 Main Street"
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">City</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              placeholder="New York"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">State</label>
            <input
              type="text"
              name="state"
              value={form.state}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              placeholder="NY"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">ZIP</label>
            <input
              type="text"
              name="zip"
              value={form.zip}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              placeholder="10001"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-medium text-gray-600 mb-1">Monthly recurring revenue (MRR)</label>
          <input
            type="number"
            name="mrr"
            value={form.mrr}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            placeholder="0"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create company'}
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

export default NewCompany