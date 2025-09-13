-- 個人利用機能のためのデータベース拡張
-- remote_migration.sqlと同じ構造に統一し、個人利用機能を追加

-- =============================================================================
-- 1. 基本テーブル構造（remote_migration.sqlと同じ）
-- =============================================================================

-- 既存のテーブルを削除してから新しい構造で再作成
SET session_replication_role = replica;

DROP TABLE IF EXISTS practice_times CASCADE;
DROP TABLE IF EXISTS practice_logs CASCADE;
DROP TABLE IF EXISTS split_times CASCADE;
DROP TABLE IF EXISTS records CASCADE;
DROP TABLE IF EXISTS competitions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS styles CASCADE;
DROP TABLE IF EXISTS personal_goals CASCADE;
DROP TABLE IF EXISTS goal_progress CASCADE;
DROP TABLE IF EXISTS best_times CASCADE;
DROP TABLE IF EXISTS practice_tags CASCADE;
DROP TABLE IF EXISTS practice_log_tags CASCADE;

SET session_replication_role = DEFAULT;

-- Styleテーブル（固定データ）
CREATE TABLE styles (
  id INTEGER PRIMARY KEY,
  name_jp TEXT NOT NULL,
  name TEXT NOT NULL,
  style TEXT NOT NULL CHECK (style IN ('fr', 'br', 'ba', 'fly', 'im')),
  distance INTEGER NOT NULL
);

-- 固定データの挿入
INSERT INTO styles (id, name_jp, name, style, distance) VALUES
(1, '50m自由形', '50Fr', 'fr', 50),
(2, '100m自由形', '100Fr', 'fr', 100),
(3, '200m自由形', '200Fr', 'fr', 200),
(4, '400m自由形', '400Fr', 'fr', 400),
(5, '800m自由形', '800Fr', 'fr', 800),
(6, '50m平泳ぎ', '50Br', 'br', 50),
(7, '100m平泳ぎ', '100Br', 'br', 100),
(8, '200m平泳ぎ', '200Br', 'br', 200),
(9, '50m背泳ぎ', '50Ba', 'ba', 50),
(10, '100m背泳ぎ', '100Ba', 'ba', 100),
(11, '200m背泳ぎ', '200Ba', 'ba', 200),
(12, '50mバタフライ', '50Fly', 'fly', 50),
(13, '100mバタフライ', '100Fly', 'fly', 100),
(14, '200mバタフライ', '200Fly', 'fly', 200),
(15, '100m個人メドレー', '100IM', 'im', 100),
(16, '200m個人メドレー', '200IM', 'im', 200),
(17, '400m個人メドレー', '400IM', 'im', 400);

-- Userテーブル（Supabase Authと連携）
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  gender INTEGER NOT NULL DEFAULT 0 CHECK (gender IN (0, 1)), -- 0: male, 1: female
  birthday DATE,
  profile_image_path TEXT, -- Supabase Storageのパスを格納
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Competitionテーブル（remote_migration.sqlと同じ構造）
CREATE TABLE competitions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  place TEXT NOT NULL,
  pool_type INTEGER DEFAULT 0 CHECK (pool_type IN (0, 1)), -- 0: short, 1: long
  note TEXT
);

-- Recordテーブル（remote_migration.sqlと同じ構造）
CREATE TABLE records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  competition_id UUID REFERENCES competitions(id) ON DELETE SET NULL,
  style_id INTEGER NOT NULL REFERENCES styles(id) ON DELETE CASCADE,
  time DECIMAL(10,2) NOT NULL,
  video_url TEXT,
  note TEXT
);

-- SplitTimeテーブル（remote_migration.sqlと同じ構造）
CREATE TABLE split_times (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  record_id UUID NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  distance INTEGER NOT NULL,
  split_time DECIMAL(10,2) NOT NULL
);

