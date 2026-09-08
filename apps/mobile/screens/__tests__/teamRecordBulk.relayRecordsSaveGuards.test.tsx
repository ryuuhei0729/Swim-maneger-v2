// =============================================================================
// teamRecordBulk.relayRecordsSaveGuards.test.tsx
// relay_records / relay_record_legs 差し替えの防波堤 (mobile)
// (QA Sprint Contract Phase B / 第3弾)
// =============================================================================
//
// web の `apps/web/__tests__/records/relayRecordsSaveGuards.test.tsx` と**対**。
// 両 Developer が確定させた保存の方針は web / mobile で同一なので、
// 同じ観点を mobile 側でも独立に固定する
// (片方だけ壊れる形の退行が SwimHub で最も起きやすい)。
//
// Sprint Contract 検証観点:
//   [V-MG-01] `records` が1件でも失敗したら relay 側は **1行も書かない**
//   [V-MG-02] 古い行の delete は **全計画が成功したときだけ**
//   [V-MG-03] 差し替えは **明示 id の delete**。team_id / competition_id の
//             条件 delete にしていない。差し替え前の取得は両方でサーバー絞り込み
//   [V-MG-04] レグ insert 失敗で **今 insert した親を巻き戻す**
//   [V-MG-05] `created_by` をクライアントから送らない
//   [V-MG-06] 個人種目だけの保存は relay_records に一切触れない
//   [V-MG-07] レグの leg_index / leg_time / record_id / user_id が正しい
//   [V-MG-08] 性別不明のメンバーは `mixed` に寄せる (`?? 0` で男性にしない)
//   [V-MG-09] 総合タイム・水路が web と同じ値になる (パリティ) /
//             古い行は自然キーに関係なくすべて削除対象
//
// ⚠️ `relay_records.note` は PM 裁定で列そのものが廃止された (非 NULL を書く
//    経路がどこにも無かった)。これに伴い shared の `findExistingRelayForNote` も
//    削除され、insert payload は 8 列 → 7 列になった。
//    「note を引き継ぐ」観点は機構ごと存在しないので pin し直さない。
//
// トートロジー防止:
//   期待値 (総合 112.10 / 区間 27.50, 28.70, 28.30, 27.60) は fixture から
//   手で計算したリテラル。プロダクションの calcCumulativeTimes を呼ばない。

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react-native", async () => {
  const actual = await vi.importActual<Record<string, unknown>>("react-native");
  return {
    ...actual,
    KeyboardAvoidingView: actual.View,
  };
});

