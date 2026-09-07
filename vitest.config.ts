import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { defineConfig } from "vitest/config";
import { resolve } from "path";

/**
 * 單元測試專用設定，刻意不 merge vite.config.ts。
 * 開發伺服器外掛（Mock、UnoCSS、optimizeDeps）不應進入測試執行環境。
 *
 * 慣例：
 * - 業務測試集中在 tests/unit，目錄對應 src 功能區，檔名為 *.test.ts
 * - tests/setup.ts、helpers、mocks 只放基礎設施
 */
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ["vue", "@vueuse/core", "pinia", "vue-router", "vue-i18n"],
      resolvers: [ElementPlusResolver({ importStyle: false })],
      vueTemplate: true,
      dts: false,
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "src"),
    },
  },
  test: {
    name: "unit",
    environment: "happy-dom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/unit/**/*.test.ts"],
    exclude: ["node_modules", "dist"],
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.{ts,vue}"],
      exclude: ["src/main.ts", "src/**/*.d.ts"],
    },
  },
});
