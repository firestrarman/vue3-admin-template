import request from "@/api/request";
import type { FileInfo } from "./types";

const FileAPI = {
  // 上傳檔案
  uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return request<unknown, FileInfo>({
      url: "/api/v1/files",
      method: "post",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default FileAPI;

export * from "./types";
