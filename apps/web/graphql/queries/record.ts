import { gql } from '@apollo/client'

// 記録関連クエリ
export const GET_RECORDS = gql`
  query GetRecords {
    myRecords {
      id
      userId
      competitionId
      styleId
      time
      videoUrl
      note
      competition {
        id
        title
        date
      }
      style {
        id
        nameJp
        name
        stroke
        distance
      }
    }
  }
`

export const GET_RECORD = gql`
  query GetRecord($id: ID!) {
    record(id: $id) {
      id
      userId: user_id
      competitionId: competition_id
      styleId: style_id
      time
      videoUrl: video_url
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
        nameJp
        name
        stroke
        distance
      }
      splitTimes {
        id
        recordId
        distance
        splitTime
      }
    }
  }
`

export const GET_RECORDS_BY_USER = gql`
  query GetRecordsByUser($userId: ID!) {
    recordsByUser(userId: $userId) {
      id
      userId: user_id
      competitionId: competition_id
      styleId: style_id
      time
      videoUrl: video_url
      note
      competition {
        id
        title
        date
      }
      style {
        id
        nameJp
        name
        stroke
        distance
      }
    }
  }
`
