/**
 * 登入請求引數
 */
export interface LoginRequest {
  /** 使用者名稱 */
  username: string;
  /** 密碼 */
  password: string;
  /** 驗證碼快取 key */
  captchaId?: string;
  /** 驗證碼 */
  captchaCode?: string;
  /** 記住我 */
  rememberMe?: boolean;
}

/**
 * 登入結果
 */
export interface LoginResult {
  /** 訪問令牌 */
  accessToken: string;
  /** 重新整理令牌 */
  refreshToken: string;
  /** 令牌型別 */
  tokenType: string;
  /** 過期時間(單位:秒) */
  expiresIn: number;
}

/**
 * 驗證碼資訊
 */
export interface CaptchaInfo {
  /** 驗證碼快取 key */
  captchaId: string;
  /** 驗證碼圖片 Base64 */
  captchaBase64: string;
}