const mocks = vi.hoisted(() => {
  /** styles.id 2 = 50m 自由形 → 4 レグ揃うと relay_4x50_free が検出される */
  const style = {
    id: 2,
    name_jp: "50m自由形",
    name: "50m Freestyle",
    style: "Fr",
    distance: 50,
  };

  const responses: Record<string, { data: unknown; error: unknown }> = {};
  const insertCalls: Array<{ table: string; payload: unknown }> = [];
  const deleteCalls: Array<{ table: string }> = [];
  /** 全操作の発生順 (insert → delete の順序を証明するのに使う) */
  const operations: Array<{ table: string; op: string }> = [];
  /**
   * `.eq()` の列名・値を発生順に記録する。
   * 🚨 引数を捨てるとサーバー絞り込みとクライアント filter を区別できない。
   */
  const eqCalls: Array<{ table: string; op: string | null; column: string; value: unknown }> = [];
  const inCalls: Array<{ table: string; op: string | null; column: string; values: unknown[] }> =
    [];
  const insertedIds: Record<string, string[]> = {};

  /** `insert().select("id").single()` が id を払い出すテーブル */
  const ID_ISSUING_TABLES = new Set(["records", "relay_records"]);

  function makeSupabase() {
    const idSeq: Record<string, number> = {};

    const issueId = (table: string): string => {
      idSeq[table] = (idSeq[table] ?? 0) + 1;
      const id = `fake-${table}-id-${idSeq[table]}`;
      (insertedIds[table] ??= []).push(id);
      return id;
    };

    return {
      from: (table: string) => {
        let op: string | null = null;
        const builder: {
          select: (..._a: unknown[]) => typeof builder;
          eq: (column: string, value: unknown) => typeof builder;
          order: (..._a: unknown[]) => typeof builder;
          in: (column: string, values: unknown[]) => typeof builder;
          insert: (payload: unknown) => typeof builder;
          delete: (..._a: unknown[]) => typeof builder;
          single: () => Promise<{ data: unknown; error: unknown }>;
          then: (resolve: (v: { data: unknown; error: unknown }) => void) => void;
        } = {
          select: (..._a) => {
            if (!op) {
              op = "select";
              operations.push({ table, op });
            }
            return builder;
          },
          eq: (column: string, value: unknown) => {
            eqCalls.push({ table, op, column, value });
            return builder;
          },
          order: () => builder,
          in: (column: string, values: unknown[]) => {
            inCalls.push({ table, op, column, values: [...values] });
            return builder;
          },
          insert: (payload: unknown) => {
            if (!op) {
              op = "insert";
              operations.push({ table, op });
            }
            insertCalls.push({ table, payload });
            return builder;
          },
          delete: (..._a) => {
            if (!op) {
              op = "delete";
              operations.push({ table, op });
            }
            deleteCalls.push({ table });
            return builder;
          },
          single: () => {
            // テストが明示した応答を最優先する (失敗注入をここで潰さない)
            const override = responses[`${op}:${table}`];
            if (override) return Promise.resolve(override);
            if (op === "insert" && ID_ISSUING_TABLES.has(table)) {
              return Promise.resolve({ data: { id: issueId(table) }, error: null });
            }
            return Promise.resolve({ data: null, error: null });
          },
          then: (resolve) => resolve(responses[`${op}:${table}`] ?? { data: null, error: null }),
        };
        return builder;
      },
    };
  }

  /**
   * メンバー一覧 (テストごとに差し替える)。
   * 既定は 4 人全員 gender=0 → 性別区分は male。
   *
   * 「性別不明」の到達経路は **泳者がメンバー一覧に居ないこと** である
   * (記録が書かれた後にその泳者がチームを離れると `members` から消えるが
   *  `records.user_id` は残る)。`gender` を undefined にする経路ではない。
   */
  const teamMembers: Array<{
    user_id: string;
    role: string;
    users: { id: string; name: string; gender?: number };
  }> = [
    { user_id: "user-lead", role: "admin", users: { id: "user-lead", name: "リード", gender: 0 } },
    {
      user_id: "user-second",
      role: "user",
      users: { id: "user-second", name: "セカンド", gender: 0 },
    },
    { user_id: "user-third", role: "user", users: { id: "user-third", name: "サード", gender: 0 } },
    {
      user_id: "user-anchor",
      role: "user",
      users: { id: "user-anchor", name: "アンカー", gender: 0 },
    },
  ];

  return {
    style,
    responses,
    insertCalls,
    deleteCalls,
    operations,
    eqCalls,
    inCalls,
    insertedIds,
    teamMembers,
    supabase: makeSupabase(),
    routeParams: { competitionId: "comp-thrush", teamId: "team-thrush" },
    goBack: vi.fn(),
    navigate: vi.fn(),
    getStyles: vi.fn(),
    getAccessToken: vi.fn(async () => "test-access-token"),
  };
});

vi.mock("@react-navigation/native", () => ({
  useRoute: () => ({ params: mocks.routeParams }),
  useNavigation: () => ({ navigate: mocks.navigate, goBack: mocks.goBack }),
}));

vi.mock("@/contexts/AuthProvider", () => ({
  useAuth: () => ({
    supabase: mocks.supabase,
    subscription: null,
    user: { id: "user-lead" },
    getAccessToken: mocks.getAccessToken,
  }),
}));

vi.mock("@apps/shared/hooks/queries/teams", () => ({
  useTeamsQuery: () => ({
    members: mocks.teamMembers,
    isLoading: false,
  }),
}));

vi.mock("@apps/shared/api/styles", () => ({
  StyleAPI: class {
    getStyles = mocks.getStyles;
  },
}));

vi.mock("@/components/shared/VideoUploader", () => ({ VideoUploader: () => null }));
vi.mock("@/components/shared/PremiumBadge", () => ({ PremiumBadge: () => null }));
vi.mock("@/components/records/LapTimeDisplay", () => ({ LapTimeDisplay: () => null }));
vi.mock("@/components/teams/MemberSelectModal", () => ({ MemberSelectModal: () => null }));

import { Alert } from "react-native";
import { TeamRecordBulkFormScreen } from "../TeamRecordBulkFormScreen";

const createWrapper = (queryClient: QueryClient) => {
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}

/**
 * 区間タイム 27.50 / 28.70 / 28.30 / 27.60、総合 112.10 (手計算)。
 * is_relaying = [false, true, true, true] の 4 行連続 + style_id 2。
 */
