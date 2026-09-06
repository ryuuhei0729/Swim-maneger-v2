// =============================================================================
// BestTimesTable.pointsInfoIcon.test.tsx (apps/mobile/components/teams/member-detail)
// =============================================================================
// QA Sprint Contract 検証 (文言変更スプリント item #4): WAポイント表示トグル横の info アイコン
// (`member-detail-best-times-wa-info`) は、従来 `teams.waPointsCompare.infoTooltip`
// (WA専用の説明) にフォールバックしていた。比較指標プルダウンの新設 (WA/日本記録/区分の
// 3基準が選べるようになった) に伴い、プルダウンで「日本記録基準」を選んでいても WA の説明が
// 出てしまう不整合を解消するため、どの基準でも通用する算出式の一般的な説明
// (`teams.memberDetail.bestTimesTable.pointsInfo` / `pointsInfoAriaLabel`) を明示的に渡すよう
// 配線し直された。本ファイルはこの配線が実際に効いていることを、実際の ja.json 値を使って
// 検証する (web 版 `apps/web/__tests__/components/member-detail/BestTimesTable.infoIcon.test.tsx`
// の mobile 相当。web 側は無変更、mobile 側にこの観点のテストがまだ無かったため新設する)。
//
// ## モック方針
// react-i18next は `apps/mobile/vitest.setup.ts` のグローバルモックが実際の ja.json を
// 解決するため、このファイル内でのローカルモックは不要 (他の compareMetric 系テストと同方針)。
//
// Sprint Contract 検証観点:
//   [V-PI-01] info アイコンをタップすると開くポップアップのタイトルが
//             teams.memberDetail.bestTimesTable.pointsInfoAriaLabel と一致する
//             (旧フォールバック teams.waPointsCompare.infoAriaLabel = "WAポイントとは" ではない)
//   [V-PI-02] ポップアップの本文が teams.memberDetail.bestTimesTable.pointsInfo と一致する
//             (旧フォールバック teams.waPointsCompare.infoTooltip ではない。
//             "World Aquatics" という WA 固有の文言を含まないことも確認する)
// =============================================================================

import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import type { BestTime } from "@apps/shared/types/ui";
import { BestTimesTable } from "../BestTimesTable";
import jaMessages from "@apps/shared/messages/ja.json";

const EXPECTED_ARIA_LABEL = jaMessages.teams.memberDetail.bestTimesTable.pointsInfoAriaLabel;
const EXPECTED_TOOLTIP_TEXT = jaMessages.teams.memberDetail.bestTimesTable.pointsInfo;
const FALLBACK_WA_ARIA_LABEL = jaMessages.teams.waPointsCompare.infoAriaLabel;
const FALLBACK_WA_TOOLTIP_TEXT = jaMessages.teams.waPointsCompare.infoTooltip;

function getByRawTestId(container: HTMLElement, testId: string): HTMLElement {
  const el = container.querySelector(`[testid="${testId}"]`);
  if (!el) throw new Error(`testid="${testId}" の要素が見つかりません`);
  return el as HTMLElement;
}

// `WaPointsInfoTooltip` (mobile) はタップで開く `CenterModal` の中に
// `<Text>{ariaLabel}</Text>` → `<Text>{tooltipText}</Text>` の順で描画する
// (`components/ui/__tests__/WaPointsInfoTooltip.test.tsx` の [V-TOOLTIP-06] と同じ手法)。
// ただし本ファイルはテーブル全体 (タブ「ALL」等、他にも多数の span を含む) を描画するため、
// `WaPointsInfoTooltip.test.tsx` のようにコンテナ全体から span を拾うと無関係な要素を
// 誤取得する。`CenterModal` の `<Modal animationType="none">` はこのリポジトリの DOM モックでは
// `animationtype="none"` 属性としてそのまま転記される (`transparent`/`statusBarTranslucent` は
// 値が boolean のため非標準属性として黙って落とされ、DOM 上には現れない)。これを目印に
// モーダルの subtree だけに絞り込む。
function getTitleAndBodySpans(container: HTMLElement): { titleEl?: Element; bodyEl?: Element } {
  const modal = container.querySelector('[animationtype="none"]');
  if (!modal) return {};
  const contentSpans = Array.from(modal.querySelectorAll("span")).filter(
    (el) => !el.hasAttribute("data-testid"),
  );
  return { titleEl: contentSpans[0], bodyEl: contentSpans[1] };
}

let idCounter = 0;
const buildBestTime = (overrides: Partial<BestTime> & { style: BestTime["style"] }): BestTime => {
  idCounter += 1;
  return {
    id: `pi-rec-${idCounter}`,
    time: 30.0,
    created_at: "2025-01-01T00:00:00.000Z",
    pool_type: 0,
    is_relaying: false,
    ...overrides,
  } as BestTime;
};

const FR100 = { name_jp: "100m自由形", distance: 100 };

describe("BestTimesTable (member-detail) - WAポイントトグル横の info アイコン", () => {
  it("[V-PI-01/02] info アイコンをタップすると、ポップアップのタイトル/本文が pointsInfoAriaLabel/pointsInfo と一致し、旧WA専用フォールバックではない", () => {
    const bestTimes = [buildBestTime({ time: 54.97, style: FR100 })];
    const { container } = render(<BestTimesTable bestTimes={bestTimes} gender={0} />);

    fireEvent.click(getByRawTestId(container, "member-detail-best-times-wa-info"));

    const { titleEl, bodyEl } = getTitleAndBodySpans(container);
    expect(titleEl).toBeTruthy();
    expect(bodyEl).toBeTruthy();

    expect(titleEl!.textContent).toBe(EXPECTED_ARIA_LABEL);
    expect(bodyEl!.textContent).toBe(EXPECTED_TOOLTIP_TEXT);

    // 退行検出: ariaLabel/tooltipText を渡し忘れて teams.waPointsCompare.* (WA専用) に
    // フォールバックしていないこと
    expect(titleEl!.textContent).not.toBe(FALLBACK_WA_ARIA_LABEL);
    expect(bodyEl!.textContent).not.toBe(FALLBACK_WA_TOOLTIP_TEXT);
    expect(bodyEl!.textContent).not.toContain("World Aquatics");
  });
});
