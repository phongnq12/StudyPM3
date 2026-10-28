/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* WEB-02 Quầy tiếp đón — store mô hình mới (→). Khoá lưu v4: lược đồ đổi so với v3 của bản HTML nên không đọc v3.
 * Vòng đời Nháp → Hoạt động ⇄ Vô hiệu hóa (Knowhow WEB-02 C.1 điều 2 · 7). Quầy vô hiệu hóa GIỮ NGUYÊN dãy nhà.
 * Quầy chọn các Dãy nhà phục vụ; 1 dãy nhà chỉ thuộc 1 quầy. Không có số suất, giờ làm việc riêng,
 * thời gian làm thủ tục, số cán bộ trực. Suất riêng = khoảng giờ khóa + buồng chỉ định.
 * Model: { code, name, location, phoneNumber, dormitoryCodes[], staffKeys[], allowNewRegistration, note, status, reservedRanges[{from,to,tableCodes[]}],
 * todayBookedCount, todayCheckedInCount, createdAt } */
import { START_EMPTY } from './legacyData';
import { visitTeamStaff } from './staffDirectoryStore';   /* mặc định Cán bộ phụ trách */

export const STORAGE_KEY = 'pm2_quay_tiep_don_ds_v4';
export const COUNTER_STATUS = { DRAFT: { label: 'Nháp' }, ACTIVE: { label: 'Hoạt động' }, INACTIVE: { label: 'Vô hiệu hóa' } };
export const counterStatusLabel = (code) => (COUNTER_STATUS[code] ? COUNTER_STATUS[code].label : code);

const SEED = [
  { code: 'Q01', name: 'Quầy tiếp đón số 1', location: 'Sảnh chính, tầng 1', phoneNumber: '1101', dormitoryCodes: ['CS1-DAY-001', 'CS1-DAY-002'],
    allowNewRegistration: true, note: '', status: 'ACTIVE',
    reservedRanges: [{ from: '10:30', to: '11:00', tableCodes: ['Q01-06'] }, { from: '16:30', to: '17:00', tableCodes: ['Q01-06'] }],
    todayBookedCount: 6, todayCheckedInCount: 2, createdAt: '2026-09-20T08:00:00' },
  { code: 'Q02', name: 'Quầy tiếp đón số 2', location: 'Sảnh chính, tầng 1', phoneNumber: '1102', dormitoryCodes: ['CS1-DAY-003'],
    allowNewRegistration: false, note: '', status: 'ACTIVE', reservedRanges: [],
    todayBookedCount: 3, todayCheckedInCount: 1, createdAt: '2026-09-21T08:00:00' },
  { code: 'Q03', name: 'Quầy tiếp đón số 3 (dự phòng)', location: 'Sảnh phụ', phoneNumber: '', dormitoryCodes: [],
    allowNewRegistration: false, note: 'Chuẩn bị mở thêm khi đông thân nhân', status: 'DRAFT', reservedRanges: [],
    todayBookedCount: 0, todayCheckedInCount: 0, createdAt: '2026-10-01T09:00:00' },
  { code: 'Q04', name: 'Quầy tiếp đón khu A cũ', location: 'Khu A cũ', phoneNumber: '1104', dormitoryCodes: ['CS1-DAY-004'],
    allowNewRegistration: false, note: 'Tạm không dùng, vẫn giữ dãy nhà', status: 'INACTIVE', reservedRanges: [],
    todayBookedCount: 0, todayCheckedInCount: 0, createdAt: '2026-09-15T08:00:00' },
  { code: 'Q05', name: 'Quầy tiếp đón ưu tiên', location: 'Cổng phụ', phoneNumber: '1105', dormitoryCodes: ['CS1-DAY-005'],
    allowNewRegistration: false, note: '', status: 'ACTIVE', reservedRanges: [],
    todayBookedCount: 1, todayCheckedInCount: 0, createdAt: '2026-09-22T08:00:00' },
];

export function readCounters() {
  try { const s = localStorage.getItem(STORAGE_KEY); if (s) return JSON.parse(s); } catch (e) { /* bị chặn lưu: dùng mẫu */ }
  return (START_EMPTY ? [] : SEED).map((c) => JSON.parse(JSON.stringify(c)));
}
export function writeCounters(list) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); return true; } catch (e) { return false; } }
export const findCounter = (code) => readCounters().find((c) => c.code === code) || null;

/* Cán bộ phụ trách của quầy (cán bộ Tổ thăm gặp, chọn nhiều) — mặc định và người BẮT BUỘC nhận thông báo của lịch hẹn thuộc quầy.
 * Quầy chưa từng khai trường này (chưa có staffKeys) ⇒ mặc định mọi cán bộ thuộc Tổ thăm gặp, không ghi đè kho */
export const counterStaffKeys = (c) => (!c ? [] : Array.isArray(c.staffKeys) ? c.staffKeys.slice() : visitTeamStaff().map((s) => s.key));
export const counterStaffKeysOf = (code) => counterStaffKeys(code ? findCounter(code) : null);
export const activeCounters = () => readCounters().filter((c) => c.status === 'ACTIVE');

/* Quầy đang giữ dãy nhà (mọi trạng thái — quầy vô hiệu hóa vẫn giữ dãy). exceptCode: bỏ qua quầy đang sửa */
export function counterOfDormitory(dormitoryCode, exceptCode) {
  return readCounters().find((c) => c.code !== exceptCode && (c.dormitoryCodes || []).indexOf(dormitoryCode) >= 0) || null;
}
