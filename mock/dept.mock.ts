import { defineMock } from "./base";

export default defineMock([
  {
    url: "depts/options",
    method: ["GET"],
    body: {
      code: "00000",
      data: [
        {
          value: "1",
          label: "Example",
          children: [
            {
              value: "2",
              label: "研發部門",
            },
            {
              value: "3",
              label: "測試部門",
            },
          ],
        },
      ],
      msg: "一切ok",
    },
  },

  {
    url: "depts",
    method: ["GET"],
    body: {
      code: "00000",
      data: [
        {
          id: "1",
          parentId: "0",
          name: "Example",
          code: "EXAMPLE",
          sort: 1,
          status: 1,
          children: [
            {
              id: "2",
              parentId: "1",
              name: "研發部門",
              code: "RD001",
              sort: 1,
              status: 1,
              children: [],
              createTime: null,
              updateTime: "2022-04-19 12:46",
            },
            {
              id: "3",
              parentId: "1",
              name: "測試部門",
              code: "QA001",
              sort: 1,
              status: 1,
              children: [],
              createTime: null,
              updateTime: "2022-04-19 12:46",
            },
          ],
          createTime: null,
          updateTime: null,
        },
      ],
      msg: "一切ok",
    },
  },

  // 新增部門
  {
    url: "depts",
    method: ["POST"],
    body({ body }) {
      return {
        code: "00000",
        data: null,
        msg: "新增部門" + body.name + "成功",
      };
    },
  },

  // 獲取部門表單資料
  {
    url: "depts/:id/form",
    method: ["GET"],
    body: ({ params }) => {
      return {
        code: "00000",
        data: deptMap[params.id],
        msg: "一切ok",
      };
    },
  },

  // 修改部門
  {
    url: "depts/:id",
    method: ["PUT"],
    body({ body }) {
      return {
        code: "00000",
        data: null,
        msg: "修改部門" + body.name + "成功",
      };
    },
  },

  // 刪除部門
  {
    url: "depts/:id",
    method: ["DELETE"],
    body({ params }) {
      return {
        code: "00000",
        data: null,
        msg: "刪除部門" + params.id + "成功",
      };
    },
  },
]);

// 部門對映表資料
const deptMap: Record<string, any> = {
  1: {
    id: "1",
    name: "Example",
    code: "EXAMPLE",
    parentId: "0",
    status: 1,
    sort: 1,
  },
  2: {
    id: "2",
    name: "研發部門",
    code: "RD001",
    parentId: "1",
    status: 1,
    sort: 1,
  },
  3: {
    id: "3",
    name: "測試部門",
    code: "QA001",
    parentId: "1",
    status: 1,
    sort: 1,
  },
};
