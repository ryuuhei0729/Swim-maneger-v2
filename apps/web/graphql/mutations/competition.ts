import { gql } from '@apollo/client'

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
