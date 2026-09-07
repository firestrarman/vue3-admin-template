import { computed, onMounted, ref } from "vue";
import type { NoticeDetail, NoticeItem, NoticeQueryParams } from "@/api/system/notice";
import NoticeAPI from "@/api/system/notice";
import router from "@/router";

/** 下拉麵板每頁展示條數 */
const PAGE_SIZE = 5;

/** 通知讀取狀態：0=未讀，1=已讀 */
type NoticeStatus = 0 | 1;

/**
 * 通知下拉麵板的響應式資料與業務邏輯
 * 在元件掛載時拉取列表，解除安裝時無需額外清理
 */
export function useNotice() {
  /** 當前 Tab 下的通知列表（最多 PAGE_SIZE 條） */
  const list = ref<NoticeItem[]>([]);
  /** 未讀通知總數（紅點/角標數字） */
  const unreadTotal = ref(0);
  /** 當前啟用的 Tab：0=未讀，1=已讀 */
  const activeStatus = ref<NoticeStatus>(0);
  /** 檢視詳情時載入的完整通知資料 */
  const detail = ref<NoticeDetail | null>(null);
  /** 詳情彈窗可見性 */
  const dialogVisible = ref(false);
  /** 列表為空時的佔位文案，根據當前 Tab 切換 */
  const emptyText = computed(() => (activeStatus.value === 0 ? "暫無未讀訊息" : "暫無已讀訊息"));

  /**
   * 拉取通知分頁列表
   * 查詢未讀 Tab 時同步更新 unreadTotal
   */
  async function fetchList(params?: Partial<NoticeQueryParams>) {
    const query: NoticeQueryParams = {
      pageNum: 1,
      pageSize: PAGE_SIZE,
      isRead: activeStatus.value,
      ...params,
    };
    const page = await NoticeAPI.getMyNoticePage(query);
    list.value = page.list || [];

    if (query.isRead === 0) {
      unreadTotal.value = page.total ?? 0;
    }
  }

  /** 僅查詢未讀通知總數（不更新列表），用於切換到已讀 Tab 後重新整理角標 */
  async function fetchUnreadTotal() {
    const page = await NoticeAPI.getMyNoticePage({
      pageNum: 1,
      pageSize: 1,
      isRead: 0,
    });
    unreadTotal.value = page.total ?? 0;
  }

  /**
   * 切換未讀/已讀 Tab
   * 同一 Tab 重複點選不重複請求
   */
  async function switchStatus(status: NoticeStatus) {
    if (activeStatus.value === status) return;

    activeStatus.value = status;
    await fetchList();
  }

  /**
   * 重新整理資料
   * 未讀 Tab：重新整理列表即可；已讀 Tab：額外重新整理未讀總數以更新角標
   */
  async function refresh() {
    await Promise.all([
      fetchList(),
      activeStatus.value === 0 ? Promise.resolve() : fetchUnreadTotal(),
    ]);
  }

  /**
   * 點選單條通知檢視詳情
   * 1. 標記原列表項是否為未讀
   * 2. 拉取詳情並開啟彈窗
   * 3. 從當前列表中移除該項（下拉麵板內不再顯示）
   * 4. 若為未讀，本地角標 -1
   * 5. 重新整理資料與角標
   */
  async function read(id: string) {
    const item = list.value.find((notice: NoticeItem) => notice.id === id);
    const wasUnread = item?.isRead !== 1;

    detail.value = await NoticeAPI.getDetail(id);
    dialogVisible.value = true;

    const idx = list.value.findIndex((item: NoticeItem) => item.id === id);
    if (idx >= 0) list.value.splice(idx, 1);
    if (wasUnread && unreadTotal.value > 0) unreadTotal.value -= 1;

    await refresh();
  }

  /** 全部標為已讀：呼叫介面 + 清空本地未讀數 + 重新整理列表 */
  async function readAll() {
    if (unreadTotal.value <= 0) return;

    await NoticeAPI.readAll();
    unreadTotal.value = 0;
    if (activeStatus.value === 0) {
      list.value = [];
    } else {
      await fetchList();
    }
    ElMessage.success("已全部標記為已讀");
  }

  /** 跳轉到通知列表頁 */
  function goMore() {
    router.push({ name: "MyNotice" });
  }

  onMounted(() => {
    refresh();
  });

  return {
    list,
    unreadTotal,
    activeStatus,
    emptyText,
    detail,
    dialogVisible,
    fetchList,
    switchStatus,
    refresh,
    read,
    readAll,
    goMore,
  };
}
