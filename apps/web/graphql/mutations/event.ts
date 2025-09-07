import { gql } from '@apollo/client'

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
