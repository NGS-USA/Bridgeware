import { useState, useEffect } from 'react'
import supabase from '../api/supabase'

function Account() {
  const [user, setUser] = useState(null)
  const [factors, setFactors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showSetup, setShowSetup] = useState(false)
  const [qrCode, setQrCode] = useState(null)
  const [secret, setSecret] = useState(null)
  const [factorId, setFactorId] = useState(null)
  const [verifyCode, setVerifyCode] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [enrollLoading, setEnrollLoading] = useState(false)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase.auth.mfa.listFactors()
    setUser(user)
    setFactors(data?.totp || [])
    setLoading(false)
  }

  const handleSetupMFA = async () => {
    setEnrollLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: 'Bridgeware Authenticator'
    })

    if (error) {
      setError(error.message)
      setEnrollLoading(false)
      return
    }

    setQrCode(data.totp.qr_code)
    setSecret(data.totp.secret)
    setFactorId(data.id)
    setShowSetup(true)
    setEnrollLoading(false)
  }

  const handleVerify = async () => {
    setEnrollLoading(true)
    setError(null)

    const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({ factorId })
    if (challengeError) {
      setError(challengeError.message)
      setEnrollLoading(false)
      return
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challengeData.id,
      code: verifyCode
    })

    if (verifyError) {
      setError('Invalid code. Please try again.')
      setEnrollLoading(false)
      return
    }

    setShowSetup(false)
    setVerifyCode('')
    setSuccess('MFA has been enabled on your account.')
    localStorage.removeItem('mfa_prompt_dismissed')
    await loadUserData()
    setEnrollLoading(false)
  }

  const handleRemoveMFA = async (id) => {
    const { error } = await supabase.auth.mfa.unenroll({ factorId: id })
    if (error) {
      setError(error.message)
      return
    }
    setSuccess('MFA has been removed from your account.')
    await loadUserData()
  }

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-xl font-medium text-gray-900 mb-6">Account settings</h1>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="text-sm font-medium text-gray-900">Profile</div>
        </div>
        <div className="px-5 py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-medium flex-shrink-0">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">{user?.email}</div>
              <div className="text-xs text-gray-400 mt-0.5">Last sign in: {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="text-sm font-medium text-gray-900">Two-factor authentication</div>
          <div className="text-xs text-gray-400 mt-0.5">Add an extra layer of security to your account</div>
        </div>
        <div className="px-5 py-4">
          {success && (
            <div className="bg-green-50 text-green-700 text-sm px-3 py-2 rounded mb-4">{success}</div>
          )}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded mb-4">{error}</div>
          )}
          {factors.length > 0 ? (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 8l4 4 6-7"/>
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">MFA is enabled</div>
                  <div className="text-xs text-gray-400">Authenticator app is active on your account</div>
                </div>
              </div>
              {factors.map(factor => (
                <div key={factor.id} className="flex items-center justify-between py-2 border-t border-gray-100">
                  <div>
                    <div className="text-sm text-gray-700">{factor.friendly_name}</div>
                    <div className="text-xs text-gray-400">Added {new Date(factor.created_at).toLocaleDateString()}</div>
                  </div>
                  <button
                    onClick={() => handleRemoveMFA(factor.id)}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : showSetup ? (
            <div>
              <p className="text-sm text-gray-500 mb-4">Scan this QR code with your authenticator app then enter the 6-digit code to verify.</p>
              {qrCode && (
                <div className="flex justify-center mb-4">
                  <img src={qrCode} alt="MFA QR Code" className="w-44 h-44" />
                </div>
              )}
              <p className="text-xs text-gray-400 text-center mb-1">Can't scan? Enter this code manually:</p>
              <p className="text-xs font-mono text-center text-gray-600 bg-gray-50 px-3 py-2 rounded mb-4 break-all">{secret}</p>
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-600 mb-1">Verification code</label>
                <input
                  type="text"
                  value={verifyCode}
                  onChange={e => setVerifyCode(e.target.value)}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 text-center tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleVerify}
                  disabled={enrollLoading || verifyCode.length !== 6}
                  className="flex-1 bg-blue-600 text-white text-sm font-medium py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {enrollLoading ? 'Verifying...' : 'Verify and enable'}
                </button>
                <button
                  onClick={() => setShowSetup(false)}
                  className="px-4 text-sm text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-500 mb-4">MFA is not enabled on your account. We recommend enabling it for extra security.</p>
              <button
                onClick={handleSetupMFA}
                disabled={enrollLoading}
                className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {enrollLoading ? 'Setting up...' : 'Enable MFA'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Account