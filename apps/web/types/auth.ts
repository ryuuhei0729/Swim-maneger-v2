// 認証関連の型定義
export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  user_id: string
  name: string
  role: UserRole
  avatar_url?: string
  phone?: string
  birthday?: string
  emergency_contact?: string
  created_at: string
  updated_at: string
}

export type UserRole = 'player' | 'coach' | 'director' | 'manager'

export interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
  error: string | null
}

export interface SignUpData {
  email: string
  password: string
  name: string
  role: UserRole
}

export interface SignInData {
  email: string
  password: string
}

export interface ResetPasswordData {
  email: string
}

export interface UpdatePasswordData {
  password: string
  confirmPassword: string
}
