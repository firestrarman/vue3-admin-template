<template lang="pug">
div(class="page-container")
  el-card(class="page-search" shadow="never")
    el-form(ref="queryFormRef" :model="queryParams" :inline="true")
      el-form-item(label="關鍵字" prop="keywords")
        el-input(
          v-model="queryParams.keywords"
          placeholder="選單名稱"
          clearable
          @keyup.enter="handleQuery"
        )
      el-form-item
        el-button(type="primary" @click="handleQuery") 搜尋
        el-button(@click="handleResetQuery") 重置

  el-card(class="page-content" shadow="never")
    div(class="page-toolbar")
      div(class="page-toolbar__left")
        el-button(v-hasPerm="['sys:menu:create']" type="primary" @click="openDialog('0')") 新增
      div(class="page-toolbar__right")
        el-tooltip(content="重新整理" placement="top")
          el-button(class="page-icon-btn" @click="handleQuery")
            el-icon
              Refresh

    div(class="page-table-wrapper")
      AppTableList(
        v-loading="loading"
        class="page-table"
        border
        row-key="id"
        height="100%"
        :data="list"
        :columns="columns"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @row-click="handleRowClick"
      )
        template(v-slot:name="{ row }")
          div(class="menu-name-cell")
            span(class="menu-name-cell__icon")
              template(v-if="row.icon && row.icon.startsWith('el-icon')")
                el-icon(style="vertical-align: -0.15em")
                  component(:is="row.icon.replace('el-icon-', '')")
              template(v-else-if="row.icon")
                span(:class="`i-svg:${row.icon}`")
            span(class="menu-name-cell__text") {{ row.name }}

        template(v-slot:type="{ row }")
          el-tag(v-if="row.type === MenuTypeEnum.CATALOG" type="warning") 目錄
          el-tag(v-if="row.type === MenuTypeEnum.MENU" type="success") 選單
          el-tag(v-if="row.type === MenuTypeEnum.EXTERNAL" type="primary") 外鏈
          el-tag(v-if="row.type === MenuTypeEnum.BUTTON" type="danger") 按鈕
        template(v-slot:routePath="{ row }") {{ getMenuAccessPath(row) }}
        template(v-slot:component="{ row }") {{ getMenuComponentPath(row) }}
        template(v-slot:actions="{ row }")
          el-button(
            v-if="row.type === MenuTypeEnum.CATALOG || row.type === MenuTypeEnum.MENU"
            v-hasPerm="['sys:menu:create']"
            type="primary"
            link
            size="small"
            @click.stop="openDialog(row.id)"
          ) 新增
          el-button(
            v-hasPerm="['sys:menu:update']"
            type="primary"
            link
            size="small"
            @click.stop="openDialog(undefined, row.id)"
          ) 編輯
          el-button(
            v-hasPerm="['sys:menu:delete']"
            type="danger"
            link
            size="small"
            @click.stop="row.id && handleDelete(row.id)"
          ) 刪除

  el-drawer(
    v-model="dialogState.visible"
    :title="dialogState.title"
    :size="drawerSize"
    @close="closeDialog"
  )
    el-form(ref="menuFormRef" class="menu-form" :model="formData" :rules="rules" label-width="140px")
      el-form-item(label="父級選單" prop="parentId")
        el-tree-select(
          v-model="formData.parentId"
          placeholder="選擇上級選單"
          :data="menuOptions"
          filterable
          check-strictly
          :render-after-expand="false"
        )

      el-form-item(label="選單名稱" prop="name")
        el-input(v-model="formData.name" placeholder="請輸入選單名稱")

      el-form-item(label="選單型別" prop="type")
        div(class="menu-type-field")
          el-radio-group(v-model="formData.type" class="menu-type-group" @change="handleMenuTypeChange")
            el-radio-button(:value="MenuTypeEnum.CATALOG") 目錄
            el-radio-button(:value="MenuTypeEnum.MENU") 選單
            el-radio-button(:value="MenuTypeEnum.EXTERNAL") 外鏈
            el-radio-button(:value="MenuTypeEnum.BUTTON") 按鈕
          div(class="menu-type-hint") {{ menuTypeHint }}

      template(v-if="showPageConfig")
        el-form-item(prop="routePath")
          template(v-slot:label)
            div(class="flex-y-center")
              | 路由路徑
              el-tooltip(content="填寫當前選單這一段路徑，例如 user；完整路徑會自動跟隨父級選單" placement="bottom")
                el-icon(class="ml-1 cursor-pointer")
                  QuestionFilled
          el-input(v-model="formData.routePath" placeholder="user")

        el-form-item(prop="component")
          template(v-slot:label)
            div(class="flex-y-center")
              | 頁面元件
              el-tooltip(content="填寫 src/views 下的頁面路徑，省略 .vue 字尾" placement="bottom")
                el-icon(class="ml-1 cursor-pointer")
                  QuestionFilled
          el-input(v-model="formData.component" placeholder="system/user/index")
            template(v-slot:prepend) src/views/
            template(v-slot:append) .vue

      template(v-if="showCatalogConfig")
        el-form-item(prop="routePath")
          template(v-slot:label)
            div(class="flex-y-center")
              | 路由路徑
              el-tooltip(content="頂級目錄填寫完整路徑，例如 /system；子級目錄只填當前這一段，例如 report" placement="bottom")
                el-icon(class="ml-1 cursor-pointer")
                  QuestionFilled
          el-input(v-model="formData.routePath" placeholder="/system")

        el-form-item
          template(v-slot:label)
            div(class="flex-y-center")
              | 預設跳轉
              el-tooltip(
                content="訪問當前目錄路徑時，自動跳轉到指定頁面。通常填寫該目錄下的預設選單完整路徑，例如 /system/user。"
                placement="bottom"
              )
                el-icon(class="ml-1 cursor-pointer")
                  QuestionFilled
          el-input(v-model="formData.redirect" placeholder="/system/user")

      template(v-if="showExternalConfig")
        el-form-item(label="外鏈地址" prop="externalUrl")
          el-input(v-model="formData.externalUrl" placeholder="https://example.com" clearable)

      template(v-if="showPermissionConfig")
        el-form-item(label="權限標識" prop="perm")
          el-input(v-model="formData.perm" placeholder="sys:user:create")

      el-form-item(v-if="formData.type !== MenuTypeEnum.BUTTON" prop="visible" label="顯示狀態")
        el-radio-group(v-model="formData.visible")
          el-radio(:value="CommonStatus.ENABLED") 顯示
          el-radio(:value="CommonStatus.DISABLED") 隱藏

      el-form-item(v-if="showCatalogDisplay")
        template(v-slot:label)
          div(class="flex-y-center")
            | 單子級顯示
            el-tooltip(content="僅在當前項只有 1 個可見子級時生效。選擇“始終顯示本級”後，會保留當前項再顯示子級。" placement="bottom")
              el-icon(class="ml-1 cursor-pointer")
                QuestionFilled

        el-radio-group(v-model="formData.alwaysShow")
          el-radio(:value="0") 顯示子級
          el-radio(:value="1") 始終顯示本級

      el-form-item(v-if="showPageCache" label="頁面快取")
        el-radio-group(v-model="formData.keepAlive" @change="handleKeepAliveChange")
          el-radio(:value="1") 開啟
          el-radio(:value="0") 關閉

      el-form-item(v-if="showRouteName" prop="routeName")
        template(v-slot:label)
          div(class="flex-y-center")
            | 頁面標識
            el-tooltip(:content="routeNameTooltip" placement="bottom")
              el-icon(class="ml-1 cursor-pointer")
                QuestionFilled
        el-input(v-model="formData.routeName" :placeholder="routeNamePlaceholder")

      el-form-item(v-if="showRouteParams")
        template(v-slot:label)
          div(class="flex-y-center")
            | 路由引數
            el-tooltip(placement="bottom" effect="light")
              template(v-slot:content) 頁面內可透過 useRoute().query 讀取
              el-icon(class="ml-1 cursor-pointer")
                QuestionFilled
        div(v-if="!formData.params || formData.params.length === 0")
          el-button(type="primary" plain @click="formData.params = [{ key: '', value: '' }]") 新增引數

        div(v-else class="menu-param-list")
          div(v-for="(item, index) in formData.params" :key="index" class="menu-param-row")
            el-input(v-model="item.key" placeholder="引數名")
            span(class="menu-param-row__equal") =
            el-input(v-model="item.value" placeholder="引數值")
            el-icon(
              v-if="formData.params.indexOf(item) === formData.params.length - 1"
              class="menu-param-row__action is-add"
              @click="formData.params.push({ key: '', value: '' })"
            )
              CirclePlusFilled
            el-icon(
              class="menu-param-row__action is-delete"
              @click="formData.params.splice(formData.params.indexOf(item), 1)"
            )
              DeleteFilled

      el-form-item(v-if="formData.type !== MenuTypeEnum.BUTTON" label="圖示" prop="icon")
        app-icon-select(v-model="formData.icon")

      el-form-item(label="排序" prop="sort")
        el-input-number(
          v-model="formData.sort"
          style="width: 120px"
          controls-position="right"
          :min="0"
        )

    template(v-slot:footer)
      div(class="dialog-footer")
        el-button(type="primary" @click="handleSubmit") 確定
        el-button(@click="closeDialog") 取消
