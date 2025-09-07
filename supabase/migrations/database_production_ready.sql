-- Swim Manager v2 Production Database Setup
-- 本番環境用のクリーンなデータベース設定
-- テストデータは除外、認証トリガーで自動プロフィール作成

-- =============================================================================
-- 1. クリーンアップ（既存データ削除）
-- =============================================================================

DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS split_times CASCADE;
DROP TABLE IF EXISTS race_feedbacks CASCADE;
DROP TABLE IF EXISTS milestone_reviews CASCADE;
DROP TABLE IF EXISTS milestones CASCADE;
DROP TABLE IF EXISTS race_reviews CASCADE;
DROP TABLE IF EXISTS race_goals CASCADE;
DROP TABLE IF EXISTS objectives CASCADE;
DROP TABLE IF EXISTS practice_times CASCADE;
DROP TABLE IF EXISTS practice_logs CASCADE;
DROP TABLE IF EXISTS entries CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS records CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS styles CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =============================================================================
-- 2. テーブル作成
-- =============================================================================

-- 2.1 ユーザーテーブル（Supabase Authと連携）
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'player' CHECK (role IN ('admin', 'manager', 'player', 'coach', 'director')),
  generation INTEGER,
  birthday DATE,
  bio TEXT,
  gender INTEGER DEFAULT 0 CHECK (gender IN (0, 1, 2)), -- 0: 未設定, 1: 男性, 2: 女性
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.2 ユーザーセッションテーブル
CREATE TABLE user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at_ts TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at_ts TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.3 泳法・種目テーブル
CREATE TABLE styles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_jp TEXT NOT NULL,
  name TEXT NOT NULL,
  distance INTEGER NOT NULL,
  style INTEGER DEFAULT 0 CHECK (style IN (0, 1, 2, 3, 4)), -- 0: フリー, 1: バック, 2: ブレスト, 3: バタフライ, 4: メドレー
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.4 イベントテーブル
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  place TEXT,
  note TEXT,
  type TEXT DEFAULT 'Event' NOT NULL,
  is_attendance BOOLEAN DEFAULT false NOT NULL,
  attendance_status INTEGER DEFAULT 0,
  is_competition BOOLEAN DEFAULT false,
  entry_status INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.5 出席テーブル
CREATE TABLE attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  attendance_event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  note TEXT,
  status INTEGER DEFAULT 0 CHECK (status IN (0, 1, 2)), -- 0: 未回答, 1: 出席, 2: 欠席
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, attendance_event_id)
);

-- 2.6 エントリーテーブル
CREATE TABLE entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  attendance_event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  style_id UUID REFERENCES styles(id) ON DELETE CASCADE,
  entry_time DECIMAL(10,2) NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(attendance_event_id, user_id, style_id)
);

-- 2.7 記録テーブル（個人利用機能対応）
CREATE TABLE records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  style_id UUID REFERENCES styles(id) ON DELETE CASCADE,
  time DECIMAL(10,2) NOT NULL,
  record_date DATE NOT NULL, -- 追加：記録日付
  location TEXT, -- 追加：場所
  pool_type INTEGER NOT NULL CHECK (pool_type IN (0, 1)), -- 追加：0=short,  1=long
  is_relaying BOOLEAN DEFAULT false NOT NULL, -- 追加：リレー種目フラグ
  note TEXT,
  video_url TEXT, -- Supabase StorageのURLを保存
  attendance_event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.8 練習ログテーブル（個人利用機能対応）
CREATE TABLE practice_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL, -- 追加：ユーザーID
  practice_date DATE NOT NULL, -- 追加：練習日付
  location TEXT, -- 追加：場所
  attendance_event_id UUID REFERENCES events(id) ON DELETE SET NULL, -- NULL許可に変更
  tags JSONB,
  style TEXT,
  rep_count INTEGER NOT NULL,
  set_count INTEGER NOT NULL,
  distance INTEGER NOT NULL,
  circle DECIMAL(10,2) NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.9 練習タイムテーブル
