/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Visit eligibility of 1 student for 1 relative — the student-level part of the BPD condition chain.
 * Same order as the BPD chain, stops at the FIRST condition that fails:
 * 3 link approved · 4 visit right on · 5 management status allows visits · 5.1 at least 15 days since admission (TT79 Đ34 k2a)
 * 5.2 not under disciplinary review, no discipline banning visits this week (TT79 Đ34 k2b · Đ31 k3) · 5.3 no request letter from the case authority (TT79 Đ34 k3)
 * 5.4 not under treatment for an infectious disease (CS2 Đ5 k2b) · 7 available quota ≥ 1
 * Reasons are drafted by the Prototype; message codes are settled when writing the SRS. Conditions 1, 2 belong to the relative. */

const pad2 = (n) => String(n).padStart(2, '0');
const dmy = (d) => pad2(d.getDate()) + '/' + pad2(d.getMonth() + 1) + '/' + d.getFullYear();
const fromIso = (iso) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || ''); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; };
import { weekBan } from '../data/visitQuotaStore.js';
import { msg } from './msg.js';   /* message theo mã — tương đối vì script Node cũng nạp */   /* tương đối: script Node cũng import file này */
export const ADMISSION_WAIT_DAYS = 15;
/* số tuần liền kề không được thăm gặp theo hình thức kỷ luật (TT79 Điều 31 khoản 3) */
export const DISCIPLINE_WEEKS = { 'Phê bình': 1, 'Cảnh cáo': 2, 'Đưa vào khu quản lý riêng': 4 };

/* management status received from PM1 (NH-01) — which ones still take visits */
export const MANAGEMENT_STATUS = {
  IN_REHAB: { label: 'Đang cai nghiện', allowsVisit: true },
  IN_MEDICAL_TREATMENT: { label: 'Đang điều trị y tế', allowsVisit: false },
  TEMPORARILY_ABSENT: { label: 'Tạm vắng', allowsVisit: false },
  COMPLETED: { label: 'Đã kết thúc cai nghiện', allowsVisit: false },
  TRANSFERRED: { label: 'Đã chuyển cơ sở', allowsVisit: false },
};

/* conditions in the order the system checks them — shown in the «Danh sách điều kiện thăm gặp» popup */
/* Gom 4 nhóm, thứ tự từ trên xuống = thứ tự hệ thống kiểm */
export const VISIT_CONDITIONS = [
  { code: '3', group: 'Thân nhân và liên kết', title: 'Liên kết thân nhân đã được duyệt', detail: 'Thân nhân phải được duyệt là thân nhân của chính người cai nghiện này', source: 'TT79 Điều 35, 36' },
  { code: '4', group: 'Thân nhân và liên kết', title: 'Quyền thăm gặp đang bật', detail: 'Quyền thăm gặp của liên kết thân nhân không bị tạm dừng', source: 'TT79 Điều 38' },
  { code: '5', group: 'Tình trạng người cai nghiện', title: 'Trạng thái quản lý là Đang cai nghiện', detail: 'Chỉ trạng thái Đang cai nghiện được thăm gặp. Đang điều trị y tế, tạm vắng, đã kết thúc hoặc đã chuyển cơ sở thì không thăm gặp', source: 'Yêu cầu của hệ thống' },
  { code: '5.1', group: 'Tình trạng người cai nghiện', title: 'Đủ ' + ADMISSION_WAIT_DAYS + ' ngày kể từ ngày tiếp nhận', detail: 'Vào cơ sở chưa đủ ' + ADMISSION_WAIT_DAYS + ' ngày kể từ ngày tiếp nhận thì chưa được thăm gặp', source: 'TT79 Điều 34' },   /* msg-ok: mô tả điều kiện thăm gặp, không phải message */
  { code: '5.4', group: 'Tình trạng người cai nghiện', title: 'Không tạm dừng thăm gặp vì lý do y tế', detail: 'Đang điều trị bệnh truyền nhiễm hoặc sức khỏe không bảo đảm theo chỉ định của Tổ Y tế', source: 'Yêu cầu đảm bảo sức khỏe' },
  { code: '5.2', group: 'Hạn chế theo quy định pháp luật', title: 'Không đang xem xét kỷ luật, không bị kỷ luật cấm thăm gặp tuần này', detail: 'Đang xem xét kỷ luật thì chưa được thăm gặp. Đang thi hành kỷ luật thì không thăm gặp trong số tuần liền kề từ ngày quyết định: Phê bình 1 tuần, cảnh cáo 2 tuần, đưa vào khu quản lý riêng 4 tuần', source: 'TT79 Điều 34, 31' },   /* msg-ok: mô tả điều kiện thăm gặp, không phải message */
  { code: '5.3', group: 'Hạn chế theo quy định pháp luật', title: 'Không có văn bản của cơ quan thụ lý vụ án', detail: 'Cơ quan thụ lý vụ án có văn bản đề nghị không cho gặp thân nhân thì Trưởng cơ sở xem xét không cho gặp', source: 'TT79 Điều 34' },   /* msg-ok: mô tả điều kiện thăm gặp, không phải message */
  { code: '7', group: 'Quỹ lượt thăm gặp', title: 'Còn lượt thăm gặp khả dụng', detail: 'Quỹ tuần 1 lần, trừ kỷ luật trong tuần, cộng khen thưởng đã áp dụng', source: 'TT79 Điều 34' },
];

