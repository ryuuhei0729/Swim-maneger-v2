'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts'
import { FullScreenLoading } from '@/components/ui/LoadingSpinner'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
  fallback?: React.ReactNode
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  redirectTo = '/login',
  fallback
}) => {
  const { user, session, isLoading } = useAuth()
  const isAuthenticated = !!user && !!session
  const router = useRouter()
  const [hasRedirected, setHasRedirected] = useState(false)

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated && !hasRedirected) {
      setHasRedirected(true)
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, requireAuth, router, redirectTo, hasRedirected])

  // ローディング中
  if (isLoading) {
    return <FullScreenLoading message="認証情報を確認中..." />
  }

  // 認証が必要だが認証されていない場合
  if (requireAuth && !isAuthenticated) {
    return fallback || null
  }

  // 認証が不要な場合、または認証済みの場合
  return <>{children}</>
}
