import { gql } from '@apollo/client'

// 練習タグ関連ミューテーション
export const CREATE_PRACTICE_TAG = gql`
  mutation CreatePracticeTag($input: CreatePracticeTagInput!) {
    createPracticeTag(input: $input) {
      id
      userId
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
      userId
      name
      color
      updatedAt
    }
  }
`

export const DELETE_PRACTICE_TAG = gql`
  mutation DeletePracticeTag($id: ID!) {
    deletePracticeTag(id: $id)
  }
`

// 練習記録関連ミューテーション
export const CREATE_PRACTICE_LOG = gql`
  mutation CreatePracticeLog($input: CreatePracticeLogInput!) {
    createPracticeLog(input: $input) {
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
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_PRACTICE_LOG = gql`
  mutation UpdatePracticeLog($id: ID!, $input: UpdatePracticeLogInput!) {
    updatePracticeLog(id: $id, input: $input) {
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
      updatedAt
    }
  }
`

export const DELETE_PRACTICE_LOG = gql`
  mutation DeletePracticeLog($id: ID!) {
    deletePracticeLog(id: $id)
  }
`

// 練習タイム関連ミューテーション
export const CREATE_PRACTICE_TIME = gql`
  mutation CreatePracticeTime($input: CreatePracticeTimeInput!) {
    createPracticeTime(input: $input) {
      id
      userId
      practiceLogId
      repNumber
      setNumber
      time
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_PRACTICE_TIME = gql`
  mutation UpdatePracticeTime($id: ID!, $input: UpdatePracticeTimeInput!) {
    updatePracticeTime(id: $id, input: $input) {
      id
      repNumber
      setNumber
      time
      updatedAt
    }
  }
`

export const DELETE_PRACTICE_TIME = gql`
  mutation DeletePracticeTime($id: ID!) {
    deletePracticeTime(id: $id)
  }
`

// 練習記録関連ミューテーション
export const CREATE_PRACTICE_RECORD = gql`
  mutation CreatePracticeRecord($input: CreatePracticeRecordInput!) {
    createPracticeRecord(input: $input) {
      id
      eventId
      userId
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
      }
      user {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_PRACTICE_RECORD = gql`
  mutation UpdatePracticeRecord($id: ID!, $input: UpdatePracticeRecordInput!) {
    updatePracticeRecord(id: $id, input: $input) {
      id
      stroke
      distance
      sets
      reps
      circleTime
      bestTime
      notes
      updatedAt
    }
  }
`

export const DELETE_PRACTICE_RECORD = gql`
  mutation DeletePracticeRecord($id: ID!) {
    deletePracticeRecord(id: $id)
  }
`
