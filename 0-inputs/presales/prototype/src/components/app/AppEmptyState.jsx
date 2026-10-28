/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Trạng thái rỗng và lỗi của vùng dữ liệu, đối chiếu Design System PM1.
 * 4 loại: empty (chưa có dữ liệu, kèm nút tạo) · forbidden (không có quyền) · error (tải lỗi, kèm Thử lại) · deleted (bản ghi không còn).
 * Câu hiển thị truyền vào qua text (gọi msg theo mã). Lọc không ra trong bảng vẫn dùng EmptyRow I001-28. */
import { Svg } from '@/lib/icons';
import './AppPm1Controls.css';

const ICON = {
  empty: '<path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7"/>',
  forbidden: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  error: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
  deleted: '<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>',
};

/**
 * Thuộc tính của AppEmptyState (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {'empty' | 'forbidden' | 'error' | 'deleted'} props.kind - Loại trạng thái, quyết định icon, `error` thì khối mang vai trò cảnh báo.
 * @param {string} props.text - Câu hiển thị dưới icon.
 * @param {ReactNode} props.action - Nút hành động hiện dưới câu, như nút tạo mới hoặc Thử lại.
 */
export default function AppEmptyState({ kind = 'empty', text, action }) {
  return <div className={'app-empty is-' + kind} data-fe="AppEmptyState" role={kind === 'error' ? 'alert' : undefined}>
    <span className="app-empty-icon" aria-hidden="true"><Svg raw={ICON[kind] || ICON.empty} /></span>
    <p className="app-empty-text">{text}</p>
    {action ? <div className="app-empty-action">{action}</div> : null}
  </div>;
}
