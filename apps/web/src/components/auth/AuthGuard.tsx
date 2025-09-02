'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers'
import { FullScreenLoading } from '@/components/ui/LoadingSpinner'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
  allowedRoles?: Array<'admin' | 'manager' | 'player' | 'coach' | 'director'>
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  redirectTo = '/login',
  allowedRoles
}) => {
  const { user, loading, profile } = useAuth()
  const isAuthenticated = !!user
  const isLoading = loading
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
    return <FullScreenLoading message="認証情報を確認中..." />
  }

  if (requireAuth && !isAuthenticated) {
    return null
  }

  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    return null
  }

  return <>{children}</>
}
