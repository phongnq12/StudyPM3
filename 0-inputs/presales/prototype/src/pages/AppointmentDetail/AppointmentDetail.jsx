/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* WEB-06 · Appointment detail (in-person visit). Ported from the HTML prototype (archived: PM2/0_backup/Prototype_HTML_DongBang_20261007/lich-hen/chi-tiet/index.html)
 * Same DOM frame and CSS classes as the HTML page for pixel parity; elements are App* components on antd. */
import { dormitoryNameOfStudent, dormitoryRoomText, roomOfStudent } from '@/data/dormitoryStore';
import { routeLabel, ROUTE_EXEMPTION, isPendingStatus, isExemption, isExceptionRecord, EXCEPTION_LABEL, canonicalPathOf, inExceptionUrl, urlListPath, urlListLabel, urlEditPath } from '@/data/approvalRoute';
import { appointmentsLayout, DIRECT_LIST_LABEL } from '@/layout/menuConfig';
import { logAction, setStatus, readStatusMap, readHistory, hasLogged } from '@/data/historyStore';
import { useEffect, useMemo, useState } from 'react';
import { joinText } from '@/lib/joinText';
import AppLayout from '@/layout/AppLayout';
import { Svg } from '@/lib/icons';
import { AppButton, AppButtonWithIcon } from '@/components/app/AppButton';
import { PageHeadActions, PageFooter } from '@/components/app/PageActions';
import AppointmentStatusTag from '@/components/app/AppointmentStatusTag';
import { VISIT_TYPE_TAG_CLASS } from '@/pages/AppointmentList/listLogic';
import AppTabs from '@/components/app/AppTabs';
import AppTag from '@/components/app/AppTag';
import AppModal from '@/components/app/AppModal';
import AppTable from '@/components/app/AppTable';
import EmptyRow from '@/components/app/EmptyRow';
import AppSelect, { PAGE_SIZE_OPTIONS } from '@/components/app/AppSelect';
import { hideHint, toast } from '@/lib/legacyUi';
import { msg, msgParts } from '@/lib/msg';
import { autoCancelTextOf, holdHoursOf, runAutoCancel } from '@/lib/autoCancel';
import { tableLabel } from '@/lib/tableTimeline';   /* hiện Mã — Tên */
import { RichText, key } from '@/lib/richText';
import { statusLabel } from '@/data/appointmentStore';
import { loadDetail, quotaOf } from './loadDetail';
import { activeDisciplines, availableInWeek, disciplineStart, disciplineWeekNo, isolationOf, isRewardValid, parseDate, QUOTA_HOLDING_STATUSES, QUOTA_USED_STATUSES, rewardExpiry, weekLabel, weekStartOf } from './quota';
import { WEEK_RANGE_TEXT } from '@/lib/visitWeek';
import './AppointmentDetail.css';
import HistoryTable from '@/pages/ReceptionDeskShared/HistoryTable';   /* 1 khuôn tiến trình dùng chung */
import { readRouteId } from '@/routes';
import { canApproveRecord, approverRoleOf, can, canOpenScreen } from '@/data/accountStore';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '@/routes';
import { applyReward } from '@/data/visitQuotaStore';
import { approvedCodeOf, defaultRecipients, notifyMissing, rejectedCodeOf, sendForRecord } from '@/data/notificationStore';   /* gửi theo trường Gửi thông báo của popup */
import { NOTIFICATION_CODES } from '@/data/notificationSettingsStore';
import NotifyRecipientsField from '@/components/app/NotifyRecipientsField';
import AppCounterInput from '@/components/app/AppCounterInput';   /* ô có bộ đếm dùng chung «n / max» */
import { findAlternativeSlot } from '@/lib/alternativeSlot';
import DialogCloseButton from '@/components/app/DialogCloseButton';
import { RELATIVE_DETAIL_TITLE, findRelative } from '@/lib/relativeDetail';
import RelativeDetailBody from '@/components/app/RelativeDetailBody';
import CancelAppointmentDialog from '@/components/app/CancelAppointmentDialog';
import DeleteAppointmentDialog from '@/components/app/DeleteAppointmentDialog';
import { readCreated, writeCreated } from '@/data/appointmentStore';
import { appointmentEditPath } from '@/routes';
import { ApprovalRounds, DocumentCheckTable, ExemptionInfoGrid, exemptionRows } from '@/components/app/ExemptionInfo';
import { recordRejection } from '@/data/exemptionResend';   /* đơn ngoại lệ: thứ tự và nhãn theo màn Tạo */
import { permittedActions, screenOf, buildAppointments } from '@/pages/AppointmentList/listLogic';
const findRecord = (code) => buildAppointments().find((r) => r.code === code) || null;   /* bản ghi gộp (mục chọn thông báo, thân nhân) cho trường Gửi thông báo */
import { currentAccount } from '@/data/accountStore';
import { HistoryAction } from '@/lib/historyAction';
import PageSelect from '@/components/app/PageSelect';   /* ô «Chọn trang» cạnh chữ «Trang X/Y» */

const BUTTON_DESCRIPTIONS = {
  'Xuất Excel': 'Tải danh sách lịch hẹn đang lọc ra file Excel',
  'Tạo mới': 'Tạo lịch hẹn thăm gặp trực tiếp mới',
  'Bỏ chọn hết': 'Bỏ chọn tất cả lịch hẹn đang chọn',
  'Duyệt': 'Phê duyệt các lịch hẹn đã chọn',
  'Từ chối': 'Từ chối duyệt các lịch hẹn đã chọn',
  'Đóng': 'Đóng cửa sổ này',
  'Hủy': 'Hủy thao tác và đóng cửa sổ này',
  'Hủy và đề xuất lịch thay thế': 'Hủy lịch hẹn này và gửi đề xuất khung giờ khác cho thân nhân',
  'Xác nhận hủy': 'Hủy lịch hẹn với lý do đã chọn',
  'Xác nhận điều chỉnh': 'Lưu khung giờ và buồng thăm gặp mới',
  'Xác nhận dời': 'Lưu ngày giờ mới của lịch hẹn',
  'Tra cứu': 'Tìm thân nhân theo số căn cước công dân hoặc số điện thoại',
  'Thêm thân nhân đi cùng': 'Thêm 1 thân nhân đi cùng vào lịch hẹn',
  'Chọn ngày hẹn': 'Mở lịch để chọn ngày thăm gặp',
  'Chọn ngày hôm nay': 'Chọn ngày thăm gặp là hôm nay',
  'Giả lập quẹt thẻ': 'Giả lập quẹt thẻ căn cước để điền số tự động',
  'Quay lại bước trước': 'Quay lại bước trước, giữ nguyên thông tin đã nhập',
  'Chỉ chọn khung giờ, để hệ thống tự xếp buồng': 'Chỉ chọn khung giờ, hệ thống tự xếp buồng còn trống',
  'Điều chỉnh thời gian và buồng thăm gặp': 'Đổi khung giờ và buồng thăm gặp của lịch hẹn',
  'Hủy lịch hẹn': 'Hủy lịch hẹn này',
  'Áp dụng': 'Áp dụng khen thưởng đã chọn cho tuần này',
  'Quay lại': 'Quay lại, không thực hiện thao tác',
  'Trang trước': 'Xem trang trước',
  'Trang sau': 'Xem trang sau',
};

