import { LanguageEnum } from "@/enums";

export const defaults = {
  // 系統標題
  title: import.meta.env.VITE_APP_TITLE as string,
  // 語言
  language: LanguageEnum.ZH_TW,
  // 是否顯示標籤欄
  showTagsView: true,
  // 是否顯示應用logo
  showAppLogo: true,
} as const;
