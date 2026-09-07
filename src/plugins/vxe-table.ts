/**
 * VxeTable 全域性配置與註冊
 * @see https://vxetable.cn/#/start/install
 */
import type { App } from "vue";
import VxeUITable from "vxe-table";
import VxeUIBase, { VxeUI } from "vxe-pc-ui";
import "vxe-table/es/style.css";
import "vxe-pc-ui/es/style.css";

export function setupVxeTable(app: App) {
  VxeUI.setConfig({
    size: "medium",
    zIndex: 9999,
    version: 0,
    table: {
      showHeader: true,
      showOverflow: "tooltip",
      showHeaderOverflow: "tooltip",
      autoResize: true,
      border: "inner",
      emptyText: "暫無資料",
      rowConfig: {
        isHover: true,
        isCurrent: true,
        keyField: "_VXE_ID",
      },
      columnConfig: {
        resizable: false,
      },
      align: "center",
      headerAlign: "center",
    },
    pager: {
      perfect: false,
      pageSize: 10,
      pagerCount: 7,
      pageSizes: [10, 20, 50],
      layouts: [
        "Total",
        "PrevJump",
        "PrevPage",
        "Number",
        "NextPage",
        "NextJump",
        "Sizes",
        "FullJump",
      ],
    },
    modal: {
      minWidth: 500,
      minHeight: 400,
      lockView: true,
      mask: true,
      dblclickZoom: false,
      showTitleOverflow: true,
      transfer: true,
      draggable: false,
    },
  });

  app.use(VxeUIBase).use(VxeUITable);
}

export { VxeUI };
