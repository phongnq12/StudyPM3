/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* QUỸ LƯỢT THĂM GẶP THEO TUẦN — 1 NGUỒN DUY NHẤT cho mọi màn (mọi nơi đọc chung 1 nguồn).
 * Màn Tạo mới, Đăng ký tại quầy (kiểm điều kiện), popup Điều chỉnh, kéo thả Lịch theo buồng (kiểm chỗ thả) và màn Chi tiết (khối quỹ lượt) đều gọi file này.
 * Trước đây có 4 nguồn lệch nhau: activeDiscipline trong hồ sơ học viên · bộ quỹ mẫu của Chi tiết (cố định 1 tuần mẫu) · bộ quỹ demo HS-01317 · con số remainingQuota.
 *
 * Luật:
 * · Quỹ tuần = 1 lượt + khen thưởng đã áp dụng cho tuần đó − lịch đang giữ chỗ − lịch đã dùng lượt − 1 lượt cho mỗi kỷ luật phê bình/cảnh cáo đang trong hạn.
 * · Kỷ luật đưa vào khu dành riêng (khu cách ly) đang trong hạn ⇒ TẠM DỪNG cả tuần, không áp dụng khen thưởng.
 * · Xét theo TUẦN CỦA NGÀY HẸN: tuần 1 của kỷ luật là tuần chứa ngày quyết định.
 * Chỉ import tương đối — script Node đi qua lib/visitEligibility.js cũng nạp file này. */
import { weekStartOf, weekLabel } from '../lib/visitWeek.js';
import { msg } from '../lib/msg.js';   /* message theo mã */
import { activeDisciplines, availableInWeek, isolationOf, disciplineWeekNo, QUOTA_HOLDING_STATUSES, QUOTA_USED_STATUSES } from '../pages/AppointmentDetail/quota.js';

const pad2 = (n) => String(n).padStart(2, '0');
const dmy = (d) => pad2(d.getDate()) + '/' + pad2(d.getMonth() + 1) + '/' + d.getFullYear();
const addDays = (d, n) => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() + n); return x; };

/* Khen thưởng và kỷ luật của người cai nghiện — đồng bộ từ PM1 (NH-04), chỉ xem. Nhãn, mã, danh mục theo màn PM1 /khen-thuong-hoc-vien và /vi-pham-ky-luat.
 * appliedWeek, visits, weeks là phần riêng của PM2. Ngày cố định giữ đúng như bộ mẫu cũ; HS-01317 tính theo hôm nay để luôn có ca demo. */
function demoHs01317() {
  const today = new Date(), start = weekStartOf(today), quarter = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
  return {
    disciplines: [
      { code: 'HNO-4-BBKL-2026-00000041', form: 'Cảnh cáo', weeks: 2, violationDate: dmy(addDays(start, -3)), incidentType: 'Không chấp hành nội quy', violation: 'Tự ý rời khu lao động trị liệu trong giờ làm việc',
        reason: 'Tự ý rời khu lao động trị liệu trong giờ làm việc', decisionNo: '21/QĐ-PC04-CSCNMT3', decisionDate: dmy(start), decider: 'Trần Minh Đức' },
    ],
    rewards: [
      { code: 'HNO-4-BBKT-2026-00000043', name: 'Khen thưởng định kỳ tháng ' + pad2(addDays(quarter, -1).getMonth() + 1) + '/' + addDays(quarter, -1).getFullYear(), type: 'Định kỳ - Tháng', recordedDate: dmy(addDays(quarter, -1)),
        achievement: 'Chấp hành tốt nội quy, tích cực tham gia lao động trị liệu', regimes: ['Tăng 01 lần thăm gặp trong tháng'], visits: 1, decisionNo: '22/QĐ-PC04-CSCNMT3', decisionDate: dmy(quarter), decider: 'Trần Minh Đức', appliedWeek: '' },
      { code: 'HNO-4-BBKT-2026-00000044', name: 'Khen thưởng đột xuất', type: 'Đột xuất', recordedDate: dmy(addDays(quarter, -1)),
        achievement: 'Giúp đỡ cán bộ sơ cứu người cai nghiện bị ngã trong khu lao động', regimes: ['Tăng 01 lần thăm gặp trong tháng'], visits: 1, decisionNo: '23/QĐ-PC04-CSCNMT3', decisionDate: dmy(quarter), decider: 'Trần Minh Đức', appliedWeek: '' },
    ],
  };
}

