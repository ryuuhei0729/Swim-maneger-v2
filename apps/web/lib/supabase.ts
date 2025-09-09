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

// 型定義
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          gender: number // 0: male, 1: female
          birthday: string | null
          profile_image_path: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          gender?: number // デフォルト: 0 (male)
          birthday?: string | null
          profile_image_path?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          gender?: number
          birthday?: string | null
          profile_image_path?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      styles: {
        Row: {
          id: number
          name_jp: string
          name: string
          style: 'fr' | 'br' | 'ba' | 'fly' | 'im'
          distance: number
        }
        Insert: {
          id: number
          name_jp: string
          name: string
          style: 'fr' | 'br' | 'ba' | 'fly' | 'im'
          distance: number
        }
        Update: {
          id?: number
          name_jp?: string
          name?: string
          style?: 'fr' | 'br' | 'ba' | 'fly' | 'im'
          distance?: number
        }
      }
      competitions: {
        Row: {
          id: string
          title: string
          date: string
          place: string // NOT NULL
          pool_type: number // 0: short, 1: long
          note: string | null
        }
        Insert: {
          id?: string
          title: string
          date: string
          place: string // NOT NULL
          pool_type?: number // デフォルト: 0 (short)
          note?: string | null
        }
        Update: {
          id?: string
          title?: string
          date?: string
          place?: string
          pool_type?: number
          note?: string | null
        }
      }
      records: {
        Row: {
          id: string
          user_id: string
          competition_id: string | null
          style_id: number
          time: number
          video_url: string | null
          note: string | null
        }
        Insert: {
          id?: string
          user_id: string
          competition_id?: string | null
          style_id: number
          time: number
          video_url?: string | null
          note?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          competition_id?: string | null
          style_id?: number
          time?: number
          video_url?: string | null
          note?: string | null
        }
      }
      split_times: {
        Row: {
          id: string
          record_id: string
          distance: number
          split_time: number
        }
        Insert: {
          id?: string
          record_id: string
          distance: number
          split_time: number
        }
        Update: {
          id?: string
          record_id?: string
          distance?: number
          split_time?: number
        }
      }
      practice_logs: {
        Row: {
          id: string
          user_id: string
          date: string
          tags: any | null
          style: string
          rep_count: number
          set_count: number
          distance: number
          circle: number | null // NOT NULLからNULLに変更
          note: string | null
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          tags?: any | null
          style: string
          rep_count: number
          set_count: number
          distance: number
          circle?: number | null
          note?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          tags?: any | null
          style?: string
          rep_count?: number
          set_count?: number
          distance?: number
          circle?: number | null
          note?: string | null
        }
      }
      practice_times: {
        Row: {
          id: string
          practice_log_id: string
          rep_number: number
          set_number: number
          time: number
        }
        Insert: {
          id?: string
          practice_log_id: string
          rep_number: number
          set_number: number
          time: number
        }
        Update: {
          id?: string
          practice_log_id?: string
          rep_number?: number
          set_number?: number
          time?: number
        }
      }
    }
  }
}

// ブラウザ環境でSupabaseクライアントを管理（Hot Reload対応）
declare global {
  interface Window {
    __supabase_client__?: SupabaseClient<Database>
  }
}

// ブラウザ用のSupabaseクライアント（Supabaseベストプラクティス準拠）
export const createClientComponentClient = (): SupabaseClient<Database> => {
  if (typeof window === 'undefined') {
    // サーバーサイドでは新しいインスタンスを返す
    return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  }
  
  // windowオブジェクトでクライアントを管理してHot Reloadに対応
  if (!window.__supabase_client__) {
    window.__supabase_client__ = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        // 環境別にストレージキーを分離（セキュリティ向上）
        storageKey: `swim-manager-auth-${environment}`,
        storage: window.localStorage,
        // URLからセッション検出を有効化（パスワードリセット対応）
        detectSessionInUrl: true,
        // 自動トークンリフレッシュを有効化
        autoRefreshToken: true,
        // セッション永続化を有効化
        persistSession: true,
        // フロー設定（PKCE使用）
        flowType: 'pkce'
      },
      // リアルタイム機能の設定
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
      // グローバル設定
      global: {
        headers: {
          'X-Client-Info': 'swim-manager-web'
        }
      }
    })
  }
  
  return window.__supabase_client__
}

// グローバルなSupabaseクライアント（必要な場合のみ）
// export const supabase = createClient(supabaseUrl, supabaseAnonKey)
