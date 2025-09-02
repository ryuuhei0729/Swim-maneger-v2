-- Swim Manager v2 Seed Data for Supabase
-- RailsのseedファイルをSQLに変換

-- 既存のデータをクリア（RLSを一時的に無効化）
ALTER TABLE announcements DISABLE ROW LEVEL SECURITY;
ALTER TABLE split_times DISABLE ROW LEVEL SECURITY;
ALTER TABLE race_feedbacks DISABLE ROW LEVEL SECURITY;
ALTER TABLE milestone_reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE milestones DISABLE ROW LEVEL SECURITY;
ALTER TABLE race_reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE race_goals DISABLE ROW LEVEL SECURITY;
ALTER TABLE objectives DISABLE ROW LEVEL SECURITY;
ALTER TABLE practice_times DISABLE ROW LEVEL SECURITY;
ALTER TABLE practice_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE entries DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendance DISABLE ROW LEVEL SECURITY;
ALTER TABLE records DISABLE ROW LEVEL SECURITY;
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE styles DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- データをクリア
DELETE FROM announcements;
DELETE FROM split_times;
DELETE FROM race_feedbacks;
DELETE FROM milestone_reviews;
DELETE FROM milestones;
DELETE FROM race_reviews;
DELETE FROM race_goals;
DELETE FROM objectives;
DELETE FROM practice_times;
DELETE FROM practice_logs;
DELETE FROM entries;
DELETE FROM attendance;
DELETE FROM records;
DELETE FROM events;
DELETE FROM users;
DELETE FROM styles;

-- 種目の作成
INSERT INTO styles (name_jp, name, distance, style) VALUES
('50m自由形', '50Fr', 50, 0),
('100m自由形', '100Fr', 100, 0),
('200m自由形', '200Fr', 200, 0),
('400m自由形', '400Fr', 400, 0),
('800m自由形', '800Fr', 800, 0),
('50m平泳ぎ', '50Br', 50, 2),
('100m平泳ぎ', '100Br', 100, 2),
('200m平泳ぎ', '200Br', 200, 2),
('50m背泳ぎ', '50Ba', 50, 1),
('100m背泳ぎ', '100Ba', 100, 1),
('200m背泳ぎ', '200Ba', 200, 1),
('50mバタフライ', '50Fly', 50, 3),
('100mバタフライ', '100Fly', 100, 3),
('200mバタフライ', '200Fly', 200, 3),
('100m個人メドレー', '100IM', 100, 4),
('200m個人メドレー', '200IM', 200, 4),
('400m個人メドレー', '400IM', 400, 4);

-- ユーザー作成（ディレクター4人）
INSERT INTO users (generation, name, gender, birthday, user_type, bio) VALUES
(0, '田中 太郎', 1, '1985-03-15', 3, 'ディレクター1の自己紹介文です。'),
(0, '佐藤 花子', 2, '1988-07-22', 3, 'ディレクター2の自己紹介文です。'),
(0, '鈴木 一郎', 1, '1982-11-08', 3, 'ディレクター3の自己紹介文です。'),
(0, '高橋 美咲', 2, '1990-01-30', 3, 'ディレクター4の自己紹介文です。');

-- コーチ6人作成
INSERT INTO users (generation, name, gender, birthday, user_type, bio) VALUES
(75, '山田 健太', 1, '2004-05-12', 2, 'コーチ1の自己紹介文です。'),
(76, '伊藤 愛', 2, '2003-09-18', 2, 'コーチ2の自己紹介文です。'),
(74, '渡辺 翔太', 1, '2005-02-25', 2, 'コーチ3の自己紹介文です。'),
(77, '中村 優花', 2, '2002-12-03', 2, 'コーチ4の自己紹介文です。'),
(73, '小林 大輔', 1, '2006-08-14', 2, 'コーチ5の自己紹介文です。'),
(75, '加藤 美咲', 2, '2004-04-07', 2, 'コーチ6の自己紹介文です。');

