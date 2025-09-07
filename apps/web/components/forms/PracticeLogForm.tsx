'use client'

import React, { useState, useEffect } from 'react'
import { Button, Input } from '@/components/ui'
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { useMyPracticeTags, useCreatePracticeLog, useUpdatePracticeLog } from '@/hooks/useGraphQL'

interface PracticeSet {
  id: string
  reps: number
  distance: number
  circleTime: number
  style: string
}

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

const COMMON_TAGS = [
  'AN2',
  'EN3', 
  '耐乳酸',
  'ショートサークル',
  '長水路',
  'テクニック',
  'スピード',
  'エンデュランス'
]

export default function PracticeLogForm({
  isOpen,
  onClose,
  onSubmit,
  initialDate,
  isLoading = false
}: PracticeLogFormProps) {
  const [formData, setFormData] = useState<PracticeLogFormData>({
    practiceDate: initialDate ? format(initialDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    location: '',
    tags: [],
    sets: [{
      id: '1',
      reps: 1,
      distance: 100,
      circleTime: 90,
      style: 'フリー'
    }],
    note: ''
  })

  const [newTag, setNewTag] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await onSubmit(formData)
      // フォームリセット
      setFormData({
        practiceDate: format(new Date(), 'yyyy-MM-dd'),
        location: '',
        tags: [],
        sets: [{
          id: '1',
          reps: 1,
          distance: 100,
          circleTime: 90,
          style: 'フリー'
        }],
        note: ''
      })
      setNewTag('')
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

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }))
    }
    setNewTag('')
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
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
                練習記録を追加
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

            {/* タグ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                練習タグ
              </label>
              <div className="space-y-3">
                {/* 選択済みタグ */}
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* よく使うタグ */}
                <div className="flex flex-wrap gap-2">
                  {COMMON_TAGS.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addTag(tag)}
                      disabled={formData.tags.includes(tag)}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {/* カスタムタグ追加 */}
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="カスタムタグを追加"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={() => addTag(newTag)}
                    variant="outline"
                    disabled={!newTag || formData.tags.includes(newTag)}
                  >
                    追加
                  </Button>
                </div>
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
                          onChange={(e) => updateSet(set.id, 'reps', parseInt(e.target.value) || 1)}
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
                          onChange={(e) => updateSet(set.id, 'distance', parseInt(e.target.value) || 100)}
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
                          onChange={(e) => updateSet(set.id, 'circleTime', parseInt(e.target.value) || 90)}
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
    </div>
  )
}
