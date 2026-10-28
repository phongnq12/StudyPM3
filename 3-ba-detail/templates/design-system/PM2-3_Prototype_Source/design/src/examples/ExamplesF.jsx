/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Ví dụ kiểu HeroUI cho 9 control còn thiếu: text-input, multi-line-text, date, checkbox, switch, breadcrumb, stepper, page-actions, leave-guard.
 * Mỗi ví dụ chạy component hoặc markup thật của màn, câu lỗi theo mã Message List, code bên dưới khớp đúng phần render. */
import { useState } from 'react';
import { Switch } from 'antd';
import AppCounterInput from '@/components/app/AppCounterInput';
import { AppButton } from '@/components/app/AppButton';
import { PageHeadActions } from '@/components/app/PageActions';
import { useLeaveGuard } from '@/components/app/LeaveGuard';
import { Breadcrumb } from '@/layout/AppLayout';
import { BC_SAMPLES, bcDemo, bcCode } from '../ExtraDemos';
import { DateRange } from '@/pages/AppointmentList/widgets';
import { msg } from '@/lib/msg';

const w = (n) => ({ width: '100%', maxWidth: n });
const noop = () => {};
const ICON = {   /* chép đúng icon nút của màn thật (catalog BTN_ICON) */
  save: '<polyline points="20 6 9 17 4 12"/>',
  draft: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
  cancel: '<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>',
  back: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
};
const pad = (n) => String(n).padStart(2, '0');
const dmy = (d) => pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear();

/* ── text-input ── */
function TextDefault() { return <div className="form-grid" style={w(360)}><div className="field span-12"><label className="field-label">Tên hiển thị</label><input className="text-input" placeholder="Nhập tên hiển thị" /></div></div>; }
function TextRequired() {
  const [v, setV] = useState('');
  return <div className="form-grid" style={w(360)}><div className="field span-12"><label className="field-label">Mã bàn<span className="required-mark">*</span></label>
    <input className={'text-input' + (v ? '' : ' input-border-error')} value={v} onChange={(e) => setV(e.target.value)} placeholder="Nhập mã bàn" />
    {!v && <div className="field-error on">{msg('E001-01', 'mã bàn')}</div>}</div></div>;
}
function TextDisabled() { return <div className="form-grid" style={w(360)}><div className="field span-12"><label className="field-label" htmlFor="ex-text-disabled">Mã quầy</label><input id="ex-text-disabled" className="text-input" value="Q01" disabled readOnly /></div></div>; }   /* nhãn nối với ô — axe ②c bắt «thiếu label» 19/10/2026 */

/* ── multi-line-text ── */
function MultiEmpty() { const [v, setV] = useState(''); return <div className="form-grid" style={w(480)}><div className="field span-12"><label className="field-label">Ghi chú</label><AppCounterInput multiline maxLength={1000} value={v} onChange={(e) => setV(e.target.value)} placeholder="Nhập ghi chú" /></div></div>; }
function MultiFilled() { const [v, setV] = useState('Thân nhân đến sớm 15 phút, đã hướng dẫn chờ tại khu vực tiếp đón.'); return <div className="form-grid" style={w(480)}><div className="field span-12"><label className="field-label">Ghi chú</label><AppCounterInput multiline maxLength={1000} value={v} onChange={(e) => setV(e.target.value)} placeholder="Nhập ghi chú" /></div></div>; }
function MultiError() {
  const [v, setV] = useState('');
  return <div className="form-grid" style={w(480)}><div className="field span-12"><label className="field-label">Lý do hủy<span className="required-mark">*</span></label>
    <AppCounterInput multiline className={'ta' + (v ? '' : ' input-border-error')} maxLength={1000} value={v} onChange={(e) => setV(e.target.value)} placeholder="Nhập lý do hủy"
      error={!v ? <span className="field-error on">{msg('E001-04', 'hủy')}</span> : null} /></div></div>;
}

/* ── date ── */
function DateEmpty() { const [r, setR] = useState({ from: '', to: '' }); return <div style={w(320)}><DateRange dateFrom={r.from} dateTo={r.to} onChange={(from, to) => setR({ from, to })} onClear={() => setR({ from: '', to: '' })} /></div>; }
function DateDefault() {
  const t = new Date(); const [r, setR] = useState({ from: dmy(t), to: dmy(new Date(t.getTime() + 7 * 86400000)) });
  return <div style={w(320)}><DateRange dateFrom={r.from} dateTo={r.to} onChange={(from, to) => setR({ from, to })} onClear={() => setR({ from: '', to: '' })} /></div>;
}
function DateOneDay() { const t = dmy(new Date()); const [r, setR] = useState({ from: t, to: t }); return <div style={w(320)}><DateRange dateFrom={r.from} dateTo={r.to} onChange={(from, to) => setR({ from, to })} onClear={() => setR({ from: '', to: '' })} /></div>; }

/* ── checkbox ── */
function ChkDefault() { const [a, setA] = useState(false); return <label className="chk"><input type="checkbox" checked={a} onChange={(e) => setA(e.target.checked)} /> Gửi thông báo cho thân nhân</label>; }
function ChkChecked() { const [a, setA] = useState(true); return <label className="chk"><input type="checkbox" checked={a} onChange={(e) => setA(e.target.checked)} /> Có vách ngăn</label>; }
function ChkDisabled() { return <div className="sd-row"><label className="chk"><input type="checkbox" disabled /> Đang khoá</label><label className="chk"><input type="checkbox" checked disabled readOnly /> Đã tích và khoá</label></div>; }

/* ── switch ── */
function SwOff() { const [on, setOn] = useState(false); return <div className="sd-row"><Switch checked={on} onChange={setOn} aria-label="Cho phép thăm gặp" /><span>{on ? 'Bật' : 'Tắt'}</span></div>; }
function SwOn() { const [on, setOn] = useState(true); return <div className="sd-row"><Switch checked={on} onChange={setOn} aria-label="Cho phép thăm gặp" /><span>{on ? 'Bật' : 'Tắt'}</span></div>; }
function SwDisabled() { return <div className="sd-row"><Switch checked disabled aria-label="Cho phép thăm gặp" /><span className="sd-muted">khoá</span></div>; }

/* ── breadcrumb ── */
/* đủ tầng như màn thật — dùng chung bộ mẫu BC_SAMPLES (gọi hàm khung, hằng tên menu thật), không gõ cứng tên cấp */
function Bc2() { return <Breadcrumb items={bcDemo(BC_SAMPLES.list)} />; }
function Bc3() { return <Breadcrumb items={bcDemo(BC_SAMPLES.detail)} />; }
function BcHref() { return <Breadcrumb items={bcDemo(BC_SAMPLES.create, '#/component/breadcrumb')} />; }

/* ── stepper ── */
const STEPS = ['Thông tin quầy', 'Buồng thăm gặp', 'Suất riêng'];
function Steps({ step, onPick }) {
  return <div className="stepper">{STEPS.map((name, i) => <span key={name} style={{ display: 'contents' }}>{i > 0 && <div className="step-line" />}
    <div className={'step' + (i + 1 === step ? ' is-current' : '') + (i + 1 < step ? ' is-done' : '')} onClick={onPick && i + 1 < step ? () => onPick(i + 1) : undefined} style={onPick && i + 1 < step ? { cursor: 'pointer' } : undefined}>
      <span className="step-number">{i + 1 < step ? '✓' : String(i + 1)}</span><span className="step-title">{name}</span></div></span>)}</div>;
}
function StepFirst() { return <div style={w(560)}><Steps step={1} /></div>; }
function StepMiddle() { return <div style={w(560)}><Steps step={2} /></div>; }
function StepBack() { const [s, setS] = useState(3); return <div style={w(560)}><Steps step={s} onPick={setS} />{s < 3 && <AppButton className="btn" style={{ marginTop: 8 }} onClick={() => setS(3)}>Về lại bước 3</AppButton>}</div>; }