-- プレイヤー30人作成
INSERT INTO users (generation, name, gender, birthday, user_type, bio) VALUES
(80, '斎藤 陽太', 1, '2009-06-20', 0, 'プレイヤー1の自己紹介文です。'),
(81, '井上 さくら', 2, '2010-03-15', 0, 'プレイヤー2の自己紹介文です。'),
(79, '松本 翔', 1, '2008-11-08', 0, 'プレイヤー3の自己紹介文です。'),
(82, '山口 美咲', 2, '2011-07-22', 0, 'プレイヤー4の自己紹介文です。'),
(80, '森 健太', 1, '2009-01-30', 0, 'プレイヤー5の自己紹介文です。'),
(81, '阿部 愛', 2, '2010-09-18', 0, 'プレイヤー6の自己紹介文です。'),
(83, '石川 大輔', 1, '2012-05-12', 0, 'プレイヤー7の自己紹介文です。'),
(79, '林 優花', 2, '2008-12-03', 0, 'プレイヤー8の自己紹介文です。'),
(82, '清水 翔太', 1, '2011-08-14', 0, 'プレイヤー9の自己紹介文です。'),
(80, '岡本 美咲', 2, '2009-04-07', 0, 'プレイヤー10の自己紹介文です。'),
(81, '長谷川 陽太', 1, '2010-06-20', 0, 'プレイヤー11の自己紹介文です。'),
(83, '近藤 さくら', 2, '2012-03-15', 0, 'プレイヤー12の自己紹介文です。'),
(79, '坂本 翔', 1, '2008-11-08', 0, 'プレイヤー13の自己紹介文です。'),
(82, '福田 美咲', 2, '2011-07-22', 0, 'プレイヤー14の自己紹介文です。'),
(80, '西村 健太', 1, '2009-01-30', 0, 'プレイヤー15の自己紹介文です。'),
(81, '藤田 愛', 2, '2010-09-18', 0, 'プレイヤー16の自己紹介文です。'),
(83, '青木 大輔', 1, '2012-05-12', 0, 'プレイヤー17の自己紹介文です。'),
(79, '岡田 優花', 2, '2008-12-03', 0, 'プレイヤー18の自己紹介文です。'),
(82, '中島 翔太', 1, '2011-08-14', 0, 'プレイヤー19の自己紹介文です。'),
(80, '田村 美咲', 2, '2009-04-07', 0, 'プレイヤー20の自己紹介文です。'),
(81, '原田 陽太', 1, '2010-06-20', 0, 'プレイヤー21の自己紹介文です。'),
(83, '前田 さくら', 2, '2012-03-15', 0, 'プレイヤー22の自己紹介文です。'),
(79, '武田 翔', 1, '2008-11-08', 0, 'プレイヤー23の自己紹介文です。'),
(82, '上田 美咲', 2, '2011-07-22', 0, 'プレイヤー24の自己紹介文です。'),
(80, '後藤 健太', 1, '2009-01-30', 0, 'プレイヤー25の自己紹介文です。'),
(81, '河野 愛', 2, '2010-09-18', 0, 'プレイヤー26の自己紹介文です。'),
(83, '野村 大輔', 1, '2012-05-12', 0, 'プレイヤー27の自己紹介文です。'),
(79, '松井 優花', 2, '2008-12-03', 0, 'プレイヤー28の自己紹介文です。'),
(82, '木村 翔太', 1, '2011-08-14', 0, 'プレイヤー29の自己紹介文です。'),
(80, '佐々木 美咲', 2, '2009-04-07', 0, 'プレイヤー30の自己紹介文です。');

-- イベントの作成（学校行事）
INSERT INTO events (title, date, place, note, type, is_attendance, is_competition) VALUES
('テスト期間', '2024-01-29', '学校', 'テスト期間1日目。学業に集中してください。', 'Event', false, false),
('テスト期間', '2024-01-30', '学校', 'テスト期間2日目。学業に集中してください。', 'Event', false, false),
('テスト期間', '2024-01-31', '学校', 'テスト期間3日目。学業に集中してください。', 'Event', false, false),
('テスト期間', '2024-02-01', '学校', 'テスト期間4日目。学業に集中してください。', 'Event', false, false),
('1年生修学旅行', '2024-04-15', '修学旅行先', '1年生の修学旅行1日目。楽しい思い出を作ってください。', 'Event', false, false),
('1年生修学旅行', '2024-04-16', '修学旅行先', '1年生の修学旅行2日目。楽しい思い出を作ってください。', 'Event', false, false),
('2年生修学旅行', '2024-05-20', '修学旅行先', '2年生の修学旅行1日目。楽しい思い出を作ってください。', 'Event', false, false),
('2年生修学旅行', '2024-05-21', '修学旅行先', '2年生の修学旅行2日目。楽しい思い出を作ってください。', 'Event', false, false);

