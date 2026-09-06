/**
 * BestTimesTable (メンバー詳細 ベストタイム表) 「比較指標プルダウン」機能テスト
 *
 * Sprint Contract: WAポイント固定だった比較指標を、①WAポイント ②日本記録ポイント
 * ③年齢別ポイント の3択プルダウンに変更する (対象2画面のうちメンバー詳細側)。
 *
 * apps/web/__tests__/components/profile/BestTimesTable.compareMetric.test.tsx と同じ観点を
 * member-detail 版に対して検証する (2画面は元々ほぼ同一実装のため、契約・期待値も共通)。
 * このファイルは新規追加分のみを対象にし、既存の
 * `apps/web/__tests__/components/member-detail/BestTimesTable.test.tsx` /
 * `BestTimesTable.infoIcon.test.tsx` (このスプリントでは編集しない) はそのまま無変更で
 * green であることを別途確認する。
 *
 * ## インターフェース契約 (詳細は profile 版の同名ファイル参照)
 * - props に `ageCategory?: AgeCategory | null` を追加
 * - 既存の `data-testid="member-detail-best-times-wa-points-toggle"` (aria-pressed) は不変。
 *   このトグルは「ポイント表示モードのON/OFF」のみを担い、比較指標プルダウンとは独立
 * - ポイント表示モードON時のみ `data-testid="member-detail-best-times-compare-metric-select"` が
 *   描画される。option の value は "wa"/"nr"/"age"。初期値は常に "wa"
 * - **ja ロケールでは3つの option。ja 以外ではプルダウン UI 自体を
 *   表示しない** (option を1つに絞る案は不採用)
 * - metric="age" のときのみ `data-testid="member-detail-best-times-age-category-select"` が
 *   追加描画される。option の value は
 *   "unset"/"elementary"/"juniorHigh"/"highSchool"/"university"/"general"
 * - metric="nr" のセル計算は getBestDomesticPointsForCandidates(candidates, "general", ...) 相当
 *   (「日本記録ポイント」= category="general" のショートカット)
 * - **info アイコンは既存の `member-detail-best-times-wa-points-info-button`
 *   (WA トグル専用、既存4保護ファイルの対象、無変更) とは別に、比較指標プルダウン用の新規アイコン
 *   `data-testid="member-detail-best-times-compare-metric-info-button"` を1つだけ追加する。
 *   内容は metric 選択に応じて動的に変わるのではなく、WA/日本記録/年齢別の3指標の説明を
 *   1つのツールチップ内に静的に列挙する固定コンテンツである**
 *
 * ## 期待値の作成方法 (トートロジー回避)
 * profile 版と同じ base time (WA/日本記録/高校記録/中学記録) を使い、`node -e` で
 * P=floor(1000*(B/T)^3) を独立に計算したハードコード値を使用する。
 */

import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import { describe, expect, it } from "vitest";

import { BestTimesTable } from "../../../components/member-detail/BestTimesTable";
import type { BestTime } from "@/types/member-detail";
import jaMessages from "@apps/shared/messages/ja.json";
import enMessages from "@apps/shared/messages/en.json";

type Locale = "ja" | "en";
const MESSAGES: Record<Locale, AbstractIntlMessages> = {
  ja: jaMessages as unknown as AbstractIntlMessages,
  en: enMessages as unknown as AbstractIntlMessages,
};

// AgeCategory は apps/shared/utils/domesticRecords.ts (未実装) の型のため、ここではリテラルの
// 文字列 union として直接使う (profile版と同じ理由)。
type AgeCategoryLiteral = "elementary" | "juniorHigh" | "highSchool" | "university" | "general";

function renderWithLocale(
  bestTimes: BestTime[],
  props: { gender?: number; ageCategory?: AgeCategoryLiteral | null } = { gender: 0 },
  locale: Locale = "ja",
) {
  return render(
    <NextIntlClientProvider locale={locale} messages={MESSAGES[locale]}>
      {/* ageCategory は Sprint Contract で追加予定の新規 prop。スプレッド経由のため
          未実装時点でも excess-property-check には掛からず tsc は通る。 */}
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
  } as BestTime;
}

// select の現在値取得専用ヘルパー (profile版と同じ理由。詳細はそちらのコメント参照)
function selectValue(el: HTMLElement): string {
  return (el as unknown as HTMLSelectElement).value;
}

