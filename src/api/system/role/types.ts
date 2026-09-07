/**
 * Role 角色型別定義
 */

import type { BaseQueryParams } from "@/api/common";

/** 角色分頁查詢引數 */
export interface RoleQueryParams extends BaseQueryParams {
  // 搜尋關鍵字
  keywords?: string;
}

/** 角色分頁物件 */
export interface RoleItem {
  // 角色ID
  id?: string;
  // 角色編碼
  code?: string;
  // 角色名稱
  name?: string;
  // 排序
  sort?: number;
  // 角色狀態
  status?: number;
  // 資料權限(1-所有資料 2-部門及子部門資料 3-本部門資料 4-本人資料 5-自定義部門資料)
  dataScope?: number;
  // 資料權限標籤
  dataScopeLabel?: string;
  // 修改時間
  updateTime?: Date;
}

/** 角色表單物件 */
export interface RoleForm {
  // 角色ID
  id?: string;
  // 角色編碼
  code?: string;
  // 角色名稱
  name?: string;
  // 排序
  sort?: number;
  // 資料權限(1-所有資料 2-部門及子部門資料 3-本部門資料 4-本人資料 5-自定義部門資料)
  dataScope?: number;
  // 自定義資料權限部門ID列表(當dataScope=5時有效)
  deptIds?: string[];
  // 角色狀態
  status?: number;
  // 備註
  remark?: string;
}
