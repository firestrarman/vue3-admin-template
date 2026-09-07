<template lang="pug">
div
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const routePath = route.params.path;
const targetPath = Array.isArray(routePath) ? routePath.join("/") : routePath;

router.replace({
  path: `/${targetPath || ""}`,
  query: route.query,
});
</script>
