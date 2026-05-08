import { useQuery } from '@tanstack/react-query'
import PortalLayout from '../../layouts/PortalLayout'
import client from '../../api/client'

function PortalTickets() {
  const { data, isLoading } = useQuery({
    queryKey: ['portal-tickets'],
    queryFn: () => client.get('/tickets').then(res => res.data)
  })

  const tickets = Array.isArray(data) ? data : []

  return (
    <PortalLayout>
      <div className="p-8">
        <h1 className="text-xl font-medium text-gray-900 mb-6">Support tickets</h1>
        {isLoading ? (
          <div className="text-gray-500 text-sm">Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="text-gray-400 text-sm">No tickets yet.</div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {tickets.map(ticket => (
              <div key={ticket.id} className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded">{ticket.status}</span>
                <span className="text-sm font-medium text-gray-900 flex-1">{ticket.title}</span>
                <span className="text-xs text-gray-400">{ticket.priority}</span>
                <span className="text-xs text-gray-400">{new Date(ticket.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  )
}

export default PortalTickets