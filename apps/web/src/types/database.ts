// データベーススキーマの型定義
export interface DatabaseEvent {
  id: string
  title: string
  description?: string
  event_type: EventType
  start_time: string
  end_time: string
  location?: string
  created_by: string
  created_at: string
  updated_at: string
}

export type EventType = 'practice' | 'competition' | 'meeting' | 'other'

export interface Attendance {
  id: string
  event_id: string
  user_id: string
  status: AttendanceStatus
  notes?: string
  created_at: string
  updated_at: string
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'

export interface PracticeRecord {
  id: string
  event_id: string
  user_id: string
  stroke: SwimStroke
  distance: number
  sets: number
  reps: number
  circle_time?: number
  best_time?: number
  notes?: string
  created_at: string
  updated_at: string
}

export type SwimStroke = 'freestyle' | 'backstroke' | 'breaststroke' | 'butterfly' | 'individual_medley'

export interface CompetitionRecord {
  id: string
  user_id: string
  competition_name: string
  event_name: string
  stroke: SwimStroke
  distance: number
  time: number
  split_times?: number[]
  rank?: number
  notes?: string
  video_url?: string
  date: string
  created_at: string
  updated_at: string
}

export interface Goal {
  id: string
  user_id: string
  title: string
  description?: string
  target_value?: number
  current_value?: number
  target_date?: string
  status: GoalStatus
  created_at: string
  updated_at: string
}

export type GoalStatus = 'active' | 'completed' | 'paused' | 'cancelled'

export interface Announcement {
  id: string
  title: string
  content: string
  priority: AnnouncementPriority
  published: boolean
  published_at?: string
  created_by: string
  created_at: string
  updated_at: string
}

export type AnnouncementPriority = 'low' | 'normal' | 'high' | 'urgent'