</template>

<script setup lang="ts">
import { type FormInstance, type FormRules } from "element-plus";
import { CirclePlusFilled, DeleteFilled, QuestionFilled, Refresh } from "@element-plus/icons-vue";

import MenuAPI from "@/api/system/menu";
import type { MenuForm, MenuItem, MenuQueryParams } from "@/api/system/menu";
import type { OptionItem } from "@/api/common";
import { useAppStore } from "@/stores/app";
import { CommonStatus, MenuTypeEnum } from "@/enums";
import { DeviceEnum } from "@/enums/settings";
import { isValidURL } from "@/utils";
import { AppStatusColumn, type AppTableColumn } from "@/components/base/AppTableList";

defineOptions({
  name: "SysMenu",
  inheritAttrs: false,
});

const appStore = useAppStore();

const queryFormRef = ref<FormInstance>();
const menuFormRef = ref<FormInstance>();

const loading = ref(false);
const list = ref<MenuItem[]>([]);
const queryParams = reactive<MenuQueryParams>({ keywords: "" });

const columns: AppTableColumn<MenuItem>[] = [
  { label: "選單名稱", slot: "name", minWidth: 200, align: "left" },
  { label: "型別", slot: "type", width: 80 },
  { label: "路由路徑", slot: "routePath", minWidth: 180, align: "left" },
  { label: "頁面元件", slot: "component", minWidth: 180, align: "left" },
  { label: "權限標識", prop: "perm", width: 200 },
  {
    label: "狀態",
    prop: "visible",
    width: 80,
    component: AppStatusColumn,
    componentProps: {
      enabledValue: CommonStatus.ENABLED,
      enabledLabel: "顯示",
      disabledLabel: "隱藏",
    },
  },
  { label: "排序", prop: "sort", width: 80 },
  { label: "操作", slot: "actions", fixed: "right", width: 220 },
];

