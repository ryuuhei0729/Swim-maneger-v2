import { gql } from '@apollo/client'

// 記録関連ミューテーション
export const CREATE_RECORD = gql`
  mutation CreateRecord($input: RecordInput!) {
    createRecord(input: $input) {
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

export const UPDATE_RECORD = gql`
  mutation UpdateRecord($id: ID!, $input: RecordInput!) {
    updateRecord(id: $id, input: $input) {
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

export const DELETE_RECORD = gql`
  mutation DeleteRecord($id: ID!) {
    deleteRecord(id: $id) {
      success
    }
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
