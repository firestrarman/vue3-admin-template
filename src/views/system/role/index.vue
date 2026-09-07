<template lang="pug">
div(class="page-container")
  el-card(class="page-search" shadow="never")
    el-form(ref="queryFormRef" :model="params" :inline="true")
      el-form-item(prop="keywords" label="關鍵字")
        el-input(v-model="params.keywords" placeholder="角色名稱" clearable @keyup.enter="handleQuery")
      el-form-item
        el-button(type="primary" @click="handleQuery") 搜尋
        el-button(@click="handleResetQuery") 重置

  el-card(class="page-content" shadow="never")
    div(class="page-toolbar")
      div(class="page-toolbar__left")
        el-button(type="primary" @click="handleCreateClick()") 新增
        el-button(type="danger" :disabled="!hasSelection" @click="handleBatchDelete()") 刪除
      div(class="page-toolbar__right")
        el-tooltip(content="重新整理" placement="top")
          el-button(class="page-icon-btn" @click="fetchData")
            el-icon
              Refresh

    div(class="page-table-wrapper")
      AppTableList(
        v-loading="loading"
        class="page-table"
        height="100%"
        highlight-current-row
        border
        :data="list"
        :columns="columns"
        @selection-change="handleSelectionChange"
      )
        template(v-slot:actions="{ row }")
          el-button(
            v-hasPerm="'sys:role:assign'"
            type="primary"
            size="small"
            link
            @click="handleAssignPermClick(row)"
          ) 分配權限
          el-button(type="primary" size="small" link @click="row.id && handleEditClick(row.id)") 編輯
          el-button(type="danger" size="small" link @click="handleDelete(row.id)") 刪除

    app-pagination(
      v-if="total > 0"
      v-model:total="total"
      v-model:page="params.pageNum"
      v-model:limit="params.pageSize"
      class="page-pagination"
      @pagination="fetchData"
    )

  el-dialog(
    v-model="dialogState.visible"
    :title="dialogState.title"
    width="600px"
    @close="closeDialog"
  )
    el-form(ref="roleFormRef" :model="formData" :rules="rules" label-width="100px")
      el-form-item(label="角色名稱" prop="name")
        el-input(v-model="formData.name" placeholder="請輸入角色名稱")
      el-form-item(label="角色編碼" prop="code")
        el-input(v-model="formData.code" placeholder="請輸入角色編碼")
      el-form-item(label="資料權限" prop="dataScope")
        el-select(v-model="formData.dataScope" placeholder="請選擇資料權限" style="width: 100%")
          el-option(
            v-for="item in dataScopeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          )
      el-form-item(v-if="formData.dataScope === DATA_SCOPE_CUSTOM" label="選擇部門" prop="deptIds")
        el-tree-select(
          v-model="formData.deptIds"
          :data="deptOptions"
          multiple
          :render-after-expand="false"
          check-strictly
          placeholder="請選擇部門"
          style="width: 100%"
        )
      el-form-item(label="狀態" prop="status")
        el-radio-group(v-model="formData.status")
          el-radio(:value="CommonStatus.ENABLED") 正常
          el-radio(:value="CommonStatus.DISABLED") 停用
      el-form-item(label="排序" prop="sort")
        el-input-number(
          v-model="formData.sort"
          controls-position="right"
          :min="0"
          style="width: 100px"
        )
    template(v-slot:footer)
      div(class="dialog-footer")
        el-button(type="primary" @click="handleSubmit") 確定
        el-button(@click="closeDialog") 取消

  el-drawer(
    v-model="assignPermDialogVisible"
    :title="'【' + checkedRole.name + '】權限分配'"
    :size="drawerSize"
  )
    div(class="flex-x-between")
      el-input(v-model="permKeywords" clearable class="w-[150px]" placeholder="選單權限名稱")
        template(v-slot:prefix)
          Search
      div(class="flex-center ml-5")
        el-button(type="primary" size="small" plain @click="togglePermTree")
          template(v-slot:icon)
            Switch
          | {{ isExpanded ? "收縮" : "展開" }}
        el-checkbox(v-model="parentChildLinked" class="ml-5" @change="handleParentChildLinkedChange") 父子聯動
        el-tooltip(placement="bottom")
          template(v-slot:content) 如果只需勾選選單權限，不需要勾選子選單或者按鈕權限，請關閉父子聯動
          el-icon(class="ml-1 color-[--el-color-primary] inline-block cursor-pointer")
            QuestionFilled

    el-tree(
      ref="permTreeRef"
      node-key="value"
      show-checkbox
      :data="menuPermOptions"
      :filter-node-method="handlePermFilter"
      :default-expand-all="true"
      :check-strictly="!parentChildLinked"
      class="mt-5"
    )
      template(v-slot:default="{ data }") {{ data.label }}
    template(v-slot:footer)
      div(class="dialog-footer")
        el-button(v-hasPerm="'sys:role:assign'" type="primary" @click="handleAssignPermSubmit") 確定
        el-button(@click="assignPermDialogVisible = false") 取消
</template>

<script setup lang="ts">
import {
  type FormInstance,
  type FormRules,
  type TreeInstance,
  type TreeNodeData,
} from "element-plus";
import { Refresh, Search, Switch, QuestionFilled } from "@element-plus/icons-vue";

import RoleAPI from "@/api/system/role";
import type { RoleForm, RoleItem, RoleQueryParams } from "@/api/system/role";
import MenuAPI from "@/api/system/menu";
import DeptAPI from "@/api/system/dept";
import type { OptionItem } from "@/api/common";
import { useAppStore } from "@/stores";
import { usePageTable, useTableSelection } from "@/composables";
import { CommonStatus, DeviceEnum } from "@/enums";
import { AppStatusColumn, type AppTableColumn } from "@/components/base/AppTableList";

defineOptions({
  name: "Role",
  inheritAttrs: false,
});

const appStore = useAppStore();

const queryFormRef = ref<FormInstance>();
const roleFormRef = ref<FormInstance>();
const permTreeRef = ref<TreeInstance>();

// 自定義資料權限取值
const DATA_SCOPE_CUSTOM = 5;

const dataScopeOptions = [
  { label: "全部資料", value: 1 },
  { label: "部門及子部門資料", value: 2 },
  { label: "本部門資料", value: 3 },
  { label: "本人資料", value: 4 },
  { label: "自定義部門資料", value: DATA_SCOPE_CUSTOM },
];

/** 分頁表格資料管理 */
const { loading, list, total, params, fetchData, handleQuery, handleResetQuery } = usePageTable<
  RoleItem,
  RoleQueryParams
>({
  initialParams: {
    pageNum: 1,
    pageSize: 10,
    keywords: "",
  },
  request: RoleAPI.getPage,
  onBeforeReset: () => queryFormRef.value?.resetFields(),
});

const { selectedIds, hasSelection, handleSelectionChange } = useTableSelection<RoleItem>();

const columns: AppTableColumn<RoleItem>[] = [
  { type: "selection", width: 55 },
  { label: "角色名稱", prop: "name", minWidth: 100, align: "left" },
  { label: "角色編碼", prop: "code", width: 150, align: "left" },
  { label: "資料權限", prop: "dataScopeLabel", width: 140 },
  {
    label: "狀態",
    prop: "status",
    width: 100,
    component: AppStatusColumn,
    componentProps: {
      enabledValue: CommonStatus.ENABLED,
      enabledLabel: "正常",
      disabledLabel: "禁用",
    },
  },
  { label: "排序", prop: "sort", width: 80 },
  { label: "操作", slot: "actions", fixed: "right", width: 180 },
];

const dialogState = reactive({
  title: "",
  visible: false,
});

const initialFormData: RoleForm = {
  sort: 1,
  status: CommonStatus.ENABLED,
};

const formData = reactive<RoleForm>({ ...initialFormData });

const rules: FormRules<RoleForm> = {
  name: [{ required: true, message: "請輸入角色名稱", trigger: "blur" }],
  code: [{ required: true, message: "請輸入角色編碼", trigger: "blur" }],
  dataScope: [{ required: true, message: "請選擇資料權限", trigger: "blur" }],
  deptIds: [{ required: true, message: "請選擇部門", trigger: "blur" }],
  status: [{ required: true, message: "請選擇狀態", trigger: "blur" }],
};

// 部門下拉選項（懶載入，新增/編輯時才請求）
const deptOptions = ref<OptionItem[]>([]);

interface CheckedRole {
  id?: string;
  name?: string;
}
const checkedRole = ref<CheckedRole>({});
const assignPermDialogVisible = ref(false);
const menuPermOptions = ref<OptionItem[]>([]);
const permKeywords = ref("");
const isExpanded = ref(true);
const parentChildLinked = ref(true);

const drawerSize = computed(() => (appStore.device === DeviceEnum.DESKTOP ? "600px" : "90%"));

interface ToggleableTreeNode {
  expand: () => void;
  collapse: () => void;
}

/**
 * 開啟角色表單彈窗
 */
function openDialog(): void {
  dialogState.visible = true;
}

/**
 * 關閉角色表單彈窗
 * 同步清理表單資料和校驗狀態
 */
function closeDialog(): void {
  dialogState.visible = false;
  resetForm();
}

/**
 * 重置角色表單
 */
function resetForm(): void {
  roleFormRef.value?.resetFields();
  roleFormRef.value?.clearValidate();
  Object.keys(formData).forEach((key) => {
    delete (formData as Record<string, unknown>)[key];
  });
  Object.assign(formData, initialFormData);
}

/**
 * 開啟新增角色彈窗
 * 部門下拉首次開啟時請求，之後複用快取
 */
async function handleCreateClick(): Promise<void> {
  dialogState.title = "新增角色";
  if (deptOptions.value.length === 0) {
    deptOptions.value = await DeptAPI.getOptions();
  }
  openDialog();
}

/**
 * 開啟編輯角色彈窗
 * @param roleId 角色 ID
 */
async function handleEditClick(roleId: string): Promise<void> {
  dialogState.title = "修改角色";
  if (deptOptions.value.length === 0) {
    deptOptions.value = await DeptAPI.getOptions();
  }
  const data = await RoleAPI.getFormData(roleId);
  Object.assign(formData, data);
  openDialog();
}

/**
 * 校驗並提交角色表單
 * 非自定義資料權限時丟棄部門 ID
 */
async function handleSubmit(): Promise<void> {
  const valid = await roleFormRef.value?.validate().then(
    () => true,
    () => false
  );
  if (!valid) return;

  const submitData: RoleForm = { ...formData };
  if (submitData.dataScope !== DATA_SCOPE_CUSTOM) {
    submitData.deptIds = undefined;
  }

  loading.value = true;
  try {
    const roleId = formData.id;
    if (roleId) {
      await RoleAPI.update(roleId, submitData);
      ElMessage.success("修改成功");
    } else {
      await RoleAPI.create(submitData);
      ElMessage.success("新增成功");
    }
    closeDialog();
    handleResetQuery();
  } finally {
    loading.value = false;
  }
}

/**
 * 刪除單個或批次角色
 * @param roleId 指定時刪除單個角色；不指定時刪除表格勾選項
 */
async function handleDelete(roleId?: string): Promise<void> {
  const roleIds = roleId ?? selectedIds.value.join(",");
  if (!roleIds) {
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
    await RoleAPI.deleteByIds(roleIds);
    ElMessage.success("刪除成功");
    handleResetQuery();
  } finally {
    loading.value = false;
  }
}

/**
 * 批次刪除當前勾選角色
 */
function handleBatchDelete(): void {
  handleDelete();
}

/**
 * 開啟權限分配抽屜並回顯已分配選單
 * @param row 當前角色行
 */
async function handleAssignPermClick(row: RoleItem): Promise<void> {
  const roleId = row.id;
  if (!roleId) return;

  assignPermDialogVisible.value = true;
  checkedRole.value = {
    id: roleId,
    name: row.name,
  };

  loading.value = true;
  try {
    const [menuOptions, checkedMenuIds] = await Promise.all([
      MenuAPI.getOptions(),
      RoleAPI.getRoleMenuIds(roleId),
    ]);

    menuPermOptions.value = menuOptions;
    await nextTick();

    checkedMenuIds.forEach((menuId) => {
      permTreeRef.value?.setChecked(menuId, true, false);
    });
  } finally {
    loading.value = false;
  }
}

/**
 * 提交當前角色的選單權限配置
 */
async function handleAssignPermSubmit(): Promise<void> {
  const roleId = checkedRole.value.id;
  if (!roleId) return;

  const checkedMenuIds = (permTreeRef.value?.getCheckedNodes(false, true) ?? [])
    .map((node: TreeNodeData) => Number(node.value))
    .filter((value: number) => !Number.isNaN(value));

  loading.value = true;
  try {
    await RoleAPI.updateRoleMenus(roleId, checkedMenuIds);
    ElMessage.success("分配權限成功");
    assignPermDialogVisible.value = false;
    handleResetQuery();
  } finally {
    loading.value = false;
  }
}

/**
 * 展開或收起權限樹全部節點
 */
function togglePermTree(): void {
  isExpanded.value = !isExpanded.value;
  if (!permTreeRef.value) return;

  Object.values(permTreeRef.value.store.nodesMap).forEach((node) => {
    const treeNode = node as ToggleableTreeNode;
    if (isExpanded.value) {
      treeNode.expand();
    } else {
      treeNode.collapse();
    }
  });
}

/**
 * 過濾權限樹節點
 * @param value 輸入的關鍵字
 * @param data 當前節點資料
 */
function handlePermFilter(value: string, data: TreeNodeData): boolean {
  if (!value) return true;
  return String(data.label ?? "").includes(value);
}

/**
 * 同步父子聯動開關值
 */
function handleParentChildLinkedChange(value: string | number | boolean): void {
  parentChildLinked.value = Boolean(value);
}

watch(permKeywords, (value) => {
  permTreeRef.value?.filter(value);
});

onMounted(() => {
  handleQuery();
});
</script>
