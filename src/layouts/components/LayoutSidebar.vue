<template lang="pug">
el-menu(
  ref="menuRef"
  :default-active="activeMenuPath"
  :collapse="!appStore.sidebar.opened"
  :background-color="menuThemeProps.backgroundColor"
  :text-color="menuThemeProps.textColor"
  :active-text-color="menuThemeProps.activeTextColor"
  popper-effect="light"
  :unique-opened="false"
  :collapse-transition="false"
  mode="vertical"
  @open="onMenuOpen"
  @close="onMenuClose"
)
  LayoutSidebarItem(
    v-for="route in data"
    :key="route.path"
    :item="route"
    :base-path="resolveFullPath(route.path)"
  )
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import path from "path-browserify";
import type { MenuInstance } from "element-plus";
import type { RouteRecordRaw } from "vue-router";
import { useAppStore } from "@/stores";
import { isExternal } from "@/utils/index";
import LayoutSidebarItem from "./LayoutSidebarItem.vue";
import variables from "@/styles/variables.module.scss";
const props = defineProps({
  data: {
    type: Array as PropType<RouteRecordRaw[]>,
    default: () => [],
  },
  basePath: {
    type: String,
    required: true,
    example: "/system",
  },
});

const menuRef = ref<MenuInstance>();
const appStore = useAppStore();
const currentRoute = useRoute();

const expandedMenuIndexes = ref<string[]>([]);

const menuThemeProps = {
  backgroundColor: variables["menu-background"],
  textColor: variables["menu-text"],
  activeTextColor: variables["menu-active-text"],
};

const activeMenuPath = computed((): string => {
  const { meta, path } = currentRoute;

  if (meta?.activeMenu && typeof meta.activeMenu === "string") {
    return meta.activeMenu;
  }

  return path;
});

/**
 * 解析選單跳轉路徑
 */
function resolveFullPath(routePath: string) {
  if (isExternal(routePath)) {
    return routePath;
  }
  if (isExternal(props.basePath)) {
    return props.basePath;
  }

  if (!props.basePath || props.basePath === "") {
    return routePath;
  }

  return path.resolve(props.basePath, routePath);
}

/**
 * 記錄展開的子選單
 */
const onMenuOpen = (index: string) => {
  if (expandedMenuIndexes.value.includes(index)) return;
  expandedMenuIndexes.value.push(index);
};

/**
 * 移除已收起的子選單
 */
const onMenuClose = (index: string) => {
  expandedMenuIndexes.value = expandedMenuIndexes.value.filter((item) => item !== index);
};

/**
 * 展開狀態變化後同步父級選單啟用態
 */
watch(
  () => expandedMenuIndexes.value,
  () => {
    syncActiveParentMenus();
  }
);

/**
 * 路由啟用項變化後同步父級選單啟用態
 */
watch(
  () => activeMenuPath.value,
  () => {
    nextTick(() => {
      syncActiveParentMenus();
    });
  },
  { immediate: true }
);

/**
 * TagsView 切換時重新計算父級選單啟用態
 */
watch(
  () => currentRoute.path,
  () => {
    nextTick(() => {
      syncActiveParentMenus();
    });
  }
);

/**
 * 標記包含當前路由的父級選單
 */
function syncActiveParentMenus() {
  if (!menuRef.value?.$el) return;

  nextTick(() => {
    try {
      const menuEl = menuRef.value?.$el as HTMLElement;
      if (!menuEl) return;

      const allSubMenus = menuEl.querySelectorAll(".el-sub-menu");
      allSubMenus.forEach((subMenu) => {
        subMenu.classList.remove("has-active-child");
      });

      const activeMenuItem = menuEl.querySelector(".el-menu-item.is-active");

      if (activeMenuItem) {
        let parent = activeMenuItem.parentElement;
        while (parent && parent !== menuEl) {
          if (parent.classList.contains("el-sub-menu")) {
            parent.classList.add("has-active-child");
          }
          parent = parent.parentElement;
        }
        return;
      }
    } catch (error) {
      console.error("Error updating parent menu styles:", error);
    }
  });
}

/**
 * 首次掛載後同步父級選單啟用態
 */
onMounted(() => {
  syncActiveParentMenus();
});
</script>
