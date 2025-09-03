import { gql } from '@apollo/client'

// 個人利用機能用のmutations
export const CREATE_PRACTICE_LOG = gql`
  mutation CreatePracticeLog($input: CreatePracticeLogInput!) {
    createPracticeLog(input: $input) {
      id
      user_id
      practice_date
      location
      tags
      note
      created_at
    }
  }
`

export const UPDATE_PRACTICE_LOG = gql`
  mutation UpdatePracticeLog($id: ID!, $input: UpdatePracticeLogInput!) {
    updatePracticeLog(id: $id, input: $input) {
      id
      user_id
      practice_date
      location
      tags
      note
      updated_at
    }
  }
`

export const DELETE_PRACTICE_LOG = gql`
  mutation DeletePracticeLog($id: ID!) {
    deletePracticeLog(id: $id) {
      success
      message
    }
  }
`

export const CREATE_RECORD = gql`
  mutation CreateRecord($input: CreateRecordInput!) {
    createRecord(input: $input) {
      id
      user_id
      style_id
      time
      record_date
      location
      pool_type
      is_relaying
      relay_leg
      rank_position
      note
      video_url
      created_at
    }
  }
`

export const UPDATE_RECORD = gql`
  mutation UpdateRecord($id: ID!, $input: UpdateRecordInput!) {
    updateRecord(id: $id, input: $input) {
      id
      user_id
      style_id
      time
      record_date
      location
      pool_type
      is_relaying
      relay_leg
      rank_position
      note
      video_url
      updated_at
    }
  }
`

export const DELETE_RECORD = gql`
  mutation DeleteRecord($id: ID!) {
    deleteRecord(id: $id) {
      success
      message
    }
  }
`

export const CREATE_SPLIT_TIME = gql`
  mutation CreateSplitTime($input: CreateSplitTimeInput!) {
    createSplitTime(input: $input) {
      id
      record_id
      distance
      split_time
      created_at
    }
  }
`

export const UPDATE_BEST_TIME = gql`
  mutation UpdateBestTime($input: UpdateBestTimeInput!) {
    updateBestTime(input: $input) {
      id
      user_id
      style_id
      pool_type
      best_time
      achieved_at
      updated_at
    }
  }
`

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
