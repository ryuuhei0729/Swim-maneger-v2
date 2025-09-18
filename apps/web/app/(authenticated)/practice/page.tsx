'use client'

import React, { useState } from 'react'
import { PlusIcon, CalendarDaysIcon, ChartBarIcon, ClockIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui'
import PracticeLogForm from '@/components/forms/PracticeLogFormNew'
import PracticeTimeForm from '@/components/forms/PracticeTimeForm'
import { useMyPracticeLogs, useDeletePracticeLog } from '@/hooks/useGraphQL'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

export default function PracticePage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isTimeFormOpen, setIsTimeFormOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [editingLog, setEditingLog] = useState<any>(null)
  const [selectedLogForTime, setSelectedLogForTime] = useState<any>(null)

  // 今月の練習記録を取得
  const currentDate = new Date()
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  
  const { data: practiceLogsData, loading, error, refetch } = useMyPracticeLogs({
    startDate: format(startOfMonth, 'yyyy-MM-dd'),
    endDate: format(endOfMonth, 'yyyy-MM-dd')
  })

  const [deletePracticeLog] = useDeletePracticeLog()

  const practiceLogs = (practiceLogsData as any)?.myPracticeLogs || []

  const handleCreateLog = () => {
    setEditingLog(null)
    setSelectedDate(null)
    setIsFormOpen(true)
  }

  const handleEditLog = (log: any) => {
    setEditingLog(log)
    setIsFormOpen(true)
  }

  const handleTimeLog = (log: any) => {
    setSelectedLogForTime(log)
    setIsTimeFormOpen(true)
  }

  const handleFormSubmit = async (formData: any) => {
    // フォームの送信処理はPracticeLogForm内で処理される
    setIsFormOpen(false)
    setEditingLog(null)
    setSelectedDate(null)
    // データを再取得
    refetch()
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingLog(null)
    setSelectedDate(null)
  }

  const handleTimeFormClose = () => {
    setIsTimeFormOpen(false)
    setSelectedLogForTime(null)
    // データを再取得
    refetch()
  }

  const handleDeleteLog = async (logId: string) => {
    if (confirm('この練習記録を削除しますか？')) {
      try {
        await deletePracticeLog({
          variables: { id: logId }
        })
        // refetchは自動的に実行される
      } catch (error) {
        console.error('削除エラー:', error)
        alert('削除に失敗しました')
      }
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">練習記録</h1>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">練習記録</h1>
          <div className="text-red-600">
            エラーが発生しました: {error.message}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              練習記録
            </h1>
            <p className="text-gray-600">
              日々の練習内容を記録・分析します。
            </p>
          </div>
          <Button
            onClick={handleCreateLog}
            className="flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>新しい練習記録</span>
          </Button>
        </div>
      </div>

      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CalendarDaysIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">今月の練習日数</p>
              <p className="text-2xl font-bold text-gray-900">
                {practiceLogs.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">総練習距離</p>
              <p className="text-2xl font-bold text-gray-900">
                {practiceLogs.reduce((total, log) => total + (log.distance * log.repCount * log.setCount), 0).toLocaleString()}m
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">平均サークル</p>
              <p className="text-2xl font-bold text-gray-900">
                {practiceLogs.length > 0 
                  ? (practiceLogs.reduce((total, log) => total + log.circle, 0) / practiceLogs.length).toFixed(1)
                  : 0
                }秒
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 練習記録一覧（表形式） */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            練習記録一覧
          </h2>
        </div>
        
        {practiceLogs.length === 0 ? (
          <div className="p-12 text-center">
            <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">練習記録がありません</h3>
            <p className="mt-1 text-sm text-gray-500">
              最初の練習記録を作成しましょう。
            </p>
            <div className="mt-6">
              <Button onClick={handleCreateLog}>
                練習記録を作成
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    日付
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    場所
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    種目
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    距離・本数・セット
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    サークル
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    タグ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    タイム
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    メモ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {practiceLogs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.practice?.date ? format(new Date(log.practice.date), 'MM/dd', { locale: ja }) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.practice?.place || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.style}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.distance}m × {log.repCount}本 × {log.setCount}セット
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.circle ? `${log.circle}秒` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.tags && log.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {log.tags.map((tag: any) => (
                            <span
                              key={tag.id}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                              style={{ 
                                backgroundColor: tag.color + '20',
                                color: tag.color
                              }}
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.times && log.times.length > 0 ? (
                        <div className="text-sm">
                          {log.times.map((time: any, index: number) => (
                            <div key={time.id} className="text-gray-900">
                              {time.time}秒
                              {index < log.times.length - 1 && <br />}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {log.note || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTimeLog(log)}
                          className="flex items-center space-x-1"
                        >
                          <ClockIcon className="h-4 w-4" />
                          <span>タイム</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditLog(log)}
                          className="flex items-center space-x-1"
                        >
                          <PencilIcon className="h-4 w-4" />
                          <span>編集</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteLog(log.id)}
                          className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="h-4 w-4" />
                          <span>削除</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* フォームモーダル */}
      <PracticeLogForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        initialDate={selectedDate}
        editData={editingLog}
      />

      {/* タイム記録フォームモーダル */}
      {selectedLogForTime && (
        <PracticeTimeForm
          isOpen={isTimeFormOpen}
          onClose={handleTimeFormClose}
          practiceLogId={selectedLogForTime.id}
          repCount={selectedLogForTime.repCount}
          setCount={selectedLogForTime.setCount}
          existingTimes={selectedLogForTime.times}
        />
      )}
    </div>
  )
}
