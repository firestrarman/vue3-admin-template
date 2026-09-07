import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from "axios";
import qs from "qs";

import { ApiCodeEnum } from "@/enums/api";
import { useUserStoreHook } from "@/stores/user";
import { usePermissionStoreHook } from "@/stores/permission";
import { AuthStorage, redirectToLogin } from "@/utils/auth";
import type { ApiResult } from "@/api/common";

// 防止同一請求在 token 重新整理後重複進入重試，導致死迴圈
const retriedRequests = new WeakSet<InternalAxiosRequestConfig>();

const http = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
  // 陣列引數序列化為 ids=1&ids=2，而非 ids[]=1&ids[]=2
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
});

http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = AuthStorage.getAccessToken();

    // 約定：呼叫方設定 Authorization 為 "no-auth" 即跳過 token 注入
    if (config.headers.Authorization === "no-auth") {
      delete config.headers.Authorization;
    } else if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

http.interceptors.response.use(
  (response: AxiosResponse<ApiResult>): AxiosResponse | any => {
    const { responseType } = response.config;

    // 二進位資料直接透傳
    if (responseType === "blob" || responseType === "arraybuffer") {
      return response;
    }

    const { code, data, msg } = response.data;

    if (code === ApiCodeEnum.SUCCESS) {
      return data;
    }

    ElMessage.error(msg || "系統出錯");
    return Promise.reject(new Error(msg || "系統出錯"));
  },

  async (error) => {
    const { config, response } = error;

    if (!response) {
      ElMessage.error("網路連線失敗");
      return Promise.reject(error);
    }

    const { code, msg } = response.data as ApiResult;

    // Token 過期
    if (code === ApiCodeEnum.ACCESS_TOKEN_INVALID) {
      if (!config || retriedRequests.has(config)) {
        await redirectToLogin("登入已過期，請重新登入");
        return Promise.reject(new Error("Token Invalid"));
      }

      retriedRequests.add(config);

      try {
        const userStore = useUserStoreHook();
        await userStore.refreshTokenOnce();

        const token = AuthStorage.getAccessToken();
        if (token) {
          config.headers.set("Authorization", `Bearer ${token}`);
        }

        return http(config);
      } catch {
        await redirectToLogin("登入已過期，請重新登入");
        return Promise.reject(new Error("Token refresh failed"));
      }
    }

    // Refresh token 失效
    if (code === ApiCodeEnum.REFRESH_TOKEN_INVALID) {
      await redirectToLogin("登入已過期，請重新登入", false);
      return Promise.reject(new Error("Token Invalid"));
    }

    // 權限不足
    if (code === ApiCodeEnum.PERMISSION_DENIED) {
      const permissionStore = usePermissionStoreHook();
      await permissionStore.refreshPermissions();
      ElMessage.error(msg || "權限不足");
      return Promise.reject(new Error(msg || "權限不足"));
    }

    ElMessage.error(msg || "請求失敗");
    return Promise.reject(new Error(msg || "請求失敗"));
  }
);

export default http;
