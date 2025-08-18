# 水泳選手マネジメントシステム 要件定義書

## 1. システム概要

### 1.1 システム名
水泳選手マネジメントシステム（Swim Manager）

### 1.2 システムの目的
水泳チームの選手、コーチ、監督、マネージャーが効率的にチーム運営を行えるWebアプリケーション

### 1.3 対象ユーザー
- **Admin（管理者）**: コーチ、監督、マネージャー
- **Player（選手）**: 水泳選手

## 2. ユーザー管理・認証機能

### 2.1 ユーザータイプ
- **player**: 選手（0）
- **manager**: マネージャー（1）
- **coach**: コーチ（2）
- **director**: 監督（3）

### 2.2 認証機能
- [x] Deviseを使用した認証システム
- [x] メールアドレス・パスワード認証
- [x] パスワードリセット機能
- [x] セッション管理
- [x] API認証トークン機能
- [x] 権限管理（Admin/Player分離）

### 2.3 ユーザー情報
- 名前、世代、性別、誕生日
- プロフィール画像（Active Storage）
- 自己紹介文

## 3. メンバー管理機能

### 3.1 選手情報管理
- [x] 選手一覧表示
- [x] 選手詳細情報表示
- [x] 選手情報編集
- [x] 選手追加・削除
- [x] 一括インポート機能（Excel）
- [x] 世代別管理

### 3.2 管理者機能
- [x] 選手情報の一括管理
- [x] 選手の権限管理
- [x] 選手の参加状況確認

## 4. 予定管理機能

### 4.1 イベント管理
- [x] 練習予定の作成・編集・削除
- [x] 大会予定の作成・編集・削除
- [x] カレンダー表示
- [x] イベントタイプ分類（練習/大会）
- [x] 場所、メモ情報

### 4.2 スケジュール管理
- [x] 月間・週間スケジュール表示
- [x] イベント詳細表示
- [x] スケジュール一括インポート

## 5. 出欠管理機能

### 5.1 出席状況管理
- [x] イベント別出席状況確認
- [x] 出席・欠席・遅刻の管理
- [x] 個別出席状況編集
- [x] 一括出席状況更新
- [x] 出席状況の履歴管理

### 5.2 出席統計
- [x] 選手別出席率
- [x] イベント別参加者数
- [x] 出席状況レポート

## 6. 練習記録管理機能

### 6.1 練習ログ管理
- [x] 練習内容の記録（泳法、距離、本数×セット、サークル）
- [x] 練習メモ機能
- [x] 練習ログの一覧表示
- [x] 練習ログの詳細表示

### 6.2 タイム記録
- [x] 選手別タイム入力
- [x] 一括タイム入力機能
- [x] タイム履歴管理
- [x] 練習参加者管理

### 6.3 練習分析
- [x] 選手別練習記録
- [x] 練習内容の統計
- [x] タイム推移の確認

## 7. 大会管理機能（記録）

### 7.1 記録管理
- [x] 大会記録の登録・編集
- [x] 泳法別記録管理
- [x] 記録の詳細情報（メモ、動画URL）
- [x] 記録の履歴管理

### 7.2 記録分析
- [x] 選手別ベストタイム
- [x] 泳法別記録一覧
- [x] 記録の推移分析
- [x] スプリットタイム管理

## 8. 大会管理機能（エントリー）

### 8.1 エントリー管理
- [x] 大会エントリーの登録・編集
- [x] 泳法・距離別エントリー
- [x] エントリータイム管理
- [x] エントリー状況確認

### 8.2 エントリー分析
- [x] 大会別エントリー一覧
- [x] 選手別エントリー履歴
- [x] エントリー統計

## 9. 目標管理機能

### 9.1 目標設定
- [x] 選手別目標設定
- [x] 大会別目標タイム設定
- [x] 質的・量的目標の設定
- [x] 目標期限の管理

### 9.2 マイルストーン管理
- [x] 目標達成のためのマイルストーン設定
- [x] マイルストーンの進捗管理
- [x] マイルストーンのレビュー機能

### 9.3 目標分析
- [x] 目標達成率の確認
- [x] 目標と実績の比較
- [x] 目標設定の履歴

## 10. お知らせ管理機能

