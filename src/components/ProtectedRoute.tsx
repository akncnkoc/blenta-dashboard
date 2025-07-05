import { Navigate, useRouter } from '@tanstack/react-router'
import { isAuthenticated } from '../lib/auth.ts'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()

  if (!isAuthenticated()) {
    // redirect to login if not authenticated
    return <Navigate to="/login" />
  }

  return <>{children}</>
}

export default ProtectedRoute
