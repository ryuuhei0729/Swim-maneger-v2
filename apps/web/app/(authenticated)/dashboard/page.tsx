'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts'
import Calendar from './_components/Calendar'
import PracticeLogForm from '@/components/forms/PracticeLogForm'
import RecordForm from '@/components/forms/RecordForm'
import { useMutation, useQuery } from '@apollo/client/react'
import { CREATE_PRACTICE_LOG, CREATE_RECORD } from '@/graphql/mutations'
import { GET_CALENDAR_DATA, GET_STYLES } from '@/graphql/queries'

export default function DashboardPage() {
  const { profile } = useAuth()
  const [showPracticeForm, setShowPracticeForm] = useState(false)
  const [showRecordForm, setShowRecordForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [editingEntry, setEditingEntry] = useState<any>(null)

  // スタイルデータを取得
  const { data: stylesData } = useQuery(GET_STYLES)
  const styles = (stylesData as any)?.styles || []

  // GraphQLミューテーション
  const [createPracticeLog] = useMutation(CREATE_PRACTICE_LOG, {
    refetchQueries: [GET_CALENDAR_DATA],
    onCompleted: () => {
      setShowPracticeForm(false)
      setSelectedDate(null)
    }
  })

  const [createRecord] = useMutation(CREATE_RECORD, {
    refetchQueries: [GET_CALENDAR_DATA],
    onCompleted: () => {
      setShowRecordForm(false)
      setSelectedDate(null)
    }
  })

  const handleAddEntry = (date: Date, type: 'practice' | 'record') => {
    setSelectedDate(date)
    setEditingEntry(null)
    if (type === 'practice') {
      setShowPracticeForm(true)
    } else {
      setShowRecordForm(true)
    }
  }

  const handleEditEntry = (entry: any) => {
    setEditingEntry(entry)
    setSelectedDate(new Date(entry.entry_date))
    if (entry.entry_type === 'practice') {
      setShowPracticeForm(true)
    } else {
      setShowRecordForm(true)
    }
  }

  const handlePracticeSubmit = async (formData: any) => {
    setIsLoading(true)
    try {
      await createPracticeLog({
        variables: {
          input: {
            date: formData.practiceDate,
            place: formData.location,
            tagIds: formData.tags || [], 
            style: formData.sets[0]?.style || 'フリー',
            repCount: formData.sets.reduce((sum: number, set: any) => sum + set.reps, 0),
            setCount: formData.sets.length,
            distance: formData.sets.reduce((sum: number, set: any) => sum + (set.distance * set.reps), 0),
            circle: formData.sets[0]?.circleTime || null,
            note: formData.note
          }
        }
      })
    } catch (error) {
      console.error('練習記録の保存に失敗しました:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRecordSubmit = async (formData: any) => {
    setIsLoading(true)
    try {
      await createRecord({
        variables: {
          input: {
            styleId: formData.styleId,
            time: formData.time,
            videoUrl: formData.videoUrl,
            note: formData.note
          }
        }
      })
    } catch (error) {
      console.error('大会記録の保存に失敗しました:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">
        {/* ページヘッダー */}
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            ダッシュボード
          </h1>
          <p className="text-gray-600">
            {profile?.name || 'ユーザー'}さん、お疲れ様です！
          </p>
        </div>
        
        {/* カレンダーコンポーネント */}
        <Calendar 
          onAddEntry={handleAddEntry} 
          onEditEntry={handleEditEntry}
        />
      </div>

      {/* 練習記録フォーム */}
      <PracticeLogForm
        isOpen={showPracticeForm}
        onClose={() => {
          setShowPracticeForm(false)
          setSelectedDate(null)
          setEditingEntry(null)
        }}
        onSubmit={handlePracticeSubmit}
        initialDate={selectedDate}
        editData={editingEntry}
        isLoading={isLoading}
      />

      {/* 大会記録フォーム */}
      <RecordForm
        isOpen={showRecordForm}
        onClose={() => {
          setShowRecordForm(false)
          setSelectedDate(null)
          setEditingEntry(null)
        }}
        onSubmit={handleRecordSubmit}
        initialDate={selectedDate}
        editData={editingEntry}
        isLoading={isLoading}
        styles={styles}
      />
    </div>
  )
}