### 10.1 お知らせ配信
- [x] お知らせの作成・編集・削除
- [x] お知らせの公開・非公開管理
- [x] お知らせの一覧表示
- [x] お知らせの詳細表示

### 10.2 お知らせ配信管理
- [x] お知らせの公開日時設定
- [x] お知らせの重要度管理
- [x] お知らせの配信履歴

## 11. 追加要件（ヒアリング項目）

### 11.1 機能追加の検討項目
- [ ] 選手の健康管理機能
- [ ] 栄養管理・食事記録機能
- [ ] 怪我・体調不良の記録機能
- [ ] 選手の心理状態記録機能
- [ ] 保護者向け機能（選手の状況確認）
- [ ] チーム間の交流機能
- [ ] 動画分析機能
- [ ] データエクスポート機能
- [ ] レポート生成機能
- [ ] 通知機能（メール・プッシュ通知）

### 11.2 UI/UX改善項目
- [ ] モバイル対応の強化
- [ ] ダッシュボードの改善
- [ ] グラフ・チャート機能の追加
- [ ] 検索・フィルター機能の強化
- [ ] データ可視化の改善

### 11.3 システム改善項目
- [ ] パフォーマンス最適化
- [ ] セキュリティ強化
- [ ] バックアップ機能の強化
- [ ] API機能の拡張
- [ ] 外部システム連携

## 12. 技術要件

### 12.1 使用技術
- **フレームワーク**: Next.js
- **データベース**: Supabase (PostgreSQL)
- **認証**: Supabase Auth
- **フロントエンド**: Tailwind CSS, React
- **ファイル管理**: Supabase Storage
- **API**: Supabase API

### 12.2 セキュリティ要件
- [x] パスワードの複雑性チェック
- [x] セッション管理
- [x] CSRF対策
- [x] SQLインジェクション対策
- [x] XSS対策

## 13. Next.js開発ベストプラクティス

### 13.1 コード品質・設計原則