-- 練習・ミーティングイベントの作成
INSERT INTO events (title, date, place, note, type, is_attendance, is_competition, attendance_status) VALUES
('陸トレ', '2024-01-15', '小石川5階', '陸上の練習です。基礎体力向上を目指します。', 'AttendanceEvent', true, false, 2),
('水泳練', '2024-01-16', 'コズミック', '水泳の練習です。フォーム改善に重点を置きます。', 'AttendanceEvent', true, false, 2),
('全体MTG', '2024-01-17', 'オンライン', '今週の予定と目標の確認を行います。', 'AttendanceEvent', true, false, 2),
('水泳練', '2024-01-18', 'コズミック', '水泳の練習です。スピード練習を行います。', 'AttendanceEvent', true, false, 2),
('陸トレ', '2024-01-19', '小石川5階', '陸上の練習です。筋力トレーニングを行います。', 'AttendanceEvent', true, false, 2),
('水泳練', '2024-01-20', 'Bumb', '週末練習です。実践的な練習を行います。', 'AttendanceEvent', true, false, 2),
('陸トレ', '2024-01-22', '小石川5階', '陸上の練習です。基礎体力向上を目指します。', 'AttendanceEvent', true, false, 2),
('水泳練', '2024-01-23', 'コズミック', '水泳の練習です。フォーム改善に重点を置きます。', 'AttendanceEvent', true, false, 2),
('全体MTG', '2024-01-24', 'オンライン', '今週の予定と目標の確認を行います。', 'AttendanceEvent', true, false, 2),
('水泳練', '2024-01-25', 'コズミック', '水泳の練習です。スピード練習を行います。', 'AttendanceEvent', true, false, 2),
('陸トレ', '2024-01-26', '小石川5階', '陸上の練習です。筋力トレーニングを行います。', 'AttendanceEvent', true, false, 2),
('合同練習', '2024-01-27', 'Bumb', '週末練習です。実践的な練習を行います。', 'AttendanceEvent', true, false, 2);

-- 大会の作成
INSERT INTO events (title, date, place, note, type, is_attendance, is_competition, attendance_status, entry_status) VALUES
('第1回大会', '2024-01-28', 'アクアティクスセンター', '大会です。全員参加必須です。応援も含めてチーム一丸となって頑張りましょう。', 'Competition', true, true, 2, 2),
('第2回大会', '2024-02-25', 'アクアティクスセンター', '大会です。全員参加必須です。応援も含めてチーム一丸となって頑張りましょう。', 'Competition', true, true, 1, 1),
('第3回大会', '2024-03-30', 'アクアティクスセンター', '大会です。全員参加必須です。応援も含めてチーム一丸となって頑張りましょう。', 'Competition', true, true, 0, 0);

-- 記録の作成（プレイヤー全員に対して）
DO $$
DECLARE
    player_record RECORD;
    style_record RECORD;
    competition_record RECORD;
    random_time DECIMAL(10,2);
    record_id UUID;
BEGIN
    -- プレイヤー全員に対して記録を作成
    FOR player_record IN SELECT id FROM users WHERE user_type = 0 LOOP
        -- 各大会に対して記録を作成
        FOR competition_record IN SELECT id, date FROM events WHERE type = 'Competition' AND date < CURRENT_DATE LOOP
            -- この大会に参加するかどうかを80%の確率で決定
            IF RANDOM() < 0.8 THEN
                -- この大会で出場する種目数を1〜2種目で決定
                FOR style_record IN SELECT id, distance FROM styles ORDER BY RANDOM() LIMIT (1 + FLOOR(RANDOM() * 2)) LOOP
                    -- 種目に応じたランダムなタイムを生成
                    CASE style_record.distance
                        WHEN 50 THEN random_time := 22.00 + RANDOM() * 13.00;
                        WHEN 100 THEN random_time := 50.00 + RANDOM() * 30.00;
                        WHEN 200 THEN random_time := 110.00 + RANDOM() * 70.00;
                        WHEN 400 THEN random_time := 240.00 + RANDOM() * 120.00;
                        WHEN 800 THEN random_time := 480.00 + RANDOM() * 240.00;
                        ELSE random_time := 30.00 + RANDOM() * 30.00;
                    END CASE;
                    
                    -- 記録を作成
                    INSERT INTO records (user_id, style_id, time, attendance_event_id, created_at)
                    VALUES (player_record.id, style_record.id, ROUND(random_time::numeric, 2), competition_record.id, 
                            competition_record.date + (RANDOM() * 5) * INTERVAL '1 hour')
                    RETURNING id INTO record_id;
                    
                    -- 距離ごとにsplit_timeを追加
                    CASE style_record.distance
                        WHEN 50 THEN
                            -- 25mのsplit
                            INSERT INTO split_times (record_id, distance, split_time)
                            VALUES (record_id, 25, ROUND((random_time / 2)::numeric, 2));
                        WHEN 100 THEN
                            -- 25, 50, 75mのsplit
                            INSERT INTO split_times (record_id, distance, split_time) VALUES
                            (record_id, 25, ROUND((random_time * 25 / 100.0)::numeric, 2)),
                            (record_id, 50, ROUND((random_time * 50 / 100.0)::numeric, 2)),
                            (record_id, 75, ROUND((random_time * 75 / 100.0)::numeric, 2));
                        WHEN 200 THEN
                            -- 50, 100, 150mのsplit
                            INSERT INTO split_times (record_id, distance, split_time) VALUES
                            (record_id, 50, ROUND((random_time * 50 / 200.0)::numeric, 2)),
                            (record_id, 100, ROUND((random_time * 100 / 200.0)::numeric, 2)),
                            (record_id, 150, ROUND((random_time * 150 / 200.0)::numeric, 2));
                        ELSE
                            -- その他の距離の場合は何もしない
                            NULL;
                    END CASE;
                END LOOP;
            END IF;
        END LOOP;
    END LOOP;
