<template lang="pug">
el-table(ref="tableRef" v-bind="$attrs" :data="data")
  template(v-if="$slots.empty" v-slot:empty)
    slot(name="empty" :row="getSlotFallbackRow()")
  slot(name="prepend" :row="getSlotFallbackRow()")
  TableColumnRenderer(
    v-for="(field, index) in columns"
    :key="getColumnKey(field, index)"
    :field="field"
    :table-slots="$slots"
  )
  slot(:row="getSlotFallbackRow()")
  slot(name="append" :row="getSlotFallbackRow()")
</template>

<script setup lang="ts" generic="Row extends AppTableRow = AppTableRow">
import type { TableColumnCtx, TableInstance } from "element-plus";
import TableColumnRenderer from "./component/AppTableColumn.vue";
import type { AppTableColumn, AppTableRow } from "./types";

defineOptions({
  name: "AppTableList",
  inheritAttrs: false,
});

withDefaults(
  defineProps<{
    data: Row[];
    columns?: AppTableColumn<Row>[];
  }>(),
  {
    columns: () => [],
  }
);

defineSlots<{
  [name: string]: (props: {
    row: Row;
    value?: unknown;
    column?: TableColumnCtx<Row>;
    field?: AppTableColumn<Row>;
    $index?: number;
  }) => unknown;
}>();

const tableRef = ref<TableInstance>();

function getColumnKey(field: AppTableColumn<Row>, index: number): string | number {
  return field.key ?? field.prop ?? field.slot ?? index;
}

function getSlotFallbackRow(): Row {
  return undefined as unknown as Row;
}

defineExpose({
  tableRef,
});
</script>
