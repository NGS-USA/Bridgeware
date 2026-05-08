import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import PortalLayout from '../../layouts/PortalLayout'
import client from '../../api/client'

function PortalDashboard() {
  const navigate = useNavigate()

  const { data: ticketsData } = useQuery({
    queryKey: ['portal-tickets'],
    queryFn: () => client.get('/tickets').then(res => res.data)
  })

  const { data: invoicesData } = useQuery({
    queryKey: ['portal-invoices'],
    queryFn: () => client.get('/invoices').then(res => res.data)
  })

  const { data: quotesData } = useQuery({
    queryKey: ['portal-quotes'],
    queryFn: () => client.get('/quotes').then(res => res.data)
  })

  const tickets = Array.isArray(ticketsData) ? ticketsData : []
  const invoices = Array.isArray(invoicesData) ? invoicesData : []
  const quotes = Array.isArray(quotesData) ? quotesData : []

  const openTickets = tickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed')
  const unpaidInvoices = invoices.filter(i => i.status === 'Unpaid' || i.status === 'Overdue')
  const pendingQuotes = quotes.filter(q => q.status === 'Sent')

  return (
    <PortalLayout>
      <div className="p-8">
        <h1 className="text-xl font-medium text-gray-900 mb-6">Overview</h1>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Open tickets</div>
            <div className="text-2xl font-medium text-gray-900">{openTickets.length}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Unpaid invoices</div>
            <div className="text-2xl font-medium text-gray-900">{unpaidInvoices.length}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Pending quotes</div>
            <div className="text-2xl font-medium text-gray-900">{pendingQuotes.length}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-900">Recent tickets</div>
              <div onClick={() => navigate('/portal/tickets')} className="text-xs text-blue-600 cursor-pointer">View all</div>
            </div>
            {openTickets.length === 0 ? (
              <div className="text-sm text-gray-400">No open tickets.</div>
            ) : (
              openTickets.slice(0, 5).map(ticket => (
                <div key={ticket.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">{ticket.status}</span>
                  <span className="text-sm text-gray-700 flex-1 truncate">{ticket.title}</span>
                </div>
              ))
            )}
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-900">Unpaid invoices</div>
              <div onClick={() => navigate('/portal/invoices')} className="text-xs text-blue-600 cursor-pointer">View all</div>
            </div>
            {unpaidInvoices.length === 0 ? (
              <div className="text-sm text-gray-400">No unpaid invoices.</div>
            ) : (
              unpaidInvoices.slice(0, 5).map(invoice => (
                <div key={invoice.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <span className="font-mono text-xs text-gray-400">{invoice.invoice_number}</span>
                  <span className="text-sm text-gray-700 flex-1 truncate">{invoice.companies?.name}</span>
                  <span className="text-sm font-medium text-gray-900">${invoice.total}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </PortalLayout>
  )
}

export default PortalDashboard