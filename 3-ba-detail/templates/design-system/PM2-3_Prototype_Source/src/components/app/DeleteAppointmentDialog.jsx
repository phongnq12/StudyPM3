/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Hộp «Xóa lịch hẹn» dùng chung cho Danh sách lịch hẹn và Chi tiết lịch hẹn — chỉ lịch Nháp và Từ chối duyệt được xóa (ROW_ACTIONS_BY_STATUS).
 * Nội dung theo khuôn MSG-CF-01 của Message List : tiêu đề «Xác nhận xóa lịch hẹn {mã}» · «Lịch hẹn {mã} sẽ bị xóa khỏi hệ thống. Hành động này không hoàn tác được.» · nút «Xóa lịch hẹn» · chỉ đậm giá trị · nút xác nhận đỏ đặc: hành động phá hủy chỉ dùng đỏ đặc ở bước xác nhận cuối. */
import AppModal from '@/components/app/AppModal';
import { AppButton } from '@/components/app/AppButton';
import DialogCloseButton from '@/components/app/DialogCloseButton';
import { Svg } from '@/lib/icons';
import DialogIcon from '@/components/app/DialogIcon';
import { msgParts } from '@/lib/msg';
import { RichText } from '@/lib/richText';

const WARNING_ICON = '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>';

/**
 * Thuộc tính của DeleteAppointmentDialog (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {boolean} props.open - Bật thì hiện hộp xác nhận xóa lịch hẹn.
 * @param {string} props.code - Mã lịch hẹn ghép vào tiêu đề và câu thông báo theo mã `C001-01`, hiện chữ đậm.
 * @param {function} props.onClose - Gọi khi người dùng bấm Hủy, nút X, nhấn Esc hoặc bấm ra nền.
 * @param {function} props.onConfirm - Gọi khi người dùng bấm nút Xóa lịch hẹn, không truyền đối số.
 */
export default function DeleteAppointmentDialog({ open, code, onClose, onConfirm }) {
  const parts = msgParts('C001-01', 'lịch hẹn', code);   /* chữ hộp theo mã C001-01, mã lịch hẹn in đậm */
  return (
    <AppModal id="dlgXoaNhap" open={open} onClose={onClose}>
      <div className="dlg-h"><h3 className="dlg-t"><DialogIcon level="danger" /><RichText text={parts.title} /></h3><DialogCloseButton onClick={onClose} /></div>
      <div className="dlg-b">
        {/* bọc 1 khối: .dlg-b xếp mỗi phần tử con thành 1 dòng nên chữ đậm sẽ tách dòng nếu đứng trần */}
        <div className="dlg-text"><RichText text={parts.body} /></div>
      </div>
      <div className="dlg-f">
        <AppButton className="btn" onClick={onClose}>Hủy</AppButton>
        <AppButton className="btn btn-danger" id="dlgXoaNhapXacNhan" onClick={onConfirm}>Xóa lịch hẹn</AppButton>
      </div>
    </AppModal>
  );
}
