import { useQuery } from '@tanstack/react-query'
import PortalLayout from '../../layouts/PortalLayout'
import client from '../../api/client'

function PortalInvoices() {
  const { data, isLoading } = useQuery({
    queryKey: ['portal-invoices'],
    queryFn: () => client.get('/invoices').then(res => res.data)
  })

  const invoices = Array.isArray(data) ? data : []

  return (
    <PortalLayout>
      <div className="p-8">
        <h1 className="text-xl font-medium text-gray-900 mb-6">Invoices</h1>
        {isLoading ? (
          <div className="text-gray-500 text-sm">Loading invoices...</div>
        ) : invoices.length === 0 ? (
          <div className="text-gray-400 text-sm">No invoices yet.</div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {invoices.map(invoice => (
              <div key={invoice.id} className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                <span className="font-mono text-xs text-gray-400">{invoice.invoice_number}</span>
                <span className="text-sm font-medium text-gray-900 flex-1">{invoice.companies?.name}</span>
                <span className="text-xs font-medium bg-amber-50 text-amber-700 px-2 py-1 rounded">{invoice.status}</span>
                <span className="text-sm font-medium text-gray-900">${invoice.total}</span>
                <span className="text-xs text-gray-400">{invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : '—'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  )
}

export default PortalInvoices