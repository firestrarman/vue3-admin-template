<!-- 複製元件 -->
<template lang="pug">
el-button(link :style="style" @click="handleClipboard")
  slot
    el-icon
      DocumentCopy(color="var(--el-color-primary)")
</template>

<script setup lang="ts">
defineOptions({
  name: "AppCopyButton",
  inheritAttrs: false,
});

const props = defineProps({
  text: {
    type: String,
    default: "",
  },
  style: {
    type: Object,
    default: () => ({}),
  },
});

function handleClipboard() {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    // 使用 Clipboard API
    navigator.clipboard.writeText(props.text).then(
      () => {
        ElMessage.success("Copy successfully");
      },
      () => {
        ElMessage.warning("Copy failed");
      }
    );
  } else {
    // 相容性處理（useClipboard 有相容性問題）
    const input = document.createElement("input");
    input.style.position = "absolute";
    input.style.left = "-9999px";
    input.setAttribute("value", props.text);
    document.body.appendChild(input);
    input.select();
    try {
      const successful = document.execCommand("copy");

      if (successful) {
        ElMessage.success("Copy successfully!");
      } else {
        ElMessage.warning("Copy failed!");
      }
    } finally {
      document.body.removeChild(input);
    }
  }
}
</script>
