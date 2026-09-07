/**
 * 資料驗證相關工具函式
 */

import type { FormItemRule } from "element-plus";

/**
 * 判斷是否是外部連結
 * @param path 路徑字串
 * @returns 是否是外部連結
 *
 * @example
 * ```ts
 * isExternal('https://example.com'); // true
 * isExternal('/dashboard'); // false
 * isExternal('mailto:admin@example.com'); // true
 * ```
 */
export function isExternal(path: string): boolean {
  return /^(https?:|http?:|mailto:|tel:)/.test(path);
}

/**
 * 判斷是否是有效的 URL
 * @param url URL 字串
 * @returns 是否是有效 URL
 *
 * @example
 * ```ts
 * isValidURL('https://example.com'); // true
 * isValidURL('not a url'); // false
 * ```
 */
export function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 判斷是否是郵箱地址
 * @param email 郵箱字串
 * @returns 是否是有效郵箱
 */
export function isEmail(email: string): boolean {
  const pattern = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
  return pattern.test(email);
}

/** 台灣手機號碼：09 開頭、共 10 碼 */
export const MOBILE_PATTERN = /^09\d{8}$/;

/**
 * 判斷是否是台灣手機號碼
 * @param mobile 手機號碼字串
 * @returns 是否是有效手機號碼
 *
 * @example
 * ```ts
 * isMobile('0912345678'); // true
 * isMobile('13800138000'); // false
 * ```
 */
export function isMobile(mobile: string): boolean {
  return MOBILE_PATTERN.test(mobile);
}

/**
 * 表單驗證規則生成器
 */
export const VALIDATORS = {
  /** 必填項驗證 */
  required(message: string): FormItemRule {
    return { required: true, message, trigger: "blur" };
  },

  /** 郵箱驗證 */
  email: {
    type: "email",
    message: "請輸入正確的郵箱地址",
    trigger: "blur",
  } as FormItemRule,

  /** 台灣手機號碼驗證 */
  mobile: {
    pattern: MOBILE_PATTERN,
    message: "請輸入正確的手機號碼",
    trigger: "blur",
  } as FormItemRule,

  /** URL 驗證 */
  url: {
    type: "url",
    message: "請輸入正確的URL地址",
    trigger: "blur",
  } as FormItemRule,

  /** 數字驗證 */
  number: {
    type: "number",
    message: "請輸入數字",
    trigger: "blur",
  } as FormItemRule,

  /** 整數驗證 */
  integer: {
    type: "integer",
    message: "請輸入整數",
    trigger: "blur",
  } as FormItemRule,
};
