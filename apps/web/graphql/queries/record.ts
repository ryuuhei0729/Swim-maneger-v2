import { gql } from '@apollo/client'

// 記録関連クエリ
export const GET_RECORDS = gql`
  query GetRecords {
    records {
      id
      user_id
      competition_id
      style_id
      time
      video_url
      note
      user {
        id
        name
      }
      competition {
        id
        title
        date
      }
      style {
        id
        name_jp
        name
        style
        distance
      }
    }
  }
`

export const GET_RECORD = gql`
  query GetRecord($id: ID!) {
    record(id: $id) {
      id
      user_id
      competition_id
      style_id
      time
      video_url
      note
      user {
        id
        name
      }
      competition {
        id
        title
        date
      }
      style {
        id
        name_jp
        name
        style
        distance
      }
      split_times {
        id
        distance
        split_time
      }
    }
  }
`

export const GET_RECORDS_BY_USER = gql`
  query GetRecordsByUser($userId: ID!) {
    recordsByUser(userId: $userId) {
      id
      user_id
      competition_id
      style_id
      time
      video_url
      note
      competition {
        id
        title
        date
      }
      style {
        id
        name_jp
        name
        style
        distance
      }
    }
  }
`