const STUDENT_RECORDS = {
  'HS-00623': {
    rewards: [
      { code: 'HNO-4-BBKT-2026-00000003', name: 'Khen thưởng đột xuất', type: 'Đột xuất', recordedDate: '28/08/2026', achievement: 'Phát hiện và báo cáo kịp thời hành vi cất giấu vật cấm trong khu lưu trú',
        regimes: ['Tăng 01 lần thăm gặp trong tháng'], visits: 1, decisionNo: '12/QĐ-PC04-CSCNMT3', decisionDate: '02/09/2026', decider: 'Trần Minh Đức', appliedWeek: '' },
      { code: 'HNO-4-BBKT-2026-00000005', name: 'Khen thưởng định kỳ tháng 07/2026', type: 'Định kỳ - Tháng', recordedDate: '31/07/2026', achievement: 'Chấp hành tốt nội quy, tích cực tham gia lao động trị liệu trong tháng 07/2026',
        regimes: ['Tăng 01 lần thăm gặp trong tháng'], visits: 1, decisionNo: '14/QĐ-PC04-CSCNMT3', decisionDate: '05/08/2026', decider: 'Trần Minh Đức', appliedWeek: weekLabel(weekStartOf(new Date(2026, 8, 1))) },
      { code: 'HNO-4-BBKT-2026-00000009', name: 'Khen thưởng định kỳ tháng 08/2026', type: 'Định kỳ - Tháng', recordedDate: '31/08/2026', achievement: 'Chấp hành tốt nội quy, tích cực tham gia lao động trị liệu trong tháng 08/2026',
        regimes: ['Tăng 01 lần thăm gặp trong tháng'], visits: 1, decisionNo: '17/QĐ-PC04-CSCNMT3', decisionDate: '04/09/2026', decider: 'Trần Minh Đức', appliedWeek: '' },
      { code: 'HNO-4-BBKT-2026-00000011', name: 'Khen thưởng đột xuất', type: 'Đột xuất', recordedDate: '15/09/2026', achievement: 'Tham gia cứu chữa kịp thời người cai nghiện bị ngất trong giờ lao động',
        regimes: ['Tăng 01 lần thăm gặp trong tháng', 'Tăng 01 lần liên lạc thân nhân'], visits: 1, decisionNo: '19/QĐ-PC04-CSCNMT3', decisionDate: '18/09/2026', decider: 'Trần Minh Đức', appliedWeek: '' },
    ],
    disciplines: [
      { code: 'HNO-4-BBKL-2026-00000007', form: 'Cảnh cáo', weeks: 2, violationDate: '17/08/2026', incidentType: 'Không chấp hành nội quy', violation: 'Không chấp hành giờ sinh hoạt chung',
        reason: 'Không chấp hành giờ sinh hoạt chung', decisionNo: '15/QĐ-PC04-CSCNMT3', decisionDate: '19/08/2026', decider: 'Trần Minh Đức' },
      { code: 'HNO-4-BBKL-2026-00000012', form: 'Đưa vào quản lý tại khu dành riêng cho người vi phạm kỷ luật', weeks: 4, violationDate: '05/09/2026', incidentType: 'Đánh nhau, gây thương tích', violation: 'Gây rối, đe dọa',
        reason: 'Vi phạm nội quy khu lưu trú nhiều lần', decisionNo: '18/QĐ-PC04-CSCNMT3', decisionDate: '08/09/2026', decider: 'Trần Minh Đức' },
    ],
  },
  /* dời từ trường activeDiscipline của hồ sơ học viên (WEB06_Reference_Data.js) — cùng số quyết định, ngày quyết định */
  'HS-00821': {
    rewards: [],
    disciplines: [
      { code: 'HNO-4-BBKL-2026-00000042', form: 'Cảnh cáo', weeks: 2, violationDate: '—', incidentType: 'Không chấp hành nội quy', violation: '—',
        reason: '—', decisionNo: '42/QĐ-CSCN', decisionDate: dmy(weekStartOf(new Date())), decider: '—' },   /* tính theo hôm nay như HS-01317 (lịch mẫu dời ngày theo hôm nay) */
    ],
  },
};

