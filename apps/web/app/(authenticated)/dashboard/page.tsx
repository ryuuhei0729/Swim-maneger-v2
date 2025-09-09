'use client'

import { useAuth } from '@/contexts'
import Calendar from './_components/Calendar'

export default function DashboardPage() {
  const { profile } = useAuth()

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
        <Calendar />
      </div>
    </div>
  )
}
