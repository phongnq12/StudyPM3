/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* TUẦN NGHIỆP VỤ — 1 nơi khai DUY NHẤT, mọi phép tính tuần gọi về đây.
 * Dùng cho: quỹ lượt thăm gặp tuần · lượt khen thưởng áp dụng theo tuần · số tuần cấm thăm gặp do kỷ luật.
 * KHÔNG dùng cho lưới lịch tháng chọn ngày — lưới đó là hiển thị, vẫn bắt đầu Thứ Hai.
 * Mốc: tuần từ Thứ Hai đến Chủ Nhật. Ngày thăm gặp trong tuần sẽ chọn ở màn Thiết lập.
 * Đổi mốc thì CHỈ sửa WEEK_START_DAY. */

/* 0 = Chủ Nhật, 1 = Thứ Hai … 5 = Thứ Sáu, 6 = Thứ Bảy */
export const WEEK_START_DAY = 1;

const DAY_NAMES = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
const pad2 = (n) => String(n).padStart(2, '0');

/* «Thứ Hai → Chủ Nhật» */
export const WEEK_RANGE_TEXT = DAY_NAMES[WEEK_START_DAY] + ' → ' + DAY_NAMES[(WEEK_START_DAY + 6) % 7];

/* Ngày đầu tuần nghiệp vụ chứa ngày d, 00:00 */
export function weekStartOf(d) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() - ((x.getDay() - WEEK_START_DAY + 7) % 7));
  return x;
}

/* «dd/mm — dd/mm/yyyy» của tuần bắt đầu từ start */
export function weekLabel(start) {
  const end = new Date(start); end.setDate(end.getDate() + 6);
  return pad2(start.getDate()) + '/' + pad2(start.getMonth() + 1) + ' — ' + pad2(end.getDate()) + '/' + pad2(end.getMonth() + 1) + '/' + end.getFullYear();
}

/* Số tuần chênh giữa 2 ngày theo tuần nghiệp vụ (cùng tuần = 0) */
export function weeksBetween(from, to) {
  return Math.round((weekStartOf(to) - weekStartOf(from)) / 604800000);
}
