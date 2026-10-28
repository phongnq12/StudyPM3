/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* luồng đăng ký lịch hẹn, người tạo chọn NGAY TỪ ĐẦU.
 * Tách màn ngoại lệ: màn Tạo mới (cán bộ đặt hộ) chỉ còn luồng «đã có sổ/tài khoản»; luồng «cần xin duyệt» chỉ tạo ở Đăng ký tại quầy */
import { RELATIVES } from '@/data/legacyData';
import { hasLogged } from '@/data/historyStore';
import { ROUTES, appointmentDetailPath, appointmentEditPath, exceptionDetailPath, exceptionEditPath } from '@/routes';
import { RELATIONSHIP_CATALOG } from './relationshipCatalog.js';

export const ROUTE_EXEMPTION = 'EXEMPTION', ROUTE_LINKED = 'LINKED';
/* 2 trạng thái chờ duyệt: Chờ duyệt ⇒ Cán bộ Tổ thăm gặp · Chờ Trưởng cơ sở duyệt ⇒ Trưởng cơ sở (đơn ngoại lệ) */
export const PENDING_STATUSES = ['PENDING_APPROVAL', 'PENDING_HEAD_APPROVAL'];
export const isPendingStatus = (s) => PENDING_STATUSES.indexOf(s) >= 0;
export const isExemption = (r) => !!r && r.approvalRoute === ROUTE_EXEMPTION;
/* Màn Lịch hẹn gặp trực tiếp ngoại lệ chứa đơn ngoại lệ CHƯA được Trưởng cơ sở duyệt: đang chờ, bị từ chối, hoặc hủy khi chưa duyệt.
 * Duyệt xong (Đã duyệt trở đi) lịch sang màn Thăm gặp trực tiếp, vẫn mang dấu Ngoại lệ để rà soát */
export function isExceptionRecord(r) {
  if (!isExemption(r)) return false;
  if (r.status === 'PENDING_HEAD_APPROVAL' || r.status === 'REJECTED') return true;
  return r.status === 'CANCELLED' && !hasLogged(r.code, 'Phê duyệt');
}
export const EXCEPTION_LABEL = 'Ngoại lệ';
/* chữ hiển thị của luồng đăng ký — bộ lọc màn chính và cột Excel dùng chung (lịch cũ không lưu luồng tính là đã có sổ/tài khoản) */
export const routeFilterText = (v) => (v === ROUTE_EXEMPTION ? EXCEPTION_LABEL + ' — thân nhân cần xin duyệt' : 'Thân nhân đã có sổ/tài khoản thăm gặp');
export const routeTextOf = (r) => routeFilterText(isExemption(r) ? ROUTE_EXEMPTION : ROUTE_LINKED);
/* danh sách mà lịch đang thuộc về: Quay lại, breadcrumb, chuyển trang sau khi lưu */
export const listPathOf = (r) => (isExceptionRecord(r) ? ROUTES.exceptionList : ROUTES.appointmentList);
export const listLabelOf = (r) => (isExceptionRecord(r) ? 'Lịch hẹn gặp trực tiếp ngoại lệ' : 'Lịch hẹn thăm gặp trực tiếp');
/* Chi tiết, Chỉnh sửa theo màn của lịch: đơn ngoại lệ ⇒ /lich-hen/gap-truc-tiep-ngoai-le/:id(/chinh-sua) */
export const detailPathOf = (r) => (isExceptionRecord(r) ? exceptionDetailPath(r.code) : appointmentDetailPath(r.code));
export const editPathOf = (r) => (isExceptionRecord(r) ? exceptionEditPath(r.code) : appointmentEditPath(r.code));
/* đường dẫn đúng của trang đang mở (Chi tiết hay Chỉnh sửa) — lệch module thì chuyển, giữ link cũ, thông báo cũ vẫn mở được */
export const canonicalPathOf = (r, isEdit) => (isEdit ? editPathOf(r) : detailPathOf(r));
/* 1 màn Chi tiết + 1 màn Chỉnh sửa, 2 đường dẫn: NGỮ CẢNH MENU lấy theo tiền tố URL (không theo bản ghi) ⇒ mở từ danh sách nào thì Quay lại, lưu xong về đúng danh sách đó */
export const inExceptionUrl = () => location.pathname.indexOf(ROUTES.exceptionList + '/') === 0;
export const urlListPath = () => (inExceptionUrl() ? ROUTES.exceptionList : ROUTES.appointmentList);
export const urlListLabel = () => (inExceptionUrl() ? 'Lịch hẹn gặp trực tiếp ngoại lệ' : 'Lịch hẹn thăm gặp trực tiếp');
export const urlEditPath = (code) => (inExceptionUrl() ? exceptionEditPath(code) : appointmentEditPath(code));
export const ROUTE_OPTIONS = [
  { value: ROUTE_LINKED, label: 'Thân nhân đã có sổ/tài khoản thăm gặp', hint: 'Đã có trong danh sách liên kết với người cai nghiện — tra cứu rồi lưu, lịch vào Đã duyệt, không qua duyệt' },
  { value: ROUTE_EXEMPTION, label: 'Thân nhân cần xin duyệt', hint: 'Lần đầu đến, thiếu giấy tờ xác nhận, chưa có tài khoản hoặc sổ thăm gặp — tạo đơn ngoại lệ xin Trưởng cơ sở duyệt, theo dõi ở màn Lịch hẹn gặp trực tiếp ngoại lệ' },
];
export const routeLabel = (v) => (ROUTE_OPTIONS.find((o) => o.value === v) || {}).label || '';

/* người cai nghiện để chọn ở đơn xin duyệt: gom từ dữ liệu thân nhân, mỗi mã 1 dòng */
export function allStudents() {
  const seen = new Map();
  RELATIVES.forEach((r) => (r.students || []).forEach((s) => { const k = s.studentCode || s.fullName; if (!seen.has(k)) seen.set(k, s); }));
  return [...seen.values()];
}
/* Quan hệ với người cai nghiện: danh mục PM5 QUAN_HE_THAN_NHAN (data/relationshipCatalog.js) — ô chọn hiện «Mã — Tên», lưu tên */
export function relationshipOptions() {
  return RELATIONSHIP_CATALOG.map((x) => ({ value: x.name, label: x.code + ' — ' + x.name }));
}
export const EMPTY_EXEMPTION = { fullName: '', citizenId: '', phoneNumber: '', relationship: '', studentCode: '', reason: '', hasCompanions: false, companions: [] };   /* companions: [{ fullName, citizenId, relationship }] */
/* trường thiếu của đơn xin duyệt — nhãn riêng để không bị ánh xạ báo lỗi vào ô Tra cứu */
export function missingExemption(e) {
  const t = [];
  if (!e.fullName.trim()) t.push('Họ tên thân nhân');
  if (!/^\d{12}$/.test(e.citizenId.trim())) t.push('Số căn cước công dân của thân nhân (12 chữ số)');
  if (!e.relationship) t.push('Quan hệ với người cai nghiện');
  if (!e.studentCode) t.push('Người cai nghiện được thăm');
  if (!e.reason.trim()) t.push('Lý do xin duyệt');
  /* thân nhân đi cùng (đơn tại quầy): dòng đã thêm phải đủ họ tên, căn cước 12 số, quan hệ */
  if (e.hasCompanions) (e.companions || []).forEach((c, i) => {
    const n = ' thân nhân đi cùng ' + (i + 1);
    if (!String(c.fullName || '').trim()) t.push('Họ tên' + n);
    if (!/^\d{12}$/.test(String(c.citizenId || '').trim())) t.push('Số căn cước công dân' + n + ' (12 chữ số)');
    if (!c.relationship) t.push('Quan hệ' + n);
  });
  return t;
}
/* dòng thân nhân đi cùng của đơn ngoại lệ (missingExemption) ⇒ id ô để báo chữ đỏ ngay dưới ô — thiếu ánh xạ này thì Tiếp tục bị chặn mà không ô nào báo đỏ */
export const companionFieldId = (label) => { const m = /^(Họ tên|Số căn cước công dân|Quan hệ) thân nhân đi cùng (\d+)/.exec(label || ''); return m ? 'xdDiKem' + ({ 'Họ tên': 'Ten', 'Số căn cước công dân': 'Cccd', 'Quan hệ': 'Qh' })[m[1]] + (+m[2] - 1) : null; };
/* dựng thân nhân + người cai nghiện từ đơn, để các bước sau dùng y như kết quả tra cứu */
export function relativeFromExemption(e) {
  const stu = allStudents().find((s) => (s.studentCode || s.fullName) === e.studentCode);
  if (!stu || !e.fullName.trim()) return null;
  const student = { ...stu, relationship: e.relationship, linkedRelatives: [] };
  return { fullName: e.fullName.trim(), citizenId: e.citizenId.trim(), phoneNumber: e.phoneNumber.trim(), status: 'EXEMPTION', students: [student] };
}