/* { ok, condition, reason, available, eligibleFrom } — available is the quota the card shows (0 when a condition fails) */
/* visitDate: ngày hẹn (Date) khi đã chọn ở bước 2 — có thì xét kỷ luật và lượt của ĐÚNG TUẦN ngày hẹn; chưa có thì không khóa thẻ vì kỷ luật/lượt.
 * excludeCode: lịch đang sửa hoặc dời, không tính chính nó vào lượt đang giữ chỗ. Kỷ luật và quỹ đọc chung 1 nguồn data/visitQuotaStore.js */
export function checkVisitEligibility(student, today = new Date(), visitDate = null, excludeCode) {
  const fail = (condition, reason, extra) => ({ ok: false, condition, reason, available: 0, ...extra });
  if (!student) return fail('3', 'Chưa chọn người cai nghiện');
  if (student.linkStatus && student.linkStatus !== 'APPROVED') return fail('3', msg('E001-26'));
  if (student.visitRightEnabled === false) return fail('4', msg('E001-27'));
  const status = MANAGEMENT_STATUS[student.managementStatus];
  if (status && !status.allowsVisit) return fail('5', msg('E001-28', status.label));
  const admitted = fromIso(student.admissionDate);
  if (admitted) {
    const from = new Date(admitted); from.setDate(from.getDate() + ADMISSION_WAIT_DAYS);
    const day = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (day < from) return fail('5.1', msg('E001-29', ADMISSION_WAIT_DAYS, dmy(admitted), dmy(from)), { eligibleFrom: dmy(from) });
  }
  const hold = student.medicalHold;
  if (hold) { const until = fromIso(hold.until); return fail('5.4', msg('E001-30', hold.reason || '', until ? dmy(until) : '')); }
  if (student.disciplineUnderReview) return fail('5.2', msg('E001-31'));
  /* kỷ luật (5.2 khu cách ly) và lượt (7) — tính theo tuần ngày hẹn từ 1 nguồn visitQuotaStore; tuần 1 = tuần chứa ngày quyết định */
  const week = weekBan(student.studentCode, visitDate || today, excludeCode);
  if (visitDate && !week.ok && week.condition === '5.2') return fail('5.2', week.reason);
  const letter = student.caseAuthorityRequest;
  if (letter) return fail('5.3', msg('E001-33', letter.agency || 'Cơ quan thụ lý vụ án', letter.documentNo || ''));
  /* hết lượt (điều kiện 7) thì khoá thẻ cả khi chưa chọn ngày hẹn, tính theo tuần hiện tại; kỷ luật 5.2 vẫn chỉ xét khi đã có ngày hẹn */
  if (!week.ok && (visitDate || week.condition === '7')) return fail(week.condition, week.reason);
  return { ok: true, condition: '', reason: '', available: week.available };
}
