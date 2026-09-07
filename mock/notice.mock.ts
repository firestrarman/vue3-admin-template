import { defineMock } from "./base";

export default defineMock([
  {
    url: "notices",
    method: ["GET"],
    body: {
      code: "00000",
      data: {
        list: [
          {
            id: "1",
            title: "v2.12.0 新增系統日誌，訪問趨勢統計功能。",
            publishStatus: 1,
            type: 1,
            publisherName: "系統管理員",
            level: "L",
            publishTime: "2024-09-30 17:21",
            isRead: null,
            targetType: 1,
            createTime: "2024-09-28 11:21",
            revokeTime: "2024-09-30 17:21",
          },
          {
            id: "2",
            title: "v2.13.0 新增選單搜尋。",
            publishStatus: 1,
            type: 1,
            publisherName: "系統管理員",
            level: "L",
            publishTime: "2024-09-30 17:22",
            isRead: null,
            targetType: 1,
            createTime: "2024-09-28 11:21",
            revokeTime: "2024-09-30 17:21",
          },
          {
            id: "3",
            title: "\r\nv2.14.0 新增個人中心。",
            publishStatus: 1,
            type: 1,
            publisherName: "系統管理員",
            level: "L",
            publishTime: "2024-09-30 17:23",
            isRead: null,
            targetType: 1,
            createTime: "2024-09-28 11:21",
            revokeTime: "2024-09-30 17:21",
          },
          {
            id: "4",
            title: "v2.15.0 登入頁面改造。",
            publishStatus: 1,
            type: 1,
            publisherName: "系統管理員",
            level: "L",
            publishTime: "2024-09-30 17:24",
            isRead: null,
            targetType: 1,
            createTime: "2024-09-28 11:21",
            revokeTime: "2024-09-30 17:21",
          },
          {
            id: "5",
            title: "v2.16.0 通知公告、字典翻譯元件。",
            publishStatus: 1,
            type: 1,
            publisherName: "系統管理員",
            level: "L",
            publishTime: "2024-09-30 17:25",
            isRead: null,
            targetType: 1,
            createTime: "2024-09-28 11:21",
            revokeTime: "2024-09-30 17:21",
          },
          {
            id: "6",
            title: "系統將於本週六凌晨 2 點進行維護，預計維護時間為 2 小時。",
            publishStatus: 1,
            type: 2,
            publisherName: "系統管理員",
            level: "L",
            publishTime: "2024-09-30 17:26",
            isRead: null,
            targetType: 1,
            createTime: "2024-09-28 11:21",
            revokeTime: "2024-09-30 17:21",
          },
          {
            id: "7",
            title: "最近發現一些釣魚郵件，請大家提高警惕，不要點選陌生連結。",
            publishStatus: 1,
            type: 3,
            publisherName: "系統管理員",
            level: "L",
            publishTime: "2024-09-30 17:27",
            isRead: null,
            targetType: 1,
            createTime: "2024-09-28 11:21",
            revokeTime: "2024-09-30 17:21",
          },
          {
            id: "8",
            title: "國慶假期從 10 月 1 日至 10 月 7 日放假，共 7 天。",
            publishStatus: 1,
            type: 4,
            publisherName: "系統管理員",
            level: "L",
            publishTime: "2024-09-30 17:28",
            isRead: null,
            targetType: 1,
            createTime: "2024-09-28 11:21",
            revokeTime: "2024-09-30 17:21",
          },
          {
            id: "9",
            title: "公司將在 10 月 15 日舉辦新產品釋出會，敬請期待。",
            publishStatus: 1,
            type: 5,
            publisherName: "系統管理員",
            level: "L",
            publishTime: "2024-09-30 17:29",
            isRead: null,
            targetType: 1,
            createTime: "2024-09-28 11:21",
            revokeTime: "2024-09-30 17:21",
          },
          {
            id: "10",
            title:
              "v2.16.1 版本修復了 WebSocket 重複連線導致的後臺執行緒阻塞問題，最佳化了通知公告。",
            publishStatus: 1,
            type: 1,
            publisherName: "系統管理員",
            level: "L",
            publishTime: "2024-09-30 17:30",
            isRead: null,
            targetType: 1,
            createTime: "2024-09-28 11:21",
            revokeTime: "2024-09-30 17:21",
          },
        ],
        total: 10,
      },
      msg: "一切ok",
    },
  },

  // 新增通知
  {
    url: "notices",
    method: ["POST"],
    body() {
      return {
        code: "00000",
        data: null,
        msg: "新增成功",
      };
    },
  },

  // 獲取通知表單資料
  {
    url: "notices/:id/form",
    method: ["GET"],
    body: ({ params }) => {
      return {
        code: "00000",
        data: noticeMap[params.id],
        msg: "一切ok",
      };
    },
  },

  // 獲取通知詳情
  {
    url: "notices/:id/detail",
    method: ["GET"],
    body: ({ params }) => {
      const myNotice = myNoticeList.find((item) => item.id === params.id);
      if (myNotice) myNotice.isRead = 1;
      if (noticeMap[params.id]) noticeMap[params.id].isRead = 1;

      return {
        code: "00000",
        data: noticeMap[params.id],
        msg: "一切ok",
      };
    },
  },
  // 全部已讀
  {
    url: "notices/read-all",
    method: ["PUT"],
    body() {
      myNoticeList.forEach((item) => {
        item.isRead = 1;
      });

      return {
        code: "00000",
        data: null,
        msg: "全部已讀成功",
      };
    },
  },
  // 修改通知
  {
    url: "notices/:id",
    method: ["PUT"],
    body({ body }) {
      return {
        code: "00000",
        data: null,
        msg: "修改通知" + body.title + "成功",
      };
    },
  },

  // 刪除通知
  {
    url: "notices/:id",
    method: ["DELETE"],
    body({ params }) {
      return {
        code: "00000",
        data: null,
        msg: "刪除通知" + params.id + "成功",
      };
    },
  },

  // 我的通知分頁列表
  {
    url: "notices/my",
    method: ["GET"],
    body({ query }) {
      const pageNum = Number(query?.pageNum || 1);
      const pageSize = Number(query?.pageSize || 10);
      const isRead =
        query?.isRead == null || query.isRead === "" ? undefined : Number(query.isRead);
      const filtered =
        isRead == null ? myNoticeList : myNoticeList.filter((item) => item.isRead === isRead);
      const start = (pageNum - 1) * pageSize;

      return {
        code: "00000",
        data: {
          list: filtered.slice(start, start + pageSize),
          total: filtered.length,
        },
        msg: "一切ok",
      };
    },
  },
]);

