/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* AppTable — bọc antd Table. Thẻ <table> thật mang lớp + id thiết kế đã duyệt (tableClassName · tableId) qua components.table,
 * các lớp div bọc của antd trả về khối thường (styles/antd-reset.css). Không phân trang của antd: màn tự vẽ .pager như bản HTML.
 * columns: [{ key, title, className (td), thClassName (th, mặc định = className), thStyle, render(row, index) }]
 * tbodyId: id cho <tbody> · emptyRow: dòng tự vẽ khi rỗng (<tr>…</tr>); không có thì bảng rỗng để trống như bản HTML
 * rowClassName(row): lớp riêng cho <tr>
 * rowSelection: ô tích chọn dòng của antd như PM1 (chốt) — cột chọn mang thêm lớp selectionClassName (vd c-chon) */
import { useMemo, useRef } from 'react';
import { Table } from 'antd';

/**
 * Thuộc tính của AppTable (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {array} props.columns - Danh sách cột dạng `{ key, title, className, thClassName, thStyle, render }`, `render` nhận dòng và số thứ tự đã cộng `indexOffset`.
 * @param {array} props.dataSource - Mảng dòng dữ liệu, mảng rỗng thì thân bảng hiện `emptyRow` thay cho các dòng.
 * @param {string | function} props.rowKey - Tên trường hoặc hàm lấy khoá dòng, cũng dùng ghép tên đọc «Chọn dòng» cho ô tích chọn.
 * @param {string} props.tableClassName - Lớp CSS gắn lên thẻ `table` thật bên trong antd Table.
 * @param {string} props.tableId - Mã định danh gắn lên thẻ `table` thật.
 * @param {string} props.tbodyId - Mã định danh gắn lên thẻ `tbody` của bảng.
 * @param {ReactNode} props.emptyRow - Dòng `tr` tự vẽ hiện khi `dataSource` rỗng, không truyền thì thân bảng để trống.
 * @param {string | function} props.rowClassName - Lớp CSS riêng cho từng thẻ `tr`, dạng hàm thì nhận dòng dữ liệu, chuyển thẳng tới antd Table.
 * @param {number} props.indexOffset - Số cộng thêm vào chỉ số dòng trước khi truyền cho `render` của cột, dùng khi bảng đang ở trang sau.
 * @param {object} props.rowSelection - Cấu hình ô tích chọn dòng của antd, mỗi ô tích được gắn sẵn tên đọc «Chọn dòng» kèm khoá dòng.
 * @param {string} props.selectionClassName - Lớp CSS thêm vào ô tiêu đề và ô dữ liệu của cột chọn dòng.
 */
export default function AppTable({ columns, dataSource, rowKey, tableClassName = '', tableId, tbodyId, emptyRow, rowClassName, indexOffset = 0, rowSelection, selectionClassName = 'col-select' }) {
  const cols = columns.map((c) => ({
    key: c.key, dataIndex: c.key, title: c.title,
    /* lớp của ô dữ liệu gắn qua onCell, lớp ô tiêu đề qua onHeaderCell — antd gắn column.className lên CẢ 2 loại ô */
    onCell: c.className ? () => ({ className: c.className }) : undefined,
    onHeaderCell: () => ({ className: c.thClassName !== undefined ? c.thClassName : c.className, style: c.thStyle }),
    render: c.render ? (_, row, i) => c.render(row, i + indexOffset) : undefined,
  }));
  /* giá trị thay đổi đọc qua ref ⇒ components giữ nguyên tham chiếu, antd ⛔ dựng lại cả bảng mỗi lần màn vẽ lại */
  const latest = useRef({}); latest.current = { isEmpty: !dataSource.length, emptyRow, tableClassName, tableId, tbodyId, selectionClassName };
  const components = useMemo(() => {
    const withSelectionClass = (classNames) => ((classNames || '').includes('ant-table-selection-column') ? classNames + ' ' + latest.current.selectionClassName : classNames);
    return {
      /* antd ghi style nội tuyến table-layout:auto ⇒ bỏ đi để CSS thiết kế đã duyệt quyết (vd .bls dùng fixed) */
      table: ({ style, ...props }) => <table {...props} style={{ ...style, tableLayout: undefined }} className={latest.current.tableClassName} id={latest.current.tableId} data-fe="Table" />,
      header: { cell: ({ className, ...props }) => <th {...props} className={withSelectionClass(className)} /> },
      body: {
        wrapper: ({ children, ...props }) => <tbody {...props} id={latest.current.tbodyId}>{latest.current.isEmpty ? latest.current.emptyRow : children}</tbody>,
        cell: ({ className, ...props }) => <td {...props} className={withSelectionClass(className)} />,
      },
    };
  }, []);
  return (
    <Table
      className="app-reset-table"
      columns={cols}
      dataSource={dataSource}
      rowKey={rowKey}
      rowClassName={rowClassName}
      rowSelection={rowSelection && { getCheckboxProps: (r) => ({ 'aria-label': 'Chọn dòng ' + (typeof rowKey === 'function' ? rowKey(r) : r[rowKey]) }), ...rowSelection }}   /* ô tích có tên đọc (WCAG 4.1.2) */
      pagination={false}
      components={components}
    />
  );
}
