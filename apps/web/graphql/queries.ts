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

// 種目・泳法関連クエリ
export const GET_STYLES = gql`
  query GetStyles {
    styles {
      id
      nameJp
      name
      distance
      stroke
      createdAt
      updatedAt
    }
  }
`

// 練習タグ関連クエリ
export const GET_MY_PRACTICE_TAGS = gql`
  query GetMyPracticeTags {
    myPracticeTags {
      id
      userId
      name
      color
      createdAt
      updatedAt
    }
  }
`

// 練習記録関連クエリ
export const GET_MY_PRACTICE_LOGS = gql`
  query GetMyPracticeLogs($startDate: Date, $endDate: Date) {
    myPracticeLogs(startDate: $startDate, endDate: $endDate) {
      id
      userId
      practiceDate
      location
      tags {
        id
        name
        color
      }
      style
      repCount
      setCount
      distance
      circle
      note
      times {
        id
        repNumber
        setNumber
        time
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_PRACTICE_LOGS_BY_DATE = gql`
  query GetPracticeLogsByDate($date: Date!) {
    practiceLogsByDate(date: $date) {
      id
      userId
      practiceDate
      location
      tags {
        id
        name
        color
      }
      style
      repCount
      setCount
      distance
      circle
      note
      times {
        id
        repNumber
        setNumber
        time
      }
      createdAt
      updatedAt
    }
  }
`

// 大会関連クエリ
export const GET_MY_COMPETITIONS = gql`
  query GetMyCompetitions {
    myCompetitions {
      id
      name
      competitionDate
      location
      poolType
      poolLength
      competitionCategory
      userId
      records {
        id
        time
        style {
          nameJp
        }
      }
      createdAt
      updatedAt
    }
  }
`

// 記録関連クエリ
export const GET_MY_RECORDS = gql`
  query GetMyRecords($startDate: Date, $endDate: Date, $styleId: ID, $poolType: PoolType) {
    myRecords(startDate: $startDate, endDate: $endDate, styleId: $styleId, poolType: $poolType) {
      id
      userId
      styleId
      style {
        id
        nameJp
        name
        distance
        stroke
      }
      time
      recordDate
      location
      poolType
      poolLength
      isRelay
      rankPosition
      memo
      videoUrl
      competitionId
      competition {
        id
        name
        competitionDate
      }
      splitTimes {
        id
        distance
        splitTime
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_RECORDS_BY_DATE = gql`
  query GetRecordsByDate($date: Date!) {
    recordsByDate(date: $date) {
      id
      userId
      styleId
      style {
        id
        nameJp
        name
        distance
        stroke
      }
      time
      recordDate
      location
      poolType
      poolLength
      isRelay
      rankPosition
      memo
      videoUrl
      competitionId
      competition {
        id
        name
        competitionDate
      }
      splitTimes {
        id
        distance
        splitTime
      }
      createdAt
      updatedAt
    }
  }
`

// ベストタイム関連クエリ
export const GET_MY_BEST_TIMES = gql`
  query GetMyBestTimes($poolType: PoolType) {
    myBestTimes(poolType: $poolType) {
      id
      userId
      styleId
      style {
        id
        nameJp
        name
        distance
        stroke
      }
      poolType
      bestTime
      recordId
      record {
        id
        recordDate
        competition {
          name
        }
      }
      achievedDate
      createdAt
      updatedAt
    }
  }
`

// 個人目標関連クエリ
export const GET_MY_PERSONAL_GOALS = gql`
  query GetMyPersonalGoals {
    myPersonalGoals {
      id
      userId
      goalType
      styleId
      style {
        id
        nameJp
        name
        distance
        stroke
      }
      poolType
      targetTime
      title
      description
      targetDate
      startDate
      isAchieved
      achievedDate
      progress {
        id
        progressDate
        progressValue
        progressNote
      }
      createdAt
      updatedAt
    }
  }
`

// カレンダー関連クエリ
export const GET_CALENDAR_DATA = gql`
  query GetCalendarData($year: Int!, $month: Int!) {
    calendarData(year: $year, month: $month) {
      year
      month
      days {
        date
        hasPractice
        hasCompetition
        practiceCount
        recordCount
      }
      summary {
        totalPractices
        totalCompetitions
        totalRecords
      }
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
