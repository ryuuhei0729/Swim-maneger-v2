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

// 大会関連ミューテーション
export const CREATE_COMPETITION = gql`
  mutation CreateCompetition($input: CreateCompetitionInput!) {
    createCompetition(input: $input) {
      id
      name
      competitionDate
      location
      poolType
      poolLength
      competitionCategory
      userId
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_COMPETITION = gql`
  mutation UpdateCompetition($id: ID!, $input: UpdateCompetitionInput!) {
    updateCompetition(id: $id, input: $input) {
      id
      name
      competitionDate
      location
      poolType
      poolLength
      competitionCategory
      updatedAt
    }
  }
`

export const DELETE_COMPETITION = gql`
  mutation DeleteCompetition($id: ID!) {
    deleteCompetition(id: $id)
  }
`

// 記録関連ミューテーション
export const CREATE_RECORD = gql`
  mutation CreateRecord($input: CreateRecordInput!) {
    createRecord(input: $input) {
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
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_RECORD = gql`
  mutation UpdateRecord($id: ID!, $input: UpdateRecordInput!) {
    updateRecord(id: $id, input: $input) {
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
      updatedAt
    }
  }
`

export const DELETE_RECORD = gql`
  mutation DeleteRecord($id: ID!) {
    deleteRecord(id: $id)
  }
`

// スプリットタイム関連ミューテーション
export const CREATE_SPLIT_TIME = gql`
  mutation CreateSplitTime($input: CreateSplitTimeInput!) {
    createSplitTime(input: $input) {
      id
      recordId
      distance
      splitTime
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_SPLIT_TIME = gql`
  mutation UpdateSplitTime($id: ID!, $input: UpdateSplitTimeInput!) {
    updateSplitTime(id: $id, input: $input) {
      id
      distance
      splitTime
      updatedAt
    }
  }
`

export const DELETE_SPLIT_TIME = gql`
  mutation DeleteSplitTime($id: ID!) {
    deleteSplitTime(id: $id)
  }
`

// 個人目標関連ミューテーション
export const CREATE_PERSONAL_GOAL = gql`
  mutation CreatePersonalGoal($input: CreatePersonalGoalInput!) {
    createPersonalGoal(input: $input) {
      id
      userId
      goalType
      styleId
      style {
        id
        nameJp
        name
        distance
        stroke
      }
      poolType
      targetTime
      title
      description
      targetDate
      startDate
      isAchieved
      achievedDate
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_PERSONAL_GOAL = gql`
  mutation UpdatePersonalGoal($id: ID!, $input: UpdatePersonalGoalInput!) {
    updatePersonalGoal(id: $id, input: $input) {
      id
      userId
      goalType
      styleId
      style {
        id
        nameJp
        name
        distance
        stroke
      }
      poolType
      targetTime
      title
      description
      targetDate
      startDate
      isAchieved
      achievedDate
      updatedAt
    }
  }
`

export const DELETE_PERSONAL_GOAL = gql`
  mutation DeletePersonalGoal($id: ID!) {
    deletePersonalGoal(id: $id)
  }
`

// 目標進捗関連ミューテーション
export const CREATE_GOAL_PROGRESS = gql`
  mutation CreateGoalProgress($input: CreateGoalProgressInput!) {
    createGoalProgress(input: $input) {
      id
      personalGoalId
      progressDate
      progressValue
      progressNote
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_GOAL_PROGRESS = gql`
  mutation UpdateGoalProgress($id: ID!, $input: UpdateGoalProgressInput!) {
    updateGoalProgress(id: $id, input: $input) {
      id
      progressDate
      progressValue
      progressNote
      updatedAt
    }
  }
`

export const DELETE_GOAL_PROGRESS = gql`
  mutation DeleteGoalProgress($id: ID!) {
    deleteGoalProgress(id: $id)
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

