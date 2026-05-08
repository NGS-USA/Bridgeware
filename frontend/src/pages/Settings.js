import { useNavigate } from 'react-router-dom'

function Settings() {
  const navigate = useNavigate()

  const sections = [
    { title: 'Company identity', desc: 'Logo, name, contact details', path: '/settings/company' },
    { title: 'Brand colors', desc: 'Primary and accent colors', path: '/settings/branding' },
    { title: 'Invoices', desc: 'Layout, footer, payment terms', path: '/settings/invoices' },
    { title: 'Quotes', desc: 'Layout, validity, footer', path: '/settings/quotes' },
    { title: 'Email templates', desc: 'Branded email header and footer', path: '/settings/email-templates' },
    { title: 'Email providers', desc: 'Outlook and Google linking', path: '/settings/email-providers' },
    { title: 'Roles & permissions', desc: 'Role hierarchy and access control', path: '/settings/roles' },
    { title: 'Departments & teams', desc: 'Structure and membership', path: '/settings/departments' },
    { title: 'Global status manager', desc: 'Statuses for all modules', path: '/settings/statuses' },
    { title: 'PTO approval chain', desc: 'Hierarchy-aware escalation', path: '/settings/pto' },
    { title: 'Security', desc: 'MFA enforcement, session timeout, password rules', path: '/settings/security' },
    { title: 'Integrations', desc: 'QuickBooks, vendor APIs', path: '/settings/integrations' },
  ]

  return (
    <div className="p-8">
      <h1 className="text-xl font-medium text-gray-900 mb-6">Settings</h1>
      <div className="grid grid-cols-3 gap-4">
        {sections.map(item => (
          <div
            key={item.title}
            onClick={() => navigate(item.path)}
            className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-300 transition-colors"
          >
            <div className="text-sm font-medium text-gray-900 mb-1">{item.title}</div>
            <div className="text-xs text-gray-400">{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Settings