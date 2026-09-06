// =============================================================================
// BestTimesTable.compareMetric.en.test.tsx (apps/mobile/components/profile)
// =============================================================================
// Sprint Contract 検証観点:
//   [D2-EN] i18n.language が ja 以外 (en) のとき、比較指標ピッカーは描画されない
//           (WA基準の既存表示・計算自体には影響しないこと)
//
// ## なぜ別ファイル・専用モックが必要か
// `vitest.setup.ts` のグローバル react-i18next モックは常に `i18n.language: "ja"` に
// 固定されているため、通常のコンポーネントテスト (`BestTimesTable.compareMetric.test.tsx`)
// では非 ja の分岐 (`showCompareMetricPicker = i18n.language === "ja"` が false になる経路)
// に到達できない。
// `components/shared/__tests__/noteFallbackLabelKeyWiring.de.test.tsx` と同じ手法
// (このテストファイル内限定で `vi.mock("react-i18next", ...)` を上書きし、
// `i18n.language` を固定値にする) を用いる。今回は文言の翻訳精度自体は検証対象ではなく
// 「非ja判定で分岐が正しく効くか」だけが関心事なので、`t` は未知キーをキー名のまま返す
// 簡易実装で十分 (de.json テストのように実際の訳語比較はしない)。
//
// ## 挑戦した回避策 (Planner/App Developer からの申し送り事項への回答)
// 1. ファイルローカルで `vi.mock("react-i18next", ...)` を上書き → 機能した
//    (setupFiles の登録より後にこのファイルの vi.mock 登録が評価されるため、
//    このファイル単位ではこちらが有効になる。他のテストファイルには影響しない
//    ことは `BestTimesTable.compareMetric.test.tsx` 側が (デフォルトのja固定モックのまま)
//    従来通り green であることで確認済み)。
// 2. `vi.mocked(useTranslation).mockReturnValue(...)` の個別上書きは今回は不要だった
//    (ファイル全体で ja を使わないテストのみを置く方針にしたため)。
// =============================================================================

import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import type { BestTime } from "@apps/shared/types/ui";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown> & { defaultValue?: string }) =>
      options?.defaultValue !== undefined ? String(options.defaultValue) : key,
    i18n: { language: "en", changeLanguage: vi.fn() },
  }),
  Trans: ({ children }: { children?: React.ReactNode }) => children ?? null,
  I18nextProvider: ({ children }: { children: React.ReactNode }) => children,
  initReactI18next: { type: "3rdParty", init: () => {} },
}));

import { BestTimesTable } from "../BestTimesTable";

function queryByRawTestId(container: HTMLElement, testId: string): HTMLElement | null {
  return container.querySelector(`[testid="${testId}"]`);
}

let idCounter = 0;
const buildBestTime = (overrides: Partial<BestTime> & { style: BestTime["style"] }): BestTime => {
  idCounter += 1;
  return {
    id: `en-cmp-rec-${idCounter}`,
    time: 30.0,
    created_at: "2025-01-01T00:00:00.000Z",
    pool_type: 0,
    is_relaying: false,
    ...overrides,
  } as BestTime;
};

const FR100 = { name_jp: "100m自由形", distance: 100 };

describe("BestTimesTable (profile) - 比較指標ピッカーはjaロケール限定 (非ja)", () => {
  it("[D2-EN] i18n.language が en のとき、比較指標セグメント/iアイコン/年齢区分ボタンは描画されない", () => {
    const bestTimes = [buildBestTime({ time: 54.97, style: FR100 })];
    const { container } = render(
      <BestTimesTable bestTimes={bestTimes} gender={0} isWaPointsMode={true} />,
    );

    expect(queryByRawTestId(container, "best-times-compare-metric-segment")).toBeNull();
    expect(queryByRawTestId(container, "best-times-compare-metric-wa")).toBeNull();
    expect(queryByRawTestId(container, "best-times-compare-metric-nr")).toBeNull();
    expect(queryByRawTestId(container, "best-times-compare-metric-age")).toBeNull();
    expect(queryByRawTestId(container, "best-times-compare-metric-info")).toBeNull();
    expect(queryByRawTestId(container, "best-times-age-category-button")).toBeNull();

    // WAポイントモード自体 (既存のWA基準表示) は言語に関係なく従来通り機能する。
    // (542 は node -e で floor(1000*(44.84/54.97)^3) を独立に計算した値。
    //  BestTimesTable.compareMetric.test.tsx の計算内訳コメントと同一入力)
    expect(screen.getByText("542")).toBeTruthy();
  });
});
