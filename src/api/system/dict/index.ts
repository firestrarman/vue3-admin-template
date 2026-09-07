import request from "@/api/request";
import type { DictItemOption } from "./types";

const DICT_BASE_URL = "/api/v1/dicts";

type DictTagType = DictItemOption["tagType"];
type DictTagTypeCode = "N" | "P" | "S" | "W" | "I" | "D";

/** 將後端標籤型別轉換為前端標籤型別 */
function decodeDictTagType(code?: unknown): DictTagType {
  const val = String(code ?? "")
    .trim()
    .toUpperCase();
  switch (val as DictTagTypeCode) {
    case "P":
      return "primary";
    case "S":
      return "success";
    case "W":
      return "warning";
    case "I":
      return "info";
    case "D":
      return "danger";
    case "N":
    default:
      return "";
  }
}

const DictAPI = {
  // 獲取字典項列表
  getDictItems(dictCode: string) {
    return request<unknown, DictItemOption[]>({
      url: `${DICT_BASE_URL}/${dictCode}/items/options`,
      method: "get",
    }).then((items) =>
      (items ?? []).map((item) => ({
        ...item,
        tagType: decodeDictTagType(item.tagType),
      }))
    );
  },
};

export default DictAPI;

export * from "./types";