/* Status code => chip color class */
const STATUS_CLASS = {
  PENDING_APPROVAL: 'status-pending-approval', PENDING_HEAD_APPROVAL: 'status-pending-approval', APPROVED: 'status-approved', CHECKED_IN: 'status-checked-in', IN_PROGRESS: 'status-in-progress',
  COMPLETED: 'status-completed', CANCELLED: 'status-cancelled', ABSENT: 'status-absent', REJECTED: 'status-rejected', DRAFT: 'status-draft',
};
/* tag trạng thái chung với Danh sách và màn Sửa */
function StatusTag({ code }) { return <AppointmentStatusTag status={code} />; }
const Empty = () => <span style={{ color: 'var(--color-ink-4)' }}>—</span>;
/* loại hình thăm gặp lấy cùng màu với Danh sách (VISIT_TYPE_TAG_CLASS) — tag cùng nhãn cùng màu */
const InfoTag = ({ value, tagClass }) => (value ? <AppTag className={'adjust-tag' + (tagClass ? ' ' + ((tagClass === 'tag-type' && VISIT_TYPE_TAG_CLASS[value]) || tagClass) : '')}>{value}</AppTag> : '');

/* Two-column label · value block (.dc) */
function InfoGrid({ id, rows }) {
  return (
    <div className="adjust" id={id}>
      {rows.map(([label, value]) => [
        <div className="adjust-label" key={label + 'l'}>{label}</div>,
        <div className="adjust-value" key={label + 'v'}>{value === '' || value == null ? <Empty /> : value}</div>,
      ])}
    </div>
  );
}

function VisitorCard({ visitor, onOpen }) {
  return (
    <div className={'person-box' + (visitor.isRegistrant ? ' is-primary' : '')}>
      <div className="person-head"><a className="person-name-lg record-code-link" data-onclick="1" onClick={onOpen} title="Xem thông tin thân nhân">{visitor.fullName}</a>
        {visitor.isRegistrant ? <span className="person-tag">Thân nhân đăng ký</span> : <span className="person-tag person-tag-companion">Thân nhân đi cùng</span>}</div>
      <div className="person-detail">
        <span className="person-key">Quan hệ</span><span className="person-role">{visitor.relationship}</span>
        <span className="person-key">Căn cước</span><span className="person-role">{visitor.citizenId}</span>
        <span className="person-key">Ngày sinh</span><span className="person-role">{visitor.birthDate}</span>
      </div>
    </div>
  );
}

const noWrap = (text, key) => <span key={key} style={{ whiteSpace: 'nowrap' }}>{text}</span>;
const commaList = (arr) => arr.flatMap((el, i) => (i ? [', ', el] : [el]));
/* Khối quỹ lượt — Bản 1: số còn lại to + thanh 1 ô = 1 lượt (chữ trong ô) + sổ cộng trừ + 2 khối riêng kỷ luật · lượt thưởng.
 * Khu cách ly (Đưa vào quản lý tại khu dành riêng): cả tuần TẠM DỪNG, không có phép tính lượt, không áp dụng khen thưởng.
 * Phê bình · cảnh cáo: trừ 1 lượt mỗi tuần, vẫn áp dụng khen thưởng được. */
const LOCK_ICON = '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>';
const dm = (d) => String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0');
const dmy = (d) => dm(d) + '/' + d.getFullYear();
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const WEEKDAY_SHORT = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

