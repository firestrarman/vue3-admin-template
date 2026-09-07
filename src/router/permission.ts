import type { RouteRecordRaw } from "vue-router";
import NProgress from "@/plugins/nprogress";
import router from "@/router";
import { usePermissionStore, useUserStore } from "@/stores";

export function setupPermissionGuard() {
  const whiteList = ["/login"];

  router.beforeEach(async (to, _from) => {
    NProgress.start();

    try {
      const isLoggedIn = useUserStore().isLoggedIn();

      // 未登入處理
      if (!isLoggedIn) {
        if (whiteList.includes(to.path)) {
          return;
        }
        NProgress.done();
        return `/login?redirect=${encodeURIComponent(to.fullPath)}`;
      }

      // 已登入訪問登入頁，重定向到首頁
      if (to.path === "/login") {
        return { path: "/" };
      }

      const permissionStore = usePermissionStore();
      const userStore = useUserStore();

      // 動態路由生成
      if (!permissionStore.isRouteGenerated) {
        if (!userStore.userInfo?.roles?.length) {
          await userStore.getUserInfo();
        }

        const dynamicRoutes = await permissionStore.generateRoutes();
        dynamicRoutes.forEach((route: RouteRecordRaw) => {
          router.addRoute(route);
        });

        return { ...to, replace: true };
      }

      // 路由 404 檢查
      if (to.matched.length === 0) {
        // 從登入頁跳轉且目標路徑無效，回退首頁（避免不同使用者權限不同導致的 404）
        if (_from.path === "/login") {
          return { path: "/", replace: true };
        }
        return "/404";
      }

      // 動態標題
      const title = (to.params.title as string) || (to.query.title as string);
      if (title) {
        to.meta.title = title;
      }
    } catch (error) {
      console.error("Route guard error:", error);
      await useUserStore().resetAllState();
      NProgress.done();
      return "/login";
    }
  });

  router.afterEach(() => {
    NProgress.done();
  });
}
