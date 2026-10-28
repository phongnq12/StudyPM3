/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Biến KEY của message hiển thị IN ĐẬM (PM2_MessageList quy tắc 12 mục 1.3).
 * Nơi dựng câu bọc giá trị key bằng key(v) ⇒ "**v**"; nơi hiển thị đổi dấu ** thành chữ đậm:
 * React: <RichText text={...} /> · chuỗi HTML (toast, engine.js): keyHtml(text) · thuộc tính, file xuất, lịch sử: plainText(text). */
import { Fragment } from 'react';

const DAU = /\*\*(.+?)\*\*/g;
export const key = (v) => '**' + v + '**';
export const plainText = (s) => String(s == null ? '' : s).replace(DAU, '$1');
const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/* chuỗi chữ thường ⇒ HTML có <b>; chuỗi đã là HTML (toast cũ có thẻ) thì chỉ đổi dấu ** */
export const keyHtml = (s, daLaHtml = false) => (daLaHtml ? String(s == null ? '' : s) : escapeHtml(s == null ? '' : s)).replace(DAU, '<b>$1</b>');

export function RichText({ text }) {
  const s = String(text == null ? '' : text);
  if (s.indexOf('**') < 0) return s;
  const out = []; let last = 0, m, i = 0;
  DAU.lastIndex = 0;
  while ((m = DAU.exec(s))) { if (m.index > last) out.push(s.slice(last, m.index)); out.push(<b key={i++}>{m[1]}</b>); last = m.index + m[0].length; }
  if (last < s.length) out.push(s.slice(last));
  return <Fragment>{out}</Fragment>;
}
