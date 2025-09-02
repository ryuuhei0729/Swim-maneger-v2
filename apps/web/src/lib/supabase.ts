import { createBrowserClient } from '@supabase/ssr'
import { type SupabaseClient } from '@supabase/supabase-js'
import { getCurrentEnvConfig, getSupabaseConfig } from './env'

// 環境別のSupabase設定を取得
const { url: supabaseUrl, anonKey: supabaseAnonKey, environment } = getSupabaseConfig()
const envConfig = getCurrentEnvConfig()

// 環境情報をログ出力（開発・ステージング環境のみ）
if (envConfig.debug) {
  console.log(`🏊 Swim Manager - ${envConfig.name} (${envConfig.supabaseProject})`)
}

// ブラウザ環境でSupabaseクライアントを管理（Hot Reload対応）
declare global {
  interface Window {
    __supabase_client__?: SupabaseClient
  }
}

// ブラウザ用のSupabaseクライアント（シングルトン、Hot Reload対応）
export const createClientComponentClient = (): SupabaseClient => {
  if (typeof window === 'undefined') {
    // サーバーサイドでは新しいインスタンスを返す
    return createBrowserClient(supabaseUrl, supabaseAnonKey)
  }
  
  // windowオブジェクトでクライアントを管理してHot Reloadに対応
  if (!window.__supabase_client__) {
    window.__supabase_client__ = createBrowserClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storageKey: `swim-manager-auth-${environment}`, // 環境別にストレージキーを分離
        storage: window.localStorage,
        detectSessionInUrl: false, // URLからセッション検出を無効化
        autoRefreshToken: true,
        persistSession: true,
      },
      // リアルタイム機能を無効にしてパフォーマンス向上
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  }
  
  return window.__supabase_client__
}

// グローバルなSupabaseクライアント（必要な場合のみ）
// export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 型定義
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          role: 'admin' | 'manager' | 'player' | 'coach' | 'director'
          generation: number | null
          birthday: string | null
          bio: string | null
          gender: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'manager' | 'player' | 'coach' | 'director'
          generation?: number | null
          birthday?: string | null
          bio?: string | null
          gender?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'manager' | 'player' | 'coach' | 'director'
          generation?: number | null
          birthday?: string | null
          bio?: string | null
          gender?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
