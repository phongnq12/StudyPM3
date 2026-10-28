/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Shared config of the Create / Edit direct-visit appointment screens (copied from MENU · SIDE · tooltips of the 2 HTML pages) */
import { appointmentsLayout, DIRECT_LIST_LABEL } from '@/layout/menuConfig';
import { urlListLabel, urlListPath } from '@/data/approvalRoute';

/* Menu theo luồng (20/10/2026): lấy từ nguồn duy nhất menuConfig.js, sáng mục Lịch hẹn thăm gặp trực tiếp */
const DIRECT_LAYOUT = appointmentsLayout(DIRECT_LIST_LABEL);

/* mode: 'create' | 'edit' — giữ tham số cho nơi gọi, menu 2 màn nay giống nhau */
export const buildFormMenu = (mode) => DIRECT_LAYOUT.menu;

export const FORM_SIDEBAR = DIRECT_LAYOUT.sidebar;

/* breadcrumb màn Sửa theo URL đang mở: /lich-hen/gap-truc-tiep-ngoai-le/... ⇒ Lịch hẹn gặp trực tiếp ngoại lệ */
export const buildFormBreadcrumb = (mode, record) => [
  { label: 'Tổng quan', href: '/tong-quan' },
  DIRECT_LAYOUT.breadcrumb[1],
  /* màn con của danh sách ⇒ cấp danh sách bấm được + 1 cấp tên màn (đủ tầng như Chi tiết, Lịch theo buồng) */
  ...(mode === 'edit' ? [{ label: urlListLabel(), href: urlListPath() }, { label: 'Chỉnh sửa lịch hẹn' }] : [{ label: DIRECT_LIST_LABEL, href: '/lich-hen/tham-gap-truc-tiep' }, { label: 'Tạo lịch hẹn' }]),
];

export const FORM_DESCRIPTIONS = {
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

export const MESSAGES = {
  'MSG-WEB-60-02': 'Không tìm thấy thân nhân nào khớp {giá trị tra cứu}, vui lòng kiểm tra lại số căn cước công dân hoặc số điện thoại',
  'MSG-WEB-60-03': 'Thân nhân {họ tên} đã có trong danh sách thân nhân đi cùng, vui lòng chọn người khác',
};

/* Forward button label per step — the Edit screen turns step 3 into "Lưu thay đổi" */
/* Bước cuối: Lưu và gửi duyệt (thay nút Đăng ký). Sửa chỉ còn ở Nháp và Bị từ chối nên cùng nhãn */
export const stepButtonLabels = () => ({ 1: 'Tiếp tục', 2: 'Tiếp tục', 3: 'Lưu và gửi duyệt' });

/* missing-field label -> internal field key (see FIELD_ERROR_TARGETS in formActions) */
export const FIELD_KEY_BY_LABEL = {
  'Thân nhân người cai nghiện': 'relative', 'Người cai nghiện': 'student', 'Loại hình thăm gặp': 'visitType',
  'Quầy tiếp đón': 'counter', 'Ngày thăm gặp': 'visitDate', 'Thời lượng': 'duration',
  'Khung giờ': 'startTime', 'Buồng thăm gặp': 'table',
  'Luồng đăng ký': 'route',   /* chữ đỏ dưới khối chọn luồng */
  /* đơn xin duyệt: mỗi ô bắt buộc có chữ đỏ riêng */
  'Họ tên thân nhân': 'exName', 'Số căn cước công dân của thân nhân (12 chữ số)': 'exCitizenId', 'Quan hệ với người cai nghiện': 'exRelationship',
  'Người cai nghiện được thăm': 'exStudent', 'Lý do xin duyệt': 'exReason',
};
/* ô gõ chữ ⇒ «Vui lòng nhập», ô chọn ⇒ «Vui lòng chọn» */
export const TYPED_FIELD_KEYS = ['exName', 'exCitizenId', 'exReason'];

/* status enum -> CSS class of the status tag */
export const STATUS_CLASS = {
  PENDING_APPROVAL: 'is-pending', PENDING_HEAD_APPROVAL: 'is-pending', APPROVED: 'is-approved',
  CHECKED_IN: 'is-running', IN_PROGRESS: 'is-running',
  COMPLETED: 'is-closed', CANCELLED: 'is-cancelled', ABSENT: 'is-cancelled', REJECTED: 'is-cancelled', DRAFT: 'is-closed',
};

export const MAX_COMPANIONS = 2;
