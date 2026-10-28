/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Dynamic blocks of the page — redrawn from state S whenever the behaviour core calls render */
import { useMemo, useSyncExternalStore } from 'react';
import { Svg } from '@/lib/icons';
import { joinText } from '@/lib/joinText';
import { AppButton, AppButtonWithIcon } from '@/components/app/AppButton';
import AppTag from '@/components/app/AppTag';
import AppTable from '@/components/app/AppTable';
import { checkVisitEligibility } from '@/lib/visitEligibility';
import {
  S, store, MAX_COMPANIONS, initials, relativeStatusLabel, studentProfileText, selectStudent, openRelativeDetail, selectCompanion,
  removeCompanionRow, addCompanionRow, attachSearch, markDocument, removeParticipant, onPrimaryClick, lookupRelative, registerWaitingCheckIn, setRoute, setExempt,
} from './engine';
import { ROUTE_OPTIONS } from '@/data/approvalRoute';
import { RichText } from '@/lib/richText';
import { msg } from '@/lib/msg';
import ExemptionFields, { StudentCard } from '@/components/app/ExemptionFields';   /* thẻ người cai nghiện + ô đơn ngoại lệ dùng chung màn Sửa */
import { VISIT_TYPE_TAG_CLASS } from '@/pages/AppointmentList/listLogic';

export const useStore = () => useSyncExternalStore(store.subscribe, store.getVersion);
const ignore = () => {};
/* a row rebuilt after adding / removing another row: the new search box of a selected row keeps the hint text like the old one (first option) */
const attachSearchRef = (el) => {
  if (!el) return;
  const isFresh = !el.dataset.daGanTim;
  attachSearch(el);
  const input = isFresh && el.selectedIndex > 0 ? el.parentElement.querySelector('.lookup-input') : null;
  if (input) input.placeholder = el.options[0].textContent.trim();
};

const ICON_REMOVE_ROW = '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>';
const ICON_CHECK = '<polyline points="20 6 9 17 4 12"/>';
const ICON_NEXT = '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>';
const ICON_CLOCK = '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>';

/* #ketQuaTra — relative card or "not found" */
export function LookupResult() {
  useStore();
  const result = S.lookupResult;
  if (!result) return null;
  if (result !== 'card') {
    return (
      <div className="lookup-not-found"><div className="lookup-not-found-title"><RichText text={msg('E001-11', 'thân nhân')} /></div>
        <div className="lookup-not-found-desc">{msg('I001-76', result.notFound)}</div></div>
    );
  }
  const relative = S.relative;
  return (
    <div className="relative-card">
      <div className="relative-avatar">{initials(relative.fullName)}</div>
      <div><div className="relative-name">
        <span className="relative-name-link" onClick={openRelativeDetail} title="Xem chi tiết thân nhân">{relative.fullName}</span>
        <AppTag className={'tag tag-dot tag-' + ({ APPROVED: 'approved' }[relative.status] || 'completed')}>{relativeStatusLabel(relative.status)}</AppTag></div>
      <div className="status-note">{joinText('CCCD: ', <b>{relative.citizenId}</b>, relative.phoneNumber ? [' — Số điện thoại: ', <b>{relative.phoneNumber}</b>] : null,
        S.student ? [' — Quan hệ: ', <b>{S.student.relationship}</b>] : null)}</div></div>
    </div>
  );
}

/* #dsNCN — student cards of the relative just found */
export function StudentList() {
  useStore();
  return S.students.map((student, i) => (
    <StudentCard key={i} student={student} check={checkVisitEligibility(student)} selected={S.selectedStudentIndex === i} onSelect={() => selectStudent(i)} />
  ));
}

/* companion table — AppTable rebuilds every cell on each draw (new components function) => redraw the table only when the row list changes;
 * each cell follows S.companionRows by row id so the search box attached to a select is not rebuilt on selection */
