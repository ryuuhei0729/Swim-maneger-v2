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

-- インデックス
CREATE INDEX idx_styles_distance ON styles(distance);
CREATE INDEX idx_styles_style ON styles(style);

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
('100m個人メドレー', '100m Individual Medley', 100, 4),
('200m個人メドレー', '200m Individual Medley', 200, 4),
('400m個人メドレー', '400m Individual Medley', 400, 4);
