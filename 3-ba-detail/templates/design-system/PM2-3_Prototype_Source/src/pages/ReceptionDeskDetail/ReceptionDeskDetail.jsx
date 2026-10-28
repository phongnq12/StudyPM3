/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* WEB-02 · Reception counter detail — 3 tabs: Thông tin quầy · Tình hình sử dụng · Lịch sử thao tác.
 * Header buttons and popups are the same as the List (ReceptionDeskShared/CounterDialogs). */
import { useMemo, useState } from 'react';
import AppLayout from '@/layout/AppLayout';
import { Svg } from '@/lib/icons';
import { AppButtonWithIcon } from '@/components/app/AppButton';
import { PageHeadActions, PageFooter } from '@/components/app/PageActions';
import AppTabs from '@/components/app/AppTabs';
import AppTag from '@/components/app/AppTag';
import CatalogStatusTag from '@/components/app/CatalogStatusTag';
import AppTable from '@/components/app/AppTable';
import { readRouteId, receptionDeskEditPath } from '@/routes';
import { dormitoryLabel } from '@/data/dormitoryStore';
import { counterStaffKeys } from '@/data/receptionDeskStore';
import { staffName } from '@/data/staffDirectoryStore';
import { readTables, tableStatusLabel, writeTables } from '@/data/visitTableStore';
import { AppButton } from '@/components/app/AppButton';
import AppModal from '@/components/app/AppModal';
import DialogIcon from '@/components/app/DialogIcon';
import DialogCloseButton from '@/components/app/DialogCloseButton';
import { toast } from '@/lib/legacyUi';
import { logAction } from '@/data/historyStore';
import { tableLabel } from '@/lib/tableTimeline';
import { readDirectConfig } from '@/data/visitConfigStore';
import { buildAppointments } from '@/pages/AppointmentList/listLogic';
import { OneDateCalendar } from '@/pages/AppointmentList/widgets';
import { REASON_RESOURCE, affectedByTable, cancelAppointments, counterCodeOf, tableCodeOf } from '@/lib/resourceImpact';
import { msg, msgParts } from '@/lib/msg';
import { RichText, key } from '@/lib/richText';
import {
  canActivate, canDelete, counterHistory, dormitoryName, findCounter, openState, saveCounter, statusLabel, toMinutes,
} from '@/pages/ReceptionDeskShared/counterLogic';
import {
  ACTION_CONFIG, ACTIONS_BY_STATUS, COUNTER_ICONS, LIST_URL, MENU_LABEL, RECEPTION_DESCRIPTIONS, counterLayout,
} from '@/pages/ReceptionDeskShared/config';
import { useCounterDialogs } from '@/pages/ReceptionDeskShared/CounterDialogs';
import HistoryTable from '@/pages/ReceptionDeskShared/HistoryTable';
import EmptyRow from '@/components/app/EmptyRow';
import NoteBox from '@/components/app/NoteBox';
import SetupHint from '@/components/app/SetupHint';
import { linkInMsg } from '@/lib/setupHint';
import '@/styles/form.css';
import '@/pages/ReceptionDeskShared/ReceptionDeskForm.css';
import './ReceptionDeskDetail.css';

const TAB_LABELS = ['Thông tin quầy', 'Buồng thăm gặp', 'Suất riêng', 'Tình hình sử dụng', 'Lịch sử thao tác'];   /* cùng tab với màn Sửa */
const BOOKED_EXCLUDED = ['DRAFT', 'CANCELLED'];   /* Từ chối duyệt vẫn giữ chỗ tới khi Hủy */
const ARRIVED = ['CHECKED_IN', 'IN_PROGRESS', 'COMPLETED'];
const pad2 = (n) => String(n).padStart(2, '0');
const isoOf = (d) => d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
const displayOf = (d) => pad2(d.getDate()) + '/' + pad2(d.getMonth() + 1) + '/' + d.getFullYear();
const hhmm = (m) => pad2(Math.floor(m / 60)) + ':' + pad2(m % 60);
const Empty = () => <span className="is-blank">—</span>;

/* Label · value block */
function InfoGrid({ id, rows }) {
  return (
    <div className="rd-info" id={id}>
      {rows.map(([label, value]) => [
        <div className="rd-info-label" key={label + 'l'}>{label}</div>,
        <div className="rd-info-value" key={label + 'v'}>{value === '' || value == null ? <Empty /> : value}</div>,
      ])}
    </div>
  );
}

