<template lang="pug">
ErrorPage(
  status-code="401"
  label="訪問受限"
  title="當前帳號暫無訪問權限"
  description="如果你確認需要訪問該頁面，請聯絡管理員調整權限後再試"
  variant="locked"
)
  template(v-slot:actions)
    el-button(type="primary" :icon="House" @click="goHome") 返回首頁
    el-button(:icon="Back" @click="router.back()") 返回上一頁
</template>

<script setup lang="ts">
import { Back, House } from "@element-plus/icons-vue";
import ErrorPage from "./components/ErrorPage.vue";

defineOptions({ name: "Page401" });

const router = useRouter();

/**
 * 回到首頁，避免繼續停留在無權限路由
 */
function goHome() {
  router.push("/");
}
</script>
