import { STORAGE_KEYS } from "@/constants";
import { defaults } from "@/settings";

export const useSettingsStore = defineStore("setting", () => {
  // 介面顯示
  const showTagsView = useStorage(STORAGE_KEYS.SHOW_TAGS_VIEW, defaults.showTagsView);
  const showAppLogo = useStorage(STORAGE_KEYS.SHOW_APP_LOGO, defaults.showAppLogo);

  return {
    showTagsView,
    showAppLogo,
  };
});
