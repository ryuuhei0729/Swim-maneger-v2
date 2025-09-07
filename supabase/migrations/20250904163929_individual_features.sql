-- 個人利用機能のためのデータベース拡張
-- requirement.mdに基づく個人利用機能の実装

-- =============================================================================
-- 1. 個人大会記録テーブルの拡張
-- =============================================================================

-- 大会情報テーブル（個人利用対応）
CREATE TABLE IF NOT EXISTS competitions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  competition_date DATE NOT NULL,
  location TEXT,
  pool_type INTEGER CHECK (pool_type IN (0, 1)), -- 0: 短水路, 1: 長水路
  pool_length INTEGER CHECK (pool_length IN (25, 50)),
  competition_category TEXT CHECK (competition_category IN ('official', 'record_meet', 'time_trial')), -- 公式/記録会/タイムトライアル
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL, -- 個人利用のため必須
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 記録テーブルの拡張（個人利用対応）
-- 既存のrecordsテーブルに不足しているカラムを追加
ALTER TABLE records 
ADD COLUMN IF NOT EXISTS record_date DATE,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS pool_type INTEGER CHECK (pool_type IN (0, 1)),
ADD COLUMN IF NOT EXISTS pool_length INTEGER CHECK (pool_length IN (25, 50)),
ADD COLUMN IF NOT EXISTS is_relay BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS rank_position INTEGER,
ADD COLUMN IF NOT EXISTS memo TEXT,
ADD COLUMN IF NOT EXISTS competition_id UUID REFERENCES competitions(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS style_id UUID REFERENCES styles(id) ON DELETE CASCADE;

-- スプリットタイムテーブルの拡張
CREATE TABLE IF NOT EXISTS split_times (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  record_id UUID REFERENCES records(id) ON DELETE CASCADE,
  distance INTEGER NOT NULL, -- 12.5m, 15m, 25m等
  split_time DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 2. 個人練習記録テーブルの拡張
-- =============================================================================

-- 練習タグテーブル（個人利用対応）
CREATE TABLE IF NOT EXISTS practice_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6', -- デフォルトカラー
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- 練習ログテーブルの拡張（個人利用対応）
-- 既存のpractice_logsテーブルに不足しているカラムを追加
ALTER TABLE practice_logs 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS date DATE,
ADD COLUMN IF NOT EXISTS location TEXT;

-- practice_logsテーブルのuser_idを必須に変更（個人利用のため）
-- 注意: 既存データがある場合は先にデータを適切に設定してください
-- ALTER TABLE practice_logs ALTER COLUMN user_id SET NOT NULL;

-- 練習ログと練習タグの関連テーブル
CREATE TABLE IF NOT EXISTS practice_log_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  practice_log_id UUID REFERENCES practice_logs(id) ON DELETE CASCADE,
  practice_tag_id UUID REFERENCES practice_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(practice_log_id, practice_tag_id)
);

-- =============================================================================
-- 3. 個人目標管理テーブルの拡張
-- =============================================================================

-- 個人目標テーブル（個人利用対応）
CREATE TABLE IF NOT EXISTS personal_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  goal_type TEXT CHECK (goal_type IN ('time', 'technique', 'training_frequency', 'training_distance')) NOT NULL,
  style_id UUID REFERENCES styles(id) ON DELETE CASCADE, -- タイム目標の場合のみ
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
CREATE TABLE IF NOT EXISTS goal_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  personal_goal_id UUID REFERENCES personal_goals(id) ON DELETE CASCADE,
  progress_date DATE NOT NULL,
  progress_value DECIMAL(10,2), -- 数値的な進捗（タイム、距離など）
  progress_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 4. ベストタイム管理テーブル
-- =============================================================================

-- ベストタイムテーブル（個人利用機能）
CREATE TABLE IF NOT EXISTS best_times (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  style_id UUID REFERENCES styles(id) ON DELETE CASCADE NOT NULL,
  pool_type INTEGER NOT NULL CHECK (pool_type IN (0, 1)), -- 0=短水路, 1=長水路
  best_time DECIMAL(10,2) NOT NULL,
  record_id UUID REFERENCES records(id) ON DELETE SET NULL, -- ベストタイムを出した記録への参照
  achieved_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, style_id, pool_type)
);

-- =============================================================================
-- 5. インデックス作成
-- =============================================================================

-- Competitions table indexes
CREATE INDEX IF NOT EXISTS idx_competitions_user_id ON competitions(user_id);
CREATE INDEX IF NOT EXISTS idx_competitions_date ON competitions(competition_date);
CREATE INDEX IF NOT EXISTS idx_competitions_category ON competitions(competition_category);

-- Records table indexes（個人利用機能対応）
CREATE INDEX IF NOT EXISTS idx_records_record_date ON records(record_date);
CREATE INDEX IF NOT EXISTS idx_records_pool_type ON records(pool_type);
CREATE INDEX IF NOT EXISTS idx_records_competition_id ON records(competition_id);

-- Split times table indexes
CREATE INDEX IF NOT EXISTS idx_split_times_record_id ON split_times(record_id);
CREATE INDEX IF NOT EXISTS idx_split_times_distance ON split_times(distance);

-- Practice tags table indexes
CREATE INDEX IF NOT EXISTS idx_practice_tags_user_id ON practice_tags(user_id);

-- Practice logs table indexes（個人利用機能対応）
CREATE INDEX IF NOT EXISTS idx_practice_logs_user_id ON practice_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_practice_logs_practice_date ON practice_logs(practice_date);

