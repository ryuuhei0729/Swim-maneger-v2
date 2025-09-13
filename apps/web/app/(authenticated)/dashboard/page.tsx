'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts'
import Calendar from './_components/Calendar'
import PracticeLogForm from '@/components/forms/PracticeLogForm'
import RecordForm from '@/components/forms/RecordForm'
import { useMutation, useQuery } from '@apollo/client/react'
import { gql } from '@apollo/client'
import { CREATE_PRACTICE_LOG, CREATE_RECORD, DELETE_PRACTICE_LOG, DELETE_RECORD, UPDATE_PRACTICE_LOG, UPDATE_RECORD, CREATE_PRACTICE_TIME, UPDATE_PRACTICE_TIME, DELETE_PRACTICE_TIME, CREATE_COMPETITION } from '@/graphql/mutations'
import { GET_CALENDAR_DATA, GET_STYLES, GET_PRACTICE_LOG, GET_RECORD, GET_PRACTICE_LOGS, GET_RECORDS } from '@/graphql/queries'

export default function DashboardPage() {
  const { profile } = useAuth()
  const [showPracticeForm, setShowPracticeForm] = useState(false)
  const [showRecordForm, setShowRecordForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [editingEntry, setEditingEntry] = useState<any>(null)
  const [editingData, setEditingData] = useState<any>(null)

  // デバッグ: editingEntryの状態変化を監視
  useEffect(() => {
    console.log('Dashboard: editingEntry changed to:', editingEntry)
  }, [editingEntry])

  // デバッグ: editingDataの状態変化を監視
  useEffect(() => {
    console.log('Dashboard: editingData changed to:', editingData)
  }, [editingData])

  // スタイルデータを取得
  const { data: stylesData } = useQuery(GET_STYLES)
  const styles = (stylesData as any)?.styles || []

  // 編集時の詳細データを取得
  const { data: practiceLogData, loading: practiceLogLoading, error: practiceLogError } = useQuery(GET_PRACTICE_LOG, {
    variables: { id: editingEntry?.id },
    skip: !editingEntry || editingEntry.entry_type !== 'practice',
  })

  // デバッグ: 練習記録データの取得状況をログ出力
  useEffect(() => {
    if (editingEntry?.entry_type === 'practice') {
      console.log('Dashboard: editingEntry for practice:', editingEntry)
      console.log('Dashboard: practiceLogData:', practiceLogData)
      console.log('Dashboard: practiceLogLoading:', practiceLogLoading)
      console.log('Dashboard: practiceLogError:', practiceLogError)
    }
  }, [editingEntry, practiceLogData, practiceLogLoading, practiceLogError])

  const { data: recordData } = useQuery(GET_RECORD, {
    variables: { id: editingEntry?.id },
    skip: !editingEntry || editingEntry.entry_type !== 'record',
  })

  // GraphQLミューテーション
  const [createPracticeLog] = useMutation(CREATE_PRACTICE_LOG, {
    optimisticResponse: (variables) => ({
      createPracticeLog: {
        __typename: 'PracticeLog',
        id: `temp-${Date.now()}`,
        userId: profile?.id,
        date: variables.input.date,
        place: variables.input.place,
        style: variables.input.style,
        repCount: variables.input.repCount,
        setCount: variables.input.setCount,
        distance: variables.input.distance,
        circle: variables.input.circle,
        note: variables.input.note,
        times: [], // 空の配列を追加
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }),
    refetchQueries: [{
      query: GET_CALENDAR_DATA,
      variables: { year: new Date().getFullYear(), month: new Date().getMonth() + 1 }
    }],
    awaitRefetchQueries: true,
    update: (cache, { data }) => {
      if (data?.createPracticeLog) {

        // GET_PRACTICE_LOGSクエリのキャッシュも更新
        try {
          const practiceLogsData = cache.readQuery({ query: GET_PRACTICE_LOGS }) as any
          if (practiceLogsData) {
            cache.writeQuery({
              query: GET_PRACTICE_LOGS,
              data: {
                myPracticeLogs: [...(practiceLogsData.myPracticeLogs || []), data.createPracticeLog]
              }
            })
          }
        } catch (error) {
          console.log('Practice logs cache update failed:', error)
        }
      }
    },
    onCompleted: () => {
      setShowPracticeForm(false)
      setSelectedDate(null)
    },
    onError: (error) => {
      console.error('練習記録の作成に失敗しました:', error)
      alert('練習記録の作成に失敗しました。')
    }
  })

  const [createRecord] = useMutation(CREATE_RECORD, {
    refetchQueries: [
      { query: GET_RECORDS },
      { 
        query: GET_CALENDAR_DATA,
        variables: { 
          year: new Date().getFullYear(), 
          month: new Date().getMonth() + 1 
        }
      }
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      setShowRecordForm(false)
      setSelectedDate(null)
    },
    onError: (error) => {
      console.error('記録の作成に失敗しました:', error)
      alert('記録の作成に失敗しました。')
    }
  })

  const [deletePracticeLog] = useMutation(DELETE_PRACTICE_LOG, {
    optimisticResponse: (variables) => ({
      deletePracticeLog: true
    }),
    refetchQueries: [{
      query: GET_CALENDAR_DATA,
      variables: { year: new Date().getFullYear(), month: new Date().getMonth() + 1 }
    }],
    awaitRefetchQueries: true,
    update: (cache, { data }, { variables }) => {
      if (data?.deletePracticeLog) {
        // キャッシュから削除されたエントリーを除去
        cache.evict({ id: `PracticeLog:${variables?.id}` })

        // GET_PRACTICE_LOGSクエリのキャッシュからも削除
        try {
          const practiceLogsData = cache.readQuery({ query: GET_PRACTICE_LOGS }) as any
          if (practiceLogsData && practiceLogsData.myPracticeLogs) {
            const filteredLogs = practiceLogsData.myPracticeLogs.filter(
              (log: any) => log.id !== variables?.id
            )
            
            cache.writeQuery({
              query: GET_PRACTICE_LOGS,
              data: {
                myPracticeLogs: filteredLogs
              }
            })
          }
        } catch (error) {
          console.log('Practice logs cache update failed:', error)
        }
        
        cache.gc() // ガベージコレクション
      }
    },
    onError: (error) => {
      console.error('練習記録の削除に失敗しました:', error)
      alert('練習記録の削除に失敗しました。')
    }
  })

  const [deleteRecord] = useMutation(DELETE_RECORD, {
    optimisticResponse: (variables) => ({
      deleteRecord: true
    }),
    refetchQueries: [{
      query: GET_CALENDAR_DATA,
      variables: { year: new Date().getFullYear(), month: new Date().getMonth() + 1 }
    }],
    awaitRefetchQueries: true,
    update: (cache, { data }, { variables }) => {
      if (data?.deleteRecord) {
        // キャッシュから削除されたエントリーを除去
        cache.evict({ id: `Record:${variables?.id}` })

        // GET_RECORDSクエリのキャッシュからも削除
        try {
          const recordsData = cache.readQuery({ query: GET_RECORDS }) as any
          if (recordsData && recordsData.myRecords) {
            const filteredRecords = recordsData.myRecords.filter(
              (record: any) => record.id !== variables?.id
            )
            
            cache.writeQuery({
              query: GET_RECORDS,
              data: {
                myRecords: filteredRecords
              }
            })
          }
        } catch (error) {
          console.log('Records cache update failed:', error)
        }
        
        cache.gc() // ガベージコレクション
      }
    },
    onError: (error) => {
      console.error('記録の削除に失敗しました:', error)
      alert('記録の削除に失敗しました。')
    }
  })

  const [updatePracticeLog] = useMutation(UPDATE_PRACTICE_LOG, {
    optimisticResponse: (variables) => ({
      updatePracticeLog: {
        __typename: 'PracticeLog',
        id: variables.id,
        userId: profile?.id,
        date: variables.input.date,
        place: variables.input.place,
        style: variables.input.style,
        repCount: variables.input.repCount,
        setCount: variables.input.setCount,
        distance: variables.input.distance,
        circle: variables.input.circle,
        note: variables.input.note,
        times: [], // 空の配列を追加
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }),
    refetchQueries: [{
      query: GET_CALENDAR_DATA,
      variables: { year: new Date().getFullYear(), month: new Date().getMonth() + 1 }
    }],
    awaitRefetchQueries: true,
    update: (cache, { data }) => {
      if (data?.updatePracticeLog) {

        // GET_PRACTICE_LOGSクエリのキャッシュも更新
        try {
          const practiceLogsData = cache.readQuery({ query: GET_PRACTICE_LOGS }) as any
          if (practiceLogsData && practiceLogsData.myPracticeLogs) {
            const updatedLogs = practiceLogsData.myPracticeLogs.map((log: any) => {
              if (log.id === data.updatePracticeLog.id) {
                return data.updatePracticeLog
              }
              return log
            })
            
            cache.writeQuery({
              query: GET_PRACTICE_LOGS,
              data: {
                myPracticeLogs: updatedLogs
              }
            })
          }
        } catch (error) {
          console.log('Practice logs cache update failed:', error)
        }

        // 特定の練習記録のキャッシュも更新
        cache.writeFragment({
          id: `PracticeLog:${data.updatePracticeLog.id}`,
          fragment: gql`
            fragment UpdatedPracticeLog on PracticeLog {
              id
              userId
              date
              place
              style
              repCount
              setCount
              distance
              circle
              note
              times {
                id
                repNumber
                setNumber
                time
              }
            }
          `,
          data: data.updatePracticeLog
        })
      }
    },
    onError: (error) => {
      console.error('練習記録の更新に失敗しました:', error)
      alert('練習記録の更新に失敗しました。')
    }
  })

  const [createPracticeTime] = useMutation(CREATE_PRACTICE_TIME)
  const [updatePracticeTime] = useMutation(UPDATE_PRACTICE_TIME)
  const [deletePracticeTime] = useMutation(DELETE_PRACTICE_TIME)
  const [createCompetition] = useMutation(CREATE_COMPETITION)

  const [updateRecord] = useMutation(UPDATE_RECORD, {
    optimisticResponse: (variables) => ({
      updateRecord: {
        __typename: 'Record',
        id: variables.id,
        userId: profile?.id,
        competitionId: null,
        styleId: variables.input.styleId,
        time: variables.input.time,
        videoUrl: variables.input.videoUrl,
        note: variables.input.note,
        style: styles.find(s => s.id === variables.input.styleId) || null,
        competition: null
      }
    }),
    refetchQueries: [{
      query: GET_CALENDAR_DATA,
      variables: { year: new Date().getFullYear(), month: new Date().getMonth() + 1 }
    }],
    awaitRefetchQueries: true,
    update: (cache, { data }) => {
      if (data?.updateRecord) {

        // GET_RECORDSクエリのキャッシュも更新
        try {
          const recordsData = cache.readQuery({ query: GET_RECORDS }) as any
          if (recordsData && recordsData.myRecords) {
            const updatedRecords = recordsData.myRecords.map((record: any) => {
              if (record.id === data.updateRecord.id) {
                return data.updateRecord
              }
              return record
            })
            
            cache.writeQuery({
              query: GET_RECORDS,
              data: {
                myRecords: updatedRecords
              }
            })
          }
        } catch (error) {
          console.log('Records cache update failed:', error)
        }

        // 特定の記録のキャッシュも更新
        cache.writeFragment({
          id: `Record:${data.updateRecord.id}`,
          fragment: gql`
            fragment UpdatedRecord on Record {
              id
              userId
              competitionId
              styleId
              time
              videoUrl
              note
            }
          `,
          data: data.updateRecord
        })
      }
    },
    onError: (error) => {
      console.error('記録の更新に失敗しました:', error)
      alert('記録の更新に失敗しました。')
    }
  })

  // 詳細データが取得されたときにeditingDataを更新
  useEffect(() => {
    console.log('Dashboard: useEffect triggered for editingData:', {
      editingEntry,
      practiceLogData,
      recordData,
      hasPracticeLog: !!(practiceLogData as any)?.practiceLog,
      hasRecord: !!(recordData as any)?.record
    })
    
    if (editingEntry && editingEntry.entry_type === 'practice' && (practiceLogData as any)?.practiceLog) {
      const log = (practiceLogData as any).practiceLog
      console.log('Dashboard: Setting practice log data:', log)
      console.log('Dashboard: Practice log times:', log.times)
      const newEditingData = {
        id: log.id,
        date: log.date, // PracticeLogFormが期待するフィールド名
        place: log.place, // PracticeLogFormが期待するフィールド名
        style: log.style,
        repCount: log.repCount,
        setCount: log.setCount,
        distance: log.distance,
        circle: log.circle,
        note: log.note,
        times: log.times || []
      }
      console.log('Dashboard: New editing data for practice:', newEditingData)
      setEditingData(newEditingData)
      console.log('Dashboard: editingData has been set')
    } else if (editingEntry && editingEntry.entry_type === 'record' && (recordData as any)?.record) {
      const record = (recordData as any).record
      console.log('Setting record data:', record)
      const newEditingData = {
        id: record.id,
        recordDate: record.competition?.date || new Date().toISOString().split('T')[0],
        location: record.competition?.title || '',
        competitionName: record.competition?.title || '',
        styleId: record.styleId,
        time: record.time,
        videoUrl: record.videoUrl,
        note: record.note,
        competition: record.competition,
        style: record.style
      }
      console.log('New editing data for record:', newEditingData)
      setEditingData(newEditingData)
    } else {
      console.log('No data to set, clearing editingData')
      setEditingData(null)
    }
  }, [editingEntry, practiceLogData, recordData])

  // デバッグ: PracticeLogFormが開かれる時の状態をログ出力
  useEffect(() => {
    if (showPracticeForm) {
      console.log('Dashboard: PracticeLogForm is opening with editingData:', editingData)
    }
  }, [showPracticeForm, editingData])

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
  }

  const handleAddEntry = (date: Date, type: 'practice' | 'record') => {
    setSelectedDate(date)
    setEditingEntry(null)
    setEditingData(null)
    if (type === 'practice') {
      setShowPracticeForm(true)
    } else {
      setShowRecordForm(true)
    }
  }

  const handleEditEntry = (entry: any) => {
    console.log('Dashboard: handleEditEntry called with:', entry)
    console.log('Dashboard: Setting editingEntry to:', entry)
    setEditingEntry(entry)
    setEditingData(null) // 編集データをリセット
    setSelectedDate(new Date(entry.entry_date))
    if (entry.entry_type === 'practice') {
      console.log('Dashboard: Opening practice form for editing')
      setShowPracticeForm(true)
    } else {
      setShowRecordForm(true)
    }
  }

  const handlePracticeSubmit = async (formData: any) => {
    setIsLoading(true)
    try {
      const input = {
        date: formData.practiceDate,
        place: formData.location,
        style: formData.sets[0]?.style || 'フリー',
        repCount: formData.sets.reduce((sum: number, set: any) => sum + set.reps, 0),
        setCount: formData.sets.length,
        distance: formData.sets.reduce((sum: number, set: any) => sum + (set.distance * set.reps), 0),
        circle: formData.sets[0]?.circleTime || null,
        note: formData.note
      }

      let practiceLogId: string | null = null

      if (editingData && editingEntry?.entry_type === 'practice') {
        // 更新処理
        const result = await updatePracticeLog({
          variables: {
            id: editingEntry.id,
            input
          }
        })
        practiceLogId = editingEntry.id
      } else {
        // 作成処理
        const result = await createPracticeLog({
          variables: { input }
        })
        practiceLogId = (result.data as any)?.createPracticeLog?.id
      }

      // タイムデータの管理
      if (practiceLogId && formData.sets) {
        // 編集時は既存のタイムデータを削除
        if (editingEntry && editingEntry.times && editingEntry.times.length > 0) {
          for (const existingTime of editingEntry.times) {
            try {
              await deletePracticeTime({
                variables: { id: existingTime.id }
              })
            } catch (deleteError) {
              console.error('既存タイム記録の削除でエラーが発生しました:', deleteError)
            }
          }
        }

        // 新しいタイムデータを作成
        for (const set of formData.sets) {
          if (set.times && set.times.length > 0) {
            for (const timeRecord of set.times) {
              if (timeRecord.time > 0) {
                try {
                  await createPracticeTime({
                    variables: {
                      input: {
                        practiceLogId: practiceLogId,
                        repNumber: timeRecord.repNumber,
                        setNumber: timeRecord.setNumber,
                        time: timeRecord.time
                      }
                    }
                  })
                } catch (timeError) {
                  console.error('タイム記録の保存でエラーが発生しました:', timeError)
                  // タイムの保存に失敗してもメインの練習記録は保存されているので、警告のみ
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('練習記録の保存に失敗しました:', error)
      alert('練習記録の保存に失敗しました。エラー内容をコンソールで確認してください。')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRecordSubmit = async (formData: any) => {
    setIsLoading(true)
    try {
      let competitionId = null

      // 大会情報が入力されている場合、先に大会を作成
      if (formData.competitionName && formData.location) {
        const competitionInput = {
          title: formData.competitionName,
          date: formData.recordDate,
          place: formData.location,
          poolType: formData.poolType,
          note: ''
        }

        const competitionResult = await createCompetition({
          variables: { input: competitionInput }
        })
        
        competitionId = (competitionResult.data as any)?.createCompetition?.id
      }

      const recordInput = {
        styleId: parseInt(formData.styleId),
        time: formData.time,
        videoUrl: formData.videoUrl,
        note: formData.note,
        competitionId: competitionId
      }

      if (editingData && editingEntry?.entry_type === 'record') {
        // 更新処理
        await updateRecord({
          variables: {
            id: editingEntry.id,
            input: recordInput
          }
        })
      } else {
        // 作成処理
        await createRecord({
          variables: { input: recordInput }
        })
      }
    } catch (error) {
      console.error('大会記録の保存に失敗しました:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteEntry = async (entryId: string, entryType?: 'practice' | 'record') => {
    if (!entryType) {
      console.error('エントリータイプが不明です')
      return
    }

    try {
      if (entryType === 'practice') {
        await deletePracticeLog({
          variables: { id: entryId }
        })
      } else {
        await deleteRecord({
          variables: { id: entryId }
        })
      }
      
      // 削除成功の通知
      console.log('記録が正常に削除されました')
    } catch (error) {
      console.error('記録の削除に失敗しました:', error)
      alert('記録の削除に失敗しました。')
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
          onDateClick={handleDateClick}
          onAddEntry={handleAddEntry} 
          onEditEntry={handleEditEntry}
          onDeleteEntry={handleDeleteEntry}
        />
      </div>

      {/* 練習記録フォーム */}
      <PracticeLogForm
        isOpen={showPracticeForm}
        onClose={() => {
          setShowPracticeForm(false)
          setSelectedDate(null)
          setEditingEntry(null)
          setEditingData(null)
        }}
        onSubmit={handlePracticeSubmit}
        initialDate={selectedDate}
        editData={editingData}
        isLoading={isLoading}
      />

      {/* 大会記録フォーム */}
      <RecordForm
        isOpen={showRecordForm}
        onClose={() => {
          setShowRecordForm(false)
          setSelectedDate(null)
          setEditingEntry(null)
          setEditingData(null)
        }}
        onSubmit={handleRecordSubmit}
        initialDate={selectedDate}
        editData={editingData}
        isLoading={isLoading}
        styles={styles}
      />
    </div>
  )
}