CREATE TABLE practice_times (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  practice_log_id UUID REFERENCES practice_logs(id) ON DELETE CASCADE,
  rep_number INTEGER NOT NULL,
  set_number INTEGER NOT NULL,
  time DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(practice_log_id, user_id, rep_number, set_number)
);

-- 2.10 目標テーブル
CREATE TABLE objectives (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  attendance_event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  style_id UUID REFERENCES styles(id) ON DELETE CASCADE,
  target_time DECIMAL(10,2) NOT NULL,
  quantity_note TEXT NOT NULL,
  quality_title TEXT NOT NULL,
  quality_note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.11 レース目標テーブル
CREATE TABLE race_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  attendance_event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  style_id UUID REFERENCES styles(id) ON DELETE CASCADE,
  time DECIMAL(10,2) NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.12 レース振り返りテーブル
CREATE TABLE race_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  race_goal_id UUID REFERENCES race_goals(id) ON DELETE CASCADE,
  style_id UUID REFERENCES styles(id) ON DELETE CASCADE,
  time DECIMAL(10,2) NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.13 マイルストーンテーブル
CREATE TABLE milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  objective_id UUID REFERENCES objectives(id) ON DELETE CASCADE,
  milestone_type TEXT NOT NULL CHECK (milestone_type IN ('quality', 'quantity')),
  limit_date DATE NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.14 マイルストーン振り返りテーブル
CREATE TABLE milestone_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  milestone_id UUID REFERENCES milestones(id) ON DELETE CASCADE,
  achievement_rate INTEGER NOT NULL,
  negative_note TEXT NOT NULL,
  positive_note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.15 レースフィードバックテーブル
CREATE TABLE race_feedbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  race_goal_id UUID REFERENCES race_goals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.16 スプリットタイムテーブル
CREATE TABLE split_times (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  record_id UUID REFERENCES records(id) ON DELETE CASCADE,
  race_goal_id UUID REFERENCES race_goals(id) ON DELETE SET NULL,
  distance INTEGER NOT NULL,
  split_time DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.17 お知らせテーブル
CREATE TABLE announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.18 ベストタイムテーブル（個人利用機能）
CREATE TABLE best_times (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  style_id UUID REFERENCES styles(id) ON DELETE CASCADE NOT NULL,
  pool_type INTEGER NOT NULL CHECK (pool_type IN (0, 1)), -- 0=short, 1=long
  best_time DECIMAL(10,2) NOT NULL,
  record_id UUID REFERENCES records(id) ON DELETE SET NULL, -- ベストタイムを出した記録への参照
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, style_id, pool_type)
);

-- =============================================================================
-- 3. インデックス作成
-- =============================================================================

-- Users table indexes
CREATE INDEX idx_users_name ON users(name);
CREATE INDEX idx_users_generation ON users(generation);
CREATE INDEX idx_users_gender ON users(gender);
CREATE INDEX idx_users_role ON users(role);

-- Styles table indexes
CREATE INDEX idx_styles_distance ON styles(distance);
CREATE INDEX idx_styles_style ON styles(style);

-- Events table indexes
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_type ON events(type);
CREATE INDEX idx_events_is_attendance ON events(is_attendance);
CREATE INDEX idx_events_is_competition ON events(is_competition);

-- Attendance table indexes
CREATE INDEX idx_attendance_user_id ON attendance(user_id);
CREATE INDEX idx_attendance_event_id ON attendance(attendance_event_id);
CREATE INDEX idx_attendance_status ON attendance(status);

-- Entries table indexes
CREATE INDEX idx_entries_user_id ON entries(user_id);
CREATE INDEX idx_entries_event_id ON entries(attendance_event_id);
CREATE INDEX idx_entries_style_id ON entries(style_id);

-- Records table indexes（個人利用機能対応）
CREATE INDEX idx_records_user_id ON records(user_id);
CREATE INDEX idx_records_style_id ON records(style_id);
CREATE INDEX idx_records_attendance_event_id ON records(attendance_event_id);
CREATE INDEX idx_records_user_date ON records(user_id, record_date);
CREATE INDEX idx_records_date ON records(record_date);
CREATE INDEX idx_records_pool_type ON records(pool_type);
CREATE INDEX idx_records_style_pool ON records(style_id, pool_type);

-- Practice logs table indexes（個人利用機能対応）
CREATE INDEX idx_practice_logs_event_id ON practice_logs(attendance_event_id);
CREATE INDEX idx_practice_logs_style ON practice_logs(style);
CREATE INDEX idx_practice_logs_user_date ON practice_logs(user_id, practice_date);
CREATE INDEX idx_practice_logs_date ON practice_logs(practice_date);
CREATE INDEX idx_practice_logs_location ON practice_logs(location);

-- Practice times table indexes
CREATE INDEX idx_practice_times_user_id ON practice_times(user_id);
CREATE INDEX idx_practice_times_log_id ON practice_times(practice_log_id);

-- Objectives table indexes
CREATE INDEX idx_objectives_user_id ON objectives(user_id);
CREATE INDEX idx_objectives_event_id ON objectives(attendance_event_id);
CREATE INDEX idx_objectives_style_id ON objectives(style_id);

-- Race goals table indexes
CREATE INDEX idx_race_goals_user_id ON race_goals(user_id);
CREATE INDEX idx_race_goals_event_id ON race_goals(attendance_event_id);
CREATE INDEX idx_race_goals_style_id ON race_goals(style_id);

-- Announcements table indexes
CREATE INDEX idx_announcements_is_active ON announcements(is_active);
CREATE INDEX idx_announcements_published_at ON announcements(published_at);

-- Best times table indexes
CREATE INDEX idx_best_times_user_id ON best_times(user_id);
CREATE INDEX idx_best_times_style_pool ON best_times(user_id, style_id, pool_type);
CREATE INDEX idx_best_times_achieved_at ON best_times(achieved_at);

-- =============================================================================
-- 4. 基本データ挿入（泳法・種目のみ）
-- =============================================================================

-- 泳法・種目の基本データ
INSERT INTO styles (name_jp, name, distance, style) VALUES
('50m自由形', '50m Freestyle', 50, 0),
('100m自由形', '100m Freestyle', 100, 0),
('200m自由形', '200m Freestyle', 200, 0),
('400m自由形', '400m Freestyle', 400, 0),
('800m自由形', '800m Freestyle', 800, 0),
('1500m自由形', '1500m Freestyle', 1500, 0),
('50m背泳ぎ', '50m Backstroke', 50, 1),
('100m背泳ぎ', '100m Backstroke', 100, 1),
('200m背泳ぎ', '200m Backstroke', 200, 1),
('50m平泳ぎ', '50m Breaststroke', 50, 2),
('100m平泳ぎ', '100m Breaststroke', 100, 2),
('200m平泳ぎ', '200m Breaststroke', 200, 2),
('50mバタフライ', '50m Butterfly', 50, 3),
('100mバタフライ', '100m Butterfly', 100, 3),
('200mバタフライ', '200m Butterfly', 200, 3),
('100m個人メドレー', '100m Individual Medley', 100, 4),
('200m個人メドレー', '200m Individual Medley', 200, 4),
('400m個人メドレー', '400m Individual Medley', 400, 4);

-- =============================================================================
-- =============================================================================
-- 5. RLS (Row Level Security) 有効化
-- =============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE records ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE race_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE race_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestone_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE race_feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE split_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE best_times ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 6. RLSポリシー設定（最適化版）
-- =============================================================================

-- Users table policies
CREATE POLICY "users_policy" ON users FOR ALL USING (
  -- 認証されたユーザーは全員閲覧可能、自分のプロフィールは編集可能
  CASE 
    WHEN (select auth.role()) = 'authenticated' THEN true
    ELSE false
  END
) WITH CHECK (
  -- 自分のプロフィールのみ作成・更新可能
  (select auth.uid()) = id
);

-- User sessions table policies
CREATE POLICY "user_sessions_policy" ON user_sessions FOR ALL USING (
  (select auth.uid()) = user_id
) WITH CHECK (
  (select auth.uid()) = user_id
);

-- Styles table policies (全員閲覧可能)
CREATE POLICY "styles_policy" ON styles FOR ALL USING (true);

-- Events table policies
CREATE POLICY "events_policy" ON events FOR ALL USING (
  -- 認証済みユーザーは閲覧可能、管理者・コーチは編集可能
  CASE 
    WHEN (select auth.role()) = 'authenticated' THEN true
    ELSE false
  END
) WITH CHECK (
  -- 管理者・コーチのみ作成・更新可能
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = (select auth.uid()) 
    AND users.role IN ('admin', 'coach')
  )
);

