/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Reception counter logic shared by List · Create · Edit · Detail (WEB-02). Storage goes through data/receptionDeskStore.js (v4).
 * Lifecycle DRAFT -> ACTIVE <-> INACTIVE (Knowhow WEB-02 C.1). Open / closed label follows the WEB-54 shifts of today. */
import { COUNTER_STATUS, counterStaffKeys, counterStatusLabel, findCounter, readCounters, writeCounters } from '@/data/receptionDeskStore';
import { dormitoryName, findDormitory } from '@/data/dormitoryStore';
import { readDirectConfig, shiftsOfDate } from '@/data/visitConfigStore';
import { buildAppointments } from '@/pages/AppointmentList/listLogic';
import { counterCodeOf } from '@/lib/resourceImpact';
import { logAction, readHistory } from '@/data/historyStore';

export const STATUS_DRAFT = 'DRAFT';
export const STATUS_ACTIVE = 'ACTIVE';
export const STATUS_INACTIVE = 'INACTIVE';
export const STATUS_CODES = Object.keys(COUNTER_STATUS);
export const statusLabel = counterStatusLabel;
export { findCounter };

export const toMinutes = (time) => (+String(time).slice(0, 2)) * 60 + (+String(time).slice(3, 5));
export const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

/* Newest first (createdAt) */
export const listCounters = () => readCounters().slice().sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
/* Trả true khi đã ghi, false khi kho lưu bị chặn (màn gọi phải báo lỗi và ở lại) */
export function saveCounter(counter) {
  const list = readCounters();
  const index = list.findIndex((c) => c.code === counter.code);
  if (index >= 0) list[index] = counter; else list.push(counter);
  return writeCounters(list);
}
export const deleteCounter = (code) => writeCounters(readCounters().filter((c) => c.code !== code));
/* Trả quầy đã đổi, null khi không tìm thấy hoặc kho lưu bị chặn (màn gọi báo lỗi, giữ trạng thái cũ) */
export function changeStatus(code, status) {
  const counter = findCounter(code);
  if (!counter) return null;
  counter.status = status;
  return saveCounter(counter) ? counter : null;
}

/* Delete is allowed only while no appointment has ever gone through the counter */
export const hasAppointments = (code) => buildAppointments().some((r) => counterCodeOf(r) === code);
/* Kích hoạt cần ít nhất 1 dãy nhà phục vụ và 1 cán bộ phụ trách — thiếu thì nút Kích hoạt ẩn hẳn (Playbook List ②5) */
export const canActivate = (c) => !!(c && (c.dormitoryCodes || []).length && counterStaffKeys(c).length);
export const canDelete = (c) => c.status === STATUS_DRAFT && !(c.todayBookedCount > 0) && !hasAppointments(c.code);

/* Dormitories that would lose their only counter. A dormitory belongs to 1 counter, so every dormitory of the counter qualifies */
export const dormitoriesOf = (c) => (c.dormitoryCodes || []).slice();
export { dormitoryName, findDormitory };

/* Open / closed label — ACTIVE counters only, shifts of today from WEB-54 */
export function openState(counter, at) {
  if (counter.status !== STATUS_ACTIVE) return null;
  const d = at || new Date();
  const now = d.getHours() * 60 + d.getMinutes();
  const shifts = shiftsOfDate(d);
  const current = shifts.find((s) => now >= toMinutes(s.openTime) && now < toMinutes(s.closeTime));
  return current ? { isOpen: true, text: 'Đang mở', tooltip: current.name + ' ' + current.openTime + ' ~ ' + current.closeTime }
    : { isOpen: false, text: 'Tạm đóng', tooltip: shifts.map((s) => s.name + ' ' + s.openTime + ' ~ ' + s.closeTime).join(' · ') };
}

/* Reserved range must fit inside 1 shift of at least 1 enabled weekday of WEB-54 */
export function fitsAnyShift(from, to, cfg) {
  const c = cfg || readDirectConfig();
  const s = toMinutes(from), e = toMinutes(to);
  return c.days.some((day) => day.enabled && [day.morning, day.afternoon].some((sh) => sh && sh.from && sh.to && s >= toMinutes(sh.from) && e <= toMinutes(sh.to)));
}

/* History rows of a counter — kept in the shared history store, keyed by the counter code */
export const logCounter = (code, action, opts) => logAction(code, action, opts);
export const counterHistory = (code) => readHistory(code);