const getToggle = () => screen.getByTestId("member-detail-best-times-wa-points-toggle");
const queryMetricSelect = () => screen.queryByTestId("member-detail-best-times-compare-metric-select");
const getMetricSelect = () => screen.getByTestId("member-detail-best-times-compare-metric-select");
const queryAgeCategorySelect = () =>
  screen.queryByTestId("member-detail-best-times-age-category-select");
const getAgeCategorySelect = () => screen.getByTestId("member-detail-best-times-age-category-select");
const getCell = () => screen.getByTestId("member-detail-best-times-cell-Fr-100");

describe("[V-CM-01] 比較指標プルダウン (member-detail): ポイント表示モードOFF時は描画されない", () => {
  it("初期状態 (モードOFF) では compare-metric-select が存在しない", async () => {
    renderWithLocale([buildBestTime()]);
    expect(queryMetricSelect()).not.toBeInTheDocument();
  });

  it("トグルをONにすると compare-metric-select が現れる", async () => {
    const user = userEvent.setup();
    renderWithLocale([buildBestTime()]);
    await user.click(getToggle());
    expect(queryMetricSelect()).toBeInTheDocument();
  });
});

describe("[V-CM-02] 比較指標プルダウン (member-detail): ja ロケールでは3択、初期値は常に「wa」", () => {
  it("option が wa/nr/age の3つ存在する", async () => {
    const user = userEvent.setup();
    renderWithLocale([buildBestTime()], { gender: 0 }, "ja");
    await user.click(getToggle());

    const select = getMetricSelect();
    const options = within(select).getAllByRole("option") as HTMLOptionElement[];
    const values = options.map((o) => o.value).sort();
    expect(values).toEqual(["age", "nr", "wa"]);
  });

  it("初期選択値は常に 'wa' である (back-compat)", async () => {
    const user = userEvent.setup();
    renderWithLocale([buildBestTime()]);
    await user.click(getToggle());
    expect(selectValue(getMetricSelect())).toBe("wa");
  });
});

describe("[V-CM-03] 比較指標プルダウン (member-detail): ja 以外のロケールではプルダウン UI 自体を表示しない", () => {
  it("en ロケール: ポイント表示モードをONにしても compare-metric-select は存在しない (現行のWAトグルのみのまま)", async () => {
    const user = userEvent.setup();
    renderWithLocale([buildBestTime()], { gender: 0 }, "en");
    await user.click(getToggle());

    expect(queryMetricSelect()).toBeNull();
  });

  it("en ロケール: compare-metric-info-button (新設の指標説明アイコン) も表示されない", async () => {
    const user = userEvent.setup();
    renderWithLocale([buildBestTime()], { gender: 0 }, "en");
    await user.click(getToggle());

    expect(screen.queryByTestId("member-detail-best-times-compare-metric-info-button")).toBeNull();
  });
});

describe("[V-CM-04] 比較指標プルダウン (member-detail): 指標を切り替えるとセルの点数が変わる", () => {
  it("自由形100m(短水路)男子T=50.00: wa=721点 -> nr(日本記録)=789点 に変わる", async () => {
    const user = userEvent.setup();
    renderWithLocale([buildBestTime({ time: 50.0, pool_type: 0 })], { gender: 0 });
    await user.click(getToggle());

    expect(getCell().textContent).toContain("721");

    await user.selectOptions(getMetricSelect(), "nr");
    expect(getCell().textContent).toContain("789");
    expect(getCell().textContent).not.toContain("721");
  });
});

describe("[V-CM-05] 比較指標プルダウン (member-detail): 年齢別ポイント選択時の自動判定区分と手動変更", () => {
  it("ageCategory='highSchool' プロップを渡すと、age-category-select の初期選択値が 'highSchool' になる", async () => {
    const user = userEvent.setup();
    renderWithLocale([buildBestTime({ time: 50.0, pool_type: 0 })], {
      gender: 0,
      ageCategory: "highSchool",
    });
    await user.click(getToggle());
    await user.selectOptions(getMetricSelect(), "age");

    expect(selectValue(getAgeCategorySelect())).toBe("highSchool");
    // 自由形100m(短水路)男子T=50.00, 高校記録base=47.07 -> 834点
    expect(getCell().textContent).toContain("834");
  });

  it("age-category-select は手動で別の区分に変更できる (juniorHighへ変更するとセルが904点になる)", async () => {
    const user = userEvent.setup();
    renderWithLocale([buildBestTime({ time: 50.0, pool_type: 0 })], {
      gender: 0,
      ageCategory: "highSchool",
    });
    await user.click(getToggle());
    await user.selectOptions(getMetricSelect(), "age");
    expect(getCell().textContent).toContain("834");

    await user.selectOptions(getAgeCategorySelect(), "juniorHigh");
    expect(selectValue(getAgeCategorySelect())).toBe("juniorHigh");
    expect(getCell().textContent).toContain("904");
    expect(getCell().textContent).not.toContain("834");
  });
});

