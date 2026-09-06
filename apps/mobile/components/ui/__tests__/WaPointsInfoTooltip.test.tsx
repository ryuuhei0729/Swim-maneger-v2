// =============================================================================
// WaPointsInfoTooltip.test.tsx
// =============================================================================
// mobile UI フィードバック #4: WAポイント info を「インラインパネル→中央ポップアップ」に
// 変更 (`WaPointsInfoTooltip` が `CenterModal` を使うようになった)。
//
// この変更には見た目だけでなく操作上の挙動変化が伴う点に注意:
// 旧実装はinfo アイコンをタップするたびに開閉をトグルしていたが (`setShowInfo(prev => !prev)`)、
// 新実装は常に `setVisible(true)` になる (再タップしても閉じない。閉じるのは
// 背面タップ/閉じるボタンのみ)。これは仕様変更であり実装漏れではないため、
// [V-TOOLTIP-05] として明示的に固定する。
//
// Sprint Contract 検証観点:
//   [V-TOOLTIP-01] info アイコンをタップするとポップアップが開き、説明文が表示される
//   [V-TOOLTIP-02] 閉じるボタン (×) で閉じる
//   [V-TOOLTIP-03] 背面タップで閉じる
//   [V-TOOLTIP-04] props (testID/style) は変更前と同一であること (testID がアイコンの
//     Pressable に配線されていること)
//   [V-TOOLTIP-05] 開いた状態で info アイコンを再タップしても閉じない (トグル仕様の廃止)
// =============================================================================

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const table: Record<string, string> = {
        "teams.waPointsCompare.infoAriaLabel": "WAポイントについて",
        "teams.waPointsCompare.infoTooltip": "WAポイントの説明文",
        "common.close": "閉じる",
      };
      return table[key] ?? key;
    },
  }),
}));

import { WaPointsInfoTooltip } from "../WaPointsInfoTooltip";

// `testID` は react-native の慣習で `Pressable` に渡すと、このリポジトリの DOM モックでは
// (Testing Library 標準の `data-testid` ではなく) 生の `testid` 属性としてそのまま
// 転記される (`data-testid` は Feather アイコンモック自身が付与するもので別物)。
// そのため `screen.getByTestId` ではなく属性セレクタで直接取得する。
function getByRawTestId(container: HTMLElement, testId: string): HTMLElement {
  const el = container.querySelector(`[testid="${testId}"]`);
  if (!el) throw new Error(`testid="${testId}" の要素が見つかりません`);
  return el as HTMLElement;
}

