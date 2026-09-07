<template lang="pug">
ErrorPage(
  status-code="404"
  label="頁面未找到"
  title="抱歉，訪問的頁面不存在"
  description="頁面地址可能已變更、被移除，或者當前帳號尚未載入對應路由"
  variant="missing"
)
  template(v-slot:actions)
    el-button(type="primary" :icon="House" @click="goHome") 返回首頁
    el-button(:icon="Refresh" @click="reload") 重新載入
</template>

<script setup lang="ts">
import { House, Refresh } from "@element-plus/icons-vue";
import ErrorPage from "./components/ErrorPage.vue";

defineOptions({ name: "Page404" });

const router = useRouter();

/**
 * 回到首頁，重新進入權限路由匹配
 */
function goHome() {
  router.push("/");
}

/**
 * 重新載入頁面，處理動態路由未及時註冊的場景
 */
function reload() {
  window.location.reload();
}
</script>
