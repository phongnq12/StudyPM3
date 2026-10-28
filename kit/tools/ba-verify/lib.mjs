// Hàm dùng chung cho bộ kiểm ba-verify. Đọc cấu trúc repo theo kit/standards/id-convention.md.
import fs from 'node:fs';
import path from 'node:path';

// Tiền tố ID theo kit/standards/id-convention.md (QP: quy trình presales, QT: quy trình dựng ngược, bước 1). Mã gốc bên ngoài không phải ID kit: UC presales ghi `PS:<mã>`,
// điều khoản pháp luật ghi `PL:<mã>`.
export const TIEN_TO = ['CN', 'MP', 'QP', 'QT', 'PH', 'REQ', 'PROC', 'ENT', 'ST', 'TR', 'ACT', 'UC', 'BR', 'SCR', 'CR', 'Q', 'ASM'];
// Mermaid dùng ID không gạch ngang (UC012) nên không bị bắt ở đây — đúng ý đồ.
// BR theo template business layer: BR-{nhóm}{nn} (00_quy_uoc_chung mục 4), vd BR-C01
export const RE_ID = new RegExp(`(?<![\\p{L}\\d-])(?:(?:${TIEN_TO.join('|')})-\\d+(?:\\.\\d+)?|BR-[A-Z]\\d{2})(?![\\p{L}\\d])`, 'gu');
export const TRANG_THAI = ['draft', 'dat-G0', 'dat-G1', 'dat-G2', 'dat-G3', 'dat-G4', 'approved', 'changed', 'deprecated'];
// Mã điều khoản pháp luật (kit/standards/id-convention.md mục "Mã điều khoản pháp luật").
export const RE_MA_DIEU_KHOAN = /^(?:(?:L|NQ|NĐ|QĐ|TT|CT)\d+-\d{4}\/Đ\d+[a-z]?(?:\.K\d+)?(?:\.[a-zđ])?|VB-[a-z0-9-]+\/[\p{L}\d.]+)$/u;
export const CAN_XAC_NHAN = '[CẦN XÁC NHẬN]';
// Nhận cả dạng kèm mã câu hỏi: [CẦN XÁC NHẬN: Q-004].
export const RE_CAN_XAC_NHAN = /\[CẦN XÁC NHẬN(?::[^\]\n]*)?\]/g;

// Mã UC dạng WBS (00_quy_uoc_chung mục 8.2), vd <MA>.WEB.02.01.01, xếp chung tiền tố UCWBS.
export const RE_UC_WBS = /^[A-Z][A-Z0-9]+\.(?:WEB|APP|KIOSK|API|JOB)(?:\.\d{2}){3}$/;
export function tienTo(id) {
  if (RE_UC_WBS.test(id)) return 'UCWBS';
  return id.split('-')[0];
}

export function docCsv(file) {
  const text = fs.readFileSync(file, 'utf8').replace(/^﻿/, '');
  const rows = [];
  let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); cell = '';
      if (row.some((x) => x.trim())) rows.push(row);
      row = [];
    } else cell += c;
  }
  row.push(cell);
  if (row.some((x) => x.trim())) rows.push(row);
  const [head, ...body] = rows;
  return body.map((r, i) => {
    const o = { _dong: i + 2 };
    head.forEach((h, j) => { o[h.trim()] = (r[j] ?? '').trim(); });
    return o;
  });
}

export function tachDs(s) {
  return (s || '').split(/[;,]/).map((x) => x.trim()).filter(Boolean);
}

// Ba thư mục bước của pipeline: đầu ra của /ba-init, /ba-overview, /ba-detail. Thư mục `templates/` trong mỗi bước
// là template, không phải tài liệu dự án: các lần quét tài liệu bỏ qua.
export const BUOC = ['1-ba-init', '2-ba-overview', '3-ba-detail'];
// Sổ câu hỏi, giả định, phát hiện của tầng dự án: sổ của bước 1 (1-ba-init/) và sổ từ bước 2 trở đi (du-an/). Mã Q,
// ASM, PH đánh số liên tục trên cả hai sổ, không trùng.
export const SO_DU_AN = ['1-ba-init/open-questions.md', 'du-an/open-questions.md'];

// Tệp tài liệu dự án trong ba thư mục bước (bỏ templates/).
export function duyetBuoc(goc, duoi, bo = ['node_modules', '.git']) {
  return BUOC.flatMap((d) => duyetFile(path.join(goc, d), duoi, [...bo, 'templates']));
}

export function duyetFile(goc, duoi, bo = ['node_modules', '.git']) {
  const ra = [];
  if (!fs.existsSync(goc)) return ra;
  const di = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (bo.includes(e.name)) continue;
      const p = path.join(d, e.name);
      if (e.isDirectory()) di(p);
      else if (duoi.some((x) => e.name.toLowerCase().endsWith(x))) ra.push(p);
    }
  };
  di(goc);
  return ra.sort();
}

// Bỏ khối code ``` và `code` nội dòng để không bắt nhầm ví dụ.
export function dongNoiDung(text) {
  let trongCode = false;
  return text.split(/\r?\n/).map((dong, i) => {
    if (/^\s*```/.test(dong)) { trongCode = !trongCode; return { so: i + 1, chu: '' }; }
    if (trongCode) return { so: i + 1, chu: '' };
    return { so: i + 1, chu: dong.replace(/`[^`]*`/g, ' ') };
  });
}

// Chữ người dùng nhìn thấy trong một trang HTML: bỏ comment, script, style, thẻ và thuộc tính.
export function chuHienThi(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ');
}

export function bangMarkdown(text, tieuDeCot) {
  const dong = text.split(/\r?\n/);
  for (let i = 0; i < dong.length; i++) {
    if (!dong[i].trim().startsWith('|')) continue;
    const cot = tachHang(dong[i]);
    if (!tieuDeCot.every((t) => cot.some((c) => c.toLowerCase().startsWith(t.toLowerCase())))) continue;
    const ra = [];
    for (let j = i + 2; j < dong.length && dong[j].trim().startsWith('|'); j++) {
      const o = { _dong: j + 1 };
      tachHang(dong[j]).forEach((c, k) => { o[cot[k]] = c; });
      ra.push(o);
    }
    return { cot, hang: ra };
  }
  return null;
}

// Nội dung một mục: từ heading khớp `tieuDe` (regex hoặc chuỗi đầu tên mục) tới heading cùng cấp hoặc cao hơn.
export function mucMarkdown(text, tieuDe) {
  const dong = text.split(/\r?\n/);
  const khop = (t) => (tieuDe instanceof RegExp ? tieuDe.test(t) : t.toLowerCase().includes(tieuDe.toLowerCase()));
  let bd = -1, cap = 0;
  for (let i = 0; i < dong.length; i++) {
    const m = dong[i].match(/^(#{1,6})\s+(.*)$/);
    if (!m) continue;
    if (bd < 0) { if (khop(m[2])) { bd = i; cap = m[1].length; } continue; }
    if (m[1].length <= cap) return dong.slice(bd + 1, i).join('\n');
  }
  return bd < 0 ? null : dong.slice(bd + 1).join('\n');
}

// Ô bảng còn là chữ mẫu của template (trống, "—", "<...>", "xx").
// `n/a` (chắc chắn không có — quy ước ba giá trị đặc biệt, ba-usecase method.md mục 4) cũng tính là ô không có giá trị.
export function oMau(s) {
  const x = (s || '').replace(/`/g, '').trim();
  return !x || x === '—' || x === '-' || /^n\/a$/i.test(x) || /^<.*>$/.test(x) || /-x{2,}/i.test(x);
}

// Tách một dòng bảng markdown thành ô. "\\|" là ký tự | trong ô, không phải dấu tách.
export function tachHang(s) {
  return s.trim().replace(/^\|/, '').replace(/(?<!\\)\|$/, '').split(/(?<!\\)\|/).map((x) => x.replace(/\\\|/g, '|').trim());
}

export function regexTu(tu) {
  const e = tu.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?<![\\p{L}\\d])${e}(?![\\p{L}\\d])`, 'iu');
}

export class BaoCao {
  constructor(ten) { this.ten = ten; this.loi = []; this.canh = []; this.tin = []; }
  LOI(x) { this.loi.push(x); }
  CANH(x) { this.canh.push(x); }
  TIN(x) { this.tin.push(x); }
  in() {
    const ra = [`== ${this.ten}`];
    for (const x of this.tin) ra.push(`   ${x}`);
    ra.push(`   LỖI (${this.loi.length})${this.loi.length ? '' : ': không có'}`);
    for (const x of this.loi) ra.push(`     - ${x}`);
    ra.push(`   CẢNH BÁO (${this.canh.length})${this.canh.length ? '' : ': không có'}`);
    for (const x of this.canh) ra.push(`     - ${x}`);
    console.log(ra.join('\n'));
    return this.loi.length;
  }
}

export function thamSo(argv) {
  const ra = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2);
      if (argv[i + 1] !== undefined && !argv[i + 1].startsWith('--')) ra[k] = argv[++i];
      else ra[k] = true;
    } else ra._.push(a);
  }
  return ra;
}

// Đọc truy vết: du-an/trace.csv và chuc-nang/CN-xx/trace.csv (traceability.csv ở gốc là bản ghép, không đọc).
// Mỗi dòng có thêm `_tep` (file nguồn của dòng). Trả về [] khi chưa có file nào.
export function docTruyVet(goc) {
  const v2 = [path.join(goc, 'du-an', 'trace.csv')];
  const dsCn = path.join(goc, 'chuc-nang');
  if (fs.existsSync(dsCn)) {
    for (const d of fs.readdirSync(dsCn).sort()) v2.push(path.join(dsCn, d, 'trace.csv'));
  }
  return v2.filter((f) => fs.existsSync(f)).flatMap((f) => docCsv(f).map((r) => ({ ...r, _tep: path.relative(goc, f) })));
}

export function timGoc(batDau) {
  let d = path.resolve(batDau);
  while (true) {
    if (fs.existsSync(path.join(d, 'du-an')) || fs.existsSync(path.join(d, 'kit', 'standards', 'gate-procedure.md'))) return d;
    const cha = path.dirname(d);
    if (cha === d) return path.resolve(batDau);
    d = cha;
  }
}
