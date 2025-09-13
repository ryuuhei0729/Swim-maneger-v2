import { gql } from '@apollo/client'

// ユーザー関連クエリ
export const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      gender
      birthday
      avatarUrl
      bio
    }
  }
`

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      gender
      birthday
      avatarUrl
      bio
    }
  }
`

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      gender
      birthday
      avatarUrl
      bio
    }
  }
`
