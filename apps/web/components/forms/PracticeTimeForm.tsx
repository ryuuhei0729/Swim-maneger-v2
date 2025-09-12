'use client'

import React, { useState, useEffect } from 'react'
import { Button, Input } from '@/components/ui'
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { 
  useCreatePracticeTime, 
  useUpdatePracticeTime,
  useDeletePracticeTime 
} from '@/hooks/useGraphQL'

interface PracticeTime {
  id?: string
  repNumber: number
  setNumber: number
  time: number
}

interface PracticeTimeFormProps {
  isOpen: boolean
  onClose: () => void
  practiceLogId: string
  repCount: number
  setCount: number
  existingTimes?: PracticeTime[]
  onTimesUpdated?: (times: PracticeTime[]) => void
}

export default function PracticeTimeForm({
  isOpen,
  onClose,
  practiceLogId,
  repCount,
  setCount,
  existingTimes = [],
  onTimesUpdated
}: PracticeTimeFormProps) {
  const [times, setTimes] = useState<PracticeTime[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // GraphQLフック
  const [createPracticeTime] = useCreatePracticeTime()
  const [updatePracticeTime] = useUpdatePracticeTime()
  const [deletePracticeTime] = useDeletePracticeTime()

  // 既存のタイムデータを初期化
  useEffect(() => {
    if (existingTimes.length > 0) {
      setTimes(existingTimes)
    } else {
      // 新しいタイム記録を初期化
      const initialTimes: PracticeTime[] = []
      for (let set = 1; set <= setCount; set++) {
        for (let rep = 1; rep <= repCount; rep++) {
          initialTimes.push({
            repNumber: rep,
            setNumber: set,
            time: 0
          })
        }
      }
      setTimes(initialTimes)
    }
  }, [existingTimes, repCount, setCount])

  if (!isOpen) return null

  const handleTimeChange = (index: number, value: string) => {
    const newTimes = [...times]
    newTimes[index].time = parseFloat(value) || 0
    setTimes(newTimes)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 既存のタイムを並列削除
      const deletePromises = existingTimes
        .filter(time => time.id)
        .map(time => 
          deletePracticeTime({
            variables: { id: time.id! }
          })
        )

      // 新しいタイムを並列作成
      const createPromises = times
        .filter(time => time.time > 0)
        .map(time =>
          createPracticeTime({
            variables: {
              input: {
                practiceLogId,
                repNumber: time.repNumber,
                setNumber: time.setNumber,
                time: time.time
              }
            }
          })
        )

      // 削除と作成を並列実行
      await Promise.all([...deletePromises, ...createPromises])

      if (onTimesUpdated) {
        onTimesUpdated(times.filter(t => t.time > 0))
      }

      onClose()
    } catch (error) {
      console.error('タイム記録の保存に失敗しました:', error)
      alert('タイム記録の保存に失敗しました。もう一度お試しください。')
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (time: number) => {
    if (time === 0) return ''
    const minutes = Math.floor(time / 60)
    const seconds = (time % 60).toFixed(2)
    return minutes > 0 ? `${minutes}:${seconds.padStart(5, '0')}` : seconds
  }

  const parseTime = (timeStr: string) => {
    if (!timeStr) return 0
    if (timeStr.includes(':')) {
      const [minutes, seconds] = timeStr.split(':')
      return parseInt(minutes) * 60 + parseFloat(seconds)
    }
    return parseFloat(timeStr)
  }

  const handleTimeInputChange = (index: number, value: string) => {
    const time = parseTime(value)
    handleTimeChange(index, time.toString())
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* ヘッダー */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              タイム記録
            </h2>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* フォーム */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* セット別タイム記録 */}
              {Array.from({ length: setCount }, (_, setIndex) => (
                <div key={setIndex} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    セット {setIndex + 1}
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: repCount }, (_, repIndex) => {
                      const timeIndex = setIndex * repCount + repIndex
                      const time = times[timeIndex]
                      
                      return (
                        <div key={repIndex} className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            {repIndex + 1}本目
                          </label>
                          <Input
                            type="text"
                            placeholder="0.00"
                            value={formatTime(time?.time || 0)}
                            onChange={(e) => handleTimeInputChange(timeIndex, e.target.value)}
                            className="text-center"
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* 統計情報 */}
              {times.some(t => t.time > 0) && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">統計</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">最速:</span>
                      <span className="ml-2 font-medium">
                        {formatTime(Math.min(...times.filter(t => t.time > 0).map(t => t.time)))}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">最遅:</span>
                      <span className="ml-2 font-medium">
                        {formatTime(Math.max(...times.filter(t => t.time > 0).map(t => t.time)))}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">平均:</span>
                      <span className="ml-2 font-medium">
                        {formatTime(
                          times.filter(t => t.time > 0).reduce((sum, t) => sum + t.time, 0) / 
                          times.filter(t => t.time > 0).length
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">記録数:</span>
                      <span className="ml-2 font-medium">
                        {times.filter(t => t.time > 0).length}本
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ボタン */}
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? '保存中...' : '保存'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
