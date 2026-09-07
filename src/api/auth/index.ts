import request from "@/api/request";
import type { CaptchaInfo, LoginRequest, LoginResult } from "./types";

const AUTH_BASE_URL = "/api/v1/auth";

const AuthAPI = {
  // 登入
  login(data: LoginRequest) {
    const payload: Pick<LoginRequest, "username" | "password" | "captchaId" | "captchaCode"> = {
      username: data.username,
      password: data.password,
      captchaId: data.captchaId,
      captchaCode: data.captchaCode,
    };

    return request<unknown, LoginResult>({
      url: `${AUTH_BASE_URL}/login`,
      method: "post",
      data: payload,
    });
  },

  // 刷新Token
  refreshToken(refreshToken: string) {
    return request<unknown, LoginResult>({
      url: `${AUTH_BASE_URL}/refresh-token`,
      method: "post",
      params: { refreshToken },
      headers: {
        Authorization: "no-auth",
      },
    });
  },

  // 登出
  logout() {
    return request({
      url: `${AUTH_BASE_URL}/logout`,
      method: "delete",
    });
  },

  // 獲取驗證碼
  getCaptcha() {
    return request<unknown, CaptchaInfo>({
      url: `${AUTH_BASE_URL}/captcha`,
      method: "get",
    });
  },
};

export default AuthAPI;

// 重匯出型別
export * from "./types";
