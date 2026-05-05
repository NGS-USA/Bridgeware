import { useQuery } from '@tanstack/react-query'
import client from '../api/client'

function Invoicing() {
  const { data: invoices, isLoading, isError } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => client.get('/invoices').then(res => res.data)
  })

  if (isLoading) return <div className="p-8 text-gray-500">Loading invoices...</div>
  if (isError) return <div className="p-8 text-red-500">Failed to load invoices.</div>

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium text-gray-900">Invoicing</h1>
        <button className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700">
          New invoice
        </button>
      </div>
      {invoices.length === 0 ? (
        <div className="text-gray-400 text-sm">No invoices yet.</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {invoices.map(invoice => (
            <div key={invoice.id} className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
              <span className="font-mono text-xs text-gray-400">{invoice.invoice_number}</span>
              <span className="text-sm font-medium text-gray-900 flex-1">{invoice.companies?.name}</span>
              <span className="text-xs font-medium bg-amber-50 text-amber-700 px-2 py-1 rounded">{invoice.status}</span>
              <span className="text-sm font-medium text-gray-900">${invoice.total}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Invoicing