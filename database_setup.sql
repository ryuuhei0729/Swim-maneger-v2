-- Swim Manager v2 Database Setup for Supabase (Clean Version)
-- Active Storageと認証関連のテーブルを除外

-- 既存のテーブルを全て削除（クリーンアップ）
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

-- 1. ユーザーテーブル（Supabase Authと連携）
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'swimmer' CHECK (role IN ('admin', 'coach', 'swimmer')),
  generation INTEGER,
  birthday DATE,
  bio TEXT,
  gender INTEGER DEFAULT 0 CHECK (gender IN (0, 1, 2)), -- 0: 未設定, 1: 男性, 2: 女性
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.5. ユーザーセッションテーブル
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

-- 2. 泳法・種目テーブル
CREATE TABLE styles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_jp TEXT NOT NULL,
  name TEXT NOT NULL,
  distance INTEGER NOT NULL,
  style INTEGER DEFAULT 0 CHECK (style IN (0, 1, 2, 3, 4)), -- 0: フリー, 1: バック, 2: ブレスト, 3: バタフライ, 4: メドレー
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. イベントテーブル
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

-- 4. 記録テーブル
CREATE TABLE records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  style_id UUID REFERENCES styles(id) ON DELETE CASCADE,
  time DECIMAL(10,2) NOT NULL,
  note TEXT,
  video_url TEXT, -- Supabase StorageのURLを保存
  attendance_event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 出席テーブル
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

-- 6. エントリーテーブル
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

-- 7. 練習ログテーブル
CREATE TABLE practice_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  attendance_event_id UUID REFERENCES events(id) ON DELETE CASCADE,
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

-- 8. 練習タイムテーブル
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

-- 9. 目標テーブル
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

-- 10. レース目標テーブル
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

-- 11. レース振り返りテーブル
CREATE TABLE race_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  race_goal_id UUID REFERENCES race_goals(id) ON DELETE CASCADE,
  style_id UUID REFERENCES styles(id) ON DELETE CASCADE,
  time DECIMAL(10,2) NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. マイルストーンテーブル
CREATE TABLE milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  objective_id UUID REFERENCES objectives(id) ON DELETE CASCADE,
  milestone_type TEXT NOT NULL CHECK (milestone_type IN ('quality', 'quantity')),
  limit_date DATE NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. マイルストーン振り返りテーブル
CREATE TABLE milestone_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  milestone_id UUID REFERENCES milestones(id) ON DELETE CASCADE,
  achievement_rate INTEGER NOT NULL,
  negative_note TEXT NOT NULL,
  positive_note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. レースフィードバックテーブル
CREATE TABLE race_feedbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  race_goal_id UUID REFERENCES race_goals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. スプリットタイムテーブル
CREATE TABLE split_times (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  record_id UUID REFERENCES records(id) ON DELETE CASCADE,
  race_goal_id UUID REFERENCES race_goals(id) ON DELETE SET NULL,
  distance INTEGER NOT NULL,
  split_time DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. お知らせテーブル
CREATE TABLE announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスの作成
CREATE INDEX idx_users_name ON users(name);
CREATE INDEX idx_users_generation ON users(generation);
CREATE INDEX idx_users_gender ON users(gender);
-- user_type column does not exist, using role instead
CREATE INDEX idx_users_role ON users(role);

CREATE INDEX idx_styles_distance ON styles(distance);
CREATE INDEX idx_styles_style ON styles(style);

CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_type ON events(type);
CREATE INDEX idx_events_is_attendance ON events(is_attendance);
CREATE INDEX idx_events_is_competition ON events(is_competition);

CREATE INDEX idx_records_user_id ON records(user_id);
CREATE INDEX idx_records_style_id ON records(style_id);
CREATE INDEX idx_records_attendance_event_id ON records(attendance_event_id);

CREATE INDEX idx_attendance_user_id ON attendance(user_id);
CREATE INDEX idx_attendance_event_id ON attendance(attendance_event_id);
CREATE INDEX idx_attendance_status ON attendance(status);

CREATE INDEX idx_entries_user_id ON entries(user_id);
CREATE INDEX idx_entries_event_id ON entries(attendance_event_id);
CREATE INDEX idx_entries_style_id ON entries(style_id);

CREATE INDEX idx_practice_logs_event_id ON practice_logs(attendance_event_id);
CREATE INDEX idx_practice_logs_style ON practice_logs(style);

CREATE INDEX idx_practice_times_user_id ON practice_times(user_id);
CREATE INDEX idx_practice_times_log_id ON practice_times(practice_log_id);

CREATE INDEX idx_objectives_user_id ON objectives(user_id);
CREATE INDEX idx_objectives_event_id ON objectives(attendance_event_id);
CREATE INDEX idx_objectives_style_id ON objectives(style_id);

CREATE INDEX idx_race_goals_user_id ON race_goals(user_id);
CREATE INDEX idx_race_goals_event_id ON race_goals(attendance_event_id);
CREATE INDEX idx_race_goals_style_id ON race_goals(style_id);

CREATE INDEX idx_announcements_is_active ON announcements(is_active);
CREATE INDEX idx_announcements_published_at ON announcements(published_at);

-- 基本的な泳法・種目のデータを挿入
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
('200m個人メドレー', '200m Individual Medley', 200, 4),
('400m個人メドレー', '400m Individual Medley', 400, 4);

-- RLS (Row Level Security) の設定
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

-- 注意: RLSポリシーは別ファイル (08_rls_policies_optimized.sql) で定義されています
-- ここではRLSを有効化するだけで、具体的なポリシーは設定しません

-- 新しいユーザーが認証されたときに自動的にusersテーブルにプロフィールを作成する関数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
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
