<template lang="pug">
el-config-provider(:locale="locale" size="default")
  router-view
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores";

const appStore = useAppStore();
const locale = computed(() => appStore.locale);
</script>
