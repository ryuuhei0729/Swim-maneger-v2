// =============================================================================
// BestTimesTable.compareMetric.test.tsx (apps/mobile/components/profile)
// =============================================================================
// QA Sprint Contract 検証: 比較指標ピッカー (世界記録基準/日本記録基準/区分記録基準) mobile版。
// web 側で Critical を出した「年齢区分の3値設計」の回帰テストを主眼に置く。
//
// Sprint Contract 検証観点:
//   [D8]            初期選択は常に「世界記録基準」(WA)
//   [3VALUE-A/B]    ユーザー未操作なら prop 追従 / 手動選択後は prop 変化を無視して維持
//                    (2方向。(a)だけだと「常にpropを見る」実装でも通ってしまう)
//   [METRIC-SWITCH] 3指標の切替でセルの点数が実際に変わる
//   [BIRTHDAY-UNSET] birthday未設定(ageCategory null/undefined) → 区分「未設定」・セル「—」
//   [GENDER-UNDEF]  gender undefined → どの指標でもセルは「—」
//   [D7]            WAポイントモード OFF→ON しても比較指標の選択は維持される
//   [INFO-3LINES]   iアイコンのポップアップ本文は改行区切りの3行
//   [D2-JA]         ja ロケール (デフォルトのグローバルモック) では比較指標セグメントが描画される
//                    (非ja で非表示になることの検証は BestTimesTable.compareMetric.en.test.tsx が
//                    別ファイルで担当する。vitest.setup.ts のグローバル react-i18next モックは
//                    i18n.language を "ja" に固定しているため、このファイル内では非ja分岐に
//                    到達できない)
//
// トートロジー防止メモ: 542/594/613/627/680/867 は node -e で
//   floor(1000*(B/T)^3) を独立に計算したハードコード値であり、waPoints.ts/domesticRecords.ts や
//   本コンポーネントの実装を呼び出して生成していない。542 は既存テスト
//   (BestTimesTable.test.tsx の V-GEN-01/02) と同じ入力 (SCM 100m自由形, gender=0, T=54.97) を
//   再利用しているため、既存の WA 単体テストとも整合する。
//   計算内訳 (base time, node -e で算出):
//     WA (0_0_Fr_100=44.84)              → floor(1000*(44.84/54.97)^3) = 542
//     日本記録/general (0_0_Fr_100=46.22) → floor(1000*(46.22/54.97)^3) = 594
//     学生/university (0_0_Fr_100=46.72)  → floor(1000*(46.72/54.97)^3) = 613
//     高校/highSchool (0_0_Fr_100=47.07)  → floor(1000*(47.07/54.97)^3) = 627
//     中学/juniorHigh (0_0_Fr_100=48.35)  → floor(1000*(48.35/54.97)^3) = 680
//     学童/elementary (0_0_Fr_100=52.42)  → floor(1000*(52.42/54.97)^3) = 867
// =============================================================================

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import type { BestTime } from "@apps/shared/types/ui";
import { BestTimesTable } from "../BestTimesTable";

// testID は react-native の慣習で Pressable に渡すと、このリポジトリの DOM モックでは
// (Testing Library 標準の `data-testid` ではなく) 生の `testid` 属性としてそのまま転記される
// (`components/ui/__tests__/WaPointsInfoTooltip.test.tsx` の既存コメント・実装と同じ理由)。
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
    id: `cmp-rec-${idCounter}`,
    time: 30.0,
    created_at: "2025-01-01T00:00:00.000Z",
    pool_type: 0,
    is_relaying: false,
    ...overrides,
  } as BestTime;
};

const FR100 = { name_jp: "100m自由形", distance: 100 };

