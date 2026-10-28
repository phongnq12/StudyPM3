/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Sample data of the appointment detail screen: English camelCase keys, status as APPOINTMENT_STATUS code.
 * Values keep the exact display strings of the HTML prototype. */

import { weekLabel, weekStartOf } from '../../lib/visitWeek.js';
/* tuần chứa ngày hẹn của bản ghi mẫu, theo tuần nghiệp vụ chung */
const WEEK_OF_SAMPLE = (() => { const s = weekStartOf(new Date(2026, 8, 21)), l = weekLabel(s).split(' — ');
  return { from: l[0], to: l[1], fromDate: l[0] + '/' + s.getFullYear() }; })();
export const APPOINTMENT_DETAIL_SAMPLE = {
  code: 'LH-2026-0914',
  visitTypeName: 'Thăm gặp trực tiếp tiêu chuẩn',
  visitDateTime: '24/09/2026 07:30',
  visitDayLabel: 'Thứ Năm, 24/09/2026',
  timeSlotLabel: '07:30 — 08:15',
  durationLabel: '45 phút',
  dormitoryName: 'Dãy A',
  tableCode: 'B-03',
  counterName: 'Q01 — Quầy tiếp đón số 1',
  status: 'APPROVED',
  sourceLabel: 'Đăng ký tại quầy',
  createdAt: '21/09/2026 07:12',
  staffInCharge: 'Nguyễn Văn Bình — Cán bộ Tổ tiếp nhận',
  slotTypeLabel: 'Suất dành riêng của quầy',
  relativeNote: '',
  staffNote: 'Thân nhân đến sớm, đã hướng dẫn chờ tại khu tiếp đón.',
  student: {
    fullName: 'Phạm Quốc Dũng', studentCode: 'HS-00623', teamName: 'Đội 1',
    citizenId: '001085056789', birthDate: '08/11/1985',
    managementStatusLabel: 'Đang cai nghiện', visitRightLabel: 'Được thăm gặp',
  },
  quota: {
    periodLabel: 'Kỳ tháng 09/2026 (01/09 — 30/09)',
    week: { ...WEEK_OF_SAMPLE, granted: 1, used: 0, holding: 1, appliedRewardCodes: [] },
    /* appliedWeek: week the reward was used in ('' = not used); a used reward cannot be reused */
    /* Khen thưởng và kỷ luật lấy từ PM1 (chỉ xem): nhãn, định dạng mã và giá trị danh mục theo màn PM1 STG
 /khen-thuong-hoc-vien và /vi-pham-ky-luat. appliedWeek, visits và weeks là phần riêng của PM2. */
    rewards: [
      { code: 'HNO-4-BBKT-2026-00000003', name: 'Khen thưởng đột xuất', type: 'Đột xuất', recordedDate: '28/08/2026', achievement: 'Phát hiện và báo cáo kịp thời hành vi cất giấu vật cấm trong khu lưu trú',
        regimes: ['Tăng 01 lần thăm gặp trong tháng'], visits: 1, decisionNo: '12/QĐ-PC04-CSCNMT3', decisionDate: '02/09/2026', decider: 'Trần Minh Đức', appliedWeek: '' },   /* chưa dùng: tuần 14/09 đang ở khu cách ly, không áp dụng được */
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
  visitors: [
    { fullName: 'Phạm Văn Tú', relationship: 'Anh', citizenId: '001082034512', birthDate: '15/06/1982', phoneNumber: '0912345678', isRegistrant: true, verificationLabel: 'Khớp' },
    { fullName: 'Phạm Thị Hoa', relationship: 'Người thân khác', citizenId: '001086078934', birthDate: '03/09/1986', isRegistrant: false, verificationLabel: 'Chưa đối chiếu' },
  ],
};

/* Action history (8 columns); statusBefore / statusAfter are enum codes, null = none */
export const APPOINTMENT_HISTORY_SAMPLE = [
  { at: '21/09/2026 07:12:04', actorName: 'Nguyễn Văn Bình', actorRole: 'Cán bộ Tổ tiếp nhận', action: 'Tạo mới', statusBefore: null, statusAfter: 'APPROVED',
    changes: [['Nguồn đặt lịch', '', 'Đăng ký tại quầy'], ['Người cai nghiện', '', 'Phạm Quốc Dũng'], ['Khung giờ', '', '24/09/2026 07:30']],
    reason: 'Thân nhân đến quầy, chưa đặt lịch trước' },
  { at: '21/09/2026 07:12:05', actorName: 'Hệ thống', actorRole: 'Tự động', action: 'Trừ suất quầy', statusBefore: null, statusAfter: null,
    changes: [['Suất dành riêng Q01 khung 07:30', '2', '1']],
    reason: 'Đăng ký tại quầy được trừ vào suất dành riêng của quầy trước' },
  { at: '21/09/2026 07:13:21', actorName: 'Nguyễn Văn Bình', actorRole: 'Cán bộ Tổ tiếp nhận', action: 'Xếp buồng', statusBefore: 'APPROVED', statusAfter: 'APPROVED',
    changes: [['Buồng thăm gặp', 'Chưa xếp', 'B-03']], reason: '' },
  { at: '23/09/2026 16:40:37', actorName: 'Lê Thị Hằng', actorRole: 'Tổ trưởng Tổ tiếp nhận', action: 'Sửa', statusBefore: 'APPROVED', statusAfter: 'APPROVED',
    changes: [['Số thân nhân đi cùng', '0', '1'], ['Ghi chú của cán bộ', '', 'Thân nhân đến sớm, đã hướng dẫn chờ tại khu tiếp đón.']],
    reason: 'Thân nhân báo bổ sung 1 thân nhân đi cùng' },
];

/* Demo «kỷ luật trừ lượt rồi chọn áp dụng khen thưởng»: gắn cho người cai nghiện HS-01317 (lịch LH-2026-0921, Từ chối duyệt — không giữ lượt).
 * Tuần đã bị kỷ luật trừ hết lượt thì không tạo được lịch chờ duyệt; áp dụng khen thưởng để có lượt rồi mới chỉnh sửa và gửi lại.
 * Ngày tính theo tuần của ngày hẹn vì lịch mẫu dời ngày theo hôm nay: kỷ luật cảnh cáo quyết định Thứ Hai tuần hẹn (tuần 1/2),
 * 2 khen thưởng quyết định ngày đầu quý của ngày hẹn nên còn hạn đến cuối quý. */
export const DEMO_DISCIPLINE_STUDENT = 'HS-01317';
const dmyOf = (d) => String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear();
export function demoDisciplineQuota(visit) {
  const start = weekStartOf(visit), back = (d, n) => { const x = new Date(d); x.setDate(x.getDate() - n); return x; };
  const quarter = new Date(visit.getFullYear(), Math.floor(visit.getMonth() / 3) * 3, 1);
  const rewardDecision = quarter > visit ? visit : quarter;
  return {
    disciplines: [
      { code: 'HNO-4-BBKL-2026-00000041', form: 'Cảnh cáo', weeks: 2, violationDate: dmyOf(back(start, 3)), incidentType: 'Không chấp hành nội quy', violation: 'Tự ý rời khu lao động trị liệu trong giờ làm việc',
        reason: 'Tự ý rời khu lao động trị liệu trong giờ làm việc', decisionNo: '21/QĐ-PC04-CSCNMT3', decisionDate: dmyOf(start), decider: 'Trần Minh Đức' },
    ],
    rewards: [
      { code: 'HNO-4-BBKT-2026-00000043', name: 'Khen thưởng định kỳ tháng ' + String(back(quarter, 1).getMonth() + 1).padStart(2, '0') + '/' + back(quarter, 1).getFullYear(), type: 'Định kỳ - Tháng', recordedDate: dmyOf(back(quarter, 1)),
        achievement: 'Chấp hành tốt nội quy, tích cực tham gia lao động trị liệu', regimes: ['Tăng 01 lần thăm gặp trong tháng'], visits: 1, decisionNo: '22/QĐ-PC04-CSCNMT3', decisionDate: dmyOf(rewardDecision), decider: 'Trần Minh Đức', appliedWeek: '' },
      { code: 'HNO-4-BBKT-2026-00000044', name: 'Khen thưởng đột xuất', type: 'Đột xuất', recordedDate: dmyOf(back(quarter, 1)),
        achievement: 'Giúp đỡ cán bộ sơ cứu người cai nghiện bị ngã trong khu lao động', regimes: ['Tăng 01 lần thăm gặp trong tháng'], visits: 1, decisionNo: '23/QĐ-PC04-CSCNMT3', decisionDate: dmyOf(rewardDecision), decider: 'Trần Minh Đức', appliedWeek: '' },
    ],
  };
}
