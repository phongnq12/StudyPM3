/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Ô số — nhập số nguyên trong khoảng min..max, 2 nút giảm/tăng theo bước. Gõ chữ không phải số thì bỏ.
 * Chặn vượt trần NGAY khi gõ, theo PM1 QC rule 29: max 100 thì gõ tới 100 là dừng, gõ thành 101 ô vẫn giữ 100.
 * Dưới min vẫn cho gõ tạm (đang gõ dở), rời ô thì kẹp về min. Cao 36, bo 8, viền như ô nhập chữ. */
import { useState, useEffect } from 'react';
import './AppExtraControls.css';

/**
 * Thuộc tính của AppNumberInput (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {string} props.id - Mã định danh gắn lên ô nhập số bên trong.
 * @param {string} props.label - Tên đọc màn hình của ô nhập, cũng ghép sau chữ «Giảm» và «Tăng» làm tên của 2 nút bước.
 * @param {number} props.value - Giá trị số đang hiển thị, đổi từ ngoài thì ô cập nhật lại chữ theo giá trị mới.
 * @param {function} props.onChange - Gọi khi rời ô hoặc bấm nút giảm, tăng, nhận số đã kẹp trong khoảng `min` tới `max`.
 * @param {number} props.min - Giá trị nhỏ nhất, rời ô khi đang dưới mức này thì kẹp về `min`, chạm mức thì khoá nút giảm.
 * @param {number} props.max - Giá trị lớn nhất được nhập, gõ vượt thì ô giữ ở giá trị này, chạm mức thì khoá nút tăng.
 * @param {number} props.step - Bước cộng hoặc trừ mỗi lần bấm nút tăng, giảm.
 * @param {boolean} props.disabled - Khoá ô nhập và cả 2 nút bước, gắn lớp `is-disabled` cho khối bọc.
 */
export default function AppNumberInput({ id, label, value = 0, onChange, min = 0, max = 999, step = 1, disabled = false }) {
  const [text, setText] = useState(String(value));
  useEffect(() => { setText(String(value)); }, [value]);
  const clamp = (n) => Math.min(max, Math.max(min, n));
  const commit = (n) => { const v = clamp(Number.isFinite(n) ? n : min); setText(String(v)); if (onChange) onChange(v); };
  return <span className={'app-number' + (disabled ? ' is-disabled' : '')}>
    <button type="button" className="app-number-step" aria-label={'Giảm ' + (label || '')} disabled={disabled || value <= min} onClick={() => commit(value - step)}>−</button>
    <input id={id} className="app-number-input" inputMode="numeric" aria-label={label} value={text} disabled={disabled}
      onChange={(e) => { let s = e.target.value.replace(min < 0 ? /[^\d-]/g : /[^\d]/g, ''); const n = parseInt(s, 10); if (Number.isFinite(n) && n > max) s = String(max); setText(s); }}
      onBlur={() => commit(parseInt(text, 10))} />
    <button type="button" className="app-number-step" aria-label={'Tăng ' + (label || '')} disabled={disabled || value >= max} onClick={() => commit(value + step)}>+</button>
  </span>;
}
