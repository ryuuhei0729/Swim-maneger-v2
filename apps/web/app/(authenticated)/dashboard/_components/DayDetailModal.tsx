'use client'

import React, { useState } from 'react'
import { XMarkIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { formatTime } from '@/utils/formatters'

interface CalendarEntry {
  id: string
  entry_type: 'practice' | 'record'
  entry_date: string
  title: string
  location?: string
  time_result?: number
  pool_type?: number
  tags?: string[]
  note?: string
  competition_name?: string
  style?: {
    id: string
    name_jp: string
    distance: number
  }
}

interface DayDetailModalProps {
  isOpen: boolean
  onClose: () => void
  date: Date
  entries: CalendarEntry[]
  onEditEntry?: (entry: CalendarEntry) => void
  onDeleteEntry?: (entryId: string, entryType: 'practice' | 'record') => void
  onAddEntry?: (date: Date, type: 'practice' | 'record') => void
}

export default function DayDetailModal({
  isOpen,
  onClose,
  date,
  entries,
  onEditEntry,
  onDeleteEntry,
  onAddEntry
}: DayDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{id: string, type: 'practice' | 'record'} | null>(null)

  if (!isOpen) return null

  const practiceEntries = entries.filter(e => e.entry_type === 'practice')
  const recordEntries = entries.filter(e => e.entry_type === 'record')

  const handleDeleteConfirm = async () => {
    if (showDeleteConfirm) {
      await onDeleteEntry?.(showDeleteConfirm.id, showDeleteConfirm.type)
      setShowDeleteConfirm(null)
      
      // 削除後、残りのエントリーがない場合はモーダルを閉じる
      const remainingEntries = entries.filter(e => e.id !== showDeleteConfirm.id)
      if (remainingEntries.length === 0) {
        onClose()
      }
    }
  }


  const getPoolTypeText = (poolType: number) => {
    return poolType === 1 ? '長水路(50m)' : '短水路(25m)'
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* ヘッダー */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {format(date, 'M月d日（E）', { locale: ja })}の記録
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* エントリーがない場合 */}
            {entries.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">この日の記録はありません</p>
                <div className="space-y-2">
                  <button
                    onClick={() => onAddEntry?.(date, 'practice')}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-green-50 hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <span className="mr-2">💪</span>
                    練習記録を追加
                  </button>
                  <button
                    onClick={() => onAddEntry?.(date, 'record')}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-blue-50 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span className="mr-2">🏊‍♂️</span>
                    大会記録を追加
                  </button>
                </div>
              </div>
            )}

            {/* 練習記録セクション */}
            {practiceEntries.length > 0 && (
              <div className="mb-6">
                <h4 className="text-md font-semibold text-green-700 mb-3 flex items-center">
                  <span className="mr-2">💪</span>
                  練習記録
                </h4>
                <div className="space-y-3">
                  {practiceEntries.map((entry) => (
                    <div key={entry.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 mb-2">{entry.title}</h5>
                          {entry.location && (
                            <p className="text-sm text-gray-600 mb-1">
                              📍 {entry.location}
                            </p>
                          )}
                          {entry.tags && entry.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {entry.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-block px-2 py-1 text-xs bg-green-200 text-green-800 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          {entry.note && (
                            <p className="text-sm text-gray-600 mt-2">
                              💭 {entry.note}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => {
                              console.log('DayDetailModal: Practice edit button clicked for entry:', entry)
                              console.log('DayDetailModal: onEditEntry function:', onEditEntry)
                              onEditEntry?.(entry)
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50"
                            title="編集"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm({id: entry.id, type: entry.entry_type})}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50"
                            title="削除"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 大会記録セクション */}
            {recordEntries.length > 0 && (
              <div className="mb-6">
                <h4 className="text-md font-semibold text-blue-700 mb-3 flex items-center">
                  <span className="mr-2">🏊‍♂️</span>
                  大会記録
                </h4>
                <div className="space-y-3">
                  {recordEntries.map((entry) => (
                    <div key={entry.id} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 mb-2">{entry.title}</h5>
                          {entry.competition_name && (
                            <p className="text-sm text-gray-600 mb-1">
                              🏆 {entry.competition_name}
                            </p>
                          )}
                          {entry.location && (
                            <p className="text-sm text-gray-600 mb-1">
                              📍 {entry.location}
                            </p>
                          )}
                          {entry.style && (
                            <p className="text-sm text-gray-600 mb-1">
                              🏊 {entry.style.name_jp}
                            </p>
                          )}
                          {entry.time_result && (
                            <p className="text-lg font-semibold text-blue-700 mb-1">
                              ⏱️ {formatTime(entry.time_result / 100)}
                            </p>
                          )}
                          {entry.pool_type != null && (
                            <p className="text-sm text-gray-600 mb-1">
                              🏊‍♀️ {getPoolTypeText(entry.pool_type)}
                            </p>
                          )}
                          {entry.note && (
                            <p className="text-sm text-gray-600 mt-2">
                              💭 {entry.note}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => onEditEntry?.(entry)}
                            className="p-2 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50"
                            title="編集"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm({id: entry.id, type: entry.entry_type})}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50"
                            title="削除"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 記録追加ボタン（既に記録がある場合） */}
            {entries.length > 0 && (
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">記録を追加</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => onAddEntry?.(date, 'practice')}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-green-50 hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <span className="mr-2">💪</span>
                    練習記録
                  </button>
                  <button
                    onClick={() => onAddEntry?.(date, 'record')}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-blue-50 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span className="mr-2">🏊‍♂️</span>
                    大会記録
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* フッター */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              閉じる
            </button>
          </div>
        </div>
      </div>

      {/* 削除確認モーダル */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <TrashIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      記録を削除
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        この記録を削除してもよろしいですか？この操作は取り消せません。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDeleteConfirm}
                >
                  削除
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
