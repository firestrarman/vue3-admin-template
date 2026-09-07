import request from "@/api/request";
import type { RoleQueryParams, RoleItem, RoleForm } from "./types";
import type { OptionItem, PageResult } from "@/api/common";

const ROLE_BASE_URL = "/api/v1/roles";

const RoleAPI = {
  // 獲取角色分頁資料
  getPage(queryParams?: RoleQueryParams) {
    return request<unknown, PageResult<RoleItem>>({
      url: `${ROLE_BASE_URL}`,
      method: "get",
      params: queryParams,
    });
  },
  // 獲取角色下拉資料來源
  getOptions() {
    return request<unknown, OptionItem[]>({ url: `${ROLE_BASE_URL}/options`, method: "get" });
  },
  // 獲取角色的選單ID集合
  getRoleMenuIds(roleId: string) {
    return request<unknown, string[]>({
      url: `${ROLE_BASE_URL}/${roleId}/menu-ids`,
      method: "get",
    });
  },
  // 分配選單權限
  updateRoleMenus(roleId: string, data: number[]) {
    return request({ url: `${ROLE_BASE_URL}/${roleId}/menus`, method: "put", data });
  },
  // 獲取角色表單資料
  getFormData(id: string) {
    return request<unknown, RoleForm>({ url: `${ROLE_BASE_URL}/${id}/form`, method: "get" });
  },
  // 新增角色
  create(data: RoleForm) {
    return request({ url: `${ROLE_BASE_URL}`, method: "post", data });
  },
  // 更新角色
  update(id: string, data: RoleForm) {
    return request({ url: `${ROLE_BASE_URL}/${id}`, method: "put", data });
  },
  // 批次刪除角色，多個以英文逗號(,)分割
  deleteByIds(ids: string) {
    return request({ url: `${ROLE_BASE_URL}/${ids}`, method: "delete" });
  },
};

export default RoleAPI;

// 重匯出型別
export * from "./types";
