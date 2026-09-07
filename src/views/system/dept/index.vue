<template lang="pug">
div(class="page-container")
  el-card(class="page-search" shadow="never")
    el-form(ref="queryFormRef" :model="queryParams" :inline="true")
      el-form-item(label="關鍵字" prop="keywords")
        el-input(
          v-model="queryParams.keywords"
          placeholder="部門名稱"
          clearable
          @keyup.enter="handleQuery"
        )
      el-form-item(label="部門狀態" prop="status")
        el-select(v-model="queryParams.status" placeholder="全部" clearable style="width: 100px")
          el-option(:value="CommonStatus.ENABLED" label="正常")
          el-option(:value="CommonStatus.DISABLED" label="禁用")

      el-form-item
        el-button(type="primary" @click="handleQuery") 搜尋
        el-button(@click="handleResetQuery") 重置

  el-card(class="page-content" shadow="never")
    div(class="page-toolbar")
      div(class="page-toolbar__left")
        el-button(v-hasPerm="['sys:dept:create']" type="primary" @click="openDialog()") 新增
        el-button(
          v-hasPerm="['sys:dept:delete']"
          type="danger"
          :disabled="!hasSelection"
          @click="handleDelete()"
        ) 刪除
      div(class="page-toolbar__right")
        el-tooltip(content="重新整理" placement="top")
          el-button(class="page-icon-btn" :icon="refreshIcon" @click="handleQuery")

    div(class="page-table-wrapper")
      AppTableList(
        v-loading="loading"
        class="page-table"
        row-key="id"
        default-expand-all
        border
        height="100%"
        :data="list"
        :columns="columns"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="handleSelectionChange"
      )
        template(v-slot:actions="{ row }")
          el-button(
            v-hasPerm="['sys:dept:create']"
            type="primary"
            link
            size="small"
            @click.stop="openDialog(row.id, undefined)"
          ) 新增
          el-button(
            v-hasPerm="['sys:dept:update']"
            type="primary"
            link
            size="small"
            @click.stop="openDialog(row.parentId, row.id)"
          ) 編輯
          el-button(
            v-hasPerm="['sys:dept:delete']"
            type="danger"
            link
            size="small"
            @click.stop="handleDelete(row.id)"
          ) 刪除

  el-dialog(
    v-model="dialogState.visible"
    :title="dialogState.title"
    width="600px"
    @closed="closeDialog"
  )
    el-form(ref="deptFormRef" :model="formData" :rules="rules" label-width="80px")
      el-form-item(label="上級部門" prop="parentId")
        el-tree-select(
          v-model="formData.parentId"
          placeholder="選擇上級部門"
          :data="deptOptions"
          filterable
          check-strictly
          :render-after-expand="false"
        )
      el-form-item(label="部門名稱" prop="name")
        el-input(v-model="formData.name" placeholder="請輸入部門名稱")
      el-form-item(label="部門編號" prop="code")
        el-input(v-model="formData.code" placeholder="請輸入部門編碼")
      el-form-item(label="顯示排序" prop="sort")
        el-input-number(
          v-model="formData.sort"
          controls-position="right"
          style="width: 100px"
          :min="0"
        )
      el-form-item(label="部門狀態")
        el-radio-group(v-model="formData.status")
          el-radio(:value="CommonStatus.ENABLED") 正常
          el-radio(:value="CommonStatus.DISABLED") 禁用
    template(v-slot:footer)
      div(class="dialog-footer")
        el-button(type="primary" @click="handleSubmit") 確定
        el-button(@click="closeDialog") 取消
</template>

<script setup lang="ts">
import { type FormInstance, type FormRules } from "element-plus";
import { Refresh } from "@element-plus/icons-vue";

import DeptAPI from "@/api/system/dept";
import type { DeptForm, DeptItem, DeptQueryParams } from "@/api/system/dept";
import type { OptionItem } from "@/api/common";
import { useTableSelection } from "@/composables";
import { CommonStatus } from "@/enums";
import { AppStatusColumn, type AppTableColumn } from "@/components/base/AppTableList";

defineOptions({
  name: "Dept",
  inheritAttrs: false,
});

const refreshIcon = markRaw(Refresh);

const queryFormRef = ref<FormInstance>();
const deptFormRef = ref<FormInstance>();

const loading = ref(false);
const list = ref<DeptItem[]>([]);
const queryParams = reactive<DeptQueryParams>({
  keywords: "",
  status: undefined,
});