describe("[V-CM-06] 比較指標プルダウン (member-detail): birthdayが無く区分が自動判定できない場合", () => {
  it("ageCategory=null のとき、age-category-select の初期値は「未設定」(value='unset') であり、セルは「—」", async () => {
    const user = userEvent.setup();
    renderWithLocale([buildBestTime({ time: 50.0, pool_type: 0 })], { gender: 0, ageCategory: null });
    await user.click(getToggle());
    await user.selectOptions(getMetricSelect(), "age");

    expect(selectValue(getAgeCategorySelect())).toBe("unset");
    expect(getCell().textContent).toContain("—");
  });

  it("未設定の状態からユーザーが手動で区分を選ぶと、セルに点数が表示される (手動変更は可能)", async () => {
    const user = userEvent.setup();
    renderWithLocale([buildBestTime({ time: 50.0, pool_type: 0 })], { gender: 0, ageCategory: null });
    await user.click(getToggle());
    await user.selectOptions(getMetricSelect(), "age");
    expect(getCell().textContent).toContain("—");

    await user.selectOptions(getAgeCategorySelect(), "highSchool");
    expect(getCell().textContent).toContain("834");
  });

  it("ageCategory プロップ自体が渡されない (undefined) 場合も未設定と同様に扱われ、例外を投げない", () => {
    expect(() => renderWithLocale([buildBestTime()], { gender: 0 })).not.toThrow();
  });
});

describe("[V-CM-07] 比較指標プルダウン (member-detail): 既存のWAトグル自体はプルダウン操作の影響を受けない (back-compat)", () => {
  it("compare-metric-select を操作しても、トグルの aria-pressed は変化しない", async () => {
    const user = userEvent.setup();
    renderWithLocale([buildBestTime()]);
    await user.click(getToggle());
    expect(getToggle()).toHaveAttribute("aria-pressed", "true");

    await user.selectOptions(getMetricSelect(), "nr");
    expect(getToggle()).toHaveAttribute("aria-pressed", "true");

    await user.selectOptions(getMetricSelect(), "age");
    expect(getToggle()).toHaveAttribute("aria-pressed", "true");
  });

  it("トグルをOFFに戻すと compare-metric-select / age-category-select は消える", async () => {
    const user = userEvent.setup();
    renderWithLocale([buildBestTime()], { gender: 0, ageCategory: "highSchool" });
    await user.click(getToggle());
    await user.selectOptions(getMetricSelect(), "age");
    expect(queryAgeCategorySelect()).toBeInTheDocument();

    await user.click(getToggle());
    expect(queryMetricSelect()).not.toBeInTheDocument();
    expect(queryAgeCategorySelect()).not.toBeInTheDocument();
  });
});

