import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import client from '../api/client'

function Invoicing() {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => client.get('/invoices').then(res => res.data)
  })

  const invoices = Array.isArray(data) ? data : []

  const statusColors = {
    'Draft': 'bg-gray-100 text-gray-500',
    'Unpaid': 'bg-amber-50 text-amber-700',
    'Sent': 'bg-blue-50 text-blue-700',
    'Overdue': 'bg-red-50 text-red-700',
    'Paid': 'bg-green-50 text-green-700',
    'Void': 'bg-gray-100 text-gray-400',
  }

  if (isLoading) return <div className="p-8 text-gray-500">Loading invoices...</div>
  if (isError) return <div className="p-8 text-red-500">Failed to load invoices.</div>

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium text-gray-900">Invoicing</h1>
        <button
          onClick={() => navigate('/invoicing/new')}
          className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700"
        >
          New invoice
        </button>
      </div>
      {invoices.length === 0 ? (
        <div className="text-gray-400 text-sm">No invoices yet.</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {invoices.map(invoice => (
            <div
              key={invoice.id}
              onClick={() => navigate(`/invoicing/${invoice.id}`)}
              className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer"
            >
              <span className="font-mono text-xs text-gray-400 w-28 shrink-0">{invoice.invoice_number}</span>
              <span className="text-sm font-medium text-gray-900 flex-1">{invoice.companies?.name || '—'}</span>
              <span className={`text-xs font-medium px-2 py-1 rounded shrink-0 ${statusColors[invoice.status] || 'bg-gray-100 text-gray-500'}`}>
                {invoice.status}
              </span>
              <span className="text-sm font-medium text-gray-900 w-20 text-right shrink-0">
                ${Number(invoice.total || 0).toFixed(2)}
              </span>
              <span className="text-xs text-gray-400 w-24 shrink-0">
                {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : '—'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Invoicing