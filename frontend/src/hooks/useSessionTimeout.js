import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../api/supabase'

const TIMEOUT_MINUTES = 30

function useSessionTimeout() {
  const navigate = useNavigate()
  const timerRef = useRef(null)

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      await supabase.auth.signOut()
      navigate('/login')
    }, TIMEOUT_MINUTES * 60 * 1000)
  }

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
    events.forEach(e => window.addEventListener(e, resetTimer))
    resetTimer()

    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer))
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])
}

export default useSessionTimeout