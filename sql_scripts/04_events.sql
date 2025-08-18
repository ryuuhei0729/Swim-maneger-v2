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

-- インデックス
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_type ON events(type);
CREATE INDEX idx_events_is_attendance ON events(is_attendance);
CREATE INDEX idx_events_is_competition ON events(is_competition);

CREATE INDEX idx_attendance_user_id ON attendance(user_id);
CREATE INDEX idx_attendance_event_id ON attendance(attendance_event_id);
CREATE INDEX idx_attendance_status ON attendance(status);

CREATE INDEX idx_entries_user_id ON entries(user_id);
CREATE INDEX idx_entries_event_id ON entries(attendance_event_id);
CREATE INDEX idx_entries_style_id ON entries(style_id);
