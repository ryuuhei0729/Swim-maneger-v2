'use client'

import React, { useState, useEffect } from 'react'
import { Button, Input } from '@/components/ui'
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { 
  useMyPracticeTags, 
  useCreatePracticeLog, 
  useUpdatePracticeLog,
  useCreatePracticeTag 
} from '@/hooks/useGraphQL'

interface PracticeLogFormData {
  practiceDate: string
  location: string
  tagIds: string[]
  style: string
  repCount: number
  setCount: number
  distance: number
  circle: number
  note: string
}

interface PracticeLogFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (data: PracticeLogFormData) => Promise<void>
  initialDate?: Date
  editData?: any // 編集時のデータ
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
  editData
}: PracticeLogFormProps) {
  const [formData, setFormData] = useState<PracticeLogFormData>({
    practiceDate: initialDate ? format(initialDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    location: '',
    tagIds: [],
    style: 'フリー',
    repCount: 1,
    setCount: 1,
    distance: 100,
    circle: 90,
    note: ''
  })

  const [newTagName, setNewTagName] = useState('')
  const [newTagColor, setNewTagColor] = useState('#3B82F6')

  // GraphQLフック
  const { data: tagsData, loading: tagsLoading } = useMyPracticeTags()
  const [createPracticeLog, { loading: createLoading }] = useCreatePracticeLog()
  const [updatePracticeLog, { loading: updateLoading }] = useUpdatePracticeLog()
  const [createPracticeTag] = useCreatePracticeTag()

  const isLoading = createLoading || updateLoading
  const practiceTags = tagsData?.myPracticeTags || []

  // 編集データがある場合、フォームを初期化
  useEffect(() => {
    if (editData) {
      setFormData({
        practiceDate: editData.practiceDate || format(new Date(), 'yyyy-MM-dd'),
        location: editData.location || '',
        tagIds: editData.tags?.map((tag: any) => tag.id) || [],
        style: editData.style || 'フリー',
        repCount: editData.repCount || 1,
        setCount: editData.setCount || 1,
        distance: editData.distance || 100,
        circle: editData.circle || 90,
        note: editData.note || ''
      })
    }
  }, [editData])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const input = {
        practiceDate: formData.practiceDate,
        location: formData.location,
        tagIds: formData.tagIds,
        style: formData.style,
        repCount: formData.repCount,
        setCount: formData.setCount,
        distance: formData.distance,
        circle: formData.circle,
        note: formData.note
      }

      if (editData) {
        await updatePracticeLog({
          variables: {
            id: editData.id,
            input
          }
        })
      } else {
        await createPracticeLog({
          variables: { input }
        })
      }

      // onSubmitコールバックを呼び出し
      if (onSubmit) {
        await onSubmit(formData)
      }

      // フォームリセット
      setFormData({
        practiceDate: format(new Date(), 'yyyy-MM-dd'),
        location: '',
        tagIds: [],
        style: 'フリー',
        repCount: 1,
        setCount: 1,
        distance: 100,
        circle: 90,
        note: ''
      })
      onClose()
    } catch (error) {
      console.error('練習記録の保存に失敗しました:', error)
      alert('練習記録の保存に失敗しました。もう一度お試しください。')
    }
  }

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return
    
    try {
      await createPracticeTag({
        variables: {
          input: {
            name: newTagName.trim(),
            color: newTagColor
          }
        }
      })
      setNewTagName('')
      setNewTagColor('#3B82F6')
    } catch (error) {
      console.error('タグの作成に失敗しました:', error)
      alert('タグの作成に失敗しました。もう一度お試しください。')
    }
  }

  const toggleTag = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter(id => id !== tagId)
        : [...prev.tagIds, tagId]
    }))
  }

  const totalDistance = formData.repCount * formData.setCount * formData.distance

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

            {/* 練習タグ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                練習タグ
              </label>
              <div className="space-y-3">
                {/* 既存タグ選択 */}
                {!tagsLoading && practiceTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {practiceTags.map((tag: any) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        className={`px-3 py-1 text-sm rounded-full transition-colors ${
                          formData.tagIds.includes(tag.id)
                            ? 'text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                        style={{
                          backgroundColor: formData.tagIds.includes(tag.id) ? tag.color : 'transparent'
                        }}
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                )}

                {/* 新しいタグ作成 */}
                <div className="border-t pt-3">
                  <p className="text-sm text-gray-600 mb-2">新しいタグを作成</p>
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Input
                        type="text"
                        placeholder="タグ名"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                      />
                    </div>
                    <div>
                      <input
                        type="color"
                        value={newTagColor}
                        onChange={(e) => setNewTagColor(e.target.value)}
                        className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={handleCreateTag}
                      variant="outline"
                      disabled={!newTagName.trim()}
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      作成
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* 練習内容 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-4">練習内容</h4>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    泳法 *
                  </label>
                  <select
                    value={formData.style}
                    onChange={(e) => setFormData(prev => ({ ...prev, style: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {SWIMMING_STYLES.map(style => (
                      <option key={style} value={style}>{style}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    本数 *
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.repCount}
                    onChange={(e) => setFormData(prev => ({ ...prev, repCount: parseInt(e.target.value) || 1 }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    セット数 *
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.setCount}
                    onChange={(e) => setFormData(prev => ({ ...prev, setCount: parseInt(e.target.value) || 1 }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    距離(m) *
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.distance}
                    onChange={(e) => setFormData(prev => ({ ...prev, distance: parseInt(e.target.value) || 100 }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    サークル(秒) *
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.circle}
                    onChange={(e) => setFormData(prev => ({ ...prev, circle: parseInt(e.target.value) || 90 }))}
                    required
                  />
                </div>
              </div>

              {/* 総距離表示 */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-800">
                  <strong>総距離: {totalDistance}m</strong>
                  <span className="ml-4 text-blue-600">
                    ({formData.repCount} × {formData.setCount} × {formData.distance}m)
                  </span>
                </div>
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