const dialogState = reactive({
  title: "新增選單",
  visible: false,
});

const menuOptions = ref<OptionItem[]>([]);

const initialFormData: MenuForm = {
  id: undefined,
  parentId: "0",
  visible: CommonStatus.ENABLED,
  sort: 1,
  type: MenuTypeEnum.MENU,
  alwaysShow: 0,
  keepAlive: 1,
  params: [],
};

const menuTypes = [
  MenuTypeEnum.CATALOG,
  MenuTypeEnum.MENU,
  MenuTypeEnum.EXTERNAL,
  MenuTypeEnum.BUTTON,
];

const formData = reactive<MenuForm>({ ...initialFormData });
const currentMenuType = ref<MenuTypeEnum>(MenuTypeEnum.MENU);
const menuTypeDrafts = reactive<Record<MenuTypeEnum, Partial<MenuForm>>>(createMenuTypeDrafts());

// 抽屜寬度（響應式）。
const drawerSize = computed(() => (appStore.device === DeviceEnum.DESKTOP ? "600px" : "90%"));

const showCatalogConfig = computed(() => formData.type === MenuTypeEnum.CATALOG);

const showPageConfig = computed(() => formData.type === MenuTypeEnum.MENU);

const showExternalConfig = computed(() => formData.type === MenuTypeEnum.EXTERNAL);

const showPermissionConfig = computed(() => formData.type === MenuTypeEnum.BUTTON);

const showRoutePath = computed(
  () => formData.type === MenuTypeEnum.CATALOG || formData.type === MenuTypeEnum.MENU
);

const showCatalogDisplay = computed(() => formData.type === MenuTypeEnum.CATALOG);

const showPageCache = computed(() => formData.type === MenuTypeEnum.MENU);

const showRouteName = computed(() => showPageCache.value && isStatusEnabled(formData.keepAlive));

const showRouteParams = computed(() => formData.type === MenuTypeEnum.MENU);

const routeNameTooltip = "開啟快取時填寫，需和頁面元件 name 保持一致，例如 User";

const routeNamePlaceholder = "User";

