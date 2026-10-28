/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* WEB-02 · Reception counter list — model v4 (served dormitories, reserved ranges), lifecycle Nháp -> Hoạt động <-> Vô hiệu hóa */
import { useEffect, useMemo, useState } from 'react';
import AppLayout from '@/layout/AppLayout';
import { Svg } from '@/lib/icons';
import { normalizeSearchText } from '@/lib/text';
import { AppButton, AppButtonWithIcon } from '@/components/app/AppButton';
import AppTag from '@/components/app/AppTag';
import CatalogStatusTag from '@/components/app/CatalogStatusTag';
import { useListResult } from '@/components/app/useListResult';
import AppTable from '@/components/app/AppTable';
import AppSearchInput from '@/components/app/AppSearchInput';
import AppSelect, { PAGE_SIZE_OPTIONS } from '@/components/app/AppSelect';
import { AppFilterDropdown } from '@/components/app/AppFilterDropdown';
import { receptionDeskDetailPath, receptionDeskEditPath } from '@/routes';
import { dormitoryLabel, listDormitories } from '@/data/dormitoryStore';
import { buildAppointments } from '@/pages/AppointmentList/listLogic';
import { counterCodeOf } from '@/lib/resourceImpact';
import {
  STATUS_ACTIVE, STATUS_CODES, STATUS_DRAFT, STATUS_INACTIVE, canActivate, dormitoryName, listCounters, statusLabel,
} from '@/pages/ReceptionDeskShared/counterLogic';
import {
  ACTION_CONFIG, ACTIONS_BY_STATUS, COUNTER_ICONS, MENU_LABEL, RECEPTION_DESCRIPTIONS, counterLayout,
} from '@/pages/ReceptionDeskShared/config';
import { useCounterDialogs } from '@/pages/ReceptionDeskShared/CounterDialogs';
import { exportCountersExcel } from './exportExcel';
import { msg } from '@/lib/msg';
import { key } from '@/lib/richText';
import EmptyRow from '@/components/app/EmptyRow';
import PageSelect from '@/components/app/PageSelect';   /* ô «Chọn trang» cạnh chữ «Trang X/Y» */
import './ReceptionDeskList.css';

const TAB_ALL = 'ALL';
const TABS = [
  { key: TAB_ALL, label: 'Tất cả', style: { '--tone-bgSo': '#FDE8E9', '--tone-fgSo': '#D0202B' } },
  { key: STATUS_DRAFT, dot: true, style: { '--cham': '#475569', '--tone-bgSo': '#F3F4F6', '--tone-fgSo': '#475569' }, title: 'Quầy vừa khai báo, chưa đưa vào sử dụng' },
  { key: STATUS_ACTIVE, dot: true, style: { '--cham': '#15803D', '--tone-bgSo': '#DCFCE7', '--tone-fgSo': '#15803D' }, title: 'Quầy đang dùng' },
  { key: STATUS_INACTIVE, dot: true, style: { '--cham': '#B91C1C', '--tone-bgSo': '#FEE2E2', '--tone-fgSo': '#B91C1C' }, title: 'Quầy ngừng dùng, dữ liệu cũ vẫn giữ' },
];
const tabLabel = (tab) => tab.label || statusLabel(tab.key);
const inTab = (key) => (c) => key === TAB_ALL || c.status === key;
const FILTER_CELL_CLASS = { status: 'filter-status', dormitory: 'filter-zone' };
const DROPDOWNS = [
  { key: 'status', domId: 'tt', placeholder: 'Tất cả trạng thái', label: 'Trạng thái', items: STATUS_CODES.map(statusLabel) },
  { key: 'dormitory', domId: 'dn', placeholder: 'Tất cả dãy nhà phục vụ', label: 'Dãy nhà phục vụ', items: listDormitories().map((d) => dormitoryLabel(d.code)) },
];

const Empty = () => <span className="empty">—</span>;

