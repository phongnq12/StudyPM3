/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Danh mục control của trang Design System PM2 — mỗi mục: tên · từ khoá tìm · component thật · loại control thu hoạch · mã luật UX · mẫu DỰNG CHẠY THẬT · cách dùng.
 * ⇒ mọi mục có mẫu chạy thật, không dùng ảnh chụp.
 * Thêm control mới vào Prototype ⇒ thêm 1 mục ở đây (lệnh deploy chặn nếu component chưa có mục). Tên tiếng Anh (luật). */
import { useState } from 'react';
import { Switch } from 'antd';
import { AppButton, AppButtonWithIcon } from '@/components/app/AppButton';
import AppSelect, { PAGE_SIZE_OPTIONS } from '@/components/app/AppSelect';
import PageSelect from '@/components/app/PageSelect';
import AppSearchInput from '@/components/app/AppSearchInput';
import AppSearchSelect from '@/components/app/AppSearchSelect';
import AppCounterInput from '@/components/app/AppCounterInput';
import { AppFilterDropdown } from '@/components/app/AppFilterDropdown';
import CatalogStatusTag from '@/components/app/CatalogStatusTag';
import AppointmentStatusTag from '@/components/app/AppointmentStatusTag';
import AppTag from '@/components/app/AppTag';
import AppTabs from '@/components/app/AppTabs';
import AppTable from '@/components/app/AppTable';
import EmptyRow from '@/components/app/EmptyRow';
import AppModal from '@/components/app/AppModal';
import DialogIcon from '@/components/app/DialogIcon';
import DialogCloseButton from '@/components/app/DialogCloseButton';
import NoteBox from '@/components/app/NoteBox';
import SetupHint from '@/components/app/SetupHint';
import { PageHeadActions, PageFooter, StepNav } from '@/components/app/PageActions';
import TimeRangeInput from '@/components/app/TimeRangeInput';
import DateTimeInput from '@/components/app/DateTimeInput';
import AttachmentField from '@/components/app/AttachmentField';
import { ParticipantList } from '@/pages/CounterRegistration/blocks';
import { S as COUNTER_STATE } from '@/pages/CounterRegistration/engine';
import Pm1SyncBar from '@/components/app/Pm1SyncBar';
import DeleteAppointmentDialog from '@/components/app/DeleteAppointmentDialog';
import CancelAppointmentDialog from '@/components/app/CancelAppointmentDialog';
import NotifyRecipientsField from '@/components/app/NotifyRecipientsField';
import RelativeDetailBody from '@/components/app/RelativeDetailBody';
import VisitConditionsLink from '@/components/app/VisitConditions';
import { DocumentCheckTable, ExemptionInfoGrid, exemptionRows } from '@/components/app/ExemptionInfo';
import { DateRange } from '@/pages/AppointmentList/widgets';
import TableCalendar from '@/components/app/TableCalendar';
import { buildAppointments, truncate, ROW_ACTIONS, ACTION_COLOR, ACTION_ICON, LIST_ICONS } from '@/pages/AppointmentList/listLogic';
import { ACTION_CONFIG, COUNTER_ICONS } from '@/pages/ReceptionDeskShared/config';
import { valueTagStyleOf } from '@/lib/valueTagColor';
import { Svg } from '@/lib/icons';
import { STATE_ITEMS } from './stateDemos';
import { msg, msgParts } from '@/lib/msg';
import { RichText, key } from '@/lib/richText';
import { toast } from '@/lib/legacyUi';
import { ListScreenDemo, LookupDemo, StudentListDemo, ScheduleFieldsDemo, CompanionsDemo, RouteOptionsDemo, ConfigDaysDemo, HistoryDemo, SettingsRowsDemo, DetailInfoDemo, MissingHintDemo, CounterTablesDemo } from './blocks';
import { RadioGroupDemo, CheckboxGroupDemo, NumberInputDemo, SegmentedDemo, AvatarDemo, BadgeDemo, ProgressDemo, SpinnerDemo, SkeletonDemo, DividerDemo, AccordionDemo, DrawerDemo, PopoverDemo, LinkDemo, BreadcrumbDemo, MediaDemo, TreeDemo } from './ExtraDemos';   /* 14 control bổ sung */
import { TreeSelectDemo, MultiSelectDemo, StatCardsDemo, EmptyStatesDemo, ImportExcelDemo } from './Pm1Demos';   /* 5 control bổ sung theo Design System PM1 */
import { ScrollShadowDemo, KbdDemo, ToolbarDemo, ColorSwatchDemo } from './ExtraDemos2';   /* 4 control bổ sung */

const appointmentsOnce = (() => { let cache = null; return () => { if (!cache) { try { cache = buildAppointments(); } catch { cache = []; } } return cache; }; })();

/* ── mẫu có trạng thái ── */
function SelectDemo() { const [v, setV] = useState(20); return <div className="sd-row"><span>Chọn số bản ghi</span><AppSelect width={61} value={v} options={PAGE_SIZE_OPTIONS} showSearch={false} allowClear={false} onChange={setV} /><span>trên 1 trang</span></div>; }
/* lớp filter-cell như màn thật — thiếu lớp này thì ô nhập mất viền, bo góc, cao 36px (base.css .filter-cell input) */
function SearchDemo() { const [v, setV] = useState(''); return <div style={{ maxWidth: 420 }}><AppSearchInput className="filter-cell" value={v} onChange={setV} placeholder="Tìm theo mã quầy, tên quầy" /></div>; }
function CounterDemo() {
  const [a, setA] = useState('Quầy tiếp đón chính'); const [b, setB] = useState('');
  return <div className="form-grid"><div className="field span-6"><label className="field-label">Tên quầy<span className="required-mark">*</span></label><AppCounterInput maxLength={100} value={a} onChange={(e) => setA(e.target.value)} placeholder="Nhập tên quầy" /></div>
    <div className="field span-12"><label className="field-label">Ghi chú</label><AppCounterInput multiline maxLength={1000} value={b} onChange={(e) => setB(e.target.value)} placeholder="Nhập ghi chú" /></div></div>;
}
/* Ô nhập nhiều dòng tách thành mục riêng — trước nằm lẫn trong mục Ô nhập có bộ đếm ký tự */
function MultiLineDemo() {
  const [v, setV] = useState('');
  return <div className="form-grid"><div className="field span-12"><label className="field-label">Ghi chú</label><AppCounterInput multiline maxLength={1000} value={v} onChange={(e) => setV(e.target.value)} placeholder="Nhập ghi chú" /></div></div>;
}
function SearchSelectDemo() {
  const [v, setV] = useState('');
  return <div className="form-grid"><div className="field span-6"><label className="field-label">Dãy nhà phục vụ<span className="required-mark">*</span></label>
    <AppSearchSelect id="sdSearchSelect" value={v} onChange={setV} options={[{ value: '', label: 'Chọn dãy nhà' }, { value: 'A', label: 'A — Dãy nhà A' }, { value: 'B', label: 'B — Dãy nhà B' }, { value: 'C', label: 'C — Dãy nhà C' }]} /></div></div>;
}
function FilterDropdownDemo() {
  const [open, setOpen] = useState(false); const [v, setV] = useState('');
  return <div style={{ maxWidth: 280 }}><AppFilterDropdown id="sdFilter" ariaLabel="Trạng thái" placeholder="Tất cả trạng thái" items={['Nháp', 'Hoạt động', 'Vô hiệu hóa']} value={v} open={open}
    onOpen={() => setOpen(!open)} onPick={(x) => { setV(x); setOpen(false); }} onClear={() => setV('')} /></div>;
}
function DateRangeDemo() { const [r, setR] = useState({ from: '', to: '' }); return <div style={{ maxWidth: 320 }}><DateRange dateFrom={r.from} dateTo={r.to} onChange={(from, to) => setR({ from, to })} onClear={() => setR({ from: '', to: '' })} /></div>; }
function TimeRangeDemo() {
  const [r, setR] = useState({ from: '07:30', to: '11:00' });
  return <div style={{ maxWidth: 320 }}><TimeRangeInput from={r.from} to={r.to} idPrefix="sdTime" labelFrom="Giờ bắt đầu" labelTo="Giờ kết thúc" onChange={(edge, value) => setR((x) => ({ ...x, [edge]: value }))} /></div>;
}
/* Ô chọn ngày giờ: app chưa dùng, định nghĩa sẵn — mẫu có sẵn 1 giá trị để thấy ngày và giờ được đánh dấu */
function DateTimeDemo() { const [v, setV] = useState('15/10/2026 08:30'); return <div style={{ maxWidth: 240 }}><DateTimeInput id="sdDateTime" label="Thời điểm hẹn" value={v} onChange={setV} /></div>; }
function CheckboxDemo() { const [a, setA] = useState(true); return <div className="sd-row"><label className="chk"><input type="checkbox" checked={a} onChange={(e) => setA(e.target.checked)} /> Có vách ngăn</label><label className="chk"><input type="checkbox" /> Gửi thông báo cho thân nhân</label><label className="chk"><input type="checkbox" disabled /> Đang khoá</label></div>; }
function SwitchDemo() { const [on, setOn] = useState(true); return <div className="sd-row"><Switch checked={on} onChange={setOn} aria-label="Bật tắt" /><span>{on ? 'Bật' : 'Tắt'}</span><Switch checked disabled aria-label="Khoá" /><span className="sd-muted">khoá</span></div>; }
/* mở sẵn 1 tệp mẫu để hiện nút bỏ tệp .attach-remove (nút chỉ hiện khi đã có tệp) */
function AttachmentDemo() { const [v, setV] = useState([{ name: 'Giay-xac-nhan-tam-tru.pdf', size: 245760 }]); return <AttachmentField id="sdAttach" value={v} onChange={setV} />; }
/* Thẻ kiểm giấy tờ từng người — gọi thẳng ParticipantList của màn Đăng ký tại quầy; tự khai 2 người mẫu, người thứ 2 «Không khớp»
 nên hiện nút «Bỏ khỏi lượt» .person-remove (nút chỉ hiện khi kết quả chấm lệch) */
