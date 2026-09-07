import type { App } from "vue";
import { createI18n } from "vue-i18n";
import { useAppStoreHook } from "@/stores/app";
// 本地語言包
import enLocale from "./package/en.json";
import zhTwLocale from "./package/zh-tw.json";

const appStore = useAppStoreHook();

const messages = {
  "zh-tw": zhTwLocale,
  en: enLocale,
};

const i18n = createI18n({
  legacy: false,
  locale: appStore.language,
  messages,
  globalInjection: true,
});

// 全域性註冊 i18n
export function setupI18n(app: App<Element>) {
  app.use(i18n);
}

export default i18n;
