/**
 * User 使用者型別定義
 */

import type { BaseQueryParams } from "@/api/common";

/** 登入使用者資訊 */
export interface UserInfo {
  // 使用者ID
  userId?: string;
  // 使用者名稱
  username?: string;
  // 使用者暱稱
  nickname?: string;
  // 頭像URL
  avatar?: string;
  // 角色集合
  roles: string[];
  // 權限集合
  perms: string[];
}

/** 使用者分頁查詢引數 */
export interface UserQueryParams extends BaseQueryParams {
  // 搜尋關鍵字
  keywords?: string;
  // 使用者狀態
  status?: number;
  // 部門ID
  deptId?: string;
  // 建立時間
  createTime?: [string, string];
}

/** 使用者分頁物件 */
export interface UserItem {
  // 使用者ID
  id: string;
  // 使用者頭像地址
  avatar?: string;
  // 建立時間
  createTime?: Date;
  // 部門名稱
  deptName?: string;
  // 使用者郵箱
  email?: string;
  // 性別
  gender?: number;
  // 手機號
  mobile?: string;
  // 使用者暱稱
  nickname?: string;
  // 角色名稱，多個使用英文逗號(,)分割
  roleNames?: string;
  // 使用者狀態(1:啟用;0:禁用)
  status?: number;
  // 使用者名稱
  username?: string;
}

/** 使用者表單物件 */
export interface UserForm {
  // 使用者ID
  id?: string;
  // 使用者頭像
  avatar?: string;
  // 部門ID
  deptId?: string;
  // 使用者郵箱
  email?: string;
  // 性別
  gender?: number;
  // 手機號
  mobile?: string;
  // 使用者暱稱
  nickname?: string;
  // 角色ID集合
  roleIds?: number[];
  // 使用者狀態(1:正常;0:禁用)
  status?: number;
  // 使用者名稱
  username?: string;
}

/** 個人中心使用者資訊 */
export interface UserProfileDetail {
  // 使用者ID
  id?: string;
  // 使用者名稱
  username?: string;
  // 使用者暱稱
  nickname?: string;
  // 頭像URL
  avatar?: string;
  // 性別
  gender?: number;
  // 手機號
  mobile?: string;
  // 郵箱
  email?: string;
  // 部門名稱
  deptName?: string;
  // 角色名稱
  roleNames?: string;
  // 建立時間
  createTime?: Date;
}

/** 個人中心使用者資訊表單 */
export interface UserProfileForm {
  // 使用者暱稱
  nickname?: string;
  // 頭像URL
  avatar?: string;
  // 性別
  gender?: number;
}

/** 修改密碼錶單 */
export interface PasswordChangeForm {
  // 原密碼
  oldPassword?: string;
  // 新密碼
  newPassword?: string;
  // 確認新密碼
  confirmPassword?: string;
}

/** 密碼校驗表單 */
export interface PasswordVerifyForm {
  // 當前密碼
  password?: string;
}

/** 修改手機表單 */
export interface MobileUpdateForm {
  // 手機號
  mobile?: string;
  // 驗證碼
  code?: string;
  // 當前密碼
  password?: string;
}

/** 修改郵箱表單 */
export interface EmailUpdateForm {
  // 郵箱
  email?: string;
  // 驗證碼
  code?: string;
  // 當前密碼
  password?: string;
}