END $$;

-- 記録がない種目に対してダミーの記録を作成
DO $$
DECLARE
    player_record RECORD;
    style_record RECORD;
    competition_record RECORD;
    random_time DECIMAL(10,2);
    recorded_style_ids UUID[];
    unrecorded_styles_count INTEGER;
    styles_to_create_count INTEGER;
BEGIN
    FOR player_record IN SELECT id FROM users WHERE user_type = 0 LOOP
        -- ユーザーがすでに記録を持っている種目IDのリスト
        SELECT ARRAY_AGG(DISTINCT style_id) INTO recorded_style_ids 
        FROM records WHERE user_id = player_record.id;
        
        -- 記録がない種目の数を取得
        SELECT COUNT(*) INTO unrecorded_styles_count 
        FROM styles 
        WHERE id NOT IN (SELECT UNNEST(recorded_style_ids));
        
        -- 未記録の種目が多い場合は、一部の種目のみに記録を作成
        styles_to_create_count := LEAST(unrecorded_styles_count, 5);
        
        FOR style_record IN 
            SELECT id, distance FROM styles 
            WHERE id NOT IN (SELECT UNNEST(recorded_style_ids))
            ORDER BY RANDOM() 
            LIMIT styles_to_create_count
        LOOP
            -- ランダムに大会イベントを選択
            SELECT id, date INTO competition_record FROM events 
            WHERE type = 'Competition' AND date < CURRENT_DATE 
            ORDER BY RANDOM() LIMIT 1;
            
            -- 種目に応じたランダムなタイムを生成
            CASE style_record.distance
                WHEN 50 THEN random_time := 22.00 + RANDOM() * 13.00;
                WHEN 100 THEN random_time := 50.00 + RANDOM() * 30.00;
                WHEN 200 THEN random_time := 110.00 + RANDOM() * 70.00;
                WHEN 400 THEN random_time := 240.00 + RANDOM() * 120.00;
                WHEN 800 THEN random_time := 480.00 + RANDOM() * 240.00;
                ELSE random_time := 30.00 + RANDOM() * 30.00;
            END CASE;
            
            -- 記録を作成
            INSERT INTO records (user_id, style_id, time, attendance_event_id, created_at)
            VALUES (player_record.id, style_record.id, ROUND(random_time::numeric, 2), competition_record.id, 
                    competition_record.date + (RANDOM() * 5) * INTERVAL '1 hour');
        END LOOP;
    END LOOP;
END $$;

-- 出席データの作成
DO $$
DECLARE
    user_record RECORD;
    event_record RECORD;
    attendance_status INTEGER;
    attendance_note TEXT;
BEGIN
    -- 練習・ミーティングイベントの出席データ
    FOR event_record IN SELECT id FROM events WHERE type = 'AttendanceEvent' LOOP
        FOR user_record IN SELECT id FROM users LOOP
            -- 50%〜90%の確率で出席データを作成
            IF RANDOM() < 0.7 THEN
                attendance_status := (ARRAY[0, 1, 2])[FLOOR(RANDOM() * 3 + 1)];
                
                CASE attendance_status
                    WHEN 1 THEN attendance_note := (ARRAY['体調不良', '家庭の事情', '学業の都合', '用事があるため', '怪我のため'])[FLOOR(RANDOM() * 5 + 1)];
                    WHEN 2 THEN attendance_note := (ARRAY['電車遅延', '寝坊', '授業が長引いた', 'バスが遅れた', '準備に時間がかかった'])[FLOOR(RANDOM() * 5 + 1)];
                    ELSE attendance_note := NULL;
                END CASE;
                
                INSERT INTO attendance (user_id, attendance_event_id, status, note)
                VALUES (user_record.id, event_record.id, attendance_status, attendance_note);
            END IF;
        END LOOP;
    END LOOP;
    
    -- 大会の出席データ
    FOR event_record IN SELECT id, date FROM events WHERE type = 'Competition' LOOP
        FOR user_record IN SELECT id FROM users LOOP
            -- 大会は90%〜100%の確率で出席データを作成
            IF RANDOM() < 0.95 THEN
                attendance_status := (ARRAY[0, 1, 2])[FLOOR(RANDOM() * 3 + 1)];
                
                CASE attendance_status
                    WHEN 1 THEN attendance_note := (ARRAY['体調不良', '家庭の事情', '学業の都合', '用事があるため', '怪我のため'])[FLOOR(RANDOM() * 5 + 1)];
                    WHEN 2 THEN attendance_note := (ARRAY['電車遅延', '寝坊', '授業が長引いた', 'バスが遅れた', '準備に時間がかかった'])[FLOOR(RANDOM() * 5 + 1)];
                    ELSE attendance_note := NULL;
                END CASE;
                
                INSERT INTO attendance (user_id, attendance_event_id, status, note)
                VALUES (user_record.id, event_record.id, attendance_status, attendance_note);
            END IF;
        END LOOP;
    END LOOP;
