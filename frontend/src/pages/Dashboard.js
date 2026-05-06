import { useQuery } from '@tanstack/react-query'
import client from '../api/client'

function Dashboard() {
  const { data: tickets } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => client.get('/tickets').then(res => res.data)
  })

  const { data: companies } = useQuery({
    queryKey: ['companies'],
    queryFn: () => client.get('/companies').then(res => res.data)
  })

  const { data: invoices } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => client.get('/invoices').then(res => res.data)
  })

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => client.get('/projects').then(res => res.data)
  })

  const ticketList = Array.isArray(tickets) ? tickets : []
  const companiesList = Array.isArray(companies) ? companies : []
  const invoiceList = Array.isArray(invoices) ? invoices : []
  const projectList = Array.isArray(projects) ? projects : []

  return (
    <div className="p-8">
      <h1 className="text-xl font-medium text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Open tickets</div>
          <div className="text-2xl font-medium text-gray-900">{ticketList.length}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Companies</div>
          <div className="text-2xl font-medium text-gray-900">{companiesList.length}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Invoices</div>
          <div className="text-2xl font-medium text-gray-900">{invoiceList.length}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Active projects</div>
          <div className="text-2xl font-medium text-gray-900">{projectList.length}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-900 mb-3">Recent tickets</div>
          {ticketList.length === 0 ? (
            <div className="text-sm text-gray-400">No tickets yet.</div>
          ) : (
            ticketList.slice(0, 5).map(ticket => (
              <div key={ticket.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">{ticket.status}</span>
                <span className="text-sm text-gray-700 flex-1 truncate">{ticket.title}</span>
              </div>
            ))
          )}
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-900 mb-3">Recent invoices</div>
          {invoiceList.length === 0 ? (
            <div className="text-sm text-gray-400">No invoices yet.</div>
          ) : (
            invoiceList.slice(0, 5).map(invoice => (
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
  )
}

export default Dashboard