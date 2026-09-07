<template lang="pug">
div(class="layout-toolbar")
  template(v-if="isDesktop")
    div(class="layout-toolbar__item")
      AppLangSelect
    div(class="layout-toolbar__item")
      AppNoticeDropdown
  div(class="layout-toolbar__item layout-toolbar__item--profile")
    el-dropdown(trigger="click")
      div(class="layout-user")
        div(class="layout-user__avatar")
          img(:src="userStore.userInfo.avatar" class="layout-user__avatar-img")
        span(class="layout-user__name") {{ userStore.userInfo.username }}
      template(v-slot:dropdown)
        el-dropdown-menu
          el-dropdown-item(@click="handleProfileClick") {{ t("navbar.profile") }}
          el-dropdown-item(divided @click="logout") {{ t("navbar.logout") }}
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { DeviceEnum } from "@/enums/settings";
import { useAppStore, useUserStore } from "@/stores";

import AppLangSelect from "@/components/base/AppLangSelect/index.vue";
import AppNoticeDropdown from "@/components/base/AppNoticeDropdown/index.vue";

const { t } = useI18n();
const appStore = useAppStore();
const userStore = useUserStore();

const route = useRoute();
const router = useRouter();

const isDesktop = computed(() => appStore.device === DeviceEnum.DESKTOP);

/**
 * 開啟個人中心頁面
 */
function handleProfileClick() {
  router.push({ name: "Profile" });
}

/**
 * 退出登入
 */
function logout() {
  ElMessageBox.confirm("確定登出並退出系統嗎？", "提示", {
    confirmButtonText: "確定",
    cancelButtonText: "取消",
    type: "warning",
    lockScroll: false,
  }).then(() => {
    userStore.logout().then(() => {
      const redirect = ["/404", "/401"].includes(route.path) ? "/" : route.fullPath;
      router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
    });
  });
}
</script>

<style lang="scss" scoped>
.layout-toolbar {
  --layout-toolbar-color: var(--el-text-color-secondary);
  --layout-toolbar-hover-color: var(--el-color-primary);
  --layout-toolbar-hover-bg: var(--el-fill-color-light);

  display: flex;
  gap: 4px;
  align-items: center;
  min-height: 32px;

  &__item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 32px;
    padding: 0 6px;
    color: var(--layout-toolbar-color);
    text-align: center;
    cursor: pointer;
    border-radius: 6px;
    transition:
      background-color 0.16s,
      color 0.16s;

    > [class*="i-svg:"] {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    :deep(.el-dropdown),
    :deep(.el-tooltip) {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 32px;
      color: inherit !important;
    }

    :deep(.el-tooltip__trigger),
    :deep(.notice__trigger) {
      color: inherit;
    }

    :deep(.i-svg\:language) {
      flex-shrink: 0;
      width: 16px;
      height: 16px;
      font-size: 16px;
      line-height: 16px;
      background-size: 16px 16px;
    }

    :deep([class*="i-svg:"]),
    :deep(.el-icon) {
      --color: currentColor;

      font-size: 16px;
      line-height: 1;
      color: currentColor !important;
      transition: color 0.16s;
    }

    :deep([class*="i-svg:"]) {
      background-color: currentColor !important;
    }

    &:hover {
      color: var(--layout-toolbar-hover-color);
      background: var(--layout-toolbar-hover-bg);
    }
  }

  &__item--search {
    color: var(--el-text-color-secondary);

    &:hover {
      background: transparent;
    }
  }

  &__item--profile {
    padding-right: 4px;
    padding-left: 4px;

    &:hover {
      background: transparent;
    }
  }
}

.layout-user {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 0 6px 0 2px;

  &__avatar {
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    overflow: hidden;
    border-radius: 50%;
  }

  &__avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  &__name {
    margin-left: 8px;
    font-size: 13px;
    color: var(--el-text-color-regular);
    white-space: nowrap;
    transition: color 0.3s;
  }
}

::v-deep(.el-dropdown-menu) {
  [class*="i-svg:"] {
    color: var(--el-text-color-regular) !important;

    &:hover {
      color: var(--el-color-primary) !important;
    }
  }
}
</style>
