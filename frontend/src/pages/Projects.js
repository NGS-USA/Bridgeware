import { useQuery } from '@tanstack/react-query'
import client from '../api/client'
import { useNavigate } from 'react-router-dom'

function Projects() {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['projects'],
    queryFn: () => client.get('/projects').then(res => res.data)
  })

  const projects = Array.isArray(data) ? data : []

  if (isLoading) return <div className="p-8 text-gray-500">Loading projects...</div>
  if (isError) return <div className="p-8 text-red-500">Failed to load projects.</div>

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium text-gray-900">Projects</h1>
        <button
          onClick={() => navigate('/projects/new')}
          className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700"
        >
          New project
        </button>
      </div>
      {projects.length === 0 ? (
        <div className="text-gray-400 text-sm">No projects yet.</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {projects.map(project => (
            <div key={project.id} className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
              <span className="text-sm font-medium text-gray-900 flex-1">{project.name}</span>
              <span className="text-xs text-gray-400">{project.companies?.name}</span>
              <span className="text-xs font-medium bg-purple-50 text-purple-700 px-2 py-1 rounded">{project.status}</span>
              <div className="w-24 bg-gray-100 rounded-full h-1.5">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
              </div>
              <span className="text-xs text-gray-400">{project.progress}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Projects