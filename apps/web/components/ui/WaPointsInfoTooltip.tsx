"use client";

import React, { useId, useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

interface WaPointsInfoTooltipProps {
  /** info アイコンボタンの data-testid (呼び出し元ごとに一意な値を渡すこと) */
  buttonTestId: string;
  /** デスクトップ用ツールチップ (hover/focus 対象) の data-testid (省略可) */
  tooltipTestId?: string;
  /**
   * aria-label の上書き (省略可)。未指定なら `teams.waPointsCompare.infoAriaLabel`
   * にフォールバックする (後方互換。既存2呼び出し元はこのフォールバックに依存している)。
   */
  ariaLabel?: string;
  /**
   * ツールチップ本文の上書き (省略可)。未指定なら `teams.waPointsCompare.infoTooltip`
   * にフォールバックする (後方互換。既存2呼び出し元はこのフォールバックに依存している)。
   */
  tooltipText?: string;
}

/**
 * WAポイントの算出方法を説明する info アイコン + ツールチップ。
 * デスクトップは hover / キーボードフォーカスで表示、モバイルはタップでトグルする。
 *
 * 文言は `teams.waPointsCompare` 名前空間 (infoAriaLabel / infoTooltip) を単一ソースとして
 * マイページ・メンバー詳細モーダルからも共用する。namespace 名がマイページ文脈と一致しないが、
 * 5言語分の文言を複製する保守負債より単一ソースを優先する PM 判断による。
 *
 * 呼び出し元は `relative` な (`relative inline-block` 等) ラッパー内で、
 * 説明対象のボタンと並べてこのコンポーネントを配置すること (絶対配置の基準はそのラッパー)。
 */
export const WaPointsInfoTooltip: React.FC<WaPointsInfoTooltipProps> = ({
  buttonTestId,
  tooltipTestId,
  ariaLabel,
  tooltipText,
}) => {
  const t = useTranslations("teams.waPointsCompare");
  const [showInfo, setShowInfo] = useState(false);
  // インスタンスごとに一意な id (同一ページに複数配置されても aria-describedby の参照先が衝突しない)
  const reactId = useId();
  const tooltipId = `wa-points-info-tooltip-${reactId}`;
  const resolvedAriaLabel = ariaLabel ?? t("infoAriaLabel");
  const resolvedTooltipText = tooltipText ?? t("infoTooltip");

  // モバイル用タップツールチップがビューポート外にはみ出さないよう水平方向にクランプする。
  const mobileTooltipRef = useRef<HTMLDivElement>(null);
  const [shiftX, setShiftX] = useState(0);

  useLayoutEffect(() => {
    if (!showInfo) {
      setShiftX(0);
      return;
    }
    const el = mobileTooltipRef.current;
    if (!el) return;

    const clamp = () => {
      const rect = el.getBoundingClientRect();
      // jsdom などレイアウトが無い環境では全ての値が 0 になる。
      // その場合はシフトを計算しない (テスト環境で不要な transform が付くのを防ぐ)。
      if (rect.width === 0) {
        setShiftX(0);
        return;
      }
      const margin = 8;
      const vw = window.innerWidth;
      setShiftX((prevShift) => {
        // 現在の transform を除いた素の位置で判定するため、shiftX を差し引いて基準位置を求める
        // (差し引かないと、シフト後の rect を基準に再計算してしまい振動する)
        const baseLeft = rect.left - prevShift;
        const baseRight = rect.right - prevShift;
        if (baseLeft < margin) {
          return margin - baseLeft;
        }
        if (baseRight > vw - margin) {
          return vw - margin - baseRight;
        }
        return 0;
      });
    };

    clamp();
    window.addEventListener("resize", clamp);
    return () => window.removeEventListener("resize", clamp);
  }, [showInfo]);

  return (
    <div className="absolute -top-1.5 -right-1.5 group/wainfo">
      <button
        type="button"
        data-testid={buttonTestId}
        aria-label={resolvedAriaLabel}
        aria-describedby={tooltipId}
        onClick={() => setShowInfo((v) => !v)}
        onBlur={() => setShowInfo(false)}
        className="sm:pointer-events-none flex items-center justify-center h-4 w-4 rounded-full bg-white text-gray-400 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      >
        <InformationCircleIcon className="h-4 w-4" />
      </button>

      {/*
        デスクトップ: hover またはキーボードフォーカスで表示（Tab フォーカスでも出る）。
        aria-describedby はこの要素の id を常に参照する (常時マウントされているため参照が
        ダングリングにならない)。W3C の accessible description 計算では aria-describedby から
        直接参照された要素は hidden (display:none) でも除外されないため、CSS で非表示の間も
        スクリーンリーダーはこの説明文を読み上げる。
      */}
      <div
        id={tooltipId}
        role="tooltip"
        data-testid={tooltipTestId}
        className="hidden group-hover/wainfo:sm:block group-focus-within/wainfo:sm:block absolute z-20 top-full right-0 mt-1.5 w-64 max-w-[calc(100vw-2rem)] p-2.5 bg-gray-900 text-white text-xs rounded-md shadow-lg leading-relaxed whitespace-pre-line"
      >
        {resolvedTooltipText}
      </div>

      {/* モバイル: タップトグル */}
      {showInfo && (
        <div
          ref={mobileTooltipRef}
          role="tooltip"
          className="sm:hidden absolute z-20 top-full right-0 mt-1.5 w-64 max-w-[calc(100vw-2rem)] p-2.5 bg-gray-900 text-white text-xs rounded-md shadow-lg leading-relaxed whitespace-pre-line"
          style={{ transform: shiftX ? `translateX(${shiftX}px)` : undefined }}
        >
          {resolvedTooltipText}
        </div>
      )}
    </div>
  );
};
