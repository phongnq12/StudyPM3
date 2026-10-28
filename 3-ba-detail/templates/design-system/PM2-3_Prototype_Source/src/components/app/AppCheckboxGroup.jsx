/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Nhóm ô tích — chọn nhiều giá trị trong danh sách ngắn, hiện hết lựa chọn. Ô tích 16x16 như Ô tích đơn.
 * options: [{ value, label, disabled }] · value: mảng giá trị đang chọn. */
import './AppExtraControls.css';

/**
 * Thuộc tính của AppCheckboxGroup (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {string} props.label - Tên đọc màn hình của nhóm, gắn vào `aria-label` của khối `role=group`, không hiện thành chữ.
 * @param {array} props.options - Danh sách lựa chọn dạng `{ value, label, disabled }`, lựa chọn có `disabled` thì khoá riêng ô đó.
 * @param {array} props.value - Mảng giá trị đang được tích, ô có `value` nằm trong mảng thì hiện đã tích.
 * @param {function} props.onChange - Gọi khi người dùng tích hoặc bỏ tích 1 ô, nhận mảng giá trị mới sau khi thêm hoặc bớt giá trị đó.
 * @param {boolean} props.disabled - Khoá toàn bộ ô tích trong nhóm và gắn lớp `is-disabled` cho từng lựa chọn.
 * @param {boolean} props.vertical - Xếp các lựa chọn theo cột bằng lớp `is-vertical`, mặc định xếp theo hàng.
 * @param {string} props.className - Lớp CSS thêm vào khối bọc `app-choice-group`.
 */
export default function AppCheckboxGroup({ label, options = [], value = [], onChange, disabled = false, vertical = false, className = '' }) {
  const toggle = (v) => onChange && onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  return <div role="group" aria-label={label} className={'app-choice-group' + (vertical ? ' is-vertical' : '') + (className ? ' ' + className : '')}>
    {options.map((o) => {
      const off = disabled || o.disabled;
      return <label key={o.value} className={'app-choice' + (off ? ' is-disabled' : '')}>
        <input type="checkbox" checked={value.includes(o.value)} disabled={off} onChange={() => toggle(o.value)} />
        <span>{o.label}</span>
      </label>;
    })}
  </div>;
}
