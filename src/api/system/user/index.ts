import request from "@/api/request";
import type {
  UserInfo,
  UserForm,
  UserQueryParams,
  UserItem,
  UserProfileDetail,
  UserProfileForm,
  PasswordChangeForm,
  PasswordVerifyForm,
  MobileUpdateForm,
  EmailUpdateForm,
} from "./types";
import type { ExcelResult, OptionItem, PageResult } from "@/api/common";

const USER_BASE_URL = "/api/v1/users";

const UserAPI = {
  /**
   * 獲取當前登入使用者資訊
   * @returns 登入使用者暱稱、頭像資訊，包括角色和權限
   */
  getInfo() {
    return request<unknown, UserInfo>({
      url: `${USER_BASE_URL}/me`,
      method: "get",
    });
  },

  /**
   * 獲取使用者分頁列表
   * @param queryParams 查詢引數
   */
  getPage(queryParams: UserQueryParams) {
    return request<unknown, PageResult<UserItem>>({
      url: `${USER_BASE_URL}`,
      method: "get",
      params: queryParams,
    });
  },

  /**
   * 獲取使用者表單詳情
   * @param userId 使用者ID
   * @returns 使用者表單詳情
   */
  getFormData(userId: string) {
    return request<unknown, UserForm>({
      url: `${USER_BASE_URL}/${userId}/form`,
      method: "get",
    });
  },

  /**
   * 新增使用者
   * @param data 使用者表單資料
   */
  create(data: UserForm) {
    return request({
      url: `${USER_BASE_URL}`,
      method: "post",
      data,
    });
  },

  /**
   * 修改使用者
   * @param id 使用者ID
   * @param data 使用者表單資料
   */
  update(id: string, data: UserForm) {
    return request({
      url: `${USER_BASE_URL}/${id}`,
      method: "put",
      data,
    });
  },

  /**
   * 修改使用者密碼
   * @param id 使用者ID
   * @param password 新密碼
   */
  resetPassword(id: string, password: string) {
    return request({
      url: `${USER_BASE_URL}/${id}/password/reset`,
      method: "put",
      params: { password },
    });
  },

  /**
   * 批次刪除使用者，多個以英文逗號(,)分割
   * @param ids 使用者ID字串，多個以英文逗號(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${USER_BASE_URL}/${ids}`,
      method: "delete",
    });
  },

  /** 下載使用者匯入模板 */
  downloadTemplate() {
    return request({
      url: `${USER_BASE_URL}/template`,
      method: "get",
      responseType: "blob",
    });
  },

  /**
   * 匯出使用者
   * @param queryParams 查詢引數
   */
  export(queryParams: UserQueryParams) {
    return request({
      url: `${USER_BASE_URL}/export`,
      method: "get",
      params: queryParams,
      responseType: "blob",
    });
  },

  /**
   * 匯入使用者
   * @param file 匯入檔案
   */
  import(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return request<unknown, ExcelResult>({
      url: `${USER_BASE_URL}/import`,
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // 獲取個人中心使用者資訊
  getProfile() {
    return request<unknown, UserProfileDetail>({
      url: `${USER_BASE_URL}/profile`,
      method: "get",
    });
  },

  // 修改個人中心使用者資訊
  updateProfile(data: UserProfileForm) {
    return request({
      url: `${USER_BASE_URL}/profile`,
      method: "put",
      data,
    });
  },

  // 修改個人中心使用者密碼
  changePassword(data: PasswordChangeForm) {
    return request({
      url: `${USER_BASE_URL}/password`,
      method: "put",
      data,
    });
  },

  // 傳送簡訊驗證碼（繫結或更換手機號）
  sendMobileCode(mobile: string) {
    return request({
      url: `${USER_BASE_URL}/mobile/code`,
      method: "post",
      params: { mobile },
    });
  },

  // 繫結或更換手機號
  bindOrChangeMobile(data: MobileUpdateForm) {
    return request({
      url: `${USER_BASE_URL}/mobile`,
      method: "put",
      data,
    });
  },

  // 解綁手機號
  unbindMobile(data: PasswordVerifyForm) {
    return request({
      url: `${USER_BASE_URL}/mobile`,
      method: "delete",
      data,
    });
  },

  // 傳送郵箱驗證碼（繫結或更換郵箱）
  sendEmailCode(email: string) {
    return request({
      url: `${USER_BASE_URL}/email/code`,
      method: "post",
      params: { email },
    });
  },

  // 繫結或更換郵箱
  bindOrChangeEmail(data: EmailUpdateForm) {
    return request({
      url: `${USER_BASE_URL}/email`,
      method: "put",
      data,
    });
  },

  // 解綁郵箱
  unbindEmail(data: PasswordVerifyForm) {
    return request({
      url: `${USER_BASE_URL}/email`,
      method: "delete",
      data,
    });
  },

  // 獲取使用者下拉選單
  getOptions() {
    return request<unknown, OptionItem[]>({
      url: `${USER_BASE_URL}/options`,
      method: "get",
    });
  },
};

export default UserAPI;

// 重匯出型別
export * from "./types";
