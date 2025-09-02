// GraphQLスキーマとタイプの統一エクスポート
export * from '../generated/types'

// スキーマファイルの読み込み用ヘルパー
import { readFileSync } from 'fs'
import { join } from 'path'

export const typeDefs = readFileSync(
  join(__dirname, 'schema.graphql'),
  'utf8'
)
