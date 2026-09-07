<template lang="pug">
el-table-column(v-if="field.children?.length" v-bind="columnProps")
  template(v-if="field.headerSlot" v-slot:header="scope")
    component(
      :is="tableSlots[field.headerSlot]"
      v-if="tableSlots[field.headerSlot]"
      :column="scope.column"
      :field="field"
      :$index="scope.$index"
    )
  template(v-slot:default)
    AppTableColumn(
      v-for="(child, index) in field.children"
      :key="getColumnKey(child, index)"
      :field="child"
      :table-slots="tableSlots"
    )
el-table-column(v-else-if="field.slot || field.component" v-bind="columnProps")
  template(v-if="field.headerSlot" v-slot:header="scope")
    component(
      :is="tableSlots[field.headerSlot]"
      v-if="tableSlots[field.headerSlot]"
      :column="scope.column"
      :field="field"
      :$index="scope.$index"
    )
  template(v-slot:default="scope")
    component(
      :is="tableSlots[field.slot]"
      v-if="field.slot && tableSlots[field.slot]"
      :row="scope.row"
      :value="getValue(scope.row, field.prop)"
      :column="scope.column"
      :field="field"
      :$index="scope.$index"
    )
    component(
      :is="field.component"
      v-else-if="field.component"
      v-bind="getComponentProps(scope.row, scope.column, scope.$index)"
      :row="scope.row"
      :value="getValue(scope.row, field.prop)"
      :column="scope.column"
      :field="field"
      :row-index="scope.$index"
    )
el-table-column(v-else v-bind="columnProps")
  template(v-if="field.headerSlot" v-slot:header="scope")
    component(
      :is="tableSlots[field.headerSlot]"
      v-if="tableSlots[field.headerSlot]"
      :column="scope.column"
      :field="field"
      :$index="scope.$index"
    )
</template>

<script setup lang="ts" generic="Row extends AppTableRow = AppTableRow">
import type { Slots } from "vue";
import type { TableColumnCtx } from "element-plus";
import type { AppTableCellContext, AppTableColumn, AppTableRow } from "../types";

const props = defineProps<{
  field: AppTableColumn<Row>;
  tableSlots: Slots;
}>();

const columnProps = computed(() => {
  const field = props.field;
  const nativeProps = {
    ...field.columnProps,
    label: field.label,
    prop: field.prop,
    type: field.type,
    width: field.width,
    minWidth: field.minWidth,
    fixed: field.fixed,
    align: field.align ?? "center",
    headerAlign: field.headerAlign ?? "center",
    className: field.className,
    labelClassName: field.labelClassName,
    sortable: field.sortable,
    resizable: field.resizable,
    showOverflowTooltip: field.showOverflowTooltip,
    selectable: field.selectable,
    index: field.index,
    formatter: field.formatter,
  };
  return Object.fromEntries(Object.entries(nativeProps).filter(([, value]) => value !== undefined));
});

function getValue(row: Row, path?: string): unknown {
  if (!path) return undefined;
  return path.split(".").reduce<unknown>((value, key) => {
    if (value === null || typeof value !== "object") return undefined;
    return (value as Record<string, unknown>)[key];
  }, row);
}

function getComponentProps(
  row: Row,
  column: TableColumnCtx<Row>,
  rowIndex: number
): Record<string, unknown> {
  const context: AppTableCellContext<Row> = {
    row,
    column,
    field: props.field,
    value: getValue(row, props.field.prop),
    $index: rowIndex,
  };
  return typeof props.field.componentProps === "function"
    ? props.field.componentProps(context)
    : (props.field.componentProps ?? {});
}

function getColumnKey(field: AppTableColumn<Row>, index: number): string | number {
  return field.key ?? field.prop ?? field.slot ?? index;
}
</script>
