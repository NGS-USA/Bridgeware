import { useQuery } from '@tanstack/react-query'
import client from '../api/client'

function ERP() {
  const { data: vendors, isLoading, isError } = useQuery({
    queryKey: ['vendors'],
    queryFn: () => client.get('/vendors').then(res => res.data)
  })

  if (isLoading) return <div className="p-8 text-gray-500">Loading vendors...</div>
  if (isError) return <div className="p-8 text-red-500">Failed to load vendors.</div>

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium text-gray-900">ERP</h1>
        <button className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700">
          Add vendor
        </button>
      </div>
      {vendors.length === 0 ? (
        <div className="text-gray-400 text-sm">No vendors yet.</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {vendors.map(vendor => (
            <div key={vendor.id} className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
              <span className="text-sm font-medium text-gray-900 flex-1">{vendor.name}</span>
              <span className="text-xs text-gray-400">{vendor.type}</span>
              <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded">{vendor.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ERP