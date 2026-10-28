/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Bộ nạp dữ liệu mẫu — đọc 3 file trong data/seed (script thường, biến toàn cục) để giữ 1 nguồn duy nhất.
 * Dữ liệu dùng khoá tiếng Anh camelCase; hàm *ToLegacy chỉ còn phục vụ lớp đổi khoá cũ trong appointmentStore. */
import rawAppointments from './seed/WEB06_Appointments_Data.js?raw';
import rawReference from './seed/WEB06_Reference_Data.js?raw';
import rawReception from './seed/WEB02_ReceptionDesk_Data.js?raw';

const loadScript = (raw, names) => new Function(raw + '\nreturn {' + names.join(',') + '};')();

export const { APPOINTMENT_STATUS, APPOINTMENT_SOURCE, WEB06_APPOINTMENTS, appointmentToLegacy } =
  loadScript(rawAppointments, ['APPOINTMENT_STATUS', 'APPOINTMENT_SOURCE', 'WEB06_APPOINTMENTS', 'appointmentToLegacy']);

export const { RELATIVE_STATUS, RELATIVES, STUDENT_RELATIVES, VISIT_ROOMS, BOOKING_CONFIG, VISIT_TYPE_DURATIONS, referenceToLegacy, LEGACY_REFERENCE } =
  loadScript(rawReference, ['RELATIVE_STATUS', 'RELATIVES', 'STUDENT_RELATIVES', 'VISIT_ROOMS', 'BOOKING_CONFIG', 'VISIT_TYPE_DURATIONS', 'referenceToLegacy', 'LEGACY_REFERENCE']);

/* Prototype bắt đầu RỖNG — không nạp lịch hẹn, quầy, buồng mẫu để người dùng tự tạo dữ liệu từ đầu.
 * Giữ người cai nghiện, thân nhân, điều kiện thăm gặp, dãy nhà, tài khoản, cấu hình giờ mặc định. Đổi false để nạp lại bộ mẫu. */
export const START_EMPTY = true;

export const { COUNTER_STATUS, VISIT_ZONES, RECEPTION_COUNTERS, counterToLegacy } =
  loadScript(rawReception, ['COUNTER_STATUS', 'VISIT_ZONES', 'RECEPTION_COUNTERS', 'counterToLegacy']);
