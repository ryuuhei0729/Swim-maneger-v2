import { gql } from '@apollo/client'

// ユーザー関連クエリ
export const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      avatarUrl
      role
      generation
      birthday
      bio
      gender
      createdAt
      updatedAt
    }
  }
`

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      user_id
      name
      role
      avatar_url
      phone
      birthday
      emergency_contact
      created_at
      updated_at
    }
  }
`

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      user_id
      name
      role
      avatar_url
      phone
      birthday
      emergency_contact
      created_at
      updated_at
    }
  }
`

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
        role
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
        role
      }
      attendances {
        id
        user_id
        status
        notes
        user {
          id
          name
        }
      }
      practiceRecords {
        id
        user_id
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
        role
      }
    }
  }
`

// 出席関連クエリ
export const GET_ATTENDANCES = gql`
  query GetAttendances($eventId: ID) {
    attendances(eventId: $eventId) {
      id
      event_id
      user_id
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
      event_id
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

// 練習記録関連クエリ
export const GET_PRACTICE_RECORDS = gql`
  query GetPracticeRecords($eventId: ID, $userId: ID) {
    practiceRecords(eventId: $eventId, userId: $userId) {
      id
      event_id
      user_id
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

export const GET_MY_PRACTICE_RECORDS = gql`
  query GetMyPracticeRecords {
    myPracticeRecords {
      id
      event_id
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
        eventType
        startTime
      }
      createdAt
      updatedAt
    }
  }
`