END $$;

-- お知らせの作成
INSERT INTO announcements (title, content, published_at, is_active) VALUES
('練習スケジュール変更のお知らせ', '来週の練習スケジュールが変更になりました。詳細は後日お知らせします。', '2024-01-15 10:00:00+00', true),
('大会エントリー締切', '春季大会のエントリー締切が近づいています。未提出の方はお早めにお願いします。', '2024-01-10 14:30:00+00', true),
('新年度の活動について', '新年度の活動方針についてお知らせします。', '2024-01-05 09:00:00+00', true),
('冬季練習の開始', '冬季練習が開始されます。体調管理にご注意ください。', '2024-01-01 08:00:00+00', true);

-- 大会関連の目標と反省データを作成
DO $$
DECLARE
    player_record RECORD;
    event_record RECORD;
    style_record RECORD;
    objective_id UUID;
    milestone_id UUID;
    race_goal_id UUID;
    race_review_id UUID;
    coach_record RECORD;
    target_time DECIMAL(10,2);
    random_time DECIMAL(10,2);
    next_month_start DATE;
    next_month_end DATE;
    today DATE;
BEGIN
    next_month_start := DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month');
    next_month_end := DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month') + INTERVAL '1 month - 1 day';
    today := CURRENT_DATE;
    
    -- プレイヤー全員に対して大会関連データを作成
    FOR player_record IN SELECT id FROM users WHERE user_type = 0 LOOP
        FOR event_record IN SELECT id, date FROM events WHERE type = 'Competition' ORDER BY date LOOP
            -- プレイヤーの得意種目をランダムに2つ選択
            FOR style_record IN SELECT id, name_jp FROM styles ORDER BY RANDOM() LIMIT 2 LOOP
                -- 種目に応じたランダムなタイムを生成
                CASE 
                    WHEN style_record.name_jp LIKE '%50m%' THEN random_time := 22.00 + RANDOM() * 13.00;
                    WHEN style_record.name_jp LIKE '%100m%' THEN random_time := 50.00 + RANDOM() * 30.00;
                    WHEN style_record.name_jp LIKE '%200m%' THEN random_time := 110.00 + RANDOM() * 70.00;
                    WHEN style_record.name_jp LIKE '%400m%' THEN random_time := 240.00 + RANDOM() * 120.00;
                    WHEN style_record.name_jp LIKE '%800m%' THEN random_time := 480.00 + RANDOM() * 240.00;
                    ELSE random_time := 30.00 + RANDOM() * 30.00;
                END CASE;
                
                target_time := random_time * 0.95; -- 現在の記録より5%速い目標
                
                -- 来月の大会の場合のみObjectiveとMilestoneを作成
                IF event_record.date BETWEEN next_month_start AND next_month_end THEN
                    -- Objective（目標）の作成
                    INSERT INTO objectives (user_id, attendance_event_id, style_id, target_time, quantity_note, quality_title, quality_note)
                    VALUES (
                        player_record.id, 
                        event_record.id, 
                        style_record.id, 
                        ROUND(target_time::numeric, 2),
                        '週' || (3 + FLOOR(RANDOM() * 4))::TEXT || '回の練習を行う',
                        (ARRAY['フォーム改善', 'スタミナ強化', 'スピード向上', 'メンタル強化'])[FLOOR(RANDOM() * 4 + 1)],
                        (ARRAY['キック力の向上', 'ターンの改善', '呼吸の安定化', 'ペース配分の最適化'])[FLOOR(RANDOM() * 4 + 1)] || 'を重点的に行う'
                    ) RETURNING id INTO objective_id;
                    
                    -- Milestone（マイルストーン）の作成 - 2つのみ
                    INSERT INTO milestones (objective_id, milestone_type, limit_date, note) VALUES
                    (objective_id, (ARRAY['quality', 'quantity'])[FLOOR(RANDOM() * 2 + 1)], 
                     event_record.date - INTERVAL '2 months',
                     TO_CHAR(event_record.date - INTERVAL '2 months', 'YYYY年MM月') || 'の目標: ' || 
                     (ARRAY['基礎練習の完了', 'フォームの完成', 'タイムの達成'])[FLOOR(RANDOM() * 3 + 1)]),
                    (objective_id, (ARRAY['quality', 'quantity'])[FLOOR(RANDOM() * 2 + 1)], 
                     event_record.date - INTERVAL '1 month',
                     TO_CHAR(event_record.date - INTERVAL '1 month', 'YYYY年MM月') || 'の目標: ' || 
                     (ARRAY['基礎練習の完了', 'フォームの完成', 'タイムの達成'])[FLOOR(RANDOM() * 3 + 1)]);
                    
                    -- 過去のマイルストーンの場合、レビューを作成
                    IF event_record.date - INTERVAL '2 months' < today THEN
                        SELECT id INTO milestone_id FROM milestones WHERE objective_id = objective_id LIMIT 1;
                        INSERT INTO milestone_reviews (milestone_id, achievement_rate, negative_note, positive_note)
                        VALUES (
                            milestone_id,
                            60 + FLOOR(RANDOM() * 41),
                            (ARRAY['課題が残る', 'まだ改善の余地あり', 'もう少し頑張れた'])[FLOOR(RANDOM() * 3 + 1)],
                            (ARRAY['着実に進歩している', '目標に向かって順調', '良い調子で進んでいる'])[FLOOR(RANDOM() * 3 + 1)]
                        );
                    END IF;
                END IF;
                
                -- 全ての大会に対してRaceGoalを作成
                INSERT INTO race_goals (user_id, attendance_event_id, style_id, time, note)
                VALUES (
                    player_record.id,
                    event_record.id,
                    style_record.id,
                    ROUND(target_time::numeric, 2),
                    (ARRAY['スタートダッシュを決める', 'ラストスパートを意識', '安定したペース配分で'])[FLOOR(RANDOM() * 3 + 1)]
                ) RETURNING id INTO race_goal_id;
                
                -- 過去の大会の場合、レースレビューとフィードバックを作成
                IF event_record.date < today THEN
                    INSERT INTO race_reviews (race_goal_id, style_id, time, note)
                    VALUES (
                        race_goal_id,
                        style_record.id,
                        ROUND(random_time::numeric, 2),
                        (ARRAY['良いレース展開だった', '課題が見つかった', '次につながる内容'])[FLOOR(RANDOM() * 3 + 1)]
                    ) RETURNING id INTO race_review_id;
                    
                    -- ランダムに2人のコーチを選んでフィードバックを作成
                    FOR coach_record IN SELECT id FROM users WHERE user_type = 2 ORDER BY RANDOM() LIMIT 2 LOOP
                        INSERT INTO race_feedbacks (race_goal_id, user_id, note)
                        VALUES (
                            race_goal_id,
                            coach_record.id,
                            (ARRAY[
                                'スタートのリアクションが良かった',
                                'ターンでのスピードロスが気になる',
                                '後半の粘りが素晴らしい',
                                '呼吸のタイミングを見直そう',
                                'フォームが安定していた'
                            ])[FLOOR(RANDOM() * 5 + 1)]
                        );
                    END LOOP;
                END IF;
            END LOOP;
        END LOOP;
    END LOOP;
