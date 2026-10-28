/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* WEB-06 · Appointment list (in-person visit). Ported from the archived HTML prototype
 * variant 'exception' = màn Lịch hẹn gặp trực tiếp ngoại lệ: đơn ngoại lệ tạo tại quầy chưa được Trưởng cơ sở duyệt.
 * 2 màn chia nhau DANH SÁCH theo approvalRoute.isExceptionRecord; Lịch theo buồng và chống trùng buồng vẫn tính đủ mọi lịch */
import { logAction, setStatus, readStatusMap, readHistory, hasLogged } from '@/data/historyStore';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import AppLayout from '@/layout/AppLayout';
import { Svg } from '@/lib/icons';
import { joinText } from '@/lib/joinText';
import { notifyInDevelopment, toast, delayFromPageStart } from '@/lib/legacyUi';
import { AppButton, AppButtonWithIcon } from '@/components/app/AppButton';
import AppTag from '@/components/app/AppTag';
import AppModal from '@/components/app/AppModal';
import AppTable from '@/components/app/AppTable';
import AppSearchInput from '@/components/app/AppSearchInput';
import AppSelect, { PAGE_SIZE_OPTIONS } from '@/components/app/AppSelect';
import EmptyRow from '@/components/app/EmptyRow';
import NoteBox from '@/components/app/NoteBox';
import { readAdjusted, readCreated, sourceLabel, statusLabel, toIsoDate, writeAdjusted, writeCreated, writeEditing } from '@/data/appointmentStore';
import { appointmentDetailPath, appointmentEditPath, exceptionDetailPath, exceptionEditPath } from '@/routes';
import { recordRejection } from '@/data/exemptionResend';   /* lộ trình duyệt: lưu lý do từ chối vào lần hiện tại */
import { can, canApproveAppointment, canApproveRecord, SCREEN_DIRECT, SCREEN_EXCEPTION } from '@/data/accountStore';
import { approvedCodeOf, defaultRecipients, notifyMissing, rejectedCodeOf, sendBulkStaff, sendForRecord, bulkCodeOf } from '@/data/notificationStore';   /* người nhận theo trường Gửi thông báo của từng popup */
import { NOTIFICATION_CODES } from '@/data/notificationSettingsStore';
import NotifyRecipientsField from '@/components/app/NotifyRecipientsField';
import AppCounterInput from '@/components/app/AppCounterInput';   /* ô có bộ đếm dùng chung «n / max» */
import { findAlternativeSlot } from '@/lib/alternativeSlot';
import { isExceptionRecord, isExemption, EXCEPTION_LABEL, ROUTE_LINKED, ROUTE_EXEMPTION, routeFilterText } from '@/data/approvalRoute';
import { appointmentsLayout, DIRECT_LIST_LABEL } from '@/layout/menuConfig';
import { ROUTES } from '@/routes';
import {
  ACTION_COLOR, ACTION_ICON, APPROVER_ONLY_ACTIONS, BULK_ACTIONS_BY_STATUS, BULK_DISABLED_TABS, EXCEPTION_TABS, GRID_TIMES, LIST_ICONS,
  HOLDS_NO_RESOURCE, MAX_VISITORS, OVER_LIMIT_WARNING, RELATIONSHIP_TAG_CLASS, ROW_ACTIONS, STATUS_CLASS, TABS, VISIT_TYPE_TAG_CLASS, WEEKDAY_NAMES,
  addMinutes, applyFilter, birthDateText, buildAppointments, formatDate, parseDisplayDate, rowActions, rowsForTab,
  dormitoryOf, roomOf, studentCodeText, teamOf, truncate, visitDateText, visitDateTimeText, maxActionCount } from './listLogic';
import { AppFilterDropdown } from '@/components/app/AppFilterDropdown';
import { DateRange, OneDateCalendar } from './widgets';
import CancelAppointmentDialog from '@/components/app/CancelAppointmentDialog';
import DeleteAppointmentDialog from '@/components/app/DeleteAppointmentDialog';
import { mountTablePicker } from '@/components/app/TablePicker';
import { weekBan } from '@/data/visitQuotaStore';
import { RichText, key } from '@/lib/richText';
import { msg, msgParts } from '@/lib/msg';
import { holdHoursOf, runAutoCancel } from '@/lib/autoCancel';
import { tableLabel, counterLabelOf, bookedFrom, bookingSettings, clockToMinutes, counterLabel, allCountersRoom, minutesToClock, studentResource, timelineConfig, usesReserved } from '@/lib/tableTimeline';
import { findCounter, readCounters } from '@/data/receptionDeskStore';
import { readTables } from '@/data/visitTableStore';
import { valueTagStyle } from '@/lib/valueTagColor';
import { counterCodeOf } from '@/lib/resourceImpact';
import ListCalendar from './ListCalendar';
import GridGuide from './GridGuide';
import { exportExcel } from './exportExcel';
import './AppointmentList.css';
import DialogCloseButton from '@/components/app/DialogCloseButton';
import DialogIcon from '@/components/app/DialogIcon';
import PageSelect from '@/components/app/PageSelect';   /* ô «Chọn trang» cạnh chữ «Trang X/Y» */

const BUTTON_DESCRIPTIONS = {
  'Xuất Excel': 'Tải danh sách lịch hẹn đang lọc ra file Excel', 'Tạo mới': 'Tạo lịch hẹn thăm gặp trực tiếp mới',
  'Bỏ chọn hết': 'Bỏ chọn tất cả lịch hẹn đang chọn', 'Duyệt': 'Phê duyệt các lịch hẹn đã chọn', 'Từ chối': 'Từ chối duyệt các lịch hẹn đã chọn',
  'Đóng': 'Đóng cửa sổ này', 'Hủy': 'Hủy thao tác và đóng cửa sổ này',
  'Hủy và đề xuất lịch thay thế': 'Hủy lịch hẹn này và gửi đề xuất khung giờ khác cho thân nhân', 'Xác nhận hủy': 'Hủy lịch hẹn với lý do đã chọn',
  'Xác nhận điều chỉnh': 'Lưu khung giờ và buồng thăm gặp mới', 'Xác nhận dời': 'Lưu ngày giờ mới của lịch hẹn',
  'Đăng ký': 'Tạo lịch hẹn ở trạng thái Đã duyệt, thân nhân check-in sau tại quầy', 'Tra cứu': 'Tìm thân nhân theo số căn cước công dân hoặc số điện thoại',
  'Thêm thân nhân đi cùng': 'Thêm 1 thân nhân đi cùng vào lịch hẹn', 'Chọn ngày hẹn': 'Mở lịch để chọn ngày thăm gặp',
  'Chọn ngày hôm nay': 'Chọn ngày thăm gặp là hôm nay', 'Giả lập quẹt thẻ': 'Giả lập quẹt thẻ căn cước để điền số tự động',
  'Quay lại bước trước': 'Quay lại bước trước, giữ nguyên thông tin đã nhập',
  'Chỉ chọn khung giờ, để hệ thống tự xếp buồng': 'Chỉ chọn khung giờ, hệ thống tự xếp buồng còn trống',
  'Dời lịch': 'Chuyển lịch hẹn sang ngày giờ khác', 'Hủy lịch hẹn': 'Hủy lịch hẹn này', 'Áp dụng': 'Áp dụng khen thưởng đã chọn cho tuần này',
  'Quay lại': 'Quay lại, không thực hiện thao tác', 'Trang trước': 'Xem trang trước', 'Trang sau': 'Xem trang sau',
};

const STATUS_FILTER_CODES = ['PENDING_APPROVAL', 'APPROVED', 'CHECKED_IN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ABSENT', 'REJECTED', 'DRAFT'];
const EXCEPTION_STATUS_FILTER_CODES = ['PENDING_HEAD_APPROVAL', 'REJECTED', 'CANCELLED'];
/* Luồng đăng ký — để rà soát lịch ngoại lệ đã duyệt nằm ở màn Thăm gặp trực tiếp */
const ROUTE_FILTER_CODES = [ROUTE_LINKED, ROUTE_EXEMPTION];
const SOURCE_FILTER_CODES = ['APP', 'COUNTER', 'STAFF'];
/* domKey = suffix of the element ids (ddtt …) · FILTER_CELL_CLASS = class of the filter cell (CSS_Class_Mapping.md) */
const FILTER_CELL_CLASS = { status: 'filter-status', table: 'filter-table', counter: 'filter-counter', source: 'filter-source', route: 'filter-route' };
/* ô chọn danh mục có Mã hiển thị «Mã — Tên» gạch dài; giá trị lọc vẫn là mã */
const tableText = (v) => { const t = readTables().find((x) => x.code === v); return t && t.name ? v + ' — ' + t.name : v; };
const counterText = (v) => { const c = findCounter(v); return c ? counterLabel(c) : v; };
const FILTER_DROPDOWNS = [
  { field: 'status', domKey: 'tt', placeholder: 'Tất cả trạng thái', ariaLabel: 'Trạng thái', text: statusLabel },
  { field: 'table', domKey: 'ban', placeholder: 'Tất cả buồng thăm gặp', ariaLabel: 'Buồng thăm gặp', text: tableText },
  { field: 'counter', domKey: 'quay', placeholder: 'Tất cả quầy tiếp đón', ariaLabel: 'Quầy tiếp đón', text: counterText },
  { field: 'source', domKey: 'ngd', placeholder: 'Tất cả nguồn đăng ký', ariaLabel: 'Nguồn đăng ký', text: sourceLabel },
  { field: 'route', domKey: 'luong', placeholder: 'Tất cả luồng đăng ký', ariaLabel: 'Luồng đăng ký', text: routeFilterText, mainOnly: true },
];
/* option value attributes are gold-standard DOM values */

const Empty = () => <span className="empty">—</span>;
function CategoryTag({ value, tagClass, style }) {
  if (!value || value === '—') return <Empty />;
  if (tagClass === 'tag-relationship' && RELATIONSHIP_TAG_CLASS[value]) tagClass = RELATIONSHIP_TAG_CLASS[value]; else if (tagClass === 'tag-type' && VISIT_TYPE_TAG_CLASS[value]) tagClass = VISIT_TYPE_TAG_CLASS[value];
  return <AppTag className={'tag ' + tagClass} style={style}>{truncate(value)}</AppTag>;
}
const SvgIcon = ({ d, strokeWidth = '2', linecap = 'round', linejoin = 'round', raw, className }) => <Svg raw={raw || d} strokeWidth={strokeWidth} linecap={linecap} linejoin={linejoin} className={className} />;
const WARNING_ICON = '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>';
const CLOSE_ICON = '<path d="M18 6 6 18M6 6l12 12"/>';
const ChevronIcon = <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 5l8 7-8 7z" /></svg>;

/* Red error text sits exactly 4px under its field */
function alignErrorText(errorEl, fieldEl) {
  if (!errorEl || !fieldEl || !fieldEl.getBoundingClientRect) return;
  errorEl.style.paddingLeft = '0px'; errorEl.style.marginTop = '';
  if (!/^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(fieldEl.tagName)) return;
  if (fieldEl.closest && fieldEl.closest('.app-counter-wrap')) return;   /* ô có bộ đếm ⇒ chữ đỏ theo bố cục chung dưới khung ô + bộ đếm */
  const fieldRect = fieldEl.getBoundingClientRect(); if (!fieldRect.width) return;
  const spacing = errorEl.getBoundingClientRect().top - fieldRect.bottom;
  if (Math.abs(spacing - 4) > 0.5) errorEl.style.marginTop = (parseFloat(getComputedStyle(errorEl).marginTop) - (spacing - 4)) + 'px';
}
const FieldError = ({ id, errors }) => <span className={'field-error' + (errors[id] ? ' on' : '')} id={id}><RichText text={errors[id] || ''} /></span>;
const DialogWarningIcon = <DialogIcon level="warn" />;   /* Vắng mặt, Từ chối có ảnh hưởng ⇒ cam; Điều chỉnh, Duyệt là thao tác thường ⇒ không icon */
const CloseButton = DialogCloseButton;
/* error id => field id used to place the error text */
const ERROR_ANCHORS = { lyDoLoi: 'lyDo', huyGhiChuLoi: 'huyGhiChu', dlgTuChoiLyDoLoi: 'dlgTuChoiLyDo', dcLyDoLoi: 'dcLyDo', dcLuoiLoi: null, ktLyDoLoi: 'ktLyDo' };


/* Popup Đổi lịch dùng bộ lịch chung: mount TablePicker vào 1 thẻ div, cập nhật khi đổi ngày */
function AdjustPicker({ config, value, onChange }) {
  const host = useRef(null), inst = useRef(null), cb = useRef(onChange); cb.current = onChange;
  useLayoutEffect(() => {
    inst.current = mountTablePicker(host.current, { ...config, value }, { onChange: (v) => cb.current(v) });
    const t = setTimeout(() => { if (inst.current) inst.current.update({ value }); }, 120);   /* popup đã hiện đủ bề rộng ⇒ cuộn lại tới lịch đang đổi */
    return () => { clearTimeout(t); inst.current.destroy(); };
  }, []);
  const dayKey = config.dayText;
  const first = useRef(true);
  useLayoutEffect(() => { if (first.current) { first.current = false; return; } if (inst.current) inst.current.update({ ...config, value }); }, [dayKey]);
  return <div ref={host} id="dcLichBan" />;
}

export default function AppointmentList({ variant = 'main' }) {
  const isException = variant === 'exception';
  const screen = isException ? SCREEN_EXCEPTION : SCREEN_DIRECT;   /* bảng quyền của màn */
  /* cột Thao tác: số nút tối đa của vai × (nút 32px + khe 4px) + lề 48px, tối thiểu 120px cho chữ tiêu đề */
  const actionColumnWidth = Math.max(120, maxActionCount(isException) * 36 - 4 + 48);
  const SCREEN_TABS = isException ? EXCEPTION_TABS : TABS;
  const layout = appointmentsLayout(isException ? 'Lịch hẹn gặp trực tiếp ngoại lệ' : DIRECT_LIST_LABEL);
  const params = useMemo(() => new URLSearchParams(location.search), []);
  const [appointments, setAppointments] = useState(buildAppointments);
  /* danh sách của màn này: màn ngoại lệ chỉ đơn chưa được Trưởng cơ sở duyệt, màn chính là phần còn lại */
  const screenAppointments = appointments.filter((r) => isExceptionRecord(r) === isException);
  const today = new Date();
  /* khoảng ngày mặc định để trống ⇒ mở màn thấy toàn bộ dữ liệu */
  const [filter, setFilter] = useState({ keyword: '', dateFrom: '', dateTo: '', status: '', source: '', table: '', counter: '', route: '' });
  const [activeTab, setActiveTab] = useState('ALL');
  const [openDropdown, setOpenDropdown] = useState('');
  const [showMoreFilters, setShowMoreFilters] = useState(false);   /* phần Tìm kiếm mở rộng gập sẵn khi mở màn */
  const [pageSize, setPageSize] = useState('10');
  const [page, setPage] = useState(1);   /* phân trang thật theo NotificationList */
  const [selectedCodes, setSelectedCodes] = useState(() => new Set());
  const isGridMode = /\/lich-theo-buong\/?$/.test(location.pathname);   /* lưới theo buồng là màn riêng, URL riêng */
  const listUrl = isException ? ROUTES.exceptionList : ROUTES.appointmentList;
  /* màn chính chỉ chứa đơn ngoại lệ đã duyệt, màn ngoại lệ chỉ chứa đơn chưa duyệt (isExceptionRecord) */
  const exceptionTip = isException ? 'Đơn ngoại lệ chưa được Trưởng cơ sở phê duyệt' : 'Đơn ngoại lệ đã được Trưởng cơ sở phê duyệt';
  const [gridDate, setGridDate] = useState(() => new Date());
  const [calendarState, setCalendarState] = useState(null);
  const [openDialog, setOpenDialog] = useState('');
  const [errors, setErrors] = useState({});
  const [targetCode, setTargetCode] = useState(null);
  const [bulkCodes, setBulkCodes] = useState(null);     /* null = duyệt 1 lịch; mảng mã = duyệt hoặc từ chối hàng loạt */
  const [form, setForm] = useState({ cancelReason: '', cancelNote: '', approveNote: '', rejectReason: '', adjustReason: '', dropReason: '' });
  const [notify, setNotify] = useState({});   /* giá trị trường Gửi thông báo của popup đang mở */
  const [bulkNotice, setBulkNotice] = useState({ text: '', visible: false, soft: false });
  const [adjust, setAdjust] = useState(null);           /* { code, record, date, oldDate, oldTime, oldTable, hasDate, picked, saving } */
  const [pendingDrop, setPendingDrop] = useState(null); /* { code, time, table } waiting for confirmation */
  const [highlight, setHighlight] = useState({ code: '', faded: false });

  /* the HTML page redraws tbody on every condition change => row checkboxes reset */
  useEffect(() => { setSelectedCodes(new Set()); }, [activeTab, filter, appointments, page]);   /* đổi trang cũng bỏ chọn — chỉ chọn trong trang đang hiện */
  useEffect(() => { setPage(1); }, [activeTab, filter, pageSize]);   /* đổi lọc, tab, số dòng ⇒ về trang 1 */
  /* Hàng loạt + cột ô tích CHỈ ở tab có thao tác hàng loạt: Chờ duyệt, Đã duyệt */
  const BULK_TABS = ['PENDING_APPROVAL', 'PENDING_HEAD_APPROVAL', 'APPROVED'];
  const screenHasBulk = ['approve', 'reject', 'cancel'].some((a) => can(screen, a));   /* vai trò không có thao tác hàng loạt nào ⇒ ẩn Hàng loạt và cột ô tích */
  const bulkDisabled = BULK_DISABLED_TABS.indexOf(activeTab) >= 0 || BULK_TABS.indexOf(activeTab) < 0 || !screenHasBulk;
  const rows = rowsForTab(screenAppointments, activeTab, filter);
  const gridAppointments = appointments.filter((x) => x.status !== 'DRAFT');   /* Nháp không giữ buồng nên không hiện trên lưới buồng */
  const filteredAll = applyFilter(screenAppointments.slice(), filter);
  const pageCount = Math.max(1, Math.ceil(rows.length / parseInt(pageSize, 10)));
  const current = Math.min(page, pageCount);   /* danh sách co lại thì kẹp về trang cuối */
  const pageRows = rows.slice((current - 1) * parseInt(pageSize, 10), current * parseInt(pageSize, 10));
  const selectedCount = [...selectedCodes].filter((c) => rows.some((r) => r.code === c)).length;
  const selectedStatuses = [...new Set(rows.filter((r) => selectedCodes.has(r.code)).map((r) => r.status))];
  const canApprove = canApproveAppointment() && can(screen, 'approve');
  const allowedBulk = (bulkDisabled || selectedStatuses.length !== 1 ? [] : (BULK_ACTIONS_BY_STATUS[selectedStatuses[0]] || []))
    .filter((a) => APPROVER_ONLY_ACTIONS.indexOf(a) < 0 || (canApprove && rows.filter((r) => selectedCodes.has(r.code)).every(canApproveRecord)))   /* mọi lịch đã chọn đều thuộc quyền duyệt của mình */
    .filter((a) => rows.filter((r) => selectedCodes.has(r.code)).every((r) => can(screen, a, r)));
  const selectedRowCodes = rows.filter((r) => selectedCodes.has(r.code)).map((r) => r.code);
  /* nút nào thuộc trạng thái đang chọn thì mới vẽ (tab Đã duyệt chỉ có Hủy — BR1-8 SRS v2.0); thuộc mà chưa đủ quyền duyệt thì vẽ ở dạng tắt */
  const statusBulk = selectedStatuses.length === 1 ? (BULK_ACTIONS_BY_STATUS[selectedStatuses[0]] || []) : [];
  /* bộ lọc lấy từ DANH MỤC (buồng, quầy đã kích hoạt — kể cả đang Vô hiệu hóa để lọc lịch cũ), cộng mã còn trên lịch nhưng đã rời danh mục */
  const tableOptions = [...new Set(readTables().filter((t) => t.status !== 'DRAFT').map((t) => t.code).concat(appointments.map((r) => r.tableCode).filter(Boolean)))].sort();
  const counterOptions = [...new Set(readCounters().filter((c) => c.status !== 'DRAFT').map((c) => c.code).concat(appointments.map((r) => r.counterCode).filter(Boolean)))].filter((x) => x !== '—').sort();
  const OPTIONS = { status: isException ? EXCEPTION_STATUS_FILTER_CODES : STATUS_FILTER_CODES, table: tableOptions, counter: counterOptions, source: SOURCE_FILTER_CODES, route: ROUTE_FILTER_CODES };
  const screenDropdowns = FILTER_DROPDOWNS.filter((d) => !(isException && d.mainOnly));
  const moreCount = screenDropdowns.filter((d) => d.field !== 'status' && filter[d.field]).length;   /* số điều kiện mở rộng đang chọn */
  /* đếm ô lọc có giá trị — giá trị rỗng là «Tất cả», mục đầu danh sách cũng là lọc thật */
  const filterCount = (filter.codes && filter.codes.length ? 1 : 0) + (filter.keyword.trim() ? 1 : 0) + (filter.dateFrom || filter.dateTo ? 1 : 0) + screenDropdowns.filter((d) => !!filter[d.field]).length;

  /* đổi bất kỳ ô lọc nào ⇒ thoát chế độ xem các lịch của thông báo gộp (?codes=) */
  const updateFilter = (patch) => setFilter((x) => ({ ...x, codes: patch.codes || null, ...patch }));
  const showDialog = (id) => { setErrors({}); setOpenDialog(id); };
  const closeDialog = () => setOpenDialog('');
  const showError = (id, text) => setErrors((x) => ({ ...x, [id]: text }));
  const clearFieldError = (fieldId) => setErrors((x) => (x[fieldId + 'Loi'] ? { ...x, [fieldId + 'Loi']: '' } : x));
  const findByCode = (code) => appointments.find((x) => x.code === code);
  /* đổi trạng thái thì lưu lại và ghi 1 dòng Lịch sử thao tác */
  const changeStatus = (code, status, action, reason, note = '') => { const r = findByCode(code); if (action) logAction(code, action, { statusBefore: r ? r.status : null, statusAfter: status, reason, note });   /* note = ghi chú hệ thống */ setStatus(code, status); setAppointments((list) => list.map((x) => (x.code === code ? { ...x, status, ui: { ...x.ui, rowState: '' } } : x))); };
  const highlightRow = (code) => { setHighlight({ code, faded: false }); setTimeout(() => { const td = [...document.querySelectorAll('#tb td')].find((x) => (x.textContent || '').trim().indexOf(code) >= 0); const tr = td ? td.closest('tr') : null; if (tr) tr.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, 0); setTimeout(() => setHighlight({ code, faded: true }), 3000); };

  /* red error text: 4px under its field after each show */
  useLayoutEffect(() => {
    Object.keys(errors).forEach((id) => { if (!errors[id]) return; const errorEl = document.getElementById(id); const fieldEl = ERROR_ANCHORS[id] ? document.getElementById(ERROR_ANCHORS[id]) : null; if (errorEl) alignErrorText(errorEl, fieldEl);
      const target = fieldEl || errorEl; if (target) { const r = target.getBoundingClientRect(); if (r.top < 0 || r.bottom > innerHeight) target.scrollIntoView({ behavior: 'smooth', block: 'center' }); } });
  }, [errors]);

  /* close filter dropdowns on outside click */
  useEffect(() => { const h = (e) => { if (!e.target.closest('.filter-select')) setOpenDropdown(''); }; document.addEventListener('click', h); return () => document.removeEventListener('click', h); }, []);
  /* Escape closes popups (the HTML page listens on document) */
  useEffect(() => { const h = (e) => { if (e.key === 'Escape') setOpenDialog(''); }; document.addEventListener('keydown', h); return () => document.removeEventListener('keydown', h); }, []);
  /* ?created= / ?updated= toast and highlight the row · ?counterCode= preselects the counter */
  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return; didInit.current = true;
    const code = params.get('created') || params.get('updated'), isEdit = !params.get('created') && !!params.get('updated');
    /* 1 câu duy nhất nói đủ: đã làm gì + lịch đang ở đâu (luồng đã có sổ/tài khoản thì duyệt ngay) — màn Tạo mới / Chỉnh sửa / Tại quầy không báo trước khi chuyển trang */
    const result = params.get('result'), verb = isEdit ? 'Đã cập nhật' : 'Đã tạo', done = msg(isEdit ? 'I001-03' : 'I001-01', 'lịch hẹn ' + key(code));
    const message = result === 'draft' ? msg('I001-02', 'lịch hẹn ' + key(code))
      : result === 'counter' ? msg('I001-63', code)
      : result === 'pending' ? msg(isEdit ? 'I001-60' : 'I001-58', code)
      : result === 'exception' ? msg('I001-64', code)
      : result === 'exception-resubmit' ? msg('I001-65', verb, code)
      : result === 'auto' ? msg(isEdit ? 'I001-59' : 'I001-57', code)
      : done;
    if (code) setTimeout(() => { toast(message); highlightRow(code); }, delayFromPageStart(500));
    /* xóa từ trang Chi tiết: bỏ lịch khỏi danh sách (lịch mẫu chỉ bỏ khỏi màn) rồi báo */
    const deleted = params.get('deleted');
    if (deleted) { setAppointments((list) => list.filter((x) => x.code !== deleted)); setTimeout(() => toast(msg('I001-04', 'lịch hẹn ' + key(deleted))), delayFromPageStart(500)); }
    const codesParam = (params.get('codes') || '').split(',').map((x) => x.trim()).filter(Boolean);
    if (codesParam.length) updateFilter({ codes: codesParam, dateFrom: '', dateTo: '' });
    const counterParam = params.get('counterCode');
    if (counterParam) { if (counterOptions.indexOf(counterParam) >= 0) updateFilter({ counter: counterParam }); else toast(msg('W001-08', counterParam), 'is-warning'); }
  }, []);
  /* grid view refreshes every 60 seconds while visible */
  const [, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => { const el = document.getElementById('vungLich'); if (!document.hidden && el && el.offsetParent !== null) setTick((n) => n + 1); }, 60000); return () => clearInterval(t); }, []);

  /* ── Grid view: time-axis calendar ListCalendar.jsx; a valid drop opens dlgKeoTha ── */
  const gridDateText = formatDate(gridDate);

  /* ── Row actions ── */
  /* Xem, Chỉnh sửa mở màn của CHÍNH danh sách đang đứng — danh sách ngoại lệ ⇒ /lich-hen/gap-truc-tiep-ngoai-le/:id(/chinh-sua) */
  const editPathHere = (code) => (isException ? exceptionEditPath(code) : appointmentEditPath(code));
  const detailPathHere = (code) => (isException ? exceptionDetailPath(code) : appointmentDetailPath(code));
  const openEdit = (code) => { const r = findByCode(code); if (r) writeEditing(r); location.href = editPathHere(code); };
  const openCancel = (code) => { setBulkCodes(null); setTargetCode(code); setForm((x) => ({ ...x, cancelReason: '', cancelNote: '' })); showDialog('dlgHuy'); };
  /* mở popup ⇒ trường Gửi thông báo nạp người chuẩn theo luồng (mục chọn thông báo của lịch + thân nhân thuộc lịch) */
  const loadNotify = (code, codes) => setNotify(defaultRecipients(code, codes.map(findByCode).filter(Boolean)));
  /* đơn xin ngoại lệ ⇒ dòng APPOINTMENT_EXCEPTION_APPROVED / _REJECTED (công tắc + nội dung riêng), còn lại ⇒ dòng thường */
  const approvedCodeFor = (codes) => approvedCodeOf(findByCode([].concat(codes)[0]));
  const rejectedCodeFor = (codes) => rejectedCodeOf(findByCode([].concat(codes)[0]));
  const openApprove = (code) => { setBulkCodes(null); setTargetCode(code); setForm((x) => ({ ...x, approveNote: '' })); loadNotify(approvedCodeFor([code]), [code]); showDialog('dlgDuyet'); };
  const openReject = (code) => { setBulkCodes(null); setTargetCode(code); setForm((x) => ({ ...x, rejectReason: '' })); loadNotify(rejectedCodeFor([code]), [code]); showDialog('dlgTuChoi'); };
  /* Hàng loạt: dùng lại 2 popup, nêu rõ số lịch hẹn sẽ được duyệt hoặc từ chối */
  const openBulkApprove = () => { setBulkCodes(selectedRowCodes); setForm((x) => ({ ...x, approveNote: '' })); loadNotify(approvedCodeFor(selectedRowCodes), selectedRowCodes); showDialog('dlgDuyet'); };
  const openBulkReject = () => { setBulkCodes(selectedRowCodes); setForm((x) => ({ ...x, rejectReason: '' })); loadNotify(rejectedCodeFor(selectedRowCodes), selectedRowCodes); showDialog('dlgTuChoi'); };
  const dialogCodes = bulkCodes || (targetCode ? [targetCode] : []);
  /* Xóa lịch hẹn — lịch Nháp và Từ chối duyệt (ROW_ACTIONS_BY_STATUS), hộp dùng chung với Chi tiết */
  const openDelete = (code) => { setTargetCode(code); showDialog('dlgXoaNhap'); };
  /* Đánh dấu vắng mặt: Đã duyệt đã quá giờ hẹn ⇒ Vắng mặt, nhả buồng thăm gặp; chỉ cán bộ bấm tại quầy */
  const openAbsent = (code) => { setTargetCode(code); loadNotify(NOTIFICATION_CODES.ABSENT, [code]); showDialog('dlgVangMat'); };
  const confirmAbsent = () => {
    if (notifyBlocked(NOTIFICATION_CODES.ABSENT, [targetCode])) return;
    const r = findByCode(targetCode), sent = r ? sendForRecord(NOTIFICATION_CODES.ABSENT, { ...r, status: 'ABSENT' }, notify) : '';   /* báo thân nhân đã trừ lượt */
    changeStatus(targetCode, 'ABSENT', 'Đánh dấu vắng mặt', '', ['Đã quá giờ hẹn mà thân nhân chưa đến', sent].filter(Boolean).join(' · '));   /* thao tác không có lời người dùng nhập ⇒ Ghi chú hệ thống */ closeDialog(); toast(msg('I001-62', targetCode));
  };
  const confirmDelete = () => {
    const code = targetCode; const del = findByCode(code);
    logAction(code, 'Xóa lịch hẹn', { statusBefore: del ? del.status : null }); setStatus(code, 'DELETED');
    try { const list = readCreated(); const k = list.findIndex((x) => x.code === code); if (k >= 0) { list.splice(k, 1); writeCreated(list); } } catch (e) { /* bản nháp mẫu: chỉ bỏ khỏi màn */ }
    setAppointments((list) => list.filter((x) => x.code !== code)); closeDialog(); toast(msg('I001-04', 'lịch hẹn ' + key(code)));
  };
  const openAdjust = (code) => {
    const r = findByCode(code) || null; const oldTime = r ? (r.visitTime || '') : ''; const oldDate = r ? visitDateText(r) : '';
    const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(oldDate);
    setAdjust({ code, record: r, date: m ? new Date(+m[3], +m[2] - 1, +m[1]) : new Date(), oldDate, oldTime, oldTable: r ? r.tableCode : '', hasDate: !!m, picked: null, saving: false });
    setForm((x) => ({ ...x, adjustReason: '' })); loadNotify(NOTIFICATION_CODES.RESCHEDULED, [code]); showDialog('dlgDieuChinh');
  };
  const ROW_HANDLERS = { view: (code) => { location.href = detailPathHere(code); }, edit: openEdit, approve: openApprove, reject: openReject, adjust: openAdjust, cancel: openCancel, absent: openAbsent, delete: openDelete };

  /* hộp Hủy dùng chung với Chi tiết lịch hẹn (components/app/CancelAppointmentDialog) — tự kiểm lý do và ghi chú */
  /* lưu lý do, ghi chú và lựa chọn gửi thông báo vào bản ghi */
  /* Hủy từng lịch hoặc HÀNG LOẠT (bulkCodes), mỗi lịch ghi 1 dòng Lịch sử thao tác kèm lý do, ghi chú, lựa chọn gửi thông báo */
  const confirmCancel = ({ reasonLabel, note, recipients, withProposal } = {}) => {
    const codes = bulkCodes || [targetCode], reason = [reasonLabel, note].filter(Boolean).join(' — ');
    let anySent = false;   /* gửi theo trường Gửi thông báo của popup Hủy, mỗi lịch chỉ gửi thân nhân của lịch đó */
    const isBulk = codes.length > 1, pairs = [];   /* hàng loạt ⇒ cán bộ nhận 1 thông báo gộp */
    codes.forEach((c) => { const r = findByCode(c); if (!r) return;
      /* Hủy và đề xuất lịch thay thế ⇒ tìm khung trống gần nhất 7 ngày, gửi kèm thông báo; không tìm được thì vẫn hủy, ghi rõ */
      const proposal = withProposal ? findAlternativeSlot(r, appointments) : null;
      const code = proposal ? NOTIFICATION_CODES.CANCELLED_WITH_PROPOSAL : NOTIFICATION_CODES.CANCELLED;
      const after = { ...r, status: 'CANCELLED', proposal }; pairs.push([code, after]);
      const sent = sendForRecord(isBulk && !proposal ? bulkCodeOf(code) : code, after, recipients, { reason: reasonLabel || '', skipStaff: isBulk });   /* hàng loạt ⇒ thân nhân theo dòng hàng loạt (bắt buộc nhận) */ if (/^Đã gửi/.test(sent)) anySent = true;   /* ㉑: chỉ tính người đã gửi thật */
      const proposalText = !withProposal ? '' : proposal ? 'Đề xuất lịch thay thế: ' + visitDateText({ visitDate: proposal.visitDate }) + ' ' + proposal.visitTime + ' · ' + tableLabel(proposal.tableCode) : 'Không tìm được khung giờ trống trong 7 ngày để đề xuất';
      logAction(c, withProposal ? 'Hủy và đề xuất lịch thay thế' : 'Hủy lịch hẹn', { statusBefore: r.status, statusAfter: 'CANCELLED', reason, note: [proposalText, sent].filter(Boolean).join(' · ') }); setStatus(c, 'CANCELLED'); });
    if (isBulk) bulkStaff(pairs, recipients, { reason: reasonLabel || '' });
    const notify = anySent;
    setAppointments((list) => list.map((x) => (codes.indexOf(x.code) >= 0 ? { ...x, status: 'CANCELLED', cancelReason: reasonLabel || '', cancelNote: note || '', cancelNotified: !!notify, ui: { ...x.ui, rowState: '' } } : x)));
    closeDialog(); if (bulkCodes) setSelectedCodes(new Set());
    const what = codes.length > 1 ? key(codes.length) + ' lịch hẹn' : 'lịch hẹn ' + key(codes[0]); toast(notify ? msg('I001-66', what) : msg('I001-09', what));
  };
  /* đơn ngoại lệ duyệt xong rời màn này, sang màn Thăm gặp trực tiếp ⇒ toast I001-67 thay I001-07 */
  /* bỏ Chờ check-in — Phê duyệt luôn vào Đã duyệt, thân nhân check-in sau tại quầy */
  /* gửi theo trường Gửi thông báo của popup; thông báo đang Tắt ⇒ trường ẩn, không gửi, không ghi «Đã gửi…» */
  const withSent = (note, sent) => [note, sent];   /* [lý do người dùng nhập, ghi chú hệ thống] ⇒ changeStatus(..., ...withSent) */
  /* [mã thông báo, lịch sau thao tác] ⇒ gom theo mã thông báo (đơn thường / đơn ngoại lệ), mỗi cán bộ 1 thông báo gộp mỗi mã */
  const bulkStaff = (pairs, value, opts) => { const by = {}; pairs.forEach(([c, r]) => { (by[bulkCodeOf(c)] = by[bulkCodeOf(c)] || []).push(r); }); Object.keys(by).forEach((c) => sendBulkStaff(c, by[c], value, opts)); };   /* đơn thường và đơn ngoại lệ chung 1 dòng hàng loạt */
  /* nhóm bắt buộc đang tick mà chưa có người ⇒ không lưu (chữ đỏ hiện ngay dưới ô) */
  const notifyBlocked = (code, codes) => notifyMissing(code, codes.map(findByCode).filter(Boolean), notify).length > 0;
  const confirmApprove = () => {
    if (notifyBlocked(approvedCodeFor(dialogCodes), dialogCodes)) return;
    if (bulkCodes) {
      const pairs = [];
      bulkCodes.forEach((c) => { const r = findByCode(c); if (!r) return; const after = { ...r, status: 'APPROVED' }; pairs.push([approvedCodeOf(r), after]); changeStatus(c, 'APPROVED', 'Phê duyệt', ...withSent(form.approveNote.trim(), sendForRecord(bulkCodes.length > 1 ? bulkCodeOf(approvedCodeOf(r)) : approvedCodeOf(r), after, notify, { skipStaff: bulkCodes.length > 1 }))); });
      if (bulkCodes.length > 1) bulkStaff(pairs, notify, {});
      closeDialog(); setSelectedCodes(new Set()); toast(isException ? msg('I001-67', key(bulkCodes.length) + ' lịch hẹn') : msg('I001-07', key(bulkCodes.length) + ' lịch hẹn')); return;
    }
    if (!findByCode(targetCode)) return;
    changeStatus(targetCode, 'APPROVED', 'Phê duyệt', ...withSent(form.approveNote.trim(), sendForRecord(approvedCodeOf(findByCode(targetCode)), { ...findByCode(targetCode), status: 'APPROVED' }, notify))); closeDialog(); toast(isException ? msg('I001-67', 'lịch hẹn ' + key(targetCode)) : msg('I001-07', 'lịch hẹn ' + key(targetCode)));
  };
  const confirmReject = () => {
    if (notifyBlocked(rejectedCodeFor(dialogCodes), dialogCodes)) return;
    if (!form.rejectReason.trim()) { showError('dlgTuChoiLyDoLoi', msg('E001-04', 'từ chối')); document.getElementById('dlgTuChoiLyDo').focus(); return; }
    if (bulkCodes) {
      const pairs = [], many = bulkCodes.length > 1;
      bulkCodes.forEach((c) => { const r = findByCode(c); recordRejection(c, form.rejectReason); const after = r ? { ...r, status: 'REJECTED' } : null; if (after) pairs.push([rejectedCodeOf(r), after]); changeStatus(c, 'REJECTED', 'Từ chối duyệt', ...withSent(form.rejectReason.trim(), after ? sendForRecord(many ? bulkCodeOf(rejectedCodeOf(r)) : rejectedCodeOf(r), after, notify, { reason: form.rejectReason.trim(), skipStaff: many }) : '')); });
      if (many) bulkStaff(pairs, notify, { reason: form.rejectReason.trim() });
      runAutoCancel().forEach((c) => changeStatus(c, 'CANCELLED'));   /* từ chối khi đã qua mốc trước giờ hẹn ⇒ hủy ngay */
      closeDialog(); setSelectedCodes(new Set());
      toast(msg('I001-08', key(bulkCodes.length) + ' lịch hẹn')); return;
    }
    { const r = findByCode(targetCode); recordRejection(targetCode, form.rejectReason); changeStatus(targetCode, 'REJECTED', 'Từ chối duyệt', ...withSent(form.rejectReason.trim(), r ? sendForRecord(rejectedCodeOf(r), { ...r, status: 'REJECTED' }, notify, { reason: form.rejectReason.trim() }) : '')); } runAutoCancel().forEach((c) => changeStatus(c, 'CANCELLED')); closeDialog(); toast(msg('I001-08', 'lịch hẹn ' + key(targetCode)));
  };

  /* ── Bulk actions ── */
  const openBulk = () => {
    let notice = { text: bulkNotice.text, visible: false, soft: bulkNotice.soft };
    if (selectedStatuses.length > 1) notice = { ...notice, text: msg('E001-23', selectedStatuses.length, selectedStatuses.map(statusLabel).join(', ')), visible: true };
    else if (selectedStatuses.length === 1) notice = { text: msg('I001-82', selectedCount, statusLabel(selectedStatuses[0])), visible: true, soft: true };
    setBulkNotice(notice); showDialog('dlgHL');
  };
  /* có quyền Hủy là hủy hàng loạt được, không giới hạn số lịch, chỉ cần lý do */
  const tryBulkCancel = () => { setBulkCodes(selectedRowCodes); showDialog('dlgHuy'); };

  /* ── Adjust ── */
  const adjustDuration = () => (adjust && adjust.record && adjust.record.durationMinutes ? +adjust.record.durationMinutes : 45);
  const adjustDayLabel = (d) => WEEKDAY_NAMES[d.getDay()] + ', ' + formatDate(d);
  const isSameDay = adjust ? formatDate(adjust.date) === adjust.oldDate : false;
  /* bộ lịch chung trong popup: buồng của quầy giữ lịch (buồng ⇒ quầy; chưa xếp buồng thì quầy của người cai nghiện), giờ của ngày theo WEB-54,
 * lịch khác của ngày đó là khối xám, trừ chính lịch đang đổi; lịch nguồn App và cán bộ đặt hộ không dùng suất riêng */
  const adjustCounter = adjust && adjust.record ? (findCounter(counterCodeOf(adjust.record)) || studentResource(adjust.record.studentCode).counter) : null;
  const adjustConfig = (() => {
    if (!adjust) return null;
    const day = toIsoDate(formatDate(adjust.date)), today = toIsoDate(formatDate(new Date()));
    const room = allCountersRoom(adjustCounter, adjust.date, usesReserved(adjust.record && adjust.record.source));   /* quầy đang giữ lịch trên đầu, các quầy khác bên dưới */
    const cfg = timelineConfig(room, (adjust.picked && adjust.picked.duration) || adjustDuration(), bookingSettings(), bookedFrom(gridAppointments, day, HOLDS_NO_RESOURCE, adjust.code), day < today ? -1 : day === today ? 0 : 1);
    return { ...cfg, dayText: formatDate(adjust.date), draftLabel: 'Lịch đang đổi', groupLabel: counterLabel(adjustCounter) };
  })();
  /* lịch đang đổi: cùng ngày thì hiện sẵn ở vị trí cũ (chỉ kéo lịch đó); đã kéo thì theo chỗ mới */
  const adjustValue = !adjust ? null : adjust.picked ? { start: clockToMinutes(adjust.picked.time), end: clockToMinutes(adjust.picked.time) + (adjust.picked.duration || adjustDuration()), tableCode: adjust.picked.table }
    : isSameDay && adjust.oldTime && adjust.oldTable ? { start: clockToMinutes(adjust.oldTime), end: clockToMinutes(adjust.oldTime) + adjustDuration(), tableCode: adjust.oldTable } : null;
  const adjustReady = !!(adjust && adjust.picked) && form.adjustReason.trim().length > 0;
  const pickAdjust = (v) => { setAdjust((x) => ({ ...x, picked: v ? { time: minutesToClock(v.start), table: v.tableCode, duration: v.duration || (v.end - v.start) } : null })); if (v) clearFieldError('dcLuoi'); };
  /* Same order as the HTML page: the row in memory takes the new slot first, then the store is read.
 * A broken store aborts the save (error toast, popup stays open) but the row keeps the new slot until the next redraw. */
  const saveAdjusted = (code, dateText, time, table, reason, duration, notifyValue) => {
    const row = appointments.find((x) => x.code === code);
    const before = row ? { when: visitDateText(row) + (row.visitTime ? ' ' + row.visitTime : ''), table: row.tableCode || 'Chưa xếp', dur: row.durationMinutes ? +row.durationMinutes : 45 } : null;
    /* quầy theo buồng mới — dời sang buồng của quầy khác (popup Điều chỉnh hoặc kéo thả) ⇒ Quầy tiếp đón đổi theo, báo W001-22 */
    const oldCounter = row ? counterCodeOf(row) : '';
    const newTable = readTables().find((t) => t.code === table), newCounter = newTable ? newTable.counterCode : '';
    const counterChanged = !!(oldCounter && newCounter && oldCounter !== newCounter);
    if (row) { row.visitDate = toIsoDate(dateText); row.visitTime = time; row.tableCode = table; if (duration) row.durationMinutes = duration; if (newCounter) row.counterCode = newCounter; }
    try {
      const saved = readAdjusted({ strict: true });
      saved[code] = { visitDate: toIsoDate(dateText), visitTime: time, tableCode: table, ...(newCounter ? { counterCode: newCounter } : {}), ...(duration ? { durationMinutes: duration } : {}), reason, savedAt: new Date().toISOString() };
      if (!writeAdjusted(saved)) throw new Error('storage');
    } catch (e) { toast(msg('SE001-01', 'Lưu điều chỉnh lịch hẹn'), 'is-error'); return false; }
    if (counterChanged) toast(msg('W001-22', counterLabelOf(oldCounter), counterLabelOf(newCounter)), 'is-warning');
    /* mỗi lần điều chỉnh (popup hoặc kéo thả) ghi 1 dòng, giữ đủ các lần chứ ⛔ chỉ lần cuối */
    const changes = before ? [['Ngày giờ thăm gặp', before.when, dateText + ' ' + time], ['Buồng thăm gặp', before.table, table]].concat(counterChanged ? [['Quầy tiếp đón', counterLabelOf(oldCounter), counterLabelOf(newCounter)]] : []).concat(duration && duration !== before.dur ? [['Thời lượng', before.dur + ' phút', duration + ' phút']] : []).filter((c) => c[1] !== c[2]) : [];
    /* điều chỉnh, dời lịch ⇒ gửi theo trường Gửi thông báo của popup, nội dung mang giờ và buồng MỚI */
    const sent = row ? sendForRecord(NOTIFICATION_CODES.RESCHEDULED, { ...row, visitDate: toIsoDate(dateText), visitTime: time, tableCode: table }, notifyValue, { reason }) : '';
    logAction(code, 'Điều chỉnh', { statusBefore: row ? row.status : null, statusAfter: row ? row.status : null, reason, note: sent, changes });
    return true;
  };
  const confirmAdjust = () => {
    if (!adjust || adjust.saving) return;
    if (notifyBlocked(NOTIFICATION_CODES.RESCHEDULED, [adjust.code])) return;
    const reason = form.adjustReason.trim();
    const found = {};
    if (!adjust.picked) found.dcLuoiLoi = msg('E001-02', 'khung giờ và buồng thăm gặp');
    if (!reason) found.dcLyDoLoi = msg('E001-04', 'điều chỉnh');
    if (!adjust.picked || !reason) { setErrors((x) => ({ ...x, ...found })); if (adjust.picked) document.getElementById('dcLyDo').focus(); return; }
    /* dời sang ngày khác ⇒ kiểm kỷ luật và lượt của TUẦN ngày mới, 1 nguồn visitQuotaStore; chính lịch đang dời không tính */
    const ban = adjust.record ? weekBan(adjust.record.studentCode, adjust.date, adjust.code) : { ok: true };
    if (!ban.ok) { setErrors((x) => ({ ...x, dcLuoiLoi: ban.reason })); toast(ban.reason, 'is-error'); return; }
    const newDateText = formatDate(adjust.date), { time, table, duration } = adjust.picked;
    if (!saveAdjusted(adjust.code, newDateText, time, table, reason, duration, notify)) return;
    setAppointments((list) => list.map((x) => (x.code === adjust.code ? { ...x, visitDate: toIsoDate(newDateText), visitTime: time, tableCode: table, ...(duration ? { durationMinutes: duration } : {}) } : x)));
    closeDialog();
    const newDay = parseDisplayDate(newDateText);
    setFilter((x) => ({ ...x, dateFrom: x.dateFrom && parseDisplayDate(x.dateFrom) > newDay ? newDateText : x.dateFrom, dateTo: x.dateTo && parseDisplayDate(x.dateTo) < newDay ? newDateText : x.dateTo }));
    highlightRow(adjust.code); toast(msg('I001-03', 'lịch hẹn ' + key(adjust.code)));
    setAdjust((x) => ({ ...x, picked: null }));
  };

  /* ── Drag and drop ── */
  const cancelDrop = () => { setPendingDrop(null); closeDialog(); setTick((n) => n + 1); };
  const openDropConfirm = (drop) => { setPendingDrop(drop); setForm((x) => ({ ...x, dropReason: '' })); loadNotify(NOTIFICATION_CODES.RESCHEDULED, [drop.code]); showDialog('dlgKeoTha'); };
  /* dời trên Lịch theo buồng bắt buộc nhập lý do trước khi lưu; lý do lưu kèm nguồn thao tác "Kéo thả trên Lịch theo buồng" */
  const confirmDrop = () => {
    if (!pendingDrop) return; const drop = pendingDrop;
    if (notifyBlocked(NOTIFICATION_CODES.RESCHEDULED, [drop.code])) return;
    const reason = form.dropReason.trim();
    if (!reason) { showError('ktLyDoLoi', msg('E001-04', 'điều chỉnh')); document.getElementById('ktLyDo').focus(); return; }
    if (!saveAdjusted(drop.code, gridDateText, drop.time, drop.table, 'Kéo thả trên Lịch theo buồng: ' + reason, drop.duration, notify)) return;
    setPendingDrop(null);
    setAppointments((list) => list.map((x) => (x.code === drop.code ? { ...x, visitDate: toIsoDate(gridDateText), visitTime: drop.time, tableCode: drop.table, ...(drop.duration ? { durationMinutes: drop.duration } : {}) } : x)));
    closeDialog(); toast(msg('I001-03', 'lịch hẹn ' + key(drop.code)));
  };
  const dropRecord = pendingDrop ? findByCode(pendingDrop.code) : null;
  const dropTimeRange = (r, start, duration) => (start ? start + ' ~ ' + addMinutes(start, duration || (r.durationMinutes ? +r.durationMinutes : 45)) : '');

  const switchTab = (key) => {
    setActiveTab(key); if (BULK_DISABLED_TABS.indexOf(key) >= 0 || BULK_TABS.indexOf(key) < 0) setSelectedCodes(new Set());
    if (key !== 'ALL') setFilter((x) => (x.status ? { ...x, status: '' } : x));   /* ô Trạng thái ẩn ở tab khác Tất cả ⇒ bỏ giá trị, không lọc ngầm */
  };

  const columns = [
    { key: 'index', className: 'col-index', thStyle: { width: '56px' }, title: 'STT', render: (r, i) => i + 1 },
    { key: 'code', className: 'c2 c-txt', thClassName: 'c-txt', thStyle: { width: '205px' }, title: 'Mã lịch hẹn', render: (r) => <><span className="cell-code">{r.code}</span>{isExemption(r) ? <span className="exception-flag" role="img" aria-label={exceptionTip} data-tip={exceptionTip}><Svg raw={'<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>'} /></span> : null}   {/* icon cờ cam cạnh mã thay tag, rê chuột hiện giải thích */}<div className="csub">{sourceLabel(r.source)}</div></> },
    { key: 'visitAt', className: 'col-datetime', thStyle: { width: '181px' }, title: 'Ngày giờ hẹn', render: (r) => visitDateTimeText(r) },
    { key: 'student', className: 'c3 c-txt', thClassName: 'c-txt', thStyle: { width: '202px' }, title: 'Người cai nghiện', render: (r) => <>
      <span className="cell-name">{truncate(r.studentName)}</span>
      {r.studentCitizenId ? <div className="csub">{'CCCD: ' + r.studentCitizenId}</div> : null}
      {r.studentBirthDate ? <div className="csub">{'Ngày sinh: ' + birthDateText(r)}</div> : null}
      {!r.studentCitizenId && !r.studentBirthDate ? <div className="csub">{truncate(studentCodeText(r))}</div> : null}</> },
    { key: 'dormitory', className: 'c-tag', thStyle: { width: '120px' }, title: 'Dãy nhà', render: (r) => (dormitoryOf(r) ? <CategoryTag value={dormitoryOf(r)} tagClass="tag-category" /> : <Empty />) },
    { key: 'room', className: 'c-tag', thStyle: { width: '110px' }, title: 'Phòng', render: (r) => (roomOf(r) ? <CategoryTag value={roomOf(r)} tagClass="tag-category" /> : <Empty />) },
    { key: 'visitor', className: 'c-txt', thStyle: { width: '219px' }, title: 'Thân nhân', render: (r) => joinText(r.visitorName ? truncate(r.visitorName) : <Empty />, r.companionCount ? [' ', <span className="csub" data-full={'Thân nhân đi cùng: ' + ((r.companions || []).map((c) => c.name).filter(Boolean).join(', ') || '—')}>{'+' + r.companionCount + ' người'}</span>] : null) },
    { key: 'relationship', className: 'c-tag', thStyle: { width: '138px' }, title: 'Quan hệ', render: (r) => <CategoryTag value={r.relationship} tagClass="tag-relationship" /> },
    { key: 'visitType', className: 'c-tag', thStyle: { width: '248px' }, title: 'Loại hình', render: (r) => <CategoryTag value={r.visitTypeName} tagClass="tag-type" /> },
    { key: 'table', className: 'c-tag', thStyle: { width: '172px' }, title: 'Buồng thăm gặp', render: (r) => (r.tableCode ? <CategoryTag value={tableLabel(r.tableCode)} tagClass="tag-table" style={valueTagStyle(r.tableCode, 'table')} /> : null) },
    { key: 'counter', className: 'c-tag', thStyle: { width: '170px' }, title: 'Quầy tiếp đón', render: (r) => <CategoryTag value={r.counterCode === '—' ? '' : counterLabelOf(r.counterCode)} tagClass="tag-category" style={valueTagStyle(r.counterCode, 'counter')} /> },
    { key: 'visitorCount', className: 'c-num', thStyle: { width: '135px' }, title: 'Số người', render: (r) => (r.ui && r.ui.isOverVisitorLimit
      ? <span className="visitor-count"><span className="ic-over-limit" data-nhac={OVER_LIMIT_WARNING.replace('{0}', r.visitorCount).replace('{1}', r.visitorCount - MAX_VISITORS).replace('{2}', MAX_VISITORS)}><Svg raw={WARNING_ICON} /></span>{r.visitorCount || '—'}</span>
      : (r.visitorCount || <Empty />)) },
    { key: 'duration', className: 'col-unit', thStyle: { width: '152px' }, title: 'Thời lượng', render: (r) => (r.durationMinutes ? r.durationMinutes + ' phút' : <Empty />) },
    { key: 'status', className: 'col-status', thStyle: { width: '224px' }   /* đủ tag dài nhất «Chờ Trưởng cơ sở duyệt» 173px + đệm 2 bên */, title: 'Trạng thái', render: (r) => <AppTag className={'tag tag-dot tag-' + STATUS_CLASS[r.status]}>{statusLabel(r.status)}</AppTag> },
    { key: 'actions', className: 'col-act', thStyle: { width: actionColumnWidth + 'px' }, title: 'Thao tác', render: (r) => (
      <div className="acts">{rowActions(r).map((action) => (
        <AppButtonWithIcon key={action} className={'ib ib-' + (ACTION_COLOR[action] || 'neutral') + (ROW_ACTIONS[action].danger ? ' dg' : '')} title={ROW_ACTIONS[action].label} onClick={() => ROW_HANDLERS[action](r.code)} icon={LIST_ICONS[action] ? undefined : ACTION_ICON[action]} iconRaw={LIST_ICONS[action]} />
      ))}</div>) },
  ];

  const hiddenInGrid = isGridMode ? { display: 'none' } : undefined;
  const renderFilterCell = (d) => {
    const values = OPTIONS[d.field], items = values.map(d.text);
    return (
      <div className={'filter-cell ' + FILTER_CELL_CLASS[d.field]} key={d.domKey} style={d.field === 'status' && activeTab !== 'ALL' ? { display: 'none' } : undefined}>
        <AppFilterDropdown id={d.domKey} ariaLabel={d.ariaLabel} placeholder={d.placeholder} items={items} value={filter[d.field] ? d.text(filter[d.field]) : filter[d.field]} open={openDropdown === d.field}
          onOpen={() => setOpenDropdown(openDropdown === d.field ? '' : d.field)} onPick={(m) => { updateFilter({ [d.field]: values[items.indexOf(m)] }); setOpenDropdown(''); }} onClear={() => { updateFilter({ [d.field]: '' }); setOpenDropdown(''); }} />
      </div>
    );
  };

  return (
    <AppLayout cluster="appointments" descriptions={BUTTON_DESCRIPTIONS}
      menu={layout.menu} sidebar={layout.sidebar}
      breadcrumb={[/* Lịch theo buồng là màn con của danh sách ⇒ thêm 1 cấp, cấp danh sách bấm được để quay lại */
        ...layout.breadcrumb,
        isGridMode
          ? { label: isException ? 'Lịch hẹn gặp trực tiếp ngoại lệ' : DIRECT_LIST_LABEL, href: isException ? ROUTES.exceptionList : ROUTES.appointmentList }
          : { label: isException ? 'Lịch hẹn gặp trực tiếp ngoại lệ' : DIRECT_LIST_LABEL },
        ...(isGridMode ? [{ label: 'Lịch theo buồng' }] : [])]}
      overlays={<>
        <AppModal id="dlgHL" open={openDialog === 'dlgHL'} onClose={closeDialog}>
          <div className="dlg-h"><h3>Thao tác hàng loạt</h3><CloseButton onClick={closeDialog} /></div>
          <div className="bulk-row"><span>Đã chọn <b id="hlSo">{selectedCount}</b> lịch hẹn</span><AppButton className="bulk-clear" onClick={() => { setSelectedCodes(new Set()); closeDialog(); }}>Bỏ chọn hết</AppButton></div>
          {/* nút hiện ít hơn 3 thì đứng giữa, giữ bề rộng 1/3 như khi đủ 3 nút */}
          <div className="bulk-actions" style={{ gridTemplateColumns: 'repeat(' + Math.max(1, [canApprove && statusBulk.indexOf('approve') >= 0, canApprove && statusBulk.indexOf('reject') >= 0, can(screen, 'cancel')].filter(Boolean).length) + ', calc((100% - 20px) / 3))', justifyContent: 'center' }}>
            {canApprove && statusBulk.indexOf('approve') >= 0 && <AppButtonWithIcon id="hl_duyet" className="is-primary" onClick={openBulkApprove} disabled={allowedBulk.indexOf('approve') < 0} iconRaw={'<path d="M20 6 9 17l-5-5"/>'}>Duyệt</AppButtonWithIcon>}
            {canApprove && statusBulk.indexOf('reject') >= 0 && <AppButtonWithIcon id="hl_tuChoi" onClick={openBulkReject} disabled={allowedBulk.indexOf('reject') < 0} iconRaw={'<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>'} iconLinejoin={null}>Từ chối</AppButtonWithIcon>}
            {can(screen, 'cancel') && <AppButtonWithIcon id="hl_huy" onClick={tryBulkCancel} disabled={allowedBulk.indexOf('cancel') < 0} iconRaw={'<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>'} iconLinejoin={null}>Hủy</AppButtonWithIcon>}
          </div>
          <div className={'bulk-warning' + (bulkNotice.visible ? ' is-visible' : '') + (bulkNotice.soft ? ' is-soft' : '')} id="hlCanh"><RichText text={bulkNotice.text} /></div>
          <div className="dlg-f"><AppButton className="btn" onClick={closeDialog}>Quay lại</AppButton></div>
        </AppModal>

        <AppModal id="dlgKeoTha" open={openDialog === 'dlgKeoTha'} onClose={cancelDrop} dlgClassName="dlg dlg-notify">
          <div className="dlg-h"><h3 className="dlg-t">{msgParts('C001-12').title}</h3><CloseButton onClick={cancelDrop} title="Đóng" /></div>
          <div className="dlg-b"><div id="ktNoiDung">{dropRecord && joinText('Lịch hẹn ', <b>{dropRecord.code}</b>, ' của ', <b>{dropRecord.studentName}</b>, ' sẽ được ' + (pendingDrop.duration ? 'đổi thời lượng thành ' + pendingDrop.duration + ' phút:' : 'dời:'),
            <div className="time-change"><span>{dropTimeRange(dropRecord, dropRecord.visitTime) + ' · ' + (dropRecord.tableCode ? tableLabel(dropRecord.tableCode) : 'Chưa xếp buồng')}</span><span className="time-change-arrow">→</span><span><b>{dropTimeRange(dropRecord, pendingDrop.time, pendingDrop.duration) + ' · ' + pendingDrop.table}</b></span></div>,
            'Ngày thăm gặp ' + gridDateText + ', trạng thái giữ nguyên ' + statusLabel(dropRecord.status) + '.')}</div>
            <div className="fld"><label>Lý do điều chỉnh<span className="required-mark">*</span></label>
              <AppCounterInput multiline className={'ta' + (errors.ktLyDoLoi ? ' input-border-error' : '')} id="ktLyDo" counterId="demKtLyDo" maxLength={1000} placeholder="Nhập lý do dời giờ hoặc đổi buồng thăm gặp…" value={form.dropReason} onChange={(e) => { setForm({ ...form, dropReason: e.target.value }); clearFieldError('ktLyDo'); }} error={<FieldError id="ktLyDoLoi" errors={errors} />} /></div>
            <NotifyRecipientsField id="ktNhanTB" code={NOTIFICATION_CODES.RESCHEDULED} records={dropRecord ? [dropRecord] : []} value={notify} onChange={setNotify} /></div>
          <div className="dlg-f"><AppButton className="btn" onClick={cancelDrop}>{msgParts('C001-12').cancel}</AppButton><AppButton className="btn btn-primary" onClick={confirmDrop}>Xác nhận</AppButton></div>
        </AppModal>

        <CancelAppointmentDialog open={openDialog === 'dlgHuy'} onClose={closeDialog} onConfirm={confirmCancel} records={openDialog === 'dlgHuy' ? (bulkCodes || [targetCode]).map(findByCode).filter(Boolean) : []}
          visitTimes={openDialog === 'dlgHuy' ? (bulkCodes || [targetCode]).map((c) => { const r = findByCode(c); return r ? visitDateTimeText(r) : ''; }) : []} />

        <AppModal id="dlgDuyet" open={openDialog === 'dlgDuyet'} onClose={closeDialog} dlgClassName="dlg dlg-notify">
          <div className="dlg-h"><h3 className="dlg-t"><RichText text={msgParts('C001-05', bulkCodes ? key(bulkCodes.length) + ' lịch hẹn' : 'lịch hẹn ' + key(targetCode)).title} /></h3><CloseButton onClick={closeDialog} /></div>
          <div className="dlg-b">
            {bulkCodes && <div className="bulk-confirm" id="dlgDuyetSoLuong"><RichText text={msgParts('C001-15', bulkCodes.length, statusLabel((findByCode(bulkCodes[0]) || {}).status)).body} />
              <div className="bulk-confirm-codes">{bulkCodes.join(' · ')}</div>Lý do phê duyệt bên dưới áp dụng chung cho cả {bulkCodes.length} lịch hẹn.</div>}
            <div className="fld"><label>Lý do phê duyệt</label>
              <AppCounterInput multiline className="ta" id="dlgDuyetLyDo" counterId="demdlgDuyet" maxLength={1000} placeholder="Nhập lý do phê duyệt lịch hẹn này…" value={form.approveNote} onChange={(e) => setForm({ ...form, approveNote: e.target.value })} /></div>
            <NotifyRecipientsField id="dlgDuyetNhanTB" code={approvedCodeFor(dialogCodes)} records={dialogCodes.map(findByCode).filter(Boolean)} value={notify} onChange={setNotify} />
          </div>
          <div className="dlg-f"><AppButton className="btn" onClick={closeDialog}>Hủy</AppButton><AppButton className="btn btn-primary" onClick={confirmApprove}>{bulkCodes ? 'Xác nhận phê duyệt ' + bulkCodes.length + ' lịch hẹn' : 'Xác nhận phê duyệt'}</AppButton></div>
        </AppModal>

        <AppModal id="dlgVangMat" open={openDialog === 'dlgVangMat'} onClose={closeDialog} dlgClassName="dlg dlg-notify">
          <div className="dlg-h"><h3 className="dlg-t">{DialogWarningIcon}<RichText text={msgParts('C001-13', targetCode).title} /></h3><CloseButton onClick={closeDialog} /></div>
          <div className="dlg-b"><div><RichText text={msgParts('C001-13', targetCode).body} /></div>   {/* mã lịch hẹn ở nội dung, không ở tiêu đề */}
            <NotifyRecipientsField id="dlgVangMatNhanTB" code={NOTIFICATION_CODES.ABSENT} records={targetCode && findByCode(targetCode) ? [findByCode(targetCode)] : []} value={notify} onChange={setNotify} /></div>
          <div className="dlg-f"><AppButton className="btn" onClick={closeDialog}>{msgParts('C001-13').cancel}</AppButton><AppButton className="btn btn-primary" onClick={confirmAbsent}>{msgParts('C001-13').ok}</AppButton></div>
        </AppModal>

        <DeleteAppointmentDialog open={openDialog === 'dlgXoaNhap'} code={targetCode} status={(findByCode(targetCode) || {}).status} onClose={closeDialog} onConfirm={confirmDelete} />

        <AppModal id="dlgTuChoi" open={openDialog === 'dlgTuChoi'} onClose={closeDialog} dlgClassName="dlg dlg-notify">
          <div className="dlg-h"><h3 className="dlg-t">{DialogWarningIcon}<RichText text={msgParts('C001-06', bulkCodes ? key(bulkCodes.length) + ' lịch hẹn' : 'lịch hẹn ' + key(targetCode)).title} /></h3><CloseButton onClick={closeDialog} /></div>
          <div className="dlg-b">
            {bulkCodes && <div className="bulk-confirm" id="dlgTuChoiSoLuong"><RichText text={msgParts('C001-16', bulkCodes.length, statusLabel((findByCode(bulkCodes[0]) || {}).status)).body} />
              <div className="bulk-confirm-codes">{bulkCodes.join(' · ')}</div>Lý do từ chối bên dưới áp dụng chung cho cả {bulkCodes.length} lịch hẹn.</div>}
            <div className="fld"><label>Lý do từ chối<span className="required-mark">*</span></label>
              <AppCounterInput multiline className={'ta' + (errors.dlgTuChoiLyDoLoi ? ' input-border-error' : '')} id="dlgTuChoiLyDo" counterId="demdlgTuChoi" maxLength={1000} placeholder="Nhập lý do từ chối duyệt lịch hẹn này…" value={form.rejectReason} onChange={(e) => { setForm({ ...form, rejectReason: e.target.value }); clearFieldError('dlgTuChoiLyDo'); }} error={<FieldError id="dlgTuChoiLyDoLoi" errors={errors} />} /></div>
            <div className="eff is-warning" id="dlgTuChoiHanGiu"><RichText text={msg('W001-23', holdHoursOf())} /></div>   {/* */}
            <NotifyRecipientsField id="dlgTuChoiNhanTB" code={rejectedCodeFor(dialogCodes)} records={dialogCodes.map(findByCode).filter(Boolean)} value={notify} onChange={setNotify} />
          </div>
          <div className="dlg-f"><AppButton className="btn" onClick={closeDialog}>Hủy</AppButton><AppButton className="btn btn-primary" onClick={confirmReject}>{bulkCodes ? 'Xác nhận từ chối ' + bulkCodes.length + ' lịch hẹn' : 'Xác nhận từ chối'}</AppButton></div>
        </AppModal>

        <AppModal id="dlgDieuChinh" open={openDialog === 'dlgDieuChinh'} onClose={closeDialog} dlgClassName="dlg dlg-wide">
          <div className="dlg-h"><h3>Điều chỉnh thời gian và buồng thăm gặp</h3><CloseButton onClick={closeDialog} /></div>
          <div className="dlg-b">
            <div className="compare">
              <div className="compare-box">
                <div className="compare-title">Thông tin hiện tại</div>
                <div className="compare-grid"><span>Ngày thăm gặp</span><b id="dcCuNgay">{adjust && adjust.hasDate ? adjustDayLabel(new Date(parseDisplayDate(adjust.oldDate))) : '—'}</b>
                  <span>Khung giờ</span><b id="dcCuGio">{adjust && adjust.oldTime ? adjust.oldTime + ' ~ ' + addMinutes(adjust.oldTime, adjustDuration()) : '—'}</b>
                  <span>Buồng thăm gặp</span><b id="dcCuBan">{adjust && adjust.record && adjust.record.tableCode ? adjust.record.tableCode : 'Chưa xếp'}</b></div>
              </div>
              <div className="compare-arrow" aria-hidden="true"><Svg raw={'<path d="M5 12h14M13 6l6 6-6 6"/>'} /></div>
              <div className="compare-box compare-new">
                <div className="compare-title">Thông tin điều chỉnh</div>
                <div className="compare-grid"><span>Ngày thăm gặp<span className="required-mark">*</span></span>
                  <AppButtonWithIcon htmlType="button" className="cal-date" id="nutNgayDC" title="Bấm để chọn ngày thăm gặp" iconClassName="cal-ic" icon="calendar"
                    onClick={(e) => { e.stopPropagation(); setCalendarState((x) => (x && x.open && x.target === 'adjust' ? { ...x, open: false } : { open: true, target: 'adjust', month: new Date(adjust.date.getFullYear(), adjust.date.getMonth(), 1) })); }}>
                    <span className="cal-d" id="nhanNgayDC">{adjust ? adjustDayLabel(adjust.date) : ''}</span></AppButtonWithIcon>
                  <span>Khung giờ</span><b id="dcMoiGio" className={adjust && adjust.picked ? '' : 'compare-empty'}>{adjust && adjust.picked ? adjust.picked.time + ' ~ ' + addMinutes(adjust.picked.time, adjust.picked.duration || adjustDuration()) : 'Chưa chọn'}</b>
                  <span>Buồng thăm gặp</span><b id="dcMoiBan" className={adjust && adjust.picked ? '' : 'compare-empty'}>{adjust && adjust.picked ? adjust.picked.table : 'Chưa chọn'}</b></div>
              </div>
            </div>
            <div className="fld">
              <label>Chọn khung giờ và buồng còn trống<span className="required-mark">*</span></label>
              {adjust && adjustConfig && openDialog === 'dlgDieuChinh' ? <AdjustPicker key={adjust.code} config={adjustConfig} value={adjustValue} onChange={pickAdjust} /> : null}
              <FieldError id="dcLuoiLoi" errors={errors} />
            </div>
            <div className="hint">Mã lịch hẹn và lượt thăm gặp đang giữ chỗ được giữ nguyên. Hệ thống kiểm tra lại các điều kiện đặt lịch khi xác nhận</div>
            <div className="fld"><label>Lý do điều chỉnh<span className="required-mark">*</span></label>
              <AppCounterInput multiline className={'ta' + (errors.dcLyDoLoi ? ' input-border-error' : '')} id="dcLyDo" counterId="demDcLyDo" maxLength={1000} placeholder="Nhập lý do điều chỉnh thời gian hoặc buồng thăm gặp…" value={form.adjustReason} onChange={(e) => { setForm({ ...form, adjustReason: e.target.value }); clearFieldError('dcLyDo'); }} error={<FieldError id="dcLyDoLoi" errors={errors} />} /></div>
            <NotifyRecipientsField id="dcNhanTB" code={NOTIFICATION_CODES.RESCHEDULED} records={adjust && adjust.record ? [adjust.record] : []} value={notify} onChange={setNotify} />
          </div>
          <div className="dlg-f"><AppButton className="btn" onClick={closeDialog}>Hủy</AppButton>
            <AppButton className="btn btn-primary" id="dcXacNhan" onClick={confirmAdjust} title={adjustReady ? 'Lưu khung giờ và buồng thăm gặp mới' : 'Cần chọn khung giờ và buồng thăm gặp mới, nhập lý do điều chỉnh'}>Xác nhận điều chỉnh</AppButton></div>
        </AppModal>
        <OneDateCalendar state={calendarState} setState={setCalendarState} selectedDateOf={(target) => (target === 'adjust' && adjust ? adjust.date : gridDate)}
          onPick={(target, d) => { if (target === 'adjust') setAdjust((x) => ({ ...x, date: d, picked: null })); else setGridDate(d); }} />
      </>}>

      <div className="shell-head">
        <div className="shell-title">
          {isGridMode
            ? <AppButtonWithIcon className="page-head-back" id="nutVeDanhSach" onClick={() => { location.href = listUrl; }} title="Quay lại danh sách" aria-label="Quay lại" icon="back" />
            : <SvgIcon d={'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'} linejoin={null} />}
          <div className="shell-text">
            <h1>{isGridMode ? (isException ? 'Lịch hẹn gặp trực tiếp ngoại lệ theo buồng' : 'Lịch hẹn thăm gặp trực tiếp theo buồng') : (isException ? 'Lịch hẹn gặp trực tiếp ngoại lệ' : 'Lịch hẹn thăm gặp trực tiếp')}</h1>
          </div>
        </div>
        <div className="head-actions">
          <div className="nhom-nut-bang" id="nhomNutBang" style={hiddenInGrid}>
            <AppButtonWithIcon className="btn btn-outline" id="modeLich" onClick={() => { location.href = isException ? ROUTES.exceptionCalendar : ROUTES.appointmentCalendar; }} title="Mở lưới thời gian theo buồng thăm gặp" icon="calendar">Lịch theo buồng</AppButtonWithIcon>{' '}
            <AppButtonWithIcon className="btn" onClick={() => exportExcel(rows, isException ? { title: 'DANH SÁCH LỊCH HẸN GẶP TRỰC TIẾP NGOẠI LỆ', sheet: 'LichHenGapTrucTiepNgoaiLe', file: 'DanhSachLichHenNgoaiLe_' } : undefined)} iconRaw={'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>'} iconLinecap={null} iconLinejoin={null}>Xuất Excel</AppButtonWithIcon>{' '}
            <AppButtonWithIcon className="btn btn-hl" id="nutHL" onClick={openBulk} style={{ display: selectedCount > 0 && !bulkDisabled && !isGridMode ? 'inline-flex' : 'none' }}
              iconRaw={'<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>'}>
              <span id="soHL">{'Hàng loạt (' + selectedCount + ')'}</span></AppButtonWithIcon>{' '}
            {!isException && can(screen, 'create') && <AppButtonWithIcon className="btn btn-primary" onClick={() => { location.href = ROUTES.appointmentCreate; }} iconRaw={'<path d="M12 5v14M5 12h14"/>'} iconLinecap={null} iconLinejoin={null}>Tạo mới</AppButtonWithIcon>}
          </div>
        </div>
      </div>

      <div className="tabs" style={hiddenInGrid}>
        {SCREEN_TABS.map((t) => { const n = filteredAll.filter(t.filter).length; return (
          <AppButton key={t.key} className={'tab-btn' + (activeTab === t.key ? ' on' : '') + (n === 0 && activeTab !== t.key ? ' is-empty' : '')} onClick={() => switchTab(t.key)} style={t.style} title={t.title}>
            <span className="tab-label">{t.dot && <i className="tab-dot" />}{t.label}</span>
            <span className="tab-number">{n}</span>
          </AppButton>); })}
      </div>

      <div className="shell-filters" id="khoiLoc" style={hiddenInGrid}>
        <div className="filter-panel is-fixed" id="khoiLocChiTiet">
          {/* dòng cố định: từ khoá · khoảng ngày · Trạng thái (ẩn ở tab khác Tất cả) · nút mở rộng ở cuối dòng */}
          <div className={'filter-body filter-row-main' + (activeTab !== 'ALL' ? ' no-status' : '')} id="locThan">
            <AppSearchInput className="filter-cell filter-wide" value={filter.keyword} onChange={(v) => updateFilter({ keyword: v })}
              placeholder="Tìm theo mã lịch hẹn, tên người cai nghiện, CCCD, tên thân nhân"
              title="Tìm trên 4 trường: Mã lịch hẹn · tên người cai nghiện · CCCD người cai nghiện · tên thân nhân" />
            <DateRange dateFrom={filter.dateFrom} dateTo={filter.dateTo} onChange={(a, b) => updateFilter({ dateFrom: a, dateTo: b })} onClear={() => updateFilter({ dateFrom: '', dateTo: '' })} />
            {screenDropdowns.filter((d) => d.field === 'status').map(renderFilterCell)}
            <div className="filter-more">
              {/* dạng link có icon phễu, không dạng ô chọn */}
              {/* nút vuông chỉ icon phễu, rộng cố định 36px nên mở/đóng không xô lệch hàng; chấm số = số điều kiện mở rộng đang chọn */}
              <AppButtonWithIcon className={'filter-more-btn-icon' + (showMoreFilters ? ' is-open' : '')} id="nutLoc" aria-expanded={String(showMoreFilters)} aria-controls="locMoRong"
                aria-label={showMoreFilters ? 'Thu gọn tìm kiếm' : 'Tìm kiếm mở rộng'} data-tip={showMoreFilters ? 'Thu gọn tìm kiếm' : 'Tìm kiếm mở rộng'}
                onClick={() => { setShowMoreFilters((x) => !x); setOpenDropdown(''); }} iconRaw={'<path d="M22 3H2l8 9.46V19l4 2v-8.54z"/>'} />
              {moreCount > 0 && <span className="filter-count is-inline filter-more-count" aria-hidden="true">{moreCount}</span>}
            </div>
          </div>
          {showMoreFilters && <div className="filter-body filter-row-more" id="locMoRong">{screenDropdowns.filter((d) => d.field !== 'status').map(renderFilterCell)}</div>}
        </div>
      </div>

      <div className={'shell-body tbl' + (isGridMode ? ' off' : '')} id="vungBang">
        <AppTable tableClassName={bulkDisabled ? 'is-hidden-selection' : ''} tbodyId="tb" rowKey="code" dataSource={pageRows} indexOffset={(current - 1) * parseInt(pageSize, 10)} columns={columns}
          rowSelection={bulkDisabled ? undefined : { selectedRowKeys: [...selectedCodes], onChange: (keys) => setSelectedCodes(new Set(keys)), columnWidth: 46 }}
          rowClassName={(r) => (highlight.code === r.code ? 'row-new' + (highlight.faded ? ' is-fading' : '') : '')}
          emptyRow={<EmptyRow colSpan={columns.length + (bulkDisabled ? 0 : 1)} entity="lịch hẹn" hasRecords={screenAppointments.length > 0} />} />
      </div>
      {/* Bỏ khung Lưu ý ở màn Thăm gặp trực tiếp cho bảng rộng hơn; màn ngoại lệ giữ */}
      {isException && <div className="table-hint" style={hiddenInGrid}><NoteBox id="goiYDanhSach"
        line="Danh sách lịch hẹn gặp trực tiếp ngoại lệ sẽ có giá trị nếu đơn được tạo theo luồng Thân nhân cần xin duyệt và chưa được Trưởng cơ sở phê duyệt" /></div>}

      <div className={'cal' + (isGridMode ? ' on' : '')} id="vungLich">
        <div className="cal-bar">
          <div className="cal-nav">
            <AppButtonWithIcon className="cal-btn" onClick={() => setGridDate(new Date(gridDate.getTime() - 86400000))} title="Ngày trước" aria-label="Ngày trước" iconRaw={'<polyline points="15 18 9 12 15 6"/>'} iconStrokeWidth="2.5" />
            <AppButtonWithIcon htmlType="button" className="cal-date" id="nutNgayLuoi" title="Bấm để chọn ngày khác" iconClassName="cal-ic" icon="calendar"
              onClick={(e) => { e.stopPropagation(); setCalendarState((x) => (x && x.open && x.target === 'grid' ? { ...x, open: false } : { open: true, target: 'grid', month: new Date(gridDate.getFullYear(), gridDate.getMonth(), 1) })); }}>
              <span className="cal-d" id="nhanNgayLuoi">{WEEKDAY_NAMES[gridDate.getDay()] + ', ' + gridDateText}</span></AppButtonWithIcon>
            <AppButtonWithIcon className="cal-btn" onClick={() => setGridDate(new Date(gridDate.getTime() + 86400000))} title="Ngày sau" aria-label="Ngày sau" iconRaw={'<polyline points="9 18 15 12 9 6"/>'} iconStrokeWidth="2.5" />
          </div>
          <GridGuide />
        </div>
        <ListCalendar appointments={gridAppointments} date={gridDate} visible={isGridMode} onRequestMove={openDropConfirm} canMove={can(screen, 'adjust')} firstCounter={filter.counter} />
      </div>

      <div className="pager" style={hiddenInGrid}>
        <AppButtonWithIcon className="pg-nav" id="pgTruoc" disabled={current <= 1} icon="chevLeft" onClick={() => setPage(current - 1)}>
          Trang trước
        </AppButtonWithIcon>
        <div className="pg-center">
          <span className="pg-i">Tổng số: <b id="pgTong">{rows.length}</b></span>
          <span className="pg-v" />
          <span className="pg-i">Trang <b id="pgSo">{current + '/' + pageCount}</b></span>
          <span className="pg-v" />
          <span className="pg-i">Chọn trang</span>
          <PageSelect id="pgChonTrang" current={current} total={pageCount} onChange={setPage} />
          <span className="pg-v" />
          <span className="pg-i">Chọn số bản ghi</span>
          <AppSelect id="pgCo" width={61} value={+pageSize} options={PAGE_SIZE_OPTIONS} showSearch={false} allowClear={false} onChange={(v) => setPageSize(String(v))} />
          <span className="pg-i">trên 1 trang</span>
        </div>
        <AppButtonWithIcon className="pg-nav" id="pgSau" disabled={current >= pageCount} icon="chevRight" iconAfter onClick={() => setPage(current + 1)}>
          Trang sau
        </AppButtonWithIcon>
      </div>
    </AppLayout>
  );
}
