/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Hộp nổi — giải thích ngắn hoặc vài thao tác phụ, mở khi bấm, không chặn màn.
 * Khác Tooltip (chỉ hiện khi rê chuột, chỉ có chữ): hộp nổi bấm mới mở, chứa được tiêu đề và nội dung. Esc hoặc bấm ra ngoài thì đóng. */
import { useEffect, useRef, useState } from 'react';
import { AppButtonWithIcon } from '@/components/app/AppButton';
import './AppExtraControls.css';

/**
 * Thuộc tính của AppPopover (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {ReactNode} props.triggerLabel - Chữ trên nút mở hộp nổi, cũng làm tên đọc màn hình khi không có `title`.
 * @param {string} props.triggerIcon - Tên icon trong bộ `lib/icons` hiện trên nút mở hộp nổi.
 * @param {ReactNode} props.title - Tiêu đề in đầu hộp nổi, bỏ trống thì không có dòng tiêu đề.
 * @param {ReactNode} props.children - Nội dung bên trong hộp nổi.
 * @param {string} props.id - Mã định danh của hộp nổi, nút mở trỏ tới qua `aria-controls`.
 */
export default function AppPopover({ triggerLabel, triggerIcon, title, children, id = 'appPopover' }) {
  const [open, setOpen] = useState(false);
  const box = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => { if (box.current && !box.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc); document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);
  return <span className="app-popover" ref={box}>
    <AppButtonWithIcon className="form-btn" icon={triggerIcon} aria-expanded={String(open)} aria-controls={id} onClick={() => setOpen(!open)}>{triggerLabel}</AppButtonWithIcon>
    {open ? <div className="app-popover-panel" id={id} role="dialog" aria-label={title || triggerLabel}>{title ? <h3>{title}</h3> : null}{children}</div> : null}
  </span>;
}
