/* PM3 · Form Thêm đợt giá nhập — trang riêng, không popup. Một đợt: một nhà cung cấp, một căn cứ, một khoảng hiệu lực chung, nhiều mặt hàng.
 * Thứ tự kiểm khi Lưu: đầu đợt → bảng mặt hàng (bắt buộc, định dạng) → từng dòng trên dữ liệu mới nhất (ngày bắt đầu, phiếu treo, cặp còn hoạt động)
 * → so giá từng dòng: vượt hoặc chưa có giá bán thì tự sinh đề xuất, không vượt thì hỏi ở hộp «Quyết định giá bán». Một dòng không đạt thì không lưu dòng nào. */
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { InputNumber } from 'antd';
import DateField from '@/components/app/DateField';
import { toast } from '@/lib/legacyUi';
import { normalizeSearchText } from '@/lib/text';
import { AppButtonWithIcon } from '@/components/app/AppButton';
import { StepNav } from '@/components/app/PageActions';
import AppSelect from '@/components/app/AppSelect';
import AppCounterInput from '@/components/app/AppCounterInput';
import AttachmentField from '@/components/app/AttachmentField';
import { useLeaveGuard } from '@/components/app/LeaveGuard';
import {
  batchRowIssue, createBatch, currentLineOf, currentSaleOf, dateText, moneyText, priceText, productOf, readDb, replaceTargetOf, todayIso, usablePairsOfSupplier,
} from '@/data/purchasePriceStore';
import { LIST_URL, PRICE_ICONS } from './config';
import DecisionDialog from './DecisionDialog';
import '@/styles/form.css';
import './PurchasePrice.css';

const EMPTY = { supplierId: undefined, fromDate: '', toDate: '', refNo: '', files: [] };
let rowSeq = 0;
const newRow = (pairId) => ({ key: 'r' + (++rowSeq), pairId, price: null });

