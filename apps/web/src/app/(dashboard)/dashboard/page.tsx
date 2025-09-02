'use client'

import { useAuth } from '@/components/providers'
import DashboardStats, { UpcomingEventsList } from '@/components/dashboard/DashboardStats'
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

  const dashboardCards = [
    {
      title: '選手管理',
      description: '選手の情報やパフォーマンスを管理します',
      icon: UsersIcon,
      href: '/members',
      color: 'bg-blue-500'
    },
    {
      title: '練習記録',
      description: '日々の練習内容を記録・分析します',
      icon: ChartBarIcon,
      href: '/practice',
      color: 'bg-green-500'
    },
    {
      title: '大会管理',
      description: '大会情報や記録を管理します',
      icon: TrophyIcon,
      href: '/competitions',
      color: 'bg-yellow-500'
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
    },
    {
      title: '目標管理',
      description: '個人・チームの目標を設定・追跡します',
      icon: FlagIcon,
      href: '/goals',
      color: 'bg-indigo-500'
    }
  ]

  return (
    <div className="space-y-6">
      {/* ウェルカムセクション */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              ダッシュボード
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

      {/* GraphQL今後のイベント */}
      <UpcomingEventsList />
    </div>
  )
}
