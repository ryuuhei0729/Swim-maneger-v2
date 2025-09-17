'use client'

import React from 'react'
import { useUpcomingEvents, useMyAttendances, useMyPracticeRecords } from '@/hooks/useGraphQL'
import { formatDate } from '@/utils'
import { 
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

export default function DashboardStats() {
  const { data: upcomingEventsData, loading: eventsLoading, error: eventsError } = useUpcomingEvents()
  const { data: attendancesData, loading: attendancesLoading } = useMyAttendances()
  const { data: practiceRecordsData, loading: practiceLoading } = useMyPracticeRecords()
  
  const upcomingEvents = (upcomingEventsData as any)?.upcomingEvents || []
  const attendances = (attendancesData as any)?.myAttendances || []
  const practiceRecords = (practiceRecordsData as any)?.myPracticeRecords || []

  const stats = [
    {
      title: '今後のイベント',
      value: upcomingEvents?.length || 0,
      icon: CalendarDaysIcon,
      color: 'bg-blue-500',
      loading: eventsLoading,
      error: eventsError
    },
    {
      title: '今月の出席',
      value: attendances?.filter((a: any) => 
        new Date(a.createdAt).getMonth() === new Date().getMonth()
      ).length || 0,
      icon: ClipboardDocumentListIcon,
      color: 'bg-green-500',
      loading: attendancesLoading
    },
    {
      title: '練習記録',
      value: practiceRecords?.length || 0,
      icon: ChartBarIcon,
      color: 'bg-purple-500',
      loading: practiceLoading
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className={`flex-shrink-0 p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              {stat.loading ? (
                <div className="animate-pulse h-8 bg-gray-200 rounded mt-1"></div>
              ) : stat.error ? (
                <div className="flex items-center mt-1">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-1" />
                  <span className="text-sm text-red-600">エラー</span>
                </div>
              ) : (
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// 今後のイベント一覧コンポーネント
export function UpcomingEventsList() {
  const { data, loading, error } = useUpcomingEvents()

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">今後のイベント</h2>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">今後のイベント</h2>
        <div className="flex items-center justify-center py-8">
          <ExclamationTriangleIcon className="h-8 w-8 text-red-500 mr-2" />
          <span className="text-red-600">データの取得に失敗しました</span>
        </div>
      </div>
    )
  }

  const events = (data as any)?.upcomingEvents || []

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">今後のイベント</h2>
      {events.length === 0 ? (
        <p className="text-gray-500 text-center py-8">今後のイベントはありません</p>
      ) : (
        <div className="space-y-4">
          {events.slice(0, 5).map((event) => (
            <div key={event.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{event.title}</h3>
                <p className="text-sm text-gray-500">
                  {formatDate(event.startTime, 'long')} {formatDate(event.startTime, 'time')}
                </p>
                {event.location && (
                  <p className="text-sm text-gray-400">📍 {event.location}</p>
                )}
              </div>
              <div className="ml-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  event.eventType === 'PRACTICE' ? 'bg-blue-100 text-blue-800' :
                  event.eventType === 'COMPETITION' ? 'bg-red-100 text-red-800' :
                  event.eventType === 'MEETING' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {event.eventType === 'PRACTICE' ? '練習' :
                   event.eventType === 'COMPETITION' ? '大会' :
                   event.eventType === 'MEETING' ? '会議' : 'その他'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
