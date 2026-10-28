/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Dãy nhà — nguồn PM1 màn Quản lý dãy nhà /quan-ly-day-nha. PM2 KHÔNG tạo danh mục này, chỉ đọc.
 * DỮ LIỆU GIẢ LẬP trong Prototype: PM1 chưa có sự kiện đồng bộ dãy nhà và dãy nhà của người cai nghiện sang PM2 (ghi chú SRS).
 * Khuôn mã theo PM1 SRS_XX_CSVC_01_QuanLyDayNha_v02 BR2 ({Mã cơ sở}-DAY-{3 số}); tên theo ví dụ PM1 mục 4.1 (Dãy A, Khu Nam, Khu Cách ly Nam).
 * Trạng thái PM1: Đang hoạt động · Ngừng hoạt động · Đang sửa chữa. Quầy chỉ chọn được dãy Đang hoạt động. */

export const DORMITORY_STATUS = {
  ACTIVE: { label: 'Đang hoạt động' },
  INACTIVE: { label: 'Ngừng hoạt động' },
  REPAIRING: { label: 'Đang sửa chữa' },
};

export const DORMITORIES = [
  { code: 'CS1-DAY-001', name: 'Dãy A', status: 'ACTIVE' },
  { code: 'CS1-DAY-002', name: 'Dãy B', status: 'ACTIVE' },
  { code: 'CS1-DAY-003', name: 'Dãy C', status: 'ACTIVE' },
  { code: 'CS1-DAY-004', name: 'Dãy D', status: 'ACTIVE' },
  { code: 'CS1-DAY-005', name: 'Khu Nam', status: 'ACTIVE' },
  { code: 'CS1-DAY-006', name: 'Khu Cách ly Nam', status: 'REPAIRING' },
  { code: 'CS1-DAY-007', name: 'Dãy E cũ', status: 'INACTIVE' },
  { code: 'CS1-DAY-008', name: 'Dãy F', status: 'ACTIVE' },
];

/* Người cai nghiện ⇒ dãy nhà đang ở (PM1: người cai nghiện ⇒ phòng ⇒ dãy nhà). HS-00841 ở Dãy F — dãy chưa thuộc quầy nào, để thử báo */
const STUDENT_DORMITORY = {
  'HS-00623': 'CS1-DAY-001', 'HS-00412': 'CS1-DAY-001', 'HS-00820': 'CS1-DAY-001', 'HS-00821': 'CS1-DAY-001', 'HS-00840': 'CS1-DAY-001',
  'HS-00915': 'CS1-DAY-002', 'HS-00518': 'CS1-DAY-002', 'HS-00830': 'CS1-DAY-002',
  'HS-00701': 'CS1-DAY-003', 'HS-00831': 'CS1-DAY-003', 'HS-01033': 'CS1-DAY-003',
  'HS-00841': 'CS1-DAY-008',
  'HS-00832': 'CS1-DAY-002', 'HS-00833': 'CS1-DAY-002', 'HS-00834': 'CS1-DAY-003', 'HS-00843': 'CS1-DAY-001',
};
const FALLBACK_DORMITORY = 'CS1-DAY-001';

/* Phòng đang ở của người cai nghiện (PM1 Quản lý phòng: phòng thuộc dãy). Hiển thị "Dãy / Phòng" thay Đội ở cụm lịch hẹn. GIẢ LẬP */
const STUDENT_ROOM = {
  'HS-00623': 'A101', 'HS-00412': 'A101', 'HS-00820': 'A102', 'HS-00821': 'A102', 'HS-00840': 'A103',
  'HS-00915': 'B201', 'HS-00518': 'B201', 'HS-00830': 'B202',
  'HS-00701': 'C101', 'HS-00831': 'C101', 'HS-01033': 'C102',
  'HS-00841': 'F101',
  'HS-00832': 'B203', 'HS-00833': 'B203', 'HS-00834': 'C103', 'HS-00843': 'A103',
};
export const roomOfStudent = (studentCode) => STUDENT_ROOM[studentCode] || '';
/* Tên dãy nhà của người cai nghiện — cột và field riêng, tách khỏi Phòng */
export const dormitoryNameOfStudent = (studentCode) => (studentCode ? dormitoryName(dormitoryOfStudent(studentCode)) : '');
/* "Dãy A / Phòng A101" — thiếu phòng thì chỉ tên dãy */
export const dormitoryRoomText = (studentCode) => {
  const room = roomOfStudent(studentCode);
  return dormitoryName(dormitoryOfStudent(studentCode)) + (room ? ' / Phòng ' + room : '');
};

export const listDormitories = () => DORMITORIES.slice();
export const findDormitory = (code) => DORMITORIES.find((d) => d.code === code) || null;
export const dormitoryName = (code) => { const d = findDormitory(code); return d ? d.name : code; };
export const dormitoryLabel = (code) => { const d = findDormitory(code); return d ? d.code + ' — ' + d.name : code; };
export const dormitoryOfStudent = (studentCode) => STUDENT_DORMITORY[studentCode] || FALLBACK_DORMITORY;
