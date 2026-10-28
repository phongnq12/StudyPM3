/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* AppSearchSelect — Ô CHỌN CÓ TÌM dùng chung mọi màn.
 * <select> thật giữ giá trị + ô gõ tìm (lib/searchSelect.js): có nút xóa, bấm lần 2 mở lại danh sách.
 * Đổi options · value · disabled thì ô tìm tự đồng bộ. uncontrolled: DOM giữ giá trị (ô trong bảng). */
import { useLayoutEffect, useRef } from 'react';
import { attachSearch } from '@/lib/searchSelect';

/**
 * Thuộc tính của AppSearchSelect (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {string} props.id - Id của thẻ `select` gốc.
 * @param {array} props.options - Danh sách lựa chọn `{ value, label }`, có thể kèm `relationship`, `citizenId`, `birthDate` ghi ra thuộc tính data của option.
 * @param {string} props.value - Giá trị đang chọn, dùng làm giá trị ban đầu khi bật `uncontrolled`.
 * @param {boolean} props.disabled - Khoá ô chọn, ô gõ tìm tự đồng bộ theo trạng thái này.
 * @param {function} props.onChange - Gọi khi người dùng đổi lựa chọn, nhận chuỗi giá trị mới.
 * @param {boolean} props.hasErrorBorder - Bật viền lỗi bằng lớp `input-border-error` trên ô gõ tìm.
 * @param {string} props.className - Lớp của thẻ `select` gốc, mặc định `text-input`.
 * @param {string} props.wrapperId - Id của khối bọc `select-field`.
 * @param {boolean} props.uncontrolled - Để DOM giữ giá trị qua `defaultValue` thay vì `value`, dùng cho ô trong bảng.
 * @param {boolean} props.noClear - Ẩn nút xóa của ô gõ tìm bằng thuộc tính `data-no-clear`.
 */
export default function AppSearchSelect({ id, options, value, disabled, onChange, hasErrorBorder, className = 'text-input', wrapperId, uncontrolled, noClear }) {
  const ref = useRef(null);
  useLayoutEffect(() => { attachSearch(ref.current); }, []);
  const signature = JSON.stringify([options.map((o) => o.label), value, !!disabled]);
  useLayoutEffect(() => { if (ref.current.__syncSearch) ref.current.__syncSearch(); }, [signature]);
  useLayoutEffect(() => { const box = ref.current.parentElement.querySelector('.lookup-input'); if (box) box.classList.toggle('input-border-error', !!hasErrorBorder); });
  /* uncontrolled: the DOM holds the value (table cells, synced in FormBody) so choosing does not re-render the table */
  const valueProps = uncontrolled ? { defaultValue: value } : { value };
  return (
    <div className="select-field" id={wrapperId}>
      <select ref={ref} className={className} id={id} {...valueProps} disabled={disabled} data-no-clear={noClear ? '' : undefined} onChange={(e) => onChange && onChange(e.target.value)}>
        {options.map((o, i) => <option key={i} value={o.value} data-qh={o.relationship} data-gt={o.citizenId} data-ns={o.birthDate}>{o.label}</option>)}
      </select>
    </div>
  );
}
