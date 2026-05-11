import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import PortalLayout from '../../layouts/PortalLayout'
import client from '../../api/client'

function PortalQuotes() {
  const queryClient = useQueryClient()
  const [acting, setActing] = useState(null)
  const [confirmed, setConfirmed] = useState({})

  const { data, isLoading } = useQuery({
    queryKey: ['portal-quotes'],
    queryFn: () => client.get('/quotes').then(res => res.data)
  })

  const quotes = Array.isArray(data) ? data : []

  const statusColors = {
    'Draft': 'bg-gray-100 text-gray-500',
    'Sent': 'bg-blue-50 text-blue-700',
    'Accepted': 'bg-green-50 text-green-700',
    'Declined': 'bg-red-50 text-red-700',
    'Expired': 'bg-orange-50 text-orange-700',
  }

  async function handleAction(quote, newStatus) {
    setActing(quote.id + newStatus)
    try {
      await client.patch(`/quotes/${quote.id}`, { status: newStatus })
      setConfirmed(prev => ({ ...prev, [quote.id]: newStatus }))
      queryClient.invalidateQueries(['portal-quotes'])
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setActing(null)
    }
  }

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
            {quotes.map(quote => {
              const isSent = quote.status === 'Sent'
              const justActed = confirmed[quote.id]
              return (
                <div key={quote.id} className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 last:border-0">
                  <span className="font-mono text-xs text-gray-400 w-28 shrink-0">{quote.quote_number}</span>
                  <span className="text-sm text-gray-700 flex-1">{quote.companies?.name || '—'}</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded shrink-0 ${statusColors[quote.status] || 'bg-gray-100 text-gray-500'}`}>
                    {quote.status}
                  </span>
                  <span className="text-sm font-medium text-gray-900 w-20 text-right shrink-0">
                    ${Number(quote.total || 0).toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-400 w-24 shrink-0">
                    {quote.valid_until ? new Date(quote.valid_until).toLocaleDateString() : '—'}
                  </span>
                  <div className="flex gap-2 shrink-0 w-36 justify-end">
                    {justActed ? (
                      <span className={`text-xs font-medium ${justActed === 'Accepted' ? 'text-green-600' : 'text-red-500'}`}>
                        {justActed === 'Accepted' ? '✓ Accepted' : '✗ Declined'}
                      </span>
                    ) : isSent ? (
                      <>
                        <button
                          onClick={() => handleAction(quote, 'Accepted')}
                          disabled={!!acting}
                          className="text-xs bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          {acting === quote.id + 'Accepted' ? '...' : 'Accept'}
                        </button>
                        <button
                          onClick={() => handleAction(quote, 'Declined')}
                          disabled={!!acting}
                          className="text-xs border border-red-300 text-red-600 px-3 py-1.5 rounded hover:bg-red-50 disabled:opacity-50 transition-colors"
                        >
                          {acting === quote.id + 'Declined' ? '...' : 'Decline'}
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </PortalLayout>
  )
}

export default PortalQuotes