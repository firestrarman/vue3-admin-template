<template lang="pug">
div(class="layout-navbar")
  div(class="flex-y-center")
    AppHamburger(:is-active="appStore.sidebar.opened" @toggle-click="appStore.toggleSidebar")
    AppBreadcrumb
  div(class="layout-navbar__actions")
    LayoutToolbar
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores";
import AppHamburger from "@/components/base/AppHamburger/index.vue";
import AppBreadcrumb from "@/components/base/AppBreadcrumb/index.vue";

const appStore = useAppStore();
</script>

<style lang="scss" scoped>
.layout-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: $navbar-height;
  padding: 0 14px 0 6px;
  background-color: var(--content-bg);
  border-bottom: 1px solid var(--card-border);
  box-shadow: 0 1px 0 rgb(15 23 42 / 3%);

  &__actions {
    display: flex;
    align-items: center;
    height: 100%;
  }
}
</style>
