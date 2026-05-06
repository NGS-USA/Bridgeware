import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../api/supabase'
import MFAPrompt from './MFAPrompt'

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const [showMFA, setShowMFA] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        navigate('/login')
        return
      }

      const dismissed = localStorage.getItem('mfa_prompt_dismissed')
      if (dismissed) {
        setLoading(false)
        return
      }

      const { data } = await supabase.auth.mfa.listFactors()
      const hasMFA = data?.totp?.length > 0

      if (!hasMFA) {
        setShowMFA(true)
      }

      setLoading(false)
    })
  }, [navigate])

  if (loading) return <div className="p-8 text-gray-400 text-sm">Loading...</div>

  return (
    <>
      {showMFA && (
        <MFAPrompt
          onComplete={() => setShowMFA(false)}
          onSkip={() => setShowMFA(false)}
        />
      )}
      {children}
    </>
  )
}

export default ProtectedRoute