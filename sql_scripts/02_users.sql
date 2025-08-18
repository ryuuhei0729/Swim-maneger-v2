-- 1. ユーザーテーブル（Supabase Authと連携）
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

-- インデックス
CREATE INDEX idx_users_name ON users(name);
CREATE INDEX idx_users_generation ON users(generation);
CREATE INDEX idx_users_gender ON users(gender);
CREATE INDEX idx_users_role ON users(role);
