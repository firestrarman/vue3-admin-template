/**
 * Dept 部門型別定義
 */

/** 部門查詢引數 */
export interface DeptQueryParams {
  /** 搜尋關鍵字 */
  keywords?: string;
  /** 狀態 */
  status?: number;
}

/** 部門檢視物件 */
export interface DeptItem {
  /** 子部門 */
  children?: DeptItem[];
  /** 建立時間 */
  createTime?: Date;
  /** 部門ID */
  id?: string;
  /** 部門名稱 */
  name?: string;
  /** 父部門ID */
  parentId?: string;
  /** 排序 */
  sort?: number;
  /** 狀態(1:啟用；0:禁用) */
  status?: number;
  /** 父節點ID路徑 */
  treePath?: string;
  /** 修改時間 */
  updateTime?: Date;
}

/** 部門表單物件 */
export interface DeptForm {
  /** 部門ID */
  id?: string;
  /** 部門名稱 */
  name?: string;
  /** 部門編號 */
  code?: string;
  /** 父部門ID */
  parentId?: string;
  /** 排序 */
  sort?: number;
  /** 狀態(1:啟用；0:禁用) */
  status?: number;
}
