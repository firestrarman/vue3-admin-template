import { vi } from "vitest";

/**
 * Vue Router 常用 mock。測試需斷言導航時，改用此工廠而非真實 router。
 */
export function createRouterMock(
  currentRoute: Record<string, unknown> = {},
  overrides: Record<string, unknown> = {}
) {
  return {
    push: vi.fn().mockResolvedValue(undefined),
    replace: vi.fn().mockResolvedValue(undefined),
    back: vi.fn(),
    currentRoute: {
      value: {
        path: "/",
        fullPath: "/",
        name: "Dashboard",
        query: {},
        params: {},
        meta: {},
        matched: [],
        ...currentRoute,
      },
    },
    ...overrides,
  };
}
