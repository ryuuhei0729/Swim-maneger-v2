/**
 * BestTimesTable (チーム > メンバータブ > メンバー詳細モーダル ベストタイム表)
 * WAポイント info アイコン追加テスト
 *
 * Sprint Contract (このスプリント): 「WAポイントのボタンに information アイコンをつけて
 * ください。チームメンバー詳細モーダルにも」— 既存の WAポイント表示トグル
 * (`data-testid="member-detail-best-times-wa-points-toggle"`) の隣に、共有コンポーネント
 * `apps/web/components/ui/WaPointsInfoTooltip.tsx` (D-1) 経由で info アイコンを追加する (D-4)。
 *
 * このファイルは D-4 の新規追加分のみを対象にする。トグル自体の既存挙動
 * (V-TOGGLE/V-D1〜V-D5/V-GENDER-DIVERGENCE/V-BASE/V-ORDER/V-REG 等) は既存
 * `apps/web/__tests__/components/member-detail/BestTimesTable.test.tsx` が担当し、
 * 本スプリントで無変更・無編集のまま green であることを別途確認済み。
 *
 * ## 追記 (文言変更スプリント)
 * 「WAポイント表示」トグルが「泳力を点数化」に改称され、比較指標プルダウンで
 * WA/日本記録/区分の3基準が選べるようになったことに伴い、このトグル横の info アイコンは
 * `teams.waPointsCompare.infoTooltip` (WA固有の説明) への暗黙フォールバックをやめ、
 * 新設の `teams.memberDetail.bestTimesTable.pointsInfo` / `pointsInfoAriaLabel`
 * (どの基準でも通用する算出式の一般的な説明) を明示的に渡すよう配線し直された
 * (`<WaPointsInfoTooltip ariaLabel={t("pointsInfoAriaLabel")} tooltipText={t("pointsInfo")} />`)。
 * 本ファイルはこの新しい配線を検証する (profile 版と同一観点)。
 *
 * Sprint Contract 検証観点 (profile 版と同一観点をこのコンポーネントに対して検証):
 *   [V-ICON-09] info アイコンが存在し、aria-label="点数の算出方法"
 *               (= teams.memberDetail.bestTimesTable.pointsInfoAriaLabel) で取得できる
 *               (data-testid="member-detail-best-times-wa-points-info-button")。
 *               旧フォールバック値 "WAポイントとは" にはならないことも確認する
 *   [V-ICON-10] ツールチップの文言が実際の pointsInfo の翻訳文と一致する (トートロジー回避のため、
 *               算出式を含む全文比較)。旧フォールバックの teams.waPointsCompare.infoTooltip
 *               (WA固有、"World Aquatics" を含む) を表示していないことも確認する
 *   [V-ICON-11] info アイコンをクリックするとツールチップが開き、再クリックで閉じる
 *   [V-ICON-12] info アイコンの onBlur でツールチップが閉じる
 *   [V-ICON-13] info アイコンのクリックが WAポイント表示トグル自体
 *               (data-testid="member-detail-best-times-wa-points-toggle", aria-pressed) を
 *               発火させない
 *   [V-ICON-14] Tab で info アイコンにフォーカスできる (実際の hover/focus-within 表示
 *               切替は CSS 制御のため jsdom では検証不能。BLOCKED)
 *
 * ## モック方針
 * next-intl は NextIntlClientProvider + 実メッセージ JSON を使う。
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import { describe, it, expect } from "vitest";

import { BestTimesTable } from "@/components/member-detail/BestTimesTable";
import type { BestTime } from "@/types/member-detail";
import jaMessages from "@apps/shared/messages/ja.json";

// ja.json teams.memberDetail.bestTimesTable.pointsInfo / pointsInfoAriaLabel の実文字列
// (このテスト更新時点でハードコード。実装の t() 呼び出し結果はコピーしていない)
const EXPECTED_JA_TOOLTIP_TEXT =
  "基準とする記録と同着で1000点になります。「1000×(基準タイム÷記録)³」で算出するため、種目やコースが異なっても比較できます。";
const EXPECTED_JA_ARIA_LABEL = "点数の算出方法";

// ja.json teams.waPointsCompare.infoTooltip / infoAriaLabel (旧フォールバック。WA固有の文言)。
// 「フォールバックに戻っていないこと」の否定 assert 専用に保持する。
const FALLBACK_WA_TOOLTIP_TEXT = jaMessages.teams.waPointsCompare.infoTooltip;
const FALLBACK_WA_ARIA_LABEL = jaMessages.teams.waPointsCompare.infoAriaLabel;

function renderWithLocale(bestTimes: BestTime[], props: { gender?: number } = { gender: 0 }) {
  return render(
    <NextIntlClientProvider locale="ja" messages={jaMessages as unknown as AbstractIntlMessages}>
      <BestTimesTable bestTimes={bestTimes} {...props} />
    </NextIntlClientProvider>,
  );
}

function buildBestTime(overrides: Partial<BestTime> = {}): BestTime {
  return {
    id: "record-1",
    time: 60.0,
    created_at: "2020-01-01T00:00:00.000Z",
    pool_type: 0,
    is_relaying: false,
    style: { name_jp: "100m自由形", distance: 100 },
    competition: { title: "テスト大会", date: "2020-01-01" },
    ...overrides,
  };
}

const getInfoButton = () => screen.getByTestId("member-detail-best-times-wa-points-info-button");
const getToggle = () => screen.getByTestId("member-detail-best-times-wa-points-toggle");

describe("[V-ICON-09] メンバー詳細: WAポイントトグルに info アイコンが存在する", () => {
  it("data-testid='member-detail-best-times-wa-points-info-button' が存在し、aria-label='点数の算出方法' を持つ (旧フォールバック値ではない)", () => {
    renderWithLocale([buildBestTime()], { gender: 0 });
    expect(getInfoButton()).toHaveAttribute("aria-label", EXPECTED_JA_ARIA_LABEL);
    expect(getInfoButton().getAttribute("aria-label")).not.toBe(FALLBACK_WA_ARIA_LABEL);
  });

  it("gender が undefined の場合でも info アイコンは例外なく描画される (V-D3 との組合せ回帰)", () => {
    expect(() => renderWithLocale([buildBestTime()], {})).not.toThrow();
    expect(getInfoButton()).toBeInTheDocument();
  });

  it("WAポイントモードOFF/ONどちらでも info アイコンは常に存在する", async () => {
    const user = userEvent.setup();
    renderWithLocale([buildBestTime()], { gender: 0 });
    expect(getInfoButton()).toBeInTheDocument();

    await user.click(getToggle());
    expect(getInfoButton()).toBeInTheDocument();
  });
});

describe("[V-ICON-10] メンバー詳細: info ツールチップの文言が実際の翻訳文と一致する", () => {
  it("role='tooltip' の要素が1件存在し、算出式を含む実際の pointsInfo 全文を表示する (旧WA専用文言ではない)", () => {
    renderWithLocale([buildBestTime()], { gender: 0 });
    const tooltips = screen.getAllByRole("tooltip");
    expect(tooltips).toHaveLength(1);
    expect(tooltips[0]).toHaveTextContent(EXPECTED_JA_TOOLTIP_TEXT);
    expect(tooltips[0]!.textContent).not.toBe(FALLBACK_WA_TOOLTIP_TEXT);
    expect(tooltips[0]!.textContent).not.toContain("World Aquatics");
  });

  it("トグルボタン自身の文言とは異なる、説明文特有の内容 (算出式) を含む (トートロジー回避の確認)", () => {
    renderWithLocale([buildBestTime()], { gender: 0 });
    // role="tooltip" は前のテストと同様に1件のみ存在する前提
    const tooltip = screen.getAllByRole("tooltip")[0]!;
    expect(tooltip.textContent).toContain("1000×(基準タイム÷記録)³");
    expect(getToggle().textContent).not.toContain("1000×(基準タイム÷記録)³");
  });
});

describe("[V-ICON-11] メンバー詳細: info アイコンのタップ開閉トグル", () => {
  it("初期状態ではモバイル用ツールチップは存在しない (role=tooltip は1件のみ)", () => {
    renderWithLocale([buildBestTime()], { gender: 0 });
    expect(screen.getAllByRole("tooltip")).toHaveLength(1);
  });

  it("info アイコンをクリックするとツールチップが2件になり、再クリックで1件に戻る", async () => {
    const user = userEvent.setup();
    renderWithLocale([buildBestTime()], { gender: 0 });

    await user.click(getInfoButton());
    const tooltipsAfterClick = screen.getAllByRole("tooltip");
    expect(tooltipsAfterClick).toHaveLength(2);
    expect(tooltipsAfterClick.some((el) => el.textContent === EXPECTED_JA_TOOLTIP_TEXT)).toBe(
      true,
    );

    await user.click(getInfoButton());
    expect(screen.getAllByRole("tooltip")).toHaveLength(1);
  });
});

describe("[V-ICON-12] メンバー詳細: info アイコンの onBlur でツールチップが閉じる", () => {
  it("クリックで開いた状態から blur すると、モバイル用ツールチップが消える", async () => {
    const user = userEvent.setup();
    renderWithLocale([buildBestTime()], { gender: 0 });

    await user.click(getInfoButton());
    expect(screen.getAllByRole("tooltip")).toHaveLength(2);

    fireEvent.blur(getInfoButton());
    expect(screen.getAllByRole("tooltip")).toHaveLength(1);
  });
});

describe("[V-ICON-13] メンバー詳細: info アイコンのクリックが WAポイント表示トグル自体を発火させない", () => {
  it("info アイコンをクリックしても aria-pressed の値が変化しない", async () => {
    const user = userEvent.setup();
    renderWithLocale([buildBestTime({ time: 54.97, pool_type: 0 })], { gender: 0 });

    expect(getToggle()).toHaveAttribute("aria-pressed", "false");

    await user.click(getInfoButton());
    expect(getToggle()).toHaveAttribute("aria-pressed", "false");

    await user.click(getInfoButton());
    expect(getToggle()).toHaveAttribute("aria-pressed", "false");
  });

  it("info アイコンを複数回クリックしても、時間表示セルの内容が変化しない (542点表示に化けていない)", async () => {
    const user = userEvent.setup();
    const bt = buildBestTime({ time: 54.97, pool_type: 0 });
    renderWithLocale([bt], { gender: 0 });
    const cell = screen.getByTestId("member-detail-best-times-cell-Fr-100");
    const before = cell.textContent;

    await user.click(getInfoButton());
    await user.click(getInfoButton());
    await user.click(getInfoButton());

    expect(cell.textContent).toBe(before);
    expect(cell.textContent).not.toContain("542");
  });

  it("(差分確認) 実際にトグルボタン自身をクリックした場合は aria-pressed が変化する (info アイコンとの挙動差の対照)", async () => {
    const user = userEvent.setup();
    renderWithLocale([buildBestTime({ time: 54.97, pool_type: 0 })], { gender: 0 });

    await user.click(getToggle());
    expect(getToggle()).toHaveAttribute("aria-pressed", "true");
  });
});

describe("[V-ICON-14] メンバー詳細: info アイコンへの Tab フォーカス", () => {
  it("Tab で info アイコンにフォーカスできる (デスクトップの hover/focus-within による実際の表示切替は CSS 制御のため jsdom では検証不能。実ブラウザ検証は BLOCKED)", async () => {
    const user = userEvent.setup();
    renderWithLocale([buildBestTime()], { gender: 0 });

    let reachedInfoButton = false;
    for (let i = 0; i < 10; i++) {
      await user.tab();
      if (document.activeElement === getInfoButton()) {
        reachedInfoButton = true;
        break;
      }
    }
    expect(reachedInfoButton).toBe(true);
    expect(screen.getAllByRole("tooltip")[0]).toHaveTextContent(EXPECTED_JA_TOOLTIP_TEXT);
  });
});
