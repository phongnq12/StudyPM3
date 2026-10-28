/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Tự hủy lịch hẹn Từ chối duyệt chưa gửi duyệt lại (thông báo NOTIFICATION_CODES.AUTO_CANCELLED ở màn Cài đặt thông báo).
 * Chạy lúc mở app (main.jsx, trước khi màn đọc kho) và ngay sau thao tác Từ chối duyệt (từ chối khi đã qua mốc thì hủy ngay).
 * Điều kiện (thay mốc «giờ hẹn − 60 phút» cũ): lịch Từ chối duyệt (trực tiếp lẫn ngoại lệ) · bây giờ ≥ mốc tự hủy,
 * mốc tự hủy = mốc TỚI TRƯỚC trong 2 mốc: lúc từ chối + số giờ giữ chỗ (mặc định 24) · giờ hẹn − mốc cài đặt (mặc định 30 phút).
 * luật tự hủy LUÔN chạy; công tắc Bật/Tắt ở màn Cài đặt thông báo chỉ quyết định có gửi thông báo hay không.
 * Kết quả: trạng thái Đã hủy (không giữ buồng, không giữ quỹ) + 1 dòng Lịch sử thao tác của Hệ thống + thông báo cho cán bộ tạo lịch.
 * Chạy lại nhiều lần không sinh thêm gì: lịch đã Đã hủy thì không còn là Từ chối duyệt. */
import { logAction, readHistory, setStatus, timeMsOf } from '@/data/historyStore';
import { readEdited } from '@/data/appointmentStore';
import { buildAppointments } from '@/pages/AppointmentList/listLogic';
import { NOTIFICATION_CODES, offsetMinutesOf, settingOf } from '@/data/notificationSettingsStore';
import { notifyAutoCancel } from '@/data/notificationStore';

export const AUTO_CANCEL_ACTOR = { name: 'Hệ thống', role: 'Tự động' };
export const AUTO_CANCEL_REASON = 'Tự hủy lịch hẹn Từ chối duyệt chưa gửi duyệt lại';
/* số giờ giữ chỗ kể từ lúc bị từ chối và mốc trước giờ hẹn đều lấy từ dòng Tự hủy ở màn Cài đặt thông báo (mặc định 24 giờ · 30 phút) */
export const DEFAULT_HOLD_HOURS = 24;
export function holdHoursOf() {
  const rule = settingOf(NOTIFICATION_CODES.AUTO_CANCELLED);
  const h = rule ? +rule.holdHours : NaN;
  return Number.isFinite(h) && h >= 1 ? h : DEFAULT_HOLD_HOURS;
}

const visitAt = (r) => { const d = /^(\d{4})-(\d{2})-(\d{2})/.exec(r.visitDate || ''), t = /^(\d{1,2}):(\d{2})/.exec(r.visitTime || '');
  return d && t ? new Date(+d[1], +d[2] - 1, +d[3], +t[1], +t[2]).getTime() : NaN; };
/* lúc bị từ chối của LẦN HIỆN TẠI: kho sửa (recordRejection ghi ngay khi từ chối) ⇒ bản ghi ⇒ dòng «Từ chối duyệt» cuối của Lịch sử thao tác */
function rejectedMsOf(r) {
  let at = '';
  try { at = (readEdited()[r.code] || {}).rejectedAt || ''; } catch (e) { at = ''; }
  if (!at) at = r.rejectedAt || '';
  if (!at) { const row = readHistory(r.code).filter((x) => x.action === 'Từ chối duyệt').pop(); at = row ? row.at : ''; }
  return timeMsOf(at) || NaN;
}
/* mốc tự hủy (ms) của 1 lịch; thiếu cả giờ hẹn lẫn lúc từ chối ⇒ NaN (không hủy) */
export function autoCancelAtMs(r) {
  const rule = settingOf(NOTIFICATION_CODES.AUTO_CANCELLED);
  const before = rule ? offsetMinutesOf(rule) * (rule.sendType === 'AFTER' ? -1 : 1) : 30;
  const marks = [visitAt(r) - before * 60000, rejectedMsOf(r) + holdHoursOf() * 3600000].filter((x) => !Number.isNaN(x));
  return marks.length ? Math.min(...marks) : NaN;
}
/* mốc tự hủy dạng dd/MM/yyyy HH:mm — cảnh báo W001-24 và biến {auto_cancel_time} của thông báo Từ chối duyệt */
export function autoCancelText(r) {
  const t = r ? autoCancelAtMs(r) : NaN;
  if (Number.isNaN(t)) return '';
  const d = new Date(t), p = (n) => String(n).padStart(2, '0');
  return p(d.getDate()) + '/' + p(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
}

/* cùng chữ theo mã lịch — màn Chi tiết và màn Chỉnh sửa (cảnh báo W001-24) */
export function autoCancelTextOf(code) {
  try { return autoCancelText(buildAppointments().find((x) => x.code === code)); } catch (e) { return ''; }
}

/* Trả danh sách mã đã hủy ở lần chạy này */
export function runAutoCancel(now = Date.now()) {
  try {
    const due = buildAppointments().filter((r) => r.status === 'REJECTED' && autoCancelAtMs(r) <= now);
    due.forEach((r) => {
      let sent = '';
      try { sent = notifyAutoCancel(r); } catch (e) { /* thông báo không chặn việc hủy */ }   /* đang Tắt ⇒ '' */
      logAction(r.code, 'Hủy lịch hẹn', { statusBefore: 'REJECTED', statusAfter: 'CANCELLED', reason: AUTO_CANCEL_REASON, note: sent, actor: AUTO_CANCEL_ACTOR });
      setStatus(r.code, 'CANCELLED');
    });
    return due.map((r) => r.code);
  } catch (e) { return []; }   /* không chặn app */
}
