'use client'

import { useRouter } from 'next/navigation'
import { AuthGuard } from '@/components/auth'
import { useAuth } from '@/components/providers'

export default function DashboardPage() {
  const { user, profile, signOut } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
    router.push('/login')
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  水泳選手マネジメントシステム
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-700">
                  {profile?.name || user?.email}
                  <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {profile?.role || 'ユーザー'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  ログアウト
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  ダッシュボード
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  水泳選手マネジメントシステムへようこそ！
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      選手管理
                    </h3>
                    <p className="text-gray-600">
                      選手の情報やパフォーマンスを管理します
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      練習記録
                    </h3>
                    <p className="text-gray-600">
                      日々の練習内容を記録・分析します
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      大会管理
                    </h3>
                    <p className="text-gray-600">
                      大会情報や記録を管理します
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
