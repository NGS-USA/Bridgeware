import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../api/supabase'

function MFAChallenge() {
  const [code, setCode] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleVerify = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: factors } = await supabase.auth.mfa.listFactors()
      const totpFactor = factors?.totp?.[0]

      if (!totpFactor) {
        navigate('/dashboard')
        return
      }

      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: totpFactor.id
      })

      if (challengeError) {
        setError(challengeError.message)
        setLoading(false)
        return
      }

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: totpFactor.id,
        challengeId: challenge.id,
        code
      })

      if (verifyError) {
        setError('Invalid code. Please try again.')
        setLoading(false)
        return
      }

      navigate('/dashboard')
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white border border-gray-200 rounded-lg p-8 w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center text-white text-sm font-medium">B</div>
          <span className="text-gray-900 font-medium">Bridgeware</span>
        </div>
        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-5 h-5 text-blue-600" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a4 4 0 00-4 4v2H3a1 1 0 00-1 1v7h12V8a1 1 0 00-1-1h-1V5a4 4 0 00-4-4zm0 9a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"/>
          </svg>
        </div>
        <h1 className="text-lg font-medium text-gray-900 mb-1">Two-factor authentication</h1>
        <p className="text-sm text-gray-400 mb-6">Enter the 6-digit code from your authenticator app.</p>
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleVerify}>
          <div className="mb-6">
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 text-center tracking-widest text-lg"
              placeholder="000000"
              maxLength={6}
              autoFocus
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full bg-blue-600 text-white text-sm font-medium py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default MFAChallenge