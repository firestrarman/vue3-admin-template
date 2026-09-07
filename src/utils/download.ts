/**
 * 檔案下載工具函式
 */

/**
 * 從響應頭中提取檔名
 * @param contentDisposition Content-Disposition 響應頭
 * @returns 解碼後的檔名
 */
function extractFileName(contentDisposition: string): string {
  if (!contentDisposition) {
    return `download_${Date.now()}`;
  }

  // 嘗試從 filename*=UTF-8'' 格式中提取
  const filenameRegex = /filename\*=UTF-8''(.+)/;
  const matches = filenameRegex.exec(contentDisposition);
  if (matches && matches[1]) {
    return decodeURIComponent(matches[1]);
  }

  // 嘗試從 filename= 格式中提取
  const fallbackRegex = /filename=([^;]+)/;
  const fallbackMatches = fallbackRegex.exec(contentDisposition);
  if (fallbackMatches && fallbackMatches[1]) {
    return decodeURI(fallbackMatches[1].replace(/"/g, ""));
  }

  return `download_${Date.now()}`;
}

/**
 * 下載檔案
 * @param response Axios 響應物件
 * @param customFileName 自定義檔名（可選）
 *
 * @example
 * ```ts
 * // 基礎用法
 * const response = await UserAPI.export(queryParams);
 * downloadFile(response);
 *
 * // 自定義檔名
 * downloadFile(response, "使用者列表.xlsx");
 * ```
 */
export function downloadFile(response: { data: any; headers: any }, customFileName?: string): void {
  try {
    const fileData = response.data;
    const contentDisposition = response.headers["content-disposition"];
    const fileName = customFileName || extractFileName(contentDisposition);

    // 建立 Blob 物件
    const blob = new Blob([fileData]);

    // 建立下載連結
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName;

    // 觸發下載
    document.body.appendChild(link);
    link.click();

    // 清理
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("檔案下載失敗:", error);
    throw error;
  }
}
