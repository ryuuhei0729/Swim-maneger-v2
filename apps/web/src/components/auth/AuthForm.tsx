'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/providers'

interface AuthFormProps {
  mode?: 'signin' | 'signup'
  onSuccess?: () => void
}

export const AuthForm: React.FC<AuthFormProps> = ({ 
  mode = 'signin', 
  onSuccess 
}) => {
  const [formMode, setFormMode] = useState(mode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const { signIn, signUp } = useAuth()

  const formatAuthError = (err: unknown, action: 'signin' | 'signup'): string => {
    const e = err as any
    const status = e?.status ? ` [status: ${e.status}]` : ''
    const message = e?.message || e?.error_description || e?.error || '不明なエラーが発生しました。'

    // 補足ヒント（既知パターンの説明）
    if (typeof message === 'string') {
      const msg = message.toLowerCase()
      if (msg.includes('invalid') && msg.includes('email')) {
        return `${message}${status}\n原因の可能性: メール形式の不備、または許可ドメイン制限（Auth設定のAllowed email domains）。` 
      }
      if (msg.includes('captcha')) {
        return `${message}${status}\n原因の可能性: Captchaが有効ですがトークンが未提供。AuthのCaptcha設定をご確認ください。`
      }
      if (msg.includes('rate limit') || e?.status === 429) {
        return `${message}${status}\n原因の可能性: メール送信のレート制限に達しました。時間をおいて再試行してください。`
      }
    }
    return `${message}${status}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (formMode === 'signin') {
        const { error } = await signIn(email, password)
        if (error) {
          setError(formatAuthError(error, 'signin'))
        } else {
          onSuccess?.()
        }
      } else {
        const { error } = await signUp(email, password, name)
        if (error) {
          setError(formatAuthError(error, 'signup'))
        } else {
          setMessage('確認メールを送信しました。メールを確認してアカウントを有効化してください。')
        }
      }
    } catch (error) {
      setError('予期しないエラーが発生しました。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl transform transition-all duration-300">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
          {formMode === 'signin' ? 'ログイン' : 'アカウント作成'}
        </h2>
        <p className="text-sm text-gray-600">
          {formMode === 'signin' ? 'Swim Managerへようこそ' : '新しいアカウントを作成'}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-5">
          {formMode === 'signup' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                名前
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3 px-3 transition duration-150 ease-in-out"
                  placeholder="山田太郎"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input
                type="email"
                id="email"
                required
                autoFocus
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3 px-3 transition duration-150 ease-in-out"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              パスワード
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="password"
                id="password"
                required
                autoComplete={formMode === 'signin' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3 px-3 transition duration-150 ease-in-out"
                placeholder="パスワード"
                minLength={6}
              />
            </div>
          </div>
        </div>

        {formMode === 'signin' && (
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition duration-150 ease-in-out"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                ログイン状態を保持
              </label>
            </div>
          </div>
        )}

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition duration-150 ease-in-out hover:scale-[1.02] shadow-md"
          >
            {loading ? '処理中...' : formMode === 'signin' ? 'ログイン' : 'アカウント作成'}
          </button>
        </div>
      </form>

      <div className="text-center mt-6">
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setFormMode(formMode === 'signin' ? 'signup' : 'signin')}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition duration-150 ease-in-out"
          >
            {formMode === 'signin' 
              ? 'アカウントをお持ちでない方はこちら' 
              : 'すでにアカウントをお持ちの方はこちら'
            }
          </button>
          {formMode === 'signin' && (
            <div>
              <Link
                href="/reset-password"
                className="text-sm text-gray-600 hover:text-indigo-600 transition duration-150 ease-in-out"
              >
                パスワードを忘れた方はこちら
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
