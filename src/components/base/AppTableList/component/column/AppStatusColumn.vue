<template lang="pug">
el-tag(:type="tagType" :size="size") {{ label }}
</template>

<script setup lang="ts">
import type { TagProps } from "element-plus";

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  value?: unknown;
  enabledValue?: unknown;
  enabledLabel?: string;
  disabledLabel?: string;
  enabledType?: TagProps["type"];
  disabledType?: TagProps["type"];
  size?: TagProps["size"];
}>();

const enabled = computed(() => props.value === (props.enabledValue ?? 1));
const label = computed(() =>
  enabled.value ? (props.enabledLabel ?? "啟用") : (props.disabledLabel ?? "停用")
);
const tagType = computed(() =>
  enabled.value ? (props.enabledType ?? "success") : (props.disabledType ?? "info")
);
const size = computed(() => props.size ?? "small");
</script>
