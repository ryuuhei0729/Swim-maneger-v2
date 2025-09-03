'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts'
import DashboardStats, { UpcomingEventsList } from './_components/DashboardStats'
import { PersonalCalendar } from './_components'
import { PracticeLogForm, RecordForm } from '@/components/forms'
import Link from 'next/link'
import { 
  UsersIcon,
  ChartBarIcon,
  TrophyIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  FlagIcon
} from '@heroicons/react/24/outline'

export default function DashboardPage() {
  const { profile } = useAuth()
  const [showPracticeForm, setShowPracticeForm] = useState(false)
  const [showRecordForm, setShowRecordForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // 個人利用機能用のカード（role=playerの場合のメイン機能）
  const personalCards = [
    {
      title: '練習記録',
      description: '日々の練習内容を記録・分析します',
      icon: ChartBarIcon,
      href: '/practice',
      color: 'bg-green-500'
    },
    {
      title: '大会記録',
      description: '大会結果とベストタイムを管理します',
      icon: TrophyIcon,
      href: '/records',
      color: 'bg-blue-500'
    },
    {
      title: '目標管理',
      description: '個人目標を設定・追跡します',
      icon: FlagIcon,
      href: '/goals',
      color: 'bg-indigo-500'
    }
  ]

  // チーム管理機能用のカード（coach, manager, director用）
  const teamCards = [
    {
      title: '選手管理',
      description: '選手の情報やパフォーマンスを管理します',
      icon: UsersIcon,
      href: '/members',
      color: 'bg-blue-500'
    },
    {
      title: 'スケジュール',
      description: '練習や大会のスケジュールを管理します',
      icon: CalendarDaysIcon,
      href: '/schedule',
      color: 'bg-purple-500'
    },
    {
      title: '出欠管理',
      description: '練習や大会の出欠状況を管理します',
      icon: ClipboardDocumentListIcon,
      href: '/attendance',
      color: 'bg-red-500'
    }
  ]

  // ロールに基づいてカードを選択
  const dashboardCards = profile?.role === 'player' 
    ? [...personalCards, ...teamCards] 
    : [...teamCards, ...personalCards]

  // カレンダー用のダミーデータ（後でGraphQLに置き換え）
  const calendarEntries = [
    {
      id: '1',
      entry_type: 'practice' as const,
      entry_date: '2024-01-15',
      title: '練習: 自由形 1500m',
      location: '市営プール'
    },
    {
      id: '2',
      entry_type: 'record' as const,
      entry_date: '2024-01-20',
      title: '50m自由形: 26.45s',
      location: '県立水泳場',
      time_result: 26.45,
      pool_type: 1
    }
  ]

  // ダミーの泳法データ（後でGraphQLに置き換え）
  const styles = [
    { id: '1', name_jp: '50m自由形', distance: 50 },
    { id: '2', name_jp: '100m自由形', distance: 100 },
    { id: '3', name_jp: '200m自由形', distance: 200 },
    { id: '4', name_jp: '50m背泳ぎ', distance: 50 },
    { id: '5', name_jp: '100m背泳ぎ', distance: 100 },
    { id: '6', name_jp: '50m平泳ぎ', distance: 50 },
    { id: '7', name_jp: '100m平泳ぎ', distance: 100 },
    { id: '8', name_jp: '50mバタフライ', distance: 50 },
    { id: '9', name_jp: '100mバタフライ', distance: 100 }
  ]

  const handleDateClick = (date: Date) => {
    console.log('Date clicked:', date)
    setSelectedDate(date)
    // TODO: 日付詳細表示の実装
  }

  const handleAddEntry = (date: Date, type: 'practice' | 'record') => {
    setSelectedDate(date)
    if (type === 'practice') {
      setShowPracticeForm(true)
    } else {
      setShowRecordForm(true)
    }
  }

  const handlePracticeSubmit = async (data: any) => {
    console.log('Practice data:', data)
    // TODO: GraphQL mutationで練習記録を保存
    alert('練習記録を保存しました（ダミー）')
  }

  const handleRecordSubmit = async (data: any) => {
    console.log('Record data:', data)
    // TODO: GraphQL mutationで大会記録を保存
    alert('大会記録を保存しました（ダミー）')
  }

  const handleEditEntry = (entry: any) => {
    console.log('Edit entry:', entry)
    // TODO: 編集フォームを開く
    if (entry.entry_type === 'practice') {
      setShowPracticeForm(true)
    } else {
      setShowRecordForm(true)
    }
  }

  const handleDeleteEntry = async (entryId: string) => {
    console.log('Delete entry:', entryId)
    // TODO: GraphQL mutationで記録を削除
    alert('記録を削除しました（ダミー）')
  }

  return (
    <div className="space-y-6">
      {/* ウェルカムセクション */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {profile?.role === 'player' ? 'マイホーム' : 'ダッシュボード'}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              おかえりなさい、{profile?.name || 'ユーザー'}さん
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">役割</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {profile?.role || 'ロード中...'}
            </span>
          </div>
        </div>
      </div>

      {/* 個人利用機能: カレンダー（playerロールの場合メイン表示） */}
      {profile?.role === 'player' && (
        <PersonalCalendar
          entries={calendarEntries}
          onDateClick={handleDateClick}
          onAddEntry={handleAddEntry}
          onEditEntry={handleEditEntry}
          onDeleteEntry={handleDeleteEntry}
        />
      )}

      {/* GraphQL統計情報 */}
      <DashboardStats />

      {/* 機能カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card) => (
          <Link key={card.title} href={card.href}>
            <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 cursor-pointer group">
              <div className="p-6">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 p-3 rounded-lg ${card.color}`}>
                    <card.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* チーム機能: 今後のイベント（コーチ・マネージャー向け） */}
      {profile?.role !== 'player' && <UpcomingEventsList />}

      {/* フォームモーダル */}
      <PracticeLogForm
        isOpen={showPracticeForm}
        onClose={() => setShowPracticeForm(false)}
        onSubmit={handlePracticeSubmit}
        initialDate={selectedDate || undefined}
      />

      <RecordForm
        isOpen={showRecordForm}
        onClose={() => setShowRecordForm(false)}
        onSubmit={handleRecordSubmit}
        initialDate={selectedDate || undefined}
        styles={styles}
      />
    </div>
  )
}
