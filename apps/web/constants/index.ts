// アプリケーション定数

// ユーザー役割
export const USER_ROLES = {
  PLAYER: 'player',
  COACH: 'coach',
  DIRECTOR: 'director',
  MANAGER: 'manager'
} as const

export const USER_ROLE_LABELS = {
  [USER_ROLES.PLAYER]: '選手',
  [USER_ROLES.COACH]: 'コーチ',
  [USER_ROLES.DIRECTOR]: '監督',
  [USER_ROLES.MANAGER]: 'マネージャー'
} as const

// 泳法
export const SWIM_STROKES = {
  FREESTYLE: 'freestyle',
  BACKSTROKE: 'backstroke',
  BREASTSTROKE: 'breaststroke',
  BUTTERFLY: 'butterfly',
  INDIVIDUAL_MEDLEY: 'individual_medley'
} as const

export const SWIM_STROKE_LABELS = {
  [SWIM_STROKES.FREESTYLE]: '自由形',
  [SWIM_STROKES.BACKSTROKE]: '背泳ぎ',
  [SWIM_STROKES.BREASTSTROKE]: '平泳ぎ',
  [SWIM_STROKES.BUTTERFLY]: 'バタフライ',
  [SWIM_STROKES.INDIVIDUAL_MEDLEY]: '個人メドレー'
} as const

// イベントタイプ
export const EVENT_TYPES = {
  PRACTICE: 'practice',
  COMPETITION: 'competition',
  MEETING: 'meeting',
  OTHER: 'other'
} as const

export const EVENT_TYPE_LABELS = {
  [EVENT_TYPES.PRACTICE]: '練習',
  [EVENT_TYPES.COMPETITION]: '大会',
  [EVENT_TYPES.MEETING]: '会議',
  [EVENT_TYPES.OTHER]: 'その他'
} as const

// 出席状況
export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  EXCUSED: 'excused'
} as const

export const ATTENDANCE_STATUS_LABELS = {
  [ATTENDANCE_STATUS.PRESENT]: '出席',
  [ATTENDANCE_STATUS.ABSENT]: '欠席',
  [ATTENDANCE_STATUS.LATE]: '遅刻',
  [ATTENDANCE_STATUS.EXCUSED]: '公欠'
} as const

// 目標ステータス
export const GOAL_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  PAUSED: 'paused',
  CANCELLED: 'cancelled'
} as const

export const GOAL_STATUS_LABELS = {
  [GOAL_STATUS.ACTIVE]: '進行中',
  [GOAL_STATUS.COMPLETED]: '完了',
  [GOAL_STATUS.PAUSED]: '一時停止',
  [GOAL_STATUS.CANCELLED]: 'キャンセル'
} as const

// お知らせ優先度
export const ANNOUNCEMENT_PRIORITY = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent'
} as const

export const ANNOUNCEMENT_PRIORITY_LABELS = {
  [ANNOUNCEMENT_PRIORITY.LOW]: '低',
  [ANNOUNCEMENT_PRIORITY.NORMAL]: '通常',
  [ANNOUNCEMENT_PRIORITY.HIGH]: '高',
  [ANNOUNCEMENT_PRIORITY.URGENT]: '緊急'
} as const

// ページネーション
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
} as const

// API設定
export const API = {
  TIMEOUT: 10000,
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000
} as const

// ルート定義
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  MEMBERS: '/members',
  SCHEDULE: '/schedule',
  ATTENDANCE: '/attendance',
  PRACTICE: '/practice',
  COMPETITIONS: '/competitions',
  GOALS: '/goals',
  ANNOUNCEMENTS: '/announcements',
  SETTINGS: '/settings'
} as const
