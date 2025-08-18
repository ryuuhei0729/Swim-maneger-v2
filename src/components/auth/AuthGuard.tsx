'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
  allowedRoles?: Array<'admin' | 'coach' | 'swimmer'>
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  redirectTo = '/login',
  allowedRoles
}) => {
  const { isAuthenticated, isLoading, profile } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo)
        return
      }

      if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
        router.push('/unauthorized')
        return
      }
    }
  }, [isAuthenticated, isLoading, profile, requireAuth, allowedRoles, router, redirectTo])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (requireAuth && !isAuthenticated) {
    return null
  }

  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    return null
  }

  return <>{children}</>
}
