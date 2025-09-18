import { gql } from '@apollo/client/core'

// 大会関連ミューテーション
export const CREATE_COMPETITION = gql`
  mutation CreateCompetition($input: CreateCompetitionInput!) {
    createCompetition(input: $input) {
      id
      title
      date
      place
      poolType
      note
    }
  }
`

export const UPDATE_COMPETITION = gql`
  mutation UpdateCompetition($id: ID!, $input: UpdateCompetitionInput!) {
    updateCompetition(id: $id, input: $input) {
      id
      title
      date
      place
      poolType
      note
    }
  }
`

export const DELETE_COMPETITION = gql`
  mutation DeleteCompetition($id: ID!) {
    deleteCompetition(id: $id) {
      success
    }
  }
`