function ParticipantDemo() {
  useState(() => {
    COUNTER_STATE.participants = [
      { fullName: 'Nguyễn Văn An', citizenId: '001090012345', birthDateText: '12/03/1990', relationship: 'Bố', isRegistrant: true },
      { fullName: 'Trần Thị Bình', citizenId: '001092054321', birthDateText: '05/07/1992', relationship: 'Mẹ', isRegistrant: false },
    ];
    COUNTER_STATE.checkResults = { 0: 'Khớp', 1: 'Không khớp' }; COUNTER_STATE.checkedMarks = { 0: true, 1: true };
  });
  return <ParticipantList />;
}
function NotifyDemo() { const [v, setV] = useState(null); const records = appointmentsOnce().slice(0, 1); return <NotifyRecipientsField id="sdNotify" code="APPOINTMENT_CANCELLED" records={records} value={v} onChange={setV} />; }
function TabsDemo() {
  const [k, setK] = useState('1');
  return <AppTabs activeKey={k} onChange={setK} items={[
    { key: '1', id: 'sdTab1', label: 'Thông tin quầy', children: <p className="sd-pad">Nội dung tab Thông tin quầy</p> },
    { key: '2', id: 'sdTab2', label: 'Buồng thăm gặp', children: <p className="sd-pad">Nội dung tab Buồng thăm gặp</p> },
    { key: '3', id: 'sdTab3', label: 'Lịch sử thao tác', children: <p className="sd-pad">Nội dung tab Lịch sử thao tác</p> }]} />;
}
const TABLE_ROWS = [{ code: 'Q01', name: 'Quầy tiếp đón chính', status: 'ACTIVE' }, { code: 'Q02', name: 'Quầy phụ Cổng 2', status: 'DRAFT' }];
const TABLE_COLUMNS = [
  { key: 'stt', title: 'STT', thStyle: { width: '60px' }, render: (r, i) => i + 1 },
  { key: 'code', title: 'Mã quầy', thStyle: { width: '120px' }, className: 'cell-code' },
  { key: 'name', title: 'Tên quầy', thStyle: { width: '260px' } },
  { key: 'status', title: 'Trạng thái', thStyle: { width: '150px' }, render: (r) => <CatalogStatusTag status={r.status} label={r.status === 'ACTIVE' ? 'Hoạt động' : 'Nháp'} /> },
  { key: 'act', title: 'Thao tác', thStyle: { width: '110px' }, render: () => <span className="sd-row"><AppButtonWithIcon className="ib ib-edit" title="Sửa" icon="edit" /><AppButtonWithIcon className="ib ib-danger dg" title="Xóa" icon="close" /></span> },
];
function TableDemo() {
  const [empty, setEmpty] = useState(false);
  return <div className="sd-col-wide"><label className="chk"><input type="checkbox" checked={empty} onChange={(e) => setEmpty(e.target.checked)} /> Xem dòng rỗng</label>
    <div className="card sd-scroll-x"><AppTable rowKey="code" columns={TABLE_COLUMNS} dataSource={empty ? [] : TABLE_ROWS} emptyRow={<EmptyRow colSpan={5} entity="quầy tiếp đón" hasRecords={false} />} /></div>
    <div className="sd-muted">Bảng danh sách rộng tối thiểu <code>2390px</code> (<code>base.css</code>), khung cuộn ngang như màn thật</div></div>;
}
/* Góc tài khoản ở đầu trang màn thật (AppLayout): bấm ⇒ menu Đăng nhập tài khoản khác · Đăng xuất. Trang Design System dùng fixedAccount (1 vai) nên dựng mẫu riêng ở đây */
function AccountMenuDemo() {
  return <div style={{ background: '#B91C1C', borderRadius: 8, padding: '10px 16px', marginTop: 12, minHeight: 190, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
    <div className="acct is-open">
      <div className="acct-av">NL</div>
      <div><div className="acct-n">Nguyễn Thùy Linh</div><div className="acct-r">Cán bộ Tổ thăm gặp</div></div>
      <Svg raw={'<path d="m6 9 6 6 6-6"/>'} className="acct-car" />
      <div className="acct-menu" role="menu">
        <button type="button" className="acct-mi" role="menuitem"><Svg raw={'<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="m10 17 5-5-5-5"/><path d="M15 12H3"/>'} />Đăng nhập tài khoản khác</button>
        <button type="button" className="acct-mi" role="menuitem"><Svg raw={'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>'} />Đăng xuất</button>
      </div>
    </div>
  </div>;
}
function PagerDemo() {
  const [size, setSize] = useState(20);
  const [page, setPage] = useState(1);   /* nút như PM1 — tắt ở trang đầu/cuối, không tooltip · chữ «Trang X/Y» + ô «Chọn trang» */
  const pages = Math.ceil(45 / size), cur = Math.min(page, pages);   /* đổi số bản ghi ⇒ số trang đổi, ô Chọn trang nhảy theo */
  return <div className="pager"><AppButtonWithIcon className="pg-nav" disabled={cur <= 1} icon="chevLeft" onClick={() => setPage(cur - 1)}>Trang trước</AppButtonWithIcon>
    <div className="pg-center"><span className="pg-i">Tổng số: <b>45</b></span><span className="pg-v" /><span className="pg-i">Trang <b>{cur + '/' + pages}</b></span><span className="pg-v" /><span className="pg-i">Chọn trang</span><PageSelect current={cur} total={pages} onChange={setPage} /><span className="pg-v" /><span className="pg-i">Chọn số bản ghi</span>
      <AppSelect width={61} value={size} options={PAGE_SIZE_OPTIONS} showSearch={false} allowClear={false} onChange={setSize} /><span className="pg-i">trên 1 trang</span></div>
    <AppButtonWithIcon className="pg-nav" disabled={cur >= pages} icon="chevRight" iconAfter onClick={() => setPage(cur + 1)}>Trang sau</AppButtonWithIcon></div>;
}
function FilterPanelDemo() {
  const [q, setQ] = useState(''); const [open, setOpen] = useState(''); const [f, setF] = useState({ status: '', zone: '', source: '', table: '' }); const [more, setMore] = useState(true)   /* mẫu khu lọc mở sẵn phần Tìm kiếm mở rộng để thấy đủ khuôn hàng mở rộng (độ phủ: filter-row-more, filter-source) */;
  const cell = ([k, ph, items, cls]) => <div className={'filter-cell ' + cls} key={k}>
    <AppFilterDropdown id={'sdf' + k} ariaLabel={ph} placeholder={ph} items={items} value={f[k]} open={open === k} onOpen={() => setOpen(open === k ? '' : k)} onPick={(m) => { setF({ ...f, [k]: m }); setOpen(''); }} onClear={() => setF({ ...f, [k]: '' })} /></div>;
  return <div>
    <div className="sd-muted">Khuôn chuẩn (đã duyệt áp mọi màn danh sách): 1 dòng cố định + nút «Tìm kiếm mở rộng», phần mở rộng gập sẵn, không số đếm</div>
    <div className="shell-filters"><div className="filter-panel is-fixed">
      <div className="filter-body filter-row-main">
        <AppSearchInput className="filter-cell filter-wide" value={q} onChange={setQ} placeholder="Tìm theo mã lịch hẹn, tên người cai nghiện, CCCD, tên thân nhân" />
        <DateRange dateFrom="" dateTo="" onChange={() => {}} onClear={() => {}} />
        {cell(['status', 'Tất cả trạng thái', ['Chờ duyệt', 'Đã duyệt'], 'filter-status'])}
        <div className="filter-more"><AppButtonWithIcon className={'filter-more-btn-icon' + (more ? ' is-open' : '')} aria-expanded={String(more)} aria-label={more ? 'Thu gọn tìm kiếm' : 'Tìm kiếm mở rộng'} data-tip={more ? 'Thu gọn tìm kiếm' : 'Tìm kiếm mở rộng'} onClick={() => setMore(!more)} iconRaw={'<path d="M22 3H2l8 9.46V19l4 2v-8.54z"/>'} /><span className="filter-count is-inline filter-more-count" aria-hidden="true">1</span></div>
      </div>
      {more && <div className="filter-body filter-row-more">{[['source', 'Tất cả nguồn đăng ký', ['Cán bộ đặt hộ'], 'filter-source'], ['table', 'Tất cả buồng thăm gặp', ['Q01-01 — Buồng số 1'], 'filter-table']].map(cell)}</div>}
    </div></div>
    <div className="sd-muted">Ít điều kiện, đủ 1 dòng (như Danh sách quầy): cùng khuôn 1 dòng cố định, không có nút «Tìm kiếm mở rộng»</div>
    <div className="shell-filters"><div className="filter-panel is-fixed">
      <div className="filter-body filter-row-main">
        <AppSearchInput className="filter-cell filter-wide" value={q} onChange={setQ} placeholder="Tìm theo mã quầy, tên quầy" />
        {[['zone', 'Tất cả dãy nhà', ['A — Dãy nhà A', 'B — Dãy nhà B'], 'filter-zone']].map(cell)}
      </div></div></div>
  </div>;
}
const CONFIRM_CASES = {
  delete: { icon: 'danger', parts: () => msgParts('C001-01', 'quầy tiếp đón', 'Q01 — Quầy tiếp đón chính'), ok: 'Xóa', okClass: 'btn btn-danger' },
  deactivate: { icon: 'warn', parts: () => msgParts('C001-09', 'quầy tiếp đón', 'Q01 — Quầy tiếp đón chính'), ok: 'Vô hiệu hóa', okClass: 'btn btn-primary', extra: () => msg('W001-15', 'Quầy ' + key('Q01'), 3) },
  activate: { icon: null, parts: () => msgParts('C001-11', 'quầy tiếp đón', 'Q01 — Quầy tiếp đón chính', 'đặt lịch thăm gặp'), ok: 'Kích hoạt', okClass: 'btn btn-primary' },
};
function ConfirmDemo() {
  const [kind, setKind] = useState(null);
  const c = kind ? CONFIRM_CASES[kind] : null; const p = c ? c.parts() : null;
  return <div className="sd-row">
    <AppButton className="btn" onClick={() => setKind('delete')}>Hộp Xóa — mức đỏ</AppButton>
    <AppButton className="btn" onClick={() => setKind('deactivate')}>Hộp Vô hiệu hóa — mức cam</AppButton>
    <AppButton className="btn" onClick={() => setKind('activate')}>Hộp Kích hoạt — không icon</AppButton>
    <AppModal id="sdConfirm" open={!!kind} onClose={() => setKind(null)} labelledBy="sdConfirmTitle">
      <div className="dlg-h"><h3 id="sdConfirmTitle" className="dlg-t">{c && c.icon ? <DialogIcon level={c.icon} /> : null}{p ? <RichText text={p.title} /> : ''}</h3><DialogCloseButton onClick={() => setKind(null)} /></div>
      <div className="dlg-b">{p ? <><div><RichText text={p.body} /></div>{c.extra ? <div className="eff is-warning"><RichText text={c.extra()} /></div> : null}</> : null}</div>
      <div className="dlg-f"><AppButton className="btn" onClick={() => setKind(null)}>Hủy</AppButton><AppButton className={c ? c.okClass : 'btn'} onClick={() => setKind(null)}>{c ? c.ok : ''}</AppButton></div>
    </AppModal>
  </div>;
}
function DeleteAppointmentDemo() { const [open, setOpen] = useState(false); return <><AppButton className="btn" onClick={() => setOpen(true)}>Mở hộp Xóa lịch hẹn</AppButton><DeleteAppointmentDialog open={open} code="LH-2026-0914" onClose={() => setOpen(false)} onConfirm={() => setOpen(false)} /></>; }
function CancelAppointmentDemo() {
  const [open, setOpen] = useState(false); const rec = appointmentsOnce().slice(0, 1);
  return <><AppButton className="btn" onClick={() => setOpen(true)}>Mở hộp Hủy lịch hẹn</AppButton>
    <CancelAppointmentDialog open={open} onClose={() => setOpen(false)} onConfirm={() => setOpen(false)} records={open ? rec : []} /></>;
}
function RelativeDemo() {
  const [open, setOpen] = useState(false);
  const relative = { fullName: 'Nguyễn Văn An', relationship: 'Bố', citizenId: '001080012345', birthDate: '1975-05-20', phone: '0912345678', address: 'Hà Nội' };
  return <><AppButton className="btn" onClick={() => setOpen(true)}>Mở hộp Thông tin thân nhân</AppButton>
    <AppModal id="sdRelative" open={open} onClose={() => setOpen(false)} labelledBy="sdRelTitle"><div className="dlg-h"><h3 id="sdRelTitle" className="dlg-t">Thông tin thân nhân</h3><DialogCloseButton onClick={() => setOpen(false)} /></div>
      <div className="dlg-b"><RelativeDetailBody relative={relative} /></div><div className="dlg-f"><AppButton className="btn" onClick={() => setOpen(false)}>Quay lại</AppButton></div></AppModal></>;
}
/* mẫu có 2 tệp đính kèm để thấy màn Xem chi tiết hiện tên tệp là link tải về (AttachmentView) */
const EXEMPTION_SAMPLE = { visitorName: 'Trần Thị Bình', visitorCitizenId: '001185054321', visitorPhone: '0987654321', studentName: 'Trần Văn Cường', studentCode: 'HV-0123', relationship: 'Mẹ', companions: [], exemptionReason: 'Thân nhân ở xa, chưa có sổ thăm gặp, xin gặp 1 lần trước kỳ nghỉ lễ', attachments: [{ name: 'Don-xin-gap.pdf', size: 245760 }, { name: 'CCCD-mat-truoc.jpg', size: 1887437 }] };
const CHECKS_SAMPLE = [{ fullName: 'Trần Thị Bình', isRegistrant: true, result: 'Khớp', at: '10/10/2026 08:15', by: 'Nguyễn Thùy Trang' }, { fullName: 'Trần Văn Dũng', isRegistrant: false, result: 'Khớp', at: '10/10/2026 08:16', by: 'Nguyễn Thùy Trang' }];
/* lưới lịch theo buồng: chính TableCalendar mà Lịch theo buồng (WEB-06), Tạo lịch hẹn, Đăng ký tại quầy dùng — dữ liệu mẫu tự khai: 2 ca, 1 suất riêng, 3 lịch */
const M = (t) => { const [h, m] = t.split(':'); return +h * 60 + +m; };
const CAL_SHIFTS = [{ name: 'Ca sáng', open: M('07:30'), close: M('11:00') }, { name: 'Ca chiều', open: M('13:30'), close: M('16:30') }];
const CAL_ROWS = [
  { code: 'Q01-01', label: 'Q01-01 — Buồng số 1', group: 'Q01 — Quầy tiếp đón chính', shifts: CAL_SHIFTS, gap: 5, reserved: [[M('08:00'), M('09:00')]] },
  { code: 'Q01-02', label: 'Q01-02 — Buồng số 2', group: 'Q01 — Quầy tiếp đón chính', shifts: CAL_SHIFTS, gap: 5, reserved: [] },
];
const calItem = (code, tableCode, start, duration, cls, title, line, status) => ({ key: code, code, tableCode, start: M(start), duration, variant: 'record', blockClass: 'tag-' + cls, movable: true, resizable: true, hint: code + ' · ' + start, content: { title, line, status, statusClass: 'tag-' + cls } });
function CalendarDemo() {
  const [items, setItems] = useState([
    calItem('LH-0101', 'Q01-01', '09:15', 45, 'approved', 'Trần Văn Cường', 'Trần Thị Bình', 'Đã duyệt'),
    calItem('LH-0102', 'Q01-02', '07:45', 30, 'pending-approval', 'Lê Văn Đức', 'Lê Thị Hoa', 'Chờ duyệt'),
    calItem('LH-0103', 'Q01-02', '14:00', 45, 'checked-in', 'Phạm Văn Em', 'Phạm Thị Gấm', 'Đã đến'),
  ]);
  return <div className="sd-col-wide"><TableCalendar rows={CAL_ROWS} items={items} cornerLabel="Buồng thăm gặp" minDuration={10} maxDuration={45} maxHeight={260}
    validate={() => ''} onMove={(item, t) => setItems((xs) => xs.map((x) => (x.key === item.key ? { ...x, tableCode: t.tableCode, start: t.start, duration: t.duration || x.duration } : x)))} onInvalidDrop={(reason) => toast(reason)} />
    <div className="sd-muted">Kéo khối để đổi giờ hoặc buồng, kéo mép phải để đổi thời lượng (10–45 phút). Vùng gạch là suất riêng 08:00–09:00 của Buồng số 1</div></div>;
}
/* nguồn AppointmentForm.jsx: stepClass = 'card' + (bước khác bước đang mở ? ' is-hidden-block' : '') · khối theo luồng thêm ' is-hidden' khi không thuộc luồng đang chọn */
function StepperDemo() {
  const [step, setStep] = useState(2); const steps = ['Thông tin quầy', 'Buồng thăm gặp', 'Suất riêng']; const [extra, setExtra] = useState(false);
  return <div className="sd-col-wide"><div className="stepper">{steps.map((name, i) => <span key={name} style={{ display: 'contents' }}>{i > 0 && <div className="step-line" />}
    <div className={'step' + (i + 1 === step ? ' is-current' : '') + (i + 1 < step ? ' is-done' : '')} onClick={() => setStep(i + 1)} style={{ cursor: 'pointer' }}><span className="step-number">{i + 1 < step ? '✓' : String(i + 1)}</span><span className="step-title">{name}</span></div></span>)}</div>
    {steps.map((name, i) => <div key={name} className={'card sd-inline-card' + (i + 1 !== step ? ' is-hidden-block' : '')}><h2 className="card-title">{'Bước ' + (i + 1) + ' — ' + name}</h2><p className="sd-muted">Khối của bước {i + 1} — bước khác bị ẩn bằng lớp is-hidden-block</p></div>)}
    <div className={'card sd-inline-card' + (extra ? '' : ' is-hidden')}><h2 className="card-title">Khối theo luồng</h2><p className="sd-muted">Chỉ hiện khi chọn luồng tương ứng — ẩn bằng lớp is-hidden</p></div>
    <label className="chk"><input type="checkbox" checked={extra} onChange={(e) => setExtra(e.target.checked)} /> Chọn luồng có khối riêng</label>
    <div className="sd-muted">Bấm vào bước để xem trạng thái đã xong · đang làm · chưa tới, và khối của bước đó</div></div>;
}
/* icon nút trang và form — lấy đúng icon Prototype đang dùng (nút trang và form có icon + chữ, nút popup giữ chữ trần) */
const BTN_ICON = {
  save: '<polyline points="20 6 9 17 4 12"/>',   /* ReceptionDeskForm ICON_SAVE · AppointmentForm ICON_CHECK */
  draft: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',   /* AppointmentForm ICON_DRAFT */
  cancel: '<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>',   /* AppointmentList hl_huy */
  create: '<path d="M12 5v14M5 12h14"/>',   /* AppointmentList · ReceptionDeskList Tạo mới */
  excel: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',   /* AppointmentList · ReceptionDeskList Xuất Excel */
  remove: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',   /* AppointmentDetail Xóa */
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',   /* CounterRegistration/blocks.jsx Đăng ký (form-btn-warning) */
};
/* 1 cặp «nút chạy thật + code của chính nút đó» cho khối Cách dùng */
const btnPair = (label, cls, text, icon, extra = {}) => ({
  label, ...extra,
  preview: () => (icon ? <AppButtonWithIcon className={cls} iconRaw={BTN_ICON[icon]} disabled={extra.disabled} loading={extra.loading}>{text}</AppButtonWithIcon> : <AppButton className={cls}>{text}</AppButton>),
  code: icon ? '<AppButtonWithIcon className="' + cls + '" iconRaw={…}' + (extra.disabled ? ' disabled' : '') + (extra.loading ? ' loading' : '') + '>' + text + '</AppButtonWithIcon>' : '<AppButton className="' + cls + '">' + text + '</AppButton>',
});
const ACTIONS = [
  { id: 'sdBack', label: 'Hủy', className: 'form-btn', left: true, iconRaw: BTN_ICON.cancel },
  { id: 'sdDraft', label: 'Lưu nháp', className: 'form-btn', iconRaw: BTN_ICON.draft },
  { id: 'sdSave', label: 'Lưu và kích hoạt', className: 'form-btn form-btn-primary', iconRaw: BTN_ICON.save },
];
function PageHeadDemo() {
  return <div className="page-head"><AppButtonWithIcon className="page-head-back" title="Quay lại danh sách" aria-label="Quay lại" iconRaw={'<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>'} />
    <div className="page-head-text"><h1 className="page-head-row">Chỉnh sửa quầy tiếp đón Q01<CatalogStatusTag status="ACTIVE" label="Hoạt động" /></h1></div>
    <PageHeadActions actions={ACTIONS} /></div>;
}
/* form nhiều bước — thanh Quay lại / Tiếp tục ở cuối nội dung bước */
function StepNavDemo() {
  return <StepNav actions={[{ id: 'sdStepBack', label: 'Quay lại bước trước', left: true, iconRaw: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>' }, { id: 'sdStepNext', label: 'Tiếp tục', className: 'form-btn form-btn-primary', iconRaw: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>' }]} />;
}
function ListHeadDemo() {
  return <div className="shell-head"><div className="shell-title"><Svg name="desk" /><div className="shell-text"><h1>Cài đặt quầy tiếp đón</h1></div></div>
    <div className="head-actions"><AppButtonWithIcon className="btn" iconRaw={'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>'} iconLinecap={null} iconLinejoin={null}>Xuất Excel</AppButtonWithIcon>
      <AppButtonWithIcon className="btn btn-primary" iconRaw={'<path d="M12 5v14M5 12h14"/>'} iconLinecap={null} iconLinejoin={null}>Tạo mới</AppButtonWithIcon></div></div>;
}

/* ── minh hoạ tư duy dựng màn ── */
/* Nút icon trong bảng theo LOẠI thao tác: gộp 2 bảng hằng thật (Lịch hẹn: ROW_ACTIONS · ACTION_COLOR · ACTION_ICON · LIST_ICONS — Quầy: ACTION_CONFIG · COUNTER_ICONS).
 Cùng mã thao tác ở 2 màn mà tooltip khác nhau (Xóa lịch hẹn · Xóa quầy tiếp đón) ⇒ ghi «Xóa {đối tượng}» theo */
function IconActionList() {
  const items = [];
  const add = (key, label, className, icon, iconRaw) => {
    const had = items.find((x) => x.key === key);
    if (!had) { items.push({ key, label, className, icon, iconRaw }); return; }
    if (had.label !== label) { const a = had.label.split(' '), b = label.split(' '); let n = 0; while (n < a.length && a[n] === b[n]) n++; had.label = a.slice(0, n).join(' ') + ' {đối tượng}'; }
  };
  Object.keys(ROW_ACTIONS).forEach((a) => add(a, ROW_ACTIONS[a].label, 'ib ib-' + (ACTION_COLOR[a] || 'neutral') + (ROW_ACTIONS[a].danger ? ' dg' : ''), LIST_ICONS[a] ? undefined : ACTION_ICON[a], LIST_ICONS[a]));
  Object.keys(ACTION_CONFIG).forEach((a) => add(a, ACTION_CONFIG[a].label, 'ib ib-' + ACTION_CONFIG[a].tone + (ACTION_CONFIG[a].danger ? ' dg' : ''), undefined, COUNTER_ICONS[a]));
  return <div className="sd-act-list">{items.map((x) => <div key={x.key} className="sd-act-item"><AppButtonWithIcon className={x.className} title={x.label} icon={x.icon} iconRaw={x.iconRaw} /><span>{x.label}</span></div>)}</div>;
}
const Field = ({ span, label, required, children, error }) => <div className={'field span-' + span}><label className="field-label">{label}{required ? <span className="required-mark">*</span> : null}</label>{children || <input className="text-input" placeholder={'Nhập ' + label.toLowerCase()} />}{error ? <div className="field-error on">{error}</div> : null}</div>;
function GridDemo() {
  return <div className="sd-col-wide">
    <div className="sd-grid-legend">Lưới <b>12 cột</b> (<code>.form-grid</code>) — mỗi ô là <code>.field span-N</code>. Nhãn màu xanh nhạt là số cột ô đang chiếm.</div>
    {[[[3, 'Mã quầy', true], [9, 'Tên quầy', true]], [[4, 'Loại hình', true], [4, 'Dãy nhà', false], [4, 'Quầy tiếp đón', false]], [[6, 'Số điện thoại', false], [6, 'Email', false]], [[3, 'Từ giờ', false], [3, 'Đến giờ', false], [3, 'Số chỗ', false], [3, 'Vách ngăn', false]], [[12, 'Ghi chú', false]]].map((row, i) => <div className="form-grid sd-grid-show" key={i}>{row.map(([span, label, req]) => <Field key={label} span={span} label={label + ' · span ' + span} required={req} />)}</div>)}
  </div>;
}
function BlocksDemo() {
  return <div className="sd-col-wide">
    <div className="card"><h2 className="card-title">Thông tin chung</h2><div className="form-grid"><Field span={3} label="Mã quầy" required /><Field span={9} label="Tên quầy" required /><Field span={12} label="Ghi chú" /></div></div>
    <div className="card"><h2 className="card-title">Phạm vi phục vụ</h2><div className="form-grid"><Field span={6} label="Dãy nhà phục vụ" required /><Field span={6} label="Số buồng tối đa" /></div></div>
    <PageFooter actions={ACTIONS} />
  </div>;
}
function FieldStatesDemo() {
  return <div className="form-grid">
    <Field span={4} label="Ô thường" />
    <Field span={4} label="Ô bắt buộc" required />
    <Field span={4} label="Ô có lỗi" required error={msg('E001-01', 'mã quầy')}><input className="text-input input-border-error" placeholder="Nhập mã quầy" /></Field>
    <Field span={4} label="Ô khoá (chỉ xem)"><input className="text-input" aria-label="Ô khoá (chỉ xem)" value="Q01" disabled readOnly /></Field>
    <Field span={4} label="Ô có gợi ý"><input className="text-input" placeholder="Nhập số điện thoại" /><div className="field-hint">Số nội bộ của quầy, 10 chữ số</div></Field>
  </div>;
}

/* ── danh mục ── */
export const GROUPS = [
  { id: 'mindset', name: 'Tư duy dựng màn', items: [
    { id: 'grid', name: 'Lưới 12 cột và căn chỉnh ô', aliases: 'grid lưới span căn chỉnh bố cục 4 4 4 3 9 6 6', rules: ['UX-B1', 'UX-B6'], demo: () => <GridDemo />,
      code: '<div className="form-grid">\n  <div className="field span-3">…Mã</div><div className="field span-9">…Tên</div>   // mã ngắn đi cặp tên dài\n</div>  // hàng 3 ô: 4-4-4 · 2 ô: 6-6 · 4 ô: 3-3-3-3' },
    { id: 'blocks', name: 'Chia khối fields theo nhóm thông tin', aliases: 'card khối nhóm fields chia khối tiêu đề khối', harvest: 'Tiêu đề khối', rules: ['UX-B8', 'UX-B9'], demo: () => <BlocksDemo />,
      code: '<div className="card"><h2 className="card-title">Thông tin chung</h2><div className="form-grid">…</div></div>\n<div className="card"><h2 className="card-title">Phạm vi phục vụ</h2>…</div>\n<PageFooter actions={actions} />' },
    { id: 'field-states', name: 'Trạng thái ô nhập: thường · bắt buộc · lỗi · khoá · gợi ý', aliases: 'required bắt buộc lỗi khoá disabled gợi ý hint', rules: ['UX-L11'], demo: () => <FieldStatesDemo />,
      code: '<label className="field-label">Mã quầy<span className="required-mark">*</span></label>\n<input className="text-input input-border-error" /> <div className="field-error on">{msg(\'E001-01\', \'mã quầy\')}</div>' },
    { id: 'list-head', name: 'Đầu màn Danh sách', aliases: 'shell head tiêu đề danh sách xuất excel tạo mới', rules: ['UX-A3', 'UX-G7'], demo: () => <ListHeadDemo />,
      code: '<div className="shell-head"><div className="shell-title"><Svg …/><div className="shell-text"><h1>…</h1></div></div>  // QD-376: không dòng phụ dưới tiêu đề · ô icon 28px bằng dòng tiêu đề<div className="head-actions">Xuất Excel · Tạo mới</div></div>' },
    { id: 'messages', name: 'Câu thông báo gọi theo mã', aliases: 'message msg mã thông báo toast lỗi câu', rules: ['UX-E1'],
      demo: () => <div className="sd-col"><div className="sd-row"><code>msg('E001-01', 'mã quầy')</code><span>⇒</span><b>{msg('E001-01', 'mã quầy')}</b></div><div className="sd-row"><code>msg('I001-03', 'quầy tiếp đón', 'Q01')</code><span>⇒</span><b>{msg('I001-03', 'quầy tiếp đón', 'Q01')}</b></div></div>,
      code: "import { msg, msgParts } from '@/lib/msg'  // ⛔ gõ cứng câu hiển thị (UX-M1) — mã lấy ở PM2_MessageList.md" },
  ] },
  { id: 'screen-blocks', name: 'Khối màn thật', items: [
    { id: 'list-screen', name: 'Khuôn màn Danh sách đầy đủ: chế độ · tab đếm · bộ lọc · bảng · hàng loạt', aliases: 'list danh sách tab số đếm mode lịch theo buồng bộ lọc filter count hàng loạt bulk cột stt thao tác', harvest: 'Thanh thao tác hàng loạt', rules: ['UX-G2', 'UX-G9', 'UX-L16', 'UX-B1'], demo: () => <ListScreenDemo />,
      code: '// nguồn src/pages/AppointmentList/AppointmentList.jsx — gọi thẳng TABS · BULK_DISABLED_TABS · STATUS_CLASS · rowActions · ROW_ACTIONS · ACTION_COLOR · LIST_ICONS · maxActionCount (listLogic)\n.head-actions > .nhom-nut-bang · .mode > .mode-b(.on) · .tabs > .tab-btn(.on .is-empty) > .tab-label(.tab-dot) + .tab-number\n.filter-head > .filter-arrow + .filter-title > .filter-count(.is-inline) · .shell-body.tbl > AppTable(rowSelection)\n5 ô lọc .filter-status · .filter-table · .filter-counter · .filter-source · .filter-route (.filter-body.has-route) · khoảng ngày mặc định hôm nay ⇒ +7 ngày\ntab Tất cả: bảng .is-hidden-selection (không ô tích) · tab Chờ duyệt, Đã duyệt mới có ô tích và nút Hàng loạt\n15 cột: STT · Mã lịch hẹn(+nguồn) · Ngày giờ hẹn · Người cai nghiện(+CCCD, Ngày sinh) · Dãy nhà · Phòng · Thân nhân · Quan hệ · Loại hình · Buồng · Quầy · Số người · Thời lượng · Trạng thái · Thao tác · .table-hint > NoteBox line\n.btn.btn-hl ⇒ AppModal: .bulk-row · .bulk-actions · .bulk-warning(.is-visible .is-soft)' },
    { id: 'lookup', name: 'Tra cứu thân nhân và quẹt thẻ', aliases: 'lookup tra cứu cccd quẹt thẻ scan không tìm thấy thẻ thân nhân relative card', rules: ['UX-L11', 'UX-E1'], demo: () => <LookupDemo />,
      code: '// nguồn AppointmentForm.jsx · FormDialogs.jsx · formActions.js (câu lỗi E001-01 «…của thân nhân», E001-35)\n.lookup > .lookup-field(.is-error) > input.text-input + AppButtonWithIcon.lookup-scan · .input-error(.is-visible) · .form-btn.form-btn-primary\nkết quả: .lookup-not-found (E001-11 + I001-76) | .relative-card > .relative-avatar + .relative-name(.relative-name-link + tag) + .status-note\nhộp Quẹt thẻ: .scan-area > .scan-icon · .scan-title · .scan-desc · .scan-spinner · chân hộp: Hủy' },
    { id: 'student-list', name: 'Chọn người cai nghiện dạng thẻ có quỹ thăm', aliases: 'student card người cai nghiện quỹ thăm quota chọn thẻ', rules: ['UX-B9'], demo: () => <StudentListDemo />,
      code: '// nguồn AppointmentForm.jsx (#khoiNCN)\n.card-title-row > h2.card-title + .card-title-tools > <Pm1SyncBar /> + <VisitConditionsLink />  // mở ra chưa chọn thẻ nào\n.student-list > AppButton.student-card(.is-selected .is-locked) > .student-avatar · .student-body(.student-name .status-note .visit-block-reason) · .student-side > .quota-box(.is-exhausted)' },
    { id: 'schedule-fields', name: 'Ô chỉ đọc · ô ngày có lối tắt · tiêu đề con · nhắc chưa đủ · giá trị khoá', aliases: 'readonly chỉ đọc date row ngày hôm nay quick link form grid title hours empty locked value option group', rules: ['UX-L8', 'UX-L14', 'UX-B9'], demo: () => <ScheduleFieldsDemo />,
      code: '// nguồn AppointmentForm.jsx (bước 2, Nguồn đặt lịch) — 2 khung đầu = trạng thái màn mở ra (chưa chọn ngày: hours-empty I001-74)\nLoại hình thăm gặp* = AppSearchSelect uncontrolled · nút ngày «Chọn ngày hẹn» · .locked-value title «Nguồn đặt lịch của màn này là cố định, không đổi được»\n.select-field.is-readonly > input.text-input[readOnly] · .date-row > AppButtonWithIcon.text-input.date-input(icon calendar, .date-icon) + a.quick-link\n.form-grid-title · .hours-empty > SetupHint inline · .option-group > .locked-value' },
    { id: 'companions', name: 'Bảng nhập nhiều dòng, nút thêm và xoá dòng', aliases: 'people table thân nhân đi cùng thêm dòng xóa dòng form-btn-add form-btn-remove', rules: ['UX-L22', 'UX-L5'], demo: () => <div className="sd-col-wide"><CompanionsDemo /><div className="sd-label">Thẻ kiểm giấy tờ từng người (màn Đăng ký tại quầy) — nút «Bỏ khỏi lượt» hiện khi kết quả không khớp</div><ParticipantDemo /></div>,
      code: '// nguồn AppointmentForm.jsx (khối Thân nhân đi cùng)\nAppTable tableClassName="people-table" · cột Thân nhân đi cùng là AppSearchSelect (chọn từ thân nhân đã liên kết, KHÔNG gõ tay, mỗi dòng bỏ người đã chọn ở dòng khác) · Quan hệ và CCCD là input disabled tự điền theo người được chọn · cột cuối AppButtonWithIcon.form-btn-remove · dưới bảng AppButtonWithIcon.form-btn-add (disabled + title khi đủ MAX_COMPANIONS)' },
    { id: 'route-options', name: 'Chọn luồng dạng thẻ radio', aliases: 'route option radio luồng đăng ký chọn 1', rules: ['UX-L2'], demo: () => <RouteOptionsDemo />,
      code: "// nguồn CounterRegistration/blocks.jsx · dữ liệu ROUTE_OPTIONS (@/data/approvalRoute)\n.route-options[role=radiogroup] > button.route-option(.is-selected) > .route-radio + .route-text(.route-title .route-hint)" },
    { id: 'config-days', name: 'Bảng cấu hình theo ngày có công tắc', aliases: 'vc days cấu hình thời gian theo ngày switch thăm gặp ca sáng ca chiều giờ nghỉ lưu', rules: ['UX-L2'], demo: () => <ConfigDaysDemo />,
      code: '// nguồn VisitConfig.jsx — gọi thẳng WEEKDAYS · defaultDirectConfig (mặc định thăm T4–T6)\nAppTable tableClassName="vc-days" · .vc-switch > antd Switch · Ca sáng/Ca chiều = <TimeRangeInput /> · cột «Giờ nghỉ giữa các ca (phút)» input number · .vc-off «Không thăm gặp»\npageActions chế độ Sửa: { label: \'Lưu\', className: \'form-btn form-btn-primary\', iconRaw: \'<polyline points="20 6 9 17 4 12"/>\' }' },
    { id: 'history', name: 'Bảng lịch sử thao tác', aliases: 'history lịch sử thao tác timeline dòng hoạt động trạng thái trước sau nội dung thay đổi lý do ý kiến ghi chú hệ thống', component: 'HistoryTable', rules: ['UX-G2'], demo: () => <HistoryDemo />,
      code: "import HistoryTable from '@/pages/ReceptionDeskShared/HistoryTable'\n<HistoryTable history={rows} renderStatus={(s) => <AppTag …/>} />  // row: { action, statusBefore, statusAfter, reason, changes, note } · 10 mốc, Xem thêm tải tiếp" },
    { id: 'settings-rows', name: 'Bảng cài đặt có công tắc khoá và cụm nút thao tác', aliases: 'notification settings cài đặt thông báo switch khoá locked acts', rules: ['UX-L5', 'UX-L2'], demo: () => <SettingsRowsDemo />,
      code: '// nguồn NotificationSettings.jsx — gọi thẳng readNotificationSettings · GROUPS · SEND_TYPE_LABELS · timeConditionText\n.card > h2.card-title (tên nhóm) + .ns-table-wrap > AppTable.ns-table · cột Mã 300px · Gửi khi nào 220px\n.ns-switch(.is-locked + data-tip) > antd Switch disabled · cột Thao tác .col-act > .acts > AppButtonWithIcon.ib' },
    { id: 'detail-info', name: 'Thông tin chi tiết dạng nhãn–giá trị, nút nguy hiểm viền', aliases: 'adjust nhãn giá trị chi tiết adjust-tag is-outline xóa hủy viền', rules: ['UX-B8', 'UX-F7'], demo: () => <DetailInfoDemo />,
      code: '// nguồn AppointmentDetail.jsx (pageActions · InfoGrid «Thông tin lịch hẹn»)\n<PageHeadActions actions={[Phê duyệt · Từ chối duyệt · Chỉnh sửa · Xóa · Hủy lịch hẹn]} />  // đúng thứ tự, mỗi nút có icon; màn chỉ hiện nút theo quyền và trạng thái\nXóa · Hủy: className="form-btn form-btn-danger is-outline" · Phê duyệt: form-btn-primary dt-approve\n.adjust > .adjust-label + .adjust-value (InfoTag .adjust-tag + lớp màu danh mục · trống ⇒ «—» màu --color-ink-4)' },
    { id: 'missing-hint', name: 'Nhắc thiếu thông tin trước khi lưu', aliases: 'missing hint nhắc thiếu đủ thông tin is-enough', rules: ['UX-E1'], demo: () => <MissingHintDemo />,
      code: "// nguồn AppointmentForm.jsx (#nhacThieu)\n<div className={'missing-hint' + (đủ ? ' is-enough' : '')}> icon + msg('W001-12', các ô thiếu) | msg('I001-81') </div>" },
    { id: 'counter-tables', name: 'Bảng buồng nhập thẳng trong form Quầy', aliases: 'capacity table buồng thăm gặp nhập trong bảng qb-table', rules: ['UX-L22', 'UX-L11'], demo: () => <CounterTablesDemo />,
      code: '// nguồn ReceptionDeskForm.jsx (tablesCard · #banVung) — CSS riêng ReceptionDeskForm.css\n.capacity-head > h2.card-title + .capacity-spacer + .form-btn «Thêm buồng»\nAppTable tableClassName="capacity-table reserved-table qb-table" · 6 cột: Mã buồng* (AppCounterInput CODE_MAX, khoá sau khi tạo) · Tên hiển thị* (AppCounterInput 100) · Số chỗ ngồi* (1 đến 10) · Có vách ngăn (.chk-dong.qb-ctl) · Trạng thái (CatalogStatusTag) · thao tác (buồng mới ⇒ Xóa buồng · đã dùng ⇒ Vô hiệu hóa ⇄ Kích hoạt)\nô nhập trong bảng đệm 8px (UX-L22)' },
  ] },
  { id: 'input', name: 'Nhập liệu', items: [
    { id: 'text-input', name: 'Ô nhập chữ', aliases: 'text input textbox ô nhập', harvest: 'Ô nhập chữ', alsoHarvest: ['Ô nhập trong bảng'], rules: ['UX-L2', 'UX-L22'],
      demo: () => <div className="form-grid"><Field span={6} label="Mã quầy" required /></div>, code: '<input className="text-input" placeholder="Nhập …" />  // ô có giới hạn ký tự ⇒ AppCounterInput · ô trong bảng nhập liệu đệm 8px (UX-L22)' },
    { id: 'multi-line-text', name: 'Ô nhập nhiều dòng', aliases: 'textarea multiline nhiều dòng ghi chú mô tả lý do nội dung dài', component: 'AppCounterInput', harvest: 'Ô nhập nhiều dòng', rules: ['UX-L7'],
      demo: () => <MultiLineDemo />, code: "<AppCounterInput multiline maxLength={1000} value={v} onChange={(e) => setV(e.target.value)} placeholder=\"Nhập ghi chú\" />   // bộ đếm ở hàng chân dưới ô, lỗi đặt bên trái bộ đếm qua error" },
    { id: 'counter-input', name: 'Ô nhập có bộ đếm ký tự', aliases: 'counter maxlength đếm ký tự', component: 'AppCounterInput', rules: ['UX-L7'],
      demo: () => <CounterDemo />, code: "<AppCounterInput maxLength={100} value={v} onChange={(e) => setV(e.target.value)} />\n<AppCounterInput multiline maxLength={1000} … />" },
    { id: 'search-input', name: 'Ô tìm kiếm', aliases: 'search tìm từ khóa', component: 'AppSearchInput', harvest: 'Ô tìm kiếm', rules: ['UX-L6', 'UX-H1'], demo: () => <SearchDemo />, code: '<AppSearchInput className="filter-cell filter-wide" value={q} onChange={setQ} placeholder="Tìm theo …" />  // bắt buộc lớp filter-cell' },
    { id: 'select', name: 'Ô chọn không tìm', aliases: 'select dropdown chọn số bản ghi', component: 'AppSelect', harvest: 'Ô chọn antd', rules: ['UX-L1', 'UX-L3'], demo: () => <SelectDemo />, code: '<AppSelect width={61} value={v} options={PAGE_SIZE_OPTIONS} showSearch={false} allowClear={false} onChange={setV} />' },
    { id: 'search-select', name: 'Ô chọn có tìm (danh mục Mã — Tên)', aliases: 'lookup search select danh mục mã tên', component: 'AppSearchSelect', harvest: 'Ô chọn có tìm (lookup)', rules: ['UX-L1', 'UX-L10'], demo: () => <SearchSelectDemo />,
      code: "<AppSearchSelect id=\"oDayNha\" value={v} onChange={setV} options={[{ value: 'A', label: 'A — Dãy nhà A' }]} />  // nhãn luôn «Mã — Tên» (UX-L10)" },
    { id: 'filter-dropdown', name: 'Ô chọn của bộ lọc', aliases: 'filter dropdown lọc trạng thái', component: 'AppFilterDropdown', harvest: 'Ô chọn của bộ lọc', rules: ['UX-B1'], demo: () => <FilterDropdownDemo />,
      code: '<AppFilterDropdown id="TrangThai" placeholder="Tất cả trạng thái" items={[…]} value={v} open={open} onOpen={…} onPick={…} onClear={…} />' },
    { id: 'date', name: 'Ô khoảng ngày', aliases: 'date picker ngày khoảng ngày lịch', harvest: 'Ô ngày / khoảng ngày', rules: ['UX-L8'], demo: () => <DateRangeDemo />,
      code: "import { DateRange } from '@/pages/AppointmentList/widgets'\n<DateRange dateFrom={from} dateTo={to} onChange={(f, t) => …} onClear={…} />" },
    { id: 'time-range', name: 'Ô khoảng giờ', aliases: 'time range giờ ca sáng ca chiều', component: 'TimeRangeInput', harvest: 'Ô khoảng giờ', rules: ['UX-L8'], demo: () => <TimeRangeDemo />, code: '<TimeRangeInput from={f} to={t} idPrefix="ca1" onChange={(edge, value) => …} />' },
    { id: 'date-time', name: 'Ô chọn ngày giờ', aliases: 'date time datetime ngày giờ thời điểm lịch giờ phút bây giờ', component: 'DateTimeInput', rules: ['UX-L8'], demo: () => <DateTimeDemo />,
      code: "import DateTimeInput from '@/components/app/DateTimeInput'\n<DateTimeInput id=\"thoiDiem\" label=\"Thời điểm hẹn\" value={v} onChange={setV} />   // giá trị dd/MM/yyyy HH:mm · minuteStep mặc định 5" },
    { id: 'checkbox', name: 'Ô tích', aliases: 'checkbox tick chọn', harvest: 'Ô tích', rules: ['UX-L2', 'UX-L19'], demo: () => <CheckboxDemo />, code: '<label className="chk"><input type="checkbox" /> Nhãn</label>' },
    { id: 'switch', name: 'Công tắc Bật/Tắt', aliases: 'switch toggle bật tắt', harvest: 'Công tắc', rules: ['UX-L2'], demo: () => <SwitchDemo />, code: "import { Switch } from 'antd'\n<Switch checked={on} onChange={setOn} aria-label=\"…\" />" },
    { id: 'attachment', name: 'Tài liệu đính kèm', aliases: 'upload file đính kèm tệp', component: 'AttachmentField', rules: ['DATA-02'], demo: () => <AttachmentDemo />, code: '<AttachmentField id="oTaiLieu" value={files} onChange={setFiles} />  // mỗi tệp ≤ 10MB' },
    { id: 'notify-recipients', name: 'Người nhận thông báo', aliases: 'notify recipients người nhận', component: 'NotifyRecipientsField', rules: ['QD-370'], demo: () => <NotifyDemo />,
      code: '<NotifyRecipientsField id="…" code="APPOINTMENT_CANCELLED" records={[record]} value={v} onChange={setV} />' },
    { id: 'exemption', name: 'Khối đơn xin Trưởng cơ sở duyệt', aliases: 'exemption đơn ngoại lệ lý do xin duyệt', components: ['ExemptionFields', 'ExemptionInfo'], rules: ['QD-342', 'QD-358'],
      demo: () => <div className="sd-col-wide"><ExemptionInfoGrid id="sdExempt" rows={exemptionRows(EXEMPTION_SAMPLE)} /><DocumentCheckTable id="sdChecks" checks={CHECKS_SAMPLE} /></div>,
      code: '<ExemptionFields e={draft} set={setDraft} err={errors} />   // nhập (Đăng ký tại quầy)\n<ExemptionInfoGrid rows={exemptionRows(info)} /> · <DocumentCheckTable checks={…} />   // xem (Chi tiết)' },
    { id: 'radio-group', name: 'Nhóm radio (chọn 1 trong vài giá trị)', aliases: 'radio chọn một radiogroup lựa chọn', components: ['AppRadioGroup'], rules: ['UX-L1','UX-L2'], demo: () => <RadioGroupDemo />, code: "<AppRadioGroup name=\"hinhThuc\" label=\"Hình thức\" value={v} onChange={setV} options={[{ value, label }]} />  // 2–5 lựa chọn; nhiều hơn thì dùng Ô chọn" },
    { id: 'checkbox-group', name: 'Nhóm ô tích (chọn nhiều)', aliases: 'checkbox group nhiều lựa chọn ngày trong tuần', components: ['AppCheckboxGroup'], rules: ['UX-L1','UX-L2'], demo: () => <CheckboxGroupDemo />, code: "<AppCheckboxGroup label=\"Ngày thăm\" value={arr} onChange={setArr} options={[{ value, label }]} />" },
    { id: 'number-input', name: 'Ô số có nút tăng giảm', aliases: 'number số lượng tăng giảm stepper inputnumber', components: ['AppNumberInput'], rules: ['UX-L1','UX-L2'], demo: () => <NumberInputDemo />, code: "<AppNumberInput label=\"Số người đi cùng\" value={n} onChange={setN} min={0} max={5} />  // rời ô thì kẹp về min..max" },
    { id: 'tree-select', name: 'Ô chọn theo cây', aliases: 'tree select chọn theo cây đơn vị phòng ban phân cấp', components: ['AppTreeSelect'], rules: ['QD-401', 'UX-L10'], demo: () => <TreeSelectDemo />,
      code: "<AppTreeSelect treeData={[{ value, title: 'Mã — Tên', children }]} value={v} onChange={setV} placeholder=\"Chọn …\" />  // multiple: chọn nhiều nhánh" },
    { id: 'multi-select', name: 'Ô chọn nhiều', aliases: 'multi select chọn nhiều tag +N nhiều giá trị', components: ['AppSelect'], rules: ['QD-401', 'UX-L10'], demo: () => <MultiSelectDemo />,
      code: "<AppSelect mode=\"multiple\" value={arr} onChange={setArr} options={[{ value, label: 'Mã — Tên' }]} maxTagCount={3} />  // quá 3 tag gom «+N»" },
  ] },
  { id: 'button', name: 'Nút và thao tác', items: [
    { id: 'buttons', name: 'Nút chính, nút phụ, nút nguy hiểm', aliases: 'button nút primary lưu hủy xóa', component: 'AppButton', harvest: 'Nút chính', alsoHarvest: ['Nút phụ', 'Nút nguy hiểm'], rules: ['UX-L2', 'UX-F7', 'UX-L22'],
      demo: () => <div className="sd-col"><div className="sd-row"><AppButtonWithIcon className="form-btn form-btn-primary" iconRaw={BTN_ICON.save}>Lưu và kích hoạt</AppButtonWithIcon><AppButtonWithIcon className="form-btn" iconRaw={BTN_ICON.draft}>Lưu nháp</AppButtonWithIcon><AppButtonWithIcon className="form-btn" iconRaw={BTN_ICON.cancel}>Hủy</AppButtonWithIcon><AppButtonWithIcon className="form-btn form-btn-primary" iconRaw={BTN_ICON.save} disabled>Đang khoá</AppButtonWithIcon></div>
        <div className="sd-row"><AppButtonWithIcon className="btn btn-primary" iconRaw={BTN_ICON.create}>Tạo mới</AppButtonWithIcon><AppButtonWithIcon className="btn" iconRaw={BTN_ICON.excel}>Xuất Excel</AppButtonWithIcon><AppButtonWithIcon className="btn btn-danger-ghost" iconRaw={BTN_ICON.remove}>Xóa đã chọn</AppButtonWithIcon></div>
        <div className="sd-row"><AppButtonWithIcon className="form-btn form-btn-warning" iconRaw={BTN_ICON.clock}>Đăng ký</AppButtonWithIcon><span className="sd-muted">Lối phụ màu cam cạnh nút chính ở màn Đăng ký tại quầy</span></div>
        <div className="sd-row"><AppButtonWithIcon className="form-btn form-btn-primary" iconRaw={BTN_ICON.save} loading>Lưu và kích hoạt</AppButtonWithIcon><AppButtonWithIcon className="form-btn" iconRaw={BTN_ICON.draft} loading>Lưu nháp</AppButtonWithIcon><span className="sd-muted">Đang xử lý (loading): vòng xoay thế chỗ icon, giữ nguyên chữ, khoá bấm tới khi xong</span></div></div>,
      code: [
        { note: 'Nút trang và form LUÔN có icon + chữ (QD-389).' },
        btnPair('Nút chính', 'form-btn form-btn-primary', 'Lưu và kích hoạt', 'save', { group: 'Form' }),
        btnPair('Nút phụ', 'form-btn', 'Lưu nháp', 'draft', { group: 'Form' }),
        btnPair('Nút chính đang khoá', 'form-btn form-btn-primary', 'Đang khoá', 'save', { group: 'Form', disabled: true }),
        btnPair('Nút chính đang xử lý (loading)', 'form-btn form-btn-primary', 'Lưu và kích hoạt', 'save', { group: 'Form', loading: true }),
        btnPair('Lối phụ cam (Đăng ký tại quầy)', 'form-btn form-btn-warning', 'Đăng ký', 'clock', { group: 'Form' }),
        btnPair('Nút chính', 'btn btn-primary', 'Tạo mới', 'create', { group: 'Danh sách' }),
        btnPair('Nút phụ', 'btn', 'Xuất Excel', 'excel', { group: 'Danh sách' }),
        /* phá hủy TRÊN TRANG là viền đỏ, đỏ đặc CHỈ trong hộp thoại — sửa 15/10/2026 sau khi hỏi "Sao có 2 xóa, 1 đỏ đặc 1 viền đỏ" */
        btnPair('Xóa trên trang: viền đỏ', 'btn btn-danger-ghost', 'Xóa đã chọn', 'remove', { group: 'Danh sách' }),
        btnPair('Nút trong popup giữ chữ trần (khuôn MSG-CF)', 'form-btn', 'Hủy', null, { group: 'Popup' }),
        btnPair('Xác nhận phá hủy trong hộp thoại: đỏ đặc', 'btn btn-danger', 'Xóa', null, { group: 'Popup' }),
      ] },
    { id: 'button-colors', name: 'Màu nút chữ theo vai trò', aliases: 'màu nút button color vai trò đỏ xanh cam xanh lá viền đỏ danger warning success ghost hl hàng loạt', rules: ['UX-L27', 'QD-244', 'QD-390'],
      demo: () => <div className="sd-col">
        <div className="sd-row"><AppButtonWithIcon className="form-btn" iconRaw={BTN_ICON.draft}>Lưu nháp</AppButtonWithIcon><span className="sd-muted">Phụ: nền trắng, viền xám, rê chuột viền và chữ xanh</span></div>
        <div className="sd-row"><AppButtonWithIcon className="form-btn form-btn-primary" iconRaw={BTN_ICON.save}>Lưu</AppButtonWithIcon><span className="sd-muted">Chính: xanh thương hiệu, mỗi khu vực 1 nút</span></div>
        <div className="sd-row"><AppButton className="form-btn form-btn-danger">Xác nhận hủy lịch hẹn</AppButton><span className="sd-muted">Đỏ đặc: CHỈ nút xác nhận phá hủy trong hộp thoại</span></div>
        <div className="sd-row"><AppButtonWithIcon className="form-btn form-btn-danger is-outline" iconRaw={BTN_ICON.remove}>Xóa</AppButtonWithIcon><AppButtonWithIcon className="btn btn-danger-ghost" iconRaw={BTN_ICON.remove}>Xóa đã chọn</AppButtonWithIcon><span className="sd-muted">Viền đỏ: phá hủy đặt trên trang (Chi tiết lịch hẹn · Danh sách thông báo)</span></div>
        <div className="sd-row"><AppButtonWithIcon className="form-btn form-btn-warning" iconRaw={BTN_ICON.clock}>Đăng ký</AppButtonWithIcon><span className="sd-muted">Cam: lối phụ cạnh nút chính (Đăng ký tại quầy)</span></div>
        <div className="sd-row"><AppButton className="form-btn form-btn-success">Khớp</AppButton><span className="sd-muted">Xanh lá: kết quả chấm Khớp ở khu đối chiếu giấy tờ</span></div>
        <div className="sd-row"><AppButtonWithIcon className="btn btn-hl" iconRaw={BTN_ICON.save}>Hàng loạt</AppButtonWithIcon><span className="sd-muted">Viền xanh nền nhạt: thao tác hàng loạt khi đã chọn dòng</span></div></div>,
      code: [
        { note: 'Màu nút khai DUY NHẤT ở styles/base.css khối «MÀU NÚT CHỮ», CSS riêng màn KHÔNG khai lại màu nút (UX-L27).' },
        btnPair('Phụ: nền #fff, viền #D9D9D9, chữ 88% đen', 'form-btn', 'Lưu nháp', 'draft'),
        btnPair('Chính: var(--color-brand), mỗi khu vực 1 nút', 'form-btn form-btn-primary', 'Lưu', 'save'),
        btnPair('Đỏ đặc var(--color-danger): CHỈ nút xác nhận phá hủy trong hộp thoại', 'form-btn form-btn-danger', 'Xác nhận hủy lịch hẹn', null),
        btnPair('Viền đỏ: phá hủy đặt trên trang, form (QD-244)', 'form-btn form-btn-danger is-outline', 'Xóa', 'remove'),
        btnPair('Viền đỏ: phá hủy đặt trên trang, danh sách (QD-244)', 'btn btn-danger-ghost', 'Xóa đã chọn', 'remove'),
        btnPair('Cam var(--color-accent): lối phụ cạnh nút chính', 'form-btn form-btn-warning', 'Đăng ký', 'clock'),
        btnPair('Xanh lá #059669: kết quả chấm Khớp', 'form-btn form-btn-success', 'Khớp', null),
        btnPair('Viền xanh nền var(--color-brand-weak): thao tác hàng loạt', 'btn btn-hl', 'Hàng loạt', 'save'),
      ] },
    { id: 'icon-buttons', name: 'Nút icon trong bảng', aliases: 'icon button ib sửa xóa vô hiệu hóa kích hoạt', component: 'AppButtonWithIcon', harvest: 'Nút icon trong bảng', rules: ['UX-L5'],
      /* Mỗi dòng 1 LOẠI nút, gộp trùng giữa 2 màn thật
 (AppointmentList · ReceptionDeskList), gọi thẳng bảng hằng của màn ⇒ màn thêm thao tác là mẫu tự đủ */
      demo: () => <IconActionList />,
      code: '<AppButtonWithIcon className={\'ib ib-\' + tone + (danger ? \' dg\' : \'\')} title={label} icon={…} iconRaw={…} />\nLịch hẹn: ROW_ACTIONS · ACTION_COLOR · ACTION_ICON · LIST_ICONS (listLogic.js) — Xem · Chỉnh sửa · Phê duyệt · Từ chối duyệt · Điều chỉnh · Hủy · Vắng mặt · Xóa\nQuầy: ACTION_CONFIG · COUNTER_ICONS (ReceptionDeskShared/config.js) — Xem · Chỉnh sửa · Kích hoạt · Vô hiệu hóa · Xóa\nLuôn có title (tooltip) · thao tác nguy hiểm thêm lớp dg' },
    { id: 'page-actions', name: 'Thanh nút đầu màn (ghim khi cuộn)', aliases: 'page actions nút đầu trang ghim sticky pin chân trang footer', component: 'PageActions', harvest: 'Thanh nút đầu trang', rules: ['UX-L9'],
      demo: () => <div className="sd-col-wide"><div className="sd-muted">1 thanh nút duy nhất ở đầu màn, ghim mép trên khi cuộn — chính trang bạn đang xem cũng dùng khung này: cuộn xuống, đầu trang đứng yên</div><PageHeadActions actions={ACTIONS.map((x) => ({ ...x, id: x.id + 'Ghim' }))} /></div>,
      code: 'const actions = [{ id, label, className, left? }]\n<div className="page-head">…<PageHeadActions actions={actions} /></div>  // id gốc nằm ở đầu màn (engine, E2E tra theo id)\n// ghim: base.css — main thôi cuộn, .shell tự cuộn, .page-head / .shell-head / .status-bar sticky top 0 (QD-393, UX-L9)\n// ⛔ thanh chân: PageFooter không vẽ' },
    { id: 'button-gap', name: 'Khoảng cách giữa các nút', aliases: 'gap khoảng cách nút button spacing 8px btn-gap', rules: ['QD-384'],
      demo: () => <div className="sd-col"><div className="nhom-nut-bang"><AppButtonWithIcon className="btn" iconRaw={BTN_ICON.excel}>Xuất Excel</AppButtonWithIcon><AppButtonWithIcon className="btn btn-primary" iconRaw={BTN_ICON.create}>Tạo mới</AppButtonWithIcon></div>
        <div className="page-head-actions"><AppButtonWithIcon className="form-btn" iconRaw={BTN_ICON.draft}>Lưu nháp</AppButtonWithIcon><AppButtonWithIcon className="form-btn" iconRaw={BTN_ICON.save}>Lưu và gửi duyệt</AppButtonWithIcon><AppButtonWithIcon className="form-btn form-btn-primary" iconRaw={BTN_ICON.save}>Tiếp tục</AppButtonWithIcon></div></div>,
      code: '/* tokens.css */ --btn-gap: 8px;\n/* mọi khối nút: .nhom-nut-bang · .head-actions · .page-head-actions · .form-footer · .person-actions · .bulk-actions */ gap: var(--btn-gap);' },
    { id: 'back', name: 'Đầu màn Tạo / Sửa / Chi tiết (nút quay lại)', aliases: 'back quay lại page head tiêu đề màn sửa', harvest: 'Nút quay lại', alsoHarvest: ['Tiêu đề trang'], rules: ['UX-L9', 'UX-A3'], demo: () => <><PageHeadDemo /><StepNavDemo /></>,
      code: '<div className="page-head"><AppButtonWithIcon className="page-head-back" …/><div className="page-head-text"><h1 className="page-head-row">Tiêu đề<CatalogStatusTag …/></h1></div><PageHeadActions actions={actions} /></div>' },
    { id: 'segmented', name: 'Nút chuyển dạng phân đoạn (chế độ xem)', aliases: 'segmented chế độ xem danh sách lịch mode toggle', components: ['AppSegmented'], rules: ['UX-L2'], demo: () => <SegmentedDemo />, code: "<AppSegmented value={k} onChange={setK} items={[{ key, label, icon }]} />  // dùng lại khuôn .mode/.mode-b của màn Danh sách lịch hẹn" },
    { id: 'toolbar', name: 'Thanh công cụ', aliases: 'toolbar thanh công cụ nhóm nút', components: ['AppToolbar'], rules: [], demo: () => <ToolbarDemo />, code: "<AppToolbar label=\"Thao tác với danh sách\" groups={[[<nút/>, <nút/>], [<nút/>]]} />  // mũi tên trái phải đi giữa nút" },
  ] },
  { id: 'display', name: 'Hiển thị dữ liệu', items: [
    { id: 'table', name: 'Bảng dữ liệu và dòng rỗng', aliases: 'table bảng danh sách empty dòng rỗng', components: ['AppTable', 'EmptyRow'], harvest: 'Bảng dữ liệu', rules: ['UX-G2', 'UX-G8', 'UX-L20'], demo: () => <TableDemo />,
      code: '<AppTable rowKey="code" columns={cols} dataSource={rows} emptyRow={<EmptyRow colSpan={5} entity="quầy tiếp đón" hasRecords={total > 0} />} />' },
    { id: 'status-tags', name: 'Tag trạng thái', aliases: 'tag status trạng thái nhãn', components: ['CatalogStatusTag', 'AppointmentStatusTag', 'AppTag'], harvest: 'Tag trạng thái', rules: ['UX-L2', 'UX-A3'],
      demo: () => <div className="sd-col"><div className="sd-row"><CatalogStatusTag status="DRAFT" label="Nháp" /><CatalogStatusTag status="ACTIVE" label="Hoạt động" /><CatalogStatusTag status="INACTIVE" label="Vô hiệu hóa" /></div>
        <div className="sd-row">{['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'CHECKED_IN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ABSENT', 'REJECTED'].map((s) => <AppointmentStatusTag key={s} status={s} />)}</div>
        <div className="sd-row"><AppTag className="tag">Tag thường</AppTag></div></div>,
      code: '<CatalogStatusTag status="ACTIVE" label="Hoạt động" />  ·  <AppointmentStatusTag status="APPROVED" />' },
    { id: 'value-tags', name: 'Tag màu theo giá trị (Buồng thăm gặp, Quầy tiếp đón)', aliases: 'tag màu giá trị buồng quầy phân biệt value color', rules: ['QD-385'],
      demo: () => { const ROOMS = ['Q01-01', 'Q01-02', 'Q01-04', 'Q01-05', 'Q02-02', 'Q02-03', 'Q02-04'], DESKS = ['Q01', 'Q02'];
        return <div className="sd-col"><div className="sd-row">{ROOMS.map((c) => <AppTag key={c} className="tag tag-table" style={valueTagStyleOf(c, ROOMS, 'table')}>{c + ' — Buồng số ' + c.slice(-2)}</AppTag>)}</div>
          <div className="sd-row">{DESKS.map((c) => <AppTag key={c} className="tag tag-category" style={valueTagStyleOf(c, DESKS, 'counter')}>{c + ' — Quầy tiếp đón số ' + c.slice(-1)}</AppTag>)}</div></div>; },
      code: 'import { valueTagStyle } from \'@/lib/valueTagColor\';\n<CategoryTag value={tableLabel(r.tableCode)} tagClass="tag-table" style={valueTagStyle(r.tableCode, \'table\')} />  // \'counter\' cho Quầy' },
    { id: 'tooltip-full', name: 'Tooltip cho chữ không hiển thị hết', aliases: 'tooltip chữ bị cắt ellipsis ba chấm +n người data-full xem đủ nội dung', rules: ['QD-383', 'UX-C3'],
      demo: () => <div className="sd-col"><div className="sd-row"><span>Nguyễn Thị Hoa <span className="csub" data-full="Thân nhân đi cùng: Trần Văn Nam, Lê Thị Thu">+2 người</span></span></div>
        <div className="sd-row"><span style={{ display: 'inline-block', maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Sảnh phụ tầng 2 nhà điều hành khu B, cạnh phòng y tế</span></div>
        <div className="sd-row" style={{ overflowWrap: 'anywhere' }}>{truncate('Ghi chú dài hơn 200 ký tự: '.padEnd(230, 'x'))}</div></div>,
      code: 'Chữ cắt bằng CSS (text-overflow: ellipsis, line-clamp) ⇒ cơ chế chung lib/legacyUi.js tự hiện tooltip\nChữ cắt bằng code ⇒ truncate(v) tự gắn data-full\nChữ tóm tắt ⇒ <span data-full="Thân nhân đi cùng: …">+N người</span>' },
    { id: 'tabs', name: 'Thanh tab', aliases: 'tabs tab', component: 'AppTabs', harvest: 'Thanh tab', rules: ['UX-L16', 'UX-L18'], demo: () => <TabsDemo />, code: '<AppTabs activeKey={k} onChange={setK} items={[{ key, id, label, children }]} />  // ⛔ tự viết CSS tab riêng' },
    { id: 'pager', name: 'Phân trang', aliases: 'pagination pager trang', component: 'useListResult', harvest: 'Phân trang', rules: ['UX-G9'], demo: () => <PagerDemo />, code: '// .pager: Trang trước · Tổng số · Trang X/Y · Chọn trang (PageSelect) · Chọn số bản ghi (AppSelect) · Trang sau — nút tắt ở biên, không tooltip (PM1)' },
    { id: 'page-select', name: 'Ô chọn trang trong thanh phân trang', aliases: 'page select chọn trang đến trang số trang combobox', component: 'PageSelect', rules: ['UX-G9', 'UX-L1'], demo: () => <PagerDemo />, code: "import PageSelect from '@/components/app/PageSelect'\n<span className=\"pg-i\">Trang <b>{page + '/' + pageCount}</b></span><span className=\"pg-v\" /><span className=\"pg-i\">Chọn trang</span><PageSelect current={page} total={pageCount} onChange={setPage} />\n// QD-373 D7: chữ giữ như PM1 · ô dùng chung AppSearchSelect (tìm chữ chứa) · danh sách đúng số trang đang có, 1 trang vẫn hiện ô với số 1 · nhảy theo Trang trước/sau, lọc, số bản ghi" },
    { id: 'filter-panel', name: 'Khối bộ lọc danh sách', aliases: 'filter panel bộ lọc tìm kiếm điều kiện', harvest: 'Khối bộ lọc', rules: ['UX-B1'], demo: () => <FilterPanelDemo />,
      code: '// QD-377 (làm thử ở Lịch hẹn) — nguồn src/pages/AppointmentList/AppointmentList.jsx\n<div className="filter-panel is-fixed">\n  <div className="filter-body filter-row-main">  // dòng cố định dàn flex: từ khoá 4 · ngày 3 · Trạng thái 3 · nút rộng vừa chữ\n    <AppSearchInput className="filter-cell filter-wide" …/> <DateRange …/> <div className="filter-cell filter-status">…</div>\n    <div className="filter-more"><AppButtonWithIcon className="btn filter-more-btn" id="nutLoc" aria-expanded …>Tìm kiếm mở rộng</AppButtonWithIcon></div>\n  </div>\n  {mở && <div className="filter-body filter-row-more">…các ô còn lại, mỗi ô 3 cột…</div>}\n</div>' },
    { id: 'table-calendar', name: 'Lưới lịch theo buồng', aliases: 'calendar lịch theo buồng timeline chọn giờ', components: ['TableCalendar', 'TablePicker'], rules: ['QD-357'], demo: () => <CalendarDemo />,
      code: '<TableCalendar rows={tables} items={blocks} … />  ·  TablePicker (mountTablePicker) cho màn Tạo lịch hẹn, Đăng ký tại quầy' },
    { id: 'pm1-sync', name: 'Thanh đồng bộ PM1', aliases: 'sync pm1 đồng bộ', component: 'Pm1SyncBar', rules: ['QD-328'], demo: () => <Pm1SyncBar />, code: '<Pm1SyncBar onSync={reload} />' },
    { id: 'detail-blocks', name: 'Thông tin thân nhân · Tra cứu điều kiện', aliases: 'relative detail visit conditions', components: ['RelativeDetailBody', 'VisitConditions'],
      demo: () => <div className="sd-col-wide"><div className="sd-row"><RelativeDemo /><VisitConditionsLink /></div></div>,
      code: '<RelativeDetailBody relative={r} />  ·  <VisitConditionsLink />' },
    { id: 'avatar', name: 'Avatar chữ cái đầu tên', aliases: 'avatar ảnh đại diện chữ cái tên người', components: ['AppAvatar'], rules: [], demo: () => <AvatarDemo />, code: "<AppAvatar name=\"Nguyễn Thùy Trang\" size=\"md\" />  ·  <AppAvatarGroup names={[…]} max={4} />" },
    { id: 'count-badge', name: 'Số đếm gắn vào phần tử', aliases: 'badge số đếm chưa đọc chấm thông báo', components: ['AppBadge'], rules: ['UX-A16','UX-L26'], demo: () => <BadgeDemo />, code: "<AppBadge count={n}><AppButtonWithIcon …/></AppBadge>  // quá 99 hiện 99+ · nhãn chữ đứng riêng thì dùng tag" },
    { id: 'progress', name: 'Thanh tiến độ', aliases: 'progress tiến độ tỷ lệ quỹ sức chứa', components: ['AppProgress'], rules: [], demo: () => <ProgressDemo />, code: "<AppProgress label=\"Quỹ thăm đã dùng\" value={2} max={4} tone=\"brand|ok|warn\" />" },
    { id: 'divider', name: 'Đường phân cách', aliases: 'divider phân cách kẻ ngang separator', components: ['AppDivider'], rules: [], demo: () => <DividerDemo />, code: "<AppDivider />  ·  <AppDivider label=\"Hoặc\" />  // tách khối lớn thì dùng card riêng" },
    { id: 'accordion', name: 'Khối thu gọn', aliases: 'accordion thu gọn mở rộng câu hỏi thường gặp details', components: ['AppAccordion'], rules: [], demo: () => <AccordionDemo />, code: "<AppAccordion items={[{ key, title, children, open }]} />" },
    { id: 'media-gallery', name: 'Hiển thị ảnh và video', aliases: 'ảnh video bản ghi cuộc gọi gọi video giám sát hình ảnh xem lớn media gallery thumbnail', components: ['AppMediaGallery'], rules: ['QD-400'], demo: () => <MediaDemo />, code: "<AppMediaGallery id=\"mediaXem\" items={[{ key, type: 'image' | 'video', src, poster, title, meta, duration }]} />  // bấm ảnh thu nhỏ ⇒ hộp xem lớn · thiếu tệp ⇒ ô giữ chỗ" },
    { id: 'tree', name: 'Cây thư mục, cây tổ chức', aliases: 'tree cây thư mục cây tổ chức org tree phân cấp nhánh', components: ['AppTree'], rules: ['QD-400'], demo: () => <TreeDemo />, code: "<AppTree treeData={[{ key, title, children }]} defaultExpandedKeys={[…]} onSelect={(key) => …} />  // có đường nối cấp, chọn 1 nút" },
    { id: 'stat-cards', name: 'Thẻ số liệu', aliases: 'stat card thẻ số liệu thống kê tổng quan kpi chỉ số', components: ['AppStatCards'], rules: ['QD-401'], demo: () => <StatCardsDemo />,
      code: "<AppStatCards items={[{ key, label: 'Lịch hẹn trong tuần', value: 1284, delta: '+12 so với tuần trước', tone: 'up' }]} />  // số tự định dạng dấu chấm hàng nghìn" },
    { id: 'scroll-shadow', name: 'Bóng cuộn ngang', aliases: 'scroll shadow bóng cuộn bảng rộng cuộn ngang', components: ['AppScrollShadow'], rules: [], demo: () => <ScrollShadowDemo />, code: "<AppScrollShadow label=\"Bảng …\"><table>…</table></AppScrollShadow>  // bóng hiện ở mép còn nội dung bị che" },
    { id: 'color-swatch', name: 'Ô mẫu màu', aliases: 'color swatch bảng màu token màu', components: ['AppColorSwatch'], rules: [], demo: () => <ColorSwatchDemo />, code: "<AppColorSwatch colors={[{ name: 'Chủ đạo', token: '--color-brand' }]} />  // mã màu đọc từ CSS thật" },
  ] },
  { id: 'feedback', name: 'Phản hồi và thông báo', items: [
    { id: 'notebox', name: 'Khung Lưu ý — xanh và xám', aliases: 'note box lưu ý ghi chú', component: 'NoteBox', harvest: 'Khung Lưu ý nổi bật (xanh)', alsoHarvest: ['Ghi chú phụ (xám)'], rules: ['UX-L13', 'QD-372'],
      demo: () => <div className="sd-col-wide"><NoteBox id="sdNote2" items={['Đối với các ngày được bật thăm gặp thì bắt buộc có thông tin ít nhất 1 ca', 'Giờ nghỉ giữa các ca tính bằng phút']} /><NoteBox id="sdNote1" line="Thông tin này được đồng bộ từ cài đặt tại C04" /></div>,
      code: '<NoteBox items={[…]} />  XANH — nội dung cần nổi bật để nhắc nhở, hướng dẫn người dùng\n<NoteBox line="…" />   XÁM — ghi chú nhắc thêm, vô hại, không cần nhấn mạnh  (QD-372)' },
    { id: 'table-hint', name: 'Khung gợi ý dưới bảng', aliases: 'table hint gợi ý dưới bảng ghi chú bảng ngoại lệ tình hình sử dụng', component: 'NoteBox', rules: ['UX-L13', 'QD-390'],
      demo: () => <div className="sd-col-wide"><div className="table-hint"><NoteBox id="sdTableHint" line="Tình hình sử dụng sẽ có giá trị nếu quầy có lịch hẹn trong tuần chứa ngày tìm kiếm, theo khung giờ của các ngày bật thăm gặp tại Cấu hình thời gian" /></div></div>,
      code: '// nguồn ReceptionDeskDetail.jsx (tab Tình hình sử dụng) · AppointmentList.jsx (chỉ danh sách Ngoại lệ)\n<div className="table-hint"><NoteBox id="…" line="… sẽ có giá trị nếu …" /></div>   // đặt ngay dưới bảng, câu nói khi nào bảng có dữ liệu' },
    { id: 'setup-hint', name: 'Hướng dẫn cài đặt khi chưa có dữ liệu', aliases: 'setup hint chưa có dữ liệu hướng dẫn link', component: 'SetupHint', harvest: 'Hướng dẫn cài đặt', rules: ['UX-L14'],
      demo: () => <SetupHint what="buồng thăm gặp" screen="Cài đặt quầy tiếp đón" to="#" />, code: '<SetupHint what="buồng thăm gặp" screen="Cài đặt quầy tiếp đón" to={ROUTES.receptionDeskList} />' },
    { id: 'warning', name: 'Khung cảnh báo hệ quả', aliases: 'warning cảnh báo eff hệ quả', harvest: 'Khung cảnh báo', rules: ['UX-F4'],
      demo: () => <div className="eff is-warning"><RichText text={msg('W001-15', 'Quầy ' + key('Q01'), 3)} /></div>, code: "<div className=\"eff is-warning\"><RichText text={msg('W001-15', …)} /></div>" },
    { id: 'toast', name: 'Thông báo nổi (toast)', aliases: 'toast thông báo thành công lỗi', rules: ['UX-E1'],
      demo: () => <div className="sd-row"><AppButton className="btn" onClick={() => toast(msg('I001-03', 'quầy tiếp đón', 'Q01'))}>Thành công</AppButton><AppButton className="btn" onClick={() => toast(msg('SE001-01', 'Lưu'), 'is-error')}>Lỗi</AppButton></div>,
      code: "toast(msg('I001-03', …))  ·  toast(msg('SE001-01', 'Lưu'), 'is-error')" },
    /* thanh báo phiên bản mới kiểu PM5 — dùng chung Prototype và trang này. Mẫu: tải lại trang kèm ?preview=version-notice để thanh hiện ngay */
    { id: 'version-notice', name: 'Thanh báo phiên bản mới', aliases: 'version notice phiên bản mới cập nhật tải lại reload new version', component: 'VersionNotice', rules: [],
      demo: () => <div className="sd-row"><AppButton className="btn" onClick={() => { window.location.href = window.location.pathname + '?preview=version-notice' + window.location.hash; }}>Xem thử thanh báo</AppButton></div>,
      code: "<VersionNotice />  // Prototype: chữ PM5\n<VersionNotice label=\"TrangNT5 đã có nâng cấp phiên bản mới, bạn hãy F5 và trải nghiệm nhé!\" />  // trang Design System\n// xem thử không cần bản build mới: thêm ?preview=version-notice vào link" },
    { id: 'field-error', name: 'Lỗi dưới ô nhập', aliases: 'error lỗi validate bắt buộc', harvest: 'Lỗi dưới ô', rules: ['UX-L11'],
      demo: () => <div className="form-grid"><Field span={6} label="Mã quầy" required error={msg('E001-01', 'mã quầy')}><input className="text-input input-border-error" placeholder="Nhập mã quầy" /></Field></div>,
      code: "<div className=\"field-error on\">{msg('E001-01', 'mã quầy')}</div>" },
    { id: 'spinner', name: 'Vòng xoay đang tải', aliases: 'spinner loading đang tải xử lý', components: ['AppSpinner'], rules: [], demo: () => <SpinnerDemo />, code: "<AppSpinner text=\"Đang tải\" />  ·  <AppSpinner size=\"lg\" />" },
    { id: 'skeleton', name: 'Khung chờ tải', aliases: 'skeleton chờ tải giữ chỗ loading', components: ['AppSkeleton'], rules: [], demo: () => <SkeletonDemo />, code: "<AppSkeleton lines={4} />  // giữ đúng hình nội dung sắp hiện" },
    { id: 'empty-states', name: 'Trạng thái rỗng và lỗi', aliases: 'empty rỗng chưa có dữ liệu không có quyền tải lỗi thử lại bản ghi đã xóa', components: ['AppEmptyState'], rules: ['QD-401', 'UX-G8'], demo: () => <EmptyStatesDemo />,
      code: [
        { group: 'Chưa có dữ liệu', label: 'Kèm nút tạo (I001-48)', code: "<AppEmptyState kind=\"empty\" text={msg('I001-48', 'quầy tiếp đón', 'Tạo mới')} action={<AppButtonWithIcon className=\"btn btn-primary\" iconRaw={…}>Tạo mới</AppButtonWithIcon>} />" },
        { group: 'Không có quyền', label: 'SE001-07', code: "<AppEmptyState kind=\"forbidden\" text={msg('SE001-07')} />" },
        { group: 'Tải lỗi', label: 'Kèm Thử lại (SE001-01)', code: "<AppEmptyState kind=\"error\" text={msg('SE001-01', 'Tải dữ liệu')} action={<AppButtonWithIcon className=\"btn\" iconRaw={…}>Thử lại</AppButtonWithIcon>} />" },
        { group: 'Bản ghi không còn', label: 'Kèm Quay lại danh sách (E001-15)', code: "<AppEmptyState kind=\"deleted\" text={msg('E001-15', 'Lịch hẹn LH-2026-0914')} action={…} />" },
        { note: 'Lọc hoặc tìm không ra trong bảng vẫn dùng EmptyRow I001-28 (UX-G8).' },
      ] },
  ] },
  { id: 'popup', name: 'Hộp thoại', items: [
    { id: 'confirm', name: 'Hộp xác nhận theo mức rủi ro', aliases: 'modal dialog xác nhận xóa vô hiệu hóa kích hoạt popup', components: ['AppModal', 'DialogIcon', 'DialogCloseButton'], rules: ['UX-F4', 'UX-F7', 'QD-350', 'QD-352'], demo: () => <ConfirmDemo />,
      code: '<AppModal open={…} onClose={…}>  dlg-h (DialogIcon level="danger|warn" + tiêu đề) · dlg-b (msgParts(...).body) · dlg-f (Hủy + nút hành động)' },
    { id: 'delete-appointment', name: 'Hộp Xóa lịch hẹn', aliases: 'delete appointment xóa lịch', component: 'DeleteAppointmentDialog', rules: ['QD-320'], demo: () => <DeleteAppointmentDemo />, code: '<DeleteAppointmentDialog open={o} code={code} onClose={…} onConfirm={…} />' },
    { id: 'cancel-appointment', name: 'Hộp Hủy lịch hẹn', aliases: 'cancel appointment hủy lịch lý do', component: 'CancelAppointmentDialog', rules: ['QD-334'], demo: () => <CancelAppointmentDemo />, code: '<CancelAppointmentDialog open={o} onClose={…} onConfirm={…} visitTimes={…} records={…} />' },
    { id: 'leave-guard', name: 'Chặn rời trang khi chưa lưu', aliases: 'leave guard rời trang chưa lưu', component: 'LeaveGuard', rules: ['UX-D7'],
      demo: () => <div className="sd-muted">Hook <code>useLeaveGuard(dirty)</code> — đang gõ dở mà bấm menu, breadcrumb, nút quay lại thì hiện hộp «Thay đổi chưa lưu» (C001-03). Thử ở màn <a href="https://trangnt5-pm2-prototype.web.app/tiep-don/quay-tiep-don/tao-moi" target="_blank" rel="noreferrer">Tạo quầy</a>.</div>,
      code: "const guard = useLeaveGuard(dirty, 'dlgRoiTrang')  // gắn ở màn Tạo, Sửa" },
    { id: 'drawer', name: 'Ngăn kéo bên phải', aliases: 'drawer ngăn kéo panel bên phải xem nhanh', components: ['AppDrawer'], rules: [], demo: () => <DrawerDemo />, code: "<AppDrawer open={o} title=\"…\" onClose={…} footer={<…nút…/>}>…</AppDrawer>  // nút X DialogCloseButton · Esc đóng" },
    { id: 'popover', name: 'Hộp nổi', aliases: 'popover hộp nổi giải thích bấm mở', components: ['AppPopover'], rules: [], demo: () => <PopoverDemo />, code: "<AppPopover triggerLabel=\"…\" title=\"…\">nội dung</AppPopover>  // khác Tooltip: bấm mới mở, có tiêu đề" },
    { id: 'import-excel', name: 'Nhập khẩu Excel', aliases: 'import nhập khẩu excel tải lên tệp mẫu xlsx upload', components: ['AppImportExcel'], rules: ['QD-401'], demo: () => <ImportExcelDemo />,
      code: "<AppModal open={o} onClose={…} dlgStyle={{ width: 720 }}>\n  <AppImportExcel labels={{ template, templateButton, pick, dropHint, preview, errorCount, errorColumn }} fileName={f} percent={p} columns={cols} rows={preview} onTemplate={…} onPick={…} />\n</AppModal>  // nút Nhập dữ liệu chỉ bấm được khi 0 dòng lỗi" },
  ] },
  { id: 'nav', name: 'Điều hướng và khung trang', items: [
    { id: 'shell', name: 'Khung trang: đầu trang · menu ngang · sidebar · breadcrumb', aliases: 'layout header menu sidebar breadcrumb khung trang', harvest: 'Menu trái', alsoHarvest: ['Menu ngang'], rules: ['UX-I1'],
      demo: () => <><div className="sd-muted">Chính khung trang bạn đang xem là <code>AppLayout</code> của Prototype — menu ngang, sidebar, breadcrumb y hệt màn thật. Riêng góc tài khoản: trang này cố định 1 vai (<code>fixedAccount</code>), còn màn thật có menu đổi tài khoản như mẫu dưới.</div><AccountMenuDemo /></>,
      code: "<AppLayout menu={L.menu} sidebar={L.sidebar} breadcrumb={[…]}>…</AppLayout>  // L = operationsLayout('Tên mục') · menuConfig.js" },
    { id: 'breadcrumb', name: 'Breadcrumb (đường dẫn trang)', aliases: 'breadcrumb đường dẫn cấp trang bc điều hướng', components: ['Breadcrumb'], harvest: 'Breadcrumb', rules: ['UX-I1', 'QD-400'], demo: () => <BreadcrumbDemo />, code: "import { Breadcrumb } from '@/layout/AppLayout'\n<Breadcrumb items={[{ label, href }, …, { label: 'Màn hiện tại' }]} />  // AppLayout tự vẽ từ prop breadcrumb — mục cuối chữ đậm, không bấm" },
    { id: 'stepper', name: 'Thanh bước', aliases: 'stepper bước wizard', harvest: 'Thanh bước', rules: ['QD-361'], demo: () => <StepperDemo />, code: '<div className="stepper"> … <div className="step is-current"><span className="step-number">2</span><span className="step-title">…</span></div> … </div>\n<div className={\'card\' + (bước !== bước đang mở ? \' is-hidden-block\' : \'\')}> · khối theo luồng: \' is-hidden\'' },
    { id: 'link', name: 'Liên kết', aliases: 'link liên kết đường dẫn mở tab mới', components: ['AppLink'], rules: [], demo: () => <LinkDemo />, code: "<AppLink href=\"#/…\">…</AppLink>  ·  <AppLink href=\"https://…\" external>…</AppLink>  // thao tác đổi dữ liệu thì dùng Nút" },
    { id: 'kbd', name: 'Phím tắt', aliases: 'kbd phím tắt bàn phím keyboard', components: ['AppKbd'], rules: [], demo: () => <KbdDemo />, code: "<AppKbd keys={['Ctrl', 'S']} />" },
  ] },
  { id: 'states', name: 'Trạng thái theo thao tác', items: STATE_ITEMS },   /* lớp chỉ hiện khi có dữ liệu hoặc thao tác — mẫu ở stateDemos.jsx */
];
export const ALL_ITEMS = GROUPS.flatMap((g) => g.items.map((it) => ({ ...it, group: g.id, groupName: g.name })));
