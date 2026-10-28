/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Đơn xin Trưởng cơ sở duyệt — các ô nhập dùng chung màn Tạo (Đăng ký tại quầy) và màn Chỉnh sửa đơn ngoại lệ. Cùng thứ tự, cùng ô, cùng id ⇒ 2 màn không lệch nhau.
 * e: dữ liệu đơn { fullName, citizenId, phoneNumber, relationship, studentCode, reason, hasCompanions, companions[], attachments[] }
 * set(field, value): đổi 1 trường · err(id): chữ đỏ dưới ô (màn Sửa); màn Tạo để trống vì engine tự chèn chữ đỏ */
import { useState } from 'react';
import { Svg } from '@/lib/icons';
import { joinText } from '@/lib/joinText';
import { dormitoryRoomText } from '@/data/dormitoryStore';
import { toDisplayDate } from '@/data/appointmentStore';
import { AppButton, AppButtonWithIcon } from '@/components/app/AppButton';
import AppSearchSelect from '@/components/app/AppSearchSelect';
import AppCounterInput from '@/components/app/AppCounterInput';
import AttachmentField from '@/components/app/AttachmentField';
import { RichText } from '@/lib/richText';
import { msg } from '@/lib/msg';
import { allStudents, relationshipOptions } from '@/data/approvalRoute';
import { checkVisitEligibility } from '@/lib/visitEligibility';
import './ExemptionFields.css';

export const MAX_EXEMPT_COMPANIONS = 2;
const COMPANION_LIMIT_HINT = 'Tối đa 03 thân nhân mỗi lượt thăm gặp (Điều 34 Thông tư 79)';
const ICON_REMOVE_ROW = '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>';
const initials = (name) => { const p = String(name).trim().split(/\s+/); return (p.length >= 2 ? p[p.length - 2][0] + p[p.length - 1][0] : p[0].slice(0, 2)).toUpperCase(); };
const studentProfileText = (s) => (s.studentCode !== undefined ? (s.studentCode ? s.studentCode + ' · ' + dormitoryRoomText(s.studentCode) : s.studentCode) : undefined);
const none = () => null;

/* Thẻ người cai nghiện kèm điều kiện thăm gặp và quỹ lượt — dùng chung luồng thường và đơn ngoại lệ */
export function StudentCard({ student, check, selected, onSelect }) {
  const exhausted = !check.ok;
  return (
    <AppButton className={'student-card' + (exhausted ? ' is-locked' : '') + (selected ? ' is-selected' : '')} disabled={exhausted}
      onClick={exhausted ? undefined : onSelect}>
      <div className="student-avatar">{initials(student.fullName)}</div>
      <div className="student-body">
        <div className="student-name">{student.fullName + ' — ' + studentProfileText(student)}{check.ok ? <span className="visit-ok-tag">Đủ điều kiện thăm gặp</span> : null}</div>
        <div className="status-note">{joinText('CCCD: ', <b>{student.citizenId}</b>, ' — Ngày sinh: ', <b>{toDisplayDate(student.birthDate)}</b>)}</div>
        {student.managerName ? <div className="status-note">Cán bộ quản lý: <b>{student.managerName}</b></div> : null}
        {check.ok ? null : <div className="visit-block-reason" data-dieu-kien={check.condition}><Svg raw={'<circle cx="12" cy="12" r="10"/><path d="M12 7v6M12 16.5h.01"/>'} /><RichText text={check.reason} /></div>}</div>
      <div className="student-side">
        <div className={'quota-box' + (exhausted ? ' is-exhausted' : '')}>
          <div className="quota-number">{check.available}</div>
          <div className="quota-label">quỹ thăm còn lại</div>
        </div></div>
    </AppButton>
  );
}

/* Đơn ngoại lệ: thân nhân chưa liên kết nên bỏ 2 điều kiện về liên kết (3 · 4), các điều kiện của người cai nghiện và quỹ lượt vẫn xét */
const exemptEligibility = (student, excludeCode) => checkVisitEligibility({ ...student, linkStatus: 'APPROVED', visitRightEnabled: true }, new Date(), null, excludeCode);   /* excludeCode: màn Sửa không tính chính lịch này */
const fold = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();

