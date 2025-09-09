'use client'

import { useAuth } from '@/contexts'

export default function DashboardPage() {
  const { profile } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ようこそ！
          </h1>
          <p className="text-xl text-gray-600">
            {profile?.name || 'ユーザー'}さん
          </p>
        </div>
        
        <div className="text-sm text-gray-500">
          <p>Swim Manager v2へようこそ</p>
          <p className="mt-1">左のメニューから機能を選択してください</p>
        </div>
      </div>
    </div>
  )
}
