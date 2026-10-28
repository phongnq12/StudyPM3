/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* PM3 (dựng lại từ PM2) · Tài khoản đăng nhập giả lập của Prototype.
 * PM3 chỉ còn 2 vai của kho căng tin: Người phụ trách căng tin (thao tác đủ) và Kế toán (chỉ xem, xuất Excel).
 * Đổi tài khoản qua menu góc phải "Đăng nhập tài khoản khác"; lựa chọn lưu localStorage để tải lại trang vẫn giữ.
 * canApproveAppointment: tài khoản CÓ vai duyệt (Trưởng cơ sở · Cán bộ Tổ thăm gặp). Duyệt được lịch nào thì xét canApproveRecord. */
export const ACCOUNTS = [
  { key: 'CANTEEN_MANAGER', name: 'Nguyễn Văn Hùng', role: 'Người phụ trách căng tin', initials: 'NH', canApproveAppointment: false },
  { key: 'ACCOUNTANT', name: 'Trần Thị Mai', role: 'Kế toán', initials: 'TM', canApproveAppointment: false },
];
/* vai của PM2 — giữ lại để mã nguồn PM2 còn trong thư mục không gãy, không hiện ở menu đổi tài khoản của PM3 */
export const PM2_ACCOUNTS = [
  { key: 'ADVISORY_STAFF', name: 'Nguyễn Thùy Trang', role: 'Cán bộ Tổ tham mưu', initials: 'NT', canApproveAppointment: false },
  { key: 'FACILITY_HEAD', name: 'Trưởng Cơ Sở', role: 'Trưởng cơ sở', initials: 'TC', canApproveAppointment: true },
  { key: 'VISIT_TEAM_STAFF', name: 'Nguyễn Thùy Linh', role: 'Cán bộ Tổ thăm gặp', initials: 'NL', canApproveAppointment: true },   /* duyệt lịch đặt trên ứng dụng */
];
const STORAGE_KEY = 'pm3.currentAccount';
/* Cơ sở của tài khoản đăng nhập — 1 nguồn cho dòng tên cơ sở ở đầu trang (AppLayout) và biến {ten_co_so} của thông báo */
export const FACILITY_NAME = 'Cơ sở cai nghiện ma túy số 1';

export function currentAccount() {
  let key = null;
  try { key = localStorage.getItem(STORAGE_KEY); } catch (e) { key = null; }
  return ACCOUNTS.find((a) => a.key === key) || ACCOUNTS[0];
}

export function switchAccount(key) {
  try { localStorage.setItem(STORAGE_KEY, key); } catch (e) { /* trình duyệt chặn lưu thì chỉ đổi trong lần tải này */ }
  location.reload();
}

/* màn /dang-nhap giả lập — 1 tài khoản admin, mật khẩu kiểm ở trình duyệt vì là Prototype.
 * Đăng nhập xong vẫn đổi vai qua menu góc phải như cũ. Ghi nhớ đăng nhập ⇒ localStorage, không ghi nhớ ⇒ sessionStorage (đóng tab là thoát).
 * Trình duyệt tự động (Playwright: navigator.webdriver) bỏ qua cổng để cổng UI/UX, agent review, Data Test không bị chặn. */
const SESSION_KEY = 'pm3.session';
export const DEMO_LOGIN = { username: 'admin', password: 'Admin@123' };   /* đổi 21/10/2026 */
export function isLoggedIn() {
  if (typeof navigator !== 'undefined' && navigator.webdriver) return true;
  try { return localStorage.getItem(SESSION_KEY) === '1' || sessionStorage.getItem(SESSION_KEY) === '1'; } catch (e) { return true; }   /* trình duyệt chặn lưu ⇒ không khoá người dùng ở ngoài */
}
export function login(username, password, remember) {
  if (String(username).trim().toLowerCase() !== DEMO_LOGIN.username || password !== DEMO_LOGIN.password) return false;
  try { (remember ? localStorage : sessionStorage).setItem(SESSION_KEY, '1'); } catch (e) { /* chỉ giữ trong lần tải này */ }
  return true;
}
export function logout() {
  try { localStorage.removeItem(SESSION_KEY); sessionStorage.removeItem(SESSION_KEY); } catch (e) { /* bỏ qua */ }
}

export const canApproveAppointment = () => currentAccount().canApproveAppointment;

/* Người duyệt theo TRẠNG THÁI CHỜ của lịch (tách màn ngoại lệ, đổi luật):
 * · Chờ duyệt (màn Thăm gặp trực tiếp, thân nhân hợp lệ, kể cả lịch bị từ chối gửi lại) ⇒ Cán bộ Tổ thăm gặp.
 * · Chờ Trưởng cơ sở duyệt (đơn ngoại lệ tạo tại quầy) ⇒ Trưởng cơ sở. */
export const APPROVER_BY_STATUS = { PENDING_APPROVAL: 'VISIT_TEAM_STAFF', PENDING_HEAD_APPROVAL: 'FACILITY_HEAD' };
export const approverKeyOf = (r) => (r && APPROVER_BY_STATUS[r.status]) || (r && r.approvalRoute === 'EXEMPTION' ? 'FACILITY_HEAD' : 'VISIT_TEAM_STAFF');
export const approverRoleOf = (r) => (ACCOUNTS.find((a) => a.key === approverKeyOf(r)) || {}).role || '';
export const canApproveRecord = (r) => !!r && !!APPROVER_BY_STATUS[r.status] && approverKeyOf(r) === currentAccount().key;