const menuTypeHint = computed(() => {
  if (formData.type === MenuTypeEnum.CATALOG) {
    return "用於選單分組，不直接對應頁面";
  }

  if (formData.type === MenuTypeEnum.MENU) {
    return "最常用，關聯絡統內部頁面";
  }

  if (formData.type === MenuTypeEnum.EXTERNAL) {
    return "開啟第三方地址，將在新標籤頁開啟";
  }

  if (formData.type === MenuTypeEnum.BUTTON) {
    return "用於控制頁面按鈕或操作權限";
  }

  return "";
});

const validateRouteName = (_: unknown, value: string, callback: (error?: Error) => void) => {
  if (showRouteName.value && !value) {
    callback(new Error("請輸入頁面標識"));
    return;
  }
  callback();
};

function isStatusEnabled(value?: number | boolean): boolean {
  return value === CommonStatus.ENABLED || value === true;
}

function createMenuTypeDrafts(): Record<MenuTypeEnum, Partial<MenuForm>> {
  return {
    [MenuTypeEnum.CATALOG]: {
      routePath: "",
      redirect: "",
      icon: "",
      alwaysShow: 0,
    },
    [MenuTypeEnum.MENU]: {
      routeName: "",
      routePath: "",
      component: "",
      icon: "",
      keepAlive: 1,
      params: [],
    },
    [MenuTypeEnum.EXTERNAL]: {
      externalUrl: "",
      icon: "",
    },
    [MenuTypeEnum.BUTTON]: {
      perm: "",
    },
  };
}

function getMenuType(type?: MenuForm["type"]): MenuTypeEnum {
  return menuTypes.includes(type as MenuTypeEnum) ? (type as MenuTypeEnum) : MenuTypeEnum.MENU;
}

const validateRoutePath = (_: unknown, value: string, callback: (error?: Error) => void) => {
  if (showRoutePath.value && !value) {
    callback(new Error("請輸入路由路徑"));
    return;
  }
  callback();
};

const validateComponent = (_: unknown, value: string, callback: (error?: Error) => void) => {
  if (formData.type === MenuTypeEnum.MENU && !value) {
    callback(new Error("請輸入頁面元件"));
    return;
  }
  callback();
};

const validateExternalUrl = (_: unknown, value: string, callback: (error?: Error) => void) => {
  if (formData.type !== MenuTypeEnum.EXTERNAL) {
    callback();
    return;
  }

  if (!value) {
    callback(new Error("請輸入外鏈地址"));
    return;
  }

  if (!isValidURL(value)) {
    callback(new Error("請輸入正確的外鏈地址"));
    return;
  }

  callback();
};

const validatePerm = (_: unknown, value: string, callback: (error?: Error) => void) => {
  if (formData.type === MenuTypeEnum.BUTTON && !value) {
    callback(new Error("請輸入權限標識"));
    return;
  }
  callback();
};

const rules: FormRules<MenuForm> = {
  parentId: [{ required: true, message: "請選擇父級選單", trigger: "blur" }],
  name: [{ required: true, message: "請輸入選單名稱", trigger: "blur" }],
  type: [{ required: true, message: "請選擇選單型別", trigger: "blur" }],
  routeName: [
    { required: true, message: "請輸入頁面標識", validator: validateRouteName, trigger: "blur" },
  ],
  routePath: [
    { required: true, message: "請輸入路由路徑", validator: validateRoutePath, trigger: "blur" },
  ],
  component: [
    { required: true, message: "請輸入頁面元件", validator: validateComponent, trigger: "blur" },
  ],
  externalUrl: [
    { required: true, message: "請輸入外鏈地址", validator: validateExternalUrl, trigger: "blur" },
  ],
  perm: [{ required: true, message: "請輸入權限標識", validator: validatePerm, trigger: "blur" }],

  visible: [{ required: true, message: "請選擇顯示狀態", trigger: "change" }],
};

/**
 * 拉取選單列表資料（一次性返回全量樹）。
 */
