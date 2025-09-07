'use client'

import React, { useState, useMemo } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths, getDay } from 'date-fns'
import { ja } from 'date-fns/locale'
import { useCalendarData } from '../_hooks/useCalendarData'
import { LoadingSpinner } from '@/components/ui'
import DayDetailModal from './DayDetailModal'

interface CalendarEntry {
  id: string
  entry_type: 'practice' | 'record'
  entry_date: string
  title: string
  location?: string
  time_result?: number
  pool_type?: number
}

interface CalendarProps {
  entries?: CalendarEntry[]
  onDateClick?: (date: Date) => void
  onAddEntry?: (date: Date, type: 'practice' | 'record') => void
  onEditEntry?: (entry: CalendarEntry) => void
  onDeleteEntry?: (entryId: string) => void
  isLoading?: boolean
  userId?: string // 特定のユーザーのカレンダーを表示する場合
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

export default function Calendar({ 
  entries: propEntries, 
  onDateClick, 
  onAddEntry,
  onEditEntry,
  onDeleteEntry,
  isLoading: propLoading = false,
  userId
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showMonthSelector, setShowMonthSelector] = useState(false)
  const [showDayDetail, setShowDayDetail] = useState(false)

  // GraphQLデータを取得
  const { calendarEntries, monthlySummary, loading: dataLoading, error, refetch } = useCalendarData(currentDate, userId)
  
  // プロップスのentriesが指定されている場合はそれを優先、そうでなければGraphQLデータを使用
  const entries = propEntries && propEntries.length > 0 ? propEntries : calendarEntries
  const isLoading = propLoading || dataLoading

  // 月の日付を取得
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = new Date(monthStart)
  calendarStart.setDate(calendarStart.getDate() - getDay(monthStart))
  const calendarEnd = new Date(monthEnd)
  calendarEnd.setDate(calendarEnd.getDate() + (6 - getDay(monthEnd)))

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  })

  // 日付別のエントリーをマッピング
  const entriesByDate = useMemo(() => {
    const map = new Map<string, CalendarEntry[]>()
    entries.forEach(entry => {
      const dateKey = entry.entry_date
      if (!map.has(dateKey)) {
        map.set(dateKey, [])
      }
      map.get(dateKey)!.push(entry)
    })
    return map
  }, [entries])

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
    // データを再取得
    setTimeout(() => refetch(), 100)
  }

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
    // データを再取得
    setTimeout(() => refetch(), 100)
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setShowDayDetail(true)
    onDateClick?.(date)
  }

  const handleAddClick = (date: Date) => {
    setSelectedDate(date)
    setShowAddModal(true)
  }

  const handleAddEntry = (type: 'practice' | 'record') => {
    if (selectedDate && onAddEntry) {
      onAddEntry(selectedDate, type)
    }
    setShowAddModal(false)
    setSelectedDate(null)
  }

  const getDateEntries = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd')
    return entriesByDate.get(dateKey) || []
  }

  const getEntryIcon = (type: 'practice' | 'record') => {
    return type === 'practice' ? '💪' : '🏊‍♂️'
  }

  const getEntryColor = (type: 'practice' | 'record') => {
    return type === 'practice' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
  }

  const handleMonthYearSelect = (year: number, month: number) => {
    const newDate = new Date(year, month, 1)
    setCurrentDate(newDate)
    setShowMonthSelector(false)
    // データを再取得
    setTimeout(() => refetch(), 100)
  }

  // エラー表示
  if (error && !isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">データの読み込みに失敗しました</h3>
            <p className="text-gray-600 mb-4">カレンダーデータを取得できませんでした。</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              再試行
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* ヘッダー */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold text-gray-900">
              練習・記録カレンダー
            </h2>
            {isLoading && <LoadingSpinner size="sm" />}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <button
                onClick={handlePrevMonth}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 disabled:opacity-50"
                disabled={isLoading}
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowMonthSelector(true)}
                className="text-lg font-medium text-gray-900 min-w-[120px] text-center hover:bg-gray-100 rounded-md px-2 py-1 transition-colors"
                disabled={isLoading}
              >
                {format(currentDate, 'yyyy年M月', { locale: ja })}
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 disabled:opacity-50"
                disabled={isLoading}
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* カレンダー本体 */}
      <div className="p-6">
        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* 日付グリッド */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day) => {
            const dayEntries = getDateEntries(day)
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isSelected = selectedDate && isSameDay(day, selectedDate)
            const isTodayDate = isToday(day)

            return (
              <div
                key={day.toISOString()}
                className={`
                  min-h-[100px] p-2 border border-gray-200 rounded-lg cursor-pointer transition-colors duration-200
                  ${isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 text-gray-400'}
                  ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                  ${isTodayDate ? 'ring-1 ring-blue-300' : ''}
                `}
                onClick={() => handleDateClick(day)}
              >
                {/* 日付 */}
                <div className="flex items-center justify-between mb-1">
                  <span className={`
                    text-sm font-medium
                    ${isTodayDate ? 'text-blue-600 font-bold' : ''}
                    ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-900'}
                  `}>
                    {format(day, 'd')}
                  </span>
                  {isCurrentMonth && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAddClick(day)
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                      title="記録を追加"
                    >
                      <PlusIcon className="h-3 w-3" />
                    </button>
                  )}
                </div>

                {/* エントリー表示 */}
                <div className="space-y-1">
                  {dayEntries.slice(0, 2).map((entry) => (
                    <div
                      key={entry.id}
                      className={`
                        text-xs px-2 py-1 rounded-md truncate
                        ${getEntryColor(entry.entry_type)}
                      `}
                      title={entry.title}
                    >
                      <span className="mr-1">{getEntryIcon(entry.entry_type)}</span>
                      {entry.title}
                    </div>
                  ))}
                  {dayEntries.length > 2 && (
                    <div className="text-xs text-gray-500 px-2">
                      +{dayEntries.length - 2}件
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 今月のサマリー */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {monthlySummary?.practiceCount || 
                entries.filter(e => e.entry_type === 'practice' && 
                format(new Date(e.entry_date), 'yyyy-MM') === format(currentDate, 'yyyy-MM')).length}
            </div>
            <div className="text-sm text-gray-600">練習回数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {monthlySummary?.recordCount || 
                entries.filter(e => e.entry_type === 'record' && 
                format(new Date(e.entry_date), 'yyyy-MM') === format(currentDate, 'yyyy-MM')).length}
            </div>
            <div className="text-sm text-gray-600">大会回数</div>
          </div>
        </div>
        
        {/* 追加の統計情報 */}
        {monthlySummary?.totalDistance && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-gray-900">
                  {(monthlySummary.totalDistance / 1000).toFixed(1)}km
                </div>
                <div className="text-gray-600">総距離</div>
              </div>
              {monthlySummary.averageTime && (
                <div className="text-center">
                  <div className="font-semibold text-gray-900">
                    {(monthlySummary.averageTime / 100).toFixed(2)}s
                  </div>
                  <div className="text-gray-600">平均タイム</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 年月選択モーダル */}
      {showMonthSelector && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowMonthSelector(false)}></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      年月を選択
                    </h3>
                    <div className="space-y-4">
                      {/* 年選択 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">年</label>
                        <select
                          value={currentDate.getFullYear()}
                          onChange={(e) => handleMonthYearSelect(parseInt(e.target.value), currentDate.getMonth())}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(year => (
                            <option key={year} value={year}>{year}年</option>
                          ))}
                        </select>
                      </div>
                      
                      {/* 月選択 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">月</label>
                        <div className="grid grid-cols-3 gap-2">
                          {Array.from({ length: 12 }, (_, i) => i).map(month => (
                            <button
                              key={month}
                              onClick={() => handleMonthYearSelect(currentDate.getFullYear(), month)}
                              className={`
                                px-3 py-2 text-sm rounded-md border transition-colors
                                ${currentDate.getMonth() === month 
                                  ? 'bg-blue-600 text-white border-blue-600' 
                                  : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                                }
                              `}
                            >
                              {month + 1}月
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowMonthSelector(false)}
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 記録追加モーダル */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowAddModal(false)}></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      記録を追加 - {selectedDate && format(selectedDate, 'M月d日', { locale: ja })}
                    </h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => handleAddEntry('practice')}
                        className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-green-50 hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <span className="mr-2">💪</span>
                        練習記録を追加
                      </button>
                      <button
                        onClick={() => handleAddEntry('record')}
                        className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-blue-50 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <span className="mr-2">🏊‍♂️</span>
                        大会記録を追加
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowAddModal(false)}
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 日付詳細モーダル */}
      {showDayDetail && selectedDate && (
        <DayDetailModal
          isOpen={showDayDetail}
          onClose={() => {
            setShowDayDetail(false)
            setSelectedDate(null)
          }}
          date={selectedDate}
          entries={getDateEntries(selectedDate)}
          onEditEntry={onEditEntry}
          onDeleteEntry={(entryId) => {
            onDeleteEntry?.(entryId)
            // データを再取得
            refetch()
          }}
          onAddEntry={(date, type) => {
            setShowDayDetail(false)
            setSelectedDate(date)
            if (type === 'practice') {
              setShowAddModal(true)
            } else {
              onAddEntry?.(date, type)
            }
          }}
        />
      )}
    </div>
  )
}