export default function ReceptionDeskList() {
  const [version, setVersion] = useState(0);
  const [tab, setTab] = useState(TAB_ALL);
  const [filters, setFilters] = useState({ keyword: '', status: '', dormitory: '' });
  const [openDropdown, setOpenDropdown] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const refresh = () => setVersion((n) => n + 1);
  const dialogs = useCounterDialogs(refresh);
  /* ?created= từ Tạo · ?updated= từ Sửa · ?deleted= từ Chi tiết: toast + tô sáng dòng theo state, bỏ tham số khỏi URL (cùng cách màn mẫu Lịch hẹn) */
  const result = useListResult({ tableSelector: '#vungBang',
    created: (code) => msg('I001-01', 'quầy tiếp đón ' + key(code)), updated: (code) => msg('I001-03', 'quầy tiếp đón ' + key(code)), deleted: (code) => msg('I001-04', 'quầy tiếp đón ' + key(code)) });

  const all = useMemo(() => listCounters(), [version]);
  /* Counters that already have appointments — Delete is hidden for them */
  const usedCodes = useMemo(() => new Set(buildAppointments().map(counterCodeOf).filter(Boolean)), [version]);
  const filtered = all.filter((c) => {
    const keyword = normalizeSearchText(filters.keyword), dormCode = filters.dormitory ? filters.dormitory.split(' — ')[0] : '';
    return (!keyword || normalizeSearchText(c.code).indexOf(keyword) >= 0 || normalizeSearchText(c.name).indexOf(keyword) >= 0)
      && (!filters.status || statusLabel(c.status) === filters.status) && (!dormCode || (c.dormitoryCodes || []).indexOf(dormCode) >= 0);
  });
  const rows = filtered.filter(inTab(tab));
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const current = Math.min(page, pageCount);
  const start = (current - 1) * pageSize;
  const pageRows = rows.slice(start, start + pageSize);

  useEffect(() => { const h = (e) => { if (!e.target.closest('.filter-select')) setOpenDropdown(''); }; document.addEventListener('click', h); return () => document.removeEventListener('click', h); }, []);

  const changeFilters = (next) => { setFilters((x) => ({ ...x, ...next })); setPage(1); };
  const changeTab = (key) => { setTab(key); setPage(1); if (key !== TAB_ALL && filters.status) changeFilters({ status: '' }); };
  const ACTION_HANDLERS = {
    view: (code) => { location.href = receptionDeskDetailPath(code); },
    edit: (code) => { location.href = receptionDeskEditPath(code); },
    activate: (code) => dialogs.open('activate', code),
    deactivate: (code) => dialogs.open('deactivate', code),
    delete: (code) => dialogs.open('delete', code),
  };
  /* Xóa chỉ khi quầy chưa có lịch hẹn · Kích hoạt chỉ khi quầy đã có dãy nhà phục vụ (Playbook List ②5: không đủ điều kiện thì ẩn hẳn) */
  const actionsOf = (r) => (ACTIONS_BY_STATUS[r.status] || []).filter((a) => (a !== 'delete' || (!usedCodes.has(r.code) && !(r.todayBookedCount > 0))) && (a !== 'activate' || canActivate(r)));

  const columns = [
    { key: 'index', className: 'col-index', thStyle: { width: '56px' }, title: 'STT', render: (r, i) => start + i + 1 },
    { key: 'code', className: 'c-txt', thStyle: { width: '96px' }, title: 'Mã quầy', render: (r) => <span className="cell-code">{r.code}</span> },   /* mã không bấm được, xem chi tiết bằng nút Xem như danh sách Buồng */
    /* Tên quầy không khai rộng ⇒ nhận phần bảng dư, các cột khác (STT 56px) giữ đúng bề rộng khai */
    { key: 'name', className: 'c-txt col-name', thStyle: { width: '22%' }, title: 'Tên quầy', render: (r) => <>
      <span className="cell-name">{r.name}</span>
      {r.location ? <div className="csub">{r.location}</div> : null}</> },
    { key: 'dormitoryCodes', className: 'c-txt', thStyle: { minWidth: '220px' }, title: 'Dãy nhà phục vụ', thClassName: 'c-txt col-wrap', render: (r) => (!(r.dormitoryCodes || []).length ? <Empty /> : (
      <div className="zone-cell">
        {r.dormitoryCodes.slice(0, 2).map((d) => <AppTag key={d} className="tag tag-category" title={dormitoryLabel(d)}>{dormitoryName(d)}</AppTag>)}
        {r.dormitoryCodes.length > 2 ? <span className="zone-more">{'và ' + (r.dormitoryCodes.length - 2) + ' dãy nhà khác'}</span> : null}
      </div>)) },
    { key: 'usedToday', className: 'c-num', thClassName: 'c-num col-wrap', thStyle: { width: '110px' }, title: 'Đã dùng hôm nay', render: (r) => (r.todayBookedCount
      ? <a className="cell-code appointment-link" href={'/lich-hen/tham-gap-truc-tiep?counterCode=' + r.code}>{r.todayCheckedInCount + '/' + r.todayBookedCount}</a> : <Empty />) },
    /* cột Trạng thái theo khuôn chung: ĐÚNG 1 tag (bỏ nhãn phụ Đang mở / Tạm đóng) */
    { key: 'status', className: 'col-status', thStyle: { width: '150px' }, title: 'Trạng thái', render: (r) => <CatalogStatusTag status={r.status} label={statusLabel(r.status)} /> },
    { key: 'actions', className: 'col-act', thStyle: { width: '184px' }, title: 'Thao tác', render: (r) => (
      <div className="acts">{actionsOf(r).map((action) => (
        <AppButtonWithIcon key={action} className={'ib ib-' + ACTION_CONFIG[action].tone + (ACTION_CONFIG[action].danger ? ' dg' : '')} title={ACTION_CONFIG[action].label}
          onClick={() => ACTION_HANDLERS[action](r.code)} iconRaw={COUNTER_ICONS[action]} />
      ))}</div>) },
  ];
  const L = counterLayout([{ label: MENU_LABEL }]);

  return (
    <AppLayout menu={L.menu} sidebar={L.sidebar} descriptions={RECEPTION_DESCRIPTIONS} breadcrumb={L.breadcrumb} overlays={dialogs.overlays}>
      <div className="shell-head">
        <div className="shell-title">
          <Svg raw={COUNTER_ICONS.desk} />
          <div className="shell-text">
            <h1>Cài đặt quầy tiếp đón</h1>
          </div>
        </div>
        <div className="head-actions">
          <AppButtonWithIcon className="btn" onClick={() => exportCountersExcel(rows)} iconRaw={'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>'} iconLinecap={null} iconLinejoin={null}>Xuất Excel</AppButtonWithIcon>{' '}
          <AppButtonWithIcon className="btn btn-primary" onClick={() => { location.href = '/tiep-don/quay-tiep-don/tao-moi'; }} iconRaw={'<path d="M12 5v14M5 12h14"/>'} iconLinecap={null} iconLinejoin={null}>Tạo mới</AppButtonWithIcon>
        </div>
      </div>

      <div className="tabs">
        {TABS.map((t) => { const n = filtered.filter(inTab(t.key)).length; return (
          <AppButton key={t.key} className={'tab-btn' + (tab === t.key ? ' on' : '') + (n === 0 && tab !== t.key ? ' is-empty' : '')} onClick={() => changeTab(t.key)} style={t.style} title={t.title}>
            <span className="tab-label">{t.dot && <i className="tab-dot" />}{tabLabel(t)}</span>
            <span className="tab-number">{n}</span>
          </AppButton>); })}
      </div>

      <div className="shell-filters" id="khoiLoc">
        {/* khuôn khu tìm kiếm như màn Lịch hẹn: 1 dòng cố định, không dải gập. Màn Quầy chỉ có 3 điều kiện, đủ 1 dòng nên không có nút «Tìm kiếm mở rộng» */}
        <div className="filter-panel is-fixed" id="khoiLocChiTiet">
          <div className="filter-body filter-row-main" id="locThan">
            <AppSearchInput className="filter-cell filter-wide" value={filters.keyword} onChange={(v) => changeFilters({ keyword: v })} placeholder="Tìm theo mã quầy, tên quầy"
              title="Tìm trên 2 trường: Mã quầy · tên quầy" />
            {DROPDOWNS.map((d) => (
              <div className={'filter-cell ' + FILTER_CELL_CLASS[d.key]} key={d.key} style={d.key === 'status' && tab !== TAB_ALL ? { display: 'none' } : undefined}>
                <AppFilterDropdown id={d.domId} ariaLabel={d.label} placeholder={d.placeholder} items={d.items} value={filters[d.key]} open={openDropdown === d.key}
                  onOpen={() => setOpenDropdown(openDropdown === d.key ? '' : d.key)} onPick={(m) => { changeFilters({ [d.key]: m }); setOpenDropdown(''); }}
                  onClear={() => { changeFilters({ [d.key]: '' }); setOpenDropdown((x) => (x === d.key ? '' : x)); }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="shell-body tbl" id="vungBang">
        <AppTable tbodyId="tb" rowKey="code" dataSource={pageRows} columns={columns} rowClassName={result.rowClassName}
          emptyRow={<EmptyRow colSpan={7} entity="quầy tiếp đón" hasRecords={all.length > 0} />} />
      </div>

      <div className="pager">
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
          <AppSelect id="pgCo" width={61} value={pageSize} options={PAGE_SIZE_OPTIONS} showSearch={false} allowClear={false} onChange={(v) => { setPageSize(+v); setPage(1); }} />
          <span className="pg-i">trên 1 trang</span>
        </div>
        <AppButtonWithIcon className="pg-nav" id="pgSau" disabled={current >= pageCount} icon="chevRight" iconAfter onClick={() => setPage(current + 1)}>
          Trang sau
        </AppButtonWithIcon>
      </div>
    </AppLayout>
  );
}
