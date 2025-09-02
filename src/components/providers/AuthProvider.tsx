'use client'

import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { User } from '@supabase/supabase-js'
import { createClientComponentClient } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type UserProfile = Database['public']['Tables']['users']['Row']

interface AuthState {
  user: User | null
  profile: UserProfile | null
  loading: boolean
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>
  signUp: (email: string, password: string, name?: string) => Promise<{ data: any; error: any }>
  signOut: () => Promise<{ error: any }>
  resetPassword: (email: string) => Promise<{ error: any }>
  updatePassword: (newPassword: string) => Promise<{ error: any }>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hot Reload対応のSupabaseクライアント（グローバルスコープで管理）
const getSupabaseClient = () => createClientComponentClient()

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true
  })

  // タイムアウト用のref
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // ユーザープロフィールを取得
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const supabase = getSupabaseClient()
      
      // タイムアウト付きでプロフィールを取得
      const profilePromise = supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout')), 5000) // 5秒タイムアウト
      })

      const { data, error } = await Promise.race([profilePromise, timeoutPromise])
      
      if (error) {
        // プロフィールが存在しない場合は作成を試行（タイムアウトの場合は除く）
        if (error.code === 'PGRST116' && error.message !== 'Profile fetch timeout') {
          return await createUserProfile(userId)
        }
        return null
      }
      
      return data
    } catch (error) {
      return null
    }
  }

  // プロフィールを非同期で更新（UIをブロックしない）
  const updateProfileAsync = async (userId: string) => {
    try {
      const profile = await fetchUserProfile(userId)
      setAuthState(prev => ({ ...prev, profile }))
    } catch (error) {
      console.error('[Auth] Failed to update profile async:', error)
    }
  }

  // ユーザープロフィールを作成
  const createUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const supabase = getSupabaseClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return null
      
      const newProfile = {
        id: userId,
        email: user.email || '',
        name: user.user_metadata?.name || '',
        avatar_url: null,
        role: 'player' as const, // デフォルトロール
        generation: null,
        birthday: null,
        bio: null,
        gender: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const { data, error } = await supabase
        .from('users')
        .insert(newProfile)
        .select()
        .single()
      
      if (error) {
        return null
      }
      
      return data
    } catch (error) {
      return null
    }
  }

  // ログイン
  const signIn = async (email: string, password: string) => {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // サインアップ
  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || ''
          }
        }
      })
      
      if (error) throw error
      
      // サインアップ成功時にプロフィールも作成
      if (data.user) {
        await createUserProfile(data.user.id)
      }
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // ログアウト
  const signOut = async () => {
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setAuthState({
        user: null,
        profile: null,
        loading: false
      })
      
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  // パスワードリセット
  const resetPassword = async (email: string) => {
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      
      if (error) throw error
      
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  // パスワード更新
  const updatePassword = async (newPassword: string) => {
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      
      if (error) throw error
      
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  // プロフィール更新
  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!authState.user) throw new Error('User not authenticated')
      
      const supabase = getSupabaseClient()
      const { error } = await supabase
        .from('users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', authState.user.id)
      
      if (error) throw error
      
      // プロフィールを再取得
      const updatedProfile = await fetchUserProfile(authState.user.id)
      if (updatedProfile) {
        setAuthState(prev => ({ ...prev, profile: updatedProfile }))
      }
      
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  useEffect(() => {
    // 同一のSupabaseクライアントインスタンスを使用
    const supabase = getSupabaseClient()
    
    // ローディングタイムアウトを設定（5秒）
    loadingTimeoutRef.current = setTimeout(() => {
      setAuthState(prev => ({ ...prev, loading: false }))
    }, 5000)
    
    // 初期セッション取得
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          setAuthState({
            user: null,
            profile: null,
            loading: false
          })
          return
        }
        
        if (session?.user) {
          setAuthState({
            user: session.user,
            profile: null, // プロフィールは後で取得
            loading: false
          })
          
          // プロフィールを非同期で取得（UIをブロックしない）
          updateProfileAsync(session.user.id)
        } else {
          setAuthState({
            user: null,
            profile: null,
            loading: false
          })
        }
      } catch (error) {
        setAuthState({
          user: null,
          profile: null,
          loading: false
        })
      } finally {
        // タイムアウトをクリア
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current)
          loadingTimeoutRef.current = null
        }
      }
    }

    getInitialSession()

    // 認証状態の変更を監視（同じクライアントインスタンスを使用）
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (session?.user) {
            setAuthState({
              user: session.user,
              profile: null, // プロフィールは後で取得
              loading: false
            })
            // プロフィールを非同期で取得
            updateProfileAsync(session.user.id)
          } else {
            setAuthState({
              user: null,
              profile: null,
              loading: false
            })
          }
        } catch (error) {
          setAuthState(prev => ({ ...prev, loading: false }))
        }
      }
    )

    return () => {
      subscription.unsubscribe()
      // タイムアウトをクリア
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
        loadingTimeoutRef.current = null
      }
    }
  }, [])

  const value: AuthContextType = {
    ...authState,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    isAuthenticated: !!authState.user,
    isLoading: authState.loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
