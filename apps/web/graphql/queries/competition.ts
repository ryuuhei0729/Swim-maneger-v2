import { gql } from '@apollo/client'

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
