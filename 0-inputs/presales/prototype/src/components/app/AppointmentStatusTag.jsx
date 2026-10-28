/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Tag trạng thái lịch hẹn dùng chung Danh sách · Chi tiết · tiêu đề màn Sửa (tag cùng nhãn cùng màu).
 * Khuôn lấy theo màn Danh sách: tag tag-dot tag-{trạng thái}, màu ở styles/base.css. */
import AppTag from '@/components/app/AppTag';
import { statusLabel } from '@/data/appointmentStore';
import { STATUS_CLASS } from '@/pages/AppointmentList/listLogic';

/**
 * Thuộc tính của AppointmentStatusTag (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {string} props.status - Trạng thái lịch hẹn quyết định nhãn và lớp màu `tag-{trạng thái}`, rỗng thì không vẽ gì.
 * @param {string} props.id - Mã định danh gắn lên thẻ tag.
 * @param {boolean} props.hidden - Ẩn thẻ tag bằng thuộc tính `hidden` của HTML, tag vẫn có trong DOM.
 */
export default function AppointmentStatusTag({ status, id, hidden }) {
  if (!status) return null;
  return <AppTag className={'tag tag-dot tag-' + (STATUS_CLASS[status] || 'completed')} id={id} hidden={hidden}>{statusLabel(status)}</AppTag>;
}
