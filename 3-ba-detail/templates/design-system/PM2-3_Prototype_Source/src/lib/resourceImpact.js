/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Lịch hẹn bị ảnh hưởng khi đổi tài nguyên — dùng chung cho WEB-54 (đổi khung giờ), WEB-02 (vô hiệu hóa quầy, gỡ dãy nhà), WEB-51 (vô hiệu hóa buồng).
 * Lịch "chưa thực hiện" = mọi lịch chưa bắt đầu, KỂ CẢ Nháp: Nháp · Chờ duyệt · Đã duyệt · Hoàn thành check-in, ngày hẹn từ hôm nay.
 * Hủy: lý do từ danh mục C04, ghi 1 dòng Lịch sử thao tác mỗi lịch, luôn thông báo thân nhân và mời đặt lại.
 * Cách ghi theo đúng luồng Hủy của Danh sách lịch hẹn (AppointmentList confirmCancel): logAction + setStatus. */
import { logAction, setStatus } from '@/data/historyStore';
import { cancelReasonLabel } from '@/components/app/CancelAppointmentDialog';
import { buildAppointments } from '@/pages/AppointmentList/listLogic';
import { LEGACY_TABLE_MAP, readTables } from '@/data/visitTableStore';
import { readDirectConfig, shiftsOfDate } from '@/data/visitConfigStore';

export const NOT_STARTED = ['DRAFT', 'PENDING_APPROVAL', 'PENDING_HEAD_APPROVAL', 'APPROVED', 'CHECKED_IN'];
export const REASON_RESOURCE = 'CS_NGUNGQUAY';     /* Buồng / Quầy ngừng hoạt động */
export const REASON_TIME_FRAME = 'CS_DOIKHUNGGIO'; /* Thay đổi khung giờ thăm gặp */

const toMin = (t) => (+String(t).slice(0, 2)) * 60 + (+String(t).slice(3, 5));
const todayIso = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };

/* Mã buồng hiện hành của lịch (lịch mẫu còn mã buồng cũ TC01-xx, TC02-xx) */
export const tableCodeOf = (r) => { const c = String(r.tableCode || '').trim(); return LEGACY_TABLE_MAP[c] || c; };
/* Quầy của lịch: theo buồng (buồng trực thuộc quầy); không có buồng thì theo quầy ghi trên lịch */
export function counterCodeOf(r) {
  const t = readTables().find((x) => x.code === tableCodeOf(r));
  return t ? t.counterCode : (r.counterCode || '');
}

export function upcomingAppointments(predicate) {
  const today = todayIso();
  return buildAppointments().filter((r) => NOT_STARTED.indexOf(r.status) >= 0 && String(r.visitDate || '') >= today && (!predicate || predicate(r)));
}
export const affectedByTable = (tableCode) => upcomingAppointments((r) => tableCodeOf(r) === tableCode);
export const affectedByCounter = (counterCode) => upcomingAppointments((r) => counterCodeOf(r) === counterCode);

/* Đổi khung giờ: lịch đang nằm trọn trong 1 ca của cấu hình CŨ mà không còn nằm trọn trong 1 ca của cấu hình MỚI
 * (thứ bị tắt hoặc ca bị thu hẹp). Lịch vốn đã ngoài khung cũ không do lần đổi này gây ra nên không tính; không đổi gì thì 0 lịch.
 * Đổi thời lượng không làm lịch cũ bị ảnh hưởng (mỗi lịch giữ thời lượng của chính nó) */
export function affectedByConfig(newCfg, oldCfg) {
  const before = oldCfg || readDirectConfig();
  const fits = (r, cfg) => {
    const s = toMin(r.visitTime), e = s + (+r.durationMinutes || 0);
    return shiftsOfDate(r.visitDate, cfg).some((sh) => s >= toMin(sh.openTime) && e <= toMin(sh.closeTime));
  };
  return upcomingAppointments((r) => !!r.visitTime && fits(r, before) && !fits(r, newCfg));
}

/* Hủy hàng loạt, mỗi lịch 1 dòng lịch sử. Trả số lịch đã hủy */
export function cancelAppointments(records, reasonCode, note) {
  const label = cancelReasonLabel(reasonCode);
  const reason = [label, note].filter(Boolean).join(' — ');
  records.forEach((r) => { logAction(r.code, 'Hủy lịch hẹn', { statusBefore: r.status, statusAfter: 'CANCELLED', reason, note: 'Đã gửi thông báo cho thân nhân, đề nghị đặt lại lịch' }); setStatus(r.code, 'CANCELLED'); });
  return records.length;
}