function ExemptStudentPicker({ value, onChange, excludeCode }) {
  const [query, setQuery] = useState('');
  const q = fold(query.trim());
  const chosen = allStudents().find((x) => (x.studentCode || x.fullName) === value);
  const found = q ? allStudents().filter((x) => fold(x.fullName).includes(q) || fold(x.studentCode).includes(q)) : [];
  const list = found.length ? found : (chosen && !q ? [chosen] : []);
  return (
    <>
      <input className="text-input" id="xdNcn" placeholder={msg('I001-35', 'tên hoặc mã hồ sơ người cai nghiện')} value={query} onChange={(x) => setQuery(x.target.value)} />
      {q && !found.length ? <div className="lookup-not-found"><div className="lookup-not-found-desc">{msg('I001-76', query.trim())}</div></div> : null}
      <div className="student-list">
        {list.map((x) => { const studentKey = x.studentCode || x.fullName;
          return <StudentCard key={studentKey} student={x} check={exemptEligibility(x, excludeCode)} selected={studentKey === value} onSelect={() => { onChange(studentKey); setQuery(''); }} />; })}
      </div>
    </>
  );
}

function ExemptCompanions({ list, set, err }) {
  const change = (i, field, v) => set('companions', list.map((c, j) => (j === i ? { ...c, [field]: v } : c)));
  return (
    <div className="exempt-companions">
      {list.map((c, i) => (
        <div className="form-grid exempt-companion-row" key={i}>
          <div className="field span-4"><label className="field-label">{'Họ tên thân nhân đi cùng ' + (i + 1)}<span className="required-mark">*</span></label>
            <AppCounterInput id={'xdDiKemTen' + i} counterId={'xdDiKemTenDem' + i} maxLength={100} placeholder="Nhập họ tên thân nhân" value={c.fullName} onChange={(x) => change(i, 'fullName', x.target.value)} />{err('xdDiKemTen' + i + 'Loi')}</div>
          <div className="field span-4"><label className="field-label">Số căn cước công dân<span className="required-mark">*</span></label>
            <AppCounterInput id={'xdDiKemCccd' + i} counterId={'xdDiKemCccdDem' + i} maxLength={12} inputMode="numeric" placeholder="Nhập 12 chữ số" value={c.citizenId} onChange={(x) => change(i, 'citizenId', x.target.value.replace(/\D/g, ''))} />{err('xdDiKemCccd' + i + 'Loi')}</div>
          <div className="field span-4"><label className="field-label">Quan hệ với người cai nghiện<span className="required-mark">*</span></label>
            <div className="exempt-companion-rel"><AppSearchSelect id={'xdDiKemQh' + i} value={c.relationship} onChange={(v) => change(i, 'relationship', v)} options={[{ value: '', label: 'Chọn quan hệ' }].concat(relationshipOptions())} />
              <AppButtonWithIcon htmlType="button" className="form-btn-remove" title="Bỏ thân nhân đi cùng" aria-label={'Bỏ thân nhân đi cùng ' + (i + 1)} iconRaw={ICON_REMOVE_ROW}
            onClick={() => { const next = list.filter((_, j) => j !== i); set('companions', next); if (!next.length) set('hasCompanions', false); }} /></div>{err('xdDiKemQh' + i + 'Loi')}</div>
        </div>
      ))}
      <AppButtonWithIcon htmlType="button" className="form-btn-add" id="xdThemDiKem" disabled={list.length >= MAX_EXEMPT_COMPANIONS} iconRaw={'<path d="M12 5v14M5 12h14"/>'} iconLinejoin={null}
        title={list.length >= MAX_EXEMPT_COMPANIONS ? COMPANION_LIMIT_HINT : undefined} data-nhac={list.length >= MAX_EXEMPT_COMPANIONS ? COMPANION_LIMIT_HINT : undefined}   /* như AddCompanionButton luồng thường */
        onClick={() => set('companions', list.concat([{ fullName: '', citizenId: '', relationship: '' }]))}>Thêm thân nhân đi cùng</AppButtonWithIcon>
    </div>
  );
}

