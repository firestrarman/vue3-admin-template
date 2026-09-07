<template lang="pug">
div(class="page-container")
  el-card(class="page-search" shadow="never")
    el-form(ref="queryFormRef" :model="params" :inline="true" label-suffix=":")
      el-form-item(label="標題" prop="title")
        el-input(v-model="params.title" placeholder="標題" clearable @keyup.enter="handleQuery()")
      el-form-item(label="釋出狀態" prop="publishStatus")
        el-select(v-model="params.publishStatus" clearable placeholder="全部" style="width: 100px")
          el-option(:value="NOTICE_STATUS_DRAFT" label="未釋出")
          el-option(:value="NOTICE_STATUS_PUBLISHED" label="已釋出")
          el-option(:value="NOTICE_STATUS_REVOKED" label="已撤回")
      el-form-item
        el-button(type="primary" @click="handleQuery()") 搜尋
        el-button(@click="handleResetQuery()") 重置

  el-card(class="page-content" shadow="never")
    div(class="page-toolbar")
      div(class="page-toolbar__left")
        el-button(v-hasPerm="['sys:notice:create']" type="primary" @click="openDialog()") 新增通知
        el-button(
          v-hasPerm="['sys:notice:delete']"
          type="danger"
          :disabled="!hasSelection"
          @click="handleDelete()"
        ) 刪除
      div(class="page-toolbar__right")
        el-tooltip(content="重新整理" placement="top")
          el-button(class="page-icon-btn" @click="fetchData")
            el-icon
              Refresh

    div(class="page-table-wrapper")
      AppTableList(
        v-loading="loading"
        class="page-table"
        border
        height="100%"
        highlight-current-row
        :data="list"
        :columns="columns"
        @selection-change="handleSelectionChange"
      )
        template(v-slot:targetType="{ row }")
          el-tag(v-if="row.targetType === NOTICE_TARGET_ALL" type="warning") 全體
          el-tag(v-if="row.targetType === NOTICE_TARGET_SPECIFIED" type="success") 指定
        template(v-slot:publishStatus="{ row }")
          el-tag(v-if="row.publishStatus === NOTICE_STATUS_DRAFT" type="info") 未釋出
          el-tag(v-else-if="row.publishStatus === NOTICE_STATUS_PUBLISHED" type="success") 已釋出
          el-tag(v-else-if="row.publishStatus === NOTICE_STATUS_REVOKED" type="warning") 已撤回
        template(v-slot:operateTime="{ row }")
          div(class="flex-x-start")
            span 建立時間：
            span {{ row.createTime || "-" }}
          div(v-if="row.publishStatus === NOTICE_STATUS_PUBLISHED" class="flex-x-start")
            span 釋出時間：
            span {{ row.publishTime || "-" }}
          div(v-else-if="row.publishStatus === NOTICE_STATUS_REVOKED" class="flex-x-start")
            span 撤回時間：
            span {{ row.revokeTime || "-" }}
        template(v-slot:actions="{ row }")
          el-button(type="primary" size="small" link @click="openDetailDialog(row.id)") 檢視
          el-button(
            v-if="row.publishStatus !== NOTICE_STATUS_PUBLISHED"
            v-hasPerm="['sys:notice:publish']"
            type="primary"
            size="small"
            link
            @click="handlePublish(row.id)"
          ) 釋出
          el-button(
            v-if="row.publishStatus === NOTICE_STATUS_PUBLISHED"
            v-hasPerm="['sys:notice:revoke']"
            type="primary"
            size="small"
            link
            @click="handleRevoke(row.id)"
          ) 撤回
          el-button(
            v-if="row.publishStatus !== NOTICE_STATUS_PUBLISHED"
            v-hasPerm="['sys:notice:update']"
            type="primary"
            size="small"
            link
            @click="openDialog(row.id)"
          ) 編輯
          el-button(
            v-if="row.publishStatus !== NOTICE_STATUS_PUBLISHED"
            v-hasPerm="['sys:notice:delete']"
            type="danger"
            size="small"
            link
            @click="handleDelete(row.id)"
          ) 刪除

    app-pagination(
      v-if="total > 0"
      v-model:total="total"
      v-model:page="params.pageNum"
      v-model:limit="params.pageSize"
      @pagination="fetchData"
    )

  el-dialog(
    v-model="dialogState.visible"
    :show-close="false"
    :fullscreen="dialogState.fullscreen"
    top="6vh"
    width="70%"
    custom-class="notice-dialog"
    @close="closeDialog"
  )
    template(v-slot:header)
      div(class="flex-x-between")
        span {{ dialogState.title }}
        div(class="dialog-toolbar")
          el-button(circle @click="toggleDialogFullscreen")
            template(v-slot:icon)
              FullScreen(v-if="!dialogState.fullscreen")
              CopyDocument(v-else)
          el-button(circle @click="closeDialog")
            template(v-slot:icon)
              Close
    el-form(ref="noticeFormRef" :model="formData" :rules="rules" label-width="100px")
      el-form-item(label="通知標題" prop="title")
        el-input(v-model="formData.title" placeholder="通知標題" clearable)
      el-form-item(label="通知型別" prop="type")
        AppDictSelect(v-model="formData.type" code="notice_type")
      el-form-item(label="通知等級" prop="level")
        AppDictSelect(v-model="formData.level" code="notice_level")
      el-form-item(label="目標型別" prop="targetType")
        el-radio-group(v-model="formData.targetType")
          el-radio(:value="NOTICE_TARGET_ALL") 全體
          el-radio(:value="NOTICE_TARGET_SPECIFIED") 指定
      el-form-item(
        v-if="formData.targetType === NOTICE_TARGET_SPECIFIED"
        label="指定使用者"
        prop="targetUsers"
      )
        el-select(v-model="formData.targetUsers" multiple search placeholder="請選擇指定使用者")
          el-option(
            v-for="item in userOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          )
      el-form-item(label="通知內容" prop="content")
        AppEditor(v-model="formData.content" height="350px")
    template(v-slot:footer)
      div(class="dialog-footer")
        el-button(type="primary" @click="handleSubmit()") 確定
        el-button(@click="closeDialog()") 取消

  el-dialog(
    v-model="detailDialog.visible"
    :show-close="false"
    width="50%"
    append-to-body
    @close="closeDetailDialog"
  )
    template(v-slot:header)
      div(class="flex-x-between")
        span 通知公告詳情
        div(class="dialog-toolbar")
          el-button(circle @click="closeDetailDialog")
            template(v-slot:icon)
              Close
    el-descriptions(:column="1")
      el-descriptions-item(label="標題：") {{ currentNotice.title }}
      el-descriptions-item(label="釋出狀態：")
        el-tag(v-if="currentNotice.publishStatus === NOTICE_STATUS_DRAFT" type="info") 未釋出
        el-tag(v-else-if="currentNotice.publishStatus === NOTICE_STATUS_PUBLISHED" type="success") 已釋出
        el-tag(v-else-if="currentNotice.publishStatus === NOTICE_STATUS_REVOKED" type="warning") 已撤回
      el-descriptions-item(label="釋出人：") {{ currentNotice.publisherName }}
      el-descriptions-item(label="釋出時間：") {{ currentNotice.publishTime }}
      el-descriptions-item(label="公告內容：")
        div(class="notice-content" v-html="currentNotice.content")
</template>

<script setup lang="ts">
import { type FormInstance, type FormRules } from "element-plus";
import { Close, CopyDocument, FullScreen, Refresh } from "@element-plus/icons-vue";

import NoticeAPI from "@/api/system/notice";
import type { NoticeDetail, NoticeForm, NoticeItem, NoticeQueryParams } from "@/api/system/notice";
import UserAPI from "@/api/system/user";
import type { OptionItem } from "@/api/common";
import { usePageTable, useTableSelection } from "@/composables";
import { AppDictColumn, type AppTableColumn } from "@/components/base/AppTableList";

defineOptions({
  name: "Notice",
  inheritAttrs: false,
});

const queryFormRef = ref<FormInstance>();
const noticeFormRef = ref<FormInstance>();

// 通知釋出狀態：0=未釋出，1=已釋出，-1=已撤回。
const NOTICE_STATUS_DRAFT = 0;
const NOTICE_STATUS_PUBLISHED = 1;
const NOTICE_STATUS_REVOKED = -1;
// 通知目標型別：1=全體，2=指定使用者。
const NOTICE_TARGET_ALL = 1;
const NOTICE_TARGET_SPECIFIED = 2;

// 分頁表格資料管理
const { loading, list, total, params, fetchData, handleQuery, handleResetQuery } = usePageTable<
  NoticeItem,
  NoticeQueryParams
>({
  initialParams: {
    pageNum: 1,
    pageSize: 10,
    title: "",
    publishStatus: undefined,
  },
  request: NoticeAPI.getPage,
  onBeforeReset: () => queryFormRef.value?.resetFields(),
});

const { selectedIds, hasSelection, handleSelectionChange } = useTableSelection<NoticeItem>();

const columns: AppTableColumn<NoticeItem>[] = [
  { type: "selection", width: 55 },
  { type: "index", label: "序號", width: 60 },
  { label: "通知標題", prop: "title", minWidth: 200, align: "left" },
  {
    label: "通知型別",
    prop: "type",
    width: 150,
    component: AppDictColumn,
    componentProps: { code: "notice_type" },
  },
  { label: "釋出人", prop: "publisherName", width: 150 },
  {
    label: "通知等級",
    prop: "level",
    width: 100,
    component: AppDictColumn,
    componentProps: { code: "notice_level" },
  },
  { label: "通告目標型別", slot: "targetType", minWidth: 100 },
  { label: "釋出狀態", slot: "publishStatus", minWidth: 100 },
  { label: "操作時間", slot: "operateTime", width: 250, align: "left" },
  { label: "操作", slot: "actions", fixed: "right", width: 150 },
];

const userOptions = ref<OptionItem[]>([]);

const dialogState = reactive({
  title: "",
  visible: false,
  fullscreen: false,
});

const initialFormData: NoticeForm = {
  level: "L",
  targetType: NOTICE_TARGET_ALL,
};

const formData = reactive<NoticeForm>({ ...initialFormData });

const rules: FormRules<NoticeForm> = {
  title: [{ required: true, message: "請輸入通知標題", trigger: "blur" }],
  content: [
    {
      required: true,
      message: "請輸入通知內容",
      trigger: "blur",
      validator: (rule, value: string, callback) => {
        if (!value.replace(/<[^>]+>/g, "").trim()) {
          callback(new Error("請輸入通知內容"));
        } else {
          callback();
        }
      },
    },
  ],
  type: [{ required: true, message: "請選擇通知型別", trigger: "change" }],
};

const detailDialog = reactive({
  visible: false,
});
const currentNotice = ref<NoticeDetail>({});

/**
 * 將後端返回的 `targetUserIds`（可能是陣列、JSON 字串、逗號分隔字串）標準化為數字陣列。
 * 用於編輯回顯時把後端欄位轉換成表單 `targetUsers` 欄位。
 * @param value 後端返回的原始值
 */
function normalizeTargetUsers(value?: unknown): number[] {
  if (!value) {
    return [];
  }
  const toNumberArray = (arr: unknown[]): number[] =>
    arr.map((v) => Number(v)).filter((v) => Number.isFinite(v));
  if (Array.isArray(value)) {
    return toNumberArray(value);
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return toNumberArray(parsed);
      }
      return value
        .split(",")
        .filter(Boolean)
        .map((v) => Number(v))
        .filter((v) => Number.isFinite(v));
    } catch {
      return value
        .split(",")
        .filter(Boolean)
        .map((v) => Number(v))
        .filter((v) => Number.isFinite(v));
    }
  }
  return [];
}

