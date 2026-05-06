import { useQuery } from '@tanstack/react-query'
import client from '../api/client'

function HR() {
  const { data: employees, isLoading, isError } = useQuery({
    queryKey: ['employees'],
    queryFn: () => client.get('/users').then(res => res.data)
  })

  if (isLoading) return <div className="p-8 text-gray-500">Loading employees...</div>
  if (isError) return <div className="p-8 text-red-500">Failed to load employees.</div>

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium text-gray-900">HR</h1>
        <button className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700">
          Add employee
        </button>
      </div>
      {employees.length === 0 ? (
        <div className="text-gray-400 text-sm">No employees yet.</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {employees.map(employee => (
            <div key={employee.id} className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-medium flex-shrink-0">
                {employee.avatar_initials || employee.full_name?.charAt(0)}
              </div>
              <span className="text-sm font-medium text-gray-900 flex-1">{employee.full_name}</span>
              <span className="text-xs text-gray-400">{employee.role}</span>
              <span className="text-xs font-medium bg-green-50 text-green-700 px-2 py-1 rounded">
                {employee.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HR