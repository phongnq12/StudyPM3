#!/usr/bin/env node
// Gộp xung đột git ở file "chỉ thêm dòng" (kit/thiet-ke/thiet-ke-kit.md mục 8.3; kit/standards/id-convention.md mục "Overview
// và chi tiết"; /ba-pr bước 3). Mỗi khối xung đột: giữ dòng của cả hai bên, bỏ dòng trùng; dòng có cùng khóa (ô đầu
// của dòng bảng, cột đầu của csv) mà hai bên khác nhau: có bản gốc (diff3) thì lấy bên đã đổi so với gốc, hai bên cùng
// đổi khác nhau → không gộp, báo LỖI. File ngoài danh sách chỉ-thêm-dòng → không đụng, báo LỖI.
// Dùng: node kit/tools/ba-verify/gop-xung-dot.mjs [--goc <repo>] [tệp…]
//   Không nêu tệp: lấy mọi tệp đang xung đột (`git diff --name-only --diff-filter=U`), dựng lại khối xung đột kiểu
//   diff3 (`git checkout --conflict=diff3`) để có bản gốc. Tệp gộp xong không còn dấu xung đột; `git add` do phiên chính.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { BaoCao, thamSo, timGoc } from './lib.mjs';

// Tệp chỉ thêm dòng (đường dẫn tương đối, dấu /).
export const CHI_THEM = [
  '2-ba-overview/1-brd/brd-overview.md',
  '2-ba-overview/2-business-process/process-overview.md', '2-ba-overview/2-business-process/ma-tran-uc-proc.md',
  '2-ba-overview/2-business-process/danh-muc-chuc-nang.md',
  '2-ba-overview/3-erd/erd-overview.md',
  '2-ba-overview/5-actor-usecase/actors.md', '2-ba-overview/5-actor-usecase/uc-overview.md',
  '2-ba-overview/6-business-rules/rules-overview.md',
  '3-ba-detail/Prototype/sitemap.md', '3-ba-detail/SRS/srs.md',
  '1-ba-init/0-dau-vao/so-phat-hien.md',
  '1-ba-init/open-questions.md', 'du-an/glossary.md', 'du-an/open-questions.md', 'du-an/trace.csv',
];
// Bản tổng do ghep-tong.mjs sinh: không gộp, chạy lại script.
const BAN_SINH = ['traceability.csv', 'open-questions.md'];

const git = (goc, args) => spawnSync('git', args, { cwd: goc, encoding: 'utf8' });