describe("[V-CM-08] 比較指標の説明アイコン (member-detail): 新設の compare-metric-info-button は1つの静的な説明を持つ", () => {
  it("ポイント表示モードOFF時は compare-metric-info-button が存在しない (compare-metric-select と同じ表示条件)", () => {
    renderWithLocale([buildBestTime()]);
    expect(
      screen.queryByTestId("member-detail-best-times-compare-metric-info-button"),
    ).not.toBeInTheDocument();
  });

  it("ポイント表示モードONにすると compare-metric-info-button が現れ、既存の member-detail-best-times-wa-points-info-button とは別要素である", async () => {
    const user = userEvent.setup();
    renderWithLocale([buildBestTime()]);
    await user.click(getToggle());

    const newIcon = screen.getByTestId("member-detail-best-times-compare-metric-info-button");
    const existingWaIcon = screen.getByTestId("member-detail-best-times-wa-points-info-button");
    expect(newIcon).toBeInTheDocument();
    expect(existingWaIcon).toBeInTheDocument();
    expect(newIcon).not.toBe(existingWaIcon);
  });

  // 実測: 「モバイル用ツールチップをクリックで開いてから getAllByRole("tooltip") を
  // 連結比較する」測り方は、userEvent.selectOptions がフォーカスを select に移すことで
  // 既存の (正しい・変更禁止の) onBlur={() => setShowInfo(false)} が発火し、モバイル用が閉じて
  // 要素数が変わってしまう (3→2)。これは「開閉状態」を測ってしまっているだけで、
  // 「説明文の内容」を測っていない。
  // → 常設のデスクトップ用ツールチップ (aria-describedby が指す要素。クリック不要で常時DOM上に
  //   存在し、モバイル用と同じ resolvedTooltipText を描画する) を直接参照することで、
  //   開閉状態に依存せず「内容」だけを比較する (profile 版と同じ理由)。
  function getCompareMetricInfoTooltipText(): string {
    const infoButton = screen.getByTestId("member-detail-best-times-compare-metric-info-button");
    const describedById = infoButton.getAttribute("aria-describedby");
    expect(describedById).toBeTruthy();
    const tooltipEl = document.getElementById(describedById as string);
    expect(tooltipEl).not.toBeNull();
    return tooltipEl?.textContent ?? "";
  }

  it("compare-metric-info-button のツールチップは非空である (クリック不要、常設のデスクトップ用要素を直接参照)", async () => {
    const user = userEvent.setup();
    renderWithLocale([buildBestTime()]);
    await user.click(getToggle());

    expect(getCompareMetricInfoTooltipText().length).toBeGreaterThan(0);
  });

  it("指標(select)を wa -> nr -> age と切り替えても、compare-metric-info-button のツールチップ本文は変化しない (静的コンテンツであることの確認)", async () => {
    const user = userEvent.setup();
    renderWithLocale([buildBestTime()]);
    await user.click(getToggle());

    const textWhenWa = getCompareMetricInfoTooltipText();

    await user.selectOptions(getMetricSelect(), "nr");
    const textWhenNr = getCompareMetricInfoTooltipText();

    await user.selectOptions(getMetricSelect(), "age");
    const textWhenAge = getCompareMetricInfoTooltipText();

    expect(textWhenWa.length).toBeGreaterThan(0);
    expect(textWhenNr).toBe(textWhenWa);
    expect(textWhenAge).toBe(textWhenWa);
  });

  // 追記 (文言変更スプリント): 当初 member-detail-best-times-wa-points-info-button は
  // teams.waPointsCompare.infoTooltip (WA専用の説明) にフォールバックしており、本テストは
  // それを back-compat として固定していた。しかしプルダウンで「日本記録基準」を選んでいても
  // WA の説明が出てしまう不整合だったため、比較指標プルダウンの新設に合わせて
  // teams.memberDetail.bestTimesTable.pointsInfo (どの基準でも通用する算出式の一般的な説明) を
  // 明示的に渡すよう配線し直された。back-compat の前提そのものが変わったため、期待を反転させる。
  it("member-detail-best-times-wa-points-info-button の説明文は teams.memberDetail.bestTimesTable.pointsInfo (基準非依存の汎用説明) であり、teams.waPointsCompare.infoTooltip (WA専用) は表示されない", async () => {
    const user = userEvent.setup();
    renderWithLocale([buildBestTime()]);
    await user.click(getToggle());

    const tooltips = screen.getAllByRole("tooltip");
    const hasPointsInfoText = tooltips.some(
      (t) => t.textContent === jaMessages.teams.memberDetail.bestTimesTable.pointsInfo,
    );
    const hasWaOnlyText = tooltips.some(
      (t) => t.textContent === jaMessages.teams.waPointsCompare.infoTooltip,
    );
    expect(hasPointsInfoText).toBe(true);
    expect(hasWaOnlyText).toBe(false);
  });
});