describe("BestTimesTable (profile) - 比較指標ピッカー: 初期選択とロケール分岐", () => {
  it("[D8] 初期選択は世界記録基準(WA)。指標を何も操作していない状態で542(WA基準)が出て594/613は出ない", () => {
    const bestTimes = [buildBestTime({ time: 54.97, style: FR100 })];
    render(<BestTimesTable bestTimes={bestTimes} gender={0} isWaPointsMode={true} />);

    fireEvent.click(screen.getByText("ALL"));

    expect(screen.getByText("542")).toBeTruthy();
    expect(screen.queryByText("594")).toBeNull();
    expect(screen.queryByText("613")).toBeNull();
  });

  it("[D2-JA] jaロケール(デフォルトモック)では比較指標セグメント・iアイコンが描画される", () => {
    const bestTimes = [buildBestTime({ time: 54.97, style: FR100 })];
    const { container } = render(
      <BestTimesTable bestTimes={bestTimes} gender={0} isWaPointsMode={true} />,
    );

    expect(queryByRawTestId(container, "best-times-compare-metric-segment")).not.toBeNull();
    expect(queryByRawTestId(container, "best-times-compare-metric-wa")).not.toBeNull();
    expect(queryByRawTestId(container, "best-times-compare-metric-nr")).not.toBeNull();
    expect(queryByRawTestId(container, "best-times-compare-metric-age")).not.toBeNull();
    expect(queryByRawTestId(container, "best-times-compare-metric-info")).not.toBeNull();
  });

  it("[NO-PICKER-NO-WAMODE] isWaPointsMode=falseのときは比較指標セグメント自体が描画されない", () => {
    const bestTimes = [buildBestTime({ time: 54.97, style: FR100 })];
    const { container } = render(
      <BestTimesTable bestTimes={bestTimes} gender={0} isWaPointsMode={false} />,
    );

    expect(queryByRawTestId(container, "best-times-compare-metric-segment")).toBeNull();
  });
});

describe("BestTimesTable (profile) - 比較指標ピッカー: 指標切替でセルの点数が変わる", () => {
  it("[METRIC-SWITCH] wa→nr→ageの切替で542→594→613(university)と点数が変わる", () => {
    const bestTimes = [buildBestTime({ time: 54.97, style: FR100 })];
    const { container } = render(
      <BestTimesTable
        bestTimes={bestTimes}
        gender={0}
        isWaPointsMode={true}
        ageCategory="university"
      />,
    );
    fireEvent.click(screen.getByText("ALL"));

    // 初期状態はWA
    expect(screen.getByText("542")).toBeTruthy();

    fireEvent.click(getByRawTestId(container, "best-times-compare-metric-nr"));
    expect(screen.getByText("594")).toBeTruthy();
    expect(screen.queryByText("542")).toBeNull();

    fireEvent.click(getByRawTestId(container, "best-times-compare-metric-age"));
    expect(screen.getByText("613")).toBeTruthy();
    expect(screen.queryByText("594")).toBeNull();
    expect(screen.queryByText("542")).toBeNull();
  });

  it("[AGE-CATEGORY-MODAL] 区分記録基準選択時のみ年齢区分ボタンが現れ、モーダルで区分を選ぶと点数が変わる", () => {
    const bestTimes = [buildBestTime({ time: 54.97, style: FR100 })];
    const { container } = render(
      <BestTimesTable bestTimes={bestTimes} gender={0} isWaPointsMode={true} ageCategory={null} />,
    );
    fireEvent.click(screen.getByText("ALL"));

    // wa/nr選択中は年齢区分ボタンが出ない
    expect(queryByRawTestId(container, "best-times-age-category-button")).toBeNull();

    fireEvent.click(getByRawTestId(container, "best-times-compare-metric-age"));
    expect(queryByRawTestId(container, "best-times-age-category-button")).not.toBeNull();
    // ageCategory=null (未設定) なので「—」でセルは埋まらない
    expect(screen.queryByText("613")).toBeNull();
    expect(screen.queryByText("680")).toBeNull();

    fireEvent.click(getByRawTestId(container, "best-times-age-category-button"));
    fireEvent.click(getByRawTestId(container, "best-times-age-category-option-juniorHigh"));

    expect(screen.getByText("680")).toBeTruthy();
    expect(screen.queryByText("613")).toBeNull();
  });
});

