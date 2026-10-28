/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Create / Edit form of a reception counter (WEB-02) — one source for both pages. Model v4 of data/receptionDeskStore.js:
 * counter info + served dormitories (1 dormitory belongs to 1 counter) + reserved ranges (time range locked for chosen tables).
 * Quầy · Buồng · Suất riêng trong 1 màn — Tạo dùng 3 bước, Sửa dùng 3 tab; buồng nhập thẳng trên bảng, lưu 1 lần cùng quầy. */
import { Fragment, useLayoutEffect, useRef, useState } from 'react';
import { Svg } from '@/lib/icons';
import { toast } from '@/lib/legacyUi';
import { msg, msgParts } from '@/lib/msg';
import EmptyRow from '@/components/app/EmptyRow';
import SetupHint from '@/components/app/SetupHint';
import { linkInMsg } from '@/lib/setupHint';
import { receptionDeskEditPath } from '@/routes';
import { AppButton } from '@/components/app/AppButton';
import AppModal from '@/components/app/AppModal';
import DialogIcon from '@/components/app/DialogIcon';
import DialogCloseButton from '@/components/app/DialogCloseButton';
import { RichText, key } from '@/lib/richText';
import { AppButtonWithIcon } from '@/components/app/AppButton';
import { PageHeadActions, StepNav } from '@/components/app/PageActions';
import AppTable from '@/components/app/AppTable';
import AppTabs from '@/components/app/AppTabs';
import AppSelect from '@/components/app/AppSelect';
import AppCounterInput from '@/components/app/AppCounterInput';
import TimeRangeInput from '@/components/app/TimeRangeInput';
import CatalogStatusTag from '@/components/app/CatalogStatusTag';
import { useLeaveGuard } from '@/components/app/LeaveGuard';
import { CODE_FORMAT_ERROR, CODE_HINT, CODE_MAX, CODE_PATTERN } from '@/lib/codeFormat';
import { readRouteId } from '@/routes';
import { counterOfDormitory, counterStaffKeys } from '@/data/receptionDeskStore';
import { staffName, visitTeamStaff } from '@/data/staffDirectoryStore';   /* Cán bộ phụ trách */
import { DORMITORY_STATUS, dormitoryOfStudent, listDormitories } from '@/data/dormitoryStore';
import { readTables, tableStatusLabel, writeTables } from '@/data/visitTableStore';
import { logAction } from '@/data/historyStore';
import { buildAppointments } from '@/pages/AppointmentList/listLogic';
import { REASON_RESOURCE, affectedByTable, cancelAppointments, counterCodeOf, tableCodeOf, upcomingAppointments } from '@/lib/resourceImpact';
import {
  STATUS_ACTIVE, STATUS_DRAFT, TIME_PATTERN, dormitoryName, findCounter, fitsAnyShift, logCounter, saveCounter, statusLabel, toMinutes,
} from './counterLogic';
import { COUNTER_ICONS, LIST_URL } from './config';
import '@/styles/form.css';
import './ReceptionDeskForm.css';
const goToList = () => { location.href = LIST_URL; };
/* Time input takes digits and inserts the colon: 0730 -> 07:30 */
const normalizeTime = (v) => { let s = String(v).replace(/[^0-9]/g, '').slice(0, 4); if (s.length > 2) s = s.slice(0, 2) + ':' + s.slice(2); return s; };
const rangeText = (r) => r.from + ' ~ ' + r.to;
/* kho lưu bị chặn ⇒ báo lỗi, ở lại màn (cùng cách VisitTableForm) */
const saveFailed = () => toast(msg('SE001-01', 'lưu quầy tiếp đón'), 'is-error');
const STEPS = ['Thông tin quầy', 'Buồng thăm gặp', 'Suất riêng'];
const ICON_SAVE = '<polyline points="20 6 9 17 4 12"/>';
const ICON_BACK = '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>';   /* như AppointmentForm (nút trang và form có icon + chữ) */
/* buồng đã được dùng ở đâu đó (lịch hẹn hoặc suất riêng của quầy khác) ⇒ không xóa, chỉ Vô hiệu hóa */
const usedTableCodes = () => new Set(buildAppointments().map(tableCodeOf).filter(Boolean));

/* Edit page: code from the route id /:id/chinh-sua — counter is null when not found */
export function readEditTarget() {
  const code = readRouteId();
  return { code, counter: findCounter(code) };
}

/* Upcoming appointments of the students of a dormitory that go through this counter */
const upcomingOfDormitory = (counterCode, dormCode) => upcomingAppointments((r) => counterCodeOf(r) === counterCode && dormitoryOfStudent(r.studentCode) === dormCode).length;

/* First problem of the reserved ranges, per row: { rowIndex: { field: 'time' | 'table', text } } — chữ đỏ hiện dưới đúng ô sai */
function validateRanges(rows, activeCodes) {
  const errors = {};
  rows.forEach((r, i) => {
    /* cùng câu định dạng giờ với WEB-54 (VisitConfig): «Vui lòng nhập đủ giờ bắt đầu và giờ kết thúc {ca} theo dạng HH:mm» */
    if (!TIME_PATTERN.test(r.from) || !TIME_PATTERN.test(r.to)) errors[i] = { field: 'time', text: msg('E001-01', 'đủ giờ bắt đầu và giờ kết thúc suất riêng theo dạng HH:mm') };
    else if (toMinutes(r.to) <= toMinutes(r.from)) errors[i] = { field: 'time', text: msg('E001-17', 'Giờ kết thúc', 'sau', 'giờ bắt đầu') };
    else if (!fitsAnyShift(r.from, r.to)) errors[i] = { field: 'time', text: msg('E001-40', rangeText(r)) };
    else if (!r.tableCodes.filter((t) => activeCodes.has(t)).length) errors[i] = { field: 'table', text: msg('E001-02', 'buồng giữ riêng') };
  });
  /* trùng buồng + chồng giờ: báo ở CẢ 2 dòng, nêu đích danh buồng trùng và khung giờ của dòng kia để người tạo rà soát */
  const valid = rows.map((r, i) => !errors[i]);
  rows.forEach((r, i) => rows.forEach((o, j) => {
    if (i === j || !valid[i] || !valid[j] || errors[i]) return;
    const shared = r.tableCodes.filter((t) => o.tableCodes.indexOf(t) >= 0);
    if (shared.length && toMinutes(r.from) < toMinutes(o.to) && toMinutes(o.from) < toMinutes(r.to))
      errors[i] = { field: 'time', text: msg('E001-41', shared.join(', '), rangeText(r), rangeText(o)) };
  }));
  return errors;
}

/* Buồng: mã · tên · số chỗ — cùng câu lỗi với form Buồng (VisitTableForm) · mã duy nhất trong cơ sở (buồng quầy khác + các dòng khác trên bảng) */
function validateTables(rows, counterCode) {
  const errors = {};
  const others = readTables().filter((t) => t.counterCode !== counterCode).map((t) => t.code.toLowerCase());
  rows.forEach((r, i) => {
    const e = {}, code = r.code.trim(), seats = String(r.seats).trim();
    if (r.isNew) {
      if (!code) e.code = msg('E001-01', 'mã buồng');
      else if (!CODE_PATTERN.test(code)) e.code = CODE_FORMAT_ERROR;
      else if (others.includes(code.toLowerCase()) || rows.some((o, j) => j !== i && o.code.trim().toLowerCase() === code.toLowerCase())) e.code = msg('E001-07', 'Mã buồng', 'trong cơ sở');
    }
    if (!r.name.trim()) e.name = msg('E001-01', 'tên hiển thị');
    if (!seats) e.seats = msg('E001-01', 'số chỗ ngồi cho thân nhân');
    else if (!/^\d+$/.test(seats) || +seats < 1 || +seats > 10) e.seats = msg('E001-43');
    if (Object.keys(e).length) errors[r.key] = e;
  });
  return errors;
}

let nextKey = 1;
const tableRow = (t) => ({ key: 'b' + (nextKey++), code: t.code, name: t.name || '', seats: String(t.seats || ''), hasPartition: !!t.hasPartition, status: t.status, note: t.note || '', createdAt: t.createdAt, isNew: false });
const blankTable = () => ({ key: 'b' + (nextKey++), code: '', name: '', seats: '', hasPartition: true, status: 'ACTIVE', note: '', isNew: true });

export default function ReceptionDeskForm({ isEdit, counter, requestedCode, description }) {
  const original = isEdit ? counter : null;
  const counterCode = original ? original.code : '';
  const [form, setForm] = useState(() => ({
    code: original ? original.code : '',
    name: original ? original.name : '',
    location: original ? original.location || '' : '',
    phoneNumber: original ? original.phoneNumber || '' : '',
    dormitoryCodes: original ? (original.dormitoryCodes || []).slice() : [],
    staffKeys: counterStaffKeys(original),
    note: original ? original.note || '' : '',
  }));
  const [tables, setTables] = useState(() => (original ? readTables().filter((t) => t.counterCode === original.code).map(tableRow) : []));
  const [ranges, setRanges] = useState(() => (original ? (original.reservedRanges || []).map((r) => ({ from: r.from, to: r.to, tableCodes: (r.tableCodes || []).slice() })) : []));
  const [errors, setErrors] = useState({});
  const [tableErrors, setTableErrors] = useState({});
  const [rangeErrors, setRangeErrors] = useState({});
  const [step, setStep] = useState(() => (isEdit ? Math.min(3, Math.max(1, +new URLSearchParams(location.search).get('tab') || 1)) : 1));   /* Tạo: bước 1–3 · Sửa: tab 1–3, ?tab= từ nút Chỉnh sửa ở Chi tiết */
  const [scrollRequest, setScrollRequest] = useState(0);
  const [used] = useState(usedTableCodes);
  const saving = useRef(false);
  /* MSG-CF-03 · còn thay đổi chưa lưu ⇒ hỏi trước khi rời (nút Quay lại, breadcrumb, menu, tải lại)
 * Sửa: mỗi tab 1 mốc gốc riêng — Lưu chỉ lưu tab đang mở, đổi tab khi còn thay đổi ⇒ hộp C001-10 */
  const secJson = (n) => JSON.stringify(n === 1 ? form : n === 2 ? tables.map(({ key: k, ...t }) => t) : ranges);
  const baseRef = useRef(null);
  if (baseRef.current === null) baseRef.current = { 1: secJson(1), 2: secJson(2), 3: secJson(3) };
  const dirty = (n) => secJson(n) !== baseRef.current[n];
  const guard = useLeaveGuard(dirty(1) || dirty(2) || dirty(3));
  const [pendingTab, setPendingTab] = useState(0);

  useLayoutEffect(() => {
    if (!scrollRequest) return;
    const firstError = document.querySelector('.field-error.is-visible');
    if (firstError) firstError.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [scrollRequest]);

  if (isEdit && !original) {
    return <div className="card" style={{ textAlign: 'center', padding: '48px' }}><RichText text={msg('E001-11', 'quầy tiếp đón ' + key(requestedCode || ''))} />{'. '}<a className="appointment-link" href={LIST_URL}>Quay lại danh sách</a></div>;
  }

  /* buồng chọn được cho suất riêng = buồng Hoạt động trên bảng, có mã */
  const activeRows = tables.filter((t) => t.status === 'ACTIVE' && t.code.trim());
  const activeCodes = new Set(activeRows.map((t) => t.code.trim()));
  const tableOptions = activeRows.map((t) => ({ value: t.code.trim(), label: t.code.trim() + (t.name.trim() ? ' — ' + t.name.trim() : '') }));
  const rangesLocked = !activeRows.length && !ranges.length;

  /* Dormitory options: only PM1 ACTIVE dormitories that no other counter holds can be picked; the reason shows as a hint bubble (data-nhac) */
  const dormitoryOptions = listDormitories().map((d) => {
    const owner = counterOfDormitory(d.code, counterCode || undefined);
    const picked = form.dormitoryCodes.indexOf(d.code) >= 0;
    const title = owner ? 'Đã thuộc ' + owner.name : (d.status !== 'ACTIVE' ? DORMITORY_STATUS[d.status].label : undefined);
    return { value: d.code, label: d.code + ' — ' + d.name, hint: title, disabled: !picked && (!!owner || d.status !== 'ACTIVE') };
  });
  const removedWithAppointments = original ? (original.dormitoryCodes || []).filter((d) => form.dormitoryCodes.indexOf(d) < 0)
    .map((d) => ({ code: d, count: upcomingOfDormitory(original.code, d) })).filter((x) => x.count > 0) : [];

  const change = (field, value) => { setForm((x) => ({ ...x, [field]: value })); setErrors((x) => ({ ...x, [field]: '' })); };
  const changeTable = (k, patch) => { setTables((list) => list.map((t) => (t.key === k ? { ...t, ...patch } : t))); setTableErrors((x) => { const n = { ...x }; delete n[k]; return n; }); };
  const addTable = () => setTables((list) => [blankTable()].concat(list));   /* mới lên trên */
  /* xóa dòng buồng ⇒ bỏ luôn mã đó khỏi các suất riêng */
  const removeTable = (k) => {
    const gone = tables.find((t) => t.key === k);
    setTables((list) => list.filter((t) => t.key !== k));
    if (gone && gone.code.trim()) setRanges((list) => list.map((r) => ({ ...r, tableCodes: r.tableCodes.filter((c) => c !== gone.code.trim()) })));
  };
  const changeRange = (i, patch) => { setRanges((list) => list.map((r, j) => (j === i ? { ...r, ...patch } : r))); setRangeErrors((x) => { const n = { ...x }; delete n[i]; return n; }); };
  const addRange = () => { setRanges((list) => [{ from: '', to: '', tableCodes: [] }].concat(list)); setRangeErrors({}); };   /* mới lên trên · lỗi theo vị trí dòng ⇒ xoá */
  const removeRange = (i) => { setRanges((list) => list.filter((_, j) => j !== i)); setRangeErrors({}); };

  const validateInfo = (mode) => {
    const next = {};
    const code = form.code.trim();
    if (!isEdit) {
      if (!code) next.code = msg('E001-01', 'mã quầy');
      else if (!CODE_PATTERN.test(code)) next.code = CODE_FORMAT_ERROR;
      else if (findCounter(code)) next.code = msg('E001-07', 'Mã quầy', 'trong cơ sở');
    }
    if (!form.name.trim()) next.name = msg('E001-01', 'tên quầy');
    const needsDormitory = mode === 'activate' || (isEdit && original.status === STATUS_ACTIVE);
    if (needsDormitory && !form.dormitoryCodes.length) next.dormitoryCodes = msg('E001-02', 'dãy nhà phục vụ');
    if (needsDormitory && !form.staffKeys.length) next.staffKeys = msg('E001-02', 'cán bộ phụ trách');
    return next;
  };
  /* kiểm 1 phần (Tiếp tục) hoặc cả 3 (Lưu) · sai ở phần khác ⇒ chuyển về bước / tab có lỗi đầu tiên */
  const validate = (mode, only) => {
    const e1 = !only || only === 1 ? validateInfo(mode) : {};
    const e2 = !only || only === 2 ? validateTables(tables, counterCode || form.code.trim()) : {};
    const e3 = !only || only === 3 ? validateRanges(ranges, activeCodes) : {};
    setErrors(e1); setTableErrors(e2); setRangeErrors(e3);
    const firstBad = Object.keys(e1).length ? 1 : Object.keys(e2).length ? 2 : Object.keys(e3).length ? 3 : 0;
    if (firstBad) { setStep(firstBad); setScrollRequest((n) => n + 1); }
    /* Lưu kiểm cả 3 phần ⇒ nêu tên mọi phần còn lỗi, vì lỗi có thể ở phần đang không mở */
    const badParts = [e1, e2, e3].map((e, i) => (Object.keys(e).length ? STEPS[i] : null)).filter(Boolean);
    if (!only && badParts.length) toast(msg('I001-25', badParts.join(', ')), 'is-warning');
    return !firstBad;
  };

  const buildCounter = (status) => ({
    ...(original || { todayBookedCount: 0, todayCheckedInCount: 0, createdAt: new Date().toISOString() }),
    code: isEdit ? original.code : form.code.trim(),
    name: form.name.trim(),
    location: form.location.trim(),
    phoneNumber: form.phoneNumber.trim(),
    dormitoryCodes: form.dormitoryCodes.slice(),
    staffKeys: form.staffKeys.slice(),
    note: form.note.trim(),
    reservedRanges: ranges.map((r) => ({ from: r.from, to: r.to, tableCodes: r.tableCodes.filter((t) => activeCodes.has(t)) })).sort((a, b) => toMinutes(a.from) - toMinutes(b.from)),
    status,
  });
  /* [label, old, new] of every changed field — Lịch sử thao tác */
  const tablesText = (list) => list.map((t) => t.code + (t.status === 'INACTIVE' ? ' (Vô hiệu hóa)' : '')).join(', ');
  const diff = (a, b, oldTables, newTables) => {
    const dorms = (c) => (c.dormitoryCodes || []).map(dormitoryName).join(', ');
    const res = (c) => (c.reservedRanges || []).map((r) => rangeText(r) + ' (' + r.tableCodes.join(', ') + ')').join('; ');
    const staff = (c) => counterStaffKeys(c).map(staffName).join(', ');
    return [['Tên quầy', a.name, b.name], ['Vị trí', a.location || '', b.location], ['Số điện thoại nội bộ', a.phoneNumber || '', b.phoneNumber],
      ['Dãy nhà phục vụ', dorms(a), dorms(b)], ['Cán bộ phụ trách', staff(a), staff(b)], ['Buồng thăm gặp', tablesText(oldTables), tablesText(newTables)], ['Suất riêng của quầy', res(a), res(b)], ['Ghi chú', a.note || '', b.note]]
      .filter(([, x, y]) => x !== y);
  };
  /* ghi buồng của quầy: thay toàn bộ buồng của quầy bằng các dòng trên bảng (dòng đã xóa thì bỏ khỏi kho) */
  const saveTables = (code) => {
    const now = new Date().toISOString();
    const mine = tables.map((t) => ({ code: t.code.trim(), name: t.name.trim(), counterCode: code, seats: +String(t.seats).trim(), hasPartition: t.hasPartition,
      status: t.status === 'DRAFT' ? 'ACTIVE' : t.status, note: t.note || '', createdAt: t.createdAt || now }));
    return writeTables(readTables().filter((t) => t.counterCode !== code).concat(mine)) ? mine : null;
  };
  /* ghi hỏng ⇒ toast lỗi, ở lại màn, không ghi lịch sử, không chuyển trang */
  const save = (mode) => {
    if (saving.current || !validate(mode)) return;
    saving.current = true;
    const oldTables = isEdit ? readTables().filter((t) => t.counterCode === original.code) : [];
    const status = isEdit ? original.status : (mode === 'activate' ? STATUS_ACTIVE : STATUS_DRAFT);
    const saved = buildCounter(status);
    if (!saveCounter(saved)) { saving.current = false; saveFailed(); return; }
    const newTables = saveTables(saved.code);
    if (!newTables) { saving.current = false; saveFailed(); return; }
    /* buồng vừa chuyển sang Vô hiệu hóa ⇒ hủy lịch chưa diễn ra của buồng đó (cùng cách danh sách Buồng) */
    let cancelled = 0;
    newTables.forEach((t) => {
      const before = oldTables.find((o) => o.code === t.code);
      if (!before) logAction(t.code, 'Tạo mới', { statusAfter: t.status });
      else if (before.status !== t.status) {
        logAction(t.code, t.status === 'INACTIVE' ? 'Vô hiệu hóa' : 'Kích hoạt', { statusBefore: before.status, statusAfter: t.status });
        if (t.status === 'INACTIVE') { const list = affectedByTable(t.code); if (list.length) cancelled += cancelAppointments(list, REASON_RESOURCE); }
      }
    });
    if (isEdit) logCounter(saved.code, 'Chỉnh sửa', { statusBefore: original.status, statusAfter: saved.status, changes: diff(original, saved, oldTables, newTables) });
    else logCounter(saved.code, mode === 'activate' ? 'Lưu và kích hoạt' : 'Lưu nháp', { statusAfter: status });
    guard.release();
    location.href = LIST_URL + (isEdit ? '?updated=' : '?created=') + encodeURIComponent(saved.code) + (cancelled ? '&cancelled=' + cancelled : '');
  };

  /* Sửa: lưu RIÊNG tab n, ở lại màn — trả true khi lưu được */
  const TAB_SAVED = ['thông tin quầy', 'buồng thăm gặp của quầy', 'suất riêng của quầy'];
  const saveTab = (n) => {
    if (saving.current || !validate('edit', n)) return false;
    saving.current = true;
    const base = findCounter(counterCode) || original;
    let saved = base, oldTables = [], newTables = [], cancelled = 0;
    if (n === 1) saved = { ...base, name: form.name.trim(), location: form.location.trim(), phoneNumber: form.phoneNumber.trim(), dormitoryCodes: form.dormitoryCodes.slice(), staffKeys: form.staffKeys.slice(), note: form.note.trim() };
    if (n === 2) {
      oldTables = readTables().filter((t) => t.counterCode === counterCode);
      newTables = saveTables(counterCode);
      if (!newTables) { saving.current = false; saveFailed(); return false; }
      newTables.forEach((t) => {
        const before = oldTables.find((o) => o.code === t.code);
        if (!before) logAction(t.code, 'Tạo mới', { statusAfter: t.status });
        else if (before.status !== t.status) {
          logAction(t.code, t.status === 'INACTIVE' ? 'Vô hiệu hóa' : 'Kích hoạt', { statusBefore: before.status, statusAfter: t.status });
          if (t.status === 'INACTIVE') { const list = affectedByTable(t.code); if (list.length) cancelled += cancelAppointments(list, REASON_RESOURCE); }
        }
      });
      /* buồng đã xoá / Vô hiệu hóa ⇒ gỡ khỏi suất riêng đã lưu */
      const con = new Set(newTables.filter((t) => t.status === 'ACTIVE').map((t) => t.code));
      saved = { ...base, reservedRanges: (base.reservedRanges || []).map((r) => ({ ...r, tableCodes: r.tableCodes.filter((c) => con.has(c)) })).filter((r) => r.tableCodes.length) };
    }
    if (n === 3) saved = { ...base, reservedRanges: ranges.map((r) => ({ from: r.from, to: r.to, tableCodes: r.tableCodes.filter((t) => activeCodes.has(t)) })).sort((a, b) => toMinutes(a.from) - toMinutes(b.from)) };
    if (!saveCounter(saved)) { saving.current = false; saveFailed(); return false; }
    const changes = diff(base, saved, oldTables, n === 2 ? newTables : oldTables);
    if (changes.length) logCounter(counterCode, 'Chỉnh sửa', { statusBefore: base.status, statusAfter: saved.status, changes });
    if (n === 2) setRanges((saved.reservedRanges || []).map((r) => ({ from: r.from, to: r.to, tableCodes: r.tableCodes.slice() })));
    baseRef.current = { ...baseRef.current, [n]: secJson(n), ...(n === 2 ? { 3: JSON.stringify(saved.reservedRanges || []) } : {}) };
    saving.current = false;
    toast(msg('I001-03', TAB_SAVED[n - 1] + ' ' + key(counterCode)) + (cancelled ? ' và hủy ' + cancelled + ' lịch hẹn' : ''));
    return true;
  };
  /* bỏ thay đổi của tab n ⇒ trả về mốc gốc */
  const resetTab = (n) => {
    const v = JSON.parse(baseRef.current[n]);
    if (n === 1) { setForm(v); setErrors({}); }
    if (n === 2) {
      setTables(v.map((t) => ({ ...t, key: 'b' + (nextKey++) }))); setTableErrors({});
      /* xoá buồng ở tab 2 đã gỡ mã khỏi suất riêng (removeTable) ⇒ bỏ thay đổi tab 2 trả lại mã buồng cho suất riêng theo mốc gốc tab 3, tab 3 không bị tính là đã sửa */
      const base3 = JSON.parse(baseRef.current[3]);
      setRanges((list) => list.map((r, i) => { const b = base3[i]; return b && b.from === r.from && b.to === r.to && r.tableCodes.every((c) => b.tableCodes.indexOf(c) >= 0) ? { ...r, tableCodes: b.tableCodes.slice() } : r; }));
    }
    if (n === 3) { setRanges(v); setRangeErrors({}); }
  };
  const changeTab = (k) => { if (+k === step) return; if (isEdit && dirty(step)) { setPendingTab(+k); return; } setStep(+k); };
  const PART = msgParts('C001-03');

  const errorText = (k, id) => <span className={'field-error' + (errors[k] ? ' is-visible' : '')} id={id}>{errors[k] || ''}</span>;
  const tableError = (k, field) => (tableErrors[k] && tableErrors[k][field]) || '';
  const tableErrorText = (r, field) => <span className={'field-error' + (tableError(r.key, field) ? ' is-visible' : '')}>{tableError(r.key, field)}</span>;
  const rangeError = (i, field) => (rangeErrors[i] && rangeErrors[i].field === field ? rangeErrors[i].text : '');

  /* buồng nhập thẳng trên bảng · buồng chưa dùng ⇒ Xóa · đang dùng ⇒ Vô hiệu hóa ⇄ Kích hoạt */
  const tableColumns = [
    { key: 'code', thStyle: { width: '170px' }, title: <>Mã buồng<span className="required-mark">*</span></>, render: (r) => <>
      <AppCounterInput className={tableError(r.key, 'code') ? 'input-border-error' : ''} id={'banMa' + r.key} counterId={'banMaDem' + r.key} maxLength={CODE_MAX} placeholder="Nhập mã buồng" style={{ textTransform: 'uppercase' }}
        value={r.code} disabled={!r.isNew} title={r.isNew ? CODE_HINT : 'Không thể sửa mã sau khi tạo'} onChange={(e) => changeTable(r.key, { code: e.target.value.toUpperCase() })} />
      {tableErrorText(r, 'code')}</> },
    { key: 'name', title: <>Tên hiển thị<span className="required-mark">*</span></>, render: (r) => <>
      <AppCounterInput className={tableError(r.key, 'name') ? 'input-border-error' : ''} id={'banTen' + r.key} counterId={'banTenDem' + r.key} maxLength={100} placeholder="Ví dụ: Buồng số 01"
        value={r.name} onChange={(e) => changeTable(r.key, { name: e.target.value })} />
      {tableErrorText(r, 'name')}</> },
    { key: 'seats', thStyle: { width: '150px' }, title: <>Số chỗ ngồi<span className="required-mark">*</span></>, render: (r) => <>
      <input type="number" min={1} max={10} step={1} className={'text-input' + (tableError(r.key, 'seats') ? ' input-border-error' : '')} id={'banSoCho' + r.key} placeholder="1 đến 10"
        value={r.seats} onChange={(e) => changeTable(r.key, { seats: e.target.value })} />
      {tableErrorText(r, 'seats')}</> },
    { key: 'hasPartition', thStyle: { width: '120px' }, title: 'Có vách ngăn', render: (r) => (
      <label className="chk-dong qb-ctl"><input type="checkbox" id={'banVach' + r.key} checked={r.hasPartition} onChange={(e) => changeTable(r.key, { hasPartition: e.target.checked })} />{' Có'}</label>) },
    { key: 'status', thStyle: { width: '140px' }, title: 'Trạng thái', render: (r) => <span className="qb-ctl"><CatalogStatusTag status={r.status === 'DRAFT' ? 'ACTIVE' : r.status} label={tableStatusLabel(r.status === 'DRAFT' ? 'ACTIVE' : r.status)} /></span> },
    { key: 'actions', thStyle: { width: '64px' }, title: '', render: (r) => {
      const daDung = !r.isNew && used.has(r.code);
      if (!daDung) return <span className="qb-ctl"><AppButtonWithIcon htmlType="button" className="form-btn-remove" title="Xóa buồng" aria-label="Xóa buồng" onClick={() => removeTable(r.key)} iconRaw={COUNTER_ICONS.delete} /></span>;
      return r.status === 'INACTIVE'
        ? <span className="qb-ctl"><AppButtonWithIcon htmlType="button" className="ib ib-approve" title="Kích hoạt" aria-label="Kích hoạt" icon="approve" onClick={() => changeTable(r.key, { status: 'ACTIVE' })} /></span>
        : <span className="qb-ctl"><AppButtonWithIcon htmlType="button" className="ib ib-warn" title="Vô hiệu hóa" aria-label="Vô hiệu hóa" icon="prohibit" onClick={() => changeTable(r.key, { status: 'INACTIVE' })} /></span>;
    } },
  ];
  /* buồng đổi sang Vô hiệu hóa mà còn lịch chưa diễn ra ⇒ cảnh báo ngay dưới bảng (W001-15), Lưu thì hủy các lịch đó */
  const deactivatedWithAppointments = tables.filter((t) => !t.isNew && t.status === 'INACTIVE' && original && readTables().some((o) => o.code === t.code && o.status !== 'INACTIVE'))
    .map((t) => ({ code: t.code, name: t.name, count: affectedByTable(t.code).length })).filter((x) => x.count > 0);

  /* 1 ô khoảng giờ có bảng chọn giờ như WEB-54 (TimeRangeInput) · chữ đỏ dưới đúng ô sai, chỉ ô sai viền đỏ · 3 ô cùng tâm dọc (.sr-ctl) */
  const rangeColumns = [
    { key: 'time', thStyle: { width: '260px' }, title: 'Khung giờ', render: (r) => <>
      <div className="sr-ctl"><TimeRangeInput from={r.from} to={r.to} invalid={!!rangeError(r.index, 'time')} idPrefix={'sr' + r.index}
        labelFrom={'Giờ bắt đầu suất riêng ' + (r.index + 1)} labelTo={'Giờ kết thúc suất riêng ' + (r.index + 1)}
        onChange={(edge, value) => changeRange(r.index, { [edge]: normalizeTime(value) })} /></div>
      <span className={'field-error' + (rangeError(r.index, 'time') ? ' is-visible' : '')} id={'loiSrGio' + r.index}><RichText text={rangeError(r.index, 'time')} /></span></> },
    { key: 'tableCodes', title: 'Buồng giữ riêng', render: (r) => <>
      <div className="sr-ctl"><AppSelect id={'srBan' + r.index} mode="multiple" showSearch optionFilterProp="label" style={{ width: '100%' }} placeholder="Chọn buồng giữ riêng"
        options={tableOptions} value={r.tableCodes.filter((t) => activeCodes.has(t))} onChange={(v) => changeRange(r.index, { tableCodes: v })} status={rangeError(r.index, 'table') ? 'error' : undefined} /></div>
      <span className={'field-error' + (rangeError(r.index, 'table') ? ' is-visible' : '')} id={'loiSr' + r.index}>{rangeError(r.index, 'table')}</span></> },
    { key: 'actions', thStyle: { width: '56px' }, title: '', render: (r) => (
      <div className="sr-ctl"><AppButtonWithIcon htmlType="button" className="form-btn-remove" title="Xóa suất riêng" onClick={() => removeRange(r.index)} iconRaw={COUNTER_ICONS.delete} /></div>) },
  ];

  const infoCard = (
    <div className="card">
      <h2 className="card-title">Thông tin quầy</h2>
      <div className="form-grid">
        <div className="field span-3">
          <label className="field-label">Mã quầy<span className="required-mark">*</span></label>
          <AppCounterInput className={errors.code ? 'input-invalid' : ''} id="oMa" counterId="dmMa" maxLength={CODE_MAX} placeholder="Nhập mã quầy" style={{ textTransform: 'uppercase' }}
            value={form.code} disabled={isEdit} onChange={(e) => change('code', e.target.value.toUpperCase())}
            onBlur={() => { if (!isEdit && !form.code.trim()) setErrors((x) => ({ ...x, code: msg('E001-01', 'mã quầy') })); }} />   {/* rời ô bắt buộc còn trống thì báo ngay */}
          {errorText('code', 'loiMa')}
          <span className="field-hint" id="gyMa">{isEdit ? 'Không thể sửa mã sau khi tạo' : CODE_HINT}</span>
        </div>
        <div className="field span-9">
          <label className="field-label">Tên quầy<span className="required-mark">*</span></label>
          <AppCounterInput className={errors.name ? 'input-invalid' : ''} id="oTen" counterId="dmTen" maxLength={100} placeholder="Ví dụ: Quầy tiếp đón số 1" value={form.name}
            onChange={(e) => change('name', e.target.value)}
            onBlur={() => { if (!form.name.trim()) setErrors((x) => ({ ...x, name: msg('E001-01', 'tên quầy') })); }} />   {/* */}
          {errorText('name', 'loiTen')}
        </div>
        <div className="field span-3">
          <label className="field-label">Số điện thoại nội bộ</label>
          <AppCounterInput id="oDienThoai" counterId="dmDienThoai" maxLength={20} placeholder="Ví dụ: 1101" value={form.phoneNumber}
            onChange={(e) => change('phoneNumber', e.target.value)} />
        </div>
        <div className="field span-9">
          <label className="field-label">Vị trí</label>
          <AppCounterInput id="oViTri" counterId="dmViTri" maxLength={100} placeholder="Ví dụ: Sảnh chính, tầng 1" value={form.location} onChange={(e) => change('location', e.target.value)} />
        </div>
        <div className="field span-12">
          <label className="field-label">Dãy nhà phục vụ<span className="field-label-sub">(bắt buộc khi kích hoạt)</span></label>
          <div id="oDayNha">
            <AppSelect mode="multiple" showSearch optionFilterProp="label" style={{ width: '100%' }} placeholder="Chọn dãy nhà phục vụ"
              options={dormitoryOptions} optionRender={(o) => <span data-nhac={o.data.hint || undefined}>{o.label}</span>} value={form.dormitoryCodes} onChange={(v) => change('dormitoryCodes', v)} status={errors.dormitoryCodes ? 'error' : undefined} />
          </div>
          {errorText('dormitoryCodes', 'loiDayNha')}
          {removedWithAppointments.map((x) => <div className="eff is-warning dorm-warning" key={x.code}><RichText text={msg('W001-10', dormitoryName(x.code), x.count)} /></div>)}
        </div>
        {/* cán bộ Tổ thăm gặp phụ trách quầy — người bắt buộc nhận thông báo của lịch hẹn thuộc quầy; đổi người ⇒ báo thông báo sau chuyển sang người mới */}
        <div className="field span-12">
          <label className="field-label">Cán bộ phụ trách<span className="field-label-sub">(bắt buộc khi kích hoạt)</span></label>
          <div id="oCanBoPhuTrach">
            <AppSelect mode="multiple" showSearch optionFilterProp="label" style={{ width: '100%' }} placeholder="Chọn cán bộ Tổ thăm gặp phụ trách quầy"
              options={visitTeamStaff().map((s) => ({ value: s.key, label: s.name + ' — ' + s.role }))} value={form.staffKeys} onChange={(v) => change('staffKeys', v)} status={errors.staffKeys ? 'error' : undefined} />
          </div>
          {errorText('staffKeys', 'loiCanBoPhuTrach')}
          {isEdit && JSON.stringify(form.staffKeys.slice().sort()) !== JSON.stringify(counterStaffKeys(original).sort()) && <div className="eff is-warning dorm-warning" id="canhBaoDoiCanBo"><RichText text={msg('W001-20')} /></div>}
        </div>
        <div className="field span-12">
          <label className="field-label">Ghi chú</label>
          <AppCounterInput multiline id="oGhiChu" counterId="dmGhiChu" maxLength={1000} rows={3} style={{ height: 'auto', minHeight: '64px', paddingTop: '6px' }}
            placeholder="Nhập ghi chú" value={form.note} onChange={(e) => change('note', e.target.value)} />
        </div>
      </div>
    </div>);

  const tablesCard = (
    <div className="card">
      <div className="capacity-head">
        <h2 className="card-title">Buồng thăm gặp</h2>
        <span className="capacity-spacer" />
        <AppButtonWithIcon className="form-btn" id="nutThemBan" onClick={addTable} iconRaw={'<path d="M12 5v14M5 12h14"/>'} iconLinejoin={null}>Thêm buồng</AppButtonWithIcon>
      </div>
      <div id="banVung"><AppTable tableClassName="capacity-table reserved-table qb-table" rowKey="key" columns={tableColumns} dataSource={tables}
        emptyRow={<EmptyRow colSpan={tableColumns.length} entity="buồng thăm gặp" hasRecords={false} />} /></div>
      {deactivatedWithAppointments.map((x) => <div className="eff is-warning dorm-warning" key={x.code}><RichText text={msg('W001-15', 'Buồng ' + key(x.code + ' — ' + x.name), x.count)} /></div>)}
    </div>);

  const rangesCard = (
    <div className="card">
      <div className="capacity-head">
        <h2 className="card-title">Suất riêng của quầy</h2>
        <span className="capacity-spacer" />
        <AppButtonWithIcon className="form-btn" id="nutThemSuat" onClick={addRange} disabled={rangesLocked} iconRaw={'<path d="M12 5v14M5 12h14"/>'} iconLinejoin={null}>Thêm suất riêng</AppButtonWithIcon>
      </div>
      <div id="srVung">{rangesLocked
        ? <SetupHint id="huongDanKhaiBanSuat" parts={linkInMsg('I001-79', 'khai buồng cho quầy')}
          to={isEdit ? receptionDeskEditPath(counterCode) + '?tab=2' : '#banVung'} onLinkClick={() => (isEdit ? changeTab('2') : goStep(2))} />
        : <AppTable tableClassName="capacity-table reserved-table" rowKey="index" columns={rangeColumns} dataSource={ranges.map((r, i) => ({ ...r, index: i }))}
          emptyRow={<EmptyRow colSpan={rangeColumns.length} entity="suất riêng" hasRecords={false} />} />}</div>
    </div>);

  /* 1 cấu hình cho thanh đầu trang và chân trang · Tạo: Lưu nháp + Lưu và kích hoạt ở MỌI bước, thêm Quay lại / Tiếp tục */
  const goStep = (n) => { if (n > step && !validate('draft', step)) return; setStep(n); window.scrollTo({ top: 0 }); };
  const NAV_IDS = ['nutQuayLaiBuoc', 'nutTiepTuc'];   /* 2 nút chuyển bước nằm cuối nội dung bước */
  const actions = isEdit
    ? [{ id: 'nutLuuSua', label: 'Lưu', className: 'form-btn form-btn-primary', onClick: () => saveTab(step), iconRaw: ICON_SAVE }]
    /* Quay lại bước trước · Tiếp tục (mũi tên phải) · Lưu nháp · Lưu và kích hoạt */
    : [step > 1 ? { id: 'nutQuayLaiBuoc', label: 'Quay lại bước trước', left: true, onClick: () => goStep(step - 1), iconRaw: ICON_BACK } : null,
      step < 3 ? { id: 'nutTiepTuc', label: 'Tiếp tục', className: 'form-btn form-btn-primary', onClick: () => goStep(step + 1), iconRaw: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>' } : null,
      { id: 'nutLuuNhap', label: 'Lưu nháp', onClick: () => save('draft'), iconRaw: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>' },
      { id: 'nutLuuKH', label: 'Lưu và kích hoạt', className: 'form-btn' + (step === 3 ? ' form-btn-primary' : ''), onClick: () => save('activate'), iconRaw: ICON_SAVE }].filter(Boolean);

  return <>
    <div className="page-head">
      <AppButtonWithIcon className="page-head-back" onClick={() => guard.attempt(goToList)} title="Quay lại danh sách" aria-label="Quay lại" iconRaw={'<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>'} />
      <div className="page-head-text">
        {isEdit
          ? <h1 id="tieuDe" className="page-head-row">{'Chỉnh sửa quầy tiếp đón ' + original.code}<CatalogStatusTag status={original.status} label={statusLabel(original.status)} /></h1>
          : <h1 id="tieuDe">Tạo quầy tiếp đón</h1>}
      </div>
      <PageHeadActions actions={actions.filter((a) => !NAV_IDS.includes(a.id))} />
    </div>

    {isEdit
      ? <AppTabs activeKey={String(step)} onChange={changeTab} items={STEPS.map((label, i) => ({
        key: String(i + 1), id: 'tabQuay' + (i + 1), label,
        children: i === 0 ? infoCard : i === 1 ? tablesCard : rangesCard }))} />
      : <>
        <div className="stepper" id="daiBuoc">
          {STEPS.map((name, i) => (
            <Fragment key={name}>
              {i > 0 && <div className="step-line" />}
              <div className={'step' + (i + 1 === step ? ' is-current' : '') + (i + 1 < step ? ' is-done' : '')} data-b={i + 1}
                onClick={i + 1 < step ? () => goStep(i + 1) : undefined}>
                <span className="step-number">{i + 1 < step ? '✓' : String(i + 1)}</span>
                <span className="step-title">{name}</span>
              </div>
            </Fragment>
          ))}
        </div>
        {step === 1 ? infoCard : step === 2 ? tablesCard : rangesCard}
        {step > 1 ? <div className="field-hint qb-skip">Bước này không bắt buộc, có thể để trống và khai sau ở màn Chỉnh sửa quầy.</div> : null}
      </>}

    {!isEdit && <StepNav actions={actions.filter((a) => NAV_IDS.includes(a.id))} />}   {/* */}
    {guard.dialog}
    {/* C001-10: rời 1 tab khi còn thay đổi chưa lưu — nội dung như C001-03, 3 nút theo Message List */}
    <AppModal id="dlgDoiTab" open={!!pendingTab} onClose={() => setPendingTab(0)} labelledBy="dlgDoiTabTieuDe">
      <div className="dlg-h"><h3 id="dlgDoiTabTieuDe" className="dlg-t"><DialogIcon level="warn" /><RichText text={PART.title} /></h3><DialogCloseButton onClick={() => setPendingTab(0)} /></div>
      <div className="dlg-b"><div><RichText text={PART.body} /></div></div>
      <div className="dlg-f">
        <AppButton className="btn" id="dlgDoiTabOLai" onClick={() => setPendingTab(0)}>Ở lại phần này</AppButton>
        <AppButton className="btn" id="dlgDoiTabBo" onClick={() => { resetTab(step); setStep(pendingTab); setPendingTab(0); }}>Bỏ thay đổi và chuyển phần</AppButton>
        <AppButton className="btn btn-primary" id="dlgDoiTabLuu" onClick={() => { const t = pendingTab; setPendingTab(0); if (saveTab(step)) setStep(t); }}>Lưu và chuyển phần</AppButton>
      </div>
    </AppModal>
  </>;
}
