<div align="center">

# vue3-admin-template

**Vue 3 · Vite 8 · TypeScript · Element Plus 後臺管理模板**

</div>

開箱即用的後臺前端骨架：動態權限路由、系統管理頁、Mock 開發、UnoCSS、Pug 模板與 Vitest 測試。

## 技術棧

| 層級 | 選型 |
| ---- | ---- |
| 執行時 | Node.js `^22.12.0` · pnpm（`only-allow pnpm`） |
| 框架 | Vue 3.5 · Vue Router 5（Hash） · Pinia 4 · Vue I18n 11 |
| 建置 | Vite 8（Rolldown） · TypeScript 6 · vue-tsc |
| UI | Element Plus · UnoCSS · Sass · animate.css |
| 模板 | Pug（`<template lang="pug">`） |
| HTTP | Axios · qs |
| 圖表／編輯器 | ECharts · wangEditor Next |
| 品質 | ESLint 10 · Prettier · Stylelint · Husky · lint-staged |
| 測試 | Vitest 5 · Vue Test Utils · happy-dom |

## 功能

- 帳號登入、驗證碼、記住我、Token 自動重新整理
- 動態選單路由、按鈕權限 `v-hasPerm`、標籤頁、麵包屑
- 響應式側邊欄（桌面／行動裝置）
- 系統管理：使用者、角色、選單、部門、通知公告
- 個人中心、我的通知
- 字典快取、分頁列表 composable、通用表格元件
- 開發期 Mock（`vite-plugin-mock-dev-server`），可切換真實後端
- 繁中／英文切換（`zh-tw`、`en`）

## 環境要求

| 項目 | 版本 |
| ---- | ---- |
| Node.js | `^22.12.0`（Dockerfile 使用 `node:22-bookworm-slim`） |
| 套件管理 | pnpm（專案禁止 npm / yarn） |
| 編輯器 | 建議 Cursor / VS Code，並安裝工作區推薦擴充 |

## 快速開始

### 本機

```bash
corepack enable
pnpm install
pnpm dev
```

