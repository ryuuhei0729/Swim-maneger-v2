'use client'

import React, { useState } from 'react'
import { Button, Input } from '@/components/ui'
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'

interface SplitTime {
  id: string
  distance: number
  time: number
}

interface RecordFormData {
  recordDate: string
  location: string
  competitionName: string
  poolType: number // 0: short, 1: long
  competitionCategory: number // 1: official, 2: record, 3: time_trial
  styleId: string
  time: number
  isRelaying: boolean
  relayLeg?: number
  rankPosition?: number
  splitTimes: SplitTime[]
  note: string
  videoUrl?: string
}

interface RecordFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: RecordFormData) => Promise<void>
  initialDate?: Date
  editData?: any
  isLoading?: boolean
  styles?: Array<{ id: string; name_jp: string; distance: number }>
}

const POOL_TYPES = [
  { value: 0, label: '短水路 (25m)' },
  { value: 1, label: '長水路 (50m)' }
]

const COMPETITION_CATEGORIES = [
  { value: 1, label: '公式大会' },
  { value: 2, label: '記録会' },
  { value: 3, label: 'タイムトライアル' }
]

const RELAY_LEGS = [
  { value: 1, label: '1泳目' },
  { value: 2, label: '2泳目' },
  { value: 3, label: '3泳目' },
  { value: 4, label: '4泳目' }
]

export default function RecordForm({
  isOpen,
  onClose,
  onSubmit,
  initialDate,
  editData,
  isLoading = false,
  styles = []
}: RecordFormProps) {
  const [formData, setFormData] = useState<RecordFormData>({
    recordDate: initialDate ? format(initialDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    location: '',
    competitionName: '',
    poolType: 0,
    competitionCategory: 1,
    styleId: styles[0]?.id || '',
    time: 0,
    isRelaying: false,
    splitTimes: [],
    note: ''
  })

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await onSubmit(formData)
      // フォームリセット
      setFormData({
        recordDate: format(new Date(), 'yyyy-MM-dd'),
        location: '',
        competitionName: '',
        poolType: 0,
        competitionCategory: 1,
        styleId: styles[0]?.id || '',
        time: 0,
        isRelaying: false,
        splitTimes: [],
        note: ''
      })
      onClose()
    } catch (error) {
      console.error('記録の保存に失敗しました:', error)
    }
  }

  const addSplitTime = () => {
    const newSplit: SplitTime = {
      id: Date.now().toString(),
      distance: 25,
      time: 0
    }
    setFormData(prev => ({
      ...prev,
      splitTimes: [...prev.splitTimes, newSplit]
    }))
  }

  const removeSplitTime = (id: string) => {
    setFormData(prev => ({
      ...prev,
      splitTimes: prev.splitTimes.filter(split => split.id !== id)
    }))
  }

  const updateSplitTime = (id: string, field: keyof SplitTime, value: number) => {
    setFormData(prev => ({
      ...prev,
      splitTimes: prev.splitTimes.map(split => 
        split.id === id ? { ...split, [field]: value } : split
      )
    }))
  }

  const _formatTimeInput = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = (seconds % 60).toFixed(2)
    return mins > 0 ? `${mins}:${secs.padStart(5, '0')}` : secs
  }

  const _parseTimeInput = (timeStr: string): number => {
    const parts = timeStr.split(':')
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseFloat(parts[1])
    }
    return parseFloat(timeStr) || 0
  }

  const _selectedStyle = styles.find(s => s.id === formData.styleId)

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* ヘッダー */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                大会記録を追加
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
            {/* 大会基本情報 */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900">大会情報</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    大会日 *
                  </label>
                  <Input
                    type="date"
                    value={formData.recordDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, recordDate: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    場所 *
                  </label>
                  <Input
                    type="text"
                    placeholder="例: 県立水泳場"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  大会名 *
                </label>
                <Input
                  type="text"
                  placeholder="例: 県選手権水泳競技大会"
                  value={formData.competitionName}
                  onChange={(e) => setFormData(prev => ({ ...prev, competitionName: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    プール種別 *
                  </label>
                  <select
                    value={formData.poolType}
                    onChange={(e) => setFormData(prev => ({ ...prev, poolType: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {POOL_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    大会カテゴリ *
                  </label>
                  <select
                    value={formData.competitionCategory}
                    onChange={(e) => setFormData(prev => ({ ...prev, competitionCategory: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {COMPETITION_CATEGORIES.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 記録詳細 */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900">記録詳細</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    種目 *
                  </label>
                  <select
                    value={formData.styleId}
                    onChange={(e) => setFormData(prev => ({ ...prev, styleId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {styles.map(style => (
                      <option key={style.id} value={style.id}>
                        {style.name_jp}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    記録タイム (秒) *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="例: 26.45"
                    value={formData.time || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: parseFloat(e.target.value) || 0 }))}
                    required
                  />
                </div>
              </div>

              {/* リレー情報 */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isRelaying"
                    checked={formData.isRelaying}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      isRelaying: e.target.checked,
                      relayLeg: e.target.checked ? 1 : undefined
                    }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isRelaying" className="ml-2 block text-sm text-gray-900">
                    リレー種目
                  </label>
                </div>
                
                {formData.isRelaying && (
                  <div className="ml-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      泳順
                    </label>
                    <select
                      value={formData.relayLeg || 1}
                      onChange={(e) => setFormData(prev => ({ ...prev, relayLeg: parseInt(e.target.value) }))}
                      className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {RELAY_LEGS.map(leg => (
                        <option key={leg.value} value={leg.value}>
                          {leg.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  順位
                </label>
                <Input
                  type="number"
                  min="1"
                  placeholder="例: 1"
                  value={formData.rankPosition || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, rankPosition: parseInt(e.target.value) || undefined }))}
                />
              </div>
            </div>

            {/* スプリットタイム */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  スプリットタイム
                </label>
                <Button
                  type="button"
                  onClick={addSplitTime}
                  variant="outline"
                  size="sm"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  追加
                </Button>
              </div>

              {formData.splitTimes.length > 0 && (
                <div className="space-y-3">
                  {formData.splitTimes.map((split, _index) => (
                    <div key={split.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          距離 (m)
                        </label>
                        <Input
                          type="number"
                          min="1"
                          value={split.distance}
                          onChange={(e) => updateSplitTime(split.id, 'distance', parseInt(e.target.value) || 25)}
                          className="text-sm"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          タイム (秒)
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={split.time || ''}
                          onChange={(e) => updateSplitTime(split.id, 'time', parseFloat(e.target.value) || 0)}
                          className="text-sm"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSplitTime(split.id)}
                        className="text-red-600 hover:text-red-800 mt-6"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 動画URL・メモ */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  動画URL
                </label>
                <Input
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={formData.videoUrl || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  メモ
                </label>
                <textarea
                  rows={3}
                  value={formData.note}
                  onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="レースの感想や反省点を記録..."
                />
              </div>
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
    </div>
  )
}
