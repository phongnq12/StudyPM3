/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* msg(mã, …biến) — 1 cửa gọi message theo mã (Sổ BA PM2). Chữ lấy từ data/messageCatalog.js (sinh từ PM2_MessageList.md).
 * Trả về chuỗi đã lắp biến {0} {1}…; biến bọc **{n}** giữ dấu ** để lớp hiển thị in đậm key:
 * React: <RichText text={msg(…)} /> · HTML (toast, engine.js): keyHtml(msg(…)) — thoát ký tự HTML trước khi bọc <b>.
 * msgParts('C001-…', …) ⇒ { title, body, ok, cancel } của hộp xác nhận.
 * Import tương đối để script Node chạy ngoài Vite cũng nạp được file này. */
import { MESSAGES } from '../data/messageCatalog.js';

const lap = (tpl, args) => {
  let s = String(tpl || '').replace(/\{(\d+)\}/g, (_, i) => (args[+i] == null ? '' : String(args[+i])));
  s = s.replace(/\*\*\*\*/g, '').replace(/\(\s*\)/g, '').replace(/ {2,}/g, ' ').replace(/ ([,.?])/g, '$1').trim();   /* biến rỗng: bỏ dấu ** trống, ngoặc trống, khoảng trắng thừa */
  /* biến đứng đầu câu viết hoa chữ đầu (Message List: «viết hoa chữ đầu khi đứng đầu câu») */
  return s.replace(/^(\*\*)?(\S)/, (m0, b, c) => (b || '') + c.toLocaleUpperCase('vi'));
};
const lay = (code) => {
  const m = MESSAGES[code];
  if (!m) { console.error('[msg] mã không có trong Message List: ' + code); return null; }
  if (m.status === 'retired') console.error('[msg] mã đã Ngừng dùng: ' + code);
  return m;
};

export function msg(code, ...args) {
  const m = lay(code); if (!m) return code;
  return lap(m.text !== undefined ? m.text : m.title, args);
}

export function msgParts(code, ...args) {
  const m = lay(code); if (!m) return { title: code, body: '', ok: '', cancel: '' };
  return { title: lap(m.title, args), body: lap(m.body, args), ok: lap(m.ok, args), cancel: lap(m.cancel, args) };
}
