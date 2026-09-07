/**
 * Menu 選單型別定義
 */

/** 選單查詢引數 */
export interface MenuQueryParams {
  /** 搜尋關鍵字 */
  keywords?: string;
}

/** 選單檢視物件 */
export interface MenuItem {
  /** 子選單 */
  children?: MenuItem[];
  /** 元件路徑 */
  component?: string;
  /** 外鏈地址 */
  externalUrl?: string;
  /** ICON */
  icon?: string;
  /** 選單ID */
  id?: string;
  /** 選單名稱 */
  name?: string;
  /** 父選單ID */
  parentId?: string;
  /** 路由名稱 */
  routeName?: string;
  /** 路由路徑 */
  routePath?: string;
  /** 路由路徑 */
  path?: string;
  /** 按鈕權限標識 */
  perm?: string;
  /** 跳轉路徑 */
  redirect?: string;
  /** 是否始終顯示 */
  alwaysShow?: number | boolean;
  /** 是否快取 */
  keepAlive?: number | boolean;
  /** 路由引數 */
  params?: { key?: string; value?: string }[];
  /** 選單排序(數字越小排名越靠前) */
  sort?: number;
  /** 選單型別（C-目錄 M-選單 E-外鏈 B-按鈕） */
  type?: string;
  /** 選單是否可見(1:顯示;0:隱藏) */
  visible?: number;
}

/** 選單表單物件 */
export interface MenuForm {
  /** 選單ID */
  id?: string;
  /** 父選單ID */
  parentId?: string;
  /** 選單名稱 */
  name?: string;
  /** 選單型別（C-目錄 M-選單 E-外鏈 B-按鈕） */
  type?: string;
  /** 路由路徑 */
  path?: string;
  /** 路由名稱（用於前端路由名） */
  routeName?: string;
  /** 路由路徑（可用於自定義路由欄位） */
  routePath?: string;
  /** 跳轉路徑 */
  redirect?: string;
  /** 元件路徑 */
  component?: string;
  /** 外鏈地址 */
  externalUrl?: string;
  /** ICON */
  icon?: string;
  /** 排序 */
  sort?: number;
  /** 選單是否可見 */
  visible?: number;
  /** 按鈕權限標識 */
  perm?: string;
  /** 路由引數（用於表單編輯 params） */
  params?: { key?: string; value?: string }[];
  /** 是否始終顯示（僅對目錄生效） */
  alwaysShow?: number | boolean;
  /** 是否快取（用於 keepAlive） */
  keepAlive?: number | boolean;
}

/** 路由物件 */
export interface RouteItem {
  /** 子路由列表 */
  children: RouteItem[];
  /** 元件路徑 */
  component?: string;
  /** 路由名稱 */
  name?: string;
  /** 路由路徑 */
  path?: string;
  /** 路由屬性 */
  meta?: Meta;
  /** 跳轉連結 */
  redirect?: string;
}

/** 路由屬性 */
export interface Meta {
  /** 【目錄】只有一個子路由是否始終顯示 */
  alwaysShow?: boolean;
  /** 是否隱藏(true-是 false-否) */
  hidden?: boolean;
  /** ICON */
  icon?: string;
  /** 【選單】是否開啟頁面快取 */
  keepAlive?: boolean;
  /** 路由引數 */
  params?: Record<string, unknown>;
  /** 外鏈地址 */
  externalUrl?: string;
  /** 角色集合 */
  roles?: string[];
  /** 路由title */
  title?: string;
}
