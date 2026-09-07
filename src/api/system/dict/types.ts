/** 字典項選項 */
export interface DictItemOption {
  // 字典項值
  value: number | string;
  // 字典項標籤
  label: string;
  // 標籤型別
  tagType?: "success" | "warning" | "info" | "primary" | "danger" | "";
}
