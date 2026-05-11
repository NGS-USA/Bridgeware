import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import PortalLayout from '../../layouts/PortalLayout'
import client from '../../api/client'

function PortalTicketDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [message, setMessage] = useState('')

  const { data: ticket, isLoading } = useQuery({
    queryKey: ['portal-ticket', id],
    queryFn: () => client.get(`/tickets/${id}`).then(res => res.data)
  })

  const { data: repliesData } = useQuery({
    queryKey: ['portal-ticket-replies', id],
    queryFn: () => client.get(`/tickets/${id}/replies`).then(res => res.data)
  })

  const replies = Array.isArray(repliesData) ? repliesData : []

  const sendReply = useMutation({
    mutationFn: () => client.post(`/tickets/${id}/replies`, { message }),
    onSuccess: () => {
      setMessage('')
      queryClient.invalidateQueries(['portal-ticket-replies', id])
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

  if (isLoading) return (
    <PortalLayout>
      <div className="p-8 text-sm text-gray-400">Loading ticket...</div>
    </PortalLayout>
  )

  return (
    <PortalLayout>
      <div className="p-8 max-w-2xl">
        <button
          onClick={() => navigate('/portal/tickets')}
          className="text-xs text-gray-400 hover:text-gray-600 mb-6 flex items-center gap-1"
        >
          ← Back to tickets
        </button>

        {ticket && (
          <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="text-base font-medium text-gray-900">{ticket.subject || ticket.title}</h1>
              <span className={`text-xs px-2 py-1 rounded font-medium shrink-0 ${statusColors[ticket.status] || 'bg-gray-100 text-gray-500'}`}>
                {ticket.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">{ticket.description}</p>
            <div className="flex gap-4 text-xs text-gray-400">
              <span>Priority: {ticket.priority}</span>
              <span>Opened: {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : '—'}</span>
            </div>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-sm font-medium text-gray-700 mb-4">
            Messages {replies.length > 0 && <span className="text-gray-400 font-normal">({replies.length})</span>}
          </h2>

          {replies.length === 0 ? (
            <p className="text-sm text-gray-400 mb-4">No messages yet.</p>
          ) : (
            <div className="space-y-3 mb-4">
              {replies.map((r, i) => (
                <div key={i} className="bg-gray-50 rounded-lg px-4 py-3">
                  <p className="text-sm text-gray-800">{r.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {r.author_name || r.author || 'Support'} · {r.created_at ? new Date(r.created_at).toLocaleString() : ''}
                  </p>
                </div>
              ))}
            </div>
          )}

          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={3}
            placeholder="Type your message..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none mb-3"
          />
          <button
            onClick={() => sendReply.mutate()}
            disabled={!message.trim() || sendReply.isPending}
            className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {sendReply.isPending ? 'Sending...' : 'Send reply'}
          </button>
        </div>
      </div>
    </PortalLayout>
  )
}

export default PortalTicketDetail