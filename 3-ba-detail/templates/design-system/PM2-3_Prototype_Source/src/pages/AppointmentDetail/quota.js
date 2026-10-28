/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Visit quota math: weekly quota, rewards, disciplines */

const pad2 = (n) => String(n).padStart(2, '0');

export function parseDate(s) {
  const m = /(\d{2})\/(\d{2})\/(\d{4})/.exec(s || '');
  return m ? new Date(+m[3], +m[2] - 1, +m[1]) : null;
}

/* Expiry = quarter end of the decision date */
export function rewardExpiry(reward) {
  const d = parseDate(reward.decisionDate);
  if (!d) return '';
  const lastMonth = Math.floor(d.getMonth() / 3) * 3 + 2;
  const end = new Date(d.getFullYear(), lastMonth + 1, 0);
  return pad2(end.getDate()) + '/' + pad2(end.getMonth() + 1) + '/' + end.getFullYear();
}

/* Checked against the visit date */
export function isRewardValid(reward, visitDayLabel) {
  const expiry = parseDate(rewardExpiry(reward)), visitDate = parseDate(visitDayLabel);
  return !expiry || !visitDate || visitDate <= expiry;
}

/* Tuần nghiệp vụ dùng chung — lib/visitWeek.js */
export { weekStartOf, weekLabel } from '../../lib/visitWeek.js';
import { weekStartOf, weeksBetween } from '../../lib/visitWeek.js';   /* tương đối: script Node cũng import file này */

/* Trạng thái lịch tính vào quỹ tuần của chính lịch đó — 1 nhà cho màn Chi tiết và trang Data Test */
/* Từ chối duyệt vẫn giữ lượt tới khi Hủy (gửi duyệt lại không phải xin lượt mới) */
export const QUOTA_HOLDING_STATUSES = ['PENDING_APPROVAL', 'PENDING_HEAD_APPROVAL', 'APPROVED', 'REJECTED'];
/* Vắng mặt vẫn tính đã dùng lượt, không hoàn lượt: vắng mặt là lỗi của thân nhân */
export const QUOTA_USED_STATUSES = ['CHECKED_IN', 'IN_PROGRESS', 'COMPLETED', 'ABSENT'];

/* Week 1 = week of the decision date */
/* Ngày bắt đầu trừ lượt: thường là ngày quyết định; nếu tuần đó người cai nghiện đã có lịch hẹn trước khi có quyết định
 * thì kỷ luật áp dụng từ Thứ Hai tuần sau (effectiveFrom) */
export const disciplineStart = (discipline) => parseDate(discipline.effectiveFrom || discipline.decisionDate);

export function disciplineWeekNo(discipline, week) {
  return weeksBetween(disciplineStart(discipline), parseDate(week.fromDate)) + 1;
}

/* Kỷ luật khu cách ly (Đưa vào quản lý tại khu dành riêng) đang thi hành ⇒ tạm dừng thăm gặp, KHÔNG áp dụng khen thưởng.
 * Phê bình · cảnh cáo chỉ trừ lượt theo tuần, vẫn áp dụng khen thưởng được. */
export function isolationOf(quota) {
  return activeDisciplines(quota).find((x) => /khu (dành riêng|quản lý riêng)/i.test(x.form || '')) || null;
}

export function activeDisciplines(quota) {
  return quota.disciplines.filter((x) => { const n = disciplineWeekNo(x, quota.week); return n >= 1 && n <= x.weeks; });
}

export function availableInWeek(quota) {
  const w = quota.week;
  return Math.max(0, w.granted + w.appliedRewardCodes.length - w.used - w.holding - activeDisciplines(quota).length);
}
