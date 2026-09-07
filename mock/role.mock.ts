import { defineMock } from "./base";

export default defineMock([
  {
    url: "roles/options",
    method: ["GET"],
    body: {
      code: "00000",
      data: [
        { value: "2", label: "系統管理員" },
        { value: "4", label: "部門主管" },
        { value: "5", label: "部門成員" },
        { value: "6", label: "普通員工" },
        { value: "7", label: "自定義權限使用者" },
        { value: "3", label: "訪問遊客" },
      ],
      msg: "一切ok",
    },
  },

  {
    url: "roles",
    method: ["GET"],
    body: {
      code: "00000",
      data: {
        list: [
          {
            id: "2",
            name: "系統管理員",
            code: "ADMIN",
            status: 1,
            sort: 2,
            dataScope: 1,
            createTime: "2021-03-25 12:39:54",
            updateTime: null,
          },
          {
            id: "3",
            name: "訪問遊客",
            code: "GUEST",
            status: 1,
            sort: 3,
            dataScope: 3,
            createTime: "2021-05-26 15:49:05",
            updateTime: "2019-05-05 16:00:00",
          },
          {
            id: "4",
            name: "部門主管",
            code: "DEPT_MANAGER",
            status: 1,
            sort: 4,
            dataScope: 2,
            createTime: "2021-03-25 12:39:54",
            updateTime: null,
          },
          {
            id: "5",
            name: "部門成員",
            code: "DEPT_MEMBER",
            status: 1,
            sort: 5,
            dataScope: 3,
            createTime: "2021-03-25 12:39:54",
            updateTime: null,
          },
          {
            id: "6",
            name: "普通員工",
            code: "EMPLOYEE",
            status: 1,
            sort: 6,
            dataScope: 4,
            createTime: "2021-03-25 12:39:54",
            updateTime: null,
          },
          {
            id: "7",
            name: "自定義權限使用者",
            code: "CUSTOM_USER",
            status: 1,
            sort: 7,
            dataScope: 5,
            createTime: "2021-03-25 12:39:54",
            updateTime: null,
          },
        ],
        total: 6,
      },
      msg: "一切ok",
    },
  },

  // 新增角色
  {
    url: "roles",
    method: ["POST"],
    body({ body }) {
      return {
        code: "00000",
        data: null,
        msg: "新增角色" + body.name + "成功",
      };
    },
  },

  // 獲取角色表單資料
  {
    url: "roles/:id/form",
    method: ["GET"],
    body: ({ params }) => {
      return {
        code: "00000",
        data: roleMap[params.id],
        msg: "一切ok",
      };
    },
  },
  // 修改角色
  {
    url: "roles/:id",
    method: ["PUT"],
    body({ body }) {
      return {
        code: "00000",
        data: null,
        msg: "修改角色" + body.name + "成功",
      };
    },
  },

  // 刪除角色
  {
    url: "roles/:id",
    method: ["DELETE"],
    body({ params }) {
      return {
        code: "00000",
        data: null,
        msg: "刪除角色" + params.id + "成功",
      };
    },
  },
  // 獲取角色擁有的選單ID
  {
    url: "roles/:id/menu-ids",
    method: ["GET"],
    body: () => {
      return {
        code: "00000",
        data: [
          1, 2, 31, 32, 33, 88, 3, 70, 71, 72, 4, 73, 75, 74, 5, 76, 77, 78, 6, 79, 81, 84, 85, 86,
          87, 40, 41, 26, 30, 20, 21, 22, 23, 24, 89, 90, 91, 36, 37, 38, 39, 93, 94, 95, 97, 102,
          89, 90, 91, 93, 94, 95, 97, 102, 103, 104,
        ],
        msg: "一切ok",
      };
    },
  },
  // 儲存角色選單
  {
    url: "roles/:id/menus",
    method: ["PUT"],
    body: {
      code: "00000",
      data: null,
      msg: "一切ok",
    },
  },
]);

// 角色對映表資料
const roleMap: Record<string, any> = {
  2: {
    id: "2",
    name: "系統管理員",
    code: "ADMIN",
    status: 1,
    sort: 2,
    dataScope: 1,
    createTime: "2021-03-25 12:39:54",
    updateTime: null,
  },
  3: {
    id: "3",
    name: "訪問遊客",
    code: "GUEST",
    status: 1,
    sort: 3,
    dataScope: 3,
    createTime: "2021-05-26 15:49:05",
    updateTime: "2019-05-05 16:00:00",
  },
  4: {
    id: "4",
    name: "部門主管",
    code: "DEPT_MANAGER",
    status: 1,
    sort: 4,
    dataScope: 2,
    createTime: "2021-03-25 12:39:54",
    updateTime: null,
  },
  5: {
    id: "5",
    name: "部門成員",
    code: "DEPT_MEMBER",
    status: 1,
    sort: 5,
    dataScope: 3,
    createTime: "2021-03-25 12:39:54",
    updateTime: null,
  },
  6: {
    id: "6",
    name: "普通員工",
    code: "EMPLOYEE",
    status: 1,
    sort: 6,
    dataScope: 4,
    createTime: "2021-03-25 12:39:54",
    updateTime: null,
  },
  7: {
    id: "7",
    name: "自定義權限使用者",
    code: "CUSTOM_USER",
    status: 1,
    sort: 7,
    dataScope: 5,
    deptIds: [1, 2],
    createTime: "2021-03-25 12:39:54",
    updateTime: null,
  },
};
