/* PM3 · Form Cập nhật dòng giá nhập — trang riêng, chỉ mở khi phiếu đề xuất giá bán gắn dòng còn Nháp và dòng chưa phát sinh.
 * Nhà cung cấp, mặt hàng và thông tin đợt chỉ đọc. Hiệu lực từ ngày sửa được khi dòng còn Khai trước.
 * Thứ tự kiểm khi Lưu: bắt buộc → ngày → ngày bắt đầu so với dòng khác cùng cặp → dòng còn sửa được → cặp còn hoạt động → (đổi giá) quyết định giá bán. */
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { InputNumber } from 'antd';
import DateField, { dateLabel } from '@/components/app/DateField';
import { toast } from '@/lib/legacyUi';
import { AppButtonWithIcon } from '@/components/app/AppButton';
import { StepNav } from '@/components/app/PageActions';
import { useLeaveGuard } from '@/components/app/LeaveGuard';
import { purchasePriceDetailPath } from '@/routes';
import {
  batchOf, currentSaleOf, editBlockReason, effectOf, findLine, isPairUsable, latestStartOf, moneyText, pairOf, productOf, readDb, startRuleText,
  supplierOf, todayIso, updateLine,
} from '@/data/purchasePriceStore';
import { MISSING_TEXT, PRICE_ICONS } from './config';
import DecisionDialog from './DecisionDialog';
import '@/styles/form.css';
import './PurchasePrice.css';


