/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Liên kết — chuyển tới màn hoặc trang khác, nằm trong câu chữ. Thao tác thay đổi dữ liệu thì dùng Nút, không dùng liên kết.
 * external: mở tab mới, kèm icon mũi tên ra ngoài và rel an toàn. */
import './AppExtraControls.css';

const ICON_EXTERNAL = '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>';

/**
 * Thuộc tính của AppLink (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {string} props.href - Địa chỉ đích của liên kết, bỏ khi liên kết bị khóa.
 * @param {ReactNode} props.children - Chữ hiển thị của liên kết.
 * @param {boolean} props.external - Bật thì mở tab mới, thêm `rel` an toàn và icon mũi tên ra ngoài.
 * @param {boolean} props.disabled - Bật thì bỏ `href`, thêm lớp `is-disabled` và `aria-disabled` nên không bấm đi được.
 */
export default function AppLink({ href, children, external = false, disabled = false, ...rest }) {
  return <a className={'app-link' + (disabled ? ' is-disabled' : '')} href={disabled ? undefined : href} aria-disabled={disabled ? 'true' : undefined}
    target={external ? '_blank' : undefined} rel={external ? 'noreferrer noopener' : undefined} {...rest}>
    {children}
    {external ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICON_EXTERNAL }} /> : null}
  </a>;
}
