import { gql } from '@apollo/client'

// 個人目標関連クエリ
export const GET_MY_PERSONAL_GOALS = gql`
  query GetMyPersonalGoals {
    myPersonalGoals {
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
      progress {
        id
        progressDate
        progressValue
        progressNote
      }
      createdAt
      updatedAt
    }
  }
`
