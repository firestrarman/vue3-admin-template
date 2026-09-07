import { defineMock } from "./base";

export default defineMock([
  // 上傳檔案
  {
    url: "files",
    method: ["POST"],
    body() {
      const name = `mock-upload-${Date.now()}.png`;
      return {
        code: "00000",
        data: {
          name,
          url: "https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif",
        },
        msg: "上傳成功",
      };
    },
  },
]);
