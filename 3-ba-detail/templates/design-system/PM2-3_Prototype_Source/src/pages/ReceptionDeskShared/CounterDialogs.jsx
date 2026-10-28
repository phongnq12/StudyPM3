/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Activate · Deactivate · Delete popups of a reception counter — one source for List and Detail (WEB-02).
 * Deactivate cancels the upcoming appointments through lib/resourceImpact and keeps the dormitories of the counter. */
import { useState } from 'react';
import { Svg } from '@/lib/icons';
import { toast } from '@/lib/legacyUi';
import { msg, msgParts } from '@/lib/msg';
import { RichText, key } from '@/lib/richText';
import { AppButton } from '@/components/app/AppButton';
import AppModal from '@/components/app/AppModal';
import DialogCloseButton from '@/components/app/DialogCloseButton';
import { affectedByCounter, cancelAppointments, REASON_RESOURCE } from '@/lib/resourceImpact';
import {
  STATUS_ACTIVE, STATUS_INACTIVE, canActivate, canDelete, changeStatus, deleteCounter, dormitoriesOf, dormitoryName, findCounter, logCounter,
} from './counterLogic';
import { COUNTER_ICONS } from './config';
import { useEscapeRestoreFocus } from './escFocus';
import './CounterDialogs.css';
import DialogIcon from '@/components/app/DialogIcon';

