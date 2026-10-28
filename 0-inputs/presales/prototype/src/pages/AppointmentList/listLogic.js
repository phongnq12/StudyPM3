/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* WEB-06 · Appointment list: pure logic ported from lich-hen/tham-gap-truc-tiep/index.html.
 * Records use the English model; localStorage goes through @/data/appointmentStore only. */
import { logAction, setStatus, readStatusMap, readHistory, hasLogged } from '@/data/historyStore';
import { readAdjusted, readCreated, readEdited, seedAsLegacyRoundTrip, toDisplayDate, toIsoDate, mergeRecord, visitDateText, visitDateTimeText } from '@/data/appointmentStore';
import { createElement } from 'react';
import { normalizeSearchText } from '@/lib/text';
import { dormitoryNameOfStudent, dormitoryRoomText, roomOfStudent } from '@/data/dormitoryStore';
import { shiftsOfDate } from '@/data/visitConfigStore';
import { can, grantedByStatus, SCREEN_DIRECT, SCREEN_EXCEPTION } from '@/data/accountStore';
import { isExceptionRecord } from '@/data/approvalRoute';
import { setAppointmentsSource } from '@/data/visitQuotaStore';

export const MAX_VISITORS = 3;
export const MAX_TEXT_LENGTH = 200;   /* chữ trong ô tối đa 200 ký tự rồi «…» */
export const OVER_LIMIT_WARNING = '{0} thân nhân tham gia, vượt {1} người so với tối đa {2} thân nhân mỗi lượt. '
  + 'Cần giảm số thân nhân hoặc tách thành nhiều lượt trước khi duyệt';

export const BULK_ACTIONS_BY_STATUS = {
  PENDING_APPROVAL: ['approve', 'reject', 'cancel'], PENDING_HEAD_APPROVAL: ['approve', 'reject', 'cancel'], CHECKED_IN: ['cancel'], APPROVED: ['cancel'],
  IN_PROGRESS: [], COMPLETED: [], CANCELLED: [], ABSENT: [], REJECTED: [], DRAFT: [],
};
export const BULK_DISABLED_TABS = ['ALL'];

/* 6 tabs; style + title copied from the HTML page */
export const TABS = [
  { key: 'ALL', label: 'Tất cả', dot: false, style: { '--tone-bgSo': '#FDE8E9', '--tone-fgSo': '#D0202B' }, title: '18 lịch hẹn, tăng 4 so với hôm qua', filter: () => true },
  { key: 'PENDING_APPROVAL', label: 'Chờ duyệt', dot: true, style: { '--cham': '#92400E', '--tone-bgSo': '#FEF3C7', '--tone-fgSo': '#92400E' }, filter: (r) => r.status === 'PENDING_APPROVAL' },
  { key: 'APPROVED', label: 'Đã duyệt', dot: true, style: { '--cham': '#166534', '--tone-bgSo': '#DCFCE7', '--tone-fgSo': '#166534' }, filter: (r) => r.status === 'APPROVED' },   /* thay tab Chờ check-in */
  { key: 'IN_PROGRESS', label: 'Đang diễn ra', dot: true, style: { '--cham': '#15803D', '--tone-bgSo': '#DCFCE7', '--tone-fgSo': '#15803D' }, title: '1 ca đang diễn ra tại TC01-02', filter: (r) => r.status === 'IN_PROGRESS' },
  { key: 'COMPLETED', label: 'Đã kết thúc', dot: true, style: { '--cham': '#475569', '--tone-bgSo': '#F3F4F6', '--tone-fgSo': '#475569' }, title: '7 ca đã kết thúc', filter: (r) => r.status === 'COMPLETED' },
  { key: 'ABSENT', label: 'Vắng mặt', dot: true, style: { '--cham': '#9A3412', '--tone-bgSo': '#FFEDD5', '--tone-fgSo': '#9A3412' }, title: '2 lịch hẹn thân nhân không đến', filter: (r) => r.status === 'ABSENT' },
];
/* Màn Lịch hẹn gặp trực tiếp ngoại lệ: chỉ đơn ngoại lệ chưa được Trưởng cơ sở duyệt (approvalRoute.isExceptionRecord) */
export const EXCEPTION_TABS = [
  { key: 'ALL', label: 'Tất cả', dot: false, style: { '--tone-bgSo': '#FDE8E9', '--tone-fgSo': '#D0202B' }, filter: () => true },
  { key: 'PENDING_HEAD_APPROVAL', label: 'Chờ Trưởng cơ sở duyệt', dot: true, style: { '--cham': '#92400E', '--tone-bgSo': '#FEF3C7', '--tone-fgSo': '#92400E' }, filter: (r) => r.status === 'PENDING_HEAD_APPROVAL' },
  { key: 'REJECTED', label: 'Từ chối duyệt', dot: true, style: { '--cham': '#475569', '--tone-bgSo': '#F3F4F6', '--tone-fgSo': '#475569' }, filter: (r) => r.status === 'REJECTED' },
  { key: 'CANCELLED', label: 'Đã hủy', dot: true, style: { '--cham': '#B91C1C', '--tone-bgSo': '#FEF2F2', '--tone-fgSo': '#B91C1C' }, filter: (r) => r.status === 'CANCELLED' },
];
export const tabFilter = (key) => (TABS.concat(EXCEPTION_TABS).find((t) => t.key === key) || {}).filter;

