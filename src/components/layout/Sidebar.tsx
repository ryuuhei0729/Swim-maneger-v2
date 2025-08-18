'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useAuth, useAuthLoading } from '@/hooks/useAuth'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname()
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const isLoading = useAuthLoading()

  const isActive = (path: string) => {
    return pathname === path
  }

  const getActiveClass = (path: string) => {
    return isActive(path) ? 'bg-blue-900 text-white' : 'text-blue-100 hover:bg-blue-700'
  }

  // ローディング中または未認証の場合はサイドバーを表示しない
  if (isLoading || !isAuthenticated) {
    return null
  }

  return (
    <>
      {/* サイドバー */}
      <div 
        className={`w-64 bg-blue-800 text-white flex-shrink-0 fixed h-full z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:transform-none`}
      >
        {/* ロゴ部分 */}
        <div className="p-4">
          <Link href="/" className="flex items-center">
            <h1 className="text-xl font-bold">Swim Manager</h1>
          </Link>
        </div>

        {/* ナビゲーションリンク */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          <Link 
            href="/" 
            className={`flex items-center px-4 py-2 rounded-lg ${getActiveClass('/')}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </Link>

          <Link 
            href="/practice" 
            className={`flex items-center px-4 py-2 rounded-lg ${getActiveClass('/practice')}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Practice
          </Link>

          <Link 
            href="/races" 
            className={`flex items-center px-4 py-2 rounded-lg ${getActiveClass('/races')}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Race
          </Link>

          <Link 
            href="/users" 
            className={`flex items-center px-4 py-2 rounded-lg ${getActiveClass('/users')}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Member
          </Link>

          <Link 
            href="/objectives" 
            className={`flex items-center px-4 py-2 rounded-lg ${getActiveClass('/objectives')}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Objective
          </Link>

          <Link 
            href="/attendance" 
            className={`flex items-center px-4 py-2 rounded-lg ${getActiveClass('/attendance')}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Attendance
          </Link>

          <Link 
            href="/mypage" 
            className={`flex items-center px-4 py-2 rounded-lg ${getActiveClass('/mypage')}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Mypage
          </Link>

          {/* 管理者メニュー（仮で常に表示） */}
          <div className="relative group">
            <button 
              onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
              className="flex items-center px-4 py-2 text-blue-100 rounded-lg hover:bg-blue-700 w-full text-left"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="flex-1">Admin</span>
              <svg className={`w-4 h-4 ml-2 transition-transform duration-200 ${adminDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* ドロップダウンメニュー */}
            {adminDropdownOpen && (
              <div className="absolute left-0 top-full mt-1 w-64 bg-blue-900 border border-blue-700 rounded-lg shadow-lg z-10">
                <div className="py-2">
                  <Link href="/admin/users" className="flex items-center px-4 py-2 text-sm text-blue-100 hover:bg-blue-800 transition-colors duration-150">
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    ユーザー管理
                  </Link>
                  
                  <Link href="/admin/schedules" className="flex items-center px-4 py-2 text-sm text-blue-100 hover:bg-blue-800 transition-colors duration-150">
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    スケジュール管理
                  </Link>
                  
                  <Link href="/admin/objectives" className="flex items-center px-4 py-2 text-sm text-blue-100 hover:bg-blue-800 transition-colors duration-150">
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 4h.01M9 16h.01" />
                    </svg>
                    目標管理
                  </Link>
                  
                  <Link href="/admin/announcements" className="flex items-center px-4 py-2 text-sm text-blue-100 hover:bg-blue-800 transition-colors duration-150">
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                    お知らせ管理
                  </Link>
                  
                  <Link href="/admin/attendance" className="flex items-center px-4 py-2 text-sm text-blue-100 hover:bg-blue-800 transition-colors duration-150">
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    出欠管理
                  </Link>
                  
                  <Link href="/admin/practices" className="flex items-center px-4 py-2 text-sm text-blue-100 hover:bg-blue-800 transition-colors duration-150">
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    練習管理
                  </Link>
                  
                  <Link href="/admin/competitions" className="flex items-center px-4 py-2 text-sm text-blue-100 hover:bg-blue-800 transition-colors duration-150">
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    大会管理
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </>
  )
}
