/* PM3 · Chi tiết dòng giá nhập — 6 khối: thông tin dòng (kèm thay thế) · đợt giá nhập · giá bán đang áp · phiếu đề xuất gắn dòng · phát sinh · lịch sử thay đổi.
 * Sửa, Xóa chỉ với Người phụ trách căng tin; không đủ điều kiện thì nút vô hiệu kèm lý do. */
import { useEffect, useMemo, useState } from 'react';
import AppLayout from '@/layout/AppLayout';
import { Svg } from '@/lib/icons';
import { toast } from '@/lib/legacyUi';
import { AppButtonWithIcon } from '@/components/app/AppButton';
import AppTable from '@/components/app/AppTable';
import AppTag from '@/components/app/AppTag';
import EmptyRow from '@/components/app/EmptyRow';
import { sizeText } from '@/components/app/AttachmentField';
import { can, SCREEN_PURCHASE_PRICE } from '@/data/accountStore';
import { purchasePriceEditPath, readRouteId } from '@/routes';
import {
  DECISION, PROPOSAL_KIND, RECEIPT_STATUS, RECEIPT_STATUS_CLASS, batchOf, moneyText, dateText, dateTimeText, deleteBlockReason, editBlockReason, effectOf, findLine, historyOf,
  linesOfBatch, pairOf, priceText, productOf, proposalsOfLine, readDb, replacedByOf, replacesOf, saleVersionOf, supplierOf,
} from '@/data/purchasePriceStore';
import {
  Blank, EffectTag, LIST_URL, PRICE_DESCRIPTIONS, PRICE_ICONS, ProposalStatusTag, TipWrap, priceLayout,
} from '@/pages/PurchasePriceShared/config';
import { useDeleteLineDialog } from '@/pages/PurchasePriceShared/DeleteLineDialog';
import '@/styles/form.css';
import '@/pages/PurchasePriceShared/PurchasePrice.css';

function InfoGrid({ id, rows }) {
  return (
    <div className="pp-info" id={id}>
      {rows.map(([label, value]) => [
        <div className="pp-info-label" key={label + 'l'}>{label}</div>,
        <div className="pp-info-value" key={label + 'v'}>{value === '' || value == null ? <Blank /> : value}</div>,
      ])}
    </div>
  );
}

