import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import client from '../api/client'

function InvoiceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: invoice, isLoading } = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => client.get(`/invoices/${id}`).then(res => res.data)
  })

  const updateStatus = useMutation({
    mutationFn: (status) => client.patch(`/invoices/${id}`, { status }),
    onSuccess: () => queryClient.invalidateQueries(['invoice', id])
  })

  const statusColors = {
    'Draft': 'bg-gray-100 text-gray-500',
    'Unpaid': 'bg-amber-50 text-amber-700',
    'Sent': 'bg-blue-50 text-blue-700',
    'Overdue': 'bg-red-50 text-red-700',
    'Paid': 'bg-green-50 text-green-700',
    'Void': 'bg-gray-100 text-gray-400',
  }

  const lineItems = Array.isArray(invoice?.invoice_line_items) ? invoice.invoice_line_items : []

  if (isLoading) return <div className="p-8 text-sm text-gray-400">Loading invoice...</div>
  if (!invoice) return <div className="p-8 text-sm text-red-400">Invoice not found.</div>

  const isPaid = invoice.status === 'Paid'
  const isVoid = invoice.status === 'Void'
  const canSend = invoice.status === 'Draft'
  const canMarkPaid = invoice.status === 'Sent' || invoice.status === 'Unpaid' || invoice.status === 'Overdue'
  const canVoid = !isPaid && !isVoid

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/invoicing')}
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          ← Back
        </button>
        <h1 className="text-xl font-medium text-gray-900 flex-1">
          {invoice.invoice_number}
        </h1>
        <span className={`text-xs px-2 py-1 rounded font-medium ${statusColors[invoice.status] || 'bg-gray-100 text-gray-500'}`}>
          {invoice.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left — invoice content */}
        <div className="col-span-2 space-y-4">
          {/* Company / contact info */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Bill to</div>
                <div className="text-sm font-medium text-gray-900">{invoice.companies?.name || '—'}</div>
                {invoice.contacts && (
                  <div className="text-sm text-gray-500 mt-0.5">
                    {invoice.contacts.first_name} {invoice.contacts.last_name}
                  </div>
                )}
              </div>
              <div>
                <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Due date</div>
                <div className="text-sm text-gray-900">
                  {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—'}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Issued: {invoice.created_at ? new Date(invoice.created_at).toLocaleDateString() : '—'}
                </div>
              </div>
            </div>
          </div>

          {/* Line items */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-gray-50 border-b border-gray-100">
              <div className="col-span-6 text-xs font-medium text-gray-500">Description</div>
              <div className="col-span-2 text-xs font-medium text-gray-500 text-right">Qty</div>
              <div className="col-span-2 text-xs font-medium text-gray-500 text-right">Unit price</div>
              <div className="col-span-2 text-xs font-medium text-gray-500 text-right">Total</div>
            </div>
            {lineItems.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-400">No line items.</div>
            ) : (
              lineItems.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-gray-50 last:border-0">
                  <div className="col-span-6 text-sm text-gray-700">{item.description}</div>
                  <div className="col-span-2 text-sm text-gray-600 text-right">{item.quantity}</div>
                  <div className="col-span-2 text-sm text-gray-600 text-right">${Number(item.unit_price || 0).toFixed(2)}</div>
                  <div className="col-span-2 text-sm font-medium text-gray-900 text-right">${Number(item.total || 0).toFixed(2)}</div>
                </div>
              ))
            )}

            {/* Totals */}
            <div className="px-4 py-4 border-t border-gray-100 flex justify-end">
              <div className="w-48 space-y-1.5">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>${Number(invoice.subtotal || 0).toFixed(2)}</span>
                </div>
                {Number(invoice.tax_rate) > 0 && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax ({invoice.tax_rate}%)</span>
                    <span>${Number(invoice.tax_amount || 0).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-semibold text-gray-900 border-t border-gray-100 pt-2">
                  <span>Total</span>
                  <span>${Number(invoice.total || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Notes</div>
              <p className="text-sm text-gray-600 leading-relaxed">{invoice.notes}</p>
            </div>
          )}
        </div>

        {/* Right — actions sidebar */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</div>

            {canSend && (
              <button
                onClick={() => updateStatus.mutate('Sent')}
                disabled={updateStatus.isPending}
                className="w-full bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {updateStatus.isPending ? 'Updating...' : 'Mark as sent'}
              </button>
            )}

            {canMarkPaid && (
              <button
                onClick={() => updateStatus.mutate('Paid')}
                disabled={updateStatus.isPending}
                className="w-full bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {updateStatus.isPending ? 'Updating...' : 'Mark as paid'}
              </button>
            )}

            {isPaid && (
              <div className="w-full text-center text-sm font-medium text-green-600 py-2">
                ✓ Paid
              </div>
            )}

            {canVoid && (
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to void this invoice? This cannot be undone.')) {
                    updateStatus.mutate('Void')
                  }
                }}
                disabled={updateStatus.isPending}
                className="w-full border border-gray-200 text-gray-500 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Void invoice
              </button>
            )}
          </div>

          {/* Invoice summary */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Summary</div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">Invoice #</span>
                <span className="text-xs font-mono text-gray-700">{invoice.invoice_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">Status</span>
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${statusColors[invoice.status] || 'bg-gray-100 text-gray-500'}`}>
                  {invoice.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">Company</span>
                <span className="text-xs text-gray-700">{invoice.companies?.name || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">Due date</span>
                <span className="text-xs text-gray-700">
                  {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : '—'}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-2">
                <span className="text-xs font-medium text-gray-600">Total</span>
                <span className="text-sm font-semibold text-gray-900">${Number(invoice.total || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoiceDetail