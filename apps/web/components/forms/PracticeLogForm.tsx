'use client'

import React, { useState, useEffect } from 'react'
import { Button, Input } from '@/components/ui'
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import TimeInputModal from './TimeInputModal'

interface PracticeSet {
  id: string
  reps: number
  distance: number
  circleTime: number
  style: string
  times?: Array<{
    setNumber: number
    repNumber: number
    time: number
  }>
}

interface PracticeLogFormData {
  practiceDate: string
  location: string
  sets: PracticeSet[]
  note: string
}

interface PracticeLogFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (data: PracticeLogFormData) => Promise<void>
  initialDate?: Date
  editData?: any // 編集時のデータ
  isLoading?: boolean
}

const SWIMMING_STYLES = [
  'フリー',
  'バック',
  'ブレスト',
  'バタフライ',
  'メドレー',
  'キック',
  'プル'
]


export default function PracticeLogForm({
  isOpen,
  onClose,
  onSubmit,
  initialDate,
  editData,
  isLoading = false
}: PracticeLogFormProps) {
  const [formData, setFormData] = useState<PracticeLogFormData>({
    practiceDate: initialDate ? format(initialDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    location: '',
    sets: [{
      id: '1',
      reps: 1,
      distance: 100,
      circleTime: 90,
      style: 'フリー'
    }],
    note: ''
  })
  const [showTimeModal, setShowTimeModal] = useState(false)
  const [selectedSetForTime, setSelectedSetForTime] = useState<PracticeSet | null>(null)

  // タイム表示のフォーマット関数
  const formatTimeDisplay = (seconds: number): string => {
    if (seconds === 0) return '0.00'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return minutes > 0 
      ? `${minutes}:${remainingSeconds.toFixed(2).padStart(5, '0')}`
      : `${remainingSeconds.toFixed(2)}`
  }

  // 編集データが渡された時にフォームデータを初期化
  useEffect(() => {
    if (editData && isOpen) {
      console.log('PracticeLogForm: Setting form data from editData:', editData)
      console.log('PracticeLogForm: Times data:', editData.times)
      
      // 編集データをフォーム形式に変換
      // 実際のセット数に基づいて複数のセットを生成
      const actualSetCount = editData.setCount || 1
      const repsPerSet = editData.repCount || 1
      const totalDistance = editData.distance || 100
      const distancePerSet = actualSetCount > 1 ? Math.round(totalDistance / actualSetCount) : totalDistance
      
      const setsData = []
      for (let setIndex = 1; setIndex <= actualSetCount; setIndex++) {
        // 各セットのタイムデータを抽出
        const setTimes = (editData.times || []).filter((time: any) => time.setNumber === setIndex)
        
        setsData.push({
          id: setIndex.toString(),
          reps: repsPerSet,
          distance: distancePerSet,
          circleTime: editData.circle || 90,
          style: editData.style || 'フリー',
          times: setTimes
        })
      }

      console.log('PracticeLogForm: Generated sets data:', setsData)

      const newFormData = {
        practiceDate: editData.date || format(new Date(), 'yyyy-MM-dd'),
        location: editData.place || '',
        sets: setsData,
        note: editData.note || ''
      }

      console.log('PracticeLogForm: New form data:', newFormData)
      setFormData(newFormData)
    } else if (!editData && isOpen) {
      // 新規作成時はデフォルト値にリセット
      console.log('PracticeLogForm: Resetting to default values (new entry)')
      setFormData({
        practiceDate: initialDate ? format(initialDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        location: '',
        sets: [{
          id: '1',
          reps: 1,
          distance: 100,
          circleTime: 90,
          style: 'フリー'
        }],
        note: ''
      })
    }
    
  }, [editData, isOpen, initialDate])


  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await onSubmit(formData)
      // フォームリセット
      setFormData({
        practiceDate: format(new Date(), 'yyyy-MM-dd'),
        location: '',
        sets: [{
          id: '1',
          reps: 1,
          distance: 100,
          circleTime: 90,
          style: 'フリー'
        }],
        note: ''
      })
      onClose()
    } catch (error) {
      console.error('練習記録の保存に失敗しました:', error)
    }
  }

  const addSet = () => {
    const newSet: PracticeSet = {
      id: Date.now().toString(),
      reps: 1,
      distance: 100,
      circleTime: 90,
      style: 'フリー'
    }
    setFormData(prev => ({
      ...prev,
      sets: [...prev.sets, newSet]
    }))
  }

  const removeSet = (id: string) => {
    if (formData.sets.length > 1) {
      setFormData(prev => ({
        ...prev,
        sets: prev.sets.filter(set => set.id !== id)
      }))
    }
  }

  const updateSet = (id: string, field: keyof PracticeSet, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      sets: prev.sets.map(set => 
        set.id === id ? { ...set, [field]: value } : set
      )
    }))
  }

  const handleTimeInput = (set: PracticeSet) => {
    setSelectedSetForTime(set)
    setShowTimeModal(true)
  }

  const handleTimeSubmit = (times: Array<{ id: string; setNumber: number; repNumber: number; time: number }>) => {
    if (!selectedSetForTime) return

    // TimeInputModalから返されたタイムデータを、現在のセット用に変換
    const setIndex = formData.sets.findIndex(set => set.id === selectedSetForTime.id)
    const actualSetNumber = setIndex + 1 // 実際のセット番号

    const convertedTimes = times
      .filter(t => t.time > 0) // タイムが入力されているもののみ
      .map(t => ({
        id: `${actualSetNumber}-${t.repNumber}`, // 実際のセット番号を使用
        setNumber: actualSetNumber,
        repNumber: t.repNumber,
        time: t.time
      }))

    setFormData(prev => ({
      ...prev,
      sets: prev.sets.map(set => 
        set.id === selectedSetForTime.id 
          ? { ...set, times: convertedTimes } 
          : set
      )
    }))
    
    setShowTimeModal(false)
    setSelectedSetForTime(null)
  }


  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* ヘッダー */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {editData ? '練習記録を編集' : '練習記録を追加'}
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={onClose}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* フォーム本体 */}
          <form onSubmit={handleSubmit} className="bg-white px-6 py-4 space-y-6">
            {/* 基本情報 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  練習日 *
                </label>
                <Input
                  type="date"
                  value={formData.practiceDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, practiceDate: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  場所
                </label>
                <Input
                  type="text"
                  placeholder="例: 市営プール"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
            </div>


            {/* セット詳細 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  練習内容 *
                </label>
                <Button
                  type="button"
                  onClick={addSet}
                  variant="outline"
                  size="sm"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  セット追加
                </Button>
              </div>

              <div className="space-y-4">
                {formData.sets.map((set, index) => (
                  <div key={set.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-900">
                        セット {index + 1}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <Button
                          type="button"
                          onClick={() => handleTimeInput(set)}
                          variant="outline"
                          size="sm"
                        >
                          ⏱️ タイム入力
                        </Button>
                        {/* タイムデータがある場合の表示 */}
                        {set.times && set.times.length > 0 && (
                          <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                            {set.times.filter((t: any) => t.time > 0).length}件のタイム記録
                          </div>
                        )}
                        {formData.sets.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSet(set.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          泳法
                        </label>
                        <select
                          value={set.style}
                          onChange={(e) => updateSet(set.id, 'style', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {SWIMMING_STYLES.map(style => (
                            <option key={style} value={style}>{style}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          本数
                        </label>
                        <Input
                          type="number"
                          min="1"
                          value={set.reps}
                          onChange={(e) => {
                            const value = e.target.value
                            if (value === '') {
                              updateSet(set.id, 'reps', 1)
                            } else {
                              const numValue = parseInt(value)
                              if (!isNaN(numValue) && numValue > 0) {
                                updateSet(set.id, 'reps', numValue)
                              }
                            }
                          }}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          距離(m)
                        </label>
                        <Input
                          type="number"
                          min="1"
                          value={set.distance}
                          onChange={(e) => {
                            const value = e.target.value
                            if (value === '') {
                              updateSet(set.id, 'distance', 100)
                            } else {
                              const numValue = parseInt(value)
                              if (!isNaN(numValue) && numValue > 0) {
                                updateSet(set.id, 'distance', numValue)
                              }
                            }
                          }}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          サークル(秒)
                        </label>
                        <Input
                          type="number"
                          min="1"
                          value={set.circleTime}
                          onChange={(e) => {
                            const value = e.target.value
                            if (value === '') {
                              updateSet(set.id, 'circleTime', 90)
                            } else {
                              const numValue = parseInt(value)
                              if (!isNaN(numValue) && numValue > 0) {
                                updateSet(set.id, 'circleTime', numValue)
                              }
                            }
                          }}
                          className="text-sm"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          総距離
                        </label>
                        <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-600">
                          {set.reps * set.distance}m
                        </div>
                      </div>
                    </div>

                    {/* タイム表示セクション */}
                    {set.times && set.times.length > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <h5 className="text-xs font-medium text-blue-800 mb-2">記録されたタイム</h5>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                          {set.times
                            .filter((time: any) => time.time > 0)
                            .sort((a: any, b: any) => {
                              if (a.setNumber !== b.setNumber) {
                                return a.setNumber - b.setNumber
                              }
                              return a.repNumber - b.repNumber
                            })
                            .map((time: any, timeIndex: number) => (
                              <div key={`${time.setNumber}-${time.repNumber}-${timeIndex}`} className="text-center">
                                <div className="text-xs text-blue-600 font-medium">
                                  {time.setNumber}セット{time.repNumber}本目
                                </div>
                                <div className="text-sm font-mono text-blue-800 bg-white px-2 py-1 rounded border">
                                  {formatTimeDisplay(time.time)}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* メモ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                メモ
              </label>
              <textarea
                rows={3}
                value={formData.note}
                onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="練習の感想や気づいたことを記録..."
              />
            </div>

            {/* フッター */}
            <div className="bg-gray-50 px-6 py-3 sm:flex sm:flex-row-reverse sm:px-6 -mx-6 -mb-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto sm:ml-3"
              >
                {isLoading ? '保存中...' : '保存'}
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
          </form>
        </div>
      </div>

      {/* タイム入力モーダル */}
      {showTimeModal && selectedSetForTime && (
        <TimeInputModal
          isOpen={showTimeModal}
          onClose={() => {
            setShowTimeModal(false)
            setSelectedSetForTime(null)
          }}
          onSubmit={handleTimeSubmit}
          setCount={1} // 1セットのみ（現在選択されたセット）
          repCount={selectedSetForTime.reps}
          initialTimes={(() => {
            const setIndex = formData.sets.findIndex(set => set.id === selectedSetForTime.id)
            const actualSetNumber = setIndex + 1
            
            return selectedSetForTime.times?.filter(t => 
              t.setNumber === actualSetNumber // 実際のセット番号でフィルタ
            ).map(t => ({
              id: `1-${t.repNumber}`, // TimeInputModalでは常にセット1として扱う
              setNumber: 1,
              repNumber: t.repNumber,
              time: t.time
            })) || []
          })()}
        />
      )}
    </div>
  )
}
