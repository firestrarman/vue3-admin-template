import { useRoute } from "vue-router";
import { useAppStore, usePermissionStore, useSettingsStore } from "@/stores";
import { DeviceEnum } from "@/enums/settings";

/**
 * 提供佈局元件共用的響應式狀態
 */
export function useLayout() {
  const route = useRoute();
  const appStore = useAppStore();
  const settingsStore = useSettingsStore();
  const permissionStore = usePermissionStore();

  const isMobile = computed(() => appStore.device === DeviceEnum.MOBILE);
  const isSidebarOpen = computed(() => appStore.sidebar.opened);
  const showTagsView = computed(() => settingsStore.showTagsView);
  const showLogo = computed(() => settingsStore.showAppLogo);

  const layoutClass = computed(() => ({
    "layout--left": true,
    "is-sidebar-collapsed": !appStore.sidebar.opened,
    "is-sidebar-open": appStore.sidebar.opened,
    "is-mobile": appStore.device === DeviceEnum.MOBILE,
  }));

  const routes = computed(() => permissionStore.routes);

  const activeMenu = computed(() => {
    const { meta, path } = route;
    return meta?.activeMenu || path;
  });

  function toggleSidebar() {
    appStore.toggleSidebar();
  }

  function closeSidebar() {
    appStore.closeSidebar();
  }

  return {
    isMobile,
    layoutClass,
    isSidebarOpen,
    showTagsView,
    showLogo,
    routes,
    activeMenu,
    toggleSidebar,
    closeSidebar,
  };
}
