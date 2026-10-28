/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* PM2 · Thông báo trong hệ thống — dựng theo chức năng Thông báo của PM1 (app thật /thong-bao).
 * 1 thông báo: { id, recipientKey, eventCode, title, body, lines[], actionUrl, recordCode, isRead, createdAt }
 * recipientKey: khoá tài khoản nhận (data/accountStore.js) · actionUrl: bấm vào là mở thẳng bản ghi cần xử lý.
 * Lưu localStorage (Prototype chưa có máy chủ). Lần đầu mở sinh dữ liệu mẫu từ các lịch hẹn Chờ duyệt có sẵn.
 * Ca thử: Tạo lịch hẹn ⇒ Lưu và gửi duyệt ra Chờ duyệt ⇒ Trưởng cơ sở nhận thông báo APPOINTMENT_PENDING_APPROVAL. */
import { approverKeyOf } from './accountStore';
import { seedAppointments, sourceLabel, toDisplayDate } from './appointmentStore';
import { currentAccount, FACILITY_NAME } from './accountStore';
import { dormitoryNameOfStudent } from './dormitoryStore';   /* {building} = Dãy nhà của người cai nghiện */
import { detailPathOf, listPathOf } from '@/data/approvalRoute';   /* đơn ngoại lệ mở Chi tiết ở module ngoại lệ */
import { NOTIFICATION_CODES, RECIPIENTS, RECIPIENT_GROUPS, canonicalEventCode, contentFor, fillTemplate, groupsOf, isNotificationEnabled, readNotificationSettings } from './notificationSettingsStore';
import { allStaff, defaultVisitTeamKeys, facilityHeads, staffByKey, staffName, visitTeamStaff } from './staffDirectoryStore';
import { counterStaffKeysOf } from './receptionDeskStore';   /* cán bộ phụ trách của quầy */
import { LEGACY_TABLE_MAP, readTables } from './visitTableStore';
import { autoCancelText } from '@/lib/autoCancel';   /* {auto_cancel_time} của thông báo Từ chối duyệt */

const STORAGE_KEY = 'pm2.notifications.v2';   /* v2: nội dung có dấu **…** in đậm từ khoá */
const CHANGE_EVENT = 'pm2:notifications';
export const UNREAD_BADGE_MAX = 99;   /* PM1: Badge overflowCount 99 ⇒ «99+» */
export const DROPDOWN_LIMIT = 10;     /* PM1: chuông lấy page 1, pageSize 10 */

/* Loại sự kiện — tên, người nhận, nội dung theo người nhận, bật/tắt, mốc thời gian lấy từ màn Cài đặt thông báo (data/notificationSettingsStore.js).
 * Mã cũ APPOINTMENT_REMINDER đổi sang APPOINTMENT_REMINDER_AFTER_CHECKIN qua LEGACY_EVENT_CODES. */
export const NOTIFICATION_EVENTS = Object.fromEntries(readNotificationSettings().map((r) => [r.code, { label: r.name, recipientKey: r.recipients }]));
export const eventLabel = (code) => (NOTIFICATION_EVENTS[canonicalEventCode(code)] || {}).label || code;

const B = (s) => '**' + s + '**';
/* biến BRD của 1 lịch hẹn — giá trị bọc ** để in đậm như các thông báo khác */
function templateVars(record, reason) {
  const start = record.visitTime || '';
  return {
    appointment_code: B(record.code), relative_name: record.visitorName ? B(record.visitorName) : '', student_name: record.studentName ? B(record.studentName) : '',
    appointment_time: B(toDisplayDate(record.visitDate || '') + (start ? ', ' + start : '')), visit_table: record.tableCode ? 'buồng ' + B(record.tableCode) : '',
    visit_type: record.visitTypeName ? B(record.visitTypeName) : '', building: record.studentCode ? B(dormitoryNameOfStudent(record.studentCode)) : '',
    reason: reason ? B(reason) : '', facility_name: B(FACILITY_NAME),
    /* chỉ lịch Từ chối duyệt có mốc tự hủy */
    auto_cancel_time: record.status === 'REJECTED' ? (() => { const t = autoCancelText(record); return t ? B(t) : ''; })() : '',
    /* lịch thay thế đề xuất (record.proposal) */
    proposed_time: record.proposal ? B(toDisplayDate(record.proposal.visitDate) + ', ' + record.proposal.visitTime) : '', proposed_table: record.proposal ? 'buồng ' + B(record.proposal.tableCode) : '',   /* cùng nguồn tên cơ sở ở đầu trang */
  };
}
/* tiêu đề + nội dung của 1 người nhận lấy từ màn Cài đặt thông báo, đã lắp biến */
function fromSetting(code, recipient, record, reason) {
  const ct = contentFor(code, recipient) || { title: '', body: '' }, vars = templateVars(record, reason);
  return { title: fillTemplate(ct.title, vars), body: fillTemplate(ct.body, vars) };
}

