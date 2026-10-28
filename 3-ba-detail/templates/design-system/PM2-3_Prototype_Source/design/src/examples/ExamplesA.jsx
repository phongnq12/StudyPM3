/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Ví dụ kiểu HeroUI cho counter-input, search-input, select, search-select, filter-dropdown, time-range, attachment, notify-recipients, multi-select. Mỗi ví dụ chạy component thật, code bên dưới khớp đúng phần render. */
import { useState } from 'react';
import AppCounterInput from '@/components/app/AppCounterInput';
import AppSearchInput from '@/components/app/AppSearchInput';
import AppSelect from '@/components/app/AppSelect';
import AppSearchSelect from '@/components/app/AppSearchSelect';
import { AppFilterDropdown } from '@/components/app/AppFilterDropdown';
import TimeRangeInput from '@/components/app/TimeRangeInput';
import AttachmentField from '@/components/app/AttachmentField';
import { AttachmentView } from '@/components/app/ExemptionInfo';   /* chế độ Xem có tải về */
import NotifyRecipientsField from '@/components/app/NotifyRecipientsField';
import { CANCEL_REASONS } from '@/components/app/CancelAppointmentDialog';
import { SEND_TYPE_LABELS, TIME_UNITS, NOTIFICATION_CODES } from '@/data/notificationSettingsStore';
import { recordNotifyField } from '@/data/notificationStore';
import { relationshipOptions } from '@/data/approvalRoute';
import { listDormitories, dormitoryLabel } from '@/data/dormitoryStore';
import { visitTeamStaff } from '@/data/staffDirectoryStore';
import { buildAppointments } from '@/pages/AppointmentList/listLogic';
import { msg } from '@/lib/msg';

const appointmentsOnce = (() => { let cache = null; return () => { if (!cache) { try { cache = buildAppointments(); } catch { cache = []; } } return cache; }; })();
const box = (w) => ({ maxWidth: w, width: '100%' });

/* ── counter-input ── */
function CounterDefault() { const [value, setValue] = useState(''); return <div style={box(420)}><AppCounterInput id="ex-counter-input-1" counterId="ex-counter-input-1-dem" maxLength={100} placeholder="Ví dụ: Quầy tiếp đón số 1" value={value} onChange={(e) => setValue(e.target.value)} /></div>; }
function CounterUpper() { const [value, setValue] = useState('Q01'); return <div style={box(240)}><AppCounterInput id="ex-counter-input-2" counterId="ex-counter-input-2-dem" maxLength={10} placeholder="Nhập mã quầy" style={{ textTransform: 'uppercase' }} value={value} onChange={(e) => setValue(e.target.value)} /></div>; }
function CounterFull() { const [value, setValue] = useState('001090012345'); return <div style={box(260)}><AppCounterInput id="ex-counter-input-3" counterId="ex-counter-input-3-dem" maxLength={12} inputMode="numeric" placeholder="Nhập 12 chữ số" value={value} onChange={(e) => setValue(e.target.value.replace(/\D/g, ''))} /></div>; }
function CounterRows() { const [value, setValue] = useState(''); return <div style={box(560)}><AppCounterInput multiline id="ex-counter-input-4" counterId="ex-counter-input-4-dem" rows={3} maxLength={1000} placeholder="Nhập ghi chú thêm về lượt thăm gặp nếu cần" value={value} onChange={(e) => setValue(e.target.value)} /></div>; }
function CounterError() {
  const [value, setValue] = useState('');
  return <div style={box(560)}><AppCounterInput multiline className="ta input-border-error" id="ex-counter-input-5" counterId="ex-counter-input-5-dem" maxLength={1000} placeholder="Nhập ghi chú cho lần hủy lịch hẹn này…"
    value={value} onChange={(e) => setValue(e.target.value)} error={<span className="field-error on" id="ex-counter-input-5-loi">{msg('E001-01', 'ghi chú')}</span>} /></div>;
}

