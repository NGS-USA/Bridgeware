import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../api/supabase'

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/login')
      } else {
        setLoading(false)
      }
    })
  }, [navigate])

  if (loading) return <div className="p-8 text-gray-400 text-sm">Loading...</div>

  return children
}

export default ProtectedRoute