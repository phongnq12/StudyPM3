/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Create / Edit direct-visit appointment form — React version of the 2 pages lich-hen/tham-gap-truc-tiep/{tao-moi,chinh-sua}.
 * Same DOM skeleton · CSS classes · ids as the HTML pages (the measuring scripts run on both). */
import { ROUTE_OPTIONS, ROUTE_EXEMPTION, ROUTE_LINKED, allStudents, relationshipOptions, urlListPath } from '@/data/approvalRoute';
import { ROUTES } from '@/routes';
import { Fragment, memo, useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react';
import { Svg } from '@/lib/icons';
import { joinText } from '@/lib/joinText';
import { sourceLabel, toDisplayDate } from '@/data/appointmentStore';
import { AppButton, AppButtonWithIcon } from '@/components/app/AppButton';
import { PageHeadActions, PageFooter, StepNav } from '@/components/app/PageActions';
import AppTag from '@/components/app/AppTag';
import AppCounterInput from '@/components/app/AppCounterInput';
import { RichText } from '@/lib/richText';
import { msg } from '@/lib/msg';
import { autoCancelTextOf } from '@/lib/autoCancel';
import { tableLabel } from '@/lib/tableTimeline';   /* hiện Mã — Tên */
import AppointmentStatusTag from '@/components/app/AppointmentStatusTag';
import { useLeaveGuard } from '@/components/app/LeaveGuard';
import AppTable from '@/components/app/AppTable';
import { counterLabel } from '@/lib/tableTimeline';
import { activeCounters } from '@/data/receptionDeskStore';
import { dormitoryRoomText } from '@/data/dormitoryStore';
import { afterColon, initials } from './formLogic';
import { createActions, createModel, relativeStatusLabel, studentProfileText } from './formActions';
import { attachSearch } from './searchableSelect';
import { createVisitDatePicker } from './visitDatePicker';
import { mountTablePicker } from '@/components/app/TablePicker';
import VisitConditionsLink from '@/components/app/VisitConditions';
import Pm1SyncBar from '@/components/app/Pm1SyncBar';
import SearchableSelect from '@/components/app/AppSearchSelect';
import SetupHint from '@/components/app/SetupHint';
import { noCounterParts } from '@/lib/setupHint';
import { checkVisitEligibility } from '@/lib/visitEligibility';
import '@/styles/form.css';
import AttachmentField from '@/components/app/AttachmentField';   /* Tài liệu đính kèm của đơn ngoại lệ */
import { DocumentCheckTable } from '@/components/app/ExemptionInfo';
import ExemptionFields from '@/components/app/ExemptionFields';   /* màn Sửa: trường không sửa được hiện dạng XEM như màn Chi tiết */
import './AppointmentForm.css';
import NotifyRecipientsField from '@/components/app/NotifyRecipientsField';   /* mục chọn thông báo của lịch hẹn */
import { recordNotifyField } from '@/data/notificationStore';

const ICON_BACK = '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>';
const ICON_CHECK = '<polyline points="20 6 9 17 4 12"/>';
const ICON_NEXT = '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>';
const ICON_DRAFT = '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>';
const ICON_CARD = '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h4"/>';
const ICON_DELETE = '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>';
const SummaryRow = ({ d }) => (
  <Fragment>
    <div className="adjust-label">{d.label}</div>
    <div className="adjust-value">{!d.hasValue ? <span style={{ color: 'var(--color-ink-4)', fontWeight: 400 }}>Chưa chọn</span>
      : d.isTag ? <AppTag className={'adjust-tag' + (d.className ? ' ' + d.className : '')}>{d.text}</AppTag> : d.text}</div>
  </Fragment>
);
const LOCKED_RELATIVE_TITLE ='Thân nhân đăng ký là chủ thể của lịch hẹn, không sửa được';

/* mode: 'create' | 'edit' */
export function useAppointmentForm(mode, toast) {
  const [, rerender] = useReducer((n) => n + 1, 0);
  const ref = useRef(null);
  if (!ref.current) ref.current = createActions(createModel(mode), rerender, toast);
  const form = ref.current;
  useEffect(() => {
    document.title = mode === 'edit' ? 'Chỉnh sửa lịch hẹn thăm gặp trực tiếp' : 'Quản lý thăm gặp và gọi điện có hình ảnh';
    /* every change · input · click re-measures the missing-field hint (deferred 1 tick like the HTML page) */
    const deferred = () => setTimeout(form.refreshLock, 0);
    const onEscape = (e) => { if (e.key === 'Escape') form.closeAll(); };
    ['change', 'input', 'click'].forEach((k) => document.addEventListener(k, deferred, true));
    document.addEventListener('keydown', onEscape);
    form.start();
    return () => { ['change', 'input', 'click'].forEach((k) => document.removeEventListener(k, deferred, true)); document.removeEventListener('keydown', onEscape); };
  }, []);
  return form;
}

/* Ô chọn có tìm: component chung components/app/AppSearchSelect.jsx */

const FieldError = ({ model, id }) => (model.errorIds.indexOf(id) < 0 ? null : <span className={'field-error' + (model.errors[id] ? ' on' : '')} id={id}><RichText text={model.errors[id] || ''} /></span>);

/* alignErrorText: red text flush left, 4px under the field — when the grid hint is hidden, measure against the grid */
function alignErrorText(el, anchor) {
  if (!el || !anchor) return;
  el.style.paddingLeft = '0px'; el.style.marginTop = '';
  if (!/^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(anchor.tagName)) {
    if (anchor.id !== 'nhacChuaDu') return;
    if (!anchor.getBoundingClientRect().height) { const grid = document.getElementById('khoiLuoiGio'); if (grid && grid.getBoundingClientRect().height) anchor = grid; }
  }
  const box = anchor.getBoundingClientRect(); if (!box.width) return;
  const distance = el.getBoundingClientRect().top - box.bottom;
  if (Math.abs(distance - 4) > 0.5) el.style.marginTop = (parseFloat(getComputedStyle(el).marginTop) - (distance - 4)) + 'px';
}
const ERROR_ANCHORS = {
  oTraCuuLoi: () => document.getElementById('oTraCuu'), loiTraCuu: () => document.getElementById('oTraCuu'),
  nutNgayHenLoi: () => document.getElementById('nutNgayHen'),
  oThoiLuongLoi: () => document.querySelector('#tlChon .lookup-input') || document.getElementById('tlChon'),
  nhacChuaDuLoi: () => document.getElementById('nhacChuaDu'),
  oBanDaChonLoi: () => document.getElementById('oBanDaChon').parentElement,
  oLoaiHinhLoi: () => document.getElementById('oLoaiHinh').parentElement,
};

/* Companion table — re-renders only when row data changes: AppTable rebuilds cells on every render, which would close an open search box */
const CompanionTable = memo(({ form }) => {
  const columns = [
    { key: 'stt', title: 'STT', thStyle: { width: '56px' }, render: (r, i) => i + 1 },
    { key: 'name', title: 'Thân nhân đi cùng', render: (r) => <SearchableSelect className="o-nhap dc-ten" options={r.options} value={r.value} disabled={r.disabled} uncontrolled onChange={(v) => form.changeCompanion(r.key, v)} /> },
    { key: 'relationship', title: 'Quan hệ', thStyle: { width: '220px' }, render: (r) => <input className="o-nhap dc-qh" aria-label="Quan hệ" disabled defaultValue={r.relationship} /> },
    { key: 'citizenId', title: 'CCCD', thStyle: { width: '180px' }, render: (r) => <input className="o-nhap dc-gt" aria-label="CCCD" disabled defaultValue={r.citizenId} /> },
    { key: 'remove', title: '', thStyle: { width: '56px' }, render: (r) => <AppButtonWithIcon className="form-btn-remove" title="Xóa dòng" onClick={() => form.removeCompanion(r.key)} iconRaw={ICON_DELETE} /> },
  ];
  return <AppTable tableClassName="people-table" rowKey="key" dataSource={form.model.companionRows.map((r) => ({ ...r }))} columns={columns} />;
}, (a, b) => a.signature === b.signature);
const companionSignature = (rows) => JSON.stringify(rows.map((r) => [r.key, r.options, r.disabled]));

export function FormBody({ form }) {
  const M = form.model;
  const gridRef = useRef(null), timelineRef = useRef(null), rendered = useRef({ grid: 0, selection: 0, align: 0 });
  useEffect(() => () => { if (timelineRef.current) timelineRef.current.destroy(); }, []);
  const picker = useRef(null);
  if (!picker.current) picker.current = createVisitDatePicker({ getDate: () => M.visitDate, onPick: (d) => form.setVisitDate(d) });
  /* hỏi khi rời trang sau khi đã nhập */
  const [dirty, setDirty] = useState(false);
  const guard = useLeaveGuard(dirty, 'dlgRoiTrangLH');
  M.leaveRelease = guard.release;
  useEffect(() => {
    /* đánh dấu SAU sự kiện, 1 lần: setState ngay trong pha bắt làm ô controlled mất ký tự đầu (lichsu3 đỏ) */
    let daDanh = false;
    const danh = () => { if (daDanh) return; daDanh = true; setTimeout(() => setDirty(true), 0); };
    const mark = (e) => { if (e.target.closest && e.target.closest('main .card')) danh(); };
    const markClick = (e) => { if (e.target.closest && e.target.closest('main .route-option, main .student-card, main #luoiGio, main #nutThemDiCung, main .quick-link')) danh(); };
    document.addEventListener('input', mark, true); document.addEventListener('change', mark, true); document.addEventListener('click', markClick, true);
    return () => { document.removeEventListener('input', mark, true); document.removeEventListener('change', mark, true); document.removeEventListener('click', markClick, true); };
  }, []);
  /* rời ô bắt buộc còn trống thì báo chữ đỏ ngay; chờ 200ms để lượt chọn trong danh sách xổ xuống kịp ghi giá trị */
  useEffect(() => {
    const onLeave = (e) => {
      const field = e.target.closest && e.target.closest('main .card .field');
      if (!field || (e.relatedTarget && field.contains(e.relatedTarget))) return;
      setTimeout(() => { if (field.contains(document.activeElement)) return; form.blurField([...field.querySelectorAll('[id]')].map((n) => n.id)); }, 200);
    };
    document.addEventListener('focusout', onLeave);
    return () => document.removeEventListener('focusout', onLeave);
  }, [form]);

  useLayoutEffect(() => {
    const done = rendered.current;
    document.querySelectorAll('#khoiDiCung tbody tr').forEach((tr, i) => {
      const row = M.companionRows[i], sel = tr.querySelector('.dc-ten'); if (!row || !sel) return;
      if (sel.value !== row.value) { sel.value = row.value; if (sel.__syncSearch) sel.__syncSearch(); }
      tr.querySelector('.dc-qh').value = row.relationship; tr.querySelector('.dc-gt').value = row.citizenId;
    });
    /* table timeline: mounted once, then fed the new config / the block chosen by the model */
    if (done.grid !== M.timelineVersion) {
      done.grid = M.timelineVersion; done.selection = M.pickVersion;
      if (!M.timeline) { if (timelineRef.current) { timelineRef.current.destroy(); timelineRef.current = null; } }
      else if (!timelineRef.current) timelineRef.current = mountTablePicker(gridRef.current, { ...M.timeline, value: M.pick }, { onChange: form.pickFromTimeline });
      else timelineRef.current.update({ ...M.timeline, value: M.pick });
    }
    if (done.selection !== M.pickVersion) { done.selection = M.pickVersion; if (timelineRef.current) timelineRef.current.setValue(M.pick); }
    if (done.align !== M.alignVersion) {
      done.align = M.alignVersion;
      M.alignQueue.splice(0).forEach((id) => alignErrorText(document.getElementById(id), ERROR_ANCHORS[id] && ERROR_ANCHORS[id]()));
      const first = M.scrollTarget && document.getElementById(M.scrollTarget); M.scrollTarget = null;
      if (first) { const r = first.getBoundingClientRect(); if (r.top < 0 || r.bottom > (innerHeight || 0)) first.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    }
  });

  const stepClass = (step, extra) => 'card' + (extra ? ' ' + extra : '') + (step !== M.step ? ' is-hidden-block' : '');
  const lock = M.lock, complete = lock.missing.length === 0, missingText = afterColon(lock.missing);
  const nextTip = complete ? '' : 'Còn thiếu: ' + missingText.join(', ');
  const r = M.relative, s = M.student;
  const noteLength = M.staffNote.length;
  /* Lưu nháp mọi bước · Quay lại bước trước · Tiếp tục (mũi tên phải) · Lưu nháp · Lưu và gửi duyệt — bước cuối nút lưu chính đứng cuối */
  const backBtn = { id: 'nutLui', label: 'Quay lại bước trước', left: true, hidden: M.step === 1, onClick: form.back, iconRaw: ICON_BACK };
  const draftBtn = { id: 'nutLuuNhap', label: 'Lưu nháp', onClick: form.saveDraft, disabled: M.buttonsDisabled, iconRaw: ICON_DRAFT };
  const mainBtn = { id: 'nutTien', label: M.nextLabel, className: 'form-btn form-btn-primary', onClick: form.next, title: nextTip, disabled: M.buttonsDisabled, iconRaw: M.step < 3 ? ICON_NEXT : ICON_CHECK };
  const allActions = M.step < 3
    ? [backBtn, mainBtn, draftBtn, M.mode === 'edit' && { id: 'nutGuiDuyet', label: M.saveLabel, className: 'form-btn form-btn-primary', /* màu xanh chủ đạo */ onClick: form.submitNow, disabled: M.buttonsDisabled, iconRaw: ICON_CHECK }]
    : [backBtn, draftBtn, mainBtn];
  /* Quay lại + Tiếp tục xuống cuối bước; bước cuối nút lưu chính ở đầu màn */
  const navIds = M.step < 3 ? ['nutLui', 'nutTien'] : ['nutLui'];
  const actions = allActions.filter((a) => a && !navIds.includes(a.id));
  const navActions = allActions.filter((a) => a && navIds.includes(a.id));

  const missingHint = (
    <div className={'missing-hint' +(lock.step === 3 ? ' is-hidden-block' : '') + (complete ? ' is-enough' : '')} id="nhacThieu">
      {complete ? <><Svg raw={'<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>'} /><div>{msg('I001-81')}</div></>
        : <><Svg raw={'<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>'} /><div><RichText text={msg('W001-12', missingText.join('**, **'))} /></div></>}
    </div>
  );
  return (
    <>
      <div className="page-head">
        <AppButtonWithIcon className="page-head-back" onClick={() => guard.attempt(() => { location.href = M.mode === 'edit' ? urlListPath() : ROUTES.appointmentList; })} title="Quay lại danh sách" aria-label="Quay lại" iconRaw={ICON_BACK} />
        <div className="page-head-text">
          {M.mode === 'edit'
            ? <><div className="page-head-row"><h1 id="tdChinh">{M.editCode && M.title.indexOf(M.editCode) < 0 ? M.title + ' ' + M.editCode : M.title}</h1><AppointmentStatusTag status={M.statusTag && M.statusTag.code} id="tdTag" /></div></>
            : <h1>{M.title}</h1>}
        </div>
        <PageHeadActions actions={actions} />
      </div>
      {missingHint}
      {M.mode === 'edit' && M.statusTag && M.statusTag.code === 'REJECTED' && autoCancelTextOf(M.editCode) && <div className="eff is-warning" id="hanTuHuy"><RichText text={msg('W001-24', autoCancelTextOf(M.editCode))} /></div>}   {/* */}

      <div className="stepper" id="daiBuoc">
        {['Người nghiện và thân nhân', 'Khung giờ và buồng thăm gặp', 'Đối chiếu và xác nhận'].map((name, i) => (
          <Fragment key={name}>
            {i > 0 && <div className="step-line" />}
            <div className={'step' + (i + 1 === M.step ? ' is-current' : '') + (i + 1 < M.step ? ' is-done' : '')} data-b={i + 1}
              onClick={i + 1 < M.step ? () => { for (let k = M.step; k > i + 1; k--) form.back(); } : undefined}>
              <span className="step-number">{i + 1 < M.step ? '✓' : String(i + 1)}</span>
              <span className="step-title">{name}</span>
            </div>
          </Fragment>
        ))}
      </div>

      <div className={stepClass(1)} data-buoc="1">
        <h2 className="card-title">Nguồn đặt lịch</h2>
        {/* Sửa: Nguồn đặt lịch không đổi được ⇒ dạng Xem (nhãn · giá trị) như Chi tiết */}
        {M.mode === 'edit' ? (
          <div className="adjust exempt-info">
            <div className="adjust-label">Nguồn đặt lịch</div>
            <div className="adjust-value">{M.source ? sourceLabel(M.source) : 'Cán bộ đặt hộ'}</div>
          </div>
        ) : (
        <div className="option-group">
          <div className="locked-value" title={M.sourceTitle}>
            <Svg raw={'<path d="M20 6 9 17l-5-5"/>'} />{M.source ? ' ' + sourceLabel(M.source) + ' ' : 'Cán bộ đặt hộ'}
          </div>
        </div>)}
      </div>

      {/* Tách màn ngoại lệ: màn Tạo mới chỉ còn luồng đã có sổ/tài khoản nên không có khối luồng; màn Sửa hiện luồng của lịch dạng Xem vì không đổi được */}
      {M.mode === 'edit' && <div className={stepClass(1)} data-buoc="1" id="khoiLuong">
        <h2 className="card-title">Luồng đăng ký</h2>
        <div className="adjust exempt-info">
          <div className="adjust-label">Luồng đăng ký</div>
          <div className="adjust-value">{(ROUTE_OPTIONS.find((o) => o.value === M.route) || {}).label || '—'}</div>
        </div>
      </div>}

      <div className={stepClass(1, M.route === ROUTE_EXEMPTION ? '' : 'is-hidden')} data-buoc="1" id="khoiXinDuyet">
        <h2 className="card-title">Đơn xin Trưởng cơ sở duyệt</h2>
        {/* đơn ngoại lệ sửa được hết như Nháp — cùng ô, cùng thứ tự, cùng kiểm tra với màn Tạo (components/app/ExemptionFields) */}
        <ExemptionFields e={M.exempt} set={form.setExempt} err={(id) => <FieldError model={M} id={id} />} excludeCode={M.mode === 'edit' ? M.editCode : undefined} />
      </div>

      <div className={stepClass(1, M.route === ROUTE_LINKED ? '' : 'is-hidden')} data-buoc="1">
        <h2 className="card-title">Thân nhân người cai nghiện</h2>
        <div className="lookup">
          <div className={'lookup-field' + (M.lookupErrorVisible ? ' is-error' : '')}>
            <input className={'text-input' + (M.borders.lookup ? ' input-border-error' : '')} id="oTraCuu" placeholder="Nhập số căn cước công dân hoặc số điện thoại (Đây là mục bắt buộc)"
              value={M.lookupText} readOnly={M.lookupReadOnly} title={M.lookupReadOnly ? LOCKED_RELATIVE_TITLE : undefined}
              onChange={(e) => form.typeLookup(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); form.lookup(); } }} />
            <FieldError model={M} id="oTraCuuLoi" />
            <AppButtonWithIcon className="lookup-scan" onClick={form.openScan} disabled={M.lookupLocked} aria-label="Quẹt thẻ" iconRaw={ICON_CARD}
              title={M.lookupLocked ? LOCKED_RELATIVE_TITLE : 'Quẹt thẻ căn cước công dân'} />
          </div>
          <div className={'input-error' + (M.lookupErrorVisible ? ' is-visible' : '')} id="loiTraCuu">{M.lookupError}</div>
          <AppButtonWithIcon className="form-btn form-btn-primary" onClick={form.lookup} disabled={M.lookupLocked} iconRaw={'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>'} iconLinejoin={null}
            title={M.lookupLocked ? LOCKED_RELATIVE_TITLE : undefined}>{M.lookupButtonLabel}</AppButtonWithIcon>
        </div>
        <div id="ketQuaTra">
          {M.lookupResult && M.lookupResult.notFound !== undefined && (
            <div className="lookup-not-found"><div className="lookup-not-found-title"><RichText text={msg('E001-11', 'thân nhân')} /></div><div className="lookup-not-found-desc">{msg('I001-76', M.lookupResult.notFound)}</div></div>
          )}
          {M.lookupResult === 'card' && r && (
            <div className="relative-card">
              <div className="relative-avatar">{initials(r.fullName)}</div>
              <div>
                <div className="relative-name"><span className="relative-name-link" onClick={form.openDetail} title="Xem chi tiết thân nhân">{r.fullName}</span><AppTag className={'tag tag-dot tag-' + ({ APPROVED: 'approved' }[r.status] || 'completed')}>{relativeStatusLabel(r.status)}</AppTag></div>
                <div className="status-note">{joinText('CCCD: ', <b>{M.maskedCitizenId && r.citizenId === M.maskedCitizenId ? '—' : r.citizenId}</b>, r.phoneNumber ? [' — Số điện thoại: ', <b>{r.phoneNumber}</b>] : null, s ? [' — Quan hệ: ', <b>{s.relationship}</b>] : null)}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={stepClass(1, M.route === ROUTE_LINKED && M.showStudents ? '' : 'is-hidden')} id="khoiNCN" data-buoc="1">
        <div className="card-title-row"><h2 className="card-title">Người cai nghiện</h2><span className="card-title-tools"><Pm1SyncBar onSync={form.resyncPm1} /><VisitConditionsLink /></span></div>
        <div className="student-list" id="dsNCN">
          {r && r.students.map((x, i) => {
            /* chuỗi điều kiện cấp người cai nghiện: không đạt ⇒ quỹ hiện 0 + lý do, thẻ khoá */
            const check = checkVisitEligibility(x, new Date(), null, M.mode === 'edit' ? M.editCode : undefined), noQuota = !check.ok;   /* màn Sửa không tính chính lịch này */
            return (
              <AppButton key={i} className={'student-card' + (noQuota ? ' is-locked' : '') + (i === M.studentIndex ? ' is-selected' : '')} disabled={noQuota}
                onClick={noQuota || M.studentsLocked ? undefined : () => form.selectStudent(i)} style={M.studentsLocked ? { pointerEvents: 'none' } : undefined} title={M.studentsLocked ? 'Người cai nghiện được giữ nguyên' : undefined}>
                <div className="student-avatar">{initials(x.fullName)}</div>
                <div className="student-body">
                  <div className="student-name">{x.fullName + ' — ' + studentProfileText(x)}{check.ok ? <span className="visit-ok-tag">Đủ điều kiện thăm gặp</span> : null}</div>
                  <div className="status-note">CCCD: <b>{x.citizenId}</b> — Ngày sinh: <b>{toDisplayDate(x.birthDate)}</b></div>
                  {x.managerName ? <div className="status-note">Cán bộ quản lý: <b>{x.managerName}</b></div> : null}
                  {check.ok ? null : <div className="visit-block-reason" data-dieu-kien={check.condition}><Svg raw={'<circle cx="12" cy="12" r="10"/><path d="M12 7v6M12 16.5h.01"/>'} /><RichText text={check.reason} /></div>}
                </div>
                <div className="student-side">
                  <div className={'quota-box' + (noQuota ? ' is-exhausted' : '')}>
                    <div className="quota-number">{check.available}</div>
                    <div className="quota-label">quỹ thăm còn lại</div>
                  </div>
                </div>
              </AppButton>
            );
          })}
        </div>
        <FieldError model={M} id="oNCNLoi" />   {/* lỗi chọn người cai nghiện nằm dưới danh sách người cai nghiện */}
      </div>

      <div className={stepClass(1)} data-buoc="1" ref={(e) => { if (e) e.style.setProperty('display', 'none', 'important'); }}>
        <h2 className="card-title">Người cai nghiện và thân nhân</h2>
        <div className="form-grid">
          <div className="field span-12">
            <label className="field-label">Người cai nghiện<span className="required-mark">*</span></label>
            <SearchableSelect id="oNguoiCN" value="" options={[{ value: '', label: 'Chọn người cai nghiện' }, { value: 'HS-00412', label: 'Trần Văn Bình — 001189004412 — 12/04/1989' }, { value: 'HS-00518', label: 'Lê Minh Cường — 001192005518 — 27/09/1992' }, { value: 'HS-00623', label: 'Phạm Quốc Dũng — 001186006623 — 03/01/1986' }]} />
            <span className="field-hint">Chọn xong hệ thống sẽ báo ngay nếu người này chưa đủ điều kiện thăm gặp</span>
          </div>
          <div className="field span-6">
            <label className="field-label">Thân nhân người cai nghiện<span className="required-mark">*</span></label>
            <SearchableSelect id="oThanNhan" value="Chọn người cai nghiện trước" disabled options={[{ label: 'Chọn người cai nghiện trước' }]} />
            <span className="field-hint">Danh sách chỉ gồm thân nhân đã được duyệt liên kết với người cai nghiện này</span>
          </div>
          <div className="field span-6">
            <label className="field-label">Quan hệ nhân thân</label>
            <input className="text-input" id="oQuanHe" defaultValue="" disabled />
          </div>
        </div>
      </div>

      {/* đơn ngoại lệ ở màn Sửa: Thân nhân đi cùng đã hiện trong khối đơn (dạng XEM) ⇒ ẩn bảng chọn của luồng thường */}
      <div className={stepClass(1, M.showCompanions && !(M.mode === 'edit' && M.route === ROUTE_EXEMPTION) ? '' : 'is-hidden')} id="khoiDiCung" data-buoc="1">
        <h2 className="card-title">Thân nhân đi cùng</h2>
        <CompanionTable form={form} signature={companionSignature(M.companionRows)} />
        <AppButtonWithIcon className="form-btn-add" id="nutThemDiCung" onClick={form.addCompanion} disabled={M.addCompanionDisabled} title={M.addCompanionTitle} data-nhac={M.addCompanionDisabled ? M.addCompanionTitle : undefined} iconRaw={'<path d="M12 5v14M5 12h14"/>'} iconLinejoin={null}>
          Thêm thân nhân đi cùng
        </AppButtonWithIcon>
      </div>

      <div className={stepClass(2)} data-buoc="2">
        <h2 className="card-title">Khung giờ và buồng thăm gặp</h2>
        <div className="form-grid">
          <div className="field span-4">
            <label className="field-label">Loại hình thăm gặp<span className="required-mark">*</span></label>
            <SearchableSelect id="oLoaiHinh" uncontrolled value="Thăm gặp trực tiếp tiêu chuẩn"
              options={[{ label: 'Chọn loại hình thăm gặp', value: '' }, { label: 'Thăm gặp trực tiếp tiêu chuẩn', value: 'Thăm gặp trực tiếp tiêu chuẩn' }]} />
            <FieldError model={M} id="oLoaiHinhLoi" />
          </div>
          {/* Dãy nhà theo người cai nghiện, chỉ đọc. Quầy: mặc định theo dãy nhà, chọn được quầy Hoạt động khác */}
          <div className="field span-4">
            <label className="field-label">Dãy nhà</label>
            <div className="select-field is-readonly"><input className="text-input" id="oDayNha" readOnly value={M.resource ? M.resource.dormitoryName : ''} /></div>
          </div>
          <div className="field span-4">
            <label className="field-label">Quầy tiếp đón<span className="required-mark">*</span></label>
            <SearchableSelect id="oQuay" disabled={!M.resource} value={M.resource && M.resource.counter ? M.resource.counter.code : ''} onChange={form.changeCounter}
              options={[{ label: M.resource ? 'Chọn quầy tiếp đón' : 'Chọn người cai nghiện trước', value: '' }].concat(activeCounters().map((c) => ({ label: counterLabel(c), value: c.code })))} />
            <FieldError model={M} id="oQuayLoi" />
            {form.counterWarning() && <div className="eff is-warning" id="canhBaoQuay"><RichText text={form.counterWarning()} /></div>}
          </div>
          <div className="field span-4">
            <label className="field-label">Ngày thăm gặp<span className="required-mark">*</span></label>
            <div className="date-row">
              <AppButtonWithIcon htmlType="button" className={'text-input date-input' + (M.borders.visitDate ? ' input-border-error' : '')} id="nutNgayHen" onClick={(e) => picker.current.open(e)} icon="calendar" iconClassName="date-icon">
                <span id="nhanNgayHen">{M.visitDateText}</span>
              </AppButtonWithIcon>
              <FieldError model={M} id="nutNgayHenLoi" />
              <a className="quick-link" data-onclick="1" onClick={form.pickToday}>Chọn ngày hôm nay</a>
            </div>
          </div>
          {/* Ô Thời lượng ẩn hẳn: thời lượng chỉnh bằng kéo mép khối trên lịch theo buồng, giá trị vẫn giữ ở ô này */}
          <div className="field span-4" style={{ display: 'none' }}>
            <label className="field-label">Thời lượng<span className="required-mark">*</span></label>
            <SearchableSelect wrapperId="tlChon" id="oThoiLuong" options={M.duration.options} value={M.duration.value} disabled={M.duration.disabled} onChange={form.changeDuration} hasErrorBorder={M.borders.duration} />
            <FieldError model={M} id="oThoiLuongLoi" />
          </div>
          <select id="oGioBatDau" style={{ display: 'none' }} value={M.startTime.value} disabled={M.startTime.disabled} onChange={() => {}}>
            {M.startTime.options.map((o, i) => <option key={i} value={o.value}>{o.label}</option>)}
          </select>
          <input id="oGioKetThuc" value={M.endTime} style={{ display: 'none' }} onChange={() => {}} />
          <div className="span-12" id="khoiLuoiGio" style={{ display: M.gridVisible ? undefined : 'none' }}>
            <div className="form-grid-title">Lịch theo buồng trong ngày</div>
            <div id="luoiGio" ref={gridRef} />
            <span className="field-hint" id="nhacGio"><RichText text={M.timeHint} /></span>
          </div>
          <div className="span-12" id="nhacChuaDu" style={{ display: M.gridHintVisible ? undefined : 'none' }}>
            <div className="hours-empty">{M.noTable
              ? <SetupHint inline id="huongDanCaiDatBanLH" what="buồng thăm gặp" screen="Cài đặt quầy tiếp đón" to={ROUTES.receptionDeskList} />
              : M.noCounterDorm && M.resourceNotice
                ? (() => { const q = noCounterParts(M.noCounterDorm); return <span id="huongDanThemDayLH"><RichText text={q.truoc} />{q.links.map((l, i) => <Fragment key={l.href}>{i ? ' hoặc ' : ''}<a className="setup-hint-link" href={l.href}>{l.text}</a></Fragment>)}<RichText text={q.sau} /></span>; })()
                : <RichText text={M.resourceNotice || (M.resource && M.resource.counter ? msg('I001-74') : msg('I001-30', 'quầy tiếp đón', 'buồng và giờ còn trống'))} />}</div>   {/* chưa có Quầy ⇒ nhắc chọn Quầy, có Quầy mới nhắc chọn ngày */}
          </div>
          <FieldError model={M} id="nhacChuaDuLoi" />
          <div className={'field span-4' + (M.showTimeRange ? '' : ' is-hidden')} id="khoiThoiGian">
            <label className="field-label">Khung giờ</label>
            <div className="select-field is-readonly"><input className="text-input" id="oThoiGianDaChon" readOnly placeholder="Chọn chỗ trống trên lịch" value={M.selectedTimeRange} /></div>
          </div>
          <div className={'field span-4' + (M.showTable ? '' : ' is-hidden')} id="khoiBan">
            <label className="field-label">Buồng thăm gặp</label>
            <div className="select-field is-readonly"><input className="text-input" id="oBanDaChon" readOnly placeholder="Chọn chỗ trống trên lịch" value={tableLabel(M.table)} /></div>
            <FieldError model={M} id="oBanDaChonLoi" />
          </div>
        </div>
      </div>

      {/* đơn ngoại lệ ở màn Sửa: kết quả đối chiếu giấy tờ lúc đăng ký tại quầy, dạng XEM — đứng đầu bước 3 như màn Tạo */}
      {M.mode === 'edit' && M.route === ROUTE_EXEMPTION ? <div className={stepClass(3)} data-buoc="3" id="khoiDoiChieu">
        <h2 className="card-title">Đối chiếu CCCD/Giấy tờ tùy thân của thân nhân</h2>
        {M.documentChecks && M.documentChecks.length ? <DocumentCheckTable id="bangDoiChieuChiTiet" checks={M.documentChecks} />
          : <div className="status-note">Chưa check-in. Đối chiếu giấy tờ làm tại quầy tiếp đón khi thân nhân đến.</div>}
      </div> : null}

      <div className={stepClass(3)} data-buoc="3">
        <h2 className="card-title">Người cai nghiện và thân nhân</h2>
        <div className="adjust" id="bangDoiChieu">
          {M.summaryRows.filter((d) => d.group === 0).map((d) => <SummaryRow key={d.label} d={d} />)}
        </div>
      </div>

      <div className={stepClass(3)} data-buoc="3">
        <h2 className="card-title">Khung giờ và buồng thăm gặp</h2>
        <div className="adjust" id="bangDoiChieuLich">
          {M.summaryRows.filter((d) => d.group === 1).map((d) => <SummaryRow key={d.label} d={d} />)}
        </div>
        {M.approvalNotice && M.approvalNotice.canAuto ? (
          <label className="approval-auto-check" htmlFor="chkTuDuyet">
            <input type="checkbox" id="chkTuDuyet" checked={M.autoApprove} onChange={(e) => form.setAutoApprove(e.target.checked)} />
            <span>Hệ thống tự duyệt khi đã đủ điều kiện</span>
          </label>) : null}
        {M.approvalNotice ? (
          <div className={'approval-notice is-' + M.approvalNotice.tone} id="thongBaoDuyet" role="status">
            <Svg raw={M.approvalNotice.tone === 'auto' ? '<circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/>' : '<circle cx="12" cy="12" r="10"/><path d="M12 7v5l3 2"/>'} />
            <div><div className="approval-notice-title"><RichText text={M.approvalNotice.title} /></div><div className="approval-notice-text"><RichText text={M.approvalNotice.text} /></div></div>
          </div>) : null}
      </div>

      <div className={stepClass(3)} data-buoc="3">
        <h2 className="card-title">Thông tin khác</h2>
        <div className="form-grid">
          <div className="field span-12">
            <label className="field-label">Ghi chú của cán bộ</label>
            <AppCounterInput multiline id="oGhiChu" counterId="demGhiChu" rows={3} placeholder="Nhập ghi chú thêm về lượt thăm gặp nếu cần" maxLength={1000} value={M.staffNote} onChange={(e) => form.typeNote(e.target.value)} />
          </div>
        </div>
      </div>

      {/* mục chọn thông báo của lịch hẹn — Cán bộ tổ thăm gặp chọn tại đây, thân nhân theo lịch, chọn thêm người nhận; popup thao tác nạp lại từ đây */}
      <div className={stepClass(3)} data-buoc="3">
        <h2 className="card-title">Gửi thông báo</h2>
        {/* thân nhân chọn ở popup của từng thao tác (danh sách thân nhân lấy theo lịch lúc thao tác), mục này giữ cán bộ nhận của lịch */}
        <NotifyRecipientsField id="nhanThongBao" label="Người nhận thông báo của lịch hẹn" {...(({ value, ...rest }) => rest)(recordNotifyField(M.route))}
          records={[{ counterCode: M.resource && M.resource.counter ? M.resource.counter.code : '', visitorName: M.route === ROUTE_EXEMPTION ? (M.exempt.fullName || '').trim() : (M.relative ? M.relative.fullName : ''),
            companions: M.route === ROUTE_EXEMPTION ? (M.exempt.hasCompanions ? (M.exempt.companions || []).map((c) => ({ name: String(c.fullName || '').trim() })) : []) : M.companionRows.map((x) => ({ name: x.value })).filter((x) => x.name) }]}
          value={recordNotifyField(M.route, M.notifyRecipients).value}
          onChange={(v) => form.setNotifyRecipients(v)}
          hint="Cán bộ tổ thăm gặp và người nhận thêm ở đây được nạp sẵn vào trường Gửi thông báo của mọi thao tác trên lịch hẹn này (gửi duyệt, phê duyệt, hủy…)." />
      </div>

      <StepNav actions={navActions} />
      {/* popups inside the page frame, before the hint — toast dùng vùng chung #vungToast của AppLayout (bỏ bản trùng id, rà soát) */}
      <div style={{ display: 'contents' }} ref={(e) => { form.popupContainer = e; }} />
      {guard.dialog}
    </>
  );
}
