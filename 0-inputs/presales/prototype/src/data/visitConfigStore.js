/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* WEB-54 Cấu hình thời gian — màn cài đặt chung, tab theo LOẠI, mỗi tab lưu riêng.
 * Cụm này chỉ có tab Thăm gặp trực tiếp (khoá 'direct'). Giờ chung cho MỌI quầy, lưới đặt lịch đọc từ đây.
 * Khung giờ: 7 thứ, ô cho phép, ca Sáng / ca Chiều — mặc định bật Thứ Tư, Năm, Sáu · 07:30~11:00 · 13:30~17:00.
 * Ô Tự ngắt sau khi hết giờ bỏ khỏi màn: thăm gặp trực tiếp không tự kết thúc ca (BRD-WEB-07 đoạn 659).
 * Giờ nghỉ giữa các ca: phút đệm giữa 2 lịch liên tiếp trên cùng 1 buồng, mặc định 0, bội số của 5, cài RIÊNG TỪNG THỨ.
 * Thời lượng và gia hạn: TẠM lấy theo cài đặt C04, chỉ đọc.
 * Giãn cách theo tuần do quỹ lượt đảm nhận ⇒ bỏ 2 ô giãn cách. Bỏ Thời gian chờ check-in và Bước chia khung.
 * Bỏ ngưỡng hủy lịch (hủy không giới hạn) và 2 ô số lượt tối đa mỗi ngày (quỹ lượt theo tuần đã giới hạn) —.
 * Bỏ kèm ô Hạn hủy lịch không bị tính ngưỡng vì không còn ngưỡng để tính. Còn Đặt trước tối thiểu 24 giờ · tối đa 30 ngày (BRD-WEB-03). */

export const STORAGE_KEY = 'pm2_cau_hinh_khung_gio_v1';

/* dow theo Date.getDay: 1 = Thứ Hai … 6 = Thứ Bảy, 0 = Chủ Nhật */
export const WEEKDAYS = [
  { dow: 1, label: 'Thứ Hai' }, { dow: 2, label: 'Thứ Ba' }, { dow: 3, label: 'Thứ Tư' }, { dow: 4, label: 'Thứ Năm' },
  { dow: 5, label: 'Thứ Sáu' }, { dow: 6, label: 'Thứ Bảy' }, { dow: 0, label: 'Chủ Nhật' },
];
const DEFAULT_ON = [3, 4, 5];

/* Giá trị C04 (danh mục Loại hình thăm gặp ở C04), chỉ đọc ở PM2 */
export const C04_DURATION = {
  minMinutes: 10, maxMinutes: 45, stepMinutes: 5, extendMaxMinutes: 15, extendMaxTimes: 1,
  warnFirstMinutes: 2, warnSecondMinutes: 1, autoStopSeconds: 30,
};

export function defaultDirectConfig() {
  return {
    days: WEEKDAYS.map((w) => ({
      dow: w.dow, enabled: DEFAULT_ON.indexOf(w.dow) >= 0,
      morning: { from: '07:30', to: '11:00' }, afternoon: { from: '13:30', to: '17:00' },   /* (4) */
      breakMinutes: 0,
    })),
    booking: { minAdvanceHours: 24, maxAdvanceDays: 30 },
    updatedAt: null,
  };
}

function readAll() {
  try { const s = localStorage.getItem(STORAGE_KEY); if (s) return JSON.parse(s); } catch (e) { /* bị chặn lưu: dùng mặc định */ }
  return {};
}
export function readDirectConfig() {
  const all = readAll();
  const d = defaultDirectConfig();
  if (!all.direct) return d;
  /* Bản đã lưu trước khi đổi luật còn ngưỡng hủy và số lượt mỗi ngày ⇒ bỏ khi đọc */
  const { cancelThreshold, ...direct } = all.direct;
  const booking = { minAdvanceHours: (direct.booking || {}).minAdvanceHours ?? d.booking.minAdvanceHours, maxAdvanceDays: (direct.booking || {}).maxAdvanceDays ?? d.booking.maxAdvanceDays };
  /* Bản đã lưu khi giờ nghỉ còn 1 số chung ⇒ chép số đó vào từng thứ */
  const { breakMinutes: oldBreak, ...rest } = direct;
  const days = (rest.days || d.days).map((x) => ({ ...x, breakMinutes: x.breakMinutes ?? oldBreak ?? 0 }));
  return { ...d, ...rest, days, booking };
}
/* Lưu riêng tab Thăm gặp trực tiếp, không đụng tab loại khác */
export function writeDirectConfig(cfg) {
  try { const all = readAll(); all.direct = { ...cfg, updatedAt: new Date().toISOString() }; localStorage.setItem(STORAGE_KEY, JSON.stringify(all)); return true; } catch (e) { return false; }
}

/* Ca thăm gặp của 1 ngày cụ thể: [] nếu thứ đó không cho thăm gặp. Ca để trống (thiếu từ hoặc đến) thì bỏ qua */
export function shiftsOfDate(date, cfg) {
  const c = cfg || readDirectConfig();
  const day = c.days.find((x) => x.dow === new Date(date).getDay());
  if (!day || !day.enabled) return [];
  return [['Buổi sáng', day.morning], ['Buổi chiều', day.afternoon]]
    .filter(([, s]) => s && s.from && s.to)
    .map(([name, s]) => ({ name, openTime: s.from, closeTime: s.to }));
}
/* Giờ nghỉ giữa các ca của 1 ngày cụ thể (theo thứ của ngày đó) */
export function breakMinutesOfDate(date, cfg) {
  const c = cfg || readDirectConfig();
  const day = c.days.find((x) => x.dow === new Date(date).getDay());
  return (day && day.breakMinutes) || 0;
}
export const durationOptions = () => { const r = []; for (let m = C04_DURATION.minMinutes; m <= C04_DURATION.maxMinutes; m += C04_DURATION.stepMinutes) r.push(m); return r; };
