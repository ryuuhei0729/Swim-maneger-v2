'use client'

import React, { useState, useEffect } from 'react'
import { Button, Input } from '@/components/ui'
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { 
  useStyles,
  useCreateRecord,
  useUpdateRecord,
  useCreateSplitTime
} from '@/hooks/useGraphQL'
import { useMutation } from '@apollo/client/react'
import { CREATE_COMPETITION } from '@/graphql/mutations'

interface SplitTime {
  distance: number
  splitTime: number
}

interface RecordFormData {
  recordDate: string
  location: string
  competitionName: string
  poolType: 'SHORT_COURSE' | 'LONG_COURSE'
  poolLength: number
  competitionCategory: 'OFFICIAL' | 'RECORD_MEET' | 'TIME_TRIAL'
  styleId: string
  time: number
  isRelay: boolean
  rankPosition?: number
  splitTimes: SplitTime[]
  memo: string
  videoUrl?: string
}

interface RecordFormProps {
  isOpen: boolean
  onClose: () => void
  initialDate?: Date
  editData?: any // 編集時のデータ
}

const POOL_TYPES = [
  { value: 'SHORT_COURSE', label: '短水路 (25m)', length: 25 },
  { value: 'LONG_COURSE', label: '長水路 (50m)', length: 50 }
]

const COMPETITION_CATEGORIES = [
  { value: 'OFFICIAL', label: '公式大会' },
  { value: 'RECORD_MEET', label: '記録会' },
  { value: 'TIME_TRIAL', label: 'タイムトライアル' }
]

