import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// ブラウザ用のSupabaseクライアント
export const createClientComponentClient = (): SupabaseClient => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// 従来のクライアント（互換性のため）
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
          role: 'admin' | 'coach' | 'swimmer'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'coach' | 'swimmer'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'coach' | 'swimmer'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
