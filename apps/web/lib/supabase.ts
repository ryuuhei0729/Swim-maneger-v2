'use client'
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

// ブラウザ用のSupabaseクライアント（クライアントコンポーネント用）
export const createClient = (): SupabaseClient<Database> => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// グローバルなSupabaseクライアント（必要な場合のみ）
// export const supabase = createClient(supabaseUrl, supabaseAnonKey)