const RELAY_LEG_TIMES = [27.5, 28.7, 28.3, 27.6] as const;
const RELAY_TOTAL_TIME = 112.1;
const RELAY_USER_IDS = ["user-lead", "user-second", "user-third", "user-anchor"] as const;

function relayRecordRows() {
  return RELAY_LEG_TIMES.map((time, index) => ({
    id: `existing-record-${index}`,
    user_id: RELAY_USER_IDS[index],
    style_id: 2,
    time,
    is_relaying: index !== 0,
    reaction_time: null,
    note: null,
    split_times: [],
    users: { id: RELAY_USER_IDS[index], name: `泳者${index}` },
  }));
}

/**
 * 差し替え前に存在する古い `relay_records` 行。
 * `TeamRelayRecordsAPI.replace()` は `select("id")` しか読まない
 * (note 列の廃止で自然キー照合が不要になった)。
 */
function existingRelayRows(ids: readonly string[] = ["stale-relay-row"]) {
  return ids.map((id) => ({ id }));
}

function resetMocks() {
  vi.clearAllMocks();
  mocks.insertCalls.length = 0;
  mocks.deleteCalls.length = 0;
  mocks.operations.length = 0;
  mocks.eqCalls.length = 0;
  mocks.inCalls.length = 0;
  for (const table of Object.keys(mocks.insertedIds)) delete mocks.insertedIds[table];
  for (const key of Object.keys(mocks.responses)) delete mocks.responses[key];

  mocks.getStyles.mockResolvedValue([mocks.style]);
  mocks.responses["select:competitions"] = {
    data: { id: "comp-thrush", title: "ツグミ記録会", pool_type: 0 },
    error: null,
  };
  mocks.responses["delete:records"] = { data: null, error: null };
}

async function renderAndSave() {
  const queryClient = makeQueryClient();
  render(<TeamRecordBulkFormScreen />, { wrapper: createWrapper(queryClient) });

  await waitFor(() => {
    expect(screen.getByText("記録を保存")).toBeDefined();
  });
  fireEvent.click(screen.getByText("記録を保存"));
}

const relayInserts = () => mocks.insertCalls.filter((call) => call.table === "relay_records");
const legInserts = () => mocks.insertCalls.filter((call) => call.table === "relay_record_legs");

