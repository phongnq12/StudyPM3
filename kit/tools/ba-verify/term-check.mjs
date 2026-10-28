#!/usr/bin/env node
// Kiểm thuật ngữ theo du-an/glossary.md:
//  - từ ở cột "Không dùng" xuất hiện trong tài liệu ba thư mục bước hoặc chữ hiển thị của prototype → LỖI;
//  - từ ở cột "Từ tiếng Anh" lọt vào chữ hiển thị của prototype → CẢNH BÁO;
//  - từ mơ hồ (kit/standards/writing-style.md, requirement-quality.md) trong tài liệu ba thư mục bước → LỖI, trừ từ có định nghĩa trong glossary.
// Bỏ qua 1-ba-init/0-dau-vao/: danh mục chép nguyên văn UC presales, điều khoản, màn presales.
// Dùng: node kit/tools/ba-verify/term-check.mjs [--goc <repo>]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bangMarkdown, BaoCao, chuHienThi, dongNoiDung, duyetBuoc, duyetFile, regexTu, thamSo, timGoc } from './lib.mjs';

// Từ mơ hồ: yêu cầu không kiểm chứng được (29148 "unambiguous", "verifiable"). Có chỉ số đi kèm thì không tính.
const MO_HO = [
  { tu: 'nhanh', re: /(?<![\p{L}])nhanh(?![\p{L}])/iu },
  { tu: 'dễ dùng', re: /dễ (dùng|sử dụng)/iu },
  { tu: 'thân thiện', re: /thân thiện/iu },
  { tu: 'linh hoạt', re: /linh hoạt/iu },
  { tu: 'v.v.', re: /\bv\.v\.?|vân vân/iu },
  { tu: 'và các trường hợp khác', re: /và các trường hợp khác/iu },
  { tu: 'phù hợp', re: /phù hợp/iu },
  { tu: 'tối ưu', re: /tối ưu/iu },
  { tu: 'ổn định', re: /(?<![\p{L}])ổn định(?![\p{L}])/iu },
  { tu: 'hiệu quả', re: /hiệu quả/iu, coSo: true },
  { tu: 'khoảng <số>', re: /khoảng \d/iu, coNguon: true },
];

function kiemMoHo(bc, goc, dinhNghia) {
  for (const f of duyetBuoc(goc, ['.md'], ['node_modules', '.git', '0-dau-vao'])) {
    const rel = path.relative(goc, f);
    const nd = fs.readFileSync(f, 'utf8');
    const goc0 = nd.split(/\r?\n/); // dòng gốc: mã nguồn `PL:…` nằm trong dấu code, dongNoiDung đã bỏ
    const dong = dongNoiDung(nd);
    for (const [i, { so, chu }] of dong.entries()) {
      // Bỏ khối hướng dẫn, heading ("Đọc nhanh"), dòng tiêu đề bảng (dòng ngay trên dòng | --- |).
      if (/^\s*(>|#)/.test(chu) || /^\s*\|\s*-{3}/.test(dong[i + 1]?.chu ?? '')) continue;
      for (const m of MO_HO) {
        if (!m.re.test(chu) || dinhNghia.has(m.tu)) continue;
        // "linh hoạt" là tên đặc tính Flexibility của ISO/IEC 25010:2023 khi đứng trong danh sách đặc tính chất lượng.
        if (m.tu === 'linh hoạt' && /bảo trì|25010/i.test(chu)) continue;
        if (m.coSo && /\d|\[CẦN XÁC NHẬN/.test(goc0[so - 1])) continue;
        if (m.coNguon && /\[SRC:|PL:|\[CẦN XÁC NHẬN/.test(goc0[so - 1])) continue;
        bc.LOI(`${rel}:${so}: từ mơ hồ "${m.tu}" — thay bằng điều kiện, con số kiểm chứng được (hoặc định nghĩa ở glossary)`);
      }
    }
  }
}

export function kiemThuatNgu({ goc } = {}) {
  const bc = new BaoCao('THUẬT NGỮ — glossary.md ↔ tài liệu, prototype');
  const fGl = path.join(goc, 'du-an', 'glossary.md');
  if (!fs.existsSync(fGl)) { bc.CANH('không thấy du-an/glossary.md, bỏ qua'); kiemMoHo(bc, goc, new Set()); return bc; }
  const bang = bangMarkdown(fs.readFileSync(fGl, 'utf8'), ['Thuật ngữ', 'Định nghĩa']);
  if (!bang) { bc.LOI('glossary.md không có bảng với cột "Thuật ngữ", "Định nghĩa"'); return bc; }
  kiemMoHo(bc, goc, new Set(bang.hang.map((h) => (h['Thuật ngữ'] || '').trim().toLowerCase())));
  const cotCam = bang.cot.find((c) => c.toLowerCase().startsWith('không dùng'));
  const cotAnh = bang.cot.find((c) => c.toLowerCase().startsWith('từ tiếng anh'));
  const cam = [], anh = [];
  for (const h of bang.hang) {
    const chuan = h['Thuật ngữ'];
    if (!chuan) continue;
    for (const t of (h[cotCam] || '').split(/[;,]/).map((x) => x.trim()).filter((x) => x && x !== '—' && x !== '-')) {
      cam.push({ tu: t, chuan, re: regexTu(t) });
    }
    for (const t of (h[cotAnh] || '').split(/[;,]/).map((x) => x.trim()).filter((x) => x && x !== '—' && x !== '-')) {
      anh.push({ tu: t, chuan, re: regexTu(t) });
    }
  }
  bc.TIN(`${bang.hang.length} thuật ngữ, ${cam.length} từ cấm, ${anh.length} từ tiếng Anh`);
  if (!cam.length && !anh.length) return bc;

  for (const f of duyetBuoc(goc, ['.md'], ['node_modules', '.git', '0-dau-vao'])) {
    const rel = path.relative(goc, f);
    for (const { so, chu } of dongNoiDung(fs.readFileSync(f, 'utf8'))) {
      for (const c of cam) if (c.re.test(chu)) bc.LOI(`${rel}:${so}: dùng "${c.tu}" — thay bằng "${c.chuan}"`);
    }
  }
  for (const f of duyetFile(path.join(goc, '3-ba-detail', 'Prototype'), ['.html'])) {
    const rel = path.relative(goc, f);
    const chu = chuHienThi(fs.readFileSync(f, 'utf8'));
    for (const c of cam) if (c.re.test(chu)) bc.LOI(`${rel}: màn hiển thị "${c.tu}" — thay bằng "${c.chuan}"`);
    for (const c of anh) if (c.re.test(chu)) bc.CANH(`${rel}: chữ tiếng Anh "${c.tu}" trên màn — dùng "${c.chuan}"`);
  }
  return bc;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = thamSo(process.argv.slice(2));
  const goc = a.goc ? path.resolve(a.goc) : timGoc(process.cwd());
  process.exit(kiemThuatNgu({ goc }).in() ? 1 : 0);
}
