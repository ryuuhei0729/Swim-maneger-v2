import { gql } from '@apollo/client'

// ユーザー関連ミューテーション
export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      userId
      name
      phone
      birthday
      emergencyContact
      updatedAt
    }
  }
`

// イベント関連ミューテーション
export const CREATE_EVENT = gql`
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      id
      title
      description
      eventType
      startTime
      endTime
      location
      createdBy
      creator {
        id
        name
        role
      }
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_EVENT = gql`
  mutation UpdateEvent($id: ID!, $input: UpdateEventInput!) {
    updateEvent(id: $id, input: $input) {
      id
      title
      description
      eventType
      startTime
      endTime
      location
      updatedAt
    }
  }
`

export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id)
  }
`

// 出席関連ミューテーション
export const UPDATE_ATTENDANCE = gql`
  mutation UpdateAttendance($input: UpdateAttendanceInput!) {
    updateAttendance(input: $input) {
      id
      eventId
      userId
      status
      notes
      event {
        id
        title
      }
      user {
        id
        name
      }
      updatedAt
    }
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