/* ── search-input ── */
function SearchDefault() { const [value, setValue] = useState(''); return <div style={box(560)}><AppSearchInput className="filter-cell filter-wide" id="ex-search-input-1" value={value} onChange={setValue} placeholder="Tìm theo mã lịch hẹn, tên người cai nghiện, CCCD, tên thân nhân" /></div>; }
function SearchFilled() { const [value, setValue] = useState('Q01'); return <div style={box(420)}><AppSearchInput className="filter-cell" id="ex-search-input-2" value={value} onChange={setValue} placeholder="Tìm theo mã quầy, tên quầy" /></div>; }
function SearchTitle() {
  const [value, setValue] = useState('');
  return <div style={box(560)}><AppSearchInput className="filter-cell filter-wide" id="ex-search-input-3" value={value} onChange={setValue} placeholder="Tìm theo mã lịch hẹn, tên người cai nghiện, CCCD, tên thân nhân"
    title="Tìm trên 4 trường: Mã lịch hẹn · tên người cai nghiện · CCCD người cai nghiện · tên thân nhân" /></div>;
}

/* ── select ── */
const SEND_TYPE_OPTIONS = Object.keys(SEND_TYPE_LABELS).map((k) => ({ value: k, label: SEND_TYPE_LABELS[k] }));
const UNIT_OPTIONS = TIME_UNITS.map((u) => ({ value: u.value, label: u.label }));
function SelectDefault() { const [value, setValue] = useState('IMMEDIATE'); return <div style={box(320)}><AppSelect id="ex-select-1" aria-label="Gửi khi nào" value={value} options={SEND_TYPE_OPTIONS} showSearch={false} allowClear={false} onChange={setValue} style={{ width: '100%' }} /></div>; }
function SelectWidth() { const [value, setValue] = useState('MINUTE'); return <AppSelect id="ex-select-2" aria-label="Đơn vị" width={96} value={value} options={UNIT_OPTIONS} showSearch={false} allowClear={false} onChange={setValue} />; }
function SelectError() { const [value, setValue] = useState(); return <div style={box(320)}><AppSelect id="ex-select-3" aria-label="Gửi khi nào" value={value} options={SEND_TYPE_OPTIONS} showSearch={false} allowClear={false} status="error" onChange={setValue} style={{ width: '100%' }} /></div>; }
function SelectDisabled() { return <div style={box(320)}><AppSelect id="ex-select-4" aria-label="Gửi khi nào" value="BEFORE" options={SEND_TYPE_OPTIONS} showSearch={false} allowClear={false} disabled style={{ width: '100%' }} /></div>; }
function SelectClear() { const [value, setValue] = useState('AFTER'); return <div style={box(320)}><AppSelect id="ex-select-5" aria-label="Gửi khi nào" value={value} options={SEND_TYPE_OPTIONS} showSearch={false} allowClear onChange={setValue} style={{ width: '100%' }} /></div>; }

/* ── search-select ── */
const REASON_OPTIONS = CANCEL_REASONS.map(([value, label]) => ({ value, label }));
const RELATION_OPTIONS = [{ value: '', label: 'Chọn quan hệ' }].concat(relationshipOptions());
function SearchSelectDefault() { const [value, setValue] = useState(''); return <div style={box(420)}><AppSearchSelect id="ex-search-select-1" value={value} onChange={setValue} options={REASON_OPTIONS} /></div>; }
function SearchSelectError() {
  const [value, setValue] = useState('');
  return <div style={box(420)}><AppSearchSelect id="ex-search-select-2" value={value} onChange={setValue} options={REASON_OPTIONS} hasErrorBorder={!value} />
    {!value && <span className="field-error on">{msg('E001-02', 'lý do hủy')}</span>}</div>;
}
function SearchSelectDisabled() { return <div style={box(420)}><AppSearchSelect id="ex-search-select-3" value="TN_OMDAU" options={REASON_OPTIONS} disabled /></div>; }
function SearchSelectNoClear() { const [value, setValue] = useState(''); return <div style={box(420)}><AppSearchSelect id="ex-search-select-4" value={value} onChange={setValue} options={RELATION_OPTIONS} noClear /></div>; }

