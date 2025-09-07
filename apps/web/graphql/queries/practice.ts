import { gql } from '@apollo/client'

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