END $$;

-- 練習記録の作成
DO $$
DECLARE
    event_record RECORD;
    player_record RECORD;
    practice_log_id UUID;
    rep_count INTEGER;
    set_count INTEGER;
    distance INTEGER;
    circle DECIMAL(10,2);
    time DECIMAL(10,2);
BEGIN
    -- 水泳練習のイベントを取得
    FOR event_record IN SELECT id FROM events WHERE title = '水泳練' ORDER BY date LOOP
        -- 練習ログの作成
        rep_count := (ARRAY[1, 3, 5])[FLOOR(RANDOM() * 3 + 1)];
        set_count := (ARRAY[1, 2, 3])[FLOOR(RANDOM() * 3 + 1)];
        distance := (ARRAY[50, 100])[FLOOR(RANDOM() * 2 + 1)];
        circle := (ARRAY[60, 70, 80, 90])[FLOOR(RANDOM() * 4 + 1)];
        
        INSERT INTO practice_logs (attendance_event_id, tags, style, rep_count, set_count, distance, circle, note)
        VALUES (
            event_record.id,
            to_jsonb((ARRAY['スプリント', '持久力', 'フォーム改善'])[FLOOR(RANDOM() * 3 + 1):FLOOR(RANDOM() * 3 + 1)]),
            (ARRAY['Fr', 'Br', 'Ba', 'Fly', 'IM', 'S1'])[FLOOR(RANDOM() * 6 + 1)],
            rep_count,
            set_count,
            distance,
            circle,
            (ARRAY['スプリント練習', '持久力強化', 'フォーム改善', 'ターン練習'])[FLOOR(RANDOM() * 4 + 1)]
        ) RETURNING id INTO practice_log_id;
        
        -- プレイヤー全員に対して練習タイムを作成
        FOR player_record IN SELECT id FROM users WHERE user_type = 0 LOOP
            -- セット数と本数の組み合わせで練習タイムを作成
            FOR set_num IN 1..set_count LOOP
                FOR rep_num IN 1..rep_count LOOP
                    -- 種目に応じたランダムなタイムを生成
                    CASE distance
                        WHEN 50 THEN time := 30.00 + RANDOM() * 15.00;
                        WHEN 100 THEN time := 65.00 + RANDOM() * 30.00;
                        ELSE time := 30.00 + RANDOM() * 30.00;
                    END CASE;
                    
                    INSERT INTO practice_times (user_id, practice_log_id, rep_number, set_number, time)
                    VALUES (player_record.id, practice_log_id, rep_num, set_num, ROUND(time::numeric, 2));
                END LOOP;
            END LOOP;
        END LOOP;
    END LOOP;
