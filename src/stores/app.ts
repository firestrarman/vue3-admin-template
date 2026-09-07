import zhTw from "element-plus/es/locale/lang/zh-tw";
import en from "element-plus/es/locale/lang/en";
import { store } from "@/stores";
import { DeviceEnum, SidebarStatus } from "@/enums";
import { STORAGE_KEYS } from "@/constants";
import { defaults } from "@/settings";

export const useAppStore = defineStore("app", () => {
  /**
   * 當前裝置型別
   */
  const device = useStorage(STORAGE_KEYS.DEVICE, DeviceEnum.DESKTOP);

  /**
   * 當前語言
   */
  const language = useStorage(STORAGE_KEYS.LANGUAGE, defaults.language);

  /**
   * 側邊欄持久化狀態
   */
  const sidebarStatus = useStorage(STORAGE_KEYS.SIDEBAR_STATUS, SidebarStatus.CLOSED);

  /**
   * 側邊欄顯示狀態
   */
  const sidebar = reactive({
    opened: sidebarStatus.value === SidebarStatus.OPENED,
    withoutAnimation: false,
  });

  /**
   * Element Plus 當前語言包
   */
  const locale = computed(() => (language?.value === "en" ? en : zhTw));

  /**
   * 切換側邊欄展開狀態
   */
  function toggleSidebar() {
    sidebar.opened = !sidebar.opened;
    sidebarStatus.value = sidebar.opened ? SidebarStatus.OPENED : SidebarStatus.CLOSED;
  }

  /**
   * 關閉側邊欄
   */
  function closeSidebar() {
    sidebar.opened = false;
    sidebarStatus.value = SidebarStatus.CLOSED;
  }

  /**
   * 開啟側邊欄
   */
  function openSidebar() {
    sidebar.opened = true;
    sidebarStatus.value = SidebarStatus.OPENED;
  }

  /**
   * 切換裝置型別
   */
  function toggleDevice(val: string) {
    device.value = val;
  }

  /**
   * 切換語言
   */
  function changeLanguage(val: string) {
    language.value = val;
  }

  return {
    device,
    sidebar,
    language,
    locale,
    toggleDevice,
    changeLanguage,
    toggleSidebar,
    closeSidebar,
    openSidebar,
  };
});

export function useAppStoreHook() {
  return useAppStore(store);
}
