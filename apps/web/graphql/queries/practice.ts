import { gql } from '@apollo/client'

// 練習関連クエリ
export const GET_PRACTICE_LOGS = gql`
  query GetPracticeLogs {
    practice_logs {
      id
      user_id
      date
      tags
      style
      rep_count
      set_count
      distance
      circle
      note
      user {
        id
        name
      }
      practice_times {
        id
        rep_number
        set_number
        time
      }
    }
  }
`

export const GET_PRACTICE_LOG = gql`
  query GetPracticeLog($id: ID!) {
    practice_log(id: $id) {
      id
      user_id
      date
      tags
      style
      rep_count
      set_count
      distance
      circle
      note
      user {
        id
        name
      }
      practice_times {
        id
        rep_number
        set_number
        time
      }
    }
  }
`

export const GET_PRACTICE_LOGS_BY_USER = gql`
  query GetPracticeLogsByUser($userId: ID!) {
    practiceLogsByUser(userId: $userId) {
      id
      user_id
      date
      tags
      style
      rep_count
      set_count
      distance
      circle
      note
      practice_times {
        id
        rep_number
        set_number
        time
      }
    }
  }
`