/* ── người nhận theo trường «Người nhận thông báo» của lịch hẹn và của từng popup thao tác ──
 * Giá trị trường: { VISIT_TEAM: [mã cán bộ], RELATIVE: [họ tên thân nhân], FACILITY_HEAD: [mã cán bộ], EXTRA: [mã cán bộ] }.
 * Lịch hẹn lưu phần chọn ở trường notifyRecipients = { VISIT_TEAM, EXTRA } (mục chọn thông báo ở màn Tạo/Sửa). */
const uniq = (a) => [...new Set(a.filter(Boolean))];
/* thân nhân thuộc lịch hẹn: thân nhân đăng ký + thân nhân đi cùng */
export const relativesOf = (record) => uniq([(record || {}).visitorName].concat(((record || {}).companions || []).map((c) => c.name)));
const isExemptionRecord = (r) => !!r && (r.approvalRoute === 'EXEMPTION' || r.status === 'PENDING_HEAD_APPROVAL');
/* nhóm hiện trong trường của 1 thao tác */
export const groupsFor = (code) => groupsOf(code);
/* thông báo chờ duyệt theo luồng — đơn ngoại lệ ⇒ Duyệt lịch hẹn ngoại lệ (Trưởng cơ sở), còn lại ⇒ Duyệt lịch hẹn (Cán bộ tổ thăm gặp) */
/* Phê duyệt / Từ chối theo luồng — đơn xin ngoại lệ (luồng EXEMPTION) ⇒ dòng APPOINTMENT_EXCEPTION_*, còn lại ⇒ dòng thường.
 * Xét theo luồng đăng ký chứ không theo màn: đơn đã duyệt rời màn ngoại lệ nhưng vẫn mang luồng EXEMPTION */
export const approvedCodeOf = (r) => (isExemptionRecord(r) ? NOTIFICATION_CODES.EXCEPTION_APPROVED : NOTIFICATION_CODES.APPROVED);
export const rejectedCodeOf = (r) => (isExemptionRecord(r) ? NOTIFICATION_CODES.EXCEPTION_REJECTED : NOTIFICATION_CODES.REJECTED);
export const pendingCodeOf = (r) => (isExemptionRecord(r) ? NOTIFICATION_CODES.EXCEPTION_PENDING_APPROVAL : NOTIFICATION_CODES.PENDING_APPROVAL);
/* người chọn được của 1 nhóm: [{ id, label }] */
export function candidatesOf(group, records) {
  const list = [].concat(records || []).filter(Boolean);
  const staff = (arr) => arr.map((s) => ({ id: s.key, label: s.name + ' — ' + s.role }));
  if (group === 'RELATIVE') return uniq(list.flatMap(relativesOf)).map((n) => ({ id: n, label: n }));
  if (group === 'VISIT_TEAM') return staff(visitTeamStaff());
  if (group === 'FACILITY_HEAD') return staff(facilityHeads());
  return staff(allStaff());
}
/* Quầy của lịch: theo buồng (buồng trực thuộc quầy); chưa có buồng thì theo quầy ghi trên lịch — cùng cách lib/resourceImpact counterCodeOf */
export function counterOfRecord(r) {
  const c = String((r || {}).tableCode || '').trim(), t = c ? readTables().find((x) => x.code === (LEGACY_TABLE_MAP[c] || c)) : null;
  return t ? t.counterCode : ((r || {}).counterCode || '');
}
/* cán bộ phụ trách HIỆN TẠI của quầy của các lịch — đổi cán bộ ở quầy thì thông báo sau chuyển sang người mới */
export const counterStaffOfRecords = (records) => uniq([].concat(records || []).filter(Boolean).flatMap((r) => counterStaffKeysOf(counterOfRecord(r))));
/* ⑳: người BẮT BUỘC nhận = người quản lý vận hành chính đối tượng — nằm sẵn trong ô, không bỏ được.
 * Cán bộ tổ thăm gặp ⇒ cán bộ phụ trách của QUẦY của lịch (⑳ thay cán bộ chọn trên lịch) · Thân nhân ⇒ thân nhân đăng ký · Trưởng cơ sở ⇒ chỉ ở Duyệt lịch hẹn ngoại lệ */
export function mandatoryOf(code, records, g) {
  const list = [].concat(records || []).filter(Boolean);
  if (g === 'VISIT_TEAM') return counterStaffOfRecords(list);   /* mục Gửi thông báo của lịch (chưa có code) cũng khoá theo quầy */
  if (!code || groupsFor(code).indexOf(g) < 0) return [];
  if (g === 'RELATIVE') return uniq(list.map((r) => r.visitorName));
  if (g === 'FACILITY_HEAD' && code === NOTIFICATION_CODES.EXCEPTION_PENDING_APPROVAL) return facilityHeads().map((s) => s.key);
  return [];
}
/* Mục Gửi thông báo của LỊCH HẸN (màn Tạo/Sửa, Đăng ký tại quầy) theo luồng đăng ký: đơn xin ngoại lệ có thêm Trưởng cơ sở BẮT BUỘC
 * (người duyệt đơn); code dùng để khoá Trưởng cơ sở và ẩn mục khi thông báo duyệt đang Tắt */
export function recordNotifyField(route, value) {
  const ex = route === 'EXEMPTION';
  return {
    code: ex ? NOTIFICATION_CODES.EXCEPTION_PENDING_APPROVAL : undefined,
    groups: ex ? ['VISIT_TEAM', 'FACILITY_HEAD', 'EXTRA'] : ['VISIT_TEAM', 'EXTRA'],
    records: ex ? [{ approvalRoute: 'EXEMPTION', status: 'PENDING_HEAD_APPROVAL' }] : [],
    value: ex ? { ...(value || {}), FACILITY_HEAD: facilityHeads().map((s) => s.key) } : (value || {}),
  };
}
/* giá trị mặc định: luồng nghiệp vụ tự chọn người chuẩn */
export function defaultRecipients(code, records) {
  const list = [].concat(records || []).filter(Boolean), pickedOf = (k) => uniq(list.flatMap((r) => ((r.notifyRecipients || {})[k] || [])));
  const out = {};
  groupsFor(code, list).forEach((g) => {
    /* ⑳: cán bộ phụ trách quầy + người thêm tay lưu trên lịch; lịch không xác định được quầy thì mặc định theo người đăng nhập (⑪) */
    if (g === 'VISIT_TEAM') { const p = uniq(counterStaffOfRecords(list).concat(pickedOf('VISIT_TEAM'))); out[g] = p.length ? p : defaultVisitTeamKeys(); }
    else if (g === 'RELATIVE') out[g] = uniq(list.flatMap(relativesOf));
    else if (g === 'FACILITY_HEAD') out[g] = facilityHeads().map((s) => s.key);
    else out[g] = pickedOf('EXTRA');
  });
  /* nhóm đã bỏ tick ở mục Gửi thông báo của lịch ⇒ popup nạp sẵn ô tick bỏ */
  const off = uniq(list.flatMap((r) => ((r.notifyRecipients || {}).off || []))).filter((g) => g in out && !mandatoryOf(code, list, g).length);
  if (off.length) out.off = off;
  return out;
}
const nameOf = (g, id) => (g === 'RELATIVE' ? id : staffName(id));
/* nhóm bắt buộc — luôn tick (không bỏ tick được) và phải có ít nhất 1 người */
export const REQUIRED_GROUPS = ['VISIT_TEAM', 'RELATIVE'];
/* ô tick trước mỗi nhóm — bỏ tick ⇒ nhóm nằm trong value.off, không gửi. Nhóm bắt buộc không bao giờ bị coi là bỏ tick (kể cả dữ liệu cũ còn off) */
export const isGroupOff = (value, g) => !!value && REQUIRED_GROUPS.indexOf(g) < 0 && (value.off || []).indexOf(g) >= 0;
/* nhóm bắt buộc đang thiếu người của 1 thao tác (thông báo đang Tắt ⇒ không chặn) — nơi gọi chặn lưu khi mảng khác rỗng */
export function notifyMissing(code, records, value) {
  if (code && !isNotificationEnabled(code)) return [];
  return groupsFor(code, records).filter((g) => (REQUIRED_GROUPS.indexOf(g) >= 0 || mandatoryOf(code, records, g).length) && !isGroupOff(value, g) && !((value || {})[g] || []).length && !mandatoryOf(code, records, g).length);
}
/* giá trị gửi thật: nhóm đang tick luôn có người bắt buộc (kể cả giá trị cũ thiếu họ) — ⑮ ⑲ ⑳ */
function withMandatory(code, records, value) {
  const v = { ...(value || {}) };
  RECIPIENT_GROUPS.forEach((g) => { if (isGroupOff(v, g)) return; const m = mandatoryOf(code, records, g); if (m.length) v[g] = uniq(m.concat(v[g] || [])); });
  return v;
}
/* Lịch sử thao tác tách người ĐÃ GỬI thật và người CHƯA GỬI ĐƯỢC kèm lý do.
 * Cán bộ: có tài khoản đăng nhập ⇒ nhận trên chuông · Thân nhân: luồng đơn ngoại lệ là thân nhân chưa có tài khoản ứng dụng ⇒ chưa gửi được */
