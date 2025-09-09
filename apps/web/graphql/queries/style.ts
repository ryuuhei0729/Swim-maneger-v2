import { gql } from '@apollo/client'

// 種目関連クエリ
export const GET_STYLES = gql`
  query GetStyles {
    styles {
      id
      name_jp
      name
      style
      distance
    }
  }
`

export const GET_STYLE = gql`
  query GetStyle($id: ID!) {
    style(id: $id) {
      id
      name_jp
      name
      style
      distance
    }
  }
`
