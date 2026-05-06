import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import client from '../api/client'

const COUNTRY_CODES = [
  { code: '+1', country: 'US/CA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+55', country: 'BR', flag: '🇧🇷' },
  { code: '+52', country: 'MX', flag: '🇲🇽' },
]

function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

function NewCompany() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [countryCode, setCountryCode] = useState('+1')
  const [form, setForm] = useState({
    name: '',
    category: '',
    status: 'Lead',
    business_type: '',
    relationship: '',
    website: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    acquired_date: '',
    churned_date: '',
    net_terms: false,
    notes: '',
    account_manager_id: '',
    primary_contact_id: ''
  })

  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => client.get('/users').then(res => res.data)
  })

  const users = Array.isArray(usersData) ? usersData : []

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    if (e.target.name === 'phone') {
      setForm({ ...form, phone: formatPhone(value) })
      return
    }
    if (e.target.name === 'country') {
      const match = {
        'US': '+1', 'CA': '+1', 'GB': '+44',
        'AU': '+61', 'DE': '+49', 'FR': '+33',
        'IN': '+91', 'JP': '+81', 'BR': '+55', 'MX': '+52'
      }
      if (match[value]) setCountryCode(match[value])
    }
    setForm({ ...form, [e.target.name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload = Object.fromEntries(
        Object.entries(form).filter(([_, v]) => v !== '' && v !== null)
      )
      if (payload.phone) payload.phone = `${countryCode} ${payload.phone}`
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

        <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Basic info</div>

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
            <label className="block text-xs font-medium text-gray-600 mb-1">Business type</label>
            <select
              name="business_type"
              value={form.business_type}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            >
              <option value="">Select type...</option>
              <option>LLC</option>
              <option>Corporation</option>
              <option>Sole proprietor</option>
              <option>Partnership</option>
              <option>Non-profit</option>
              <option>Government agency</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Our relationship</label>
            <select
              name="relationship"
              value={form.relationship}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            >
              <option value="">Select relationship...</option>
              <option>Managed services client</option>
              <option>Project client</option>
              <option>Vendor</option>
              <option>Partner</option>
              <option>Reseller</option>
              <option>Prospect</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Account manager</label>
            <select
              name="account_manager_id"
              value={form.account_manager_id}
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
            <label className="block text-xs font-medium text-gray-600 mb-1">Net terms</label>
            <select
              name="net_terms"
              value={form.net_terms}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            >
              <option value={false}>No net terms</option>
              <option value={true}>Net 15</option>
              <option value={true}>Net 30</option>
              <option value={true}>Net 45</option>
              <option value={true}>Net 60</option>
              <option value={true}>Due on receipt</option>
            </select>
          </div>
        </div>

        <div className="border-t border-gray-100 my-5"></div>
        <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Contact details</div>

        <div className="mb-4">
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

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={e => setCountryCode(e.target.value)}
                className="border border-gray-200 rounded px-2 py-2 text-sm focus:outline-none focus:border-blue-400 w-24 flex-shrink-0"
              >
                {COUNTRY_CODES.map(c => (
                  <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                ))}
              </select>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                placeholder="(555) 000-0000"
              />
            </div>
          </div>
          <div>
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

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-1">Country</label>
          <select
            name="country"
            value={form.country}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="AU">Australia</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="IN">India</option>
            <option value="JP">Japan</option>
            <option value="BR">Brazil</option>
            <option value="MX">Mexico</option>
          </select>
        </div>

        <div className="border-t border-gray-100 my-5"></div>
        <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Client history</div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Date acquired</label>
            <input
              type="date"
              name="acquired_date"
              value={form.acquired_date}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Date churned</label>
            <input
              type="date"
              name="churned_date"
              value={form.churned_date}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>

        <div className="border-t border-gray-100 my-5"></div>
        <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Notes</div>

        <div className="mb-6">
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none"
            placeholder="Any additional notes about this company..."
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