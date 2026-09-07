import { createApp } from "vue";
import App from "./App.vue";

import "@/styles/index.scss";
import "uno.css";
import "animate.css";

import { setupDirective } from "@/directives";
import { setupRouter } from "@/router";
import { setupStore } from "@/stores";
import { setupI18n } from "@/lang";
import * as ElementPlusIcons from "@element-plus/icons-vue";
import { setupPermissionGuard } from "@/router/permission";
import { setupVxeTable } from "@/plugins/vxe-table";

const app = createApp(App);

setupDirective(app);
setupI18n(app);
setupRouter(app);
setupStore(app);
setupVxeTable(app);

Object.entries(ElementPlusIcons).forEach(([name, comp]) => app.component(name, comp));

setupPermissionGuard();

app.mount("#app");
