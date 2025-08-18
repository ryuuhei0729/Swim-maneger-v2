'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navigation } from '@/components/layout/Navigation'
import { useAuth, useAuthLoading } from '@/hooks/useAuth'

interface LayoutProps {
  children: React.ReactNode
  title?: string
}

export const Layout: React.FC<LayoutProps> = ({ children, title = 'Home' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const isLoading = useAuthLoading()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  // ローディング中はローディング表示
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  // 認証済みユーザー用のレイアウト（サイドバー付き）
  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen">
        {/* サイドバー */}
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

        {/* メインコンテンツエリア */}
        <div className="flex-1 flex flex-col md:pl-64 w-full">
          {/* ナビゲーション */}
          <Navigation onMenuClick={toggleSidebar} />
          
          {/* ヘッダー */}
          <Header title={title} onMenuClick={toggleSidebar} />

          {/* メインコンテンツ */}
          <main className="flex-1 overflow-y-auto bg-gray-50 relative">
            <div className="max-w-full px-0 md:px-4 md:px-8 py-8">
              {children}
            </div>
          </main>
        </div>

        {/* オーバーレイ（モバイル用） */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
            onClick={closeSidebar}
          />
        )}
      </div>
    )
  }

  // 未認証ユーザー用のレイアウト（ナビゲーションのみ）
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ナビゲーション */}
      <Navigation onMenuClick={toggleSidebar} />
      
      {/* メインコンテンツ */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
