import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import client from '../api/client'

function AuditLog() {
  const [recordType, setRecordType] = useState('')
  const [action, setAction] = useState('')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['audit-log', recordType, action],
    queryFn: () => {
      const params = new URLSearchParams()
      if (recordType) params.append('record_type', recordType)
      if (action) params.append('action', action)
      return client.get(`/audit-log?${params.toString()}`).then(res => res.data)
    }
  })

  const logs = Array.isArray(data) ? data : []

  const getActionColor = (action) => {
    if (action.includes('created')) return 'bg-green-50 text-green-700'
    if (action.includes('deleted')) return 'bg-red-50 text-red-700'
    if (action.includes('updated')) return 'bg-blue-50 text-blue-700'
    return 'bg-gray-100 text-gray-600'
  }

  if (isLoading) return <div className="p-8 text-gray-500">Loading audit log...</div>
  if (isError) return <div className="p-8 text-red-500">Failed to load audit log.</div>

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium text-gray-900">Audit log</h1>
          <p className="text-xs text-gray-400 mt-1">Tamper-proof record of all activity in Bridgeware</p>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <select
          value={recordType}
          onChange={e => setRecordType(e.target.value)}
          className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white"
        >
          <option value="">All modules</option>
          <option value="ticket">Ticketing</option>
          <option value="company">CRM</option>
          <option value="contact">Contacts</option>
          <option value="opportunity">Opportunities</option>
          <option value="invoice">Invoicing</option>
          <option value="project">Projects</option>
          <option value="user">Users</option>
          <option value="vendor">Vendors</option>
          <option value="purchase_order">Purchase orders</option>
          <option value="pto_request">PTO requests</option>
        </select>
        <input
          type="text"
          value={action}
          onChange={e => setAction(e.target.value)}
          placeholder="Search by action..."
          className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 flex-1 max-w-xs"
        />
      </div>

      {logs.length === 0 ? (
        <div className="text-gray-400 text-sm">No audit log entries yet.</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="grid grid-cols-5 gap-4 px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wide">
            <div>Action</div>
            <div>Module</div>
            <div>User</div>
            <div>IP address</div>
            <div>Timestamp</div>
          </div>
          {logs.map(log => (
            <div key={log.id} className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 text-sm">
              <div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${getActionColor(log.action)}`}>
                  {log.action}
                </span>
              </div>
              <div className="text-gray-600">{log.record_type || '—'}</div>
              <div className="text-gray-600 truncate">{log.user_email || '—'}</div>
              <div className="text-gray-400 font-mono text-xs">{log.ip_address || '—'}</div>
              <div className="text-gray-400 text-xs">
                {new Date(log.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AuditLog