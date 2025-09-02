import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { GraphQLHTTP } from 'https://deno.land/x/gql@1.1.2/mod.ts'
import { makeExecutableSchema } from 'https://deno.land/x/graphql_tools@0.0.2/mod.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// GraphQLスキーマとリゾルバーをインポート
import { typeDefs } from './schema.ts'
import { resolvers } from './resolvers.ts'

// Supabaseクライアントの初期化
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// スキーマの作成
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

// GraphQLサーバーの設定
const graphQLHTTP = GraphQLHTTP<Request>({
  schema,
  graphiql: true,
  context: (request) => ({
    supabase,
    request,
    user: null, // 認証情報は後で実装
  }),
})

// サーバーの起動
serve(async (req) => {
  const { pathname } = new URL(req.url)

  // CORS設定
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  // GraphQLエンドポイント
  if (pathname === '/graphql' || pathname === '/') {
    const response = await graphQLHTTP(req)
    
    // CORS ヘッダーを追加
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    return response
  }

  return new Response('Not Found', { status: 404 })
})
