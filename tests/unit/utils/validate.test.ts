import { describe, expect, it } from "vitest";
import {
  isEmail,
  isExternal,
  isMobile,
  isValidURL,
  MOBILE_PATTERN,
  VALIDATORS,
} from "@/utils/validate";

describe("utils/validate", () => {
  describe("isExternal", () => {
    it.each([
      ["https://example.com", true],
      ["http://example.com", true],
      ["mailto:admin@example.com", true],
      ["tel:123456", true],
      ["/dashboard", false],
      ["dashboard", false],
      ["", false],
    ])("isExternal(%j) -> %s", (path, expected) => {
      expect(isExternal(path)).toBe(expected);
    });
  });

  describe("isValidURL", () => {
    it("接受標準 URL", () => {
      expect(isValidURL("https://example.com")).toBe(true);
    });

    it("拒絕非 URL 字串", () => {
      expect(isValidURL("not a url")).toBe(false);
    });
  });

  describe("isEmail", () => {
    it("接受常見郵箱格式", () => {
      expect(isEmail("user@example.com")).toBe(true);
    });

    it("拒絕缺少網域的字串", () => {
      expect(isEmail("user@")).toBe(false);
    });
  });

  describe("isMobile", () => {
    it.each([
      ["0912345678", true],
      ["0987654321", true],
      ["0900123456", true],
      ["13800138000", false],
      ["0223456789", false],
      ["0812345678", false],
      ["091234567", false],
      ["09123456789", false],
      ["", false],
    ])("isMobile(%j) -> %s", (mobile, expected) => {
      expect(isMobile(mobile)).toBe(expected);
    });
  });

  describe("VALIDATORS", () => {
    it("required() 回傳必填規則", () => {
      const rule = VALIDATORS.required("請輸入名稱");

      expect(rule).toMatchObject({
        required: true,
        message: "請輸入名稱",
        trigger: "blur",
      });
    });

    it("mobile 使用台灣手機號碼規則", () => {
      expect(VALIDATORS.mobile.pattern).toEqual(MOBILE_PATTERN);
    });
  });
});
