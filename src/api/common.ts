/**
 * API 響應殼
 */
export interface ApiResult<T = unknown> {
  // 業務狀態碼
  code: string;
  // 業務資料
  data: T;
  // 業務訊息
  msg: string;
}

/**
 * 分頁查詢基礎引數
 */
export interface BaseQueryParams {
  // 頁碼
  pageNum: number;
  // 每頁記錄數
  pageSize: number;
  // 排序欄位
  sortBy?: string;
  // 排序方式（正序:ASC；反序:DESC）
  order?: string;
}

/**
 * 分頁介面結果
 */
export interface PageResult<T> {
  // 資料列表
  list: T[];
  // 總記錄數
  total: number;
}

/**
 * 通用選項項
 */
export interface OptionItem {
  // 選項值
  value: string | number;
  // 選項標籤
  label: string;
  // 子選項
  children?: OptionItem[];
}

/**
 * Excel 匯入結果
 */
export interface ExcelResult {
  // 業務狀態碼
  code: string;
  // 無效資料數量
  invalidCount: number;
  // 有效資料數量
  validCount: number;
  // 錯誤資訊列表
  messageList: string[];
}