/* Status code => CSS class suffix of the status tag */
export const STATUS_CLASS = {
  PENDING_APPROVAL: 'pending-approval', PENDING_HEAD_APPROVAL: 'pending-approval', APPROVED: 'approved', CHECKED_IN: 'checked-in', IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed', CANCELLED: 'cancelled', ABSENT: 'absent', REJECTED: 'rejected', DRAFT: 'draft',
};
export const RELATIONSHIP_TAG_CLASS = {
  'Vợ': 'tag-relationship-spouse', 'Chồng': 'tag-relationship-spouse', 'Mẹ': 'tag-relationship-mother', 'Bố': 'tag-relationship-father', 'Cha': 'tag-relationship-father',
  'Anh': 'tag-relationship-sibling', 'Chị': 'tag-relationship-sibling', 'Em': 'tag-relationship-sibling', 'Con': 'tag-relationship-child',   /* tên theo danh mục PM5 QUAN_HE_THAN_NHAN */
};
export const VISIT_TYPE_TAG_CLASS = { 'Thăm gặp trực tiếp tiêu chuẩn': 'tag-visit-standard' };

/* Row actions by status; "absent:late" = only when the appointment is late */
export const ROW_ACTIONS_BY_STATUS = {
  /* Chờ duyệt KHÔNG cho Chỉnh sửa, Bị từ chối mới được Chỉnh sửa; lưu xong quay về Chờ duyệt */
  PENDING_APPROVAL: ['view', 'approve', 'reject', 'adjust', 'cancel'], PENDING_HEAD_APPROVAL: ['view', 'approve', 'reject', 'adjust', 'cancel'], APPROVED: ['view', 'adjust', 'cancel', 'absent:late'],
  /* Hoàn thành check-in được Điều chỉnh (đẩy sớm giờ) · Nháp có Xem, Chỉnh sửa, Xóa */
  CHECKED_IN: ['view', 'adjust', 'cancel'],
  IN_PROGRESS: ['view'], COMPLETED: ['view'], CANCELLED: ['view'], ABSENT: ['view'], REJECTED: ['view', 'edit', 'delete'],
  DRAFT: ['view', 'edit', 'delete'],
};
export const ROW_ACTIONS = {
  view: { label: 'Xem chi tiết' }, edit: { label: 'Chỉnh sửa' }, approve: { label: 'Phê duyệt' }, reject: { label: 'Từ chối duyệt' },
  adjust: { label: 'Điều chỉnh thời gian và buồng thăm gặp' }, cancel: { label: 'Hủy lịch hẹn', danger: true }, absent: { label: 'Đánh dấu vắng mặt' },
  delete: { label: 'Xóa lịch hẹn', danger: true },
};
/* action => icon color class suffix (m-*) */
export const ACTION_COLOR = { view: 'view', edit: 'edit', approve: 'approve', reject: 'danger', cancel: 'danger', adjust: 'neutral', absent: 'warn', delete: 'danger' };
export const ACTION_ICON = { view: 'view', edit: 'edit', approve: 'approve', reject: 'reject', absent: 'absent' };
/* Phê duyệt / Từ chối duyệt: chỉ người duyệt CỦA LỊCH ĐÓ thấy nút — nay xét trong can của accountStore */
export const APPROVER_ONLY_ACTIONS = ['approve', 'reject'];
/* màn của lịch (đơn ngoại lệ chưa duyệt ⇒ màn ngoại lệ) — quyết định bảng quyền áp cho lịch đó */
export const screenOf = (r) => (isExceptionRecord(r) ? SCREEN_EXCEPTION : SCREEN_DIRECT);
/* thao tác theo trạng thái + thao tác vai trò được cấp riêng theo trạng thái, lọc qua can — Danh sách và Chi tiết dùng chung */
export function permittedActions(r) {
  const screen = screenOf(r), base = ROW_ACTIONS_BY_STATUS[r.status] || [];
  const extra = grantedByStatus(screen, r).filter((a) => !base.some((e) => e.split(':')[0] === a));
  return base.concat(extra).filter((entry) => can(screen, entry.split(':')[0], r));
}
/* Số nút tối đa vai đang đăng nhập thấy trên 1 dòng của màn (thử mọi trạng thái thuộc màn qua đúng permittedActions) — để cột Thao tác rộng vừa đủ */
export function maxActionCount(isException) {
  const route = isException ? 'EXEMPTION' : 'LINKED';
  const counts = Object.keys(ROW_ACTIONS_BY_STATUS).map((status) => ({ status, approvalRoute: route }))
    .filter((r) => (screenOf(r) === SCREEN_EXCEPTION) === !!isException).map((r) => permittedActions(r).length);
  return Math.max(1, ...counts);
}
export function rowActions(r) {
  return permittedActions(r).map((entry) => {
    const [action, condition] = entry.split(':');
    if (!ROW_ACTIONS[action]) return null;
    if (condition === 'late' && !isLate(r)) return null;
    return action;
  }).filter(Boolean);
}

/* Icons specific to the list screen (differ from the shared set for cancel and adjust) */
export const LIST_ICONS = {
  adjust: '<path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"/><path d="M16 2v4M8 2v4M3 10h18"/><circle cx="16" cy="16" r="6"/><path d="M16 14v2l1.5 1.5"/>',
  cancel: '<path d="M8 2v4M16 2v4M21 14V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"/><path d="M3 10h18M17 17l4 4M21 17l-4 4"/>',
  delete: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"/>',
};

/* ── Luật gửi duyệt dùng chung cho màn Tạo mới, Chỉnh sửa và Đăng ký tại quầy ── */
const toMin = (t) => { const m = /^(\d{1,2}):(\d{2})/.exec(String(t || '')); return m ? +m[1] * 60 + +m[2] : NaN; };
/* Lịch không giữ buồng: Nháp chưa giữ, Đã hủy đã nhả. Từ chối duyệt VẪN GIỮ buồng, giờ, lượt — Hủy mới nhả */
/* statuses that do not hold a table: they never block booking / moving and are not drawn on the Lịch theo buồng tab (Vắng mặt, Đã kết thúc nhả buồng) */
export const HOLDS_NO_RESOURCE = ['DRAFT', 'CANCELLED', 'ABSENT', 'COMPLETED'];
/* Buồng đã bị lịch khác chiếm cùng ngày, cùng buồng, giờ chồng nhau ⇒ trả lịch chiếm, không chiếm thì null */
export function findTableClash(record, excludeCode) {
  if (!record || !record.tableCode || !record.visitDate || !record.visitTime) return null;
  const s = toMin(record.visitTime), e = s + (+record.durationMinutes || 45);
  return buildAppointments().find((x) => x.code !== excludeCode && HOLDS_NO_RESOURCE.indexOf(x.status) < 0
    && x.tableCode === record.tableCode && x.visitDate === record.visitDate
    && toMin(x.visitTime) < e && toMin(x.visitTime) + (+x.durationMinutes || 45) > s) || null;
}
/* Duyệt tự động: thân nhân đã từng GẶP THẬT (Đã kết thúc) với CHÍNH người nghiện này */
export function hasCompletedVisit(visitorName, studentCode, studentName) {
  return buildAppointments().some((x) => x.status === 'COMPLETED' && x.visitorName === visitorName
    && (studentCode ? x.studentCode === studentCode : x.studentName === studentName));
}

