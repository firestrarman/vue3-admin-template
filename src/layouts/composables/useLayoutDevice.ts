import { useWindowSize } from "@vueuse/core";
import { useAppStore } from "@/stores";
import { DeviceEnum } from "@/enums/settings";

const WIDE_BREAKPOINT = 992;
const MOBILE_BREAKPOINT = 768;

/**
 * 根據視窗寬度同步裝置型別和側邊欄展開狀態
 *
 * 三檔斷點：
 * - ≥992px：桌面寬屏，側邊欄展開（完整選單）
 * - 768~992px：桌面窄屏，側邊欄收縮（僅圖示）
 * - <768px：移動端，側邊欄完全隱藏
 */
export function useLayoutDevice() {
  const appStore = useAppStore();
  const { width } = useWindowSize();

  const isDesktop = computed(() => width.value >= MOBILE_BREAKPOINT);
  const isWideDesktop = computed(() => width.value >= WIDE_BREAKPOINT);

  watchEffect(() => {
    const device = isDesktop.value ? DeviceEnum.DESKTOP : DeviceEnum.MOBILE;

    appStore.toggleDevice(device);

    if (isWideDesktop.value) {
      appStore.openSidebar();
    } else {
      appStore.closeSidebar();
    }
  });

  return {
    isDesktop,
  };
}
