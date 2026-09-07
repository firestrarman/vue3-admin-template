<template lang="pug">
div
  el-dialog(v-model="visible" :align-center="true" title="匯入資料" width="600px" @close="closeDialog")
    el-scrollbar(max-height="60vh")
      el-form(
        ref="importFormRef"
        style="padding-right: var(--el-dialog-padding-primary)"
        :model="importFormData"
        :rules="importFormRules"
      )
        el-form-item(label="檔案" prop="files")
          el-upload(
            ref="uploadRef"
            v-model:file-list="importFormData.files"
            class="w-full"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            :drag="true"
            :limit="1"
            :auto-upload="false"
            :on-exceed="handleFileExceed"
          )
            el-icon(class="el-icon--upload")
              upload-filled
            div(class="el-upload__text")
              | 將檔案拖到此處，或
              em 點選上傳
            template(v-slot:tip)
              div(class="el-upload__tip")
                | 格式為 *.xlsx / *.xls，檔案不超過1M
                el-link(type="primary" icon="download" underline="never" @click="downloadTemplate") 下載模板
    template(v-slot:footer)
      div(style="padding-right: var(--el-dialog-padding-primary)")
        el-button(v-if="resultData.length > 0" type="primary" @click="showResult") 錯誤資訊
        el-button(
          type="primary"
          :disabled="importFormData.files.length === 0"
          @click="handleUpload"
        ) 確定
        el-button(@click="closeDialog") 取消
  el-dialog(v-model="resultVisible" title="匯入結果" width="600px")
    el-alert(
      :title="`匯入結果：${invalidCount}條無效資料，${validCount}條有效資料`"
      type="warning"
      :closable="false"
    )
    AppTableList(
      :data="resultRows"
      :columns="resultColumns"
      style="width: 100%; max-height: 400px"
    )
    template(v-slot:footer)
      div(class="dialog-footer")
        el-button(@click="closeResultDialog") 關閉
</template>

<script lang="ts" setup>
import { ElMessage, type UploadUserFile } from "element-plus";
import UserAPI from "@/api/system/user";
import { ApiCodeEnum } from "@/enums/api";
import { downloadFile } from "@/utils/download";
import type { AppTableColumn } from "@/components/base/AppTableList";

const emit = defineEmits(["import-success"]);

// 彈窗可見狀態
const visible = defineModel("modelValue", {
  type: Boolean,
  required: true,
  default: false,
});

// 結果彈窗狀態
type ImportErrorRow = {
  message: string;
};

const resultVisible = ref(false);
const resultData = ref<string[]>([]);
const invalidCount = ref(0);
const validCount = ref(0);

const resultRows = computed<ImportErrorRow[]>(() =>
  resultData.value.map((message) => ({ message }))
);

const resultColumns: AppTableColumn<ImportErrorRow>[] = [
  { type: "index", label: "序號", width: 100 },
  { label: "錯誤資訊", prop: "message", width: 400, align: "left" },
];

// 表單引用
const importFormRef = ref(null);
const uploadRef = ref(null);

// 表單資料
const importFormData = reactive<{
  files: UploadUserFile[];
}>({
  files: [],
});

// 驗證規則
const importFormRules = {
  files: [{ required: true, message: "檔案不能為空", trigger: "blur" }],
};

watch(visible, (newValue) => {
  if (newValue) {
    resultData.value = [];
    resultVisible.value = false;
    invalidCount.value = 0;
    validCount.value = 0;
  }
});

/**
 * 檔案超出個數限制
 */
function handleFileExceed(): void {
  ElMessage.warning("只能上傳一個檔案");
}

/**
 * 下載匯入模板
 */
function downloadTemplate(): void {
  UserAPI.downloadTemplate().then((response: any) => {
    downloadFile(response);
  });
}

/**
 * 上傳檔案
 */
async function handleUpload(): Promise<void> {
  if (!importFormData.files.length) {
    ElMessage.warning("請選擇檔案");
    return;
  }

  const result = await UserAPI.import(importFormData.files[0].raw as File);
  if (result.code === ApiCodeEnum.SUCCESS && result.invalidCount === 0) {
    ElMessage.success("匯入成功，匯入資料：" + result.validCount + "條");
    emit("import-success");
    closeDialog();
  } else {
    ElMessage.error("上傳失敗");
    resultVisible.value = true;
    resultData.value = result.messageList;
    invalidCount.value = result.invalidCount;
    validCount.value = result.validCount;
  }
}

/**
 * 顯示錯誤資訊
 */
function showResult(): void {
  resultVisible.value = true;
}

/**
 * 關閉錯誤資訊彈窗
 */
function closeResultDialog(): void {
  resultVisible.value = false;
}

/**
 * 關閉彈窗
 */
function closeDialog(): void {
  importFormData.files.length = 0;
  visible.value = false;
}
</script>