瀏覽器開啟 [http://localhost:3000](http://localhost:3000)。預設帳密為 `admin` / `123456`，驗證碼任意填寫即可（Mock 不校驗）。

開發環境預設 `VITE_MOCK_DEV_SERVER=true`，無需後端。

### Docker

容器會掛載專案目錄並對外開放 `3000`：

```bash
docker compose up --build
```

已有映像時，也可進容器執行指令：

```bash
docker compose exec vue3 pnpm install
docker compose exec vue3 pnpm dev
docker compose exec vue3 pnpm test
```

## 常用指令

| 指令 | 說明 |
| ---- | ---- |
| `pnpm dev` | 開發伺服器（`0.0.0.0:3000`） |
| `pnpm build` | 型別檢查後打包到 `dist/` |
| `pnpm preview` | 預覽正式打包結果 |
| `pnpm type-check` | 只跑 `vue-tsc --noEmit` |
| `pnpm lint` | ESLint + Prettier + Stylelint |
| `pnpm test` | Vitest 單次執行 |
| `pnpm test:watch` | 監看模式 |
| `pnpm test:coverage` | 覆蓋率（`coverage/`） |
| `pnpm test:ui` | Vitest UI |

提交前 Husky 會跑 `lint-staged`。

## 目錄結構

```text
├── mock/                      # Mock 介面（對齊 /api/v1）
├── src/
│   ├── api/                   # 介面封裝（auth、file、system/*）
│   ├── assets/icons/          # 本地 SVG，UnoCSS 以 i-svg: 引用
│   ├── components/
│   │   ├── base/              # 通用元件（表格、字典、編輯器、圖表…）
│   │   └── pages/             # 頁面專用元件
│   ├── composables/           # usePageTable、useTableSelection
│   ├── constants/             # 儲存鍵
│   ├── directives/            # v-hasPerm
│   ├── enums/                 # API、業務、設定列舉
│   ├── lang/                  # vue-i18n 語言包
│   ├── layouts/               # 側邊欄、頂欄、標籤頁
│   ├── plugins/               # NProgress、Vxe Table 註冊
│   ├── router/                # 靜態路由、權限守衛
│   ├── settings.ts            # 預設標題、語言、標籤頁／Logo
│   ├── stores/                # app、user、permission、dict、tags-view、settings
│   ├── styles/                # 全域 SCSS、Element Plus 主題覆寫
│   ├── utils/
│   └── views/                 # 頁面（login、dashboard、system、profile、error）
├── tests/
│   ├── helpers/               # 測試輔助
│   ├── mocks/
│   ├── setup.ts
│   └── unit/                  # 單元測試，目錄對應 src，檔名 *.test.ts
├── types/                     # 環境、路由、自動匯入型別
├── compose.yml                # 開發用 Docker Compose
├── uno.config.ts
├── vite.config.ts
└── vitest.config.ts           # 獨立測試設定，不 merge Vite 開發外掛
```

路徑別名：`@` → `src/`。

## 架構說明

### 啟動流程

`src/main.ts` 依序註冊：自訂指令 → i18n → Router → Pinia → Vxe Table → Element Plus 圖示 → 權限守衛，最後掛載。

Vue / VueUse / Pinia / Router / I18n 與 Element Plus 元件走 `unplugin-auto-import`、`unplugin-vue-components`，無需逐一手寫 import。

### 路由與權限

- 歷史模式：`createWebHashHistory()`（`#/dashboard`）。
- 靜態路由：登入、首頁、401／404、個人中心、通知。
- 動態路由：登入後呼叫選單 API，`permission` store 將後端 `component` 字串對應到 `src/views/**/*.vue`。
- 白名單僅 `/login`；未登入導向登入並帶 `redirect`。
- 按鈕權限：`v-hasPerm="'sys:user:create'"` 或陣列；角色 `ROOT` 略過檢查。

### API 與 Mock

Axios 實例在 `src/api/request.ts`：

- `baseURL` 為 `VITE_APP_BASE_API`
- 自動帶 `Bearer` Token；標頭設 `Authorization: no-auth` 則略過
- 成功碼 `00000`；Token 失效會嘗試 refresh

Mock 定義在 `mock/*.mock.ts`，實際路徑為：

```text
{VITE_APP_BASE_API}/api/v1/{資源}
```

例如開發環境：`/dev-api/api/v1/auth/login`。

對接真實後端時，在 `.env.development` 關閉 Mock 並改代理目標：

```bash
VITE_MOCK_DEV_SERVER=false
VITE_APP_API_URL=http://localhost:8000
```

Vite 會把 `VITE_APP_BASE_API` 轉發到 `VITE_APP_API_URL`。

### 樣式

- **UnoCSS**：`presetWind3`、attributify、本地 SVG 圖示集 `i-svg:*`。
- **SCSS**：`vite.config.ts` 會自動注入 Element Plus 變數與 `variables.scss`。
- 佈局樣式在 `src/styles/`，不要把版面邏輯寫進 Uno 捷徑裡硬幹。

Pug 的 class 必須維持 attribute 寫法（`class="flex hover:bg-primary"`），不可寫成 `.hover:bg-primary`，否則 UnoCSS 變體會壞掉。插槽請寫 `v-slot:name`，不要用 `#name`（Pug 的 `#` 是 id）。

### 列表頁慣例

系統管理頁多用：

- `usePageTable`：分頁查詢、重置、loading
- `useTableSelection`：多選
- `AppTableList` / `AppPagination` / `AppDictSelect` / `AppDictTag`

### 單元測試

`vitest.config.ts` 刻意不合併 `vite.config.ts`，避免 Mock、UnoCSS、`optimizeDeps` 進入測試。

- 業務測試放 `tests/unit/`，目錄對齊 `src`
- 檔名 `*.test.ts`
- `tests/setup.ts`、`helpers`、`mocks` 只放基礎設施

## 環境變數

| 變數 | 開發預設 | 說明 |
| ---- | -------- | ---- |
| `VITE_APP_TITLE` | `vue3-admin-template` | 瀏覽器標題、登入品牌 |
| `VITE_APP_BASE_API` | `/dev-api`（正式 `/prod-api`） | Axios 前綴與開發代理 |
| `VITE_APP_API_URL` | `https://example.com` | 代理目標後端 |
| `VITE_MOCK_DEV_SERVER` | `true` | 是否啟用本地 Mock |

應用預設語言、是否顯示標籤頁與 Logo 在 `src/settings.ts`。

## 編輯器

工作區已建議安裝：Volar、UnoCSS、Iconify、i18n Ally、ESLint、Prettier、Stylelint、EditorConfig、Vitest。

遠端（WSL）開發請在遠端視窗安裝擴充；UnoCSS 提示異常時執行 `UnoCSS: Reload UnoCSS`。

## 部署

```bash
pnpm build
```

產物在 `dist/`。Hash 路由可直接放到靜態主機；若改成 History 模式，需由 Nginx 將未知路徑回退到 `index.html`。

## 授權

本專案基於 [vue3-element-admin](https://github.com/youlaitech/vue3-element-admin) 改寫，沿用 [MIT License](./LICENSE)。可免費商用與二次開發，已保留原作者 **PanJiaChen** 與 **有来开源组织** 的版權聲明。