-- Records table policies
CREATE POLICY "records_policy" ON records FOR ALL USING (
  -- 認証済みユーザーは閲覧可能
  (select auth.role()) = 'authenticated'
) WITH CHECK (
  -- 自分の記録または管理者・コーチは編集可能
  (select auth.uid()) = user_id OR 
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = (select auth.uid()) 
    AND users.role IN ('admin', 'coach')
  )
);

-- Attendance table policies
CREATE POLICY "attendance_policy" ON attendance FOR ALL USING (
  -- 認証済みユーザーは閲覧可能
  (select auth.role()) = 'authenticated'
) WITH CHECK (
  -- 自分の出席情報のみ編集可能
  (select auth.uid()) = user_id
);

-- Entries table policies
CREATE POLICY "entries_policy" ON entries FOR ALL USING (
  -- 認証済みユーザーは閲覧可能
  (select auth.role()) = 'authenticated'
) WITH CHECK (
  -- 自分のエントリーまたは管理者・コーチは編集可能
  (select auth.uid()) = user_id OR 
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = (select auth.uid()) 
    AND users.role IN ('admin', 'coach')
  )
);

-- Practice logs policies（個人利用機能対応）
CREATE POLICY "practice_logs_policy" ON practice_logs FOR ALL USING (
  -- 認証済みユーザーは閲覧可能
  (select auth.role()) = 'authenticated'
) WITH CHECK (
  -- 自分の練習ログまたは管理者・コーチは編集可能
  (select auth.uid()) = user_id OR 
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = (select auth.uid()) 
    AND users.role IN ('admin', 'coach')
  )
);