export const pad2 = (n) => String(n).padStart(2, '0');
export const formatDate = (d) => pad2(d.getDate()) + '/' + pad2(d.getMonth() + 1) + '/' + d.getFullYear();
export const WEEKDAY_NAMES = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
export function parseDisplayDate(v) { const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(v || '').trim()); return m ? new Date(+m[3], +m[2] - 1, +m[1]).getTime() : null; }
/* cắt quá 200 ký tự thì bọc span data-full ⇒ tooltip chung (legacyUi.installTooltip) hiện đủ nội dung */
export const truncate = (v) => { const t = v == null ? '' : String(v); return t.length > MAX_TEXT_LENGTH ? createElement('span', { 'data-full': t }, t.slice(0, MAX_TEXT_LENGTH) + '…') : t; };
export function addMinutes(time, minutes) { const t = (+time.slice(0, 2)) * 60 + (+time.slice(3, 5)) + (minutes || 0); return pad2(Math.floor(t / 60)) + ':' + pad2(t % 60); }

/* Display strings of a record, as the HTML page shows them */
export { visitDateText, visitDateTimeText };
/* «HS-00623 · Dãy A / Phòng A101» thay Đội */
export const studentCodeText = (r) => (r.studentCode ? r.studentCode + ' · ' + dormitoryRoomText(r.studentCode) : r.studentCode);
export const birthDateText = (r) => toDisplayDate(r.studentBirthDate);
export const companionText = (c) => (c.relationship ? c.name + ' · ' + c.relationship : c.name);
/* Team = last part of the "code · team" text */
/* Dãy nhà và Phòng hiển thị 2 cột riêng: gộp 1 cột thì chuỗi dài bị cắt */
export const dormitoryOf = (r) => (r && r.studentCode ? dormitoryNameOfStudent(r.studentCode) : '');
export const roomOf = (r) => (r && r.studentCode ? roomOfStudent(r.studentCode) : '');
export function teamOf(r) { const text = r && studentCodeText(r); if (!text) return ''; const parts = String(text).split('·'); return parts.length > 1 ? parts[parts.length - 1].trim() : ''; }
export const visitDayOf = (r) => parseDisplayDate(visitDateText(r));
export function visitorsText(r) {
  if (!r.visitorName) return '';
  let t = r.visitorName + ' (thân nhân đăng ký)';
  if (r.companions && r.companions.length) t += '\n' + r.companions.map((c, i) => (i + 1) + '. ' + companionText(c)).join('\n');
  else if (r.companionCount) t += '\nvà ' + r.companionCount + ' thân nhân đi cùng';
  return t;
}

