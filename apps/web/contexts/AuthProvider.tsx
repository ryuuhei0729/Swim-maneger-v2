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
  
  // プロフィール取得の重複実行を防止
  const fetchingRef = useRef<string | null>(null)

  // ユーザープロフィールを取得（タイムアウト付き + リトライ）
  const fetchUserProfile = async (userId: string, retryCount = 0): Promise<UserProfile | null> => {
    console.log('[DEBUG] Fetching profile for user:', userId, retryCount > 0 ? `(retry ${retryCount})` : '')
    
    // 同じユーザーIDで既に取得中の場合はスキップ（リトライは除く）
    if (fetchingRef.current === userId && retryCount === 0) {
      console.log('[DEBUG] Profile fetch already in progress, skipping...')
      return null
    }
    
    fetchingRef.current = userId
    
    // 20秒でタイムアウト（ネットワーク遅延対応）
    const timeoutPromise = new Promise<null>((_, reject) => {
      setTimeout(() => reject(new Error('Profile fetch timeout')), 20000)
    })
    
    const fetchPromise = async (): Promise<UserProfile | null> => {
      try {
        const startTime = Date.now()
        const supabase = getSupabaseClient()
        console.log('[DEBUG] Starting database query...')
        
        // クライアント初期化時間を測定
        const clientTime = Date.now() - startTime
        console.log('[DEBUG] Client ready in:', clientTime + 'ms')
        
        const queryStart = Date.now()
        console.log('[DEBUG] Executing profile query...')
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single()
        
        const queryTime = Date.now() - queryStart
        console.log('[DEBUG] Query took:', queryTime + 'ms')
        
        console.log('[DEBUG] Query completed:', { 
          hasData: !!data, 
          hasError: !!error
        })
        
        if (error) {
          console.error('[ERROR] Profile fetch failed:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
            userId
          })
          return null
        }
        
        console.log('[SUCCESS] Profile fetched:', data.email)
        return data
      } catch (error) {
        console.error('[EXCEPTION] Profile fetch exception:', {
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          userId
        })
        return null
      }
    }
    
    try {
      const result = await Promise.race([fetchPromise(), timeoutPromise])
      return result
    } catch (error) {
      console.error('[TIMEOUT] Profile fetch timed out:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
        retryCount
      })
      
      // リトライ（最大2回）
      if (retryCount < 2) {
        fetchingRef.current = null // ロック解除してリトライ
        console.log('[RETRY] Attempting retry after timeout...')
        await new Promise(resolve => setTimeout(resolve, 1000)) // 1秒待機
        return fetchUserProfile(userId, retryCount + 1)
      }
      
      return null
    } finally {
      // 処理完了後にロックを解除
      if (fetchingRef.current === userId) {
        fetchingRef.current = null
      }
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
      console.error('Sign in error:', error)
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
      
      return { data, error: null }
    } catch (error) {
      console.error('Sign up error:', error)
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
      console.error('Sign out error:', error)
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
      console.error('Password reset error:', error)
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
      console.error('Password update error:', error)
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
      console.error('Profile update error:', error)
      return { error }
    }
  }

  useEffect(() => {
    const supabase = getSupabaseClient()
    
    // 認証状態を更新する共通関数
    const updateAuthState = async (session: any) => {
      try {
        if (session) {
          console.log('[DEBUG] User authenticated, fetching profile...')
          const profile = await fetchUserProfile(session.user.id)
          
          console.log('[DEBUG] Setting auth state:', {
            hasUser: true,
            hasProfile: !!profile,
            userId: session.user.id
          })
          
          setAuthState({
            user: session.user,
            profile,
            loading: false
          })
          
          if (!profile) {
            console.warn('[WARNING] Profile fetch failed, but user is authenticated')
          }
        } else {
          console.log('[DEBUG] No user session, clearing state')
          setAuthState({
            user: null,
            profile: null,
            loading: false
          })
        }
      } catch (error) {
        console.error('[ERROR] updateAuthState failed:', error)
        // 最悪の場合でもローディング状態を解除
        setAuthState({
          user: session?.user || null,
          profile: null,
          loading: false
        })
      }
    }
    
    // 初期セッションを取得（Supabaseベストプラクティス）
    const getInitialSession = async () => {
      console.log('[DEBUG] Getting initial session...')
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        console.log('[DEBUG] Initial session result:', { 
          hasSession: !!session, 
          hasUser: !!session?.user,
          error 
        })
        await updateAuthState(session)
      } catch (error) {
        console.error('[ERROR] Failed to get initial session:', error)
        // エラーが発生してもローディングを終了
        setAuthState({
          user: null,
          profile: null,
          loading: false
        })
      }
    }
    
    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[DEBUG] Auth event:', event, { hasSession: !!session })
        await updateAuthState(session)
      }
    )
    
    // 初期セッション取得を実行
    getInitialSession()

    return () => subscription.unsubscribe()
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

  // デバッグ情報
  console.log('[DEBUG] AuthProvider state:', {
    hasUser: !!authState.user,
    hasProfile: !!authState.profile,
    isLoading: authState.loading,
    isAuthenticated: !!authState.user,
    userId: authState.user?.id,
    // profileRole: roleカラムが削除されたため
  })

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