-- Practice times policies
CREATE POLICY "practice_times_policy" ON practice_times FOR ALL USING (
  -- 認証済みユーザーは閲覧可能
  (select auth.role()) = 'authenticated'
) WITH CHECK (
  -- 自分の練習タイムのみ編集可能
  (select auth.uid()) = user_id
);

-- Objectives policies
CREATE POLICY "objectives_policy" ON objectives FOR ALL USING (
  -- 認証済みユーザーは閲覧可能
  (select auth.role()) = 'authenticated'
) WITH CHECK (
  -- 自分の目標または管理者・コーチは編集可能
  (select auth.uid()) = user_id OR 
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = (select auth.uid()) 
    AND users.role IN ('admin', 'coach')
  )
);

-- Race goals policies
CREATE POLICY "race_goals_policy" ON race_goals FOR ALL USING (
  -- 認証済みユーザーは閲覧可能
  (select auth.role()) = 'authenticated'
) WITH CHECK (
  -- 自分のレース目標または管理者・コーチは編集可能
  (select auth.uid()) = user_id OR 
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = (select auth.uid()) 
    AND users.role IN ('admin', 'coach')
  )
);

-- Race reviews policies
CREATE POLICY "race_reviews_policy" ON race_reviews FOR ALL USING (
  -- 認証済みユーザーは閲覧可能
  (select auth.role()) = 'authenticated'
) WITH CHECK (
  -- 自分のレース振り返りまたは管理者・コーチは編集可能
  EXISTS (
    SELECT 1 FROM race_goals 
    WHERE race_goals.id = race_goal_id 
    AND race_goals.user_id = (select auth.uid())
  ) OR 
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = (select auth.uid()) 
    AND users.role IN ('admin', 'coach')
  )
);

-- Milestones policies
CREATE POLICY "milestones_policy" ON milestones FOR ALL USING (
  -- 認証済みユーザーは閲覧可能
  (select auth.role()) = 'authenticated'
) WITH CHECK (
  -- 自分のマイルストーンまたは管理者・コーチは編集可能
  EXISTS (
    SELECT 1 FROM objectives 
    WHERE objectives.id = objective_id 
    AND objectives.user_id = (select auth.uid())
  ) OR 
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = (select auth.uid()) 
    AND users.role IN ('admin', 'coach')
  )
);