// ---------------------------------------------------------------------------
// [V-MG-01]
//
// ミューテーション手順 (PM 用):
//   TeamRecordBulkFormScreen.tsx の `if (needsRelayWork && !hasError) {` を
//   `if (needsRelayWork) {` にすると、`records` が一部しか書けていない状態でも
//   総合タイムが書かれる。→ このブロックの 2 テストが赤になるはず。
// ---------------------------------------------------------------------------
describe("[V-MG-01] records が1件でも失敗したら relay 側を1行も書かない (mobile)", () => {
  beforeEach(() => {
    resetMocks();
    mocks.responses["select:records"] = { data: relayRecordRows(), error: null };
  });

  it("records の insert が失敗すると relay_records に insert も select もしない", async () => {
    mocks.responses["insert:records"] = {
      data: null,
      error: { message: "insert denied", code: "23505" },
    };

    await renderAndSave();

    // ⚠️ 「relay の insert が 0 件」を保存処理の途中で見ると、まだ到達していない
    //    だけで緑になる (ミューテーションを見逃す)。保存処理が hasError で
    //    終わり切ったこと (= Alert が出たこと) を先に待つ。
    await waitFor(() => expect(Alert.alert).toHaveBeenCalled());

    expect(mocks.insertCalls.filter((call) => call.table === "records")).toHaveLength(4);
    // 保存に失敗したので画面も戻らない
    expect(mocks.goBack).not.toHaveBeenCalled();

    expect(relayInserts()).toHaveLength(0);
    expect(legInserts()).toHaveLength(0);
    expect(mocks.operations.filter((op) => op.table === "relay_records")).toHaveLength(0);
  });

  it("すべて成功した場合は relay_records に 1 本だけ insert する (対照)", async () => {
    await renderAndSave();

    await waitFor(() => expect(mocks.goBack).toHaveBeenCalled());

    expect(relayInserts()).toHaveLength(1);
    expect(legInserts()).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// [V-MG-02]
//
// ミューテーション手順 (PM 用):
//   `if (!failed && existingForMatch.length > 0) {` を
//   `if (existingForMatch.length > 0) {` にすると、新しい行を書けていないのに
//   古い行を消す。→ このブロックの 1 本目が赤になるはず。
// ---------------------------------------------------------------------------
describe("[V-MG-02] 古い行の delete は全計画が成功したときだけ (mobile)", () => {
  beforeEach(() => {
    resetMocks();
    mocks.responses["select:records"] = { data: relayRecordRows(), error: null };
    mocks.responses["select:relay_records"] = { data: existingRelayRows(), error: null };
  });

  it("relay_records の insert が失敗したら古い行を delete しない", async () => {
    mocks.responses["insert:relay_records"] = {
      data: null,
      error: { message: "insert denied", code: "42501" },
    };

    await renderAndSave();

    // 保存処理が終わり切ってから見る (途中で見ると未到達なだけで緑になる)
    await waitFor(() => expect(Alert.alert).toHaveBeenCalled());

    expect(relayInserts()).toHaveLength(1);
    expect(mocks.inCalls.filter((call) => call.table === "relay_records")).toHaveLength(0);
    expect(mocks.deleteCalls.filter((call) => call.table === "relay_records")).toHaveLength(0);
  });

  it("すべて成功したら古い行を明示 id で delete する (対照)", async () => {
    await renderAndSave();

    await waitFor(() => expect(mocks.goBack).toHaveBeenCalled());

    expect(mocks.inCalls.filter((call) => call.table === "relay_records")).toEqual([
      { table: "relay_records", op: "delete", column: "id", values: ["stale-relay-row"] },
    ]);
  });
});

// ---------------------------------------------------------------------------
// [V-MG-03]
//
// ミューテーション手順 (PM 用):
//   古い行の delete を `.in("id", ...)` から
//   `.eq("team_id", teamId).eq("competition_id", competitionId)` に変えると
//   **今 insert した行も一緒に消える**。→ 下記 2 テストが赤になるはず。
// ---------------------------------------------------------------------------
describe("[V-MG-03] 差し替え順序と delete の条件 (mobile)", () => {
  beforeEach(() => {
    resetMocks();
    mocks.responses["select:records"] = { data: relayRecordRows(), error: null };
    mocks.responses["select:relay_records"] = { data: existingRelayRows(), error: null };
  });

  it("relay_records の操作順は select → insert → (レグ insert) → delete である", async () => {
    await renderAndSave();
    await waitFor(() => expect(mocks.goBack).toHaveBeenCalled());

    const relayOps = mocks.operations
      .filter((op) => op.table === "relay_records" || op.table === "relay_record_legs")
      .map((op) => `${op.op}:${op.table}`);

    expect(relayOps).toEqual([
      "select:relay_records",
      "insert:relay_records",
      "insert:relay_record_legs",
      "delete:relay_records",
    ]);
  });

  it("delete は明示 id で行い、team_id / competition_id の条件 delete にしない", async () => {
    await renderAndSave();
    await waitFor(() => expect(mocks.goBack).toHaveBeenCalled());

    const deleteFilters = mocks.eqCalls.filter(
      (call) => call.table === "relay_records" && call.op === "delete",
    );
    expect(deleteFilters.map((call) => call.column)).not.toContain("team_id");
    expect(deleteFilters.map((call) => call.column)).not.toContain("competition_id");

    // 今 insert した行の id は削除対象に入っていない
    const newRelayIds = mocks.insertedIds.relay_records ?? [];
    expect(newRelayIds).toHaveLength(1);
    const deletedIds = mocks.inCalls.find(
      (call) => call.table === "relay_records" && call.column === "id",
    )?.values;
    for (const newId of newRelayIds) {
      expect(deletedIds).not.toContain(newId);
    }
  });

  it("差し替え前の取得は team_id と competition_id の両方でサーバー絞り込みする", async () => {
    await renderAndSave();
    await waitFor(() => expect(mocks.goBack).toHaveBeenCalled());

    expect(
      mocks.eqCalls
        .filter((call) => call.table === "relay_records" && call.op === "select")
        .map((call) => [call.column, call.value]),
    ).toEqual([
      ["team_id", "team-thrush"],
      ["competition_id", "comp-thrush"],
    ]);
  });
});

// ---------------------------------------------------------------------------
// [V-MG-04]
//
// ミューテーション手順 (PM 用):
//   `if (legError) { ... }` から
//   `await supabase.from("relay_records").delete().eq("id", newRelay.id)` を
//   削除すると、レグの無い親が残る。→ 下記 1 本目が赤になるはず。
// ---------------------------------------------------------------------------
describe("[V-MG-04] レグ insert 失敗で親を巻き戻す (mobile)", () => {
  beforeEach(() => {
    resetMocks();
    mocks.responses["select:records"] = { data: relayRecordRows(), error: null };
  });

  it("relay_record_legs の insert が失敗したら今 insert した親を id 指定で delete する", async () => {
    mocks.responses["insert:relay_record_legs"] = {
      data: null,
      error: { message: "legs denied", code: "23503" },
    };

    await renderAndSave();

    await waitFor(() => expect(Alert.alert).toHaveBeenCalled());

    expect(legInserts()).toHaveLength(1);
    const newRelayIds = mocks.insertedIds.relay_records ?? [];
    expect(newRelayIds).toHaveLength(1);

    expect(
      mocks.eqCalls
        .filter((call) => call.table === "relay_records" && call.op === "delete")
        .map((call) => [call.column, call.value]),
    ).toEqual([["id", newRelayIds[0]]]);
  });

  it("レグ insert が成功したときは巻き戻しの delete を発行しない (対照)", async () => {
    await renderAndSave();
    await waitFor(() => expect(mocks.goBack).toHaveBeenCalled());

    expect(
      mocks.eqCalls.filter((call) => call.table === "relay_records" && call.op === "delete"),
    ).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// [V-MG-05] 〜 [V-MG-09]
// ---------------------------------------------------------------------------
describe("[V-MG-05] created_by をクライアントから送らない (mobile)", () => {
  beforeEach(() => {
    resetMocks();
    mocks.responses["select:records"] = { data: relayRecordRows(), error: null };
  });

  it("relay_records の insert payload に created_by が無い", async () => {
    await renderAndSave();
    await waitFor(() => expect(mocks.goBack).toHaveBeenCalled());

    const payload = relayInserts()[0]?.payload as Record<string, unknown>;
    expect(payload).toBeDefined();
    expect(Object.keys(payload)).not.toContain("created_by");
    expect(Object.keys(payload)).not.toContain("user_id");
  });

  it("insert payload が契約どおりの列だけを持つ (web と同一の形)", async () => {
    await renderAndSave();
    await waitFor(() => expect(mocks.goBack).toHaveBeenCalled());

    const payload = relayInserts()[0]?.payload as Record<string, unknown>;
    // note は PM 裁定で列そのものが廃止された。8 列 → 7 列
    expect(Object.keys(payload).sort()).toEqual(
      [
        "competition_id",
        "gender_category",
        "leg_count",
        "leg_distance",
        "pool_type",
        "relay_kind",
        "team_id",
        "total_time",
      ].sort(),
    );
    expect(Object.keys(payload)).not.toContain("note");
  });
});

describe("[V-MG-06] 個人種目だけの保存は relay_records に一切触れない (mobile)", () => {
  beforeEach(() => {
    resetMocks();
    mocks.responses["select:records"] = {
      data: [
        {
          id: "existing-record-solo",
          user_id: "user-lead",
          style_id: 2,
          time: 26.4,
          is_relaying: false,
          reaction_time: null,
          note: null,
          split_times: [],
          users: { id: "user-lead", name: "リード" },
        },
      ],
      error: null,
    };
  });

  it("is_relaying の記録が無い保存では relay_records を select も insert もしない", async () => {
    await renderAndSave();
    await waitFor(() => expect(mocks.goBack).toHaveBeenCalled());

    expect(mocks.insertCalls.filter((call) => call.table === "records")).toHaveLength(1);
    expect(mocks.operations.filter((op) => op.table === "relay_records")).toHaveLength(0);
    expect(mocks.operations.filter((op) => op.table === "relay_record_legs")).toHaveLength(0);
  });
});

describe("[V-MG-07] レグの payload (mobile)", () => {
  beforeEach(() => {
    resetMocks();
    mocks.responses["select:records"] = { data: relayRecordRows(), error: null };
  });

  it("leg_index は 0-based で 0..3、leg_time は区間タイム (通算ではない)", async () => {
    await renderAndSave();
    await waitFor(() => expect(mocks.goBack).toHaveBeenCalled());

    const legRows = legInserts()[0]?.payload as Array<Record<string, unknown>>;
    expect(legRows).toHaveLength(4);
    expect(legRows.map((row) => row.leg_index)).toEqual([0, 1, 2, 3]);

    // 通算 [27.50, 56.20, 84.50, 112.10] が入っていたら退行
    expect(legRows.map((row) => row.leg_time)).toEqual([27.5, 28.7, 28.3, 27.6]);
    expect(legRows.map((row) => row.leg_time)).not.toEqual([27.5, 56.2, 84.5, 112.1]);
  });

  it("record_id が今 insert した records の id を指す", async () => {
    await renderAndSave();
    await waitFor(() => expect(mocks.goBack).toHaveBeenCalled());

    const insertedRecordIds = mocks.insertedIds.records ?? [];
    expect(insertedRecordIds).toHaveLength(4);

    const legRows = legInserts()[0]?.payload as Array<Record<string, unknown>>;
    expect(legRows.map((row) => row.record_id)).toEqual(insertedRecordIds);
  });

  it("user_id は 4 レグそれぞれの泳者になる (第1泳者に潰れない)", async () => {
    await renderAndSave();
    await waitFor(() => expect(mocks.goBack).toHaveBeenCalled());

    const legRows = legInserts()[0]?.payload as Array<Record<string, unknown>>;
    expect(legRows.map((row) => row.user_id)).toEqual([...RELAY_USER_IDS]);
  });
});

describe("[V-MG-08] 性別区分の prefill (mobile)", () => {
  beforeEach(() => {
    resetMocks();
    mocks.responses["select:records"] = { data: relayRecordRows(), error: null };
  });

  it("メンバー一覧に居ない泳者を含む編成は mixed になる (?? 0 で男性に寄せない)", async () => {
    // 第4泳者 (user-anchor) を一覧から外す = チームを離れた後の状態
    const removed = mocks.teamMembers.pop();
    if (!removed) throw new Error("fixture が壊れている");

    try {
      await renderAndSave();
      await waitFor(() => expect(mocks.goBack).toHaveBeenCalled());

      const payload = relayInserts()[0]?.payload as Record<string, unknown>;
      expect(payload.gender_category).toBe("mixed");
      expect(payload.gender_category).not.toBe("male");
    } finally {
      mocks.teamMembers.push(removed);
    }
  });

  it("4 人全員 gender=0 なら male になる (対照。常に mixed ではない)", async () => {
    await renderAndSave();
    await waitFor(() => expect(mocks.goBack).toHaveBeenCalled());

    const payload = relayInserts()[0]?.payload as Record<string, unknown>;
    expect(payload.gender_category).toBe("male");
  });
});

describe("[V-MG-09] web とのパリティ (mobile)", () => {
  beforeEach(() => {
    resetMocks();
    mocks.responses["select:records"] = { data: relayRecordRows(), error: null };
    mocks.responses["select:relay_records"] = { data: existingRelayRows(), error: null };
  });

  it("relay_kind / leg_distance / leg_count / total_time / pool_type が web と同じ値になる", async () => {
    await renderAndSave();
    await waitFor(() => expect(mocks.goBack).toHaveBeenCalled());

    const payload = relayInserts()[0]?.payload as Record<string, unknown>;
    expect(payload.team_id).toBe("team-thrush");
    expect(payload.competition_id).toBe("comp-thrush");
    expect(payload.relay_kind).toBe("free");
    expect(payload.leg_distance).toBe(50);
    expect(payload.leg_count).toBe(4);
    // 大会の水路をそのまま使う (?? で片方に寄せていない)
    expect(payload.pool_type).toBe(0);
    expect(payload.total_time).toBe(RELAY_TOTAL_TIME);
  });

  it("種類・距離・泳者が違う古い行も削除対象に含まれる (孤児を残さない)", async () => {
    mocks.responses["select:relay_records"] = {
      data: existingRelayRows([
        "stale-medley-row",
        "stale-other-distance-row",
        "stale-other-squad-row",
      ]),
      error: null,
    };

    await renderAndSave();
    await waitFor(() => expect(mocks.goBack).toHaveBeenCalled());

    expect(mocks.inCalls.filter((call) => call.table === "relay_records")).toEqual([
      {
        table: "relay_records",
        op: "delete",
        column: "id",
        values: ["stale-medley-row", "stale-other-distance-row", "stale-other-squad-row"],
      },
    ]);
  });

  it("insert payload に note を送らない (DB に列が無いので送ると insert が落ちる)", async () => {
    await renderAndSave();
    await waitFor(() => expect(mocks.goBack).toHaveBeenCalled());

    const payload = relayInserts()[0]?.payload as Record<string, unknown>;
    expect(Object.keys(payload)).not.toContain("note");
  });
});
