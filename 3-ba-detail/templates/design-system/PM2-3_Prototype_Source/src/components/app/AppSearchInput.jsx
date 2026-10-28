/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* AppSearchInput — ô tìm dùng chung của mọi danh sách.
 * Khuôn lấy nguyên từ ô tìm màn Danh sách lịch hẹn: khung .filter-search (kính lúp — base.css) + ô nhập + nút X «Xóa nội dung tìm kiếm».
 * Nút X chỉ hiện khi có chữ (lớp has-text), bấm thì xóa chữ rồi focus lại ô. CSS nút X ở styles/base.css (kiểu tròn xám ở pm1-look.css).
 * className = lớp bố cục của từng màn (filter-cell filter-wide · vt-filter-search · noti-search…); onChange nhận CHUỖI, ⛔ nhận event. */
import { Svg } from '@/lib/icons';
import { AppButton } from '@/components/app/AppButton';

/**
 * Thuộc tính của AppSearchInput (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {string} props.className - Lớp bố cục của màn, ghép trước lớp `filter-search` của khung ô tìm.
 * @param {string} props.value - Chữ trong ô tìm, có chữ thì thêm lớp `has-text` để hiện nút X.
 * @param {function} props.onChange - Gọi khi gõ chữ hoặc bấm nút X, nhận chuỗi mới (chuỗi rỗng khi bấm X).
 * @param {string} props.id - Id của ô nhập tìm kiếm.
 * @param {string} props.placeholder - Chữ gợi ý hiện khi ô tìm trống.
 * @param {string} props.title - Chữ chú thích hiện khi di chuột lên ô nhập.
 */
export default function AppSearchInput({ className = '', value, onChange, id, placeholder, title }) {
  return (
    <div className={(className ? className + ' ' : '') + 'filter-search' + (value ? ' has-text' : '')}>
      <Svg raw={'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>'} />
      <input type="text" id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} title={title} />
      <AppButton htmlType="button" className="filter-clear" data-o="tim" title="Xóa nội dung tìm kiếm" onClick={(e) => { onChange(''); const i = e.currentTarget.closest('.filter-search').querySelector('input'); if (i) i.focus(); }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg></AppButton>
    </div>
  );
}
