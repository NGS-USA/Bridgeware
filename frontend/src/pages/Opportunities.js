import { useQuery } from '@tanstack/react-query'
import client from '../api/client'

function Opportunities() {
  const { data: opportunities, isLoading, isError } = useQuery({
    queryKey: ['opportunities'],
    queryFn: () => client.get('/opportunities').then(res => res.data)
  })

  if (isLoading) return <div className="p-8 text-gray-500">Loading opportunities...</div>
  if (isError) return <div className="p-8 text-red-500">Failed to load opportunities.</div>

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium text-gray-900">Opportunities</h1>
        <button className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700">
          New opportunity
        </button>
      </div>
      {opportunities.length === 0 ? (
        <div className="text-gray-400 text-sm">No opportunities yet.</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {opportunities.map(opportunity => (
            <div key={opportunity.id} className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
              <span className="text-sm font-medium text-gray-900 flex-1">{opportunity.title}</span>
              <span className="text-xs font-medium bg-green-50 text-green-700 px-2 py-1 rounded">{opportunity.status}</span>
              <span className="text-xs text-gray-400">${opportunity.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Opportunities