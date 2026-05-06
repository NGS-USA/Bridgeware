import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import client from '../api/client'

function NewPTORequest() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    type: 'Vacation',
    start_date: '',
    end_date: '',
    note: '',
    user_id: ''
  })

  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => client.get('/users').then(res => res.data)
  })

  const users = Array.isArray(usersData) ? usersData : []

  const calculateDays = () => {
    if (!form.start_date || !form.end_date) return 0
    const start = new Date(form.start_date)
    const end = new Date(form.end_date)
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
    return diff > 0 ? diff : 0
  }

  const days = calculateDays()

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
      payload.days = days
      payload.status = 'Pending'
      await client.post('/pto-requests', payload)
      navigate('/hr')
    } catch (err) {
      setError('Failed to submit PTO request. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/hr')} className="text-gray-400 hover:text-gray-600 text-sm">
          ← Back
        </button>
        <h1 className="text-xl font-medium text-gray-900">New PTO request</h1>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-1">Employee <span className="text-red-400">*</span></label>
          <select
            name="user_id"
            value={form.user_id}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
          >
            <option value="">Select employee...</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.full_name}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-1">Leave type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
          >
            <option>Vacation</option>
            <option>Sick leave</option>
            <option>Personal</option>
            <option>Bereavement</option>
            <option>Jury duty</option>
            <option>Unpaid</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Start date <span className="text-red-400">*</span></label>
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">End date <span className="text-red-400">*</span></label>
            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>

        {days > 0 && (
          <div className="bg-blue-50 text-blue-700 text-sm px-3 py-2 rounded mb-4">
            {days} day{days !== 1 ? 's' : ''} requested
          </div>
        )}

        <div className="mb-6">
          <label className="block text-xs font-medium text-gray-600 mb-1">Note</label>
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none"
            placeholder="Optional note for your manager..."
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || days === 0}
            className="bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit request'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/hr')}
            className="text-sm text-gray-500 px-5 py-2 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewPTORequest