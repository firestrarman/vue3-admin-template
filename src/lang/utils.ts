/**
 * 國際化工具函式
 */
import i18n from "./index";

/**
 * 翻譯路由標題
 * 用於麵包屑、側邊欄、標籤頁等場景
 */
export function translateRouteTitle(title: string): string {
  const key = `route.${title}`;
  return i18n.global.te(key) ? i18n.global.t(key) : title;
}
