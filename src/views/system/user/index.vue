<!-- 使用者管理 -->
<template lang="pug">
div(class="page-container page-container--split user-page")
  aside(class="page-aside" :class="{ 'is-collapsed': sidebarCollapsed }")
    div(class="page-aside__inner")
      UserDeptTree(v-model="params.deptId" @node-click="handleQuery")
    button(class="page-aside__toggle" @click="sidebarCollapsed = !sidebarCollapsed")
      el-icon(:size="14")
        ArrowLeft(v-if="!sidebarCollapsed")
        ArrowRight(v-else)

  div(class="page-main")
    el-card(class="page-search" shadow="never")
      el-form(ref="queryFormRef" :model="params" :inline="true" label-width="auto")
        el-form-item(label="關鍵字" prop="keywords")
          el-input(
            v-model="params.keywords"
            placeholder="使用者名稱/暱稱/手機號"
            clearable
            style="width: 180px"
            @keyup.enter="handleQuery"
          )
        el-form-item(label="狀態" prop="status")
          el-select(v-model="params.status" placeholder="全部" clearable style="width: 112px")
            el-option(label="正常" :value="CommonStatus.ENABLED")
            el-option(label="禁用" :value="CommonStatus.DISABLED")
        el-form-item(label="建立時間" prop="createTime")
          el-date-picker(
            v-model="params.createTime"
            :editable="false"
            type="daterange"
            range-separator="~"
            start-placeholder="開始日期"
            end-placeholder="結束日期"
            value-format="YYYY-MM-DD"
            style="width: 240px"
          )
        el-form-item
          el-button(type="primary" @click="handleQuery") 搜尋
          el-button(@click="handleResetQuery") 重置

    el-card(class="page-content" shadow="never")
      div(class="page-toolbar")
        div(class="page-toolbar__left")
          el-button(v-hasPerm="['sys:user:create']" type="primary" @click="handleCreateClick") 新增
          el-button(
            v-hasPerm="'sys:user:delete'"
            type="danger"
            :disabled="!hasSelection"
            @click="handleDelete()"
          ) 刪除
        div(class="page-toolbar__right")
          el-tooltip(content="匯入" placement="top")
            el-button(v-hasPerm="'sys:user:import'" class="page-icon-btn" @click="openImportDialog")
              el-icon
                Upload
          el-tooltip(content="匯出" placement="top")
            el-button(v-hasPerm="'sys:user:export'" class="page-icon-btn" @click="handleExport")
              el-icon
                Download
          el-tooltip(content="重新整理" placement="top")
            el-button(class="page-icon-btn" @click="fetchData")
              el-icon
                Refresh

      div(class="page-table-wrapper")
        AppTableList(
          v-loading="loading"
          class="page-table user-table"
          height="100%"
          border
          highlight-current-row
          row-key="id"
          :data="list"
          :columns="columns"
          @selection-change="handleSelectionChange"
        )
          template(v-slot:nickname="{ row }")
            div(class="user-name-cell")
              el-avatar(v-if="row.avatar" :src="row.avatar" :size="24")
              span(v-else class="user-name-cell__text") {{ getAvatarText(row) }}
              span {{ row.nickname || "-" }}
          template(v-slot:gender="{ row }")
            el-tag(
              v-if="row.gender === UserGender.MALE || row.gender === UserGender.FEMALE"
              :type="row.gender === UserGender.MALE ? 'primary' : 'danger'"
              size="small"
            )
              el-icon
                Male(v-if="row.gender === UserGender.MALE")
                Female(v-else)
              span {{ row.gender === UserGender.MALE ? "男" : "女" }}
            span(v-else) -
          template(v-slot:actions="{ row }")
            el-button(
              v-hasPerm="'sys:user:update'"
              type="primary"
              size="small"
              link
              @click="handleEditClick(row.id)"
            ) 編輯
            el-button(
              v-hasPerm="'sys:user:delete'"
              type="danger"
              size="small"
              link
              @click="handleDelete(row.id)"
            ) 刪除
            el-button(
              v-hasPerm="'sys:user:reset-password'"
              type="primary"
              size="small"
              link
              @click="openResetPasswordDialog(row)"
            ) 重置密碼

      app-pagination(
        v-if="total > 0"
        v-model:total="total"
        v-model:page="params.pageNum"
        v-model:limit="params.pageSize"
        class="page-pagination"
        @pagination="fetchData"
      )

  el-drawer(
    v-model="dialogState.visible"
    :title="dialogState.title"
    append-to-body
    :size="drawerSize"
    @close="closeDialog"
  )
    el-form(ref="userFormRef" :model="formData" :rules="rules" label-width="80px")
      el-form-item(label="使用者名稱" prop="username")
        el-input(v-model="formData.username" :readonly="!!formData.id" placeholder="請輸入使用者名稱")
      el-form-item(label="使用者暱稱" prop="nickname")
        el-input(v-model="formData.nickname" placeholder="請輸入使用者暱稱")
      el-form-item(label="所屬部門" prop="deptId")
        el-tree-select(
          v-model="formData.deptId"
          placeholder="請選擇所屬部門"
          :data="deptOptions"
          filterable
          check-strictly
          :render-after-expand="false"
        )
      el-form-item(label="性別" prop="gender")
        AppDictSelect(v-model="formData.gender" code="gender")
      el-form-item(label="角色" prop="roleIds")
        el-select(v-model="formData.roleIds" multiple placeholder="請選擇")
          el-option(
            v-for="item in roleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          )
      el-form-item(label="手機號碼" prop="mobile")
        el-input(v-model="formData.mobile" placeholder="請輸入手機號碼" maxlength="10")
      el-form-item(label="郵箱" prop="email")
        el-input(v-model="formData.email" placeholder="請輸入郵箱" maxlength="50")
      el-form-item(label="狀態" prop="status")
        el-switch(
          v-model="formData.status"
          inline-prompt
          active-text="正常"
          inactive-text="禁用"
          :active-value="CommonStatus.ENABLED"
          :inactive-value="CommonStatus.DISABLED"
        )
    template(v-slot:footer)
      div(class="dialog-footer")
        el-button(type="primary" @click="handleSubmit") 確 定
        el-button(@click="closeDialog") 取 消

  el-dialog(
    v-model="resetPasswordDialog.visible"
    title="重置密碼"
    :width="resetPasswordDialogWidth"
    append-to-body
    @closed="resetResetPasswordForm"
  )
    div(class="mb-16px")
      | 使用者：
      | {{ resetPasswordDialog.nickname || resetPasswordDialog.username || "-" }}
      span(v-if="resetPasswordDialog.nickname && resetPasswordDialog.username") （ {{ resetPasswordDialog.username }} ）
    el-form(
      ref="resetPasswordFormRef"
      :model="resetPasswordForm"
      :rules="resetPasswordRules"
      label-width="84px"
    )
      el-form-item(label="新密碼" prop="password")
        el-input(
          v-model="resetPasswordForm.password"
          type="password"
          show-password
          autocomplete="new-password"
          placeholder="請輸入新密碼"
          @keyup.enter="handleResetPasswordSubmit"
        )
    template(v-slot:footer)
      div(class="dialog-footer")
        el-button(
          type="primary"
          :loading="resetPasswordSubmitting"
          @click="handleResetPasswordSubmit"
        ) 確 定
        el-button(@click="closeResetPasswordDialog") 取 消

  UserImportDialog(v-model="importDialogVisible" @import-success="handleQuery()")
</template>

<script setup lang="ts">
import { type FormInstance, type FormRules } from "element-plus";

import UserAPI from "@/api/system/user";
import DeptAPI from "@/api/system/dept";
import RoleAPI from "@/api/system/role";
import type { UserForm, UserItem, UserQueryParams } from "@/api/system/user";
import type { OptionItem } from "@/api/common";
import { useAppStore, useUserStore } from "@/stores";
import { usePageTable, useTableSelection } from "@/composables";
import { CommonStatus, DeviceEnum, DialogMode, UserGender } from "@/enums";
import { downloadFile, VALIDATORS } from "@/utils";
import { AppStatusColumn, type AppTableColumn } from "@/components/base/AppTableList";

import UserDeptTree from "@/components/pages/user/UserDeptTree.vue";
import UserImportDialog from "@/components/pages/user/UserImportDialog.vue";

defineOptions({
  name: "User",
  inheritAttrs: false,
});

const appStore = useAppStore();
const userStore = useUserStore();

const queryFormRef = ref<FormInstance>();
const userFormRef = ref<FormInstance>();
const resetPasswordFormRef = ref<FormInstance>();
const sidebarCollapsed = ref(false);

/** 分頁表格資料管理 */
const { loading, list, total, params, fetchData, handleQuery, handleResetQuery } = usePageTable<
  UserItem,
  UserQueryParams
>({
  initialParams: {
    pageNum: 1,
    pageSize: 10,
  },
  request: UserAPI.getPage,
  onBeforeReset: () => queryFormRef.value?.resetFields(),
});

const { selectedIds, hasSelection, handleSelectionChange } = useTableSelection<UserItem>();

const columns: AppTableColumn<UserItem>[] = [
  { type: "selection", width: 42, fixed: "left" },
  { label: "暱稱", slot: "nickname", minWidth: 140, fixed: "left", align: "left" },
  {
    label: "使用者名稱",
    prop: "username",
    minWidth: 120,
    align: "left",
    showOverflowTooltip: true,
  },
  {
    label: "狀態",
    prop: "status",
    width: 80,
    component: AppStatusColumn,
    componentProps: {
      enabledValue: CommonStatus.ENABLED,
      enabledLabel: "正常",
      disabledLabel: "禁用",
      disabledType: "danger",
    },
  },
  { label: "性別", slot: "gender", width: 70 },
  { label: "部門", prop: "deptName", minWidth: 140, align: "left", showOverflowTooltip: true },
  { label: "角色", prop: "roleNames", minWidth: 160, align: "left", showOverflowTooltip: true },
  { label: "手機號碼", prop: "mobile", width: 130, align: "left" },
  { label: "郵箱", prop: "email", minWidth: 180, align: "left", showOverflowTooltip: true },
  { label: "建立時間", prop: "createTime", width: 160, align: "left", showOverflowTooltip: true },
  { label: "操作", slot: "actions", fixed: "right", width: 200, align: "left" },
];

const dialogState = reactive({
  visible: false,
  title: "",
  mode: DialogMode.CREATE,
});

const importDialogVisible = ref(false);
const resetPasswordSubmitting = ref(false);

const initialFormData: UserForm = {
  status: CommonStatus.ENABLED,
};

const formData = reactive<UserForm>({ ...initialFormData });

type ResetPasswordForm = {
  password: string;
};

const resetPasswordDialog = reactive({
  visible: false,
  userId: "",
  username: "",
  nickname: "",
});

const resetPasswordForm = reactive<ResetPasswordForm>({
  password: "",
});

const deptOptions = ref<OptionItem[]>([]);
const roleOptions = ref<OptionItem[]>([]);

const drawerSize = computed(() => (appStore.device === DeviceEnum.DESKTOP ? "600px" : "90%"));

const resetPasswordDialogWidth = computed(() =>
  appStore.device === DeviceEnum.DESKTOP ? "420px" : "90%"
);

const rules: FormRules<UserForm> = {
  username: [{ required: true, message: "請輸入使用者名稱", trigger: "blur" }],
  nickname: [{ required: true, message: "請輸入使用者暱稱", trigger: "blur" }],
  deptId: [{ required: true, message: "請選擇所屬部門", trigger: "change" }],
  roleIds: [{ required: true, message: "請選擇使用者角色", trigger: "change" }],
  email: [{ type: "email", message: "請輸入正確的郵箱地址", trigger: "blur" }],
  mobile: [VALIDATORS.mobile],
};

const resetPasswordRules: FormRules<ResetPasswordForm> = {
  password: [
    { required: true, message: "請輸入新密碼", trigger: "blur" },
    { min: 6, message: "密碼至少需要6位字元", trigger: "blur" },
  ],
};

/**
 * 取暱稱/使用者名稱首字母作為頭像佔位文字。
 *
 * @param row 使用者行資料
 */
function getAvatarText(row: UserItem): string {
  const text = row.nickname || row.username || "?";
  return text.slice(0, 1).toUpperCase();
}

/**
 * 載入表單所需的下拉選項（角色 + 部門），並行請求。
 */
async function loadFormOptions(): Promise<void> {
  [roleOptions.value, deptOptions.value] = await Promise.all([
    RoleAPI.getOptions(),
    DeptAPI.getOptions(),
  ]);
}

/**
 * 開啟使用者表單彈窗。
 */
function openDialog(): void {
  dialogState.visible = true;
}

/**
 * 關閉使用者表單彈窗並清理臨時狀態。
 */
function closeDialog(): void {
  dialogState.visible = false;
  resetForm();
}

/**
 * 重置表單資料和驗證狀態。
 */
function resetForm(): void {
  userFormRef.value?.resetFields();
  userFormRef.value?.clearValidate();
  Object.keys(formData).forEach((key) => {
    delete (formData as Record<string, unknown>)[key];
  });
  Object.assign(formData, initialFormData);
}

/**
 * 開啟新增彈窗。
 */
async function handleCreateClick(): Promise<void> {
  dialogState.title = "新增使用者";
  dialogState.mode = DialogMode.CREATE;
  await loadFormOptions();
  openDialog();
}

/**
 * 開啟編輯彈窗並回填資料。
 */
async function handleEditClick(id: string): Promise<void> {
  dialogState.title = "修改使用者";
  dialogState.mode = DialogMode.EDIT;
  await loadFormOptions();
  const data = await UserAPI.getFormData(id);
  Object.assign(formData, data);
  openDialog();
}

/**
 * 校驗並提交使用者表單。
 */
const handleSubmit = useDebounceFn(async () => {
  const valid = await userFormRef.value?.validate().then(
    () => true,
    () => false
  );
  if (!valid) return;

  loading.value = true;
  try {
    if (formData.id) {
      await UserAPI.update(formData.id, formData);
      ElMessage.success("修改使用者成功");
    } else {
      await UserAPI.create(formData);
      ElMessage.success("新增使用者成功");
    }
    closeDialog();
    handleQuery();
  } finally {
    loading.value = false;
  }
}, 300);

/**
 * 刪除單個或批次使用者。
 * 安全檢查：禁止刪除當前登入使用者。
 * @param id 指定時刪除單個使用者；不指定時刪除表格勾選項
 */
async function handleDelete(id?: string): Promise<void> {
  const userIds = id ?? selectedIds.value.join(",");
  if (!userIds) {
    ElMessage.warning("請勾選刪除項");
    return;
  }

  // 安全檢查：防止刪除當前登入使用者
  const currentUserId = userStore.userInfo?.userId;
  if (currentUserId) {
    const isCurrentUserInList = id
      ? id === currentUserId
      : selectedIds.value.some((selectedId) => String(selectedId) === currentUserId);
    if (isCurrentUserInList) {
      ElMessage.error("不能刪除當前登入使用者");
      return;
    }
  }

  try {
    await ElMessageBox.confirm("確認刪除選中的使用者嗎？", "警告", {
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
    await UserAPI.deleteByIds(userIds);
    ElMessage.success("刪除成功");
    handleQuery();
  } finally {
    loading.value = false;
  }
}

/**
 * 匯出當前查詢條件下的使用者列表。
 */
async function handleExport(): Promise<void> {
  const response = await UserAPI.export(params);
  downloadFile(response);
  ElMessage.success("匯出成功");
}

/**
 * 開啟使用者匯入彈窗。
 */
function openImportDialog(): void {
  importDialogVisible.value = true;
}

/**
 * 開啟重置密碼彈窗。
 * @param row 使用者行資料
 */
function openResetPasswordDialog(row: UserItem): void {
  resetPasswordDialog.userId = row.id;
  resetPasswordDialog.username = row.username ?? "";
  resetPasswordDialog.nickname = row.nickname ?? "";
  resetPasswordDialog.visible = true;

  nextTick(() => {
    resetPasswordFormRef.value?.clearValidate();
  });
}

/**
 * 關閉重置密碼彈窗。
 */
function closeResetPasswordDialog(): void {
  resetPasswordDialog.visible = false;
}

/**
 * 重置密碼錶單狀態。
 */
function resetResetPasswordForm(): void {
  resetPasswordFormRef.value?.resetFields();
  resetPasswordFormRef.value?.clearValidate();
  resetPasswordForm.password = "";
  resetPasswordDialog.userId = "";
  resetPasswordDialog.username = "";
  resetPasswordDialog.nickname = "";
}

/**
 * 提交重置密碼。
 */
const handleResetPasswordSubmit = useDebounceFn(async () => {
  const valid = await resetPasswordFormRef.value?.validate().then(
    () => true,
    () => false
  );
  if (!valid || !resetPasswordDialog.userId) return;

  resetPasswordSubmitting.value = true;
  try {
    await UserAPI.resetPassword(resetPasswordDialog.userId, resetPasswordForm.password);
    ElMessage.success("密碼重置成功");
    closeResetPasswordDialog();
  } finally {
    resetPasswordSubmitting.value = false;
  }
}, 300);

onMounted(() => {
  handleQuery();
});
</script>

<style lang="scss" scoped>
.user-name-cell {
  display: inline-flex;
  gap: 8px;
  align-items: center;

  &__text {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    font-size: 12px;
    font-weight: 500;
    color: var(--el-color-primary);
    background: var(--el-color-primary-light-9);
    border-radius: 50%;
  }
}
</style>