/* ── filter-dropdown ── */
const STATUS_ITEMS = ['Chờ duyệt', 'Đã duyệt', 'Đang diễn ra', 'Đã kết thúc', 'Vắng mặt'];
function useDropdown(initial) { const [open, setOpen] = useState(false); const [value, setValue] = useState(initial); return { open, value, onOpen: () => setOpen(!open), onPick: (x) => { setValue(x); setOpen(false); }, onClear: () => setValue('') }; }
function FilterDefault() { const d = useDropdown(''); return <div style={box(280)}><AppFilterDropdown id="ex-filter-dropdown-1" ariaLabel="Trạng thái" placeholder="Tất cả trạng thái" items={STATUS_ITEMS} {...d} /></div>; }
function FilterPicked() { const d = useDropdown('Đã duyệt'); return <div style={box(280)}><AppFilterDropdown id="ex-filter-dropdown-2" ariaLabel="Trạng thái" placeholder="Tất cả trạng thái" items={STATUS_ITEMS} {...d} /></div>; }
function FilterLong() {
  const d = useDropdown('');
  return <div style={box(280)}><AppFilterDropdown id="ex-filter-dropdown-3" ariaLabel="Dãy nhà phục vụ" placeholder="Tất cả dãy nhà phục vụ" items={listDormitories().map((x) => dormitoryLabel(x.code))} {...d} /></div>;
}

/* ── time-range ── */
function useRange(from, to) { const [r, setR] = useState({ from, to }); return [r, (edge, value) => setR((x) => ({ ...x, [edge]: value }))]; }
function TimeEmpty() { const [r, onChange] = useRange('', ''); return <div style={box(320)}><TimeRangeInput from={r.from} to={r.to} idPrefix="ex-time-range-1" labelFrom="Giờ bắt đầu" labelTo="Giờ kết thúc" onChange={onChange} /></div>; }
/* màn thật Cấu hình thời gian báo E001-17 dưới ô (VisitConfig.jsx) ⇒ mẫu Lỗi phải có chữ đỏ, không chỉ viền */
function TimeInvalid() { const [r, onChange] = useRange('11:00', '07:30'); return <div style={box(320)}><TimeRangeInput from={r.from} to={r.to} invalid idPrefix="ex-time-range-2" labelFrom="Giờ bắt đầu" labelTo="Giờ kết thúc" onChange={onChange} /><span className="field-error on">{msg('E001-17', 'Giờ kết thúc', 'sau', 'giờ bắt đầu')}</span></div>; }
function TimeDisabled() { return <div style={box(320)}><TimeRangeInput from="07:30" to="11:00" disabled idPrefix="ex-time-range-3" labelFrom="Giờ bắt đầu" labelTo="Giờ kết thúc" onChange={() => {}} /></div>; }

/* ── attachment ── */
function AttachEmpty() { const [value, setValue] = useState([]); return <AttachmentField id="ex-attachment-1" value={value} onChange={setValue} />; }
function AttachMb() { const [value, setValue] = useState([{ name: 'Giay-xac-nhan-tam-tru.pdf', size: 6815744 }]); return <AttachmentField id="ex-attachment-2" value={value} onChange={setValue} />; }
function AttachLimit() { const [value, setValue] = useState([{ name: 'Giay-xac-nhan-tam-tru.pdf', size: 10485760 }]); return <AttachmentField id="ex-attachment-3" value={value} onChange={setValue} />; }
/* chế độ Xem — tên tệp là liên kết tải về (Prototype tải 1 tệp mẫu cùng tên) */
function AttachView() { return <AttachmentView list={[{ name: 'Don-xin-gap.pdf', size: 245760 }, { name: 'CCCD-mat-truoc.jpg', size: 1887437 }]} />; }
/* nhiều tệp — chọn thêm thì nối vào cuối, mỗi tệp 1 nút bỏ riêng */
function AttachMany() { const [value, setValue] = useState([{ name: 'Don-xin-gap.pdf', size: 245760 }, { name: 'CCCD-mat-truoc.jpg', size: 1887437 }, { name: 'Giay-uy-quyen.docx', size: 61440 }]); return <AttachmentField id="ex-attachment-4" value={value} onChange={setValue} />; }

/* ── notify-recipients ── */
function NotifyApproved() { const [value, setValue] = useState(null); return <NotifyRecipientsField id="ex-notify-recipients-1" code={NOTIFICATION_CODES.APPROVED} records={appointmentsOnce().slice(0, 1)} value={value} onChange={setValue} />; }
function NotifyAbsent() { const [value, setValue] = useState(null); return <NotifyRecipientsField id="ex-notify-recipients-2" code={NOTIFICATION_CODES.ABSENT} records={appointmentsOnce().slice(0, 1)} value={value} onChange={setValue} />; }
function NotifyRecordForm() {
  const f = recordNotifyField('NORMAL');
  const [value, setValue] = useState(f.value);
  return <NotifyRecipientsField id="ex-notify-recipients-3" label="Người nhận thông báo của lịch hẹn" code={f.code} groups={f.groups} records={f.records} value={value} onChange={setValue} />;
}
function NotifyExemption() {
  const f = recordNotifyField('EXEMPTION');
  const [value, setValue] = useState(f.value);
  return <NotifyRecipientsField id="ex-notify-recipients-4" label="Người nhận thông báo của lịch hẹn" code={f.code} groups={f.groups} records={f.records} value={value} onChange={setValue} />;
}

/* ── multi-select ── */
const DORM_OPTIONS = listDormitories().map((d) => ({ value: d.code, label: d.code + ' — ' + d.name }));
const STAFF_OPTIONS = visitTeamStaff().map((s) => ({ value: s.key, label: s.name + ' — ' + s.role }));
function MultiDefault() { const [value, setValue] = useState([]); return <div style={box(420)}><AppSelect id="ex-multi-select-1" mode="multiple" placeholder="Chọn dãy nhà phục vụ" options={DORM_OPTIONS} value={value} onChange={setValue} style={{ width: '100%' }} /></div>; }
function MultiSearch() { const [value, setValue] = useState([]); return <div style={box(420)}><AppSelect id="ex-multi-select-2" mode="multiple" showSearch optionFilterProp="label" placeholder="Chọn cán bộ Tổ thăm gặp phụ trách quầy" options={STAFF_OPTIONS} value={value} onChange={setValue} style={{ width: '100%' }} /></div>; }
function MultiResponsive() { const [value, setValue] = useState(DORM_OPTIONS.map((o) => o.value)); return <div style={box(280)}><AppSelect id="ex-multi-select-3" mode="multiple" placeholder="Chọn dãy nhà phục vụ" options={DORM_OPTIONS} value={value} onChange={setValue} style={{ width: '100%' }} /></div>; }
function MultiError() { const [value, setValue] = useState([]); return <div style={box(420)}><AppSelect id="ex-multi-select-4" mode="multiple" placeholder="Chọn dãy nhà phục vụ" options={DORM_OPTIONS} value={value} onChange={setValue} status="error" style={{ width: '100%' }} /></div>; }
function MultiDisabled() { return <div style={box(420)}><AppSelect id="ex-multi-select-5" mode="multiple" placeholder="Chọn dãy nhà phục vụ" options={DORM_OPTIONS} value={DORM_OPTIONS.slice(0, 2).map((o) => o.value)} disabled style={{ width: '100%' }} /></div>; }
function MultiLockedOption() {
  const options = STAFF_OPTIONS.map((o, i) => ({ ...o, disabled: i === 0 }));
  const [value, setValue] = useState(STAFF_OPTIONS.slice(0, 1).map((o) => o.value));
  return <div style={box(420)}><AppSelect id="ex-multi-select-6" mode="multiple" showSearch optionFilterProp="label" placeholder="Chọn cán bộ tổ thăm gặp" options={options} value={value} onChange={setValue} style={{ width: '100%' }} /></div>;
}

