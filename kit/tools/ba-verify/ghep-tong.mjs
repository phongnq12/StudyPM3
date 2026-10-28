#!/usr/bin/env node
// Ghép bản tổng (kit/standards/id-convention.md mục "trace.csv"; /ba-pr bước 4):
//   - traceability.csv ở gốc: mọi dòng của du-an/trace.csv và chuc-nang/CN-xx/trace.csv, cộng cột `duoc_dan_boi`
//     (chiều ngược của `lien_ket`, script tính) và `tep_trace` (tệp nguồn của dòng).
//   - open-questions.md ở gốc: câu hỏi và giả định của du-an/ và mọi chuc-nang/CN-xx/, thêm cột "Tầng".
// Hai tệp là bản sinh, không sửa tay. Dùng: node kit/tools/ba-verify/ghep-tong.mjs [--goc <repo>] [--kiem]
//   --kiem: không ghi, chỉ báo LỖI khi bản tổng hiện có khác bản ghép lại (chưa chạy lại hoặc sửa tay).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BaoCao, bangMarkdown, docCsv, thamSo, timGoc } from './lib.mjs';

const COT = ['id', 'loai', 'ten', 'file', 'nguon', 'lien_ket', 'chuc_nang', 'trang_thai', 'cap_nhat'];
const ds = (s) => (s || '').split(';').map((x) => x.trim()).filter(Boolean);
const oCsv = (s) => (/[",\n]/.test(s ?? '') ? `"${String(s).replace(/"/g, '""')}"` : (s ?? ''));

// Các tầng có tệp: [{ tang: 'du-an' | 'CN-xx', thuMuc }].
function dsTang(goc) {
  const ra = [{ tang: 'du-an', thuMuc: path.join(goc, 'du-an') }];
  const cn = path.join(goc, 'chuc-nang');
  if (fs.existsSync(cn)) {
    for (const d of fs.readdirSync(cn).sort()) {
      if (/^CN-\d+$/.test(d) && fs.statSync(path.join(cn, d)).isDirectory()) ra.push({ tang: d, thuMuc: path.join(cn, d) });
    }
  }
  return ra;
}

export function ghepTruyVet(goc) {
  const hang = [];
  for (const { thuMuc } of dsTang(goc)) {
    const f = path.join(thuMuc, 'trace.csv');
    if (!fs.existsSync(f)) continue;
    for (const r of docCsv(f)) hang.push({ ...r, tep_trace: path.relative(goc, f).split(path.sep).join('/') });
  }
  const nguoc = new Map();
  for (const r of hang) for (const x of ds(r.lien_ket)) {
    if (!nguoc.has(x)) nguoc.set(x, []);
    nguoc.get(x).push(r.id);
  }
  const cot = [...COT, 'duoc_dan_boi', 'tep_trace'];
  const dong = hang.map((r) => cot.map((c) => oCsv(c === 'duoc_dan_boi' ? [...new Set(nguoc.get(r.id) ?? [])].join(';') : r[c])).join(','));
  return { noiDung: `${[cot.join(','), ...dong].join('\n')}\n`, soDong: hang.length };
}

// Bảng của mục "<so>." trong open-questions; trả về { cot, hang } với hàng là chuỗi ô.
function bangMucOq(text, so, dau) {
  const dong = text.split(/\r?\n/);
  const bd = dong.findIndex((d) => new RegExp(`^#{1,6}\\s+${so}\\.\\s`).test(d));
  if (bd < 0) return null;
  let kt = dong.findIndex((d, i) => i > bd && /^#{1,6}\s/.test(d));
  if (kt < 0) kt = dong.length;
  return bangMarkdown(dong.slice(bd + 1, kt).join('\n'), [dau]);
}

export function ghepCauHoi(goc) {
  const phan = { q: { cot: null, hang: [] }, asm: { cot: null, hang: [] } };
  // Sổ của bước 1 (1-ba-init/) đứng trước sổ tầng dự án từ bước 2 (du-an/).
  for (const { tang, thuMuc } of [{ tang: '1-ba-init', thuMuc: path.join(goc, '1-ba-init') }, ...dsTang(goc)]) {
    const f = path.join(thuMuc, 'open-questions.md');
    if (!fs.existsSync(f)) continue;
    const t = fs.readFileSync(f, 'utf8');
    for (const [k, so, dau] of [['q', 1, 'Q'], ['asm', 2, 'ASM']]) {
      const b = bangMucOq(t, so, dau);
      if (!b) continue;
      phan[k].cot ??= b.cot;
      for (const h of b.hang) {
        if (!/^(Q|ASM)-\d+/.test((h[dau] || '').trim())) continue;
        phan[k].hang.push([tang, ...phan[k].cot.map((c) => (h[c] ?? '').replace(/\|/g, '\\|'))]);
      }
    }
  }
  const bang = ({ cot, hang }) => (cot
    ? [`| Tầng | ${cot.join(' | ')} |`, `| --- | ${cot.map(() => '---').join(' | ')} |`, ...hang.map((h) => `| ${h.join(' | ')} |`)].join('\n')
    : 'Không có.');
  const noiDung = ['# Câu hỏi mở và giả định — bản tổng', '',
    'Bản sinh bằng `node kit/tools/ba-verify/ghep-tong.mjs` từ `1-ba-init/open-questions.md`, `du-an/open-questions.md` và `chuc-nang/CN-xx/open-questions.md`.',
    'Không sửa tay: sửa ở tệp của tầng rồi chạy lại.', '', '## 1. Câu hỏi', bang(phan.q), '', '## 2. Giả định', bang(phan.asm), ''].join('\n');
  return { noiDung, soQ: phan.q.hang.length, soAsm: phan.asm.hang.length };
}

export function ghepTong({ goc, kiem = false } = {}) {
  const bc = new BaoCao('BẢN TỔNG — traceability.csv, open-questions.md');
  const tv = ghepTruyVet(goc);
  const ch = ghepCauHoi(goc);
  for (const [ten, nd] of [['traceability.csv', tv.noiDung], ['open-questions.md', ch.noiDung]]) {
    const f = path.join(goc, ten);
    if (kiem) {
      const cu = fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null;
      if (cu === null) bc.LOI(`chưa có ${ten}: chạy ghep-tong.mjs`);
      else if (cu !== nd) bc.LOI(`${ten} khác bản ghép từ các tầng (sửa tay hoặc chưa ghép lại): chạy ghep-tong.mjs`);
    } else {
      fs.writeFileSync(f, nd);
    }
  }
  bc.TIN(`${tv.soDong} dòng truy vết; ${ch.soQ} câu hỏi, ${ch.soAsm} giả định${kiem ? '' : ' — đã ghi'}`);
  return bc;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = thamSo(process.argv.slice(2));
  const goc = a.goc ? path.resolve(a.goc) : timGoc(process.cwd());
  process.exit(ghepTong({ goc, kiem: !!a.kiem }).in() ? 1 : 0);
}
