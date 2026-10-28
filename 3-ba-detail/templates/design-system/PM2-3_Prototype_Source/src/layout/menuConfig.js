/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Menu ngang + sidebar — NGUỒN DUY NHẤT của mọi màn Prototype (QD menu theo luồng, 20/10/2026).
 * Menu ngang chỉ hiện TÊN NHÓM (dropdown: false), bấm nhóm ⇒ mở mục đầu có đường dẫn; mục con chỉ nằm ở sidebar ⇒ 2 menu không trùng nhau.
 * Nhóm xếp theo luồng sử dụng: Thăm gặp trực tiếp (quầy là điểm vào, sinh lịch thường và đơn ngoại lệ) · Thăm gặp từ xa.
 * URL giữ nguyên như cũ (/lich-hen/… · /tiep-don/…), chỉ đổi vị trí trên menu — tiền lệ. */

const DIRECT_GROUP = 'Thăm gặp trực tiếp';
const OPERATIONS_GROUP = 'Vận hành Cơ sở';
const ADMIN_GROUP = 'Quản trị & Báo cáo';
export const DIRECT_LIST_LABEL = 'Lịch hẹn thăm gặp trực tiếp';
export const EXCEPTION_LIST_LABEL = 'Lịch hẹn gặp trực tiếp ngoại lệ';
export const COUNTER_LABEL = 'Đăng ký lượt thăm gặp tại quầy';

/* Thăm gặp trực tiếp — theo vòng đời 1 ca: đăng ký tại quầy (điểm vào) ⇒ lịch hẹn ⇒ đơn ngoại lệ chờ duyệt ⇒ tiếp đón ⇒ điều hành ca */
const DIRECT_ITEMS = [
  { icon: 'plus', label: COUNTER_LABEL, href: '/tiep-don/dang-ky-luot-tai-quay' },
  { icon: 'calendar', label: DIRECT_LIST_LABEL, href: '/lich-hen/tham-gap-truc-tiep' },
  { icon: 'file', label: EXCEPTION_LIST_LABEL, href: '/lich-hen/gap-truc-tiep-ngoai-le' },
  { icon: 'checkIn', label: 'Tiếp đón và đối chiếu giấy tờ' },
  { icon: 'calendar', label: 'Điều hành ca thăm gặp trực tiếp' },
  { icon: 'prohibit', label: 'Hủy lịch theo lô' },
];

/* Thăm gặp từ xa — video call và gọi điện */
const REMOTE_ITEMS = [
  { icon: 'video', label: 'Thăm gặp trực tuyến' },
  { icon: 'phone', label: 'Gọi điện thường kỳ' },
];

/* Vận hành Cơ sở — thứ tự theo thứ tự khai: khung giờ ⇒ quầy (buồng quản lý trong quầy). Phân khu không còn ở PM2, lấy Dãy nhà của PM1 */
const OPERATIONS_ITEMS = [
  { icon: 'calendar', label: 'Cấu hình thời gian', href: '/van-hanh-co-so/cau-hinh-thoi-gian' },   /* tên ngắn thay "Cấu hình khung giờ và thời lượng" */
  { icon: 'bell', label: 'Cài đặt thông báo', href: '/quan-tri/cai-dat-thong-bao' },   /* dời từ Quản trị & Báo cáo, ngay dưới Cấu hình thời gian · URL giữ nguyên */
  { icon: 'desk', label: 'Cài đặt quầy tiếp đón', href: '/tiep-don/quay-tiep-don' },   /* tên đổi theo */
  { icon: 'db', label: 'Danh mục nghiệp vụ' },
];

const ADMIN_ITEMS = [
  { icon: 'key', label: 'Tài khoản người dùng' },
  { icon: 'shield', label: 'Phân quyền vai trò' },
  { icon: 'chart', label: 'Báo cáo thống kê' },
  { icon: 'bell', label: 'Quản lý thông báo', href: '/quan-tri/thong-bao' },
];

const GROUPS = [
  { icon: 'dashboard', label: 'Tổng quan', href: '/tong-quan' },
  { icon: 'users', label: 'Hồ sơ', dropdown: false, children: [
    { icon: 'users', label: 'Người cai nghiện' },
    { icon: 'users', label: 'Thân nhân' },
    { icon: 'file', label: 'Liên kết thân nhân' },
    { icon: 'db', label: 'Quỹ lượt thăm gặp' },
  ] },
  { icon: 'calendar', label: DIRECT_GROUP, dropdown: false, children: DIRECT_ITEMS },
  { icon: 'video', label: 'Thăm gặp từ xa', dropdown: false, children: REMOTE_ITEMS },
  { icon: 'building', label: OPERATIONS_GROUP, dropdown: false, children: OPERATIONS_ITEMS },
  { icon: 'shield', label: ADMIN_GROUP, dropdown: false, children: ADMIN_ITEMS },
];

const firstHref = (items) => (items.find((c) => c.href) || {}).href;

/* Khung 1 màn: menu ngang sáng nhóm, sidebar = mục con của nhóm (sáng mục activeLabel), breadcrumb gốc Tổng quan › nhóm.
 * Dùng: const L = groupLayout('Vận hành Cơ sở', 'Cài đặt quầy tiếp đón'); <AppLayout menu={L.menu} sidebar={L.sidebar} breadcrumb={[...L.breadcrumb, …]}> */
export function groupLayout(groupLabel, activeLabel) {
  const menu = GROUPS.map((g) => (g.label === groupLabel
    ? { ...g, active: true, children: g.children && g.children.map((c) => ({ ...c, active: c.label === activeLabel })) }
    : { ...g, active: false, children: g.children && g.children.map((c) => ({ ...c, active: false })) }));
  const group = menu.find((g) => g.label === groupLabel);
  const current = group.children.find((c) => c.label === activeLabel && c.href);
  return {
    menu,
    sidebar: { group: groupLabel, items: group.children },
    breadcrumb: [{ label: 'Tổng quan', href: '/tong-quan' }, { label: groupLabel, href: current ? current.href : firstHref(group.children) }],
  };
}

/* Nhóm Thăm gặp trực tiếp (Lịch hẹn · Đơn ngoại lệ · Đăng ký tại quầy) */
export const appointmentsLayout = (activeLabel) => groupLayout(DIRECT_GROUP, activeLabel);
/* Nhóm Vận hành Cơ sở */
export const operationsLayout = (activeLabel) => groupLayout(OPERATIONS_GROUP, activeLabel);
/* Nhóm Quản trị & Báo cáo */
export const adminLayout = (activeLabel) => groupLayout(ADMIN_GROUP, activeLabel);

/* Quản trị & Báo cáo · Quản lý thông báo */
const ADMIN_NOTIFY = adminLayout('Quản lý thông báo');
export const ADMIN_MENU = ADMIN_NOTIFY.menu;
export const ADMIN_SIDEBAR = ADMIN_NOTIFY.sidebar;
export const ADMIN_BREADCRUMB = ADMIN_NOTIFY.breadcrumb;

/* Mặc định của cluster "appointments" (AppLayout không truyền menu/sidebar riêng): sáng Lịch hẹn thăm gặp trực tiếp */
const DIRECT_DEFAULT = appointmentsLayout(DIRECT_LIST_LABEL);
export const MENU = (cluster) => (cluster === 'appointments' ? DIRECT_DEFAULT.menu : undefined);
export const SIDEBAR = { appointments: DIRECT_DEFAULT.sidebar };