// Khóa của một dòng: ô đầu của dòng bảng markdown, cột đầu của dòng csv; dòng khác dùng nguyên dòng.
function khoa(dong, csv) {
  if (csv) return dong.split(',')[0].trim();
  const m = dong.match(/^\|\s*([^|]*?)\s*\|/);
  return m && m[1] && !/^-+$/.test(m[1]) ? m[1].replace(/`/g, '') : dong.trim();
}
const laMa = (k) => /^[A-Z]+-\d+(?:\.\d+)?$/.test(k);
const soMa = (k) => k.split('-')[0] + String(Number(k.split('-')[1].split('.')[0])).padStart(6, '0') + (k.split('.')[1] ?? '');

// Gộp một khối: ours, theirs, base (null khi không có diff3). Trả về { dong } hoặc { loi }.
function gopKhoi(ours, theirs, base, csv) {
  const map = (ds) => new Map(ds.filter((d) => d.trim()).map((d) => [khoa(d, csv), d]));
  const mo = map(ours), mt = map(theirs), mb = base ? map(base) : new Map();
  const loi = [];
  const ra = [];
  const thuTu = [...new Set([...mo.keys(), ...mt.keys()])];
  for (const k of thuTu) {
    const o = mo.get(k), t = mt.get(k), b = mb.get(k);
    if (o !== undefined && t !== undefined && o !== t) {
      if (b !== undefined && o === b) ra.push([k, t]);
      else if (b !== undefined && t === b) ra.push([k, o]);
      else loi.push(`dòng "${k}" khác nhau ở hai bên`);
      continue;
    }
    // Một bên xóa dòng có trong gốc: file chỉ thêm dòng không được xóa → lỗi.
    if (b !== undefined && (o === undefined || t === undefined)) { loi.push(`dòng "${k}" bị xóa ở một bên`); continue; }
    ra.push([k, o ?? t]);
  }
  if (loi.length) return { loi };
  if (ra.every(([k]) => laMa(k))) ra.sort((a, b) => (soMa(a[0]) < soMa(b[0]) ? -1 : soMa(a[0]) > soMa(b[0]) ? 1 : 0));
  return { dong: ra.map(([, d]) => d) };
}

// Gộp nội dung một tệp có dấu xung đột. Trả về { noiDung, soKhoi, loi[] }; còn lỗi thì noiDung giữ khối lỗi nguyên.
export function gopNoiDung(text, { csv = false } = {}) {
  const dong = text.split('\n');
  const ra = [];
  const loi = [];
  let soKhoi = 0;
  for (let i = 0; i < dong.length; i++) {
    if (!dong[i].startsWith('<<<<<<<')) { ra.push(dong[i]); continue; }
    const bd = i;
    const ours = [], theirs = [];
    let base = null, phan = 'o';
    for (i++; i < dong.length && !dong[i].startsWith('>>>>>>>'); i++) {
      if (dong[i].startsWith('|||||||')) { base = []; phan = 'b'; continue; }
      if (dong[i].startsWith('=======')) { phan = 't'; continue; }
      (phan === 'o' ? ours : phan === 'b' ? base : theirs).push(dong[i]);
    }
    soKhoi++;
    const g = gopKhoi(ours, theirs, base, csv);
    if (g.loi) { loi.push(...g.loi.map((x) => `khối ${soKhoi} (dòng ${bd + 1}): ${x}`)); ra.push(...dong.slice(bd, i + 1)); }
    else ra.push(...g.dong);
  }
  return { noiDung: ra.join('\n'), soKhoi, loi };
}

export function gopXungDot({ goc, tep = [] } = {}) {
  const bc = new BaoCao('GỘP XUNG ĐỘT — file chỉ thêm dòng');
  let ds = tep;
  if (!ds.length) {
    const r = git(goc, ['diff', '--name-only', '--diff-filter=U']);
    if (r.status !== 0) { bc.LOI('không đọc được danh sách xung đột (không phải repo git?)'); return bc; }
    ds = r.stdout.split('\n').filter(Boolean);
    for (const f of ds.filter((x) => CHI_THEM.includes(x))) git(goc, ['checkout', '--conflict=diff3', '--', f]);
  }
  if (!ds.length) { bc.TIN('không có tệp xung đột'); return bc; }
  for (const rel of ds) {
    const r = rel.split(path.sep).join('/');
    if (BAN_SINH.includes(r)) { bc.LOI(`${r}: bản tổng do ghep-tong.mjs sinh — chạy lại script, không gộp tay`); continue; }
    if (!CHI_THEM.includes(r)) { bc.LOI(`${r}: không thuộc danh sách chỉ thêm dòng — dừng, báo BA (có thể đang sửa file của chức năng khác)`); continue; }
    const f = path.join(goc, r);
    const g = gopNoiDung(fs.readFileSync(f, 'utf8'), { csv: r.endsWith('.csv') });
    if (!g.soKhoi) { bc.TIN(`${r}: không có dấu xung đột`); continue; }
    if (g.loi.length) { for (const x of g.loi) bc.LOI(`${r}: ${x}`); continue; }
    fs.writeFileSync(f, g.noiDung);
    bc.TIN(`${r}: đã gộp ${g.soKhoi} khối`);
  }
  return bc;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = thamSo(process.argv.slice(2));
  const goc = a.goc ? path.resolve(a.goc) : timGoc(process.cwd());
  process.exit(gopXungDot({ goc, tep: a._ }).in() ? 1 : 0);
}