const { selectedIds, hasSelection, handleSelectionChange } = useTableSelection<DeptItem>();

const columns: AppTableColumn<DeptItem>[] = [
  { type: "selection", width: 55 },
  { label: "部門名稱", prop: "name", minWidth: 200, align: "left" },
  { label: "部門編號", prop: "code", width: 200, align: "left" },
  {
    label: "狀態",
    prop: "status",
    width: 100,
    align: "left",
    component: AppStatusColumn,
    componentProps: {
      enabledValue: CommonStatus.ENABLED,
      enabledLabel: "正常",
      disabledLabel: "禁用",
    },
  },
  { label: "排序", prop: "sort", width: 100, align: "left" },
  { label: "操作", slot: "actions", fixed: "right", width: 200, align: "left" },
];

const dialogState = reactive({
  title: "",
  visible: false,
});

const deptOptions = ref<OptionItem[]>([]);

const initialFormData: DeptForm = {
  status: CommonStatus.ENABLED,
  parentId: "0",
  sort: 1,
};

const formData = reactive<DeptForm>({ ...initialFormData });

const rules: FormRules<DeptForm> = {
  parentId: [{ required: true, message: "上級部門不能為空", trigger: "change" }],
  name: [{ required: true, message: "部門名稱不能為空", trigger: "blur" }],
  code: [{ required: true, message: "部門編號不能為空", trigger: "blur" }],
  sort: [{ required: true, message: "顯示排序不能為空", trigger: "blur" }],
};

/**
 * 拉取部門列表資料（一次性返回全量樹）
 */
async function fetchData(): Promise<void> {
  loading.value = true;
  try {
    list.value = await DeptAPI.getList(queryParams);
  } finally {
    loading.value = false;
  }
}

/**
 * 按當前篩選條件重新查詢。
 */
function handleQuery(): void {
  fetchData();
}

/**
 * 重置搜尋表單後重新查詢
 */
function handleResetQuery(): void {
  queryFormRef.value?.resetFields();
  fetchData();
}

/**
 * 重置表單資料和驗證狀態
 */
function resetForm(): void {
  deptFormRef.value?.resetFields();
  deptFormRef.value?.clearValidate();
  Object.keys(formData).forEach((key) => {
    delete (formData as Record<string, unknown>)[key];
  });
  Object.assign(formData, initialFormData);
}

/**
 * 開啟新增/編輯部門彈窗。
 * @param parentId 父部門 ID（新增子部門時傳入）
 * @param deptId 部門 ID（編輯時傳入）
 */
async function openDialog(parentId?: string, deptId?: string): Promise<void> {
  const data = await DeptAPI.getOptions();
  deptOptions.value = [
    {
      value: "0",
      label: "頂級部門",
      children: data,
    },
  ];

  dialogState.visible = true;
  if (deptId) {
    dialogState.title = "修改部門";
    const form = await DeptAPI.getFormData(deptId);
    Object.assign(formData, form);
  } else {
    dialogState.title = "新增部門";
    formData.parentId = parentId || "0";
  }
}

/**
 * 校驗並提交部門表單。
 */
async function handleSubmit(): Promise<void> {
  const valid = await deptFormRef.value?.validate().then(
    () => true,
    () => false
  );
  if (!valid) return;

  loading.value = true;
  try {
    const deptId = formData.id;
    if (deptId) {
      await DeptAPI.update(deptId, formData);
      ElMessage.success("修改成功");
    } else {
      await DeptAPI.create(formData);
      ElMessage.success("新增成功");
    }
    closeDialog();
    fetchData();
  } finally {
    loading.value = false;
  }
}

/**
 * 刪除單個或批次部門。
 *
 * @param deptId 指定時刪除單個部門；不指定時刪除表格勾選項
 */
async function handleDelete(deptId?: string): Promise<void> {
  const deptIds = deptId ?? selectedIds.value.join(",");
  if (!deptIds) {
    ElMessage.warning("請勾選刪除項");
    return;
  }

  try {
    await ElMessageBox.confirm("確認刪除已選中的資料項?", "警告", {
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
    await DeptAPI.deleteByIds(deptIds);
    ElMessage.success("刪除成功");
    handleResetQuery();
  } finally {
    loading.value = false;
  }
}

/**
 * 關閉彈窗並重置表單
 */
function closeDialog(): void {
  dialogState.visible = false;
  resetForm();
}

onMounted(() => {
  fetchData();
});
</script>
