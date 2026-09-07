import request from "@/api/request";
import type { DeptQueryParams, DeptItem, DeptForm } from "./types";
import type { OptionItem } from "@/api/common";

const DEPT_BASE_URL = "/api/v1/depts";

const DeptAPI = {
  // 獲取部門樹形列表
  getList(queryParams?: DeptQueryParams) {
    return request<unknown, DeptItem[]>({
      url: `${DEPT_BASE_URL}`,
      method: "get",
      params: queryParams,
    });
  },
  // 獲取部門下拉資料來源
  getOptions() {
    return request<unknown, OptionItem[]>({ url: `${DEPT_BASE_URL}/options`, method: "get" });
  },
  // 獲取部門表單資料
  getFormData(id: string) {
    return request<unknown, DeptForm>({ url: `${DEPT_BASE_URL}/${id}/form`, method: "get" });
  },
  // 新增部門
  create(data: DeptForm) {
    return request({ url: `${DEPT_BASE_URL}`, method: "post", data });
  },
  // 修改部門
  update(id: string, data: DeptForm) {
    return request({ url: `${DEPT_BASE_URL}/${id}`, method: "put", data });
  },
  // 批次刪除部門，多個以英文逗號(,)分割
  deleteByIds(ids: string) {
    return request({ url: `${DEPT_BASE_URL}/${ids}`, method: "delete" });
  },
};

export default DeptAPI;

// 重匯出型別
export * from "./types";
