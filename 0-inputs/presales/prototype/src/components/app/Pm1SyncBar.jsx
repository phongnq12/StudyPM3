/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Thời điểm đồng bộ dữ liệu người cai nghiện từ PM1 + nút «Đồng bộ lại» — đặt ở tiêu đề khối NGƯỜI CAI NGHIỆN
 * của màn Tạo mới / Chỉnh sửa lịch hẹn và Đăng ký lượt thăm gặp tại quầy. Dữ liệu PM1 đọc theo thời gian thực; PM1 lỗi thì cán bộ bấm Đồng bộ lại để đọc lại rồi làm tiếp.
 * Prototype không nối PM1 thật: bấm nút thì ghi lại giờ đồng bộ và dựng lại thẻ người cai nghiện (onSync) để xét lại điều kiện thăm gặp. */
import { useState } from 'react';
import { AppButton } from '@/components/app/AppButton';
import { Svg } from '@/lib/icons';
import './Pm1SyncBar.css';

const REFRESH_ICON = '<path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/>';
const pad = (n) => String(n).padStart(2, '0');
const stamp = (d) => pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());

/**
 * Thuộc tính của Pm1SyncBar (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {function} props.onSync - Gọi khi bấm nút Đồng bộ lại, sau khi cập nhật giờ đồng bộ, không nhận đối số.
 */
export default function Pm1SyncBar({ onSync }) {
  const [at, setAt] = useState(() => stamp(new Date()));
  const sync = () => { setAt(stamp(new Date())); if (onSync) onSync(); };
  return (
    <span className="pm1-sync-bar">
      <span className="pm1-sync-time" id="nhanDongBoPm1">Đồng bộ từ PM1 lúc <b>{at}</b></span>
      <AppButton className="btn btn-sm pm1-sync-btn" id="nutDongBoLai" onClick={sync}><Svg raw={REFRESH_ICON} />Đồng bộ lại</AppButton>
    </span>
  );
}