-- PracticeTagテーブル（remote_migration.sqlと同じ構造）
CREATE TABLE practice_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6', -- デフォルトカラー
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- PracticeLogテーブル（remote_migration.sqlと同じ構造）
CREATE TABLE practice_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  place TEXT,
  style TEXT NOT NULL,
  rep_count INTEGER NOT NULL,
  set_count INTEGER NOT NULL,
  distance INTEGER NOT NULL,
  circle DECIMAL(10,2),
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PracticeLogTags関連テーブル（remote_migration.sqlと同じ構造）
CREATE TABLE practice_log_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  practice_log_id UUID NOT NULL REFERENCES practice_logs(id) ON DELETE CASCADE,
  practice_tag_id UUID NOT NULL REFERENCES practice_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(practice_log_id, practice_tag_id)
);

-- PracticeTimeテーブル（remote_migration.sqlと同じ構造）
CREATE TABLE practice_times (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  practice_log_id UUID NOT NULL REFERENCES practice_logs(id) ON DELETE CASCADE,
  rep_number INTEGER NOT NULL,
  set_number INTEGER NOT NULL,
  time DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 2. 個人利用機能拡張テーブル
-- =============================================================================

-- 個人目標テーブル（個人利用対応）
CREATE TABLE personal_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  goal_type TEXT CHECK (goal_type IN ('time', 'technique', 'training_frequency', 'training_distance')) NOT NULL,
  style_id INTEGER REFERENCES styles(id) ON DELETE CASCADE, -- タイム目標の場合のみ（INTEGERに修正）
  pool_type INTEGER CHECK (pool_type IN (0, 1)), -- タイム目標の場合のみ
  target_time DECIMAL(10,2), -- タイム目標の場合のみ
  title TEXT NOT NULL,
  description TEXT,
  target_date DATE,
  start_date DATE DEFAULT CURRENT_DATE,
  is_achieved BOOLEAN DEFAULT false,
  achieved_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 目標進捗記録テーブル
CREATE TABLE goal_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  personal_goal_id UUID NOT NULL REFERENCES personal_goals(id) ON DELETE CASCADE,
  progress_date DATE NOT NULL,
  progress_value DECIMAL(10,2), -- 数値的な進捗（タイム、距離など）
  progress_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ベストタイムテーブル（個人利用機能）
CREATE TABLE best_times (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  style_id INTEGER NOT NULL REFERENCES styles(id) ON DELETE CASCADE, -- INTEGERに修正
  pool_type INTEGER NOT NULL CHECK (pool_type IN (0, 1)), -- 0=短水路, 1=長水路
  best_time DECIMAL(10,2) NOT NULL,
  record_id UUID REFERENCES records(id) ON DELETE SET NULL, -- ベストタイムを出した記録への参照
  achieved_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, style_id, pool_type)
);

-- =============================================================================
-- 3. インデックスの作成
-- =============================================================================

-- Users table indexes
CREATE INDEX idx_users_name ON users(name);
CREATE INDEX idx_users_gender ON users(gender);

-- Competitions table indexes
CREATE INDEX idx_competitions_date ON competitions(date);
CREATE INDEX idx_competitions_title ON competitions(title);

-- Records table indexes
CREATE INDEX idx_records_user_id ON records(user_id);
CREATE INDEX idx_records_competition_id ON records(competition_id);
CREATE INDEX idx_records_style_id ON records(style_id);
CREATE INDEX idx_records_time ON records(time);

-- Split times table indexes
CREATE INDEX idx_split_times_record_id ON split_times(record_id);
CREATE INDEX idx_split_times_distance ON split_times(distance);

-- Practice tags table indexes
CREATE INDEX idx_practice_tags_user_id ON practice_tags(user_id);
CREATE INDEX idx_practice_tags_name ON practice_tags(name);

-- Practice logs table indexes
CREATE INDEX idx_practice_logs_user_id ON practice_logs(user_id);
CREATE INDEX idx_practice_logs_date ON practice_logs(date);
CREATE INDEX idx_practice_logs_style ON practice_logs(style);

-- Practice log tags table indexes
CREATE INDEX idx_practice_log_tags_practice_log_id ON practice_log_tags(practice_log_id);
CREATE INDEX idx_practice_log_tags_practice_tag_id ON practice_log_tags(practice_tag_id);

-- Practice times table indexes
CREATE INDEX idx_practice_times_practice_log_id ON practice_times(practice_log_id);
CREATE INDEX idx_practice_times_rep_set ON practice_times(rep_number, set_number);

