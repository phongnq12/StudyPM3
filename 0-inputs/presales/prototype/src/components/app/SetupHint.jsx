/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Màn chưa có dữ liệu cần cài đặt trước — 1 khuôn cho mọi màn PM2.
 * Hiện I001-94 «Chưa có {0} nào. Vui lòng cài đặt tại {1}» — {1} là LINK mở thẳng màn cài đặt.
 * inline: gọn trong dòng (dưới 1 ô form, trong ô trống của lưới chọn giờ) · mặc định: khối thay vùng dữ liệu trống.
 * Dùng: <SetupHint what="buồng thăm gặp" screen="Cài đặt quầy tiếp đón" to={ROUTES.receptionDeskList} /> */
import { Svg } from '@/lib/icons';
import { setupHintParts } from '@/lib/setupHint';
import './SetupHint.css';

const ICON = '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>';

/* parts: { truoc, link, sau } từ linkInMsg cho câu khác I001-94 · onLinkClick: chuyển bước, tab trong cùng màn */
/**
 * Thuộc tính của SetupHint (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {string} props.what - Tên dữ liệu còn thiếu, điền vào chỗ {0} của câu I001-94.
 * @param {string} props.screen - Tên màn cài đặt, làm chữ của link ở chỗ {1} khi không truyền `parts`.
 * @param {string} props.to - Đường dẫn mở màn cài đặt, gắn vào link.
 * @param {string} props.id - Mã gắn vào khối gợi ý.
 * @param {boolean} props.inline - Hiện gọn trong dòng thay vì khối thay vùng dữ liệu trống.
 * @param {object} props.parts - Câu đã cắt sẵn `{ truoc, link, sau }` dùng cho câu khác I001-94, có giá trị thì bỏ qua `what` và `screen`.
 * @param {function} props.onLinkClick - Gọi khi bấm link, không nhận đối số, có giá trị thì chặn chuyển trang theo `to`.
 */
export default function SetupHint({ what, screen, to, id, inline = false, parts, onLinkClick }) {
  const p = parts || { ...setupHintParts(what), link: screen };
  return (
    <div className={'setup-hint' + (inline ? ' is-inline' : '')} id={id} role="status">
      <Svg raw={ICON} />
      <span>{p.truoc}<a className="setup-hint-link" href={to} onClick={onLinkClick ? (e) => { e.preventDefault(); onLinkClick(); } : undefined}>{p.link}</a>{p.sau}</span>
    </div>);
}
