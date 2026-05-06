import { useState } from 'react'
import supabase from '../api/supabase'

function MFAPrompt({ onComplete, onSkip }) {
  const [step, setStep] = useState('prompt')
  const [qrCode, setQrCode] = useState(null)
  const [secret, setSecret] = useState(null)
  const [factorId, setFactorId] = useState(null)
  const [verifyCode, setVerifyCode] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSetupMFA = async () => {
    setLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: 'Bridgeware Authenticator'
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setQrCode(data.totp.qr_code)
    setSecret(data.totp.secret)
    setFactorId(data.id)
    setStep('scan')
    setLoading(false)
  }

  const handleVerify = async () => {
    setLoading(true)
    setError(null)

    const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({ factorId })
    if (challengeError) {
      setError(challengeError.message)
      setLoading(false)
      return
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challengeData.id,
      code: verifyCode
    })

    if (verifyError) {
      setError('Invalid code. Please try again.')
      setLoading(false)
      return
    }

    setStep('success')
    setLoading(false)
  }

  const handleDontAskAgain = () => {
    localStorage.setItem('mfa_prompt_dismissed', 'true')
    onSkip()
  }

  if (step === 'prompt') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg">
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-blue-600" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1a4 4 0 00-4 4v2H3a1 1 0 00-1 1v7h12V8a1 1 0 00-1-1h-1V5a4 4 0 00-4-4zm0 9a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"/>
            </svg>
          </div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">Set up two-factor authentication</h2>
          <p className="text-sm text-gray-500 mb-6">Add an extra layer of security to your Bridgeware account. You'll need an authenticator app like Google Authenticator or Authy.</p>
          {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded mb-4">{error}</div>}
          <button
            onClick={handleSetupMFA}
            disabled={loading}
            className="w-full bg-blue-600 text-white text-sm font-medium py-2 rounded hover:bg-blue-700 disabled:opacity-50 mb-3"
          >
            {loading ? 'Setting up...' : 'Set up MFA'}
          </button>
          <button
            onClick={onSkip}
            className="w-full text-sm text-gray-500 py-2 rounded hover:bg-gray-50 mb-2"
          >
            Remind me later
          </button>
          <button
            onClick={handleDontAskAgain}
            className="w-full text-xs text-gray-400 py-1 hover:text-gray-500"
          >
            Don't ask again
          </button>
        </div>
      </div>
    )
  }

  if (step === 'scan') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Scan the QR code</h2>
          <p className="text-sm text-gray-500 mb-4">Open your authenticator app and scan this QR code.</p>
          {qrCode && (
            <div className="flex justify-center mb-4">
              <img src={qrCode} alt="MFA QR Code" className="w-48 h-48" />
            </div>
          )}
          <p className="text-xs text-gray-400 text-center mb-1">Can't scan? Enter this code manually:</p>
          <p className="text-xs font-mono text-center text-gray-600 bg-gray-50 px-3 py-2 rounded mb-4 break-all">{secret}</p>
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-1">Enter the 6-digit code from your app</label>
            <input
              type="text"
              value={verifyCode}
              onChange={e => setVerifyCode(e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 text-center tracking-widest"
              placeholder="000000"
              maxLength={6}
            />
          </div>
          {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded mb-4">{error}</div>}
          <button
            onClick={handleVerify}
            disabled={loading || verifyCode.length !== 6}
            className="w-full bg-blue-600 text-white text-sm font-medium py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify and enable MFA'}
          </button>
        </div>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg text-center">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 8l4 4 6-7"/>
            </svg>
          </div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">MFA enabled</h2>
          <p className="text-sm text-gray-500 mb-6">Your account is now protected with two-factor authentication.</p>
          <button
            onClick={onComplete}
            className="w-full bg-blue-600 text-white text-sm font-medium py-2 rounded hover:bg-blue-700"
          >
            Continue to Bridgeware
          </button>
        </div>
      </div>
    )
  }
}

export default MFAPrompt