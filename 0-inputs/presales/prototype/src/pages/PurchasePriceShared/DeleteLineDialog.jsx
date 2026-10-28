/* PM3 · Hộp xác nhận «Xóa dòng giá nhập» — 1 nguồn cho Danh sách và Chi tiết.
 * Bắt buộc nhập lý do xóa; lúc xác nhận kiểm lại điều kiện trên dữ liệu mới nhất. Phiếu đề xuất Nháp gắn dòng bị xóa kèm.
 * Dòng đang thay thế một dòng khác ⇒ báo dòng kia được áp dụng lại. */
import { useState } from 'react';
import { toast } from '@/lib/legacyUi';
import { AppButton } from '@/components/app/AppButton';
import AppModal from '@/components/app/AppModal';
import AppCounterInput from '@/components/app/AppCounterInput';
import DialogIcon from '@/components/app/DialogIcon';
import DialogCloseButton from '@/components/app/DialogCloseButton';
import {
  dateText, deleteBlockReason, deleteLine, effectOf, findLine, moneyText, pairOf, productOf, proposalsOfLine, readDb, replacesOf, supplierOf, todayIso,
} from '@/data/purchasePriceStore';
import { MISSING_TEXT } from './config';

/* onDeleted(code) chạy sau khi xóa xong. Trả { open(code), overlay } */
export function useDeleteLineDialog(onDeleted) {
  const [code, setCode] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const db = code ? readDb() : null;
  const line = db ? findLine(db, code) : null;
  const close = () => { setCode(''); setReason(''); setError(''); setBusy(false); };

  const open = (lineCode) => {
    const fresh = findLine(readDb(), lineCode);
    if (!fresh) { toast(MISSING_TEXT, 'is-error'); return; }
    setReason(''); setError(''); setBusy(false); setCode(lineCode);
  };

  const confirm = () => {
    if (busy) return;
    if (!reason.trim()) { setError('Vui lòng nhập lý do xóa'); return; }
    const now = readDb(), fresh = findLine(now, code);
    if (!fresh) { close(); toast(MISSING_TEXT, 'is-error'); return; }
    if (deleteBlockReason(now, fresh)) {
      close();
      toast('Không thể xóa dòng giá nhập vì dòng đã phát sinh phiếu nhập, đơn hàng hoặc phiếu đề xuất đã gửi duyệt. Vui lòng tải lại', 'is-error');
      return;
    }
    setBusy(true);
    if (!deleteLine(code, reason.trim())) { setBusy(false); toast('Không thể xóa dòng giá nhập. Lý do: không ghi được dữ liệu trên trình duyệt', 'is-error'); return; }
    const done = code;
    close();
    onDeleted(done);
  };

  let body = null;
  if (line) {
    const pair = pairOf(db, line.pairId), product = productOf(db, pair), supplier = supplierOf(db, pair);
    const hasDraft = proposalsOfLine(db, line.code).some((p) => p.status === 'DRAFT');
    /* dòng này đã thay thế dòng cũ còn trong hạn ⇒ xóa thì dòng cũ áp dụng lại */
    const old = replacesOf(db, line);
    const revive = old && effectOf(db, line) !== 'UPCOMING' && old.toDate >= todayIso() ? old : null;
    body = <>
      <div className="dlg-text" id="xoaNoiDung">
        {'Dòng giá nhập ' + (product ? product.name : '') + ' — ' + (supplier ? supplier.name : '') + ', ' + moneyText(line.price) + 'đ, hiệu lực '
          + dateText(line.fromDate) + ' – ' + dateText(line.toDate) + ' sẽ bị xóa và không khôi phục được.'}
        {hasDraft ? ' Phiếu đề xuất giá bán Nháp gắn dòng này cũng bị xóa.' : ''}
        {revive ? ' Dòng giá nhập ' + revive.code + ' đang bị dòng này thay thế sẽ được áp dụng lại.' : ''}
      </div>
      <div className="field">
        <label className="field-label" htmlFor="oLyDoXoa">Lý do xóa<span className="required-mark">*</span></label>
        <AppCounterInput multiline id="oLyDoXoa" counterId="dmLyDoXoa" maxLength={500} rows={3} className={error ? 'input-border-error' : ''}
          style={{ height: 'auto', minHeight: '72px', paddingTop: '6px' }} placeholder="Nhập lý do xóa" value={reason}
          onChange={(e) => { setReason(e.target.value); if (e.target.value.trim()) setError(''); }}
          error={<span className={'field-error' + (error ? ' on' : '')} id="loiLyDoXoa">{error}</span>} />
      </div>
    </>;
  }

  const overlay = (
    <AppModal id="dlgXoaGiaNhap" open={!!line} onClose={close} labelledBy="dlgXoaGiaNhapTieuDe" dlgClassName="dlg pp-dlg">
      <div className="dlg-h"><h3 id="dlgXoaGiaNhapTieuDe" className="dlg-t"><DialogIcon level="danger" />Xóa dòng giá nhập</h3><DialogCloseButton onClick={close} /></div>
      <div className="dlg-b">{body}</div>
      <div className="dlg-f">
        <AppButton className="btn" id="xoaNutHuy" onClick={close}>Hủy</AppButton>
        <AppButton className="btn btn-danger" id="xoaNutOk" disabled={busy} onClick={confirm}>Xóa</AppButton>
      </div>
    </AppModal>
  );
  return { open, overlay };
}
