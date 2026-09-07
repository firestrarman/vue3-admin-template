/**
 * 資料格式化相關工具函式
 */

/**
 * 格式化增長率
 * 保留兩位小數，去掉末尾的 0，取絕對值
 *
 * @param growthRate 增長率（小數形式，如 0.15 表示 15%）
 * @returns 格式化後的增長率字串
 *
 * @example
 * ```ts
 * formatGrowthRate(0.1234);  // "12.34%"
 * formatGrowthRate(0.1000);  // "10%"
 * formatGrowthRate(0);       // "-"
 * formatGrowthRate(-0.05);   // "5%"（取絕對值）
 * ```
 */
export function formatGrowthRate(growthRate: number): string {
  if (growthRate === 0) {
    return "-";
  }

  const formattedRate = Math.abs(growthRate * 100)
    .toFixed(2)
    .replace(/\.?0+$/, "");

  return formattedRate + "%";
}

/**
 * 格式化檔案大小
 * @param bytes 位元組數
 * @param decimals 保留小數位數，預設 2
 * @returns 格式化後的檔案大小字串
 *
 * @example
 * ```ts
 * formatFileSize(1024);      // "1 KB"
 * formatFileSize(1048576);   // "1 MB"
 * formatFileSize(1234567);   // "1.18 MB"
 * ```
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i];
}

/**
 * 格式化數字，新增千分位分隔符
 * @param num 數字
 * @returns 格式化後的字串
 *
 * @example
 * ```ts
 * formatNumber(1234567);     // "1,234,567"
 * formatNumber(1234567.89);  // "1,234,567.89"
 * ```
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * 格式化金額（人民幣）
 * @param amount 金額
 * @param decimals 保留小數位數，預設 2
 * @returns 格式化後的金額字串
 *
 * @example
 * ```ts
 * formatCurrency(1234567);      // "¥1,234,567.00"
 * formatCurrency(1234567.8);    // "¥1,234,567.80"
 * formatCurrency(1234567, 0);   // "¥1,234,567"
 * ```
 */
export function formatCurrency(amount: number, decimals: number = 2): string {
  const formatted = amount.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return "¥" + formatted;
}
