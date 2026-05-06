import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import client from '../api/client'

function NewInventoryItem() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    sku: '',
    name: '',
    category: '',
    vendor_id: '',
    cost_price: '',
    sell_price: '',
    stock_qty: '',
    reorder_point: '',
    location: ''
  })

  const { data: vendorsData } = useQuery({
    queryKey: ['vendors'],
    queryFn: () => client.get('/vendors').then(res => res.data)
  })

  const vendors = Array.isArray(vendorsData) ? vendorsData : []

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
      if (payload.cost_price) payload.cost_price = parseFloat(payload.cost_price)
      if (payload.sell_price) payload.sell_price = parseFloat(payload.sell_price)
      if (payload.stock_qty) payload.stock_qty = parseInt(payload.stock_qty)
      if (payload.reorder_point) payload.reorder_point = parseInt(payload.reorder_point)
      await client.post('/inventory', payload)
      navigate('/erp')
    } catch (err) {
      setError('Failed to create inventory item. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/erp')} className="text-gray-400 hover:text-gray-600 text-sm">
          ← Back
        </button>
        <h1 className="text-xl font-medium text-gray-900">New inventory item</h1>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Item details</div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">SKU <span className="text-red-400">*</span></label>
            <input
              type="text"
              name="sku"
              value={form.sku}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              placeholder="e.g. DELL-LAT-5520"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Item name <span className="text-red-400">*</span></label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              placeholder="e.g. Dell Latitude 5520"
            />
          </div>
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
              <option>Laptops</option>
              <option>Desktops</option>
              <option>Servers</option>
              <option>Networking</option>
              <option>Accessories</option>
              <option>Software licenses</option>
              <option>Cables</option>
              <option>Storage</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Vendor</label>
            <select
              name="vendor_id"
              value={form.vendor_id}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            >
              <option value="">Select vendor...</option>
              {vendors.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="border-t border-gray-100 my-5"></div>
        <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Pricing</div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Cost price ($)</label>
            <input
              type="number"
              name="cost_price"
              value={form.cost_price}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Sell price ($)</label>
            <input
              type="number"
              name="sell_price"
              value={form.sell_price}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="border-t border-gray-100 my-5"></div>
        <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Stock</div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Stock quantity</label>
            <input
              type="number"
              name="stock_qty"
              value={form.stock_qty}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Reorder point</label>
            <input
              type="number"
              name="reorder_point"
              value={form.reorder_point}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              placeholder="e.g. Shelf A3"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create item'}
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

export default NewInventoryItem