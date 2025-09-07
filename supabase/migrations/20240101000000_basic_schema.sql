-- 基本的なスキーマ設定
-- Supabase Authと連携する基本的なテーブル構造

-- ユーザープロフィールテーブル（Supabase Authと連携）
CREATE TABLE IF NOT EXISTS users (
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

-- 競技種目テーブル
CREATE TABLE IF NOT EXISTS styles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  distance INTEGER NOT NULL,
  stroke TEXT NOT NULL CHECK (stroke IN ('freestyle', 'backstroke', 'breaststroke', 'butterfly', 'medley')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 大会テーブル
CREATE TABLE IF NOT EXISTS competitions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  competition_date DATE NOT NULL,
  location TEXT,
  pool_type INTEGER CHECK (pool_type IN (0, 1)), -- 0: 短水路, 1: 長水路
  pool_length INTEGER CHECK (pool_length IN (25, 50)),
  competition_category TEXT CHECK (competition_category IN ('official', 'record_meet', 'time_trial')),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 種目テーブル
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE NOT NULL,
  style_id UUID REFERENCES styles(id) ON DELETE CASCADE NOT NULL,
  event_name TEXT NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female', 'mixed')),
  age_group TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 記録テーブル
CREATE TABLE IF NOT EXISTS records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  time_seconds DECIMAL(8,3) NOT NULL,
  record_date DATE NOT NULL,
  is_personal_best BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 練習ログテーブル
CREATE TABLE IF NOT EXISTS practice_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  practice_date DATE NOT NULL,
  duration_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 練習時間テーブル
CREATE TABLE IF NOT EXISTS practice_times (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  practice_log_id UUID REFERENCES practice_logs(id) ON DELETE CASCADE NOT NULL,
  style_id UUID REFERENCES styles(id) ON DELETE CASCADE NOT NULL,
  distance INTEGER NOT NULL,
  time_seconds DECIMAL(8,3) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 出席テーブル
CREATE TABLE IF NOT EXISTS attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  attendance_date DATE NOT NULL,
  status TEXT DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'excused')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- お知らせテーブル
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  is_important BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_records_user_id ON records(user_id);
CREATE INDEX IF NOT EXISTS idx_records_event_id ON records(event_id);
CREATE INDEX IF NOT EXISTS idx_practice_logs_user_id ON practice_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_competitions_user_id ON competitions(user_id);

-- RLS (Row Level Security) の有効化
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE records ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- 基本的なRLSポリシー
-- ユーザーは自分のデータのみアクセス可能
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- 記録は自分のデータのみアクセス可能
CREATE POLICY "Users can view own records" ON records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own records" ON records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own records" ON records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own records" ON records FOR DELETE USING (auth.uid() = user_id);

-- 練習ログは自分のデータのみアクセス可能
CREATE POLICY "Users can view own practice logs" ON practice_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own practice logs" ON practice_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own practice logs" ON practice_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own practice logs" ON practice_logs FOR DELETE USING (auth.uid() = user_id);

-- 大会は自分のデータのみアクセス可能
CREATE POLICY "Users can view own competitions" ON competitions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own competitions" ON competitions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own competitions" ON competitions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own competitions" ON competitions FOR DELETE USING (auth.uid() = user_id);

-- 出席は自分のデータのみアクセス可能
CREATE POLICY "Users can view own attendance" ON attendance FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own attendance" ON attendance FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own attendance" ON attendance FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own attendance" ON attendance FOR DELETE USING (auth.uid() = user_id);

-- お知らせは全員が閲覧可能
CREATE POLICY "Everyone can view announcements" ON announcements FOR SELECT USING (true);
CREATE POLICY "Admins can insert announcements" ON announcements FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update announcements" ON announcements FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete announcements" ON announcements FOR DELETE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- 種目とスタイルは全員が閲覧可能
CREATE POLICY "Everyone can view styles" ON styles FOR SELECT USING (true);
CREATE POLICY "Everyone can view events" ON events FOR SELECT USING (true);
CREATE POLICY "Everyone can view practice times" ON practice_times FOR SELECT USING (true);
