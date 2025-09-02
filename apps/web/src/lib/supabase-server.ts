import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { getSupabaseConfig } from './env'
import type { Database } from './supabase'

// 環境別のSupabase設定を取得
const { url: supabaseUrl, anonKey: supabaseAnonKey, serviceRoleKey } = getSupabaseConfig()

// サーバーコンポーネント用のSupabaseクライアント
export const createServerComponentClient = async () => {
  const cookieStore = await cookies()
  
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  })
}

// サーバーサイド用のクライアント（RLSをバイパスする場合）
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  serviceRoleKey || ''
)
