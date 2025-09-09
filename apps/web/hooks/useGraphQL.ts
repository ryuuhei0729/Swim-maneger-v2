import {
  CREATE_PRACTICE_LOG,
  CREATE_PRACTICE_TIME,
  CREATE_RECORD,
  CREATE_SPLIT_TIME,
  DELETE_PRACTICE_LOG,
  DELETE_PRACTICE_TIME,
  DELETE_RECORD,
  DELETE_SPLIT_TIME,
  UPDATE_PRACTICE_LOG,
  UPDATE_PRACTICE_TIME,
  UPDATE_PROFILE,
  UPDATE_RECORD,
  UPDATE_SPLIT_TIME
} from '@/graphql/mutations'
import {
  GET_CALENDAR_DATA,
  GET_ME,
  GET_PRACTICE_LOGS,
  GET_RECORDS,
  GET_STYLES,
  GET_USERS
} from '@/graphql/queries'
import { useApolloClient, useMutation, useQuery } from '@apollo/client/react'

// ユーザー関連フック
export const useMe = (skip?: boolean) => {
  return useQuery(GET_ME, {
    errorPolicy: 'ignore', // エラーを無視して処理を続行
    notifyOnNetworkStatusChange: true,
    skip: skip,
    fetchPolicy: 'cache-and-network',
  })
}

export const useUsers = () => {
  return useQuery(GET_USERS, {
    errorPolicy: 'ignore', // エラーを無視して処理を続行
  })
}

export const useUpdateProfile = () => {
  return useMutation(UPDATE_PROFILE, {
    refetchQueries: [{ query: GET_ME }],
  })
}

// イベント関連フック（現在は未実装）
// TODO: イベント機能が実装されたら有効化
// export const useEvents = () => {
//   return useQuery(GET_EVENTS, {
//     errorPolicy: 'ignore',
//   })
// }

// export const useUpcomingEvents = () => {
//   return useQuery(GET_UPCOMING_EVENTS, {
//     errorPolicy: 'ignore',
//     pollInterval: 300000,
//   })
// }

// export const useCreateEvent = () => {
//   return useMutation(CREATE_EVENT, {
//     refetchQueries: [
//       { query: GET_EVENTS },
//       { query: GET_UPCOMING_EVENTS }
//     ],
//   })
// }

// export const useUpdateEvent = () => {
//   return useMutation(UPDATE_EVENT, {
//     refetchQueries: [
//       { query: GET_EVENTS },
//       { query: GET_UPCOMING_EVENTS }
//     ],
//   })
// }

// export const useDeleteEvent = () => {
//   return useMutation(DELETE_EVENT, {
//     refetchQueries: [
//       { query: GET_EVENTS },
//       { query: GET_UPCOMING_EVENTS }
//     ],
//   })
// }

// 出席関連フック（現在は未実装）
// TODO: 出席機能が実装されたら有効化
// export const useMyAttendances = () => {
//   return useQuery(GET_MY_ATTENDANCES, {
//     errorPolicy: 'ignore',
//   })
// }

// export const useUpdateAttendance = () => {
//   return useMutation(UPDATE_ATTENDANCE, {
//     refetchQueries: [{ query: GET_MY_ATTENDANCES }],
//   })
// }

// 練習記録関連フック（現在は未実装）
// TODO: 練習記録機能が実装されたら有効化
// export const useMyPracticeRecords = () => {
//   return useQuery(GET_MY_PRACTICE_RECORDS, {
//     errorPolicy: 'ignore',
//   })
// }

// export const useCreatePracticeRecord = () => {
//   return useMutation(CREATE_PRACTICE_RECORD, {
//     refetchQueries: [{ query: GET_MY_PRACTICE_RECORDS }],
//   })
// }

// export const useUpdatePracticeRecord = () => {
//   return useMutation(UPDATE_PRACTICE_RECORD, {
//     refetchQueries: [{ query: GET_MY_PRACTICE_RECORDS }],
//   })
// }

// export const useDeletePracticeRecord = () => {
//   return useMutation(DELETE_PRACTICE_RECORD, {
//     refetchQueries: [{ query: GET_MY_PRACTICE_RECORDS }],
//   })
// }

