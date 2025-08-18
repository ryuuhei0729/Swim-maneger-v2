'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClientComponentClient } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type UserProfile = Database['public']['Tables']['users']['Row']

interface AuthState {
  user: User | null
  profile: UserProfile | null
  loading: boolean
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true
  })
  
  const supabase = createClientComponentClient()

  // ユーザープロフィールを取得
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) {
        console.error('Error fetching user profile:', error)
        return null
      }
      
      return data
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  // ログイン
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      
      return { data, error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      return { data: null, error }
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
            name: name || ''
          }
        }
      })
      
      if (error) throw error
      
      return { data, error: null }
    } catch (error) {
      console.error('Sign up error:', error)
      return { data: null, error }
    }
  }

  // ログアウト
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setAuthState({
        user: null,
        profile: null,
        loading: false
      })
      
      return { error: null }
    } catch (error) {
      console.error('Sign out error:', error)
      return { error }
    }
  }

  // パスワードリセット
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      
      if (error) throw error
      
      return { error: null }
    } catch (error) {
      console.error('Password reset error:', error)
      return { error }
    }
  }

  // パスワード更新
  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      
      if (error) throw error
      
      return { error: null }
    } catch (error) {
      console.error('Password update error:', error)
      return { error }
    }
  }

  // プロフィール更新
  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!authState.user) throw new Error('User not authenticated')
      
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
      console.error('Profile update error:', error)
      return { error }
    }
  }

  useEffect(() => {
    // 初期セッション取得
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id)
        setAuthState({
          user: session.user,
          profile,
          loading: false
        })
      } else {
        setAuthState({
          user: null,
          profile: null,
          loading: false
        })
      }
    }

    getInitialSession()

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id)
          setAuthState({
            user: session.user,
            profile,
            loading: false
          })
        } else {
          setAuthState({
            user: null,
            profile: null,
            loading: false
          })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return {
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
}