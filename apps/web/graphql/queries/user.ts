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
