import { gql } from '@apollo/client'

// 練習タグ関連ミューテーション
export const CREATE_PRACTICE_TAG = gql`
  mutation CreatePracticeTag($input: CreatePracticeTagInput!) {
    createPracticeTag(input: $input) {
      id
      name
      color
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_PRACTICE_TAG = gql`
  mutation UpdatePracticeTag($id: ID!, $input: UpdatePracticeTagInput!) {
    updatePracticeTag(id: $id, input: $input) {
      id
      name
      color
      createdAt
      updatedAt
    }
  }
`

export const DELETE_PRACTICE_TAG = gql`
  mutation DeletePracticeTag($id: ID!) {
    deletePracticeTag(id: $id)
  }
`

// 練習関連ミューテーション
export const CREATE_PRACTICE_LOG = gql`
  mutation CreatePracticeLog($input: CreatePracticeLogInput!) {
    createPracticeLog(input: $input) {
      id
      userId
      date
      place
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
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_PRACTICE_LOG = gql`
  mutation UpdatePracticeLog($id: ID!, $input: PracticeLogInput!) {
    updatePracticeLog(id: $id, input: $input) {
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
    }
  }
`

export const DELETE_PRACTICE_LOG = gql`
  mutation DeletePracticeLog($id: ID!) {
    deletePracticeLog(id: $id) {
      success
    }
  }
`

export const CREATE_PRACTICE_TIME = gql`
  mutation CreatePracticeTime($input: PracticeTimeInput!) {
    createPracticeTime(input: $input) {
      id
      practice_log_id
      rep_number
      set_number
      time
    }
  }
`

export const UPDATE_PRACTICE_TIME = gql`
  mutation UpdatePracticeTime($id: ID!, $input: PracticeTimeInput!) {
    updatePracticeTime(id: $id, input: $input) {
      id
      practice_log_id
      rep_number
      set_number
      time
    }
  }
`

export const DELETE_PRACTICE_TIME = gql`
  mutation DeletePracticeTime($id: ID!) {
    deletePracticeTime(id: $id) {
      success
    }
  }
`