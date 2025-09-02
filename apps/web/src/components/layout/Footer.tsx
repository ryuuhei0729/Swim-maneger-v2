import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div className="flex items-center space-x-6">
            <div className="text-sm text-gray-500">
              © 2025 水泳選手マネジメントシステム. All rights reserved.
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <a
              href="/privacy"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              プライバシーポリシー
            </a>
            <a
              href="/terms"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              利用規約
            </a>
            <a
              href="/support"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              サポート
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