#### 13.1.1 設計原則
- **DRY (Don't Repeat Yourself)**: 重複コードの排除
- **SOLID原則**: 単一責任、開放閉鎖、リスコフ置換、インターフェース分離、依存性逆転
- **KISS (Keep It Simple, Stupid)**: シンプルな設計を心がける
- **YAGNI (You Aren't Gonna Need It)**: 必要になるまで実装しない

#### 13.1.2 命名規則
- **コンポーネント**: パスカルケース（例: `User`, `PracticeLog`）
- **ページ**: スネークケース（例: `users`, `practice-logs`）
- **フック**: camelCase（例: `useUser`, `usePracticeLog`）
- **関数**: camelCase（例: `createUser`, `updatePracticeLog`）
- **定数**: 大文字、アンダースコア（例: `MAX_RECORDS`, `DEFAULT_PAGE_SIZE`）

### 13.2 データ層のベストプラクティス

#### 13.2.1 Supabase設計
- **テーブル設計**: 適切な関連付けを定義
- **バリデーション**: データ整合性の確保
- **RLS（Row Level Security）**: セキュリティの確保
- **関数**: よく使うクエリの定義
- **enum**: 状態管理の活用

```sql
-- 良い例
CREATE TYPE user_type AS ENUM ('player', 'manager', 'coach', 'director');

CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  generation INTEGER NOT NULL CHECK (generation > 0),
  user_type user_type NOT NULL DEFAULT 'player',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLSの設定
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND user_type IN ('coach', 'director', 'manager')
    )
  );
```

#### 13.2.2 データベース設計
- **インデックス**: 検索頻度の高いカラムに設定
- **制約**: データベースレベルでの整合性確保
- **マイグレーション**: 段階的な変更管理
- **シードデータ**: 開発・テスト用データの管理

### 13.3 コンポーネント層のベストプラクティス

#### 13.3.1 コンポーネント設計
- **単一責任**: 1つのコンポーネントに1つの責任
- **スキニーコンポーネント**: ビジネスロジックはカスタムフックに委譲
- **Props型定義**: TypeScriptによる型安全性の確保
- **カスタムフック**: 共通処理の抽出

```typescript
// 良い例
interface User {
  id: string;
  name: string;
  generation: number;
  user_type: 'player' | 'manager' | 'coach' | 'director';
}

const AdminUsersPage: React.FC = () => {
  const { users, loading, error, createUser } = useUsers();
  const { user } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ユーザー管理</h1>
      <UserList users={users} onUserCreate={createUser} />
    </div>
  );
};

// カスタムフック
const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('generation', { ascending: true });
      
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, fetchUsers };
};
```

#### 13.3.2 エラーハンドリング
- **適切なエラー境界**: React Error Boundaryの使用
- **例外処理**: 予期しないエラーの適切な処理
- **ログ出力**: デバッグ情報の記録

### 13.4 UI層のベストプラクティス

#### 13.4.1 コンポーネント設計
- **再利用可能コンポーネント**: 共通UIコンポーネントの作成
- **カスタムフック**: UI専用のロジックの分離
- **フォーム**: 適切なバリデーション表示
- **レスポンシブデザイン**: モバイル対応

```tsx
// 良い例
interface UserFormProps {
  user?: User;
  onSubmit: (user: Partial<User>) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    generation: user?.generation || 1,
    user_type: user?.user_type || 'player'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(formData);
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          名前
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${
            errors.name ? 'border-red-500' : ''
          }`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>
      {/* 他のフィールド */}
    </form>
  );
};
```

#### 13.4.2 アセット管理
- **CSS**: Tailwind CSSの活用
- **JavaScript**: React Hooksの使用
- **画像**: Supabase Storageの活用

### 13.5 API設計のベストプラクティス

#### 13.5.1 Supabase API
- **Supabase Client**: 適切なクライアントの使用
- **RLS（Row Level Security）**: セキュリティの確保
- **レスポンス形式**: 一貫したデータ形式
- **エラーハンドリング**: 適切なエラー処理

```typescript
// 良い例
class UserService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  async getUsers(): Promise<User[]> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`ユーザー取得エラー: ${error.message}`);
    }

    return data || [];
  }

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('ユーザーが見つかりません');
      }
      throw new Error(`ユーザー取得エラー: ${error.message}`);
    }

    return data;
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const { data, error } = await this.supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) {
      throw new Error(`ユーザー作成エラー: ${error.message}`);
    }

    return data;
  }
}
```

### 13.6 テストのベストプラクティス

#### 13.6.1 テスト戦略
- **単体テスト**: コンポーネント、カスタムフック、ユーティリティ関数
- **統合テスト**: ページ、API呼び出し
- **システムテスト**: エンドツーエンドの動作確認
- **モック**: テストデータの管理

```typescript
// 良い例
import { render, screen, fireEvent } from '@testing-library/react';
import { UserForm } from './UserForm';

describe('UserForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('名前が必須であること', () => {
    render(
      <UserForm 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel} 
      />
    );

    const submitButton = screen.getByRole('button', { name: /送信/i });
    fireEvent.click(submitButton);

    expect(screen.getByText(/名前は必須です/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('正常に送信できること', () => {
    render(
      <UserForm 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel} 
      />
    );

    const nameInput = screen.getByLabelText(/名前/i);
    fireEvent.change(nameInput, { target: { value: 'テストユーザー' } });

    const submitButton = screen.getByRole('button', { name: /送信/i });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'テストユーザー',
      generation: 1,
      user_type: 'player'
    });
  });
});
```

### 13.7 セキュリティのベストプラクティス

#### 13.7.1 認証・認可
- **Supabase Auth**: 認証機能の活用
- **RLS（Row Level Security）**: 適切なアクセス制御
- **セッション管理**: セキュアなセッション処理
- **JWTトークン**: トークンの適切な使用

#### 13.7.2 データ保護
- **型安全性**: TypeScriptによる型チェック
- **SQLインジェクション対策**: Supabase Clientの使用
- **XSS対策**: Reactの自動エスケープ機能
- **ファイルアップロード**: 適切な検証

### 13.8 パフォーマンスのベストプラクティス

#### 13.8.1 データベース最適化
- **N+1問題の回避**: 適切なJOINクエリの使用
- **インデックス**: 適切なインデックスの設定
- **クエリ最適化**: 不要なクエリの削減
- **ページネーション**: 大量データの適切な処理

```typescript
// 良い例（N+1問題の回避）
const { data: users } = await supabase
  .from('users')
  .select(`
    *,
    user_auth(email),
    records(*)
  `)
  .eq('generation', 1);

