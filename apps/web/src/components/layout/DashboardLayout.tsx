'use client'

import React, { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleSidebarClose = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ヘッダー */}
      <Header onMenuClick={handleMenuClick} />

      <div className="flex flex-1">
        {/* サイドバー */}
        <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />

        {/* メインコンテンツエリア */}
        <div className="flex-1 flex flex-col lg:pl-0">
          <main className="flex-1">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
          
          {/* フッター */}
          <Footer />
        </div>
      </div>
    </div>
  )
}
