import { gql } from '@apollo/client'

// 練習タグ関連クエリ
export const GET_MY_PRACTICE_TAGS = gql`
  query GetMyPracticeTags {
    myPracticeTags {
      id
      name
      color
      createdAt
      updatedAt
    }
  }
`

// 練習関連クエリ
export const GET_PRACTICE_LOGS = gql`
  query GetPracticeLogs {
    myPracticeLogs {
      id
      userId
      date
      place
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
    }
  }
`

export const GET_PRACTICE_LOG = gql`
  query GetPracticeLog($id: ID!) {
    practiceLog(id: $id) {
      id
      userId
      date
      place
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
    }
  }
`

export const GET_PRACTICE_LOGS_BY_USER = gql`
  query GetPracticeLogsByUser {
    myPracticeLogs {
      id
      userId
      date
      place
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
    }
  }
`