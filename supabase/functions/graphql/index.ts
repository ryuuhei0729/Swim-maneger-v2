// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// @ts-ignore
import { buildSchema, graphql } from 'https://esm.sh/graphql@16.6.0'
// resolversを安全に読み込み
let resolvers: any
try {
  const { resolvers: importedResolvers } = await import('./resolvers.ts')
  resolvers = importedResolvers
} catch (error) {
  console.error('Failed to import resolvers:', error)
  // フォールバック: 基本的なリゾルバー
  resolvers = {
    Query: {
      me: () => 'Hello from GraphQL!'
    },
    Mutation: {
      test: () => 'Test mutation works!'
    }
  }
}

// Deno型定義
declare const Deno: any

// メインスキーマを読み込み
let schemaText: string
try {
  // TypeScriptファイルからスキーマをインポート
  const { typeDefs } = await import('./schema.ts')
  schemaText = typeDefs
} catch (error) {
  console.error('Failed to import schema from TypeScript file:', error)
  // フォールバック: 基本的なスキーマを直接定義
  schemaText = `
    scalar DateTime
    scalar JSON
    scalar Date
    
    type Query {
      me: String
    }
    
    type Mutation {
      test: String
    }
  `
}

const schema = buildSchema(schemaText)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-requested-with',
  'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'true',
}

// JWT検証とユーザー情報取得
async function getUser(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
  })

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) {
      console.error('Auth error:', error)
      return null
    }
    return user
  } catch (error) {
    console.error('JWT verification error:', error)
    return null
  }
}

serve(async (req) => {
  try {
    // CORS対応
    if (req.method === 'OPTIONS') {
      return new Response('OK', { 
        status: 200,
        headers: corsHeaders 
      })
    }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders 
    })
  }

  try {
    // リクエストボディを解析
    const { query, variables, operationName } = await req.json()
    
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'GraphQL query is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // 認証情報を取得
    const authHeader = req.headers.get('authorization')
    const user = await getUser(authHeader)

    // GraphQLコンテキストを作成
    const context = {
      user,
      req,
    }

    // GraphQLクエリを実行
    const result = await graphql({
      schema,
      source: query,
      variableValues: variables,
      operationName,
      contextValue: context,
      rootValue: resolvers,
      fieldResolver: (source, args, context, info) => {
        const fieldName = info.fieldName
        const parentType = info.parentType.name
        
        // リゾルバーが存在する場合は使用
        const resolver = resolvers?.[parentType]?.[fieldName]
        if (resolver) {
          return resolver(source, args, context, info)
        }
        
        // デフォルトの動作：sourceからフィールドを取得
        return source?.[fieldName]
      }
    })

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('GraphQL execution error:', error)
    
    return new Response(
      JSON.stringify({
        errors: [{
          message: error.message || 'Internal server error',
          extensions: {
            code: 'INTERNAL_ERROR'
          }
        }]
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
  } catch (error) {
    console.error('Server error:', error)
    return new Response(
      JSON.stringify({
        error: 'Server initialization error',
        message: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

