# 水泳選手マネジメントシステム

水泳チームの選手、コーチ、監督、マネージャーが効率的にチーム運営を行えるWebアプリケーション・モバイルアプリケーション

## 🏗️ モノレポ構造

```
swimmer-management-system/
├── .github/
│   └── workflows/              # GitHub Actions CI/CD
├── apps/
│   ├── web/                   # Next.js Webアプリケーション
│   ├── mobile/                # Flutter/React Native モバイルアプリ（実装予定）
│   └── supabase/
│       ├── functions/
│       │   └── graphql/       # GraphQL Edge Functions
│       └── migrations/        # データベースマイグレーション
├── packages/
│   ├── graphql-schema/        # 共有GraphQLスキーマ・型定義
│   └── types/                 # 共有TypeScript型定義
├── .gitignore
├── package.json               # ワークスペース設定
└── README.md
```

## 🚀 クイックスタート

### 前提条件
- Node.js 18以上
- npm 8以上

### インストール

```bash
# 全依存関係をインストール
npm install

# Webアプリケーションの開発サーバーを起動
npm run dev:web
```

## 📦 パッケージ構成

### Apps
- `apps/web` - Next.js Webアプリケーション
- `apps/mobile` - モバイルアプリケーション（実装予定）
- `apps/supabase` - Supabase設定・Edge Functions

### Packages
- `packages/types` - 共有型定義
- `packages/graphql-schema` - GraphQL スキーマ

## 🛠️ 開発コマンド

```bash
# Webアプリ開発
npm run dev:web              # 開発サーバー起動
npm run build:web            # ビルド

# 全体管理
npm run lint                 # 全プロジェクトのLint
npm run type-check          # 型チェック

# Supabase
npm run supabase:start      # ローカルSupabase起動

# GraphQL
npm run graphql:codegen     # GraphQL型生成
```

## 📊 技術スタック

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL), GraphQL
- **Monorepo**: npm workspaces
- **CI/CD**: GitHub Actions