/* Hour rows inside the WEB-54 shifts of every enabled weekday (union) */
function hourSlots() {
  const marks = new Set();
  readDirectConfig().days.filter((d) => d.enabled).forEach((d) => [d.morning, d.afternoon].forEach((s) => {
    if (!s || !s.from || !s.to) return;
    for (let m = toMinutes(s.from); m < toMinutes(s.to); m += 60) marks.add(m + '-' + Math.min(m + 60, toMinutes(s.to)));
  }));
  return [...marks].map((k) => k.split('-').map(Number)).sort((a, b) => a[0] - b[0] || a[1] - b[1]).map(([from, to]) => ({ from, to }));
}

/* Usage of the Monday–Sunday week that contains the search date, per hour of the visit time frame */
function buildUsage(code, searchDate) {
  const d = new Date(searchDate.getFullYear(), searchDate.getMonth(), searchDate.getDate());
  const first = new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7));
  const last = new Date(first.getFullYear(), first.getMonth(), first.getDate() + 6);
  const fromIso = isoOf(first), toIso = isoOf(last);
  const records = buildAppointments().filter((r) => counterCodeOf(r) === code && r.visitDate >= fromIso && r.visitDate <= toIso && r.visitTime);
  const rows = hourSlots().map((slot) => {
    const inSlot = records.filter((r) => { const t = toMinutes(r.visitTime); return t >= slot.from && t < slot.to; });
    return {
      key: slot.from + '-' + slot.to,
      label: hhmm(slot.from) + ' ~ ' + hhmm(slot.to),
      booked: inSlot.filter((r) => BOOKED_EXCLUDED.indexOf(r.status) < 0).length,
      arrived: inSlot.filter((r) => ARRIVED.indexOf(r.status) >= 0).length,
      absent: inSlot.filter((r) => r.status === 'ABSENT').length,
    };
  });
  return { rows, from: displayOf(first), to: displayOf(last) };
}

