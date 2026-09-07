import "vue-router";

declare module "vue-router" {
  /**
   * 專案路由元資訊擴充套件
   */
  interface RouteMeta {
    title?: string;
    type?: string;
    icon?: string;
    hidden?: boolean;
    alwaysShow?: boolean;
    affix?: boolean;
    keepAlive?: boolean;
    breadcrumb?: boolean;
    activeMenu?: string;
    params?: Record<string, unknown>;
    externalUrl?: string;
    roles?: string[];
  }
}
