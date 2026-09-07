<template lang="pug">
el-breadcrumb(class="flex-y-center")
  el-breadcrumb-item(v-for="(item, index) in breadcrumbs" :key="item.path")
    //- 末級或不可跳轉的節點顯示為純文字，其餘可點選
    span(v-if="item.redirect === 'noredirect' || index === breadcrumbs.length - 1" class="color-gray-400") {{ translateRouteTitle(item.meta.title ?? "") }}
    a(v-else @click.prevent="handleLink(item)") {{ translateRouteTitle(item.meta.title ?? "") }}
</template>

<script setup lang="ts">
import type { RouteLocationMatched } from "vue-router";
import { compile } from "path-to-regexp";
import router from "@/router";
import { translateRouteTitle } from "@/lang/utils";

type BreadcrumbRoute = {
  path: string;
  name?: RouteLocationMatched["name"];
  redirect?: string;
  meta: RouteLocationMatched["meta"];
};

const currentRoute = useRoute();

// 麵包屑取 matched 鏈，不拼首頁（首頁與一級選單平級，非父級）
const pathCompile = (path: string) => {
  // 補全動態路由引數，如 /user/:id
  const { params } = currentRoute;
  const toPath = compile(path);
  return toPath(params);
};

const breadcrumbs = ref<BreadcrumbRoute[]>([]);

// 生成麵包屑：取路由 matched 中有標題的層級，
// 用 meta.breadcrumb = false 可以隱藏某一級
function getBreadcrumb() {
  const matched: BreadcrumbRoute[] = currentRoute.matched
    .filter((item) => item.meta && item.meta.title)
    .map(({ path, name, redirect, meta }) => ({
      path,
      name,
      redirect: typeof redirect === "string" ? redirect : undefined,
      meta,
    }));

  breadcrumbs.value = matched.filter((item) => {
    return item.meta && item.meta.title && item.meta.breadcrumb !== false;
  });
}

// 跳轉：有 redirect 走 redirect，否則按路徑（含動態引數先 compile）
function handleLink(item: BreadcrumbRoute) {
  const { redirect, path } = item;
  if (redirect) {
    router.push(redirect).catch((err) => {
      console.warn(err);
    });
    return;
  }
  router.push(pathCompile(path)).catch((err) => {
    console.warn(err);
  });
}

// 路由變化就重算麵包屑，但 /redirect/ 這類中轉路由跳過
watch(
  () => currentRoute.path,
  (path) => {
    if (path.startsWith("/redirect/")) {
      return;
    }
    getBreadcrumb();
  }
);

onBeforeMount(() => {
  getBreadcrumb();
});
</script>

<style lang="scss" scoped>
// 覆蓋 element-plus 的樣式
.el-breadcrumb__inner,
.el-breadcrumb__inner a {
  font-weight: 400 !important;
}
</style>
