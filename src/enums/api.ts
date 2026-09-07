/**
 * API 響應碼列舉
 */
export const enum ApiCodeEnum {
  // 成功
  SUCCESS = "00000",
  // 訪問令牌無效或過期
  ACCESS_TOKEN_INVALID = "A0230",
  // 重新整理令牌無效或過期
  REFRESH_TOKEN_INVALID = "A0231",
  // 權限不足
  PERMISSION_DENIED = "A0301",
}
