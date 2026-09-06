// =============================================================================
// BestTimesTable.compareMetric.en.test.tsx (apps/mobile/components/teams/member-detail)
// =============================================================================
// profile版 (`components/profile/__tests__/BestTimesTable.compareMetric.en.test.tsx`) と
// 同一の観点をこのコンポーネントに対しても独立に検証する。詳細な設計意図・
// 検討した回避策はそちらのファイル冒頭コメントを参照。
//
// Sprint Contract 検証観点:
//   [D2-EN] i18n.language が ja 以外 (en) のとき、比較指標ピッカーは描画されない
// =============================================================================

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
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

function getByRawTestId(container: HTMLElement, testId: string): HTMLElement {
  const el = container.querySelector(`[testid="${testId}"]`);
  if (!el) throw new Error(`testid="${testId}" の要素が見つかりません`);
  return el as HTMLElement;
}

function queryByRawTestId(container: HTMLElement, testId: string): HTMLElement | null {
  return container.querySelector(`[testid="${testId}"]`);
}

let idCounter = 0;
const buildBestTime = (overrides: Partial<BestTime> & { style: BestTime["style"] }): BestTime => {
  idCounter += 1;
  return {
    id: `md-en-cmp-rec-${idCounter}`,
    time: 30.0,
    created_at: "2025-01-01T00:00:00.000Z",
    pool_type: 0,
    is_relaying: false,
    ...overrides,
  } as BestTime;
};

const FR100 = { name_jp: "100m自由形", distance: 100 };

describe("BestTimesTable (member-detail) - 比較指標ピッカーはjaロケール限定 (非ja)", () => {
  it("[D2-EN] i18n.language が en のとき、比較指標セグメント/iアイコン/年齢区分ボタンは描画されない", () => {
    const bestTimes = [buildBestTime({ time: 54.97, style: FR100 })];
    const { container } = render(<BestTimesTable bestTimes={bestTimes} gender={0} />);

    // WAポイントモードのトグル自体は言語非依存。testID固定でクリックする
    // (ボタン文言はこのモックでは "teams.mobile.bestTimesWaPointsToggle" キーそのものになる)。
    fireEvent.click(getByRawTestId(container, "member-detail-best-times-wa-points-toggle"));

    expect(queryByRawTestId(container, "member-detail-best-times-compare-metric-segment")).toBeNull();
    expect(queryByRawTestId(container, "member-detail-best-times-compare-metric-wa")).toBeNull();
    expect(queryByRawTestId(container, "member-detail-best-times-compare-metric-nr")).toBeNull();
    expect(queryByRawTestId(container, "member-detail-best-times-compare-metric-age")).toBeNull();
    expect(queryByRawTestId(container, "member-detail-best-times-compare-metric-info")).toBeNull();
    expect(queryByRawTestId(container, "member-detail-best-times-age-category-button")).toBeNull();

    // WAポイントモード自体 (既存のWA基準表示) は言語に関係なく従来通り機能する。
    expect(screen.getByText("542")).toBeTruthy();
  });
});
