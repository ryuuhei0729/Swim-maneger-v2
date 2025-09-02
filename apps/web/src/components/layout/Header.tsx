'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers'
import { Bars3Icon, BellIcon, UserCircleIcon } from '@heroicons/react/24/outline'

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, profile, signOut } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
    router.push('/login')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* モバイルメニューボタン */}
        <div className="flex items-center">
          <button
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            onClick={onMenuClick}
          >
            <span className="sr-only">メニューを開く</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          
          {/* ロゴ・タイトル */}
          <div className="flex items-center ml-4 lg:ml-0">
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              水泳選手マネジメント
            </h1>
          </div>
        </div>

        {/* 右側のユーザー情報・通知 */}
        <div className="flex items-center space-x-4">
          {/* 通知アイコン */}
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span className="sr-only">通知を表示</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* ユーザー情報ドロップダウン */}
          <div className="relative inline-block text-left">
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium text-gray-900">
                  {profile?.name || user?.email || 'ユーザー'}
                </div>
                <div className="text-xs text-gray-500">
                  {profile?.role || 'ロード中...'}
                </div>
              </div>
              <button
                type="button"
                className="flex items-center p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={handleLogout}
              >
                <span className="sr-only">ユーザーメニュー</span>
                <UserCircleIcon className="h-8 w-8" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