-- Practice log tags table indexes
CREATE INDEX IF NOT EXISTS idx_practice_log_tags_log_id ON practice_log_tags(practice_log_id);
CREATE INDEX IF NOT EXISTS idx_practice_log_tags_tag_id ON practice_log_tags(practice_tag_id);

-- Personal goals table indexes
CREATE INDEX IF NOT EXISTS idx_personal_goals_user_id ON personal_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_personal_goals_goal_type ON personal_goals(goal_type);
CREATE INDEX IF NOT EXISTS idx_personal_goals_target_date ON personal_goals(target_date);

-- Goal progress table indexes
CREATE INDEX IF NOT EXISTS idx_goal_progress_goal_id ON goal_progress(personal_goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_progress_date ON goal_progress(progress_date);

-- Best times table indexes
CREATE INDEX IF NOT EXISTS idx_best_times_user_id ON best_times(user_id);
CREATE INDEX IF NOT EXISTS idx_best_times_style_pool ON best_times(style_id, pool_type);

-- =============================================================================
-- 6. Row Level Security (RLS) ポリシー
-- =============================================================================

-- 新しいテーブルのみRLSを有効化（基本スキーマで既に設定済みのテーブルは除外）

-- Practice tags table RLS
ALTER TABLE practice_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own practice tags" ON practice_tags
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own practice tags" ON practice_tags
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own practice tags" ON practice_tags
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own practice tags" ON practice_tags
  FOR DELETE USING (auth.uid() = user_id);

-- Personal goals table RLS
ALTER TABLE personal_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own personal goals" ON personal_goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own personal goals" ON personal_goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own personal goals" ON personal_goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own personal goals" ON personal_goals
  FOR DELETE USING (auth.uid() = user_id);

-- Goal progress table RLS
ALTER TABLE goal_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own goal progress" ON goal_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM personal_goals 
      WHERE personal_goals.id = goal_progress.personal_goal_id 
      AND personal_goals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own goal progress" ON goal_progress
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM personal_goals 
      WHERE personal_goals.id = goal_progress.personal_goal_id 
      AND personal_goals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own goal progress" ON goal_progress
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM personal_goals 
      WHERE personal_goals.id = goal_progress.personal_goal_id 
      AND personal_goals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own goal progress" ON goal_progress
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM personal_goals 
      WHERE personal_goals.id = goal_progress.personal_goal_id 
      AND personal_goals.user_id = auth.uid()
    )
  );

-- Best times table RLS
ALTER TABLE best_times ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own best times" ON best_times
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own best times" ON best_times
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own best times" ON best_times
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own best times" ON best_times
  FOR DELETE USING (auth.uid() = user_id);

-- Split times table RLS
ALTER TABLE split_times ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own split times" ON split_times
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM records 
      WHERE records.id = split_times.record_id 
      AND records.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own split times" ON split_times
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM records 
      WHERE records.id = split_times.record_id 
      AND records.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own split times" ON split_times
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM records 
      WHERE records.id = split_times.record_id 
      AND records.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own split times" ON split_times
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM records 
      WHERE records.id = split_times.record_id 
      AND records.user_id = auth.uid()
    )
  );

-- Practice log tags table RLS
ALTER TABLE practice_log_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own practice log tags" ON practice_log_tags
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM practice_logs 
      WHERE practice_logs.id = practice_log_tags.practice_log_id 
      AND practice_logs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own practice log tags" ON practice_log_tags
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM practice_logs 
      WHERE practice_logs.id = practice_log_tags.practice_log_id 
      AND practice_logs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own practice log tags" ON practice_log_tags
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM practice_logs 
      WHERE practice_logs.id = practice_log_tags.practice_log_id 
      AND practice_logs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own practice log tags" ON practice_log_tags
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM practice_logs 
      WHERE practice_logs.id = practice_log_tags.practice_log_id 
      AND practice_logs.user_id = auth.uid()
    )
  );

-- =============================================================================
-- 7. トリガー関数（ベストタイム自動更新）
-- =============================================================================

-- ベストタイム自動更新トリガー関数
CREATE OR REPLACE FUNCTION update_best_times()
RETURNS TRIGGER AS $$
BEGIN
  -- 新しい記録がベストタイムかチェック
  INSERT INTO best_times (user_id, style_id, pool_type, best_time, record_id, achieved_date)
  VALUES (NEW.user_id, NEW.style_id, NEW.pool_type, NEW.time, NEW.id, NEW.record_date)
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
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 記録テーブルにトリガーを設定
CREATE TRIGGER trigger_update_best_times
  AFTER INSERT OR UPDATE ON records
  FOR EACH ROW
  WHEN (NEW.pool_type IS NOT NULL AND NEW.style_id IS NOT NULL AND NEW.record_date IS NOT NULL)
  EXECUTE FUNCTION update_best_times();

-- =============================================================================
-- 8. サンプル練習タグデータ
-- =============================================================================

-- デフォルトの練習タグ（ユーザーが作成時に参考にできる）
-- 実際の使用時は各ユーザーが個別に作成する
-- INSERT INTO practice_tags (user_id, name, color) VALUES
-- ('your-user-id', 'AN2', '#EF4444'),
-- ('your-user-id', 'EN3', '#3B82F6'),
-- ('your-user-id', '耐乳酸', '#F59E0B'),
-- ('your-user-id', 'ショートサークル', '#10B981'),
-- ('your-user-id', '長水路', '#8B5CF6');
