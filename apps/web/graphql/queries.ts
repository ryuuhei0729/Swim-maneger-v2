import { gql } from '@apollo/client'

// ユーザー関連クエリ
export const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      avatarUrl
      role
      generation
      birthday
      bio
      gender
      createdAt
      updatedAt
    }
  }
`

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      user_id
      name
      role
      avatar_url
      phone
      birthday
      emergency_contact
      created_at
      updated_at
    }
  }
`

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      user_id
      name
      role
      avatar_url
      phone
      birthday
      emergency_contact
      created_at
      updated_at
    }
  }
`

// イベント関連クエリ
export const GET_EVENTS = gql`
  query GetEvents {
    events {
      id
      title
      description
      eventType
      startTime
      endTime
      location
      createdBy
      creator {
        id
        name
        role
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_EVENT = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
      id
      title
      description
      eventType
      startTime
      endTime
      location
      createdBy
      creator {
        id
        name
        role
      }
      attendances {
        id
        user_id
        status
        notes
        user {
          id
          name
        }
      }
      practiceRecords {
        id
        user_id
        stroke
        distance
        sets
        reps
        circleTime
        bestTime
        notes
        user {
          id
          name
        }
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_UPCOMING_EVENTS = gql`
  query GetUpcomingEvents {
    upcomingEvents {
      id
      title
      description
      eventType
      startTime
      endTime
      location
      creator {
        id
        name
        role
      }
    }
  }
`

// 出席関連クエリ
export const GET_ATTENDANCES = gql`
  query GetAttendances($eventId: ID) {
    attendances(eventId: $eventId) {
      id
      event_id
      user_id
      status
      notes
      event {
        id
        title
        startTime
      }
      user {
        id
        name
        role
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_MY_ATTENDANCES = gql`
  query GetMyAttendances {
    myAttendances {
      id
      event_id
      status
      notes
      event {
        id
        title
        eventType
        startTime
        endTime
      }
      createdAt
      updatedAt
    }
  }
`

// 練習記録関連クエリ
export const GET_PRACTICE_RECORDS = gql`
  query GetPracticeRecords($eventId: ID, $userId: ID) {
    practiceRecords(eventId: $eventId, userId: $userId) {
      id
      event_id
      user_id
      stroke
      distance
      sets
      reps
      circleTime
      bestTime
      notes
      event {
        id
        title
        startTime
      }
      user {
        id
        name
        role
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_MY_PRACTICE_RECORDS = gql`
  query GetMyPracticeRecords {
    myPracticeRecords {
      id
      event_id
      stroke
      distance
      sets
      reps
      circleTime
      bestTime
      notes
      event {
        id
        title
        eventType
        startTime
      }
      createdAt
      updatedAt
    }
  }
`

// 個人利用機能用のクエリ
export const GET_PERSONAL_CALENDAR_ENTRIES = gql`
  query GetPersonalCalendarEntries($startDate: Date!, $endDate: Date!) {
    personalCalendarEntries(startDate: $startDate, endDate: $endDate) {
      id
      entry_type
      entry_date
      title
      location
      time_result
      pool_type
      created_at
    }
  }
`

export const GET_PRACTICE_LOGS = gql`
  query GetPracticeLogs($userId: ID!) {
    practiceLogs(userId: $userId) {
      id
      user_id
      practice_date
      location
      tags
      sets {
        id
        style
        reps
        distance
        circle_time
      }
      note
      created_at
      updated_at
    }
  }
`

export const GET_MY_RECORDS = gql`
  query GetMyRecords {
    myRecords {
      id
      user_id
      style_id
      time
      record_date
      location
      pool_type
      is_relaying
      relay_leg
      rank_position
      note
      video_url
      style {
        id
        name_jp
        name
        distance
        style
      }
      split_times {
        id
        distance
        split_time
      }
      created_at
      updated_at
    }
  }
`

export const GET_BEST_TIMES = gql`
  query GetBestTimes($userId: ID!) {
    bestTimes(userId: $userId) {
      id
      user_id
      style_id
      pool_type
      best_time
      achieved_at
      style {
        id
        name_jp
        name
        distance
        style
      }
      record {
        id
        record_date
        location
      }
    }
  }
`

export const GET_STYLES = gql`
  query GetStyles {
    styles {
      id
      name_jp
      name
      distance
      style
    }
  }
`

// カレンダー用の月別記録取得クエリ
export const GET_CALENDAR_ENTRIES = gql`
  query GetCalendarEntries($startDate: String!, $endDate: String!, $userId: ID) {
    practiceLogs(startDate: $startDate, endDate: $endDate, userId: $userId) {
      id
      user_id
      practice_date
      location
      tags
      note
      user {
        id
        name
      }
    }
    records(startDate: $startDate, endDate: $endDate, userId: $userId) {
      id
      user_id
      style_id
      time
      record_date
      location
      pool_type
      competition_name
      user {
        id
        name
      }
      style {
        id
        name_jp
        distance
      }
    }
  }
`

export const GET_MONTHLY_SUMMARY = gql`
  query GetMonthlySummary($year: Int!, $month: Int!, $userId: ID) {
    monthlySummary(year: $year, month: $month, userId: $userId) {
      practiceCount
      recordCount
      totalDistance
      averageTime
    }
  }
`

export const GET_PRACTICE_LOGS_BY_DATE_RANGE = gql`
  query GetPracticeLogsByDateRange($startDate: String!, $endDate: String!, $userId: ID) {
    practiceLogs(startDate: $startDate, endDate: $endDate, userId: $userId) {
      id
      user_id
      practice_date
      location
      tags
      note
      created_at
      updated_at
      user {
        id
        name
        role
      }
    }
  }
`

export const GET_RECORDS_BY_DATE_RANGE = gql`
  query GetRecordsByDateRange($startDate: String!, $endDate: String!, $userId: ID) {
    records(startDate: $startDate, endDate: $endDate, userId: $userId) {
      id
      user_id
      style_id
      time
      record_date
      location
      pool_type
      competition_name
      is_relaying
      relay_leg
      rank_position
      note
      video_url
      created_at
      updated_at
      user {
        id
        name
        role
      }
      style {
        id
        name_jp
        name
        distance
        style
      }
    }
  }
`
