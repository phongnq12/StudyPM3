/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Nút chuyển dạng phân đoạn — đổi chế độ xem của cùng 1 dữ liệu (Danh sách · Lịch).
 * Dùng lại đúng khuôn thanh chế độ .mode/.mode-b của màn Danh sách lịch hẹn (base.css), không tự viết CSS riêng.
 * items: [{ key, label, icon, iconRaw, title }] */
import { AppButtonWithIcon } from '@/components/app/AppButton';

/**
 * Thuộc tính của AppSegmented (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {array} props.items - Danh sách đoạn dạng `{ key, label, icon, iconRaw, title }`, mỗi đoạn vẽ thành 1 nút có icon.
 * @param {string} props.value - Khoá của đoạn đang chọn, đoạn trùng khoá được gắn lớp `on` và `aria-selected` bằng true.
 * @param {function} props.onChange - Gọi khi người dùng bấm 1 đoạn, nhận `key` của đoạn đó.
 * @param {string} props.label - Tên đọc màn hình của thanh, gắn vào `aria-label` của khối `role=tablist`.
 */
export default function AppSegmented({ items = [], value, onChange, label = 'Chế độ xem' }) {
  return <div className="mode" role="tablist" aria-label={label}>
    {items.map((it) => <AppButtonWithIcon key={it.key} className={'mode-b' + (it.key === value ? ' on' : '')} role="tab" aria-selected={String(it.key === value)}
      title={it.title} icon={it.icon} iconRaw={it.iconRaw} onClick={() => onChange && onChange(it.key)}>{it.label}</AppButtonWithIcon>)}
  </div>;
}
