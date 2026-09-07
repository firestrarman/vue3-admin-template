/**
 * 儀表盤訪問統計型別定義
 */

/** 訪問趨勢查詢引數 */
export interface VisitTrendQueryParams {
  /** 開始日期 */
  startDate: string;
  /** 結束日期 */
  endDate: string;
}

/** 訪問趨勢檢視物件 */
export interface VisitTrendDetail {
  /** 日期列表 */
  dates: string[];
  /** 瀏覽量(PV)列表 */
  pvList: number[];
  /** 訪客數(UV)列表 */
  uvList: number[];
}

/** 訪問概覽檢視物件 */
export interface VisitOverviewDetail {
  /** 今日獨立訪客數(UV) */
  todayUvCount: number;
  /** 累計獨立訪客數(UV) */
  totalUvCount: number;
  /** 獨立訪客增長率 */
  uvGrowthRate: number;
  /** 今日頁面瀏覽量(PV) */
  todayPvCount: number;
  /** 累計頁面瀏覽量(PV) */
  totalPvCount: number;
  /** 頁面瀏覽量增長率 */
  pvGrowthRate: number;
}
