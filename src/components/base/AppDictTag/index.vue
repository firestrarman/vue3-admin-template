<template lang="pug">
template(v-if="tagType")
  el-tag(:type="tagType" :size="tagSize") {{ label }}
template(v-else)
  span {{ label }}
</template>

<script setup lang="ts">
import { useDictStore } from "@/stores";

const props = defineProps({
  // 字典編碼
  code: String,
  // 字典項的值
  modelValue: [String, Number],
  size: {
    type: String,
    default: "default",
  },
});

const label = ref("");
const tagType = ref<"success" | "warning" | "info" | "primary" | "danger" | undefined>();
const tagSize = ref<"default" | "large" | "small">(props.size as "default" | "large" | "small");

const dictStore = useDictStore();

/**
 * 根據字典項的值獲取對應的 label 和 tagType
 * @param dictCode 字典編碼
 * @param value 字典項的值
 * @returns 包含 label 和 tagType 的物件
 */
const getLabelAndTagByValue = async (dictCode: string, value: string | number) => {
  // 按需載入字典資料
  await dictStore.loadDictItems(dictCode);
  // 從快取中獲取字典資料
  const dictItems = dictStore.getDictItems(dictCode);
  // 查詢對應的字典項
  const dictItem = dictItems.find((item) => String(item.value) === String(value));
  return {
    label: dictItem?.label || "",
    tagType: dictItem?.tagType,
  };
};

/**
 * 更新 label 和 tagType
 */
const updateLabelAndTag = async () => {
  if (!props.code || props.modelValue === undefined) return;
  const { label: newLabel, tagType: newTagType } = await getLabelAndTagByValue(
    props.code,
    props.modelValue
  );
  label.value = newLabel;
  tagType.value = newTagType as typeof tagType.value;
};

// 初始化或code變化時更新標籤和標籤樣式
watch(
  [() => props.code, () => props.modelValue],
  async () => {
    if (props.code) {
      await updateLabelAndTag();
    }
  },
  { immediate: true }
);
</script>
