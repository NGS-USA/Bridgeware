import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import PortalLayout from '../../layouts/PortalLayout'
import client from '../../api/client'

function PortalInvoices() {
  const [paying, setPaying] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['portal-invoices'],
    queryFn: () => client.get('/invoices').then(res => res.data)
  })

  const invoices = Array.isArray(data) ? data : []

  const statusColors = {
    'Paid': 'bg-green-50 text-green-700',
    'Unpaid': 'bg-amber-50 text-amber-700',
    'Overdue': 'bg-red-50 text-red-700',
    'Draft': 'bg-gray-100 text-gray-500',
  }

  async function handlePay(invoice) {
    setPaying(invoice.id)
    try {
      const res = await client.post('/payments/create-checkout-session', {
        invoiceId: invoice.id,
        amount: invoice.total,
        invoiceNumber: invoice.invoice_number,
        successUrl: `${window.location.origin}/portal/invoices`,
        cancelUrl: `${window.location.origin}/portal/invoices`,
      })
      window.location.href = res.data.url
    } catch (err) {
      alert('Payment could not be started. Please try again.')
      setPaying(null)
    }
  }

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
              <div key={invoice.id} className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 last:border-0">
                <span className="font-mono text-xs text-gray-400 w-28 shrink-0">{invoice.invoice_number}</span>
                <span className="text-sm text-gray-700 flex-1">{invoice.companies?.name || '—'}</span>
                <span className={`text-xs font-medium px-2 py-1 rounded shrink-0 ${statusColors[invoice.status] || 'bg-gray-100 text-gray-500'}`}>
                  {invoice.status}
                </span>
                <span className="text-sm font-medium text-gray-900 w-20 text-right shrink-0">
                  ${Number(invoice.total || 0).toFixed(2)}
                </span>
                <span className="text-xs text-gray-400 w-24 shrink-0">
                  {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : '—'}
                </span>
                <div className="w-20 shrink-0 text-right">
                  {(invoice.status === 'Unpaid' || invoice.status === 'Overdue') && (
                    <button
                      onClick={() => handlePay(invoice)}
                      disabled={paying === invoice.id}
                      className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {paying === invoice.id ? 'Loading...' : 'Pay now'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  )
}

export default PortalInvoices