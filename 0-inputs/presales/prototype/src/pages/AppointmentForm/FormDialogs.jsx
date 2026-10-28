/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* 5 form popups: Card swipe · Relative detail + 3 legacy popups (Bulk · Cancel · Reschedule) the HTML page still keeps in the DOM with no way to open them */
import { Svg } from '@/lib/icons';
import { AppButton, AppButtonWithIcon } from '@/components/app/AppButton';
import AppModal from '@/components/app/AppModal';
import AppTag from '@/components/app/AppTag';
import { ConfigProvider } from 'antd';
import DialogCloseButton from '@/components/app/DialogCloseButton';
import { RELATIVE_DETAIL_TITLE } from '@/lib/relativeDetail';
import RelativeDetailBody from '@/components/app/RelativeDetailBody';
import SimulatedCardPicker, { PICKER_DIALOG_STYLE } from '@/components/app/SimulatedCardPicker';
import AppSearchSelect from '@/components/app/AppSearchSelect';   /* ô chọn có tìm dùng chung */

const ICON_CLOSE = '<path d="M18 6L6 18M6 6l12 12"/>';
const ICON_CLOSE_ALT = '<path d="M18 6 6 18M6 6l12 12"/>';
const CloseButton = DialogCloseButton;
/* effects shown per cancel reason (option values cs / cs2 / kl / tn of #lyDo) */
const CANCEL_EFFECTS = {
  /* bỏ dòng ngưỡng hủy quá mức — không còn ngưỡng hủy */
  facility: ['Hoàn lại 1 lượt quỹ cho người cai nghiện'],
  relative: ['Hoàn lại 1 lượt quỹ cho người cai nghiện'],
  other: ['Hoàn lại 1 lượt quỹ cho người cai nghiện'],
};

export function FormDialogs({ form }) {
  const M = form.model, r = M.relative;
  const effects = M.cancelReason ? (M.cancelReason.indexOf('cs') === 0 ? CANCEL_EFFECTS.facility : (M.cancelReason === 'tn' ? CANCEL_EFFECTS.relative : CANCEL_EFFECTS.other)) : null;
  return (
    <>
      <ConfigProvider getPopupContainer={() => form.popupContainer || document.body}>
      <AppModal id="dlgQuetThe" open={M.scanOpen} onClose={form.closeScan} dlgStyle={M.scanPicking ? PICKER_DIALOG_STYLE : undefined}>
        <div className="dlg-h"><h3>Quẹt thẻ căn cước công dân</h3><CloseButton onClick={form.closeScan} /></div>
        <div className="dlg-b">
          {M.scanPicking ? <SimulatedCardPicker onPick={form.simulateScan} /> : (
          <div className="scan-area">
            <div className="scan-icon"><Svg raw={'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h4"/>'} /></div>
            <div className="scan-title" id="quetTieuDe">{M.scanRead ? 'Đã đọc được thẻ' : 'Đưa thẻ căn cước vào đầu đọc'}</div>
            <div className="scan-desc" id="quetMoTa">{M.scanRead ? <>Số căn cước: <b>{M.scanRead}</b></> : <>Hệ thống tự đọc số căn cước và tra cứu ngay.<br />Đầu đọc đang bật, giữ thẻ tới khi có tiếng báo.</>}</div>
            <div className="scan-spinner" id="quetVong" style={M.scanRead ? { display: 'none' } : undefined} />
          </div>)}
        </div>
        <div className="dlg-f">
          <AppButton className="form-btn" onClick={form.closeScan}>Hủy</AppButton>
          {M.scanPicking ? null : <AppButton className="form-btn form-btn-primary" onClick={form.pickScan}>{M.simulateLabel}</AppButton>}
        </div>
      </AppModal>

      <AppModal id="dlgChiTietTN" open={M.detailOpen} onClose={form.closeDetail}>
        <div className="dlg-h"><h3>{RELATIVE_DETAIL_TITLE}</h3><CloseButton onClick={form.closeDetail} /></div>
        <div className="dlg-b"><RelativeDetailBody relative={r} /></div>
        <div className="dlg-f"><AppButton className="form-btn" onClick={form.closeDetail}>Quay lại</AppButton></div>
      </AppModal>
      </ConfigProvider>

    </>
  );
}
