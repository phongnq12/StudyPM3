/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Số đếm gắn vào phần tử khác (icon, nút) —. Nhãn chữ đứng riêng thì dùng tag, không dùng control này.
 * count 0 thì ẩn · quá max hiện «max+» · dot: chỉ chấm, không số. */
import './AppExtraControls.css';

/**
 * Thuộc tính của AppBadge (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {number} props.count - Số đếm hiển thị, bằng 0 thì ẩn huy hiệu.
 * @param {number} props.max - Ngưỡng số lớn nhất, `count` vượt ngưỡng thì hiện dạng `max+`.
 * @param {boolean} props.dot - Chỉ hiện chấm tròn, không hiện số, kể cả khi `count` bằng 0.
 * @param {string} props.label - Nhãn cho trình đọc màn hình, bỏ trống thì dùng số đếm hoặc câu `Có mục mới` khi bật `dot`.
 * @param {ReactNode} props.children - Phần tử được gắn huy hiệu, như icon hoặc nút.
 */
export default function AppBadge({ count = 0, max = 99, dot = false, label, children }) {
  const show = dot || count > 0;
  const text = count > max ? max + '+' : String(count);
  return <span className="app-badge-anchor">
    {children}
    {show ? <span className={'app-badge' + (dot ? ' is-dot' : '')} role="status" aria-label={label || (dot ? 'Có mục mới' : text)}>{dot ? null : text}</span> : null}
  </span>;
}
