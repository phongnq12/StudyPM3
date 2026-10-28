/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
import { RELATIVES } from '@/data/legacyData';
import { logAction, setStatus, readStatusMap, readHistory, hasLogged, createdMsOf } from '@/data/historyStore';
/* Load one appointment by the route id /:id from the shared seed and the created / edited / adjusted stores */
import { mergeRecord, readAdjusted, readCreated, readEdited, seedAsLegacyRoundTrip, sourceLabel, toDisplayDate, visitDateTimeText } from '@/data/appointmentStore';
import { weekLabel, weekStartOf } from '@/lib/visitWeek';
import { QUOTA_HOLDING_STATUSES, QUOTA_USED_STATUSES } from './quota';
import { buildAppointments, minutesUntil } from '@/pages/AppointmentList/listLogic';
import { weekQuota } from '@/data/visitQuotaStore';
import { NOTIFICATION_CODES, offsetMinutesOf, settingOf, timeConditionText } from '@/data/notificationSettingsStore';
import { relativesOf } from '@/data/notificationStore';   /* người nhận đích danh của thông báo nhắc lịch */
import { counterLabel, studentResource } from '@/lib/tableTimeline';
import { findCounter } from '@/data/receptionDeskStore';
import { counterCodeOf } from '@/lib/resourceImpact';
import { APPOINTMENT_DETAIL_SAMPLE, APPOINTMENT_HISTORY_SAMPLE } from './appointmentDetailSample';
import { exemptionInfoOf, roundsOf } from '@/data/exemptionResend';

const WEEKDAY_NAMES = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
const DAY_MS = 86400000;
const pad2 = (n) => String(n).padStart(2, '0');
const isoOf = (d) => d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());

function seedWithShiftedDates() {
  return seedAsLegacyRoundTrip();   /* ngày đã gán theo ngày thăm gặp WEB-54 — cùng nguồn với Danh sách */
}

/* Cán bộ quản lý trực tiếp người cai nghiện: theo hồ sơ người cai nghiện; hồ sơ chưa có thì lấy cán bộ phụ trách cùng tổ */
function managerOf(studentCode, teamName) {
  const students = RELATIVES.flatMap((r) => r.students || []);
  const own = students.find((s) => s.studentCode && s.studentCode === studentCode && s.managerName);
  if (own) return own.managerName;
  const sameTeam = students.find((s) => teamName && s.teamName === teamName && s.managerName);
  return sameTeam ? sameTeam.managerName : '';
}

/* tách tính quỹ lượt ra hàm riêng, không ghi kho — Chi tiết gọi lại sau mỗi lần đổi trạng thái */
export function quotaOf(detail) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(detail.visitDateTime || '');
  const visit = m ? new Date(+m[3], +m[2] - 1, +m[1]) : new Date();
  const start = weekStartOf(visit), end = new Date(start); end.setDate(end.getDate() + 6);
  const quota = { ...detail.quota, periodLabel: 'Tuần ' + weekLabel(start), ...weekQuota(detail.student.studentCode, visit, buildAppointments()) };
  /* lịch hẹn có trước quyết định kỷ luật trong cùng tuần ⇒ kỷ luật áp dụng từ Thứ Hai tuần sau */
  const created = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(detail.createdAt || '');
  if ((QUOTA_HOLDING_STATUSES.includes(detail.status) || QUOTA_USED_STATUSES.includes(detail.status)) && created) {
    const createdDate = new Date(+created[3], +created[2] - 1, +created[1]), next = new Date(end); next.setDate(next.getDate() + 1);
    quota.disciplines = quota.disciplines.map((x) => { const p = x.decisionDate.split('/'), dd = new Date(+p[2], +p[1] - 1, +p[0]);
      return dd >= start && dd <= end && createdDate <= dd ? { ...x, effectiveFrom: pad2(next.getDate()) + '/' + pad2(next.getMonth() + 1) + '/' + next.getFullYear() } : x; });
  }
  return quota;
}

