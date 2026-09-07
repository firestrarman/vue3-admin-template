<template lang="pug">
el-select(
  v-if="type === 'select'"
  v-model="selectedValue"
  :placeholder="placeholder"
  :disabled="disabled"
  clearable
  :style="style"
  @change="handleChange"
)
  el-option(
    v-for="option in options"
    :key="option.value"
    :label="option.label"
    :value="option.value"
  )
el-radio-group(
  v-else-if="type === 'radio'"
  v-model="selectedValue"
  :disabled="disabled"
  :style="style"
  @change="handleChange"
)
  el-radio(v-for="option in options" :key="option.value" :value="option.value") {{ option.label }}
el-checkbox-group(
  v-else-if="type === 'checkbox'"
  v-model="selectedValue"
  :disabled="disabled"
  :style="style"
  @change="handleChange"
)
  el-checkbox(v-for="option in options" :key="option.value" :value="option.value") {{ option.label }}
</template>

<script setup lang="ts">
import { useDictStore } from "@/stores";

const dictStore = useDictStore();

const props = defineProps({
  code: {
    type: String,
    required: true,
  },
  modelValue: {
    type: [String, Number, Array],
    required: false,
  },
  type: {
    type: String,
    default: "select",
    validator: (value: string) => ["select", "radio", "checkbox"].includes(value),
  },
  placeholder: {
    type: String,
    default: "請選擇",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  style: {
    type: Object,
    default: () => {
      return {
        width: "300px",
      };
    },
  },
});

const emit = defineEmits(["update:modelValue"]);

const options = ref<Array<{ label: string; value: string | number }>>([]);

const selectedValue = ref<any>(
  typeof props.modelValue === "string" || typeof props.modelValue === "number"
    ? props.modelValue
    : Array.isArray(props.modelValue)
      ? props.modelValue
      : undefined
);

// 監聽 modelValue 和 options 的變化
watch(
  [() => props.modelValue, () => options.value],
  ([newValue, newOptions]) => {
    if (newOptions.length > 0 && newValue !== undefined) {
      if (props.type === "checkbox") {
        selectedValue.value = Array.isArray(newValue) ? newValue : [];
      } else {
        const matchedOption = newOptions.find(
          (option) => String(option.value) === String(newValue)
        );
        selectedValue.value = matchedOption?.value;
      }
    } else {
      selectedValue.value = undefined;
    }
  },
  { immediate: true }
);

// 監聽 selectedValue 的變化並觸發 update:modelValue
function handleChange(val: any) {
  emit("update:modelValue", val);
}

// 獲取字典資料
onMounted(async () => {
  await dictStore.loadDictItems(props.code);
  options.value = dictStore.getDictItems(props.code);
});
</script>
