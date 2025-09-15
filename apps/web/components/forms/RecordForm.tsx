'use client'

import React, { useState, useEffect } from 'react'
import { Button, Input } from '@/components/ui'
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { formatTime } from '@/utils/formatters'

interface SplitTime {
  id: string
  distance: number
  splitTime: number
}

interface RecordFormData {
  recordDate: string
  location: string
  competitionName: string
  poolType: number // 0: short, 1: long
  styleId: string
  time: number
  isRelaying: boolean
  splitTimes: SplitTimeInput[]
  note: string
  videoUrl?: string
}

interface SplitTimeInput {
  distance: number | ''
  splitTime: number
  // UI安定化用のキー（サーバー送信時には除去）
  uiKey?: string
}

interface RecordFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: RecordFormData) => Promise<void>
  initialDate?: Date
  editData?: any
  isLoading?: boolean
  styles?: Array<{ id: string; nameJp: string; distance: number }>
}

const POOL_TYPES = [
  { value: 0, label: '短水路 (25m)' },
  { value: 1, label: '長水路 (50m)' }
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
    styleId: styles[0]?.id || '',
    time: 0,
    isRelaying: false,
    splitTimes: [],
    note: '',
    videoUrl: ''
  })

  // initialDateが変更された時にフォームデータを更新
  useEffect(() => {
    if (isOpen && initialDate) {
      setFormData(prev => ({
        ...prev,
        recordDate: format(initialDate, 'yyyy-MM-dd')
      }))
    }
  }, [isOpen, initialDate])

  // 編集データがある場合、フォームを初期化
  useEffect(() => {
    if (editData && isOpen) {
      console.log('RecordForm: Setting form data from editData:', editData)
      
      setFormData({
        recordDate: editData.recordDate || format(new Date(), 'yyyy-MM-dd'),
        location: editData.location || '',
        competitionName: editData.competitionName || '',
        poolType: editData.poolType || 0,
        styleId: editData.styleId || styles[0]?.id || '',
        time: editData.time || 0,
        isRelaying: editData.isRelaying || false,
        splitTimes: (editData.splitTimes?.map((st: any) => ({
          distance: st.distance,
          splitTime: st.splitTime,
          uiKey: (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
            ? (crypto as any).randomUUID()
            : 'st-' + Math.random().toString(36).slice(2)
        })) || []).sort((a: any, b: any) => (a.distance || 0) - (b.distance || 0)),
        note: editData.note || '',
        videoUrl: editData.videoUrl || ''
      })
    } else if (!editData && isOpen) {
      // 新規作成時はデフォルト値にリセット
      setFormData({
        recordDate: initialDate ? format(initialDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        location: '',
        competitionName: '',
        poolType: 0,
        styleId: styles[0]?.id || '',
        time: 0,
        isRelaying: false,
        splitTimes: [],
        note: '',
        videoUrl: ''
      })
    }
  }, [editData, isOpen, initialDate])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // 送信前にUI専用プロパティを除去
      const sanitizedSplitTimes = (formData.splitTimes || [])
        .filter(st => typeof st.distance === 'number' && Number.isFinite(st.distance) && (st.distance as number) > 0)
        .map(st => ({
          distance: st.distance as number,
          splitTime: st.splitTime
        }))
      // 編集時はIDを含めて送信
      const submitData = {
        ...formData,
        splitTimes: sanitizedSplitTimes,
        ...(editData ? { id: editData.id } : {})
      }
      console.log('RecordForm: Submitting data:', submitData)
      await onSubmit(submitData)
      // フォームリセット
      setFormData({
        recordDate: format(new Date(), 'yyyy-MM-dd'),
        location: '',
        competitionName: '',
        poolType: 0,
        styleId: styles[0]?.id || '',
        time: 0,
        isRelaying: false,
        splitTimes: [],
        note: '',
        videoUrl: ''
      })
      onClose()
    } catch (error) {
      console.error('記録の保存に失敗しました:', error)
    }
  }

  const addSplitTime = () => {
    const newSplit: SplitTimeInput = {
      distance: 25,
      splitTime: 0,
      uiKey: (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
        ? (crypto as any).randomUUID()
        : 'st-' + Math.random().toString(36).slice(2)
    }
    setFormData(prev => ({
      ...prev,
      splitTimes: [...prev.splitTimes, newSplit].sort((a, b) => (a.distance || 0) - (b.distance || 0))
    }))
  }

  const removeSplitTime = (index: number) => {
    setFormData(prev => ({
      ...prev,
      splitTimes: prev.splitTimes.filter((_, i) => i !== index)
    }))
  }

  const updateSplitTime = (index: number, field: keyof SplitTimeInput, value: number | '') => {
    setFormData(prev => {
      const beforeKey = prev.splitTimes[index]?.uiKey
      const updated = prev.splitTimes
        .map((split, i) => (i === index ? { ...split, [field]: value } : split))
        .sort((a, b) => ((a.distance as number) || 0) - ((b.distance as number) || 0))

      // 入力中行がソートで移動してもフォーカスを維持するため、同じuiKeyを持つ要素のindexを探して
      // 次のレンダリングでも安定したkeyで描画されるようにする（keyはuiKeyを使用）
      if (beforeKey) {
        const newIndex = updated.findIndex(s => s.uiKey === beforeKey)
        if (newIndex >= 0) {
          // 何もしなくてもkeyによってReactが同一要素とみなす
        }
      }

      return { ...prev, splitTimes: updated }
    })
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
                    <option value="" disabled>種目を選択してください</option>
                    {styles.map(style => (
                      <option key={style.id} value={style.id}>
                        {style.nameJp}
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
                  {formData.time > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      表示: {formatTime(formData.time)}
                    </p>
                  )}
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
                      isRelaying: e.target.checked
                    }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isRelaying" className="ml-2 block text-sm text-gray-900">
                    リレー種目
                  </label>
                </div>
                
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
                  {formData.splitTimes.map((split, index) => (
                    <div key={split.uiKey ?? index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          距離 (m)
                        </label>
                        <Input
                          type="number"
                          min="1"
                          value={split.distance as number | ''}
                          onChange={(e) => {
                            const val = e.target.value
                            if (val === '') {
                              updateSplitTime(index, 'distance', '')
                            } else {
                              const n = parseInt(val)
                              updateSplitTime(index, 'distance', Number.isNaN(n) ? '' : n)
                            }
                          }}
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
                          value={split.splitTime || ''}
                          onChange={(e) => updateSplitTime(index, 'splitTime', parseFloat(e.target.value) || 0)}
                          className="text-sm"
                        />
                        {split.splitTime > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTime(split.splitTime)}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSplitTime(index)}
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

            {/* 記録情報表示 */}
            {_selectedStyle && formData.time > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-medium text-blue-900 mb-2">記録サマリー</h5>
                <div className="text-sm text-blue-800">
                  <p><strong>{_selectedStyle.nameJp}</strong></p>
                  <p>タイム: <strong>{formatTime(formData.time)}</strong></p>
                  <p>プール: {POOL_TYPES.find(pt => pt.value === formData.poolType)?.label}</p>
                </div>
              </div>
            )}

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
