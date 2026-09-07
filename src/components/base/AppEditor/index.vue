<template lang="pug">
div(style="z-index: 999; border: 1px solid var(--el-border-color)")
  //- 工具欄
  Toolbar(
    v-if="editorRef"
    :key="editorKey"
    :editor="editorRef"
    mode="simple"
    :default-config="toolbarConfig"
    style="border-bottom: 1px solid var(--el-border-color)"
  )
  //- 編輯器
  Editor(
    :key="editorKey"
    v-model="modelValue"
    :style="{ height: height, overflowY: 'hidden' }"
    :default-config="editorConfig"
    mode="simple"
    @on-created="handleCreated"
    @on-change="handleChange"
  )
</template>

<script setup lang="ts">
import "@wangeditor-next/editor/dist/css/style.css";
import { Toolbar, Editor } from "@wangeditor-next/editor-for-vue";
import { IToolbarConfig, IEditorConfig } from "@wangeditor-next/editor";

// 檔案上傳 API
import FileAPI from "@/api/file";
// 上傳圖片回撥函式型別
type InsertFnType = (_url: string, _alt: string, _href: string) => void;

defineProps({
  height: {
    type: String,
    default: "500px",
  },
});
const modelValue = defineModel<string>({
  type: String,
  required: false,
  default: "",
});

const editorRef = shallowRef();
const editorKey = ref(0);
const innerUpdating = ref(false);

// 工具欄配置
const toolbarConfig: Partial<IToolbarConfig> = {};

// 編輯器配置
const editorConfig: Partial<IEditorConfig> = {
  placeholder: "請輸入內容..",
  MENU_CONF: {
    uploadImage: {
      async customUpload(file: File, insertFn: InsertFnType) {
        const data = await FileAPI.uploadFile(file);
        insertFn(data.url, data.name, data.url);
      },
    } as any,
  },
};

// 記錄 editor 例項
const handleCreated = (editor: any) => {
  editorRef.value = editor;
};

const handleChange = () => {
  innerUpdating.value = true;
  Promise.resolve().then(() => {
    innerUpdating.value = false;
  });
};

watch(
  () => modelValue.value,
  () => {
    if (innerUpdating.value) return;
    editorRef.value = null;
    editorKey.value += 1;
  }
);

onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});
</script>
