function Settings() {
  return (
    <div className="p-8">
      <h1 className="text-xl font-medium text-gray-900 mb-6">Settings</h1>
      <div className="grid grid-cols-3 gap-4">
        {[
          { title: 'Company identity', desc: 'Logo, name, contact details' },
          { title: 'Brand colors', desc: 'Primary and accent colors' },
          { title: 'Invoices', desc: 'Layout, footer, payment terms' },
          { title: 'Quotes', desc: 'Layout, validity, footer' },
          { title: 'Email templates', desc: 'Branded email header and footer' },
          { title: 'Email providers', desc: 'Outlook and Google linking' },
          { title: 'Roles & permissions', desc: 'Role hierarchy and access control' },
          { title: 'Departments & teams', desc: 'Structure and membership' },
          { title: 'Global status manager', desc: 'Statuses for all modules' },
          { title: 'PTO approval chain', desc: 'Hierarchy-aware escalation' },
          { title: 'Workflows', desc: 'Automation and triggers' },
          { title: 'Integrations', desc: 'QuickBooks, vendor APIs' },
        ].map(item => (
          <div key={item.title} className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-300 transition-colors">
            <div className="text-sm font-medium text-gray-900 mb-1">{item.title}</div>
            <div className="text-xs text-gray-400">{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Settings