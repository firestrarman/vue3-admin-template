<template lang="pug">
AppDictTag(:model-value="dictValue" :code="code" :size="size")
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    value?: unknown;
    code: string;
    size?: string;
  }>(),
  {
    size: "small",
  }
);

const dictValue = computed(() =>
  typeof props.value === "string" || typeof props.value === "number" ? props.value : undefined
);
</script>
