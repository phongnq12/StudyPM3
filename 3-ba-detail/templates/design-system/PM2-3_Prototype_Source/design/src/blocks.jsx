/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Khối màn thật chép NGUYÊN markup từ màn Prototype (10/10/2026) — phủ các lớp CSS dùng chung đo được trên màn thật mà trang chưa có.
 * Nguồn từng khối ghi ở chú thích ngay trên hàm. Dữ liệu là dữ liệu mẫu tự khai. Tên tiếng Anh (luật).
 * (13/10/2026): chỗ nào màn thật có hằng, hàm hoặc component dùng chung thì GỌI THẲNG (tab, nút theo trạng thái, ô chọn, ô giờ…) để mẫu không trôi khỏi màn thật;
 * mẫu mở ra ở ĐÚNG trạng thái mặc định của màn thật. Đo độ khớp bằng phép so chữ ký DOM mẫu ⇄ màn thật (tiêu đề cột · nhãn · control · lớp CSS · kiểu). */
import { useState } from 'react';
import { Switch } from 'antd';
import { AppButton, AppButtonWithIcon } from '@/components/app/AppButton';
import AppSearchInput from '@/components/app/AppSearchInput';
import { AppFilterDropdown } from '@/components/app/AppFilterDropdown';
import AppTable from '@/components/app/AppTable';
import AppTag from '@/components/app/AppTag';
import AppModal from '@/components/app/AppModal';
import DialogCloseButton from '@/components/app/DialogCloseButton';
import EmptyRow from '@/components/app/EmptyRow';
import NoteBox from '@/components/app/NoteBox';
import SetupHint from '@/components/app/SetupHint';
import AppCounterInput from '@/components/app/AppCounterInput';
import CatalogStatusTag from '@/components/app/CatalogStatusTag';
import TimeRangeInput from '@/components/app/TimeRangeInput';
import Pm1SyncBar from '@/components/app/Pm1SyncBar';
import VisitConditionsLink from '@/components/app/VisitConditions';
import HistoryTable from '@/pages/ReceptionDeskShared/HistoryTable';
import { COUNTER_ICONS } from '@/pages/ReceptionDeskShared/config';
import { DateRange } from '@/pages/AppointmentList/widgets';
import { ROUTE_OPTIONS, ROUTE_EXEMPTION, ROUTE_LINKED, EXCEPTION_LABEL, isExemption, routeFilterText } from '@/data/approvalRoute';
import { sourceLabel, statusLabel, visitDateTimeText } from '@/data/appointmentStore';
import { WEEKDAYS, defaultDirectConfig } from '@/data/visitConfigStore';
import { readNotificationSettings, GROUPS, SEND_TYPE_LABELS, timeConditionText } from '@/data/notificationSettingsStore';
import { tableStatusLabel } from '@/data/visitTableStore';
import { CODE_HINT, CODE_MAX } from '@/lib/codeFormat';
import { Svg } from '@/lib/icons';
import { msg } from '@/lib/msg';
import { RichText } from '@/lib/richText';
import {
  ACTION_COLOR, ACTION_ICON, BULK_DISABLED_TABS, LIST_ICONS, RELATIONSHIP_TAG_CLASS, ROW_ACTIONS, STATUS_CLASS, TABS, VISIT_TYPE_TAG_CLASS,
  birthDateText, dormitoryOf, formatDate, maxActionCount, roomOf, rowActions, truncate,
} from '@/pages/AppointmentList/listLogic';
import { PageHeadActions } from '@/components/app/PageActions';
import SearchableSelect from '@/components/app/AppSearchSelect';
import { MAX_COMPANIONS } from '@/pages/AppointmentForm/formConfig';

const ChevronIcon = <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 5l8 7-8 7z" /></svg>;
const ICON_CARD = '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h4"/>';
const ICON_DELETE = '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>';
const initials = (n) => n.split(' ').filter(Boolean).slice(-2).map((x) => x[0]).join('').toUpperCase();
const isoAfter = (days) => { const d = new Date(Date.now() + days * 86400000); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };

/* ── Khuôn màn Danh sách đầy đủ — nguồn src/pages/AppointmentList/AppointmentList.jsx (shell-head · mode · tabs · shell-filters · shell-body tbl · table-hint · cal-bar · dlgHL) ──
 * Gọi thẳng: TABS · BULK_DISABLED_TABS · STATUS_CLASS · rowActions · ROW_ACTIONS · ACTION_COLOR · ACTION_ICON · LIST_ICONS · maxActionCount · statusLabel · sourceLabel (listLogic, appointmentStore) */
