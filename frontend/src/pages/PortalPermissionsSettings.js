import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import client from '../api/client'

function PortalPermissionsSettings() {
  const queryClient = useQueryClient()
  const [selectedCompany, setSelectedCompany] = useState('')
  const [saved, setSaved] = useState(false)

  const { data: companiesData } = useQuery({
    queryKey: ['companies'],
    queryFn: () => client.get('/companies').then(res => res.data)
  })

  const companies = Array.isArray(companiesData) ? companiesData : []

  const { data: perms, isLoading: permsLoading } = useQuery({
    queryKey: ['portal-permissions', selectedCompany],
    queryFn: () => client.get(`/portal-permissions/${selectedCompany}`).then(res => res.data),
    enabled: !!selectedCompany
  })

  const [form, setForm] = useState({
    show_tickets: true,
    show_invoices: true,
    show_quotes: true,
    show_documents: true
  })

  // When permissions load for selected company, populate form
  useState(() => {
    if (perms) setForm({
      show_tickets: perms.show_tickets,
      show_invoices: perms.show_invoices,
      show_quotes: perms.show_quotes,
      show_documents: perms.show_documents
    })
  }, [perms])

  const save = useMutation({
    mutationFn: () => client.post(`/portal-permissions/${selectedCompany}`, form),
    onSuccess: () => {
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
      queryClient.invalidateQueries(['portal-permissions', selectedCompany])
    }
  })

  const toggle = (field) => setForm(prev => ({ ...prev, [field]: !prev[field] }))

  const sections = [
    { field: 'show_tickets', label: 'Tickets', description: 'Client can view and reply to support tickets' },
    { field: 'show_invoices', label: 'Invoices', description: 'Client can view and pay invoices' },
    { field: 'show_quotes', label: 'Quotes', description: 'Client can view, accept, and decline quotes' },
    { field: 'show_documents', label: 'Documents', description: 'Client can view shared documents' },
  ]

  return (
    <div className="max-w-2xl">
      <h2 className="text-base font-medium text-gray-900 mb-1">Client portal permissions</h2>
      <p className="text-sm text-gray-500 mb-6">Control what each client company can see in the portal.</p>

      <div className="mb-6">
        <label className="block text-xs font-medium text-gray-700 mb-1">Select company</label>
        <select
          value={selectedCompany}
          onChange={e => { setSelectedCompany(e.target.value); setSaved(false) }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-72 focus:outline-none focus:border-blue-400"
        >
          <option value="">— Choose a company —</option>
          {companies.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {selectedCompany && (
        permsLoading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
            {sections.map(({ field, label, description }) => (
              <div key={field} className="flex items-center justify-between px-4 py-4">
                <div>
                  <div className="text-sm font-medium text-gray-800">{label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{description}</div>
                </div>
                <button
                  onClick={() => toggle(field)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${form[field] ? 'bg-blue-600' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${form[field] ? 'translate-x-4' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}

            <div className="px-4 py-4 flex items-center gap-3">
              <button
                onClick={() => save.mutate()}
                disabled={save.isPending}
                className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {save.isPending ? 'Saving...' : 'Save permissions'}
              </button>
              {saved && <span className="text-xs text-green-600 font-medium">✓ Saved</span>}
            </div>
          </div>
        )
      )}
    </div>
  )
}

export default PortalPermissionsSettings