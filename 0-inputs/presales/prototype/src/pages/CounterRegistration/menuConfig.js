/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Menu ngang + sidebar màn Đăng ký lượt tại quầy — lấy từ nguồn duy nhất menuConfig.js (menu theo luồng, 20/10/2026) */
import { appointmentsLayout, COUNTER_LABEL } from '@/layout/menuConfig';
const LAYOUT = appointmentsLayout(COUNTER_LABEL);
export const MENU = LAYOUT.menu;
export const SIDEBAR = LAYOUT.sidebar;
export const BREADCRUMB = [...LAYOUT.breadcrumb, { label: COUNTER_LABEL }];

export const DESCRIPTIONS = {
  'Xuất Excel': 'Tải danh sách lịch hẹn đang lọc ra file Excel',
  'Tạo mới': 'Tạo lịch hẹn thăm gặp trực tiếp mới',
  'Bỏ chọn hết': 'Bỏ chọn tất cả lịch hẹn đang chọn',
  'Duyệt': 'Phê duyệt các lịch hẹn đã chọn',
  'Từ chối': 'Từ chối duyệt các lịch hẹn đã chọn',
  'Đóng': 'Đóng cửa sổ này',
  'Hủy': 'Hủy thao tác và đóng cửa sổ này',
  'Hủy và đề xuất lịch thay thế': 'Hủy lịch hẹn này và gửi đề xuất khung giờ khác cho thân nhân',
  'Xác nhận hủy': 'Hủy lịch hẹn với lý do đã chọn',
  'Xác nhận điều chỉnh': 'Lưu khung giờ và buồng thăm gặp mới',
  'Xác nhận dời': 'Lưu ngày giờ mới của lịch hẹn',
  'Đăng ký': 'Tạo lịch hẹn ở trạng thái Đã duyệt, thân nhân check-in sau tại quầy',
  'Tra cứu': 'Tìm thân nhân theo số căn cước công dân hoặc số điện thoại',
  'Thêm thân nhân đi cùng': 'Thêm 1 thân nhân đi cùng vào lịch hẹn',
  'Chọn ngày hẹn': 'Mở lịch để chọn ngày thăm gặp',
  'Chọn ngày hôm nay': 'Chọn ngày thăm gặp là hôm nay',
  'Giả lập quẹt thẻ': 'Giả lập quẹt thẻ căn cước để điền số tự động',
  'Quay lại bước trước': 'Quay lại bước trước, giữ nguyên thông tin đã nhập',
  'Dời lịch': 'Chuyển lịch hẹn sang ngày giờ khác',
  'Check-in': 'Ghi nhận thân nhân đã đến quầy tiếp đón',
  'Hủy lịch hẹn': 'Hủy lịch hẹn này',
  'Áp dụng': 'Áp dụng khen thưởng đã chọn cho tuần này',
  'Quay lại': 'Quay lại, không thực hiện thao tác',
  'Trang trước': 'Xem trang trước',
  'Trang sau': 'Xem trang sau',
};