// 悪い例（N+1問題が発生）
const { data: users } = await supabase
  .from('users')
  .select('*')
  .eq('generation', 1);

// 各ユーザーに対して個別にクエリが発生
users?.forEach(async (user) => {
  const { data: userAuth } = await supabase
    .from('user_auth')
    .select('email')
    .eq('user_id', user.id);
});
```

#### 13.8.2 キャッシュ戦略
- **React Query**: サーバー状態のキャッシュ
- **Next.jsキャッシュ**: 静的ページのキャッシュ
- **Supabaseキャッシュ**: データベースクエリのキャッシュ

### 13.9 開発環境のベストプラクティス

#### 13.9.1 開発ツール
- **ESLint**: コードスタイルの統一
- **Prettier**: コードフォーマット
- **Jest**: テストフレームワーク
- **TypeScript**: 型安全性の確保

#### 13.9.2 環境管理
- **環境変数**: 機密情報の適切な管理
- **Docker**: 開発環境の統一
- **Git**: バージョン管理の徹底

### 13.10 デプロイメントのベストプラクティス

#### 13.10.1 本番環境
- **Vercel/Netlify**: ホスティングプラットフォーム
- **環境変数**: 本番用設定の管理
- **ログ管理**: 適切なログ出力
- **監視**: システム監視の設定
- **バックアップ**: Supabaseの自動バックアップ

#### 13.10.2 CI/CD
- **自動テスト**: プルリクエスト時の自動テスト
- **コードレビュー**: 品質確保のためのレビュー
- **自動デプロイ**: Vercel/Netlifyの自動デプロイ

### 13.11 コードレビューのチェックポイント

#### 13.11.1 機能面
- [ ] 要件を満たしているか
- [ ] エラーハンドリングが適切か
- [ ] セキュリティ上の問題はないか
- [ ] パフォーマンスに問題はないか

#### 13.11.2 コード品質
- [ ] 可読性が高いか
- [ ] 適切な命名がされているか
- [ ] 重複コードがないか
- [ ] テストが十分か

#### 13.11.3 Next.js慣例
- [ ] Next.jsの慣例に従っているか
- [ ] 適切なディレクトリ構造か
- [ ] 適切なファイル名か
- [ ] 適切なコンポーネント名か

## 14. 運用要件

### 14.1 パフォーマンス要件
- ページ読み込み時間: 3秒以内
- 同時接続数: 100ユーザー
- データベース応答時間: 1秒以内

### 14.2 可用性要件
- システム稼働率: 99.5%以上
- バックアップ: 日次
- 障害復旧時間: 4時間以内

## 15. 画面一覧

### 15.1 一般ユーザー向け画面

#### 15.1.1 認証・ランディング
- **ランディングページ**: `/` (root)
  - システムの紹介、機能説明、ログインへの導線
- **ログイン画面**: `/user_auths/sign_in`
  - メールアドレス・パスワード認証
- **404エラー画面**: `/404`
  - ページが見つからない場合のエラー表示
- **500エラー画面**: `/500`
  - サーバーエラーの表示
- **422エラー画面**: `/422`
  - バリデーションエラーの表示

#### 15.1.2 メイン機能
- **ホーム画面**: `/home`
  - お知らせ表示、誕生日ユーザー表示、カレンダー表示、ベストタイム表示
- **マイページ**: `/mypage`
  - プロフィール編集、自己紹介編集、アバター設定
- **メンバー一覧**: `/member`
  - 選手・コーチ・監督の一覧表示、期別フィルタリング
- **目標管理**: `/objective`
  - 目標一覧表示、マイルストーン確認
- **練習記録**: `/practice`
  - 練習ログ一覧、タイム詳細表示
- **レース管理**: `/races`
  - エントリー状況、過去のレース結果、エントリー提出・編集
- **出席管理**: `/attendance`
  - 出席状況入力、カレンダー表示

#### 15.1.3 出席管理詳細
- **出席編集**: `/attendance/edit`
  - 出席状況の詳細編集
- **出席状況確認**: `/attendance/event_status/:event_id`
  - 特定イベントの出席状況確認

### 15.2 管理者向け画面

#### 15.2.1 管理者メイン
- **管理者ダッシュボード**: `/admin`
  - 各管理機能へのナビゲーション、システム概要

#### 15.2.2 ユーザー管理
- **ユーザー一覧**: `/admin/users`
  - 登録ユーザーの一覧表示、編集・削除機能
- **ユーザー新規作成**: `/admin/users/new`
  - 新規ユーザーの登録フォーム
- **ユーザー編集**: `/admin/users/:id/edit`
  - 既存ユーザーの情報編集
- **ユーザー詳細**: `/admin/users/:id`
  - ユーザーの詳細情報表示
- **ユーザー一括インポート**: `/admin/users/import`
  - Excelファイルによる一括ユーザー登録
- **インポートテンプレート**: `/admin/users/import/template`
  - 一括インポート用のテンプレートダウンロード

#### 15.2.3 お知らせ管理
- **お知らせ一覧**: `/admin/announcement`
  - お知らせの一覧表示、新規作成・編集・削除
- **お知らせ新規作成**: `/admin/announcement` (POST)
  - 新規お知らせの作成
- **お知らせ編集**: `/admin/announcement/:id` (PATCH)
  - 既存お知らせの編集
- **お知らせ削除**: `/admin/announcement/:id` (DELETE)
  - お知らせの削除

#### 15.2.4 スケジュール管理
- **スケジュール一覧**: `/admin/schedule`
  - 練習・大会スケジュールの一覧表示
- **スケジュール新規作成**: `/admin/schedule` (POST)
  - 新規スケジュールの作成
- **スケジュール編集**: `/admin/schedule/:id/edit`
  - 既存スケジュールの編集
- **スケジュール更新**: `/admin/schedule/:id` (PATCH)
  - スケジュール情報の更新
- **スケジュール削除**: `/admin/schedule/:id` (DELETE)
  - スケジュールの削除
- **スケジュール一括インポート**: `/admin/schedule/import`
  - Excelファイルによる一括スケジュール登録
- **インポートテンプレート**: `/admin/schedule/import/template`
  - 一括インポート用のテンプレートダウンロード

#### 15.2.5 練習管理
- **練習管理メイン**: `/admin/practice`
  - 練習記録の一覧表示、管理機能へのナビゲーション
- **練習タイム入力**: `/admin/practice/time`
  - 練習タイムの一括入力
- **練習タイム入力詳細**: `/admin/practice/time/input`
  - 練習タイムの詳細入力・参加者管理
- **練習メニュー登録**: `/admin/practice/register`
  - 練習メニュー画像の登録
- **練習記録詳細**: `/admin/practice/:id`
  - 特定練習記録の詳細表示
- **練習記録編集**: `/admin/practice/:id/edit`
  - 練習記録の編集
- **練習記録更新**: `/admin/practice/:id` (PATCH)
  - 練習記録情報の更新
- **練習記録削除**: `/admin/practice/:id` (DELETE)
  - 練習記録の削除

#### 15.2.6 出欠管理
- **出欠管理メイン**: `/admin/attendance`
  - 月別出欠状況の表示、管理機能へのナビゲーション
- **当日出席確認**: `/admin/attendance/check`
  - 当日の出席状況確認・更新
- **出欠受付管理**: `/admin/attendance/status`
  - イベント別の出欠受付状況管理
- **出欠状況更新**: `/admin/attendance/update`
  - 過去の出欠状況の一括更新

#### 15.2.7 大会管理
- **大会管理メイン**: `/admin/competition`
  - 大会の一覧表示、エントリー管理、結果管理
- **エントリー詳細**: `/admin/competition/entry/:competition_id`
  - 特定大会のエントリー詳細表示
- **大会結果**: `/admin/competition/result/:id`
  - 大会結果の表示・入力
- **エントリー受付開始**: `/admin/competition/entry/start` (POST)
  - 大会エントリー受付の開始

#### 15.2.8 目標管理
- **目標管理一覧**: `/admin/objective`
  - 選手別目標の一覧表示、進捗確認

### 15.3 主要機能の特徴

#### 15.3.1 ユーザビリティ
- **レスポンシブデザイン**: PC・タブレット・スマートフォン対応
- **リアルタイム更新**: カレンダー、出席状況の即座反映
- **権限管理**: ユーザータイプ別のアクセス制御
- **データ可視化**: ベストタイム、出席率のグラフ表示

#### 15.3.2 操作性
- **一括操作**: ユーザー・スケジュールの一括インポート機能
- **モーダル操作**: 編集・詳細表示のモーダルウィンドウ
- **検索・フィルタ**: メンバー、目標の検索機能
- **ドラッグ&ドロップ**: 大会管理での直感的な操作

#### 15.3.3 データ管理
- **Excel連携**: 一括データインポート・エクスポート
- **画像管理**: Active Storageによる効率的な画像管理
- **履歴管理**: 操作履歴の保持・確認
- **バックアップ**: データの自動バックアップ

## 16. 追加ルール・ガイドライン

### 16.1 コード品質・保守性

#### 15.1.1 コメント・ドキュメント
- **必須コメント**: 複雑なビジネスロジックには必ずコメントを記述
- **APIドキュメント**: 新規API作成時はSwagger/OpenAPI形式でドキュメント化
- **requirements更新**: 新機能追加時はrequirements.mdを更新

```typescript
// 良い例
interface PracticeLog {
  id: string;
  style: 'freestyle' | 'backstroke' | 'breaststroke' | 'butterfly';
  distance: number;
  duration?: number;
  created_at: string;
}