const myNoticeList = [
  {
    id: "10",
    title: "v2.16.1 版本修復了 WebSocket 重複連線導致的後臺執行緒阻塞問題，最佳化了通知公告。",
    type: 1,
    level: "L",
    publisherName: "系統管理員",
    publishTime: "2024-09-30 17:30",
    isRead: 0,
  },
  {
    id: "9",
    title: "公司將在 10 月 15 日舉辦新產品釋出會，敬請期待。",
    type: 5,
    level: "L",
    publisherName: "系統管理員",
    publishTime: "2024-09-30 17:29",
    isRead: 0,
  },
  {
    id: "8",
    title: "國慶假期從 10 月 1 日至 10 月 7 日放假，共 7 天。",
    type: 4,
    level: "L",
    publisherName: "系統管理員",
    publishTime: "2024-09-30 17:28",
    isRead: 0,
  },
  {
    id: "7",
    title: "最近發現一些釣魚郵件，請大家提高警惕，不要點選陌生連結。",
    type: 3,
    level: "L",
    publisherName: "系統管理員",
    publishTime: "2024-09-30 17:27",
    isRead: 1,
  },
  {
    id: "6",
    title: "系統將於本週六凌晨 2 點進行維護，預計維護時間為 2 小時。",
    type: 2,
    level: "L",
    publisherName: "系統管理員",
    publishTime: "2024-09-30 17:26",
    isRead: 1,
  },
];

