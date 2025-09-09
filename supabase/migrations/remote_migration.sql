-- リモートSupabaseデータベース用のマイグレーション
-- 既存のテーブルを削除してから新しい構造で再作成

-- =============================================================================
-- 1. 既存のテーブルとデータを削除
-- =============================================================================

-- 外部キー制約を無効化（削除時の制約エラーを回避）
SET session_replication_role = replica;

-- 既存のテーブルを削除（依存関係の順序で削除）
DROP TABLE IF EXISTS practice_times CASCADE;
DROP TABLE IF EXISTS practice_logs CASCADE;
DROP TABLE IF EXISTS split_times CASCADE;
DROP TABLE IF EXISTS records CASCADE;
DROP TABLE IF EXISTS competitions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS styles CASCADE;

-- その他の既存テーブルも削除（必要に応じて）
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS practice_tags CASCADE;
DROP TABLE IF EXISTS practice_log_tags CASCADE;
DROP TABLE IF EXISTS personal_goals CASCADE;
DROP TABLE IF EXISTS goal_progress CASCADE;
DROP TABLE IF EXISTS best_times CASCADE;

-- 外部キー制約を再有効化
SET session_replication_role = DEFAULT;

-- =============================================================================
-- 2. 新しいテーブル構造の作成
-- =============================================================================

-- 0. Styleテーブル（固定データ）
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

-- 1. Userテーブル（Supabase Authと連携）
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

-- 2. Competitionテーブル
CREATE TABLE competitions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  place TEXT NOT NULL,
  pool_type INTEGER DEFAULT 0 CHECK (pool_type IN (0, 1)), -- 0: short, 1: long
  note TEXT
);

-- 3. Recordテーブル
CREATE TABLE records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  competition_id UUID REFERENCES competitions(id) ON DELETE SET NULL,
  style_id INTEGER NOT NULL REFERENCES styles(id) ON DELETE CASCADE,
  time DECIMAL(10,2) NOT NULL,
  video_url TEXT,
  note TEXT
);

-- 4. SplitTimeテーブル
CREATE TABLE split_times (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  record_id UUID NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  distance INTEGER NOT NULL,
  split_time DECIMAL(10,2) NOT NULL
);

-- 5. PracticeLogテーブル
CREATE TABLE practice_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  tags JSON,
  style TEXT NOT NULL,
  rep_count INTEGER NOT NULL,
  set_count INTEGER NOT NULL,
  distance INTEGER NOT NULL,
  circle DECIMAL(10,2),
  note TEXT
);

-- 6. PracticeTimeテーブル
CREATE TABLE practice_times (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  practice_log_id UUID NOT NULL REFERENCES practice_logs(id) ON DELETE CASCADE,
  rep_number INTEGER NOT NULL,
  set_number INTEGER NOT NULL,
  time DECIMAL(10,2) NOT NULL
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

-- Practice logs table indexes
CREATE INDEX idx_practice_logs_user_id ON practice_logs(user_id);
CREATE INDEX idx_practice_logs_date ON practice_logs(date);
CREATE INDEX idx_practice_logs_style ON practice_logs(style);

-- Practice times table indexes
CREATE INDEX idx_practice_times_practice_log_id ON practice_times(practice_log_id);
CREATE INDEX idx_practice_times_rep_set ON practice_times(rep_number, set_number);

-- =============================================================================
-- 4. Row Level Security (RLS) の有効化
-- =============================================================================

-- 全テーブルでRLSを有効化
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE records ENABLE ROW LEVEL SECURITY;
ALTER TABLE split_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_times ENABLE ROW LEVEL SECURITY;

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

-- Practice logs table policies
CREATE POLICY "Everyone can view practice_logs" ON practice_logs FOR SELECT USING (true);
CREATE POLICY "Everyone can insert practice_logs" ON practice_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Everyone can update practice_logs" ON practice_logs FOR UPDATE USING (true);
CREATE POLICY "Everyone can delete practice_logs" ON practice_logs FOR DELETE USING (true);

-- Practice times table policies
CREATE POLICY "Everyone can view practice_times" ON practice_times FOR SELECT USING (true);
CREATE POLICY "Everyone can insert practice_times" ON practice_times FOR INSERT WITH CHECK (true);
CREATE POLICY "Everyone can update practice_times" ON practice_times FOR UPDATE USING (true);
CREATE POLICY "Everyone can delete practice_times" ON practice_times FOR DELETE USING (true);

-- Styles table policies（読み取り専用）
CREATE POLICY "Everyone can view styles" ON styles FOR SELECT USING (true);

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
