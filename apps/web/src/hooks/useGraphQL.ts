import { useQuery, useMutation, useApolloClient } from '@apollo/client/react'
import { 
  GET_ME, 
  GET_USERS, 
  GET_EVENTS, 
  GET_UPCOMING_EVENTS,
  GET_MY_ATTENDANCES,
  GET_MY_PRACTICE_RECORDS 
} from '@/graphql/queries'
import { 
  UPDATE_PROFILE,
  CREATE_EVENT,
  UPDATE_EVENT,
  DELETE_EVENT,
  UPDATE_ATTENDANCE,
  CREATE_PRACTICE_RECORD,
  UPDATE_PRACTICE_RECORD,
  DELETE_PRACTICE_RECORD
} from '@/graphql/mutations'

// ユーザー関連フック
export const useMe = (skip?: boolean) => {
  return useQuery(GET_ME, {
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
    skip: skip,
    fetchPolicy: 'cache-and-network',
  })
}

export const useUsers = () => {
  return useQuery(GET_USERS, {
    errorPolicy: 'all',
  })
}

export const useUpdateProfile = () => {
  return useMutation(UPDATE_PROFILE, {
    refetchQueries: [{ query: GET_ME }],
  })
}

// イベント関連フック
export const useEvents = () => {
  return useQuery(GET_EVENTS, {
    errorPolicy: 'all',
  })
}

export const useUpcomingEvents = () => {
  return useQuery(GET_UPCOMING_EVENTS, {
    errorPolicy: 'all',
    pollInterval: 300000, // 5分ごとに更新
  })
}

export const useCreateEvent = () => {
  return useMutation(CREATE_EVENT, {
    refetchQueries: [
      { query: GET_EVENTS },
      { query: GET_UPCOMING_EVENTS }
    ],
  })
}

export const useUpdateEvent = () => {
  return useMutation(UPDATE_EVENT, {
    refetchQueries: [
      { query: GET_EVENTS },
      { query: GET_UPCOMING_EVENTS }
    ],
  })
}

export const useDeleteEvent = () => {
  return useMutation(DELETE_EVENT, {
    refetchQueries: [
      { query: GET_EVENTS },
      { query: GET_UPCOMING_EVENTS }
    ],
  })
}

// 出席関連フック
export const useMyAttendances = () => {
  return useQuery(GET_MY_ATTENDANCES, {
    errorPolicy: 'all',
  })
}

export const useUpdateAttendance = () => {
  return useMutation(UPDATE_ATTENDANCE, {
    refetchQueries: [{ query: GET_MY_ATTENDANCES }],
  })
}

// 練習記録関連フック
export const useMyPracticeRecords = () => {
  return useQuery(GET_MY_PRACTICE_RECORDS, {
    errorPolicy: 'all',
  })
}

export const useCreatePracticeRecord = () => {
  return useMutation(CREATE_PRACTICE_RECORD, {
    refetchQueries: [{ query: GET_MY_PRACTICE_RECORDS }],
  })
}

export const useUpdatePracticeRecord = () => {
  return useMutation(UPDATE_PRACTICE_RECORD, {
    refetchQueries: [{ query: GET_MY_PRACTICE_RECORDS }],
  })
}

export const useDeletePracticeRecord = () => {
  return useMutation(DELETE_PRACTICE_RECORD, {
    refetchQueries: [{ query: GET_MY_PRACTICE_RECORDS }],
  })
}

// Apollo Client直接アクセス用フック
export const useApollo = () => {
  return useApolloClient()
}
