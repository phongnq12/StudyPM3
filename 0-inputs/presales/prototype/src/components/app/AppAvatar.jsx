/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Avatar — chữ cái đầu của TÊN (từ cuối của họ tên), hình tròn nền màu chủ đạo, cùng hình .relative-avatar.
 * size: sm 28 · md 36 · lg 44. AppAvatarGroup xếp chồng, quá max hiện «+n». */
import './AppExtraControls.css';

export const initialsOf = (name = '') => { const w = String(name).trim().split(/\s+/).filter(Boolean); return w.length ? w[w.length - 1][0].toUpperCase() : '?'; };

/**
 * Thuộc tính của AppAvatar (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {string} props.name - Họ tên, lấy chữ cái đầu của từ cuối làm chữ hiển thị và dùng làm nhãn cho trình đọc màn hình.
 * @param {'sm' | 'md' | 'lg'} props.size - Cỡ avatar: `sm` 28px, `md` 36px hoặc `lg` 44px.
 * @param {string} props.title - Chữ gợi ý khi rê chuột, bỏ trống thì dùng `name`.
 */
export default function AppAvatar({ name, size = 'md', title }) {
  /* tên rỗng ⇒ ẩn khỏi trình đọc màn hình, không đặt aria-label rỗng (lỗi WCAG role-img-alt) */
  if (!String(name ?? '').trim()) return <span className={'app-avatar is-' + size} title={title || undefined} aria-hidden="true">{initialsOf(name)}</span>;
  return <span className={'app-avatar is-' + size} title={title || name} aria-label={name} role="img">{initialsOf(name)}</span>;
}

export function AppAvatarGroup({ names = [], max = 4, size = 'md' }) {
  const shown = names.slice(0, max), more = names.length - shown.length;
  return <span className="app-avatar-group">
    {shown.map((n, i) => <AppAvatar key={i} name={n} size={size} />)}
    {more > 0 ? <span className={'app-avatar is-' + size} role="img" aria-label={'và ' + more + ' người khác'}>{'+' + more}</span> : null}
  </span>;
}
