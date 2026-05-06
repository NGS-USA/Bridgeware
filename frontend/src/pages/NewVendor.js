import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../api/client'

function NewVendor() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    name: '',
    type: '',
    status: 'Active',
    website: '',
    phone: '',
    email: '',
    account_number: '',
    payment_terms: '',
    lead_time_days: ''
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
      if (payload.lead_time_days) payload.lead_time_days = parseInt(payload.lead_time_days)
      await client.post('/vendors', payload)
      navigate('/erp')
    } catch (err) {
      setError('Failed to create vendor. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/erp')} className="text-gray-400 hover:text-gray-600 text-sm">
          ← Back
        </button>
        <h1 className="text-xl font-medium text-gray-900">New vendor</h1>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Vendor details</div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-1">Vendor name <span className="text-red-400">*</span></label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            placeholder="e.g. Dell Technologies"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            >
              <option value="">Select type...</option>
              <option>Hardware</option>
              <option>Software</option>
              <option>Cloud services</option>
              <option>Distributor</option>
              <option>Subcontractor</option>
              <option>Other</option>
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
              <option>Active</option>
              <option>Inactive</option>
              <option>On hold</option>
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
              placeholder="vendor.com"
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
            placeholder="contact@vendor.com"
          />
        </div>

        <div className="border-t border-gray-100 my-5"></div>
        <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Account details</div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Account number</label>
            <input
              type="text"
              name="account_number"
              value={form.account_number}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              placeholder="e.g. ACC-123456"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Payment terms</label>
            <select
              name="payment_terms"
              value={form.payment_terms}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            >
              <option value="">Select terms...</option>
              <option>Net 15</option>
              <option>Net 30</option>
              <option>Net 45</option>
              <option>Net 60</option>
              <option>Due on receipt</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-medium text-gray-600 mb-1">Lead time (days)</label>
          <input
            type="number"
            name="lead_time_days"
            value={form.lead_time_days}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            placeholder="e.g. 7"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create vendor'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/erp')}
            className="text-sm text-gray-500 px-5 py-2 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewVendor