/* PM3 · Danh sách giá nhập theo nhà cung cấp — mỗi dòng là một dòng giá nhập, kèm mã đợt. Tìm kiếm, lọc, xuất Excel, mở Thêm đợt / Chi tiết / Cập nhật, xóa.
 * Khuôn màn theo màn mẫu Danh sách quầy tiếp đón (đầu màn · khu lọc 1 dòng · bảng · phân trang). */
import { useEffect, useMemo, useState } from 'react';
import AppLayout from '@/layout/AppLayout';
import { Svg } from '@/lib/icons';
import { toast } from '@/lib/legacyUi';
import { normalizeSearchText } from '@/lib/text';
import { AppButton, AppButtonWithIcon } from '@/components/app/AppButton';
import { useListResult } from '@/components/app/useListResult';
import AppTable from '@/components/app/AppTable';
import AppSearchInput from '@/components/app/AppSearchInput';
import AppSelect, { PAGE_SIZE_OPTIONS } from '@/components/app/AppSelect';
import { AppFilterDropdown } from '@/components/app/AppFilterDropdown';
import EmptyRow from '@/components/app/EmptyRow';
import PageSelect from '@/components/app/PageSelect';
import { can, SCREEN_PURCHASE_PRICE } from '@/data/accountStore';
import { ROUTES, purchasePriceDetailPath, purchasePriceEditPath } from '@/routes';
import {
  DECISION, EFFECT, batchOf, dateText, deleteBlockReason, editBlockReason, effectOf, latestProposalOf, liveLines, pairOf, priceText, productOf, readDb,
  replacedByOf, replacesOf, supplierOf,
} from '@/data/purchasePriceStore';
import {
  Blank, EffectTag, MISSING_TEXT, PRICE_DESCRIPTIONS, PRICE_ICONS, ProposalStatusTag, TipWrap, priceLayout,
} from '@/pages/PurchasePriceShared/config';
import { useDeleteLineDialog } from '@/pages/PurchasePriceShared/DeleteLineDialog';
import { exportPurchasePriceExcel } from './exportExcel';
import '@/pages/ReceptionDeskList/ReceptionDeskList.css';   /* khuôn ô lọc, dòng bảng của màn mẫu danh sách */
import '@/pages/PurchasePriceShared/PurchasePrice.css';

const ALL = 'Tất cả';
const EMPTY_FILTERS = { keyword: '', supplier: '', effect: '', decision: '' };
const EFFECT_ITEMS = [ALL, ...Object.values(EFFECT)];
const DECISION_ITEMS = [ALL, ...Object.values(DECISION)];

/* Dựng dòng hiển thị kèm mặt hàng, nhà cung cấp, đợt, hiệu lực, thay thế, phiếu gần nhất */
function buildRows(db) {
  return liveLines(db).map((l) => {
    const pair = pairOf(db, l.pairId);
    return { ...l, product: productOf(db, pair), supplier: supplierOf(db, pair), batch: batchOf(db, l.batchCode), effect: effectOf(db, l),
      replaces: replacesOf(db, l), replacedBy: replacedByOf(db, l), latestProposal: latestProposalOf(db, l.code),
      editBlock: editBlockReason(db, l), deleteBlock: deleteBlockReason(db, l) };
  }).sort((a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0));
}

function matches(r, f) {
  const keyword = normalizeSearchText(f.keyword);
  if (keyword && ![r.product && r.product.code, r.product && r.product.name, r.supplier && r.supplier.name, r.batchCode, ...(r.receipts || []).map((x) => x.no)].some((v) => normalizeSearchText(v).indexOf(keyword) >= 0)) return false;
  if (f.supplier && (!r.supplier || r.supplier.code + ' — ' + r.supplier.name !== f.supplier)) return false;
  if (f.effect && EFFECT[r.effect] !== f.effect) return false;
  if (f.decision && DECISION[r.decision] !== f.decision) return false;
  return true;
}

