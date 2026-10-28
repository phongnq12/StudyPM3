/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Form model + behaviour: 1 mutable object, every action mutates it then calls rerender. */
import { ROUTE_EXEMPTION, ROUTE_LINKED, EMPTY_EXEMPTION, missingExemption, relativeFromExemption, isPendingStatus, urlListPath, companionFieldId } from '@/data/approvalRoute';
import { logAction, setStatus, readStatusMap, readHistory, hasLogged } from '@/data/historyStore';
import { RELATIVES, RELATIVE_STATUS, VISIT_TYPE_DURATIONS } from '@/data/legacyData';
import {
  allCountersRoom, bookedFrom, bookingSettings, clockToMinutes, counterFullMessage, counterLabel, counterLabelOf, fitDuration, fitsTimeline, hasAnyFit, noCounterMessage, shiftOf, studentResource,
  timelineConfig, usesReserved,
} from '@/lib/tableTimeline';
import { checkVisitEligibility } from '@/lib/visitEligibility';
import { dormitoryRoomText } from '@/data/dormitoryStore';
import { readCreated, readAdjusted, readEdited, sourceLabel, statusLabel, toDisplayDate, toIsoDate, writeAdjusted, writeCreated, writeEdited } from '@/data/appointmentStore';
import { readRouteId } from '@/routes';
import { currentAccount } from '@/data/accountStore';
import { notifyPendingApproval, roundChanges } from '@/data/exemptionResend';   /* báo người duyệt khi lịch vào Chờ duyệt */
import { sendActionNotification, defaultRecipients, isGroupOff } from '@/data/notificationStore';   /* Lưu và duyệt báo thân nhân */
import { NOTIFICATION_CODES } from '@/data/notificationSettingsStore';
import { defaultVisitTeamKeys } from '@/data/staffDirectoryStore';
import { activeCounters, counterStaffKeys } from '@/data/receptionDeskStore';   /* ô Quầy chọn được, cán bộ phụ trách quầy */
import {
  FIELD_KEY_BY_LABEL, TYPED_FIELD_KEYS, MAX_COMPANIONS, STATUS_CLASS, stepButtonLabels,
} from './formConfig';
import {
  formatDate, initialStatus, loadAppointmentForEdit, messageText, midSentence, nextCode, toHhmm, visitDateLabel,
} from './formLogic';
import { HOLDS_NO_RESOURCE, buildAppointments, findTableClash, hasCompletedVisit } from '@/pages/AppointmentList/listLogic';
import { msg } from '@/lib/msg';   /* message theo mã */
import { tableLabel } from '@/lib/tableTimeline';   /* hiện Mã — Tên */
import { setupHintText } from '@/lib/setupHint';
import { key as boldKey } from '@/lib/richText';

const locked = (label) => ({ options: [{ label }], disabled: true, value: label });
const optionValue = (o) => (o.value === undefined ? o.label : o.value);
const selectedOption = (s) => s.options.find((o) => optionValue(o) === s.value);
/* the selected item is a real value (not a prompt) */
const isRealChoice = (s) => { const m = selectedOption(s); if (!m) return false; if (optionValue(m)) return true; return !!m.label && !/^Chọn /.test(m.label) && !/trước$/.test(m.label); };
const selectedText = (s) => { const m = selectedOption(s); return m ? m.label.trim() : ''; };
const NO_COMPANION_OPTION = { value: '', label: 'Người này không có thân nhân nào khác liên kết' };
const companionOptions = (list) => [{ value: '', label: 'Chọn thân nhân đi cùng' }].concat(list.map((x) => ({
  value: x.fullName, label: x.fullName, relationship: x.relationship, citizenId: x.citizenId, birthDate: toDisplayDate(x.birthDate) || '',
})));
/* "HS-00623 · Đội 1" as shown next to the student name */
/* «HS-00623 · Dãy A / Phòng A101» thay Đội */
export const studentProfileText = (s) => (s.studentCode === undefined ? undefined : s.studentCode ? s.studentCode + ' · ' + dormitoryRoomText(s.studentCode) : s.studentCode);
export const relativeStatusLabel = (code) => (RELATIVE_STATUS[code] ? RELATIVE_STATUS[code].label : code);

export function createModel(mode) {
  const query = new URLSearchParams(location.search);
  return {
    mode, query, ref: JSON.parse(JSON.stringify({ relatives: RELATIVES })), stepLabels: stepButtonLabels(mode),
    step: 1, lookupText: '', lookupReadOnly: false, lookupLocked: false, lookupError: '', lookupErrorVisible: false, lookupResult: null,
    relative: null, student: null, studentIndex: -1, maskedCitizenId: '', showStudents: false, showCompanions: false, studentsLocked: false,
    companionRows: [{ key: 1, ...locked('Chọn thân nhân người cai nghiện trước'), relationship: '', citizenId: '' }], nextRowKey: 1, addCompanionDisabled: false, addCompanionTitle: undefined,
    resource: null, resourceNotice: '', duration: locked('Chọn người cai nghiện trước'), startTime: { options: [{ label: 'Chọn thời lượng trước' }], disabled: false, value: 'Chọn thời lượng trước' }, endTime: '',
    slots: [], gridVisible: false, gridHintVisible: true, timeline: null, timelineVersion: 0, pick: null, pickVersion: 0,
    showTable: false, showTimeRange: false, selectedTimeRange: '', table: '', timeHint: '', visitDate: null, visitDateText: 'Chọn ngày hẹn', staffNote: '',
    notifyRecipients: { VISIT_TEAM: [], EXTRA: [] },   /* thay ⑪: mặc định là cán bộ phụ trách của quầy đã chọn (khoá trong ô), không còn theo người đăng nhập */
    errors: {}, errorIds: [], borders: {}, alignQueue: [], alignVersion: 0, scrollTarget: null,
    lock: { missing: [], step: 1 }, buttonsDisabled: false, nextLabel: 'Tiếp tục', saveLabel: 'Đăng ký', lookupButtonLabel: 'Tra cứu', simulateLabel: 'Giả lập quẹt thẻ',
    summaryRows: [], approvalNotice: null, autoApprove: true, scanOpen: false, scanRead: false, detailOpen: false, cancelReason: '',
    title: mode === 'edit' ? 'Chỉnh sửa lịch hẹn thăm gặp trực tiếp' : 'Tạo lịch hẹn thăm gặp trực tiếp',
    subtitle: mode === 'edit' ? 'Chỉnh sửa thông tin của lượt thăm gặp đã đăng ký' : 'Đăng ký lượt thăm gặp trực tiếp giữa thân nhân và người cai nghiện',
    statusTag: null, source: null, sourceTitle: 'Nguồn đặt lịch của màn này là cố định, không đổi được',
    saving: false, started: false,
    /* Tách màn ngoại lệ: cán bộ đặt hộ chỉ tạo cho thân nhân đã có sổ/tài khoản; đơn xin duyệt chỉ tạo ở Đăng ký tại quầy. Sửa thì nạp luồng của lịch */
    route: mode === 'edit' ? '' : ROUTE_LINKED, exempt: { ...EMPTY_EXEMPTION },
  };
}

