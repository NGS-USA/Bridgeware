function Workflows() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium text-gray-900">Workflows</h1>
        <button className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700">
          New workflow
        </button>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <div className="text-gray-400 text-sm mb-2">No workflows yet.</div>
        <div className="text-gray-300 text-xs">Create your first workflow to automate actions across Bridgeware.</div>
      </div>
    </div>
  )
}

export default Workflows