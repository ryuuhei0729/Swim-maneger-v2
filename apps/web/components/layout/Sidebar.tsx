'use client'

import React from 'react'
import type { ComponentType, SVGProps } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts'
import { 
  HomeIcon,
  UsersIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  TrophyIcon,
  FlagIcon,
  SpeakerWaveIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  XMarkIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface NavigationItem {
  name: string
  href: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  badge?: number
  description?: string
  roles?: string[] // どのロールがアクセスできるか
}

const navigation: NavigationItem[] = [
  { 
    name: 'ダッシュボード', 
    href: '/dashboard', 
    icon: HomeIcon, 
    description: 'システム概要と最新情報',
    roles: ['player', 'coach', 'manager', 'director']
  },
  { 
    name: 'メンバー管理', 
    href: '/members', 
    icon: UsersIcon,
    description: 'チームメンバーの管理',
    roles: ['coach', 'manager', 'director']
  },
  { 
    name: 'スケジュール', 
    href: '/schedule', 
    icon: CalendarDaysIcon,
    description: '練習・大会の予定管理',
    roles: ['player', 'coach', 'manager', 'director']
  },
  { 
    name: '出欠管理', 
    href: '/attendance', 
    icon: ClipboardDocumentListIcon,
    description: '練習・大会の出席状況',
    roles: ['coach', 'manager', 'director']
  },
  { 
    name: '練習記録', 
    href: '/practice', 
    icon: ChartBarIcon,
    description: '練習内容とタイム記録',
    roles: ['player', 'coach', 'manager', 'director']
  },
  { 
    name: '大会管理', 
    href: '/competitions', 
    icon: TrophyIcon,
    description: '大会結果とエントリー',
    roles: ['coach', 'manager', 'director']
  },
  { 
    name: '記録管理', 
    href: '/records', 
    icon: TrophyIcon,
    description: '個人の大会記録とベストタイム',
    roles: ['player']
  },
  { 
    name: '目標管理', 
    href: '/goals', 
    icon: FlagIcon,
    description: '個人・チーム目標の設定',
    roles: ['player', 'coach', 'manager', 'director']
  },
  { 
    name: 'お知らせ', 
    href: '/announcements', 
    icon: SpeakerWaveIcon, 
    badge: 3,
    description: 'チームからのお知らせ',
    roles: ['player', 'coach', 'manager', 'director']
  },
  { 
    name: '設定', 
    href: '/settings', 
    icon: Cog6ToothIcon,
    description: 'システム設定とプロフィール',
    roles: ['player', 'coach', 'manager', 'director']
  },
]

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { profile } = useAuth()

  // ユーザーのロールに基づいてナビゲーションをフィルタリング
  const filteredNavigation = navigation.filter(item => 
    !item.roles || item.roles.includes(profile?.role || 'player')
  )

  const getRoleDisplayName = (role: string) => {
    const roleMap: { [key: string]: string } = {
      'player': '選手',
      'coach': 'コーチ',
      'manager': 'マネージャー',
      'director': '監督'
    }
    return roleMap[role] || role
  }

  return (
    <>
      {/* モバイル用オーバーレイ */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* サイドバー */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:w-64
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* モバイル用ヘッダー */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 lg:hidden">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">🏊</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">メニュー</span>
          </div>
          <button
            type="button"
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
            onClick={onClose}
          >
            <span className="sr-only">サイドバーを閉じる</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* ユーザー情報（デスクトップ用） */}
        <div className="hidden lg:block p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">🏊</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {profile?.name || 'ユーザー'}
              </p>
              <p className="text-xs text-gray-500">
                {profile?.role ? getRoleDisplayName(profile.role) : 'ロード中...'}
              </p>
            </div>
          </div>
        </div>

        {/* ナビゲーション */}
        <nav className="mt-6 lg:mt-4 px-3">
          <div className="space-y-2">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <div key={item.name} className="group">
                  <Link
                    href={item.href}
                    className={`
                      group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 relative
                      ${isActive
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border-l-4 border-blue-500'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-sm'
                      }
                    `}
                    onClick={onClose}
                  >
                    <item.icon
                      className={`
                        mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200
                        ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}
                      `}
                      aria-hidden="true"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="truncate">{item.name}</span>
                        <div className="flex items-center space-x-2">
                          {item.badge && (
                            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                              {item.badge > 9 ? '9+' : item.badge}
                            </span>
                          )}
                          {!isActive && (
                            <ChevronRightIcon className="h-4 w-4 text-gray-300 group-hover:text-gray-400 transition-colors duration-200" />
                          )}
                        </div>
                      </div>
                      {item.description && (
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        </nav>

        {/* フッター情報 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-center">
            <div className="text-xs font-medium text-gray-600">
              水泳選手マネジメントシステム
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Version 1.0.0 • {new Date().getFullYear()}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Made with ❤️ for swimmers
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
