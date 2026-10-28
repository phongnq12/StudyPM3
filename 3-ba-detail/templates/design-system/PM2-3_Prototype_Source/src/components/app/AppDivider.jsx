/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Đường phân cách — tách 2 nhóm nội dung trong cùng 1 khối, có thể kèm nhãn ở giữa.
 * Tách khối lớn thì dùng khối riêng (card), không kẻ đường. */
import './AppExtraControls.css';

/**
 * Thuộc tính của AppDivider (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {string} props.label - Nhãn ở giữa đường phân cách, bỏ trống thì chỉ kẻ đường ngang.
 */
export default function AppDivider({ label }) {
  return label ? <div className="app-divider has-label" role="separator" aria-label={label}>{label}</div> : <hr className="app-divider" />;
}
