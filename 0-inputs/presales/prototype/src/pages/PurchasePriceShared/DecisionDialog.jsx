/* PM3 · Hộp «Quyết định giá bán» — 1 hộp cho mọi dòng có giá nhập mới không vượt giá bán hiện hành.
 * Mỗi dòng chọn Không tạo đề xuất / Tạo đề xuất và bắt buộc nhập lý do. Dùng ở màn Thêm đợt (nhiều dòng) và Cập nhật (1 dòng). */
import { useEffect, useState } from 'react';
import { AppButton } from '@/components/app/AppButton';
import AppModal from '@/components/app/AppModal';
import AppRadioGroup from '@/components/app/AppRadioGroup';
import AppCounterInput from '@/components/app/AppCounterInput';
import DialogCloseButton from '@/components/app/DialogCloseButton';
import { priceText } from '@/data/purchasePriceStore';
import { CREATE_HINT, KEEP_HINT } from './config';

const KEEP = 'KEEP', CREATE = 'CREATE';

/* items: [{ key, label, newPrice, salePrice }] · draftWarning: dòng đang có phiếu Nháp sẽ bị xóa khi chọn Không tạo đề xuất
 * onConfirm({ [key]: { type, reason } }) */
export default function DecisionDialog({ items, onClose, onConfirm, draftWarning = false }) {
  const [picked, setPicked] = useState({});
  const [errors, setErrors] = useState({});
  useEffect(() => { setPicked({}); setErrors({}); }, [items]);
  const set = (key, patch) => { setPicked((x) => ({ ...x, [key]: { ...x[key], ...patch } })); setErrors((x) => ({ ...x, [key]: {} })); };

  const confirm = () => {
    const e = {};
    items.forEach((it) => {
      const p = picked[it.key] || {};
      if (!p.choice) e[it.key] = { choice: 'Vui lòng chọn cách xử lý giá bán' };
      else if (!(p.reason || '').trim()) e[it.key] = { reason: p.choice === CREATE ? 'Vui lòng nhập lý do tạo đề xuất' : 'Vui lòng nhập lý do không tạo đề xuất' };
    });
    setErrors(e);
    if (Object.keys(e).length) return;
    const out = {};
    items.forEach((it) => { const p = picked[it.key]; out[it.key] = { type: p.choice === CREATE ? 'CREATE_PROPOSAL' : 'KEEP_CURRENT', reason: p.reason.trim() }; });
    onConfirm(out);
  };

  return (
    <AppModal id="dlgQuyetDinhGiaBan" open={!!items} onClose={onClose} labelledBy="dlgQuyetDinhTieuDe" dlgClassName="dlg pp-dlg pp-dlg-wide">
      <div className="dlg-h"><h3 id="dlgQuyetDinhTieuDe" className="dlg-t">Quyết định giá bán</h3><DialogCloseButton onClick={onClose} /></div>
      <div className="dlg-b">
        <div className="dlg-text" id="qdGioiThieu">Các mặt hàng dưới đây có giá nhập mới không vượt giá bán hiện hành. Vui lòng chọn cách xử lý giá bán cho từng mặt hàng</div>
        <table className="pp-table pp-decision-table" id="bangQuyetDinh">
          <thead><tr><th>Mặt hàng</th><th className="c-num">Giá nhập mới</th><th className="c-num">Giá bán hiện hành</th><th>Cách xử lý</th><th>Lý do<span className="required-mark">*</span></th></tr></thead>
          <tbody>
            {(items || []).map((it, i) => {
              const p = picked[it.key] || {}, err = errors[it.key] || {};
              return (
                <tr key={it.key} data-row-key={it.key}>
                  <td className="col-wrap">{it.label}</td>
                  <td className="c-num">{priceText(it.newPrice)}</td>
                  <td className="c-num">{priceText(it.salePrice)}</td>
                  <td>
                    <AppRadioGroup name={'qdLuaChon' + i} label="Cách xử lý giá bán" vertical className="pp-choice" value={p.choice || ''}
                      onChange={(v) => set(it.key, { choice: v })} options={[
                        { value: KEEP, label: <span className="pp-choice-title">Không tạo đề xuất</span> },
                        { value: CREATE, label: <span className="pp-choice-title">Tạo đề xuất</span> },
                      ]} />
                    {draftWarning && p.choice === KEEP ? <span className="pp-choice-desc pp-choice-warn" id="qdXoaPhieuNhap">Phiếu đề xuất giá bán Nháp đang gắn dòng sẽ bị xóa</span> : null}
                    <span className={'field-error' + (err.choice ? ' on' : '')} id={'loiQdLuaChon' + i}>{err.choice || ''}</span>
                  </td>
                  <td className="col-wrap">
                    <AppCounterInput multiline id={'oQdLyDo' + i} counterId={'dmQdLyDo' + i} maxLength={500} rows={2} className={err.reason ? 'input-border-error' : ''}
                      style={{ height: 'auto', minHeight: '56px', paddingTop: '6px' }} placeholder="Nhập lý do" value={p.reason || ''}
                      onChange={(e) => set(it.key, { reason: e.target.value })}
                      error={<span className={'field-error' + (err.reason ? ' on' : '')} id={'loiQdLyDo' + i}>{err.reason || ''}</span>} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="pp-hints" id="qdHeQua">
          <span className="pp-choice-desc">{KEEP_HINT}</span>
          <span className="pp-choice-desc">{CREATE_HINT}</span>
        </div>
      </div>
      <div className="dlg-f">
        <AppButton className="btn" id="qdNutHuy" onClick={onClose}>Hủy</AppButton>
        <AppButton className="btn btn-primary" id="qdNutXacNhan" onClick={confirm}>Xác nhận</AppButton>
      </div>
    </AppModal>
  );
}
