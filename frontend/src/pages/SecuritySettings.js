import { useState } from 'react'

function SecuritySettings() {
  const [settings, setSettings] = useState({
    mfa_enforcement: 'optional',
    session_timeout: '30',
    max_login_attempts: '10',
    password_min_length: '8',
    require_uppercase: true,
    require_numbers: true,
    require_symbols: false
  })
  const [saved, setSaved] = useState(false)

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setSettings({ ...settings, [e.target.name]: value })
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-xl font-medium text-gray-900 mb-6">Security settings</h1>

      {saved && (
        <div className="bg-green-50 text-green-700 text-sm px-3 py-2 rounded mb-4">
          Settings saved successfully.
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="text-sm font-medium text-gray-900">Multi-factor authentication</div>
          <div className="text-xs text-gray-400 mt-0.5">Control MFA requirements across all users</div>
        </div>
        <div className="px-5 py-4">
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-2">MFA requirement</label>
            <div className="grid gap-2">
              {[
                { value: 'optional', label: 'Optional', desc: 'Users are prompted to set up MFA but can skip it' },
                { value: 'enforced', label: 'Enforced — all users', desc: 'All users must set up MFA before accessing Bridgeware' },
                { value: 'enforced_admins', label: 'Enforced — admins only', desc: 'Only admin and manager roles are required to have MFA' },
              ].map(option => (
                <label key={option.value} className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${settings.mfa_enforcement === option.value ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input
                    type="radio"
                    name="mfa_enforcement"
                    value={option.value}
                    checked={settings.mfa_enforcement === option.value}
                    onChange={handleChange}
                    className="mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{option.label}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="text-sm font-medium text-gray-900">Session settings</div>
          <div className="text-xs text-gray-400 mt-0.5">Control how long users stay logged in</div>
        </div>
        <div className="px-5 py-4 grid gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Session timeout (minutes)</label>
            <select
              name="session_timeout"
              value={settings.session_timeout}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="480">8 hours</option>
              <option value="0">Never</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Max login attempts before lockout</label>
            <select
              name="max_login_attempts"
              value={settings.max_login_attempts}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            >
              <option value="5">5 attempts</option>
              <option value="10">10 attempts</option>
              <option value="15">15 attempts</option>
              <option value="20">20 attempts</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="text-sm font-medium text-gray-900">Password requirements</div>
          <div className="text-xs text-gray-400 mt-0.5">Applies to all new passwords and password changes</div>
        </div>
        <div className="px-5 py-4 grid gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Minimum password length</label>
            <select
              name="password_min_length"
              value={settings.password_min_length}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            >
              <option value="8">8 characters</option>
              <option value="10">10 characters</option>
              <option value="12">12 characters</option>
              <option value="16">16 characters</option>
            </select>
          </div>
          <div className="grid gap-2">
            {[
              { name: 'require_uppercase', label: 'Require uppercase letters' },
              { name: 'require_numbers', label: 'Require numbers' },
              { name: 'require_symbols', label: 'Require symbols' },
            ].map(req => (
              <label key={req.name} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name={req.name}
                  checked={settings[req.name]}
                  onChange={handleChange}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-600">{req.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700"
      >
        Save settings
      </button>
    </div>
  )
}

export default SecuritySettings