// 練習記録の作成時に自動的に練習時間を計算
// 泳法と距離から標準的な練習時間を算出
const calculatePracticeDuration = (style: string, distance: number): number => {
  // 泳法別の標準時間（分/100m）を定義
  const standardTimes: Record<string, number> = {
    'freestyle': 2.5,
    'backstroke': 3.0,
    'breaststroke': 3.5,
    'butterfly': 3.0
  };
  
  const timePer100m = standardTimes[style] || 3.0;
  return Math.round(distance / 100.0 * timePer100m);
};

// 使用例
const createPracticeLog = async (practiceData: Partial<PracticeLog>) => {
  const duration = calculatePracticeDuration(practiceData.style!, practiceData.distance!);
  
  const { data, error } = await supabase
    .from('practice_logs')
    .insert([{ ...practiceData, duration }])
    .select()
    .single();
    
  if (error) throw error;
  return data;
};
```

#### 15.1.2 エラーハンドリング
- **例外処理**: 予期しないエラーは適切にキャッチしてログ出力
- **ユーザーフレンドリー**: エラーメッセージは一般ユーザーが理解できる内容
- **ログレベル**: 適切なログレベル（debug, info, warn, error）の使用

```typescript
// 良い例
const createPracticeLog = async (practiceData: Partial<PracticeLog>) => {
  try {
    const { data, error } = await supabase
      .from('practice_logs')
      .insert([practiceData])
      .select()
      .single();
    
    if (error) {
      console.error('練習記録作成失敗:', error.message);
      throw new Error('練習記録の作成に失敗しました');
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('練習記録作成中にエラーが発生:', error.message);
    throw new Error('練習記録の作成に失敗しました。しばらく時間をおいて再度お試しください。');
  }
};
```

### 15.2 セキュリティ強化ルール

#### 15.2.1 データ保護
- **個人情報**: 選手の個人情報は暗号化して保存
- **アクセスログ**: 重要な操作は必ずログに記録
- **データ削除**: 物理削除ではなく論理削除を基本とする
- **バックアップ暗号化**: バックアップデータも暗号化

```typescript
// 良い例
interface User {
  id: string;
  name: string;
  deleted_at?: string;
  phone_number?: string;
  emergency_contact?: string;
}

// 論理削除の実装
const getActiveUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .is('deleted_at', null);
    
  if (error) throw error;
  return data || [];
};

