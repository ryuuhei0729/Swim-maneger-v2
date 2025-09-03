// すべての型定義をエクスポート
export * from './auth'
export * from './database'

// 共通の型定義
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  message?: string
}

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface SelectOption {
  value: string
  label: string
}

// フォーム関連の型
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'date' | 'number'
  required?: boolean
  placeholder?: string
  options?: SelectOption[]
  validation?: {
    min?: number
    max?: number
    pattern?: RegExp
    message?: string
  }
}
