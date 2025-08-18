import React from 'react'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-center mb-8">
          水泳選手マネジメントシステム
        </h1>
        <p className="text-lg text-center text-gray-600 mb-8">
          水泳チームの選手、コーチ、監督、マネージャーが効率的にチーム運営を行えるWebアプリケーション
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">選手管理</h2>
            <p className="text-gray-600">選手の情報管理とプロフィール</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">スケジュール管理</h2>
            <p className="text-gray-600">練習・大会のスケジュール管理</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">練習記録</h2>
            <p className="text-gray-600">練習内容とタイム記録</p>
          </div>
        </div>
      </div>
    </main>
  )
}