const softDeleteUser = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from('users')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', userId);
    
  if (error) throw error;
};

// 個人情報の暗号化（Supabaseの暗号化機能を使用）
const createUserWithEncryptedData = async (userData: Partial<User>) => {
  const { data, error } = await supabase
    .from('users')
    .insert([{
      ...userData,
      phone_number: userData.phone_number, // Supabaseで自動暗号化
      emergency_contact: userData.emergency_contact // Supabaseで自動暗号化
    }])
    .select()
    .single();
    
  if (error) throw error;
  return data;
};
```

#### 15.2.2 認証・認可の強化
- **セッションタイムアウト**: 30分でセッションタイムアウト
- **パスワードポリシー**: 8文字以上、英数字混在必須
- **ログイン試行制限**: 5回失敗でアカウントロック
- **二段階認証**: 管理者アカウントは二段階認証必須

```typescript
// 良い例
interface UserAuth {
  id: string;
  email: string;
  user_type: 'player' | 'manager' | 'coach' | 'director';
}

// Supabase Authの設定
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// パスワードポリシー（Supabase Authで設定）
const signUpWithPassword = async (email: string, password: string) => {
  // パスワードポリシーの検証
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new Error('パスワードは英大文字、英小文字、数字を含む8文字以上である必要があります');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        user_type: 'player' // デフォルトは選手
      }
    }
  });

  if (error) throw error;
  return data;
};