END $$;

-- エントリーデータの作成
DO $$
DECLARE
    player_record RECORD;
    competition_record RECORD;
    style_record RECORD;
    entry_time DECIMAL(10,2);
    entry_count INTEGER;
BEGIN
    -- 今後の大会イベントを取得（エントリー期間中またはこれからエントリーが始まる大会）
    FOR player_record IN SELECT id FROM users WHERE user_type = 0 LOOP
        FOR competition_record IN SELECT id FROM events WHERE type = 'Competition' AND date >= CURRENT_DATE LOOP
            -- この大会にエントリーするかどうかを70%の確率で決定
            IF RANDOM() < 0.7 THEN
                -- この大会でエントリーする種目数を1〜3種目で決定
                entry_count := 1 + FLOOR(RANDOM() * 3);
                
                -- ランダムに種目を選択（重複しないように）
                FOR style_record IN SELECT id, distance FROM styles ORDER BY RANDOM() LIMIT entry_count LOOP
                    -- 種目に応じたエントリータイムを生成（記録より少し遅いタイム）
                    CASE style_record.distance
                        WHEN 50 THEN entry_time := 25.00 + RANDOM() * 15.00;
                        WHEN 100 THEN entry_time := 55.00 + RANDOM() * 35.00;
                        WHEN 200 THEN entry_time := 120.00 + RANDOM() * 80.00;
                        WHEN 400 THEN entry_time := 260.00 + RANDOM() * 140.00;
                        WHEN 800 THEN entry_time := 520.00 + RANDOM() * 260.00;
                        ELSE entry_time := 30.00 + RANDOM() * 30.00;
                    END CASE;
                    
                    -- エントリーを作成
                    INSERT INTO entries (user_id, attendance_event_id, style_id, entry_time, note)
                    VALUES (
                        player_record.id,
                        competition_record.id,
                        style_record.id,
                        ROUND(entry_time::numeric, 2),
                        (ARRAY[
                            'ベストタイムを目指します',
                            '安定した泳ぎで完泳を目指します',
                            'フォームを意識して泳ぎます',
                            'ペース配分を意識します',
                            'スタートダッシュを決めます',
                            'ラストスパートを意識します',
                            'ターンを改善します',
                            '呼吸のタイミングを安定させます'
                        ])[FLOOR(RANDOM() * 8 + 1)]
                    );
                END LOOP;
            END IF;
        END LOOP;
    END LOOP;
END $$;

-- RLSを再度有効化
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE split_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE race_feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestone_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE race_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE race_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE records ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 過去のイベントの出欠受付とエントリーを自動的に終了
DO $$
DECLARE
    today DATE;
    attendance_events_count INTEGER;
    competitions_count INTEGER;
    competitions_entry_count INTEGER;