const rowById = (id) => S.companionRows.find((row) => row.id === id);
function CompanionSelect({ rowId }) {
  useStore();
  const row = rowById(rowId);
  if (!row) return null;
  return (
    <div className="select-field">
      <select className="o-nhap dc-ten" disabled={row.disabled} value={row.value} ref={attachSearchRef} onChange={(e) => selectCompanion(row, e.target.value)}>
        {row.options.map((option, j) => <option key={row.generation + '-' + j} value={option.value} data-qh={option.relationship} data-gt={option.citizenId} data-ns={option.birthDateText}>{option.label}</option>)}
      </select>
    </div>
  );
}
function CompanionField({ rowId, field, className }) {
  useStore();
  const row = rowById(rowId);
  return <input className={'text-input ' + className} aria-label={field === 'citizenId' ? 'CCCD' : 'Quan hệ'} disabled value={row ? row[field] : ''} onChange={ignore} />;
}
const RemoveRowButton = ({ rowId }) => <AppButtonWithIcon className="form-btn-remove" title="Xóa dòng" onClick={() => removeCompanionRow(rowById(rowId))} iconRaw={ICON_REMOVE_ROW} />;
const COMPANION_COLUMNS = [
  { key: 'index', title: 'STT', thStyle: { width: '44px' }, render: (row, i) => i + 1 },
  { key: 'name', title: 'Thân nhân đi cùng', render: (row) => <CompanionSelect rowId={row.id} /> },
  { key: 'relationship', title: 'Quan hệ', thStyle: { width: '220px' }, render: (row) => <CompanionField rowId={row.id} field="relationship" className="dc-qh" /> },
  { key: 'citizenId', title: 'CCCD', thStyle: { width: '180px' }, render: (row) => <CompanionField rowId={row.id} field="citizenId" className="dc-gt" /> },
  { key: 'remove', title: '', thStyle: { width: '56px' }, render: (row) => <RemoveRowButton rowId={row.id} /> },
];
export function CompanionTable() {
  useStore();
  const ids = S.companionRows.map((row) => row.id).join(',');
  return useMemo(() => <AppTable tableClassName="people-table" rowKey="id" columns={COMPANION_COLUMNS} dataSource={ids.split(',').map((id) => ({ id: +id }))} />, [ids]);
}
/* cùng câu nhắc và cùng cơ chế data-nhac với form Tạo lịch — hiện ngay khi nút khoá, không chờ bấm thử */
const COMPANION_LIMIT_HINT = 'Tối đa 03 thân nhân mỗi lượt thăm gặp (Điều 34 Thông tư 79)';
export function AddCompanionButton() {
  useStore();
  const isFull = S.companionRows.length >= MAX_COMPANIONS;
  return (
    <AppButtonWithIcon className="form-btn-add" id="nutThemDiCung" onClick={addCompanionRow} disabled={isFull} iconRaw={'<path d="M12 5v14M5 12h14"/>'} iconLinejoin={null}
      title={isFull ? COMPANION_LIMIT_HINT : undefined} data-nhac={isFull ? COMPANION_LIMIT_HINT : undefined}>
      Thêm thân nhân đi cùng
    </AppButtonWithIcon>
  );
}

/* #dsNguoiThamGia — document check card per person */
const CHECK_RESULTS = ['Khớp', 'Không khớp', 'Không xuất trình được'];
const ICON_PASSED = <Svg raw={'<polyline points="20 6 9 17 4 12"/>'} />;
const ICON_FAILED = <Svg linejoin={null} raw={'<path d="M18 6L6 18M6 6l12 12"/>'} />;
export function ParticipantList() {
  useStore();
  if (!S.participants) return null;
  if (!S.participants.length) return <div className="lookup-empty">{msg('I001-78', 'thân nhân')}</div>;
  return S.participants.map((person, i) => {
    const result = S.checkResults[i];
    return (
      <div key={i} className={'person-card' + (person.isRegistrant ? ' no-wrap-name' : '') + (result && result !== 'Khớp' ? ' is-mismatch' : '')} data-ket-qua={result}>
        <div><div className="person-name">{person.fullName}{person.isRegistrant ? <span className="tag tag-registrant">Thân nhân đăng ký</span> : null}</div>
          <div className="person-sub">{joinText('CCCD: ', <b>{person.citizenId}</b>, person.birthDateText ? [' — Ngày sinh: ', <b>{person.birthDateText}</b>] : null, person.relationship ? [' — Quan hệ: ', <b>{person.relationship}</b>] : null)}</div></div>
        <div className="person-spacer" />
        <AppButtonWithIcon className="person-remove" onClick={() => removeParticipant(i)} title="Gỡ người này khỏi lượt thăm gặp"
          iconRaw={'<path d="M3 6h18M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/>'}>Bỏ khỏi lượt</AppButtonWithIcon>
        <span className="person-hint"><Svg raw={'<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>'} />Quay bước 1 đổi thân nhân đăng ký</span>
        <div className="person-actions">
          {CHECK_RESULTS.map((choice) => (
            <AppButton key={choice} className={'form-btn' + (result === choice ? (choice === 'Khớp' ? ' form-btn-success' : ' form-btn-danger') : '')} data-chu={S.checkedMarks[i] ? choice : undefined}
              onClick={() => markDocument(i, choice)}>
              {result === choice ? joinText(choice === 'Khớp' ? ICON_PASSED : ICON_FAILED, ' ' + choice) : choice}
            </AppButton>
          ))}
        </div>
      </div>
    );
  });
}

/* #bangDoiChieu — appointment summary table */
export function SummaryTable({ group }) {
  useStore();
  return S.summaryRows.filter((row) => group === undefined || row.group === group).map((row, i) => {
    const hasValue = row.value && !/^Chọn |trước$/.test(row.value);
    const value = !hasValue ? <span style={{ color: 'var(--color-ink-4)', fontWeight: 400 }}>Chưa chọn</span>
      : row.asTag ? <AppTag className={'adjust-tag' + (row.tagClass ? ' ' + ((row.tagClass === 'tag-type' && VISIT_TYPE_TAG_CLASS[row.value]) || row.tagClass) : '')}>{row.value}</AppTag> : row.value;   /* loại hình cùng màu Danh sách */
    return [<div className="adjust-label" key={'l' + i}>{row.label}</div>, <div className="adjust-value" key={'v' + i}>{value}</div>];
  });
}

/* buttons whose text follows the step / edit-mode parameter */
export function NextButton({ id = 'nutTien' }) {
  useStore();
  /* Tiếp tục dùng mũi tên phải, nút lưu cuối giữ dấu tích */
  return <AppButtonWithIcon className="form-btn form-btn-primary" id={id} onClick={onPrimaryClick} iconRaw={S.labels.next === 'Tiếp tục' ? ICON_NEXT : ICON_CHECK}>{S.labels.next}</AppButtonWithIcon>;
}
/* nút chính theo bước — bước 1–2 «Tiếp tục» ở cuối bước, bước 3 nút đăng ký ở đầu màn (1 nút id nutTien, đổi chỗ theo bước) */
export function NextButtonAt({ steps }) {
  useStore();
  return steps.includes(S.step) ? <NextButton /> : null;
}
export function HeaderSaveButton() {
  useStore();
  return <AppButtonWithIcon className="form-btn form-btn-primary is-hidden-block" id="nutLuuDau" onClick={onPrimaryClick} iconRaw={ICON_CHECK}>{S.labels.headerSave}</AppButtonWithIcon>;
}
export function LookupButton() {
  useStore();
  return (
    <AppButtonWithIcon className="form-btn form-btn-primary" onClick={lookupRelative} iconRaw={'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>'} iconLinejoin={null}>
      {S.labels.lookup}
    </AppButtonWithIcon>
  );
}
export const WaitCheckInButton = ({ id }) => (
  <AppButtonWithIcon className="form-btn form-btn-warning is-hidden-block" id={id} onClick={registerWaitingCheckIn} iconRaw={ICON_CLOCK}>Đăng ký</AppButtonWithIcon>
);

/* 2 lựa chọn luồng đăng ký, người tạo chọn ngay từ đầu */
export function RouteChoice() {
  useStore();
  return (
    <div className="route-options" role="radiogroup" id="oLuong">
      {ROUTE_OPTIONS.map((o) => (
        <button type="button" key={o.value} role="radio" aria-checked={S.route === o.value} data-luong={o.value} className={'route-option' + (S.route === o.value ? ' is-selected' : '')} onClick={() => setRoute(o.value)}>
          <span className="route-radio" aria-hidden="true" />
          <span className="route-text"><span className="route-title">{o.label}</span><span className="route-hint">{o.hint}</span></span>
        </button>
      ))}
    </div>
  );
}
/* đơn xin Trưởng cơ sở duyệt cho thân nhân chưa có sổ hoặc tài khoản thăm gặp · ô nhập dùng chung với màn Chỉnh sửa đơn ngoại lệ */
export function ExemptionCard() {
  useStore();
  return <ExemptionFields e={S.exempt} set={setExempt} />;
}
