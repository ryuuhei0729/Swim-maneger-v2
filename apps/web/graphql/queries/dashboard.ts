import { gql } from '@apollo/client'

// カレンダー関連クエリ
export const GET_CALENDAR_DATA = gql`
  query GetCalendarData($year: Int!, $month: Int!) {
    calendarData(year: $year, month: $month) {
      year
      month
      days {
        date
        hasPractice
        hasCompetition
        practiceCount
        recordCount
      }
      summary {
        totalPractices
        totalCompetitions
        totalRecords
      }
    }
  }
`

export const GET_MONTHLY_SUMMARY = gql`
  query GetMonthlySummary($year: Int!, $month: Int!, $userId: ID) {
    monthlySummary(year: $year, month: $month, userId: $userId) {
      practiceCount
      recordCount
      totalDistance
      averageTime
    }
  }
`