function applyAdjusted(list, adjusted) {
  /* bản điều chỉnh rỗng (lưu nháp ở bản cũ) không được đè mất ngày, giờ, buồng */
  list.forEach((x) => { const a = adjusted[x.code]; if (a && a.tableCode) { x.visitDate = a.visitDate; x.visitTime = a.visitTime; x.tableCode = a.tableCode; if (a.counterCode) x.counterCode = a.counterCode; if (a.durationMinutes) x.durationMinutes = a.durationMinutes; } });
}

/* Initial data: shared seed + created records + dates spread over 7 days + edited / adjusted records */
export { visitDayAt } from '@/data/appointmentStore';

/* kho quỹ tuần (visitQuotaStore) đếm lịch đang giữ chỗ / đã dùng lượt từ chính danh sách này — 1 nguồn cho mọi màn */
setAppointmentsSource(() => buildAppointments());

export function buildAppointments() {
  const list = seedAsLegacyRoundTrip();
  try { readCreated().slice().reverse().forEach((r) => { if (!list.some((x) => x.code === r.code)) list.unshift(r); }); } catch (e) { /* broken store: seed only */ }
  try { applyAdjusted(list, readAdjusted()); } catch (e) { /* keep as is */ }
  /* ngày lịch mẫu đã gán sẵn ở seedAsLegacyRoundTrip (ngày thăm gặp thứ n theo WEB-54) */
  try {
    const edited = readEdited({ strict: true }), adjusted = readAdjusted({ strict: true });   /* either store broken => neither applied, as in the HTML page */
    list.forEach((x) => { if (edited[x.code]) { const patch = { ...edited[x.code] }; delete patch.savedAt; Object.assign(x, mergeRecord(x, patch)); } });
    applyAdjusted(list, adjusted);
  } catch (e) { /* keep as is */ }
  /* trạng thái đổi ở Danh sách/Chi tiết lưu ở kho lịch sử; DELETED = đã xóa */
  try { const st = readStatusMap(); list.forEach((x) => { if (st[x.code]) x.status = st[x.code]; }); } catch (e) { /* keep as is */ }
  return list.filter((x) => x.status !== 'DELETED');
}

/* Shared filters; filter = { keyword, dateFrom, dateTo, status, source, table, counter, route } — route: LINKED | EXEMPTION (lịch cũ không lưu luồng tính là LINKED) */
export function applyFilter(list, filter) {
  /* mở từ thông báo gộp (?codes=) ⇒ chỉ các lịch đó, bỏ qua khoảng ngày */
  if (filter.codes && filter.codes.length) return list.filter((r) => filter.codes.indexOf(r.code) >= 0);
  const keyword = normalizeSearchText(filter.keyword);
  if (keyword) list = list.filter((r) => [r.code, r.studentName, teamOf(r), r.studentCitizenId, r.visitorName].some((v) => normalizeSearchText(v).indexOf(keyword) >= 0));
  const from = parseDisplayDate(filter.dateFrom), to = parseDisplayDate(filter.dateTo);
  if (from !== null || to !== null) list = list.filter((r) => { const t = visitDayOf(r); if (t === null) return r.status === 'DRAFT';   /* Nháp lưu khi chưa chọn ngày vẫn phải tìm lại được */ if (from !== null && t < from) return false; if (to !== null && t > to) return false; return true; });
  if (filter.status) list = list.filter((r) => r.status === filter.status);
  if (filter.source) list = list.filter((r) => r.source === filter.source);
  if (filter.table) list = list.filter((r) => r.tableCode === filter.table);
  if (filter.counter) list = list.filter((r) => r.counterCode === filter.counter);
  if (filter.route) list = list.filter((r) => (r.approvalRoute === 'EXEMPTION' ? 'EXEMPTION' : 'LINKED') === filter.route);
  return list;
}
const dateSortKey = (s) => { const m = String(s || '').match(/(\d{2})\/(\d{2})\/(\d{4})/); return m ? Number(m[3] + m[2] + m[1]) : 0; };
export const sortNewestFirst = (list) => list.sort((a, b) => dateSortKey(toDisplayDate(b.createdAt)) - dateSortKey(toDisplayDate(a.createdAt)) || String(b.code || '').localeCompare(String(a.code || '')));
export function rowsForTab(list, tabKey, filter) { const f = tabFilter(tabKey); return sortNewestFirst(applyFilter(f ? list.filter(f) : list.slice(), filter)); }

