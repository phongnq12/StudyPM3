/* PM3 · Kho thông báo trên chuông — cùng API với kho thông báo PM2 (notificationStore.js) để dùng lại NotificationBell.
 * Lưu localStorage. Thông báo gửi theo vai (recipientKey = key tài khoản), mới nhất trước. Ngày giờ dùng dayjs. */
import dayjs from 'dayjs';

const STORAGE_KEY = 'pm3.notifications.v1';
const CHANGE_EVENT = 'pm3-notifications-change';
export const UNREAD_BADGE_MAX = 99;
export const DROPDOWN_LIMIT = 10;

function readAll() {
  try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return JSON.parse(raw); } catch (e) { /* hỏng hoặc bị chặn ⇒ rỗng */ }
  return [];
}
function writeAll(list) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (e) { return false; }
  try { window.dispatchEvent(new Event(CHANGE_EVENT)); } catch (e) { /* bỏ qua */ }
  return true;
}

export const notificationsFor = (accountKey) => readAll().filter((n) => n.recipientKey === accountKey).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
/* n: { recipientKey, title, body, actionUrl, recordCode } — title/body dùng **…** để in đậm từ khoá */
export function pushNotification(n) {
  const list = readAll();
  list.push({ id: 'TB-' + dayjs().valueOf().toString(36) + Math.random().toString(36).slice(2, 6), isRead: false, createdAt: dayjs().toISOString(), ...n });
  return writeAll(list);
}
export function markRead(id) { const list = readAll(); const n = list.find((x) => x.id === id); if (n && !n.isRead) { n.isRead = true; writeAll(list); } }
export function markAllRead(accountKey) { const list = readAll(); list.forEach((n) => { if (n.recipientKey === accountKey) n.isRead = true; }); writeAll(list); }
export function onNotificationsChange(fn) {
  const h = (e) => { if (!e.key || e.key === STORAGE_KEY) fn(); };
  window.addEventListener(CHANGE_EVENT, fn); window.addEventListener('storage', h);
  return () => { window.removeEventListener(CHANGE_EVENT, fn); window.removeEventListener('storage', h); };
}
/* «x phút trước» */
export function timeAgo(iso) {
  const s = Math.max(0, dayjs().diff(dayjs(iso), 'second'));
  if (s < 45) return 'vài giây trước';
  const m = Math.round(s / 60); if (m < 45) return m + ' phút trước';
  const h = Math.round(m / 60); if (h < 22) return h + ' giờ trước';
  const d = Math.round(h / 24); if (d < 26) return d + ' ngày trước';
  const mo = Math.round(d / 30); if (mo < 11) return mo + ' tháng trước';
  return Math.round(mo / 12) + ' năm trước';
}
