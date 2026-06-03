import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import client from '../api/client'

function Dashboard() {
  const navigate = useNavigate()

  const { data: ticketsData } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => client.get('/tickets').then(res => res.data)
  })

  const { data: companiesData } = useQuery({
    queryKey: ['companies'],
    queryFn: () => client.get('/companies').then(res => res.data)
  })

  const { data: invoicesData } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => client.get('/invoices').then(res => res.data)
  })

  const { data: projectsData } = useQuery({
    queryKey: ['projects'],
    queryFn: () => client.get('/projects').then(res => res.data)
  })

  const { data: quotesData } = useQuery({
    queryKey: ['quotes'],
    queryFn: () => client.get('/quotes').then(res => res.data)
  })

  const tickets = Array.isArray(ticketsData) ? ticketsData : []
  const companies = Array.isArray(companiesData) ? companiesData : []
  const invoices = Array.isArray(invoicesData) ? invoicesData : []
  const projects = Array.isArray(projectsData) ? projectsData : []
  const quotes = Array.isArray(quotesData) ? quotesData : []

  // Filtered KPIs
  const openTickets = tickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed')
  const unpaidInvoices = invoices.filter(i => i.status === 'Unpaid' || i.status === 'Overdue')
  const unpaidTotal = unpaidInvoices.reduce((sum, i) => sum + (Number(i.total) || 0), 0)
  const activeProjects = projects.filter(p => p.status !== 'Completed' && p.status !== 'Cancelled')
  const pendingQuotes = quotes.filter(q => q.status === 'Sent')
  const overdueInvoices = invoices.filter(i => i.status === 'Overdue')

  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)

  const recentInvoices = [...invoices]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)

  const statusColors = {
    'Open': 'bg-blue-50 text-blue-700',
    'In progress': 'bg-yellow-50 text-yellow-700',
    'Pending customer': 'bg-orange-50 text-orange-700',
    'Escalated': 'bg-red-50 text-red-700',
    'Resolved': 'bg-green-50 text-green-700',
    'Closed': 'bg-gray-100 text-gray-500',
    'Paid': 'bg-green-50 text-green-700',
    'Unpaid': 'bg-amber-50 text-amber-700',
    'Overdue': 'bg-red-50 text-red-700',
    'Draft': 'bg-gray-100 text-gray-500',
  }

  const kpis = [
    {
      label: 'Open tickets',
      value: openTickets.length,
      sub: `${tickets.length} total`,
      alert: openTickets.filter(t => t.priority === 'Critical').length > 0,
      alertText: `${openTickets.filter(t => t.priority === 'Critical').length} critical`,
      onClick: () => navigate('/ticketing')
    },
    {
      label: 'Unpaid invoices',
      value: unpaidInvoices.length,
      sub: `$${unpaidTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} outstanding`,
      alert: overdueInvoices.length > 0,
      alertText: `${overdueInvoices.length} overdue`,
      onClick: () => navigate('/invoicing')
    },
    {
      label: 'Active projects',
      value: activeProjects.length,
      sub: `${projects.length} total`,
      alert: false,
      onClick: () => navigate('/projects')
    },
    {
      label: 'Pending quotes',
      value: pendingQuotes.length,
      sub: `${companies.length} companies`,
      alert: false,
      onClick: () => navigate('/sales')
    },
  ]

  return (
    <div className="p-8">
      <h1 className="text-xl font-medium text-gray-900 mb-6">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {kpis.map(kpi => (
          <div
            key={kpi.label}
            onClick={kpi.onClick}
            className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-300 transition-colors"
          >
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">{kpi.label}</div>
            <div className="text-2xl font-medium text-gray-900 mb-1">{kpi.value}</div>
            <div className="text-xs text-gray-400">{kpi.sub}</div>
            {kpi.alert && kpi.alertText && (
              <div className="mt-2 text-xs font-medium text-red-500">{kpi.alertText}</div>
            )}
          </div>
        ))}
      </div>

      {/* Recent activity panels */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent tickets */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-gray-900">Recent tickets</div>
            <button
              onClick={() => navigate('/ticketing')}
              className="text-xs text-blue-600 hover:underline"
            >
              View all
            </button>
          </div>
          {recentTickets.length === 0 ? (
            <div className="text-sm text-gray-400">No tickets yet.</div>
          ) : (
            recentTickets.map(ticket => (
              <div
                key={ticket.id}
                onClick={() => navigate(`/ticketing/${ticket.id}`)}
                className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 -mx-4 px-4 transition-colors"
              >
                <span className={`text-xs px-2 py-0.5 rounded font-medium shrink-0 ${statusColors[ticket.status] || 'bg-gray-100 text-gray-500'}`}>
                  {ticket.status}
                </span>
                <span className="text-sm text-gray-700 flex-1 truncate">{ticket.title}</span>
                <span className="text-xs text-gray-400 shrink-0">{ticket.priority}</span>
              </div>
            ))
          )}
        </div>

        {/* Recent invoices */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-gray-900">Recent invoices</div>
            <button
              onClick={() => navigate('/invoicing')}
              className="text-xs text-blue-600 hover:underline"
            >
              View all
            </button>
          </div>
          {recentInvoices.length === 0 ? (
            <div className="text-sm text-gray-400">No invoices yet.</div>
          ) : (
            recentInvoices.map(invoice => (
              <div
                key={invoice.id}
                className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
              >
                <span className="font-mono text-xs text-gray-400 shrink-0">{invoice.invoice_number}</span>
                <span className="text-sm text-gray-700 flex-1 truncate">{invoice.companies?.name || '—'}</span>
                <span className={`text-xs px-2 py-0.5 rounded font-medium shrink-0 ${statusColors[invoice.status] || 'bg-gray-100 text-gray-500'}`}>
                  {invoice.status}
                </span>
                <span className="text-sm font-medium text-gray-900 shrink-0">
                  ${Number(invoice.total || 0).toFixed(2)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard