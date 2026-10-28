/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* PM2 · Cài đặt thông báo (Sổ BA PM2) — dữ liệu khởi tạo sẵn, KHÔNG thêm, KHÔNG xóa; chỉ sửa cách gửi, mốc thời gian, nội dung, bật/tắt.
 * 1 dòng = 1 SỰ KIỆN (mã kiểu PM1 {ĐỐI TƯỢNG}_{SỰ KIỆN}, không hậu tố người nhận) · nội dung theo TỪNG NGƯỜI NHẬN: contents [{ recipient, title, body }] · 1 công tắc Bật/Tắt cho cả sự kiện.
 * Lưu localStorage 'pm2.notificationSettings.v1' = { rows: { [mã]: bản sửa }, history: Row[] } — xoá khoá này là về mặc định.
 * Mã thông báo gom ở ĐÚNG 1 bảng NOTIFICATION_CODES — nơi khác chỉ gọi qua bảng này.
 * Nội dung do AI soạn nháp theo biến của BRD: {relative_name} {student_name} {appointment_time} {appointment_code} {visit_table} {reason} {facility_name}. */
import { currentAccount, FACILITY_NAME } from './accountStore';

const STORAGE_KEY = 'pm2.notificationSettings.v1';
const CHANGE_EVENT = 'pm2:notificationSettings';

/* ── Mã thông báo: 1 nguồn duy nhất ── */
export const NOTIFICATION_CODES = {
  PENDING_APPROVAL: 'APPOINTMENT_PENDING_APPROVAL',   /* Duyệt lịch hẹn ⇒ Cán bộ tổ thăm gặp */
  EXCEPTION_PENDING_APPROVAL: 'APPOINTMENT_EXCEPTION_PENDING_APPROVAL',   /* Duyệt lịch hẹn ngoại lệ ⇒ Trưởng cơ sở */
  APPROVED: 'APPOINTMENT_APPROVED',
  REJECTED: 'APPOINTMENT_REJECTED',
  EXCEPTION_APPROVED: 'APPOINTMENT_EXCEPTION_APPROVED',   /* luồng đơn xin ngoại lệ — Trưởng cơ sở phê duyệt */
  EXCEPTION_REJECTED: 'APPOINTMENT_EXCEPTION_REJECTED',   /* luồng đơn xin ngoại lệ — Trưởng cơ sở từ chối duyệt */
  REMINDER_DAY_BEFORE: 'APPOINTMENT_REMINDER_DAY_BEFORE',
  REMINDER_BEFORE_ARRIVAL: 'APPOINTMENT_REMINDER_BEFORE_ARRIVAL',
  REMINDER_AFTER_CHECKIN: 'APPOINTMENT_REMINDER_AFTER_CHECKIN',
  RESCHEDULED: 'APPOINTMENT_RESCHEDULED',
  CANCELLED: 'APPOINTMENT_CANCELLED',
  CANCELLED_WITH_PROPOSAL: 'APPOINTMENT_CANCELLED_WITH_PROPOSAL',   /* Hủy và đề xuất lịch thay thế (BRD-WEB-06) */
  AUTO_CANCELLED: 'APPOINTMENT_AUTO_CANCELLED',
  ABSENT: 'APPOINTMENT_ABSENT',
  /* thao tác hàng loạt ⇒ mỗi cán bộ 1 thông báo gộp (thân nhân vẫn nhận riêng theo lịch) */
  BULK_APPROVED: 'APPOINTMENT_BULK_APPROVED',
  BULK_REJECTED: 'APPOINTMENT_BULK_REJECTED',
  BULK_CANCELLED: 'APPOINTMENT_BULK_CANCELLED',   /* Đánh dấu vắng mặt báo thân nhân đã trừ lượt */
};
const C = NOTIFICATION_CODES;

/* ── Biến thay thế (BRD-WEB-03b mục 6.4): tên biến ⇒ nghĩa tiếng Việt. Lắp giá trị ở notificationStore.templateVars ──
 * 7 biến gốc của BRD + {appointment_code} {visit_table} mà nội dung khởi tạo đang dùng.
 * {building}: PM2 không còn Phân khu, lấy Dãy nhà của người cai nghiện từ PM1 — data/dormitoryStore.js (dữ liệu giả lập). */
export const TEMPLATE_VARIABLES = {
  appointment_code: 'Mã lịch hẹn',
  relative_name: 'Họ tên thân nhân',
  student_name: 'Họ tên người cai nghiện',
  visit_type: 'Loại hình thăm gặp',
  appointment_time: 'Ngày giờ hẹn',
  visit_table: 'Buồng thăm gặp',
  building: 'Phân khu (dãy nhà)',
  facility_name: 'Tên cơ sở',
  reason: 'Lý do',
  proposed_time: 'Ngày giờ đề xuất thay thế',
  auto_cancel_time: 'Thời điểm tự hủy nếu chưa gửi duyệt lại',
  proposed_table: 'Buồng đề xuất thay thế',
  appointment_count: 'Số lịch hẹn',   /* thông báo thao tác hàng loạt */
  appointment_list: 'Danh sách lịch hẹn (tối đa 3 lịch, còn lại ghi «và n lịch hẹn khác»)',   /* người đọc biết ai, lúc nào — không chỉ mã */
};
const BASE_VARS = ['appointment_code', 'relative_name', 'student_name', 'visit_type', 'appointment_time', 'visit_table', 'building', 'facility_name'];
const WITH_REASON = BASE_VARS.concat('reason');
const BULK_VARS = BASE_VARS.concat('appointment_count', 'appointment_list');   /* nội dung Thân nhân dùng biến của từng lịch, nội dung cán bộ dùng biến gộp */
/* Biến dùng được theo TỪNG sự kiện — chỉ biến Prototype lắp được giá trị cho sự kiện đó.
 * {reason}: Từ chối duyệt (lý do từ chối) · Hủy (lý do hủy) · Tự hủy (lý do hệ thống) · Xếp lại (lý do điều chỉnh) */
export const EVENT_VARIABLES = {
  [C.PENDING_APPROVAL]: BASE_VARS,
  [C.EXCEPTION_PENDING_APPROVAL]: BASE_VARS,
  [C.APPROVED]: BASE_VARS,
  [C.REJECTED]: WITH_REASON.concat('auto_cancel_time'),
  [C.EXCEPTION_APPROVED]: BASE_VARS,
  [C.EXCEPTION_REJECTED]: WITH_REASON.concat('auto_cancel_time'),
  [C.REMINDER_DAY_BEFORE]: BASE_VARS,
  [C.REMINDER_BEFORE_ARRIVAL]: BASE_VARS,
  [C.REMINDER_AFTER_CHECKIN]: BASE_VARS,
  [C.RESCHEDULED]: WITH_REASON,
  [C.CANCELLED]: WITH_REASON,
  [C.CANCELLED_WITH_PROPOSAL]: WITH_REASON.concat('proposed_time', 'proposed_table'),
  [C.AUTO_CANCELLED]: WITH_REASON,
  [C.BULK_APPROVED]: BULK_VARS,
  [C.BULK_REJECTED]: BULK_VARS.concat('reason', 'auto_cancel_time'),   /* nội dung riêng của thân nhân từng lịch */
  [C.BULK_CANCELLED]: BULK_VARS.concat('reason'),
  [C.ABSENT]: BASE_VARS,
};
/* tên biến cũ tiếng Việt không dấu ⇒ tên tiếng Anh. Nội dung đã lưu bằng tên cũ được đổi khi đọc, không mất bản sửa */
export const LEGACY_VARIABLE_NAMES = {"ma_lich_hen": "appointment_code", "ho_ten_than_nhan": "relative_name", "ho_ten_nguoi_nghien": "student_name", "loai_hinh": "visit_type", "ngay_gio_hen": "appointment_time", "ban_tham_gap": "visit_table", "phan_khu": "building", "ten_co_so": "facility_name", "ly_do": "reason"};
export const migrateVariableNames = (text) => String(text == null ? '' : text).replace(/\{([a-z_]+)\}/g, (m, name) => (LEGACY_VARIABLE_NAMES[name] ? '{' + LEGACY_VARIABLE_NAMES[name] + '}' : m));
export const variablesOf = (code) => EVENT_VARIABLES[code] || BASE_VARS;
export const VARIABLE_PATTERN = /\{([^{}\s]*)\}/g;
/* biến trong chữ không thuộc danh sách của sự kiện ⇒ ['{bien_sai}', …] (không trùng) */
export function invalidVariables(code, text) {
  const allowed = variablesOf(code), bad = [];
  String(text || '').replace(VARIABLE_PATTERN, (m, name) => { if (allowed.indexOf(name) < 0 && bad.indexOf(m) < 0) bad.push(m); return m; });
  return bad;
}
/* mã sự kiện cũ (thông báo đã lưu trước khi đổi luật) ⇒ mã mới */
export const LEGACY_EVENT_CODES = { APPOINTMENT_REMINDER: C.REMINDER_AFTER_CHECKIN };
export const canonicalEventCode = (code) => LEGACY_EVENT_CODES[code] || code;

/* ── Nhóm người nhận — trường «Người nhận thông báo» ở lịch hẹn và mỗi popup thao tác chia theo nhóm này ──
 * VISIT_TEAM: cán bộ tổ thăm gặp đã chọn ở lịch hẹn · RELATIVE: thân nhân thuộc lịch hẹn · FACILITY_HEAD: người thuộc vai Trưởng cơ sở · EXTRA: chọn từ toàn bộ cán bộ */
export const RECIPIENTS = { VISIT_TEAM: 'Cán bộ tổ thăm gặp', RELATIVE: 'Thân nhân', FACILITY_HEAD: 'Trưởng cơ sở', EXTRA: 'Người nhận thông tin thêm' };
export const RECIPIENT_GROUPS = ['VISIT_TEAM', 'RELATIVE', 'FACILITY_HEAD', 'EXTRA'];
const R = RECIPIENTS;
/* nội dung đã lưu theo tên người nhận cũ (trước khi đổi luật) ⇒ tên mới, không mất bản sửa */
const LEGACY_RECIPIENTS = { 'Người duyệt': R.VISIT_TEAM, 'Cán bộ tạo lịch': R.VISIT_TEAM };
const canonicalRecipient = (x) => LEGACY_RECIPIENTS[x] || x;

/* ── Cách gửi ── */
export const SEND_TYPES = { IMMEDIATE: 'IMMEDIATE', BEFORE: 'BEFORE', AFTER: 'AFTER' };
export const SEND_TYPE_LABELS = { IMMEDIATE: 'Gửi ngay khi phát sinh', BEFORE: 'Gửi trước mốc thời gian', AFTER: 'Gửi sau mốc thời gian' };
export const TIME_UNITS = [{ value: 'MINUTE', label: 'phút', minutes: 1 }, { value: 'HOUR', label: 'giờ', minutes: 60 }];
export const TIME_ANCHOR = 'giờ hẹn';
export const TITLE_MAX = 200, BODY_MAX = 1000;

/* ── Tab chức năng (thêm tab sau này: thêm 1 dòng) và nhóm ── */
export const FUNCTION_TABS = [{ key: 'direct', label: 'Thăm gặp trực tiếp' }];
export const GROUPS = [
  /* tách 2 khối — luồng lịch hẹn thăm gặp · luồng đơn xin ngoại lệ, mỗi khối đủ Gửi duyệt · Phê duyệt · Từ chối duyệt */
  { key: 'create', tab: 'direct', title: 'Thông báo luồng lịch hẹn thăm gặp' },
  { key: 'exception', tab: 'direct', title: 'Thông báo luồng đơn xin ngoại lệ' },
  { key: 'reminder', tab: 'direct', title: 'Thông báo nhắc nhở lịch hẹn' },
  { key: 'change', tab: 'direct', title: 'Thông báo thay đổi và hủy lịch hẹn' },
  { key: 'bulk', tab: 'direct', title: 'Thông báo thao tác hàng loạt' },
];

/* Thao tác kích hoạt: tên nút và tên màn lấy đúng chữ trên Prototype */
const SCR_DIRECT = 'Lịch hẹn thăm gặp trực tiếp', SCR_EXCEPTION = 'Lịch hẹn gặp trực tiếp ngoại lệ', SCR_DETAIL = 'Chi tiết lịch hẹn';
const SCR_CREATE = 'Tạo lịch hẹn thăm gặp trực tiếp', SCR_EDIT = 'Chỉnh sửa lịch hẹn thăm gặp trực tiếp', SCR_COUNTER = 'Đăng ký lượt thăm gặp tại quầy';
const DECISION_SCREENS = [SCR_DIRECT, SCR_EXCEPTION, SCR_DETAIL].join(', ');
const REGULAR_DECISION_SCREENS = [SCR_DIRECT, SCR_DETAIL].join(', '), EXCEPTION_DECISION_SCREENS = [SCR_EXCEPTION, SCR_DETAIL].join(', ');
const c = (recipient, title, body) => ({ recipient, title, body });

/* «Gửi cho» ở màn Cài đặt: thông báo do thao tác sinh ra ⇒ theo trường Người nhận thông báo của thao tác đó; tự động ⇒ đích danh */
function recipientsText(d) {
  const names = (d.groups || []).map((g) => (g === 'RELATIVE' && d.auto ? 'Thân nhân thuộc lịch hẹn' : R[g]));
  return (d.auto ? 'Đích danh: ' : 'Theo trường Người nhận thông báo: ') + names.join(', ') + (d.groupNote ? ' (' + d.groupNote + ')' : '');
}
/* timedOnly: chỉ cho Trước / Sau mốc · immediateOnly: chỉ Gửi ngay · locked: bắt buộc, không tắt được
 * groups: nhóm người nhận · auto: thông báo tự động ngầm của hệ thống ⇒ người nhận đích danh theo dữ liệu lịch hẹn, không có trường chọn
 * contents: nội dung theo nhóm người nhận; «Người nhận thông tin thêm» dùng nội dung của nhóm cán bộ có trong sự kiện */
const DEFAULTS = [
  /* 2 luồng gửi duyệt, 2 thông báo riêng — mỗi thông báo về đúng người duyệt của luồng */
  { code: C.PENDING_APPROVAL, group: 'create', name: 'Gửi duyệt lịch hẹn',
    immediateOnly: true,
    trigger: 'Thân nhân đặt lịch trên ứng dụng · Nút Lưu và gửi duyệt · ' + SCR_EDIT + ' (lịch Từ chối duyệt gửi lại)',
    groups: ['VISIT_TEAM', 'EXTRA'],
    contents: [
      c(R.VISIT_TEAM, 'Lịch hẹn {appointment_code} đang chờ duyệt',
        'Thân nhân {relative_name} đăng ký thăm gặp người cai nghiện {student_name} lúc {appointment_time} tại {visit_table}. Vui lòng vào duyệt lịch hẹn.')] },
  { code: C.EXCEPTION_PENDING_APPROVAL, group: 'exception', name: 'Gửi duyệt đơn xin ngoại lệ',
    immediateOnly: true,
    trigger: 'Nút Lưu và gửi duyệt · ' + [SCR_COUNTER, 'Chỉnh sửa đơn ngoại lệ (đơn Từ chối duyệt gửi lại)'].join(', '),
    groups: ['FACILITY_HEAD', 'EXTRA'],
    contents: [
      c(R.FACILITY_HEAD, 'Đơn xin ngoại lệ {appointment_code} đang chờ bạn duyệt',
        'Thân nhân {relative_name} chưa có sổ hoặc tài khoản thăm gặp, xin thăm gặp người cai nghiện {student_name} lúc {appointment_time}. Vui lòng vào duyệt đơn.')] },
  { code: C.APPROVED, group: 'create', name: 'Lịch hẹn được phê duyệt', immediateOnly: true,
    trigger: 'Nút Phê duyệt · ' + REGULAR_DECISION_SCREENS + ' · Nút Lưu và duyệt · ' + SCR_CREATE + ' · Nút Đăng ký · ' + SCR_COUNTER,
    groups: ['VISIT_TEAM', 'RELATIVE', 'EXTRA'],
    contents: [
      c(R.RELATIVE, 'Lịch hẹn {appointment_code} đã được phê duyệt',
        'Lịch thăm gặp {student_name} lúc {appointment_time} tại {facility_name} đã được phê duyệt. Vui lòng mang giấy tờ tùy thân và đến quầy tiếp đón trước giờ hẹn.'),
      c(R.VISIT_TEAM, 'Lịch hẹn {appointment_code} đã được duyệt',
        'Lịch hẹn của thân nhân {relative_name} thăm gặp {student_name} lúc {appointment_time} đã được duyệt.')] },
  { code: C.REJECTED, group: 'create', name: 'Lịch hẹn bị từ chối duyệt', immediateOnly: true,
    trigger: 'Nút Từ chối duyệt · ' + REGULAR_DECISION_SCREENS,
    groups: ['VISIT_TEAM', 'RELATIVE', 'EXTRA'],
    contents: [
      c(R.RELATIVE, 'Lịch hẹn {appointment_code} bị từ chối duyệt',
        'Lịch thăm gặp {student_name} lúc {appointment_time} tại {facility_name} bị từ chối duyệt. Lý do: {reason}. Lịch sẽ tự hủy lúc {auto_cancel_time} nếu chưa được gửi duyệt lại.'),
      c(R.VISIT_TEAM, 'Lịch hẹn {appointment_code} bị từ chối duyệt',
        'Lịch hẹn của thân nhân {relative_name} thăm gặp {student_name} lúc {appointment_time} bị từ chối duyệt. Lý do: {reason}. Vui lòng chỉnh sửa và gửi duyệt lại trước {auto_cancel_time}, quá hạn hệ thống tự hủy lịch và nhả buồng.')] },

  /* Phê duyệt / Từ chối đơn xin ngoại lệ — nhóm người nhận như Phê duyệt / Từ chối thường (⑨), nội dung riêng (AI soạn nháp) */
  { code: C.EXCEPTION_APPROVED, group: 'exception', name: 'Đơn xin ngoại lệ được phê duyệt', immediateOnly: true,
    trigger: 'Nút Phê duyệt · ' + EXCEPTION_DECISION_SCREENS,
    groups: ['VISIT_TEAM', 'RELATIVE', 'EXTRA'],
    contents: [
      c(R.RELATIVE, 'Đơn xin thăm gặp {appointment_code} đã được Trưởng cơ sở phê duyệt',
        'Đơn xin ngoại lệ thăm gặp {student_name} lúc {appointment_time} tại {facility_name} đã được Trưởng cơ sở phê duyệt. Vui lòng mang giấy tờ tùy thân và đến quầy tiếp đón trước giờ hẹn.'),
      c(R.VISIT_TEAM, 'Đơn xin ngoại lệ {appointment_code} đã được duyệt',
        'Trưởng cơ sở đã phê duyệt đơn xin ngoại lệ của thân nhân {relative_name} thăm gặp {student_name} lúc {appointment_time}. Lịch đã chuyển sang danh sách Thăm gặp trực tiếp.')] },
  { code: C.EXCEPTION_REJECTED, group: 'exception', name: 'Đơn xin ngoại lệ bị từ chối duyệt', immediateOnly: true,
    trigger: 'Nút Từ chối duyệt · ' + EXCEPTION_DECISION_SCREENS,
    groups: ['VISIT_TEAM', 'RELATIVE', 'EXTRA'],
    contents: [
      c(R.RELATIVE, 'Đơn xin thăm gặp {appointment_code} bị từ chối duyệt',
        'Đơn xin ngoại lệ thăm gặp {student_name} lúc {appointment_time} tại {facility_name} bị Trưởng cơ sở từ chối duyệt. Lý do: {reason}. Đơn sẽ tự hủy lúc {auto_cancel_time} nếu chưa được gửi duyệt lại.'),
      c(R.VISIT_TEAM, 'Đơn xin ngoại lệ {appointment_code} bị từ chối duyệt',
        'Trưởng cơ sở đã từ chối đơn xin ngoại lệ của thân nhân {relative_name} thăm gặp {student_name} lúc {appointment_time}. Lý do: {reason}. Vui lòng chỉnh sửa đơn và gửi duyệt lại trước {auto_cancel_time}, quá hạn hệ thống tự hủy đơn và nhả buồng.')] },

  { code: C.REMINDER_DAY_BEFORE, group: 'reminder', name: 'Nhắc lịch hẹn trước một ngày', timedOnly: true, auto: true,
    trigger: 'Hệ thống tự động · trước giờ hẹn, lịch Đã duyệt', sendType: 'BEFORE', offset: 24, unit: 'HOUR', groups: ['RELATIVE'],
    contents: [c(R.RELATIVE, 'Nhắc lịch thăm gặp ngày mai',
      'Bạn có lịch thăm gặp {student_name} lúc {appointment_time} tại {facility_name} (mã {appointment_code}). Vui lòng sắp xếp thời gian đến đúng giờ.')] },
  { code: C.REMINDER_BEFORE_ARRIVAL, group: 'reminder', name: 'Nhắc lịch hẹn sắp đến giờ', timedOnly: true, auto: true,
    trigger: 'Hệ thống tự động · trước giờ hẹn, lịch Đã duyệt', sendType: 'BEFORE', offset: 30, unit: 'MINUTE', groups: ['RELATIVE'],
    contents: [c(R.RELATIVE, 'Lịch thăm gặp {appointment_code} sắp đến giờ',
      'Lịch thăm gặp {student_name} bắt đầu lúc {appointment_time}. Vui lòng đến quầy tiếp đón để làm thủ tục check-in.')] },
  { code: C.REMINDER_AFTER_CHECKIN, group: 'reminder', name: 'Nhắc lịch thăm gặp sắp đến (lịch Hoàn thành check-in)', timedOnly: true, auto: true,
    trigger: 'Hệ thống tự động · trước giờ hẹn, lịch Hoàn thành check-in', sendType: 'BEFORE', offset: 10, unit: 'MINUTE', groups: ['RELATIVE'],
    contents: [c(R.RELATIVE, 'Sắp đến giờ thăm gặp',
      'Lịch thăm gặp {student_name} lúc {appointment_time} tại {visit_table} sắp bắt đầu. Vui lòng có mặt tại khu vực chờ.')] },

  { code: C.RESCHEDULED, group: 'change', name: 'Lịch hẹn được xếp lại sang thời gian khác', immediateOnly: true,
    trigger: 'Nút Điều chỉnh thời gian và buồng thăm gặp, kéo thả trên Lịch theo buồng · ' + SCR_DIRECT,
    groups: ['VISIT_TEAM', 'RELATIVE', 'EXTRA'],
    contents: [
      c(R.RELATIVE, 'Lịch hẹn {appointment_code} đã đổi thời gian',
        'Lịch thăm gặp {student_name} được xếp lại sang {appointment_time} tại {visit_table}. Lý do: {reason}.'),
      c(R.VISIT_TEAM, 'Lịch hẹn {appointment_code} đã được xếp lại',
        'Lịch hẹn của thân nhân {relative_name} thăm gặp {student_name} được xếp lại sang {appointment_time} tại {visit_table}. Lý do: {reason}.')] },
  { code: C.CANCELLED, group: 'change', name: 'Lịch hẹn bị hủy', immediateOnly: true, locked: true,
    trigger: 'Nút Hủy lịch hẹn · ' + DECISION_SCREENS,
    groups: ['VISIT_TEAM', 'RELATIVE', 'EXTRA'],
    contents: [
      c(R.RELATIVE, 'Lịch hẹn {appointment_code} đã bị hủy',
        'Lịch thăm gặp {student_name} lúc {appointment_time} tại {facility_name} đã bị hủy. Lý do: {reason}. Lượt thăm gặp đã được hoàn lại. Vui lòng đặt lại lịch nếu cần.'),
      c(R.VISIT_TEAM, 'Lịch hẹn {appointment_code} đã bị hủy',
        'Lịch hẹn của thân nhân {relative_name} thăm gặp {student_name} lúc {appointment_time} đã bị hủy. Lý do: {reason}.')] },
  { code: C.CANCELLED_WITH_PROPOSAL, group: 'change', name: 'Lịch hẹn bị hủy kèm đề xuất lịch thay thế', immediateOnly: true, locked: true,
    trigger: 'Nút Hủy và đề xuất lịch thay thế (lý do sự cố của cơ sở) · ' + DECISION_SCREENS,
    groups: ['VISIT_TEAM', 'RELATIVE', 'EXTRA'],
    contents: [
      c(R.RELATIVE, 'Lịch hẹn {appointment_code} đã bị hủy, có lịch thay thế đề xuất',
        'Lịch thăm gặp {student_name} lúc {appointment_time} tại {facility_name} đã bị hủy. Lý do: {reason}. Lượt thăm gặp đã được hoàn lại. Cơ sở đề xuất lịch thay thế lúc {proposed_time} tại {proposed_table}, vui lòng đặt lại lịch theo khung giờ này nếu phù hợp.'),
      c(R.VISIT_TEAM, 'Lịch hẹn {appointment_code} đã bị hủy kèm đề xuất lịch thay thế',
        'Lịch hẹn của thân nhân {relative_name} thăm gặp {student_name} lúc {appointment_time} đã bị hủy. Lý do: {reason}. Đã gửi đề xuất lịch thay thế lúc {proposed_time} tại {proposed_table}.')] },
  { code: C.ABSENT, group: 'change', name: 'Lịch hẹn bị đánh dấu vắng mặt', immediateOnly: true,
    trigger: 'Nút Đánh dấu vắng mặt · ' + SCR_DIRECT,
    groups: ['RELATIVE', 'EXTRA'],
    contents: [
      c(R.RELATIVE, 'Lịch hẹn {appointment_code} được ghi nhận vắng mặt',
        'Lịch thăm gặp {student_name} lúc {appointment_time} tại {facility_name} được ghi nhận vắng mặt do đã quá giờ hẹn mà thân nhân chưa đến. Lượt thăm gặp đã bị trừ.'),
      c(R.EXTRA, 'Lịch hẹn {appointment_code} được ghi nhận vắng mặt',
        'Lịch hẹn của thân nhân {relative_name} thăm gặp {student_name} lúc {appointment_time} được ghi nhận vắng mặt.')] },
  { code: C.AUTO_CANCELLED, group: 'change', name: 'Tự hủy lịch hẹn Từ chối duyệt', timedOnly: true, auto: true,
    trigger: 'Hệ thống tự động · lịch Từ chối duyệt chưa gửi duyệt lại, hết số giờ giữ chỗ kể từ lúc từ chối hoặc tới mốc trước giờ hẹn, mốc nào tới trước', sendType: 'BEFORE', offset: 30, unit: 'MINUTE', holdHours: 24,   /* số giờ giữ chỗ chỉnh được */   /* thay 60 phút */
    groups: ['VISIT_TEAM', 'RELATIVE'],
    contents: [
      c(R.RELATIVE, 'Lịch hẹn {appointment_code} đã bị hủy',
        'Lịch thăm gặp {student_name} lúc {appointment_time} tại {facility_name} bị từ chối duyệt và chưa được gửi duyệt lại nên hệ thống đã tự hủy. Vui lòng đặt lại lịch nếu cần.'),
      c(R.VISIT_TEAM, 'Lịch hẹn {appointment_code} đã tự hủy',
        'Lịch hẹn của thân nhân {relative_name} thăm gặp {student_name} lúc {appointment_time} bị từ chối duyệt và chưa được gửi duyệt lại nên hệ thống đã tự hủy.')] },
  /* thao tác hàng loạt — cán bộ trong trường Người nhận thông báo của popup nhận 1 thông báo gộp; thân nhân nhận thông báo riêng của lịch mình (dòng tương ứng ở trên) */
  { code: C.BULK_APPROVED, group: 'bulk', name: 'Phê duyệt lịch hẹn hàng loạt', immediateOnly: true,
    trigger: 'Nút Phê duyệt hàng loạt · ' + [SCR_DIRECT, SCR_EXCEPTION].join(', '),
    groups: ['VISIT_TEAM', 'RELATIVE', 'EXTRA'], groupNote: 'Thân nhân của từng lịch bắt buộc nhận, mỗi người nhận thông báo về lịch của mình',
    contents: [
      c(R.RELATIVE, 'Lịch hẹn {appointment_code} đã được phê duyệt',
        'Lịch thăm gặp {student_name} lúc {appointment_time} tại {facility_name} đã được phê duyệt. Vui lòng mang giấy tờ tùy thân và đến quầy tiếp đón trước giờ hẹn.'),
      c(R.VISIT_TEAM, 'Đã phê duyệt {appointment_count} lịch hẹn',
        'Các lịch hẹn đã được phê duyệt: {appointment_list}.')] },
  { code: C.BULK_REJECTED, group: 'bulk', name: 'Từ chối duyệt lịch hẹn hàng loạt', immediateOnly: true,
    trigger: 'Nút Từ chối duyệt hàng loạt · ' + [SCR_DIRECT, SCR_EXCEPTION].join(', '),
    groups: ['VISIT_TEAM', 'RELATIVE', 'EXTRA'], groupNote: 'Thân nhân của từng lịch bắt buộc nhận, mỗi người nhận thông báo về lịch của mình',
    contents: [
      c(R.RELATIVE, 'Lịch hẹn {appointment_code} bị từ chối duyệt',
        'Lịch thăm gặp {student_name} lúc {appointment_time} tại {facility_name} bị từ chối duyệt. Lý do: {reason}. Lịch sẽ tự hủy lúc {auto_cancel_time} nếu chưa được gửi duyệt lại.'),
      c(R.VISIT_TEAM, 'Đã từ chối duyệt {appointment_count} lịch hẹn',
        'Các lịch hẹn bị từ chối duyệt: {appointment_list}. Lý do: {reason}.')] },
  { code: C.BULK_CANCELLED, group: 'bulk', name: 'Hủy lịch hẹn hàng loạt', immediateOnly: true,
    trigger: 'Nút Hủy hàng loạt · ' + SCR_DIRECT + ' (Hủy và đề xuất lịch thay thế: Thân nhân nhận theo dòng Lịch hẹn bị hủy kèm đề xuất lịch thay thế)',
    groups: ['VISIT_TEAM', 'RELATIVE', 'EXTRA'], groupNote: 'Thân nhân của từng lịch bắt buộc nhận, mỗi người nhận thông báo về lịch của mình',
    contents: [
      c(R.RELATIVE, 'Lịch hẹn {appointment_code} đã bị hủy',
        'Lịch thăm gặp {student_name} lúc {appointment_time} tại {facility_name} đã bị hủy. Lý do: {reason}. Lượt thăm gặp đã được hoàn lại. Vui lòng đặt lại lịch nếu cần.'),
      c(R.VISIT_TEAM, 'Đã hủy {appointment_count} lịch hẹn',
        'Các lịch hẹn đã bị hủy: {appointment_list}. Lý do: {reason}.')] },
].map((d) => ({ sendType: 'IMMEDIATE', offset: null, unit: 'MINUTE', enabled: true, tab: 'direct', auto: false, ...d, recipients: recipientsText(d) }));

export const EDITABLE_FIELDS = ['sendType', 'offset', 'unit', 'holdHours', 'contents', 'enabled'];   /* holdHours:, chỉ dòng Tự hủy */

function readRaw() {
  try { const s = localStorage.getItem(STORAGE_KEY); if (s) { const v = JSON.parse(s); if (v && typeof v === 'object') return { rows: v.rows || {}, history: v.history || [] }; } } catch (e) { /* hỏng ⇒ mặc định */ }
  return { rows: {}, history: [] };
}
function writeRaw(v) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(v)); } catch (e) { return false; }
  try { window.dispatchEvent(new Event(CHANGE_EVENT)); } catch (e) { /* bỏ qua */ }
  return true;
}

/* mọi dòng (mặc định + bản sửa), theo thứ tự khai. Nội dung ghép theo người nhận: người nhận mặc định luôn đủ, bản sửa chỉ ghi đè chữ */
export function readNotificationSettings() {
  const { rows } = readRaw();
  return DEFAULTS.map((d) => {
    const patch = rows[d.code] || {}, r = { ...d };
    ['sendType', 'offset', 'unit', 'holdHours', 'enabled'].forEach((k) => { if (patch[k] !== undefined) r[k] = patch[k]; });
    const saved = Array.isArray(patch.contents) ? patch.contents : [];
    r.contents = d.contents.map((x) => { const m = { ...x, ...((saved.find((y) => canonicalRecipient(y.recipient) === x.recipient)) || {}), recipient: x.recipient };
      return { ...m, title: migrateVariableNames(m.title), body: migrateVariableNames(m.body) }; });
    if (r.locked) r.enabled = true;
    return r;
  });
}
export const settingOf = (code) => readNotificationSettings().find((r) => r.code === canonicalEventCode(code)) || null;
/* mã không có trong cài đặt (vd mã lạ) ⇒ coi như bật */
export const isNotificationEnabled = (code) => { const r = settingOf(code); return !r || !!r.enabled; };
/* nội dung của 1 nhóm người nhận; «Người nhận thông tin thêm» chưa có nội dung riêng ⇒ dùng nội dung cán bộ của sự kiện (Cán bộ tổ thăm gặp, rồi Trưởng cơ sở) */
export const contentFor = (code, recipient) => {
  const r = settingOf(code); if (!r) return null;
  const pick = (who) => r.contents.find((x) => x.recipient === who);
  return pick(canonicalRecipient(recipient)) || (recipient === R.EXTRA ? (pick(R.VISIT_TEAM) || pick(R.FACILITY_HEAD)) : null) || null;
};
export const groupsOf = (code) => (settingOf(code) || {}).groups || [];
const unitOf = (v) => TIME_UNITS.find((u) => u.value === v) || TIME_UNITS[0];
export const offsetMinutesOf = (r) => (r && r.sendType !== 'IMMEDIATE' ? (+r.offset || 0) * unitOf(r.unit).minutes : 0);
export const offsetMinutes = (code) => offsetMinutesOf(settingOf(code));

/* lắp biến {ten_bien} — biến không có giá trị ⇒ «—» */
/* Mục Ví dụ ở màn Cài đặt (để Dev và QC hiểu ý BA): lắp khuôn ĐANG LƯU với dữ liệu minh họa ⇒ sửa chữ thì ví dụ đổi theo.
 * Giá trị bọc ** như thông báo thật (in đậm từ khoá). Lý do minh họa theo từng sự kiện */
const SAMPLE_REASONS = {
  [C.REJECTED]: 'Thân nhân chưa nộp đủ giấy tờ', [C.EXCEPTION_REJECTED]: 'Giấy xác nhận quan hệ chưa hợp lệ', [C.RESCHEDULED]: 'Buồng thăm gặp đang bảo trì',
  [C.CANCELLED]: 'Thân nhân xin hủy', [C.CANCELLED_WITH_PROPOSAL]: 'Cơ sở mất điện', [C.AUTO_CANCELLED]: 'Lịch hẹn Từ chối duyệt chưa được gửi duyệt lại',
  [C.BULK_REJECTED]: 'Thân nhân chưa nộp đủ giấy tờ', [C.BULK_CANCELLED]: 'Cơ sở tạm dừng thăm gặp',
};
const boldSample = (text) => '**' + text + '**';
export function exampleVars(code) {
  return {
    appointment_code: boldSample('LH-2026-0901'), relative_name: boldSample('Nguyễn Thị Hoa'), student_name: boldSample('Bùi Văn Quý'), visit_type: boldSample('Thăm gặp trực tiếp tiêu chuẩn'),
    appointment_time: boldSample('15/10/2026, 08:00'), visit_table: 'buồng ' + boldSample('Q01-02'), building: boldSample('Dãy A'), facility_name: boldSample(FACILITY_NAME),
    reason: boldSample(SAMPLE_REASONS[canonicalEventCode(code)] || 'Thân nhân xin đổi lịch'), proposed_time: boldSample('16/10/2026, 09:00'), auto_cancel_time: boldSample('16/10/2026 08:30'), proposed_table: 'buồng ' + boldSample('Q01-03'),
    appointment_count: boldSample('12'),
    appointment_list: [['Nguyễn Thị Hoa', 'Bùi Văn Quý', '08:00 15/10'], ['Phạm Thị Lan', 'Lê Văn An', '09:00 15/10'], ['Trần Thu Hà', 'Đỗ Minh Tuấn', '10:30 16/10']]
      .map(([relative, student, time]) => boldSample(relative) + ' thăm ' + boldSample(student) + ' lúc ' + boldSample(time)).join(' · ') + ' và ' + boldSample('9') + ' lịch hẹn khác',
  };
}
export const exampleOf = (code, content) => ({ title: fillTemplate(content.title, exampleVars(code)), body: fillTemplate(content.body, exampleVars(code)) });
/* dòng ĐI CẶP — thông báo đơn ↔ thông báo hàng loạt cùng thao tác; đổi bật/tắt 1 dòng thì cảnh báo dòng kia nếu đang khác trạng thái */
const PAIRS = [[[C.APPROVED, C.EXCEPTION_APPROVED], C.BULK_APPROVED], [[C.REJECTED, C.EXCEPTION_REJECTED], C.BULK_REJECTED], [[C.CANCELLED, C.CANCELLED_WITH_PROPOSAL], C.BULK_CANCELLED]];
export function pairedRowsOf(code) {
  const out = [];
  PAIRS.forEach(([singles, bulk]) => {
    if (code === bulk) singles.forEach((x) => out.push({ code: x, usedFor: 'thao tác từng lịch' }));
    else if (singles.indexOf(code) >= 0) out.push({ code: bulk, usedFor: 'thao tác hàng loạt' });
  });
  return out.map((p) => ({ ...p, row: settingOf(p.code) })).filter((p) => p.row);
}
export const fillTemplate = (text, vars) => String(text || '').replace(/\{([a-z_]+)\}/g, (m, name) => (vars && vars[name] != null && vars[name] !== '' ? String(vars[name]) : '—'));

/* «Trước giờ hẹn 24 giờ» · «Sau giờ hẹn 15 phút» · «—» */
export function timeConditionText(r) {
  if (!r || r.sendType === 'IMMEDIATE') return '—';
  const base = (r.sendType === 'BEFORE' ? 'Trước ' : 'Sau ') + TIME_ANCHOR + ' ' + r.offset + ' ' + unitOf(r.unit).label;
  /* dòng Tự hủy có thêm số giờ giữ chỗ kể từ lúc từ chối */
  return r.holdHours != null ? 'Sau lúc từ chối ' + r.holdHours + ' giờ, chậm nhất ' + base.charAt(0).toLowerCase() + base.slice(1) : base;
}
export const sendTypeOptions = (r) => (r.immediateOnly ? ['IMMEDIATE'] : r.timedOnly ? ['BEFORE', 'AFTER'] : ['IMMEDIATE', 'BEFORE', 'AFTER'])
  .map((v) => ({ value: v, label: SEND_TYPE_LABELS[v] }));

const pad2 = (n) => String(n).padStart(2, '0');
const nowText = (d = new Date()) => pad2(d.getDate()) + '/' + pad2(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes()) + ':' + pad2(d.getSeconds());
const enabledText = (v) => (v ? 'Bật' : 'Tắt');

/* Lưu bản sửa 1 dòng + ghi Lịch sử thao tác (ai, khi nào, mã nào, trước → sau). Trả false khi không lưu được */
export function updateNotificationSetting(code, next) {
  const before = settingOf(code); if (!before) return false;
  const after = { ...before, ...next }; if (before.locked) after.enabled = true;
  if (after.sendType === 'IMMEDIATE') after.offset = null;
  after.contents = before.contents.map((x) => ({ ...x, ...(((next && next.contents) || []).find((y) => y.recipient === x.recipient) || {}), recipient: x.recipient }));
  const changes = [];
  if (before.sendType !== after.sendType) changes.push(['Gửi khi nào', SEND_TYPE_LABELS[before.sendType], SEND_TYPE_LABELS[after.sendType]]);
  if (timeConditionText(before) !== timeConditionText(after)) changes.push(['Điều kiện thời gian', timeConditionText(before), timeConditionText(after)]);
  before.contents.forEach((b, i) => {
    const a = after.contents[i], who = before.contents.length > 1 ? ' (' + b.recipient + ')' : '';
    if (b.title !== a.title) changes.push(['Tiêu đề thông báo' + who, b.title, a.title]);
    if (b.body !== a.body) changes.push(['Nội dung thông báo' + who, b.body, a.body]);
  });
  if (!!before.enabled !== !!after.enabled) changes.push(['Trạng thái', enabledText(before.enabled), enabledText(after.enabled)]);
  if (!changes.length) return true;
  const raw = readRaw();
  raw.rows[code] = Object.fromEntries(EDITABLE_FIELDS.map((k) => [k, after[k]]));
  const acc = currentAccount();
  raw.history.push({ at: nowText(), actorName: acc.name, actorRole: acc.role, action: 'Sửa thông báo ' + code, code, changes, reason: '' });
  return writeRaw(raw);
}
export const readNotificationSettingsHistory = () => readRaw().history.slice();

export function onNotificationSettingsChange(fn) {
  const h = (e) => { if (!e.key || e.key === STORAGE_KEY) fn(); };
  window.addEventListener(CHANGE_EVENT, fn); window.addEventListener('storage', h);
  return () => { window.removeEventListener(CHANGE_EVENT, fn); window.removeEventListener('storage', h); };
}
export const NOTIFICATION_SETTINGS_STORAGE_KEY = STORAGE_KEY;
