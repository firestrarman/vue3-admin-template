/// <reference types="vite/client" />

/**
 * Vite 環境變數型別定義
 */
interface ImportMetaEnv {
  readonly VITE_APP_BASE_API: string;
  readonly VITE_APP_API_URL: string;
  readonly VITE_APP_TITLE?: string;
  readonly VITE_MOCK_DEV_SERVER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
