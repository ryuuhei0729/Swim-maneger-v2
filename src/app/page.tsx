'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/providers'

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            水泳選手マネジメントシステム
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            水泳チームの選手、コーチ、監督、マネージャーが効率的にチーム運営を行えるWebアプリケーション
          </p>
          <div className="space-x-4">
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium inline-block"
            >
              ログイン
            </Link>
            <Link
              href="/signup"
              className="bg-white hover:bg-gray-50 text-blue-600 px-8 py-3 rounded-lg text-lg font-medium border border-blue-600 inline-block"
            >
              新規登録
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-blue-600 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">選手管理</h2>
            <p className="text-gray-600">選手の情報管理、プロフィール設定、パフォーマンス追跡を行います</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-blue-600 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">スケジュール管理</h2>
            <p className="text-gray-600">練習・大会のスケジュール管理と出席管理を効率的に行います</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-blue-600 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">練習記録</h2>
            <p className="text-gray-600">日々の練習内容、タイム記録、進捗管理を詳細に追跡します</p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">主な機能</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold mb-2 text-gray-900">チーム管理</h4>
              <p className="text-gray-600">選手、コーチ、スタッフの情報を一元管理</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold mb-2 text-gray-900">パフォーマンス分析</h4>
              <p className="text-gray-600">タイムの推移やトレーニング効果を可視化</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold mb-2 text-gray-900">コミュニケーション</h4>
              <p className="text-gray-600">チーム内のメッセージやお知らせ機能</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold mb-2 text-gray-900">大会管理</h4>
              <p className="text-gray-600">大会エントリーや結果管理を効率化</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
