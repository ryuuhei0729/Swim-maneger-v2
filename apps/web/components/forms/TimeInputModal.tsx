'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui'
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

interface TimeEntry {
  id: string
  setNumber: number
  repNumber: number
  time: number // 秒単位
  displayValue?: string // 表示用の値
}

interface TimeInputModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (times: TimeEntry[]) => void
  setCount: number
  repCount: number
  initialTimes?: TimeEntry[]
  menuNumber?: number // メニュー番号を追加
}

export default function TimeInputModal({
  isOpen,
  onClose,
  onSubmit,
  setCount,
  repCount,
  initialTimes = [],
  menuNumber
}: TimeInputModalProps) {
  const formatTime = (seconds: number) => {
    if (seconds === 0) return ''
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return minutes > 0 
      ? `${minutes}:${remainingSeconds.toFixed(2).padStart(5, '0')}`
      : `${remainingSeconds.toFixed(2)}`
  }

  const [times, setTimes] = useState<TimeEntry[]>([])

  // 全てのセット・レップの組み合わせを生成する関数
  const generateTimeCombinations = (): TimeEntry[] => {
    const allCombinations: TimeEntry[] = []
    for (let set = 1; set <= setCount; set++) {
      for (let rep = 1; rep <= repCount; rep++) {
        const uniqueId = `${set}-${rep}-${Date.now()}-${Math.random()}`
        
        // 既存のタイムデータから該当するものを検索
        const existingTime = initialTimes?.find(t => 
          t.setNumber === set && t.repNumber === rep
        )
        
        allCombinations.push({
          id: uniqueId,
          setNumber: set,
          repNumber: rep,
          time: existingTime?.time || 0,
          displayValue: existingTime && existingTime.time > 0 ? formatTime(existingTime.time) : ''
        })
      }
    }
    return allCombinations
  }

  // 依存する値が変更されたときに組み合わせを再生成
  useEffect(() => {
    if (isOpen) {
      setTimes(generateTimeCombinations())
    }
  }, [setCount, repCount, initialTimes, isOpen])

  if (!isOpen) return null

  const handleTimeChange = (id: string, value: string) => {
    setTimes(prev => prev.map(t => 
      t.id === id ? { 
        ...t, 
        displayValue: value,
        time: parseTime(value)
      } : t
    ))
  }

  const parseTime = (timeString: string) => {
    if (!timeString) return 0
    
    // "1:30.50" 形式
    if (timeString.includes(':')) {
      const [minutes, seconds] = timeString.split(':')
      return parseInt(minutes) * 60 + parseFloat(seconds)
    }
    
    // "30.50s" 形式
    if (timeString.endsWith('s')) {
      return parseFloat(timeString.slice(0, -1))
    }
    
    // 数値のみ
    return parseFloat(timeString)
  }

  const handleSubmit = () => {
    onSubmit(times)
    onClose()
  }

  const getTimesBySet = (setNumber: number) => {
    return times.filter(t => t.setNumber === setNumber)
  }

  const getSetTotal = (setNumber: number) => {
    const setTimes = getTimesBySet(setNumber)
    return setTimes.reduce((sum, t) => sum + t.time, 0)
  }

  const getSetAverage = (setNumber: number) => {
    const setTimes = getTimesBySet(setNumber)
    const validTimes = setTimes.filter(t => t.time > 0)
    if (validTimes.length === 0) return 0
    return validTimes.reduce((sum, t) => sum + t.time, 0) / validTimes.length
  }

  const getOverallTotal = () => {
    return times.reduce((sum, t) => sum + t.time, 0)
  }

  const getOverallAverage = () => {
    const validTimes = times.filter(t => t.time > 0)
    if (validTimes.length === 0) return 0
    return validTimes.reduce((sum, t) => sum + t.time, 0) / validTimes.length
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* ヘッダー */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {menuNumber ? `メニュー${menuNumber}のタイム入力` : 'タイム入力'}
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={onClose}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {setCount}セット × {repCount}本のタイムを入力してください
            </p>
          </div>

          {/* タイム入力フォーム */}
          <div className="bg-white px-6 py-4 max-h-96 overflow-y-auto">
            <div className="space-y-6">
              {Array.from({ length: setCount }, (_, setIndex) => {
                const setNumber = setIndex + 1
                const setTimes = getTimesBySet(setNumber)
                const setAverage = getSetAverage(setNumber)
                const validTimesCount = setTimes.filter(t => t.time > 0).length
                
                return (
                  <div key={setNumber} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-semibold text-gray-900">
                        セット {setNumber}
                      </h4>
                      <div className="text-sm text-gray-600">
                        平均: {setAverage > 0 ? formatTime(setAverage) : '未入力'} 
                        {validTimesCount > 0 && ` (${validTimesCount}本)`}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {setTimes.map((timeEntry) => (
                        <div key={timeEntry.id} className="space-y-1">
                          <label className="block text-xs font-medium text-gray-700">
                            {timeEntry.repNumber}本目
                          </label>
                          <input
                            type="text"
                            placeholder="例: 1:30.50"
                            value={timeEntry.displayValue || ''}
                            onChange={(e) => {
                              handleTimeChange(timeEntry.id, e.target.value)
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 平均値表示 */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">全体平均:</span>
              <span className="text-lg font-bold text-blue-600">
                {getOverallAverage() > 0 ? formatTime(getOverallAverage()) : '未入力'}
              </span>
            </div>
          </div>

          {/* フッター */}
          <div className="bg-gray-50 px-6 py-3 sm:flex sm:flex-row-reverse">
            <Button
              onClick={handleSubmit}
              className="w-full sm:w-auto sm:ml-3"
            >
              保存
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="mt-3 w-full sm:mt-0 sm:w-auto"
            >
              キャンセル
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
