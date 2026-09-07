import type { BaseQueryParams, PageResult } from "@/api/common";

/**
 * 分頁列表頁通用狀態管理
 * 只管理請求、分頁資料和查詢引數，不處理勾選、彈窗、表單
 */
export function usePageTable<T, Q extends BaseQueryParams = BaseQueryParams>(
  options: UsePageTableOptions<T, Q>
): UsePageTableReturn<T, Q> {
  const { initialParams, request, onBeforeReset } = options;

  const loading = ref(false);
  const list = ref<T[]>([]) as Ref<T[]>;
  const total = ref(0);
  const params = reactive({ ...initialParams }) as Q;

  /**
   * 拉取當前查詢引數對應的分頁資料
   * 只負責請求和回填，不處理彈窗、路由或訊息提示
   */
  async function fetchData(): Promise<void> {
    loading.value = true;
    try {
      const data = await request(params);
      list.value = data.list ?? [];
      total.value = data.total ?? 0;
    } finally {
      loading.value = false;
    }
  }

  /**
   * 回到第一頁並查詢
   */
  function handleQuery(): void {
    params.pageNum = 1;
    fetchData();
  }

  /**
   * 恢復初始查詢引數
   * 保持響應式引用不變，不觸發查詢
   */
  function resetParams(): void {
    Object.assign(params, initialParams);
  }

  /**
   * 恢復初始查詢引數並重新查詢
   */
  function handleResetQuery(): void {
    onBeforeReset?.();
    resetParams();
    fetchData();
  }

  return {
    loading,
    list,
    total,
    params,
    fetchData,
    handleQuery,
    handleResetQuery,
    resetParams,
  };
}

export interface UsePageTableOptions<T, Q extends BaseQueryParams> {
  // 初始查詢引數，同時作為重置基準
  initialParams: Q;
  // 分頁請求函式
  request: (params: Q) => Promise<PageResult<T>>;
  // 重置查詢前的回撥
  // 常用於同步重置搜尋表單欄位
  onBeforeReset?: () => void;
}

export interface UsePageTableReturn<T, Q extends BaseQueryParams> {
  // 載入狀態
  loading: Ref<boolean>;
  // 當前頁資料列表
  list: Ref<T[]>;
  // 資料總條數
  total: Ref<number>;
  // 當前查詢引數
  params: Q;
  // 拉取分頁資料
  fetchData: () => Promise<void>;
  // 回到第一頁並查詢
  handleQuery: () => void;
  // 恢復初始引數並重新查詢
  handleResetQuery: () => void;
  // 恢復初始引數但不觸發查詢
  resetParams: () => void;
}
