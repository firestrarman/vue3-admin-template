import { createTestingPinia, type TestingOptions } from "@pinia/testing";
import { mount, type ComponentMountingOptions } from "@vue/test-utils";
import { vi } from "vitest";
import type { Component } from "vue";

/**
 * 建立測試用 Pinia。
 * stubActions 預設為 false，讓 store action 走真實邏輯；需要隔離時再覆寫。
 */
export function createTestPinia(options: TestingOptions = {}) {
  return createTestingPinia({
    createSpy: vi.fn,
    stubActions: false,
    ...options,
  });
}

/**
 * 掛載 Vue 元件時預先注入測試 Pinia，供後續元件 / store 測試使用。
 */
export function mountComponent<C extends Component>(
  component: C,
  options: ComponentMountingOptions<C> = {}
) {
  const { global, ...rest } = options;

  return mount(component, {
    ...rest,
    global: {
      ...global,
      plugins: [createTestPinia(), ...(global?.plugins ?? [])],
    },
  });
}
