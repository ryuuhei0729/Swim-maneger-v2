import { gql } from '@apollo/client'

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
