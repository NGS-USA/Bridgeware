import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import client from '../api/client'

function TicketDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [comment, setComment] = useState('')
  const [timeForm, setTimeForm] = useState({ hours: '', note: '' })
  const [activeTab, setActiveTab] = useState('comments')

  const { data: ticket, isLoading } = useQuery({
    queryKey: ['ticket', id],
    queryFn: () => client.get(`/tickets/${id}`).then(res => res.data)
  })

  const { data: repliesData } = useQuery({
    queryKey: ['ticket-replies', id],
    queryFn: () => client.get(`/tickets/${id}/replies`).then(res => res.data)
  })

  const { data: timeData } = useQuery({
    queryKey: ['ticket-time', id],
    queryFn: () => client.get(`/time-entries?ticket_id=${id}`).then(res => res.data)
  })

  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => client.get('/users').then(res => res.data)
  })

  const replies = Array.isArray(repliesData) ? repliesData : []
  const timeEntries = Array.isArray(timeData) ? timeData : []
  const users = Array.isArray(usersData) ? usersData : []

  const totalHours = timeEntries.reduce((sum, t) => sum + (Number(t.hours) || 0), 0)

  const updateStatus = useMutation({
    mutationFn: (status) => client.patch(`/tickets/${id}`, { status }),
    onSuccess: () => queryClient.invalidateQueries(['ticket', id])
  })

  const updatePriority = useMutation({
    mutationFn: (priority) => client.patch(`/tickets/${id}`, { priority }),
    onSuccess: () => queryClient.invalidateQueries(['ticket', id])
  })

  const updateAssigned = useMutation({
    mutationFn: (assigned_to) => client.patch(`/tickets/${id}`, { assigned_to }),
    onSuccess: () => queryClient.invalidateQueries(['ticket', id])
  })

  const sendComment = useMutation({
    mutationFn: () => client.post(`/tickets/${id}/replies`, { message: comment, author_name: 'Staff' }),
    onSuccess: () => {
      setComment('')
      queryClient.invalidateQueries(['ticket-replies', id])
    }
  })

  const logTime = useMutation({
    mutationFn: () => client.post('/time-entries', {
      ticket_id: id,
      hours: parseFloat(timeForm.hours),
      note: timeForm.note
    }),
    onSuccess: () => {
      setTimeForm({ hours: '', note: '' })
      queryClient.invalidateQueries(['ticket-time', id])
    }
  })

  const statusColors = {
    'Open': 'bg-blue-50 text-blue-700',
    'In progress': 'bg-yellow-50 text-yellow-700',
    'Pending customer': 'bg-orange-50 text-orange-700',
    'Escalated': 'bg-red-50 text-red-700',
    'Resolved': 'bg-green-50 text-green-700',
    'Closed': 'bg-gray-100 text-gray-500',
  }

  const statuses = ['Open', 'In progress', 'Pending customer', 'Escalated', 'Resolved', 'Closed']
  const priorities = ['Low', 'Medium', 'High', 'Critical']

  if (isLoading) return <div className="p-8 text-sm text-gray-400">Loading ticket...</div>
  if (!ticket) return <div className="p-8 text-sm text-red-400">Ticket not found.</div>

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/ticketing')}
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          ← Back
        </button>
        <h1 className="text-xl font-medium text-gray-900 flex-1">{ticket.title}</h1>
        <span className={`text-xs px-2 py-1 rounded font-medium ${statusColors[ticket.status] || 'bg-gray-100 text-gray-500'}`}>
          {ticket.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left — main content */}
        <div className="col-span-2 space-y-4">
          {/* Description */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Description</div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {ticket.description || <span className="text-gray-400 italic">No description provided.</span>}
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex border-b border-gray-100">
              {['comments', 'time'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 text-xs font-medium capitalize transition-colors ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {tab === 'time' ? `Time log (${totalHours.toFixed(1)}h)` : 'Comments'}
                </button>
              ))}
            </div>

            <div className="p-5">
              {activeTab === 'comments' && (
                <>
                  {replies.length === 0 ? (
                    <p className="text-sm text-gray-400 mb-4">No comments yet.</p>
                  ) : (
                    <div className="space-y-3 mb-4">
                      {replies.map((r, i) => (
                        <div key={i} className="bg-gray-50 rounded-lg px-4 py-3">
                          <p className="text-sm text-gray-800">{r.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {r.author_name || 'Staff'} · {r.created_at ? new Date(r.created_at).toLocaleString() : ''}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    rows={3}
                    placeholder="Add a comment..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none mb-2"
                  />
                  <button
                    onClick={() => sendComment.mutate()}
                    disabled={!comment.trim() || sendComment.isPending}
                    className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {sendComment.isPending ? 'Posting...' : 'Post comment'}
                  </button>
                </>
              )}

              {activeTab === 'time' && (
                <>
                  {timeEntries.length === 0 ? (
                    <p className="text-sm text-gray-400 mb-4">No time logged yet.</p>
                  ) : (
                    <div className="space-y-2 mb-4">
                      {timeEntries.map((t, i) => (
                        <div key={i} className="flex items-center gap-4 bg-gray-50 rounded-lg px-4 py-2.5">
                          <span className="text-sm font-medium text-gray-900 w-16">{t.hours}h</span>
                          <span className="text-sm text-gray-600 flex-1">{t.note || '—'}</span>
                          <span className="text-xs text-gray-400">{t.created_at ? new Date(t.created_at).toLocaleDateString() : ''}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={timeForm.hours}
                      onChange={e => setTimeForm(p => ({ ...p, hours: e.target.value }))}
                      placeholder="Hours"
                      min="0"
                      step="0.25"
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-24 focus:outline-none focus:border-blue-400"
                    />
                    <input
                      type="text"
                      value={timeForm.note}
                      onChange={e => setTimeForm(p => ({ ...p, note: e.target.value }))}
                      placeholder="Note (optional)"
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:border-blue-400"
                    />
                    <button
                      onClick={() => logTime.mutate()}
                      disabled={!timeForm.hours || logTime.isPending}
                      className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {logTime.isPending ? 'Logging...' : 'Log time'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right — sidebar details */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
            {/* Status */}
            <div>
              <div className="text-xs font-medium text-gray-500 mb-1">Status</div>
              <select
                value={ticket.status}
                onChange={e => updateStatus.mutate(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              >
                {statuses.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* Priority */}
            <div>
              <div className="text-xs font-medium text-gray-500 mb-1">Priority</div>
              <select
                value={ticket.priority}
                onChange={e => updatePriority.mutate(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              >
                {priorities.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>

            {/* Assigned to */}
            <div>
              <div className="text-xs font-medium text-gray-500 mb-1">Assigned to</div>
              <select
                value={ticket.assigned_to || ''}
                onChange={e => updateAssigned.mutate(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              >
                <option value="">Unassigned</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.full_name}</option>
                ))}
              </select>
            </div>

            {/* Meta info */}
            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">Company</span>
                <span className="text-xs text-gray-700">{ticket.companies?.name || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">Contact</span>
                <span className="text-xs text-gray-700">
                  {ticket.contacts ? `${ticket.contacts.first_name} ${ticket.contacts.last_name}` : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">Team</span>
                <span className="text-xs text-gray-700">{ticket.teams?.name || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">Created</span>
                <span className="text-xs text-gray-700">
                  {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">Time logged</span>
                <span className="text-xs font-medium text-gray-900">{totalHours.toFixed(1)}h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicketDetail