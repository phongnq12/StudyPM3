/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Kho Lịch sử thao tác dùng chung của lịch hẹn (mọi thao tác đổi dữ liệu đều ghi lịch sử).
 * Mọi thao tác làm đổi dữ liệu lịch hẹn ở mọi màn (Danh sách, Chi tiết, Tạo mới, Chỉnh sửa, Đăng ký tại quầy, Lịch theo buồng)
 * ghi 1 dòng vào đây; trang Chi tiết đọc ra ở tab Lịch sử thao tác.
 * Trạng thái đổi ngoài form (Phê duyệt, Từ chối, Hủy, Vắng mặt) cũng lưu ở đây để tải lại trang, sang màn khác vẫn đúng. */
import { currentAccount } from './accountStore';

const KEY_HISTORY = 'pm2_lich_su_thao_tac';   // { [code]: Row[] }
const KEY_STATUS = 'pm2_lich_hen_trang_thai'; // { [code]: status }
const read = (k) => { try { return JSON.parse(localStorage.getItem(k) || '{}') || {}; } catch (e) { return {}; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };
const pad2 = (n) => String(n).padStart(2, '0');
export const timeText = (d = new Date()) => pad2(d.getDate()) + '/' + pad2(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes()) + ':' + pad2(d.getSeconds());

/* Ghi 1 dòng. actor mặc định là tài khoản đang đăng nhập; thao tác của hệ thống truyền { name: 'Hệ thống', role: 'Tự động' } */
/* reason = lời người dùng nhập (Lý do, ý kiến) · note = ghi chú hệ thống tự sinh (Ghi chú hệ thống) · thay đổi dữ liệu nằm ở changes */
export function logAction(code, action, { statusBefore = null, statusAfter = null, reason = '', note = '', changes = [], actor = null, at = null } = {}) {
  if (!code) return null;
  const a = actor || currentAccount();
  const row = { at: at || timeText(), actorName: a.name, actorRole: a.role, action, statusBefore, statusAfter, changes, reason: reason || '', note: note || '' };
  const all = read(KEY_HISTORY); (all[code] = all[code] || []).push(row); write(KEY_HISTORY, all);
  return row;
}
/* dòng ghi trước khi đổi luật dồn mọi thứ vào reason, nối bằng « · » ⇒ tách lại lúc đọc, không sửa kho */
const SYSTEM_PART = /^(Đã gửi thông báo|Chưa gửi được thông báo|Thân nhân đã có sổ|chưa check-in|Quầy [A-Z]*\d+$|Đề xuất lịch thay thế|Không tìm được khung giờ trống)|: Nhắc thân nhân lịch/;
const MANUAL_COUNTER = 'Quầy tiếp đón chọn tay: ';
const MANUAL_COUNTER_REASON = / — (Quầy đã chọn khác|Người cai nghiện chưa có quầy)/;
function splitLegacy(rows) {
  const seenCounter = new Set();
  return rows.map((r) => {
    if (!r || r.note !== undefined || !r.reason) return r;
    const reason = [], note = [], changes = (r.changes || []).slice();
    String(r.reason).split(' · ').forEach((part) => {
      const s = part.trim(); if (!s) return;
      if (s.startsWith(MANUAL_COUNTER)) { const label = s.slice(MANUAL_COUNTER.length).split(MANUAL_COUNTER_REASON)[0]; if (!seenCounter.has(label)) { seenCounter.add(label); changes.push(['Quầy tiếp đón', '—', label + ' (chọn tay)']); } return; }
      if (s.startsWith('Đơn xin Trưởng cơ sở duyệt: ')) { reason.push(s.slice('Đơn xin Trưởng cơ sở duyệt: '.length)); return; }
      (SYSTEM_PART.test(s) ? note : reason).push(s);
    });
    return { ...r, reason: reason.join(' · '), note: note.join(' · '), changes };
  });
}
export const readHistory = (code) => splitLegacy((read(KEY_HISTORY)[code] || []).slice());
export const hasLogged = (code, action) => readHistory(code).some((r) => r.action === action);
/* thao tác tạo đơn luôn là thao tác ĐẦU TIÊN của 1 đơn ⇒ mốc tạo = dòng tạo sớm nhất trong Lịch sử thao tác */
export const CREATE_ACTIONS = ['Tạo lịch hẹn', 'Tạo mới', 'Lưu nháp', 'Đăng ký tại quầy', 'Đăng ký và check-in tại quầy'];
export const timeMsOf = (s) => { const m = /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})(?::(\d{2}))?/.exec(s || ''); return m ? +new Date(+m[3], +m[2] - 1, +m[1], +m[4], +m[5], +(m[6] || 0)) : 0; };
export function createdMsOf(rows) {
  const times = (rows || []).filter((r) => r && CREATE_ACTIONS.includes(r.action)).map((r) => timeMsOf(r.at)).filter(Boolean);
  return times.length ? Math.min(...times) : 0;
}

export function setStatus(code, status) { const m = read(KEY_STATUS); m[code] = status; write(KEY_STATUS, m); }
export const readStatusMap = () => read(KEY_STATUS);
