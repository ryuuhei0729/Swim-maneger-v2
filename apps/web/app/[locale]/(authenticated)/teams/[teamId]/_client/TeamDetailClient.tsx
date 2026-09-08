"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts";
import TeamTabs from "@/components/team/TeamTabs";
import MemberDetailModal from "@/components/team/MemberDetailModal";

// タブコンテンツは一度に1つしか表示されないため遅延読み込み
const TeamMemberManagement = dynamic(() => import("@/components/team/TeamMemberManagement"));
const TeamPractices = dynamic(() => import("@/components/team/TeamPractices"));
const TeamCompetitions = dynamic(() => import("@/components/team/TeamCompetitions"));
const TeamRankings = dynamic(() => import("@/components/team/rankings/TeamRankings"));
const MyMonthlyAttendance = dynamic(() => import("@/components/team/MyMonthlyAttendance"));
import type { MemberDetail } from "@/components/team/MemberDetailModal";
import { isTeamTabType } from "@/components/team/TeamTabs";
import { TeamMembership, TeamWithMembers } from "@swim-hub/shared/types";
import { useTeamDetailStore } from "@/stores/form/teamDetailStore";
import { ClipboardDocumentIcon, CheckIcon } from "@heroicons/react/24/outline";

interface TeamDetailClientProps {
  teamId: string;
  initialTeam: TeamWithMembers | null;
  initialMembership: TeamMembership | null;
  initialTab?: string;
}

/**
 * チーム詳細ページのインタラクティブ部分を担当するClient Component
 */
export default function TeamDetailClient({
  teamId,
  initialTeam,
  initialMembership,
  initialTab,
}: TeamDetailClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("teams");
  const tCommon = useTranslations("common");
  const { user } = useAuth();
  const [isCopied, setIsCopied] = useState(false);

  const {
    team,
    loading,
    activeTab,
    selectedMember,
    isMemberModalOpen,
    setTeam,
    setMembership,
    setLoading,
    setActiveTab,
    openMemberModal,
    closeMemberModal,
  } = useTeamDetailStore();

  // サーバー側から取得したデータをストアに設定
  useEffect(() => {
    setTeam(initialTeam);
    setMembership(initialMembership);
    setLoading(false);
  }, [initialTeam, initialMembership, setTeam, setMembership, setLoading]);

  // URLパラメータからタブを取得。
  //
  // ref の目的は「同じ URL 値を再適用しないこと」。ユーザーがタブをクリックした後に
  // 同じ値の effect が再実行されると、選んだタブが URL の値へ引き戻されてしまう。
  //
  // ⚠️ 観測した値は **空 (クエリなし) も含めて必ず記録する**。空を記録せず早期 return すると
  // 「?tab=V → クエリなしのリンク → 戻るで ?tab=V」の3手目で ref がまだ "V" のままになり、
  // URL は V を指しているのに画面が別タブのままになる (同一ルートのクエリ変化では
  // アンマウントしないため ref も初期化されない)。
  //
  // 許可判定は TeamTabs.tsx の定義配列から導出した isTeamTabType が唯一の定義元。
  //
  // ⚠️ 残債務「タブクリックで URL を更新する」を実装する場合は必ず `router.replace(?tab=X)`
  // を使うこと。`history.pushState` は Next の canonicalUrl を更新しないため
  // `useSearchParams()` がその変化を一切見ず、URL と表示タブが乖離する。
  const appliedTabParamRef = useRef<string | null>(null);
  useEffect(() => {
    const tabParam = searchParams.get("tab") || initialTab || null;
    if (appliedTabParamRef.current === tabParam) return;
    appliedTabParamRef.current = tabParam;
    if (tabParam && isTeamTabType(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams, initialTab, setActiveTab]);

  // 表示用のデータ（ストアから取得、なければ初期データを使用）
  const displayTeam = team || initialTeam;

  if (loading && !displayTeam) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!displayTeam) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t("detail.notFound.title")}</h1>
          <p className="text-gray-600">{t("detail.notFound.description")}</p>
        </div>
      </div>
    );
  }

  const handleMemberClick = (member: MemberDetail) => {
    openMemberModal(member);
  };

  const handleCloseMemberModal = () => {
    closeMemberModal();
  };

  // アクティブなタブのコンテンツをレンダリング（閲覧専用）
  const renderTabContent = () => {
    switch (activeTab) {
      case "members":
        return (
          <TeamMemberManagement
            teamId={teamId}
            currentUserId={user?.id || ""}
            isCurrentUserAdmin={false}
            onMembershipChange={() => {
              // メンバー情報を再読み込み
              router.refresh();
            }}
            onMemberClick={handleMemberClick}
          />
        );
      case "practices":
        return <TeamPractices teamId={teamId} isAdmin={false} />;
      case "competitions":
        return <TeamCompetitions teamId={teamId} isAdmin={false} />;
      case "rankings":
        return <TeamRankings teamId={teamId} />;
      case "attendance":
        return <MyMonthlyAttendance teamId={teamId} />;
      default:
        return null;
    }
  };

  return (
    <div>
      {/* チームヘッダー */}
      <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 wrap-break-word">
              {displayTeam.name}
            </h1>
            {displayTeam.description && (
              <p className="text-xs sm:text-sm text-gray-600 wrap-break-word">
                {displayTeam.description}
              </p>
            )}
          </div>
          {displayTeam.invite_code && (
            <div className="w-full md:w-auto md:shrink-0">
              <div className="bg-gray-50 rounded-lg p-2 sm:p-2.5 w-full md:w-auto">
                <div className="flex flex-row items-center gap-2">
                  <label className="block text-xs font-medium text-gray-700 whitespace-nowrap">
                    {t("detail.inviteCodeLabel")}
                  </label>
                  <input
                    type="text"
                    value={displayTeam.invite_code}
                    readOnly
                    className="flex-1 px-2 py-1 bg-white border border-gray-300 rounded-md shadow-sm text-xs font-mono font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(displayTeam.invite_code || "");
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2000);
                    }}
                    className="inline-flex items-center justify-center px-2 py-1 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    title={tCommon("copy")}
                  >
                    {isCopied ? (
                      <CheckIcon className="h-3 w-3 text-green-600" />
                    ) : (
                      <ClipboardDocumentIcon className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="mt-4">
        <TeamTabs activeTab={activeTab} onTabChange={setActiveTab} isAdmin={false} />
      </div>

      {/* タブコンテンツ */}
      <div className="bg-white rounded-lg shadow">{renderTabContent()}</div>

      {/* メンバー詳細モーダル */}
      <MemberDetailModal
        isOpen={isMemberModalOpen}
        onClose={handleCloseMemberModal}
        member={selectedMember}
        teamId={teamId}
        currentUserId={user?.id || ""}
        isCurrentUserAdmin={false}
        onMembershipChange={() => {
          // メンバー情報を再読み込み
          router.refresh();
        }}
      />
    </div>
  );
}
