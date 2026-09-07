import vue from "@vitejs/plugin-vue";
import type { PluginOption } from "vite";
import { type ConfigEnv, type UserConfig, loadEnv, defineConfig } from "vite";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { mockDevServerPlugin } from "vite-plugin-mock-dev-server";
import UnoCSS from "unocss/vite";
import { resolve } from "path";

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd());

  return {
    resolve: {
      alias: {
        "@": resolve(import.meta.dirname, "src"),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: (content: string, filepath: string) => {
            const path = filepath.replace(/\\/g, "/");
            if (path.endsWith("/styles/element-plus-vars.scss")) {
              return content;
            }
            return `@use "@/styles/element-plus-vars.scss" as *;
@use "@/styles/variables.scss" as *;
${content}`;
          },
        },
      },
    },
    server: {
      host: "0.0.0.0",
      port: 3000,
      open: false,
      proxy: {
        [env.VITE_APP_BASE_API]: {
          changeOrigin: true,
          target: env.VITE_APP_API_URL,
          rewrite: (path: string) => path.replace(new RegExp(`^${env.VITE_APP_BASE_API}`), ""),
        },
      },
    },
    plugins: [
      vue(),
      ...(env.VITE_MOCK_DEV_SERVER === "true" ? [mockDevServerPlugin()] : []),
      UnoCSS(),
      AutoImport({
        imports: ["vue", "@vueuse/core", "pinia", "vue-router", "vue-i18n"],
        resolvers: [
          // 匯入 Element Plus函式，如：ElMessage, ElMessageBox 等
          ElementPlusResolver({ importStyle: "sass" }),
        ],
        eslintrc: {
          enabled: false,
          filepath: "./.eslintrc-auto-import.json",
          globalsPropValue: true,
        },
        vueTemplate: true,
        // 匯入函式型別宣告檔案路徑 (false:關閉自動生成)
        dts: false,
        // dts: "types/auto-imports.d.ts",
      }),
      // 元件自動匯入
      Components({
        resolvers: [
          // 匯入 Element Plus 元件
          ElementPlusResolver({ importStyle: "sass" }),
        ],
        // 指定自定義元件位置(預設:src/components)
        dirs: ["src/components", "src/**/components"],
        // 匯入元件型別宣告檔案路徑 (false:關閉自動生成)
        dts: false,
        //dts: "types/components.d.ts",
      }),
    ] as PluginOption[],
    // 預載入專案必需的依賴
    optimizeDeps: {
      include: [
        "vue",
        "vue-router",
        "element-plus",
        "pinia",
        "axios",
        "@vueuse/core",
        "exceljs",
        "path-to-regexp",
        "echarts/core",
        "echarts/renderers",
        "echarts/charts",
        "echarts/components",
        "vue-i18n",
        "nprogress",
        "sortablejs",
        "qs",
        "vxe-table",
        "vxe-pc-ui",
        "path-browserify",
        "lodash-es",
        "@element-plus/icons-vue",
        "element-plus/es",
        "element-plus/es/locale/lang/en",
        "element-plus/es/locale/lang/zh-tw",
        // Element Plus 元件樣式預構建：按 src 實際用到的元件清單硬編碼，首啟即預載入，
        // 避免首次使用某元件時觸發依賴重最佳化導致頁面重新整理
        ...[
          "alert",
          "avatar",
          "backtop",
          "badge",
          "base",
          "breadcrumb",
          "breadcrumb-item",
          "button",
          "card",
          "cascader",
          "checkbox",
          "checkbox-group",
          "checkbox-button",
          "col",
          "color-picker",
          "config-provider",
          "collapse-transition",
          "date-picker",
          "descriptions",
          "descriptions-item",
          "dialog",
          "divider",
          "drawer",
          "dropdown",
          "dropdown-item",
          "dropdown-menu",
          "empty",
          "form",
          "form-item",
          "icon",
          "image",
          "image-viewer",
          "input",
          "input-number",
          "input-tag",
          "link",
          "loading",
          "menu",
          "menu-item",
          "message",
          "message-box",
          "notification",
          "option",
          "pagination",
          "popover",
          "progress",
          "radio",
          "radio-button",
          "radio-group",
          "row",
          "scrollbar",
          "select",
          "skeleton",
          "skeleton-item",
          "space",
          "step",
          "steps",
          "sub-menu",
          "switch",
          "tab-pane",
          "table",
          "table-column",
          "tabs",
          "tag",
          "text",
          "time-picker",
          "time-select",
          "timeline",
          "timeline-item",
          "tooltip",
          "tree",
          "tree-select",
          "upload",
        ].map((c) => `element-plus/es/components/${c}/style/index`),
      ],
    },
    build: {
      // chunk 大小警告閾值
      chunkSizeWarningLimit: 1200,
      reportCompressedSize: false,
      cssMinify: "lightningcss",
      rolldownOptions: {
        checks: {
          pluginTimings: false,
        },
        output: {
          // 用於從入口點建立的塊的打包輸出格式
          entryFileNames: "js/[name].[hash].js",
          // 用於命名程式碼拆分時建立的共享塊的輸出命名
          chunkFileNames: "js/[name].[hash].js",
          // 用於輸出靜態資源的命名
          assetFileNames: (assetInfo) => {
            const assetName = assetInfo.names[0];

            if (!assetName) {
              return "assets/[name].[hash][extname]";
            }

            const info = assetName.split(".");
            let extType = info[info.length - 1];
            if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetName)) {
              extType = "media";
            } else if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(assetName)) {
              extType = "img";
            } else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetName)) {
              extType = "fonts";
            }
            return `${extType}/[name].[hash].[ext]`;
          },
        },
      },
    },
  };
});