async function fetchData(): Promise<void> {
  loading.value = true;
  try {
    list.value = await MenuAPI.getList(queryParams);
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
 * 重置搜尋表單後重新查詢。
 */
function handleResetQuery(): void {
  queryFormRef.value?.resetFields();
  fetchData();
}

/**
 * 表格行點選事件
 *
 * @param row 當前選單行
 */
function handleRowClick(row: MenuItem): void {
  void row;
}

/**
 * 獲取選單列表中的路徑
 */
function getMenuAccessPath(row: MenuItem): string {
  if (row.type === MenuTypeEnum.EXTERNAL) {
    return row.externalUrl ?? "";
  }
  return row.routePath ?? "";
}

/**
 * 獲取選單列表中的元件路徑
 */
function getMenuComponentPath(row: MenuItem): string {
  if (row.type !== MenuTypeEnum.MENU) return "";
  return row.component ?? "";
}

/**
 * 根據父級選單推斷新增型別
 */
function getDefaultMenuType(parentId?: string): MenuForm["type"] {
  if (!parentId || parentId === "0") return MenuTypeEnum.CATALOG;

  const parent = findMenuById(list.value, parentId);
  if (parent?.type === MenuTypeEnum.MENU) return MenuTypeEnum.BUTTON;

  return MenuTypeEnum.MENU;
}

/**
 * 從選單樹中查詢指定選單
 */
function findMenuById(menus: MenuItem[], id: string): MenuItem | undefined {
  for (const menu of menus) {
    if (menu.id === id) return menu;

    const child = findMenuById(menu.children ?? [], id);
    if (child) return child;
  }
}

/**
 * 按選單型別清理無關欄位
 */
function normalizeMenuPayload(): MenuForm {
  const payload: MenuForm = {
    ...formData,
    params: formData.params?.filter((item) => item.key && item.value) ?? [],
  };

  if (payload.type === MenuTypeEnum.CATALOG) {
    payload.routeName = undefined;
    payload.component = undefined;
    payload.externalUrl = undefined;
    payload.perm = undefined;
    payload.keepAlive = undefined;
    payload.params = [];
  }

  if (payload.type === MenuTypeEnum.MENU) {
    payload.externalUrl = undefined;
    payload.redirect = undefined;
    payload.perm = undefined;
    payload.alwaysShow = undefined;

    if (!isStatusEnabled(payload.keepAlive)) {
      payload.routeName = undefined;
    }
  }

  if (payload.type === MenuTypeEnum.EXTERNAL) {
    payload.perm = undefined;
    payload.redirect = undefined;
    payload.alwaysShow = undefined;
    payload.params = [];
    payload.routeName = undefined;
    payload.routePath = undefined;
    payload.keepAlive = undefined;
    payload.component = undefined;
  }

  if (payload.type === MenuTypeEnum.BUTTON) {
    payload.routeName = undefined;
    payload.routePath = undefined;
    payload.component = undefined;
    payload.externalUrl = undefined;
    payload.redirect = undefined;
    payload.icon = undefined;
    payload.keepAlive = undefined;
    payload.alwaysShow = undefined;
    payload.params = [];
  }

  return payload;
}

function resetMenuTypeDrafts(): void {
  Object.assign(menuTypeDrafts, createMenuTypeDrafts());
}

function saveMenuTypeDraft(type: MenuTypeEnum): void {
  menuTypeDrafts[type] = {
    routeName: formData.routeName,
    routePath: formData.routePath,
    component: formData.component,
    externalUrl: formData.externalUrl,
    icon: formData.icon,
    redirect: formData.redirect,
    perm: formData.perm,
    alwaysShow: formData.alwaysShow,
    keepAlive: formData.keepAlive,
    params: formData.params?.map((item) => ({ ...item })) ?? [],
  };
}

/**
 * 保留各型別已填寫內容，避免切換型別時丟失草稿
 */
function syncCurrentMenuTypeDraft(): void {
  saveMenuTypeDraft(currentMenuType.value);
  restoreMenuTypeDraft(currentMenuType.value);
}

function restoreMenuTypeDraft(type: MenuTypeEnum): void {
  const draft = menuTypeDrafts[type] ?? {};
  Object.assign(formData, {
    routeName: undefined,
    routePath: undefined,
    component: undefined,
    externalUrl: undefined,
    icon: undefined,
    redirect: undefined,
    perm: undefined,
    alwaysShow: undefined,
    keepAlive: undefined,
    params: [],
    ...draft,
    type,
  });

  applyMenuTypeDefaults();
}

/**
 * 替換表單資料，避免上一次編輯殘留欄位
 */
function assignFormData(data: MenuForm): void {
  Object.keys(formData).forEach((key) => {
    delete (formData as Record<string, unknown>)[key];
  });
  Object.assign(formData, data);

  resetMenuTypeDrafts();
  currentMenuType.value = getMenuType(data.type);
  saveMenuTypeDraft(currentMenuType.value);
  syncCurrentMenuTypeDraft();
}

/**
 * 重置表單資料和驗證狀態
 */
function resetForm(): void {
  menuFormRef.value?.resetFields();
  menuFormRef.value?.clearValidate();
  assignFormData({ ...initialFormData });
}

/**
 * 開啟新增/編輯選單彈窗。
 *
 * @param parentId 父選單 ID（新增子選單時傳入）
 * @param menuId 選單 ID（編輯時傳入）
 */
async function openDialog(parentId?: string, menuId?: string): Promise<void> {
  const data = await MenuAPI.getOptions(true);
  menuOptions.value = [{ value: "0", label: "頂級選單", children: data }];

  dialogState.visible = true;
  if (menuId) {
    dialogState.title = "編輯選單";
    const form = await MenuAPI.getFormData(menuId);
    assignFormData(form);
  } else {
    dialogState.title = "新增選單";
    const nextParentId = parentId?.toString() ?? "0";
    assignFormData({
      ...initialFormData,
      parentId: nextParentId,
      type: getDefaultMenuType(nextParentId),
    });
  }
}

/**
 * 補齊當前選單型別的預設欄位
 */
function applyMenuTypeDefaults(): void {
  if (formData.type === MenuTypeEnum.CATALOG) {
    formData.alwaysShow ??= 0;
  }

  if (formData.type === MenuTypeEnum.MENU) {
    formData.keepAlive ??= 1;
    formData.params ??= [];
  }

  if (formData.type === MenuTypeEnum.EXTERNAL) {
    formData.params = [];
    formData.component = undefined;
    formData.routeName = undefined;
    formData.routePath = undefined;
    formData.keepAlive = undefined;
  }

  if (formData.type === MenuTypeEnum.BUTTON) {
    formData.icon = undefined;
  }
}

/**
 * 選單型別切換事件
 */
function handleMenuTypeChange(): void {
  const nextType = getMenuType(formData.type);
  if (currentMenuType.value === nextType) return;

  saveMenuTypeDraft(currentMenuType.value);
  currentMenuType.value = nextType;
  restoreMenuTypeDraft(nextType);

  nextTick(() => menuFormRef.value?.clearValidate());
}

/**
 * 切換快取狀態後重新整理頁面標識校驗
 */
function handleKeepAliveChange(): void {
  menuFormRef.value?.clearValidate("routeName");
}

/**
 * 校驗並提交選單表單。
 */
async function handleSubmit(): Promise<void> {
  const valid = await menuFormRef.value?.validate().then(
    () => true,
    () => false
  );
  if (!valid) return;

  const menuId = formData.id;
  if (menuId && formData.parentId === menuId) {
    ElMessage.error("父級選單不能為當前選單");
    return;
  }

  const payload = normalizeMenuPayload();
  loading.value = true;
  try {
    if (menuId) {
      await MenuAPI.update(menuId, payload);
      ElMessage.success("修改成功");
    } else {
      await MenuAPI.create(payload);
      ElMessage.success("新增成功");
    }
    closeDialog();
    fetchData();
  } finally {
    loading.value = false;
  }
}

/**
 * 刪除選單
 * @param menuId 選單 ID
 */
async function handleDelete(menuId: string): Promise<void> {
  if (!menuId) {
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
    await MenuAPI.deleteById(menuId);
    ElMessage.success("刪除成功");
    fetchData();
  } finally {
    loading.value = false;
  }
}

/**
 * 關閉彈窗並重置表單。
 */
function closeDialog(): void {
  dialogState.visible = false;
  resetForm();
}

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.menu-form {
  padding-right: 4px;
}

.menu-form :deep(.el-form-item__label) {
  white-space: nowrap;
}

.menu-type-field {
  width: 100%;
}

.menu-type-group {
  display: flex;
  width: 100%;
}

.menu-type-group :deep(.el-radio-button) {
  flex: 1;
}

.menu-type-group :deep(.el-radio-button__inner) {
  width: 100%;
}

.menu-type-hint {
  margin-top: 8px;
  font-size: 12px;
  line-height: 1.4;
  color: var(--el-text-color-secondary);
}

.menu-param-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.menu-param-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) 18px 18px;
  gap: 8px;
  align-items: center;
  width: 100%;
}

.menu-param-row__equal {
  color: var(--el-text-color-secondary);
}

.menu-param-row__action {
  cursor: pointer;
}

.menu-param-row__action.is-add {
  color: var(--el-color-success);
}

.menu-param-row__action.is-delete {
  color: var(--el-color-danger);
}

.menu-name-cell {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
}

.menu-name-cell__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  min-width: 18px;
  margin-right: 6px;
}

.menu-name-cell__text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
