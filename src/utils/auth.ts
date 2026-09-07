import { Storage } from "./storage";
import { STORAGE_KEYS, ROLE_ROOT } from "@/constants";
import { useUserStoreHook } from "@/stores/user";
import router from "@/router";

// 負責本地憑證與偏好的讀寫
export const AuthStorage = {
  getAccessToken(): string {
    const isRememberMe = Storage.get<boolean>(STORAGE_KEYS.REMEMBER_ME, false);
    return isRememberMe
      ? Storage.get(STORAGE_KEYS.ACCESS_TOKEN, "")
      : Storage.sessionGet(STORAGE_KEYS.ACCESS_TOKEN, "");
  },

  getRefreshToken(): string {
    const isRememberMe = Storage.get<boolean>(STORAGE_KEYS.REMEMBER_ME, false);
    return isRememberMe
      ? Storage.get(STORAGE_KEYS.REFRESH_TOKEN, "")
      : Storage.sessionGet(STORAGE_KEYS.REFRESH_TOKEN, "");
  },

  setTokens(accessToken: string, refreshToken: string, rememberMe: boolean): void {
    Storage.set(STORAGE_KEYS.REMEMBER_ME, rememberMe);
    if (rememberMe) {
      Storage.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      Storage.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    } else {
      Storage.sessionSet(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      Storage.sessionSet(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      Storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
      Storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
    }
  },

  clearAuth(): void {
    Storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
    Storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
    Storage.sessionRemove(STORAGE_KEYS.ACCESS_TOKEN);
    Storage.sessionRemove(STORAGE_KEYS.REFRESH_TOKEN);
  },

  getRememberMe(): boolean {
    return Storage.get<boolean>(STORAGE_KEYS.REMEMBER_ME, false);
  },
};

/**
 * 權限判斷
 */
export function hasPerm(value: string | string[], type: "button" | "role" = "button"): boolean {
  const { roles, perms } = useUserStoreHook().userInfo;

  if (!roles || !perms) {
    return false;
  }

  // 超級管理員擁有所有權限
  if (type === "button" && roles.includes(ROLE_ROOT)) {
    return true;
  }

  const auths = type === "button" ? perms : roles;
  return typeof value === "string"
    ? auths.includes(value)
    : value.some((perm) => auths.includes(perm));
}

let redirectingToLogin = false;

/**
 * 重定向到登入頁面
 */
export async function redirectToLogin(
  message: string = "請重新登入",
  notify: boolean = true
): Promise<void> {
  if (redirectingToLogin) return;
  redirectingToLogin = true;

  if (notify) {
    ElNotification({
      title: "提示",
      message,
      type: "warning",
      duration: 3000,
    });
  }

  await useUserStoreHook().resetAllState();

  try {
    // 跳轉到登入頁，保留當前路由用於登入後跳轉
    const currentPath = router.currentRoute.value.fullPath;
    await router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
  } catch (error) {
    console.error("Redirect to login error:", error);
    // 強制跳轉，即使路由重定向失敗
    window.location.href = "/login";
  } finally {
    redirectingToLogin = false;
  }
}