const WarningIcon = <DialogIcon level="warn" />;   /* Vô hiệu hóa ⇒ cam · Xóa ⇒ đỏ · Kích hoạt ⇒ không icon */
/* onChanged(code, action): after activate / deactivate / delete; returning 'navigated' leaves the toast to the next page. Returns { open(action, code), overlays } */
export function useCounterDialogs(onChanged) {
  const [dialog, setDialog] = useState('');
  const [code, setCode] = useState('');
  const [openCount, setOpenCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const close = () => setDialog('');
  const rememberOpener = useEscapeRestoreFocus(dialog !== '', close);
  const target = code ? findCounter(code) : null;

  const open = (action, counterCode) => {
    const c = findCounter(counterCode); if (!c) return;
    if (action === 'delete' && !canDelete(c)) return;
    if (action === 'activate' && !canActivate(c)) return;
    rememberOpener(); setCode(counterCode); setOpenCount((n) => n + 1); setBusy(false); setDialog(action);
  };

  /* Playbook List ②5: quầy chưa có dãy nhà không đủ điều kiện kích hoạt ⇒ nút Kích hoạt ẩn hẳn ở Danh sách và Chi tiết (canActivate), popup không còn nhánh cảnh báo */
  const missingDormitory = target ? !canActivate(target) : false;
  const affected = dialog === 'deactivate' && target ? affectedByCounter(target.code) : [];

  /* ghi hỏng ⇒ toast lỗi, popup ở lại, trạng thái giữ nguyên, ⛔ ghi lịch sử, ⛔ hủy lịch */
  const failed = (action) => { setBusy(false); toast(msg('SE001-01', action + ' quầy tiếp đón'), 'is-error'); };
  const confirmActivate = () => {
    const c = target; if (!c || missingDormitory || busy) return;
    setBusy(true);
    const before = c.status;
    if (!changeStatus(c.code, STATUS_ACTIVE)) { failed('kích hoạt'); return; }
    logCounter(c.code, 'Kích hoạt', { statusBefore: before, statusAfter: STATUS_ACTIVE });
    close(); onChanged(c.code, 'activate');
    toast(msg('I001-56', 'quầy tiếp đón', c.code));
  };
  const confirmDeactivate = () => {
    const c = target; if (!c || busy) return;
    setBusy(true);
    /* ghi trạng thái TRƯỚC, ghi được rồi mới hủy lịch */
    if (!changeStatus(c.code, STATUS_INACTIVE)) { failed('vô hiệu hóa'); return; }
    const n = affected.length ? cancelAppointments(affected, REASON_RESOURCE) : 0;
    logCounter(c.code, 'Vô hiệu hóa', { statusBefore: c.status, statusAfter: STATUS_INACTIVE });
    close(); onChanged(c.code, 'deactivate');
    toast(n ? msg('I001-69', 'quầy tiếp đón', c.code, n) : msg('I001-68', 'quầy tiếp đón', c.code));
  };
  const confirmDelete = () => {
    const c = target; if (!c || busy) return;
    setBusy(true);
    if (!deleteCounter(c.code)) { failed('xóa'); return; }
    close();
    if (onChanged(c.code, 'delete') !== 'navigated') toast(msg('I001-04', 'quầy tiếp đón ' + key(c.code)));
  };

  /* Hộp xác nhận theo mã Message List: C001-11 kích hoạt · C001-09 vô hiệu hóa · C001-01 xóa */
  const targetCode = target ? target.code : '';
  const pActivate = msgParts('C001-11', 'quầy tiếp đón', targetCode, 'đặt lịch thăm gặp');
  const pDeactivate = msgParts('C001-09', 'quầy tiếp đón', targetCode);   /* tên chỉ ở nội dung, tiêu đề không lặp */
  const pDelete = msgParts('C001-01', 'quầy tiếp đón', targetCode);
  const overlays = <>
    <AppModal id="dlgKichHoat" open={dialog === 'activate'} onClose={close}>
      <div className="dlg-h"><h3 className="dlg-t"><RichText text={pActivate.title} /></h3><DialogCloseButton onClick={close} /></div>
      <div className="dlg-b" id="khNoiDung" key={'kh' + openCount}>{target && <>
        <div className="dlg-text"><RichText text={pActivate.body} /></div>
      </>}</div>
      <div className="dlg-f">
        <AppButton className="btn" onClick={close}>Hủy</AppButton>
        <AppButton className="btn btn-primary" id="khNutOk" disabled={missingDormitory || busy} onClick={confirmActivate}>Kích hoạt</AppButton>
      </div>
    </AppModal>

    <AppModal id="dlgVoHieu" open={dialog === 'deactivate'} onClose={close}>
      <div className="dlg-h"><h3 className="dlg-t">{WarningIcon}<RichText text={pDeactivate.title} /></h3><DialogCloseButton onClick={close} /></div>
      <div className="dlg-b" id="vhNoiDung" key={'vh' + openCount}>{target && <>
        <div className="dlg-text"><RichText text={pDeactivate.body} /></div>
        <div className="dlg-text">{msg('W001-17')}</div>
        {affected.length ? <div className="eff is-warning"><RichText text={msg('W001-15', 'Quầy' + (targetCode ? ' ' + key(targetCode) : ''), affected.length)} /></div> : null}
        {target.status === STATUS_ACTIVE && dormitoriesOf(target).length ? <div className="eff is-warning"><RichText text={msg('W001-16', dormitoriesOf(target).map(dormitoryName).join(', '))} /></div> : null}
      </>}</div>
      <div className="dlg-f">
        <AppButton className="btn" onClick={close}>Hủy</AppButton>
        <AppButton className="btn btn-primary" id="vhNutOk" disabled={busy} onClick={confirmDeactivate}>Vô hiệu hóa</AppButton>
      </div>
    </AppModal>

    <AppModal id="dlgXoa" open={dialog === 'delete'} onClose={close}>
      <div className="dlg-h"><h3 className="dlg-t"><DialogIcon level="danger" /><RichText text={pDelete.title} /></h3><DialogCloseButton onClick={close} /></div>
      <div className="dlg-b"><div className="dlg-text" id="xoaNoiDung">{target ? <RichText text={pDelete.body} /> : null}</div></div>
      <div className="dlg-f">
        <AppButton className="btn" onClick={close}>Hủy</AppButton>
        <AppButton className="btn btn-danger" id="xoaNutOk" disabled={busy} onClick={confirmDelete}>Xóa</AppButton>
      </div>
    </AppModal>
  </>;

  return { open, overlays };
}