const LIST_ROWS = [
  { code: 'LH-2026-0914', status: 'APPROVED', source: 'COUNTER', approvalRoute: ROUTE_EXEMPTION, visitDate: isoAfter(1), visitTime: '09:15', studentName: 'Trần Văn Cường', studentCitizenId: '001189004412', studentBirthDate: '1989-04-12', studentCode: 'HS-00412', visitorName: 'Trần Thị Bình', companionCount: 1, relationship: 'Mẹ', visitTypeName: 'Thăm gặp trực tiếp tiêu chuẩn', tableCode: 'Q01-01', counterCode: 'Q01', visitorCount: 2, durationMinutes: 45 },
  { code: 'LH-2026-0915', status: 'PENDING_APPROVAL', source: 'APP', approvalRoute: ROUTE_LINKED, visitDate: isoAfter(1), visitTime: '10:00', studentName: 'Lê Văn Đức', studentCitizenId: '001192005518', studentBirthDate: '1992-09-27', studentCode: 'HS-00518', visitorName: 'Lê Thị Hoa', companionCount: 0, relationship: 'Vợ', visitTypeName: 'Thăm gặp trực tiếp tiêu chuẩn', tableCode: '', counterCode: 'Q01', visitorCount: 1, durationMinutes: 30 },
  { code: 'LH-2026-0916', status: 'IN_PROGRESS', source: 'STAFF', approvalRoute: ROUTE_LINKED, visitDate: isoAfter(0), visitTime: '14:00', studentName: 'Phạm Văn Em', studentCitizenId: '', studentBirthDate: '1986-01-03', studentCode: '', visitorName: 'Phạm Văn Giang', companionCount: 2, relationship: 'Anh', visitTypeName: 'Thăm gặp trực tiếp tiêu chuẩn', tableCode: 'Q01-02', counterCode: 'Q01', visitorCount: 3, durationMinutes: 45 },
  { code: 'LH-2026-0917', status: 'COMPLETED', source: 'STAFF', approvalRoute: ROUTE_LINKED, visitDate: isoAfter(0), visitTime: '08:00', studentName: 'Đỗ Văn Hưng', studentCitizenId: '001188007731', studentBirthDate: '1988-07-21', studentCode: 'HS-00412', visitorName: 'Đỗ Minh Tâm', companionCount: 0, relationship: 'Con', visitTypeName: 'Thăm gặp trực tiếp tiêu chuẩn', tableCode: 'Q01-01', counterCode: 'Q01', visitorCount: 1, durationMinutes: 30 },
];
const Empty = () => <span className="empty">—</span>;
function CategoryTag({ value, tagClass }) {
  if (!value || value === '—') return <Empty />;
  if (tagClass === 'tag-relationship' && RELATIONSHIP_TAG_CLASS[value]) tagClass = RELATIONSHIP_TAG_CLASS[value]; else if (tagClass === 'tag-type' && VISIT_TYPE_TAG_CLASS[value]) tagClass = VISIT_TYPE_TAG_CLASS[value];
  return <AppTag className={'tag ' + tagClass}>{truncate(value)}</AppTag>;
}
const tableName = (code) => ({ 'Q01-01': 'Q01-01 — Buồng số 1', 'Q01-02': 'Q01-02 — Buồng số 2' }[code] || code);
const counterName = (code) => ({ Q01: 'Q01 — Quầy tiếp đón chính' }[code] || code);
/* 5 ô lọc như FILTER_DROPDOWNS của màn (placeholder · ariaLabel · lớp ô) — giá trị mẫu tự khai */
const LIST_FILTERS = [
  { field: 'status', domKey: 'tt', placeholder: 'Tất cả trạng thái', ariaLabel: 'Trạng thái', cell: 'filter-status', items: ['PENDING_APPROVAL', 'APPROVED', 'CHECKED_IN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ABSENT', 'REJECTED', 'DRAFT'].map(statusLabel) },
  { field: 'table', domKey: 'ban', placeholder: 'Tất cả buồng thăm gặp', ariaLabel: 'Buồng thăm gặp', cell: 'filter-table', items: ['Q01-01 — Buồng số 1', 'Q01-02 — Buồng số 2'] },
  { field: 'counter', domKey: 'quay', placeholder: 'Tất cả quầy tiếp đón', ariaLabel: 'Quầy tiếp đón', cell: 'filter-counter', items: ['Q01 — Quầy tiếp đón chính'] },
  { field: 'source', domKey: 'ngd', placeholder: 'Tất cả nguồn đăng ký', ariaLabel: 'Nguồn đăng ký', cell: 'filter-source', items: ['APP', 'COUNTER', 'STAFF'].map(sourceLabel) },
  { field: 'route', domKey: 'luong', placeholder: 'Tất cả luồng đăng ký', ariaLabel: 'Luồng đăng ký', cell: 'filter-route', items: [ROUTE_LINKED, ROUTE_EXEMPTION].map(routeFilterText) },
];
export function ListScreenDemo() {
  const today = new Date();
  const [grid, setGrid] = useState(false); const [tab, setTab] = useState('ALL'); const [q, setQ] = useState('');
  const [range, setRange] = useState({ from: '', to: '' });   // danh sách mặc định để trống ngày để tìm toàn bộ dữ liệu
  const [f, setF] = useState({}); const [open, setOpen] = useState(''); const [selected, setSelected] = useState([]); const [bulk, setBulk] = useState(false);
  /* như màn: ô lọc chỉ tính khi đã chọn giá trị (khoảng ngày mặc định vẫn tính) */
  const filterCount = (q.trim() ? 1 : 0) + (range.from || range.to ? 1 : 0) + LIST_FILTERS.filter((d) => f[d.field]).length;
  const bulkDisabled = BULK_DISABLED_TABS.indexOf(tab) >= 0 || ['PENDING_APPROVAL', 'PENDING_HEAD_APPROVAL', 'APPROVED'].indexOf(tab) < 0;
  const actionColumnWidth = Math.max(120, maxActionCount(false) * 36 - 4 + 48);
  const rows = LIST_ROWS.filter(TABS.find((t) => t.key === tab).filter).filter((r) => !q || (r.code + r.studentName + r.visitorName).toLowerCase().includes(q.toLowerCase()));
  const hidden = grid ? { display: 'none' } : undefined;
  const [more, setMore] = useState(false);
  const filterCell = (d) => <div className={'filter-cell ' + d.cell} key={d.domKey} style={d.field === 'status' && tab !== 'ALL' ? { display: 'none' } : undefined}>
    <AppFilterDropdown id={'sd' + d.domKey} ariaLabel={d.ariaLabel} placeholder={d.placeholder} items={d.items} value={f[d.field] || ''} open={open === d.field}
      onOpen={() => setOpen(open === d.field ? '' : d.field)} onPick={(m) => { setF({ ...f, [d.field]: m }); setOpen(''); }} onClear={() => { setF({ ...f, [d.field]: '' }); setOpen(''); }} /></div>;
  const columns = [
    { key: 'index', className: 'col-index', thStyle: { width: '56px' }, title: 'STT', render: (r, i) => i + 1 },
    { key: 'code', className: 'c2 c-txt', thClassName: 'c-txt', thStyle: { width: '205px' }, title: 'Mã lịch hẹn', render: (r) => <><span className="cell-code">{r.code}</span>{isExemption(r) ? <span className="exception-flag" role="img" aria-label="Đơn ngoại lệ đã được Trưởng cơ sở phê duyệt" data-tip="Đơn ngoại lệ đã được Trưởng cơ sở phê duyệt"><Svg raw={'<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>'} /></span> : null}<div className="csub">{sourceLabel(r.source)}</div></> },
    { key: 'visitAt', className: 'col-datetime', thStyle: { width: '181px' }, title: 'Ngày giờ hẹn', render: (r) => visitDateTimeText(r) },
    { key: 'student', className: 'c3 c-txt', thClassName: 'c-txt', thStyle: { width: '202px' }, title: 'Người cai nghiện', render: (r) => <>
      <span className="cell-name">{truncate(r.studentName)}</span>
      {r.studentCitizenId ? <div className="csub">{'CCCD: ' + r.studentCitizenId}</div> : null}
      {r.studentBirthDate ? <div className="csub">{'Ngày sinh: ' + birthDateText(r)}</div> : null}</> },
    { key: 'dormitory', className: 'c-tag', thStyle: { width: '120px' }, title: 'Dãy nhà', render: (r) => (dormitoryOf(r) ? <CategoryTag value={dormitoryOf(r)} tagClass="tag-category" /> : <Empty />) },
    { key: 'room', className: 'c-tag', thStyle: { width: '110px' }, title: 'Phòng', render: (r) => (roomOf(r) ? <CategoryTag value={roomOf(r)} tagClass="tag-category" /> : <Empty />) },
    { key: 'visitor', className: 'c-txt', thStyle: { width: '219px' }, title: 'Thân nhân', render: (r) => <>{r.visitorName ? truncate(r.visitorName) : <Empty />}{r.companionCount ? <>{' '}<span className="csub">{'+' + r.companionCount + ' người'}</span></> : null}</> },
    { key: 'relationship', className: 'c-tag', thStyle: { width: '138px' }, title: 'Quan hệ', render: (r) => <CategoryTag value={r.relationship} tagClass="tag-relationship" /> },
    { key: 'visitType', className: 'c-tag', thStyle: { width: '248px' }, title: 'Loại hình', render: (r) => <CategoryTag value={r.visitTypeName} tagClass="tag-type" /> },
    { key: 'table', className: 'c-tag', thStyle: { width: '172px' }, title: 'Buồng thăm gặp', render: (r) => (r.tableCode ? <CategoryTag value={tableName(r.tableCode)} tagClass="tag-table" /> : null) },
    { key: 'counter', className: 'c-tag', thStyle: { width: '170px' }, title: 'Quầy tiếp đón', render: (r) => <CategoryTag value={counterName(r.counterCode)} tagClass="tag-category" /> },
    { key: 'visitorCount', className: 'c-num', thStyle: { width: '135px' }, title: 'Số người', render: (r) => r.visitorCount || <Empty /> },
    { key: 'duration', className: 'col-unit', thStyle: { width: '152px' }, title: 'Thời lượng', render: (r) => (r.durationMinutes ? r.durationMinutes + ' phút' : <Empty />) },
    { key: 'status', className: 'col-status', thStyle: { width: '224px' }, title: 'Trạng thái', render: (r) => <AppTag className={'tag tag-dot tag-' + STATUS_CLASS[r.status]}>{statusLabel(r.status)}</AppTag> },
    { key: 'actions', className: 'col-act', thStyle: { width: actionColumnWidth + 'px' }, title: 'Thao tác', render: (r) => (
      <div className="acts">{rowActions(r).map((action) => (
        <AppButtonWithIcon key={action} className={'ib ib-' + (ACTION_COLOR[action] || 'neutral') + (ROW_ACTIONS[action].danger ? ' dg' : '')} title={ROW_ACTIONS[action].label} icon={LIST_ICONS[action] ? undefined : ACTION_ICON[action]} iconRaw={LIST_ICONS[action]} />
      ))}</div>) },
  ];
  return <div className="sd-col-wide sd-list-shell">
    <div className="shell-head"><div className="shell-title"><Svg raw={'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'} linejoin={null} /><div className="shell-text"><h1>Lịch hẹn thăm gặp trực tiếp</h1></div></div>
      {/* Lịch theo buồng là nút mở màn riêng (màn thật đổi URL), mẫu này bấm thì hiện lưới tại chỗ */}
      <div className="head-actions"><div className="nhom-nut-bang" style={hidden}>
        <AppButtonWithIcon className="btn btn-outline" onClick={() => setGrid(true)} title="Mở lưới thời gian theo buồng thăm gặp" icon="calendar">Lịch theo buồng</AppButtonWithIcon>{' '}
        <AppButtonWithIcon className="btn" iconRaw={'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>'} iconLinecap={null} iconLinejoin={null}>Xuất Excel</AppButtonWithIcon>{' '}
        <AppButtonWithIcon className="btn btn-hl" onClick={() => setBulk(true)} style={{ display: selected.length > 0 && !bulkDisabled && !grid ? 'inline-flex' : 'none' }} iconRaw={'<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>'}><span>{'Hàng loạt (' + selected.length + ')'}</span></AppButtonWithIcon>{' '}
        <AppButtonWithIcon className="btn btn-primary" iconRaw={'<path d="M12 5v14M5 12h14"/>'} iconLinecap={null} iconLinejoin={null}>Tạo mới</AppButtonWithIcon></div></div></div>
    <div className="tabs" style={hidden}>{TABS.map((t) => { const n = LIST_ROWS.filter(t.filter).length; return (
      <AppButton key={t.key} className={'tab-btn' + (tab === t.key ? ' on' : '') + (n === 0 && tab !== t.key ? ' is-empty' : '')} onClick={() => { setTab(t.key); setSelected([]); }} style={t.style} title={t.title}>
        <span className="tab-label">{t.dot && <i className="tab-dot" />}{t.label}</span><span className="tab-number">{n}</span></AppButton>); })}</div>
    {/* làm thử: 1 dòng cố định từ khoá · khoảng ngày · Trạng thái + nút «Tìm kiếm mở rộng»; không dải gập, không số đếm; phần mở rộng gập sẵn */}
    <div className="shell-filters" style={hidden}><div className="filter-panel is-fixed">
      <div className={'filter-body filter-row-main' + (tab !== 'ALL' ? ' no-status' : '')}>
        <AppSearchInput className="filter-cell filter-wide" value={q} onChange={setQ} placeholder="Tìm theo mã lịch hẹn, tên người cai nghiện, CCCD, tên thân nhân"
          title="Tìm trên 4 trường: Mã lịch hẹn · tên người cai nghiện · CCCD người cai nghiện · tên thân nhân" />
        <DateRange dateFrom={range.from} dateTo={range.to} onChange={(from, to) => setRange({ from, to })} onClear={() => setRange({ from: '', to: '' })} />
        {LIST_FILTERS.filter((d) => d.field === 'status').map(filterCell)}
        <div className="filter-more"><AppButtonWithIcon className={'filter-more-btn-icon' + (more ? ' is-open' : '')} aria-expanded={String(more)} aria-label={more ? 'Thu gọn tìm kiếm' : 'Tìm kiếm mở rộng'} data-tip={more ? 'Thu gọn tìm kiếm' : 'Tìm kiếm mở rộng'} onClick={() => { setMore(!more); setOpen(''); }}
          iconRaw={'<path d="M22 3H2l8 9.46V19l4 2v-8.54z"/>'} /></div>
      </div>
      {more && <div className="filter-body filter-row-more">{LIST_FILTERS.filter((d) => d.field !== 'status').map(filterCell)}</div>}
    </div></div>
    <div className={'shell-body tbl' + (grid ? ' off' : '')}>
      <AppTable tableClassName={bulkDisabled ? 'is-hidden-selection' : ''} rowKey="code" dataSource={rows} columns={columns} rowSelection={bulkDisabled ? undefined : { selectedRowKeys: selected, onChange: (keys) => setSelected(keys), columnWidth: 46 }}
        emptyRow={<EmptyRow colSpan={columns.length + (bulkDisabled ? 0 : 1)} entity="lịch hẹn" hasRecords={LIST_ROWS.length > 0} />} />
    </div>
    <div className={'cal' + (grid ? ' on' : '')}><div className="cal-bar"><div className="cal-nav">
      <AppButtonWithIcon className="cal-btn" title="Ngày trước" aria-label="Ngày trước" iconRaw={'<polyline points="15 18 9 12 15 6"/>'} iconStrokeWidth="2.5" />
      <AppButtonWithIcon htmlType="button" className="cal-date" title="Bấm để chọn ngày khác" iconClassName="cal-ic" icon="calendar"><span className="cal-d">{['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][today.getDay()] + ', ' + formatDate(today)}</span></AppButtonWithIcon>
      <AppButtonWithIcon className="cal-btn" title="Ngày sau" aria-label="Ngày sau" iconRaw={'<polyline points="9 18 15 12 9 6"/>'} iconStrokeWidth="2.5" /></div></div>
      <p className="sd-muted">Lưới theo buồng: xem khối «Lưới lịch theo buồng» ở nhóm Hiển thị dữ liệu</p></div>
    <div className="sd-muted">Tab Tất cả không có ô tích (BULK_DISABLED_TABS) · sang tab Chờ duyệt hoặc Đã duyệt, tích ô đầu dòng để hiện nút «Hàng loạt» · nút thao tác mỗi dòng lấy từ rowActions theo trạng thái và quyền vai đang xem</div>
    <AppModal id="sdBulk" open={bulk} onClose={() => setBulk(false)}>
      <div className="dlg-h"><h3>Thao tác hàng loạt</h3><DialogCloseButton onClick={() => setBulk(false)} /></div>
      <div className="bulk-row"><span>Đã chọn <b>{selected.length}</b> lịch hẹn</span><AppButton className="bulk-clear" onClick={() => { setSelected([]); setBulk(false); }}>Bỏ chọn hết</AppButton></div>
      <div className="bulk-actions" style={{ gridTemplateColumns: 'repeat(3, calc((100% - 20px) / 3))', justifyContent: 'center' }}>
        <AppButtonWithIcon className="is-primary" iconRaw={'<path d="M20 6 9 17l-5-5"/>'}>Duyệt</AppButtonWithIcon>
        <AppButtonWithIcon iconRaw={'<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>'} iconLinejoin={null}>Từ chối</AppButtonWithIcon>
        <AppButtonWithIcon iconRaw={'<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>'} iconLinejoin={null}>Hủy</AppButtonWithIcon>
      </div>
      <div className="bulk-warning is-visible is-soft"><RichText text="Các lịch đã chọn khác trạng thái — chỉ thao tác được nút còn sáng" /></div>
      <div className="dlg-f"><AppButton className="btn" onClick={() => setBulk(false)}>Quay lại</AppButton></div>
    </AppModal>
  </div>;
}

/* ── Tra cứu thân nhân + quẹt thẻ — nguồn AppointmentForm.jsx (khối «Thân nhân người cai nghiện») · FormDialogs.jsx (hộp Quẹt thẻ) · formActions.js (câu lỗi) ── */
export function LookupDemo() {
  const [text, setText] = useState(''); const [state, setState] = useState(''); const [scan, setScan] = useState(false);
  const run = (value = text) => { const v = value.replace(/\s/g, ''); setState(!v ? 'error' : v === '000' ? 'notfound' : 'card'); };
  const error = state === 'error' ? msg('E001-01', 'số căn cước công dân hoặc số điện thoại của thân nhân') : state === 'notfound' ? msg('E001-35', text.replace(/\s/g, '')) : '';
  const closeScan = () => setScan(false);
  return <div className="sd-col-wide"><div className="card sd-inline-card"><h2 className="card-title">Thân nhân người cai nghiện</h2>
    <div className="lookup">
      <div className={'lookup-field' + (error ? ' is-error' : '')}>
        <input className={'text-input' + (error ? ' input-border-error' : '')} placeholder="Nhập số căn cước công dân hoặc số điện thoại (Đây là mục bắt buộc)" value={text}
          onChange={(e) => { setText(e.target.value); setState(''); }} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); run(); } }} />
        <AppButtonWithIcon className="lookup-scan" onClick={() => setScan(true)} aria-label="Quẹt thẻ" iconRaw={ICON_CARD} title="Quẹt thẻ căn cước công dân" />
      </div>
      <div className={'input-error' + (error ? ' is-visible' : '')}>{error}</div>
      <AppButtonWithIcon className="form-btn form-btn-primary" onClick={() => run()} iconRaw={'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>'} iconLinejoin={null}>Tra cứu</AppButtonWithIcon>
    </div>
    <div>
      {state === 'notfound' && <div className="lookup-not-found"><div className="lookup-not-found-title"><RichText text={msg('E001-11', 'thân nhân')} /></div><div className="lookup-not-found-desc">{msg('I001-76', text)}</div></div>}
      {state === 'card' && <div className="relative-card"><div className="relative-avatar">{initials('Trần Thị Bình')}</div><div>
        <div className="relative-name"><span className="relative-name-link" title="Xem chi tiết thân nhân">Trần Thị Bình</span><AppTag className="tag tag-dot tag-approved">Đã duyệt</AppTag></div>
        <div className="status-note">CCCD: <b>{text}</b> — Số điện thoại: <b>0987654321</b> — Quan hệ: <b>Mẹ</b></div></div></div>}
    </div>
    <AppModal id="sdScan" open={scan} onClose={closeScan}>
      <div className="dlg-h"><h3>Quẹt thẻ căn cước công dân</h3><DialogCloseButton onClick={closeScan} /></div>
      <div className="dlg-b"><div className="scan-area">
        <div className="scan-icon"><Svg raw={ICON_CARD} strokeWidth="1.8" /></div>
        <div className="scan-title">Đưa thẻ căn cước vào đầu đọc</div>
        <div className="scan-desc">Hệ thống tự đọc số căn cước và tra cứu ngay.<br />Đầu đọc đang bật, giữ thẻ tới khi có tiếng báo.</div>
        <div className="scan-spinner" />
      </div></div>
      <div className="dlg-f"><AppButton className="form-btn" onClick={closeScan}>Hủy</AppButton></div>
    </AppModal>
  </div>
  <div className="sd-muted">Để trống rồi Tra cứu ⇒ lỗi dưới ô (E001-01) · gõ 000 ⇒ không tìm thấy (E001-35 dưới ô + khung E001-11) · gõ số khác ⇒ thẻ thân nhân · icon thẻ ⇒ hộp Quẹt thẻ</div></div>;
}

