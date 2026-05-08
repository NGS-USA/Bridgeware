import { useNavigate } from 'react-router-dom'
import supabase from '../api/supabase'

function PortalLayout({ children, companyName }) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/portal')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-48 bg-slate-900 flex flex-col fixed left-0 top-0 h-screen">
        <div className="p-3 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-medium">B</div>
            <span className="text-slate-100 text-xs font-medium">Client Portal</span>
          </div>
          {companyName && (
            <div className="text-slate-400 text-xs mt-1">{companyName}</div>
          )}
        </div>
        <nav className="flex-1 p-2">
          {[
            { label: 'Overview', path: '/portal/dashboard' },
            { label: 'Tickets', path: '/portal/tickets' },
            { label: 'Invoices', path: '/portal/invoices' },
            { label: 'Quotes', path: '/portal/quotes' },
            { label: 'Documents', path: '/portal/documents' },
          ].map(item => (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex items-center px-2 py-1.5 rounded text-xs mb-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 cursor-pointer"
            >
              {item.label}
            </div>
          ))}
        </nav>
        <div className="p-2 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full text-left px-2 py-1.5 text-xs text-slate-500 hover:text-slate-300"
          >
            Sign out
          </button>
        </div>
      </div>
      <div className="ml-48 flex-1">
        {children}
      </div>
    </div>
  )
}

export default PortalLayout