/* Quan hệ đứng ngay sau Người cai nghiện được thăm · bộ đếm n / max */
/**
 * Thuộc tính của ExemptionFields (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {object} props.e - Dữ liệu đơn gồm thông tin thân nhân, người cai nghiện, quan hệ, lý do, thân nhân đi cùng và tệp đính kèm.
 * @param {function} props.set - Gọi khi đổi 1 ô, nhận tên trường và giá trị mới.
 * @param {function} props.err - Nhận id chữ lỗi và trả phần tử chữ đỏ đặt dưới ô, mặc định trả `null`.
 * @param {string} props.excludeCode - Mã lịch bỏ qua khi xét điều kiện thăm gặp và quỹ lượt, dùng ở màn Sửa để không tính chính lịch đó.
 */
export default function ExemptionFields({ e, set, err = none, excludeCode }) {
  return (
    <div className="form-grid">
      <div className="field span-6"><label className="field-label">Họ tên thân nhân<span className="required-mark">*</span></label>
        <AppCounterInput id="xdHoTen" counterId="xdHoTenDem" maxLength={100} placeholder="Nhập họ tên thân nhân" value={e.fullName} onChange={(x) => set('fullName', x.target.value)} />{err('xdHoTenLoi')}</div>
      <div className="field span-3"><label className="field-label">Số căn cước công dân<span className="required-mark">*</span></label>
        <AppCounterInput id="xdCccd" counterId="xdCccdDem" maxLength={12} inputMode="numeric" placeholder="Nhập 12 chữ số" value={e.citizenId} onChange={(x) => set('citizenId', x.target.value.replace(/\D/g, ''))} />{err('xdCccdLoi')}</div>
      <div className="field span-3"><label className="field-label">Số điện thoại</label>
        <AppCounterInput id="xdSdt" counterId="xdSdtDem" maxLength={10} inputMode="numeric" placeholder="Nhập số điện thoại" value={e.phoneNumber} onChange={(x) => set('phoneNumber', x.target.value.replace(/\D/g, ''))} /></div>
      <div className="field span-12"><label className="field-label">Người cai nghiện được thăm<span className="required-mark">*</span></label>
        <ExemptStudentPicker value={e.studentCode} onChange={(v) => set('studentCode', v)} excludeCode={excludeCode} />{err('xdNcnLoi')}</div>
      <div className="field span-3"><label className="field-label">Quan hệ với người cai nghiện<span className="required-mark">*</span></label>
        <AppSearchSelect id="xdQuanHe" value={e.relationship} onChange={(v) => set('relationship', v)} options={[{ value: '', label: 'Chọn quan hệ' }].concat(relationshipOptions())} />{err('xdQuanHeLoi')}</div>
      <div className="field span-12"><label className="chk"><input type="checkbox" id="xdCoDiKem" checked={!!e.hasCompanions}
        onChange={(x) => { const on = x.target.checked; set('companions', on ? ((e.companions || []).length ? e.companions : [{ fullName: '', citizenId: '', relationship: '' }]) : []); set('hasCompanions', on); }} /> Có thân nhân đi cùng</label>
        {e.hasCompanions ? <ExemptCompanions list={e.companions || []} set={set} err={err} /> : null}</div>
      <div className="field span-12"><label className="field-label">Lý do xin duyệt<span className="required-mark">*</span></label>
        <AppCounterInput multiline id="xdLyDo" counterId="xdLyDoDem" rows={3} maxLength={1000} placeholder="Ví dụ: Thân nhân đến lần đầu, chưa có tài khoản, thiếu giấy xác nhận quan hệ nhân thân" value={e.reason} onChange={(x) => set('reason', x.target.value)} error={err('xdLyDoLoi')} />
        <span className="field-hint">Trưởng cơ sở đọc lý do này để quyết định cho phép thăm gặp</span></div>
      <div className="field span-12"><label className="field-label">Tài liệu đính kèm</label>
        <AttachmentField id="xdTaiLieu" value={e.attachments || []} onChange={(v) => set('attachments', v)} /></div>
    </div>
  );
}