export function deliverySummary(record, value) {
  const sent = [], unsent = [];
  RECIPIENT_GROUPS.filter((g) => value && value[g] && value[g].length && !isGroupOff(value, g)).forEach((g) => {
    const ok = [], no = [];
    value[g].forEach((id) => {
      if (g === 'RELATIVE') (isExemptionRecord(record) ? no : ok).push(id);
      else ((staffByKey(id) || {}).accountKey ? ok : no).push(staffName(id));
    });
    if (ok.length) sent.push(RECIPIENTS[g] + ': ' + ok.join(', '));
    if (no.length) unsent.push(RECIPIENTS[g] + ': ' + no.join(', ') + (g === 'RELATIVE' ? ' (chưa có tài khoản ứng dụng)' : ' (chưa có tài khoản đăng nhập)'));
  });
  return [sent.length ? 'Đã gửi thông báo cho ' + sent.join(' · ') : '', unsent.length ? 'Chưa gửi được thông báo cho ' + unsent.join(' · ') : ''].filter(Boolean).join(' · ');
}
/* «Thân nhân: A, B · Cán bộ tổ thăm gặp: C» */
export function recipientsSummary(value) {
  return RECIPIENT_GROUPS.filter((g) => value && value[g] && value[g].length && !isGroupOff(value, g)).map((g) => RECIPIENTS[g] + ': ' + value[g].map((id) => nameOf(g, id)).join(', ')).join(' · ');
}
/* Gửi thông báo của 1 thao tác cho 1 lịch hẹn. Thông báo đang Tắt ⇒ không gửi, trả ''. Trả chuỗi «Đã gửi thông báo cho …» để nối vào Lịch sử thao tác.
 * Cán bộ có tài khoản Prototype nhận trên chuông, KỂ CẢ chính người thao tác nếu có tên trong ô (ô hiện ai thì người đó nhận);
 * thân nhân nhận trên ứng dụng di động nên chỉ ghi Lịch sử. */
export function sendActionNotification(code, record, value, { reason = '', lines = [], actor, skipStaff = false } = {}) {
  if (!isNotificationEnabled(code) || !record) return '';
  const v = withMandatory(code, [record], value || defaultRecipients(code, [record])), me = currentAccount(), sent = new Set();
  /* skipStaff: thao tác hàng loạt — cán bộ nhận 1 thông báo gộp ở sendBulkStaff, ở đây chỉ dựng chuỗi Lịch sử */
  RECIPIENT_GROUPS.filter((g) => !skipStaff && g !== 'RELATIVE' && v[g] && v[g].length && !isGroupOff(v, g)).forEach((g) => {
    const t = fromSetting(code, RECIPIENTS[g], record, reason);
    v[g].forEach((id) => {
      const acc = (staffByKey(id) || {}).accountKey; if (!acc || sent.has(acc)) return;
      sent.add(acc);
      const all = [(actor || ('Người thực hiện: ' + B(me.name) + ' (' + me.role + ')'))].concat(lines, t.body);
      pushNotification({ eventCode: code, recipientKey: acc, title: t.title, body: all.join(' · '), lines: all, recordCode: record.code, actionUrl: detailPathOf(record) });
    });
  });
  return deliverySummary(record, v);
}

/* Thao tác hàng loạt: 1 trường chung cho nhiều lịch ⇒ mỗi lịch chỉ gửi cho thân nhân của chính lịch đó. Trả chuỗi «Đã gửi …» của lịch đó */
export function sendForRecord(code, record, value, opts) {
  const own = relativesOf(record), v = { ...(value || {}) };
  if (v.RELATIVE) v.RELATIVE = v.RELATIVE.filter((n) => own.indexOf(n) >= 0);
  return sendActionNotification(code, record, v, opts);
}