/* ── Phân quyền theo MÀN × VAI TRÒ — 1 bảng duy nhất, mọi màn gọi can(screen, action, record) ──
 * Màn: direct = Thăm gặp trực tiếp (kèm Chi tiết, Tạo mới, Chỉnh sửa, Lịch theo buồng) · exception = Gặp trực tiếp ngoại lệ · operations = nhóm Vận hành cơ sở.
 * Thao tác: view · create · edit · delete · cancel · approve · reject · adjust (Điều chỉnh thời gian và buồng = kéo thả trên Lịch theo buồng) · absent.
 * Vai trò vắng mặt trong màn = không thấy màn (ẩn menu, gõ thẳng URL thì chuyển về Thăm gặp trực tiếp).
 * Phê duyệt / Từ chối duyệt vẫn xét thêm người duyệt theo trạng thái (canApproveRecord). */
export const SCREEN_PURCHASE_PRICE = 'purchasePrice';
export const SCREEN_DIRECT = 'direct', SCREEN_EXCEPTION = 'exception', SCREEN_OPERATIONS = 'operations', SCREEN_NOTIFICATION_SETTINGS = 'notificationSettings';
const ALL_ACTIONS = ['view', 'create', 'edit', 'delete', 'cancel', 'approve', 'reject', 'adjust', 'absent'];
export const SCREEN_ACCESS = {
  /* PM3 · Giá nhập theo nhà cung cấp — Kế toán chỉ xem và xuất Excel, không thấy Thêm, Sửa, Xóa */
  purchasePrice: {
    CANTEEN_MANAGER: { actions: ['view', 'export', 'create', 'edit', 'delete'] },
    ACCOUNTANT: { actions: ['view', 'export'] },
  },
  direct: {
    VISIT_TEAM_STAFF: { actions: ALL_ACTIONS },
    ADVISORY_STAFF: { actions: ['view', 'create', 'edit', 'delete', 'cancel'] },   /* không duyệt, không xếp lịch, không đánh dấu vắng mặt */
    FACILITY_HEAD: { actions: ['view'] },   /* chỉ xem (Xem chi tiết, Xuất Excel) */
  },
  exception: {
    FACILITY_HEAD: { actions: ALL_ACTIONS.filter((a) => a !== 'adjust' && a !== 'cancel'), byStatus: { REJECTED: ['cancel'] } },   /* không Điều chỉnh, không kéo thả · có mọi nút của màn, Hủy cấp theo trạng thái Từ chối duyệt như Tổ thăm gặp (đơn Chờ Trưởng cơ sở duyệt vẫn không có Hủy) */
    VISIT_TEAM_STAFF: { actions: ['view'], byStatus: { REJECTED: ['edit', 'cancel'] } },   /* chỉ xem, riêng Từ chối duyệt được sửa gửi duyệt lại và Hủy */
  },
  operations: {
    VISIT_TEAM_STAFF: { actions: ALL_ACTIONS },
    ADVISORY_STAFF: { actions: ALL_ACTIONS },
  },
  notificationSettings: {   /* Cài đặt thông báo — 2 tổ xem và sửa, Trưởng cơ sở không vào màn */
    VISIT_TEAM_STAFF: { actions: ['view', 'edit'] },
    ADVISORY_STAFF: { actions: ['view', 'edit'] },
  },
};
const ruleOf = (screen) => (SCREEN_ACCESS[screen] || {})[currentAccount().key] || null;
export const canOpenScreen = (screen) => !!ruleOf(screen);
/* thao tác cấp riêng theo trạng thái của bản ghi (ngoài bảng thao tác theo trạng thái của Danh sách) */
export const grantedByStatus = (screen, r) => { const rule = ruleOf(screen); return (rule && rule.byStatus && r && rule.byStatus[r.status]) || []; };
export function can(screen, action, record) {
  const rule = ruleOf(screen);
  if (!rule) return false;
  const ok = rule.actions.indexOf(action) >= 0 || grantedByStatus(screen, record).indexOf(action) >= 0;
  if (!ok) return false;
  if ((action === 'approve' || action === 'reject') && record) return canApproveRecord(record);
  return true;
}
/* màn của 1 đường dẫn — ẩn mục menu, chặn URL (Đăng ký tại quầy, Thông báo không thuộc màn nào ⇒ giữ nguyên) */
const OPERATIONS_PATHS = ['/van-hanh-co-so/', '/tiep-don/quay-tiep-don'];   /* bỏ màn Buồng thăm gặp */
export function screenOfPath(path) {
  const p = String(path || '');
  if (p === '/hang-hoa/gia-nhap' || p.indexOf('/hang-hoa/gia-nhap/') === 0) return SCREEN_PURCHASE_PRICE;
  if (p === '/quan-tri/cai-dat-thong-bao' || p.indexOf('/quan-tri/cai-dat-thong-bao/') === 0) return SCREEN_NOTIFICATION_SETTINGS;
  if (p === '/lich-hen/gap-truc-tiep-ngoai-le' || p.indexOf('/lich-hen/gap-truc-tiep-ngoai-le/') === 0) return SCREEN_EXCEPTION;
  if (OPERATIONS_PATHS.some((x) => p === x.replace(/\/$/, '') || p.indexOf(x.replace(/\/$/, '') + '/') === 0)) return SCREEN_OPERATIONS;
  if (p.indexOf('/lich-hen/tham-gap-truc-tiep') === 0) return SCREEN_DIRECT;
  return null;
}
export const canOpenPath = (path) => { const s = screenOfPath(path); return !s || canOpenScreen(s); };