/* ── page-actions ── */
function PaCreate() { return <PageHeadActions actions={[{ id: 'exPaHuy', label: 'Hủy', left: true, iconRaw: ICON.cancel }, { id: 'exPaNhap', label: 'Lưu nháp', iconRaw: ICON.draft }, { id: 'exPaLuu', label: 'Lưu và kích hoạt', className: 'form-btn form-btn-primary', iconRaw: ICON.save }]} />; }
function PaEdit() { return <PageHeadActions actions={[{ id: 'exPaSuaHuy', label: 'Hủy', left: true, iconRaw: ICON.cancel }, { id: 'exPaSuaLuu', label: 'Lưu', className: 'form-btn form-btn-primary', iconRaw: ICON.save }]} />; }
function PaSteps() { return <PageHeadActions actions={[{ id: 'exPaTruoc', label: 'Quay lại bước trước', left: true, iconRaw: ICON.back }, { id: 'exPaTiep', label: 'Lưu và tiếp tục', className: 'form-btn form-btn-primary', iconRaw: ICON.save }]} />; }

/* ── leave-guard ── */
function LeaveDemo({ id, start, saved }) {
  const [v, setV] = useState(start); const [isSaved, setSaved] = useState(false); const [note, setNote] = useState('');
  const dirty = !isSaved && v !== '';
  const guard = useLeaveGuard(saved ? dirty : v !== '', id);
  return <div style={w(360)}>
    <input className="text-input" value={v} onChange={(e) => { setV(e.target.value); setSaved(false); setNote(''); }} placeholder="Gõ vài chữ rồi bấm Quay lại" />
    <div className="sd-row" style={{ marginTop: 8 }}>
      <AppButton className="btn" onClick={() => guard.attempt(() => setNote('Đã rời trang'))}>Quay lại</AppButton>
      {saved && <AppButton className="btn btn-primary" onClick={() => { guard.release(); setSaved(true); setNote('Đã lưu'); }}>Lưu</AppButton>}
      {note && <span className="sd-muted">{note}</span>}
    </div>{guard.dialog}</div>;
}
const LeaveClean = () => <LeaveDemo id="exRoiTrang1" start="" />;
const LeaveDirty = () => <LeaveDemo id="exRoiTrang2" start="Quầy tiếp đón số 1" />;
const LeaveSaved = () => <LeaveDemo id="exRoiTrang3" start="Quầy tiếp đón số 1" saved />;

