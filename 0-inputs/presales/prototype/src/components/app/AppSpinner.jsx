/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Vòng xoay đang tải — báo đang xử lý khi chưa biết bao lâu xong. Có chữ đi kèm thì đọc được bằng trình đọc màn hình.
 * size: md (18) · lg (32). Người dùng bật giảm chuyển động thì vòng đứng yên. */
import './AppExtraControls.css';

/**
 * Thuộc tính của AppSpinner (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {string} props.text - Chữ hiện cạnh vòng xoay, có giá trị thì không dùng `label`.
 * @param {'md' | 'lg'} props.size - Cỡ vòng xoay: `md` 18px hoặc `lg` 32px.
 * @param {string} props.label - Nhãn cho trình đọc màn hình, chỉ dùng khi không có `text`.
 */
export default function AppSpinner({ text, size = 'md', label = 'Đang tải' }) {
  return <span className={'app-spinner' + (size === 'lg' ? ' is-lg' : '')} role="status" aria-label={text ? undefined : label}>
    <span className="app-spinner-ring" aria-hidden="true" />
    {text ? <span>{text}</span> : null}
  </span>;
}
