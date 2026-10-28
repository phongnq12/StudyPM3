/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Hộp "Thay đổi chưa lưu" dùng chung — MSG-CF-03 (Message List, đúng chữ QC-04) ·. Tách từ WEB-54 (VisitConfig).
 * useLeaveGuard(dirty) ⇒ { attempt(fn), release, dialog }
 * - attempt(fn): còn thay đổi chưa lưu ⇒ mở hộp, bấm "Rời khỏi và bỏ thay đổi" mới chạy fn; không đổi ⇒ chạy fn ngay (nút Quay lại, nút Hủy).
 * - Menu trên, menu trái, breadcrumb của AppLayout: chặn ở pha bắt (capture) trên document, rời thì bấm lại đúng phần tử đó.
 * - Tải lại hoặc đóng tab ⇒ hộp của trình duyệt (beforeunload).
 * - release: gọi ngay trước khi màn tự chuyển trang sau khi lưu xong, để không hỏi nữa.
 * dialog: đặt ở bất kỳ đâu trong màn (AppModal đưa ra body). */
import { useEffect, useRef, useState } from 'react';
import { Svg } from '@/lib/icons';
import { AppButton } from '@/components/app/AppButton';
import AppModal from '@/components/app/AppModal';
import DialogCloseButton from '@/components/app/DialogCloseButton';
import DialogIcon from '@/components/app/DialogIcon';
import { msgParts } from '@/lib/msg';   /* message theo mã */

const LEAVE_ICON = '<circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>';   /* chấm than tròn màu cảnh báo */
const LEAVE_MSG = msgParts('C001-03');
export const LEAVE_TITLE = LEAVE_MSG.title;
export const LEAVE_TEXT = LEAVE_MSG.body;   /* C001-03 PM2_MessageList (mã BA MSG-CF-03) — câu cuối không dấu chấm, quy tắc 1.3 số 6 */
/* Phần tử điều hướng của AppLayout: nút nhóm menu trên (không có danh sách con), mục menu thả, mục menu trái, mục breadcrumb */
const NAV_SELECTOR = '.nv-b, .dd-i[data-onclick], .sb-i[data-onclick], .bc a[data-onclick]';

export function useLeaveGuard(dirty, id = 'dlgRoiTrang') {
  const [open, setOpen] = useState(false);
  const pending = useRef(null);
  const released = useRef(false);
  const dirtyRef = useRef(dirty); dirtyRef.current = dirty;
  /* hết thay đổi (đã lưu hoặc đã bỏ) ⇒ lần sửa sau lại được canh */
  useEffect(() => { if (!dirty) released.current = false; }, [dirty]);
  useEffect(() => {
    const active = () => dirtyRef.current && !released.current;
    const onBeforeUnload = (e) => { if (!active()) return; e.preventDefault(); e.returnValue = ''; };
    const onClick = (e) => {
      if (!active() || e.button !== 0) return;
      const el = e.target.closest ? e.target.closest(NAV_SELECTOR) : null;
      if (!el || el.querySelector('.car')) return;   /* nút nhóm có danh sách con chỉ mở danh sách, không rời trang */
      e.preventDefault(); e.stopPropagation();
      pending.current = () => el.click();
      setOpen(true);
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    document.addEventListener('click', onClick, true);
    return () => { window.removeEventListener('beforeunload', onBeforeUnload); document.removeEventListener('click', onClick, true); };
  }, []);

  const attempt = (fn) => { if (dirtyRef.current && !released.current) { pending.current = fn; setOpen(true); } else fn(); };
  const release = () => { released.current = true; };
  const stay = () => { pending.current = null; setOpen(false); };
  const leave = () => { const fn = pending.current; pending.current = null; setOpen(false); released.current = true; if (fn) fn(); };

  const dialog = (
    <AppModal id={id} open={open} onClose={stay} labelledBy={id + 'TieuDe'}>
      <div className="dlg-h"><h3 id={id + 'TieuDe'} className="dlg-t"><DialogIcon level="warn" />{LEAVE_TITLE}</h3><DialogCloseButton onClick={stay} /></div>
      <div className="dlg-b"><div>{LEAVE_TEXT}</div></div>
      <div className="dlg-f">
        <AppButton className="btn" id={id + 'OLai'} onClick={stay}>Ở lại trang</AppButton>
        <AppButton className="btn btn-danger" id={id + 'Roi'} onClick={leave}>Rời khỏi và bỏ thay đổi</AppButton>
      </div>
    </AppModal>
  );
  return { attempt, release, dialog };
}
