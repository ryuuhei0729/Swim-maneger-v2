-- 練習記録正規化のためのDB変更
-- Practice（練習日）テーブルの新設とPracticeLogの構造変更

-- 1. 新しいPracticeテーブルを作成（既に存在する場合はスキップ）
CREATE TABLE IF NOT EXISTS practice (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    place TEXT,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. practice_logsテーブルに外部キーを追加し、dateとplaceを削除準備
-- practice_idカラムが既に存在する場合はスキップ
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'practice_logs' AND column_name = 'practice_id') THEN
        ALTER TABLE practice_logs ADD COLUMN practice_id UUID REFERENCES practice(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 3. 既存のpractice_logsレコードからpracticeレコードを生成（重複を避ける）
INSERT INTO practice (user_id, date, place, note, created_at, updated_at)
SELECT DISTINCT 
    pl.user_id, 
    pl.date, 
    pl.place, 
    '' as note,  -- 既存のnoteは個別メニューのものなので空文字に
    MIN(pl.created_at) as created_at,
    MAX(pl.updated_at) as updated_at
FROM practice_logs pl
LEFT JOIN practice p ON p.user_id = pl.user_id 
    AND p.date = pl.date 
    AND COALESCE(p.place, '') = COALESCE(pl.place, '')
WHERE p.id IS NULL  -- 既に存在しないもののみ挿入
GROUP BY pl.user_id, pl.date, pl.place;

-- 4. practice_logsにpractice_idを設定（まだ設定されていないもののみ）
UPDATE practice_logs 
SET practice_id = (
    SELECT p.id 
    FROM practice p 
    WHERE p.user_id = practice_logs.user_id 
      AND p.date = practice_logs.date 
      AND COALESCE(p.place, '') = COALESCE(practice_logs.place, '')
    LIMIT 1
)
WHERE practice_id IS NULL;

-- 5. practice_logsのdateとplaceカラムを削除（存在する場合のみ）
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'practice_logs' AND column_name = 'date') THEN
        ALTER TABLE practice_logs DROP COLUMN date;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'practice_logs' AND column_name = 'place') THEN
        ALTER TABLE practice_logs DROP COLUMN place;
    END IF;
END $$;

-- 6. practice_logsのpractice_idをNOT NULLに設定
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'practice_logs' AND column_name = 'practice_id' 
               AND is_nullable = 'YES') THEN
        ALTER TABLE practice_logs ALTER COLUMN practice_id SET NOT NULL;
    END IF;
END $$;

-- 7. インデックスを追加してパフォーマンスを向上（重複作成を回避）
CREATE INDEX IF NOT EXISTS idx_practice_user_date ON practice(user_id, date);
CREATE INDEX IF NOT EXISTS idx_practice_log_practice_id ON practice_logs(practice_id);

-- 8. 更新日時の自動更新トリガーを追加
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_practice_updated_at BEFORE UPDATE ON practice
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
