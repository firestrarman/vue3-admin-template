<template lang="pug">
div(class="page-container")
  el-card(class="page-search" shadow="never")
    el-form(ref="queryFormRef" :model="params" :inline="true")
      el-form-item(label="通知標題" prop="title")
        el-input(v-model="params.title" placeholder="關鍵字" clearable @keyup.enter="handleQuery")
      el-form-item
        el-button(type="primary" @click="handleQuery")
          template(v-slot:icon)
            Search
          | 搜尋
        el-button(@click="handleResetQuery")
          template(v-slot:icon)
            Refresh
          | 重置

  el-card(class="page-content" shadow="never")
    div(class="page-table-wrapper")
      AppTableList(
        v-loading="loading"
        class="page-table"
        height="100%"
        highlight-current-row
        :data="list"
        :columns="columns"
      )
        template(v-slot:actions="{ row }")
          el-button(type="primary" size="small" link @click="handleReadNotice(row.id)") 檢視

    app-pagination(
      v-if="total > 0"
      v-model:total="total"
      v-model:page="params.pageNum"
      v-model:limit="params.pageSize"
      @pagination="fetchData"
    )

  el-dialog(
    v-model="noticeDialogVisible"
    :title="noticeDetail?.title ?? '通知詳情'"
    width="800px"
    custom-class="notice-detail"
  )
    div(v-if="noticeDetail" class="notice-detail__wrapper")
      div(class="notice-detail__meta")
        span
          el-icon
            User
          | {{ noticeDetail.publisherName }}
        span(class="ml-2")
          el-icon
            Timer
          | {{ noticeDetail.publishTime }}
      div(class="notice-detail__content")
        div(v-html="noticeDetail.content")
</template>

<script setup lang="ts">
import { Refresh, Search, Timer, User } from "@element-plus/icons-vue";
import NoticeAPI from "@/api/system/notice";
import type { NoticeDetail, NoticeItem, NoticeQueryParams } from "@/api/system/notice";
import { usePageTable } from "@/composables";
import { NOTICE_READ_STATUS } from "@/constants";
import {
  AppDictColumn,
  AppStatusColumn,
  type AppTableColumn,
} from "@/components/base/AppTableList";

defineOptions({
  name: "MyNotice",
  inheritAttrs: false,
});

const queryFormRef = ref();

// 分頁表格資料管理
const { loading, list, total, params, fetchData, handleQuery, handleResetQuery } = usePageTable<
  NoticeItem,
  NoticeQueryParams
>({
  initialParams: {
    pageNum: 1,
    pageSize: 10,
  },
  request: NoticeAPI.getMyNoticePage,
  onBeforeReset: () => queryFormRef.value?.resetFields(),
});

const columns: AppTableColumn<NoticeItem>[] = [
  { type: "index", label: "序號", width: 60 },
  { label: "通知標題", prop: "title", minWidth: 200, align: "left" },
  {
    label: "通知型別",
    prop: "type",
    width: 150,
    component: AppDictColumn,
    componentProps: { code: "notice_type" },
  },
  {
    label: "通知等級",
    prop: "level",
    width: 100,
    component: AppDictColumn,
    componentProps: { code: "notice_level" },
  },
  { key: "releaseTime", label: "釋出時間", prop: "publishTime", width: 150 },
  { label: "釋出人", prop: "publisherName", width: 150 },
  {
    label: "狀態",
    prop: "isRead",
    width: 100,
    component: AppStatusColumn,
    componentProps: {
      enabledValue: NOTICE_READ_STATUS.READ,
      enabledLabel: "已讀",
      disabledLabel: "未讀",
    },
  },
  { label: "操作", slot: "actions", fixed: "right", width: 80 },
];

const noticeDialogVisible = ref(false);
const noticeDetail = ref<NoticeDetail | null>(null);

/**
 * 檢視通知詳情。
 * @param id 通知 ID
 */
async function handleReadNotice(id: string): Promise<void> {
  const data = await NoticeAPI.getDetail(id);
  noticeDetail.value = data;
  noticeDialogVisible.value = true;
}

onMounted(() => {
  handleQuery();
});
</script>

<style lang="scss" scoped>
:deep(.el-dialog__header) {
  text-align: center;
}

.notice-detail {
  &__wrapper {
    padding: 0 20px;
  }

  &__meta {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }

  &__publisher {
    margin-right: 24px;

    i {
      margin-right: 4px;
    }
  }

  &__content {
    max-height: 60vh;
    padding-top: 16px;
    margin-bottom: 24px;
    overflow-y: auto;
    border-top: 1px solid var(--el-border-color);

    &::-webkit-scrollbar {
      width: 6px;
    }
  }
}
</style>