describe("WaPointsInfoTooltip", () => {
  it("[V-TOOLTIP-01] info アイコンをタップするとポップアップが開き、説明文が表示される", () => {
    const { container } = render(<WaPointsInfoTooltip testID="wa-info-icon" />);

    expect(screen.queryByText("WAポイントの説明文")).toBeNull();
    fireEvent.click(getByRawTestId(container, "wa-info-icon"));
    expect(screen.getByText("WAポイントの説明文")).toBeTruthy();
  });

  it("[V-TOOLTIP-02] 閉じるボタン (×) でポップアップが閉じる", async () => {
    const { container } = render(<WaPointsInfoTooltip testID="wa-info-icon" />);
    fireEvent.click(getByRawTestId(container, "wa-info-icon"));
    expect(screen.getByText("WAポイントの説明文")).toBeTruthy();

    fireEvent.click(screen.getByTestId("icon-x").closest("button")!);
    // CenterModal は閉じるとき即座に unmount せず、閉じアニメーション分(160ms)の
    // setTimeout を待ってから unmount する。タップ直後の DOM 残存だけでは判定できない。
    await waitFor(() => {
      expect(screen.queryByText("WAポイントの説明文")).toBeNull();
    });
  });

  it("[V-TOOLTIP-03] 背面タップでポップアップが閉じる", async () => {
    const { container } = render(<WaPointsInfoTooltip testID="wa-info-icon" />);
    fireEvent.click(getByRawTestId(container, "wa-info-icon"));
    expect(screen.getByText("WAポイントの説明文")).toBeTruthy();

    // button の並び: [0]=info アイコン自身, [1]=CenterModal の背面タップ用 Pressable,
    // [2]=CenterModal 内蔵の閉じるボタン (×)。
    const backdrop = screen.getAllByRole("button")[1]!; // アイコン+背面タップ+閉じるボタンの3つが常に描画される設計
    fireEvent.click(backdrop);
    await waitFor(() => {
      expect(screen.queryByText("WAポイントの説明文")).toBeNull();
    });
  });

  it("[V-TOOLTIP-04] testID が info アイコンの Pressable にそのまま配線される (props 無変更)", () => {
    const { container } = render(
      <WaPointsInfoTooltip testID="member-detail-best-times-wa-info" />,
    );
    expect(getByRawTestId(container, "member-detail-best-times-wa-info")).toBeTruthy();
  });

  it("[V-TOOLTIP-05] 開いた状態で info アイコンを再タップしても閉じない (トグル仕様の廃止)", async () => {
    const { container } = render(<WaPointsInfoTooltip testID="wa-info-icon" />);
    const icon = getByRawTestId(container, "wa-info-icon");

    fireEvent.click(icon);
    expect(screen.getByText("WAポイントの説明文")).toBeTruthy();

    fireEvent.click(icon);
    // 旧実装 (トグル) ならここで閉じるアニメーションが走り、CenterModal の閉じアニメーション分
    // (160ms) の待機後に unmount されて消えるはずだが、新実装は常に visible=true にするだけ
    // (何も変化しない) なので、待っても表示され続ける。
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(screen.getByText("WAポイントの説明文")).toBeTruthy();
  });

  // ---------------------------------------------------------------------------
  // 追記分 (Reviewer指摘 [Medium] への対応)
  // ---------------------------------------------------------------------------
  // 既存 [V-TOOLTIP-01]〜[V-TOOLTIP-05] は `ariaLabel`/`tooltipText` prop を渡すケース
  // 自体を検証していなかった (省略時のデフォルト文言のみ)。呼び出し元 (比較指標ピッカーの
  // 説明アイコン) がこの2 propを取り違えて渡す、または `ariaLabel` を渡し忘れて
  // デフォルトのWA用文言にフォールバックするリグレッションを検知できるようにする。
  //
  // タイトル/本文の位置特定について: `WaPointsInfoTooltip` 自体はタイトル/本文の要素に
  // testID を持たない (production コードは変更しない方針のため付与もしない)。
  // `CenterModal` の children として
  // `<Text style={styles.title}>{resolvedAriaLabel}</Text>` →
  // `<Text style={styles.body}>{resolvedTooltipText}</Text>` の順で描画される
  // (`WaPointsInfoTooltip.tsx` 実装のJSX順序) ことを利用し、`data-testid` を持たない
  // (= Featherアイコンモック由来ではない) <span> を出現順で [title, body] として取得する。
  // これにより「ariaLabelとtooltipTextの中身をそっくり入れ替えて渡す」ミューテーションを
  // 単なる「両方の文字列がどこかに存在する」だけの緩いアサーションでは検出できない問題を回避する
  // (位置を指定してテキスト完全一致を確認する)。
  function getTitleAndBodySpans(container: HTMLElement): { titleEl?: Element; bodyEl?: Element } {
    const contentSpans = Array.from(container.querySelectorAll("span")).filter(
      (el) => !el.hasAttribute("data-testid"),
    );
    return { titleEl: contentSpans[0], bodyEl: contentSpans[1] };
  }

  it("[V-TOOLTIP-06] ariaLabelとtooltipTextの両方を渡した場合、取り違えなくタイトル=ariaLabel・本文=tooltipTextに描画される", () => {
    const { container } = render(
      <WaPointsInfoTooltip
        testID="wa-info-icon"
        ariaLabel="タイトル用文言X(比較指標とは)"
        tooltipText="本文用文言Y(世界記録基準の説明)"
      />,
    );
    fireEvent.click(getByRawTestId(container, "wa-info-icon"));

    const { titleEl, bodyEl } = getTitleAndBodySpans(container);
    expect(titleEl).toBeTruthy();
    expect(bodyEl).toBeTruthy();
    expect(titleEl!.textContent).toBe("タイトル用文言X(比較指標とは)");
    expect(bodyEl!.textContent).toBe("本文用文言Y(世界記録基準の説明)");
    // 取り違え検出: ariaLabel/tooltipTextの中身が入れ替わっていれば、上の完全一致assertが
    // 先に落ちるはずだが、念のため逆方向も明示的に否定しておく。
    expect(titleEl!.textContent).not.toBe("本文用文言Y(世界記録基準の説明)");
    expect(bodyEl!.textContent).not.toBe("タイトル用文言X(比較指標とは)");
  });

  it("[V-TOOLTIP-07] ariaLabelがPressableのaccessibilityLabelにも反映される", () => {
    const { container } = render(
      <WaPointsInfoTooltip testID="wa-info-icon" ariaLabel="カスタムaria文言" tooltipText="本文" />,
    );
    const icon = getByRawTestId(container, "wa-info-icon");
    // accessibilityLabel は react-native の慣習で、このリポジトリのDOMモックでは
    // 小文字化された `accessibilitylabel` 属性としてそのまま転記される
    // (本ファイル冒頭の `getByRawTestId` と同じ理由)。
    expect(icon.getAttribute("accessibilitylabel")).toBe("カスタムaria文言");
  });

  it("[V-TOOLTIP-08] ariaLabel/tooltipTextを省略した場合は既存の teams.waPointsCompare.* にフォールバックする(後方互換)", () => {
    const { container } = render(<WaPointsInfoTooltip testID="wa-info-icon" />);
    const icon = getByRawTestId(container, "wa-info-icon");
    expect(icon.getAttribute("accessibilitylabel")).toBe("WAポイントについて");

    fireEvent.click(icon);
    const { titleEl, bodyEl } = getTitleAndBodySpans(container);
    expect(titleEl!.textContent).toBe("WAポイントについて");
    expect(bodyEl!.textContent).toBe("WAポイントの説明文");
  });
});
