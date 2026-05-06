import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../api/supabase'

const TIMEOUT_MINUTES = 30

function useSessionTimeout() {
  const navigate = useNavigate()

  const resetTimer = useCallback((timerRef) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      await supabase.auth.signOut()
      navigate('/login')
    }, TIMEOUT_MINUTES * 60 * 1000)
  }, [navigate])

  useEffect(() => {
    const timerRef = { current: null }
    const handleActivity = () => resetTimer(timerRef)
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
    events.forEach(e => window.addEventListener(e, handleActivity))
    resetTimer(timerRef)

    return () => {
      events.forEach(e => window.removeEventListener(e, handleActivity))
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [resetTimer])
}

export default useSessionTimeout