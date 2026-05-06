import { useQuery } from '@tanstack/react-query'
import client from '../api/client'

function CRM() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['companies'],
    queryFn: () => client.get('/companies').then(res => res.data)
  })

  const companies = Array.isArray(data) ? data : []

  if (isLoading) return <div className="p-8 text-gray-500">Loading companies...</div>
  if (isError) return <div className="p-8 text-red-500">Failed to load companies.</div>

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium text-gray-900">CRM</h1>
        <button className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700">
          New company
        </button>
      </div>
      {companies.length === 0 ? (
        <div className="text-gray-400 text-sm">No companies yet.</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {companies.map(company => (
            <div key={company.id} className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
              <span className="text-sm font-medium text-gray-900 flex-1">{company.name}</span>
              <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded">{company.status}</span>
              <span className="text-xs text-gray-400">{company.category}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CRM