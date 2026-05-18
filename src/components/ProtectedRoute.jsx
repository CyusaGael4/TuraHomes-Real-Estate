import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function ProtectedRoute({ children, agentOnly = false }) {
  const { isAgent, loading, user } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4">
        <div className="rounded-full border border-[var(--color-line)] bg-white px-6 py-3 text-sm text-[var(--color-muted)] shadow-sm">
          Loading your workspace...
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (agentOnly && !isAgent) {
    return <Navigate to="/" replace />
  }

  return children
}
