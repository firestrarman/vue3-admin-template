<template lang="pug">
el-scrollbar
  div(:class="{ 'is-hidden': hidden }" class="pagination-container")
    el-pagination(
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :background="background"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    )
</template>

<script setup lang="ts">
interface Props {
  // 資料總條數
  total?: number;
  // 每頁條數選項，預設 [10, 20, 50, 100]
  pageSizes?: number[];
  // 分頁佈局，控制顯示哪些子元件及其順序
  layout?: string;
  // 是否為分頁按鈕新增背景色
  background?: boolean;
  // 是否隱藏整個分頁條
  hidden?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  total: 0,
  pageSizes: () => [10, 20, 50, 100],
  layout: "total, sizes, prev, pager, next, jumper",
  background: true,
  hidden: false,
});

const emit = defineEmits<{
  // 頁碼或每頁條數變化時觸發，回撥當前頁碼與每頁條數
  pagination: [query: { page: number; limit: number }];
}>();

// 當前頁碼，雙向繫結到父元件的 page
const currentPage = defineModel<number>("page", { default: 1 });
// 每頁條數，雙向繫結到父元件的 limit
const pageSize = defineModel<number>("limit", { default: 10 });

// 資料總量變化後，若當前頁超出最後一頁，則回退到最後一頁
watch(
  () => props.total,
  (newVal: number) => {
    const lastPage = Math.ceil(newVal / pageSize.value);
    if (newVal > 0 && currentPage.value > lastPage) {
      currentPage.value = lastPage;
      emit("pagination", { page: currentPage.value, limit: pageSize.value });
    }
  }
);

// 切換每頁條數時回到第一頁，並觸發分頁請求
function handleSizeChange(val: number) {
  currentPage.value = 1;
  emit("pagination", { page: currentPage.value, limit: val });
}

// 切換頁碼時觸發分頁請求
function handleCurrentChange(val: number) {
  emit("pagination", { page: val, limit: pageSize.value });
}
</script>

<style lang="scss" scoped>
.pagination-container {
  display: flex;
  justify-content: flex-end;
  padding-top: 14px;
  overflow: visible;
}

.pagination-container.is-hidden {
  display: none;
}
</style>