// 管理者は二段階認証必須
const requireTwoFactor = (userType: string): boolean => {
  return ['coach', 'director', 'manager'].includes(userType);
};
```

### 15.3 パフォーマンス最適化ルール

#### 15.3.1 データベース最適化
- **クエリ制限**: 1回のクエリで取得するレコード数は1000件以下
- **インデックス戦略**: 検索頻度の高いカラムには必ずインデックス
- **バッチ処理**: 大量データ処理はバックグラウンドジョブで実行
- **キャッシュ戦略**: 頻繁にアクセスされるデータはキャッシュ

```typescript
// 良い例
interface PracticeLog {
  id: string;
  user_id: string;
  created_at: string;
  style: string;
  distance: number;
  user?: {
    name: string;
  };
}

// 検索用インデックス
const getPracticeLogsByDateRange = async (
  startDate: Date, 
  endDate: Date
): Promise<PracticeLog[]> => {
  const { data, error } = await supabase
    .from('practice_logs')
    .select('*')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());
    
  if (error) throw error;
  return data || [];
};

// パフォーマンス最適化
const getPracticeLogsWithUserInfo = async (): Promise<PracticeLog[]> => {
  const { data, error } = await supabase
    .from('practice_logs')
    .select(`
      *,
      user:users(name)
    `);
    
  if (error) throw error;
  return data || [];
};

// バッチ処理用
const bulkCreateFromCSV = async (csvData: Partial<PracticeLog>[]): Promise<void> => {
  const batchSize = 100;
  
  for (let i = 0; i < csvData.length; i += batchSize) {
    const batch = csvData.slice(i, i + batchSize);
    
    const { error } = await supabase
      .from('practice_logs')
      .insert(batch);
      
    if (error) throw error;
  }
};
```

#### 15.3.2 フロントエンド最適化
- **画像最適化**: 画像はWebP形式で提供、適切なサイズにリサイズ
- **JavaScript最適化**: 非同期処理の活用、不要なリクエストの削減
- **CSS最適化**: 未使用CSSの削除、クリティカルCSSの分離

### 15.4 運用・監視ルール

#### 15.4.1 ログ管理
- **構造化ログ**: JSON形式でログ出力
- **ログローテーション**: 日次でログローテーション
- **監視アラート**: エラー率5%以上でアラート
- **パフォーマンス監視**: レスポンス時間3秒以上でアラート

```typescript
// 良い例
import { NextApiRequest, NextApiResponse } from 'next';

