import type { App } from "vue";

import { hasPerm } from "./permission";

// 全域性註冊 directive
export function setupDirective(app: App<Element>) {
  // 使 v-hasPerm 在所有元件中都可用
  app.directive("hasPerm", hasPerm);
}
