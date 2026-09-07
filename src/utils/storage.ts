import { APP_PREFIX, STORAGE_KEYS } from "@/constants";

/**
 * 儲存工具類
 * @description
 * 提供 localStorage 和 sessionStorage 的統一操作介面
 * 支援自動 JSON 序列化/反序列化
 */
export class Storage {
  /** 儲存資料到 localStorage */
  static set(key: string, value: unknown): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /** 從 localStorage 獲取資料 */
  static get<T>(key: string, defaultValue?: T): T {
    const value = localStorage.getItem(key);
    if (!value) return defaultValue as T;

    try {
      return JSON.parse(value);
    } catch {
      // 如果解析失敗，返回原始字串
      return value as unknown as T;
    }
  }

  /** 從 localStorage 刪除資料 */
  static remove(key: string): void {
    localStorage.removeItem(key);
  }

  /** 儲存資料到 sessionStorage */
  static sessionSet(key: string, value: unknown): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  /** 從 sessionStorage 獲取資料 */
  static sessionGet<T>(key: string, defaultValue?: T): T {
    const value = sessionStorage.getItem(key);
    if (!value) return defaultValue as T;

    try {
      return JSON.parse(value);
    } catch {
      // 如果解析失敗，返回原始字串
      return value as unknown as T;
    }
  }

  /** 從 sessionStorage 刪除資料 */
  static sessionRemove(key: string): void {
    sessionStorage.removeItem(key);
  }

  /** 清理指定鍵的儲存（localStorage + sessionStorage） */
  static clear(key: string): void {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }

  /** 批次清理儲存 */
  static clearMultiple(keys: string[]): void {
    keys.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  }

  /**
   * 清理指定前綴的儲存
   *
   * @example
   * ```ts
   * // 清理所有認證相關的儲存
   * Storage.clearByPrefix('vea:auth:');
   * ```
   */
  static clearByPrefix(prefix: string): void {
    // localStorage 清理
    const localKeys = Object.keys(localStorage).filter((key) => key.startsWith(prefix));
    localKeys.forEach((key) => localStorage.removeItem(key));

    // sessionStorage 清理
    const sessionKeys = Object.keys(sessionStorage).filter((key) => key.startsWith(prefix));
    sessionKeys.forEach((key) => sessionStorage.removeItem(key));
  }

  /**
   * 清理所有專案相關的儲存
   *
   * @description
   * 清理所有以 APP_PREFIX 開頭的儲存項
   */
  static clearAllProject(): void {
    this.clearByPrefix(`${APP_PREFIX}:`);
  }

  /** 獲取所有專案相關的儲存鍵 */
  static getAllProjectKeys(): string[] {
    return Object.values(STORAGE_KEYS);
  }
}
