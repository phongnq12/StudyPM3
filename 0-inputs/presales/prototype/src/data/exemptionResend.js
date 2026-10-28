/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Đơn ngoại lệ — dữ liệu dùng chung 3 màn Tạo (Đăng ký tại quầy) · Sửa · Xem và popup gửi duyệt lại.
 * exemptionInfoOf: gom thông tin đơn theo ĐÚNG thứ tự màn Tạo · notifyPendingApproval: báo người duyệt · recordRejection, roundsOf, roundChanges: lộ trình duyệt nhiều lần. Gửi lại đơn Từ chối duyệt đi qua màn Chỉnh sửa. */
import { readEdited, toDisplayDate, writeEdited } from '@/data/appointmentStore';
import { readHistory, timeText } from '@/data/historyStore';
import { currentAccount } from '@/data/accountStore';
import { defaultRecipients, pendingCodeOf, sendActionNotification } from '@/data/notificationStore';
import { findCounter } from '@/data/receptionDeskStore';
import { counterLabel, studentResource } from '@/lib/tableTimeline';
import { counterCodeOf } from '@/lib/resourceImpact';

const WEEKDAY_NAMES = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
const pad2 = (n) => String(n).padStart(2, '0');
const dayLabelOf = (iso) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || ''); return m ? WEEKDAY_NAMES[new Date(+m[1], +m[2] - 1, +m[3]).getDay()] + ', ' + toDisplayDate(m[0]) : ''; };
const slotLabelOf = (time, minutes) => { if (!/^\d{2}:\d{2}/.test(time || '')) return ''; const t = +time.slice(0, 2) * 60 + +time.slice(3, 5) + (+minutes || 45); return time.slice(0, 5) + ' — ' + pad2(Math.floor(t / 60)) + ':' + pad2(t % 60); };

/* bản ghi (mô hình tiếng Anh) ⇒ thông tin đơn + thông tin bước 2 của màn Tạo */
export function exemptionInfoOf(r) {
  if (!r) return null;
  const counter = findCounter(counterCodeOf(r));
  return {
    code: r.code, status: r.status,
    visitorName: r.visitorName || '', visitorCitizenId: r.visitorCitizenId || '', visitorPhone: r.visitorPhone || '',
    studentName: r.studentName || '', studentCode: r.studentCode || '', relationship: r.relationship || '',
    companions: (r.companions || []).map((c) => ({ name: c.name || '', citizenId: c.citizenId || '', relationship: c.relationship || '' })),
    exemptionReason: r.exemptionReason || '', attachments: r.attachments || [],
    visitTypeName: r.visitTypeName || '', dormitoryName: r.studentCode ? studentResource(r.studentCode).dormitoryName : '',
    counterName: counter ? counterLabel(counter) : '', visitDayLabel: dayLabelOf(r.visitDate), timeSlotLabel: slotLabelOf(r.visitTime, r.durationMinutes), tableCode: r.tableCode || '',
  };
}

/* báo người nhận khi lịch vào Chờ duyệt — chung màn Tạo, Chỉnh sửa, Đăng ký tại quầy.
 * người nhận theo mục chọn thông báo của lịch (Cán bộ tổ thăm gặp, Người nhận thông tin thêm) + Trưởng cơ sở với đơn xin ngoại lệ.
 * Trả «Đã gửi thông báo cho …» để nơi gọi ghi vào Lịch sử thao tác; '' khi thông báo đang Tắt */
export function notifyPendingApproval(rec, resent) {
  const me = currentAccount();
  const reason = resent ? 'Lịch hẹn bị từ chối, cán bộ đã chỉnh sửa và gửi lại'
    : rec.exemptionReason ? 'Đơn xin duyệt cho thân nhân chưa có sổ hoặc tài khoản thăm gặp: ' + rec.exemptionReason : '';
  try {
    const code = pendingCodeOf(rec);
    return sendActionNotification(code, rec, defaultRecipients(code, [rec]),
      { actor: 'Người gửi: **' + me.name + '** (' + me.role + ')', lines: reason ? ['Lý do cần duyệt: **' + reason + '**'] : [] });
  } catch (e) { return ''; }   /* thông báo không chặn việc lưu lịch */
}