/* ── Chọn người cai nghiện dạng thẻ có quỹ thăm — nguồn AppointmentForm.jsx (khối #khoiNCN, gọi thẳng Pm1SyncBar · VisitConditionsLink) ── */
const STUDENTS = [
  { name: 'Trần Văn Cường', profile: 'HS-00412 · Dãy A / Phòng A101', cid: '001189004412', birth: '12/04/1989', manager: 'Nguyễn Văn Hải', quota: 2, ok: true },
  { name: 'Lê Minh Cường', profile: 'HS-00518 · Dãy B / Phòng B203', cid: '001192005518', birth: '27/09/1992', manager: 'Nguyễn Văn Hùng', quota: 0, ok: false, reason: 'Đã hết lượt thăm gặp trong tuần' },
];
export function StudentListDemo() {
  const [pick, setPick] = useState(-1);   /* như màn: mở ra chưa chọn ai */
  return <div className="card sd-inline-card">
    <div className="card-title-row"><h2 className="card-title">Người cai nghiện</h2><span className="card-title-tools"><Pm1SyncBar /><VisitConditionsLink /></span></div>
    <div className="student-list">{STUDENTS.map((x, i) => (
      <AppButton key={i} className={'student-card' + (x.ok ? '' : ' is-locked') + (i === pick ? ' is-selected' : '')} disabled={!x.ok} onClick={x.ok ? () => setPick(i) : undefined}>
        <div className="student-avatar">{initials(x.name)}</div>
        <div className="student-body">
          <div className="student-name">{x.name + ' — ' + x.profile}{x.ok ? <span className="visit-ok-tag">Đủ điều kiện thăm gặp</span> : null}</div>
          <div className="status-note">CCCD: <b>{x.cid}</b> — Ngày sinh: <b>{x.birth}</b></div>
          {x.manager ? <div className="status-note">Cán bộ quản lý: <b>{x.manager}</b></div> : null}
          {x.ok ? null : <div className="visit-block-reason"><Svg raw={'<circle cx="12" cy="12" r="10"/><path d="M12 7v6M12 16.5h.01"/>'} /><RichText text={x.reason} /></div>}
        </div>
        <div className="student-side"><div className={'quota-box' + (x.ok ? '' : ' is-exhausted')}><div className="quota-number">{x.quota}</div><div className="quota-label">quỹ thăm còn lại</div></div></div>
      </AppButton>))}</div>
  </div>;
}

/* ── Nguồn đặt lịch + Khung giờ và buồng — nguồn AppointmentForm.jsx (khối bước 1 «Nguồn đặt lịch», khối bước 2) ──
 * 2 khung đầu = đúng trạng thái màn mở ra (chưa chọn ngày); các khung sau = trạng thái khác của cùng khối */
const SOURCE_TITLE = 'Nguồn đặt lịch của màn này là cố định, không đổi được';   /* formActions.js createModel sourceTitle */
const VISIT_TYPE_OPTIONS = [{ label: 'Chọn loại hình thăm gặp', value: '' }, { label: 'Thăm gặp trực tiếp tiêu chuẩn', value: 'Thăm gặp trực tiếp tiêu chuẩn' }];
let scheduleGridSeq = 0;   /* mỗi lần vẽ 1 id riêng cho ô Dãy nhà — tránh id trùng khi mẫu hiện nhiều lần */
function ScheduleGrid({ dayText, onToday, children, hasStudent = true }) {
  const [rid] = useState(() => 'sdRoDayNha' + (++scheduleGridSeq));
  return <div className="form-grid">
    <div className="field span-4"><label className="field-label">Loại hình thăm gặp<span className="required-mark">*</span></label>
      <SearchableSelect uncontrolled value="Thăm gặp trực tiếp tiêu chuẩn" options={VISIT_TYPE_OPTIONS} /></div>
    <div className="field span-4"><label className="field-label" htmlFor={rid}>Dãy nhà</label><div className="select-field is-readonly"><input className="text-input" id={rid} readOnly value="Dãy nhà A" /></div></div>
    {/* 13/10/2026: màn đổi Quầy tiếp đón thành ô chọn bắt buộc (AppointmentForm.jsx #oQuay) — chưa chọn người cai nghiện thì khoá, câu «Chọn người cai nghiện trước» */}
    <div className="field span-4"><label className="field-label">Quầy tiếp đón<span className="required-mark">*</span></label>
      <SearchableSelect disabled={!hasStudent} value={hasStudent ? 'Q01' : ''} options={[{ label: hasStudent ? 'Chọn quầy tiếp đón' : 'Chọn người cai nghiện trước', value: '' }, { label: 'Q01 — Quầy tiếp đón chính', value: 'Q01' }]} /></div>
    <div className="field span-4"><label className="field-label">Ngày thăm gặp<span className="required-mark">*</span></label>
      <div className="date-row"><AppButtonWithIcon htmlType="button" className="text-input date-input" icon="calendar" iconClassName="date-icon"><span>{dayText}</span></AppButtonWithIcon>
        <a className="quick-link" data-onclick="1" onClick={onToday}>Chọn ngày hôm nay</a></div></div>
    {children}
  </div>;
}
export function ScheduleFieldsDemo() {
  const [day, setDay] = useState('Chọn ngày hẹn');
  const today = () => setDay(formatDate(new Date()));
  return <div className="sd-col-wide">
    <div className="card sd-inline-card"><h2 className="card-title">Nguồn đặt lịch</h2>
      <div className="option-group"><div className="locked-value" title={SOURCE_TITLE}><Svg raw={'<path d="M20 6 9 17l-5-5"/>'} />{' ' + sourceLabel('STAFF') + ' '}</div></div></div>
    <div className="card sd-inline-card"><h2 className="card-title">Khung giờ và buồng thăm gặp</h2>
      <ScheduleGrid dayText={day} onToday={today}>
        <div className="span-12"><div className="hours-empty"><RichText text={msg('I001-74')} /></div></div>
      </ScheduleGrid></div>
    <div className="sd-muted">Đã chọn ngày ⇒ hiện lưới «Lịch theo buồng trong ngày», câu nhắc dưới lưới, 2 ô chỉ đọc Khung giờ và Buồng thăm gặp</div>
    <div className="card sd-inline-card"><h2 className="card-title">Khung giờ và buồng thăm gặp</h2>
      <ScheduleGrid dayText={formatDate(new Date())} onToday={today}>
        <div className="span-12"><div className="form-grid-title">Lịch theo buồng trong ngày</div><p className="sd-muted">Lưới theo buồng: xem khối «Lưới lịch theo buồng» ở nhóm Hiển thị dữ liệu</p><span className="field-hint">Bấm vào chỗ trống trên lịch để chọn giờ và buồng</span></div>
        <div className="field span-4"><label className="field-label" htmlFor="sdRoKhungGio">Khung giờ</label><div className="select-field is-readonly"><input className="text-input" id="sdRoKhungGio" readOnly placeholder="Chọn chỗ trống trên lịch" defaultValue="" /></div></div>
        <div className="field span-4"><label className="field-label" htmlFor="sdRoBuong">Buồng thăm gặp</label><div className="select-field is-readonly"><input className="text-input" id="sdRoBuong" readOnly placeholder="Chọn chỗ trống trên lịch" defaultValue="" /></div></div>
      </ScheduleGrid></div>
    <div className="sd-muted">Quầy chưa có buồng thăm gặp ⇒ thay lưới bằng câu hướng dẫn có link mở màn cài đặt (SetupHint)</div>
    <div className="card sd-inline-card"><h2 className="card-title">Khung giờ và buồng thăm gặp</h2>
      <ScheduleGrid dayText={formatDate(new Date())} onToday={today}>
        <div className="span-12"><div className="hours-empty"><SetupHint inline id="sdHoursEmpty" what="buồng thăm gặp" screen="Cài đặt quầy tiếp đón" to="#" /></div></div>
      </ScheduleGrid></div>
  </div>;
}

/* ── Bảng nhập nhiều dòng + nút thêm/xoá dòng — nguồn AppointmentForm.jsx (khối Thân nhân đi cùng) ── */
/* Cột họ tên là Ô CHỌN thân nhân đã liên kết (không gõ tay) · Quan hệ và CCCD khoá, tự điền theo người được chọn · mỗi dòng chỉ còn những người chưa chọn ở dòng khác
 * · tối đa MAX_COMPANIONS dòng · xoá dòng cuối cùng thì làm trống dòng đó (formActions.js addCompanionRow · removeCompanionRow · changeCompanion) */
const SAMPLE_COMPANIONS = [
  { fullName: 'Trần Văn Dũng', relationship: 'Anh trai', citizenId: '001190012345' },
  { fullName: 'Nguyễn Thị Lan', relationship: 'Vợ', citizenId: '001195034567' },
  { fullName: 'Trần Minh Khoa', relationship: 'Con', citizenId: '001210078901' },
];
const MAX_TITLE = 'Tối đa 03 thân nhân mỗi lượt thăm gặp (Điều 34 Thông tư 79)';   /* cùng câu với formActions.js refreshAddButton */
export function CompanionsDemo() {
  const [rows, setRows] = useState([{ key: 1, value: '' }]);   /* như màn: mở ra 1 dòng trống */
  const optionsFor = (key) => [{ value: '', label: 'Chọn thân nhân đi cùng' }].concat(SAMPLE_COMPANIONS
    .filter((p) => !rows.some((r) => r.key !== key && r.value === p.fullName)).map((p) => ({ value: p.fullName, label: p.fullName })));
  const person = (r) => SAMPLE_COMPANIONS.find((p) => p.fullName === r.value) || {};
  const remove = (key) => setRows(rows.length <= 1 ? [{ key: rows[0].key, value: '' }] : rows.filter((x) => x.key !== key));
  const full = rows.length >= MAX_COMPANIONS;
  const cols = [
    { key: 'stt', title: 'STT', thStyle: { width: '44px' }, render: (r, i) => i + 1 },
    { key: 'name', title: 'Thân nhân đi cùng', render: (r) => <SearchableSelect className="o-nhap dc-ten" options={optionsFor(r.key)} value={r.value}
      onChange={(v) => setRows(rows.map((x) => (x.key === r.key ? { ...x, value: v } : x)))} /> },
    { key: 'relationship', title: 'Quan hệ', thStyle: { width: '220px' }, render: (r) => <input className="o-nhap dc-qh" aria-label="Quan hệ" disabled value={person(r).relationship || ''} /> },
    { key: 'citizenId', title: 'CCCD', thStyle: { width: '180px' }, render: (r) => <input className="o-nhap dc-gt" aria-label="CCCD" disabled value={person(r).citizenId || ''} /> },
    { key: 'remove', title: '', thStyle: { width: '56px' }, render: (r) => <AppButtonWithIcon className="form-btn-remove" title="Xóa dòng" onClick={() => remove(r.key)} iconRaw={ICON_DELETE} /> },
  ];
  return <div className="card sd-inline-card"><h2 className="card-title">Thân nhân đi cùng</h2>
    <div className="sd-scroll-x"><AppTable tableClassName="people-table" rowKey="key" columns={cols} dataSource={rows} /></div>
    <AppButtonWithIcon className="form-btn-add" onClick={() => setRows(rows.concat({ key: Date.now(), value: '' }))} disabled={full} title={full ? MAX_TITLE : undefined} data-nhac={full ? MAX_TITLE : undefined}
      iconRaw={'<path d="M12 5v14M5 12h14"/>'} iconLinejoin={null}>Thêm thân nhân đi cùng</AppButtonWithIcon>
  </div>;
}

/* ── Chọn luồng dạng thẻ radio — nguồn src/pages/CounterRegistration/blocks.jsx (RouteChoice) ── */
export function RouteOptionsDemo() {
  const [route, setRoute] = useState(ROUTE_OPTIONS[0].value);
  return <div className="route-options" role="radiogroup">{ROUTE_OPTIONS.map((o) => (
    <button type="button" key={o.value} role="radio" aria-checked={route === o.value} className={'route-option' + (route === o.value ? ' is-selected' : '')} onClick={() => setRoute(o.value)}>
      <span className="route-radio" aria-hidden="true" /><span className="route-text"><span className="route-title">{o.label}</span><span className="route-hint">{o.hint}</span></span>
    </button>))}</div>;
}

/* ── Bảng cấu hình theo ngày có công tắc — nguồn VisitConfig.jsx (bảng vc-days chế độ Sửa, gọi thẳng WEEKDAYS · TimeRangeInput; nút «Lưu» = pageActions chế độ Sửa) ── */
const LABEL_BREAK = 'Giờ nghỉ giữa các ca (phút)';   /* VisitConfig.jsx */
const ICON_SAVE_CHECK = '<polyline points="20 6 9 17 4 12"/>';   /* VisitConfig.jsx pageActions vcLuu */
export function ConfigDaysDemo() {
  const [days, setDays] = useState(() => defaultDirectConfig().days);   /* như màn: cấu hình mặc định của store (thăm T4–T6) */
  const dayLabel = (dow) => WEEKDAYS.find((w) => w.dow === dow).label;
  const setDay = (dow, fn) => setDays(days.map((x) => (x.dow === dow ? fn(x) : x)));
  const shiftCell = (shift, name) => (d) => (!d.enabled ? <span className="vc-off">Không thăm gặp</span> : <>
    <TimeRangeInput from={d[shift].from} to={d[shift].to} idPrefix={'sdvc-' + d.dow + '-' + shift} labelFrom={'Giờ bắt đầu ' + name + ' ' + dayLabel(d.dow)} labelTo={'Giờ kết thúc ' + name + ' ' + dayLabel(d.dow)}
      onChange={(edge, value) => setDay(d.dow, (x) => ({ ...x, [shift]: { ...x[shift], [edge]: value } }))} />
    <span className="field-error" /></>);
  const cols = [
    { key: 'dow', title: 'Thứ', thStyle: { width: '140px' }, render: (d) => <b>{dayLabel(d.dow)}</b> },
    { key: 'enabled', title: 'Thăm gặp', thStyle: { width: '120px' }, render: (d) => <span className="vc-switch"><Switch checked={d.enabled} aria-label={'Thăm gặp ' + dayLabel(d.dow)} data-no-tooltip data-fe="Switch" onChange={(on) => setDay(d.dow, (x) => ({ ...x, enabled: on }))} /></span> },
    { key: 'morning', title: 'Ca sáng', render: shiftCell('morning', 'ca sáng') },
    { key: 'afternoon', title: 'Ca chiều', render: shiftCell('afternoon', 'ca chiều') },
    { key: 'breakMinutes', title: LABEL_BREAK, thStyle: { width: '220px' }, render: (d) => (!d.enabled ? <span className="vc-off">Không thăm gặp</span> : <>
      <input className="text-input" type="number" min="0" max="60" step="5" value={d.breakMinutes} aria-label={LABEL_BREAK + ' ' + dayLabel(d.dow)} onChange={(e) => setDay(d.dow, (x) => ({ ...x, breakMinutes: e.target.value }))} />
      <span className="field-error" /></>) },
  ];
  return <div className="sd-col-wide">
    <div className="sd-scroll-x"><AppTable tableClassName="vc-days" rowKey="dow" columns={cols} dataSource={days} /></div>
    <div className="sd-row"><AppButtonWithIcon className="form-btn form-btn-primary" iconRaw={ICON_SAVE_CHECK}>Lưu</AppButtonWithIcon></div>
  </div>;
}

/* ── Bảng lịch sử thao tác — component dùng chung theo màn src/pages/ReceptionDeskShared/HistoryTable.jsx ── */
const HISTORY = [
  { at: '10/10/2026 08:15:02', actorName: 'Nguyễn Thùy Trang', actorRole: 'Cán bộ quầy', action: 'Tạo mới', statusBefore: '', statusAfter: 'DRAFT', changes: [], reason: '' },
  { at: '10/10/2026 08:20:41', actorName: 'Nguyễn Thùy Trang', actorRole: 'Cán bộ quầy', action: 'Chỉnh sửa', statusBefore: 'DRAFT', statusAfter: 'DRAFT', changes: [['Tên quầy', 'Quầy chính', 'Quầy tiếp đón chính']], reason: '' },
  { at: '10/10/2026 08:30:10', actorName: 'Lê Văn Hùng', actorRole: 'Trưởng cơ sở', action: 'Kích hoạt', statusBefore: 'DRAFT', statusAfter: 'ACTIVE', changes: [], reason: 'Đủ buồng phục vụ' },
  { at: '10/10/2026 08:45:00', actorName: 'Nguyễn Thùy Trang', actorRole: 'Cán bộ quầy', action: 'Chỉnh sửa', statusBefore: 'ACTIVE', statusAfter: 'ACTIVE', changes: [['Quầy tiếp đón', 'Q01 — Quầy tiếp đón chính', 'Q02 — Quầy tiếp đón phụ (chọn tay)']], reason: '', note: 'Đã gửi thông báo cho Cán bộ tổ thăm gặp' },   /* thay đổi dữ liệu ở Nội dung thay đổi, ghi chú tự sinh ở Ghi chú hệ thống */
  { at: '10/10/2026 09:05:00', actorName: 'Nguyễn Thùy Trang', actorRole: 'Cán bộ quầy', action: 'Xóa buồng', statusBefore: 'ACTIVE', statusAfter: 'ACTIVE', changes: [['Buồng thăm gặp', 'Q01-03 — Buồng số 3', '']], reason: 'Buồng sửa chữa' },   /* thao tác phá huỷ tô đỏ */
];
const HISTORY_STATUS = { DRAFT: ['draft', 'Nháp'], ACTIVE: ['completed', 'Hoạt động'] };   /* Hoạt động ⇒ mức Xong */
export function HistoryDemo() {
  return <div className="sd-col-wide"><HistoryTable history={HISTORY} renderStatus={(s) => <AppTag className={'tag tag-dot tag-' + HISTORY_STATUS[s][0]}>{HISTORY_STATUS[s][1]}</AppTag>} /></div>;
}

/* ── Bảng cài đặt có công tắc bị khoá + cụm nút thao tác — nguồn NotificationSettings.jsx (khối nhóm 1, gọi thẳng readNotificationSettings · GROUPS · SEND_TYPE_LABELS · timeConditionText) ── */
const LOCKED_TIP = 'Thông báo bắt buộc, không tắt được';   /* NotificationSettings.jsx */
const sendWhenText = (r) => (r.sendType === 'IMMEDIATE' ? SEND_TYPE_LABELS.IMMEDIATE : timeConditionText(r));
export function SettingsRowsDemo() {
  const group = GROUPS[0];
  const [rows, setRows] = useState(() => readNotificationSettings().filter((r) => r.group === group.key));
  const cols = [
    { key: 'index', title: 'STT', className: 'col-index', thStyle: { width: '56px' }, render: (r, i) => i + 1 },
    { key: 'code', title: 'Mã thông báo', thStyle: { width: '300px' }, render: (r) => <span className="ns-code">{r.code}</span> },
    { key: 'name', title: 'Tên thông báo', render: (r) => <span className="ns-name">{r.name}</span> },
    { key: 'sendType', title: 'Gửi khi nào', thStyle: { width: '220px' }, render: (r) => sendWhenText(r) },
    { key: 'enabled', title: 'Bật/Tắt', thStyle: { width: '96px' }, render: (r) => <span className={'ns-switch' + (r.locked ? ' is-locked' : '')} data-tip={r.locked ? LOCKED_TIP : undefined}>
      <Switch checked={!!r.enabled} disabled={r.locked} aria-label={'Bật hoặc tắt thông báo ' + r.code} data-no-tooltip={r.locked ? undefined : true} onChange={(on) => setRows(rows.map((x) => (x.code === r.code ? { ...x, enabled: on } : x)))} /></span> },
    { key: 'actions', title: 'Thao tác', className: 'col-act', thStyle: { width: '96px' }, render: (r) => <div className="acts">
      <AppButtonWithIcon className="ib ib-view" title="Xem chi tiết" aria-label={'Xem chi tiết thông báo ' + r.code} icon="view" />
      <AppButtonWithIcon className="ib ib-edit" title="Chỉnh sửa" aria-label={'Chỉnh sửa thông báo ' + r.code} icon="edit" /></div> },
  ];
  return <div className="sd-col-wide"><div className="card"><h2 className="card-title">{group.title}</h2>
    <div className="ns-table-wrap sd-scroll-x"><AppTable tableClassName="ns-table" rowKey="code" columns={cols} dataSource={rows} /></div></div></div>;
}

/* ── Thông tin chi tiết dạng nhãn–giá trị + thanh nút đầu trang — nguồn AppointmentDetail.jsx (pageActions · InfoGrid «Thông tin lịch hẹn» · InfoTag .adjust-tag) ──
 * Màn thật chỉ hiện nút theo quyền và trạng thái; mẫu hiện đủ 5 nút ĐÚNG thứ tự, nhãn, lớp, icon của mảng pageActions */
const DetailEmpty = () => <span style={{ color: 'var(--color-ink-4)' }}>—</span>;
const InfoTag = ({ value, tagClass }) => (value ? <AppTag className={'adjust-tag' + (tagClass ? ' ' + ((tagClass === 'tag-type' && VISIT_TYPE_TAG_CLASS[value]) || tagClass) : '')}>{value}</AppTag> : '');
const DETAIL_ACTIONS = [
  { id: 'sdDtPheDuyet', label: 'Phê duyệt', className: 'form-btn form-btn-primary dt-approve', iconRaw: '<path d="M20 6 9 17l-5-5"/>' },
  { id: 'sdDtTuChoi', label: 'Từ chối duyệt', iconRaw: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>', iconLinejoin: null },
  { id: 'sdDtChinhSua', label: 'Chỉnh sửa', className: 'form-btn form-btn-primary', iconRaw: '<path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>' },
  { id: 'sdDtXoaLich', label: 'Xóa', className: 'form-btn form-btn-danger is-outline', iconRaw: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>' },
  { id: 'sdDtHuyLich', label: 'Hủy lịch hẹn', className: 'form-btn form-btn-danger is-outline', iconRaw: '<path d="M8 2v4M16 2v4M21 14V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"/><path d="M3 10h18M17 17l4 4M21 17l-4 4"/>' },
];
export function DetailInfoDemo() {
  const rows = [
    ['Nguồn đặt lịch', <InfoTag value={sourceLabel('STAFF')} />],
    ['Luồng đăng ký', 'Thân nhân đã có sổ/tài khoản thăm gặp'],
    ['Số thân nhân tham gia', '2 người'],
    ['Loại hình thăm gặp', <InfoTag value="Thăm gặp trực tiếp tiêu chuẩn" tagClass="tag-type" />],
    ['Dãy nhà', <InfoTag value="Dãy nhà A" tagClass="tag-category" />],
    ['Quầy tiếp đón', <InfoTag value="Q01 — Quầy tiếp đón chính" tagClass="tag-category" />],
    ['Ngày thăm gặp', 'Thứ Tư, 14/10/2026'],
    ['Khung giờ', '09:15 ~ 10:00'],
    ['Thời lượng', <InfoTag value="45 phút" />],
    ['Buồng thăm gặp', <InfoTag value="Q01-01 — Buồng số 1" tagClass="tag-table" />],
  ];
  return <div className="sd-col-wide"><PageHeadActions actions={DETAIL_ACTIONS} />
    <div className="card sd-inline-card"><h2 className="card-title">Thông tin lịch hẹn</h2>
      <div className="adjust">{rows.map(([l, v]) => [<div className="adjust-label" key={l + 'l'}>{l}</div>, <div className="adjust-value" key={l + 'v'}>{v === '' || v == null ? <DetailEmpty /> : v}</div>])}</div></div></div>;
}

/* ── Nhắc thiếu thông tin trước khi lưu — nguồn AppointmentForm.jsx (#nhacThieu .missing-hint · .is-enough) · câu theo mã W001-12 / I001-81 ── */
export function MissingHintDemo() {
  return <div className="sd-col-wide">
    <div className="sd-muted">Còn thiếu thông tin</div>
    <div className="missing-hint"><Svg raw={'<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>'} /><div><RichText text={msg('W001-12', ['Ngày thăm gặp', 'Buồng thăm gặp'].join('**, **'))} /></div></div>
    <div className="sd-muted">Đã nhập đủ</div>
    <div className="missing-hint is-enough"><Svg raw={'<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>'} /><div>{msg('I001-81')}</div></div></div>;
}

/* ── Bảng buồng thăm gặp trong form Quầy — nguồn ReceptionDeskShared/ReceptionDeskForm.jsx (tablesCard · tableColumns, gọi thẳng AppCounterInput · CODE_MAX · CODE_HINT · CatalogStatusTag · tableStatusLabel · COUNTER_ICONS) ──
 * 3 dòng mẫu = 3 trạng thái của màn: buồng mới (mã sửa được, nút Xóa) · buồng đã dùng Hoạt động (mã khoá, nút Vô hiệu hóa) · buồng đã dùng Vô hiệu hóa (nút Kích hoạt) */
export function CounterTablesDemo() {
  const [tables, setTables] = useState([
    { key: 1, code: 'Q01-01', name: 'Buồng số 1', seats: 3, hasPartition: true, status: 'ACTIVE', isNew: false, used: true },
    { key: 2, code: 'Q01-02', name: 'Buồng số 2', seats: 2, hasPartition: false, status: 'INACTIVE', isNew: false, used: true },
    { key: 3, code: '', name: '', seats: '', hasPartition: false, status: 'DRAFT', isNew: true, used: false },
  ]);
  const change = (k, patch) => setTables(tables.map((t) => (t.key === k ? { ...t, ...patch } : t)));
  const cols = [
    { key: 'code', thStyle: { width: '170px' }, title: <>Mã buồng<span className="required-mark">*</span></>, render: (r) => <>
      <AppCounterInput maxLength={CODE_MAX} placeholder="Nhập mã buồng" style={{ textTransform: 'uppercase' }} value={r.code} disabled={!r.isNew} title={r.isNew ? CODE_HINT : 'Không thể sửa mã sau khi tạo'} onChange={(e) => change(r.key, { code: e.target.value.toUpperCase() })} />
      <span className="field-error" /></> },
    { key: 'name', title: <>Tên hiển thị<span className="required-mark">*</span></>, render: (r) => <>
      <AppCounterInput maxLength={100} placeholder="Ví dụ: Buồng số 01" value={r.name} onChange={(e) => change(r.key, { name: e.target.value })} />
      <span className="field-error" /></> },
    { key: 'seats', thStyle: { width: '150px' }, title: <>Số chỗ ngồi<span className="required-mark">*</span></>, render: (r) => <>
      <input type="number" min={1} max={10} step={1} className="text-input" placeholder="1 đến 10" value={r.seats} onChange={(e) => change(r.key, { seats: e.target.value })} />
      <span className="field-error" /></> },
    { key: 'hasPartition', thStyle: { width: '120px' }, title: 'Có vách ngăn', render: (r) => (
      <label className="chk-dong qb-ctl"><input type="checkbox" checked={r.hasPartition} onChange={(e) => change(r.key, { hasPartition: e.target.checked })} />{' Có'}</label>) },
    { key: 'status', thStyle: { width: '140px' }, title: 'Trạng thái', render: (r) => <span className="qb-ctl"><CatalogStatusTag status={r.status === 'DRAFT' ? 'ACTIVE' : r.status} label={tableStatusLabel(r.status === 'DRAFT' ? 'ACTIVE' : r.status)} /></span> },
    { key: 'actions', thStyle: { width: '64px' }, title: '', render: (r) => {
      if (!r.used) return <span className="qb-ctl"><AppButtonWithIcon htmlType="button" className="form-btn-remove" title="Xóa buồng" aria-label="Xóa buồng" onClick={() => setTables(tables.filter((t) => t.key !== r.key))} iconRaw={COUNTER_ICONS.delete} /></span>;
      return r.status === 'INACTIVE'
        ? <span className="qb-ctl"><AppButtonWithIcon htmlType="button" className="ib ib-approve" title="Kích hoạt" aria-label="Kích hoạt" icon="approve" onClick={() => change(r.key, { status: 'ACTIVE' })} /></span>
        : <span className="qb-ctl"><AppButtonWithIcon htmlType="button" className="ib ib-warn" title="Vô hiệu hóa" aria-label="Vô hiệu hóa" icon="prohibit" onClick={() => change(r.key, { status: 'INACTIVE' })} /></span>;
    } },
  ];
  return <div className="sd-col-wide"><div className="card">
    <div className="capacity-head"><h2 className="card-title">Buồng thăm gặp</h2><span className="capacity-spacer" />
      <AppButtonWithIcon className="form-btn" onClick={() => setTables(tables.concat({ key: Date.now(), code: '', name: '', seats: '', hasPartition: false, status: 'DRAFT', isNew: true, used: false }))} iconRaw={'<path d="M12 5v14M5 12h14"/>'} iconLinejoin={null}>Thêm buồng</AppButtonWithIcon></div>
    <div id="sdBanVung" className="sd-scroll-x"><AppTable tableClassName="capacity-table reserved-table qb-table" rowKey="key" columns={cols} dataSource={tables}
      emptyRow={<EmptyRow colSpan={cols.length} entity="buồng thăm gặp" hasRecords={false} />} /></div>
  </div>
  <div className="sd-muted">Quầy mới chưa có buồng (màn Tạo quầy) ⇒ bảng trống, dòng EmptyRow «Chưa có buồng thăm gặp nào»</div>
  <div className="card"><div className="capacity-head"><h2 className="card-title">Buồng thăm gặp</h2><span className="capacity-spacer" />
      <AppButtonWithIcon className="form-btn" iconRaw={'<path d="M12 5v14M5 12h14"/>'} iconLinejoin={null}>Thêm buồng</AppButtonWithIcon></div>
    <div className="sd-scroll-x"><AppTable tableClassName="capacity-table reserved-table qb-table" rowKey="key" columns={cols} dataSource={[]}
      emptyRow={<EmptyRow colSpan={cols.length} entity="buồng thăm gặp" hasRecords={false} />} /></div></div></div>;
}
