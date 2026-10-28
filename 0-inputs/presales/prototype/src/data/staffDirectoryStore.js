/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* PM2 · Danh sách cán bộ nhận thông báo — dữ liệu giả lập theo cột của PM5 Quản trị hệ thống › Người dùng
 * (Danh bạ người dùng trung tâm: CCCD · Họ tên · Email · Trạng thái). Prototype chưa có máy chủ nên khai sẵn tại đây.
 * accountKey: cán bộ có tài khoản đăng nhập Prototype (data/accountStore.js) ⇒ nhận thông báo trên chuông; cán bộ còn lại chỉ ghi Lịch sử thao tác.
 * team: VISIT_TEAM = Tổ thăm gặp · ADVISORY = Tổ tham mưu · HEAD = vai Trưởng cơ sở. */
import { currentAccount } from './accountStore';

export const STAFF = [
  { key: 'CB-TG-01', citizenId: '001190012345', name: 'Nguyễn Thùy Linh', email: 'linh.nt@cscn1.gov.vn', role: 'Cán bộ Tổ thăm gặp', team: 'VISIT_TEAM', status: 'ACTIVE', accountKey: 'VISIT_TEAM_STAFF' },
  { key: 'CB-TG-02', citizenId: '001088004521', name: 'Trần Văn Hùng', email: 'hung.tv@cscn1.gov.vn', role: 'Cán bộ Tổ thăm gặp', team: 'VISIT_TEAM', status: 'ACTIVE' },
  { key: 'CB-TG-03', citizenId: '001192007788', name: 'Lê Thị Mai', email: 'mai.lt@cscn1.gov.vn', role: 'Cán bộ Tổ thăm gặp', team: 'VISIT_TEAM', status: 'ACTIVE' },
  { key: 'CB-TS-01', citizenId: '001080001122', name: 'Trưởng Cơ Sở', email: 'truongcoso@cscn1.gov.vn', role: 'Trưởng cơ sở', team: 'HEAD', status: 'ACTIVE', accountKey: 'FACILITY_HEAD' },
  { key: 'CB-TM-01', citizenId: '001191003344', name: 'Nguyễn Thùy Trang', email: 'trang.nt@cscn1.gov.vn', role: 'Cán bộ Tổ tham mưu', team: 'ADVISORY', status: 'ACTIVE', accountKey: 'ADVISORY_STAFF' },
  { key: 'CB-TM-02', citizenId: '001087005566', name: 'Phạm Quốc Bảo', email: 'bao.pq@cscn1.gov.vn', role: 'Cán bộ Tổ tham mưu', team: 'ADVISORY', status: 'ACTIVE' },
];

const active = () => STAFF.filter((s) => s.status === 'ACTIVE');
export const staffByKey = (key) => STAFF.find((s) => s.key === key) || null;
export const staffName = (key) => (staffByKey(key) || {}).name || key;
export const visitTeamStaff = () => active().filter((s) => s.team === 'VISIT_TEAM');
/* nhóm Trưởng cơ sở = mọi người thuộc vai Trưởng cơ sở */
export const facilityHeads = () => active().filter((s) => s.team === 'HEAD');
export const allStaff = () => active();
/* người đăng nhập thuộc Tổ thăm gặp ⇒ mặc định có trong nhóm Cán bộ tổ thăm gặp */
export function defaultVisitTeamKeys() {
  const me = currentAccount(), s = active().find((x) => x.accountKey === me.key && x.team === 'VISIT_TEAM');
  return s ? [s.key] : [];
}