export default {
  'counter-input': [
    { title: 'Mặc định', desc: 'Ô 1 dòng có bộ đếm nằm trong ô sát phải, dùng cho tên và mô tả ngắn.', Demo: CounterDefault,
      code: '<AppCounterInput id="ex-counter-input-1" counterId="ex-counter-input-1-dem" maxLength={100} placeholder="Ví dụ: Quầy tiếp đón số 1" value={value} onChange={(e) => setValue(e.target.value)} />' },
    { title: 'Mã viết hoa', desc: 'Ô mã giới hạn 10 ký tự, chữ hiện in hoa qua style của ô nhập.', Demo: CounterUpper,
      code: "<AppCounterInput id=\"ex-counter-input-2\" counterId=\"ex-counter-input-2-dem\" maxLength={10} placeholder=\"Nhập mã quầy\" style={{ textTransform: 'uppercase' }} value={value} onChange={(e) => setValue(e.target.value)} />" },
    { title: 'Đã đủ giới hạn', desc: 'Ô CCCD 12 chữ số đã nhập đủ nên bộ đếm hiện 12 / 12 và không gõ thêm được.', Demo: CounterFull,
      code: "<AppCounterInput id=\"ex-counter-input-3\" counterId=\"ex-counter-input-3-dem\" maxLength={12} inputMode=\"numeric\" placeholder=\"Nhập 12 chữ số\" value={value} onChange={(e) => setValue(e.target.value.replace(/\\D/g, ''))} />" },
    { title: 'Nhiều dòng', desc: 'Bật multiline cho ghi chú dài, bộ đếm chuyển xuống hàng chân dưới ô.', Demo: CounterRows,
      code: '<AppCounterInput multiline id="ex-counter-input-4" counterId="ex-counter-input-4-dem" rows={3} maxLength={1000} placeholder="Nhập ghi chú thêm về lượt thăm gặp nếu cần" value={value} onChange={(e) => setValue(e.target.value)} />' },
    { title: 'Báo lỗi ở hàng chân', desc: 'Ô nhiều dòng nhận chữ đỏ qua error, chữ đỏ nằm bên trái bộ đếm trên cùng 1 hàng.', Demo: CounterError,
      code: "<AppCounterInput multiline className=\"ta input-border-error\" id=\"ex-counter-input-5\" counterId=\"ex-counter-input-5-dem\" maxLength={1000} placeholder=\"Nhập ghi chú cho lần hủy lịch hẹn này…\"\n  value={value} onChange={(e) => setValue(e.target.value)} error={<span className=\"field-error on\" id=\"ex-counter-input-5-loi\">{msg('E001-01', 'ghi chú')}</span>} />" },
  ],
  'search-input': [
    { title: 'Mặc định', desc: 'Ô tìm trống trên thanh lọc của danh sách, lớp filter-wide cho ô rộng.', Demo: SearchDefault,
      code: '<AppSearchInput className="filter-cell filter-wide" id="ex-search-input-1" value={value} onChange={setValue} placeholder="Tìm theo mã lịch hẹn, tên người cai nghiện, CCCD, tên thân nhân" />' },
    { title: 'Đang có từ khoá', desc: 'Có chữ thì hiện nút X để xóa nhanh và đưa con trỏ về ô.', Demo: SearchFilled,
      code: '<AppSearchInput className="filter-cell" id="ex-search-input-2" value={value} onChange={setValue} placeholder="Tìm theo mã quầy, tên quầy" />' },
    { title: 'Có chú thích khi di chuột', desc: 'Truyền title để nói rõ ô tìm trên những trường nào.', Demo: SearchTitle,
      code: '<AppSearchInput className="filter-cell filter-wide" id="ex-search-input-3" value={value} onChange={setValue} placeholder="Tìm theo mã lịch hẹn, tên người cai nghiện, CCCD, tên thân nhân"\n  title="Tìm trên 4 trường: Mã lịch hẹn · tên người cai nghiện · CCCD người cai nghiện · tên thân nhân" />' },
  ],
  select: [
    { title: 'Mặc định', desc: 'Ô chọn 1 giá trị trong danh sách ngắn, không cần gõ tìm.', Demo: SelectDefault,
      code: "<AppSelect id=\"ex-select-1\" aria-label=\"Gửi khi nào\" value={value} options={SEND_TYPE_OPTIONS} showSearch={false} allowClear={false} onChange={setValue} style={{ width: '100%' }} />" },
    { title: 'Bề rộng cố định', desc: 'Truyền width khi ô đứng giữa 1 hàng chữ như ô đơn vị phút hoặc giờ.', Demo: SelectWidth,
      code: '<AppSelect id="ex-select-2" aria-label="Đơn vị" width={96} value={value} options={UNIT_OPTIONS} showSearch={false} allowClear={false} onChange={setValue} />' },
    { title: 'Lỗi', desc: 'Trường bắt buộc chưa chọn thì bật viền đỏ bằng status error.', Demo: SelectError,
      code: "<AppSelect id=\"ex-select-3\" aria-label=\"Gửi khi nào\" value={value} options={SEND_TYPE_OPTIONS} showSearch={false} allowClear={false} status=\"error\" onChange={setValue} style={{ width: '100%' }} />" },
    { title: 'Khoá', desc: 'Giá trị chỉ xem, không cho đổi.', Demo: SelectDisabled,
      code: "<AppSelect id=\"ex-select-4\" aria-label=\"Gửi khi nào\" value=\"BEFORE\" options={SEND_TYPE_OPTIONS} showSearch={false} allowClear={false} disabled style={{ width: '100%' }} />" },
    { title: 'Cho xóa lựa chọn', desc: 'Bật allowClear khi trường không bắt buộc và được để trống.', Demo: SelectClear,
      code: "<AppSelect id=\"ex-select-5\" aria-label=\"Gửi khi nào\" value={value} options={SEND_TYPE_OPTIONS} showSearch={false} allowClear onChange={setValue} style={{ width: '100%' }} />" },
  ],
  'search-select': [
    { title: 'Mặc định', desc: 'Danh sách dài cần gõ tìm, bấm vào ô để mở và lọc theo chữ gõ.', Demo: SearchSelectDefault,
      code: '<AppSearchSelect id="ex-search-select-1" value={value} onChange={setValue} options={REASON_OPTIONS} />' },
    { title: 'Lỗi bắt buộc', desc: 'Chưa chọn thì bật viền đỏ bằng hasErrorBorder và hiện chữ đỏ dưới ô.', Demo: SearchSelectError,
      code: "<AppSearchSelect id=\"ex-search-select-2\" value={value} onChange={setValue} options={REASON_OPTIONS} hasErrorBorder={!value} />\n{!value && <span className=\"field-error on\">{msg('E001-02', 'lý do hủy')}</span>}" },
    { title: 'Khoá', desc: 'Ô gõ tìm tự khoá theo disabled của ô chọn gốc.', Demo: SearchSelectDisabled,
      code: '<AppSearchSelect id="ex-search-select-3" value="TN_OMDAU" options={REASON_OPTIONS} disabled />' },
    { title: 'Ẩn nút xóa', desc: 'Bật noClear khi ô luôn phải giữ 1 giá trị, nhãn lựa chọn dạng Mã — Tên.', Demo: SearchSelectNoClear,
      code: '<AppSearchSelect id="ex-search-select-4" value={value} onChange={setValue} options={RELATION_OPTIONS} noClear />' },
  ],
  'filter-dropdown': [
    { title: 'Mặc định', desc: 'Chưa chọn thì hiện chữ Tất cả, bấm vào ô để mở danh sách và gõ lọc.', Demo: FilterDefault,
      code: '<AppFilterDropdown id="ex-filter-dropdown-1" ariaLabel="Trạng thái" placeholder="Tất cả trạng thái" items={STATUS_ITEMS} value={value} open={open} onOpen={onOpen} onPick={onPick} onClear={onClear} />' },
    { title: 'Đang lọc', desc: 'Có giá trị thì ô hiện tên mục và nút X để bỏ lọc.', Demo: FilterPicked,
      code: '<AppFilterDropdown id="ex-filter-dropdown-2" ariaLabel="Trạng thái" placeholder="Tất cả trạng thái" items={STATUS_ITEMS} value={value} open={open} onOpen={onOpen} onPick={onPick} onClear={onClear} />' },
    { title: 'Danh mục Mã — Tên', desc: 'Lọc theo danh mục, gõ không dấu vẫn tìm được, không khớp thì hiện câu không có kết quả.', Demo: FilterLong,
      code: "<AppFilterDropdown id=\"ex-filter-dropdown-3\" ariaLabel=\"Dãy nhà phục vụ\" placeholder=\"Tất cả dãy nhà phục vụ\" items={listDormitories().map((x) => dormitoryLabel(x.code))} value={value} open={open} onOpen={onOpen} onPick={onPick} onClear={onClear} />" },
  ],
  'time-range': [
    { title: 'Mặc định', desc: 'Ô trống hiện gợi ý HH:mm, bấm vào 1 nửa để mở bảng chọn giờ và phút.', Demo: TimeEmpty,
      code: '<TimeRangeInput from={from} to={to} idPrefix="ex-time-range-1" labelFrom="Giờ bắt đầu" labelTo="Giờ kết thúc" onChange={onChange} />' },
    { title: 'Lỗi', desc: 'Giờ kết thúc trước giờ bắt đầu: bật invalid để viền đỏ cả khung và hiện chữ đỏ E001-17 dưới ô.', Demo: TimeInvalid,
      code: '<TimeRangeInput from={from} to={to} invalid idPrefix="ex-time-range-2" labelFrom="Giờ bắt đầu" labelTo="Giờ kết thúc" onChange={onChange} />\n<span className="field-error on">{msg(\'E001-17\', \'Giờ kết thúc\', \'sau\', \'giờ bắt đầu\')}</span>' },
    { title: 'Khoá', desc: 'Chế độ chỉ xem, cả 2 ô khoá và bảng chọn giờ không mở.', Demo: TimeDisabled,
      code: '<TimeRangeInput from="07:30" to="11:00" disabled idPrefix="ex-time-range-3" labelFrom="Giờ bắt đầu" labelTo="Giờ kết thúc" onChange={() => {}} />' },
  ],
  attachment: [
    { title: 'Mặc định', desc: 'Chưa có tệp thì chỉ hiện nút Chọn tệp.', Demo: AttachEmpty,
      code: '<AttachmentField id="ex-attachment-1" value={value} onChange={setValue} />' },
    { title: 'Tệp tính theo MB', desc: 'Tệp từ 1MB trở lên thì dung lượng hiện theo MB.', Demo: AttachMb,
      code: "<AttachmentField id=\"ex-attachment-2\" value={value} onChange={setValue} />" },
    { title: 'Đúng giới hạn 10MB', desc: 'Tệp bằng đúng 10MB vẫn được nhận, lớn hơn thì bị chặn kèm chữ đỏ.', Demo: AttachLimit,
      code: "<AttachmentField id=\"ex-attachment-3\" value={value} onChange={setValue} />" },
    { title: 'Chế độ Xem có tải về', desc: 'Màn Xem chi tiết: tên tệp là liên kết kèm icon tải về, không có nút bỏ tệp.', Demo: AttachView,
      code: "import { AttachmentView } from '@/components/app/ExemptionInfo'\n<AttachmentView list={[{ name, size }, …]} />" },
    { title: 'Nhiều tệp', desc: 'Chọn thêm thì nối vào cuối danh sách, mỗi tệp có nút bỏ riêng.', Demo: AttachMany,
      code: "<AttachmentField id=\"ex-attachment-4\" value={value} onChange={setValue} />   // value: [{ name, size }, …]" },
  ],
  'notify-recipients': [
    { title: 'Popup Phê duyệt', desc: 'Nhóm người nhận suy theo mã thông báo của thao tác và lịch hẹn đang duyệt.', Demo: NotifyApproved,
      code: '<NotifyRecipientsField id="ex-notify-recipients-1" code={NOTIFICATION_CODES.APPROVED} records={[record]} value={value} onChange={setValue} />' },
    { title: 'Popup Vắng mặt', desc: 'Cùng trường dùng cho thao tác khác chỉ cần đổi code.', Demo: NotifyAbsent,
      code: '<NotifyRecipientsField id="ex-notify-recipients-2" code={NOTIFICATION_CODES.ABSENT} records={[record]} value={value} onChange={setValue} />' },
    { title: 'Mục Gửi thông báo của lịch hẹn', desc: 'Màn Tạo và Sửa lịch hẹn truyền sẵn groups và đổi nhãn trường.', Demo: NotifyRecordForm,
      code: "const f = recordNotifyField('NORMAL');\n<NotifyRecipientsField id=\"ex-notify-recipients-3\" label=\"Người nhận thông báo của lịch hẹn\" code={f.code} groups={f.groups} records={f.records} value={value} onChange={setValue} />" },
    { title: 'Đơn xin ngoại lệ', desc: 'Luồng ngoại lệ thêm nhóm Trưởng cơ sở bắt buộc nhận, không bỏ được.', Demo: NotifyExemption,
      code: "const f = recordNotifyField('EXEMPTION');\n<NotifyRecipientsField id=\"ex-notify-recipients-4\" label=\"Người nhận thông báo của lịch hẹn\" code={f.code} groups={f.groups} records={f.records} value={value} onChange={setValue} />" },
  ],
  'multi-select': [
    { title: 'Mặc định', desc: 'Chọn nhiều giá trị, mỗi giá trị hiện thành 1 tag có nút bỏ.', Demo: MultiDefault,
      code: "<AppSelect id=\"ex-multi-select-1\" mode=\"multiple\" placeholder=\"Chọn dãy nhà phục vụ\" options={DORM_OPTIONS} value={value} onChange={setValue} style={{ width: '100%' }} />" },
    { title: 'Có gõ tìm', desc: 'Bật showSearch và lọc theo nhãn khi danh sách người dài.', Demo: MultiSearch,
      code: "<AppSelect id=\"ex-multi-select-2\" mode=\"multiple\" showSearch optionFilterProp=\"label\" placeholder=\"Chọn cán bộ Tổ thăm gặp phụ trách quầy\" options={STAFF_OPTIONS} value={value} onChange={setValue} style={{ width: '100%' }} />" },
    { title: 'Tự gom +N', desc: 'Không truyền maxTagCount thì tag giữ 1 dòng theo bề rộng ô, phần dư gom thành +N.', Demo: MultiResponsive,
      code: "<AppSelect id=\"ex-multi-select-3\" mode=\"multiple\" placeholder=\"Chọn dãy nhà phục vụ\" options={DORM_OPTIONS} value={value} onChange={setValue} style={{ width: '100%' }} />" },
    { title: 'Lỗi', desc: 'Trường bắt buộc chưa chọn ai thì bật viền đỏ bằng status error.', Demo: MultiError,
      code: "<AppSelect id=\"ex-multi-select-4\" mode=\"multiple\" placeholder=\"Chọn dãy nhà phục vụ\" options={DORM_OPTIONS} value={value} onChange={setValue} status=\"error\" style={{ width: '100%' }} />" },
    { title: 'Khoá', desc: 'Cả ô khoá, tag chỉ để xem.', Demo: MultiDisabled,
      code: "<AppSelect id=\"ex-multi-select-5\" mode=\"multiple\" placeholder=\"Chọn dãy nhà phục vụ\" options={DORM_OPTIONS} value={DORM_OPTIONS.slice(0, 2).map((o) => o.value)} disabled style={{ width: '100%' }} />" },
    { title: 'Người bắt buộc không bỏ được', desc: 'Lựa chọn có disabled thì tag đó không có nút bỏ, các tag khác vẫn thêm bớt được.', Demo: MultiLockedOption,
      code: "<AppSelect id=\"ex-multi-select-6\" mode=\"multiple\" showSearch optionFilterProp=\"label\" placeholder=\"Chọn cán bộ tổ thăm gặp\" options={options} value={value} onChange={setValue} style={{ width: '100%' }} />  // options[0].disabled = true" },
  ],
};
