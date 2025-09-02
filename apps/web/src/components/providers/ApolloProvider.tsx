'use client'

import React from 'react'
import { ApolloProvider as BaseApolloProvider } from '@apollo/client/react'
import { apolloClient } from '@/lib/apollo-client'

interface ApolloProviderProps {
  children: React.ReactNode
}

export default function ApolloProvider({ children }: ApolloProviderProps) {
  return (
    <BaseApolloProvider client={apolloClient}>
      {children}
    </BaseApolloProvider>
  )
}
