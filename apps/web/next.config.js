/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript設定
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // ESLint設定
  eslint: {
    ignoreDuringBuilds: true, // ビルド時にESLintエラーを無視
  },
  
  // 環境変数
  env: {
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',
  },
  
  // 外部パッケージ設定
  serverExternalPackages: ['@supabase/supabase-js'],
}

module.exports = nextConfig