// APIルートでのログ記録
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const startTime = Date.now();
  
  try {
    // API処理
    const result = await processApiRequest(req);
    
    const duration = Date.now() - startTime;
    
    console.log(JSON.stringify({
      method: req.method,
      path: req.url,
      duration,
      status: res.statusCode,
      user_id: req.headers.authorization // JWTトークンから取得
    }));
    
    res.status(200).json(result);
  } catch (error) {
    const duration = Date.now() - startTime;
    
    console.error(JSON.stringify({
      method: req.method,
      path: req.url,
      duration,
      status: 500,
      error: error.message
    }));
    
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// クライアントサイドでのログ記録
const logClientRequest = (method: string, path: string, duration: number) => {
  console.log(JSON.stringify({
    method,
    path,
    duration,
    timestamp: new Date().toISOString()
  }));
};
```

#### 15.4.2 バックアップ・復旧
- **自動バックアップ**: 日次で自動バックアップ実行
- **復旧テスト**: 月次で復旧テストを実施
- **データ保持**: ログデータは1年間保持
- **災害対策**: 複数リージョンでのバックアップ

### 15.5 開発プロセスルール

#### 15.5.1 ブランチ戦略
- **Git Flow**: feature → develop → main の流れ
- **プルリクエスト**: 全機能追加はプルリクエスト必須
- **コードレビュー**: 最低1名のレビュー必須
- **テストカバレッジ**: 新機能は80%以上のカバレッジ必須

#### 15.5.2 リリース管理
- **セマンティックバージョニング**: MAJOR.MINOR.PATCH形式
- **リリースノート**: 全リリースでリリースノート作成
- **段階的リリース**: 重要な変更は段階的にリリース
- **ロールバック計画**: リリース前のロールバック計画必須

### 15.6 アクセシビリティ・UXルール

#### 15.6.1 アクセシビリティ
- **WCAG 2.1準拠**: AAレベルでの準拠
- **キーボードナビゲーション**: 全機能をキーボードで操作可能
- **スクリーンリーダー対応**: 適切なaria属性の設定
- **色覚異常対応**: 色だけでなく形状でも情報を表現

```tsx
// 良い例
<button 
  className="btn btn-primary" 
  aria-label="練習記録を追加"
  role="button"
  onClick={handleAddPracticeLog}
>
  <i className="fas fa-plus" aria-hidden="true"></i>
  追加
</button>
```

#### 15.6.2 ユーザビリティ
- **レスポンシブデザイン**: 全デバイスで適切に表示
- **ローディング状態**: 非同期処理中は適切なローディング表示
- **エラー表示**: 分かりやすいエラーメッセージ
- **成功フィードバック**: 操作成功時の適切なフィードバック

### 15.7 国際化・ローカライゼーション

#### 15.7.1 多言語対応
- **日本語優先**: 日本語をデフォルト言語とする
- **英語対応**: 将来的な英語対応を考慮した設計
- **日付形式**: 日本の慣習に合わせた日付表示
- **数値形式**: 日本の慣習に合わせた数値表示

```typescript
// 良い例
import { useRouter } from 'next/router';

// 国際化の設定
const useLocale = () => {
  const router = useRouter();
  const { locale } = router;
  
  const setLocale = (newLocale: string) => {
    router.push(router.pathname, router.asPath, { locale: newLocale });
  };
  
  return { locale: locale || 'ja', setLocale };
};

// 使用例
const LocaleProvider: React.FC = ({ children }) => {
  const { locale } = useLocale();
  
  return (
    <div lang={locale}>
      {children}
    </div>
  );
};
```

### 15.8 データ管理ルール

#### 15.8.1 データ整合性
- **外部キー制約**: データベースレベルでの整合性確保
- **バリデーション**: アプリケーションレベルでの整合性チェック
- **データクレンジング**: 定期的なデータクレンジング実行
- **重複チェック**: 重複データの自動検出・処理

#### 15.8.2 データライフサイクル
- **データ保持期間**: 選手データは引退後5年間保持
- **アーカイブ**: 古いデータはアーカイブテーブルに移動
- **完全削除**: 7年経過後は物理削除
- **データエクスポート**: 選手のデータエクスポート機能提供

### 15.9 コンプライアンス・法的要件

#### 15.9.1 個人情報保護
- **GDPR準拠**: 欧州の個人情報保護法への準拠
- **個人情報保護法**: 日本の個人情報保護法への準拠
- **同意管理**: 個人情報利用の同意管理
- **データ主体の権利**: データの削除・訂正権の実装

#### 15.9.2 スポーツ関連法規
- **アンチドーピング**: アンチドーピング関連の記録保持
- **未成年保護**: 未成年選手の特別な保護措置
- **健康管理**: 選手の健康管理データの適切な取り扱い

### 15.10 緊急時対応ルール

#### 15.10.1 障害対応
- **障害レベル定義**: レベル1〜3の障害レベル定義
- **エスカレーション**: 障害発生時のエスカレーション手順
- **復旧手順**: 各障害レベル別の復旧手順
- **顧客対応**: 障害時の顧客への適切な情報提供

#### 15.10.2 セキュリティインシデント
- **インシデント定義**: セキュリティインシデントの定義
- **報告手順**: インシデント発見時の報告手順
- **対応手順**: インシデント対応の手順
- **再発防止**: インシデント後の再発防止策

---

**作成日**: 2025年1月
**更新日**: 2025年1月
**作成者**: 開発チーム 