describe("BestTimesTable (profile) - 比較指標ピッカー: 3値設計 (年齢区分の自動追従/手動上書き)", () => {
  it("[3VALUE-A] ユーザーが年齢区分を未操作なら、ageCategory propの変化(null→university)に追従する", () => {
    const bestTimes = [buildBestTime({ time: 54.97, style: FR100 })];
    const { container, rerender } = render(
      <BestTimesTable bestTimes={bestTimes} gender={0} isWaPointsMode={true} ageCategory={null} />,
    );
    fireEvent.click(screen.getByText("ALL"));
    fireEvent.click(getByRawTestId(container, "best-times-compare-metric-age"));

    // 区分「未設定」表示・セルは「—」
    expect(getByRawTestId(container, "best-times-age-category-button").textContent).toContain(
      "未設定",
    );
    expect(screen.queryByText("613")).toBeNull();

    // 呼び出し元 (MyPageScreen) が非同期でプロフィールを読み込み、birthdayから解決した
    // "university" を渡してきたケースを模す。ユーザーはまだ年齢区分ピッカーを操作していない。
    rerender(
      <BestTimesTable
        bestTimes={bestTimes}
        gender={0}
        isWaPointsMode={true}
        ageCategory="university"
      />,
    );

    expect(getByRawTestId(container, "best-times-age-category-button").textContent).toContain(
      "学生",
    );
    expect(screen.getByText("613")).toBeTruthy();
  });

  it("[3VALUE-B] ユーザーが年齢区分を手動選択した後は、ageCategory propが変化しても手動選択が維持される", () => {
    const bestTimes = [buildBestTime({ time: 54.97, style: FR100 })];
    const { container, rerender } = render(
      <BestTimesTable bestTimes={bestTimes} gender={0} isWaPointsMode={true} ageCategory={null} />,
    );
    fireEvent.click(screen.getByText("ALL"));
    fireEvent.click(getByRawTestId(container, "best-times-compare-metric-age"));

    // ユーザーが明示的に「高校」を選ぶ
    fireEvent.click(getByRawTestId(container, "best-times-age-category-button"));
    fireEvent.click(getByRawTestId(container, "best-times-age-category-option-highSchool"));

    expect(getByRawTestId(container, "best-times-age-category-button").textContent).toContain(
      "高校",
    );
    expect(screen.getByText("627")).toBeTruthy();

    // 呼び出し元が後から (例: プロフィール再取得) ageCategory="university" を渡してきても、
    // ユーザーが既に手動選択済みなので追従してはならない。
    rerender(
      <BestTimesTable
        bestTimes={bestTimes}
        gender={0}
        isWaPointsMode={true}
        ageCategory="university"
      />,
    );

    expect(getByRawTestId(container, "best-times-age-category-button").textContent).toContain(
      "高校",
    );
    expect(screen.getByText("627")).toBeTruthy();
    expect(screen.queryByText("613")).toBeNull();
  });

  it("[3VALUE-B2] 手動で「未設定」を選んだ場合も、ageCategory propの変化を無視して「未設定」のままになる", () => {
    // (a)だけの検証では「常にpropを見る」実装でも「未操作→追従」は通ってしまう。
    // ユーザーが明示的に「未設定」を選んだ後にpropが university に変わっても
    // 追従してはならないことまで確認して初めて3値設計 (undefined/null/AgeCategory) の
    // 検証になる (2値設計 `useState(ageCategory ?? null)` だと、この観点自体は通ってしまう
    // ため、3VALUE-A との対でこそ意味を持つ)。
    const bestTimes = [buildBestTime({ time: 54.97, style: FR100 })];
    const { container, rerender } = render(
      <BestTimesTable
        bestTimes={bestTimes}
        gender={0}
        isWaPointsMode={true}
        ageCategory="university"
      />,
    );
    fireEvent.click(screen.getByText("ALL"));
    fireEvent.click(getByRawTestId(container, "best-times-compare-metric-age"));
    expect(screen.getByText("613")).toBeTruthy();

    fireEvent.click(getByRawTestId(container, "best-times-age-category-button"));
    fireEvent.click(getByRawTestId(container, "best-times-age-category-option-unset"));

    expect(getByRawTestId(container, "best-times-age-category-button").textContent).toContain(
      "未設定",
    );
    expect(screen.queryByText("613")).toBeNull();

    rerender(
      <BestTimesTable bestTimes={bestTimes} gender={0} isWaPointsMode={true} ageCategory={null} />,
    );

    expect(getByRawTestId(container, "best-times-age-category-button").textContent).toContain(
      "未設定",
    );
    expect(screen.queryByText("613")).toBeNull();
  });
});