// 種目・泳法関連フック
export const useStyles = () => {
  return useQuery(GET_STYLES, {
    errorPolicy: 'ignore', // エラーを無視して処理を続行
  })
}

// 練習タグ関連フック（現在は未実装）
// TODO: 練習タグ機能が実装されたら有効化
// export const useMyPracticeTags = () => {
//   return useQuery(GET_MY_PRACTICE_TAGS, {
//     errorPolicy: 'ignore',
//   })
// }

// export const useCreatePracticeTag = () => {
//   return useMutation(CREATE_PRACTICE_TAG, {
//     refetchQueries: [{ query: GET_MY_PRACTICE_TAGS }],
//   })
// }

// export const useUpdatePracticeTag = () => {
//   return useMutation(UPDATE_PRACTICE_TAG, {
//     refetchQueries: [{ query: GET_MY_PRACTICE_TAGS }],
//   })
// }

// export const useDeletePracticeTag = () => {
//   return useMutation(DELETE_PRACTICE_TAG, {
//     refetchQueries: [{ query: GET_MY_PRACTICE_TAGS }],
//   })
// }

// 練習記録関連フック（個人利用機能）
export const useMyPracticeLogs = (variables?: { startDate?: string; endDate?: string }) => {
  return useQuery(GET_MY_PRACTICE_LOGS, {
    variables,
    errorPolicy: 'ignore', // エラーを無視して処理を続行
  })
}

// export const usePracticeLogsByDate = (date: string) => {
//   return useQuery(GET_PRACTICE_LOGS_BY_DATE, {
//     variables: { date },
//     errorPolicy: 'ignore',
//   })
// }

export const useCreatePracticeLog = () => {
  return useMutation(CREATE_PRACTICE_LOG, {
    refetchQueries: [
      { query: GET_MY_PRACTICE_LOGS },
      { query: GET_CALENDAR_DATA }
    ],
  })
}

export const useUpdatePracticeLog = () => {
  return useMutation(UPDATE_PRACTICE_LOG, {
    refetchQueries: [
      { query: GET_MY_PRACTICE_LOGS },
      { query: GET_CALENDAR_DATA }
    ],
  })
}

export const useDeletePracticeLog = () => {
  return useMutation(DELETE_PRACTICE_LOG, {
    refetchQueries: [
      { query: GET_MY_PRACTICE_LOGS },
      { query: GET_CALENDAR_DATA }
    ],
  })
}

// 練習タイム関連フック
export const useCreatePracticeTime = () => {
  return useMutation(CREATE_PRACTICE_TIME, {
    refetchQueries: [{ query: GET_MY_PRACTICE_LOGS }],
  })
}

export const useUpdatePracticeTime = () => {
  return useMutation(UPDATE_PRACTICE_TIME, {
    refetchQueries: [{ query: GET_MY_PRACTICE_LOGS }],
  })
}

export const useDeletePracticeTime = () => {
  return useMutation(DELETE_PRACTICE_TIME, {
    refetchQueries: [{ query: GET_MY_PRACTICE_LOGS }],
  })
}

// 大会関連フック（現在は未実装）
// TODO: 大会機能が実装されたら有効化
// export const useMyCompetitions = () => {
//   return useQuery(GET_MY_COMPETITIONS, {
//     errorPolicy: 'all',
//   })
// }

// export const useCreateCompetition = () => {
//   return useMutation(CREATE_COMPETITION, {
//     refetchQueries: [{ query: GET_MY_COMPETITIONS }],
//   })
// }

// export const useUpdateCompetition = () => {
//   return useMutation(UPDATE_COMPETITION, {
//     refetchQueries: [{ query: GET_MY_COMPETITIONS }],
//   })
// }

// export const useDeleteCompetition = () => {
//   return useMutation(DELETE_COMPETITION, {
//     refetchQueries: [{ query: GET_MY_COMPETITIONS }],
//   })
// }

// 記録関連フック（個人利用機能）
export const useMyRecords = (variables?: { 
  startDate?: string; 
  endDate?: string; 
  styleId?: string; 
  poolType?: 'SHORT_COURSE' | 'LONG_COURSE' 
}) => {
  return useQuery(GET_MY_RECORDS, {
    variables,
    errorPolicy: 'ignore', // エラーを無視して処理を続行
  })
}

// export const useRecordsByDate = (date: string) => {
//   return useQuery(GET_RECORDS_BY_DATE, {
//     variables: { date },
//     errorPolicy: 'all',
//   })
// }

export const useCreateRecord = () => {
  return useMutation(CREATE_RECORD, {
    refetchQueries: [
      { query: GET_MY_RECORDS },
      { query: GET_MY_BEST_TIMES },
      { query: GET_CALENDAR_DATA }
    ],
  })
}

export const useUpdateRecord = () => {
  return useMutation(UPDATE_RECORD, {
    refetchQueries: [
      { query: GET_MY_RECORDS },
      { query: GET_MY_BEST_TIMES },
      { query: GET_CALENDAR_DATA }
    ],
  })
}

export const useDeleteRecord = () => {
  return useMutation(DELETE_RECORD, {
    refetchQueries: [
      { query: GET_MY_RECORDS },
      { query: GET_MY_BEST_TIMES },
      { query: GET_CALENDAR_DATA }
    ],
  })
}

// スプリットタイム関連フック
export const useCreateSplitTime = () => {
  return useMutation(CREATE_SPLIT_TIME, {
    refetchQueries: [{ query: GET_MY_RECORDS }],
  })
}

export const useUpdateSplitTime = () => {
  return useMutation(UPDATE_SPLIT_TIME, {
    refetchQueries: [{ query: GET_MY_RECORDS }],
  })
}

export const useDeleteSplitTime = () => {
  return useMutation(DELETE_SPLIT_TIME, {
    refetchQueries: [{ query: GET_MY_RECORDS }],
  })
}

// ベストタイム関連フック（現在は未実装）
// TODO: ベストタイム機能が実装されたら有効化
// export const useMyBestTimes = (poolType?: 'SHORT_COURSE' | 'LONG_COURSE') => {
//   return useQuery(GET_MY_BEST_TIMES, {
//     variables: { poolType },
//     errorPolicy: 'all',
//   })
// }

// 個人目標関連フック（現在は未実装）
// TODO: 個人目標機能が実装されたら有効化
// export const useMyPersonalGoals = () => {
//   return useQuery(GET_MY_PERSONAL_GOALS, {
//     errorPolicy: 'all',
//   })
// }

// export const useCreatePersonalGoal = () => {
//   return useMutation(CREATE_PERSONAL_GOAL, {
//     refetchQueries: [{ query: GET_MY_PERSONAL_GOALS }],
//   })
// }

// export const useUpdatePersonalGoal = () => {
//   return useMutation(UPDATE_PERSONAL_GOAL, {
//     refetchQueries: [{ query: GET_MY_PERSONAL_GOALS }],
//   })
// }

// export const useDeletePersonalGoal = () => {
//   return useMutation(DELETE_PERSONAL_GOAL, {
//     refetchQueries: [{ query: GET_MY_PERSONAL_GOALS }],
//   })
// }

// 目標進捗関連フック（現在は未実装）
// TODO: 目標進捗機能が実装されたら有効化
// export const useCreateGoalProgress = () => {
//   return useMutation(CREATE_GOAL_PROGRESS, {
//     refetchQueries: [{ query: GET_MY_PERSONAL_GOALS }],
//   })
// }

// export const useUpdateGoalProgress = () => {
//   return useMutation(UPDATE_GOAL_PROGRESS, {
//     refetchQueries: [{ query: GET_MY_PERSONAL_GOALS }],
//   })
// }

// export const useDeleteGoalProgress = () => {
//   return useMutation(DELETE_GOAL_PROGRESS, {
//     refetchQueries: [{ query: GET_MY_PERSONAL_GOALS }],
//   })
// }

// カレンダー関連フック
export const useCalendarData = (year: number, month: number) => {
  return useQuery(GET_CALENDAR_DATA, {
    variables: { year, month },
    errorPolicy: 'all',
  })
}

// Apollo Client直接アクセス用フック
export const useApollo = () => {
  return useApolloClient()
}
