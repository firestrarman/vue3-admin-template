import request from "@/api/request";
import type { NoticeQueryParams, NoticeForm, NoticeItem, NoticeDetail } from "./types";
import type { PageResult } from "@/api/common";

const NOTICE_BASE_URL = "/api/v1/notices";

const NoticeAPI = {
  // 獲取通知公告分頁資料
  getPage(queryParams?: NoticeQueryParams) {
    return request<unknown, PageResult<NoticeItem>>({
      url: `${NOTICE_BASE_URL}`,
      method: "get",
      params: queryParams,
    });
  },
  // 獲取通知公告表單資料
  getFormData(id: string) {
    return request<unknown, NoticeForm>({ url: `${NOTICE_BASE_URL}/${id}/form`, method: "get" });
  },
  // 新增通知公告
  create(data: NoticeForm) {
    return request({ url: `${NOTICE_BASE_URL}`, method: "post", data });
  },
  // 更新通知公告
  update(id: string, data: NoticeForm) {
    return request({ url: `${NOTICE_BASE_URL}/${id}`, method: "put", data });
  },
  // 批次刪除通知公告，多個以英文逗號(,)分割
  deleteByIds(ids: string) {
    return request({ url: `${NOTICE_BASE_URL}/${ids}`, method: "delete" });
  },
  // 釋出通知
  publish(id: string) {
    return request({ url: `${NOTICE_BASE_URL}/${id}/publish`, method: "put" });
  },
  // 撤回通知
  revoke(id: string) {
    return request({ url: `${NOTICE_BASE_URL}/${id}/revoke`, method: "put" });
  },
  // 檢視通知
  getDetail(id: string) {
    return request<unknown, NoticeDetail>({
      url: `${NOTICE_BASE_URL}/${id}/detail`,
      method: "get",
    });
  },
  // 全部已讀
  readAll() {
    return request({ url: `${NOTICE_BASE_URL}/read-all`, method: "put" });
  },
  // 獲取我的通知分頁列表
  getMyNoticePage(queryParams?: NoticeQueryParams) {
    return request<unknown, PageResult<NoticeItem>>({
      url: `${NOTICE_BASE_URL}/my`,
      method: "get",
      params: queryParams,
    });
  },
};

export default NoticeAPI;

// 重匯出型別
export * from "./types";