describe("BestTimesTable (profile) - 比較指標ピッカー: 境界値・異常系", () => {
  it("[BIRTHDAY-UNSET] ageCategoryがundefined(呼び出し元が渡さない)のときも区分「未設定」・セル「—」", () => {
    const bestTimes = [buildBestTime({ time: 54.97, style: FR100 })];
    const { container } = render(
      <BestTimesTable bestTimes={bestTimes} gender={0} isWaPointsMode={true} />,
    );
    fireEvent.click(screen.getByText("ALL"));
    fireEvent.click(getByRawTestId(container, "best-times-compare-metric-age"));

    expect(getByRawTestId(container, "best-times-age-category-button").textContent).toContain(
      "未設定",
    );
    expect(screen.queryByText("613")).toBeNull();
    expect(screen.queryByText("594")).toBeNull();
    expect(screen.getAllByText("—").length).toBeGreaterThan(0);
  });

  it("[GENDER-UNDEF] genderがundefinedのとき、nr/ageどちらの指標に切り替えてもセルは「—」のまま", () => {
    const bestTimes = [buildBestTime({ time: 54.97, style: FR100 })];
    const { container } = render(
      <BestTimesTable
        bestTimes={bestTimes}
        gender={undefined}
        isWaPointsMode={true}
        ageCategory="university"
      />,
    );
    fireEvent.click(screen.getByText("ALL"));

    fireEvent.click(getByRawTestId(container, "best-times-compare-metric-nr"));
    expect(screen.queryByText("594")).toBeNull();
    expect(screen.getAllByText("—").length).toBeGreaterThan(0);

    fireEvent.click(getByRawTestId(container, "best-times-compare-metric-age"));
    expect(screen.queryByText("613")).toBeNull();
    expect(screen.getAllByText("—").length).toBeGreaterThan(0);
  });
});

describe("BestTimesTable (profile) - 比較指標ピッカー: WAポイントモードのOFF/ON", () => {
  it("[D7] WAポイントモードをOFF→ONしても比較指標の選択(nr)は維持される", () => {
    const bestTimes = [buildBestTime({ time: 54.97, style: FR100 })];
    const { container, rerender } = render(
      <BestTimesTable bestTimes={bestTimes} gender={0} isWaPointsMode={true} />,
    );
    fireEvent.click(screen.getByText("ALL"));
    fireEvent.click(getByRawTestId(container, "best-times-compare-metric-nr"));
    expect(screen.getByText("594")).toBeTruthy();

    // WAポイントモードOFF (親が isWaPointsMode=false を渡す。比較指標行自体が消える)
    rerender(<BestTimesTable bestTimes={bestTimes} gender={0} isWaPointsMode={false} />);
    expect(queryByRawTestId(container, "best-times-compare-metric-segment")).toBeNull();

    // 再度ON。選択(nr)が維持されているはず (wa=542にリセットされていない)
    rerender(<BestTimesTable bestTimes={bestTimes} gender={0} isWaPointsMode={true} />);
    fireEvent.click(screen.getByText("ALL"));
    expect(screen.getByText("594")).toBeTruthy();
    expect(screen.queryByText("542")).toBeNull();
  });
});

describe("BestTimesTable (profile) - 比較指標ピッカー: iアイコンの説明ポップアップ", () => {
  it("[INFO-3LINES] iアイコンをタップすると、改行区切りの3行の説明が表示される", () => {
    const bestTimes = [buildBestTime({ time: 54.97, style: FR100 })];
    const { container } = render(
      <BestTimesTable bestTimes={bestTimes} gender={0} isWaPointsMode={true} />,
    );

    fireEvent.click(getByRawTestId(container, "best-times-compare-metric-info"));

    // RN の <Text> は `\n` をそのまま改行として保持する (jsdomのCSS描画には依存しない)。
    // レイアウト計算 (getBoundingClientRect等) はjsdomで機能しないため使わず、
    // 実際のtextContentに含まれる `\n` の個数で行数を検証する。
    // compareMetric.wa は文言変更スプリントで「世界記録基準」→「WAポイント」に改称された
    // (nr/age は無変更)。1行目の冒頭ラベルもこれに追従する。
    const bodyEl = Array.from(container.querySelectorAll("span")).find((el) =>
      el.textContent?.includes("WAポイント："),
    );
    expect(bodyEl).toBeTruthy();
    const lines = bodyEl!.textContent!.split("\n");
    expect(lines).toHaveLength(3);
    expect(lines[0]).toContain("WAポイント");
    expect(lines[1]).toContain("日本記録基準");
    expect(lines[2]).toContain("区分記録基準");

    // タイトル (ariaLabel) も合わせて検証する (Reviewer指摘: 本文だけのassertだと
    // ariaLabelの渡し忘れ/取り違えを検知できない)。取り違え検出のポジション精査は
    // components/ui/__tests__/WaPointsInfoTooltip.test.tsx の [V-TOOLTIP-06] が単体で担当する。
    expect(screen.getByText("比較指標とは")).toBeTruthy();
  });
});
