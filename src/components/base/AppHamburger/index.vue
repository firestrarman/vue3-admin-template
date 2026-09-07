<template lang="pug">
div(class="hamburger-wrapper" @click="toggleClick")
  div(:class="['i-svg:collapse', { hamburger: true, 'is-active': isActive }]")
</template>

<script setup lang="ts">
defineProps({
  isActive: { type: Boolean, required: true },
});

const emit = defineEmits(["toggleClick"]);

function toggleClick() {
  emit("toggleClick");
}
</script>

<style scoped lang="scss">
.hamburger-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 100%;
  padding: 0;
  color: var(--el-text-color-regular);
  cursor: pointer;

  .hamburger {
    width: 16px;
    height: 16px;
    font-size: 16px;
    vertical-align: middle;
    color: currentcolor;
    background-color: currentcolor;
    transform: scaleX(-1);
    transition:
      color 0.16s,
      transform 0.3s ease;

    &.is-active {
      transform: scaleX(1);
    }
  }

  &:hover {
    color: var(--el-color-primary);
  }
}
</style>
