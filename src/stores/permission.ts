import type { RouteRecordRaw } from "vue-router";
import { constantRoutes } from "@/router";
import { store } from "@/stores";
import router from "@/router";
import { useUserStoreHook } from "@/stores/user";
import { isExternal } from "@/utils";

import MenuAPI from "@/api/system/menu";
import type { RouteItem } from "@/api/system/menu";
const modules = import.meta.glob("../views/**/*.vue");
const Layout = () => import("../layouts/index.vue");

export const usePermissionStore = defineStore("permission", () => {
  const routes = ref<RouteRecordRaw[]>([]);
  const isRouteGenerated = ref(false);

  /**
   * 生成動態路由
   */
  async function generateRoutes(): Promise<RouteRecordRaw[]> {
    try {
      const routeData = await MenuAPI.getRoutes();
      const menuRoutes = transformRoutes(routeData);
      const registerRoutes = filterRoutes(menuRoutes);

      routes.value = [...constantRoutes, ...menuRoutes];
      isRouteGenerated.value = true;

      return registerRoutes;
    } catch (error) {
      isRouteGenerated.value = false;
      throw error;
    }
  }

  /**
   * 重置路由狀態
   */
  const resetRouter = () => {
    const constantNames = new Set(constantRoutes.map((route) => route.name).filter(Boolean));
    routes.value.forEach((route: RouteRecordRaw) => {
      if (route.name && !constantNames.has(route.name)) {
        router.removeRoute(route.name);
      }
    });

    routes.value = [...constantRoutes];
    isRouteGenerated.value = false;
  };

  let pendingReload: Promise<RouteRecordRaw[]> | null = null;

  /**
   * 重新載入動態路由
   * 同一時刻只允許一個請求進行中
   */
  async function reloadRoutes(): Promise<RouteRecordRaw[]> {
    if (pendingReload) return pendingReload;

    pendingReload = (async () => {
      try {
        resetRouter();
        const dynamicRoutes = await generateRoutes();
        dynamicRoutes.forEach((route: RouteRecordRaw) => {
          router.addRoute(route);
        });
        return dynamicRoutes;
      } finally {
        pendingReload = null;
      }
    })();

    return pendingReload;
  }

  let pendingPermissionRefresh: Promise<void> | null = null;

  /**
   * 重新整理權限
   * 重新拉取使用者資訊後重建動態路由
   */
  async function refreshPermissions(): Promise<void> {
    if (pendingPermissionRefresh) return pendingPermissionRefresh;

    pendingPermissionRefresh = (async () => {
      try {
        const userStore = useUserStoreHook();
        await userStore.getUserInfo();
        await reloadRoutes();
      } finally {
        pendingPermissionRefresh = null;
      }
    })();

    return pendingPermissionRefresh;
  }

  return {
    routes,
    isRouteGenerated,
    generateRoutes,
    resetRouter,
    reloadRoutes,
    refreshPermissions,
  };
});

/**
 * 將後端路由資料轉為 Vue Router 配置
 */
const transformRoutes = (routes: RouteItem[], isTopLevel: boolean = true): RouteRecordRaw[] => {
  return routes.map((route) => {
    const { children, ...args } = route;
    const componentPath = route.component;

    // 非頂層目錄殼去掉 Layout 元件，僅保留路由結構
    const resolvedComponent = isTopLevel || componentPath !== "Layout" ? componentPath : undefined;

    const normalizedRoute = { ...args } as RouteRecordRaw;

    if (!resolvedComponent) {
      normalizedRoute.component = undefined;
    } else {
      normalizedRoute.component =
        resolvedComponent === "Layout" ? Layout : resolveComponent(resolvedComponent);
    }

    if (children && children.length > 0) {
      normalizedRoute.children = transformRoutes(children, false);
    }

    return normalizedRoute;
  });
};

/**
 * 解析元件
 *
 * 支援 xxx.vue 與 xxx/index.vue 兩種寫法，未命中時回退到 404
 */
function resolveComponent(componentPath: string) {
  const normalized = componentPath
    .trim()
    .replace(/^\/+/, "")
    .replace(/\.vue$/i, "");
  return (
    modules[`../views/${normalized}.vue`] ||
    modules[`../views/${normalized}/index.vue`] ||
    modules[`../views/error/404.vue`]
  );
}

/**
 * 過濾掉不註冊為 Vue Router 路由的外鏈
 */
function filterRoutes(routes: RouteRecordRaw[]): RouteRecordRaw[] {
  return routes.reduce<RouteRecordRaw[]>((result, route) => {
    if (isExternal(route.path)) return result;

    const filtered = { ...route };
    const children = route.children ? filterRoutes(route.children) : [];

    if (children.length > 0) {
      filtered.children = children;
    } else {
      delete filtered.children;
    }

    result.push(filtered);
    return result;
  }, []);
}

/**
 * 非元件環境獲取 permission store
 */
export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
