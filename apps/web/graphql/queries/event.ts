import { gql } from '@apollo/client'

// イベント関連クエリ
export const GET_EVENTS = gql`
  query GetEvents {
    events {
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
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_EVENT = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
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
      }
      attendances {
        id
        userId
        status
        notes
        user {
          id
          name
        }
      }
      practiceRecords {
        id
        userId
        stroke
        distance
        sets
        reps
        circleTime
        bestTime
        notes
        user {
          id
          name
        }
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_UPCOMING_EVENTS = gql`
  query GetUpcomingEvents {
    upcomingEvents {
      id
      title
      description
      eventType
      startTime
      endTime
      location
      creator {
        id
        name
      }
    }
  }
`

// 出席関連クエリ
export const GET_ATTENDANCES = gql`
  query GetAttendances($eventId: ID) {
    attendances(eventId: $eventId) {
      id
      eventId
      userId
      status
      notes
      event {
        id
        title
        startTime
      }
      user {
        id
        name
        role
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_MY_ATTENDANCES = gql`
  query GetMyAttendances {
    myAttendances {
      id
      eventId
      status
      notes
      event {
        id
        title
        eventType
        startTime
        endTime
      }
      createdAt
      updatedAt
    }
  }
`
