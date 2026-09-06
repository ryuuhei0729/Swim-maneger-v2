/**
 * BestTimesTable (マイページ ベストタイム表) WAポイント info アイコン追加テスト
 *
 * Sprint Contract (このスプリント): 「WAポイントのボタンに information アイコンをつけて
 * ください。マイページにも」— 既存の WAポイント表示トグル
 * (`data-testid="best-times-wa-points-toggle"`) の隣に、共有コンポーネント
 * `apps/web/components/ui/WaPointsInfoTooltip.tsx` (D-1) 経由で info アイコンを追加する (D-3)。
 *
 * このファイルは D-3 の新規追加分のみを対象にする。トグル自体の既存挙動
 * (V-TOGGLE/V-D1〜V-D5/V-BASE/V-REG 等) は既存
 * `apps/web/__tests__/components/profile/BestTimesTable.test.tsx` が担当し、
 * 本スプリントで無変更・無編集のまま green であることを別途確認済み。
 *
 * ## 追記 (文言変更スプリント)
 * 「WAポイント表示」トグルが「泳力を点数化」に改称され、比較指標プルダウンで
 * WA/日本記録/区分の3基準が選べるようになったことに伴い、このトグル横の info アイコンは
 * `teams.waPointsCompare.infoTooltip` (WA固有の説明) への暗黙フォールバックをやめ、
 * 新設の `mypage.bestTimesTable.pointsInfo` / `pointsInfoAriaLabel` (どの基準でも通用する
 * 算出式の一般的な説明) を明示的に渡すよう配線し直された
 * (`<WaPointsInfoTooltip ariaLabel={t("pointsInfoAriaLabel")} tooltipText={t("pointsInfo")} />`)。
 * 本ファイルはこの新しい配線を検証する。「フォールバックに戻ってしまう」退行
 * (tooltipText/ariaLabel props を渡し忘れる) を検出できるよう、新文言の一致に加えて
 * 旧フォールバック文言 (WA固有、"World Aquatics" を含む) を表示していないことも明示的に確認する。
 *
 * Sprint Contract 検証観点:
 *   [V-ICON-03] info アイコンが存在し、aria-label="点数の算出方法"
 *               (= mypage.bestTimesTable.pointsInfoAriaLabel) で取得できる
 *               (data-testid="best-times-wa-points-info-button")。
 *               旧フォールバック値 "WAポイントとは" (teams.waPointsCompare.infoAriaLabel) には
 *               ならないことも確認する
 *   [V-ICON-04] ツールチップの文言が実際の mypage.bestTimesTable.pointsInfo の翻訳文と一致する
 *               (トートロジー回避のため、算出式を含む全文比較)。
 *               旧フォールバックの teams.waPointsCompare.infoTooltip ("WAポイントは World
 *               Aquatics..." で始まる WA 固有の説明文) を表示していないことも確認する
 *   [V-ICON-05] info アイコンをクリックするとツールチップが開き、再クリックで閉じる
 *   [V-ICON-06] info アイコンの onBlur でツールチップが閉じる
 *   [V-ICON-07] info アイコンのクリックが WAポイント表示トグル自体
 *               (data-testid="best-times-wa-points-toggle", aria-pressed) を
 *               発火させない (アイコンはトグルボタンの上に絶対配置されるため、
 *               ヒットエリアの重なり・イベント伝播が最も起きやすい実バグ)
 *   [V-ICON-08] Tab で info アイコンにフォーカスできる (デスクトップの hover/focus-within
 *               表示切替そのものは CSS 制御のため jsdom では検証不能。BLOCKED)
 *
 * ## モック方針
 * next-intl は NextIntlClientProvider + 実メッセージ JSON を使う
 * (apps/web/__tests__/components/profile/BestTimesTable.test.tsx と同方針)
 *
 * ## 期待値の作成方法 (トートロジー回避)
 * ツールチップ本文・aria-label は ja.json から書き出した実文字列をハードコードして assert する
 * (実装の t() 呼び出し結果を期待値生成に使わない)。「WAポイント」のような短い部分文字列は
 * 単独では使わない — トグルボタンのラベル (`waPointsToggle` = 「泳力を点数化」) や比較指標
 * プルダウンの選択肢 (`compareMetric.wa` = 「WAポイント」) にも同種の文字列が出現しうるため、
 * アイコン特有の算出式パートや、旧フォールバック文言との差分 ("World Aquatics" の有無) で判定する。
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import { describe, it, expect } from "vitest";

import BestTimesTable, { type BestTime } from "../../../components/profile/BestTimesTable";
import jaMessages from "@apps/shared/messages/ja.json";

// ja.json mypage.bestTimesTable.pointsInfo / pointsInfoAriaLabel の実文字列
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

const getInfoButton = () => screen.getByTestId("best-times-wa-points-info-button");
const getToggle = () => screen.getByTestId("best-times-wa-points-toggle");

describe("[V-ICON-03] マイページ: WAポイントトグルに info アイコンが存在する", () => {
  it("data-testid='best-times-wa-points-info-button' が存在し、aria-label='点数の算出方法' を持つ (旧フォールバック値ではない)", () => {
    renderWithLocale([buildBestTime()]);
    expect(getInfoButton()).toHaveAttribute("aria-label", EXPECTED_JA_ARIA_LABEL);
    // 退行検出: pointsInfoAriaLabel を渡し忘れて teams.waPointsCompare.infoAriaLabel
    // (WA専用の "WAポイントとは") にフォールバックしていないこと
    expect(getInfoButton().getAttribute("aria-label")).not.toBe(FALLBACK_WA_ARIA_LABEL);
  });

  it("WAポイントモードOFF/ONどちらでも info アイコンは常に存在する (条件付き描画によるレイアウトシフト禁止)", async () => {
    const user = userEvent.setup();
    renderWithLocale([buildBestTime()]);
    expect(getInfoButton()).toBeInTheDocument();

    await user.click(getToggle());
    expect(getInfoButton()).toBeInTheDocument();
  });
});

describe("[V-ICON-04] マイページ: info ツールチップの文言が実際の翻訳文と一致する", () => {
  it("role='tooltip' の要素が1件存在し、算出式を含む実際の pointsInfo 全文を表示する (旧WA専用文言ではない)", () => {
    renderWithLocale([buildBestTime()]);
    const tooltips = screen.getAllByRole("tooltip");
    expect(tooltips).toHaveLength(1);
    expect(tooltips[0]).toHaveTextContent(EXPECTED_JA_TOOLTIP_TEXT);
    // 退行検出: tooltipText を渡し忘れて teams.waPointsCompare.infoTooltip
    // (WA専用、"World Aquatics" を含む) にフォールバックしていないこと
    expect(tooltips[0]!.textContent).not.toBe(FALLBACK_WA_TOOLTIP_TEXT);
    expect(tooltips[0]!.textContent).not.toContain("World Aquatics");
  });

  it("トグルボタン自身の文言 ('泳力を点数化') とは異なる、説明文特有の内容を含む (短い部分文字列によるトートロジー回避の確認)", () => {
    renderWithLocale([buildBestTime()]);
    // role="tooltip" は前のテストと同様に1件のみ存在する前提
    const tooltip = screen.getAllByRole("tooltip")[0]!;
    // トグルのラベルには絶対に出てこない、算出式パート
    expect(tooltip.textContent).toContain("1000×(基準タイム÷記録)³");
    expect(getToggle().textContent).not.toContain("1000×(基準タイム÷記録)³");
  });
});

describe("[V-ICON-05] マイページ: info アイコンのタップ開閉トグル", () => {
  it("初期状態ではモバイル用ツールチップは存在しない (role=tooltip は1件のみ)", () => {
    renderWithLocale([buildBestTime()]);
    expect(screen.getAllByRole("tooltip")).toHaveLength(1);
  });

  it("info アイコンをクリックするとツールチップが2件になり、再クリックで1件に戻る", async () => {
    const user = userEvent.setup();
    renderWithLocale([buildBestTime()]);

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

describe("[V-ICON-06] マイページ: info アイコンの onBlur でツールチップが閉じる", () => {
  it("クリックで開いた状態から blur すると、モバイル用ツールチップが消える", async () => {
    const user = userEvent.setup();
    renderWithLocale([buildBestTime()]);

    await user.click(getInfoButton());
    expect(screen.getAllByRole("tooltip")).toHaveLength(2);

    fireEvent.blur(getInfoButton());
    expect(screen.getAllByRole("tooltip")).toHaveLength(1);
  });
});

describe("[V-ICON-07] マイページ: info アイコンのクリックが WAポイント表示トグル自体を発火させない", () => {
  it("info アイコンをクリックしても aria-pressed の値が変化しない (トグル誤作動が起きていないことの実証)", async () => {
    const user = userEvent.setup();
    renderWithLocale([buildBestTime({ time: 54.97, pool_type: 0 })]);

    expect(getToggle()).toHaveAttribute("aria-pressed", "false");

    await user.click(getInfoButton());
    expect(getToggle()).toHaveAttribute("aria-pressed", "false");

    await user.click(getInfoButton());
    expect(getToggle()).toHaveAttribute("aria-pressed", "false");
  });

  it("info アイコンを複数回クリックしても、時間表示セルの内容 (WAポイント表示に切り替わっていないこと) が変化しない", async () => {
    const user = userEvent.setup();
    const bt = buildBestTime({ time: 54.97, pool_type: 0 });
    renderWithLocale([bt]);
    const cell = screen.getByTestId("best-times-cell-Fr-100");
    const before = cell.textContent;

    await user.click(getInfoButton());
    await user.click(getInfoButton());
    await user.click(getInfoButton());

    expect(cell.textContent).toBe(before);
    // トグルが誤って発火していればWAポイント表示 ("542") に化けているはず
    expect(cell.textContent).not.toContain("542");
  });

  it("(差分確認) 実際にトグルボタン自身をクリックした場合は aria-pressed が変化する (info アイコンとの挙動差の対照)", async () => {
    const user = userEvent.setup();
    renderWithLocale([buildBestTime({ time: 54.97, pool_type: 0 })]);

    await user.click(getToggle());
    expect(getToggle()).toHaveAttribute("aria-pressed", "true");
  });
});

describe("[V-ICON-08] マイページ: info アイコンへの Tab フォーカス", () => {
  it("Tab で info アイコンにフォーカスできる (デスクトップの hover/focus-within による実際の表示切替は CSS 制御のため jsdom では検証不能。実ブラウザ検証は BLOCKED)", async () => {
    const user = userEvent.setup();
    renderWithLocale([buildBestTime()]);

    // Tabs -> トグルボタン -> info アイコン -> チェックボックス の順でフォーカスが移動する想定。
    // 具体的な移動先要素数に依存しないよう、info アイコンに到達するまで Tab し続ける。
    let reachedInfoButton = false;
    for (let i = 0; i < 10; i++) {
      await user.tab();
      if (document.activeElement === getInfoButton()) {
        reachedInfoButton = true;
        break;
      }
    }
    expect(reachedInfoButton).toBe(true);
    // デスクトップ用ツールチップ要素自体は常時DOM上に存在し、正しい説明文を持つ
    expect(screen.getAllByRole("tooltip")[0]).toHaveTextContent(EXPECTED_JA_TOOLTIP_TEXT);
  });
});