/* mã thông báo đơn ⇒ dòng «hàng loạt» tương ứng ở màn Cài đặt thông báo (đơn thường và đơn ngoại lệ chung 1 dòng) */
const BULK_OF = {
  [NOTIFICATION_CODES.APPROVED]: NOTIFICATION_CODES.BULK_APPROVED, [NOTIFICATION_CODES.EXCEPTION_APPROVED]: NOTIFICATION_CODES.BULK_APPROVED,
  [NOTIFICATION_CODES.REJECTED]: NOTIFICATION_CODES.BULK_REJECTED, [NOTIFICATION_CODES.EXCEPTION_REJECTED]: NOTIFICATION_CODES.BULK_REJECTED,
  [NOTIFICATION_CODES.CANCELLED]: NOTIFICATION_CODES.BULK_CANCELLED, [NOTIFICATION_CODES.CANCELLED_WITH_PROPOSAL]: NOTIFICATION_CODES.BULK_CANCELLED,
};
export const bulkCodeOf = (code) => BULK_OF[code] || code;
/* thao tác hàng loạt ⇒ mỗi cán bộ trong ô nhận ĐÚNG 1 thông báo gộp: tiêu đề và nội dung theo dòng «hàng loạt» ở màn Cài đặt thông báo,
 * actionUrl mở Danh sách lọc đúng các lịch đó (?codes=). records: lịch SAU thao tác (đã đổi trạng thái). Thân nhân vẫn nhận riêng theo lịch (sendForRecord). */
export function sendBulkStaff(baseCode, records, value, { reason = '', lines = [], actor } = {}) {
  const list = [].concat(records || []).filter(Boolean), code = bulkCodeOf(baseCode);
  if (!isNotificationEnabled(code) || !list.length) return 0;   /* dòng hàng loạt đang Tắt ⇒ cán bộ không nhận */
  const v = withMandatory(baseCode, list, value), me = currentAccount(), sent = new Set();
  const codes = list.map((r) => r.code);
  /* tối đa 3 lịch dễ đọc «Thân nhân thăm Người cai nghiện lúc giờ ngày», còn lại «và n lịch hẹn khác» — mã lịch xem ở danh sách mở từ nút */
  const hhmm = (r) => String(r.visitTime || '').slice(0, 5) + (r.visitDate ? ' ' + String(toDisplayDate(r.visitDate)).slice(0, 5) : '');
  const shown = list.slice(0, 3).map((r) => B(r.visitorName || r.code) + (r.studentName ? ' thăm ' + B(r.studentName) : '') + (hhmm(r).trim() ? ' lúc ' + B(hhmm(r).trim()) : ''));
  const appointmentList = shown.join(' · ') + (list.length > 3 ? ' và ' + B(list.length - 3) + ' lịch hẹn khác' : '');
  const vars = { appointment_count: B(codes.length), appointment_list: appointmentList, reason: reason ? B(reason) : '', facility_name: B(FACILITY_NAME) };
  RECIPIENT_GROUPS.filter((g) => g !== 'RELATIVE' && v[g] && v[g].length && !isGroupOff(v, g)).forEach((g) => v[g].forEach((id) => {
    const acc = (staffByKey(id) || {}).accountKey; if (!acc || sent.has(acc)) return;
    sent.add(acc);
    const ct = contentFor(code, RECIPIENTS[g]) || { title: '', body: '' };
    const all = [(actor || ('Người thực hiện: ' + B(me.name) + ' (' + me.role + ')'))].concat(lines, fillTemplate(ct.body, vars));
    pushNotification({ eventCode: code, recipientKey: acc, title: fillTemplate(ct.title, vars), body: all.join(' · '), lines: all, recordCode: codes[0], bulkCodes: codes,
      actionUrl: listPathOf(list[0]) + '?codes=' + encodeURIComponent(codes.join(',')) });
  }));
  return sent.size;
}

/* hệ thống tự hủy lịch Từ chối duyệt ⇒ người nhận đích danh: cán bộ tổ thăm gặp của lịch + thân nhân thuộc lịch */
export function notifyAutoCancel(record) {
  return sendActionNotification(NOTIFICATION_CODES.AUTO_CANCELLED, { ...record, status: 'CANCELLED' }, defaultRecipients(NOTIFICATION_CODES.AUTO_CANCELLED, [record]),
    { reason: 'Lịch hẹn Từ chối duyệt chưa được gửi duyệt lại', actor: 'Người thực hiện: ' + B('Hệ thống') + ' (Tự động)' });
}

