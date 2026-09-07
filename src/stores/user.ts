import { store } from "@/stores";
import AuthAPI from "@/api/auth";
import UserAPI from "@/api/system/user";
import type { LoginRequest } from "@/api/auth";
import type { UserInfo } from "@/api/system/user";

import { AuthStorage } from "@/utils/auth";
import { usePermissionStoreHook } from "@/stores/permission";
import { useDictStoreHook } from "@/stores/dict";
import { useTagsViewStore } from "@/stores";

export const useUserStore = defineStore("user", () => {
  // 使用者資訊
  const userInfo = ref<UserInfo>({} as UserInfo);
  // 記住我狀態
  const rememberMe = ref(AuthStorage.getRememberMe());

  /**
   * 登入
   */
  async function login(loginRequest: LoginRequest): Promise<void> {
    const { accessToken, refreshToken } = await AuthAPI.login(loginRequest);
    rememberMe.value = loginRequest.rememberMe ?? false;
    AuthStorage.setTokens(accessToken, refreshToken, rememberMe.value);
  }

  let refreshPromise: Promise<void> | null = null;

  /**
   * 重新整理 token（單次模式）
   * 多個併發請求遇到 token 過期時，共享同一次 refresh 請求。
   */
  function refreshTokenOnce(): Promise<void> {
    if (refreshPromise) return refreshPromise;

    refreshPromise = doRefreshToken().finally(() => {
      refreshPromise = null;
    });

    return refreshPromise;
  }

  /**
   * 獲取使用者資訊
   */
  async function getUserInfo(): Promise<UserInfo> {
    const data = await UserAPI.getInfo();
    if (!data) {
      throw new Error("Verification failed, please Login again.");
    }
    Object.assign(userInfo.value, data);
    return data;
  }

  /**
   * 登出
   */
  async function logout(): Promise<void> {
    await AuthAPI.logout();
    resetAllState();
  }

  /**
   * 重置所有系統狀態
   *
   * 統一處理所有清理工作，包括使用者憑證、路由、快取等
   */
  function resetAllState(): void {
    // 1. 重置使用者狀態
    resetUserState();

    // 2. 重置其他模組狀態
    usePermissionStoreHook().resetRouter();
    useDictStoreHook().clearDictCache();
    useTagsViewStore().delAllViews();
  }

  /**
   * 重置使用者狀態
   *
   * 僅處理使用者模組內的狀態
   */
  function resetUserState(): void {
    AuthStorage.clearAuth();
    userInfo.value = {} as UserInfo;
  }

  /**
   * 重新整理 token
   */
  async function doRefreshToken(): Promise<void> {
    const currentRefreshToken = AuthStorage.getRefreshToken();

    if (!currentRefreshToken) {
      throw new Error("沒有有效的重新整理令牌");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await AuthAPI.refreshToken(currentRefreshToken);
    AuthStorage.setTokens(accessToken, newRefreshToken, AuthStorage.getRememberMe());
  }

  return {
    userInfo,
    rememberMe,
    isLoggedIn: () => !!AuthStorage.getAccessToken(),
    login,
    logout,
    getUserInfo,
    resetAllState,
    resetUserState,
    refreshToken: doRefreshToken,
    refreshTokenOnce,
  };
});

/**
 * 在元件外部使用 UserStore 的鉤子函式
 * @see https://pinia.vuejs.org/core-concepts/outside-component-usage.html
 */
export function useUserStoreHook() {
  return useUserStore(store);
}