/**
 * 構造提交給後端的 payload。
 *
 * 欄位名轉換：targetUsers → targetUserIds。
 */
function buildSubmitPayload(): Omit<NoticeForm, "targetUsers"> & { targetUserIds: number[] } {
  const { targetUsers, ...rest } = formData;
  return {
    ...rest,
    targetUserIds: formData.targetType === NOTICE_TARGET_SPECIFIED ? (targetUsers ?? []) : [],
  };
}

/**
 * 重置表單資料和驗證狀態。
 *
 * 重置表單資料。
 */
function resetForm(): void {
  noticeFormRef.value?.resetFields();
  noticeFormRef.value?.clearValidate();
  Object.keys(formData).forEach((key) => {
    delete (formData as Record<string, unknown>)[key];
  });
  Object.assign(formData, initialFormData);
}

/**
 * 切換表單彈窗的全屏狀態。
 */
function toggleDialogFullscreen(): void {
  dialogState.fullscreen = !dialogState.fullscreen;
}

/**
 * 開啟新增/編輯通知彈窗。
 * @param id 通知 ID（編輯時傳入）
 */
async function openDialog(id?: string): Promise<void> {
  dialogState.fullscreen = false;
  // 使用者選項與彈窗並行載入
  UserAPI.getOptions().then((data) => {
    userOptions.value = data;
  });

  dialogState.visible = true;
  if (id) {
    dialogState.title = "修改公告";
    const data = await NoticeAPI.getFormData(id);
    Object.assign(formData, {
      ...data,
      targetUsers: normalizeTargetUsers(data.targetUsers),
    });
  } else {
    resetForm();
    dialogState.title = "新增公告";
  }
}

