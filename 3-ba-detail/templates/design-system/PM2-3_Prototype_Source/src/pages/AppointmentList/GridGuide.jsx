/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* WEB-06 · Lịch theo buồng — nút «Hướng dẫn thao tác» + popup. Mỗi dòng 1 thao tác, không đánh số vì không tuần tự.
 * Nội dung chỉ mô tả hành vi đang có của ListCalendar.jsx. */
import { useState } from 'react';
import AppModal from '@/components/app/AppModal';
import { AppButton, AppButtonWithIcon } from '@/components/app/AppButton';
import { Svg } from '@/lib/icons';
import { durationOptions } from '@/data/visitConfigStore';
import './GridGuide.css';
import DialogCloseButton from '@/components/app/DialogCloseButton';

const MIN_DURATION = Math.min(...durationOptions());
const MAX_DURATION = Math.max(...durationOptions());
const ICON = {
  help: '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
  day: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  move: '<path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/>',
  resize: '<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>',
  cancel: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
};
const ROWS = [
  { icon: 'day', name: 'Đổi ngày xem', desc: 'Lùi hoặc tiến 1 ngày. Bấm vào ô ngày ở giữa để chọn ngày khác.', keys: ['‹', '›'] },
  { icon: 'move', name: 'Dời giờ hoặc đổi buồng', desc: 'Giữ tay nắm rồi kéo: Kéo ngang để đổi giờ, kéo dọc để đổi buồng. Thả ra sẽ có hộp xác nhận trước khi lưu.', keys: ['Kéo ⠿'] },
  { icon: 'resize', name: 'Đổi thời lượng', desc: 'Kéo mép phải của khối, trong khoảng ' + MIN_DURATION + '–' + MAX_DURATION + ' phút.', keys: ['Kéo mép phải'] },
  { icon: 'cancel', name: 'Hủy điều chỉnh', desc: 'Bấm Hủy ở hộp xác nhận: Khối trở về vị trí cũ, không lưu gì.', keys: ['Hủy'] },
];
const NOTES = [
  <>Khối có biểu tượng cấm kéo là lịch không được dời.</>,
  <>Lịch ở trạng thái <b>Hoàn thành check-in</b> chỉ dời được trong cùng ngày.</>,
];

export default function GridGuide() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <AppButtonWithIcon className="grid-guide-btn" id="nutHuongDanLuoi" onClick={() => setOpen(true)} iconRaw={ICON.help}>Hướng dẫn thao tác</AppButtonWithIcon>
      <AppModal id="dlgHuongDanLuoi" open={open} onClose={() => setOpen(false)} dlgClassName="dlg grid-guide-dlg">
        <div className="dlg-h"><h3>Hướng dẫn thao tác</h3>
          <DialogCloseButton onClick={() => setOpen(false)} /></div>
        <div className="dlg-b grid-guide-body">
          <div className="grid-guide-section">Chuyển ngày xem, rồi kéo thả lịch hẹn ngay trên lưới để dời giờ, đổi buồng hoặc đổi thời lượng</div>
          <ul className="grid-guide-rows">
            {ROWS.map((r) => (
              <li key={r.name} className="grid-guide-row">
                <span className="grid-guide-ic"><Svg raw={ICON[r.icon]} /></span>
                <span className="grid-guide-text"><span className="grid-guide-name">{r.name}</span><span className="grid-guide-desc">{r.desc}</span></span>
                <span className="grid-guide-keys">{r.keys.map((keyName) => <kbd key={keyName}>{keyName}</kbd>)}</span>
              </li>
            ))}
          </ul>
          <div className="grid-guide-note">
            <span className="grid-guide-note-ic"><Svg raw={ICON.info} /></span>
            <ul>{NOTES.map((n, i) => <li key={i}>{n}</li>)}</ul>
          </div>
        </div>
        <div className="dlg-f"><AppButton className="btn" onClick={() => setOpen(false)}>Quay lại</AppButton></div>
      </AppModal>
    </>
  );
}
