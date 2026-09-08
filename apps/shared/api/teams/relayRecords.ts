// =============================================================================
// チームAPI - relayRecords (リレーのチーム記録の書き込み)
// =============================================================================
// `relay_records` / `relay_record_legs` を差し替える**唯一の実装元**。
// web (`.../records/_client/RecordClient.tsx`) と
// mobile (`apps/mobile/screens/TeamRecordBulkFormScreen.tsx`) の両方が呼ぶ。
//
// なぜ shared に集約するのか:
//   当初は web / mobile がそれぞれ `replaceRelayRecords` を持っており、
//   コメント・空白を除いた有意行95行が完全一致していた (差は pool_type の引数化と
//   キャストの2点だけ)。本スプリントは `relayEvents.ts` の完全複製を
//   「片方だけ更新されて静かに壊れる」理由で統合しており、
//   **insert → delete の順序・巻き戻し・「全成功時のみ削除」という今回いちばん
//   壊れると痛い部分**が統合されていないのは一貫しない。
//
// 読み取り (ランキング) は `./relayRankings.ts` (SECURITY DEFINER RPC 経由)。
// =============================================================================

import { SupabaseClient } from "@supabase/supabase-js";
import type { RelayRecord, RelayRecordLeg } from "../../types";
import { fromRelayEventId } from "../../utils/relayEvents";
import type { RelaySavePlan } from "../../utils/relayRecordSave";

/**
 * 差し替えの対象範囲。
 *
 * この API は **(team_id, competition_id) スコープの行を丸ごと置き換える**。
 * 呼び出し元の記録入力画面が同じスコープの `records` を delete + insert で
 * 置き換えるため、リレー側も同じ操作の一部として同じスコープを持つ。
 * 自然キー (種類 + 距離 + 泳者集合) まで狭めると、フォームからリレー種目を
 * 削除したときに古い `relay_records` 行が孤児として残り、`records` が消えた後も
 * ランキングに出続ける。
 */
export interface RelayRecordReplaceScope {
  teamId: string;
  /**
   * 大会 id。**nullable にしないこと。**
   *
   * `relay_records.competition_id` は DB では NULL 許容だが、**アプリ側に
   * `competition_id = NULL` のリレー記録を作る経路を持たない** (あの null 許容は
   * 「大会に紐づかないリレー記録を直接入力する」機能のための予約。根拠は
   * `../../types/relayRecord.ts` の `competitionId` の docstring)。
   * ここを `string | null` に緩めると、その経路がこのモジュールから生まれる。
   *
   * これは**ランキングの年度注意書きを出さない根拠でもある** —
   * `utils/rankingEventAxis.ts` の `shouldShowFiscalYearNote` はリレーで
   * 注意書きを出さないが、その前提が「`competition_id = NULL` の行が存在しない」
   * ことである。緩めると前提が崩れて注意書きが必要になる。
   *
   * `apps/shared/__tests__/api/relayRecordCompetitionRequired.test.ts` が
   * `string | null` への緩和を **tsc で**止めている。
   *
   * ⚠️ **この pin の限界**: 守れるのは「既存経路が緩む」ケースだけ。
   * **まったく新しい API モジュールが `competition_id = NULL` で insert する経路は
   * 捕まらない。** そちらの道案内は `types/relayRecord.ts` の `competitionId`
   * docstring が担う (あそこに「予約を実装するときに一緒に戻すもの」を列挙してある)。
   */
  competitionId: string;
  /**
   * 大会の水路 (`competitions.pool_type`)。DB が NOT NULL なので `??` は不要。
   * 0/1 以外の異常値なら `relay_records_pool_type_check` が insert を落とす
   * (静かに片方の水路へ寄せない)。
   */
  poolType: number;
}

export interface RelayRecordReplaceResult {
  /**
   * 1件でも失敗したか。呼び出し元はこれで保存全体のエラー扱いを決める。
   *
   * ⚠️ **読まれないフィールドを増やさないこと。** 以前ここに `createdCount`
   * (作成できた本数) があったが、web も mobile も `failed` しか取り出さず
   * 「書かれるだけで読まれない値」になっていた。表示やログに使うなら
   * その実装と同じスプリントで足すこと。
   */
  failed: boolean;
}

/**
 * `relay_records` に insert する列 (camelCase)。
 *
 * **PM 確定の契約 `types/relayRecord.ts` から `Pick` で導出する。** こうしないと
 * 契約型が「実装から一度も参照されない飾り」になり、制約ハーネスとして機能しない。
 * 除外しているのは DB が採番・既定値で埋める列:
 *   - `id` / `createdAt`: DB 側の DEFAULT
 *   - `createdBy`: DB 側の `DEFAULT auth.uid()`。クライアントは送らない
 *     (クライアントの認証 state に依存させない)
 *   - `legs`: 子テーブル `relay_record_legs` へ別 insert
 *
 * `note` は **契約型にも DB にも存在しない** (非 NULL を書く経路が1つも無かったため、
 * migration の列・契約型のフィールド・自然キー照合の機構をまとめて削除した)。
 * 将来メモを持たせるなら、列・入力 UI・再保存時の引き継ぎ規則を同じスプリントで
 * 揃えて入れること。
 */
type RelayRecordInsertFields = Pick<
  RelayRecord,
  | "teamId"
  | "competitionId"
  | "relayKind"
  | "legDistance"
  | "legCount"
  | "poolType"
  | "genderCategory"
  | "totalTime"
>;

/**
 * `relay_record_legs` に insert する列 (camelCase)。
 * `id` / `createdAt` は DB 側の DEFAULT なので持たない。
 */
type RelayRecordLegInsertFields = Pick<
  RelayRecordLeg,
  "legIndex" | "userId" | "styleId" | "legTime" | "reactionTime" | "recordId"
>;

/** camelCase → snake_case。列名の写像はこの2関数に閉じる。 */
function toRelayRecordRow(fields: RelayRecordInsertFields) {
  return {
    team_id: fields.teamId,
    competition_id: fields.competitionId,
    relay_kind: fields.relayKind,
    leg_distance: fields.legDistance,
    leg_count: fields.legCount,
    pool_type: fields.poolType,
    gender_category: fields.genderCategory,
    total_time: fields.totalTime,
  };
}

function toRelayRecordLegRow(relayRecordId: string, fields: RelayRecordLegInsertFields) {
  return {
    relay_record_id: relayRecordId,
    leg_index: fields.legIndex,
    user_id: fields.userId,
    style_id: fields.styleId,
    leg_time: fields.legTime,
    reaction_time: fields.reactionTime,
    record_id: fields.recordId,
  };
}

export class TeamRelayRecordsAPI {
  constructor(private supabase: SupabaseClient) {}

  /**
   * (team_id, competition_id) スコープのリレー記録を差し替える。
   *
   * 【なぜ upsert ではないか】
   * `id` を含まない upsert は自然キー側の一意制約に依存して別行を壊した前科が
   * あるため使わない。**新しい行を insert してから、事前に取得した古い行を
   * 明示的な id リストで delete する。**
   * 逆順 (delete → insert) にすると insert 失敗で記録が完全に消える。
   * この順序なら insert が失敗した時点で delete を行わないので、
   * 「何も残らない」状態にはならない。
   *
   * 【古い行を消す条件】
   * **全ての計画が書けたときだけ**消す。1本でも insert に失敗していたら
   * 古い行を残す: 失敗した1本のぶんは新しい行が無いので、消すとその記録が
   * 完全に失われる。残した場合は同じリレーが2行見える (重複) が、次回の保存で
   * 両方が「古い行」として消えるため自然に解消する。
   * **データが消えるより重複が残る方を選ぶ。**
   *
   * @param plans レグが1件以上ある計画のみを渡すこと (空の計画は書かない)
   * @param insertedRecordIds `records` の insert 結果。`RelaySaveLegPlan.validRecordIndex`
   *   と同じ添字で並んだ `records.id`。insert に失敗した位置は null
   *   (その位置の `record_id` は null になるが、リレー記録としての行は残す)
   * @returns `failed` が true なら呼び出し元は保存全体をエラー扱いにする。
   *   生の `PostgrestError` は throw せず console にのみ出す (テーブル名・
   *   ポリシー名を含みうるため、ユーザー向け文言は呼び出し元が持つ)
   */
  async replace(
    scope: RelayRecordReplaceScope,
    plans: readonly RelaySavePlan[],
    insertedRecordIds: ReadonlyArray<string | null>,
  ): Promise<RelayRecordReplaceResult> {
    // 差し替え前の行の id を取得する。今 insert する行を巻き込まずに
    // 古い行だけを消すために必要 (`.eq("team_id", ...)` のような条件 delete に
    // すると、この呼び出しで書いた行も消える)。
    const { data: existingRows, error: fetchError } = await this.supabase
      .from("relay_records")
      .select("id")
      .eq("team_id", scope.teamId)
      .eq("competition_id", scope.competitionId);

    if (fetchError) {
      // 生の PostgrestError.message はテーブル名等を含みうるため文字列に埋め込まない
      console.error("既存のリレー記録取得エラー:", fetchError);
      return { failed: true };
    }

    const staleIds = ((existingRows ?? []) as Array<{ id: string }>).map((row) => row.id);

    let failed = false;

    for (const plan of plans) {
      // relay_event_id は DB に持たないので、種類と1レグ距離に分解して書く
      // (shared の relayEvents.ts が唯一の定義元で、DB CHECK に写して
      //  三重管理にしない)。
      const { kind, legDistance } = fromRelayEventId(plan.relayEventId);

      const recordFields: RelayRecordInsertFields = {
        teamId: scope.teamId,
        competitionId: scope.competitionId,
        relayKind: kind,
        legDistance,
        legCount: plan.legCount,
        poolType: scope.poolType,
        genderCategory: plan.genderCategory,
        totalTime: plan.totalTime,
      };

      const { data: newRelay, error: relayError } = await this.supabase
        .from("relay_records")
        .insert(toRelayRecordRow(recordFields))
        .select("id")
        .single();

      if (relayError || !newRelay) {
        console.error("リレー記録作成エラー:", relayError);
        failed = true;
        // この1本は書けなかったので、古い行も残す (下の delete が走らない)
        continue;
      }

      const legRows = plan.legs.map((leg) => {
        const legFields: RelayRecordLegInsertFields = {
          legIndex: leg.legIndex,
          userId: leg.userId,
          styleId: leg.styleId,
          legTime: leg.legTime,
          reactionTime: leg.reactionTime,
          // 対応する records 行の id。insert に失敗した位置は null のままで、
          // リレー記録としての行 (タイム) は残す。
          recordId: insertedRecordIds[leg.validRecordIndex] ?? null,
        };
        return toRelayRecordLegRow(newRelay.id, legFields);
      });

      const { error: legError } = await this.supabase.from("relay_record_legs").insert(legRows);

      if (legError) {
        console.error("リレーレグ作成エラー:", legError);
        failed = true;
        // レグ無しの親が残るとランキングにラップの無い行が出るので、
        // 今 insert した親を巻き戻す (古い行はそのまま残す)。
        const { error: rollbackError } = await this.supabase
          .from("relay_records")
          .delete()
          .eq("id", newRelay.id);
        if (rollbackError) {
          console.error("リレー記録の巻き戻しエラー:", rollbackError);
        }
        continue;
      }

    }

    // 保存対象のリレーが1本も無かった場合 (フォームからリレー種目を全部消した等) も
    // 古い行は消す。残すと `records` が消えた後もランキングに出続ける。
    if (!failed && staleIds.length > 0) {
      const { error: deleteError } = await this.supabase
        .from("relay_records")
        .delete()
        .in("id", staleIds);
      if (deleteError) {
        console.error("古いリレー記録の削除エラー:", deleteError);
        failed = true;
      }
    }

    return { failed };
  }
}
