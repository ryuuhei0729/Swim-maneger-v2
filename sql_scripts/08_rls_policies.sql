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

-- 基本的なポリシー（認証済みユーザーが読み書き可能）
-- Users table policies
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert their own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Styles table policies (読み取り専用)
CREATE POLICY "Anyone can view styles" ON styles FOR SELECT USING (true);

-- Events table policies
CREATE POLICY "Users can view all events" ON events FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Coaches and admins can manage events" ON events FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role IN ('admin', 'coach')
  )
);

-- Records table policies
CREATE POLICY "Users can view all records" ON records FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can manage their own records" ON records FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Coaches can manage all records" ON records FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role IN ('admin', 'coach')
  )
);

-- Attendance table policies
CREATE POLICY "Users can view all attendance" ON attendance FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can manage their own attendance" ON attendance FOR ALL USING (auth.uid() = user_id);

-- Practice logs and times policies
CREATE POLICY "Users can view all practice logs" ON practice_logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Coaches can manage practice logs" ON practice_logs FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role IN ('admin', 'coach')
  )
);

CREATE POLICY "Users can view all practice times" ON practice_times FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can manage their own practice times" ON practice_times FOR ALL USING (auth.uid() = user_id);

-- Goals and objectives policies
CREATE POLICY "Users can view all objectives" ON objectives FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can manage their own objectives" ON objectives FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Coaches can manage all objectives" ON objectives FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role IN ('admin', 'coach')
  )
);

-- Announcements policies
CREATE POLICY "Users can view active announcements" ON announcements FOR SELECT USING (
  auth.role() = 'authenticated' AND is_active = true
);
CREATE POLICY "Admins can manage announcements" ON announcements FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);
