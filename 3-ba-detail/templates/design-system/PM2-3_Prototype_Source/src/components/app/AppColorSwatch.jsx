/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Ô mẫu màu — hiện 1 bảng màu kèm tên token và mã màu ĐỌC TỪ CSS THẬT lúc chạy, không gõ mã màu.
 * colors: [{ name, token }] với token là biến CSS, vd '--color-brand'. Dùng để tra bảng màu, không dùng làm ô chọn màu. */
import { useEffect, useState } from 'react';
import './AppExtraControls.css';

/**
 * Thuộc tính của AppColorSwatch (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {array} props.colors - Danh sách màu `{ name, token }`, `token` là biến CSS, mã màu đọc từ CSS lúc chạy.
 */
export default function AppColorSwatch({ colors = [] }) {
  const [hex, setHex] = useState({});
  useEffect(() => {
    const css = getComputedStyle(document.documentElement);
    setHex(Object.fromEntries(colors.map((c) => [c.token, css.getPropertyValue(c.token).trim()])));
  }, [colors]);
  return <ul className="app-swatch-list">
    {colors.map((c) => <li key={c.token} className="app-swatch">
      <span className="app-swatch-chip" style={{ background: 'var(' + c.token + ')' }} aria-hidden="true" />
      <span className="app-swatch-text"><b>{c.name}</b><code>{c.token}</code><span className="app-swatch-hex">{hex[c.token] || '—'}</span></span>
    </li>)}
  </ul>;
}
