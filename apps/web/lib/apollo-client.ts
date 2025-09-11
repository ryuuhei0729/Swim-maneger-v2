import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { getGraphQLEndpoint } from './env'
import { createClient } from './supabase'

// 環境別GraphQL エンドポイント
const httpLink = createHttpLink({
  uri: getGraphQLEndpoint(),
})


// 認証ヘッダーを設定するリンク
const authLink = setContext(async (_, { headers }) => {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    
    return {
      headers: {
        ...headers,
        authorization: session?.access_token ? `Bearer ${session.access_token}` : '',
        'Content-Type': 'application/json',
      }
    }
  } catch (error) {
    console.error('Auth link error:', error)
    return {
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      }
    }
  }
})

// エラーハンドリングリンク
const errorLink = onError((error) => {
  // @ts-expect-error - Apollo Client v4の型定義の問題を回避
  const { graphQLErrors, networkError } = error
  
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }: any) => {
      console.error(
        `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    })
  }

  if (networkError) {
    console.error(`Network error: ${networkError}`)
    console.error('Network error details:', {
      message: networkError.message,
      statusCode: (networkError as any).statusCode,
      result: (networkError as any).result
    })
    
    // 401エラーの場合、認証が必要
    if ('statusCode' in networkError && (networkError as any).statusCode === 401) {
      // 必要に応じてログアウト処理やリダイレクト
      console.warn('Unauthorized access - consider redirecting to login')
    }
  }
})

// Apollo Clientインスタンスを作成
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Profile: {
        keyFields: ['id'],
      },
      Event: {
        keyFields: ['id'],
      },
      Attendance: {
        keyFields: ['id'],
      },
      PracticeRecord: {
        keyFields: ['id'],
      },
      CompetitionRecord: {
        keyFields: ['id'],
      },
      Goal: {
        keyFields: ['id'],
      },
      Announcement: {
        keyFields: ['id'],
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    },
    query: {
      errorPolicy: 'all',
    },
  },
})

// Apollo Client Provider用のヘルパー
export const getApolloClient = () => apolloClient
