import type { Component, VNode } from "vue";
import type { TableColumnCtx } from "element-plus";

export type AppTableRow = object;
export type AppTableAlign = "left" | "center" | "right";
export type AppTableFixed = boolean | "left" | "right";
export type AppTableColumnType = "default" | "selection" | "index" | "expand";

export interface AppTableColumn<Row extends AppTableRow = AppTableRow> {
  /** 渲染迴圈使用的唯一識別。 */
  key?: string | number;

  /** 以下欄位直接對應 ElTableColumn props。 */
  label?: string;
  prop?: string;
  type?: AppTableColumnType;
  width?: string | number;
  minWidth?: string | number;
  fixed?: AppTableFixed;
  align?: AppTableAlign;
  headerAlign?: AppTableAlign;
  className?: string;
  labelClassName?: string;
  sortable?: boolean | "custom";
  resizable?: boolean;
  showOverflowTooltip?: boolean | Record<string, unknown>;
  selectable?: (row: Row, index: number) => boolean;
  index?: number | ((index: number) => number);
  formatter?: (
    row: Row,
    column: TableColumnCtx<Row>,
    cellValue: unknown,
    index: number
  ) => string | VNode;

  /** 儲存格 slot 名稱。slot 會收到 row、value、column、field、$index。 */
  slot?: string;
  /** 表頭 slot 名稱。slot 會收到 column、field、$index。 */
  headerSlot?: string;
  /** 僅供跨頁重複使用的欄位元件；單頁欄位請使用 slot。 */
  component?: Component;
  /** 傳給自訂儲存格元件的額外 props。 */
  componentProps?:
    Record<string, unknown> | ((context: AppTableCellContext<Row>) => Record<string, unknown>);

  /** 群組表頭的子欄位。 */
  children?: AppTableColumn<Row>[];

  /**
   * 其餘 ElTableColumn 原生 props，例如 filters、filterMethod、sortMethod。
   * 明確欄位會覆蓋同名設定。
   */
  columnProps?: Record<string, unknown>;
}

export interface AppTableCellContext<Row extends AppTableRow = AppTableRow> {
  row: Row;
  column: TableColumnCtx<Row>;
  field: AppTableColumn<Row>;
  value: unknown;
  $index: number;
}