/* Tệp căn cứ: Prototype chỉ giữ tên tệp ⇒ tải về 1 tệp minh hoạ cùng tên */
function downloadFile(file) {
  const url = URL.createObjectURL(new Blob(['Tệp căn cứ: ' + file.name], { type: 'text/plain;charset=utf-8' }));
  const a = document.createElement('a'); a.href = url; a.download = file.name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export default function PurchasePriceDetail() {
  const [code] = useState(readRouteId);
  const db = useMemo(() => readDb(), []);
  const line = code ? findLine(db, code) : null;
  const canEdit = can(SCREEN_PURCHASE_PRICE, 'edit');
  const canDelete = can(SCREEN_PURCHASE_PRICE, 'delete');
  const deleteDialog = useDeleteLineDialog((deleted) => { location.href = LIST_URL + '?deleted=' + encodeURIComponent(deleted); });
  const L = priceLayout([{ label: 'Chi tiết dòng giá nhập' }]);

  useEffect(() => { if (!line) location.replace(LIST_URL + '?missing=1'); }, [line]);
  /* quay về từ màn Cập nhật ⇒ báo đã cập nhật, bỏ tham số khỏi URL */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (!params.get('updated')) return;
    toast('Đã cập nhật dòng giá nhập');
    window.history.replaceState(window.history.state, '', location.pathname);
  }, []);
  /* mở thẳng màn Cập nhật khi dòng không sửa được ⇒ về đây kèm ?blocked=1, báo lý do */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (!params.get('blocked') || !line) return;
    const reason = editBlockReason(db, line);
    if (reason) toast(reason, 'is-error');
    window.history.replaceState(window.history.state, '', location.pathname);
  }, []);

  if (!line) return <AppLayout menu={L.menu} sidebar={L.sidebar} descriptions={PRICE_DESCRIPTIONS} breadcrumb={L.breadcrumb} />;

  const pair = pairOf(db, line.pairId), product = productOf(db, pair), supplier = supplierOf(db, pair);
  const sale = saleVersionOf(db, line.saleVersionId);
  const proposals = proposalsOfLine(db, line.code);
  const historyRows = historyOf(db, line.code);
  const editBlock = editBlockReason(db, line), deleteBlock = deleteBlockReason(db, line);
  const batch = batchOf(db, line.batchCode), replaces = replacesOf(db, line), replacedBy = replacedByOf(db, line);

  return (
    <AppLayout menu={L.menu} sidebar={L.sidebar} descriptions={PRICE_DESCRIPTIONS} breadcrumb={L.breadcrumb} overlays={deleteDialog.overlay}>
      <div className="page-head pp-detail-head">
        <div className="page-head-text"><h1 id="tieuDe">Chi tiết dòng giá nhập</h1></div>
        <div className="page-head-actions">
          <AppButtonWithIcon className="form-btn" id="nutQuayLai" onClick={() => { location.href = LIST_URL; }} iconRaw={PRICE_ICONS.back}>Quay lại</AppButtonWithIcon>
          {canEdit && <TipWrap tip={editBlock}><AppButtonWithIcon className="form-btn form-btn-primary" id="nutSua" disabled={!!editBlock}
            onClick={() => { location.href = purchasePriceEditPath(line.code); }} iconRaw={PRICE_ICONS.edit}>Chỉnh sửa</AppButtonWithIcon></TipWrap>}
          {canDelete && <TipWrap tip={deleteBlock}><AppButtonWithIcon className="form-btn form-btn-danger is-outline" id="nutXoa" disabled={!!deleteBlock}
            onClick={() => deleteDialog.open(line.code)} iconRaw={PRICE_ICONS.delete}>Xóa</AppButtonWithIcon></TipWrap>}
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Thông tin dòng giá nhập</h2>
        <InfoGrid id="ctThongTin" rows={[
          ['Mặt hàng', product ? product.code + ' · ' + product.name : ''],
          ['Nhà cung cấp', supplier ? supplier.name : ''],
          ['Giá nhập', priceText(line.price)],
          ['Hiệu lực từ', dateText(line.fromDate)],
          ['Hiệu lực đến', dateText(line.toDate)],
          ['Hiệu lực', <EffectTag value={effectOf(db, line)} />],
          ...(replaces ? [['Thay thế', 'Thay thế dòng giá nhập ' + replaces.code + ' (' + priceText(replaces.price) + ') từ ' + dateText(line.fromDate)]] : []),
          ...(replacedBy ? [['Bị thay thế', 'Bị thay thế bởi dòng giá nhập ' + replacedBy.code + ' (' + priceText(replacedBy.price) + ') từ ' + dateText(replacedBy.fromDate)]] : []),
          ['Quyết định giá bán', DECISION[line.decision]],
          ['Lý do quyết định', line.decisionReason],
          ['Người tạo', line.createdBy ? <>{line.createdBy.name}<span className="pp-sub">{line.createdBy.role}</span></> : ''],
          ['Thời điểm tạo', dateTimeText(line.createdAt)],
        ]} />
      </div>

      <div className="card">
        <h2 className="card-title">Đợt giá nhập</h2>
        <InfoGrid id="ctDot" rows={[
          ['Mã đợt', line.batchCode],
          ['Số hiệu căn cứ', batch ? batch.refNo : ''],
          ['Tệp căn cứ', batch && batch.file ? <a className="pp-file-link" href="#" onClick={(e) => { e.preventDefault(); downloadFile(batch.file); }}>
            <Svg raw={PRICE_ICONS.download} />{batch.file.name}<span className="pp-sub" style={{ display: 'inline' }}>{' (' + sizeText(batch.file.size || 0) + ')'}</span></a> : ''],
          ['Hiệu lực khai chung', batch ? dateText(batch.fromDate) + ' – ' + dateText(batch.toDate) : ''],
          ['Số mặt hàng trong đợt', batch ? String(linesOfBatch(db, batch.code).length) : ''],
        ]} />
      </div>

      <div className="card">
        <h2 className="card-title">Giá bán đang áp cho dòng</h2>
        {sale
          ? <InfoGrid id="ctGiaBan" rows={[['Phiên bản', 'V' + sale.versionNo], ['Giá bán', priceText(sale.price)], ['Áp dụng từ', dateText(sale.effectiveDate)]]} />
          : <div className="pp-price-empty" id="ctGiaBan">Chưa có phiên bản giá bán được duyệt</div>}
      </div>

      <div className="card">
        <h2 className="card-title">Phiếu đề xuất giá bán gắn dòng</h2>
        <AppTable tableClassName="pp-table" tableId="bangPhieuDeXuat" rowKey="id" dataSource={proposals}
          emptyRow={<tr><td colSpan={5} className="empty-state"><span className="empty-state-text">Chưa có phiếu đề xuất giá bán nào</span></td></tr>} columns={[
            { key: 'versionNo', title: 'Phiên bản', render: (p) => 'V' + p.versionNo },
            { key: 'kind', title: 'Loại', render: (p) => PROPOSAL_KIND[p.kind] },
            { key: 'status', title: 'Trạng thái', render: (p) => <ProposalStatusTag value={p.status} /> },
            { key: 'proposedPrice', className: 'c-num', title: 'Giá bán đề xuất', render: (p) => (p.proposedPrice ? priceText(p.proposedPrice) : <Blank />) },
            { key: 'proposedAt', title: 'Ngày đề xuất', render: (p) => dateText(p.proposedAt) },
          ]} />
      </div>

      <div className="card">
        <h2 className="card-title">Phát sinh từ dòng</h2>
        <div className="form-grid-title">Phiếu nhập dùng dòng giá này</div>
        <AppTable tableClassName="pp-table" tableId="bangPhieuNhap" rowKey="no" dataSource={line.receipts || []}
          emptyRow={<tr><td colSpan={6} className="empty-state"><span className="empty-state-text">Chưa có phiếu nhập nào dùng dòng giá này</span></td></tr>} columns={[
            { key: 'no', title: 'Số phiếu' },
            { key: 'date', title: 'Ngày nhập', render: (r) => dateText(r.date) },
            { key: 'warehouse', title: 'Kho' },
            { key: 'status', title: 'Trạng thái', render: (r) => <AppTag className={'tag tag-dot ' + RECEIPT_STATUS_CLASS[r.status]}>{RECEIPT_STATUS[r.status]}</AppTag> },
            { key: 'quantity', className: 'c-num', title: 'Số lượng', render: (r) => moneyText(r.quantity) },
            { key: 'salePrice', title: 'Giá bán của lô', render: (r) => (r.hasSalePrice === false
              ? <AppTag className="tag tag-dot tag-rejected">Chưa có giá bán</AppTag> : (sale ? priceText(sale.price) : <Blank />)) },
          ]} />
        <div className="pp-count" id="ctPhatSinh"><span>Số dòng đặt hàng: <b>{line.orderLineCount || 0}</b></span></div>
      </div>

      <div className="card">
        <h2 className="card-title">Lịch sử thay đổi</h2>
        <AppTable tableClassName="pp-table" tableId="bangLichSu" rowKey={(r) => r.at + r.action} dataSource={historyRows}
          emptyRow={<EmptyRow colSpan={4} entity="lịch sử thay đổi" hasRecords={false} />} columns={[
            { key: 'at', thStyle: { width: '160px' }, title: 'Thời điểm', render: (r) => dateTimeText(r.at) },
            { key: 'actor', thStyle: { width: '220px' }, title: 'Người thực hiện', render: (r) => <>{r.actorName}<span className="pp-sub">{r.actorRole}</span></> },
            { key: 'action', thStyle: { width: '110px' }, title: 'Thao tác' },
            { key: 'content', className: 'col-wrap', title: 'Nội dung', render: (r) => <>{r.content}{r.reason ? <span className="pp-sub">{'Lý do: ' + r.reason}</span> : null}</> },
          ]} />
      </div>
    </AppLayout>
  );
}