export function loadDetail(code) {
  const detail = structuredClone(APPOINTMENT_DETAIL_SAMPLE);
  const history = structuredClone(APPOINTMENT_HISTORY_SAMPLE);
  detail.student.managerName = managerOf(detail.student.studentCode, detail.student.teamName);
  if (!code) return { detail, history };
  let record = seedWithShiftedDates().find((x) => x.code === code) || null;
  const created = readCreated().find((x) => x.code === code); if (created) record = created;
  const edited = readEdited()[code]; if (edited && record) { record = mergeRecord(record, edited); delete record.savedAt; }
  const adjusted = readAdjusted()[code] || null;
  const savedStatus = readStatusMap()[code];
  if (savedStatus === 'DELETED' || (!record && !adjusted)) return { detail, history, notFound: true };
  if (record && savedStatus) record.status = savedStatus;   /* mã không có ⇒ báo không còn tồn tại, không hiện lịch mẫu */

  const dayLabel = (dateTime) => { const m = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(dateTime || ''); return m ? WEEKDAY_NAMES[new Date(+m[3], +m[2] - 1, +m[1]).getDay()] + ', ' + m[0] : '—'; };
  const addMinutes = (time, minutes) => { const t = (+time.slice(0, 2)) * 60 + (+time.slice(3, 5)) + minutes; return pad2(Math.floor(t / 60)) + ':' + pad2(t % 60); };
  const setVisit = (dateTime, duration) => { const time = String(dateTime).slice(11, 16); detail.visitDateTime = dateTime; detail.visitDayLabel = dayLabel(dateTime); if (time) detail.timeSlotLabel = time + ' — ' + addMinutes(time, duration); };

  /* Lịch mẫu LH-2026-0914 nay là 1 lịch thật trong data mẫu ⇒ luôn hiện theo bản ghi, không giữ khung mẫu cũ (ngày 24/09, buồng B-03) */
  const keepSample = false;
  const duration = record && record.durationMinutes ? +record.durationMinutes : 45;
  if (record && !keepSample) {
    detail.code = record.code;
    detail.visitTypeName = record.visitTypeName || detail.visitTypeName;
    setVisit(visitDateTimeText(record), duration);
    detail.durationLabel = duration + ' phút';
    detail.tableCode = record.tableCode || 'Chưa xếp';
    /* Dãy nhà của người cai nghiện · quầy theo buồng (buồng trực thuộc quầy), không có buồng thì quầy ghi trên lịch */
    detail.dormitoryName = record.studentCode ? studentResource(record.studentCode).dormitoryName : 'Chưa chọn';
    const counter = findCounter(counterCodeOf(record));
    detail.counterName = counter ? counterLabel(counter) : 'Chưa chọn';
    if (record.status) detail.status = record.status;
    detail.sourceLabel = (record.source && sourceLabel(record.source)) || detail.sourceLabel;
    detail.source = record.source || detail.source;   /* người duyệt tuỳ nguồn đặt lịch */
    detail.approvalRoute = record.approvalRoute || ''; detail.exemptionReason = record.exemptionReason || '';
    detail.resubmitted = !!record.resubmitted;   /* lịch bị từ chối gửi lại ⇒ Trưởng cơ sở duyệt (approverKeyOf đọc cờ này) */
    detail.createdAt = (record.createdAt && toDisplayDate(record.createdAt)) || detail.createdAt;
    detail.student = { ...detail.student, fullName: record.studentName || detail.student.fullName, studentCode: record.studentCode || detail.student.studentCode,
      teamName: record.teamName || detail.student.teamName, citizenId: record.studentCitizenId || detail.student.citizenId,
      birthDate: (record.studentBirthDate && toDisplayDate(record.studentBirthDate)) || detail.student.birthDate };
    /* Thẻ thân nhân lấy căn cước, ngày sinh từ hồ sơ thân nhân (bản cũ để cứng «—»). Kết quả đối chiếu giấy tờ KHÔNG ở thẻ này
 * mà ở khối riêng «Đối chiếu giấy tờ khi check-in» — trạng thái hồ sơ và đối chiếu khác bản chất, để chung dễ hiểu nhầm. */
    const allPeople = RELATIVES.flatMap((x) => [x].concat((x.students || []).flatMap((s) => s.linkedRelatives || [])));
    const findPerson = (name, idNumber) => allPeople.find((x) => (idNumber && x.citizenId === idNumber)) || allPeople.find((x) => x.fullName === name) || null;
    const person = (name, relationship, idNumber, isRegistrant) => { const x = findPerson(name, idNumber);
      return { fullName: name || '—', relationship: relationship || '—', citizenId: (x && x.citizenId) || idNumber || '—', birthDate: x && x.birthDate ? toDisplayDate(x.birthDate) : '—', isRegistrant }; };
    detail.visitors = [person(record.visitorName, record.relationship, record.visitorCitizenId, true)]
      .concat((record.companions || []).map((c) => person(c.name, c.relationship, c.citizenId, false)));
    detail.relativeNote = record.relativeNote || '';
    detail.documentChecks = record.documentChecks || [];   /* đối chiếu giấy tờ đã làm lúc đăng ký tại quầy */
    /* đơn ngoại lệ: thông tin đơn theo thứ tự màn Tạo */
    detail.exemption = record.approvalRoute === 'EXEMPTION' ? exemptionInfoOf(record) : null;
    detail.rounds = roundsOf(record);   /* lộ trình duyệt: Lần 1, Lần 2, … */
    detail.staffNote = record.staffNote || '';
    history.length = 0;
  }
  detail.student.managerName = managerOf(detail.student.studentCode, detail.student.teamName);
  if (adjusted && adjusted.tableCode) {   /* bản điều chỉnh rỗng (lưu nháp ở bản cũ) không được đè mất buồng */
    const oldVisit = detail.visitDateTime, oldTable = detail.tableCode;
    const newVisit = visitDateTimeText(adjusted);
    setVisit(newVisit, duration);
    detail.tableCode = adjusted.tableCode;
    /* lịch sử điều chỉnh nay ghi ở kho dùng chung mỗi lần; dòng dựng lại dưới đây chỉ cho bản điều chỉnh cũ chưa có trong kho */
    if (!hasLogged(code, 'Điều chỉnh') && !hasLogged(code, 'Chỉnh sửa và gửi duyệt') && !hasLogged(code, 'Chỉnh sửa và gửi duyệt lại')) {
        const at = new Date(adjusted.savedAt || Date.now());
    history.push({ at: pad2(at.getDate()) + '/' + pad2(at.getMonth() + 1) + '/' + at.getFullYear() + ' ' + pad2(at.getHours()) + ':' + pad2(at.getMinutes()) + ':' + pad2(at.getSeconds()),
      actorName: 'Nguyễn Thùy Trang', actorRole: 'Cán bộ Tổ tham mưu', action: 'Điều chỉnh', statusBefore: detail.status, statusAfter: detail.status,
      changes: [['Ngày giờ thăm gặp', oldVisit, newVisit], ['Buồng thăm gặp', oldTable, adjusted.tableCode]], reason: adjusted.reason || '' });
    }
  }
  /* quỹ lượt của TUẦN NGÀY HẸN (sau khi đã áp bản điều chỉnh), đọc chung 1 nguồn visitQuotaStore với màn Tạo mới và Đăng ký tại quầy.
 * Bản cũ dùng bộ quỹ mẫu cố định tuần 21/09 cho riêng HS-00623 nên hiện «Khu cách ly» trong khi màn Tạo mới vẫn cho đặt lịch. */
  if (record) detail.quota = quotaOf(detail);
  /* lịch Hoàn thành check-in — trước giờ hẹn theo mốc cài đặt (mặc định 10 phút) hệ thống gửi thông báo nhắc thân nhân sắp đến lịch */
  const left = minutesUntil(detail.visitDateTime);
  if (savedStatus && keepSample) detail.status = savedStatus;
  /* số phút và Bật/Tắt lấy từ màn Cài đặt thông báo, thay BOOKING_CONFIG.remindBeforeMinutes cố định.
 * 3 thông báo nhắc lịch là thông báo TỰ ĐỘNG NGẦM — người nhận đích danh là thân nhân thuộc lịch hẹn; mỗi loại nhắc ghi 1 dòng Lịch sử thao tác 1 lần.
 * Nhắc trước một ngày và sắp đến giờ: lịch Đã duyệt · nhắc sau check-in: lịch Hoàn thành check-in. Thao tác ghi đúng tên thông báo để mỗi loại chỉ ghi 1 lần */
  [[NOTIFICATION_CODES.REMINDER_DAY_BEFORE, 'APPROVED'], [NOTIFICATION_CODES.REMINDER_BEFORE_ARRIVAL, 'APPROVED'], [NOTIFICATION_CODES.REMINDER_AFTER_CHECKIN, 'CHECKED_IN']].forEach(([eventCode, status]) => {
    const reminder = settingOf(eventCode); if (!reminder) return;
    const remindAt = reminder ? offsetMinutesOf(reminder) * (reminder.sendType === 'AFTER' ? -1 : 1) : 0;   /* phút TRƯỚC giờ hẹn; Sau mốc ⇒ số âm */
    const action = eventCode === NOTIFICATION_CODES.REMINDER_AFTER_CHECKIN ? 'Gửi thông báo cho thân nhân' : 'Gửi thông báo cho thân nhân: ' + reminder.name;   /* giữ tên cũ của nhắc sau check-in để không ghi lặp dòng đã có */
    if (!reminder || !reminder.enabled || detail.status !== status || left > remindAt || hasLogged(code, action)) return;
    const t = new Date(Date.now() + (left - remindAt) * 60000);
    /* tạo đơn là thao tác đầu tiên ⇒ mốc nhắc rơi trước lúc tạo đơn thì không ghi (quy tắc gửi bù hay bỏ qua chốt sau) */
    const createdDay = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(detail.createdAt || '');   /* lịch mẫu không có dòng tạo ⇒ lấy ngày tạo của bản ghi */
    const createdMs = createdMsOf(readHistory(code)) || (createdDay ? +new Date(+createdDay[3], +createdDay[2] - 1, +createdDay[1]) : 0);
    if (createdMs && +t <= createdMs) return;
    logAction(code, action, { actor: { name: 'Hệ thống', role: 'Tự động' }, at: pad2(t.getDate()) + '/' + pad2(t.getMonth() + 1) + '/' + t.getFullYear() + ' ' + pad2(t.getHours()) + ':' + pad2(t.getMinutes()) + ':00',
      note: reminder.name + ': Nhắc thân nhân lịch thăm gặp lúc '   /* thao tác của hệ thống ⇒ Ghi chú hệ thống */ + String(detail.visitDateTime).slice(11, 16) + ' (' + timeConditionText(reminder).toLowerCase() + ') · Đã gửi thông báo cho Thân nhân: ' + (relativesOf(record || {}).join(', ') || '—') });
  });
  history.push(...readHistory(code));   /* mọi dòng ghi từ các màn */
  /* đối chiếu giấy tờ là việc của bước check-in tại quầy — đã check-in (Hoàn thành check-in, Đang diễn ra, Đã kết thúc) thì đối chiếu đạt;
 * thời điểm và cán bộ quầy lấy từ dòng check-in trong Lịch sử thao tác, không có thì để «—» */
  const checkinLog = history.find((h) => /check-in/i.test(h.action || ''));
  detail.checkin = { done: ['CHECKED_IN', 'IN_PROGRESS', 'COMPLETED'].includes(detail.status), at: checkinLog ? checkinLog.at : '—', by: checkinLog ? checkinLog.actorName : '—' };
  return { detail, history };
}