/* ── Lộ trình duyệt: mỗi lần gửi duyệt là 1 lần.
 * Bản ghi giữ: approvalRounds [{ round, requestReason, attachments, submittedAt, rejectReason, rejectedBy, rejectedAt }] = các lần ĐÃ bị từ chối,
 * lần hiện tại nằm ở chính bản ghi (exemptionReason, attachments, submittedAt, rejectReason/By/At khi đang Từ chối duyệt). */
const NOTIFY_SUFFIX = ' · Đã gửi thông báo cho thân nhân';
const cleanReason = (s) => String(s || '').split(NOTIFY_SUFFIX).join('').trim();
/* Từ chối duyệt ⇒ ghi lý do, người, thời điểm vào lần hiện tại của bản ghi (bản sửa) — Danh sách và Chi tiết cùng gọi */
export function recordRejection(code, reason) {
  const me = currentAccount();
  try {
    const edited = readEdited(); edited[code] = { ...(edited[code] || {}), rejectReason: cleanReason(reason), rejectedBy: me.name + ' (' + me.role + ')', rejectedAt: timeText() };
    writeEdited(edited);
  } catch (e) { /* lịch sử thao tác vẫn còn dòng Từ chối duyệt để dựng lại */ }
}
/* lần hiện tại của bản ghi — thiếu dữ liệu (lịch từ chối trước khi có trường này) thì dựng từ Lịch sử thao tác */
function currentRoundOf(r) {
  const rows = readHistory(r.code);
  const lastResend = rows.map((x) => x.action).lastIndexOf('Chỉnh sửa và gửi duyệt lại');
  const since = rows.slice(lastResend + 1);
  const submit = lastResend >= 0 ? rows[lastResend] : rows[0];
  const reject = since.filter((x) => x.action === 'Từ chối duyệt').pop();
  return {
    round: (r.approvalRounds || []).length + 1, requestReason: r.exemptionReason || '', attachments: r.attachments || [],
    submittedAt: r.submittedAt || (submit ? submit.at : ''),
    rejectReason: r.rejectReason || (r.status === 'REJECTED' && reject ? cleanReason(reject.reason) : ''),
    rejectedBy: r.rejectedBy || (r.status === 'REJECTED' && reject ? reject.actorName + ' (' + reject.actorRole + ')' : ''),
    rejectedAt: r.rejectedAt || (r.status === 'REJECTED' && reject ? reject.at : ''),
  };
}
/* đủ các lần: đã từ chối + lần hiện tại (status = trạng thái của lần hiện tại) */
export const roundsOf = (r) => (r ? (r.approvalRounds || []).concat([{ ...currentRoundOf(r), status: r.status, isCurrent: true }]) : []);
/* Lưu màn Sửa: gửi lại lịch Từ chối duyệt ⇒ đẩy lần hiện tại vào approvalRounds, mở lần mới; lưu nháp ⇒ giữ nguyên lộ trình */
export function roundChanges(original, resend) {
  if (!resend) return { approvalRounds: original.approvalRounds || [], submittedAt: original.submittedAt || '', rejectReason: original.rejectReason || '', rejectedBy: original.rejectedBy || '', rejectedAt: original.rejectedAt || '' };
  const { round, requestReason, attachments, submittedAt, rejectReason, rejectedBy, rejectedAt } = currentRoundOf(original);
  return { approvalRounds: (original.approvalRounds || []).concat([{ round, requestReason, attachments, submittedAt, rejectReason, rejectedBy, rejectedAt }]), submittedAt: timeText(), rejectReason: '', rejectedBy: '', rejectedAt: '' };
}
