// Generated GraphQL types from schema
// export * from '../../../packages/graphql-schema/generated/types'

// 一時的な型定義（GraphQL Code Generatorが動作するまで）
export interface User {
  id: string
  email: string
  name: string
  role: string
  avatarUrl?: string
  generation?: number
  birthday?: string
  bio?: string
  gender: number
  createdAt: string
  updatedAt: string
}

export interface Event {
  id: string
  title: string
  description?: string
  startTime: string
  endTime: string
  location?: string
  eventType: string
  createdAt: string
  updatedAt: string
}

export interface Attendance {
  id: string
  userId: string
  eventId: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface PracticeRecord {
  id: string
  userId: string
  date: string
  distance: number
  time?: number
  stroke: string
  notes?: string
  createdAt: string
  updatedAt: string
}

// Custom type extensions for frontend use
export interface GraphQLError {
  message: string
  locations?: Array<{
    line: number
    column: number
  }>
  path?: Array<string | number>
  extensions?: Record<string, any>
}

export interface GraphQLResponse<T = any> {
  data?: T
  errors?: GraphQLError[]
}

// Apollo Client specific types
export interface QueryResult<T = any> {
  data?: T
  loading: boolean
  error?: any
  refetch: () => Promise<any>
  networkStatus: number
}

export interface MutationResult<T = any> {
  data?: T
  loading: boolean
  error?: any
}

// Form input types for mutations
export interface ProfileFormData {
  name?: string
  phone?: string
  birthday?: string
  emergencyContact?: string
}

export interface EventFormData {
  title: string
  description?: string
  eventType: 'PRACTICE' | 'COMPETITION' | 'MEETING' | 'OTHER'
  startTime: string
  endTime: string
  location?: string
}

export interface AttendanceFormData {
  eventId: string
  userId: string
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'
  notes?: string
}

export interface PracticeRecordFormData {
  eventId: string
  userId: string
  stroke: 'FREESTYLE' | 'BACKSTROKE' | 'BREASTSTROKE' | 'BUTTERFLY' | 'INDIVIDUAL_MEDLEY'
  distance: number
  sets: number
  reps: number
  circleTime?: number
  bestTime?: number
  notes?: string
}
