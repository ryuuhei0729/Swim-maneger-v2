import { useQuery } from '@apollo/client/react'
import { endOfMonth, format, startOfMonth } from 'date-fns'
import { useEffect, useMemo } from 'react'
import { useAuth } from '../../../../contexts'
import { GET_CALENDAR_DATA, GET_PRACTICES, GET_RECORDS } from '../../../../graphql/queries'
import { formatTime } from '../../../../utils/formatters'

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

  // 実際のデータベースを使用
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
      fetchPolicy: 'cache-first', // キャッシュ優先でリアルタイム更新に対応
      nextFetchPolicy: 'cache-first', // 次回以降もキャッシュ優先
      notifyOnNetworkStatusChange: true, // ネットワーク状態の変更を通知
      errorPolicy: 'ignore' // エラーを無視して処理を続行
    }
  )

  // 練習記録を取得（新しい正規化構造対応）
  const { data: practicesData, loading: practiceLoading, error: practiceError, refetch: refetchPractices } = useQuery(
    GET_PRACTICES,
    {
      variables: {
        startDate,
        endDate
      },
      skip: USE_MOCK_DATA,
      fetchPolicy: 'cache-first', // キャッシュ優先でリアルタイム更新に対応
      nextFetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: true,
      errorPolicy: 'all' // エラーも含めて全てのデータを取得
    }
  )

  // 記録データを取得
  const { data: recordsData, loading: recordsLoading, error: recordsError, refetch: refetchRecords } = useQuery(
    GET_RECORDS,
    {
      skip: USE_MOCK_DATA,
      fetchPolicy: 'cache-first', // キャッシュ優先でリアルタイム更新に対応
      nextFetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: true,
      errorPolicy: 'all' // エラーも含めて全てのデータを取得
    }
  )

  // エラーログ出力とデバッグ情報
  useEffect(() => {
    console.log('Calendar data fetch status:', {
      practicesData: !!practicesData,
      recordsData: !!recordsData,
      practiceLoading,
      recordsLoading,
      practiceError: !!practiceError,
      recordsError: !!recordsError
    })

    if (practicesData) {
      console.log('Practices data:', practicesData)
    } else if (!practiceLoading) {
      console.log('No practices data received')
    }
    
    if (recordsData) {
      console.log('Records data:', recordsData)
    } else if (!recordsLoading) {
      console.log('No records data received')
    }

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
      if ((practiceError as any).graphQLErrors) {
        console.error('Practice GraphQL errors:', (practiceError as any).graphQLErrors)
      }
      if ((practiceError as any).networkError) {
        console.error('Practice Network error:', (practiceError as any).networkError)
      }
    }
    if (recordsError) {
      console.error('Records fetch error:', recordsError)
      if ((recordsError as any).graphQLErrors) {
        console.error('Records GraphQL errors:', (recordsError as any).graphQLErrors)
      }
      if ((recordsError as any).networkError) {
        console.error('Records Network error:', (recordsError as any).networkError)
      }
    }
  }, [calendarError, practiceError, recordsError, practicesData, recordsData, practiceLoading, recordsLoading])

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

    // 練習記録を追加（新しい正規化構造：Practiceベース）
    if (practicesData && (practicesData as any).myPractices) {
      (practicesData as any).myPractices.forEach((practice: any) => {
        const practiceDate = practice.date
        const practicePlace = practice.place || 'プール'
        const practiceLogs = practice.practiceLogs || []
        
        if (practiceDate) {
          const logDate = new Date(practiceDate)
          if (logDate >= monthStart && logDate <= monthEnd) {
            // 練習メニューのスタイルを取得
            const styles = practiceLogs.map((log: any) => log.style).filter(Boolean)
            const uniqueStyles = [...new Set(styles)]
            
            const title = `練習: ${uniqueStyles.length > 0 ? uniqueStyles.join(', ') : practicePlace}`
            
            entries.push({
              id: practice.id, // Practice ID
              entry_type: 'practice',
              entry_date: practiceDate,
              title,
              location: practicePlace
            })
          }
        }
      })
    }

    // 大会記録を追加
    if (recordsData && (recordsData as any).myRecords) {
      (recordsData as any).myRecords.forEach((record: any) => {
        // 日付範囲でフィルタリング（competitionのdateを使用）
        if (record.competition && record.competition.date) {
          const recordDate = new Date(record.competition.date)
          if (recordDate >= monthStart && recordDate <= monthEnd) {
            const timeString = record.time ? formatTime(record.time) : ''
            const styleInfo = record.style ? `${record.style.nameJp}` : '記録'
            const title = `${styleInfo}: ${timeString}`
            
            const entry: any = {
              id: record.id,
              entry_type: 'record',
              entry_date: record.competition.date,
              title,
              location: record.competition.title || '大会'
            }

            // record.timeが有限数値の場合のみtime_resultを設定
            if (Number.isFinite(Number(record.time))) {
              entry.time_result = Math.round(Number(record.time) * 100) // 秒を百分の一秒に変換
            }

            // pool_typeは不明な場合は設定しない
            if (record.competition?.poolType !== undefined) {
              entry.pool_type = record.competition.poolType
            }

            entries.push(entry)
          }
        }
      })
    }

    console.log('Generated calendar entries:', entries)
    return entries
  }, [practicesData, recordsData, currentDate, USE_MOCK_DATA, monthStart, monthEnd])

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
    refetch: async () => {
      if (!USE_MOCK_DATA) {
        // すべてのクエリを並行して再実行
        await Promise.all([
          refetch(),
          refetchPractices(),
          refetchRecords()
        ])
      }
    }
  }
}

export default useCalendarData