export default function LineEditForm({ line }) {
  const db = useMemo(() => readDb(), []);
  const upcoming = effectOf(db, line) === 'UPCOMING';   /* chốt lúc mở màn */
  const initial = useMemo(() => ({ price: line.price, fromDate: line.fromDate, toDate: line.toDate }), [line]);
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [scrollRequest, setScrollRequest] = useState(0);
  const [decisionItems, setDecisionItems] = useState(null);
  const pendingInput = useRef(null);
  const guard = useLeaveGuard(JSON.stringify(form) !== JSON.stringify(initial));

  useLayoutEffect(() => {
    if (!scrollRequest) return;
    const first = document.querySelector('.pp-form .field-error.on');
    if (first) first.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [scrollRequest]);

  const pair = pairOf(db, line.pairId), product = productOf(db, pair), supplier = supplierOf(db, pair);
  const batch = batchOf(db, line.batchCode);
  const change = (field, value) => { setForm((x) => ({ ...x, [field]: value })); setErrors((x) => ({ ...x, [field]: '' })); };
  const back = () => { location.href = purchasePriceDetailPath(line.code); };

  const validate = () => {
    const e = {};
    if (form.price == null || form.price === '') e.price = 'Vui lòng nhập Giá nhập';
    else if (!(Number(form.price) > 0)) e.price = 'Giá nhập phải lớn hơn 0';
    if (!form.fromDate) e.fromDate = 'Vui lòng chọn Hiệu lực từ ngày';
    if (!form.toDate) e.toDate = 'Vui lòng chọn Hiệu lực đến ngày';
    if (upcoming && form.fromDate && form.fromDate < todayIso()) e.fromDate = 'Hiệu lực từ ngày phải từ ngày hôm nay trở đi';
    if (form.fromDate && form.toDate && form.toDate < form.fromDate) e.toDate = 'Hiệu lực đến ngày không được trước Hiệu lực từ ngày';
    if (!upcoming && form.toDate && !e.toDate && form.toDate < todayIso()) e.toDate = 'Hiệu lực đến ngày không được trước ngày hôm nay';
    /* đổi ngày bắt đầu ⇒ vẫn phải sau ngày bắt đầu của mọi dòng còn lại cùng cặp */
    if (!Object.keys(e).length && form.fromDate !== line.fromDate) {
      const latest = latestStartOf(readDb(), line.pairId, line.code);
      if (latest && form.fromDate <= latest) e.fromDate = startRuleText(latest);
    }
    return e;
  };

  const commit = (input, picked) => {
    setBusy(true);
    setTimeout(() => {
      const saved = updateLine(line.code, input, picked);
      if (!saved) { setBusy(false); toast('Không thể cập nhật dòng giá nhập. Lý do: không ghi được dữ liệu trên trình duyệt', 'is-error'); return; }
      guard.release();
      location.href = purchasePriceDetailPath(line.code) + '?updated=1';
    }, 400);
  };

  const save = () => {
    if (busy) return;
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) { setScrollRequest((n) => n + 1); return; }
    const now = readDb();
    const fresh = findLine(now, line.code);
    if (!fresh) { toast(MISSING_TEXT, 'is-error'); return; }
    if (editBlockReason(now, fresh) || (effectOf(now, fresh) === 'UPCOMING') !== upcoming) {
      toast('Không thể cập nhật dòng giá nhập vì dòng đã thay đổi trạng thái. Vui lòng tải lại', 'is-error'); return;
    }
    if (!isPairUsable(now, line.pairId)) { toast('Không thể cập nhật dòng giá nhập vì mặt hàng hoặc nhà cung cấp đã ngừng hoạt động', 'is-error'); return; }
    const input = { price: Number(form.price), fromDate: form.fromDate, toDate: form.toDate };
    if (input.price === line.price) { commit(input, null); return; }   /* không đổi giá ⇒ giữ quyết định cũ, không hỏi */
    const sale = currentSaleOf(now, line.pairId);
    if (!sale || input.price > sale.price) { commit(input, { type: 'AUTO_PROPOSAL', reason: '' }); return; }
    pendingInput.current = input;
    setDecisionItems([{ key: line.code, label: product ? product.code + ' · ' + product.name : '', newPrice: input.price, salePrice: sale.price }]);
  };

  const confirmDecision = (choices) => {
    const input = pendingInput.current;
    setDecisionItems(null);
    commit(input, choices[line.code]);
  };

  const err = (k, id) => <span className={'field-error' + (errors[k] ? ' on' : '')} id={id}>{errors[k] || ''}</span>;
  const ro = (id, value) => <div className="pp-readonly" id={id}>{value || <span className="is-blank">—</span>}</div>;

  return <>
    <div className="page-head">
      <AppButtonWithIcon className="page-head-back" onClick={() => guard.attempt(back)} title="Quay lại chi tiết" aria-label="Quay lại" iconRaw={PRICE_ICONS.back} />
      <div className="page-head-text"><h1 id="tieuDe">Cập nhật dòng giá nhập</h1></div>
    </div>

    <div className="pp-form">
      <div className="eff pp-banner" id="daiGhiChuSua" role="note">Dòng sửa được vì phiếu đề xuất giá bán gắn dòng đang ở trạng thái Nháp. Sau khi phiếu được gửi duyệt, muốn đổi giá vui lòng thêm đợt giá nhập mới</div>
      <div className="card">
        <h2 className="card-title">Thông tin dòng giá nhập</h2>
        <div className="form-grid">
          <div className="field span-6"><label className="field-label" htmlFor="oNhaCungCap">Nhà cung cấp</label>{ro('oNhaCungCap', supplier ? supplier.code + ' · ' + supplier.name : '')}</div>
          <div className="field span-6"><label className="field-label" htmlFor="oMatHang">Mặt hàng</label>{ro('oMatHang', product ? product.code + ' · ' + product.name : '')}</div>
          <div className="field span-4"><label className="field-label" htmlFor="oMaDot">Mã đợt</label>{ro('oMaDot', line.batchCode)}</div>
          <div className="field span-4"><label className="field-label" htmlFor="oSoHieu">Số hiệu căn cứ</label>{ro('oSoHieu', batch ? batch.refNo : '')}</div>
          <div className="field span-4"><label className="field-label" htmlFor="oTepCanCu">Tệp căn cứ</label>{ro('oTepCanCu', batch && batch.file ? batch.file.name : '')}</div>
          <div className="field span-4">
            <label className="field-label" htmlFor="oGiaNhap">Giá nhập<span className="required-mark">*</span></label>
            <InputNumber id="oGiaNhap" precision={0} controls={false} max={999999999} suffix="đ" placeholder="Nhập giá nhập" value={form.price}
              formatter={(v) => (v === undefined || v === null || v === '' ? '' : moneyText(v))} parser={(v) => String(v || '').replace(/\D/g, '')}
              status={errors.price ? 'error' : undefined} onChange={(v) => change('price', v)} />
            {err('price', 'loiGiaNhap')}
          </div>
          <div className="field span-4">
            <label className="field-label" htmlFor="oTuNgay">Hiệu lực từ ngày<span className="required-mark">*</span></label>
            {upcoming
              ? <DateField id="oTuNgay" value={form.fromDate} hasError={!!errors.fromDate} todayLink
                onChange={(v) => change('fromDate', v)} error={err('fromDate', 'loiTuNgay')} />
              : <>{ro('oTuNgay', dateLabel(form.fromDate))}{err('fromDate', 'loiTuNgay')}</>}
          </div>
          <div className="field span-4">
            <label className="field-label" htmlFor="oDenNgay">Hiệu lực đến ngày<span className="required-mark">*</span></label>
            <DateField id="oDenNgay" value={form.toDate} hasError={!!errors.toDate}
              onChange={(v) => change('toDate', v)} error={err('toDate', 'loiDenNgay')} />
          </div>
        </div>
      </div>
    </div>

    <StepNav actions={[
      { id: 'nutHuy', label: 'Hủy', className: 'form-btn', left: true, onClick: () => guard.attempt(back) },
      { id: 'nutLuu', label: 'Lưu', className: 'form-btn form-btn-primary', onClick: save, iconRaw: PRICE_ICONS.save, disabled: busy },
    ]} />
    {guard.dialog}
    {decisionItems && <DecisionDialog items={decisionItems} draftWarning onClose={() => { setDecisionItems(null); pendingInput.current = null; }} onConfirm={confirmDecision} />}
  </>;
}
