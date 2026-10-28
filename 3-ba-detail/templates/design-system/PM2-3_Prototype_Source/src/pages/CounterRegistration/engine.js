/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Behaviour core of the counter registration page — ported as-is from the page script + base/pm2-form.js.
 * Where the HTML page edits the DOM directly (slot grid, field errors, step bar, calendar) the same DOM edits are kept.
 * Dãy nhà và quầy tự xác định theo người cai nghiện; giờ theo WEB-54, buồng theo quầy, Đăng ký tại quầy được dùng suất riêng.
 * Parts with buttons / tags (relative card, student cards, companion table, document check, summary) live in state S
 * and are drawn by React with antd components; render flushes React synchronously so later code reads the new DOM. */
import { ROUTE_EXEMPTION, ROUTE_LINKED, EMPTY_EXEMPTION, missingExemption, relativeFromExemption, isPendingStatus, companionFieldId } from '@/data/approvalRoute';
import { ROUTES } from '@/routes';
import { defaultRecipients, isGroupOff, sendActionNotification } from '@/data/notificationStore';
import { activeCounters, counterStaffKeys } from '@/data/receptionDeskStore';
import { NOTIFICATION_CODES } from '@/data/notificationSettingsStore';
import { defaultVisitTeamKeys } from '@/data/staffDirectoryStore';
import { notifyPendingApproval } from '@/data/exemptionResend';
import { keyHtml, plainText, key as boldKey } from '@/lib/richText';
import { msg } from '@/lib/msg';   /* message theo mã */
import { tableLabel } from '@/lib/tableTimeline';   /* hiện Mã — Tên */
import { noCounterParts, setupHintHtml } from '@/lib/setupHint';
import '@/components/app/SetupHint.css';
import { currentAccount } from '@/data/accountStore';
import { logAction, setStatus, readStatusMap, readHistory, hasLogged } from '@/data/historyStore';
import { flushSync } from 'react-dom';
import { addLookupClear } from '@/lib/lookupClear';
import { RELATIVES, RELATIVE_STATUS, STUDENT_RELATIVES, VISIT_TYPE_DURATIONS } from '@/data/legacyData';
import { readCreated, writeCreated, toDisplayDate } from '@/data/appointmentStore';
import { HOLDS_NO_RESOURCE, buildAppointments, hasCompletedVisit } from '@/pages/AppointmentList/listLogic';
import {
  allCountersRoom, bookedFrom, bookingSettings, counterFullMessage, counterLabel, counterLabelOf, fitDuration, fitsTimeline, hasAnyFit, noCounterMessage, shiftOf, studentResource, timelineConfig,
} from '@/lib/tableTimeline';
import { mountTablePicker } from '@/components/app/TablePicker';
import { checkVisitEligibility } from '@/lib/visitEligibility';
import { dormitoryRoomText } from '@/data/dormitoryStore';
import { toast, notifyInDevelopment } from '@/lib/legacyUi';
import { datePickerHtml } from './gridHtml';

const $ = (id) => document.getElementById(id);

export const MAX_COMPANIONS = 2;
const NEXT_LABELS = { 1: 'Tiếp tục', 2: 'Tiếp tục', 3: 'Đăng ký và check-in' };
const SHARED_QUOTA_LABEL = 'Xác nhận dùng suất quỹ chung';
const PROPER_NAMES = [];
const MESSAGES = {
  'MSG-WEB-60-02': 'Không tìm thấy thân nhân nào khớp {giá trị tra cứu}, vui lòng kiểm tra lại số căn cước công dân hoặc số điện thoại',
  'MSG-WEB-60-03': 'Thân nhân {họ tên} đã có trong danh sách thân nhân đi cùng, vui lòng chọn người khác',
};
const FIELD_ID_BY_LABEL = {
  'Thân nhân người cai nghiện': 'oThanNhan', 'Người cai nghiện': 'oNguoiCN', 'Loại hình thăm gặp': 'oLoaiHinh',
  'Quầy tiếp đón': 'oQuay', 'Ngày thăm gặp': 'oNgay', 'Thời lượng': 'oThoiLuong',
  'Khung giờ': 'oGioBatDau', 'Buồng thăm gặp': 'oBan',
  'Luồng đăng ký': 'oLuong',   /* chữ đỏ dưới khối chọn luồng */
  /* đơn xin duyệt */
  'Họ tên thân nhân': 'xdHoTen', 'Số căn cước công dân của thân nhân (12 chữ số)': 'xdCccd', 'Quan hệ với người cai nghiện': 'xdQuanHe',
  'Người cai nghiện được thăm': 'xdNcn', 'Lý do xin duyệt': 'xdLyDo',
};
const TYPED_FIELD_IDS = ['xdHoTen', 'xdCccd', 'xdLyDo'];   /* ô gõ chữ ⇒ «Vui lòng nhập» */
const STEP_ANCHOR_FIELD = { 1: 'oTraCuu', 2: null, 3: null };

export const relativeStatusLabel = (code) => (RELATIVE_STATUS[code] ? RELATIVE_STATUS[code].label : code);
/* registrant's link to a student: profile code and team as one text, like the HTML card */
/* «HS-00623 · Dãy A / Phòng A101» thay Đội */
export const studentProfileText = (s) => (s.studentCode !== undefined ? (s.studentCode ? s.studentCode + ' · ' + dormitoryRoomText(s.studentCode) : s.studentCode) : undefined);

/* ───── State + React notification channel ───── */
const PLACEHOLDER_OPTION = { value: undefined, label: 'Chọn thân nhân người cai nghiện trước' };
export const S = {
  step: 1, relative: null, student: null,
  notifyRecipients: { VISIT_TEAM: [], EXTRA: [] },   /* thay ⑪: mặc định là cán bộ phụ trách của quầy đã chọn (khoá trong ô) */
  lookupResult: null,          /* null · { notFound: text } · 'card' */
  students: [], selectedStudentIndex: -1,
  companionRows: [{ id: 0, generation: 0, options: [PLACEHOLDER_OPTION], value: PLACEHOLDER_OPTION.label, disabled: true, relationship: '', citizenId: '' }],
  seq: 1, addButtonTouched: false,
  participants: null, checkResults: {}, checkedMarks: {},   /* null = document check never drawn */
  summaryRows: [],
  labels: { next: NEXT_LABELS[1], headerSave: NEXT_LABELS[3], lookup: 'Tra cứu', simulateSwipe: 'Giả lập quẹt thẻ' },
  needsSharedQuota: false, dialog: '', cardRead: false,
  route: '', exempt: { ...EMPTY_EXEMPTION },   /* luồng đăng ký chọn từ đầu · đơn xin duyệt */
};
let version = 0, isBooting = true;
const listeners = new Set();
export const store = { subscribe: (f) => { listeners.add(f); return () => listeners.delete(f); }, getVersion: () => version };
/* the HTML popup does not take focus => closing with Escape leaves focus on the opener; a mouse press while open drops it */
let previousDialog = '', openerElement = null;
export function render() {
  if (S.dialog && !previousDialog) openerElement = document.activeElement;
  previousDialog = S.dialog;
  version++; const notify = () => listeners.forEach((f) => f()); if (isBooting) notify(); else flushSync(notify);
}

/* DOM value of an option: value when present, otherwise its text */
const optionValue = (option) => (option.value !== undefined ? option.value : option.label);
export const selectedOption = (row) => row.options.find((option) => optionValue(option) === row.value) || null;

/* ───── Text helpers and field readers ───── */
const toSearchKey = (text) => String(text).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
const toMinutes = (hhmm) => { const p = String(hhmm).split(':'); return (+p[0]) * 60 + (+p[1]); };
export const toClock = (minutes) => { const h = Math.floor(minutes / 60), m = minutes % 60; return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m; };
export const initials = (name) => { const p = String(name).trim().split(/\s+/); return (p.length >= 2 ? p[p.length - 2][0] + p[p.length - 1][0] : p[0].slice(0, 2)).toUpperCase(); };

function selectByLabel(label) {
  const field = [...document.querySelectorAll('.field')].find((x) => { const n = x.querySelector('.field-label'); return n && n.textContent.indexOf(label) >= 0; });
  return field ? field.querySelector('select') : null;
}
const hasRealSelection = (el) => {
  if (!el || el.tagName !== 'SELECT') return false;
  const option = el.options[el.selectedIndex]; if (!option) return false; if (option.value) return true;
  const text = option.textContent.trim(); return !!text && !/^Chọn /.test(text) && !/trước$/.test(text);
};
const fieldText = (id) => { const el = $(id); if (!el) return ''; if (el.tagName === 'SELECT') return hasRealSelection(el) ? el.options[el.selectedIndex].textContent.trim() : ''; return el.value || ''; };
const fieldTextByExactLabel = (label) => {
  const field = [...document.querySelectorAll('.card .field')].filter((x) => { const n = x.querySelector('.field-label'); return n && n.textContent.replace('*', '').trim() === label; })[0];
  if (!field) return ''; const el = field.querySelector('select,input'); if (!el) return '';
  if (el.tagName === 'SELECT') return hasRealSelection(el) ? el.options[el.selectedIndex].textContent.trim() : '';
  return el.value || '';
};
const isChosen = (el) => {
  if (!el || el.disabled) return false;
  const text = (el.selectedIndex >= 0 && el.options && el.options[el.selectedIndex] ? (el.options[el.selectedIndex].textContent || '') : '').trim();
  const value = (el.value || '').trim();
  if (/^(Chọn|Vui lòng)/.test(text)) return false;
  return Boolean(value || text);
};

/* ───── Resources: người cai nghiện -> dãy nhà -> quầy -> duration -> start slots -> tables ───── */
let slots = [];
let visitDate = null;
let resource = null, resourceNotice = '';   /* { key, dormitoryCode, dormitoryName, counter } của người cai nghiện đang chọn */
const GRID_HINT = msg('I001-74');   /* ngày và lưới giờ chung 1 khối */
function hideTableFields() {
  ['khoiBan', 'khoiThoiGian'].forEach((id) => { const block = $(id); if (block) block.classList.add('is-hidden'); });
  const el = $('oThoiGianDaChon'); if (el) el.value = '';
}
/* ───── Table timeline: rows = tables, time runs horizontally; slots holds just the placed block ───── */
let timeline = null, timelineSettings = null, pick = null;
const isoDate = (d) => d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
const setSlotHint = (text) => { const el = $('nhacGio'); if (el) el.innerHTML = keyHtml(text || ''); };
/* Đăng ký tại quầy được dùng khoảng giờ khóa và buồng giữ riêng */
/* buồng của quầy đã chọn trên đầu, buồng các quầy Hoạt động khác bên dưới */
function currentRoom() { return resource && resource.counter && visitDate ? allCountersRoom(resource.counter, visitDate, true) : null; }
const NO_TABLE = '\u0002chua-co-ban';   /* mốc riêng: dựng câu I001-94 có link thay vì chữ thường */
const NO_COUNTER = '\u0002chua-co-quay';   /* câu E001-25 có link quầy */
let noCounterDorm = '';
const escHtml = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const noCounterHtml = () => { const q = noCounterParts(noCounterDorm); return keyHtml(q.truoc) + q.links.map((l) => '<a class="setup-hint-link" href="' + escHtml(l.href) + '">' + escHtml(l.text) + '</a>').join(' hoặc ') + keyHtml(q.sau); };
function setGridHint(text) { const el = $('nhacChuaDuChu'); if (el && text === NO_COUNTER) { el.innerHTML = noCounterHtml(); return; } if (el) el.innerHTML = text === NO_TABLE ? setupHintHtml('buồng thăm gặp', 'Cài đặt quầy tiếp đón', ROUTES.receptionDeskList) : keyHtml(text || (resource && resource.counter ? GRID_HINT : msg('I001-30', 'quầy tiếp đón', 'buồng và giờ còn trống'))); }   /* key in đậm · chưa có Quầy ⇒ nhắc chọn Quầy */
function clearPick() {
  pick = null; slots = [];
  const startSelect = $('oGioBatDau'), endInput = $('oGioKetThuc'), tableInput = $('oBanDaChon');
  if (startSelect) { startSelect.disabled = false; startSelect.innerHTML = '<option value="">Chọn giờ bắt đầu</option>'; }
  if (endInput) endInput.value = '';
  if (tableInput) tableInput.value = '';
  hideTableFields();
  if (timeline) timeline.setValue(null);
}
function applyPick(start, end, tableCode) {
  pick = { start, end, tableCode };
  const shift = shiftOf(timelineSettings, start, end);
  slots = [{ start, end, shiftName: shift ? shift.name : '', isCounterQuotaFull: start === 8 * 60, tableCodes: [tableCode] }];
  const startSelect = $('oGioBatDau'), tableInput = $('oBanDaChon');
  startSelect.disabled = false;
  startSelect.innerHTML = '<option value="">Chọn giờ bắt đầu</option><option value="0">' + toClock(start) + '</option>';
  if (tableInput) tableInput.value = tableLabel(tableCode);
  startSelect.value = '0';
  startSelect.dispatchEvent(new Event('change', { bubbles: true }));
  if (tableInput) tableInput.dispatchEvent(new Event('change', { bubbles: true }));
  if (timeline) timeline.setValue(pick);
  setSlotHint('');
}
function onTimelineChange(sel) {
  if (!sel) { clearPick(); return; }
  const durationSelect = $('oThoiLuong');
  if (durationSelect && String(sel.duration) !== durationSelect.value) {
    durationSelect.value = String(sel.duration);
    if (durationSelect.__syncSearch) durationSelect.__syncSearch();
    timelineSettings = { ...timelineSettings, duration: sel.duration };
  }
  if (sel.counterCode && resource && resource.counter && sel.counterCode !== resource.counter.code) switchCounterByTable(sel.counterCode);
  applyPick(sel.start, sel.end, sel.tableCode);
}
/* chọn hoặc kéo lịch sang buồng của quầy khác ⇒ Quầy tiếp đón đổi theo, giữ nguyên giờ và buồng vừa chọn (khác changeCounter: không dựng lại lưới) */
function switchCounterByTable(code) {
  const old = resource.counter, next = activeCounters().find((c) => c.code === code);
  if (!next) return;
  pickedCounterCode = next.code;
  resource = { ...resource, counter: next };
  { const keys = counterStaffKeys(old); if (keys.length) S.notifyRecipients = { ...S.notifyRecipients, VISIT_TEAM: (S.notifyRecipients.VISIT_TEAM || []).filter((k) => keys.indexOf(k) < 0) }; }   /* ⑳ */
  showFieldError('oQuay', '');
  toast(msg('W001-22', counterLabel(old), counterLabel(next)), 'is-warning');
  render();
}
function hideSlotGrid() {
  setGridHint(resourceNotice);
  const block = $('khoiLuoiGio'), hint = $('nhacChuaDu');
  if (block) block.style.display = 'none';
  if (hint) hint.style.display = '';
  if (timeline) { timeline.destroy(); timeline = null; }
  timelineSettings = null;
  clearPick();
}
/* (re)draw the timeline for the student counter, day and duration; keepPick = keep the block if it still fits */
function renderSlotGrid(keepPick) {
  const grid = $('luoiGio'), block = $('khoiLuoiGio'), durationSelect = $('oThoiLuong');
  if (!grid) return;
  const room = currentRoom(), minutes = durationSelect ? +durationSelect.value : 0;
  const ready = !!(room && visitDate && minutes);
  if (resource && resource.counter) resourceNotice = '';
  if (!ready) { hideSlotGrid(); return; }
  /* kỷ luật và lượt xét theo TUẦN ngày hẹn, 1 nguồn visitQuotaStore */
  { const el = checkVisitEligibility(S.student, new Date(), visitDate); if (!el.ok) { resourceNotice = el.reason; hideSlotGrid(); return; } }
  const day = isoDate(visitDate);
  const today = isoDate(new Date());
  const settings = { ...timelineConfig(room, minutes, bookingSettings(), bookedFrom(buildAppointments(), day, HOLDS_NO_RESOURCE), day < today ? -1 : day === today ? 0 : 1), dayText: day.split('-').reverse().join('/'), groupLabel: counterLabel(resource.counter) };
  /* ngày không có ca theo WEB-54 ⇒ Ngoài giờ thăm gặp · quầy không còn buồng hoặc chỗ trống ⇒ #26 */
  if (!settings.shifts.length) resourceNotice = msg('I001-75');
  else if (!settings.tables.length) resourceNotice = NO_TABLE;   /* quầy chưa có buồng ⇒ hướng dẫn cài đặt kèm link, không báo hết chỗ */
  else if ((settings.minStart == null || settings.minStart < 24 * 60) && !hasAnyFit(settings)) resourceNotice = counterFullMessage(resource.counter.name);
  if (resourceNotice) { hideSlotGrid(); return; }
  timelineSettings = settings;
  if (block) block.style.display = '';
  const hint = $('nhacChuaDu'); if (hint) hint.style.display = 'none';
  const keptEnd = pick ? pick.start + fitDuration(timelineSettings, pick.start, minutes) : 0;
  const kept = keepPick && pick && fitsTimeline(timelineSettings, pick.tableCode, pick.start, keptEnd) ? pick : null;
  if (timeline) timeline.update({ ...timelineSettings, value: null });
  else timeline = mountTablePicker(grid, { ...timelineSettings, value: null }, { onChange: onTimelineChange });
  if (kept) applyPick(kept.start, keptEnd, kept.tableCode);
  else { const had = !!pick; clearPick(); setSlotHint(had && keepPick ? msg('E001-36', minutes) : ''); }
}
/* dựng lại dãy nhà, quầy và thời lượng khi đổi người cai nghiện — gọi ở mỗi lần kiểm bước 2, chỉ làm lại khi người đổi */
/* quầy MẶC ĐỊNH theo dãy nhà, chọn được quầy Hoạt động khác (pickedCounterCode); đổi người cai nghiện ⇒ về quầy mặc định */
let pickedCounterCode = '';
export const counterState = () => ({ resource, warning: counterWarning() });
export function changeCounter(code) {
  if (!resource) return;
  pickedCounterCode = code || '';
  const old = resource.counter;
  resource = null;   /* buộc dựng lại thời lượng, lưới theo quầy mới */
  ensureResource(old);
  showFieldError('oQuay', '');
  render();
}
/* ⑳ cảnh báo vàng dưới ô Quầy — cũng là câu ghi Lịch sử thao tác khi lưu */
function counterWarning() {
  if (!resource || !S.student) return '';
  const def = resource.defaultCounter, cur = resource.counter;
  if (!def) return msg('W001-18', resource.dormitoryCode ? 'dãy nhà **' + resource.dormitoryName + '** chưa thuộc quầy nào đang hoạt động' : 'chưa được xếp dãy nhà');
  if (cur && cur.code !== def.code) return msg('W001-19', counterLabel(def));
  return '';
}
/* quầy tiếp đón ghi ở Nội dung thay đổi, khác quầy mặc định ⇒ «(chọn tay)» */
const counterChangeRows = (code) => (code ? [['Quầy tiếp đón', '—', counterLabelOf(code) + (counterWarning() ? ' (chọn tay)' : '')]] : []);
function ensureResource(oldCounter) {
  const student = S.student, key = student ? (student.studentCode || student.fullName || '') : '';
  if ((resource ? resource.key : '') === key) return;
  if (oldCounter === undefined) pickedCounterCode = '';   /* đổi người cai nghiện ⇒ bỏ quầy chọn tay */
  const prevCounter = oldCounter !== undefined ? oldCounter : (resource && resource.counter);
  const durationSelect = $('oThoiLuong'), startSelect = $('oGioBatDau'), endInput = $('oGioKetThuc'), tableInput = $('oBanDaChon');
  const lock = (el, text) => { if (el) { el.innerHTML = '<option>' + text + '</option>'; el.disabled = true; } };
  const base = student ? studentResource(student.studentCode) : null;
  const picked = pickedCounterCode ? activeCounters().find((c) => c.code === pickedCounterCode) : null;
  resource = base ? { ...base, defaultCounter: base.counter, counter: picked || base.counter, key } : null;
  resourceNotice = ''; noCounterDorm = '';   /* ⑳ không chặn khi thiếu quầy mặc định — cảnh báo vàng dưới ô Quầy */
  { const old = counterStaffKeys(prevCounter); if (old.length) S.notifyRecipients = { ...S.notifyRecipients, VISIT_TEAM: (S.notifyRecipients.VISIT_TEAM || []).filter((k) => old.indexOf(k) < 0) }; }   /* ⑳ */
  const dorm = $('oDayNha');
  if (dorm) dorm.value = resource ? resource.dormitoryName : '';
  if (endInput) endInput.value = '';
  setSlotHint('');
  if (!resource || !resource.counter) {
    lock(durationSelect, resource ? 'Chọn quầy tiếp đón trước' : 'Chọn người cai nghiện trước'); lock(startSelect, 'Chọn thời lượng trước');
    if (tableInput) tableInput.value = '';
    hideSlotGrid(); hideTableFields();
    return;
  }
  if (durationSelect) {
    durationSelect.disabled = false;
    durationSelect.innerHTML = '<option value="">Chọn thời lượng</option>' + bookingSettings().durationMinutes.map((n) => '<option value="' + n + '">' + n + ' phút</option>').join('');
    const visitType = VISIT_TYPE_DURATIONS.find((x) => x.visitTypeName === 'Thăm gặp trực tiếp tiêu chuẩn');
    if (visitType && durationSelect.querySelector('option[value="' + visitType.durationMinutes + '"]')) durationSelect.value = String(visitType.durationMinutes);
    if (durationSelect.__syncSearch) durationSelect.__syncSearch();
  }
  if (tableInput) tableInput.value = '';
  hideSlotGrid();
  renderSlotGrid(false);
}
function bindResourceSelects() {
  const durationSelect = $('oThoiLuong'), startSelect = $('oGioBatDau'), endInput = $('oGioKetThuc'), tableInput = $('oBanDaChon');
  if (!durationSelect || !startSelect || !tableInput) return;
  slots = [];
  durationSelect.addEventListener('change', () => { renderSlotGrid(true); });
  startSelect.addEventListener('change', () => {
    const slot = slots[+startSelect.value];
    if (!slot) { endInput.value = ''; if (tableInput) tableInput.value = ''; hideTableFields(); return; }
    endInput.value = toClock(slot.end);
    const tableBlock = $('khoiBan'); if (tableBlock) tableBlock.classList.remove('is-hidden');
    const timeBlock = $('khoiThoiGian'), timeInput = $('oThoiGianDaChon');
    if (timeBlock) timeBlock.classList.remove('is-hidden');
    if (timeInput) timeInput.value = toClock(slot.start) + ' — ' + toClock(slot.end);
    if (!tableInput.value) tableInput.value = 'Chưa xếp buồng — xếp sau';
  });
}
export function applyVisitTypeDuration() {
  const typeSelect = $('oLoaiHinh'), durationSelect = $('oThoiLuong');
  if (!typeSelect || !durationSelect || !durationSelect.options.length) return;
  const type = VISIT_TYPE_DURATIONS.find((x) => x.visitTypeName === typeSelect.value);
  const limit = (type ? type.durationMinutes : 0) || 60;
  [...durationSelect.options].forEach((o) => { if (o.value) o.hidden = (+o.value) > limit; });
}

/* ───── Visit date picker (.lich1) ───── */
const picker = { el: null, month: null };
let gridViewDate = new Date();
let pickerForVisitDate = false;
const closePicker = () => { if (picker.el) picker.el.classList.remove('is-open'); };
function positionPicker() {
  const anchor = $(pickerForVisitDate ? 'nutNgayHen' : 'nutNgayLuoi');
  if (!anchor) return;
  const n = anchor.getBoundingClientRect(), w = picker.el.offsetWidth, h = picker.el.offsetHeight;
  let x = n.left; if (x + w > innerWidth - 8) x = innerWidth - w - 8; if (x < 8) x = 8;
  let y = n.bottom + 6;
  if (y + h > innerHeight - 8 && n.top - h - 6 > 8) y = n.top - h - 6;
  picker.el.style.left = x + 'px'; picker.el.style.top = y + 'px';
}
const pickerBaseDate = () => (pickerForVisitDate && visitDate ? visitDate : gridViewDate);
const renderPicker = () => { picker.el.innerHTML = datePickerHtml(picker.month, pickerBaseDate()); };
function onPickerClick(e) {
  const nav = e.target.closest('.date-picker-nav');
  if (nav) { const step = +nav.dataset.buoc; picker.month = new Date(picker.month.getFullYear(), picker.month.getMonth() + step, 1); renderPicker(); return; }
  const cell = e.target.closest('.date-picker-day');
  if (!cell) return;
  const d = new Date(+cell.dataset.t);
  if (pickerForVisitDate) { setVisitDate(d); pickerForVisitDate = false; } else { gridViewDate = d; }
  closePicker();
}
function openPicker(e) {
  if (e) e.stopPropagation();
  if (!picker.el) {
    picker.el = document.createElement('div');
    picker.el.className = 'date-picker';
    picker.el.addEventListener('mousedown', (x) => x.preventDefault());
    picker.el.addEventListener('click', onPickerClick);
    document.body.appendChild(picker.el);
    document.addEventListener('mousedown', (x) => { if (picker.el.classList.contains('is-open') && !x.target.closest('.date-picker') && !x.target.closest('.cal-date')) closePicker(); });
    document.addEventListener('keydown', (x) => { if (x.key === 'Escape') closePicker(); });
    window.addEventListener('resize', closePicker);
  }
  if (picker.el.classList.contains('is-open')) { closePicker(); return; }
  const d = pickerBaseDate();
  picker.month = new Date(d.getFullYear(), d.getMonth(), 1);
  renderPicker();
  picker.el.classList.add('is-open');
  positionPicker();
}
export function openVisitDatePicker(e) {
  if (e) e.stopPropagation();
  gridViewDate = visitDate || new Date();
  /* Bật cờ TRƯỚC khi mở: positionPicker đọc cờ này để neo lịch dưới nút Ngày hẹn. Bật sau thì lịch không được đặt toạ độ,
 * rơi xuống đáy trang và người dùng không thấy (đo thật: lịch ở y=1000 trên màn cao 1000px) */
  const wasOpen = picker.el && picker.el.classList.contains('is-open');
  pickerForVisitDate = !wasOpen;
  openPicker(e);
}
function setVisitDate(d) {
  const sameDay = !!visitDate && isoDate(visitDate) === isoDate(d);   /* chọn lại đúng ngày đang chọn ⇒ giữ chỗ đã chọn trên lịch */
  visitDate = d;
  hideFieldError('oNgay');   /* đã chọn ngày ⇒ bỏ chữ đỏ của Ngày thăm gặp */
  const WEEKDAYS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const pad = (n) => String(n).padStart(2, '0');
  const el = $('nhanNgayHen');
  if (el) el.textContent = WEEKDAYS[d.getDay()] + ', ' + pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear();
  renderSlotGrid(sameDay);
}
export const selectToday = () => setVisitDate(new Date());

export function countCharacters(el) {
  const limit = +el.getAttribute('maxlength') || 1000, n = el.value.length, counter = $('demGhiChu');
  if (!counter) return;
  counter.textContent = n + ' / ' + limit;   /* khuôn bộ đếm chung «n / max» của AppCounterInput */
  counter.classList.toggle('is-near-limit', n >= limit * 0.9 && n < limit);
  counter.classList.toggle('day', n >= limit);
}

/* ───── Searchable select (wraps the native select) ───── */
/* Ô chọn có tìm: dùng bản chung src/lib/searchSelect.js — đã bỏ bản chép tại đây */
import { attachSearch } from '@/lib/searchSelect';
export { attachSearch };
function attachSearchToAllSelects() {
  document.querySelectorAll('.card select.text-input').forEach((sel) => { if (sel.options.length <= 1 && !sel.disabled) return; attachSearch(sel); });
}

/* ───── Step 1: look up the relative, pick the student ───── */
const formatMessage = (code, vars) => { let text = MESSAGES[code] || code; Object.keys(vars || {}).forEach((k) => { text = text.split('{' + k + '}').join(vars[k]); }); return text; };
function showLookupError(text) {
  const el = $('loiTraCuu'), wrap = document.querySelector('.lookup-field');
  if (!el) return;
  el.innerHTML = keyHtml(text);
  el.classList.add('is-visible');
  if (wrap) wrap.classList.add('is-error');
  const input = $('oTraCuu');
  if (input) alignError(el, input);
}
export function clearLookupError() {
  const el = $('loiTraCuu'), wrap = document.querySelector('.lookup-field');
  if (el) el.classList.remove('is-visible');
  if (wrap) wrap.classList.remove('is-error');
}
export function lookupRelative() {
  const input = $('oTraCuu'), result = $('ketQuaTra'), studentBlock = $('khoiNCN'), companionBlock = $('khoiDiCung');
  if (!input || !result) return;
  const query = input.value.replace(/\s/g, '');
  let found = null;
  RELATIVES.forEach((r) => { if (r.citizenId === query || r.phoneNumber === query) found = r; });
  hideFieldError('oTraCuu');   /* đã tra cứu (gõ tay hoặc quẹt thẻ) ⇒ bỏ chữ đỏ «Vui lòng chọn» của bước 1 */
  /* tra lại đúng thân nhân đang hiện ⇒ giữ người cai nghiện và thân nhân đi cùng đã chọn */
  if (found && S.lookupResult === 'card' && S.relative && S.relative.citizenId === found.citizenId) { S.lookupKey = input.value; clearLookupError(); render(); updateButtons(); return; }
  S.student = null;
  if (companionBlock) companionBlock.classList.add('is-hidden');
  if (!found) {
    S.relative = null;
    if (studentBlock) studentBlock.classList.add('is-hidden');
    if (!query) { showLookupError(msg('E001-01', 'số căn cước công dân hoặc số điện thoại của thân nhân')); S.lookupResult = null; }
    else { showLookupError(msg('E001-35', query)); S.lookupResult = { notFound: query }; }
    render();
    updateButtons();
    return;
  }
  clearLookupError();
  S.relative = { ...found }; S.lookupKey = input.value;
  S.lookupResult = 'card';
  S.students = S.relative.students; S.selectedStudentIndex = -1;
  render();
  if (studentBlock) studentBlock.classList.remove('is-hidden');
}
export function selectStudent(i) {
  if (!S.relative) return;
  const student = S.relative.students[i];
  if (!student || !checkVisitEligibility(student).ok) return;
  hideFieldError('oTraCuu');   /* đã chọn người cai nghiện ⇒ bỏ chữ đỏ của bước 1 */
  const same = i === S.selectedStudentIndex && S.student === student;   /* chọn lại đúng người đang chọn ⇒ giữ thân nhân đi cùng */
  S.student = student; S.selectedStudentIndex = i;
  const block = $('khoiDiCung'); if (block) block.classList.remove('is-hidden');
  if (!same) loadCompanionsForStudent();
  render();
}
/* ô tra cứu — bỏ hoặc đổi số CCCD/SĐT đã tra ⇒ bỏ kết quả tra cứu cũ (thẻ thân nhân, danh sách người cai nghiện, thân nhân đi cùng), cùng cách màn Tạo lịch hẹn */
export function typeLookup(value) {
  clearLookupError();
  /* XOÁ TRẮNG ô ⇒ bỏ kết quả tra cứu cũ · SỬA sang số khác ⇒ giữ, phải bấm Tra cứu mới đổi */
  const stale = S.lookupResult && !String(value || '').replace(/\s/g, '');
  if (stale) {
    S.relative = null; S.student = null; S.lookupResult = null; S.students = []; S.selectedStudentIndex = -1;
    ['khoiNCN', 'khoiDiCung'].forEach((id) => { const b = $(id); if (b) b.classList.add('is-hidden'); });
    /* khung giờ, buồng ở bước 2 giữ theo người cai nghiện (ensureResource so khoá người) ⇒ chọn người khác sẽ tự dựng lại */
    render();
  }
  updateButtons();
}
export const openCardSwipe = () => { S.dialog = 'dlgQuetThe'; S.cardPicking = false; render(); };
export const pickCardSwipe = () => { S.cardPicking = true; render(); };   /* mở bảng thân nhân mẫu */
export const closeCardSwipe = () => { if (S.dialog === 'dlgQuetThe') { S.dialog = ''; render(); } };
export function simulateCardSwipe(citizenId) {
  S.cardPicking = false; S.cardRead = citizenId; render();   /* số căn cước của thân nhân mẫu vừa chọn */
  setTimeout(() => {
    closeCardSwipe();
    const input = $('oTraCuu'); if (input) input.value = citizenId;
    lookupRelative();
    S.cardRead = false; render();
  }, 900);
}
export function openRelativeDetail() {
  if (!S.relative) return;
  /* Thân popup do components/app/RelativeDetailBody vẽ, dùng chung với màn Tạo lịch hẹn và Chi tiết lịch hẹn */
  S.dialog = 'dlgChiTietTN'; render();
}
export const closeRelativeDetail = () => { if (S.dialog === 'dlgChiTietTN') { S.dialog = ''; render(); } };

/* ───── Companion table (rows kept in S.companionRows) ───── */
const CHOOSE_OPTION = { value: '', label: 'Chọn thân nhân đi cùng' };
/* Người đi kèm THẬT: luồng thường lấy dòng đã chọn người (bỏ dòng còn chữ gợi ý), đơn ngoại lệ lấy danh sách khai tay trong đơn */
export function companionEntries() {
  if (S.route === ROUTE_EXEMPTION) return S.exempt.hasCompanions ? (S.exempt.companions || []).filter((c) => String(c.fullName || '').trim()).map((c) => ({ name: c.fullName.trim(), relationship: c.relationship || '', citizenId: String(c.citizenId || '').trim() })) : [];
  return S.companionRows.filter((row) => row.value && row.value !== PLACEHOLDER_OPTION.label).map((row) => { const o = selectedOption(row); return { name: row.value, relationship: (o && o.relationship) || '', citizenId: (o && o.citizenId) || '', birthDateText: (o && o.birthDateText) || '' }; });
}
const EMPTY_OPTION = { value: '', label: 'Người này không có thân nhân nào khác liên kết' };
const optionsFrom = (people) => [CHOOSE_OPTION].concat(people.map((x) => ({ value: x.fullName, label: x.fullName, relationship: x.relationship, citizenId: x.citizenId, birthDateText: toDisplayDate(x.birthDate) || '' })));
function remainingCompanions(row) {
  const takenElsewhere = S.companionRows.filter((x) => x !== row && x.value).map((x) => x.value);
  return ((S.student && S.student.linkedRelatives) || [])
    .filter((x) => !S.relative || x.fullName !== S.relative.fullName)
    .filter((x) => takenElsewhere.indexOf(x.fullName) < 0);
}
/* reload a row's options — generation bumps so React replaces every <option>, like setting innerHTML */
const loadRow = (row, options, disabled, value) => { row.options = options; row.disabled = disabled; row.value = value; row.generation = S.seq++; };
function markAddButton() { S.addButtonTouched = true; }
export function addCompanionRow() {
  if (S.companionRows.length >= MAX_COMPANIONS) return;
  const row = { id: S.seq++, relationship: '', citizenId: '', value: '' };
  const people = remainingCompanions(row);
  if (!people.length) loadRow(row, [EMPTY_OPTION], true, ''); else loadRow(row, optionsFrom(people), false, '');
  S.companionRows.push(row);
  markAddButton();
  render();
}
function reloadCompanionRows() {
  S.companionRows.forEach((row) => {
    const current = row.value;
    const people = remainingCompanions(row);
    if (!people.length) loadRow(row, [EMPTY_OPTION], true, '');
    else { const options = optionsFrom(people); loadRow(row, options, false, current && options.some((o) => optionValue(o) === current) ? current : ''); }
    if (!row.value) { row.relationship = ''; row.citizenId = ''; }   /* dòng mất người đã chọn ⇒ bỏ luôn Quan hệ, CCCD */
  });
}
export function removeCompanionRow(row) {
  if (S.companionRows.length <= 1) {
    const first = S.companionRows[0];
    first.value = first.options.length ? optionValue(first.options[0]) : ''; first.relationship = ''; first.citizenId = '';
    reloadCompanionRows();
    render();
    return;
  }
  S.companionRows = S.companionRows.filter((x) => x !== row);
  reloadCompanionRows();
  markAddButton();
  render();
}
export function selectCompanion(row, value) {
  row.value = value;
  const option = selectedOption(row);
  const known = option && optionValue(option) && option.relationship !== undefined;
  row.relationship = known ? (option.relationship || '') : ''; row.citizenId = known ? (option.citizenId || '') : '';
  reloadCompanionRows();   /* người vừa chọn rời khỏi danh sách chọn của các dòng khác (giữ người các dòng khác đang chọn) */
  render();
}
function resetCompanionTable() {
  S.companionRows = S.companionRows.slice(0, 1);
  if (S.companionRows[0]) { S.companionRows[0].relationship = ''; S.companionRows[0].citizenId = ''; }
  markAddButton();
}
function loadCompanionsForStudent() {
  resetCompanionTable();
  S.companionRows.forEach((row) => {
    const people = remainingCompanions(row);
    if (!people.length) loadRow(row, [EMPTY_OPTION], true, ''); else loadRow(row, optionsFrom(people), false, '');
  });
}
/* legacy "student + relative" block (hidden) — kept for code compatibility */
const profileRelatives = (studentCode) => { const profile = STUDENT_RELATIVES.find((s) => s.studentCode === studentCode); return profile ? profile.relatives : []; };
function loadCompanionsFromProfile(registrantName) {
  const studentSelect = $('oNguoiCN');
  const people = profileRelatives(studentSelect ? studentSelect.value : '').filter((x) => x.fullName !== registrantName);
  S.companionRows.forEach((row) => {
    if (!registrantName) { loadRow(row, [PLACEHOLDER_OPTION], true, PLACEHOLDER_OPTION.label); row.relationship = ''; row.citizenId = ''; return; }
    loadRow(row, [CHOOSE_OPTION].concat(people.map((x) => ({ value: x.fullName, label: x.fullName }))), false, '');
  });
  render();
}
function bindProfileSelects() {
  const studentSelect = $('oNguoiCN'), relativeSelect = $('oThanNhan'), relationshipInput = $('oQuanHe');
  if (!studentSelect || !relativeSelect) return;
  studentSelect.addEventListener('change', () => {
    const people = profileRelatives(studentSelect.value);
    relativeSelect.innerHTML = '';
    if (!people.length) { relativeSelect.innerHTML = '<option>Chọn người cai nghiện trước</option>'; relativeSelect.disabled = true; if (relationshipInput) relationshipInput.value = ''; loadCompanionsFromProfile(null); return; }
    const first = document.createElement('option'); first.value = ''; first.textContent = 'Chọn thân nhân người cai nghiện'; relativeSelect.appendChild(first);
    people.forEach((x) => { const o = document.createElement('option'); o.value = x.fullName; o.textContent = x.fullName + ' — ' + x.citizenId; relativeSelect.appendChild(o); });
    relativeSelect.disabled = false;
    if (relationshipInput) relationshipInput.value = '';
    loadCompanionsFromProfile(null);
  });
  relativeSelect.addEventListener('change', () => {
    const person = profileRelatives(studentSelect.value).filter((x) => x.fullName === relativeSelect.value)[0];
    if (relationshipInput) relationshipInput.value = person ? person.relationship : '';
    loadCompanionsFromProfile(person ? person.fullName : null);
  });
}

/* ───── Red error text under fields ───── */
function findField(fieldId) {
  let el = $(fieldId);
  if (el) return el;
  const LOOKUP = { oNgay: () => $('nutNgayHen'), oBan: () => $('oBanDaChon') };
  el = LOOKUP[fieldId] ? LOOKUP[fieldId]() : null;
  if (el && !el.id) el.id = fieldId;
  return el;
}
const fieldFrame = (el) => (el.closest && (el.closest('.select-field') || el.closest('.app-counter-wrap'))) || el;   /* ô có bộ đếm: chữ đỏ dưới cả khung, không chen vào giữa ô và bộ đếm */
function alignError(errorEl, el) {
  if (!errorEl || !el || !el.getBoundingClientRect) return;
  errorEl.style.paddingLeft = '0px'; errorEl.style.marginTop = '';
  if (!/^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(el.tagName)) {
    if (el.id !== 'nhacChuaDu') return;
    if (!el.getBoundingClientRect().height) { const grid = $('khoiLuoiGio'); if (grid && grid.getBoundingClientRect().height) el = grid; }
  }
  const rect = el.getBoundingClientRect(); if (!rect.width) return;
  const gap = errorEl.getBoundingClientRect().top - rect.bottom;
  if (Math.abs(gap - 4) > 0.5) errorEl.style.marginTop = (parseFloat(getComputedStyle(errorEl).marginTop) - (gap - 4)) + 'px';
}
export function showFieldError(fieldId, text) {
  let el = findField(fieldId), fixed = false;
  if (fieldId === 'oGioBatDau') { const hint = $('nhacChuaDu'); if (hint) { el = hint; fixed = true; } }
  if (!el) return null;
  let frame = fieldFrame(el);
  if (!fixed && frame.getBoundingClientRect().width === 0) {
    const anchorId = STEP_ANCHOR_FIELD[S.step];
    const anchor = anchorId ? $(anchorId) : null;
    if (!anchor || anchor.getBoundingClientRect().width === 0) return null;
    el = anchor; frame = fieldFrame(anchor);
  }
  const errorId = (el.id || fieldId) + 'Loi';
  let errorEl = $(errorId);
  if (!errorEl) {
    errorEl = document.createElement('span'); errorEl.className = 'field-error'; errorEl.id = errorId;
    /* textarea có bộ đếm (AppCounterInput multiline): chữ đỏ vào hàng chân [chữ đỏ | bộ đếm], ngay dưới ô */
    const foot = frame.classList && frame.classList.contains('is-multiline') ? frame.querySelector(':scope > .app-counter-foot') : null;
    if (foot) foot.insertBefore(errorEl, foot.firstChild);
    else if (frame.parentElement) frame.parentElement.insertBefore(errorEl, frame.nextSibling); else return null;
  }
  const border = frame.querySelector ? (frame.querySelector('.lookup-input') || frame) : frame;
  if (!text) { errorEl.textContent = ''; errorEl.classList.remove('on'); if (border.classList) border.classList.remove('input-border-error'); return null; }
  const previous = errorEl.textContent.trim();
  const ghep = (previous && previous.indexOf(plainText(text)) < 0) ? (previous + ' · ' + text) : text;
  errorEl.innerHTML = keyHtml(ghep);   /* key in đậm */
  errorEl.classList.add('on');
  alignError(errorEl, border);
  if (border.classList && /^(INPUT|SELECT|BUTTON|TEXTAREA)$/.test(border.tagName)) border.classList.add('input-border-error');
  return errorEl;
}
/* bỏ chữ đỏ dưới 1 ô — chỉ xoá chữ đỏ đã có (kể cả khi ô đang ẩn), không tạo thêm khung chữ đỏ */
function hideFieldError(fieldId) {
  const el = findField(fieldId), errorEl = $(((el && el.id) || fieldId) + 'Loi');
  if (errorEl) { errorEl.textContent = ''; errorEl.classList.remove('on'); }
  const frame = el ? fieldFrame(el) : null, border = frame && frame.querySelector ? (frame.querySelector('.lookup-input') || frame) : frame;
  if (border && border.classList) border.classList.remove('input-border-error');
}
function clearFieldErrors() {
  document.querySelectorAll('.field-error.on').forEach((e) => { e.textContent = ''; e.classList.remove('on'); });
  document.querySelectorAll('.input-border-error').forEach((el) => el.classList.remove('input-border-error'));
}
const midSentence = (name) => {
  const text = String(name || '');
  if (!text) return text;
  if (PROPER_NAMES.some((p) => text.indexOf(p) === 0)) return text;
  const word = text.split(' ')[0];
  if (word.length > 1 && word === word.toUpperCase()) return text;
  return text.charAt(0).toLocaleLowerCase('vi') + text.slice(1);
};
const afterColon = (list) => list.map((t, i) => { const x = midSentence(t); return i === 0 ? x.charAt(0).toLocaleUpperCase('vi') + x.slice(1) : x; });

