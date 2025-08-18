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

-- インデックス
CREATE INDEX idx_objectives_user_id ON objectives(user_id);
CREATE INDEX idx_objectives_event_id ON objectives(attendance_event_id);
CREATE INDEX idx_objectives_style_id ON objectives(style_id);

CREATE INDEX idx_race_goals_user_id ON race_goals(user_id);
CREATE INDEX idx_race_goals_event_id ON race_goals(attendance_event_id);
CREATE INDEX idx_race_goals_style_id ON race_goals(style_id);