export default function PurchasePriceList() {
  const [version, setVersion] = useState(0);
  const [draft, setDraft] = useState(EMPTY_FILTERS);     /* điều kiện đang chọn trên khu lọc */
  const [applied, setApplied] = useState(EMPTY_FILTERS); /* điều kiện đã bấm Tìm kiếm */
  const [openDropdown, setOpenDropdown] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const canCreate = can(SCREEN_PURCHASE_PRICE, 'create');
  const canEdit = can(SCREEN_PURCHASE_PRICE, 'edit');
  const canDelete = can(SCREEN_PURCHASE_PRICE, 'delete');
  const result = useListResult({ tableSelector: '#vungBang',
    /* tạo đợt ⇒ ?created=<dòng đầu>&batch=<mã đợt>&n=<số dòng>; bỏ 2 tham số phụ cùng lúc hook bỏ tham số kết quả */
    created: (code, params) => { const b = params.get('batch'), n = params.get('n'); params.delete('batch'); params.delete('n'); return 'Đã tạo đợt giá nhập ' + b + ' gồm ' + n + ' dòng'; },
    updated: () => 'Đã cập nhật dòng giá nhập', deleted: () => 'Đã xóa dòng giá nhập' });

  const db = useMemo(() => readDb(), [version]);
  const all = useMemo(() => buildRows(db), [db]);
  const supplierItems = useMemo(() => [ALL, ...db.suppliers.map((s) => s.code + ' — ' + s.name)], [db]);
  const rows = all.filter((r) => matches(r, applied));
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const current = Math.min(page, pageCount);
  const start = (current - 1) * pageSize;
  const pageRows = rows.slice(start, start + pageSize);

  const deleteDialog = useDeleteLineDialog(() => { setVersion((n) => n + 1); toast('Đã xóa dòng giá nhập'); });

  /* trang cuối hết dòng sau khi xóa ⇒ lùi về trang trước */
  useEffect(() => { if (page > pageCount) setPage(pageCount); }, [page, pageCount]);
  useEffect(() => { const h = (e) => { if (!e.target.closest('.filter-select')) setOpenDropdown(''); }; document.addEventListener('click', h); return () => document.removeEventListener('click', h); }, []);
  /* mở bản ghi đã bị xóa ở màn khác ⇒ về đây kèm ?missing=1 */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (!params.get('missing')) return;
    toast(MISSING_TEXT, 'is-error');
    params.delete('missing');
    history.replaceState(history.state, '', location.pathname + (params.toString() ? '?' + params.toString() : ''));
  }, []);

  const search = () => { setApplied(draft); setPage(1); setOpenDropdown(''); };
  const clearFilters = () => { setDraft(EMPTY_FILTERS); setApplied(EMPTY_FILTERS); setPage(1); setOpenDropdown(''); };
  const pick = (k, v) => { setDraft((x) => ({ ...x, [k]: v === ALL ? '' : v })); setOpenDropdown(''); };

  const DROPDOWNS = [
    { key: 'supplier', domId: 'ncc', placeholder: 'Tất cả nhà cung cấp', label: 'Nhà cung cấp', items: supplierItems },
    { key: 'effect', domId: 'hl', placeholder: 'Tất cả hiệu lực', label: 'Hiệu lực', items: EFFECT_ITEMS },
    { key: 'decision', domId: 'qd', placeholder: 'Tất cả quyết định giá bán', label: 'Quyết định giá bán', items: DECISION_ITEMS },
  ];

  const columns = [
    { key: 'index', className: 'col-index', thStyle: { width: '56px' }, title: 'STT', render: (r, i) => start + i + 1 },
    { key: 'item', className: 'c-txt col-item', thStyle: { width: '230px' }, title: 'Mặt hàng', render: (r) => (r.product
      ? <><span className="cell-code">{r.product.code}</span>{' · '}<span className="pp-item-name">{r.product.name}</span></> : <Blank />) },
    { key: 'supplier', className: 'c-txt col-supplier', thStyle: { width: '190px' }, title: 'Nhà cung cấp', render: (r) => (r.supplier ? r.supplier.name : <Blank />) },
    { key: 'batch', thStyle: { width: '105px' }, title: 'Mã đợt', render: (r) => <span className="cell-code">{r.batchCode}</span> },
    { key: 'price', className: 'c-num', thStyle: { width: '110px' }, title: 'Giá nhập', render: (r) => priceText(r.price) },
    { key: 'fromDate', thStyle: { width: '110px' }, title: 'Hiệu lực từ', render: (r) => dateText(r.fromDate) },
    { key: 'toDate', thStyle: { width: '115px' }, title: 'Hiệu lực đến', render: (r) => dateText(r.toDate) },
    { key: 'effect', thStyle: { width: '135px' }, title: 'Hiệu lực', render: (r) => <EffectTag value={r.effect} /> },
    { key: 'decision', thStyle: { width: '180px' }, title: 'Quyết định giá bán', render: (r) => DECISION[r.decision] },
    { key: 'proposal', thStyle: { width: '130px' }, title: 'Phiếu đề xuất', render: (r) => (r.latestProposal ? <ProposalStatusTag value={r.latestProposal.status} /> : <Blank />) },
    { key: 'actions', className: 'col-act', thStyle: { width: canEdit || canDelete ? '140px' : '90px' }, title: 'Thao tác', render: (r) => (
      <div className="acts">
        <AppButtonWithIcon className="ib ib-view" title="Xem chi tiết" onClick={() => { location.href = purchasePriceDetailPath(r.code); }} iconRaw={PRICE_ICONS.view} />
        {canEdit && <TipWrap tip={r.editBlock}>
          <AppButtonWithIcon className="ib ib-edit" title={r.editBlock || 'Chỉnh sửa'} aria-label="Chỉnh sửa" disabled={!!r.editBlock}
            onClick={() => { location.href = purchasePriceEditPath(r.code); }} iconRaw={PRICE_ICONS.edit} /></TipWrap>}
        {canDelete && <TipWrap tip={r.deleteBlock}>
          <AppButtonWithIcon className="ib ib-danger dg" title={r.deleteBlock || 'Xóa dòng giá nhập'} aria-label="Xóa dòng giá nhập" disabled={!!r.deleteBlock}
            onClick={() => deleteDialog.open(r.code)} iconRaw={PRICE_ICONS.delete} /></TipWrap>}
      </div>) },
  ];
  const L = priceLayout();

  return (
    <AppLayout menu={L.menu} sidebar={L.sidebar} descriptions={PRICE_DESCRIPTIONS} breadcrumb={L.breadcrumb} overlays={deleteDialog.overlay}>
      <div className="shell-head">
        <div className="shell-title">
          <Svg raw={PRICE_ICONS.tag} />
          <div className="shell-text"><h1>Giá nhập theo nhà cung cấp</h1></div>
        </div>
        <div className="head-actions">
          <AppButtonWithIcon className="btn" id="nutXuatExcel" onClick={() => exportPurchasePriceExcel(rows)} iconRaw={PRICE_ICONS.download} iconLinecap={null} iconLinejoin={null}>Xuất Excel</AppButtonWithIcon>{' '}
          {canCreate && <AppButtonWithIcon className="btn btn-primary" id="nutThem" onClick={() => { location.href = ROUTES.purchasePriceCreate; }} iconRaw={PRICE_ICONS.plus} iconLinecap={null} iconLinejoin={null}>Thêm đợt giá nhập</AppButtonWithIcon>}
        </div>
      </div>

      <div className="shell-filters" id="khoiLoc">
        <div className="filter-panel is-fixed" id="khoiLocChiTiet">
          <div className="filter-body filter-row-main" id="locThan" onKeyDown={(e) => { if (e.key === 'Enter' && e.target.id === 'oTimKiem') search(); }}>
            <AppSearchInput className="filter-cell filter-wide" id="oTimKiem" value={draft.keyword} onChange={(v) => setDraft((x) => ({ ...x, keyword: v }))}
              placeholder="Tìm theo mã hàng, tên hàng, nhà cung cấp, mã đợt hoặc số phiếu nhập" title="Tìm trên 5 trường: Mã hàng · Tên hàng · Nhà cung cấp · Mã đợt · Số phiếu nhập" />
            {DROPDOWNS.map((d) => (
              <div className="filter-cell pp-filter-cell" key={d.key}>
                <AppFilterDropdown id={d.domId} ariaLabel={d.label} placeholder={d.placeholder} items={d.items} value={draft[d.key]} open={openDropdown === d.key}
                  onOpen={() => setOpenDropdown(openDropdown === d.key ? '' : d.key)} onPick={(m) => pick(d.key, m)}
                  onClear={() => { setDraft((x) => ({ ...x, [d.key]: '' })); setOpenDropdown((x) => (x === d.key ? '' : x)); }} />
              </div>
            ))}
            <div className="pp-filter-actions">
              <AppButton className="btn btn-primary" id="nutTimKiem" onClick={search}>Tìm kiếm</AppButton>
              <AppButton className="btn" id="nutXoaLoc" onClick={clearFilters}>Xóa bộ lọc</AppButton>
            </div>
          </div>
        </div>
      </div>

      <div className="shell-body tbl" id="vungBang">
        <AppTable tbodyId="tb" rowKey="code" dataSource={pageRows} columns={columns} rowClassName={result.rowClassName}
          emptyRow={<EmptyRow colSpan={columns.length} entity="dòng giá nhập" hasRecords={all.length > 0} />} />
      </div>

      <div className="pager">
        <AppButtonWithIcon className="pg-nav" id="pgTruoc" disabled={current <= 1} icon="chevLeft" onClick={() => setPage(current - 1)}>Trang trước</AppButtonWithIcon>
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
        <AppButtonWithIcon className="pg-nav" id="pgSau" disabled={current >= pageCount} icon="chevRight" iconAfter onClick={() => setPage(current + 1)}>Trang sau</AppButtonWithIcon>
      </div>
    </AppLayout>
  );
}