-- Personal goals table indexes
CREATE INDEX idx_personal_goals_user_id ON personal_goals(user_id);
CREATE INDEX idx_personal_goals_goal_type ON personal_goals(goal_type);
CREATE INDEX idx_personal_goals_target_date ON personal_goals(target_date);

-- Goal progress table indexes
CREATE INDEX idx_goal_progress_goal_id ON goal_progress(personal_goal_id);
CREATE INDEX idx_goal_progress_date ON goal_progress(progress_date);

-- Best times table indexes
CREATE INDEX idx_best_times_user_id ON best_times(user_id);
CREATE INDEX idx_best_times_style_pool ON best_times(style_id, pool_type);

-- =============================================================================
-- 4. Row Level Security (RLS) の有効化
-- =============================================================================

-- 全テーブルでRLSを有効化
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE records ENABLE ROW LEVEL SECURITY;
ALTER TABLE split_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_log_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE best_times ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 5. RLSポリシー（全ユーザーが全データにアクセス可能）
-- =============================================================================

-- Users table policies
CREATE POLICY "Everyone can view users" ON users FOR SELECT USING (true);
CREATE POLICY "Everyone can insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Everyone can update users" ON users FOR UPDATE USING (true);
CREATE POLICY "Everyone can delete users" ON users FOR DELETE USING (true);

-- Competitions table policies
CREATE POLICY "Everyone can view competitions" ON competitions FOR SELECT USING (true);
CREATE POLICY "Everyone can insert competitions" ON competitions FOR INSERT WITH CHECK (true);
CREATE POLICY "Everyone can update competitions" ON competitions FOR UPDATE USING (true);
CREATE POLICY "Everyone can delete competitions" ON competitions FOR DELETE USING (true);

-- Records table policies
CREATE POLICY "Everyone can view records" ON records FOR SELECT USING (true);
CREATE POLICY "Everyone can insert records" ON records FOR INSERT WITH CHECK (true);
CREATE POLICY "Everyone can update records" ON records FOR UPDATE USING (true);
CREATE POLICY "Everyone can delete records" ON records FOR DELETE USING (true);

-- Split times table policies
CREATE POLICY "Everyone can view split_times" ON split_times FOR SELECT USING (true);
CREATE POLICY "Everyone can insert split_times" ON split_times FOR INSERT WITH CHECK (true);
CREATE POLICY "Everyone can update split_times" ON split_times FOR UPDATE USING (true);
CREATE POLICY "Everyone can delete split_times" ON split_times FOR DELETE USING (true);

-- Practice tags table policies
CREATE POLICY "Everyone can view practice_tags" ON practice_tags FOR SELECT USING (true);
CREATE POLICY "Everyone can insert practice_tags" ON practice_tags FOR INSERT WITH CHECK (true);
CREATE POLICY "Everyone can update practice_tags" ON practice_tags FOR UPDATE USING (true);
CREATE POLICY "Everyone can delete practice_tags" ON practice_tags FOR DELETE USING (true);

-- Practice logs table policies
CREATE POLICY "Everyone can view practice_logs" ON practice_logs FOR SELECT USING (true);
CREATE POLICY "Everyone can insert practice_logs" ON practice_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Everyone can update practice_logs" ON practice_logs FOR UPDATE USING (true);
CREATE POLICY "Everyone can delete practice_logs" ON practice_logs FOR DELETE USING (true);

-- Practice log tags table policies
CREATE POLICY "Everyone can view practice_log_tags" ON practice_log_tags FOR SELECT USING (true);
CREATE POLICY "Everyone can insert practice_log_tags" ON practice_log_tags FOR INSERT WITH CHECK (true);
CREATE POLICY "Everyone can update practice_log_tags" ON practice_log_tags FOR UPDATE USING (true);
CREATE POLICY "Everyone can delete practice_log_tags" ON practice_log_tags FOR DELETE USING (true);

-- Practice times table policies
CREATE POLICY "Everyone can view practice_times" ON practice_times FOR SELECT USING (true);
CREATE POLICY "Everyone can insert practice_times" ON practice_times FOR INSERT WITH CHECK (true);
CREATE POLICY "Everyone can update practice_times" ON practice_times FOR UPDATE USING (true);
CREATE POLICY "Everyone can delete practice_times" ON practice_times FOR DELETE USING (true);