export default function RecordForm({
  isOpen,
  onClose,
  initialDate,
  editData
}: RecordFormProps) {
  const [formData, setFormData] = useState<RecordFormData>({
    recordDate: initialDate ? format(initialDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    location: '',
    competitionName: '',
    poolType: 'SHORT_COURSE',
    poolLength: 25,
    competitionCategory: 'OFFICIAL',
    styleId: '',
    time: 0,
    isRelay: false,
    splitTimes: [],
    memo: ''
  })

  // GraphQLフック
  const { data: stylesData, loading: stylesLoading } = useStyles()
  const [createCompetition] = useMutation(CREATE_COMPETITION)
  const [createRecord, { loading: createLoading }] = useCreateRecord()
  const [updateRecord, { loading: updateLoading }] = useUpdateRecord()
  const [createSplitTime] = useCreateSplitTime()

  const isLoading = createLoading || updateLoading
  const styles = (stylesData as any)?.styles || []

  // 編集データがある場合、フォームを初期化
  useEffect(() => {
    if (editData) {
      setFormData({
        recordDate: editData.recordDate || format(new Date(), 'yyyy-MM-dd'),
        location: editData.location || '',
        competitionName: editData.competition?.title || '',
        poolType: editData.poolType || 'SHORT_COURSE',
        poolLength: editData.poolLength || 25,
        competitionCategory: 'OFFICIAL', // デフォルト値
        styleId: editData.styleId || '',
        time: editData.time || 0,
        isRelay: editData.isRelay || false,
        rankPosition: editData.rankPosition,
        splitTimes: editData.splitTimes?.map((st: any) => ({
          distance: st.distance,
          splitTime: st.splitTime
        })) || [],
        memo: editData.memo || '',
        videoUrl: editData.videoUrl
      })
    } else if (styles.length > 0) {
      setFormData(prev => prev.styleId ? prev : { ...prev, styleId: styles[0].id })
    }
  }, [editData, styles])

  // プールタイプが変更されたときに長さも更新
  useEffect(() => {
    const poolTypeData = POOL_TYPES.find(pt => pt.value === formData.poolType)
    if (poolTypeData) {
      setFormData(prev => ({ ...prev, poolLength: poolTypeData.length }))
    }
  }, [formData.poolType])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // まず大会を作成または取得
      let competitionId = null
      const normalize = (v?: string) => (v ?? '').trim()
      const normalizeDate = (v?: string) => {
        if (!v) return ''
        try {
          return format(new Date(v), 'yyyy-MM-dd')
        } catch {
          return (v ?? '').slice(0, 10)
        }
      }

      if (formData.competitionName) {
        const poolTypeInt = formData.poolType === 'LONG_COURSE' ? 1 : 0
        const { data: competitionResult } = await createCompetition({
          variables: {
            input: {
              title: formData.competitionName,
              date: formData.recordDate,
              place: formData.location,
              poolType: poolTypeInt,
              note: formData.competitionCategory
            }
          }
        })
        competitionId = (competitionResult as any)?.createCompetition?.id
      }

      // 記録を作成または更新（スキーマ準拠のキーのみ）
      const recordInput = {
        styleId: parseInt(String(formData.styleId), 10),
        time: formData.time,
        note: formData.memo,
        videoUrl: formData.videoUrl,
        competitionId
      }

      let recordId: string | undefined

      if (editData) {
        const { data: recordResult } = await updateRecord({
          variables: {
            id: editData.id,
            input: recordInput
          }
        })
        recordId = (recordResult as any)?.updateRecord?.id
      } else {
        const { data: recordResult } = await createRecord({
          variables: { input: recordInput }
        })
        recordId = (recordResult as any)?.createRecord?.id
      }

      if (!recordId) {
        throw new Error('記録の保存に失敗しました')
      }

      // スプリットタイムを作成（並列実行）
      if (recordId && formData.splitTimes.length > 0) {
        await Promise.all(
          formData.splitTimes.map((st) =>
            createSplitTime({
              variables: {
                input: {
                  recordId,
                  distance: st.distance,
                  splitTime: st.splitTime,
                },
              },
            })
          )
        )
      }

      // フォームリセット
      setFormData({
        recordDate: format(new Date(), 'yyyy-MM-dd'),
        location: '',
        competitionName: '',
        poolType: 'SHORT_COURSE',
        poolLength: 25,
        competitionCategory: 'OFFICIAL',
        styleId: styles[0]?.id || '',
        time: 0,
        isRelay: false,
        splitTimes: [],
        memo: ''
      })
      onClose()
    } catch (error) {
      console.error('記録の保存に失敗しました:', error)
      alert('記録の保存に失敗しました。もう一度お試しください。')
    }
  }

  const addSplitTime = () => {
    setFormData(prev => ({
      ...prev,
      splitTimes: [...prev.splitTimes, { distance: 25, splitTime: 0 }]
    }))
  }

  const removeSplitTime = (index: number) => {
    setFormData(prev => ({
      ...prev,
      splitTimes: prev.splitTimes.filter((_, i) => i !== index)
    }))
  }

  const updateSplitTime = (index: number, field: keyof SplitTime, value: number) => {
    setFormData(prev => ({
      ...prev,
      splitTimes: prev.splitTimes.map((split, i) => 
        i === index ? { ...split, [field]: value } : split
      )
    }))
  }

  const formatTime = (seconds: number): string => {
    if (seconds <= 0) return '0.00'
    const mins = Math.floor(seconds / 60)
    const secs = (seconds % 60).toFixed(2)
    return mins > 0 ? `${mins}:${secs.padStart(5, '0')}` : secs
  }

  const selectedStyle = styles.find(s => s.id === formData.styleId)

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* ヘッダー */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {editData ? '大会記録を編集' : '大会記録を追加'}
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
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      poolType: e.target.value as 'SHORT_COURSE' | 'LONG_COURSE'
                    }))}
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
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      competitionCategory: e.target.value as 'OFFICIAL' | 'RECORD_MEET' | 'TIME_TRIAL'
                    }))}
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
                    disabled={stylesLoading}
                  >
                    {styles.map((style: any) => (
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
                    id="isRelay"
                    checked={formData.isRelay}
                    onChange={(e) => setFormData(prev => ({ ...prev, isRelay: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isRelay" className="ml-2 block text-sm text-gray-900">
                    リレー種目
                  </label>
                </div>
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
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    rankPosition: parseInt(e.target.value) || undefined 
                  }))}
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
                  {formData.splitTimes.map((split, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          距離 (m)
                        </label>
                        <Input
                          type="number"
                          min="1"
                          value={split.distance}
                          onChange={(e) => updateSplitTime(index, 'distance', parseInt(e.target.value) || 25)}
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
                  value={formData.memo}
                  onChange={(e) => setFormData(prev => ({ ...prev, memo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="レースの感想や反省点を記録..."
                />
              </div>
            </div>

            {/* 記録情報表示 */}
            {selectedStyle && formData.time > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-medium text-blue-900 mb-2">記録サマリー</h5>
                <div className="text-sm text-blue-800">
                  <p><strong>{selectedStyle.nameJp}</strong></p>
                  <p>タイム: <strong>{formatTime(formData.time)}</strong></p>
                  <p>プール: {POOL_TYPES.find(pt => pt.value === formData.poolType)?.label}</p>
                  {formData.rankPosition && <p>順位: <strong>{formData.rankPosition}位</strong></p>}
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
                {isLoading ? '保存中...' : editData ? '更新' : '保存'}
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