export function createActions(model, rerender, toast) {
  const M = model;
  /* Dãy nhà và quầy tự xác định theo người cai nghiện — dựng lại khi đổi người cai nghiện */
  const studentKey = () => (M.student ? (M.student.studentCode || M.student.fullName || '') : '');
  function ensureResource() {
    if (!M.student) { if (M.resource) { const old = M.resource.counter; M.resource = null; syncCounterStaff(old); M.resourceNotice = ''; M.duration = locked('Chọn người cai nghiện trước'); clearPick(); buildTimeline(); } return; }
    if (M.resource && M.resource.key === studentKey()) return;
    applyResource();
  }
  /* lưới theo quầy: giờ của ngày theo WEB-54, buồng Hoạt động của quầy; nguồn App và cán bộ đặt hộ không dùng suất riêng
 * buồng của quầy đã chọn trên đầu, buồng các quầy Hoạt động khác bên dưới */
  const currentRoom = () => (M.resource && M.resource.counter && M.visitDate ? allCountersRoom(M.resource.counter, M.visitDate, usesReserved(M.source || 'STAFF')) : null);
  const selectedSlot = () => { const v = String(M.startTime.value).trim(); const i = v === '' ? -1 : +v; return i >= 0 ? M.slots[i] : undefined; };

  function missingInStep(step) {
    const t = [];
    if (step === 1) {
      if (!M.route) t.push('Luồng đăng ký');
      else if (M.route === ROUTE_EXEMPTION) t.push(...missingExemption(M.exempt));   /* màn Sửa kiểm đơn như màn Tạo */
      else {
        if (!M.relative) t.push('Thân nhân người cai nghiện');
        if (!M.student) t.push('Người cai nghiện');
      }
    } else if (step === 2) {
      ensureResource();
      const noCounter = !M.resource || !M.resource.counter;   /* chưa chọn quầy thì chặn chọn giờ, buồng */
      if (noCounter) t.push('Quầy tiếp đón');
      if (/^Chọn/.test(M.visitDateText)) t.push('Ngày thăm gặp');
      if (noCounter) t.push('Khung giờ');
      else {
        if (M.duration.disabled || /^(Chọn|Vui lòng)/.test(selectedText(M.duration))) t.push('Thời lượng');
        if (!selectedSlot()) t.push('Khung giờ');
        if (M.showTable && !M.table.trim()) t.push('Buồng thăm gặp');
      }
    }
    return t;
  }

  /* showFieldError: red text under a field — a hidden field reports on the step's representative field (step 1: lookup box).
 * Each target: [error element id, border key, field visible] */
  const FIELD_ERROR_TARGETS = {
    lookup: () => ['oTraCuuLoi', 'lookup', M.step === 1], visitType: () => ['oLoaiHinhLoi', null, M.step === 2],
    visitDate: () => ['nutNgayHenLoi', 'visitDate', M.step === 2], counter: () => ['oQuayLoi', null, M.step === 2],
    duration: () => ['oThoiLuongLoi', 'duration', M.step === 2], table: () => ['oBanDaChonLoi', null, M.step === 2 && M.showTable],
    relative: () => [null, null, false], student: () => ['oNCNLoi', null, M.step === 1 && !!M.showStudents],   /* có danh sách người cai nghiện thì báo ngay dưới danh sách */
    route: () => ['khoiLuongLoi', null, M.step === 1],
    exName: () => ['xdHoTenLoi', null, M.step === 1], exCitizenId: () => ['xdCccdLoi', null, M.step === 1], exRelationship: () => ['xdQuanHeLoi', null, M.step === 1],
    exStudent: () => ['xdNcnLoi', null, M.step === 1], exReason: () => ['xdLyDoLoi', null, M.step === 1],
  };
  function showFieldError(field, text) {
    let target;
    if (field === 'startTime') target = ['nhacChuaDuLoi', null, true];
    else if (field.indexOf('xdDiKem') === 0) target = [field + 'Loi', null, M.step === 1];   /* dòng thân nhân đi cùng */
    else {
      if (!FIELD_ERROR_TARGETS[field]) return null;
      target = FIELD_ERROR_TARGETS[field]();
      if (!target[2]) { if (M.step !== 1) return null; target = FIELD_ERROR_TARGETS.lookup(); }
    }
    const [id, border] = target;
    if (M.errorIds.indexOf(id) < 0) M.errorIds.push(id);
    if (!text) { M.errors[id] = ''; if (border) delete M.borders[border]; return null; }
    const previous = (M.errors[id] || '').trim();
    M.errors[id] = previous && previous.indexOf(text) < 0 ? previous + ' · ' + text : text;
    M.alignQueue.push(id); M.alignVersion++;
    if (border) M.borders[border] = true;
    return id;
  }
  const clearErrorIfShown = (errorId, field) => { if (M.errorIds.indexOf(errorId) >= 0) showFieldError(field, ''); };
  const clearAllFieldErrors = () => { Object.keys(M.errors).forEach((k) => { M.errors[k] = ''; }); M.borders = {}; };

  function validateStep() {
    clearAllFieldErrors();
    const missing = missingInStep(M.step);
    if (!missing.length) return true;
    let first = null;
    /* chưa có quầy: câu #25 đã ở khối lưới, không báo thêm chữ đỏ cho Khung giờ */
    const noCounter = !M.resource || !M.resource.counter;
    missing.forEach((label) => { if (noCounter && label === 'Khung giờ') return; const key = FIELD_KEY_BY_LABEL[label] || companionFieldId(label); const typed = TYPED_FIELD_KEYS.includes(key) || /^xdDiKem(Ten|Cccd)/.test(key || ''); const e = key ? showFieldError(key, msg(typed ? 'E001-01' : 'E001-02', midSentence(label))) : null; if (e && !first) first = e; });
    M.scrollTarget = first;
    return false;
  }
  const refreshLock = () => { M.lock = { missing: missingInStep(M.step), step: M.step }; M.buttonsDisabled = false; };

  function buildSummary() {
    const slot = M.slots[+(M.startTime.value || -1)];
    /* đơn ngoại lệ đếm thân nhân đi cùng của đơn (M.exempt), không đếm bảng chọn thân nhân liên kết */
    const people = 1 + (M.route === ROUTE_EXEMPTION ? (M.exempt.hasCompanions ? (M.exempt.companions || []).filter((c) => String(c.fullName || '').trim()).length : 0) : M.companionRows.filter((r) => r.value).length);
    const s = M.student;
    /* nhóm 0 = bước 1, nhóm 1 = bước 2 */
    return [
      ['Nguồn đặt lịch', M.source ? sourceLabel(M.source) : 'Cán bộ đặt hộ', true, '', 0],
      ['Người cai nghiện', s ? s.fullName + ' — CCCD: ' + s.citizenId + ' — Ngày sinh: ' + toDisplayDate(s.birthDate) : '', false, '', 0],
      ['Cán bộ quản lý', s ? (s.managerName || '') : '', false, '', 0],
      ['Số thân nhân tham gia', M.relative ? people + ' người' : '', false, '', 0],
      ['Loại hình thăm gặp', 'Thăm gặp trực tiếp tiêu chuẩn', true, 'tag-visit-standard', 1],
      ['Dãy nhà', M.resource ? M.resource.dormitoryName : '', true, 'tag-category', 1],
      ['Quầy tiếp đón', M.resource ? counterLabel(M.resource.counter) : '', true, 'tag-category', 1],
      ['Ngày thăm gặp', M.visitDateText, false, '', 1],
      ['Khung giờ', slot ? toHhmm(slot.start) + ' — ' + toHhmm(slot.end) : '', false, '', 1],
      ['Thời lượng', isRealChoice(M.duration) ? selectedText(M.duration) : '', true, '', 1],
      ['Buồng thăm gặp', tableLabel(M.table.trim()), true, 'tag-table', 1],
    ].map((d) => ({ label: d[0], text: d[1], hasValue: !!d[1] && !/^Chọn |trước$/.test(d[1]), isTag: !!d[2], className: d[3], group: d[4] }));
  }

  /* Báo TRƯỚC ở bước Đối chiếu và xác nhận: lịch sẽ chờ duyệt hay được tự động duyệt.
 * Dùng ĐÚNG luật của lúc lưu (hasCompletedVisit + initialStatus), để báo gì thì trạng thái tạo ra đúng như vậy. */
  /* Báo TRƯỚC ở bước Đối chiếu và xác nhận theo luồng đã chọn (thay căn cứ "đã từng gặp thật" của) */
  function buildApprovalNotice() {
    const r = M.relative, s = M.student; if (!r || !s) return null;
    if (M.mode === 'edit' && M.editRecord && M.editRecord.status === 'REJECTED') return M.route === ROUTE_EXEMPTION
      ? { tone: 'pending', title: msg('I001-90'), text: msg('I001-91') }
      : { tone: 'pending', title: msg('I001-88'), text: msg('I001-89') };
    if (M.route === ROUTE_EXEMPTION) return { tone: 'pending', title: msg('I001-86'), text: msg('I001-87', r.fullName, M.exempt.reason.trim()) };
    return { tone: 'auto', title: msg('I001-84'), text: msg('I001-85', r.fullName) };
  }


  function renderStep() {
    /* Lịch đặt trước không dùng suất quỹ chung — chỉ nhánh tạo tại quầy */
    M.nextLabel = M.stepLabels[M.step];
    M.saveLabel = M.stepLabels[3];
    /* luồng đã có sổ/tài khoản ⇒ «Lưu và duyệt» (vào Đã duyệt); luồng xin duyệt ⇒ «Lưu và gửi duyệt» */
    if (M.route === ROUTE_LINKED && (M.mode !== 'edit' || (M.editRecord && M.editRecord.status === 'DRAFT'))) { M.saveLabel = 'Lưu và duyệt'; if (M.step === 3) M.nextLabel = M.saveLabel; }   /* Nháp thân nhân đã có sổ khi sửa cũng vào thẳng Đã duyệt */
    if (M.step === 3) { M.summaryRows = buildSummary(); M.approvalNotice = buildApprovalNotice(); }
    refreshLock();
    scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ── Relative lookup ── */
  const showLookupError = (text) => { M.lookupError = text; M.lookupErrorVisible = true; M.alignQueue.push('loiTraCuu'); M.alignVersion++; };
  const hideLookupError = () => { M.lookupErrorVisible = false; };
  function lookupRelative() {
    const key = M.lookupText.replace(/\s/g, '');
    let found = null;
    M.ref.relatives.forEach((r) => { if (r.citizenId === key || r.phoneNumber === key) found = r; });
    /* tra lại đúng thân nhân đang hiện ⇒ giữ người cai nghiện, thân nhân đi cùng đã chọn */
    if (found && M.lookupResult === 'card' && M.relative && (M.relative.citizenId === key || M.relative.phoneNumber === key)) { M.lookupKey = M.lookupText; hideLookupError(); refreshLock(); return; }
    M.student = null; M.showCompanions = false;
    if (!found) {
      M.relative = null; M.showStudents = false;
      if (!key) { showLookupError(msg('E001-01', 'số căn cước công dân hoặc số điện thoại của thân nhân')); M.lookupResult = null; }
      else { showLookupError(msg('E001-35', key)); M.lookupResult = { notFound: key }; }
      refreshLock();
      return;
    }
    hideLookupError();
    M.relative = found; M.lookupKey = M.lookupText;
    M.lookupResult = 'card'; M.studentIndex = -1; M.showStudents = true;
    refreshLock();   /* Enter / quẹt thẻ cũng cập nhật thanh trường thiếu */
  }

  /* ── Companions ── */
  function remainingCompanions(key) {
    const taken = M.companionRows.filter((x) => x.key !== key && x.value).map((x) => x.value);
    return ((M.student && M.student.linkedRelatives) || []).filter((x) => !M.relative || x.fullName !== M.relative.fullName).filter((x) => taken.indexOf(x.fullName) < 0);
  }
  const refreshAddButton = () => { M.addCompanionDisabled = M.companionRows.length >= MAX_COMPANIONS; M.addCompanionTitle = M.addCompanionDisabled ? 'Tối đa 03 thân nhân mỗi lượt thăm gặp (Điều 34 Thông tư 79)' : ''; };
  // ↑ câu nhắc hiện bằng data-nhac ở nút (cơ chế data-tip chỉ hiện cho nút KHÔNG có chữ nên trước đây câu này không bao giờ hiện) — nguồn: BusinessConcept_PM2 «TT79-Đ34 … tối đa 03 thân nhân»
  function fillRow(row, keepValue) {
    const previous = row.value;
    row.value = '';
    const list = remainingCompanions(row.key);
    if (!list.length) { row.options = [NO_COMPANION_OPTION]; row.disabled = true; row.relationship = ''; row.citizenId = ''; return; }
    row.options = companionOptions(list); row.disabled = false;
    if (keepValue && previous) row.value = row.options.some((o) => o.value === previous) ? previous : '';
    if (!row.value) { row.relationship = ''; row.citizenId = ''; }   /* mất giá trị giữ lại ⇒ bỏ quan hệ, CCCD cũ */
  }
  function resetCompanions() {
    M.companionRows = [M.companionRows[0]]; M.companionRows[0].relationship = ''; M.companionRows[0].citizenId = '';
    refreshAddButton();
    M.companionRows.forEach((r) => fillRow(r, false));
  }
  const refillAllRows = () => M.companionRows.forEach((r) => fillRow(r, true));
  function addCompanionRow() {
    if (M.companionRows.length >= MAX_COMPANIONS) return;
    const row = { key: ++M.nextRowKey, value: '', relationship: '', citizenId: '', options: [], disabled: false };
    M.companionRows.push(row);
    const list = remainingCompanions(row.key);
    if (!list.length) { row.options = [NO_COMPANION_OPTION]; row.disabled = true; } else row.options = companionOptions(list);
    refreshAddButton();
  }
  function removeCompanionRow(key) {
    if (M.companionRows.length <= 1) {
      const row = M.companionRows[0]; row.value = optionValue(row.options[0]); row.relationship = ''; row.citizenId = '';
      refillAllRows();
      return;
    }
    M.companionRows = M.companionRows.filter((r) => r.key !== key);
    refillAllRows(); refreshAddButton();
  }
  function changeCompanion(key, value) {
    const row = M.companionRows.find((x) => x.key === key); if (!row) return;
    row.value = value;
    const opt = row.options.find((o) => optionValue(o) === value);
    const real = opt && opt.value;
    row.relationship = real ? (opt.relationship || '') : ''; row.citizenId = real ? (opt.citizenId || '') : '';
    M.companionRows.forEach((r) => { if (r.key !== key) fillRow(r, true); });   /* người vừa chọn rời khỏi các dòng khác, người bỏ ra trở lại */
  }
  function selectStudent(i) {
    if (!M.relative) return;
    if (i === M.studentIndex && M.student) return;   /* chọn lại đúng người đang chọn ⇒ giữ thân nhân đi cùng */
    const s = M.relative.students[i];
    if (!s || !checkVisitEligibility(s, new Date(), null, M.mode === 'edit' ? M.editCode : undefined).ok) return;   /* màn Sửa không tính chính lịch này (Từ chối duyệt vẫn giữ lượt) */
    M.student = s; M.studentIndex = i; M.showCompanions = true;
    resetCompanions();
    if (M.resource) ensureResource();   /* đổi người cai nghiện ⇒ dựng lại quầy, bỏ giờ, buồng cũ (chưa có quầy thì để màn Sửa nạp quầy đã lưu) */
  }

  /* ── Resources: người cai nghiện -> dãy nhà -> quầy -> duration (auto-filled) -> time and table picked on the table timeline ──
 * The timeline places 1 block; M.slots holds just that block so the code reading M.slots[startTime] keeps working. */
  const hideTableBlock = () => { M.showTable = false; M.showTimeRange = false; M.selectedTimeRange = ''; };
  const defaultDuration = () => { const t = VISIT_TYPE_DURATIONS.find((x) => x.visitTypeName === 'Thăm gặp trực tiếp tiêu chuẩn'); return t ? String(t.durationMinutes) : ''; };
  function clearPick() {
    M.pick = null; M.pickVersion++; M.slots = []; M.endTime = ''; M.table = '';
    M.startTime = { options: [{ value: '', label: 'Chọn giờ bắt đầu' }], disabled: false, value: '' };
    hideTableBlock();
  }
  function buildTimeline() {
    const room = currentRoom(), minutes = +M.duration.value;
    const ready = !!(room && M.visitDate && minutes);
    M.timelineVersion++;
    M.noTable = false;
    M.resourceNotice = '';   /* bỏ chọn Quầy ⇒ không còn câu báo cũ dưới lưới */
    if (!ready) { M.gridVisible = false; M.gridHintVisible = true; M.timeline = null; return; }
    /* kỷ luật và lượt xét theo TUẦN ngày hẹn, 1 nguồn visitQuotaStore — tuần bị chặn thì không cho chọn giờ */
    { const el = checkVisitEligibility(M.student, new Date(), M.visitDate, M.mode === 'edit' ? M.editCode : undefined);
      if (!el.ok) { M.timeline = null; M.resourceNotice = el.reason; M.gridVisible = false; M.gridHintVisible = true; return; } }
    /* lịch khác giữ buồng (trừ Nháp, Đã hủy, Bị từ chối) hiện «Đã có lịch»; đang sửa thì không tính chính lịch đó */
    const day = toIsoDate(formatDate(M.visitDate));
    const booked = bookedFrom(buildAppointments(), day, HOLDS_NO_RESOURCE, M.mode === 'edit' ? M.editCode : undefined);
    const today = toIsoDate(formatDate(new Date()));
    M.timeline = { ...timelineConfig(room, minutes, bookingSettings(), booked, day < today ? -1 : day === today ? 0 : 1), dayText: formatDate(M.visitDate), groupLabel: counterLabel(M.resource.counter) };
    /* ngày không có ca theo WEB-54 ⇒ Ngoài giờ thăm gặp · quầy không còn buồng hoặc chỗ trống ⇒ #26 */
    M.noTable = false;
    if (!M.timeline.shifts.length) M.resourceNotice = msg('I001-75');
    else if (!M.timeline.tables.length) { M.noTable = true; M.resourceNotice = setupHintText('buồng thăm gặp', 'Cài đặt quầy tiếp đón'); }   /* quầy chưa có buồng ⇒ hướng dẫn cài đặt, không báo hết chỗ */
    else if ((M.timeline.minStart == null || M.timeline.minStart < 24 * 60) && !hasAnyFit(M.timeline)) M.resourceNotice = counterFullMessage(M.resource.counter.name);
    M.gridVisible = !M.resourceNotice; M.gridHintVisible = !!M.resourceNotice;
  }
  function applyPick(start, end, tableCode) {
    const shift = shiftOf(M.timeline, start, end);
    M.pick = { start, end, tableCode }; M.pickVersion++;
    M.slots = [{ start, end, shiftName: shift ? shift.name : '', tables: [tableCode] }];
    M.startTime = { options: [{ value: '', label: 'Chọn giờ bắt đầu' }, { value: '0', label: toHhmm(start) }], disabled: false, value: '' };
    M.table = tableCode;
    changeStartTime('0');
    clearErrorIfShown('oBanDaChonLoi', 'table'); M.timeHint = '';
  }
  /* the timeline reports a placed / moved / resized block (or null when it was dropped) */
  function pickFromTimeline(sel) {
    if (!sel) { clearPick(); return; }
    if (String(sel.duration) !== M.duration.value) { M.duration.value = String(sel.duration); M.timeline = { ...M.timeline, duration: sel.duration }; clearErrorIfShown('oThoiLuongLoi', 'duration'); }
    if (sel.counterCode && M.resource && M.resource.counter && sel.counterCode !== M.resource.counter.code) switchCounterByTable(sel.counterCode);
    applyPick(sel.start, sel.end, sel.tableCode);
  }
  /* chọn hoặc kéo lịch sang buồng của quầy khác ⇒ Quầy tiếp đón đổi theo, giữ nguyên giờ và buồng vừa chọn (khác changeCounter: không xoá lưới) */
  function switchCounterByTable(code) {
    const old = M.resource.counter, next = activeCounters().find((c) => c.code === code);
    if (!next) return;
    M.resource = { ...M.resource, counter: next };
    syncCounterStaff(old);
    clearErrorIfShown('oQuayLoi', 'counter');
    toast(msg('W001-22', counterLabel(old), counterLabel(next)), 'is-warning');
  }
  /* quầy MẶC ĐỊNH theo dãy nhà, chọn được quầy Hoạt động khác. preferCode: quầy đã lưu trên lịch (màn Sửa) */
  function applyResource(preferCode) {
    const res = studentResource(M.student.studentCode);
    const oldCounter = M.resource && M.resource.counter;
    const want = preferCode || M.preferCounterCode; M.preferCounterCode = '';
    const picked = want ? activeCounters().find((c) => c.code === want) : null;
    M.resource = { ...res, defaultCounter: res.counter, counter: picked || res.counter, key: studentKey() };
    M.resourceNotice = ''; M.noCounterDorm = '';   /* ⑳ không còn chặn khi thiếu quầy mặc định — cảnh báo vàng dưới ô Quầy */
    syncCounterStaff(oldCounter);
    if (M.resource.counter) clearErrorIfShown('oQuayLoi', 'counter');
    applyCounterDuration();
  }
  /* ⑳ đổi quầy ⇒ bỏ cán bộ phụ trách quầy cũ khỏi phần người thêm tay; cán bộ quầy mới hiện khoá trong ô (mandatoryOf theo quầy) */
  function syncCounterStaff(oldCounter) {
    const old = counterStaffKeys(oldCounter);
    if (old.length) M.notifyRecipients = { ...M.notifyRecipients, VISIT_TEAM: (M.notifyRecipients.VISIT_TEAM || []).filter((k) => old.indexOf(k) < 0) };
  }
  function changeCounter(code) {
    if (!M.resource) return;
    const old = M.resource.counter, next = activeCounters().find((c) => c.code === code) || null;
    if ((old && old.code) === (next && next.code)) return;
    M.resource = { ...M.resource, counter: next };
    syncCounterStaff(old);
    clearErrorIfShown('oQuayLoi', 'counter');
    applyCounterDuration();
  }
  /* ⑳ cảnh báo vàng dưới ô Quầy — cũng là câu ghi Lịch sử thao tác khi lưu */
  function counterWarning() {
    if (!M.resource || !M.student) return '';
    const def = M.resource.defaultCounter, cur = M.resource.counter;
    if (!def) return msg('W001-18', M.resource.dormitoryCode ? 'dãy nhà **' + M.resource.dormitoryName + '** chưa thuộc quầy nào đang hoạt động' : 'chưa được xếp dãy nhà');
    if (cur && cur.code !== def.code) return msg('W001-19', counterLabel(def));
    return '';
  }
  /* quầy tiếp đón là 1 dòng Nội dung thay đổi, chỉ khi quầy thật sự đổi; khác quầy mặc định ⇒ «(chọn tay)» */
  const counterChange = (oldCode) => { const cur = M.resource && M.resource.counter, code = cur ? cur.code : ''; if ((oldCode || '') === code) return []; return [['Quầy tiếp đón', oldCode ? counterLabelOf(oldCode) : '—', cur ? counterLabel(cur) + (counterWarning() ? ' (chọn tay)' : '') : '—']]; };
  function applyCounterDuration() {
    const res = M.resource;
    M.timeHint = '';
    clearPick();
    if (!res.counter) M.duration = locked('Chọn quầy tiếp đón trước');
    else {
      const options = [{ value: '', label: 'Chọn thời lượng' }].concat(bookingSettings().durationMinutes.map((n) => ({ value: String(n), label: n + ' phút' })));
      const preset = defaultDuration();
      M.duration = { options, disabled: false, value: options.some((o) => o.value === preset) ? preset : '' };
    }
    buildTimeline();
  }
  function changeDuration(value) {
    M.duration.value = value;
    const kept = M.pick;
    buildTimeline();
    const keptEnd = kept && M.timeline ? kept.start + fitDuration(M.timeline, kept.start, +value) : 0;
    if (kept && M.timeline && fitsTimeline(M.timeline, kept.tableCode, kept.start, keptEnd)) applyPick(kept.start, keptEnd, kept.tableCode);
    else { clearPick(); M.timeHint = kept && value ? msg('E001-36', value) : ''; }
    clearErrorIfShown('oThoiLuongLoi', 'duration');
  }
  function changeStartTime(value) {
    M.startTime.value = value;
    const s = M.slots[+value];
    if (!s) { M.endTime = ''; M.table = ''; hideTableBlock(); }
    else {
      M.endTime = toHhmm(s.end); M.showTable = true; M.showTimeRange = true;
      M.selectedTimeRange = toHhmm(s.start) + ' — ' + toHhmm(s.end);
      if (!M.table) M.table = 'Chưa xếp buồng — xếp sau';
    }
    if (value !== '') showFieldError('startTime', '');
  }
  const setVisitDate = (d) => {
    clearErrorIfShown('nutNgayHenLoi', 'visitDate');
    if (M.visitDate && d && formatDate(M.visitDate) === formatDate(d)) return;   /* chọn lại đúng ngày đang chọn ⇒ giữ giờ, buồng */
    M.visitDate = d; M.visitDateText = visitDateLabel(d); clearPick(); M.timeHint = ''; buildTimeline(); };

  /* ── Save ── */
  function buildRecord(checkedIn) {
    ensureResource();   /* quay lại bước 1 đổi người cai nghiện rồi Lưu nháp ⇒ không lưu quầy, giờ, buồng, thời lượng của người cũ (cùng người thì giữ nguyên) */
    const companionNames = M.companionRows.map((x) => x.value).filter(Boolean);
    const slot = selectedSlot();
    const time = slot ? toHhmm(slot.start) : '';
    const dateMatch = /(\d{2}\/\d{2}\/\d{4})/.exec(M.visitDateText.trim());
    const displayDate = dateMatch ? dateMatch[1] : '';   /* chưa chọn ngày thì lưu rỗng, KHÔNG lưu chữ gợi ý «Chọn ngày hẹn» làm ngày */
    const s = M.student, r = M.relative;
    return {
      code: nextCode(), createdAt: toIsoDate(formatDate(new Date())), source: 'STAFF', visitDate: toIsoDate(displayDate), visitTime: time,
      studentName: s ? s.fullName : '', studentCode: s ? (s.studentCode || '') : '', teamName: s ? (s.teamName || '') : '',
      studentCitizenId: s ? (s.citizenId || '') : '', studentBirthDate: s ? (s.birthDate || '') : '',
      visitorName: r ? r.fullName : '', companionCount: companionNames.length, companions: companionNames.map((name) => ({ name, relationship: '' })),
      relationship: s ? (s.relationship || '') : '', visitTypeName: 'Thăm gặp trực tiếp tiêu chuẩn',
      tableCode: M.table.trim(), counterCode: M.resource && M.resource.counter ? M.resource.counter.code : '', approvalRoute: M.route, exemptionReason: M.route === ROUTE_EXEMPTION ? M.exempt.reason.trim() : '', visitorCitizenId: r ? (r.citizenId || '') : '', visitorCount: 1 + companionNames.length, durationMinutes: +(selectedText(M.duration).replace(/\D/g, '')) || 45,
      status: initialStatus(displayDate, time), ui: { rowState: '' }, checkedIn: !!checkedIn, isNew: 1,
      notifyRecipients: { VISIT_TEAM: (M.notifyRecipients.VISIT_TEAM || []).filter((k) => counterStaffKeys(M.resource && M.resource.counter).indexOf(k) < 0), EXTRA: (M.notifyRecipients.EXTRA || []).slice(), off: (M.notifyRecipients.off || []).slice() },
    };
  }
  /* ── Luồng Nháp và Gửi duyệt ──
 * Lưu nháp: không kiểm đủ trường, KHÔNG giữ quỹ, buồng, suất. Lịch Bị từ chối lưu nháp thì vẫn ở Bị từ chối.
 * Lưu và gửi duyệt: kiểm lại buồng — buồng đã bị lịch khác chiếm thì báo lỗi, quay về bước chọn buồng.
 * Duyệt tự động: thân nhân đã từng gặp thật (Đã kết thúc) với chính người cai nghiện này ⇒ Đã duyệt; chưa thì Chờ duyệt. Bỏ Chờ check-in. */
  /* đơn xin duyệt ⇒ Chờ Trưởng cơ sở duyệt (màn Ngoại lệ) · đã có sổ/tài khoản ⇒ Đã duyệt ngay */
  const decideSubmitStatus = () => (M.route === ROUTE_EXEMPTION ? 'PENDING_HEAD_APPROVAL' : 'APPROVED');
  function tableTaken(rec, excludeCode) {
    const clash = findTableClash(rec, excludeCode);
    if (!clash) return false;
    const text = msg('E001-24', rec.tableCode, rec.visitTime, clash.code);
    M.saving = false; M.step = 2; renderStep(); showFieldError('table', text); toast(text, 'is-error');
    return true;
  }
  /* kiểm lại kỷ luật và lượt của tuần ngày hẹn lúc lưu (giữa chừng có thể có lịch khác chiếm lượt) */
  function weekBlocked(rec, excludeCode) {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(rec.visitDate || ''); if (!m) return false;
    const el = checkVisitEligibility(M.student, new Date(), new Date(+m[1], +m[2] - 1, +m[3]), excludeCode);
    if (el.ok) return false;
    M.saving = false; M.step = 2; renderStep(); showFieldError('table', el.reason); toast(el.reason, 'is-error');
    return true;
  }
  /* kết quả lưu gửi sang màn Danh sách để báo ĐÚNG 1 câu (draft · pending · auto) — không báo ở đây nữa vì trang chuyển ngay sau đó */
  const resultOf = (status) => (status === 'PENDING_HEAD_APPROVAL' ? 'exception-resubmit' : status === 'PENDING_APPROVAL' ? 'pending' : 'auto');
  /* Gửi duyệt ra Chờ duyệt ⇒ Trưởng cơ sở nhận thông báo, bấm vào mở thẳng chi tiết lịch hẹn */
  /* Gửi duyệt ra Chờ duyệt ⇒ người duyệt nhận thông báo: notifyPendingApproval ở data/exemptionResend.js */
  /* sửa số mà chưa bấm Tra cứu ⇒ khi Tiếp tục / Lưu nháp tự trả ô về số đã tra, để ô khớp thẻ thân nhân đang dùng */
  function restoreLookupText() {
    if (M.lookupResult === 'card' && M.lookupKey != null && M.lookupText.replace(/\s/g, '') !== M.lookupKey.replace(/\s/g, '')) { M.lookupText = M.lookupKey; hideLookupError(); }
  }
  function saveDraft() {
    if (M.saving) return;
    restoreLookupText();
    if (!M.relative || !M.student) { toast(msg('E001-02', 'thân nhân và người cai nghiện trước khi lưu nháp'), 'is-warning'); return; }
    if (M.mode === 'edit') { saveChanges('draft'); return; }
    M.saving = true;
    let record;
    try { record = buildRecord(false); record.status = 'DRAFT'; record.createdByKey = currentAccount().key; const list = readCreated({ strict: true }); list.push(record); if (!writeCreated(list)) throw new Error('storage'); }
    catch (e) { toast(msg('SE001-01', 'lưu nháp lịch hẹn'), 'is-error'); M.saving = false; return; }
    logAction(record.code, 'Lưu nháp', { statusAfter: 'DRAFT', changes: counterChange('') });
    M.buttonsDisabled = true;
    if (M.leaveRelease) M.leaveRelease();
    setTimeout(() => { location.href = '/lich-hen/tham-gap-truc-tiep?created=' + encodeURIComponent(record.code) + '&result=draft'; }, 300);
  }
  /* Cán bộ tổ thăm gặp bắt buộc khi đang tick */
  const notifyTeamMissing = () => !isGroupOff(M.notifyRecipients, 'VISIT_TEAM') && !(M.notifyRecipients.VISIT_TEAM || []).length && !counterStaffKeys(M.resource && M.resource.counter).length;
  function register() {
    if (M.saving) return;
    if (notifyTeamMissing()) { toast(msg('E001-02', 'cán bộ tổ thăm gặp nhận thông báo'), 'is-error'); return; }
    M.saving = true;
    let record;
    try {
      record = buildRecord(false);   /* gửi duyệt chưa phải check-in */
      if (tableTaken(record)) return;
      if (weekBlocked(record)) return;
      record.status = decideSubmitStatus(record);
      record.createdByKey = currentAccount().key;   /* nhận thông báo Phê duyệt / Từ chối */
      const list = readCreated({ strict: true }); list.push(record); if (!writeCreated(list)) throw new Error('storage');
    } catch (e) { toast(msg('SE001-01', 'lưu lịch hẹn'), 'is-error'); M.saving = false; return; }
    /* Chờ duyệt ⇒ báo người duyệt; Lưu và duyệt (vào thẳng Đã duyệt) ⇒ báo thân nhân và cán bộ tổ thăm gặp */
    const sent = isPendingStatus(record.status) ? notifyPendingApproval(record, false)
      : sendActionNotification(NOTIFICATION_CODES.APPROVED, record, defaultRecipients(NOTIFICATION_CODES.APPROVED, [record]));
    logAction(record.code, 'Tạo lịch hẹn', { statusAfter: record.status, reason: isPendingStatus(record.status) ? (record.exemptionReason || '') : '', note: [isPendingStatus(record.status) ? '' : 'Thân nhân đã có sổ hoặc tài khoản thăm gặp — lưu và duyệt', sent].filter(Boolean).join(' · '), changes: counterChange('') });
    M.buttonsDisabled = true;
    if (M.leaveRelease) M.leaveRelease();
    setTimeout(() => { location.href = '/lich-hen/tham-gap-truc-tiep?created=' + encodeURIComponent(record.code) + '&result=' + resultOf(record.status); }, 300);
  }
  /* đơn ngoại lệ: các trường của đơn lấy từ M.exempt — cùng dữ liệu màn Tạo lưu (engine collectAppointment) */
  function exemptionChanges() {
    const e = M.exempt, rel = relativeFromExemption(e), st = rel ? rel.students[0] : null;
    const companions = e.hasCompanions ? (e.companions || []).filter((c) => String(c.fullName || '').trim()).map((c) => ({ name: c.fullName.trim(), relationship: c.relationship || '', citizenId: String(c.citizenId || '').trim() })) : [];
    return {
      visitorName: e.fullName.trim(), visitorCitizenId: e.citizenId.trim(), visitorPhone: (e.phoneNumber || '').trim(), relationship: e.relationship,
      ...(st ? { studentName: st.fullName, studentCode: st.studentCode || '', teamName: st.teamName || '', studentCitizenId: st.citizenId || '', studentBirthDate: st.birthDate || '' } : {}),
      companions, companionCount: companions.length, visitorCount: 1 + companions.length,
      attachments: (e.attachments || []).map((f) => ({ name: f.name, size: f.size })),
    };
  }
  function saveChanges(kind = 'submit') {
    if (M.saving || !M.editRecord) return;
    if (kind !== 'draft' && notifyTeamMissing()) { toast(msg('E001-02', 'cán bộ tổ thăm gặp nhận thông báo'), 'is-error'); return; }
    M.saving = true;
    const next = buildRecord(false), original = M.editRecord, code = M.editCode;
    const changes = {
      visitDate: next.visitDate, visitTime: next.visitTime, tableCode: next.tableCode, visitTypeName: next.visitTypeName || original.visitTypeName,
      durationMinutes: next.durationMinutes, companionCount: next.companionCount, companions: next.companions, visitorCount: next.visitorCount, staffNote: M.staffNote.trim(),
      notifyRecipients: next.notifyRecipients,
      counterCode: next.counterCode,   /* ⑳ quầy chọn được */
      /* đơn ngoại lệ sửa được hết như Nháp ⇒ lưu lại toàn bộ đơn: thân nhân, người cai nghiện, thân nhân đi cùng (họ tên, căn cước, quan hệ), tài liệu */
      ...(M.route === ROUTE_EXEMPTION ? exemptionChanges() : {}),
      exemptionReason: M.route === ROUTE_EXEMPTION ? M.exempt.reason.trim() : (original.exemptionReason || ''),   /* sửa lý do xin duyệt khi gửi lại */
    };
    /* lộ trình duyệt: gửi lại lịch Từ chối duyệt ⇒ lần hiện tại (lý do xin duyệt, lý do từ chối) vào approvalRounds, mở lần mới; lưu nháp giữ nguyên */
    Object.assign(changes, roundChanges(original, kind !== 'draft' && original.status === 'REJECTED'));
    if (kind === 'draft') changes.status = original.status === 'REJECTED' ? 'REJECTED' : 'DRAFT';
    else {
      const probe = { ...original, ...changes };
      if (tableTaken(probe, code)) return;
      if (weekBlocked(probe, code)) return;
      /* Lịch Bị từ chối gửi lại: đơn ngoại lệ ⇒ Chờ Trưởng cơ sở duyệt, lịch thường ⇒ Chờ duyệt (Cán bộ Tổ thăm gặp); Nháp gửi duyệt theo luồng */
      changes.status = original.status === 'REJECTED' ? (M.route === ROUTE_EXEMPTION ? 'PENDING_HEAD_APPROVAL' : 'PENDING_APPROVAL') : decideSubmitStatus(probe);
      if (original.status === 'REJECTED') changes.resubmitted = true;   /* đánh dấu gửi lại sau từ chối (Lịch sử thao tác) */
    }
    try {
      const savedAt = new Date().toISOString();
      const edited = readEdited(); edited[code] = { ...changes, savedAt }; if (!writeEdited(edited)) throw new Error('storage');
      /* Lưu nháp không ghi bản điều chỉnh: nháp có thể chưa có ngày, giờ, buồng và bản điều chỉnh rỗng sẽ đè mất buồng ở trang chi tiết (lỗi LH-2026-0923) */
      if (kind !== 'draft') { const adjusted = readAdjusted(); adjusted[code] = { visitDate: changes.visitDate, visitTime: changes.visitTime, tableCode: changes.tableCode, reason: 'Chỉnh sửa lịch hẹn', savedAt }; if (!writeAdjusted(adjusted)) throw new Error('storage'); }
      if (M.editFromCreated) { const created = readCreated(); const k = created.findIndex((x) => x.code === code); if (k >= 0) { Object.assign(created[k], changes); if (!writeCreated(created)) throw new Error('storage'); } }
    } catch (e) { M.saving = false; toast(msg('SE001-01', 'lưu thay đổi lịch hẹn'), 'is-error'); return; }
    { /* ghi các trường đã đổi */
      const d = (v) => (v === undefined || v === null || v === '' ? '—' : String(v));
      const diff = [['Ngày thăm gặp', toDisplayDate(original.visitDate || ''), toDisplayDate(changes.visitDate || '')], ['Giờ thăm gặp', original.visitTime, changes.visitTime], ['Buồng thăm gặp', original.tableCode, changes.tableCode], ['Thời lượng', original.durationMinutes, changes.durationMinutes], ['Số thân nhân tham gia', original.visitorCount, changes.visitorCount], ['Ghi chú của cán bộ', original.staffNote, changes.staffNote]]
        .map(([k, a, b]) => [k, d(a), d(b)]).filter((c) => c[1] !== c[2]);
      const sent = kind !== 'draft' && isPendingStatus(changes.status) ? notifyPendingApproval({ ...original, ...changes, code }, original.status === 'REJECTED') : '';
      logAction(code, kind === 'draft' ? 'Lưu nháp' : !isPendingStatus(changes.status) ? 'Chỉnh sửa' : (original.status === 'REJECTED' ? 'Chỉnh sửa và gửi duyệt lại' : 'Chỉnh sửa và gửi duyệt'),   /* theo trạng thái thật sau khi lưu */ { statusBefore: original.status, statusAfter: changes.status, changes: diff.concat(counterChange(original.counterCode)), note: sent }); setStatus(code, changes.status); }
    M.buttonsDisabled = true;
    if (M.leaveRelease) M.leaveRelease();
    setTimeout(() => { location.href = urlListPath() + '?updated=' + encodeURIComponent(code) + '&result=' + (kind === 'draft' ? 'draft' : resultOf(changes.status)); }, 300);
  }
  /* Chỉnh sửa: Lưu và gửi duyệt đứng cạnh Lưu nháp ở MỌI bước — kiểm đủ bước 1, 2; thiếu thì về đúng bước báo lỗi */
  function submitNow() {
    for (const s of [1, 2]) {
      if (missingInStep(s).length) { M.step = s; renderStep(); validateStep(); refreshLock(); return; }
    }
    if (M.mode === 'edit') saveChanges('submit'); else register();
  }
  function advanceStep() {
    restoreLookupText();
    if (!validateStep()) { refreshLock(); return; }
    if (M.step >= 3) { if (M.mode === 'edit') saveChanges('submit'); else register(); return; }
    M.step++; renderStep();
  }

  /* đơn xin duyệt dựng thân nhân + người cai nghiện để các bước sau dùng như kết quả tra cứu */
  function syncExemption() {
    const rel = relativeFromExemption(M.exempt);
    M.relative = rel; M.student = rel ? rel.students[0] : null; M.studentIndex = rel ? 0 : -1; M.showCompanions = false;
  }

  /* ── URL params + prefill in Edit mode ── */
  function readQueryParams() {
    if (M.query.get('mode') === 'edit') {
      M.title = 'Sửa lịch hẹn thăm gặp';
      if (readRouteId()) M.subtitle = 'Mã lịch hẹn ' + readRouteId();
      M.nextLabel = M.saveLabel = M.lookupButtonLabel = M.simulateLabel = 'Lưu thay đổi';
    }
  }
  function prefillForEdit() {
    const r = M.editRecord;
    if (!r) { toast(msg('E001-11', 'lịch hẹn' + (M.editCode ? ' ' + boldKey(M.editCode) : '')), 'is-error'); return; }
    M.title = 'Chỉnh sửa lịch hẹn thăm gặp trực tiếp ' + (r.code || '');
    M.statusTag = r.status ? { code: r.status, label: statusLabel(r.status), className: STATUS_CLASS[r.status] || 'is-closed' } : null;
    const time = String(r.visitTime || '').slice(0, 5), displayDate = String(toDisplayDate(r.visitDate || ''));
    if (r.source) { M.source = r.source; M.sourceTitle = 'Nguồn đặt lịch giữ nguyên khi chỉnh sửa'; }
    if (r.staffNote) M.staffNote = r.staffNote;
    if (r.notifyRecipients) M.notifyRecipients = { VISIT_TEAM: (r.notifyRecipients.VISIT_TEAM || []).slice(), EXTRA: (r.notifyRecipients.EXTRA || []).slice(), off: (r.notifyRecipients.off || []).slice() };
    const relatives = M.ref.relatives;
    let key = null;
    relatives.forEach((x) => { if (x.fullName === r.visitorName && x.students.some((s) => s.fullName === r.studentName)) key = x.citizenId; });
    if (!key) {
      key = 'SUA-' + r.code;
      relatives.push({ citizenId: key, fullName: r.visitorName || '—', birthDate: '—', phoneNumber: '—', status: 'APPROVED', students: [{
        fullName: r.studentName, citizenId: r.studentCitizenId || '—', birthDate: r.studentBirthDate || '—', relationship: r.relationship || '—', remainingQuota: 1,
        studentCode: r.studentCode || '', teamName: r.teamName || '', linkedRelatives: [] }] });
    }
    const relative = relatives.find((x) => x.citizenId === key);
    relative.students = relative.students.filter((s) => s.fullName === r.studentName);
    const s0 = relative.students[0];
    if (s0.remainingQuota < 1) s0.remainingQuota = 1;
    s0.linkedRelatives = s0.linkedRelatives || [];
    (r.companions || []).forEach((c) => { if (!s0.linkedRelatives.some((x) => x.fullName === c.name)) s0.linkedRelatives.push({ fullName: c.name, relationship: c.relationship || '—', citizenId: '—' }); });
    M.lookupText = key; lookupRelative(); selectStudent(0);
    const isPlaceholder = key.indexOf('SUA-') === 0;
    M.route = r.approvalRoute || (isPlaceholder ? ROUTE_EXEMPTION : ROUTE_LINKED);   /* lịch cũ chưa lưu luồng ⇒ suy từ việc có trong danh sách liên kết */
    M.exempt = { ...EMPTY_EXEMPTION, fullName: r.visitorName || '', citizenId: r.visitorCitizenId || '', phoneNumber: r.visitorPhone || '', relationship: r.relationship || '', studentCode: r.studentCode || r.studentName || '', reason: r.exemptionReason || '', attachments: r.attachments || [],
      hasCompanions: (r.companions || []).length > 0, companions: (r.companions || []).map((c) => ({ fullName: c.name || '', citizenId: c.citizenId || '', relationship: c.relationship || '' })) };   /* nạp đủ thân nhân đi cùng để sửa như màn Tạo */
    M.documentChecks = r.documentChecks || [];
    if (isPlaceholder) M.maskedCitizenId = key;
    M.lookupText = isPlaceholder ? (r.visitorName || '') : key;
    M.lookupReadOnly = true; M.lookupLocked = true; M.studentsLocked = true;
    (r.companions || []).map((c) => c.name).filter(Boolean).forEach((name, i) => {
      if (i >= M.companionRows.length) addCompanionRow();
      const row = M.companionRows[i];
      if (row && row.options.some((o) => o.value === name)) changeCompanion(row.key, name);
    });
    M.preferCounterCode = r.counterCode || '';   /* ⑳: giữ quầy đã lưu trên lịch (kể cả quầy chọn tay) — dùng ở lần dựng quầy đầu tiên */
    ensureResource();   /* ⑳: giữ quầy đã lưu trên lịch (kể cả quầy chọn tay) */
    const dm = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(displayDate);
    if (dm) setVisitDate(new Date(+dm[3], +dm[2] - 1, +dm[1]));
    if (!M.duration.disabled) {
      const choices = M.duration.options.map((x) => +optionValue(x)).filter(Boolean);
      const wanted = +r.durationMinutes || 45;
      const chosen = choices.indexOf(wanted) >= 0 ? wanted : (choices.filter((x) => x <= wanted).pop() || choices[choices.length - 1]);
      changeDuration(String(chosen));
    }
    const start = /^\d{2}:\d{2}$/.test(time) ? clockToMinutes(time) : -1, end = start + (+M.duration.value || 0);
    if (start >= 0 && M.timeline && fitsTimeline(M.timeline, r.tableCode, start, end)) applyPick(start, end, r.tableCode);
    refreshLock();
  }

  /* ── Card-swipe popup · relative detail ── */
  function simulateScan(citizenId) {
    M.scanPicking = false; M.scanRead = citizenId;   /* số căn cước của thân nhân mẫu vừa chọn ở bảng giả lập */
    setTimeout(() => { M.scanOpen = false; M.lookupText = citizenId; lookupRelative(); M.scanRead = false; rerender(); }, 900);
  }

  /* sửa ô nào của đơn ngoại lệ ⇒ bỏ chữ đỏ của ô đó; bỏ dòng thân nhân đi cùng ⇒ bỏ chữ đỏ mọi dòng (số thứ tự dòng đã dời) */
  const EXEMPT_ERRORS = { fullName: ['xdHoTenLoi', 'exName'], citizenId: ['xdCccdLoi', 'exCitizenId'], relationship: ['xdQuanHeLoi', 'exRelationship'], studentCode: ['xdNcnLoi', 'exStudent'], reason: ['xdLyDoLoi', 'exReason'] };
  const COMPANION_ERROR_PARTS = [['fullName', 'Ten'], ['citizenId', 'Cccd'], ['relationship', 'Qh']];
  function clearExemptErrors(field, before, after) {
    if (EXEMPT_ERRORS[field]) { clearErrorIfShown(...EXEMPT_ERRORS[field]); return; }
    if (field !== 'companions' && field !== 'hasCompanions') return;
    const prev = before.companions || [], next = after.hasCompanions === false && field === 'hasCompanions' ? [] : (after.companions || []);
    const shrunk = next.length < prev.length;
    for (let i = 0; i < Math.max(prev.length, next.length); i++) COMPANION_ERROR_PARTS.forEach(([f, part]) => {
      if (shrunk || (prev[i] || {})[f] !== (next[i] || {})[f]) clearErrorIfShown('xdDiKem' + part + i + 'Loi', 'xdDiKem' + part + i);
    });
  }

  const act = (fn) => (...args) => { fn(...args); rerender(); };
  const form = {
    model: M, missingInStep,
    next: act(() => advanceStep()),
    back: act(() => { if (M.step <= 1) return; M.step--; renderStep(); }),
    /* rời 1 ô bắt buộc còn trống ⇒ hiện chữ đỏ ngay, cùng câu với nút Lưu. ids: id các phần tử trong .field vừa rời */
    blurField: act((ids) => {
      const missing = missingInStep(M.step);
      Object.keys(FIELD_KEY_BY_LABEL).forEach((label) => {
        const key = FIELD_KEY_BY_LABEL[label]; const t = FIELD_ERROR_TARGETS[key] && FIELD_ERROR_TARGETS[key]();
        if (!t || !t[0] || !t[2] || ids.indexOf(t[0].replace(/Loi$/, '')) < 0 || missing.indexOf(label) < 0) return;
        if (M.errors[t[0]]) return;   /* đang hiện lỗi rồi thì giữ nguyên */
        showFieldError(key, msg(TYPED_FIELD_KEYS.includes(key) ? 'E001-01' : 'E001-02', midSentence(label)));
      });
    }),
    saveDraft: act(saveDraft),
    submitNow: act(submitNow),
    lookup: act(lookupRelative),
    typeLookup: act((v) => {
      M.lookupText = v; hideLookupError(); clearErrorIfShown('oTraCuuLoi', 'lookup');
      /* XOÁ TRẮNG ô ⇒ bỏ kết quả tra cứu cũ (thẻ thân nhân, danh sách người cai nghiện, thân nhân đi cùng) · SỬA sang số khác ⇒ giữ, phải bấm Tra cứu mới đổi */
      const stale = M.lookupResult && !v.replace(/\s/g, '');
      if (stale) { M.relative = null; M.student = null; M.studentIndex = -1; M.showStudents = false; M.showCompanions = false; M.lookupResult = null; refreshLock(); }
    }),
    /* nút Đồng bộ lại : đọc lại dữ liệu PM1 ⇒ dựng lại thẻ người cai nghiện để xét lại điều kiện thăm gặp */
    resyncPm1: act(() => {}),
    selectStudent: act(selectStudent), addCompanion: act(addCompanionRow), removeCompanion: act(removeCompanionRow), changeCompanion: act(changeCompanion),
    changeCounter: act(changeCounter), counterWarning,
    changeDuration: act(changeDuration), pickFromTimeline: act(pickFromTimeline), setTimeHint: act((t) => { M.timeHint = t; }),
    setAutoApprove: act((v) => { M.autoApprove = !!v; M.approvalNotice = buildApprovalNotice(); }),
    setVisitDate: act(setVisitDate), pickToday: act(() => setVisitDate(new Date())),
    typeNote: act((v) => { M.staffNote = v; }),
    setNotifyRecipients: act((v) => { M.notifyRecipients = { VISIT_TEAM: v.VISIT_TEAM || [], EXTRA: v.EXTRA || [], off: v.off || [] }; }),
    openScan: act(() => { M.scanOpen = true; M.scanPicking = false; }), closeScan: act(() => { M.scanOpen = false; M.scanPicking = false; }), simulateScan: act(simulateScan),
    pickScan: act(() => { M.scanPicking = true; }),
    openDetail: act(() => { if (M.relative) M.detailOpen = true; }), closeDetail: act(() => { M.detailOpen = false; }),
    setCancelReason: act((v) => { M.cancelReason = v; }),
    closeAll: act(() => { M.scanOpen = false; M.detailOpen = false; }),
    refreshLock: act(refreshLock),
    /* chọn luồng từ đầu — đổi luồng thì xoá thân nhân, người cai nghiện đã chọn */
    setRoute: act((v) => { if (M.mode === 'edit' || M.route === v) return; M.route = v; M.relative = null; M.student = null; M.studentIndex = -1; M.showStudents = false; M.showCompanions = false; M.lookupResult = null; M.lookupText = ''; hideLookupError(); if (v === ROUTE_EXEMPTION) syncExemption(); refreshLock(); }),
    /* màn Sửa đổi được cả thân nhân, người cai nghiện ⇒ dựng lại như màn Tạo; đơn chưa đủ để dựng thì giữ người đã nạp (không xoá giờ, buồng đã chọn) */
    setExempt: act((field, value) => { const before = M.exempt; M.exempt = { ...M.exempt, [field]: value }; clearExemptErrors(field, before, M.exempt); if (M.mode !== 'edit') syncExemption(); else { const rel = relativeFromExemption(M.exempt); if (rel) { const same = M.student && rel.students[0].studentCode === M.student.studentCode; M.student = same ? { ...M.student, relationship: rel.students[0].relationship } : rel.students[0]; M.relative = { ...rel, students: [M.student] }; M.studentIndex = 0; } }   /* cùng người cai nghiện ⇒ giữ hồ sơ đã nạp (quỹ của chính lịch này), không mất giờ, buồng */
      if (M.resource && M.student) ensureResource();   /* đổi người cai nghiện của đơn ⇒ dựng lại quầy, bỏ giờ, buồng cũ; cùng người thì giữ */
      refreshLock(); }),
    start() {
      if (M.started) return;
      M.started = true;
      renderStep(); readQueryParams();
      if (M.mode === 'edit') {
        M.editCode = readRouteId();
        const loaded = loadAppointmentForEdit(M.editCode); M.editRecord = loaded.record; M.editFromCreated = loaded.fromCreated;
        prefillForEdit(); renderStep();
      }
      rerender();
    },
  };
  return form;
}
