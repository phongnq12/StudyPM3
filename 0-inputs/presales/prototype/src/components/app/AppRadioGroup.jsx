/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Nhóm radio — chọn đúng 1 trong vài giá trị ngắn (2–5), hiện hết lựa chọn trên màn. Nhiều hơn 5 giá trị thì dùng Ô chọn.
 * options: [{ value, label, disabled }] · inline mặc định, vertical khi nhãn dài. */
import './AppExtraControls.css';

/**
 * Thuộc tính của AppRadioGroup (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {string} props.name - Thuộc tính `name` chung của các ô radio trong nhóm.
 * @param {string} props.label - Nhãn đọc của nhóm, gán vào `aria-label`, không hiện chữ trên màn.
 * @param {array} props.options - Danh sách lựa chọn `{ value, label, disabled }`, mỗi mục là 1 ô radio.
 * @param {string | number} props.value - Giá trị đang chọn, ô radio có `value` bằng giá trị này được tick.
 * @param {function} props.onChange - Gọi khi người dùng chọn 1 ô radio, nhận `value` của lựa chọn đó.
 * @param {boolean} props.disabled - Khoá mọi ô radio trong nhóm và thêm lớp `is-disabled`.
 * @param {boolean} props.vertical - Xếp các lựa chọn theo cột bằng lớp `is-vertical` thay vì hàng ngang.
 * @param {string} props.className - Lớp bổ sung, ghép sau lớp `app-choice-group`.
 */
export default function AppRadioGroup({ name, label, options = [], value, onChange, disabled = false, vertical = false, className = '' }) {
  return <div role="radiogroup" aria-label={label} className={'app-choice-group' + (vertical ? ' is-vertical' : '') + (className ? ' ' + className : '')}>
    {options.map((o) => {
      const off = disabled || o.disabled;
      return <label key={o.value} className={'app-choice' + (off ? ' is-disabled' : '')}>
        <input type="radio" name={name} value={o.value} checked={value === o.value} disabled={off} onChange={() => onChange && onChange(o.value)} />
        <span>{o.label}</span>
      </label>;
    })}
  </div>;
}
