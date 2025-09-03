'use client'

import Link from 'next/link'
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-swim-50 to-blue-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* ロゴ */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-swim-500 to-swim-600 rounded-2xl flex items-center justify-center shadow-swim">
            <span className="text-white font-bold text-3xl">🏊</span>
          </div>
        </div>

        {/* エラーメッセージ */}
        <div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            ページが見つかりません
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            お探しのページは存在しないか、移動または削除された可能性があります。
            <br />
            URLをご確認いただくか、下記のボタンからホームページにお戻りください。
          </p>
        </div>

        {/* アクションボタン */}
        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="btn-primary btn-lg w-full group"
          >
            <HomeIcon className="w-5 h-5 mr-2" />
            ダッシュボードに戻る
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="btn-outline btn-lg w-full group"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            前のページに戻る
          </button>
        </div>

        {/* サポート情報 */}
        <div className="pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            問題が続く場合は、
            <Link href="/support" className="text-swim-600 hover:text-swim-700 font-medium">
              サポート
            </Link>
            までお問い合わせください。
          </p>
        </div>
      </div>
    </div>
  )
}
