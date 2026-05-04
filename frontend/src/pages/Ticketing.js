import { useQuery } from '@tanstack/react-query'
import client from '../api/client'

function Ticketing() {
  const { data: tickets, isLoading, isError } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => client.get('/tickets').then(res => res.data)
  })

  if (isLoading) return <div className="p-8 text-gray-500">Loading tickets...</div>
  if (isError) return <div className="p-8 text-red-500">Failed to load tickets.</div>

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium text-gray-900">Ticketing</h1>
        <button className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700">
          New ticket
        </button>
      </div>
      {tickets.length === 0 ? (
        <div className="text-gray-400 text-sm">No tickets yet.</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {tickets.map(ticket => (
            <div key={ticket.id} className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
              <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded">{ticket.status}</span>
              <span className="text-sm font-medium text-gray-900 flex-1">{ticket.title}</span>
              <span className="text-xs text-gray-400">{ticket.priority}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Ticketing