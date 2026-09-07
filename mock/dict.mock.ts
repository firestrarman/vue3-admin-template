import { defineMock } from "./base";

export default defineMock([
  {
    url: "dicts/:dictCode/items/options",
    method: ["GET"],
    body: ({ params }) => {
      const dictCode = params.dictCode;

      let list = null;

      if (dictCode === "gender") {
        list = [
          {
            value: "1",
            label: "男",
          },
          {
            value: "2",
            label: "女",
          },
          {
            value: "0",
            label: "保密",
          },
        ];
      } else if (dictCode === "notice_level") {
        list = [
          {
            value: "L",
            label: "低",
            tagType: "I",
          },
          {
            value: "M",
            label: "中",
            tagType: "W",
          },
          {
            value: "H",
            label: "高",
            tagType: "D",
          },
        ];
      } else if (dictCode === "notice_type") {
        list = [
          {
            value: "1",
            label: "系統升級",
            tagType: "S",
          },
          {
            value: "2",
            label: "系統維護",
            tagType: "P",
          },
          {
            value: "3",
            label: "安全警告",
            tagType: "D",
          },
          {
            value: "4",
            label: "假期通知",
            tagType: "S",
          },
          {
            value: "5",
            label: "公司新聞",
            tagType: "P",
          },
          {
            value: "99",
            label: "其他",
            tagType: "I",
          },
        ];
      }

      return {
        code: "00000",
        data: list,
        msg: "一切ok",
      };
    },
  },
]);
