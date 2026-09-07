/** 應用儲存前綴 */
export const APP_PREFIX = "admin";

/**
 * 超級管理員角色標識
 * @description
 * 擁有系統最高權限，可以訪問所有資源
 */
export const ROLE_ROOT = "ROOT";

/**
 * 通知已讀標記
 * @description
 * 1:已讀; 0:未讀
 */
export const NOTICE_READ_STATUS = {
  READ: 1,
  UNREAD: 0,
};

/**
 * 儲存鍵名常量
 * @description
 * 統一管理所有 localStorage/sessionStorage 的鍵名
 * 命名規則：{APP_PREFIX}:{分類}:{具體名稱}
 */
export const STORAGE_KEYS = {
  // 認證
  ACCESS_TOKEN: `${APP_PREFIX}:auth:access_token`,
  REFRESH_TOKEN: `${APP_PREFIX}:auth:refresh_token`,
  REMEMBER_ME: `${APP_PREFIX}:auth:remember_me`,

  // 系統
  DICT_CACHE: `${APP_PREFIX}:system:dict_cache`,

  // UI
  SHOW_TAGS_VIEW: `${APP_PREFIX}:ui:show_tags_view`,
  SHOW_APP_LOGO: `${APP_PREFIX}:ui:show_app_logo`,

  // 應用
  DEVICE: `${APP_PREFIX}:app:device`,
  LANGUAGE: `${APP_PREFIX}:app:language`,
  SIDEBAR_STATUS: `${APP_PREFIX}:app:sidebar_status`,
} as const;

/** 儲存鍵名型別 */
export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
