/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Page popups: card swipe · relative detail */
import { Svg } from '@/lib/icons';
import { AppButton } from '@/components/app/AppButton';
import AppModal from '@/components/app/AppModal';
import { S, render, closeCardSwipe, simulateCardSwipe, pickCardSwipe, closeRelativeDetail, closeCheckInOtherDay, confirmCheckInOtherDay } from './engine';
import { useStore } from './blocks';
import DialogCloseButton from '@/components/app/DialogCloseButton';
import { RELATIVE_DETAIL_TITLE } from '@/lib/relativeDetail';
import RelativeDetailBody from '@/components/app/RelativeDetailBody';
import SimulatedCardPicker, { PICKER_DIALOG_STYLE } from '@/components/app/SimulatedCardPicker';
import DialogIcon from '@/components/app/DialogIcon';
import { msgParts } from '@/lib/msg';   /* message theo mã */

const CloseButton = DialogCloseButton;

export default function PagePopups() {
  useStore();
  return (
    <>
      <AppModal id="dlgQuetThe" open={S.dialog === 'dlgQuetThe'} onClose={closeCardSwipe} dlgStyle={S.cardPicking ? PICKER_DIALOG_STYLE : undefined}>
        <div className="dlg-h">
          <h3>Quẹt thẻ căn cước công dân</h3>
          <CloseButton onClick={closeCardSwipe} />
        </div>
        <div className="dlg-b">
          {S.cardPicking ? <SimulatedCardPicker onPick={simulateCardSwipe} /> : (
          <div className="scan-area">
            <div className="scan-icon"><Svg strokeWidth="1.8" raw={'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h4"/>'} /></div>
            <div className="scan-title" id="quetTieuDe">{S.cardRead ? 'Đã đọc được thẻ' : 'Đưa thẻ căn cước vào đầu đọc'}</div>
            <div className="scan-desc" id="quetMoTa">{S.cardRead ? <>Số căn cước: <b>{S.cardRead}</b></>
              : <>Hệ thống tự đọc số căn cước và tra cứu ngay.<br />Đầu đọc đang bật, giữ thẻ tới khi có tiếng báo.</>}</div>
            <div className="scan-spinner" id="quetVong" style={S.cardRead ? { display: 'none' } : undefined} />
          </div>)}
        </div>
        <div className="dlg-f">
          <AppButton className="form-btn" onClick={closeCardSwipe}>Hủy</AppButton>
          {S.cardPicking ? null : <AppButton className="form-btn form-btn-primary" onClick={pickCardSwipe}>{S.labels.simulateSwipe}</AppButton>}
        </div>
      </AppModal>

      <AppModal id="dlgChiTietTN" open={S.dialog === 'dlgChiTietTN'} onClose={closeRelativeDetail}>
        <div className="dlg-h">
          <h3>{RELATIVE_DETAIL_TITLE}</h3>
          <CloseButton onClick={closeRelativeDetail} />
        </div>
        <div className="dlg-b"><RelativeDetailBody relative={S.dialog === 'dlgChiTietTN' ? S.relative : null} /></div>
        <div className="dlg-f"><AppButton className="form-btn" onClick={closeRelativeDetail}>Quay lại</AppButton></div>
      </AppModal>

      {/* check-in khác ngày hẹn — cảnh báo, cán bộ vẫn được check-in (TT79 khoản 1 Điều 34) */}
      <AppModal id="dlgCheckInKhacNgay" open={S.dialog === 'dlgCheckInKhacNgay'} onClose={closeCheckInOtherDay}>
        <div className="dlg-h"><h3 className="dlg-t"><DialogIcon level="warn" />{msgParts('C001-17', S.checkInDate || '').title}</h3><CloseButton onClick={closeCheckInOtherDay} /></div>
        <div className="dlg-b"><div className="dlg-text">{msgParts('C001-17', S.checkInDate || '').body}</div></div>
        <div className="dlg-f"><AppButton className="form-btn" onClick={closeCheckInOtherDay}>{msgParts('C001-17').cancel}</AppButton><AppButton className="form-btn form-btn-primary" onClick={confirmCheckInOtherDay}>{msgParts('C001-17').ok}</AppButton></div>
      </AppModal>
    </>
  );
}
