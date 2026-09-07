/**
 * Notice 通知型別定義
 */

import type { BaseQueryParams } from "@/api/common";

/** 通知分頁查詢引數 */
export interface NoticeQueryParams extends BaseQueryParams {
  /** 通知標題 */
  title?: string;
  /** 釋出狀態(0:草稿;1:已釋出;2:已撤回) */
  publishStatus?: number;
  /** 是否已讀(1:是;0:否) */
  isRead?: number;
}

/** 通知表單物件 */
export interface NoticeForm {
  /** 通知ID */
  id?: string;
  /** 通知標題 */
  title?: string;
  /** 通知內容 */
  content?: string;
  /** 通知型別 */
  type?: number;
  /** 通知等級 */
  level?: string;
  /** 釋出狀態(0:草稿;1:已釋出;-1:已撤回) */
  status?: number;
  /** 目標使用者ID列表 */
  targetUsers?: number[];
  /** 目標型別 (1:全部,2:指定使用者等) */
  targetType?: number;
}

/** 通知分頁物件 */
export interface NoticeItem {
  /** 通知ID */
  id: string;
  /** 通知標題 */
  title: string;
  /** 通知內容 */
  content: string;
  /** 通知型別 */
  type: number;
  /** 通知等級 */
  level: string;
  /** 釋出狀態 */
  publishStatus: number;
  /** 是否已讀 */
  isRead: number;
  /** 目標型別 (1:全部,2:指定使用者等) */
  targetType?: number;
  /** 釋出人名稱 */
  publisherName?: string;
  /** 建立時間 */
  createTime?: Date | string;
  /** 釋出時間 */
  publishTime?: Date;
  /** 撤回時間 */
  revokeTime?: Date;
}

/** 通知詳情物件 */
export interface NoticeDetail {
  /** 通知ID */
  id?: string;
  /** 通知標題 */
  title?: string;
  /** 通知內容 */
  content?: string;
  /** 通知型別 */
  type?: number;
  /** 通知等級 */
  level?: string;
  /** 釋出狀態 */
  publishStatus?: number;
  /** 目標使用者ID */
  targetUserIds?: string;
  /** 釋出人名稱 */
  publisherName?: string;
  /** 釋出時間 */
  publishTime?: Date;
}
