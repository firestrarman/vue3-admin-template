<template lang="pug">
el-dropdown(trigger="click" @command="handleLanguageChange")
  div(class="i-svg:language" :class="size")
  template(v-slot:dropdown)
    el-dropdown-menu
      el-dropdown-item(
        v-for="item in langOptions"
        :key="item.value"
        :disabled="appStore.language === item.value"
        :command="item.value"
      ) {{ item.label }}
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores/app";
import { LanguageEnum } from "@/enums/settings";

defineProps({
  size: {
    type: String,
    required: false,
  },
});

const langOptions = [
  { label: "繁體中文", value: LanguageEnum.ZH_TW },
  { label: "English", value: LanguageEnum.EN },
];

const appStore = useAppStore();
const { locale, t } = useI18n();

/**
 * 處理語言切換
 *
 * @param lang 語言（zh-tw、en）
 */
function handleLanguageChange(lang: string) {
  locale.value = lang;
  appStore.changeLanguage(lang);

  ElMessage.success(t("langSelect.message.success"));
}
</script>