// 通知對映表資料
const noticeMap: Record<string, any> = {
  1: {
    id: "1",
    title: "v2.12.0 新增系統日誌，訪問趨勢統計功能。",
    publishStatus: 1,
    type: 1,
    publisherName: "系統管理員",
    level: "L",
    levelLabel: null,
    publishTime: "2024-09-30 17:21",
    isRead: null,
    targetType: 1,
    createTime: "2024-09-28 11:21",
    revokeTime: "2024-09-30 17:21",
  },
  2: {
    id: "2",
    title: "v2.13.0 新增選單搜尋。",
    publishStatus: 1,
    type: 1,
    publisherName: "系統管理員",
    level: "L",
    levelLabel: null,
    publishTime: "2024-09-30 17:22",
    isRead: null,
    targetType: 1,
    createTime: "2024-09-28 11:21",
    revokeTime: "2024-09-30 17:21",
  },
  3: {
    id: "3",
    title: "\r\nv2.14.0 新增個人中心。",
    publishStatus: 1,
    type: 1,
    publisherName: "系統管理員",
    level: "L",
    levelLabel: null,
    publishTime: "2024-09-30 17:23",
    isRead: null,
    targetType: 1,
    createTime: "2024-09-28 11:21",
    revokeTime: "2024-09-30 17:21",
  },
  4: {
    id: "4",
    title: "v2.15.0 登入頁面改造。",
    publishStatus: 1,
    type: 1,
    publisherName: "系統管理員",
    level: "L",
    levelLabel: null,
    publishTime: "2024-09-30 17:24",
    isRead: null,
    targetType: 1,
    createTime: "2024-09-28 11:21",
    revokeTime: "2024-09-30 17:21",
  },

  5: {
    id: "5",
    title: "v2.16.0 通知公告、字典翻譯元件。",
    publishStatus: 1,
    type: 1,
    publisherName: "系統管理員",
    level: "L",
    levelLabel: null,
    publishTime: "2024-09-30 17:25",
    isRead: null,
    targetType: 1,
    createTime: "2024-09-28 11:21",
    revokeTime: "2024-09-30 17:21",
  },
  6: {
    id: "6",
    title: "系統將於本週六凌晨 2 點進行維護，預計維護時間為 2 小時。",
    publishStatus: 1,
    type: 2,
    publisherName: "系統管理員",
    level: "L",
    levelLabel: null,
    publishTime: "2024-09-30 17:26",
    isRead: null,
    targetType: 1,
    createTime: "2024-09-28 11:21",
    revokeTime: "2024-09-30 17:21",
  },
  7: {
    id: "7",
    title: "最近發現一些釣魚郵件，請大家提高警惕，不要點選陌生連結。",
    publishStatus: 1,
    type: 3,
    publisherName: "系統管理員",
    level: "L",
    levelLabel: null,
    publishTime: "2024-09-30 17:27",
    isRead: null,
    targetType: 1,
    createTime: "2024-09-28 11:21",
    revokeTime: "2024-09-30 17:21",
  },
  8: {
    id: "8",
    title: "國慶假期從 10 月 1 日至 10 月 7 日放假，共 7 天。",
    publishStatus: 1,
    type: 4,
    publisherName: "系統管理員",
    level: "L",
    levelLabel: null,
    publishTime: "2024-09-30 17:28",
    isRead: null,
    targetType: 1,
    createTime: "2024-09-28 11:21",
    revokeTime: "2024-09-30 17:21",
  },
  9: {
    id: "9",
    title: "公司將在 10 月 15 日舉辦新產品釋出會，敬請期待。",
    publishStatus: 1,
    type: 5,
    publisherName: "系統管理員",
    level: "L",
    levelLabel: null,
    publishTime: "2024-09-30 17:29",
    isRead: null,
    targetType: 1,
    createTime: "2024-09-28 11:21",
    revokeTime: "2024-09-30 17:21",
  },
  10: {
    id: "10",
    title: "v2.16.1 版本修復了 WebSocket 重複連線導致的後臺執行緒阻塞問題，最佳化了通知公告。",
    publishStatus: 1,
    type: 1,
    publisherName: "系統管理員",
    level: "L",
    levelLabel: null,
    publishTime: "2024-09-30 17:30",
    isRead: null,
    targetType: 1,
    createTime: "2024-09-28 11:21",
    revokeTime: "2024-09-30 17:21",
  },
};