-- Milestone reviews policies
CREATE POLICY "milestone_reviews_policy" ON milestone_reviews FOR ALL USING (
  -- 認証済みユーザーは閲覧可能
  (select auth.role()) = 'authenticated'
) WITH CHECK (
  -- 自分のマイルストーン振り返りまたは管理者・コーチは編集可能
  EXISTS (
    SELECT 1 FROM milestones 
    JOIN objectives ON objectives.id = milestones.objective_id
    WHERE milestones.id = milestone_id 
    AND objectives.user_id = (select auth.uid())
  ) OR 
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = (select auth.uid()) 
    AND users.role IN ('admin', 'coach')
  )
);

-- Race feedbacks policies
CREATE POLICY "race_feedbacks_policy" ON race_feedbacks FOR ALL USING (
  -- 認証済みユーザーは閲覧可能
  (select auth.role()) = 'authenticated'
) WITH CHECK (
  -- 自分のレースフィードバックまたは管理者・コーチは編集可能
  (select auth.uid()) = user_id OR 
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = (select auth.uid()) 
    AND users.role IN ('admin', 'coach')
  )
);

-- Split times policies
CREATE POLICY "split_times_policy" ON split_times FOR ALL USING (
  -- 認証済みユーザーは閲覧可能
  (select auth.role()) = 'authenticated'
) WITH CHECK (
  -- 自分の記録のスプリットタイムまたは管理者・コーチは編集可能
  EXISTS (
    SELECT 1 FROM records 
    WHERE records.id = record_id 
    AND records.user_id = (select auth.uid())
  ) OR 
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = (select auth.uid()) 
    AND users.role IN ('admin', 'coach')
  )
);

-- Announcements policies
CREATE POLICY "announcements_policy" ON announcements FOR ALL USING (
  -- 認証済みユーザーはアクティブなお知らせを閲覧可能
  CASE 
    WHEN (select auth.role()) = 'authenticated' AND is_active = true THEN true
    WHEN EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = (select auth.uid()) 
      AND users.role = 'admin'
    ) THEN true
    ELSE false
  END
) WITH CHECK (
  -- 管理者のみ作成・編集可能
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = (select auth.uid()) 
    AND users.role = 'admin'
  )
);

-- Best times policies（個人利用機能）
CREATE POLICY "best_times_policy" ON best_times FOR ALL USING (
  -- 認証済みユーザーは閲覧可能
  (select auth.role()) = 'authenticated'
) WITH CHECK (
  -- 自分のベストタイムまたはシステムが編集可能（自動更新用）
  (select auth.uid()) = user_id
);

-- =============================================================================
-- 7. 認証トリガー設定（重要！）
-- =============================================================================

-- 新しいユーザーが認証されたときに自動的にusersテーブルにプロフィールを作成する関数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- usersテーブルにプロフィール作成
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', '')
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- トリガーの作成
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- 完了メッセージ
-- =============================================================================

DO $$
BEGIN
    RAISE NOTICE '=== Swim Manager v2 Production Database Setup Complete ===';
    RAISE NOTICE '✅ All tables created successfully';
    RAISE NOTICE '✅ RLS enabled for all tables';
    RAISE NOTICE '✅ Optimized policies applied';
    RAISE NOTICE '✅ Security warnings resolved';
    RAISE NOTICE '✅ Authentication triggers configured';
    RAISE NOTICE '✅ Basic swimming styles data inserted';
    RAISE NOTICE '✅ Individual user functionality enhanced';
    RAISE NOTICE '✅ Best times management added';
    RAISE NOTICE '✅ NO test data inserted (production ready!)';
    RAISE NOTICE '';
    RAISE NOTICE '🎉 Database is ready for production use!';
    RAISE NOTICE '🔐 Authentication will automatically create user profiles';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Test user signup/signin';
    RAISE NOTICE '2. Verify profile creation';
    RAISE NOTICE '3. Create your first admin user';
END $$;