/* Table × time-slot grid, shared by the grid view and the Adjust popup */
export const GRID_TIMES = ['07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '13:30', '14:00', '14:30', '15:00'];
export const GRID_TABLES = ['TC01-01', 'TC01-02', 'TC01-03', 'TC01-04', 'TC02-01', 'TC02-02'];
export const STATUSES_RELEASING_ROOM = ['DRAFT', 'CANCELLED', 'ABSENT', 'COMPLETED'];   /* Từ chối duyệt giữ buồng tới khi Hủy · chỉ Nháp không giữ buồng */
export const isBlockedCell = (time, table) => time === '11:00' || (time === '09:30' && table === 'TC01-01');
export function slotOf(time) { let slot = GRID_TIMES[0]; GRID_TIMES.forEach((t) => { if (t <= time) slot = t; }); return slot; }
export const holdsRoom = (x) => STATUSES_RELEASING_ROOM.indexOf(x.status) < 0;
export const appointmentsInCell = (list, dateText, time, table) => list.filter((x) => holdsRoom(x) && visitDateText(x) === dateText && slotOf(x.visitTime || '') === time && (x.tableCode || '') === table);
/* Kéo dời trên Lịch theo buồng = quyền "Điều chỉnh" của danh sách (BRD-WEB-06 1.4): Chờ duyệt, Đã duyệt (đã bỏ Chờ check-in theo),
 * thêm Hoàn thành check-in chỉ dời trong cùng ngày — lịch theo buồng chỉ dời trong ngày đang xem nên luôn đúng điều kiện này */
export const isDraggable = (r) => (ROW_ACTIONS_BY_STATUS[r.status] || []).indexOf('adjust') >= 0 && can(screenOf(r), 'adjust', r);   /* kéo thả = quyền Điều chỉnh */
export function gridTooltip(r) {
  const start = r.visitTime || '', end = start ? addMinutes(start, r.durationMinutes ? +r.durationMinutes : 45) : '';
  const companions = (r.companions || []).map((c) => c.name).join(', ');
  return 'Mã lịch hẹn: ' + r.code + '\nThời gian: ' + start + ' ~ ' + end + ' ' + visitDateText(r)
    + '\nNgười cai nghiện: ' + r.studentName + ' - Ngày sinh: ' + (birthDateText(r) || '—')
    + '\nThân nhân đăng ký: ' + (r.visitorName || '—') + ' - Quan hệ: ' + (r.relationship || '—') + '\nThân nhân đi cùng: ' + (companions || '—');
}
/* bỏ trạng thái Chờ check-in — Đã duyệt đến quầy check-in thì vào thẳng Hoàn thành check-in.
 * Số phút từ bây giờ tới giờ hẹn; dateTimeText dạng dd/mm/yyyy HH:mm; âm là đã quá giờ hẹn. */
export function minutesUntil(dateTimeText) {
  const m = String(dateTimeText || '').match(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/); if (!m) return NaN;
  return (new Date(+m[3], +m[2] - 1, +m[1], +m[4], +m[5]) - new Date()) / 60000;
}
/* Đánh dấu vắng mặt hiện ở Đã duyệt khi đã quá giờ hẹn */
export function isLate(r) { return minutesUntil(visitDateTimeText(r)) < 0; }   /* chỉ theo giờ hẹn thật — cờ rowState của lịch mẫu cố định, ngày lịch mẫu tự dời */
