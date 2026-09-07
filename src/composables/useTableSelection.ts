import { computed, ref } from "vue";

/**
 * 表格行選擇 Composable。
 * 提供統一的表格行選擇邏輯，包括選中 ID 管理和清空選擇。
 *
 * 規則：
 * - 不和分頁狀態合併。
 * - 不和彈窗狀態合併。
 * - 不和 API 請求合併。
 *
 * @template T 資料項型別，必須包含可選 `id` 屬性
 * @example
 * ```ts
 * const { selectedIds, hasSelection, handleSelectionChange } = useTableSelection<RoleItem>();
 * ```
 */
export function useTableSelection<T extends { id?: string | number }>() {
  // 選中的資料項 ID 列表。
  const selectedIds = ref<(string | number)[]>([]);
  // 選中數量。
  const selectedCount = computed(() => selectedIds.value.length);
  // 是否有選中項。
  const hasSelection = computed(() => selectedIds.value.length > 0);

  /**
   * 表格選中項變化處理。
   * @param selection 選中的行資料列表
   */
  function handleSelectionChange(selection: T[]): void {
    selectedIds.value = selection.flatMap((item) => (item.id ? [item.id] : []));
  }

  /**
   * 檢查指定 ID 是否被選中。
   * @param id 要檢查的 ID
   */
  function isSelected(id: string | number): boolean {
    return selectedIds.value.includes(id);
  }

  /** 清空選中 ID。注意：不會清空表格 UI 上的勾選狀態，需頁面自行呼叫表格例項的 `clearSelection`。 */
  function clearSelection(): void {
    selectedIds.value = [];
  }

  return {
    selectedIds,
    selectedCount,
    hasSelection,
    handleSelectionChange,
    clearSelection,
    isSelected,
  };
}