function Quota({ detail, onApply, onOpenItem }) {
  const quota = detail.quota, week = quota.week;
  const weekStart = weekStartOf(parseDate(week.fromDate)), nextWeek = addDays(weekStart, 7);
  const disciplines = activeDisciplines(quota);
  const isolation = isolationOf(quota);
  const isolationEnd = isolation ? addDays(weekStartOf(disciplineStart(isolation)), isolation.weeks * 7 - 1) : null;
  const rewardsIn = week.appliedRewardCodes.length;
  const raw = week.granted + rewardsIn - week.used - week.holding - disciplines.length;
  const available = isolation ? 0 : Math.max(0, raw);
  const usableRewards = quota.rewards.filter((x) => !x.appliedWeek && isRewardValid(x, detail.visitDayLabel));
  const doneRewards = quota.rewards.filter((x) => x.appliedWeek || !isRewardValid(x, detail.visitDayLabel));
  const canApply = !isolation && available <= 0 && usableRewards.length > 0;
  const codeLink = (kind, code) => <a className="record-code-link" data-onclick="1" onClick={() => onOpenItem(kind, code)}>{code}</a>;

  /* Nhật ký biến động trong tuần: mỗi dòng 1 sự kiện có ngày, chỉ hiện khoản phát sinh thật (cách B) */
  const events = [];
  const ev = (date, title, sub, delta, kind) => events.push({ date: date && date > weekStart ? date : weekStart, title, sub, delta, kind, order: events.length });
  if (isolation) {
    ev(weekStart, 'Khoá cả tuần do đưa vào khu cách ly · tuần ' + disciplineWeekNo(isolation, week) + '/' + isolation.weeks, codeLink('discipline', isolation.code), 'Khoá', 'z');
  } else {
    ev(weekStart, 'Cấp lượt tuần mới', null, '+' + week.granted, 'p');
    disciplines.forEach((x) => { const n = disciplineWeekNo(x, week);
      ev(n === 1 ? disciplineStart(x) : weekStart, 'Trừ do kỷ luật ' + x.form.toLowerCase() + ' · tuần ' + n + '/' + x.weeks, codeLink('discipline', x.code), '−1', 'm'); });
    week.appliedRewardCodes.forEach((c) => { const r = quota.rewards.find((y) => y.code === c);
      ev(parseDate(r && r.appliedDate), 'Áp dụng khen thưởng', <>{r ? r.name + ' · ' : ''}{codeLink('reward', c)}</>, '+1', 'p'); });
    const self = (set, n) => n === 1 && set.includes(detail.status);
    if (week.holding) ev(self(QUOTA_HOLDING_STATUSES, week.holding) ? parseDate(detail.createdAt) : weekStart,
      self(QUOTA_HOLDING_STATUSES, week.holding) ? 'Giữ chỗ cho lịch hẹn' : 'Giữ chỗ cho ' + week.holding + ' lịch hẹn',
      self(QUOTA_HOLDING_STATUSES, week.holding) ? detail.code + ' · ' + detail.visitDateTime : null, '−' + week.holding, 'm');
    if (week.used) ev(self(QUOTA_USED_STATUSES, week.used) ? parseDate(detail.visitDateTime) : weekStart,
      self(QUOTA_USED_STATUSES, week.used) ? 'Sử dụng lượt cho lịch hẹn' : 'Sử dụng lượt cho ' + week.used + ' lịch hẹn',
      self(QUOTA_USED_STATUSES, week.used) ? detail.code + ' · ' + detail.visitDateTime : null, '−' + week.used, 'm');
  }
  events.sort((a, b) => a.date - b.date || a.order - b.order);
  const chip = isolation ? <span className="qb-chip is-bad"><Svg raw={LOCK_ICON} />Khu cách ly</span>
    : disciplines.length ? <span className="qb-chip is-bad">Đang kỷ luật</span>
      : <span className="qb-chip is-ok">Được thăm gặp</span>;

  return (
    <div className="qb" id="quyLuot">
      <div className="qb-head">
        <div>
          {isolation
            ? <div className="qb-big"><span className="qb-state">Tạm dừng thăm gặp</span></div>
            : <div className="qb-big"><span className="qb-n">{available}</span><span className="qb-u">lượt còn lại tuần này</span></div>}
          <div className="qb-sub">{isolation
            ? 'Đến hết ' + dmy(isolationEnd) + ' · có lượt lại từ Thứ Hai ' + dm(addDays(isolationEnd, 1))
            : 'Tuần ' + week.from + ' — ' + week.to + ' (' + WEEK_RANGE_TEXT + ') · có lượt mới vào Thứ Hai ' + dm(nextWeek)}</div>
        </div>
        {chip}
      </div>

      <div className="qb-log">
        <div className="qb-log-h">Biến động trong tuần</div>
        {events.map((e) => (
          <div className="qb-log-r" key={e.order}>
            <div className="qb-log-d">{dm(e.date)}<small>{WEEKDAY_SHORT[e.date.getDay()]}</small></div>
            <div className="qb-log-t">{e.title}{e.sub ? <small>{e.sub}</small> : null}</div>
            <span className={'qb-pill is-' + e.kind}>{e.delta}</span>
          </div>
        ))}
        <div className="qb-log-tot"><span>Còn lại tuần này{!isolation && raw < 0 ? <small>{'Phép tính ra ' + raw + ', không tính số âm'}</small> : null}</span><b>{isolation ? 'Tạm dừng' : available}</b></div>
      </div>

      {isolation && week.holding > 0
        ? <div className="qb-warn"><Svg raw={'<circle cx="12" cy="12" r="10"/><path d="M12 7v6M12 16.5h.01"/>'} /><span>{'Có ' + week.holding + ' lịch hẹn đang giữ chỗ trong tuần tạm dừng thăm gặp (tính cả lịch hẹn này). Cần hủy, hoặc dời sang sau ngày ' + dmy(isolationEnd) + '.'}</span></div>
        : null}

      <div className="qb-duo">
        <div className="qb-box">
          <div className="qb-box-h"><b>Kỷ luật đang áp dụng</b><span>{disciplines.length ? disciplines.length + ' quyết định' : 'không có'}</span></div>
          {disciplines.length ? disciplines.map((x) => {
            const n = disciplineWeekNo(x, week), start = weekStartOf(disciplineStart(x));
            return (
              <div className="qb-disc" key={x.code}>
                <div className="qb-steps" aria-label={'Tuần ' + n + ' trên ' + x.weeks}>{Array.from({ length: x.weeks }, (_, step) => <i key={step} className={step + 1 < n ? 'is-done' : step + 1 === n ? 'is-now' : ''} />)}</div>
                <div className="qb-tiny">{x.form + ' · tuần ' + n + '/' + x.weeks + ' · ' + dm(start) + ' → ' + dm(addDays(start, x.weeks * 7 - 1))}</div>
                {codeLink('discipline', x.code)}
              </div>
            );
          }) : <div className="qb-tiny">{msg('I001-77')}</div>}
        </div>
        <div className="qb-box">
          <div className="qb-box-h"><b>Khen thưởng</b>{usableRewards.length ? <span className={'qb-chip ' + (isolation ? 'is-muted' : 'is-ok')}>{usableRewards.length + (isolation ? ' chưa dùng' : ' dùng được')}</span> : <span>không có</span>}</div>
          {usableRewards.map((x) => <div className="qb-rw" key={x.code}><span><a className="record-code-link" data-onclick="1" onClick={() => onOpenItem('reward', x.code)}>{x.name}</a></span><span className="qb-tiny">{'hạn ' + rewardExpiry(x).slice(0, 5)}</span></div>)}
          {isolation
            ? (usableRewards.length ? <div className="qb-tiny is-bad">{msg('E001-39')}</div> : null)
            : (usableRewards.length ? <>
              <AppButtonWithIcon className="form-btn form-btn-primary reward-btn" disabled={!canApply} onClick={onApply} icon="approve">Áp dụng khen thưởng</AppButtonWithIcon>
              {canApply ? null : <div className="qb-tiny">Chỉ dùng khi tuần này đã hết lượt</div>}
            </> : null)}
          {doneRewards.length ? <details className="qb-more"><summary>{'Đã dùng hoặc hết hạn ' + doneRewards.length + ' lượt'}</summary>
            {doneRewards.map((x) => <div className="qb-tiny" key={x.code}>{x.name + ' · ' + (x.appliedWeek ? 'tuần ' + x.appliedWeek : 'hết hạn ' + rewardExpiry(x))}</div>)}
          </details> : null}
        </div>
      </div>
    </div>
  );
}