/**
 * 關閉表單彈窗並重置表單。
 */
function closeDialog(): void {
  dialogState.visible = false;
  dialogState.fullscreen = false;
  resetForm();
}

/**
 * 校驗並提交通知表單
 */
async function handleSubmit(): Promise<void> {
  const valid = await noticeFormRef.value?.validate().then(
    () => true,
    () => false
  );
  if (!valid) return;

  loading.value = true;
  try {
    const payload = buildSubmitPayload();
    const id = formData.id;
    if (id) {
      await NoticeAPI.update(id, payload);
      ElMessage.success("修改成功");
    } else {
      await NoticeAPI.create(payload);
      ElMessage.success("新增成功");
    }
    closeDialog();
    handleResetQuery();
  } finally {
    loading.value = false;
  }
}

/**
 * 釋出通知公告。
 *
 * @param id 通知 ID
 */
async function handlePublish(id: string): Promise<void> {
  await NoticeAPI.publish(id);
  ElMessage.success("釋出成功");
  fetchData();
}

/**
 * 撤回通知公告。
 *
 * @param id 通知 ID
 */
async function handleRevoke(id: string): Promise<void> {
  await NoticeAPI.revoke(id);
  ElMessage.success("撤回成功");
  fetchData();
}

/**
 * 刪除單個或批次通知。
 *
 * @param id 指定時刪除單個通知；不指定時刪除表格勾選項
 */
async function handleDelete(id?: string): Promise<void> {
  const deleteIds = id ?? selectedIds.value.join(",");
  if (!deleteIds) {
    ElMessage.warning("請勾選刪除項");
    return;
  }

  try {
    await ElMessageBox.confirm("確認刪除已選中的資料項嗎？", "警告", {
      confirmButtonText: "確定",
      cancelButtonText: "取消",
      type: "warning",
    });
  } catch {
    ElMessage.info("已取消刪除");
    return;
  }

  loading.value = true;
  try {
    await NoticeAPI.deleteByIds(deleteIds);
    ElMessage.success("刪除成功");
    handleResetQuery();
  } finally {
    loading.value = false;
  }
}

/**
 * 開啟通知詳情彈窗。
 *
 * @param id 通知 ID
 */
async function openDetailDialog(id: string): Promise<void> {
  currentNotice.value = await NoticeAPI.getDetail(id);
  detailDialog.visible = true;
}

/**
 * 關閉通知詳情彈窗。
 */
function closeDetailDialog(): void {
  detailDialog.visible = false;
}

onMounted(() => {
  handleQuery();
});
</script>