/* ───── Per-step completeness ───── */
function missingInStep(step) {
  const missing = [];
  if (step === 1) {
    if (!S.route) missing.push('Luồng đăng ký');
    else if (S.route === ROUTE_EXEMPTION) missing.push(...missingExemption(S.exempt));
    else {
      if (!S.relative) missing.push('Thân nhân người cai nghiện');
      if (!S.student) missing.push('Người cai nghiện');
    }
  } else if (step === 2) {
    if (!isChosen($('oLoaiHinh'))) missing.push('Loại hình thăm gặp');
    ensureResource();
    const noCounter = !resource || !resource.counter;   /* chưa có quầy thì chặn chọn giờ, buồng — chỉ báo #25 */
    const dateLabel = (($('nhanNgayHen') || {}).textContent || '').trim();
    if (!dateLabel || /^Chọn/.test(dateLabel)) missing.push('Ngày thăm gặp');
    if (noCounter) { missing.push('Quầy tiếp đón', 'Khung giờ'); return missing; }   /* chưa chọn quầy */
    if (!isChosen($('oThoiLuong'))) missing.push('Thời lượng');
    const startText = String(($('oGioBatDau') || {}).value || '').trim();
    const startIndex = startText === '' ? -1 : +startText;
    if (!(startIndex >= 0 && slots[startIndex])) missing.push('Khung giờ');
    const tableBlock = $('khoiBan'), tableInput = $('oBanDaChon');
    if (tableBlock && !tableBlock.classList.contains('is-hidden') && tableInput && !tableInput.value.trim()) missing.push('Buồng thăm gặp');
  } else if (step === 3 && S.route !== ROUTE_EXEMPTION) {   /* đơn xin duyệt chính là xin miễn giấy tờ — không chặn ở bước đối chiếu */
    const people = S.participants || [];
    const unchecked = people.filter((x, i) => !S.checkResults[i]).length;
    if (unchecked) missing.push('Đối chiếu giấy tờ cho ' + unchecked + ' người còn lại');
    const failed = people.filter((x, i) => S.checkResults[i] && S.checkResults[i] !== 'Khớp');
    if (failed.length) missing.push('Giấy tờ chưa khớp: ' + failed.map((x) => x.fullName).join(', '));
  }
  return missing;
}
function validateStep() {
  clearFieldErrors();
  const missing = missingInStep(S.step);
  if (!missing.length) return true;
  let first = null;
  /* chưa có quầy: câu #25 đã ở khối lưới, không báo thêm chữ đỏ cho Khung giờ */
  const noCounter = !resource || !resource.counter;
  missing.forEach((name) => { const fieldId = FIELD_ID_BY_LABEL[name] || companionFieldId(name); if (!fieldId || (noCounter && name === 'Khung giờ')) return; const e = showFieldError(fieldId, msg(TYPED_FIELD_IDS.includes(fieldId) || /^xdDiKem(Ten|Cccd)/.test(fieldId) ? 'E001-01' : 'E001-02', midSentence(name))); if (e && !first) first = e; });   /* dòng thân nhân đi cùng báo đỏ ngay dưới ô */
  if (first && first.scrollIntoView) {
    const r = first.getBoundingClientRect();
    if (r.top < 0 || r.bottom > (window.innerHeight || 0)) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  return false;
}
const ICON_READY = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>';
const ICON_MISSING = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>';
export function updateButtons() {
  const missing = missingInStep(S.step);
  const ready = missing.length === 0;
  const el = $('nhacThieu');
  if (el) {
    el.classList.toggle('is-hidden-block', S.step === 3);
    el.classList.toggle('is-enough', ready);
    el.innerHTML = ready ? ICON_READY + '<div>' + keyHtml(msg('I001-81')) + '</div>'
      : ICON_MISSING + '<div>' + keyHtml(msg('W001-12', afterColon(missing).join('**, **'))) + '</div>';
  }
  ['nutTien', 'nutTienDau'].forEach((id) => { const b = $(id); if (!b) return; b.disabled = false; b.title = ready ? '' : 'Còn thiếu: ' + afterColon(missing).join(', '); });
  ['nutCho', 'nutChoDau'].forEach((id) => { const b = $(id); if (b) b.disabled = false; });
}

/* ───── Step bar + footer buttons ───── */
function requiresSharedQuota() { const slot = slots[+(($('oGioBatDau') || {}).value || -1)]; return !!(slot && slot.isCounterQuotaFull); }
function renderStep() {
  document.querySelectorAll('.card[data-buoc]').forEach((card) => card.classList.toggle('is-hidden-block', +card.dataset.buoc !== S.step));
  document.querySelectorAll('.step').forEach((marker) => {
    const n = +marker.dataset.b;
    marker.classList.toggle('is-current', n === S.step);
    marker.classList.toggle('is-done', n < S.step);
    marker.querySelector('.step-number').textContent = n < S.step ? '✓' : String(n);
  });
  const backButton = $('nutLui'), waitButton = $('nutCho'), headerWaitButton = $('nutChoDau');
  /* thanh đầu trang và chân trang là 1 cặp: nút đầu trang mang hậu tố Dau, ẩn hiện theo đúng nút chân trang */
  [backButton, $('nutLuiDau')].forEach((b) => { if (b) b.classList.toggle('is-hidden-block', S.step === 1); });
  if (waitButton) waitButton.classList.toggle('is-hidden-block', S.step !== 3);
  ['nutNhapDau', 'nutChoDau'].forEach((id) => { const x = $(id); if (x) x.classList.toggle('is-hidden-block', S.step !== 3); });
  const sharedQuota = S.step === 3 && requiresSharedQuota();
  if (waitButton) waitButton.classList.toggle('is-hidden-block', S.step !== 3 || sharedQuota);
  if (headerWaitButton) headerWaitButton.classList.toggle('is-hidden-block', S.step !== 3 || sharedQuota);
  S.needsSharedQuota = sharedQuota;
  S.labels = { ...S.labels, next: sharedQuota ? SHARED_QUOTA_LABEL : NEXT_LABELS[S.step], headerSave: sharedQuota ? SHARED_QUOTA_LABEL : NEXT_LABELS[3] };
  if (S.route === ROUTE_EXEMPTION) {   /* đơn xin duyệt chỉ có 1 nút gửi, chưa check-in được tới khi Trưởng cơ sở duyệt */
    S.labels = { ...S.labels, next: S.step === 3 ? 'Lưu và gửi duyệt' : NEXT_LABELS[S.step], headerSave: 'Lưu và gửi duyệt' };
    if (waitButton) waitButton.classList.add('is-hidden-block'); if (headerWaitButton) headerWaitButton.classList.add('is-hidden-block');
  }
  if (S.step === 3) { buildSummary(); buildParticipants(); renderDocumentCheck(); }
  render();
  updateButtons();
  scrollTo({ top: 0, behavior: 'smooth' });
}
/* sửa số mà chưa bấm Tra cứu ⇒ khi Tiếp tục tự trả ô về số đã tra, để ô khớp thẻ thân nhân đang dùng */
function restoreLookupText() {
  const input = $('oTraCuu');
  if (input && S.lookupResult === 'card' && S.lookupKey != null && input.value.replace(/\s/g, '') !== S.lookupKey.replace(/\s/g, '')) { input.value = S.lookupKey; clearLookupError(); }
}
export function nextStep() {
  restoreLookupText();
  if (!validateStep()) { updateButtons(); return; }
  if (S.step >= 3) {
    if (S.route === ROUTE_EXEMPTION) { saveRegistration(false); return; }   /* gửi duyệt, không check-in */
    /* check-in khác ngày hẹn ⇒ cảnh báo trước (TT79 khoản 1 Điều 34) */
    const d = /(\d{2}\/\d{2}\/\d{4})/.exec((($('nhanNgayHen') || {}).textContent || '')); const now = new Date(), p = (n) => String(n).padStart(2, '0');
    const today = p(now.getDate()) + '/' + p(now.getMonth() + 1) + '/' + now.getFullYear();
    if (d && d[1] !== today) { S.checkInDate = d[1]; S.dialog = 'dlgCheckInKhacNgay'; render(); return; }
    saveRegistration(true); return;
  }
  S.step++; renderStep();
}
export function previousStep() { if (S.step <= 1) return; S.step--; renderStep(); }
export const confirmSharedQuota = () => notifyInDevelopment();
const nowStamp = () => { const d = new Date(), p = (n) => String(n).padStart(2, '0'); return p(d.getDate()) + '/' + p(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds()); };
export const onPrimaryClick = () => (S.needsSharedQuota ? confirmSharedQuota() : nextStep());

/* ───── Step 3: document check + summary ───── */
export function buildParticipants() {
  const people = [];
  if (S.relative) people.push({ fullName: S.relative.fullName, citizenId: S.relative.citizenId, birthDateText: toDisplayDate(S.relative.birthDate), relationship: S.student ? S.student.relationship : '', isRegistrant: true });
  companionEntries().forEach((c) => people.push({ fullName: c.name, relationship: c.relationship, citizenId: c.citizenId, birthDateText: c.birthDateText || '', isRegistrant: false }));
  /* quay lại bước trước rồi Tiếp tục ⇒ giữ kết quả đối chiếu theo tên người (như Bỏ khỏi lượt), chỉ bỏ kết quả của người không còn trong lượt */
  const previousResults = {};
  (S.participants || []).forEach((x, j) => { if (x.fullName && S.checkResults[j]) previousResults[x.fullName] = S.checkResults[j]; });
  S.participants = people; S.checkResults = {}; S.checkedMarks = {};
  people.forEach((x, j) => { if (previousResults[x.fullName]) { S.checkResults[j] = previousResults[x.fullName]; S.checkedMarks[j] = true; } });
}
export function markDocument(i, result) {
  S.checkResults[i] = result; S.checkedMarks[i] = true;
  renderDocumentCheck();
  render();
  updateButtons();
}
export function removeParticipant(i) {
  const person = (S.participants || [])[i];
  if (!person || person.isRegistrant) return;
  const name = person.fullName;
  if (!name) return;
  const row = S.companionRows.find((x) => x.value === name);
  if (!row) return;
  removeCompanionRow(row);
  const previousResults = {};
  S.participants.forEach((x, j) => { if (x.fullName && S.checkResults[j]) previousResults[x.fullName] = S.checkResults[j]; });
  buildParticipants();
  S.participants.forEach((x, j) => { if (previousResults[x.fullName]) { S.checkResults[j] = previousResults[x.fullName]; S.checkedMarks[j] = true; } });
  renderDocumentCheck();
  buildSummary();
  render();
  updateButtons();
  toast(msg('I001-04', boldKey(name) + ' khỏi lượt thăm gặp'));
}
function renderQuotaWarning() {
  const el = $('canhSuat');
  if (!el) return;
  if (!requiresSharedQuota()) { el.innerHTML = ''; return; }
  el.innerHTML = '<div class="over-limit" style="margin-top:18px"><div class="over-limit-title">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>'
    + keyHtml(msg('W001-11')) + '</div>'
    + '<div class="over-limit-list" style="padding-left:0;margin-top:8px">'
    + 'Lượt này lấy sang phần chỗ của lịch đặt trước. Bấm '
    + '<b>Xác nhận dùng suất quỹ chung</b> để chuyển <b>Tổ trưởng Tổ tiếp nhận</b>. '
    + 'Tổ trưởng xác nhận xong, lượt này mới vào bước check-in.</div></div>';
}
const ICON_FAILED = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>';
const ICON_WARNING = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>';
const ICON_CLEAN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.1V12a10 10 0 1 1-5.9-9.1"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
function renderDocumentCheck() {
  const el = $('khoiVuot');
  if (!el) return;
  const cards = (S.participants || []).map((x, i) => ({ name: x.fullName, result: S.checkResults[i] }));
  if (!cards.length) { el.innerHTML = ''; return; }
  const unchecked = cards.filter((c) => !c.result);
  const failed = cards.filter((c) => c.result && c.result !== 'Khớp');
  if (failed.length) {
    el.innerHTML = '<div class="over-limit is-danger"><div class="over-limit-title">' + ICON_FAILED
      + keyHtml(msg('W001-13', failed.length, cards.length)) + '</div>'
      + '<ul class="over-limit-list">' + failed.map((c) => '<li><b>' + c.name + '</b>: ' + c.result + '</li>').join('')
      + (unchecked.length ? unchecked.map((c) => '<li>' + c.name + ': Chưa đối chiếu</li>').join('') : '')
      + '</ul>'
      + '<div class="over-limit-list" style="padding-left:0;margin-top:6px">'
      + 'Thân nhân chưa đạt phần đối chiếu giấy tờ thì <b>chưa vào thăm gặp được</b>. '
      + 'Bỏ người đó khỏi lượt, hoặc để thân nhân bổ sung giấy tờ rồi đối chiếu lại.</div>'
      + '</div>';
    return;
  }
  if (unchecked.length) {
    el.innerHTML = '<div class="over-limit"><div class="over-limit-title">' + ICON_WARNING
      + keyHtml(msg('W001-14', unchecked.length, cards.length)) + '</div>'
      + '<ul class="over-limit-list">' + unchecked.map((c) => '<li>' + c.name + ' — chọn Khớp, Không khớp hoặc Không xuất trình được</li>').join('') + '</ul></div>';
    return;
  }
  el.innerHTML = '<div class="over-limit is-clean"><div class="over-limit-title">' + ICON_CLEAN + keyHtml(msg('I001-92', cards.length)) + '</div></div>';
}
function buildSummary() {
  if (!$('bangDoiChieu')) return;
  const lockedSource = document.querySelector('.locked-value');
  const sourceText = lockedSource ? lockedSource.textContent.trim() : '';
  const slot = slots[+(($('oGioBatDau') || {}).value || -1)];
  const visitorCount = 1 + companionEntries().length;
  const student = S.student;
  /* row: { label, value, asTag, tagClass } */
  /* chia khối và thứ tự theo màn Tạo — group 0 = bước 1, group 1 = bước 2 (Khung giờ trước Thời lượng) */
  S.summaryRows = [
    { label: 'Nguồn đặt lịch', value: sourceText, asTag: true, group: 0 },
    { label: 'Người cai nghiện', value: student ? (student.fullName + ' — CCCD: ' + student.citizenId + ' — Ngày sinh: ' + toDisplayDate(student.birthDate)) : '', group: 0 },
    { label: 'Cán bộ quản lý', value: student ? (student.managerName || '') : '', group: 0 },
    { label: 'Số thân nhân tham gia', value: (S.relative ? visitorCount + ' người' : ''), group: 0 },
    { label: 'Loại hình thăm gặp', value: fieldText('oLoaiHinh'), asTag: true, tagClass: 'tag-type', group: 1 },
    { label: 'Dãy nhà', value: fieldTextByExactLabel('Dãy nhà'), asTag: true, tagClass: 'tag-category', group: 1 },
    { label: 'Quầy tiếp đón', value: fieldTextByExactLabel('Quầy tiếp đón'), asTag: true, tagClass: 'tag-category', group: 1 },
    { label: 'Ngày thăm gặp', value: ($('nhanNgayHen') || {}).textContent || '', group: 1 },
    { label: 'Khung giờ', value: slot ? (toClock(slot.start) + ' — ' + toClock(slot.end)) : '', group: 1 },
    { label: 'Thời lượng', value: fieldText('oThoiLuong'), asTag: true, group: 1 },
    { label: 'Buồng thăm gặp', value: fieldTextByExactLabel('Buồng thăm gặp'), asTag: true, tagClass: 'tag-table', group: 1 },
  ];
  renderQuotaWarning();
}

/* ───── Save the appointment (through the appointment store) ───── */
function nextCode() {
  let max = 921;
  readCreated().forEach((a) => { const m = /LH-\d{4}-(\d+)/.exec(a.code || ''); if (m && +m[1] > max) max = +m[1]; });
  return 'LH-2026-' + String(max + 1).padStart(4, '0');
}
const pad2 = (n) => String(n).padStart(2, '0');
const toIsoFromDate = (d) => d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
function collectAppointment(checkedIn) {
  const read = (id) => { const el = $(id); if (!el) return ''; if (el.tagName === 'SELECT') { const x = el.options[el.selectedIndex]; return x ? (x.textContent || '').trim() : ''; } return (el.value || '').trim(); };
  const byLabel = (label) => {
    const field = [...document.querySelectorAll('.field')].find((x) => { const l = x.querySelector('.field-label'); return l && l.textContent.indexOf(label) >= 0; });
    if (!field) return ''; const sel = field.querySelector('select'); if (!sel) return '';
    const x = sel.options[sel.selectedIndex]; return x ? (x.textContent || '').trim() : '';
  };
  const companionList = companionEntries(), companionNames = companionList.map((c) => c.name);
  const startText = String(($('oGioBatDau') || {}).value || '').trim();
  const startIndex = startText === '' ? -1 : +startText;
  const slot = slots[startIndex] ? slots[startIndex] : null;
  const time = slot ? toClock(slot.start) : '';
  const dateLabel = (($('nhanNgayHen') || {}).textContent || '').trim();
  const dateMatch = /(\d{2})\/(\d{2})\/(\d{4})/.exec(dateLabel);
  const student = S.student;
  return {
    code: nextCode(), createdAt: toIsoFromDate(new Date()),
    source: 'COUNTER', visitDate: dateMatch ? dateMatch[3] + '-' + dateMatch[2] + '-' + dateMatch[1] : dateLabel, visitTime: time,
    studentName: student ? student.fullName : '', studentCode: student ? (student.studentCode || '') : '', teamName: student ? (student.teamName || '') : '',
    studentCitizenId: student ? (student.citizenId || '') : '', studentBirthDate: student ? (student.birthDate || '') : '',
    visitorName: S.relative ? S.relative.fullName : '', companionCount: companionNames.length,
    companions: companionList.map((c) => ({ name: c.name, relationship: c.relationship, citizenId: c.citizenId })),
    relationship: student ? (student.relationship || '') : '', visitTypeName: read('oLoaiHinh'), tableCode: pick ? pick.tableCode : byLabel('Buồng thăm gặp'), counterCode: resource && resource.counter ? resource.counter.code : '',
    visitorCount: 1 + companionNames.length, durationMinutes: +(read('oThoiLuong').replace(/\D/g, '')) || 45,
    /* Duyệt tự động tại quầy · đã từng gặp thật ⇒ «Đăng ký và check-in» vào Hoàn thành check-in, «Đăng ký» vào Đã duyệt; chưa thì Chờ duyệt */
    /* đơn xin duyệt ⇒ Chờ Trưởng cơ sở duyệt (màn Lịch hẹn gặp trực tiếp ngoại lệ) · đã có sổ/tài khoản ⇒ «Đăng ký» Đã duyệt, «Đăng ký và check-in» Hoàn thành check-in */
    status: S.route === ROUTE_EXEMPTION ? 'PENDING_HEAD_APPROVAL' : (checkedIn ? 'CHECKED_IN' : 'APPROVED'),
    /* kết quả đối chiếu giấy tờ ở bước 3 — màn Chi tiết đọc lại, không suy từ trạng thái */
    documentChecks: (S.participants || []).map((x, i) => ({ fullName: x.fullName, isRegistrant: !!x.isRegistrant, result: S.checkResults[i] || '', at: nowStamp(), by: currentAccount().name })).filter((x) => x.result),
    approvalRoute: S.route, exemptionReason: S.route === ROUTE_EXEMPTION ? S.exempt.reason.trim() : '', visitorCitizenId: S.relative ? (S.relative.citizenId || '') : '',
    /* đơn ngoại lệ: lưu cả số điện thoại và tài liệu đính kèm để màn Sửa, Xem hiện đủ như màn Tạo */
    ...(S.route === ROUTE_EXEMPTION ? { visitorPhone: (S.exempt.phoneNumber || '').trim(), attachments: (S.exempt.attachments || []).map((f) => ({ name: f.name, size: f.size })) } : {}),
    notifyRecipients: { VISIT_TEAM: (S.notifyRecipients.VISIT_TEAM || []).filter((k) => counterStaffKeys(resource && resource.counter).indexOf(k) < 0), EXTRA: (S.notifyRecipients.EXTRA || []).slice(), off: (S.notifyRecipients.off || []).slice() },
    createdByKey: currentAccount().key,
    ui: { rowState: '' }, checkedIn: !!checkedIn, isNew: 1,
  };
}
export const setNotifyRecipients = (v) => { S.notifyRecipients = { VISIT_TEAM: v.VISIT_TEAM || [], EXTRA: v.EXTRA || [], off: v.off || [] }; };
let isSaving = false;
function saveRegistration(checkedIn) {
  if (isSaving) return;
  /* Cán bộ tổ thăm gặp bắt buộc khi đang tick */
  if (!isGroupOff(S.notifyRecipients, 'VISIT_TEAM') && !(S.notifyRecipients.VISIT_TEAM || []).length && !counterStaffKeys(resource && resource.counter).length) {   /* đọc bỏ tick qua hàm chung · ⑳ cán bộ quầy */ toast(msg('E001-02', 'cán bộ tổ thăm gặp nhận thông báo'), 'is-error'); return; }
  isSaving = true;
  let appointment, saved = false;
  try {
    appointment = collectAppointment(checkedIn);
    { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(appointment.visitDate || ''); const el = m ? checkVisitEligibility(S.student, new Date(), new Date(+m[1], +m[2] - 1, +m[3])) : { ok: true };
      if (!el.ok) { isSaving = false; toast(el.reason, 'is-error'); return; } }
    const list = readCreated({ strict: true });
    list.push(appointment);
    saved = writeCreated(list);
  } catch (e) { saved = false; }
  if (!saved) {
    toast(msg('SE001-01', 'lưu lịch hẹn'), 'is-error');
    isSaving = false;
    return;
  }
  /* tên thao tác theo TRẠNG THÁI THẬT sau khi lưu — lần đầu thăm gặp thì bấm "Đăng ký và check-in" vẫn vào Chờ duyệt, ⛔ ghi là đã check-in */
  const isCheckedIn = appointment.status === 'CHECKED_IN';
  /* đơn ngoại lệ Chờ duyệt ⇒ báo Cán bộ tổ thăm gặp + Trưởng cơ sở; Đăng ký vào thẳng Đã duyệt / Hoàn thành check-in ⇒ báo thân nhân */
  const sent = isPendingStatus(appointment.status) ? notifyPendingApproval(appointment, false)
    : sendActionNotification(NOTIFICATION_CODES.APPROVED, appointment, defaultRecipients(NOTIFICATION_CODES.APPROVED, [appointment]));
  logAction(appointment.code, isCheckedIn ? 'Đăng ký và check-in tại quầy' : 'Đăng ký tại quầy', { statusAfter: appointment.status,
    reason: isPendingStatus(appointment.status) ? (appointment.exemptionReason || '') : '', note: [isPendingStatus(appointment.status) && checkedIn ? 'Chưa check-in' : '', sent].filter(Boolean).join(' · '), changes: counterChangeRows(appointment.counterCode) });
  ['nutTien', 'nutCho', 'nutTienDau', 'nutChoDau'].forEach((id) => { const b = $(id); if (b) b.disabled = true; });
  /* đơn ngoại lệ về màn Lịch hẹn gặp trực tiếp ngoại lệ, lịch thân nhân hợp lệ về màn Thăm gặp trực tiếp */
  const toException = appointment.status === 'PENDING_HEAD_APPROVAL';
  setTimeout(() => { location.href = (toException ? ROUTES.exceptionList : ROUTES.appointmentList) + '?created=' + encodeURIComponent(appointment.code) + '&result=' + (toException ? 'exception' : 'counter'); }, 300);
}
export const registerWaitingCheckIn = () => saveRegistration(false);

/* ───── luồng đăng ký chọn từ đầu ───── */
function applyRouteVisibility() {
  const show = (id, on) => { const el = $(id); if (el) el.style.display = on ? '' : 'none'; };
  show('khoiTraCuuTN', S.route === ROUTE_LINKED); show('khoiXinDuyet', S.route === ROUTE_EXEMPTION);
  if (S.route !== ROUTE_LINKED) { const b = $('khoiNCN'); if (b) b.classList.add('is-hidden'); }
}
function syncExemption() { const rel = relativeFromExemption(S.exempt); S.relative = rel; S.student = rel ? rel.students[0] : null; }
export function setRoute(v) {
  if (S.route === v) return;
  S.route = v; S.relative = null; S.student = null; S.lookupResult = null; S.students = []; S.selectedStudentIndex = -1;
  const input = $('oTraCuu'); if (input) input.value = ''; clearLookupError();
  const d = $('khoiDiCung'); if (d) d.classList.add('is-hidden');
  hideFieldError('oLuong'); hideFieldError('oTraCuu');   /* đã chọn luồng ⇒ bỏ chữ đỏ của luồng, và của ô tra cứu vừa xoá trắng */
  if (v === ROUTE_EXEMPTION) syncExemption();
  applyRouteVisibility(); render(); updateButtons();
}
export function setExempt(field, value) { S.exempt = { ...S.exempt, [field]: value }; syncExemption(); render(); updateButtons(); }
export const closeCheckInOtherDay = () => { if (S.dialog === 'dlgCheckInKhacNgay') { S.dialog = ''; render(); } };
export const confirmCheckInOtherDay = () => { S.dialog = ''; render(); saveRegistration(true); };

/* ───── URL parameters ───── */
function applyUrlParams() {
  const params = new URLSearchParams(location.search);
  if (params.get('mode') === 'edit') {
    const title = document.querySelector('.page-head-text h1');
    const code = params.get('code');
    if (title) title.textContent = 'Sửa lịch hẹn thăm gặp' + (code ? ' ' + code : '');   /* mã nằm cuối tiêu đề, màn không còn dòng phụ */
    S.labels = { next: ' Lưu thay đổi', headerSave: ' Lưu thay đổi', lookup: ' Lưu thay đổi', simulateSwipe: ' Lưu thay đổi' };
    render();
  }
  const date = params.get('visitDate');
  if (date) { const el = document.querySelector('input[type="date"]'); if (el) el.value = date; }
  const selectByText = (label, value) => {
    const field = [...document.querySelectorAll('.field')].find((x) => { const n = x.querySelector('.field-label'); return n && n.textContent.indexOf(label) >= 0; });
    const el = field && field.querySelector('select'); if (!el) return;
    const option = [...el.options].find((x) => x.textContent.indexOf(value) >= 0);
    if (option) { el.value = option.value || option.textContent; el.disabled = false; }
  };
  const time = params.get('visitTime');
  if (time) selectByText('Khung giờ', time);
  const table = params.get('tableCode');
  if (table) {
    selectByText('Buồng thăm gặp', table);
  }
}

/* ───── Boot: page-wide listeners, then run like the HTML page ───── */
let booted = false;
/* rời ô bắt buộc còn trống ⇒ chữ đỏ ngay, cùng câu với nút bước tiếp; ids: id các phần tử trong .field vừa rời */
function blurField(ids) {
  missingInStep(S.step).forEach((name) => {
    const fieldId = FIELD_ID_BY_LABEL[name] || companionFieldId(name);
    if (!fieldId || ids.indexOf(fieldId) < 0) return;
    const shown = $(fieldId + 'Loi'); if (shown && shown.classList.contains('on')) return;   /* đang hiện lỗi rồi thì giữ nguyên */
    showFieldError(fieldId, msg(TYPED_FIELD_IDS.includes(fieldId) || /^xdDiKem(Ten|Cccd)/.test(fieldId) ? 'E001-01' : 'E001-02', midSentence(name)));
  });
}
export function boot() {
  if (booted) return;
  booted = true;
  /* chờ 200ms để lượt chọn trong danh sách xổ xuống kịp ghi giá trị trước khi kiểm */
  document.addEventListener('focusout', (e) => {
    const field = e.target.closest && e.target.closest('main .card .field');
    if (!field || (e.relatedTarget && field.contains(e.relatedTarget))) return;
    setTimeout(() => { if (field.contains(document.activeElement) || !field.isConnected) return; blurField([...field.querySelectorAll('[id]')].map((n) => n.id)); }, 200);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !S.dialog) return;
    const opener = openerElement; openerElement = null;
    S.dialog = ''; render();
    if (opener && opener !== document.body && opener.isConnected) setTimeout(() => opener.focus(), 0);
  }, true);
  document.addEventListener('mousedown', () => { if (S.dialog) openerElement = null; }, true);
  document.addEventListener('change', (ev) => {
    const el = ev.target;
    if (el && el.id && $(el.id + 'Loi')) showFieldError(el.id, '');
    if (el && el.id === 'oGioBatDau' && el.value !== '') showFieldError('oGioBatDau', '');
  });
  document.addEventListener('input', (ev) => { const el = ev.target; if (el && el.id && $(el.id + 'Loi')) showFieldError(el.id, ''); });
  ['change', 'input', 'click'].forEach((type) => document.addEventListener(type, () => setTimeout(updateButtons, 0), true));
  bindResourceSelects();
  bindProfileSelects();
  attachSearchToAllSelects();
  renderStep();
  applyUrlParams();
  isBooting = false;
}
