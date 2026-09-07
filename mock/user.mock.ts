import { defineMock } from "./base";

export default defineMock([
  {
    url: "users/me",
    method: ["GET"],
    body: {
      code: "00000",
      data: {
        userId: "2",
        username: "admin",
        nickname: "系統管理員",
        avatar: "https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif",
        roles: ["ADMIN"],
        perms: [
          "sys:user:list",
          "sys:user:create",
          "sys:user:update",
          "sys:user:delete",
          "sys:user:import",
          "sys:user:export",
          "sys:user:reset-password",

          "sys:role:list",
          "sys:role:create",
          "sys:role:update",
          "sys:role:delete",

          "sys:dept:list",
          "sys:dept:create",
          "sys:dept:update",
          "sys:dept:delete",

          "sys:menu:list",
          "sys:menu:create",
          "sys:menu:update",
          "sys:menu:delete",

          "sys:notice:list",
          "sys:notice:create",
          "sys:notice:update",
          "sys:notice:delete",
          "sys:notice:revoke",
          "sys:notice:publish",
        ],
      },
      msg: "一切ok",
    },
  },

  {
    url: "users",
    method: ["GET"],
    body: {
      code: "00000",
      data: {
        list: [
          {
            id: "2",
            username: "admin",
            nickname: "系統管理員",
            mobile: "0912345678",
            gender: 1,
            avatar: "https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif",
            email: "",
            status: 1,
            deptId: "1",
            roleIds: [2],
          },
          {
            id: "3",
            username: "test",
            nickname: "測試小使用者",
            mobile: "0987654321",
            status: 1,
            deptId: "3",
            roleIds: [3],
          },
        ],
        total: 2,
      },
      msg: "一切ok",
    },
  },

  // 新增使用者
  {
    url: "users",
    method: ["POST"],
    body({ body }) {
      return {
        code: "00000",
        data: null,
        msg: "新增使用者" + body.nickname + "成功",
      };
    },
  },

  // 獲取使用者表單資料
  {
    url: "users/:userId/form",
    method: ["GET"],
    body: ({ params }) => {
      return {
        code: "00000",
        data: userMap[params.userId],
        msg: "一切ok",
      };
    },
  },
  // 修改使用者
  {
    url: "users/:userId",
    method: ["PUT"],
    body({ body }) {
      return {
        code: "00000",
        data: null,
        msg: "修改使用者" + body.nickname + "成功",
      };
    },
  },

  // 刪除使用者
  {
    url: "users/:userId",
    method: ["DELETE"],
    body({ params }) {
      return {
        code: "00000",
        data: null,
        msg: "刪除使用者" + params.userId + "成功",
      };
    },
  },

  // 重置密碼
  {
    url: "users/:userId/password/reset",
    method: ["PUT"],
    body({ query }) {
      return {
        code: "00000",
        data: null,
        msg: "重置密碼成功，新密碼為：" + query.password,
      };
    },
  },

  // 匯出Excel
  {
    url: "users/export",
    method: ["GET"],
    headers: {
      "Content-Disposition": "attachment; filename=%E7%94%A8%E6%88%B7%E5%88%97%E8%A1%A8.xlsx",
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  },

  {
    url: "users/profile",
    method: ["GET"],
    body: {
      code: "00000",
      data: {
        id: "2",
        username: "admin",
        nickname: "系統管理員",
        avatar: "https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif",
        gender: 1,
        mobile: "0912345678",
        email: null,
        deptName: "Example",
        roleNames: "系統管理員",
        createTime: "2019-10-10",
      },
    },
  },

  {
    url: "users/profile",
    method: ["PUT"],
    body() {
      return {
        code: "00000",
        data: null,
        msg: "修改個人資訊成功",
      };
    },
  },

  {
    url: "users/password",
    method: ["PUT"],
    body() {
      return {
        code: "00000",
        data: null,
        msg: "修改密碼成功",
      };
    },
  },
]);

// 使用者對映表資料
const userMap: Record<string, any> = {
  2: {
    id: "2",
    username: "admin",
    nickname: "系統管理員",
    mobile: "0912345678",
    gender: 1,
    avatar: "https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif",
    email: "",
    status: 1,
    deptId: "1",
    roleIds: [2],
  },
  3: {
    id: "3",
    username: "test",
    nickname: "測試小使用者",
    mobile: "0987654321",
    status: 1,
    deptId: "3",
    roleIds: [3],
  },
};
