import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import client from '../api/client'

function NewInvoice() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lineItems, setLineItems] = useState([
    { description: '', quantity: 1, unit_price: '', tax_rate: 0, is_recurring: false, total: 0 }
  ])
  const [form, setForm] = useState({
    invoice_number: `INV-${Date.now().toString().slice(-6)}`,
    status: 'Draft',
    due_date: '',
    tax_rate: 0,
    company_id: '',
    contact_id: '',
    notes: ''
  })

  const { data: companiesData } = useQuery({
    queryKey: ['companies'],
    queryFn: () => client.get('/companies').then(res => res.data)
  })

  const { data: contactsData } = useQuery({
    queryKey: ['contacts', form.company_id],
    queryFn: () => client.get('/contacts').then(res => res.data),
    enabled: !!form.company_id
  })

  const companies = Array.isArray(companiesData) ? companiesData : []
  const contacts = Array.isArray(contactsData)
    ? contactsData.filter(c => c.company_id === form.company_id)
    : []

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleLineItemChange = (index, field, value) => {
    const updated = [...lineItems]
    updated[index][field] = value
    if (field === 'quantity' || field === 'unit_price') {
      const qty = parseFloat(updated[index].quantity) || 0
      const price = parseFloat(updated[index].unit_price) || 0
      updated[index].total = qty * price
    }
    setLineItems(updated)
  }

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, unit_price: '', tax_rate: 0, is_recurring: false, total: 0 }])
  }

  const removeLineItem = (index) => {
    setLineItems(lineItems.filter((_, i) => i !== index))
  }

  const subtotal = lineItems.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0)
  const taxAmount = subtotal * (parseFloat(form.tax_rate) / 100)
  const total = subtotal + taxAmount

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload = Object.fromEntries(
        Object.entries(form).filter(([_, v]) => v !== '')
      )
      payload.subtotal = subtotal
      payload.tax_amount = taxAmount
      payload.total = total
      payload.tax_rate = parseFloat(form.tax_rate) || 0

      await client.post('/invoices', payload)
      navigate('/invoicing')
    } catch (err) {
      setError('Failed to create invoice. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/invoicing')} className="text-gray-400 hover:text-gray-600 text-sm">
          ← Back
        </button>
        <h1 className="text-xl font-medium text-gray-900">New invoice</h1>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Invoice details</div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Invoice number</label>
              <input
                type="text"
                name="invoice_number"
                value={form.invoice_number}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              >
                <option>Draft</option>
                <option>Sent</option>
                <option>Overdue</option>
                <option>Paid</option>
                <option>Void</option>
              </select>
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

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Due date</label>
              <input
                type="date"
                name="due_date"
                value={form.due_date}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Tax rate (%)</label>
              <input
                type="number"
                name="tax_rate"
                value={form.tax_rate}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none"
              placeholder="Payment instructions or additional notes..."
            />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Line items</div>

          <div className="grid grid-cols-12 gap-2 mb-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
            <div className="col-span-5">Description</div>
            <div className="col-span-2">Qty</div>
            <div className="col-span-2">Unit price</div>
            <div className="col-span-2">Total</div>
            <div className="col-span-1"></div>
          </div>

          {lineItems.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 mb-2 items-center">
              <div className="col-span-5">
                <input
                  type="text"
                  value={item.description}
                  onChange={e => handleLineItemChange(index, 'description', e.target.value)}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                  placeholder="Item description"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={e => handleLineItemChange(index, 'quantity', e.target.value)}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                  min="1"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  value={item.unit_price}
                  onChange={e => handleLineItemChange(index, 'unit_price', e.target.value)}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                  placeholder="0"
                />
              </div>
              <div className="col-span-2">
                <div className="px-3 py-2 text-sm text-gray-700 font-medium">
                  ${parseFloat(item.total || 0).toFixed(2)}
                </div>
              </div>
              <div className="col-span-1">
                {lineItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLineItem(index)}
                    className="text-gray-300 hover:text-red-400 text-lg leading-none"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addLineItem}
            className="text-sm text-blue-600 hover:text-blue-700 mt-2"
          >
            + Add line item
          </button>

          <div className="border-t border-gray-100 mt-4 pt-4 flex justify-end">
            <div className="w-48">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {parseFloat(form.tax_rate) > 0 && (
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Tax ({form.tax_rate}%)</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-medium text-gray-900 border-t border-gray-100 pt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create invoice'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/invoicing')}
            className="text-sm text-gray-500 px-5 py-2 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewInvoice