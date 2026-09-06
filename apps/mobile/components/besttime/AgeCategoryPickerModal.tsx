import React from "react";
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { TFunction } from "i18next";
import { AGE_CATEGORY_ORDER, type AgeCategory } from "@apps/shared/utils/domesticRecords";
import { useSafeInsets } from "@/hooks/useSafeInsets";
import { getSafeFooterPadding } from "@/utils/safeFooterPadding";
import { SlideUpModal } from "@/components/ui/SlideUpModal";

/** 選択肢は「未設定」(null) + AGE_CATEGORY_ORDER (5区分)。 */
type AgeCategoryOption = AgeCategory | null;

const UNSET_KEY = "unset";

export interface AgeCategoryPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (category: AgeCategoryOption) => void;
  t: TFunction;
  /**
   * ageCategoryLabel/ageCategoryUnset/ageCategory.* を解決する i18n 名前空間
   * (例: "mypage.bestTimesTable" / "teams.memberDetail.bestTimesTable")。
   * マイページとメンバー詳細で文言が一部異なるため、呼び出し元が指定する。
   */
  messageNamespace: string;
  /** 選択肢 Pressable の testID プレフィックス。呼び出し元ごとに一意な値を渡すこと。 */
  testIDPrefix: string;
}

/**
 * 「区分記録基準」選択時の年齢区分ピッカー (未設定 + 学童/中学/高校/学生/一般の6択)。
 * `StylePickerModal.tsx` と同型の SlideUpModal ボトムシート。
 */
export const AgeCategoryPickerModal: React.FC<AgeCategoryPickerModalProps> = ({
  visible,
  onClose,
  onSelect,
  t,
  messageNamespace,
  testIDPrefix,
}) => {
  const insets = useSafeInsets();
  const options: AgeCategoryOption[] = [null, ...AGE_CATEGORY_ORDER];

  const labelFor = (option: AgeCategoryOption): string =>
    option === null
      ? t(`${messageNamespace}.ageCategoryUnset`)
      : t(`${messageNamespace}.ageCategory.${option}`);

  return (
    <SlideUpModal
      visible={visible}
      backdropAccessibilityLabel={t("common.close")}
      onClose={onClose}
      overlayColor="rgba(0, 0, 0, 0.4)"
      sheetStyle={[styles.modalSheet, { paddingBottom: getSafeFooterPadding(32, insets.bottom) }]}
    >
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>{t(`${messageNamespace}.ageCategoryLabel`)}</Text>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={t("common.close")}
        >
          <Feather name="x" size={20} color="#374151" />
        </Pressable>
      </View>
      <FlatList
        data={options}
        keyExtractor={(item) => item ?? UNSET_KEY}
        renderItem={({ item }) => {
          const label = labelFor(item);
          return (
            <Pressable
              testID={`${testIDPrefix}-${item ?? UNSET_KEY}`}
              style={({ pressed }) => [styles.modalItem, pressed && styles.modalItemPressed]}
              onPress={() => onSelect(item)}
              accessibilityRole="button"
              accessibilityLabel={label}
            >
              <Text style={styles.modalItemText}>{label}</Text>
            </Pressable>
          );
        }}
        showsVerticalScrollIndicator={false}
      />
    </SlideUpModal>
  );
};

const styles = StyleSheet.create({
  modalSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  modalItem: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalItemPressed: {
    backgroundColor: "#F0F9FF",
  },
  modalItemText: {
    fontSize: 15,
    color: "#111827",
  },
});