/* Popup: AppModal (antd Modal) draws the .mask .dlg frame; click backdrop or Escape to close */
const Mask = AppModal;
const CloseBtn = DialogCloseButton;

const WEEK_PHASE_CLASS = { past: 'discipline-past', current: 'discipline-current', upcoming: 'discipline-upcoming' };
const WEEK_PHASE_LABEL = { past: 'Đã trừ', current: 'Tuần này', upcoming: 'Sắp trừ' };

function ItemDialog({ item, detail, onClose }) {
  if (!item) return <Mask id="dlgQuy" open={false} onClose={onClose} labelledBy="dlgQuyTieuDe" dlgClassName="dlg item-dlg"><div className="dlg-h"><h3 id="dlgQuyTieuDe">Chi tiết</h3><CloseBtn onClick={onClose} /></div><div className="dlg-b"><div className="adjust" id="dlgQuyNoiDung" /><div id="dlgQuyThem" /></div><div className="dlg-f"><AppButton className="form-btn" onClick={onClose}>Quay lại</AppButton></div></Mask>;
  const quota = detail.quota;
  const currentWeek = weekLabel(weekStartOf(parseDate(quota.week.fromDate)));
  let rows, extra = null;
  if (item.kind === 'reward') {
    const x = item.value;
    const state = x.appliedWeek
      ? <><span className="tag-applied">{x.appliedWeek === currentWeek ? 'Đã áp dụng tuần này (' + x.appliedWeek + ')' : 'Đã áp dụng tuần ' + x.appliedWeek}</span><div className="tag-applied-sub">Không dùng lại được ở tuần khác</div></>
      : (isRewardValid(x, detail.visitDayLabel) ? 'Chưa áp dụng — dùng được ở 1 tuần bất kỳ đến hết ' + rewardExpiry(x) : 'Hết hạn ngày ' + rewardExpiry(x) + ' — không dùng được nữa');
    /* Nhãn theo màn Xem chi tiết khen thưởng PM1 */
    rows = [['Mã đề xuất', x.code], ['Loại khen thưởng', x.type], ['Ngày ghi nhận', x.recordedDate], ['Cụ thể thành tích', x.achievement],
      ['Chế độ khen thưởng', <div className="tag-list" key="cd">{x.regimes.map((r) => <InfoTag key={r} value={r} tagClass="tag-wrap" />)}</div>],
      ['Số quyết định', x.decisionNo], ['Ngày quyết định', x.decisionDate], ['Người quyết định', x.decider],
      ['Số lượt cộng', '+' + x.visits + ' lượt, dùng 1 lần'], ['Hạn dùng', rewardExpiry(x) + ' (cuối quý của ngày quyết định)'], ['Tình trạng', state]];
  } else {
    const x = item.value, weekNo = disciplineWeekNo(x, quota.week), firstWeekStart = weekStartOf(disciplineStart(x));
    const weeks = []; for (let i = 0; i < x.weeks; i++) { const d = new Date(firstWeekStart); d.setDate(d.getDate() + i * 7); weeks.push(weekLabel(d)); }
    const state = weekNo < 1 ? <span className="tag-applied">Chưa đến thời hạn</span>
      : weekNo <= x.weeks ? <><span className="tag-applied tag-discipline">{'Đang áp dụng · tuần ' + weekNo + '/' + x.weeks}</span><div className="tag-applied-sub">{'Còn ' + (x.weeks - weekNo) + ' tuần bị trừ'}</div></>
        : <><span className="tag-applied tag-expired">Đã hết kỷ luật</span><div className="tag-applied-sub">{'Đã áp dụng xong ' + x.weeks + '/' + x.weeks + ' tuần'}</div></>;
    /* Nhãn và câu hạn chế thăm gặp theo màn Xem chi tiết biên bản kỷ luật PM1 */
    const until = parseDate(x.decisionDate); until.setDate(until.getDate() + x.weeks * 7);
    const p2 = (n) => String(n).padStart(2, '0');
    const restriction = 'Không được thăm gặp thân nhân trong ' + p2(x.weeks) + ' tuần liền kề từ ngày quyết định — đến ngày '
      + p2(until.getDate()) + '/' + p2(until.getMonth() + 1) + '/' + until.getFullYear();
    rows = [['Mã biên bản', x.code], ['Ngày vi phạm', x.violationDate], ['Loại sự cố', x.incidentType], ['Hành vi vi phạm', x.violation],
      ['Hình thức kỷ luật', <InfoTag key="ht" value={x.form} tagClass="tag-wrap tag-penalty" />], ['Lý do', x.reason], ['Số quyết định', x.decisionNo], ['Ngày quyết định', x.decisionDate], ['Người quyết định', x.decider],
      ['Hạn chế thăm gặp', restriction], ['Tình trạng', state]];
    extra = (
      <div className="discipline-list"><div className="discipline-list-title">Các tuần bị trừ</div>
        {weeks.map((w, i) => { const phase = i + 1 < weekNo ? 'past' : i + 1 === weekNo ? 'current' : 'upcoming';
          return <div className={'discipline-week ' + WEEK_PHASE_CLASS[phase]} key={w}><span>{'Tuần ' + (i + 1) + ' · ' + w}</span><span className="discipline-label">{WEEK_PHASE_LABEL[phase] + ' −1'}</span></div>; })}
        <div className="discipline-week discipline-expired"><span>{'Tuần ' + (x.weeks + 1) + ' trở đi'}</span><span className="discipline-label">Hết kỷ luật</span></div>
      </div>
    );
  }
  return (
    <Mask id="dlgQuy" open onClose={onClose} labelledBy="dlgQuyTieuDe" dlgClassName="dlg item-dlg">
      <div className="dlg-h"><h3 id="dlgQuyTieuDe">{item.kind === 'reward' ? 'Chi tiết khen thưởng' : 'Chi tiết kỷ luật'}</h3><CloseBtn onClick={onClose} /></div>
      <div className="dlg-b"><div className="adjust" id="dlgQuyNoiDung">{rows.map(([label, value]) => [<div className="adjust-label" key={label + 'l'}>{label}</div>, <div className="adjust-value" key={label + 'v'}>{value}</div>])}</div><div id="dlgQuyThem">{extra}</div></div>
      <div className="dlg-f"><AppButton className="form-btn" onClick={onClose}>Quay lại</AppButton></div>
    </Mask>
  );
}

