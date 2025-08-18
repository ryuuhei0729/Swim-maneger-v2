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

-- インデックス
CREATE INDEX idx_records_user_id ON records(user_id);
CREATE INDEX idx_records_style_id ON records(style_id);
CREATE INDEX idx_records_attendance_event_id ON records(attendance_event_id);

CREATE INDEX idx_practice_logs_event_id ON practice_logs(attendance_event_id);
CREATE INDEX idx_practice_logs_style ON practice_logs(style);

CREATE INDEX idx_practice_times_user_id ON practice_times(user_id);
CREATE INDEX idx_practice_times_log_id ON practice_times(practice_log_id);
