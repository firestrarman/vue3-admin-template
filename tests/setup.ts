import { enableAutoUnmount } from "@vue/test-utils";
import { afterEach } from "vitest";

/**
 * 每個測試結束後自動卸載元件，避免 DOM、訂閱與 timer 殘留影響下一筆測試。
 */
enableAutoUnmount(afterEach);
