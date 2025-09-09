import { gql } from '@apollo/client'

// 大会関連ミューテーション
export const CREATE_COMPETITION = gql`
  mutation CreateCompetition($input: CompetitionInput!) {
    createCompetition(input: $input) {
      id
      title
      date
      place
      note
    }
  }
`

export const UPDATE_COMPETITION = gql`
  mutation UpdateCompetition($id: ID!, $input: CompetitionInput!) {
    updateCompetition(id: $id, input: $input) {
      id
      title
      date
      place
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