import { useQuery } from '@apollo/client/react'
import { endOfMonth, format, startOfMonth } from 'date-fns'
import { useEffect, useMemo } from 'react'
import { useAuth } from '../../../../contexts'
import { GET_CALENDAR_DATA, GET_MY_PRACTICE_LOGS, GET_MY_RECORDS } from '../../../../graphql/queries'

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

  // 実際のデータベースを使用（デバッグログ付き）
  const USE_MOCK_DATA = false

  // カレンダーデータを取得（新しい個人利用機能）
  const { data: calendarData, loading: calendarLoading, error: calendarError, refetch } = useQuery(
    GET_CALENDAR_DATA,
    {
      variables: {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1
      },
      skip: USE_MOCK_DATA,
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'ignore' // エラーを無視して処理を続行
    }
  )

  // 練習記録を取得
  const { data: practiceLogsData, loading: practiceLoading, error: practiceError } = useQuery(
    GET_MY_PRACTICE_LOGS,
    {
      variables: {
        startDate,
        endDate
      },
      skip: USE_MOCK_DATA,
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'ignore' // エラーを無視して処理を続行
    }
  )

  // 記録データを取得
  const { data: recordsData, loading: recordsLoading, error: recordsError } = useQuery(
    GET_MY_RECORDS,
    {
      variables: {
        startDate,
        endDate
      },
      skip: USE_MOCK_DATA,
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'ignore' // エラーを無視して処理を続行
    }
  )

  // エラーログ出力
  useEffect(() => {
    if (calendarError) {
      console.error('Calendar data fetch error:', calendarError)
      if ((calendarError as any).graphQLErrors) {
        console.error('GraphQL errors:', (calendarError as any).graphQLErrors)
      }
      if ((calendarError as any).networkError) {
        console.error('Network error:', (calendarError as any).networkError)
      }
    }
    if (practiceError) {
      console.error('Practice logs fetch error:', practiceError)
    }
    if (recordsError) {
      console.error('Records fetch error:', recordsError)
    }
  }, [calendarError, practiceError, recordsError])

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
    const entries: CalendarEntry[] = []

    // 練習記録を追加
    if (practiceLogsData && (practiceLogsData as any).myPracticeLogs) {
      (practiceLogsData as any).myPracticeLogs.forEach((log: any) => {
        const tagNames = log.tags?.map((tag: any) => tag.name) || []
        const title = tagNames.length > 0 
          ? `練習: ${tagNames.slice(0, 2).join(', ')}`
          : `練習: ${log.style || '場所未記載'}`
        
        entries.push({
          id: log.id,
          entry_type: 'practice',
          entry_date: log.practiceDate,
          title,
          location: log.location
        })
      })
    }

    // 大会記録を追加
    if (recordsData && (recordsData as any).myRecords) {
      (recordsData as any).myRecords.forEach((record: any) => {
        const timeString = record.time ? `${record.time.toFixed(2)}s` : ''
        const styleInfo = record.style ? `${record.style.nameJp}` : '記録'
        const title = `${styleInfo}: ${timeString}`
        
        entries.push({
          id: record.id,
          entry_type: 'record',
          entry_date: record.recordDate,
          title,
          location: record.location,
          time_result: Math.round(record.time * 100), // 秒を百分の一秒に変換
          pool_type: record.poolType === 'SHORT_COURSE' ? 0 : 1
        })
      })
    }

    return entries
  }, [practiceLogsData, recordsData, currentDate, USE_MOCK_DATA])

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
    if (calendarData && (calendarData as any).calendarData?.summary) {
      const summary = (calendarData as any).calendarData.summary
      return {
        practiceCount: summary.totalPractices || 0,
        recordCount: summary.totalRecords || 0,
        totalDistance: undefined,
        averageTime: undefined
      }
    }

    // フォールバック: エントリーから計算
    const practiceCount = calendarEntries.filter(e => e.entry_type === 'practice').length
    const recordCount = calendarEntries.filter(e => e.entry_type === 'record').length

    return {
      practiceCount,
      recordCount
    }
  }, [calendarData, calendarEntries, USE_MOCK_DATA])

  return {
    calendarEntries,
    monthlySummary,
    loading: USE_MOCK_DATA ? false : (calendarLoading || practiceLoading || recordsLoading),
    error: USE_MOCK_DATA ? null : (calendarError || practiceError || recordsError),
    refetch: () => {
      if (!USE_MOCK_DATA) {
        refetch()
      }
    }
  }
}

export default useCalendarData