export default function BatchForm() {
  const [head, setHead] = useState(EMPTY);
  const [rows, setRows] = useState([]);
  const [errors, setErrors] = useState({});        /* lỗi đầu đợt + 'table' */
  const [rowErrors, setRowErrors] = useState({});  /* { key: { pairId, price, row } } */
  const [busy, setBusy] = useState(false);
  const [scrollRequest, setScrollRequest] = useState(0);
  const [decisionItems, setDecisionItems] = useState(null);
  const pending = useRef(null);
  const guard = useLeaveGuard(JSON.stringify(head) !== JSON.stringify(EMPTY) || rows.length > 0);

  useLayoutEffect(() => {
    if (!scrollRequest) return;
    const first = document.querySelector('.pp-form .field-error.on');
    if (first) first.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [scrollRequest]);

  const db = useMemo(() => readDb(), []);
  const supplierOptions = useMemo(() => db.suppliers.filter((x) => x.isActive && !x.isDeleted).map((x) => ({ value: x.id, label: x.code + ' · ' + x.name })), [db]);
  const pairs = useMemo(() => (head.supplierId ? usablePairsOfSupplier(db, head.supplierId) : []), [db, head.supplierId]);
  const pairText = (pairId) => { const pr = productOf(db, pairs.find((p) => p.id === pairId)); return pr ? pr.code + ' · ' + pr.name : ''; };
  const searchFilter = (input, o) => normalizeSearchText(o.label).indexOf(normalizeSearchText(input)) >= 0;
  const back = () => { location.href = LIST_URL; };

  const changeHead = (field, value) => { setHead((x) => ({ ...x, [field]: value })); setErrors((x) => ({ ...x, [field]: '' })); };
  /* đổi nhà cung cấp ⇒ bảng mặt hàng làm trống */
  const changeSupplier = (v) => { setHead((x) => ({ ...x, supplierId: v })); setRows([]); setRowErrors({}); setErrors((x) => ({ ...x, supplierId: '', table: '' })); };
  const changeRow = (key, field, value) => {
    setRows((list) => list.map((r) => (r.key === key ? { ...r, [field]: value } : r)));
    setRowErrors((x) => ({ ...x, [key]: { ...(x[key] || {}), [field]: '', row: '' } }));
  };
  const addRow = () => { setRows((list) => [...list, newRow(undefined)]); setErrors((x) => ({ ...x, table: '' })); };
  const addAll = () => {
    const used = new Set(rows.map((r) => r.pairId));
    const more = pairs.filter((p) => !used.has(p.id)).map((p) => newRow(p.id));
    setRows((list) => [...list.filter((r) => r.pairId), ...more]);
    setErrors((x) => ({ ...x, table: '' }));
  };
  const removeRow = (key) => { setRows((list) => list.filter((r) => r.key !== key)); setRowErrors((x) => { const y = { ...x }; delete y[key]; return y; }); };

  const validate = () => {
    const e = {}, re = {};
    if (!head.supplierId) e.supplierId = 'Vui lòng chọn Nhà cung cấp';
    if (!head.fromDate) e.fromDate = 'Vui lòng chọn Hiệu lực từ ngày';
    if (!head.toDate) e.toDate = 'Vui lòng chọn Hiệu lực đến ngày';
    if (!head.files.length) e.files = 'Vui lòng chọn Tệp căn cứ';
    if (head.fromDate && head.fromDate < todayIso()) e.fromDate = 'Hiệu lực từ ngày phải từ ngày hôm nay trở đi';
    if (head.fromDate && head.toDate && head.toDate < head.fromDate) e.toDate = 'Hiệu lực đến ngày không được trước Hiệu lực từ ngày';
    if (!rows.length) e.table = 'Vui lòng thêm ít nhất một mặt hàng';
    rows.forEach((r) => {
      const x = {};
      if (!r.pairId) x.pairId = 'Vui lòng chọn Mặt hàng';
      if (r.price == null || r.price === '') x.price = 'Vui lòng nhập Giá nhập';
      else if (!(Number(r.price) > 0)) x.price = 'Giá nhập phải lớn hơn 0';
      if (Object.keys(x).length) re[r.key] = x;
    });
    return { e, re };
  };

  /* ghi cả đợt, khoá nút Lưu trong lúc xử lý rồi về danh sách */
  const commit = (decided) => {
    setBusy(true);
    setTimeout(() => {
      const saved = createBatch({ supplierId: head.supplierId, fromDate: head.fromDate, toDate: head.toDate, refNo: head.refNo.trim(), file: head.files[0] }, decided);
      if (!saved) { setBusy(false); toast('Không thể tạo đợt giá nhập. Lý do: không ghi được dữ liệu trên trình duyệt', 'is-error'); return; }
      guard.release();
      location.href = LIST_URL + '?created=' + encodeURIComponent(saved.lines[0].code) + '&batch=' + encodeURIComponent(saved.batch.code) + '&n=' + saved.lines.length;
    }, 400);
  };

  const save = () => {
    if (busy) return;
    const { e, re } = validate();
    setErrors(e); setRowErrors(re);
    if (Object.keys(e).length || Object.keys(re).length) { setScrollRequest((n) => n + 1); return; }
    /* đọc lại dữ liệu mới nhất, kiểm từng dòng */
    const now = readDb();
    const issues = {};
    rows.forEach((r) => { const msg = batchRowIssue(now, r.pairId, head.fromDate); if (msg) issues[r.key] = { row: msg }; });
    if (Object.keys(issues).length) {
      setRowErrors(issues);
      setScrollRequest((n) => n + 1);
      toast('Không thể lưu đợt giá nhập vì có ' + Object.keys(issues).length + ' dòng chưa hợp lệ', 'is-error');
      return;
    }
    /* so giá từng dòng */
    const decided = [], ask = [];
    rows.forEach((r) => {
      const sale = currentSaleOf(now, r.pairId), price = Number(r.price);
      if (!sale || price > sale.price) decided.push({ key: r.key, pairId: r.pairId, price, decision: { type: 'AUTO_PROPOSAL', reason: '' } });
      else ask.push({ key: r.key, pairId: r.pairId, price, label: pairText(r.pairId), newPrice: price, salePrice: sale.price });
    });
    if (!ask.length) { commit(decided); return; }
    pending.current = { decided, ask };
    setDecisionItems(ask);
  };

  const confirmDecision = (choices) => {
    const { decided, ask } = pending.current;
    setDecisionItems(null);
    const all = [...decided, ...ask.map((a) => ({ key: a.key, pairId: a.pairId, price: a.price, decision: choices[a.key] }))];
    const order = rows.map((r) => r.key);
    commit(all.sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key)));
  };

  const err = (k, id) => <span className={'field-error' + (errors[k] ? ' on' : '')} id={id}>{errors[k] || ''}</span>;
  const usedPairs = new Set(rows.map((r) => r.pairId).filter(Boolean));
  const noPairs = head.supplierId && !pairs.length;

  return <>
    <div className="page-head">
      <AppButtonWithIcon className="page-head-back" onClick={() => guard.attempt(back)} title="Quay lại danh sách" aria-label="Quay lại" iconRaw={PRICE_ICONS.back} />
      <div className="page-head-text"><h1 id="tieuDe">Thêm đợt giá nhập</h1></div>
    </div>

    <div className="pp-form">
      <div className="card">
        <h2 className="card-title">Thông tin đợt giá nhập</h2>
        <div className="form-grid">
          <div className="field span-6">
            <label className="field-label" htmlFor="oNhaCungCap">Nhà cung cấp<span className="required-mark">*</span></label>
            <AppSelect id="oNhaCungCap" showSearch allowClear style={{ width: '100%' }} placeholder="Chọn nhà cung cấp" options={supplierOptions} value={head.supplierId}
              filterOption={searchFilter} onChange={changeSupplier} status={errors.supplierId ? 'error' : undefined} notFoundContent="Không có dữ liệu phù hợp với điều kiện tìm kiếm" />
            {err('supplierId', 'loiNhaCungCap')}
          </div>
          <div className="field span-3">
            <label className="field-label" htmlFor="oTuNgay">Hiệu lực từ ngày<span className="required-mark">*</span></label>
            <DateField id="oTuNgay" value={head.fromDate} hasError={!!errors.fromDate} todayLink
              onChange={(v) => changeHead('fromDate', v)} error={err('fromDate', 'loiTuNgay')} />
          </div>
          <div className="field span-3">
            <label className="field-label" htmlFor="oDenNgay">Hiệu lực đến ngày<span className="required-mark">*</span></label>
            <DateField id="oDenNgay" value={head.toDate} hasError={!!errors.toDate}
              onChange={(v) => changeHead('toDate', v)} error={err('toDate', 'loiDenNgay')} />
          </div>
          <div className="field span-6">
            <label className="field-label" htmlFor="oSoHieu">Số hiệu căn cứ</label>
            <AppCounterInput id="oSoHieu" counterId="dmSoHieu" maxLength={100} placeholder="Số hợp đồng, phụ lục hoặc báo giá" value={head.refNo}
              onChange={(e) => changeHead('refNo', e.target.value)} />
          </div>
          <div className="field span-6">
            <label className="field-label" htmlFor="oTepCanCuInput">Tệp căn cứ<span className="required-mark">*</span></label>
            <AttachmentField id="oTepCanCu" value={head.files} onChange={(list) => changeHead('files', list.slice(-1))} />
            <span className="field-hint">Hợp đồng, phụ lục hoặc báo giá</span>
            {err('files', 'loiTepCanCu')}
          </div>
        </div>
      </div>

      <div className="card" id="khoiMatHang">
        <h2 className="card-title">Mặt hàng và giá nhập</h2>
        <div className="pp-batch-wrap">
          <table className="pp-table pp-batch-table" id="bangMatHang">
            <thead><tr>
              <th style={{ width: '48px' }}>STT</th>
              <th style={{ width: '28%' }}>Mặt hàng<span className="required-mark">*</span></th>
              <th style={{ width: '150px' }} className="c-num">Giá nhập<span className="required-mark">*</span></th>
              <th style={{ width: '140px' }} className="c-num">Giá bán hiện hành</th>
              <th style={{ width: '170px' }}>Giá nhập hiện hành</th>
              <th>Ghi chú</th>
              <th style={{ width: '56px' }} />
            </tr></thead>
            <tbody id="tbMatHang">
              {!rows.length && <tr><td colSpan={7} className="empty-state"><span className="empty-state-text">Chưa có mặt hàng nào trong đợt</span></td></tr>}
              {rows.map((r, i) => {
                const re = rowErrors[r.key] || {};
                const options = pairs.filter((p) => p.id === r.pairId || !usedPairs.has(p.id)).map((p) => ({ value: p.id, label: pairText(p.id) }));
                const sale = r.pairId ? currentSaleOf(db, r.pairId) : null;
                const cur = r.pairId ? currentLineOf(db, r.pairId) : null;
                const target = r.pairId && head.fromDate ? replaceTargetOf(db, r.pairId, head.fromDate) : null;
                return [
                  <tr key={r.key} data-row-key={r.key} className={re.row ? 'pp-row-error' : ''}>
                    <td>{i + 1}</td>
                    <td className="col-wrap">
                      <AppSelect id={'oMatHang' + i} showSearch allowClear style={{ width: '100%' }} disabled={!head.supplierId}
                        placeholder={head.supplierId ? 'Chọn mặt hàng' : 'Chọn nhà cung cấp trước'} options={options} value={r.pairId}
                        filterOption={searchFilter} onChange={(v) => changeRow(r.key, 'pairId', v)} status={re.pairId ? 'error' : undefined}
                        notFoundContent={pairs.length ? 'Không có dữ liệu phù hợp với điều kiện tìm kiếm' : 'Nhà cung cấp chưa có mặt hàng nào đang hoạt động'} />
                      <span className={'field-error' + (re.pairId ? ' on' : '')} id={'loiMatHang' + i}>{re.pairId || ''}</span>
                    </td>
                    <td className="c-num">
                      <InputNumber id={'oGiaNhap' + i} precision={0} controls={false} max={999999999} suffix="đ" placeholder="Nhập giá nhập" value={r.price}
                        formatter={(v) => (v === undefined || v === null || v === '' ? '' : moneyText(v))} parser={(v) => String(v || '').replace(/\D/g, '')}
                        status={re.price ? 'error' : undefined} onChange={(v) => changeRow(r.key, 'price', v)} />
                      <span className={'field-error' + (re.price ? ' on' : '')} id={'loiGiaNhap' + i}>{re.price || ''}</span>
                    </td>
                    <td className="c-num">{r.pairId ? (sale ? priceText(sale.price) : <span className="pp-price-empty">Chưa có giá bán hiện hành</span>) : <span className="is-blank">—</span>}</td>
                    <td>{r.pairId ? (cur ? priceText(cur.price) + ' · từ ' + dateText(cur.fromDate) : <span className="pp-price-empty">Chưa có</span>) : <span className="is-blank">—</span>}</td>
                    <td className="col-wrap" id={'ghiChu' + i}>{target ? 'Thay thế dòng giá nhập ' + priceText(target.price) + ' từ ' + dateText(head.fromDate) : <span className="is-blank">—</span>}</td>
                    <td><AppButtonWithIcon className="ib ib-danger" id={'nutBoDong' + i} title="Bỏ mặt hàng khỏi đợt" aria-label="Bỏ mặt hàng khỏi đợt" onClick={() => removeRow(r.key)} iconRaw={PRICE_ICONS.remove} /></td>
                  </tr>,
                  re.row ? <tr key={r.key + 'e'} className="pp-row-error-msg"><td /><td colSpan={6}><span className="field-error on" id={'loiDong' + i}>{re.row}</span></td></tr> : null,
                ];
              })}
            </tbody>
          </table>
        </div>
        <span className={'field-error' + (errors.table ? ' on' : '')} id="loiBangMatHang">{errors.table || ''}</span>
        <div className="pp-batch-actions">
          <AppButtonWithIcon className="btn" id="nutThemMatHang" disabled={!head.supplierId || noPairs || usedPairs.size >= pairs.length && rows.every((r) => r.pairId)} onClick={addRow} iconRaw={PRICE_ICONS.plus}>Thêm mặt hàng</AppButtonWithIcon>
          <AppButtonWithIcon className="btn" id="nutThemTatCa" disabled={!head.supplierId || noPairs || usedPairs.size >= pairs.length} onClick={addAll} iconRaw={PRICE_ICONS.list}>Thêm tất cả mặt hàng</AppButtonWithIcon>
          {noPairs ? <span className="pp-price-empty" id="ghiChuKhongCoMatHang">Nhà cung cấp chưa có mặt hàng nào đang hoạt động</span> : null}
        </div>
      </div>
    </div>

    <StepNav actions={[
      { id: 'nutHuy', label: 'Hủy', className: 'form-btn', left: true, onClick: () => guard.attempt(back) },
      { id: 'nutLuu', label: 'Lưu', className: 'form-btn form-btn-primary', onClick: save, iconRaw: PRICE_ICONS.save, disabled: busy },
    ]} />
    {guard.dialog}
    {decisionItems && <DecisionDialog items={decisionItems} onClose={() => { setDecisionItems(null); pending.current = null; }} onConfirm={confirmDecision} />}
  </>;
}