BEGIN
    today := CURRENT_DATE;
    
    -- 過去のAttendanceEventを全てclosedに更新
    UPDATE events 
    SET attendance_status = 2 
    WHERE type = 'AttendanceEvent' AND date < today AND attendance_status != 2;
    
    GET DIAGNOSTICS attendance_events_count = ROW_COUNT;
    
    -- 過去のCompetitionを全てclosedに更新（出欠受付）
    UPDATE events 
    SET attendance_status = 2 
    WHERE type = 'Competition' AND date < today AND attendance_status != 2;
    
    GET DIAGNOSTICS competitions_count = ROW_COUNT;
    
    -- 過去のCompetitionのエントリーを全てclosedに更新
    UPDATE events 
    SET entry_status = 2 
    WHERE type = 'Competition' AND date < today AND entry_status != 2;
    
    GET DIAGNOSTICS competitions_entry_count = ROW_COUNT;
    
    RAISE NOTICE '過去のイベントの出欠受付を終了しました: %件', attendance_events_count + competitions_count;
    RAISE NOTICE '  - AttendanceEvent: %件', attendance_events_count;
    RAISE NOTICE '  - Competition: %件', competitions_count;
    RAISE NOTICE '過去の大会のエントリーを終了しました: %件', competitions_entry_count;
END $$;

-- 完了メッセージ
SELECT 'Seed data insertion completed!' as message;

-- ========================================
-- 認証ユーザー作成スクリプト
-- ========================================

-- 注意: このスクリプトは手動で実行する必要があります
-- Supabaseの認証システムにユーザーを作成します

-- テスト用の認証ユーザーを作成
-- パスワードは全て 'password123' に設定

-- 認証ユーザー作成用の関数
CREATE OR REPLACE FUNCTION create_auth_user(
  user_name TEXT,
  user_email TEXT,
  user_password TEXT DEFAULT 'password123'
) RETURNS VOID AS $$
DECLARE
  user_id UUID;
BEGIN
  -- ユーザーIDを取得
  SELECT id INTO user_id FROM users WHERE name = user_name LIMIT 1;
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'User not found: %', user_name;
  END IF;
  
  -- 認証ユーザーを作成
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    user_id,
    'authenticated',
    'authenticated',
    user_email,
    crypt(user_password, gen_salt('bf')),
    NOW(),
    NULL,
    NULL,
    '{"provider": "email", "providers": ["email"]}',
    json_build_object('name', user_name),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  );
  
  RAISE NOTICE 'Created auth user: % (%)', user_email, user_name;
END;
$$ LANGUAGE plpgsql;

-- ディレクター用の認証ユーザー作成
SELECT create_auth_user('田中 太郎', 'director1@example.com');
SELECT create_auth_user('佐藤 花子', 'director2@example.com');
SELECT create_auth_user('鈴木 一郎', 'director3@example.com');
SELECT create_auth_user('高橋 美咲', 'director4@example.com');

-- コーチ用の認証ユーザー作成
SELECT create_auth_user('山田 健太', 'coach1@example.com');
SELECT create_auth_user('伊藤 愛', 'coach2@example.com');
SELECT create_auth_user('渡辺 翔太', 'coach3@example.com');
SELECT create_auth_user('中村 優花', 'coach4@example.com');
SELECT create_auth_user('小林 大輔', 'coach5@example.com');
SELECT create_auth_user('加藤 美咲', 'coach6@example.com');

-- プレイヤー用の認証ユーザー作成（最初の10人分）
SELECT create_auth_user('斎藤 陽太', 'player1@example.com');
SELECT create_auth_user('井上 さくら', 'player2@example.com');
SELECT create_auth_user('松本 翔', 'player3@example.com');
SELECT create_auth_user('山口 美咲', 'player4@example.com');
SELECT create_auth_user('森 健太', 'player5@example.com');
SELECT create_auth_user('阿部 愛', 'player6@example.com');
SELECT create_auth_user('石川 大輔', 'player7@example.com');
SELECT create_auth_user('林 優花', 'player8@example.com');
SELECT create_auth_user('清水 翔太', 'player9@example.com');
SELECT create_auth_user('岡本 美咲', 'player10@example.com');

-- 関数を削除（クリーンアップ）
DROP FUNCTION create_auth_user(TEXT, TEXT, TEXT);

-- 認証ユーザー作成完了メッセージ
SELECT 'Authentication users created successfully!' as message;
SELECT 'Test accounts created:' as info;
SELECT 'Directors: director1@example.com - director4@example.com' as accounts;
SELECT 'Coaches: coach1@example.com - coach6@example.com' as accounts;
SELECT 'Players: player1@example.com - player10@example.com' as accounts;
SELECT 'All passwords: password123' as password_info;
