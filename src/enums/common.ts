/**
 * 對話方塊模式列舉
 */
export enum DialogMode {
  // 建立模式 - 新增資料
  CREATE = "create",
  // 編輯模式 - 修改資料
  EDIT = "edit",
  // 檢視模式 - 只讀展示
  VIEW = "view",
}

/**
 * 通用狀態列舉
 */
export enum CommonStatus {
  // 禁用
  DISABLED = 0,
  // 啟用
  ENABLED = 1,
}

/**
 * 審核狀態列舉
 */
export const enum AuditStatus {
  // 待審核
  PENDING = 0,
  // 已審核
  APPROVED = 1,
  // 已拒絕
  REJECTED = 2,
}
