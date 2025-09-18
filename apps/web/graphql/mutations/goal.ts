import { gql } from '@apollo/client/core'

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
