import { useQuery } from '@tanstack/react-query'
import PortalLayout from '../../layouts/PortalLayout'
import client from '../../api/client'

function PortalQuotes() {
  const { data, isLoading } = useQuery({
    queryKey: ['portal-quotes'],
    queryFn: () => client.get('/quotes').then(res => res.data)
  })

  const quotes = Array.isArray(data) ? data : []

  return (
    <PortalLayout>
      <div className="p-8">
        <h1 className="text-xl font-medium text-gray-900 mb-6">Quotes</h1>
        {isLoading ? (
          <div className="text-gray-500 text-sm">Loading quotes...</div>
        ) : quotes.length === 0 ? (
          <div className="text-gray-400 text-sm">No quotes yet.</div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {quotes.map(quote => (
              <div key={quote.id} className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                <span className="font-mono text-xs text-gray-400">{quote.quote_number}</span>
                <span className="text-sm font-medium text-gray-900 flex-1">{quote.companies?.name}</span>
                <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded">{quote.status}</span>
                <span className="text-sm font-medium text-gray-900">${quote.total}</span>
                <span className="text-xs text-gray-400">{quote.valid_until ? new Date(quote.valid_until).toLocaleDateString() : '—'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  )
}

export default PortalQuotes