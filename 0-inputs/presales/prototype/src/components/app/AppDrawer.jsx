/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Ngăn kéo bên phải — xem hoặc sửa nhanh 1 bản ghi mà không rời màn danh sách.
 * Nút X dùng chung DialogCloseButton · Esc hoặc bấm nền tối thì đóng · footer nhận mảng nút như thanh nút chân trang. */
import { useEffect } from 'react';
import DialogCloseButton from '@/components/app/DialogCloseButton';
import './AppExtraControls.css';

/**
 * Thuộc tính của AppDrawer (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {boolean} props.open - Bật thì hiện ngăn kéo bên phải, tắt thì không vẽ gì.
 * @param {ReactNode} props.title - Tiêu đề ở đầu ngăn kéo, cũng là tên đọc màn hình của ngăn kéo.
 * @param {function} props.onClose - Gọi khi người dùng bấm nút X, nhấn Esc hoặc bấm ra nền tối.
 * @param {ReactNode} props.children - Nội dung thân ngăn kéo.
 * @param {ReactNode} props.footer - Nội dung chân ngăn kéo, thường là các nút, bỏ trống thì không có phần chân.
 * @param {string} props.id - Mã định danh của ngăn kéo, tiêu đề lấy mã này thêm hậu tố `Title`, bỏ trống thì dùng `appDrawerTitle`.
 */
export default function AppDrawer({ open, title, onClose, children, footer, id }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape' && onClose) onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return <div className="app-drawer-mask" onClick={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}>
    <aside className="app-drawer" role="dialog" aria-modal="true" aria-labelledby={(id || 'appDrawer') + 'Title'} id={id}>
      <div className="app-drawer-head"><h2 id={(id || 'appDrawer') + 'Title'}>{title}</h2><DialogCloseButton onClick={onClose} /></div>
      <div className="app-drawer-body">{children}</div>
      {footer ? <div className="app-drawer-foot">{footer}</div> : null}
    </aside>
  </div>;
}
