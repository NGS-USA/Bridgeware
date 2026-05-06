import { NavLink, useNavigate } from 'react-router-dom'
import supabase from '../api/supabase'

function Sidebar() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="w-48 bg-slate-900 flex flex-col h-screen fixed left-0 top-0">
      <div className="p-3 border-b border-slate-800 flex items-center gap-2">
        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-medium">B</div>
        <span className="text-slate-100 text-sm font-medium">Bridgeware</span>
      </div>
      <nav className="flex-1 p-2 overflow-y-auto">
        <NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-2 px-2 py-1.5 rounded text-xs mb-1 ${isActive ? 'bg-slate-700 text-slate-100 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
          Dashboard
        </NavLink>
        <div className="text-slate-600 text-xs font-medium uppercase tracking-wider px-2 py-1 mt-2">Customers</div>
        <NavLink to="/crm" className={({ isActive }) => `flex items-center gap-2 px-2 py-1.5 rounded text-xs mb-1 ${isActive ? 'bg-slate-700 text-slate-100 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
          CRM
        </NavLink>
        <NavLink to="/sales" className={({ isActive }) => `flex items-center gap-2 px-2 py-1.5 rounded text-xs mb-1 ${isActive ? 'bg-slate-700 text-slate-100 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
          Sales
        </NavLink>
        <NavLink to="/marketing" className={({ isActive }) => `flex items-center gap-2 px-2 py-1.5 rounded text-xs mb-1 ${isActive ? 'bg-slate-700 text-slate-100 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
          Marketing
        </NavLink>
        <div className="text-slate-600 text-xs font-medium uppercase tracking-wider px-2 py-1 mt-2">Service</div>
        <NavLink to="/ticketing" className={({ isActive }) => `flex items-center gap-2 px-2 py-1.5 rounded text-xs mb-1 ${isActive ? 'bg-slate-700 text-slate-100 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
          Ticketing
        </NavLink>
        <NavLink to="/psa" className={({ isActive }) => `flex items-center gap-2 px-2 py-1.5 rounded text-xs mb-1 ${isActive ? 'bg-slate-700 text-slate-100 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
          PSA
        </NavLink>
        <NavLink to="/projects" className={({ isActive }) => `flex items-center gap-2 px-2 py-1.5 rounded text-xs mb-1 ${isActive ? 'bg-slate-700 text-slate-100 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
          Projects
        </NavLink>
        <div className="text-slate-600 text-xs font-medium uppercase tracking-wider px-2 py-1 mt-2">Finance</div>
        <NavLink to="/invoicing" className={({ isActive }) => `flex items-center gap-2 px-2 py-1.5 rounded text-xs mb-1 ${isActive ? 'bg-slate-700 text-slate-100 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
          Invoicing
        </NavLink>
        <NavLink to="/erp" className={({ isActive }) => `flex items-center gap-2 px-2 py-1.5 rounded text-xs mb-1 ${isActive ? 'bg-slate-700 text-slate-100 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
          ERP
        </NavLink>
        <div className="text-slate-600 text-xs font-medium uppercase tracking-wider px-2 py-1 mt-2">People</div>
        <NavLink to="/hr" className={({ isActive }) => `flex items-center gap-2 px-2 py-1.5 rounded text-xs mb-1 ${isActive ? 'bg-slate-700 text-slate-100 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
          HR
        </NavLink>
        <div className="text-slate-600 text-xs font-medium uppercase tracking-wider px-2 py-1 mt-2">System</div>
        <NavLink to="/workflows" className={({ isActive }) => `flex items-center gap-2 px-2 py-1.5 rounded text-xs mb-1 ${isActive ? 'bg-slate-700 text-slate-100 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
          Workflows
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `flex items-center gap-2 px-2 py-1.5 rounded text-xs mb-1 ${isActive ? 'bg-slate-700 text-slate-100 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
          Settings
        </NavLink>
      </nav>
      <div className="p-2 border-t border-slate-800">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 text-xs font-medium flex-shrink-0">JD</div>
          <div className="flex-1">
            <div className="text-slate-300 text-xs font-medium">Jane Doe</div>
            <div className="text-slate-500 text-xs">Admin</div>
          </div>
          <button onClick={handleLogout} className="text-slate-500 hover:text-slate-300 text-xs transition-colors">
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar