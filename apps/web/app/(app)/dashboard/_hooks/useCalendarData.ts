import { useQuery } from '@apollo/client/react'
import { endOfMonth, format, startOfMonth } from 'date-fns'
import { useMemo } from 'react'
import { useAuth } from '../../../../contexts'
import { GET_CALENDAR_ENTRIES, GET_MONTHLY_SUMMARY } from '../../../../graphql/queries'

interface CalendarEntry {
  id: string
  entry_type: 'practice' | 'record'
  entry_date: string
  title: string
  location?: string
  time_result?: number
  pool_type?: number
}

interface MonthlySummary {
  practiceCount: number
  recordCount: number
  totalDistance?: number
  averageTime?: number
}

export function useCalendarData(currentDate: Date, userId?: string) {
  const { profile } = useAuth()
  const targetUserId = userId || profile?.id

  // 月の開始日と終了日を計算
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const startDate = format(monthStart, 'yyyy-MM-dd')
  const endDate = format(monthEnd, 'yyyy-MM-dd')

  // 一時的にGraphQLを無効化してモックデータを使用（CORSエラーのため）
  const USE_MOCK_DATA = true

  // カレンダーエントリーを取得
  const { data: calendarData, loading: calendarLoading, error: calendarError, refetch } = useQuery(
    GET_CALENDAR_ENTRIES,
    {
      variables: {
        startDate,
        endDate,
        userId: targetUserId
      },
      skip: !targetUserId || USE_MOCK_DATA,
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all'
    }
  )

  // 月間サマリーを取得
  const { data: summaryData, loading: summaryLoading, error: summaryError } = useQuery(
    GET_MONTHLY_SUMMARY,
    {
      variables: {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
        userId: targetUserId
      },
      skip: !targetUserId || USE_MOCK_DATA,
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
      // onError: (error) => {
      //   console.error('Monthly summary fetch error:', error)
      //   console.error('GraphQL errors:', error.graphQLErrors)
      //   console.error('Network error:', error.networkError)
      // }
    }
  )

  // データを統合してカレンダー表示用に変換
  const calendarEntries: CalendarEntry[] = useMemo(() => {
    // モックデータを使用する場合
    if (USE_MOCK_DATA) {
      const mockEntries: CalendarEntry[] = []
      
      // 今月の日付でいくつかのモックデータを生成
      const today = new Date()
      const currentMonth = currentDate.getMonth()
      const currentYear = currentDate.getFullYear()
      
      // 今月の5日に練習記録
      if (currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
        mockEntries.push({
          id: 'mock-practice-1',
          entry_type: 'practice',
          entry_date: format(new Date(currentYear, currentMonth, 5), 'yyyy-MM-dd'),
          title: '練習: AN2, EN3',
          location: '市営プール'
        })
        
        // 今月の15日に大会記録
        mockEntries.push({
          id: 'mock-record-1',
          entry_type: 'record',
          entry_date: format(new Date(currentYear, currentMonth, 15), 'yyyy-MM-dd'),
          title: '50m自由形: 26.45s',
          location: '県立水泳場',
          time_result: 2645,
          pool_type: 1
        })
        
        // 今月の20日に練習記録
        mockEntries.push({
          id: 'mock-practice-2',
          entry_type: 'practice',
          entry_date: format(new Date(currentYear, currentMonth, 20), 'yyyy-MM-dd'),
          title: '練習: 長水路',
          location: '総合体育館プール'
        })
        
        // 今月の25日に大会記録
        mockEntries.push({
          id: 'mock-record-2',
          entry_type: 'record',
          entry_date: format(new Date(currentYear, currentMonth, 25), 'yyyy-MM-dd'),
          title: '100m背泳ぎ: 58.32s',
          location: '国際水泳場',
          time_result: 5832,
          pool_type: 1
        })
      }
      
      return mockEntries
    }

    // GraphQLデータを使用する場合
    if (!calendarData) return []

    const entries: CalendarEntry[] = []
    const data = calendarData as any

    // 練習記録を追加
    if (data.practiceLogs) {
      data.practiceLogs.forEach((log: any) => {
        const title = log.tags?.length > 0 
          ? `練習: ${log.tags.slice(0, 2).join(', ')}`
          : `練習: ${log.location || '場所未記載'}`
        
        entries.push({
          id: log.id,
          entry_type: 'practice',
          entry_date: log.practice_date,
          title,
          location: log.location
        })
      })
    }

    // 大会記録を追加
    if (data.records) {
      data.records.forEach((record: any) => {
        const timeString = record.time ? `${(record.time / 100).toFixed(2)}s` : ''
        const styleInfo = record.style ? `${record.style.name_jp}` : '記録'
        const title = `${styleInfo}: ${timeString}`
        
        entries.push({
          id: record.id,
          entry_type: 'record',
          entry_date: record.record_date,
          title,
          location: record.location,
          time_result: record.time,
          pool_type: record.pool_type
        })
      })
    }

    return entries
  }, [calendarData, currentDate, USE_MOCK_DATA])

  // 月間サマリー
  const monthlySummary: MonthlySummary = useMemo(() => {
    // モックデータを使用する場合
    if (USE_MOCK_DATA) {
      const practiceCount = calendarEntries.filter(e => e.entry_type === 'practice').length
      const recordCount = calendarEntries.filter(e => e.entry_type === 'record').length
      
      return {
        practiceCount,
        recordCount,
        totalDistance: 2500, // 2.5km
        averageTime: 2700 // 27.00s
      }
    }

    // GraphQLデータを使用する場合
    const data = summaryData as any
    if (data?.monthlySummary) {
      return data.monthlySummary
    }

    // フォールバック: エントリーから計算
    const practiceCount = calendarEntries.filter(e => e.entry_type === 'practice').length
    const recordCount = calendarEntries.filter(e => e.entry_type === 'record').length

    return {
      practiceCount,
      recordCount
    }
  }, [summaryData, calendarEntries, USE_MOCK_DATA])

  return {
    calendarEntries,
    monthlySummary,
    loading: USE_MOCK_DATA ? false : (calendarLoading || summaryLoading),
    error: USE_MOCK_DATA ? null : (calendarError || summaryError),
    refetch: () => {
      if (!USE_MOCK_DATA) {
        refetch()
      }
    }
  }
}

export default useCalendarData
