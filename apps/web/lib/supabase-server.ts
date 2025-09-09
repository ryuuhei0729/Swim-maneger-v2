import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { getSupabaseConfig } from './env'
import type { Database } from './supabase'

// 環境別のSupabase設定を取得
const { url: supabaseUrl, anonKey: supabaseAnonKey, serviceRoleKey } = getSupabaseConfig()

// サーバーコンポーネント用のSupabaseクライアント（Supabaseベストプラクティス準拠）
export const createServerComponentClient = async () => {
  const cookieStore = await cookies()
  
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: '', ...options })
      },
    },
    // サーバーサイド用の設定
    auth: {
      detectSessionInUrl: false,
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

// サーバーサイド用のクライアント（RLSをバイパスする場合）
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  serviceRoleKey || ''
)
