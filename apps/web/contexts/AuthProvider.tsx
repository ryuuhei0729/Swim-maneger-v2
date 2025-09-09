'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClientComponentClient } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type UserProfile = Database['public']['Tables']['users']['Row']

interface AuthState {
  user: User | null
  profile: UserProfile | null
  session: Session | null
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

// Supabaseクライアントの取得（シングルトンパターン）
const getSupabaseClient = () => createClientComponentClient()

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true
  })

  // ユーザープロフィールを取得（シンプル化）
  const fetchUserProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) {
        console.error('Profile fetch failed:', error.message)
        return null
      }
      
      return data
    } catch (error) {
      console.error('Profile fetch exception:', error)
      return null
    }
  }, [])

  // ログイン
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        return { data: null, error }
      }
      
      return { data, error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      return { data: null, error }
    }
  }, [])

  // サインアップ
  const signUp = useCallback(async (email: string, password: string, name?: string) => {
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
      
      if (error) {
        return { data: null, error }
      }
      
      return { data, error: null }
    } catch (error) {
      console.error('Sign up error:', error)
      return { data: null, error }
    }
  }, [])

  // ログアウト
  const signOut = useCallback(async () => {
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        return { error }
      }
      
      // 状態をクリア
      setAuthState({
        user: null,
        profile: null,
        session: null,
        loading: false
      })
      
      return { error: null }
    } catch (error) {
      console.error('Sign out error:', error)
      return { error }
    }
  }, [])

  // パスワードリセット
  const resetPassword = useCallback(async (email: string) => {
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`
      })
      
      if (error) {
        return { error }
      }
      
      return { error: null }
    } catch (error) {
      console.error('Password reset error:', error)
      return { error }
    }
  }, [])

  // パスワード更新
  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      
      if (error) {
        return { error }
      }
      
      return { error: null }
    } catch (error) {
      console.error('Password update error:', error)
      return { error }
    }
  }, [])

  // プロフィール更新
  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    try {
      if (!authState.user) {
        return { error: new Error('User not authenticated') }
      }
      
      const supabase = getSupabaseClient()
      const { error } = await supabase
        .from('users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', authState.user.id)
      
      if (error) {
        return { error }
      }
      
      // プロフィールを再取得
      const updatedProfile = await fetchUserProfile(authState.user.id)
      if (updatedProfile) {
        setAuthState(prev => ({ ...prev, profile: updatedProfile }))
      }
      
      return { error: null }
    } catch (error) {
      console.error('Profile update error:', error)
      return { error }
    }
  }, [authState.user, fetchUserProfile])

  useEffect(() => {
    const supabase = getSupabaseClient()
    
    // 認証状態を更新する共通関数
    const updateAuthState = async (session: Session | null) => {
      try {
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id)
          setAuthState({
            user: session.user,
            profile,
            session,
            loading: false
          })
        } else {
          setAuthState({
            user: null,
            profile: null,
            session: null,
            loading: false
          })
        }
      } catch (error) {
        console.error('Auth state update failed:', error)
        setAuthState({
          user: session?.user || null,
          profile: null,
          session,
          loading: false
        })
      }
    }
    
    // 初期セッションを取得
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Session error:', error)
        }
        await updateAuthState(session)
      } catch (error) {
        console.error('Failed to get initial session:', error)
        setAuthState({
          user: null,
          profile: null,
          session: null,
          loading: false
        })
      }
    }
    
    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        await updateAuthState(session)
      }
    )
    
    // 初期セッション取得を実行
    getInitialSession()

    return () => subscription.unsubscribe()
  }, [fetchUserProfile])

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
