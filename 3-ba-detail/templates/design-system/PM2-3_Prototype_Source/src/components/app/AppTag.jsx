/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Tag — antd Tag (PM1 dùng thẳng Tag của antd). className = lớp màu thiết kế đã duyệt (.tt-lon .tt-ckin · .dc-tag .t-dm · .tag-ad…) */
import { Tag } from 'antd';

/**
 * Thuộc tính của AppTag (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {string} props.className - Lớp màu của tag, ghép sau lớp `app-reset` trên Tag của antd.
 * @param {ReactNode} props.children - Nội dung hiển thị bên trong tag.
 */
export default function AppTag({ className = '', children, ...rest }) {
  return <Tag className={'app-reset ' + className} bordered={false} data-fe="Tag" {...rest}>{children}</Tag>;
}
