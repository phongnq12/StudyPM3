/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Khối thu gọn — nhiều mục nội dung phụ, mở từng mục khi cần (câu hỏi thường gặp, chi tiết phụ).
 * Dựng bằng details/summary nên bàn phím và trình đọc màn hình dùng được sẵn. items: [{ key, title, children, open }] */
import { Svg, IC } from '@/lib/icons';
import './AppExtraControls.css';

/**
 * Thuộc tính của AppAccordion (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {array} props.items - Danh sách mục `{ key, title, children, open }`, mỗi mục là 1 khối thu gọn, `open` cho mục mở sẵn.
 */
export default function AppAccordion({ items = [] }) {
  return <div className="app-accordion">
    {items.map((it) => <details key={it.key} className="app-accordion-item" open={it.open}>
      <summary className="app-accordion-head"><span>{it.title}</span><Svg raw={IC.caret} /></summary>
      <div className="app-accordion-body">{it.children}</div>
    </details>)}
  </div>;
}
