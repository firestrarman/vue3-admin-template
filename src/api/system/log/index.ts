import request from "@/api/request";
import type { VisitTrendQueryParams, VisitTrendDetail, VisitOverviewDetail } from "./types";

const LOG_BASE_URL = "/api/v1/logs";

const LogAPI = {
  // 獲取訪問趨勢統計
  getVisitTrend(queryParams: VisitTrendQueryParams) {
    return request<unknown, VisitTrendDetail>({
      url: `${LOG_BASE_URL}/analytics/trend`,
      method: "get",
      params: queryParams,
    });
  },

  // 獲取訪問概覽統計
  getVisitOverview() {
    return request<unknown, VisitOverviewDetail>({
      url: `${LOG_BASE_URL}/analytics/overview`,
      method: "get",
    });
  },
};

export default LogAPI;

// 重匯出型別
export * from "./types";
