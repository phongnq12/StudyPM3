/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Icon tiêu đề hộp xác nhận có rủi ro — 1 nguồn cho mọi popup PM2.
 * Hình tròn chấm than 22px (Ant Design Modal.confirm, PM1). Microsoft: không dùng dấu hỏi, không gắn icon cảnh báo cho câu hỏi thường.
 * level: 'danger' — không hoàn tác (Xóa, Hủy lịch hẹn) màu --color-err · 'warn' — có ảnh hưởng (Vô hiệu hóa, Rời trang, Đổi khung giờ) màu --color-warn.
 * Popup thao tác thường (Kích hoạt, Duyệt) KHÔNG gắn icon. */
import { Svg } from '@/lib/icons';

const ICON = '<circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>';

/**
 * Thuộc tính của DialogIcon (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {'warn' | 'danger'} props.level - Mức rủi ro: `danger` thêm lớp `is-danger` cho thao tác không hoàn tác, `warn` cho thao tác có ảnh hưởng.
 */
export default function DialogIcon({ level = 'warn' }) {
  return <span className={'dlg-ic' + (level === 'danger' ? ' is-danger' : '')} aria-hidden="true"><Svg raw={ICON} /></span>;
}