/* Thông báo mẫu cho dữ liệu khởi tạo (lịch Chờ duyệt có sẵn) — nội dung nhóm Cán bộ tổ thăm gặp, đơn ngoại lệ dùng nội dung Trưởng cơ sở */
export function pendingApprovalNotification(record, { senderName, senderRole, reason } = {}) {
  const head = isExemptionRecord(record), code = pendingCodeOf(record);
  const t = fromSetting(code, head ? RECIPIENTS.FACILITY_HEAD : RECIPIENTS.VISIT_TEAM, record, reason);
  const lines = [
    senderName ? 'Người gửi: ' + B(senderName) + (senderRole ? ' (' + senderRole + ')' : '') : 'Nguồn đặt lịch: ' + B(sourceLabel(record.source)),
    t.body,
  ];
  if (reason) lines.push('Lý do cần duyệt: ' + B(reason));
  return {
    eventCode: code, recipientKey: approverKeyOf(record),
    title: t.title, body: lines.join(' · '), lines, recordCode: record.code, actionUrl: detailPathOf(record),
  };
}

function seed() {
  const now = Date.now();
  return seedAppointments().filter((a) => a.status === 'PENDING_APPROVAL' || a.status === 'PENDING_HEAD_APPROVAL').map((a, i) => ({
    id: 'TB-SEED-' + a.code, isRead: i >= 2, createdAt: new Date(now - (i * 95 + 12) * 60000).toISOString(),
    ...pendingApprovalNotification(a, a.source === 'APP' ? { reason: 'Thân nhân tự đặt lịch trên ứng dụng' } : { reason: 'Đơn xin Trưởng cơ sở duyệt cho thân nhân chưa có sổ hoặc tài khoản thăm gặp' }),
  }));
}

function readAll() {
  try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return JSON.parse(raw); } catch (e) { /* dữ liệu hỏng hoặc trình duyệt chặn ⇒ sinh lại mẫu */ }
  const list = seed(); writeAll(list); return list;
}
function writeAll(list) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (e) { return false; }
  try { window.dispatchEvent(new Event(CHANGE_EVENT)); } catch (e) { /* bỏ qua */ }
  return true;
}

/* thông báo của 1 tài khoản, mới nhất trước */
export const notificationsFor = (accountKey) => readAll().filter((n) => n.recipientKey === accountKey).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
export const unreadCountFor = (accountKey) => notificationsFor(accountKey).filter((n) => !n.isRead).length;

/* thông báo đang Tắt ở màn Cài đặt thông báo ⇒ không gửi, trả false */
export function pushNotification(n) {
  if (n && n.eventCode && !isNotificationEnabled(n.eventCode)) return false;
  const list = readAll();
  list.push({ id: 'TB-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), isRead: false, createdAt: new Date().toISOString(), ...n });
  return writeAll(list);
}
export function markRead(id) { const list = readAll(); const n = list.find((x) => x.id === id); if (n && !n.isRead) { n.isRead = true; writeAll(list); } }
export function markAllRead(accountKey) { const list = readAll(); list.forEach((n) => { if (n.recipientKey === accountKey) n.isRead = true; }); writeAll(list); }
export function removeNotifications(ids) { const set = new Set(ids); writeAll(readAll().filter((n) => !set.has(n.id))); }

/* nghe thay đổi (cùng tab qua sự kiện riêng, tab khác qua storage) */
export function onNotificationsChange(fn) {
  const h = (e) => { if (!e.key || e.key === STORAGE_KEY) fn(); };
  window.addEventListener(CHANGE_EVENT, fn); window.addEventListener('storage', h);
  return () => { window.removeEventListener(CHANGE_EVENT, fn); window.removeEventListener('storage', h); };
}

/* bỏ dấu **…** — dùng cho tìm kiếm */
export const plainText = (s) => String(s || '').replace(/\*\*/g, '');

/* «x phút trước» như PM1 (dayjs fromNow tiếng Việt) */
export function timeAgo(iso, now = Date.now()) {
  const s = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (s < 45) return 'vài giây trước';
  const m = Math.round(s / 60); if (m < 45) return m + ' phút trước';
  const h = Math.round(m / 60); if (h < 22) return h + ' giờ trước';
  const d = Math.round(h / 24); if (d < 26) return d + ' ngày trước';
  const mo = Math.round(d / 30); if (mo < 11) return mo + ' tháng trước';
  return Math.round(mo / 12) + ' năm trước';
}