export default function ReceptionDeskDetail() {
  const [code] = useState(readRouteId);
  const [version, setVersion] = useState(0);
  const [tab, setTab] = useState('1');
  const [tableDialog, setTableDialog] = useState(null);   /* { kind: 'deactivate' | 'activate' | 'delete', t } */
  const counterTables = useMemo(() => readTables().filter((t) => t.counterCode === code), [code, version]);
  const [searchDate, setSearchDate] = useState(() => new Date());
  const [calendarState, setCalendarState] = useState(null);
  const counter = useMemo(() => (code ? findCounter(code) : null), [code, version]);
  const usage = useMemo(() => (counter ? buildUsage(counter.code, searchDate) : null), [counter, searchDate]);
  const history = useMemo(() => (counter ? counterHistory(counter.code) : []), [counter]);
  const dialogs = useCounterDialogs((changed, action) => {
    if (action === 'delete') { location.href = LIST_URL + '?deleted=' + encodeURIComponent(changed); return 'navigated'; }
    setVersion((n) => n + 1);
    return '';
  });
  const L = counterLayout([{ label: MENU_LABEL, href: LIST_URL }, { label: 'Chi tiết quầy tiếp đón' }]);

  if (!counter) {
    return (
      <AppLayout menu={L.menu} sidebar={L.sidebar} descriptions={RECEPTION_DESCRIPTIONS} breadcrumb={L.breadcrumb}>
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}><RichText text={msg('E001-11', 'quầy tiếp đón ' + key(code || ''))} />{'. '}<a className="appointment-link" href={LIST_URL}>Quay lại danh sách</a></div>
      </AppLayout>
    );
  }

  const open = openState(counter);
  /* Kích hoạt ẩn hẳn khi quầy chưa có dãy nhà phục vụ (Playbook List ②5) */
  const actions = (ACTIONS_BY_STATUS[counter.status] || []).filter((a) => a !== 'view' && (a !== 'delete' || canDelete(counter)) && (a !== 'activate' || canActivate(counter)));
  const HANDLERS = {
    edit: () => { location.href = receptionDeskEditPath(counter.code) + ({ b: '?tab=2', s: '?tab=3' }[tab] || ''); },   /* mở màn Sửa đúng tab đang xem */
    activate: () => dialogs.open('activate', counter.code),
    deactivate: () => dialogs.open('deactivate', counter.code),
    delete: () => dialogs.open('delete', counter.code),
  };
  const BUTTON_CLASS = { edit: 'form-btn form-btn-primary', activate: 'form-btn', deactivate: 'form-btn', delete: 'form-btn form-btn-danger is-outline' };
  /* 1 cấu hình cho thanh đầu trang và chân trang (màn Chi tiết cũng có thanh chân trang) */
  const pageActions = actions.map((a) => ({ id: 'dt_' + a, label: ACTION_CONFIG[a].label, className: BUTTON_CLASS[a], onClick: HANDLERS[a], iconRaw: COUNTER_ICONS[a] }));
  const statusTag = (s) => <CatalogStatusTag status={s} label={statusLabel(s)} />;
  const ranges = counter.reservedRanges || [];
  /* thao tác buồng dời từ màn Buồng thăm gặp — chưa dùng ⇒ Xóa · đang dùng ⇒ Vô hiệu hóa ⇄ Kích hoạt, xác nhận rồi lưu ngay */
  const canEditTables = actions.includes('edit');
  const usedCodes = new Set(buildAppointments().map(tableCodeOf).filter(Boolean));
  const tableDialogLabel = tableDialog ? tableDialog.t.code + ' — ' + tableDialog.t.name : '';
  const tableAffected = tableDialog && tableDialog.kind === 'deactivate' ? affectedByTable(tableDialog.t.code) : [];
  const dropFromRanges = (codeBan) => { const next = (counter.reservedRanges || []).map((r) => ({ ...r, tableCodes: r.tableCodes.filter((c) => c !== codeBan) })).filter((r) => r.tableCodes.length);
    return JSON.stringify(next) === JSON.stringify(counter.reservedRanges || []) || saveCounter({ ...counter, reservedRanges: next }); };
  const confirmTableAction = () => {
    const { kind, t } = tableDialog; const all = readTables(); let n = 0;
    if (kind === 'delete') { if (usedCodes.has(t.code) || !writeTables(all.filter((x) => x.code !== t.code)) || !dropFromRanges(t.code)) { toast(msg('SE001-01', 'xóa buồng thăm gặp'), 'is-error'); return; } toast(msg('I001-04', 'buồng thăm gặp ' + key(tableDialogLabel))); }
    else {
      const status = kind === 'deactivate' ? 'INACTIVE' : 'ACTIVE';
      if (!writeTables(all.map((x) => (x.code === t.code ? { ...x, status } : x))) || (kind === 'deactivate' && !dropFromRanges(t.code))) { toast(msg('SE001-01', (kind === 'deactivate' ? 'vô hiệu hóa' : 'kích hoạt') + ' buồng thăm gặp'), 'is-error'); return; }
      logAction(t.code, kind === 'deactivate' ? 'Vô hiệu hóa' : 'Kích hoạt', { statusBefore: t.status, statusAfter: status });
      if (kind === 'deactivate') { const list = affectedByTable(t.code); n = list.length ? cancelAppointments(list, REASON_RESOURCE) : 0; }
      toast(kind === 'activate' ? msg('I001-56', 'buồng thăm gặp', tableDialogLabel) : n ? msg('I001-69', 'buồng thăm gặp', tableDialogLabel, n) : msg('I001-68', 'buồng thăm gặp', tableDialogLabel));
    }
    setTableDialog(null); setVersion((x) => x + 1);
  };
  const tableDialogParts = tableDialog ? (tableDialog.kind === 'deactivate' ? msgParts('C001-09', 'buồng thăm gặp', tableDialogLabel) : tableDialog.kind === 'activate' ? msgParts('C001-11', 'buồng thăm gặp', tableDialogLabel, 'đặt lịch thăm gặp') : msgParts('C001-01', 'buồng thăm gặp', tableDialogLabel)) : null;

  return (
    <AppLayout menu={L.menu} sidebar={L.sidebar} descriptions={RECEPTION_DESCRIPTIONS} breadcrumb={L.breadcrumb} overlays={<>{dialogs.overlays}
      <OneDateCalendar state={calendarState} setState={setCalendarState} selectedDateOf={() => searchDate} onPick={(target, d) => setSearchDate(d)} /></>}>
      <div className="page-head rd-detail-head">
        <AppButtonWithIcon className="page-head-back" onClick={() => { location.href = LIST_URL; }} title="Quay lại danh sách" aria-label="Quay lại" iconRaw={'<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>'} />
        <div className="page-head-text">
          <h1 id="tieuDe" className="page-head-row">{'Quầy tiếp đón ' + counter.code}<CatalogStatusTag status={counter.status} label={statusLabel(counter.status)} />
            {/* bỏ nhãn phụ Đang mở / Tạm đóng — chỉ 1 tag trạng thái như Danh sách */}</h1>
        </div>
        <PageHeadActions actions={pageActions} />
      </div>

      <div className="rd-detail"><AppTabs activeKey={tab} onChange={setTab} items={[
        { key: '1', id: 'tab1', label: TAB_LABELS[0], children: <>
          <div className="card">
            <h2 className="card-title">Thông tin quầy</h2>
            <InfoGrid id="dcQuay" rows={[
              /* cùng thứ tự trường màn Tạo (Playbook ViewDetail ①4) */
              ['Tên quầy', counter.name],
              ['Số điện thoại nội bộ', counter.phoneNumber],
              ['Vị trí', counter.location],
              ['Dãy nhà phục vụ', (counter.dormitoryCodes || []).length
                ? <span className="rd-tags">{counter.dormitoryCodes.map((d) => <AppTag key={d} className="adjust-tag tag-category" title={dormitoryLabel(d)}>{dormitoryName(d)}</AppTag>)}</span> : ''],
              ['Cán bộ phụ trách', counterStaffKeys(counter).length
                ? <span className="rd-tags">{counterStaffKeys(counter).map((staffKey) => <AppTag key={staffKey} className="adjust-tag tag-category">{staffName(staffKey)}</AppTag>)}</span> : ''],
              ['Ghi chú', counter.note],
            ]} />
          </div>
        </> },
        { key: 'b', id: 'tabBan', label: TAB_LABELS[1], children: (
          <div className="card">
            <h2 className="card-title">Buồng thăm gặp</h2>
            <AppTable tableClassName="capacity-table reserved-table" rowKey="code" dataSource={counterTables}
              emptyRow={<EmptyRow colSpan={canEditTables ? 6 : 5} entity="buồng thăm gặp" hasRecords={false} />} columns={[
                { key: 'code', thStyle: { width: '140px' }, title: 'Mã buồng', render: (t) => <span className="cell-code">{t.code}</span> },
                { key: 'name', title: 'Tên hiển thị' },
                { key: 'seats', thStyle: { width: '150px' }, title: 'Số chỗ ngồi', className: 'rd-num' },
                { key: 'hasPartition', thStyle: { width: '130px' }, title: 'Có vách ngăn', render: (t) => (t.hasPartition ? 'Có' : 'Không') },
                { key: 'status', thStyle: { width: '150px' }, title: 'Trạng thái', render: (t) => <CatalogStatusTag status={t.status} label={tableStatusLabel(t.status)} /> },
                ...(canEditTables ? [{ key: 'actions', className: 'col-act', thStyle: { width: '110px' }, title: 'Thao tác', render: (t) => <div className="acts">   {/* cụm nút thao tác khuôn chung .acts, căn giữa cột */}
                  {!usedCodes.has(t.code) ? <AppButtonWithIcon className="ib ib-danger dg" title="Xóa buồng thăm gặp" aria-label="Xóa buồng thăm gặp" id={'banXoa' + t.code} onClick={() => setTableDialog({ kind: 'delete', t })} iconRaw={COUNTER_ICONS.delete} /> : null}
                  {usedCodes.has(t.code) && t.status !== 'INACTIVE' ? <AppButtonWithIcon className="ib ib-warn" title="Vô hiệu hóa" aria-label="Vô hiệu hóa" id={'banVoHieu' + t.code} icon="prohibit" onClick={() => setTableDialog({ kind: 'deactivate', t })} /> : null}
                  {t.status === 'INACTIVE' ? <AppButtonWithIcon className="ib ib-approve" title="Kích hoạt" aria-label="Kích hoạt" id={'banKichHoat' + t.code} icon="approve" onClick={() => setTableDialog({ kind: 'activate', t })} /> : null}
                </div> }] : []),
              ]} />
          </div>) },
        { key: 's', id: 'tabSuat', label: TAB_LABELS[2], children: (
          <div className="card">
            <h2 className="card-title">Suất riêng của quầy</h2>
            {!ranges.length && !counterTables.some((t) => t.status === 'ACTIVE')
              ? <SetupHint id="huongDanKhaiBanSuat" parts={linkInMsg('I001-79', 'khai buồng cho quầy')} to={receptionDeskEditPath(counter.code) + '?tab=2'} />
              : <AppTable tableClassName="capacity-table reserved-table" rowKey={(r) => r.from + r.to + r.tableCodes.join()} dataSource={ranges}
              emptyRow={<EmptyRow colSpan={3} entity="suất riêng" hasRecords={false} />} columns={[
                { key: 'from', thStyle: { width: '140px' }, title: 'Từ giờ' },
                { key: 'to', thStyle: { width: '140px' }, title: 'Đến giờ' },
                { key: 'tableCodes', title: 'Buồng giữ riêng', render: (r) => <span className="rd-tags">{r.tableCodes.map((t) => <AppTag key={t} className="tag tag-table">{tableLabel(t)}</AppTag>)}</span> },
              ]} />}
          </div>) },
        { key: '2', id: 'tab2', label: TAB_LABELS[3], children: (
          <div className="card">
            <h2 className="card-title">Tình hình sử dụng</h2>
            <div className="field rd-search-date">
              <label className="field-label">Ngày tìm kiếm</label>
              {/* OneDateCalendar of AppointmentList anchors to the trigger id nutNgayLuoi */}
              <AppButtonWithIcon htmlType="button" className="cal-date" id="nutNgayLuoi" iconClassName="cal-ic" icon="calendar"
                onClick={(e) => { e.stopPropagation(); setCalendarState((x) => (x && x.open ? { ...x, open: false } : { open: true, target: 'grid', month: new Date(searchDate.getFullYear(), searchDate.getMonth(), 1) })); }}>
                <span className="cal-d" id="nhanNgayTimKiem">{displayOf(searchDate)}</span></AppButtonWithIcon>
            </div>
            <div className="rd-range" id="tkKhoang">{'Tuần ' + usage.from + ' – ' + usage.to}</div>
            <AppTable tableClassName="capacity-table reserved-table rd-usage" tableId="bangSuDung" rowKey="key" dataSource={usage.rows}
              emptyRow={<EmptyRow colSpan={4} entity="khung giờ thăm gặp" hasRecords={false} />} columns={[
                { key: 'label', title: 'Khung giờ' },
                { key: 'booked', title: 'Số lịch đã đặt', className: 'rd-num' },
                { key: 'arrived', title: 'Số đã đến', className: 'rd-num' },
                { key: 'absent', title: 'Số vắng mặt', className: 'rd-num' },
              ]} />
            {/* hàng = khung giờ ngày bật thăm gặp (hourSlots), lịch trong tuần của ngày tìm kiếm (buildUsage) */}
            <div className="table-hint"><NoteBox id="goiYSuDung" line="Tình hình sử dụng sẽ có giá trị nếu quầy có lịch hẹn trong tuần chứa ngày tìm kiếm, theo khung giờ của các ngày bật thăm gặp tại Cấu hình thời gian" /></div>
          </div>) },
        { key: '3', id: 'tab3', label: TAB_LABELS[4], children: (
          <div className="card"><HistoryTable key={version} history={history} renderStatus={statusTag} /></div>) },
      ]} /></div>
      {pageActions.length > 0 && <PageFooter actions={pageActions} />}
      <AppModal id="dlgBan" open={!!tableDialog} onClose={() => setTableDialog(null)} labelledBy="dlgBanTieuDe">
        <div className="dlg-h"><h3 id="dlgBanTieuDe" className="dlg-t">{tableDialog && tableDialog.kind !== 'activate' ? <DialogIcon level={tableDialog.kind === 'delete' ? 'danger' : 'warn'} /> : null}{tableDialogParts ? <RichText text={tableDialogParts.title} /> : ''}</h3><DialogCloseButton onClick={() => setTableDialog(null)} /></div>
        <div className="dlg-b">{tableDialogParts ? <><div><RichText text={tableDialogParts.body} /></div>{tableAffected.length ? <div className="eff is-warning" id="banVoHieuLich"><RichText text={msg('W001-15', 'Buồng ' + key(tableDialogLabel), tableAffected.length)} /></div> : null}</> : null}</div>
        <div className="dlg-f">
          <AppButton className="btn" id="dlgBanHuy" onClick={() => setTableDialog(null)}>Hủy</AppButton>
          <AppButton className={'btn ' + (tableDialog && tableDialog.kind === 'delete' ? 'btn-danger' : 'btn-primary')} id="dlgBanOk" onClick={confirmTableAction}>{tableDialog ? { deactivate: 'Vô hiệu hóa', activate: 'Kích hoạt', delete: 'Xóa' }[tableDialog.kind] : ''}</AppButton>
        </div>
      </AppModal>
    </AppLayout>
  );
}
