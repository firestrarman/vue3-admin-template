import request from "@/api/request";
import type { MenuQueryParams, MenuItem, MenuForm, RouteItem } from "./types";
import type { OptionItem } from "@/api/common";

const MENU_BASE_URL = "/api/v1/menus";

const MenuAPI = {
  // 獲取當前使用者的路由列表
  getRoutes() {
    return request<unknown, RouteItem[]>({ url: `${MENU_BASE_URL}/routes`, method: "get" });
  },
  // 獲取選單樹形列表
  getList(queryParams: MenuQueryParams) {
    return request<unknown, MenuItem[]>({
      url: `${MENU_BASE_URL}`,
      method: "get",
      params: queryParams,
    });
  },
  // 獲取選單下拉資料來源
  getOptions(onlyParent?: boolean) {
    return request<unknown, OptionItem[]>({
      url: `${MENU_BASE_URL}/options`,
      method: "get",
      params: { onlyParent },
    });
  },
  // 獲取選單表單資料
  getFormData(id: string) {
    return request<unknown, MenuForm>({ url: `${MENU_BASE_URL}/${id}/form`, method: "get" });
  },
  // 新增選單
  create(data: MenuForm) {
    return request({ url: `${MENU_BASE_URL}`, method: "post", data });
  },
  // 修改選單
  update(id: string, data: MenuForm) {
    return request({ url: `${MENU_BASE_URL}/${id}`, method: "put", data });
  },
  // 刪除選單
  deleteById(id: string) {
    return request({ url: `${MENU_BASE_URL}/${id}`, method: "delete" });
  },
};

export default MenuAPI;

// 重匯出型別
export * from "./types";
