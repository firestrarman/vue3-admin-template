<template lang="pug">
div(class="layout-root" :class="layoutClass")
  div(v-if="isMobile && isSidebarOpen" class="layout-root__overlay" @click="closeSidebar")
  div(class="layout-sidebar" :class="{ 'is-collapsed': !isSidebarOpen }")
    div(:class="{ 'has-logo': showLogo }" class="layout-sidebar__inner")
      LayoutLogo(v-if="showLogo" :collapse="!isSidebarOpen")
      el-scrollbar
        LayoutSidebar(:data="routes" base-path="")
  div(class="layout-main" :class="{ 'is-collapsed': !isSidebarOpen }")
    LayoutNavbar
    LayoutTagsView(v-if="showTagsView")
    LayoutMain
</template>

<script setup lang="ts">
import { useLayout } from "./composables/useLayout";
import { useLayoutDevice } from "./composables/useLayoutDevice";
import LayoutLogo from "./components/LayoutLogo.vue";
import LayoutNavbar from "./components/LayoutNavbar.vue";
import LayoutTagsView from "./components/LayoutTagsView.vue";
import LayoutMain from "./components/LayoutMain.vue";
import LayoutSidebar from "./components/LayoutSidebar.vue";

useLayoutDevice();

const { layoutClass, isMobile, showTagsView, showLogo, isSidebarOpen, routes, closeSidebar } =
  useLayout();
</script>

<style lang="scss" scoped>
@use "@/styles/mixins" as *;

.layout-root {
  width: 100%;
  height: 100%;

  &__overlay {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
  }
}

.layout-sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  width: $sidebar-width;
  background-color: $menu-background;
  transition: width 0.28s;

  &.is-collapsed {
    width: $sidebar-width-collapsed;
  }

  &__inner {
    position: relative;
    height: 100%;
    background-color: var(--menu-background);
    border-right: 1px solid var(--card-border);
    transition: width 0.28s;

    &.has-logo {
      .el-scrollbar {
        @include sidebar-scroll-height-with-logo;
      }
    }

    :deep(.el-menu) {
      border: none;
    }
  }
}

.layout-main {
  position: relative;
  height: 100%;
  margin-left: $sidebar-width;
  overflow-y: auto;
  transition: margin-left 0.28s;

  &.is-collapsed {
    margin-left: $sidebar-width-collapsed;
  }
}

.is-mobile {
  .layout-sidebar {
    width: $sidebar-width !important;
    transition:
      transform 0.28s,
      width 0s;
  }

  &.is-sidebar-collapsed {
    .layout-sidebar {
      transform: translateX(-$sidebar-width);
    }
  }

  &.is-sidebar-open {
    .layout-sidebar {
      transform: translateX(0);
    }
  }

  .layout-main {
    margin-left: 0 !important;
  }
}
</style>
