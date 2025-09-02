'use client'

import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { User } from '@supabase/supabase-js'
import { createClientComponentClient } from '@/lib/supabase'
import { useMe, useUpdateProfile } from '@/hooks/useGraphQL'
import type { Profile } from '@/types'

// 認証状態の型定義
interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
}

// 認証コンテキストの型定義
interface AuthContextType extends AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, name?: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<Profile | null>
  refreshProfile: () => void
  resetPassword?: (email: string) => Promise<{ error: any }>
  updatePassword?: (password: string) => Promise<{ error: any }>
}

// 認証コンテキストを作成
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// AuthProviderコンポーネント
export function GraphQLAuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true
  })
  const [initializing, setInitializing] = useState(true)

  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const supabase = createClientComponentClient()

  // GraphQL hooks - 認証されたユーザーがいる場合のみクエリ実行
  const { data: profileData, loading: profileLoading, error: profileError, refetch: refetchProfile } = useMe(!authState.user)
  const [updateProfileMutation] = useUpdateProfile()

  // デバッグログ
  useEffect(() => {
    console.log('GraphQL Profile Debug:', {
      loading: profileLoading,
      error: profileError,
      data: profileData,
      user: authState.user?.id
    })
  }, [profileLoading, profileError, profileData, authState.user])

  // プロフィール情報を更新
  useEffect(() => {
    if (!initializing && authState.user && !profileLoading) {
      if ((profileData as any)?.me) {
        setAuthState(prev => ({
          ...prev,
          profile: (profileData as any).me,
          loading: false
        }))
      } else if (profileError) {
        // GraphQLエラーの場合、Supabaseのuser_metadataから代替データを作成
        console.warn('GraphQL profile fetch failed, using Supabase metadata:', profileError)
        const fallbackProfile = {
          id: authState.user.id,
          email: authState.user.email || '',
          name: authState.user.user_metadata?.name || authState.user.email?.split('@')[0] || 'ユーザー',
          avatar_url: authState.user.user_metadata?.avatar_url || null,
          role: authState.user.user_metadata?.role || 'player',
          generation: authState.user.user_metadata?.generation || null,
          birthday: authState.user.user_metadata?.birthday || null,
          bio: authState.user.user_metadata?.bio || null,
          gender: authState.user.user_metadata?.gender || 0,
          created_at: authState.user.created_at,
          updated_at: authState.user.updated_at || authState.user.created_at,
        }
        setAuthState(prev => ({
          ...prev,
          profile: fallbackProfile,
          loading: false
        }))
      } else {
        // プロフィールが取得できない場合も loading を false に
        setAuthState(prev => ({
          ...prev,
          loading: false
        }))
      }
    }
  }, [profileData, profileLoading, profileError, authState.user, initializing])

  // 最小ローディング時間を設定（ちらつき防止）
  useEffect(() => {
    const minLoadingTime = setTimeout(() => {
      setInitializing(false)
    }, 800) // 800msの最小ローディング時間

    const maxLoadingTimeout = setTimeout(() => {
      setAuthState(prev => ({ ...prev, loading: false }))
      setInitializing(false)
    }, 3000) // 最大3秒でローディング終了

    return () => {
      clearTimeout(minLoadingTime)
      clearTimeout(maxLoadingTimeout)
    }
  }, [])

  // 初期セッション取得とリスナー設定
  useEffect(() => {
    let mounted = true

    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!mounted) return
        
        if (error) {
          console.error('Session error:', error)
          if (!initializing) {
            setAuthState({
              user: null,
              profile: null,
              loading: false
            })
          }
          return
        }
        
        if (session?.user) {
          setAuthState(prev => ({
            ...prev,
            user: session.user,
            loading: true
          }))
          
          // GraphQL でプロフィール取得
          refetchProfile()
        } else {
          if (!initializing) {
            setAuthState({
              user: null,
              profile: null,
              loading: false
            })
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        if (!mounted || !initializing) {
          setAuthState({
            user: null,
            profile: null,
            loading: false
          })
        }
      }
    }

    // 初期化が完了してからセッション取得
    if (!initializing) {
      getInitialSession()
    }

    // 認証状態変更リスナー
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        if (event === 'SIGNED_IN' && session?.user) {
          setAuthState(prev => ({
            ...prev,
            user: session.user,
            loading: true
          }))
          refetchProfile()
        } else if (event === 'SIGNED_OUT') {
          setAuthState({
            user: null,
            profile: null,
            loading: false
          })
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }
    }
  }, [supabase.auth, refetchProfile, initializing])

  // サインイン
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        return { error }
      }
      
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  // サインアップ
  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || '',
            role: 'player', // デフォルトロール
          },
        },
      })
      
      if (error) {
        return { error }
      }
      
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  // サインアウト
  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  // プロフィール更新（GraphQL使用）
  const updateProfile = async (updates: Partial<Profile>): Promise<Profile | null> => {
    try {
      const { data } = await updateProfileMutation({
        variables: {
          input: updates
        }
      })
      
      if ((data as any)?.updateProfile) {
        setAuthState(prev => ({
          ...prev,
          profile: { ...prev.profile, ...(data as any).updateProfile } as Profile
        }))
        return (data as any).updateProfile
      }
      
      return null
    } catch (error) {
      console.error('Profile update error:', error)
      return null
    }
  }

  // プロフィール再取得
  const refreshProfile = () => {
    refetchProfile()
  }

  const value: AuthContextType = {
    ...authState,
    isAuthenticated: !!authState.user,
    isLoading: authState.loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshProfile,
    resetPassword: async (email: string) => {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email)
        return { error }
      } catch (error) {
        return { error }
      }
    },
    updatePassword: async (password: string) => {
      try {
        const { error } = await supabase.auth.updateUser({ password })
        return { error }
      } catch (error) {
        return { error }
      }
    },
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// カスタムフック
export const useGraphQLAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useGraphQLAuth must be used within a GraphQLAuthProvider')
  }
  return context
}

export default GraphQLAuthProvider