/* Khen thưởng đã áp dụng ở màn Chi tiết — LƯU LẠI (bản cũ chỉ đổi trên màn, tải lại trang là mất) */
const APPLIED_KEY = 'pm2_khen_thuong_da_ap_dung';
const store = () => { try { return typeof localStorage === 'undefined' ? null : localStorage; } catch (e) { return null; } };
export function readApplied() { const s = store(); if (!s) return {}; try { return JSON.parse(s.getItem(APPLIED_KEY) || '{}') || {}; } catch (e) { return {}; } }
export function applyReward(studentCode, rewardCode, weekText) {
  const s = store(); if (!s) return false;
  const all = readApplied(); all[studentCode] = { ...(all[studentCode] || {}), [rewardCode]: { week: weekText, date: dmy(new Date()) } };
  try { s.setItem(APPLIED_KEY, JSON.stringify(all)); return true; } catch (e) { return false; }
}
export const APPLIED_REWARDS_KEY = APPLIED_KEY;

/* Khen thưởng và kỷ luật của 1 người cai nghiện, đã ghép khen thưởng đã áp dụng */
export function recordsOf(studentCode) {
  const base = studentCode === 'HS-01317' ? demoHs01317() : (STUDENT_RECORDS[studentCode] || { rewards: [], disciplines: [] });
  const applied = readApplied()[studentCode] || {};
  return {
    disciplines: base.disciplines.map((x) => ({ ...x })),
    rewards: base.rewards.map((x) => (applied[x.code] ? { ...x, appliedWeek: applied[x.code].week, appliedDate: applied[x.code].date } : { ...x })),
  };
}

const isoDay = (d) => d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());

/* Quỹ của tuần chứa `date`. appointments: danh sách lịch (studentCode, visitDate yyyy-mm-dd, status, code). excludeCode: lịch đang tạo/sửa/dời, không tính chính nó */
export function weekQuota(studentCode, date, appointments, excludeCode) {
  const start = weekStartOf(date), end = addDays(start, 6), text = weekLabel(start), parts = text.split(' — ');
  const from = isoDay(start), to = isoDay(end);
  const same = (appointments || []).filter((a) => a && a.studentCode === studentCode && a.code !== excludeCode && a.visitDate && a.visitDate >= from && a.visitDate <= to);
  const rec = recordsOf(studentCode);
  return {
    week: { from: parts[0], to: parts[1], fromDate: parts[0] + '/' + start.getFullYear(), granted: 1,
      holding: same.filter((a) => QUOTA_HOLDING_STATUSES.includes(a.status)).length, used: same.filter((a) => QUOTA_USED_STATUSES.includes(a.status)).length,
      appliedRewardCodes: rec.rewards.filter((x) => x.appliedWeek === text).map((x) => x.code) },
    rewards: rec.rewards, disciplines: rec.disciplines,
  };
}

/* Danh sách lịch dùng để tính quỹ — app đăng ký nguồn (listLogic.buildAppointments); script Node không đăng ký thì coi như chưa có lịch nào */
let appointmentsSource = () => [];
export function setAppointmentsSource(fn) { appointmentsSource = fn; }

/* Phần điều kiện thăm gặp phụ thuộc TUẦN: khu cách ly (5.2) và còn lượt (7). { ok, condition, reason, available } */
export function weekBan(studentCode, date, excludeCode) {
  const q = weekQuota(studentCode, date, appointmentsSource(), excludeCode);
  const iso = isolationOf(q);
  if (iso) return { ok: false, condition: '5.2', available: 0, quota: q,
    reason: msg('E001-32', iso.form, iso.decisionNo, iso.decisionDate, disciplineWeekNo(iso, q.week), iso.weeks) };
  const available = availableInWeek(q);
  if (available <= 0) return { ok: false, condition: '7', available: 0, quota: q, reason: msg('E001-34') };
  return { ok: true, condition: '', reason: '', available, quota: q, activeCount: activeDisciplines(q).length };
}
