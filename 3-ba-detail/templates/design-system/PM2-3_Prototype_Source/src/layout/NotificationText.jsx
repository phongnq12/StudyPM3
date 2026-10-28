/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Vẽ nội dung thông báo: phần trong dấu **…** là từ khoá in đậm — không dùng HTML thô */
export default function NotificationText({ text }) {
  return String(text || '').split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part, i) => (
    /^\*\*[^*]+\*\*$/.test(part) ? <b key={i} className="noti-key">{part.slice(2, -2)}</b> : <span key={i}>{part}</span>
  ));
}