describe("[V-CM-10] 比較指標の説明アイコン (member-detail): ツールチップの改行が改行文字として保持されている (whitespace-pre-line 前提のレンダリング検証)", () => {
  // profile 版と同じ理由・同じ手法 (詳細はそちらのコメント参照)。
  // jsdom は CSS を解釈しない (vitest.config.ts に css: true 設定なし) ため、
  // `whitespace-pre-line` による視覚的な改行描画そのものはこのテストでは検証できない
  // (データとして \n が保持されていることの確認に留まる)。視覚確認は Playwright が担う。
  function getCompareMetricInfoTooltipText(): string {
    const infoButton = screen.getByTestId("member-detail-best-times-compare-metric-info-button");
    const describedById = infoButton.getAttribute("aria-describedby");
    expect(describedById).toBeTruthy();
    const tooltipEl = document.getElementById(describedById as string);
    expect(tooltipEl).not.toBeNull();
    return tooltipEl?.textContent ?? "";
  }

  it("ツールチップの textContent を \\n で分割すると正確に3行になる (ja)", async () => {
    const user = userEvent.setup();
    renderWithLocale([buildBestTime()]);
    await user.click(getToggle());

    const text = getCompareMetricInfoTooltipText();
    const lines = text.split("\n");
    expect(lines.length).toBe(3);
    for (const line of lines) {
      expect(line.length).toBeGreaterThan(0);
    }
  });

  it("ツールチップの3行が、i18nメッセージ (teams.memberDetail.bestTimesTable.compareMetricInfo, golden source) の対応行とそれぞれ一致する", async () => {
    const user = userEvent.setup();
    renderWithLocale([buildBestTime()]);
    await user.click(getToggle());

    const expectedLines = (
      jaMessages.teams.memberDetail.bestTimesTable.compareMetricInfo as string
    ).split("\n");
    expect(expectedLines.length).toBe(3);

    const actualLines = getCompareMetricInfoTooltipText().split("\n");
    expect(actualLines).toEqual(expectedLines);
  });

  it("各行の先頭がプルダウンの選択肢ラベル (compareMetric.wa/nr/age) と一致する (用語ドリフトの回帰ガード。コンポーネント側からの確認)", async () => {
    const user = userEvent.setup();
    renderWithLocale([buildBestTime()]);
    await user.click(getToggle());

    const lines = getCompareMetricInfoTooltipText().split("\n");
    const select = getMetricSelect();
    const options = within(select).getAllByRole("option") as HTMLOptionElement[];
    const labelByValue = new Map(options.map((o) => [o.value, o.textContent ?? ""]));

    expect(lines[0]?.startsWith(labelByValue.get("wa") ?? "\0")).toBe(true);
    expect(lines[1]?.startsWith(labelByValue.get("nr") ?? "\0")).toBe(true);
    expect(lines[2]?.startsWith(labelByValue.get("age") ?? "\0")).toBe(true);
  });
});

describe("[V-CM-09] 年齢区分セレクトの ageCategory prop 追従 (Reviewer Critical 回帰テスト、member-detail)", () => {
  // profile版と同じ観点 (詳細はそちらのコメント参照)。修正前の実装は `useState(ageCategory ?? null)`
  // で mount 時に一度しか prop を読まず、以後 prop が変わってもセレクトが古い値のまま固まっていた。

  it("ユーザー未操作の間は ageCategory prop の変化 (null -> university) にセレクト値とセルが追従する", async () => {
    const user = userEvent.setup();
    const view = renderWithLocale([buildBestTime({ time: 50.0, pool_type: 0 })], {
      gender: 0,
      ageCategory: null,
    });
    await user.click(getToggle());
    await user.selectOptions(getMetricSelect(), "age");

    expect(selectValue(getAgeCategorySelect())).toBe("unset");
    expect(getCell().textContent).toContain("—");

    view.rerender(
      <NextIntlClientProvider locale="ja" messages={MESSAGES.ja}>
        <BestTimesTable
          bestTimes={[buildBestTime({ time: 50.0, pool_type: 0 })]}
          gender={0}
          ageCategory="university"
        />
      </NextIntlClientProvider>,
    );

    expect(selectValue(getAgeCategorySelect())).toBe("university");
    // 自由形100m(短水路)男子T=50.00, 学生記録base=46.72 -> 815点
    expect(getCell().textContent).toContain("815");
  });

  it("ユーザーが手動で区分を選んだ後は、prop が変化しても手動選択値を維持する (以後追従しない)", async () => {
    const user = userEvent.setup();
    const view = renderWithLocale([buildBestTime({ time: 50.0, pool_type: 0 })], {
      gender: 0,
      ageCategory: "highSchool",
    });
    await user.click(getToggle());
    await user.selectOptions(getMetricSelect(), "age");
    expect(selectValue(getAgeCategorySelect())).toBe("highSchool");

    // ユーザーが手動で juniorHigh へ変更
    await user.selectOptions(getAgeCategorySelect(), "juniorHigh");
    expect(selectValue(getAgeCategorySelect())).toBe("juniorHigh");
    expect(getCell().textContent).toContain("904");

    // prop側 (呼び出し元の自動判定結果) が別の値に変わっても、手動選択が優先されて維持される
    view.rerender(
      <NextIntlClientProvider locale="ja" messages={MESSAGES.ja}>
        <BestTimesTable
          bestTimes={[buildBestTime({ time: 50.0, pool_type: 0 })]}
          gender={0}
          ageCategory="university"
        />
      </NextIntlClientProvider>,
    );

    expect(selectValue(getAgeCategorySelect())).toBe("juniorHigh");
    expect(getCell().textContent).toContain("904");
    expect(getCell().textContent).not.toContain("815");
  });
});
