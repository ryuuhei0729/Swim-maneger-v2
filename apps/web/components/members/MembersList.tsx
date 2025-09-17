'use client'

import React from 'react'
import { useUsers } from '@/hooks/useGraphQL'
import { formatDate } from '@/utils'
import { parseISO, format } from 'date-fns'
import { 
  UserIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

export default function MembersList() {
  const { data, loading, error } = useUsers()

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">メンバー一覧</h2>
          <button className="btn-primary">
            <PlusIcon className="h-5 w-5 mr-2" />
            メンバー追加
          </button>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">メンバー一覧</h2>
          <button className="btn-primary">
            <PlusIcon className="h-5 w-5 mr-2" />
            メンバー追加
          </button>
        </div>
        <div className="flex items-center justify-center py-8">
          <ExclamationTriangleIcon className="h-8 w-8 text-red-500 mr-2" />
          <span className="text-red-600">メンバー情報の取得に失敗しました</span>
        </div>
      </div>
    )
  }

  const users = (data as any)?.users || []

  const getRoleLabel = () => {
    // roleカラムが削除されたため、デフォルトで「メンバー」を表示
    return { label: 'メンバー', color: 'bg-gray-100 text-gray-800' }
  }

  // 性別を正規化して表示ラベルを取得する関数
  const getGenderLabel = (gender: any): string => {
    if (typeof gender === 'number') {
      // 数値の場合: 0 = 男性, 1 = 女性
      return gender === 0 ? '男性' : gender === 1 ? '女性' : 'その他'
    } else if (typeof gender === 'string') {
      // 文字列の場合: male = 男性, female = 女性
      const normalizedGender = gender.toLowerCase()
      return normalizedGender === 'male' ? '男性' : normalizedGender === 'female' ? '女性' : 'その他'
    }
    // 予期しない値の場合はフォールバック
    return 'その他'
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          メンバー一覧 ({users.length}名)
        </h2>
        <button className="btn-primary">
          <PlusIcon className="h-5 w-5 mr-2" />
          メンバー追加
        </button>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12">
          <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">まだメンバーがいません</p>
          <p className="text-gray-400 text-sm">新しいメンバーを追加してください</p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => {
            const roleInfo = getRoleLabel()
            return (
              <div
                key={user.id}
                className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex-shrink-0">
                  {user.avatarUrl ? (
                    <img
                      className="h-12 w-12 rounded-full object-cover"
                      src={user.avatarUrl}
                      alt={user.name}
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-gray-600" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.name}
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleInfo.color}`}>
                      {roleInfo.label}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="text-sm text-gray-500">
                        {getGenderLabel(user.gender)}
                      </span>
                    </div>
                    {user.birthday && (
                      <span className="text-sm text-gray-500">
                        誕生日: {format(parseISO(user.birthday), 'yyyy年M月d日')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <div className="text-right">
                    {user.bio && (
                      <p className="text-xs text-gray-500">
                        {user.bio}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                    詳細
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
