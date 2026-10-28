/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* valueTagColor — mỗi giá trị danh mục (Buồng thăm gặp, Quầy tiếp đón) 1 màu riêng để phân biệt nhanh trên danh sách.
 * Màu theo THỨ TỰ mã trong danh mục, chia đều vòng sắc độ theo số mã ⇒ mọi giá trị khác màu nhau, không giới hạn 8 màu
 * như bảng cố định; 1 giá trị giữ 1 màu trên mọi dòng. Nền đậm hơn tag nhạt ở base.css 1 nấc (91% thay 96%) để các màu tách nhau bằng mắt.
 * Né dải đỏ và cam (340°–50°): đỏ là màu nguy hiểm, cam là tag Ngoại lệ. Quầy lệch nửa vòng để không trùng sắc với Buồng. */
import { readTables } from '@/data/visitTableStore';
import { readCounters } from '@/data/receptionDeskStore';

const HUE_FROM = 50, HUE_SPAN = 290;   /* dải sắc độ được dùng: 50° → 340° */
const SOURCES = { table: { read: readTables, offset: 0 }, counter: { read: readCounters, offset: 0.5 } };
const hash = (s) => { let h = 0; for (const ch of String(s)) h = (h * 31 + ch.charCodeAt(0)) | 0; return Math.abs(h); };
const gcd = (a, b) => (b ? gcd(b, a % b) : a);

/* bản thuần: tự truyền danh sách mã (trang Design System dùng dữ liệu mẫu riêng) */
export function valueTagStyleOf(code, codes, kind = 'table') {
  if (!code) return undefined;
  const list = [...codes].sort(), n = list.length, idx = list.indexOf(code);
  /* chia đều n sắc độ (2 màu gần nhất cách HUE_SPAN/n độ), xếp xen kẽ để 2 mã liền nhau (Q01-01, Q01-02) cách xa nhau trên vòng màu */
  let frac;
  if (idx < 0 || n < 2) frac = (hash(code) * 0.618034) % 1;
  else { let s = Math.max(1, Math.round(n * 0.382)); while (gcd(s, n) !== 1) s++; frac = ((idx * s) % n) / n; }
  const offset = kind === 'counter' ? 0.5 : 0;
  const hue = Math.round(HUE_FROM + ((frac + offset) % 1) * HUE_SPAN);
  return { background: 'hsl(' + hue + ' 85% 91%)', borderColor: 'hsl(' + hue + ' 65% 72%)', color: 'hsl(' + hue + ' 75% 24%)' };
}

/* bản dùng trên màn: đọc danh mục Buồng hoặc Quầy đang có */
export function valueTagStyle(code, kind) {
  const src = SOURCES[kind]; if (!code || !src) return undefined;
  return valueTagStyleOf(code, src.read().map((x) => x.code), kind);
}