-- Styles table policies（読み取り専用）
CREATE POLICY "Everyone can view styles" ON styles FOR SELECT USING (true);

-- 個人利用機能テーブル用ポリシー
-- Personal goals table policies
CREATE POLICY "Everyone can view personal_goals" ON personal_goals FOR SELECT USING (true);
CREATE POLICY "Everyone can insert personal_goals" ON personal_goals FOR INSERT WITH CHECK (true);
CREATE POLICY "Everyone can update personal_goals" ON personal_goals FOR UPDATE USING (true);
CREATE POLICY "Everyone can delete personal_goals" ON personal_goals FOR DELETE USING (true);

-- Goal progress table policies
CREATE POLICY "Everyone can view goal_progress" ON goal_progress FOR SELECT USING (true);
CREATE POLICY "Everyone can insert goal_progress" ON goal_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "Everyone can update goal_progress" ON goal_progress FOR UPDATE USING (true);
CREATE POLICY "Everyone can delete goal_progress" ON goal_progress FOR DELETE USING (true);

-- Best times table policies
CREATE POLICY "Everyone can view best_times" ON best_times FOR SELECT USING (true);
CREATE POLICY "Everyone can insert best_times" ON best_times FOR INSERT WITH CHECK (true);
CREATE POLICY "Everyone can update best_times" ON best_times FOR UPDATE USING (true);
CREATE POLICY "Everyone can delete best_times" ON best_times FOR DELETE USING (true);

-- =============================================================================
-- 8. ユーザープロフィール自動作成トリガー
-- =============================================================================

-- 既存のトリガーを削除（存在する場合）
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- ユーザープロフィール自動作成関数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, gender, birthday, profile_image_path, bio)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'gender')::INTEGER, 0), -- デフォルト: 0 (male)
    NULL,
    NULL, -- プロフィール画像は後でアップロード
    NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- トリガーの作成
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- 6. Supabase Storage の設定
-- =============================================================================

-- Storage バケットの作成
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS ポリシーの設定
-- 既存のポリシーを削除（存在する場合）
DROP POLICY IF EXISTS "Users can view profile images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own profile images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile images" ON storage.objects;

-- プロフィール画像のアクセス制御
CREATE POLICY "Users can view profile images" ON storage.objects
FOR SELECT USING (bucket_id = 'profile-images');

CREATE POLICY "Users can upload their own profile images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own profile images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profile-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own profile images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profile-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- =============================================================================
-- 7. 個人利用機能用トリガー関数（ベストタイム自動更新）
-- =============================================================================

-- ベストタイム自動更新トリガー関数（簡易版）
CREATE OR REPLACE FUNCTION update_best_times()
RETURNS TRIGGER AS $$
BEGIN
  -- 基本的なベストタイム更新ロジック
  -- pool_typeが設定されている場合のみ実行
  IF NEW.competition_id IS NOT NULL THEN
    INSERT INTO best_times (user_id, style_id, pool_type, best_time, record_id, achieved_date)
    SELECT NEW.user_id, NEW.style_id, COALESCE(c.pool_type, 0), NEW.time, NEW.id, c.date
    FROM competitions c WHERE c.id = NEW.competition_id
    ON CONFLICT (user_id, style_id, pool_type)
    DO UPDATE SET
      best_time = CASE 
        WHEN EXCLUDED.best_time < best_times.best_time THEN EXCLUDED.best_time
        ELSE best_times.best_time
      END,
      record_id = CASE 
        WHEN EXCLUDED.best_time < best_times.best_time THEN EXCLUDED.record_id
        ELSE best_times.record_id
      END,
      achieved_date = CASE 
        WHEN EXCLUDED.best_time < best_times.best_time THEN EXCLUDED.achieved_date
        ELSE best_times.achieved_date
      END,
      updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 記録テーブルにトリガーを設定
CREATE TRIGGER trigger_update_best_times
  AFTER INSERT OR UPDATE ON records
  FOR EACH ROW
  EXECUTE FUNCTION update_best_times();
