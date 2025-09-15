// GraphQLスキーマ定義（TypeScript）
export const typeDefs = `
# 水泳選手マネジメントシステム GraphQLスキーマ（個人利用機能対応）

scalar DateTime
scalar JSON
scalar Date

# ユーザー関連
enum UserRole {
  PLAYER
  COACH
  DIRECTOR
  MANAGER
}

# プール種別は Integer で管理 (0: 短水路, 1: 長水路)

# 泳法
enum SwimStroke {
  FREESTYLE
  BACKSTROKE
  BREASTSTROKE
  BUTTERFLY
  INDIVIDUAL_MEDLEY
}

# 大会カテゴリ
enum CompetitionCategory {
  OFFICIAL      # 公式
  RECORD_MEET   # 記録会
  TIME_TRIAL    # タイムトライアル
}

# 目標タイプ
enum GoalType {
  TIME              # タイム目標
  TECHNIQUE         # 技術面目標
  TRAINING_FREQUENCY # 練習頻度目標
  TRAINING_DISTANCE  # 練習距離目標
}

type User {
  id: ID!
  email: String!
  profile: Profile
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Profile {
  id: ID!
  userId: ID!
  user: User!
  name: String!
  gender: Int! # 0: male, 1: female
  profileImagePath: String # Supabase Storageのパス
  birthday: Date
  bio: String
  createdAt: DateTime!
  updatedAt: DateTime!
}

# イベント関連
enum EventType {
  PRACTICE
  COMPETITION
  MEETING
  OTHER
}

type Event {
  id: ID!
  title: String!
  description: String
  eventType: EventType!
  startTime: DateTime!
  endTime: DateTime!
  location: String
  createdBy: ID!
  creator: Profile!
  attendances: [Attendance!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

# 出席関連
enum AttendanceStatus {
  PRESENT
  ABSENT
  LATE
  EXCUSED
}

type Attendance {
  id: ID!
  eventId: ID!
  event: Event!
  userId: ID!
  user: Profile!
  status: AttendanceStatus!
  notes: String
  createdAt: DateTime!
  updatedAt: DateTime!
}

# 種目・泳法関連
type Style {
  id: ID!
  nameJp: String!
  name: String!
  distance: Int!
  stroke: SwimStroke!
}

# 練習タグ関連
type PracticeTag {
  id: ID!
  userId: ID!
  name: String!
  color: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}

# 練習記録関連（remote_migration.sqlと同じ構造）
type PracticeLog {
  id: ID!
  userId: ID!
  date: Date!
  place: String
  style: String!
  repCount: Int!
  setCount: Int!
  distance: Int!
  circle: Float
  note: String
  times: [PracticeTime!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

# 練習タイム記録
type PracticeTime {
  id: ID!
  userId: ID!
  practiceLogId: ID!
  repNumber: Int!
  setNumber: Int!
  time: Float!
  createdAt: DateTime!
  updatedAt: DateTime!
}

# 大会関連（remote_migration.sqlと同じ構造）
type Competition {
  id: ID!
  title: String!
  date: Date!
  place: String!
  poolType: Int # 0: short, 1: long (デフォルト: 0)
  note: String
  records: [Record!]!
}

# 記録関連（remote_migration.sqlと同じ構造）
type Record {
  id: ID!
  userId: ID!
  competitionId: ID
  competition: Competition
  styleId: Int! # INTEGERに対応
  style: Style!
  time: Float!
  videoUrl: String
  note: String
  splitTimes: [SplitTime!]!
}

# スプリットタイム（remote_migration.sqlと同じ構造）
type SplitTime {
  id: ID!
  recordId: ID!
  distance: Int!
  splitTime: Float!
}

# 個人目標管理関連（individual_features_migration.sqlと同じ構造）
type PersonalGoal {
  id: ID!
  userId: ID!
  goalType: GoalType!
  styleId: Int # INTEGERに対応
  style: Style
  poolType: Int # 0: short, 1: long
  targetTime: Float
  title: String!
  description: String
  targetDate: Date
  startDate: Date!
  isAchieved: Boolean!
  achievedDate: Date
  progress: [GoalProgress!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

# 目標進捗記録
type GoalProgress {
  id: ID!
  personalGoalId: ID!
  progressDate: Date!
  progressValue: Float
  progressNote: String
  createdAt: DateTime!
  updatedAt: DateTime!
}

# ベストタイム管理（individual_features_migration.sqlと同じ構造）
type BestTime {
  id: ID!
  userId: ID!
  styleId: Int! # INTEGERに対応
  style: Style!
  poolType: Int! # 0: short, 1: long
  bestTime: Float!
  recordId: ID
  record: Record
  achievedDate: Date!
  createdAt: DateTime!
  updatedAt: DateTime!
}

# お知らせ関連
enum AnnouncementPriority {
  LOW
  NORMAL
  HIGH
  URGENT
}

type Announcement {
  id: ID!
  title: String!
  content: String!
  priority: AnnouncementPriority!
  published: Boolean!
  publishedAt: DateTime
  createdBy: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
}

# クエリ
type Query {
  # ユーザー関連
  me: Profile
  users: [Profile!]!
  user(id: ID!): Profile

  # 種目・泳法関連
  styles: [Style!]!
  style(id: ID!): Style

  # 練習タグ関連
  myPracticeTags: [PracticeTag!]!
  practiceTag(id: ID!): PracticeTag

  # 練習記録関連（個人利用機能対応）
  myPracticeLogs(startDate: Date, endDate: Date): [PracticeLog!]!
  practiceLog(id: ID!): PracticeLog
  practiceLogsByDate(date: Date!): [PracticeLog!]!

  # 大会関連（個人利用機能対応）
  myCompetitions: [Competition!]!
  competition(id: ID!): Competition
  
  # 記録関連（個人利用機能対応）
  myRecords(startDate: Date, endDate: Date, styleId: Int, poolType: Int): [Record!]!
  record(id: ID!): Record
  recordsByDate(date: Date!): [Record!]!

  # ベストタイム関連
  myBestTimes(poolType: Int): [BestTime!]!
  bestTime(styleId: Int!, poolType: Int!): BestTime

  # 個人目標関連
  myPersonalGoals: [PersonalGoal!]!
  personalGoal(id: ID!): PersonalGoal

  # カレンダー関連
  calendarData(year: Int!, month: Int!): CalendarData!

  # イベント関連
  events: [Event!]!
  event(id: ID!): Event
  upcomingEvents: [Event!]!

  # 出席関連
  attendances(eventId: ID): [Attendance!]!
  myAttendances: [Attendance!]!

  # お知らせ関連
  announcements: [Announcement!]!
  announcement(id: ID!): Announcement
}

# カレンダーデータ型
type CalendarData {
  year: Int!
  month: Int!
  days: [CalendarDay!]!
  summary: CalendarSummary!
}

type CalendarDay {
  date: Date!
  hasPractice: Boolean!
  hasCompetition: Boolean!
  practiceCount: Int!
  recordCount: Int!
}

type CalendarSummary {
  totalPractices: Int!
  totalCompetitions: Int!
  totalRecords: Int!
}

# ミューテーション
type Mutation {
  # ユーザー関連
  updateProfile(input: UpdateProfileInput!): Profile!

  # 練習タグ関連
  createPracticeTag(input: CreatePracticeTagInput!): PracticeTag!
  updatePracticeTag(id: ID!, input: UpdatePracticeTagInput!): PracticeTag!
  deletePracticeTag(id: ID!): Boolean!

  # 練習記録関連（個人利用機能対応）
  createPracticeLog(input: CreatePracticeLogInput!): PracticeLog!
  updatePracticeLog(id: ID!, input: UpdatePracticeLogInput!): PracticeLog!
  deletePracticeLog(id: ID!): Boolean!

  # 練習タイム関連
  createPracticeTime(input: CreatePracticeTimeInput!): PracticeTime!
  updatePracticeTime(id: ID!, input: UpdatePracticeTimeInput!): PracticeTime!
  deletePracticeTime(id: ID!): Boolean!

  # 大会関連（個人利用機能対応）
  createCompetition(input: CreateCompetitionInput!): Competition!
  updateCompetition(id: ID!, input: UpdateCompetitionInput!): Competition!
  deleteCompetition(id: ID!): Boolean!

  # 記録関連（個人利用機能対応）
  createRecord(input: CreateRecordInput!): Record!
  updateRecord(id: ID!, input: UpdateRecordInput!): Record!
  deleteRecord(id: ID!): Boolean!

  # スプリットタイム関連
  createSplitTime(input: CreateSplitTimeInput!): SplitTime!
  updateSplitTime(id: ID!, input: UpdateSplitTimeInput!): SplitTime!
  deleteSplitTime(id: ID!): Boolean!

  # 個人目標関連
  createPersonalGoal(input: CreatePersonalGoalInput!): PersonalGoal!
  updatePersonalGoal(id: ID!, input: UpdatePersonalGoalInput!): PersonalGoal!
  deletePersonalGoal(id: ID!): Boolean!

  # 目標進捗関連
  createGoalProgress(input: CreateGoalProgressInput!): GoalProgress!
  updateGoalProgress(id: ID!, input: UpdateGoalProgressInput!): GoalProgress!
  deleteGoalProgress(id: ID!): Boolean!

  # イベント関連
  createEvent(input: CreateEventInput!): Event!
  updateEvent(id: ID!, input: UpdateEventInput!): Event!
  deleteEvent(id: ID!): Boolean!

  # 出席関連
  updateAttendance(input: UpdateAttendanceInput!): Attendance!

  # お知らせ関連
  createAnnouncement(input: CreateAnnouncementInput!): Announcement!
  updateAnnouncement(id: ID!, input: UpdateAnnouncementInput!): Announcement!
  deleteAnnouncement(id: ID!): Boolean!
}

# 入力型
input UpdateProfileInput {
  name: String
  gender: Int # 0: male, 1: female
  birthday: Date
  bio: String
  profileImagePath: String
}

# 練習タグ入力型
input CreatePracticeTagInput {
  name: String!
  color: String
}

input UpdatePracticeTagInput {
  name: String
  color: String
}

# 練習記録入力型
input CreatePracticeLogInput {
  date: Date
  practiceDate: Date
  place: String
  location: String
  style: String!
  repCount: Int!
  setCount: Int!
  distance: Int!
  circle: Float # オプションに変更
  note: String
}

input UpdatePracticeLogInput {
  date: Date
  place: String
  style: String
  repCount: Int
  setCount: Int
  distance: Int
  circle: Float
  note: String
}

# 練習タイム入力型
input CreatePracticeTimeInput {
  practiceLogId: ID!
  repNumber: Int!
  setNumber: Int!
  time: Float!
}

input UpdatePracticeTimeInput {
  repNumber: Int
  setNumber: Int
  time: Float
}

# 大会入力型
input CreateCompetitionInput {
  title: String!
  date: Date!
  place: String! # NOT NULL
  poolType: Int # 0: short, 1: long (デフォルト: 0)
  note: String
}

input UpdateCompetitionInput {
  title: String
  date: Date
  place: String
  poolType: Int
  note: String
}

# 記録入力型
input CreateRecordInput {
  styleId: Int!
  time: Float!
  videoUrl: String
  note: String
  competitionId: ID
  splitTimes: [SplitTimeInput!]
}

input UpdateRecordInput {
  styleId: Int
  time: Float
  videoUrl: String
  note: String
  competitionId: ID
  splitTimes: [SplitTimeInput!]
}

# スプリットタイム入力型（Record作成・更新用）
input SplitTimeInput {
  distance: Int!
  splitTime: Float!
}

# スプリットタイム入力型
input CreateSplitTimeInput {
  recordId: ID!
  distance: Int!
  splitTime: Float!
}

input UpdateSplitTimeInput {
  distance: Int
  splitTime: Float
}

# 個人目標入力型
input CreatePersonalGoalInput {
  goalType: GoalType!
  styleId: Int
  poolType: Int
  targetTime: Float
  title: String!
  description: String
  targetDate: Date
  startDate: Date
}

input UpdatePersonalGoalInput {
  goalType: GoalType
  styleId: Int
  poolType: Int
  targetTime: Float
  title: String
  description: String
  targetDate: Date
  startDate: Date
  isAchieved: Boolean
  achievedDate: Date
}

# 目標進捗入力型
input CreateGoalProgressInput {
  personalGoalId: ID!
  progressDate: Date!
  progressValue: Float
  progressNote: String
}

input UpdateGoalProgressInput {
  progressDate: Date
  progressValue: Float
  progressNote: String
}

input CreateEventInput {
  title: String!
  description: String
  eventType: EventType!
  startTime: DateTime!
  endTime: DateTime!
  location: String
}

input UpdateEventInput {
  title: String
  description: String
  eventType: EventType
  startTime: DateTime
  endTime: DateTime
  location: String
}

input UpdateAttendanceInput {
  eventId: ID!
  userId: ID!
  status: AttendanceStatus!
  notes: String
}

input CreateAnnouncementInput {
  title: String!
  content: String!
  priority: AnnouncementPriority!
  published: Boolean
  publishedAt: DateTime
}

input UpdateAnnouncementInput {
  title: String
  content: String
  priority: AnnouncementPriority
  published: Boolean
  publishedAt: DateTime
}
`;