export default function AppointmentDetail() {
  const code = readRouteId();
  const initial = useMemo(() => loadDetail(code), [code]);
  if (!initial.notFound && !canOpenScreen(screenOf(initial.detail))) return <Navigate to={ROUTES.appointmentList} replace />;
  /* đơn ngoại lệ ⇔ module ngoại lệ: mở sai module (link cũ, thông báo cũ, lịch đã duyệt) thì chuyển sang đúng đường dẫn */
  if (!initial.notFound) { const want = canonicalPathOf(initial.detail, false); if (want !== location.pathname) return <Navigate to={want + location.search} replace />; }
  return <AppointmentDetailPage code={code} initial={initial} />;
}

function AppointmentDetailPage({ code, initial }) {
  const [detail, setDetail] = useState(initial.detail);
  const [history, setHistory] = useState(initial.history);
  const nowText = () => { const d = new Date(), p = (n) => String(n).padStart(2, '0'); return p(d.getDate()) + '/' + p(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds()); };
  /* mỗi thao tác đổi trạng thái tại Chi tiết ghi 1 dòng Lịch sử thao tác */
  const logHistory = (action, statusBefore, statusAfter, reason, changes = [], note = '') => { const row = logAction(detail.code, action, { statusBefore, statusAfter, reason, changes, note });   /* note = ghi chú hệ thống */ if (statusAfter && statusAfter !== statusBefore) setStatus(detail.code, statusAfter); if (row) setHistory((h) => [...h, row]); };   /* ghi vào kho dùng chung */
  /* đổi trạng thái ⇒ tính lại quỹ lượt tuần (trạng thái đã ghi kho ở logHistory) */
  const withStatus = (prev, status, extra = {}) => { const next = { ...prev, ...extra, status }; return { ...next, quota: quotaOf(next) }; };
  const [tab, setTab] = useState(1);
  const [item, setItem] = useState(null);
  const [relative, setRelative] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickedCode, setPickedCode] = useState('');
  /* Phê duyệt / Từ chối duyệt ngay tại trang chi tiết — chỉ Trưởng cơ sở, chỉ lịch Chờ duyệt */
  const [decision, setDecision] = useState('');        /* '' | 'approve' | 'reject' */
  const [decisionNote, setDecisionNote] = useState('');
  const [decisionError, setDecisionError] = useState('');
  const canDecide = canApproveRecord(detail) && can(screenOf(detail), 'approve', detail);   /* chỉ người duyệt của lịch này · quyền theo màn */
  /* Hủy lịch hẹn: cùng hộp và cùng điều kiện trạng thái với Danh sách (ROW_ACTIONS_BY_STATUS) · cùng bảng quyền với Danh sách (permittedActions) */
  const allowed = permittedActions(detail).map((e) => e.split(':')[0]);
  const canCancel = allowed.indexOf('cancel') >= 0, canEdit = allowed.indexOf('edit') >= 0, canDelete = allowed.indexOf('delete') >= 0;
  const [deleteOpen, setDeleteOpen] = useState(false);
  const confirmDelete = () => {
    logAction(detail.code, 'Xóa lịch hẹn', { statusBefore: detail.status }); setStatus(detail.code, 'DELETED');
    try { const list = readCreated(); const k = list.findIndex((x) => x.code === detail.code); if (k >= 0) { list.splice(k, 1); writeCreated(list); } } catch (e) { /* lịch mẫu: chỉ bỏ khỏi màn */ }
    location.href = urlListPath() + '?deleted=' + encodeURIComponent(detail.code);
  };
  const [cancelOpen, setCancelOpen] = useState(false);
  const recordNow = () => findRecord(detail.code) || { code: detail.code };
  const confirmCancel = ({ reasonLabel, note, recipients, withProposal } = {}) => {
    /* Hủy và đề xuất lịch thay thế ⇒ tìm khung trống gần nhất 7 ngày, gửi kèm thông báo */
    const proposal = withProposal ? findAlternativeSlot(recordNow(), buildAppointments()) : null;
    const sent = sendForRecord(proposal ? NOTIFICATION_CODES.CANCELLED_WITH_PROPOSAL : NOTIFICATION_CODES.CANCELLED, { ...recordNow(), status: 'CANCELLED', proposal }, recipients, { reason: reasonLabel || '' });
    const proposalText = !withProposal ? '' : proposal ? 'Đề xuất lịch thay thế: ' + proposal.visitDate.split('-').reverse().join('/') + ' ' + proposal.visitTime + ' · ' + tableLabel(proposal.tableCode) : 'Không tìm được khung giờ trống trong 7 ngày để đề xuất';
    logHistory(withProposal ? 'Hủy và đề xuất lịch thay thế' : 'Hủy lịch hẹn', detail.status, 'CANCELLED', [reasonLabel, note].filter(Boolean).join(' — '), [], [proposalText, sent].filter(Boolean).join(' · '));
    setDetail((prev) => withStatus(prev, 'CANCELLED')); setCancelOpen(false); toast(sent ? msg('I001-66', 'lịch hẹn ' + key(detail.code)) : msg('I001-09', 'lịch hẹn ' + key(detail.code)));
  };
  /* trường Gửi thông báo của popup Phê duyệt / Từ chối — nạp người chuẩn theo luồng; thông báo đang Tắt ⇒ trường ẩn, không gửi */
  const [decisionNotify, setDecisionNotify] = useState({});
  /* đơn xin ngoại lệ ⇒ dòng APPOINTMENT_EXCEPTION_APPROVED / _REJECTED, còn lại ⇒ dòng thường */
  const decisionCodeOf = (kind) => (kind === 'reject' ? rejectedCodeOf : approvedCodeOf)(recordNow());
  const decisionCode = decisionCodeOf(decision);
  const openDecision = (kind) => { setDecisionNote(''); setDecisionError(''); setDecisionNotify(defaultRecipients(decisionCodeOf(kind), [recordNow()])); setDecision(kind); };
  const confirmDecision = () => {
    if (decision === 'reject' && !decisionNote.trim()) { setDecisionError(msg('E001-04', 'từ chối')); return; }
    if (notifyMissing(decisionCode, [recordNow()], decisionNotify).length) return;
    /* Phê duyệt luôn vào Đã duyệt (bỏ Chờ check-in) */
    const toStatus = decision === 'approve' ? 'APPROVED' : 'REJECTED';
    if (toStatus === 'REJECTED') recordRejection(detail.code, decisionNote);   /* lộ trình duyệt: lý do từ chối của lần hiện tại */
    const sent = sendForRecord(decisionCode, { ...recordNow(), status: toStatus }, decisionNotify, { reason: decisionNote.trim() });
    logHistory(decision === 'approve' ? 'Phê duyệt' : 'Từ chối duyệt', detail.status, toStatus, decisionNote.trim(), [], sent);
    setDetail((prev) => withStatus(prev, toStatus, { rounds: (prev.rounds || []).map((x) => (x.isCurrent ? { ...x, status: toStatus, ...(toStatus === 'REJECTED' ? { rejectReason: decisionNote.trim(), rejectedBy: currentAccount().name + ' (' + currentAccount().role + ')', rejectedAt: nowText() } : {}) } : x)) })); setDecision('');
    if (toStatus === 'REJECTED' && runAutoCancel().indexOf(detail.code) >= 0) setDetail((prev) => withStatus(prev, 'CANCELLED'));   /* từ chối khi đã qua mốc ⇒ hủy ngay */
    toast(msg(decision === 'approve' ? (isExceptionRecord(detail) ? 'I001-67' : 'I001-07') : 'I001-08', 'lịch hẹn ' + key(detail.code)));   /* đơn ngoại lệ duyệt xong chuyển sang Thăm gặp trực tiếp, cùng câu với Danh sách */
  };

  useEffect(() => {
    const onEscape = (e) => { if (e.key === 'Escape') { setItem(null); setPickerOpen(false); setDecision(''); } };
    document.addEventListener('keydown', onEscape); return () => document.removeEventListener('keydown', onEscape);
  }, []);

  const quota = detail.quota;
  const usableRewards = quota.rewards.filter((y) => !y.appliedWeek && isRewardValid(y, detail.visitDayLabel));
  const openRewardPicker = () => {
    if (!usableRewards.length || availableInWeek(quota) > 0 || isolationOf(quota)) return;
    hideHint(); setPickedCode(''); setPickerOpen(true);
  };
  const confirmReward = () => {
    const x = quota.rewards.find((y) => y.code === pickedCode && !y.appliedWeek && isRewardValid(y, detail.visitDayLabel));
    const fresh = quotaOf(detail);   /* kiểm lại trên quỹ mới nhất, không dùng quỹ tính lúc tải trang */
    if (!x || availableInWeek(fresh) > 0 || isolationOf(fresh)) return;
    setPickerOpen(false);
    logHistory('Áp dụng khen thưởng', null, null, (x.name ? x.name + ' · ' : '') + x.code + ' · tuần ' + weekLabel(weekStartOf(parseDate(quota.week.fromDate))));
    applyReward(detail.student.studentCode, x.code, weekLabel(weekStartOf(parseDate(quota.week.fromDate))));   /* lưu lại — màn Tạo mới đọc chung nguồn này */
    const week = quota.week;
    setDetail((prev) => ({ ...prev, quota: { ...prev.quota,
      rewards: prev.quota.rewards.map((y) => (y.code === x.code ? { ...y, appliedWeek: weekLabel(weekStartOf(parseDate(week.fromDate))), appliedDate: dmy(new Date()) } : y)),
      week: { ...prev.quota.week, appliedRewardCodes: prev.quota.week.appliedRewardCodes.concat(x.code) } } }));
    hideHint();
    toast(msg('I001-61', x.code, week.from + ' — ' + week.to));
  };
  const openItem = (kind, itemCode) => {
    const x = (kind === 'reward' ? quota.rewards : quota.disciplines).find((y) => y.code === itemCode);
    if (x) setItem({ kind, value: x });
  };
  const TAB_LABELS = ['Thông tin lịch hẹn', 'Người cai nghiện và thân nhân', 'Lịch sử thao tác'];
  const visitors = detail.visitors.filter((v) => v.isRegistrant).concat(detail.visitors.filter((v) => !v.isRegistrant));

  /* mã không tồn tại: câu MSG-TS-21 (MessageList/common_messages.md), sau mọi hook để giữ đúng thứ tự hook */
  if (initial.notFound) return (
    <AppLayout cluster="appointments"
      breadcrumb={[...appointmentsLayout(DIRECT_LIST_LABEL).breadcrumb, { label: DIRECT_LIST_LABEL, href: '/lich-hen/tham-gap-truc-tiep' }, { label: 'Chi tiết lịch hẹn' }]}>
      <div className="card" id="khongTimThay">
        <div className="empty-state" style={{ height: 'auto', padding: '48px 16px', display: 'grid', justifyItems: 'center', gap: 16 }}>
          <div><RichText text={msg('E001-15', 'lịch hẹn ' + key(code))} /></div>
          <AppButtonWithIcon className="form-btn" onClick={() => { location.href = '/lich-hen/tham-gap-truc-tiep'; }} icon="back">Quay lại</AppButtonWithIcon>
        </div>
      </div>
    </AppLayout>
  );

  /* Đối chiếu giấy tờ khi check-in — đơn ngoại lệ hiện ở tab 1 ngay sau thông tin bước 2, như thứ tự màn Tạo */
  const docCheckCard = (
        <div className="card" id="khoiDoiChieu">
          <h2 className="card-title">Đối chiếu CCCD/Giấy tờ tùy thân của thân nhân</h2>
          {detail.documentChecks && detail.documentChecks.length ? (
            <DocumentCheckTable id="bangDoiChieuChiTiet" checks={detail.documentChecks} />
          ) : (detail.checkin && detail.checkin.done ? (
            <table className="people-table">
              <thead><tr><th>Thân nhân</th><th>Vai trò</th><th>Kết quả</th><th>Thời điểm</th><th>Cán bộ quầy</th></tr></thead>
              <tbody>{visitors.map((v, i) => (
                <tr key={i}><td>{v.fullName}</td><td>{v.isRegistrant ? 'Thân nhân đăng ký' : 'Thân nhân đi cùng'}</td><td>Khớp</td><td>{detail.checkin.at}</td><td>{detail.checkin.by}</td></tr>))}</tbody>
            </table>
          ) : <div className="status-note">Chưa check-in. Đối chiếu giấy tờ làm tại quầy tiếp đón khi thân nhân đến.</div>)}
        </div>
  );

  /* 1 cấu hình cho thanh đầu trang và chân trang */
  const pageActions = [
    canDecide && { id: 'dtPheDuyet', label: 'Phê duyệt', className: 'form-btn form-btn-primary dt-approve', onClick: () => openDecision('approve'), iconRaw: '<path d="M20 6 9 17l-5-5"/>' },
    canDecide && { id: 'dtTuChoi', label: 'Từ chối duyệt', onClick: () => openDecision('reject'), iconRaw: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>', iconLinejoin: null },
    canEdit && { id: 'dtChinhSua', label: 'Chỉnh sửa', className: canDecide ? 'form-btn' : 'form-btn form-btn-primary',   /* có Phê duyệt thì Phê duyệt là nút chủ đạo duy nhất */ onClick: () => { location.href = urlEditPath(detail.code); }   /* Chỉnh sửa trong cùng module của URL đang mở */, iconRaw: '<path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>' },
    canDelete && { id: 'dtXoaLich', label: 'Xóa', className: 'form-btn form-btn-danger is-outline', onClick: () => setDeleteOpen(true), iconRaw: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>' },
    canCancel && { id: 'dtHuyLich', label: 'Hủy lịch hẹn', className: 'form-btn form-btn-danger is-outline', onClick: () => setCancelOpen(true), iconRaw: '<path d="M8 2v4M16 2v4M21 14V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"/><path d="M3 10h18M17 17l4 4M21 17l-4 4"/>' },
  ].filter(Boolean);

  return (
    <AppLayout cluster="appointments" descriptions={BUTTON_DESCRIPTIONS} {...appointmentsLayout(urlListLabel())}
      breadcrumb={[...appointmentsLayout(urlListLabel()).breadcrumb, { label: urlListLabel(), href: urlListPath() }, { label: 'Chi tiết lịch hẹn' }]}
      overlays={<>
        <CancelAppointmentDialog open={cancelOpen} onClose={() => setCancelOpen(false)} onConfirm={confirmCancel} visitTimes={[detail.visitDateTime]} records={cancelOpen ? [recordNow()] : []} />
        <DeleteAppointmentDialog open={deleteOpen} code={detail.code} status={detail.status} onClose={() => setDeleteOpen(false)} onConfirm={confirmDelete} />
        <ItemDialog item={item} detail={detail} onClose={() => setItem(null)} />
        {/* Cùng popup thân nhân với màn Tạo lịch hẹn và Đăng ký tại quầy (lib/relativeDetail.js) */}
        <Mask id="dlgChiTietTN" open={!!relative} onClose={() => setRelative(null)}>
          <div className="dlg-h"><h3>{RELATIVE_DETAIL_TITLE}</h3><CloseBtn onClick={() => setRelative(null)} /></div>
          <div className="dlg-b"><RelativeDetailBody relative={relative} /></div>
          <div className="dlg-f"><AppButton className="form-btn" onClick={() => setRelative(null)}>Quay lại</AppButton></div>
        </Mask>
        <Mask id="dlgQuyetDinh" open={!!decision} onClose={() => setDecision('')} labelledBy="dlgQuyetDinhTieuDe" dlgClassName="dlg dlg-notify">
          <div className="dlg-h"><h3 id="dlgQuyetDinhTieuDe"><RichText text={msgParts(decision === 'approve' ? 'C001-05' : 'C001-06', 'lịch hẹn ' + key(detail.code)).title} /></h3><CloseBtn onClick={() => setDecision('')} /></div>
          <div className="dlg-b">
            <div className="fld"><label>{decision === 'approve' ? 'Lý do phê duyệt' : <>Lý do từ chối<span className="required-mark">*</span></>}</label>
              <AppCounterInput multiline className={'ta' + (decisionError ? ' input-border-error' : '')} id="dlgQuyetDinhLyDo" counterId="demQuyetDinhLyDo" maxLength={1000}
                placeholder={decision === 'approve' ? 'Nhập lý do phê duyệt lịch hẹn này…' : 'Nhập lý do từ chối duyệt lịch hẹn này…'}
                value={decisionNote} onChange={(e) => { setDecisionNote(e.target.value); setDecisionError(''); }} error={<span className={'field-error' + (decisionError ? ' on' : '')} id="dlgQuyetDinhLoi">{decisionError}</span>} /></div>
            {decision === 'reject' && <div className="eff is-warning" id="dlgQuyetDinhHanGiu"><RichText text={msg('W001-23', holdHoursOf())} /></div>}   {/* */}
            {decision && <NotifyRecipientsField id="dlgQuyetDinhNhanTB" code={decisionCode} records={[recordNow()]} value={decisionNotify} onChange={setDecisionNotify} />}
          </div>
          <div className="dlg-f">
            <AppButton className="form-btn" onClick={() => setDecision('')}>Hủy</AppButton>
            <AppButton className={'form-btn ' + (decision === 'approve' ? 'form-btn-primary' : 'form-btn-danger')} id="dlgQuyetDinhXacNhan" onClick={confirmDecision}>{decision === 'approve' ? 'Xác nhận phê duyệt' : 'Xác nhận từ chối'}</AppButton>
          </div>
        </Mask>
        <Mask id="dlgChonThuong" open={pickerOpen} onClose={() => setPickerOpen(false)} labelledBy="dlgChonTieuDe">
          <div className="dlg-h"><h3 id="dlgChonTieuDe">Áp dụng khen thưởng</h3><CloseBtn onClick={() => setPickerOpen(false)} /></div>
          <div className="dlg-b">
            <div className="detail-desc">Chọn 1 khen thưởng để cộng <b>+1 lượt</b> cho tuần <b id="dlgChonTuan">{pickerOpen ? quota.week.from + ' — ' + quota.week.to : ''}</b>.</div>
            <div className="detail-list" id="dsChonThuong">
              {pickerOpen && usableRewards.map((x) => (
                <label className="detail-row" key={x.code}><input type="radio" name="chonThuong" value={x.code} checked={pickedCode === x.code} onChange={() => setPickedCode(x.code)} />
                  <span className="detail-name">{x.name}</span><span className="detail-deadline">{'Hạn dùng ' + rewardExpiry(x)}</span></label>
              ))}
            </div>
          </div>
          <div className="dlg-f">
            <AppButton className="form-btn" onClick={() => setPickerOpen(false)}>Hủy</AppButton>
            <AppButton className="form-btn form-btn-primary" id="nutXacNhanThuong" onClick={confirmReward} disabled={!pickedCode}>Áp dụng</AppButton>
          </div>
        </Mask>
      </>}>

      <div className="status-bar">
        <AppButtonWithIcon className="page-head-back" onClick={() => { location.href = urlListPath(); }} title="Quay lại danh sách" aria-label="Quay lại" icon="back" />
        <div className="dt-chu">
          <div className="dt-row1">
            <h2 className="dt-title">Lịch hẹn <span id="dtMa">{detail.code}</span></h2>
            <span id="dtTT"><StatusTag code={detail.status} /></span>
            {isExemption(detail) && <AppTag className="tag tag-exception" id="dtNgoaiLe" title="Đơn ngoại lệ: Thân nhân chưa có sổ hoặc tài khoản thăm gặp, Trưởng cơ sở duyệt">{EXCEPTION_LABEL}</AppTag>}
          </div>
        </div>
        <span className="spacer" />
        <PageHeadActions actions={pageActions} />
      </div>
      {detail.status === 'REJECTED' && autoCancelTextOf(detail.code) && <div className="eff is-warning" id="dtHanTuHuy"><RichText text={msg('W001-24', autoCancelTextOf(detail.code))} /></div>}   {/* */}

      <AppTabs activeKey={String(tab)} onChange={(k) => setTab(+k)} items={[
        { key: '1', id: 'tab1', label: TAB_LABELS[0], children: <>
        {/* đơn ngoại lệ: khối đơn đứng đầu, thứ tự màn Tạo */}
        {detail.exemption ? <div className="card" id="khoiXinDuyet">
          <h2 className="card-title">{msg('I001-86')}</h2>
          <ExemptionInfoGrid id="dcXinDuyet" rows={exemptionRows(detail.exemption)} />
        </div> : null}
        {/* lộ trình duyệt: hiện khi đã có ít nhất 1 lần bị từ chối — Lần 1, Lần 2, …, lần hiện tại cuối */}
        {(detail.rounds || []).some((x) => x.rejectReason || !x.isCurrent) ? <div className="card" id="khoiLoTrinhDuyet">
          <h2 className="card-title">Lộ trình duyệt</h2>
          <ApprovalRounds rounds={detail.rounds} exemption={!!detail.exemption} statusNode={(code) => <StatusTag code={code} />} />
        </div> : null}
        <div className="card">
          <h2 className="card-title">Thông tin lịch hẹn</h2>
          <InfoGrid id="dcLichHen" rows={[
            ['Nguồn đặt lịch', <InfoTag value={detail.sourceLabel} />],
            ...(detail.approvalRoute ? [['Luồng đăng ký', routeLabel(detail.approvalRoute)]] : []),
            ...(isPendingStatus(detail.status) ? [['Người duyệt', approverRoleOf(detail)]] : []),
            ...(detail.approvalRoute === ROUTE_EXEMPTION && !detail.exemption ? [['Lý do xin duyệt', detail.exemptionReason || '—']] : []),   /* có khối đơn thì lý do nằm trong khối đơn */
            ['Số thân nhân tham gia', detail.visitors.length + ' người'],
            ['Loại hình thăm gặp', <InfoTag value={detail.visitTypeName} tagClass="tag-type" />],
            ['Dãy nhà', <InfoTag value={detail.dormitoryName} tagClass="tag-category" />],
            ['Quầy tiếp đón', <InfoTag value={detail.counterName} tagClass="tag-category" />],
            ['Ngày thăm gặp', detail.visitDayLabel],
            ['Khung giờ', detail.timeSlotLabel],   /* thứ tự theo màn Tạo */
            ['Thời lượng', <InfoTag value={detail.durationLabel} />],
            ['Buồng thăm gặp', <InfoTag value={tableLabel(detail.tableCode)} tagClass="tag-table" />],
          ]} />
        </div>
        {detail.exemption ? docCheckCard : null}
        <div className="card">
          <h2 className="card-title">Thông tin khác</h2>
          <InfoGrid id="dcGhiChu" rows={[['Ghi chú của cán bộ', detail.staffNote], ['Ghi chú của thân nhân', detail.relativeNote]]} />
        </div>
        </> },
        { key: '2', id: 'tab2', label: TAB_LABELS[1], children: <>
        <div className="card">
          <h2 className="card-title">Người cai nghiện</h2>
          <div className="two-columns">
            <div>
              <div className="section-title">Thông tin người cai nghiện</div>
              <div className="table-box"><InfoGrid id="dcNguoiCN" rows={[
                ['Họ và tên', detail.student.fullName], ['Số căn cước công dân', detail.student.citizenId], ['Ngày sinh', detail.student.birthDate],
                ['Mã hồ sơ', detail.student.studentCode], ['Dãy nhà', dormitoryNameOfStudent(detail.student.studentCode) || '—'], ['Phòng', roomOfStudent(detail.student.studentCode) || '—'], ['Cán bộ quản lý', detail.student.managerName || '—'], ['Trạng thái quản lý', detail.student.managementStatusLabel],
                ['Quyền thăm gặp', detail.student.visitRightLabel],
              ]} /></div>
            </div>
            <div>
              <div className="section-title">Thông tin quỹ lượt còn lại</div>
              <Quota detail={detail} onApply={openRewardPicker} onOpenItem={openItem} />
            </div>
          </div>
        </div>
        <div className="card">
          <h2 className="card-title">Thân nhân người cai nghiện</h2>
          <div className="people-list people-2-cols" id="dsThanNhan">{visitors.map((v, i) => <VisitorCard visitor={v} key={i} onOpen={() => setRelative(findRelative(v))} />)}</div>
        </div>
        {/* đối chiếu giấy tờ là việc của bước check-in tại quầy, tách khỏi thẻ thân nhân (thẻ chỉ giữ thông tin hồ sơ) */}
        {detail.exemption ? null : docCheckCard}
        </> },
        { key: '3', id: 'tab3', label: TAB_LABELS[2], children: <>
        {/* tab đã mang tên Lịch sử thao tác ⇒ khối không lặp tiêu đề */}
        <div className="card">
          <HistoryTable history={history} renderStatus={(code) => <StatusTag code={code} small />} />
        </div>
        </> },
      ]} />
      {pageActions.length > 0 && <PageFooter actions={pageActions} />}
    </AppLayout>
  );
}
