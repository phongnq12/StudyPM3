/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Popup "Thông tin chi tiết thân nhân" — 1 nguồn duy nhất cho mọi màn (Tạo lịch hẹn, Đăng ký tại quầy, Chi tiết lịch hẹn).
 * Màn chỉ lo khung popup; tiêu đề, thứ tự dòng, nhãn và cách tra tài khoản thân nhân lấy ở đây. */
import { RELATIVES, RELATIVE_STATUS } from '@/data/legacyData';
import { toDisplayDate } from '@/data/appointmentStore';

export const RELATIVE_DETAIL_TITLE = 'Thông tin chi tiết thân nhân';

const statusLabel = (code) => (RELATIVE_STATUS[code] ? RELATIVE_STATUS[code].label : code);
const statusClass = (code) => 'tag-' + ({ APPROVED: 'approved' }[code] || 'completed');

/* Tra tài khoản thân nhân theo CCCD, không thấy thì theo họ tên; người đi cùng chưa có tài khoản thì dựng từ thông tin trên lịch */
export function findRelative(person) {
  if (!person) return null;
  const found = RELATIVES.find((r) => person.citizenId && r.citizenId === person.citizenId)
    || RELATIVES.find((r) => r.fullName === person.fullName);
  return found || { fullName: person.fullName, citizenId: person.citizenId, birthDate: person.birthDate, phoneNumber: person.phoneNumber, status: null, students: null };
}

/* Chữ tắt avatar: 2 chữ đầu của 2 từ cuối họ tên, cùng cách với thẻ thân nhân ở màn Tạo lịch hẹn */
export const relativeInitials = (name) => { const p = String(name || '').trim().split(/\s+/); return (p.length >= 2 ? p[p.length - 2][0] + p[p.length - 1][0] : p[0].slice(0, 2)).toUpperCase(); };

/* Họ tên hiện ở đầu popup cạnh avatar nên không lặp trong danh sách dòng.
 renderStatus(className, label): màn React trả thẻ AppTag, màn dựng chuỗi HTML trả chuỗi */
export function relativeDetailRows(r, renderStatus) {
  const blank = (v) => (v === undefined || v === null || v === '' || v === '—' ? '—' : v);
  return [
    ['Số CCCD', blank(r.citizenId)],
    ['Ngày sinh', blank(toDisplayDate(r.birthDate))],
    ['Số điện thoại', blank(r.phoneNumber)],
    ['Trạng thái hồ sơ', r.status ? renderStatus('tag tag-dot ' + statusClass(r.status), statusLabel(r.status)) : '—'],
    ['Số người nghiện đã liên kết', r.students ? r.students.length + ' người' : '—'],
    ['Quyền thăm gặp', r.status ? 'Đang bật' : '—'],
  ];
}
