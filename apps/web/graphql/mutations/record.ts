import { gql } from '@apollo/client'

// 記録関連ミューテーション
export const CREATE_RECORD = gql`
  mutation CreateRecord($input: CreateRecordInput!) {
    createRecord(input: $input) {
      id
      userId
      styleId
      time
      videoUrl
      note
      competitionId
      createdAt
      updatedAt
      style {
        id
        nameJp
        name
        distance
        stroke
      }
      competition {
        id
        title
        date
        place
        poolType
      }
    }
  }
`

export const UPDATE_RECORD = gql`
  mutation UpdateRecord($id: ID!, $input: RecordInput!) {
    updateRecord(id: $id, input: $input) {
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

export const DELETE_RECORD = gql`
  mutation DeleteRecord($id: ID!) {
    deleteRecord(id: $id)
  }
`

export const CREATE_SPLIT_TIME = gql`
  mutation CreateSplitTime($input: SplitTimeInput!) {
    createSplitTime(input: $input) {
      id
      record_id
      distance
      split_time
    }
  }
`

export const UPDATE_SPLIT_TIME = gql`
  mutation UpdateSplitTime($id: ID!, $input: SplitTimeInput!) {
    updateSplitTime(id: $id, input: $input) {
      id
      record_id
      distance
      split_time
    }
  }
`

export const DELETE_SPLIT_TIME = gql`
  mutation DeleteSplitTime($id: ID!) {
    deleteSplitTime(id: $id) {
      success
    }
  }
`
