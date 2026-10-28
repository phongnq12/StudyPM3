/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Ghi chú trong khối form — 1 nguồn cho mọi màn PM2.
 * NoteBox — khung cuối khối: nền info, viền trái đậm, icon, tiêu đề «Lưu ý», gạch đầu dòng, từ khoá in đậm.
 * Dùng cho cả quy tắc nhập liệu lẫn thông tin về cả khối (vd số đồng bộ từ C04).
 * KHÔNG viết quy tắc bắt buộc bằng dòng chữ xám .field-hint — chữ đó chỉ dành cho gợi ý ngắn dưới 1 ô. */
import { Svg } from '@/lib/icons';
import './NoteBox.css';

const ICON = '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>';

/* line: 1 câu thông tin (không phải quy tắc nhập liệu) ⇒ khung tông XÁM, 1 dòng, chữ xám */
/**
 * Thuộc tính của NoteBox (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {string} props.id - Mã gắn vào khung ghi chú.
 * @param {string} props.title - Tiêu đề khung, ở dạng 1 dòng thì đứng trước câu kèm dấu hai chấm.
 * @param {array} props.items - Danh sách ý, mỗi ý 1 gạch đầu dòng, bắt buộc khi không truyền `line`.
 * @param {ReactNode} props.line - Câu thông tin 1 dòng, có giá trị thì hiện khung tông xám và bỏ qua `items`.
 */
export default function NoteBox({ id, title = 'Lưu ý', items, line }) {
  if (line) return (
    <div className="note-box is-muted" id={id} role="note">
      <Svg raw={ICON} />
      <div className="note-box-line">{title + ': '}{line}</div>
    </div>);
  return (
    <div className="note-box" id={id} role="note">
      <Svg raw={ICON} />
      <div><div className="note-box-title">{title}</div><ul>{items.map((t, i) => <li key={i}>{t}</li>)}</ul></div>
    </div>);
}
