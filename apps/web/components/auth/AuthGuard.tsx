'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts'
import { FullScreenLoading } from '@/components/ui/LoadingSpinner'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
  // allowedRolesは削除（roleカラムが削除されたため）
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  redirectTo = '/login'
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

      // roleカラムが削除されたため、ロールベースのアクセス制御は無効化
    }
  }, [isAuthenticated, isLoading, requireAuth, router, redirectTo])

  if (isLoading) {
    return <FullScreenLoading message="認証情報を確認中..." />
  }

  if (requireAuth && !isAuthenticated) {
    return null
  }

  // roleカラムが削除されたため、ロールベースのアクセス制御は無効化

  return <>{children}</>
}
