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

  // クライアントサイドでの認証状態変更を監視
  // ミドルウェアがサーバーサイドでの認証チェックを担当するため、
  // ここでは主にリアルタイムな状態変更（例：別タブでログアウト）を検知
  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated && !hasRedirected) {
      setHasRedirected(true)
      // リダイレクト先に現在のパスを追加
      const currentPath = window.location.pathname
      const redirectUrl = new URL(redirectTo, window.location.origin)
      redirectUrl.searchParams.set('redirect_to', currentPath)
      router.push(redirectUrl.toString())
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
