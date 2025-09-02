// GraphQLスキーマ定義（共有パッケージから読み込み）
export const typeDefs = `
  # 水泳選手マネジメントシステム GraphQLスキーマ

  scalar DateTime
  scalar JSON

  # ユーザー関連
  enum UserRole {
    PLAYER
    COACH
    DIRECTOR
    MANAGER
  }

  type Profile {
    id: ID!
    email: String!
    name: String
    avatarUrl: String
    role: String!
    generation: Int
    birthday: String
    bio: String
    gender: Int
    createdAt: DateTime
    updatedAt: DateTime
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
    date: String!
    place: String
    note: String
    type: String!
    is_attendance: Boolean!
    attendance_status: Int
    is_competition: Boolean
    entry_status: Int
    created_at: DateTime!
    updated_at: DateTime!
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
    user_id: ID!
    attendance_event_id: ID!
    note: String
    status: Int!
    created_at: DateTime!
    updated_at: DateTime!
    user: User
    event: Event
  }

  # 練習記録関連
  enum SwimStroke {
    FREESTYLE
    BACKSTROKE
    BREASTSTROKE
    BUTTERFLY
    INDIVIDUAL_MEDLEY
  }

  type PracticeRecord {
    id: ID!
    event_id: ID!
    event: Event!
    user_id: ID!
    user: Profile!
    stroke: SwimStroke!
    distance: Int!
    sets: Int!
    reps: Int!
    circleTime: Int
    bestTime: Int
    notes: String
    created_at: DateTime!
    updated_at: DateTime!
  }

  # クエリ
  type Query {
    # ユーザー関連
    me: Profile
    users: [Profile!]!
    user(id: ID!): Profile

    # イベント関連
    events: [Event!]!
    event(id: ID!): Event
    upcomingEvents: [Event!]!

    # 出席関連
    attendances(eventId: ID): [Attendance!]!
    myAttendances: [Attendance!]!

    # 練習記録関連
    practiceRecords(eventId: ID, userId: ID): [PracticeRecord!]!
    myPracticeRecords: [PracticeRecord!]!
  }

  # ミューテーション
  type Mutation {
    # ユーザー関連
    updateProfile(input: UpdateProfileInput!): Profile!

    # イベント関連
    createEvent(input: CreateEventInput!): Event!
    updateEvent(id: ID!, input: UpdateEventInput!): Event!
    deleteEvent(id: ID!): Boolean!

    # 出席関連
    updateAttendance(input: UpdateAttendanceInput!): Attendance!

    # 練習記録関連
    createPracticeRecord(input: CreatePracticeRecordInput!): PracticeRecord!
    updatePracticeRecord(id: ID!, input: UpdatePracticeRecordInput!): PracticeRecord!
    deletePracticeRecord(id: ID!): Boolean!
  }

  # 入力型
  input UpdateProfileInput {
    name: String
    avatar_url: String
    generation: Int
    birthday: String
    bio: String
    gender: Int
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

  input CreatePracticeRecordInput {
    eventId: ID!
    userId: ID!
    stroke: SwimStroke!
    distance: Int!
    sets: Int!
    reps: Int!
    circleTime: Int
    bestTime: Int
    notes: String
  }

  input UpdatePracticeRecordInput {
    stroke: SwimStroke
    distance: Int
    sets: Int
    reps: Int
    circleTime: Int
    bestTime: Int
    notes: String
  }
`