/* ── detail-info: lưới nhãn – giá trị theo màn (vc-info Cấu hình thời gian · rd-info Chi tiết quầy) ── */
function InfoVisitConfig() { const rows = [['Thời lượng mặc định', '45 phút'], ['Thời gian gia hạn tối đa', '15 phút'], ['Số lần gia hạn tối đa', '1 lần']]; return <div style={w(560)}><div className="vc-info">{rows.map(([l, v]) => [<div className="vc-info-label" key={l + 'l'}>{l}</div>, <div className="vc-info-value" key={l + 'v'}>{v}</div>])}</div></div>; }
function InfoCounter() { const rows = [['Mã quầy', 'Q01'], ['Tên quầy', 'Quầy tiếp đón chính'], ['Vị trí', 'Cổng số 1']]; return <div style={w(560)}><div className="rd-info">{rows.map(([l, v]) => [<div className="rd-info-label" key={l + 'l'}>{l}</div>, <div className="rd-info-value" key={l + 'v'}>{v}</div>])}</div></div>; }
export default {
  'detail-info': [
    { title: 'Màn Cấu hình thời gian', desc: 'Khối Giới hạn thời lượng ở chế độ Xem dùng lưới nhãn – giá trị vc-info.', Demo: InfoVisitConfig, code: '<div className="vc-info"><div className="vc-info-label">Thời lượng mặc định</div><div className="vc-info-value">45 phút</div>…</div>' },
    { title: 'Màn Chi tiết quầy', desc: 'Tab Thông tin quầy dùng lưới nhãn – giá trị rd-info.', Demo: InfoCounter, code: '<div className="rd-info"><div className="rd-info-label">Mã quầy</div><div className="rd-info-value">Q01</div>…</div>' },
  ],
  'text-input': [
    { title: 'Mặc định', desc: 'Ô 1 dòng trong lưới form, nhãn nằm trên ô.', Demo: TextDefault, code: '<div className="field span-12"><label className="field-label">Tên hiển thị</label><input className="text-input" placeholder="Nhập tên hiển thị" /></div>' },
    { title: 'Bắt buộc, báo lỗi bỏ trống', desc: 'Dấu * đỏ sau nhãn; bỏ trống thì viền đỏ và chữ đỏ E001-01 dưới ô.', Demo: TextRequired,
      code: "<label className=\"field-label\">Mã bàn<span className=\"required-mark\">*</span></label>\n<input className={'text-input' + (v ? '' : ' input-border-error')} value={v} onChange={…} />\n{!v && <div className=\"field-error on\">{msg('E001-01', 'mã bàn')}</div>}" },
    { title: 'Khoá', desc: 'Giá trị không được sửa thì khoá ô, chữ vẫn đọc được.', Demo: TextDisabled, code: '<input className="text-input" value="Q01" disabled readOnly />' },
  ],
  'multi-line-text': [
    { title: 'Mặc định', desc: 'Ô ghi chú tối đa 1000 ký tự, bộ đếm ở hàng chân dưới ô.', Demo: MultiEmpty, code: '<AppCounterInput multiline maxLength={1000} value={v} onChange={(e) => setV(e.target.value)} placeholder="Nhập ghi chú" />' },
    { title: 'Có sẵn nội dung', desc: 'Màn Sửa nạp sẵn nội dung, bộ đếm tính theo số ký tự đang có.', Demo: MultiFilled, code: "<AppCounterInput multiline maxLength={1000} value={v} onChange={(e) => setV(e.target.value)} />" },
    { title: 'Bắt buộc, báo lỗi bỏ trống', desc: 'Lý do bắt buộc bỏ trống thì viền đỏ, chữ đỏ E001-04 nằm bên trái bộ đếm.', Demo: MultiError,
      code: "<AppCounterInput multiline className={'ta' + (v ? '' : ' input-border-error')} maxLength={1000} value={v} onChange={…}\n  error={!v ? <span className=\"field-error on\">{msg('E001-04', 'hủy')}</span> : null} />" },
  ],
  date: [
    { title: 'Mặc định trống', desc: 'Bấm 1 nửa để mở lịch 2 tháng, chọn Từ ngày xong tự chuyển sang Đến ngày.', Demo: DateEmpty, code: "<DateRange dateFrom={from} dateTo={to} onChange={(f, t) => …} onClear={() => …} />" },
    { title: 'Khoảng 7 ngày', desc: 'Từ hôm nay tới 7 ngày sau. Bộ lọc danh sách mặc định để trống ngày để tìm toàn bộ dữ liệu (QD-432).', Demo: DateDefault, code: "<DateRange dateFrom={dmy(today)} dateTo={dmy(today + 7 ngày)} onChange={…} onClear={…} />" },
    { title: 'Khoảng 1 ngày', desc: 'Từ ngày và Đến ngày trùng nhau để lọc đúng 1 ngày; nút X xoá cả khoảng.', Demo: DateOneDay, code: "<DateRange dateFrom={hômNay} dateTo={hômNay} onChange={…} onClear={…} />" },
  ],
  checkbox: [
    { title: 'Mặc định', desc: 'Ô tích kèm nhãn bấm được, bấm vào chữ cũng tích.', Demo: ChkDefault, code: '<label className="chk"><input type="checkbox" checked={a} onChange={(e) => setA(e.target.checked)} /> Gửi thông báo cho thân nhân</label>' },
    { title: 'Đã tích', desc: 'Giá trị mặc định là có thì tích sẵn.', Demo: ChkChecked, code: '<label className="chk"><input type="checkbox" checked={a} onChange={…} /> Có vách ngăn</label>' },
    { title: 'Khoá', desc: 'Khoá cả khi chưa tích và đã tích.', Demo: ChkDisabled, code: '<label className="chk"><input type="checkbox" disabled /> Đang khoá</label>\n<label className="chk"><input type="checkbox" checked disabled readOnly /> Đã tích và khoá</label>' },
  ],
  switch: [
    { title: 'Tắt', desc: 'Công tắc kèm chữ Bật hoặc Tắt bên cạnh, có aria-label.', Demo: SwOff, code: "<Switch checked={on} onChange={setOn} aria-label=\"Cho phép thăm gặp\" /><span>{on ? 'Bật' : 'Tắt'}</span>" },
    { title: 'Bật', desc: 'Giá trị mặc định là bật.', Demo: SwOn, code: "<Switch checked={on} onChange={setOn} aria-label=\"Cho phép thăm gặp\" />" },
    { title: 'Khoá', desc: 'Không được đổi thì khoá công tắc.', Demo: SwDisabled, code: '<Switch checked disabled aria-label="Cho phép thăm gặp" />' },
  ],
  breadcrumb: [
    { title: 'Màn danh sách', desc: 'Tổng quan, nhóm menu rồi tên màn, cấp cuối chữ đậm và không bấm.', Demo: Bc2, code: bcCode(BC_SAMPLES.list) },
    { title: 'Màn con', desc: 'Màn mở từ danh sách (Chi tiết, Tạo, Chỉnh sửa, Lịch theo buồng) thêm 1 cấp, cấp danh sách bấm được, cấp cuối không kèm mã.', Demo: Bc3, code: bcCode(BC_SAMPLES.detail) },
    { title: 'Cấp trên có href', desc: 'Mục cấp trên có href nên Tab tới được và Enter mở được.', Demo: BcHref, code: bcCode(BC_SAMPLES.create, 'href') },
  ],
  stepper: [
    { title: 'Bước đầu', desc: 'Bước hiện tại viền nền nhạt, bước sau chưa tới.', Demo: StepFirst, code: '<div className="step is-current"><span className="step-number">1</span><span className="step-title">Thông tin quầy</span></div>' },
    { title: 'Đang ở bước giữa', desc: 'Bước đã xong tô đặc kèm dấu ✓.', Demo: StepMiddle, code: '<div className="step is-done"><span className="step-number">✓</span>…</div><div className="step-line" /><div className="step is-current">…</div>' },
    { title: 'Bấm bước đã qua', desc: 'Bấm được bước đã qua để quay lại sửa.', Demo: StepBack, code: "<div className=\"step is-done\" onClick={() => setStep(1)} style={{ cursor: 'pointer' }}>…</div>" },
  ],
  'page-actions': [
    { title: 'Màn Tạo', desc: 'Hủy đứng trái; Lưu nháp và Lưu và kích hoạt đứng phải.', Demo: PaCreate, code: "<PageHeadActions actions={[{ id, label: 'Hủy', left: true }, { id, label: 'Lưu nháp' }, { id, label: 'Lưu và kích hoạt', className: 'form-btn form-btn-primary' }]} />" },
    { title: 'Màn Sửa', desc: 'Màn Sửa chỉ có nút Lưu.', Demo: PaEdit, code: "<PageHeadActions actions={[{ id, label: 'Hủy', left: true }, { id, label: 'Lưu', className: 'form-btn form-btn-primary' }]} />" },
    { title: 'Form nhiều bước', desc: 'Quay lại bước trước đứng trái như nút Hủy.', Demo: PaSteps, code: "<PageHeadActions actions={[{ id, label: 'Quay lại bước trước', left: true }, { id, label: 'Lưu và tiếp tục', className: 'form-btn form-btn-primary' }]} />" },
  ],
  'leave-guard': [
    { title: 'Chưa nhập gì', desc: 'Chưa có thay đổi thì Quay lại đi luôn, không hỏi.', Demo: LeaveClean, code: "const guard = useLeaveGuard(dirty, 'dlgRoiTrang')\n<AppButton onClick={() => guard.attempt(quayLai)}>Quay lại</AppButton>\n{guard.dialog}" },
    { title: 'Đang nhập dở', desc: 'Còn thay đổi chưa lưu thì Quay lại mở hộp C001-03.', Demo: LeaveDirty, code: "const guard = useLeaveGuard(dirty, 'dlgRoiTrang')   // dirty = true\n<AppButton onClick={() => guard.attempt(quayLai)}>Quay lại</AppButton>" },
    { title: 'Đã lưu', desc: 'Lưu xong gọi release() thì không hỏi nữa.', Demo: LeaveSaved, code: "onSave = () => { guard.release(); … }\n<AppButton onClick={() => guard.attempt(quayLai)}>Quay lại</AppButton>" },
  ],
};
