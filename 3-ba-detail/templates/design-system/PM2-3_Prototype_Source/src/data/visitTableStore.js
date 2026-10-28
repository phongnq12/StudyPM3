/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* WEB-51 Buồng thăm gặp — danh mục Site PM2, mỗi buồng TRỰC THUỘC 1 quầy, không gắn dãy nhà.
 * Vòng đời Nháp → Hoạt động ⇄ Vô hiệu hóa như quầy. Tạo từng buồng một, không có tạo hàng loạt.
 * Mã buồng duy nhất trong cơ sở, khoá sau khi lưu (BR-201). Khuôn đề nghị {mã quầy}-{2 số}.
 * Dữ liệu mẫu chuyển từ buồng của phòng cũ: legacyCode là mã cũ (TC01-xx, TC02-xx) mà dữ liệu lịch hẹn mẫu còn trỏ tới — LEGACY_TABLE_MAP đổi sang mã mới. */
import { START_EMPTY } from './legacyData';

export const STORAGE_KEY = 'pm2_ban_tham_gap_v1';
/* Vòng đời Nháp → Hoạt động ⇄ Vô hiệu hóa như quầy: Tạo có Lưu nháp + Lưu và kích hoạt, Sửa chỉ có Lưu */
export const TABLE_STATUS = { DRAFT: { label: 'Nháp' }, ACTIVE: { label: 'Hoạt động' }, INACTIVE: { label: 'Vô hiệu hóa' } };

const mk = (code, legacyCode, counterCode, seats, hasPartition, status, createdAt) =>
  ({ code, name: 'Buồng số ' + code.slice(-2), counterCode, seats, hasPartition, status, note: '', legacyCode, createdAt });

const SEED = [
  ...[1, 2, 3, 4, 5, 6].map((n) => mk('Q01-0' + n, 'TC01-0' + n, 'Q01', 4, n === 6, 'ACTIVE', '2026-09-20T08:0' + n + ':00')),
  ...[7, 8, 9, 10, 11, 12].map((n, i) => mk('Q02-0' + (i + 1), 'TC01-' + String(n).padStart(2, '0'), 'Q02', 4, false, i === 5 ? 'INACTIVE' : 'ACTIVE', '2026-09-21T08:0' + i + ':00')),
  mk('Q05-01', 'TC02-01', 'Q05', 3, true, 'ACTIVE', '2026-09-22T08:00:00'),
  mk('Q05-02', 'TC02-02', 'Q05', 3, true, 'ACTIVE', '2026-09-22T08:01:00'),
];

/* Mã buồng cũ (lịch hẹn mẫu, phòng TC01 / TC02) ⇒ mã buồng mới */
export const LEGACY_TABLE_MAP = Object.fromEntries(SEED.map((t) => [t.legacyCode, t.code]));

export function readTables() {
  try { const s = localStorage.getItem(STORAGE_KEY); if (s) return JSON.parse(s); } catch (e) { /* bị chặn lưu: dùng mẫu */ }
  return (START_EMPTY ? [] : SEED).map((t) => ({ ...t }));
}
export function writeTables(list) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); return true; } catch (e) { return false; } }
export const findTable = (code) => readTables().find((t) => t.code === code) || null;
export const tablesOfCounter = (counterCode, onlyActive) => readTables().filter((t) => t.counterCode === counterCode && (!onlyActive || t.status === 'ACTIVE'));
export const tableStatusLabel = (s) => (TABLE_STATUS[s] ? TABLE_STATUS[s].label : s);
