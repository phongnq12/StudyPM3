#!/usr/bin/env node
// Cổng máy bước 1 (/ba-init): kiểm danh mục đầu vào ở 1-ba-init/0-dau-vao/ so với tệp gốc trong 0-inputs/, ma trận
// UC presales × pháp lý, bản đồ quy trình dựng ngược, câu hỏi mở (cả mục 3 "Phát hiện") và trace.csv của dự án. Theo 1-ba-init/templates/
// (uc-presales.md, quy-trinh-presales.md, man-presales.md, phap-ly.md, uc-phap-ly.md, ban-do-quy-trinh/ban-do-quy-trinh.md),
// kit/templates/ho-so/open-questions.md
// và kit/standards/id-convention.md.
// Dùng: node kit/tools/ba-verify/dau-vao-check.mjs [--goc <repo>] [--chi uc|quy-trinh|man|phap-ly|uc-phap-ly|ban-do]
//   --chi: agent kiểm riêng file mình viết khi file của agent khác chưa có (bước 1 chạy bốn đợt). Ở chế độ này mã giữ
//          chỗ [ASM-T<n>], [Q-T<n>], [PH-T<n>] được chấp nhận và không kiểm trace.csv; chạy đủ (không --chi) thì mã giữ
//          chỗ là lỗi.
// Chưa có 1-ba-init/0-dau-vao/ → bỏ qua (chưa chạy /ba-init).
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { BaoCao, RE_MA_DIEU_KHOAN, SO_DU_AN, bangMarkdown, docCsv, duyetFile, oMau, tachDs, thamSo, timGoc } from './lib.mjs';
import { LA_SO_DO, docSoDo } from './doc-quy-trinh.mjs';

const D = '1-ba-init/0-dau-vao';
// Bản đồ quy trình: md, đặc tả và sơ đồ BPMN gom trong một thư mục con.
const BD = `${D}/ban-do-quy-trinh`;
// Mỗi cấp một thư mục con: cap-0/, cap-1/ (sơ đồ tổng), cap-2/QT-nn-<slug>/ (luồng UC từng QT).
const BD2 = `${BD}/cap-2`;
const day = path.dirname(fileURLToPath(import.meta.url));
// Mã giữ chỗ có hoặc không có ngoặc vuông: [Q-T1], "[CẦN XÁC NHẬN: Q-T301]", ghi chú "PH-T301" trong sơ đồ.
const RE_GIU_CHO = /(?<![\p{L}\d-])(?:ASM|Q|PH)-T\d+(?!\d)/gu;
const LOAI_PH = ['thiếu luồng', 'thiếu rule', 'thiếu actor', 'thiếu dữ liệu', 'thiếu trạng thái', 'thiếu màn',
  'màn không thuộc UC', 'UC không thuộc quy trình', 'điều khoản chưa có UC', 'trường thừa', 'trùng lặp', 'khác luật',
  'ngoài phạm vi', 'trình tự khác luồng màn'];
const LOAI_DK = ['thủ tục', 'thời hạn', 'thẩm quyền', 'biểu mẫu', 'điều kiện', 'đối tượng', 'chế tài'];
// Hướng BR: sáu loại rule của ba-rules method.md mục 1. Loại điều khoản luôn thành rule: điều kiện, thời hạn, thẩm quyền.
const HUONG_BR = ['ràng buộc', 'tính toán', 'suy diễn', 'phân quyền', 'thời hạn', 'kiểm liên trường'];
const DK_CAN_BR = ['điều kiện', 'thời hạn', 'thẩm quyền'];
// ảnh, pdf: chỉ khi presales không có tệp gốc và BA đồng ý (agent đọc ảnh, máy không đối chiếu được từng ô).
const DANG_QT = ['drawio', 'bpmn', 'docx', 'xlsx', 'pdf', 'ảnh'];
const LOAI_BUOC = ['bước', 'cổng', 'sự kiện'];
const QUAN_HE = ['thực hiện', 'ràng buộc', 'dữ liệu', 'đối tượng'];
const CACH_GHEP = ['presales', 'đối chiếu'];
const LY_DO_UC = ['nội bộ', 'tiện ích', 'quản trị hệ thống', 'chưa tìm thấy'];
const LY_DO_DK = ['áp dụng chung', 'ngoài phần mềm', 'chưa có UC'];
const OQ = '1-ba-init/open-questions.md';

const chuan = (s) => (s || '').replace(/<br\s*\/?>/gi, ' ').replace(/⏎/g, ' ').replace(/`/g, '').replace(/\s+/g, ' ').trim();
// Bỏ dấu `code` và thẻ giả định khỏi ô mã: "`2` [ASM-004]" → "2".
const boMa = (s) => (s || '').replace(/`/g, '').replace(/\[ASM-(?:\d+|T\d+)\]/g, '').trim();
const khongMa = (s) => ['—', '-', ''].includes(boMa(s));
const docTep = (goc, rel) => {
  const f = path.join(goc, rel);
  return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null;
};

// Bảng trong mục "<so>." của file; _dong là số dòng thật trong file (để báo lỗi đúng chỗ).
function bangMuc(text, so, cot) {
  const dong = text.split(/\r?\n/);
  const re = new RegExp(`^#{1,6}\\s+${so}\\.?\\s`);
  const bd = dong.findIndex((d) => re.test(d));
  if (bd < 0) return null;
  const cap = dong[bd].match(/^#+/)[0].length;
  let kt = dong.findIndex((d, i) => i > bd && /^#{1,6}\s/.test(d) && d.match(/^#+/)[0].length <= cap);
  if (kt < 0) kt = dong.length;
  const b = bangMarkdown(dong.slice(bd + 1, kt).join('\n'), cot);
  for (const h of b?.hang ?? []) h._dong += bd + 1;
  return b;
}

// Tách "[SRC: <tệp>, <sheet>, dòng <n>]".
function nguonDong(s) {
  const m = (s || '').match(/\[SRC:\s*([^,\]]+),\s*([^,\]]+),\s*dòng\s+(\d+)\s*\]/);
  return m ? { tep: path.normalize(m[1].trim()), sheet: m[2].trim(), dong: Number(m[3]) } : null;
}

// Đọc một sheet của tệp xlsx qua office.cjs: Map số dòng → mảng ô.
function docSheet(fXlsx, sheet) {
  const r = spawnSync(process.execPath, [path.join(day, 'office.cjs'), fXlsx], { encoding: 'utf8', maxBuffer: 1 << 28 });
  if (r.status !== 0 && !r.stdout) return null;
  const ra = new Map();
  let dung = false;
  for (const dong of r.stdout.split('\n')) {
    const h = dong.match(/^#{10} SHEET: (.*) #{10}$/);
    if (h) { dung = h[1].trim() === sheet; continue; }
    const m = dung && dong.match(/^r(\d+): (.*)$/);
    if (m) ra.set(Number(m[1]), m[2].split(/(?<!\\) \| /).map((x) => x.replace(/\\\|/g, '|')));
  }
  return ra;
}

// Mẫu chung của mã gốc đã có trong danh mục: chữ số thay bằng \d+ (vd 12 → ^\d+$, UC_PS_05 → ^UC_PS_\d+$).
function mauMa(ds) {
  const mau = new Set(ds.map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\d+/g, '\\d+')));
  return [...mau].map((x) => new RegExp(`^${x}$`));
}

function kiemUcPresales(bc, goc) {
  const ra = { ma: new Set(), dem: new Map() };
  const t = docTep(goc, `${D}/uc-presales.md`);
  if (t === null) { bc.LOI(`thiếu ${D}/uc-presales.md`); return ra; }
  const vt = bangMuc(t, 0, ['Tệp', 'Sheet', 'Cột mã']);
  const dm = bangMuc(t, 1, ['Mã gốc', 'Tên']);
  if (!dm) { bc.LOI('uc-presales.md: không có bảng mục 1 (cột "Mã gốc", "Tên")'); return ra; }
  const tenCot = dm.cot.find((k) => k.startsWith('Tên')) ?? 'Tên';
  const hang = dm.hang.filter((h) => !khongMa(h['Mã gốc']) || !oMau(h[tenCot]));
  for (const h of hang) {
    const m = boMa(h['Mã gốc']);
    if (khongMa(m)) continue;
    ra.dem.set(m, (ra.dem.get(m) ?? 0) + 1);
    ra.ma.add(m);
  }
  bc.TIN(`uc-presales.md: ${hang.length} UC presales`);
  if (!vt?.hang?.length) { bc.LOI('uc-presales.md: thiếu bảng mục 0 "Vị trí trong nguồn" — không đối chiếu được với tệp gốc'); return ra; }

  const daDoi = new Set();
  for (const v of vt.hang) {
    const tep = path.normalize((v['Tệp'] ?? '').replace(/`/g, '').trim());
    const sheet = (v['Sheet'] ?? '').trim();
    const cMa = Number(v['Cột mã']) - 1, cTen = Number(v['Cột tên']) - 1, dTieuDe = Number(v['Dòng tiêu đề']);
    if (!fs.existsSync(path.join(goc, tep))) { bc.LOI(`uc-presales.md:${v._dong}: không thấy tệp ${tep}`); continue; }
    if ([cMa, cTen, dTieuDe].some(Number.isNaN)) { bc.LOI(`uc-presales.md:${v._dong}: "Cột mã", "Cột tên", "Dòng tiêu đề" phải là số`); continue; }
    const sh = docSheet(path.join(goc, tep), sheet);
    if (!sh?.size) { bc.LOI(`uc-presales.md:${v._dong}: không đọc được sheet "${sheet}" của ${tep}`); continue; }
    const cuaTep = hang.filter((h) => {
      const n = nguonDong(h['Nguồn']);
      return n && n.tep === tep && n.sheet === sheet;
    });
    const dongDung = new Set();
    for (const h of cuaTep) {
      const n = nguonDong(h['Nguồn']);
      daDoi.add(h);
      const o = sh.get(n.dong);
      if (!o) { bc.LOI(`uc-presales.md:${h._dong}: ${tep} sheet ${sheet} không có dòng ${n.dong}`); continue; }
      dongDung.add(n.dong);
      const ma = boMa(h['Mã gốc']);
      if (chuan(o[cMa]) !== (khongMa(ma) ? '' : chuan(ma))) bc.LOI(`uc-presales.md:${h._dong}: mã "${ma}" khác tệp gốc dòng ${n.dong} ("${o[cMa] ?? ''}")`);
      if (chuan(o[cTen]) !== chuan(h[tenCot])) bc.LOI(`uc-presales.md:${h._dong}: tên khác nguyên văn tệp gốc dòng ${n.dong}`);
    }
    // Dòng sau dòng tiêu đề có mã cùng dạng với mã đã chép mà không có trong danh mục → bị sót.
    const mau = mauMa(cuaTep.map((h) => boMa(h['Mã gốc'])).filter((x) => !khongMa(x)));
    const sot = [];
    for (const [so, o] of sh) {
      if (so <= dTieuDe || dongDung.has(so)) continue;
      const m = chuan(o[cMa]);
      if (m && chuan(o[cTen]) && mau.some((re) => re.test(m))) sot.push(`dòng ${so} (${m})`);
    }
    if (!mau.length) bc.CANH(`uc-presales.md: chưa có UC nào của ${tep} sheet ${sheet}, không kiểm được dòng sót`);
    if (sot.length) bc.LOI(`uc-presales.md: ${sot.length} dòng UC trong ${tep} sheet ${sheet} chưa có trong danh mục: ${sot.slice(0, 15).join(', ')}${sot.length > 15 ? ', …' : ''}`);
  }
  for (const h of hang) {
    if (!nguonDong(h['Nguồn'])) bc.LOI(`uc-presales.md:${h._dong}: nguồn phải đúng dạng [SRC: <tệp>, <sheet>, dòng <n>]`);
    else if (!daDoi.has(h)) bc.LOI(`uc-presales.md:${h._dong}: tệp, sheet trong nguồn không có ở mục 0`);
  }
  return ra;
}

function kiemManPresales(bc, goc, maUc, ph, chi) {
  const fJson = path.join(goc, D, 'man-presales.json');
  const t = docTep(goc, `${D}/man-presales.md`);
  if (!fs.existsSync(fJson)) { bc.LOI(`thiếu ${D}/man-presales.json — chạy node kit/tools/ba-verify/quet-prototype.mjs`); return []; }
  if (t === null) { bc.LOI(`thiếu ${D}/man-presales.md`); return []; }
  const js = JSON.parse(fs.readFileSync(fJson, 'utf8'));
  const kieu = js.kieu ?? 'html';
  const viTri = (m) => m.vi_tri ?? m.file;
  const theoMa = new Map();
  for (const m of js.man) {
    if (theoMa.has(m.ma)) bc.LOI(`man-presales.json: mã ${m.ma} lặp (${viTri(theoMa.get(m.ma))}, ${viTri(m)}) — chạy lại quet-prototype.mjs`);
    theoMa.set(m.ma, m);
  }
  bc.TIN(`man-presales.json: ${kieu} (${js.duyet ?? js.nguon}), ${js.so_vi_tri ?? js.so_file} ${kieu === 'html' ? 'file HTML' : 'route'}, ${js.man.length} màn, đọc bằng ${js.doc_bang}`);

  if (kieu === 'html') {
    const dNguon = path.join(goc, js.nguon ?? '0-inputs/presales/prototype');
    for (const f of duyetFile(dNguon, ['.html', '.htm'], ['node_modules', '.git', 'dist', 'build', 'out', 'ma-nguon'])) {
      const rel = path.relative(dNguon, f).split(path.sep).join('/');
      if (!js.man.some((m) => viTri(m) === rel)) bc.LOI(`man-presales.json: file ${rel} chưa có màn nào — chạy lại quet-prototype.mjs`);
    }
  }
  for (const m of js.man) for (const d of m.di_toi ?? []) if (!theoMa.has(d)) bc.LOI(`man-presales.json: ${m.ma} đi tới ${d} không tồn tại`);
  for (const d of js.menu ?? []) if (!theoMa.has(d)) bc.LOI(`man-presales.json: menu trỏ ${d} không tồn tại`);
  if (js.vuot_gioi_han) bc.CANH(`quet-prototype dừng ở ${js.vuot_gioi_han} route (--toi-da): có thể còn route chưa duyệt`);

  const dm = bangMuc(t, 2, ['Mã màn', 'Vị trí']);
  // Mục 1: màn không thuộc UC kèm PH. Agent (--chi man) chỉ ghi được mã giữ chỗ [PH-T<n>] ở đây; chạy đủ thì PH phải là
  // mã thật có trong open-questions mục 3, hoặc phát hiện ở đó có Đối tượng là màn này.
  const muc2 = new Map((bangMuc(t, 1, ['Mã màn', 'PH'])?.hang ?? []).filter((h) => !oMau(h['Mã màn'])).map((h) => [h['Mã màn'].replace(/`/g, '').trim(), h]));
  const maPh = new Set(ph.map((p) => p['PH']));
  if (!dm) { bc.LOI('man-presales.md: không có bảng mục 2 (cột "Mã màn", "Vị trí")'); return js.man; }
  const trongMd = new Map(dm.hang.filter((h) => !oMau(h['Mã màn'])).map((h) => [h['Mã màn'].replace(/`/g, ''), h]));
  for (const m of js.man) {
    const h = trongMd.get(m.ma);
    if (!h) { bc.LOI(`man-presales.md: thiếu ${m.ma} (${viTri(m)}, ${m.cach_mo})`); continue; }
    if ((h['Vị trí'] ?? '').replace(/`/g, '').trim() !== viTri(m)) bc.LOI(`man-presales.md:${h._dong}: ${m.ma} ghi vị trí khác man-presales.json (${viTri(m)})`);
    if (!m.anh && oMau(h['Ghi chú'])) bc.LOI(`man-presales.md:${h._dong}: ${m.ma} không có ảnh mà cột "Ghi chú" không ghi lý do`);
    if (m.anh && !fs.existsSync(path.join(goc, m.anh))) bc.LOI(`man-presales.json: ảnh ${m.anh} của ${m.ma} không tồn tại`);
    const uc = boMa(h['UC presales']);
    if (khongMa(uc)) {
      const ghi = maTrongO(muc2.get(m.ma)?.['PH'], 'PH');
      const coPh = ph.some((p) => tachDs(boMa(p['Đối tượng'])).includes(m.ma))
        || ghi.some((x) => maPh.has(x) || (chi && /-T\d+$/.test(x)));
      if (!coPh) bc.LOI(`man-presales.md:${h._dong}: ${m.ma} không thuộc UC presales nào mà chưa có phát hiện (mục 1 ghi PH; ${OQ} mục 3)`);
      else if (!muc2.has(m.ma)) bc.LOI(`man-presales.md:${h._dong}: ${m.ma} không thuộc UC presales nào mà chưa có dòng ở mục 1`);
    } else {
      for (const x of tachDs(uc)) if (!maUc.has(x)) bc.LOI(`man-presales.md:${h._dong}: ${m.ma} gắn UC presales "${x}" không có trong uc-presales.md`);
    }
  }
  for (const [ma, h] of trongMd) if (!theoMa.has(ma)) bc.LOI(`man-presales.md:${h._dong}: ${ma} không có trong man-presales.json`);

  // Route có trong mã nguồn mà không mở được, route chỉ có ở một trong hai nguồn (dist, link): ghi ở mục 3.
  const loi3 = (bangMuc(t, 3, ['Vị trí', 'Lỗi'])?.hang ?? []).map((h) => (h['Vị trí'] ?? '').replace(/`/g, '').trim());
  for (const r of js.route_chua_mo ?? []) {
    if (!loi3.includes(r)) bc.LOI(`man-presales.md mục 3: thiếu route ${r} (khai báo trong mã nguồn, không mở được khi duyệt)`);
  }
  for (const x of js.lech_nguon ?? []) {
    if (!loi3.includes(x.route)) bc.LOI(`man-presales.md mục 3: thiếu route ${x.route} (chỉ có ở ${x.chi_co_o}, dist và link lệch nhau)`);
  }
  const tinh = js.man.filter((m) => m.doc_bang === 'tinh').length;
  if (tinh) bc.CANH(`${tinh}/${js.man.length} màn đọc tĩnh (không có ảnh, có thể sót màn sinh bằng JS)`);
  return js.man;
}

function kiemPhapLy(bc, goc) {
  const ra = new Map(); // mã điều khoản → { vb, loai, tomTat }
  const t = docTep(goc, `${D}/phap-ly.md`);
  if (t === null) { bc.LOI(`thiếu ${D}/phap-ly.md`); return ra; }
  const vb = bangMuc(t, 1, ['Văn bản', 'Số hiệu']);
  const dk = bangMuc(t, 2, ['Mã điều khoản', 'Văn bản']);
  if (!vb) bc.LOI('phap-ly.md: không có bảng mục 1 (cột "Văn bản", "Số hiệu")');
  if (!dk) { bc.LOI('phap-ly.md: không có bảng mục 2 (cột "Mã điều khoản")'); return ra; }
  const hangVb = (vb?.hang ?? []).filter((h) => !oMau(h['Văn bản']));
  const dsVb = new Set(hangVb.map((h) => chuan(h['Văn bản'])));
  const hang = dk.hang.filter((h) => !oMau(h['Mã điều khoản']));
  bc.TIN(`phap-ly.md: ${dsVb.size} văn bản, ${hang.length} điều khoản`);
  for (const c of ['Chủ thể', 'Hành vi', 'Đối tượng', 'Hướng BR']) {
    if (!dk.cot.includes(c)) bc.LOI(`phap-ly.md mục 2: thiếu cột "${c}" (1-ba-init/templates/phap-ly.md)`);
  }
  for (const h of hang) {
    const ma = h['Mã điều khoản'].replace(/`/g, '').trim();
    if (!RE_MA_DIEU_KHOAN.test(ma)) bc.LOI(`phap-ly.md:${h._dong}: mã "${ma}" sai định dạng (kit/standards/id-convention.md mục "Mã điều khoản pháp luật")`);
    if (ra.has(ma)) bc.LOI(`phap-ly.md: mã ${ma} lặp ở dòng ${ra.get(ma)._dong} và ${h._dong}`);
    if (!dsVb.has(chuan(h['Văn bản']))) bc.LOI(`phap-ly.md:${h._dong}: văn bản "${h['Văn bản']}" không có ở mục 1`);
    const loai = (h['Loại'] ?? '').replace(/\(.*\)/, '').trim().toLowerCase();
    if (!LOAI_DK.includes(loai)) bc.LOI(`phap-ly.md:${h._dong}: loại "${h['Loại']}" không thuộc ${LOAI_DK.join(' / ')}`);
    if (dk.cot.includes('Hướng BR')) {
      const huong = (h['Hướng BR'] ?? '').trim();
      if (!oMau(huong) && !HUONG_BR.includes(huong)) bc.LOI(`phap-ly.md:${h._dong}: hướng BR "${huong}" không thuộc ${HUONG_BR.join(' / ')} hoặc "—"`);
      if (oMau(huong) && DK_CAN_BR.includes(loai)) bc.LOI(`phap-ly.md:${h._dong}: ${ma} loại ${loai} phải có hướng BR (bước 9 dựng rule từ điều khoản này)`);
    }
    const src = (h['Nguồn'] ?? '').match(/\[SRC:\s*([^,\]]+)/);
    if (!src) bc.LOI(`phap-ly.md:${h._dong}: thiếu [SRC: <tệp>, <vị trí>]`);
    else if (!fs.existsSync(path.join(goc, src[1].trim()))) bc.LOI(`phap-ly.md:${h._dong}: tệp nguồn ${src[1].trim()} không tồn tại`);
    ra.set(ma, { _dong: h._dong, vb: chuan(h['Văn bản']), loai, tomTat: h['Tóm tắt'] ?? '' });
  }
  // Số điều khoản lấy của từng văn bản phải khớp mục 2.
  if (vb?.cot.includes('Số điều khoản lấy')) {
    for (const h of hangVb) {
      const dem = [...ra.values()].filter((x) => x.vb === chuan(h['Văn bản'])).length;
      const ghi = (h['Số điều khoản lấy'] ?? '').trim();
      if (ghi !== String(dem)) bc.LOI(`phap-ly.md:${h._dong}: "${h['Văn bản']}" ghi số điều khoản lấy "${ghi}", mục 2 có ${dem}`);
    }
  } else if (vb) bc.LOI('phap-ly.md mục 1: thiếu cột "Số điều khoản lấy"');
  return ra;
}

// Mã câu hỏi, phát hiện trong ô: mã thật (Q-001) hoặc mã giữ chỗ khi agent chạy --chi ([Q-T1]).
const maTrongO = (s, tt) => [...(s ?? '').matchAll(new RegExp(`\\[?(${tt}-(?:T)?\\d+)\\]?`, 'g'))].map((m) => m[1]);
function kiemMaSo(bc, noi, s, tt, coThat, chi) {
  const ds = maTrongO(s, tt);
  if (!ds.length) { bc.LOI(`${noi}: thiếu ${tt}-xxx`); return; }
  for (const m of ds) {
    if (/-T\d+$/.test(m)) continue; // mã giữ chỗ: kiemGiuCho bắt khi chạy đủ
    if (!chi && !coThat.has(m)) bc.LOI(`${noi}: ${m} không có trong ${OQ}`);
  }
}

// Tách "[SRC: <tệp>, trang <tên>, ô <id>]" (drawio) hoặc "[SRC: <tệp>, ô <id>]" (bpmn).
function nguonO(s) {
  const m = (s || '').match(/\[SRC:\s*([^,\]]+?)\s*(?:,\s*trang\s+([^,\]]+?))?\s*,\s*ô\s+([^\]\s]+)\s*\]/);
  return m ? { tep: path.normalize(m[1].trim()), trang: m[2]?.trim() ?? null, o: m[3] } : null;
}
const maQp = (s) => [...(s ?? '').matchAll(/QP-\d{2}(?:\.\d{2})?/g)].map((m) => m[0]);

function kiemQuyTrinh(bc, goc, maUc, ph, chi) {
  const ra = { qp: [], buoc: new Set() };
  const t = docTep(goc, `${D}/quy-trinh-presales.md`);
  if (t === null) { bc.LOI(`thiếu ${D}/quy-trinh-presales.md`); return ra; }
  // Presales không có quy trình, BA quyết bỏ qua: file ghi "bỏ qua theo [Q-xxx]". Hợp lệ khi Q đã quyết và thư mục
  // quy trình đầu vào vẫn trống; khi đó không kiểm các mục còn lại (không có QP, không liệt kê UC ở mục 4).
  const qBoQua = t.match(/bỏ qua theo \[(Q-\d{3})\]/)?.[1];
  if (qBoQua) {
    const hq = SO_DU_AN.flatMap((f) => bangMarkdown(docTep(goc, f) ?? '', ['Q', 'Câu hỏi'])?.hang ?? []).find((h) => h['Q'] === qBoQua);
    const dQt = path.join(goc, '0-inputs/presales/quy-trinh');
    const coTep = fs.existsSync(dQt) && fs.readdirSync(dQt).some((f) => !f.startsWith('.'));
    if ((hq?.['Trạng thái'] ?? '').trim() !== 'đã quyết') bc.LOI(`quy-trinh-presales.md: bỏ qua theo ${qBoQua} mà câu hỏi chưa "đã quyết"`);
    else if (coTep) bc.LOI(`quy-trinh-presales.md: bỏ qua theo ${qBoQua} mà 0-inputs/presales/quy-trinh/ đã có tệp — chạy /ba-init --bo-sung`);
    else bc.TIN(`quy-trinh-presales.md: bỏ qua theo ${qBoQua} (đã quyết), presales không có quy trình`);
    return ra;
  }
  const vt = bangMuc(t, 0, ['Tệp', 'Dạng']);
  const qt = bangMuc(t, 1, ['Mã', 'Tên']);
  const bu = bangMuc(t, 2, ['Mã bước', 'Tên']);
  const boQua = (bangMuc(t, 3, ['Tệp', 'Ô'])?.hang ?? []).filter((h) => !oMau(h['Ô']));
  if (!vt?.hang?.length) bc.LOI('quy-trinh-presales.md: thiếu bảng mục 0 "Vị trí trong nguồn"');
  if (!qt) { bc.LOI('quy-trinh-presales.md: không có bảng mục 1 (cột "Mã", "Tên")'); return ra; }
  if (!bu) { bc.LOI('quy-trinh-presales.md: không có bảng mục 2 (cột "Mã bước", "Tên")'); return ra; }

  const hangQt = qt.hang.filter((h) => !oMau(h['Mã']));
  const hangBu = bu.hang.filter((h) => !oMau(h['Mã bước']));
  const dsQp = new Map();
  for (const h of hangQt) {
    const ma = h['Mã'].replace(/`/g, '').trim();
    if (!/^QP-\d{2}$/.test(ma)) bc.LOI(`quy-trinh-presales.md:${h._dong}: mã "${ma}" sai định dạng QP-xx`);
    if (dsQp.has(ma)) bc.LOI(`quy-trinh-presales.md: ${ma} lặp`);
    dsQp.set(ma, h);
    if (!['tổng', 'chi tiết'].includes((h['Cấp'] ?? '').trim())) bc.LOI(`quy-trinh-presales.md:${h._dong}: cấp "${h['Cấp']}" phải là tổng / chi tiết`);
    if (!/\[SRC:/.test(h['Nguồn'] ?? '')) bc.LOI(`quy-trinh-presales.md:${h._dong}: ${ma} thiếu [SRC: …]`);
  }
  const dsBuoc = new Map();
  for (const h of hangBu) {
    const ma = h['Mã bước'].replace(/`/g, '').trim();
    if (!/^QP-\d{2}\.\d{2}$/.test(ma)) bc.LOI(`quy-trinh-presales.md:${h._dong}: mã bước "${ma}" sai định dạng QP-xx.yy`);
    else if (!dsQp.has(ma.slice(0, 5))) bc.LOI(`quy-trinh-presales.md:${h._dong}: ${ma} thuộc ${ma.slice(0, 5)} không có ở mục 1`);
    if (dsBuoc.has(ma)) bc.LOI(`quy-trinh-presales.md: ${ma} lặp`);
    dsBuoc.set(ma, h);
    if (!LOAI_BUOC.includes((h['Loại'] ?? '').trim())) bc.LOI(`quy-trinh-presales.md:${h._dong}: loại "${h['Loại']}" phải là ${LOAI_BUOC.join(' / ')}`);
    for (const x of tachDs(boMa(h['UC presales (theo nguồn)'] ?? h['UC presales'] ?? ''))) {
      if (!khongMa(x) && !maUc.has(x)) bc.LOI(`quy-trinh-presales.md:${h._dong}: ${ma} gắn UC presales "${x}" không có trong uc-presales.md`);
    }
    if (!/\[SRC:/.test(h['Nguồn'] ?? '')) bc.LOI(`quy-trinh-presales.md:${h._dong}: ${ma} thiếu [SRC: …]`);
  }
  for (const [ma, h] of dsBuoc) {
    for (const x of maQp(h['Đi tới'])) if (!dsBuoc.has(x) && !dsQp.has(x)) bc.LOI(`quy-trinh-presales.md:${h._dong}: ${ma} đi tới ${x} không có`);
  }
  for (const [ma, h] of dsQp) {
    for (const x of maQp(h['Mở rộng từ'])) if (!dsBuoc.has(x)) bc.LOI(`quy-trinh-presales.md:${h._dong}: ${ma} mở rộng từ ${x} không có ở mục 2`);
  }
  bc.TIN(`quy-trinh-presales.md: ${dsQp.size} quy trình (${hangQt.filter((h) => (h['Cấp'] ?? '').trim() === 'tổng').length} tổng), ${dsBuoc.size} bước`);

  // Đối chiếu với sơ đồ drawio, bpmn: mỗi ô bước, cổng có nhãn phải ở mục 2 hoặc mục 3; tên nguyên văn; mũi tên đủ.
  for (const v of vt?.hang ?? []) {
    const tep = path.normalize((v['Tệp'] ?? '').replace(/`/g, '').trim());
    const dang = (v['Dạng'] ?? '').trim();
    if (!DANG_QT.includes(dang)) bc.LOI(`quy-trinh-presales.md:${v._dong}: dạng "${dang}" phải là ${DANG_QT.join(' / ')}`);
    if (!fs.existsSync(path.join(goc, tep))) { bc.LOI(`quy-trinh-presales.md:${v._dong}: không thấy tệp ${tep}`); continue; }
    if (['pdf', 'ảnh'].includes(dang)) bc.CANH(`quy-trinh-presales.md: ${tep} là ${dang} — máy không đối chiếu được bước với sơ đồ; nên xin presales tệp gốc (drawio, bpmn)`);
  }
  const tepSoDo = [...new Set((vt?.hang ?? []).map((v) => path.normalize((v['Tệp'] ?? '').replace(/`/g, '').trim())))]
    .filter((f) => LA_SO_DO(f) && fs.existsSync(path.join(goc, f)));
  for (const tep of tepSoDo) {
    let sd;
    try { sd = docSoDo(path.join(goc, tep)); } catch (e) { bc.LOI(`quy-trinh-presales.md: không đọc được ${tep}: ${e.message}`); continue; }
    const trangMuc0 = new Set((vt.hang).filter((v) => path.normalize((v['Tệp'] ?? '').replace(/`/g, '').trim()) === tep)
      .map((v) => (v['Trang, sheet, mục'] ?? '').trim()));
    const cuaTep = [...dsBuoc].map(([ma, h]) => ({ ma, h, n: nguonO(h['Nguồn']) })).filter((x) => x.n?.tep === tep);
    const boQuaTep = boQua.filter((h) => path.normalize((h['Tệp'] ?? '').replace(/`/g, '').trim()) === tep);
    for (const tr of sd.trang) {
      if (sd.dang === 'drawio' && !trangMuc0.has(tr.ten)) bc.LOI(`quy-trinh-presales.md mục 0: thiếu trang "${tr.ten}" của ${tep}`);
      const khopTrang = (n) => sd.dang === 'bpmn' || n === tr.ten;
      const theoO = new Map(tr.o.map((o) => [o.id, o]));
      const daGhi = new Map(); // id ô → mã bước
      for (const x of cuaTep.filter((x) => khopTrang(x.n.trang))) {
        const o = theoO.get(x.n.o);
        if (!o) { if (sd.dang === 'drawio') bc.LOI(`quy-trinh-presales.md:${x.h._dong}: ${x.ma} trỏ ô ${x.n.o} không có ở trang "${tr.ten}" của ${tep}`); continue; }
        daGhi.set(o.id, x.ma);
        if (chuan(o.nhan) !== chuan(x.h['Tên (nguyên văn)'] ?? x.h['Tên'])) bc.LOI(`quy-trinh-presales.md:${x.h._dong}: ${x.ma} tên khác nguyên văn ô ${o.id} ("${o.nhan}")`);
      }
      const boQuaTr = new Set(boQuaTep.filter((h) => sd.dang === 'bpmn' || (h['Trang'] ?? '').trim() === tr.ten).map((h) => h['Ô'].replace(/`/g, '').trim()));
      const sot = tr.o.filter((o) => ['bước', 'cổng'].includes(o.loai) && o.nhan && !daGhi.has(o.id) && !boQuaTr.has(o.id));
      if (sot.length) bc.LOI(`quy-trinh-presales.md: ${sot.length} ô bước, cổng của ${tep}${sd.dang === 'drawio' ? ` trang "${tr.ten}"` : ''} chưa có ở mục 2 hoặc mục 3: ${sot.slice(0, 10).map((o) => `${o.id} "${o.nhan}"`).join(', ')}${sot.length > 10 ? ', …' : ''}`);
      for (const id of boQuaTr) if (!theoO.has(id) && sd.dang === 'drawio') bc.LOI(`quy-trinh-presales.md mục 3: ô ${id} không có ở trang "${tr.ten}" của ${tep}`);
      // Mũi tên: từ một ô đã ghi, đi qua các ô chưa ghi (sự kiện không nhãn…) tới ô đã ghi kế tiếp.
      const ra2 = new Map();
      for (const e of tr.noi) { if (!ra2.has(e.tu)) ra2.set(e.tu, []); ra2.get(e.tu).push(e.toi); }
      for (const [id, ma] of daGhi) {
        const can = new Set();
        const da = new Set([id]);
        const hang = [...(ra2.get(id) ?? [])];
        while (hang.length) {
          const x = hang.shift();
          if (da.has(x)) continue;
          da.add(x);
          if (daGhi.has(x)) can.add(daGhi.get(x));
          else hang.push(...(ra2.get(x) ?? []));
        }
        const ghi = new Set(maQp(dsBuoc.get(ma)['Đi tới']));
        const thieu = [...can].filter((x) => !ghi.has(x));
        if (thieu.length) bc.LOI(`quy-trinh-presales.md:${dsBuoc.get(ma)._dong}: ${ma} thiếu "Đi tới" ${thieu.join(', ')} (theo mũi tên trong ${tep})`);
      }
    }
  }

  // UC presales không bước nào gắn → mục 4, kèm PH.
  const coGan = new Set([...dsBuoc.values()].flatMap((h) => tachDs(boMa(h['UC presales (theo nguồn)'] ?? h['UC presales'] ?? ''))));
  const muc4 = new Map(((bangMuc(t, 4, ['Mã gốc'])?.hang) ?? []).filter((h) => !khongMa(h['Mã gốc'])).map((h) => [boMa(h['Mã gốc']), h]));
  for (const u of maUc) {
    if (coGan.has(u)) continue;
    const h = muc4.get(u);
    if (!h) { bc.LOI(`quy-trinh-presales.md mục 4: thiếu UC presales ${u} (không bước nào gắn)`); continue; }
    kiemMaSo(bc, `quy-trinh-presales.md:${h._dong}`, h['PH'], 'PH', ph, chi);
  }
  for (const [u, h] of muc4) if (coGan.has(u)) bc.LOI(`quy-trinh-presales.md:${h._dong}: UC presales ${u} đã có bước gắn, không thuộc mục 4`);
  ra.qp = [...dsQp.keys()];
  ra.buoc = new Set(dsBuoc.keys());
  return ra;
}

// Ma trận UC presales × điều khoản: mỗi UC có căn cứ hoặc lý do; mỗi điều khoản có UC hoặc lý do.
function kiemUcPhapLy(bc, goc, maUc, dk, ph, q, chi) {
  const t = docTep(goc, `${D}/uc-phap-ly.md`);
  if (t === null) { bc.LOI(`thiếu ${D}/uc-phap-ly.md`); return; }
  const mt = bangMuc(t, 1, ['Văn bản', 'Mã điều khoản', 'UC presales']);
  if (!mt) { bc.LOI('uc-phap-ly.md: không có bảng mục 1 (cột "Văn bản", "Mã điều khoản", "UC presales")'); return; }
  const coCanCu = new Set();
  const coUc = new Set();
  const hang = mt.hang.filter((h) => !oMau(h['Mã điều khoản']));
  for (const h of hang) {
    const ma = h['Mã điều khoản'].replace(/`/g, '').trim();
    const d = dk.get(ma);
    if (!d) bc.LOI(`uc-phap-ly.md:${h._dong}: điều khoản ${ma} không có trong phap-ly.md`);
    else if (d.vb !== chuan(h['Văn bản'])) bc.LOI(`uc-phap-ly.md:${h._dong}: ${ma} thuộc "${d.vb}", không phải "${h['Văn bản']}"`);
    const uc = tachDs(boMa(h['UC presales']));
    if (!uc.length) bc.LOI(`uc-phap-ly.md:${h._dong}: ${ma} thiếu UC presales (điều khoản chưa có UC ghi ở mục 3)`);
    for (const u of uc) {
      if (!maUc.has(u)) bc.LOI(`uc-phap-ly.md:${h._dong}: UC presales "${u}" không có trong uc-presales.md`);
      coCanCu.add(u);
    }
    coUc.add(ma);
    if (!QUAN_HE.includes((h['Quan hệ'] ?? '').trim())) bc.LOI(`uc-phap-ly.md:${h._dong}: quan hệ "${h['Quan hệ']}" phải là ${QUAN_HE.join(' / ')}`);
    if (oMau(h['Ghép vì'])) bc.LOI(`uc-phap-ly.md:${h._dong}: ${ma} thiếu "Ghép vì"`);
    if (!CACH_GHEP.includes((h['Cách ghép'] ?? '').trim())) bc.LOI(`uc-phap-ly.md:${h._dong}: cách ghép "${h['Cách ghép']}" phải là ${CACH_GHEP.join(' / ')}`);
  }
  const m2 = (bangMuc(t, 2, ['Mã gốc', 'Lý do'])?.hang ?? []).filter((h) => !khongMa(h['Mã gốc']));
  const khongCanCu = new Set();
  for (const h of m2) {
    const u = boMa(h['Mã gốc']);
    khongCanCu.add(u);
    if (!maUc.has(u)) bc.LOI(`uc-phap-ly.md:${h._dong}: UC presales "${u}" không có trong uc-presales.md`);
    if (coCanCu.has(u)) bc.LOI(`uc-phap-ly.md:${h._dong}: UC presales ${u} đã có căn cứ ở mục 1, không thuộc mục 2`);
    const ld = (h['Lý do'] ?? '').trim();
    if (!LY_DO_UC.includes(ld)) bc.LOI(`uc-phap-ly.md:${h._dong}: lý do "${ld}" phải là ${LY_DO_UC.join(' / ')}`);
    if (ld === 'chưa tìm thấy') kiemMaSo(bc, `uc-phap-ly.md:${h._dong}`, h['Q / PH'], 'Q', q, chi);
  }
  for (const u of maUc) if (!coCanCu.has(u) && !khongCanCu.has(u)) bc.LOI(`uc-phap-ly.md: UC presales ${u} chưa có căn cứ pháp lý ở mục 1, cũng không có lý do ở mục 2`);
  const m3 = (bangMuc(t, 3, ['Mã điều khoản', 'Lý do'])?.hang ?? []).filter((h) => !oMau(h['Mã điều khoản']));
  const khongUc = new Set();
  for (const h of m3) {
    const ma = h['Mã điều khoản'].replace(/`/g, '').trim();
    khongUc.add(ma);
    if (!dk.has(ma)) bc.LOI(`uc-phap-ly.md:${h._dong}: điều khoản ${ma} không có trong phap-ly.md`);
    if (coUc.has(ma)) bc.LOI(`uc-phap-ly.md:${h._dong}: ${ma} đã có UC ở mục 1, không thuộc mục 3`);
    const ld = (h['Lý do'] ?? '').trim();
    if (!LY_DO_DK.includes(ld)) bc.LOI(`uc-phap-ly.md:${h._dong}: lý do "${ld}" phải là ${LY_DO_DK.join(' / ')}`);
    if (ld === 'chưa có UC') kiemMaSo(bc, `uc-phap-ly.md:${h._dong}`, h['PH'], 'PH', ph, chi);
  }
  for (const ma of dk.keys()) if (!coUc.has(ma) && !khongUc.has(ma)) bc.LOI(`uc-phap-ly.md: điều khoản ${ma} chưa có UC ở mục 1, cũng không có lý do ở mục 3`);
  bc.TIN(`uc-phap-ly.md: ${coCanCu.size}/${maUc.size} UC presales có căn cứ pháp lý, ${coUc.size}/${dk.size} điều khoản có UC`);
}

// Bản đồ quy trình dựng ngược (method.md mục 7): QT có căn cứ, mục 2 khớp mục 1, chỗ nối hở có PH, đối chiếu hai chiều
// UC presales ↔ QT, chuyển giao trỏ QT có thật, có sơ đồ. Lint BPMN do check-all chạy.
const CHO_NOI = ['khớp', 'khoảng trống'];
const LY_DO_KHONG_QT = ['tra cứu, báo cáo', 'danh mục', 'quản trị hệ thống', 'chưa rõ'];
const maQt = (s) => [...(s ?? '').matchAll(/QT-\d{2}/g)].map((m) => m[0]);

function kiemBanDo(bc, goc, maUc, dk, ph, q, chi) {
  const ra = { qt: [] };
  const t = docTep(goc, `${BD}/ban-do-quy-trinh.md`);
  if (t === null) { bc.LOI(`thiếu ${BD}/ban-do-quy-trinh.md (đợt 4 /ba-init; dự án đã chạy bước 1 thì /ba-init --bo-sung)`); return ra; }
  const ds = bangMuc(t, 1, ['Mã', 'Tên', 'Trigger']);
  if (!ds) { bc.LOI('ban-do-quy-trinh.md: không có bảng mục 1 (cột "Mã", "Tên", "Trigger")'); return ra; }
  const dsQt = new Map();
  for (const h of ds.hang.filter((x) => !oMau(x['Mã']))) {
    const ma = h['Mã'].replace(/`/g, '').trim();
    if (!/^QT-\d{2}$/.test(ma)) bc.LOI(`ban-do-quy-trinh.md:${h._dong}: mã "${ma}" sai định dạng QT-nn`);
    if (dsQt.has(ma)) bc.LOI(`ban-do-quy-trinh.md: ${ma} lặp`);
    for (const c of ['Tên', 'Trigger', 'Kết quả']) if (oMau(h[c])) bc.LOI(`ban-do-quy-trinh.md:${h._dong}: ${ma} thiếu "${c}"`);
    const uc = tachDs(boMa(h['UC presales'])).filter((x) => !khongMa(x));
    const dieu = tachDs(boMa(h['Điều khoản'])).filter((x) => !khongMa(x));
    for (const u of uc) if (!maUc.has(u)) bc.LOI(`ban-do-quy-trinh.md:${h._dong}: ${ma} gắn UC presales "${u}" không có trong uc-presales.md`);
    for (const d of dieu) if (!dk.has(d)) bc.LOI(`ban-do-quy-trinh.md:${h._dong}: ${ma} dẫn điều khoản ${d} không có trong phap-ly.md`);
    if (!uc.length && !dieu.length) bc.LOI(`ban-do-quy-trinh.md:${h._dong}: ${ma} không có căn cứ (cần ít nhất một UC presales hoặc điều khoản)`);
    if (!/\[SRC:/.test(h['Nguồn'] ?? '')) bc.LOI(`ban-do-quy-trinh.md:${h._dong}: ${ma} thiếu [SRC: …]`);
    dsQt.set(ma, { _dong: h._dong, uc: new Set(uc) });
  }

  // Mục 2 là chỉ mục: mỗi QT một thư mục con QT-nn-<slug>/ chứa QT-nn.md (template ban-do-quy-trinh-qt.md) và sơ đồ.
  // Luồng UC (mục 2 của file QT) đúng các UC của QT ở mục 1; chỗ nối hợp lệ; mỗi khoảng trống có PH và dòng mục 3.
  const chiMuc = new Map((bangMuc(t, 2, ['QT', 'Thư mục'])?.hang ?? []).filter((h) => !oMau(h['QT']))
    .map((h) => [h['QT'].replace(/`/g, '').trim(), h]));
  let ho = 0;
  for (const [ma, x] of dsQt) {
    const hm = chiMuc.get(ma);
    const thuMuc = fs.existsSync(path.join(goc, BD2)) ? fs.readdirSync(path.join(goc, BD2)).find((f) => f.startsWith(`${ma}-`) && fs.statSync(path.join(goc, BD2, f)).isDirectory()) : undefined;
    if (!hm) bc.LOI(`ban-do-quy-trinh.md mục 2: thiếu dòng chỉ mục cho ${ma}`);
    if (!thuMuc) { bc.LOI(`ban-do-quy-trinh.md: ${ma} chưa có thư mục ${BD2}/${ma}-<slug>/`); continue; }
    if (hm && !(hm['Thư mục'] ?? '').includes(`${thuMuc}/`)) bc.LOI(`ban-do-quy-trinh.md:${hm._dong}: cột "Thư mục" của ${ma} không trỏ ${thuMuc}/`);
    const rel = `${BD2}/${thuMuc}/${ma}.md`;
    const tq = docTep(goc, rel);
    if (tq === null) { bc.LOI(`thiếu ${rel}`); continue; }
    if (!(bangMuc(tq, 1, ['Mã', 'Tên'])?.hang ?? []).some((h) => h['Mã'].replace(/`/g, '').trim() === ma)) bc.LOI(`${rel} mục 1: không có dòng ${ma}`);
    const ghep = (bangMuc(tq, 2, ['QT', 'Thứ tự', 'UC presales'])?.hang ?? []).filter((h) => !oMau(h['QT']));
    const m2 = new Set();
    const phHo = new Set();
    for (const h of ghep) {
      const u = boMa(h['UC presales']);
      if (h['QT'].replace(/`/g, '').trim() !== ma) bc.LOI(`${rel}:${h._dong}: dòng của ${h['QT']}, file chỉ chứa ${ma}`);
      if (!maUc.has(u)) bc.LOI(`${rel}:${h._dong}: UC presales "${u}" không có trong uc-presales.md`);
      m2.add(u);
      const cn = (h['Chỗ nối'] ?? '').trim();
      if (!CHO_NOI.includes(cn)) bc.LOI(`${rel}:${h._dong}: chỗ nối "${cn}" phải là ${CHO_NOI.join(' / ')}`);
      if (cn === 'khoảng trống') {
        ho++;
        kiemMaSo(bc, `${rel}:${h._dong}`, h['PH'], 'PH', ph, chi);
        maTrongO(h['PH'], 'PH').forEach((m) => phHo.add(m));
      }
    }
    for (const u of x.uc) if (!m2.has(u)) bc.LOI(`${rel}: ${ma} có UC presales ${u} ở mục 1 file tổng mà không có dòng ở mục 2`);
    for (const u of m2) if (!x.uc.has(u)) bc.LOI(`${rel} mục 2: UC presales ${u} không có ở dòng ${ma} mục 1 file tổng`);
    const m3 = new Set((bangMuc(tq, 3, ['PH', 'Giữa'])?.hang ?? []).filter((h) => !oMau(h['PH'])).flatMap((h) => maTrongO(h['PH'], 'PH')));
    for (const p of phHo) if (!m3.has(p)) bc.LOI(`${rel} mục 3: thiếu dòng cho ${p} (chỗ nối khoảng trống ở mục 2)`);
    if (hm && (hm['Số UC'] ?? '').trim() !== String(m2.size)) bc.LOI(`ban-do-quy-trinh.md:${hm._dong}: ${ma} ghi số UC "${hm['Số UC']}", file QT có ${m2.size}`);
    if (x.uc.size && !fs.existsSync(path.join(goc, BD2, thuMuc, `${ma}.drawio.svg`))) bc.LOI(`${BD2}/${thuMuc}: chưa có sơ đồ ${ma}.drawio.svg (skill ba-bpmn)`);
  }
  for (const [ma, h] of chiMuc) if (!dsQt.has(ma)) bc.LOI(`ban-do-quy-trinh.md:${h._dong}: ${ma} không có ở mục 1`);

  // Mục 3, 4: chuyển giao, hệ thống ngoài trỏ QT có thật.
  for (const [so, cot] of [[3, ['Từ QT', 'Đến QT']], [4, ['Tên', 'QT liên quan']]]) {
    for (const h of (bangMuc(t, so, cot)?.hang ?? []).filter((x) => !oMau(x[cot[0]]))) {
      for (const c of cot.filter((x) => x.includes('QT'))) {
        for (const m of maQt(h[c])) if (!dsQt.has(m)) bc.LOI(`ban-do-quy-trinh.md:${h._dong}: ${m} không có ở mục 1`);
      }
    }
  }

  // Mục 6: đối chiếu hai chiều.
  const coQt = new Set([...dsQt.values()].flatMap((x) => [...x.uc]));
  const m61 = new Map((bangMuc(t, '6\\.1', ['Mã gốc', 'Lý do'])?.hang ?? []).filter((h) => !khongMa(h['Mã gốc'])).map((h) => [boMa(h['Mã gốc']), h]));
  for (const [u, h] of m61) {
    if (!maUc.has(u)) bc.LOI(`ban-do-quy-trinh.md:${h._dong}: UC presales "${u}" không có trong uc-presales.md`);
    if (coQt.has(u)) bc.LOI(`ban-do-quy-trinh.md:${h._dong}: UC presales ${u} đã thuộc QT ở mục 1, không thuộc mục 6.1`);
    const ld = (h['Lý do'] ?? '').trim();
    if (!LY_DO_KHONG_QT.includes(ld)) bc.LOI(`ban-do-quy-trinh.md:${h._dong}: lý do "${ld}" phải là ${LY_DO_KHONG_QT.join(' / ')}`);
    if (ld === 'chưa rõ') kiemMaSo(bc, `ban-do-quy-trinh.md:${h._dong}`, h['Q / PH'], 'Q', q, chi);
  }
  for (const u of maUc) if (!coQt.has(u) && !m61.has(u)) bc.LOI(`ban-do-quy-trinh.md: UC presales ${u} không thuộc QT nào, cũng không có ở mục 6.1`);
  const m62 = new Map((bangMuc(t, '6\\.2', ['QT', 'Căn cứ'])?.hang ?? []).filter((h) => !oMau(h['QT'])).map((h) => [h['QT'].replace(/`/g, '').trim(), h]));
  for (const [ma, x] of dsQt) {
    if (x.uc.size) { if (m62.has(ma)) bc.LOI(`ban-do-quy-trinh.md:${m62.get(ma)._dong}: ${ma} có UC presales, không thuộc mục 6.2`); continue; }
    const h = m62.get(ma);
    if (!h) bc.LOI(`ban-do-quy-trinh.md: ${ma} không có UC presales mà thiếu dòng mục 6.2`);
    else kiemMaSo(bc, `ban-do-quy-trinh.md:${h._dong}`, h['Q'], 'Q', q, chi);
  }

  // Mục 7: có sơ đồ cấp 1.
  const dCap1 = path.join(goc, BD, 'cap-1');
  if (!fs.existsSync(dCap1) || !fs.readdirSync(dCap1).some((f) => /^cap-1(-\d+)?\.drawio\.svg$/.test(f))) {
    bc.LOI(`ban-do-quy-trinh.md: chưa có sơ đồ BPMN cấp 1 ${BD}/cap-1/cap-1.drawio.svg (skill ba-bpmn)`);
  }
  bc.TIN(`ban-do-quy-trinh.md: ${dsQt.size} quy trình, ${[...coQt].filter((u) => maUc.has(u)).length}/${maUc.size} UC presales thuộc QT, ${ho} chỗ nối khoảng trống`);
  ra.qt = [...dsQt.keys()];
  return ra;
}

// Phát hiện: mục 3 của hai sổ tầng dự án (bảng cột "PH", "Đối tượng"); _tep là sổ chứa dòng.
function docSoPhatHien(goc) {
  if (SO_DU_AN.every((f) => docTep(goc, f) === null)) return null;
  // Bỏ dòng mẫu của template (chưa có nội dung phát hiện).
  return SO_DU_AN.flatMap((f) => (bangMarkdown(docTep(goc, f) ?? '', ['PH', 'Đối tượng'])?.hang ?? [])
    .filter((h) => !oMau(h['Phát hiện'])).map((h) => ({ ...h, _tep: f })));
}

function kiemSoPhatHien(bc, hang, q) {
  if (hang === null) return;
  const da = new Set();
  for (const h of hang) {
    if (!/^PH-\d{3}$/.test(h['PH'])) bc.LOI(`${h._tep}:${h._dong}: mã "${h['PH']}" sai định dạng PH-xxx`);
    if (da.has(h['PH'])) bc.LOI(`${h._tep}: ${h['PH']} lặp (mã PH không được trùng giữa hai sổ)`);
    da.add(h['PH']);
    const buoc = Number(h['Bước']);
    if (!(buoc >= 1 && buoc <= 12)) bc.LOI(`${h._tep}:${h._dong}: cột "Bước" phải là số bước 1–12`);
    if (!LOAI_PH.includes((h['Loại'] ?? '').trim())) bc.LOI(`${h._tep}:${h._dong}: loại phát hiện "${h['Loại']}" không thuộc danh sách ở kit/templates/ho-so/open-questions.md mục 3`);
    for (const m of maTrongO(h['Q liên quan'], 'Q')) if (!/-T\d+$/.test(m) && !q.has(m)) bc.LOI(`${h._tep}:${h._dong}: ${h['PH']} dẫn ${m} không có ở mục 1`);
    const tt = (h['Trạng thái'] ?? '').trim();
    if (!['mở', 'đóng'].includes(tt)) bc.LOI(`${h._tep}:${h._dong}: trạng thái "${tt}" phải là "mở" hoặc "đóng"`);
    if (tt === 'đóng' && oMau(h['Đóng ở'])) bc.LOI(`${h._tep}:${h._dong}: ${h['PH']} đã đóng mà không ghi "Đóng ở"`);
  }
  bc.TIN(`sổ phát hiện (${SO_DU_AN.join(', ')}): ${hang.length} phát hiện, ${hang.filter((h) => (h['Trạng thái'] ?? '').trim() === 'mở').length} mở`);
}

const MUC_RUI_RO = ['cao', 'trung bình', 'thấp'];
const TT_ASM = ['mở', 'đã xác nhận', 'sai', 'bỏ'];

// Mức rủi ro, phương án tạm của câu hỏi, giả định (kit/templates/ho-so/open-questions.md). Dùng cho cả file của dự án và
// của chức năng. File cũ chưa có cột thì chỉ cảnh báo.
export function kiemRuiRo(bc, rel, t) {
  const q = bangMarkdown(t, ['Q', 'Câu hỏi']);
  const asm = bangMarkdown(t, ['ASM', 'Nội dung']);
  const coCot = (b, c) => b?.cot.some((x) => x.startsWith(c));
  if (q && !coCot(q, 'Mức rủi ro')) bc.CANH(`${rel}: bảng câu hỏi chưa có cột "Mức rủi ro", "Phương án tạm" (template mới)`);
  for (const h of (q?.hang ?? []).filter((x) => !oMau(x['Câu hỏi']))) {
    if (!coCot(q, 'Mức rủi ro')) break;
    const muc = (h['Mức rủi ro'] ?? '').trim();
    const mo = (h['Trạng thái'] ?? '').trim() === 'mở';
    if (muc && !MUC_RUI_RO.includes(muc)) bc.LOI(`${rel}:${h._dong}: ${h['Q']} mức rủi ro "${muc}" phải là ${MUC_RUI_RO.join(' / ')}`);
    if (mo && !muc) bc.LOI(`${rel}:${h._dong}: ${h['Q']} còn mở mà chưa ghi mức rủi ro`);
    if (mo && oMau(h['Phương án tạm'])) bc.LOI(`${rel}:${h._dong}: ${h['Q']} còn mở mà chưa ghi phương án tạm (đang làm theo gì trong lúc chờ)`);
  }
  for (const h of (asm?.hang ?? []).filter((x) => !oMau(x['Nội dung']))) {
    const tt = (h['Trạng thái'] ?? '').trim();
    if (tt && !TT_ASM.includes(tt)) bc.LOI(`${rel}:${h._dong}: ${h['ASM']} trạng thái "${tt}" phải là ${TT_ASM.join(' / ')}`);
    if (!coCot(asm, 'Mức rủi ro')) continue;
    const muc = (h['Mức rủi ro'] ?? '').trim();
    if (muc && !MUC_RUI_RO.includes(muc)) bc.LOI(`${rel}:${h._dong}: ${h['ASM']} mức rủi ro "${muc}" phải là ${MUC_RUI_RO.join(' / ')}`);
    if (tt === 'mở' && !muc) bc.LOI(`${rel}:${h._dong}: ${h['ASM']} còn mở mà chưa ghi mức rủi ro`);
  }
}

function kiemCauHoi(bc, goc) {
  const ra = { q: [], asm: [] };
  if (docTep(goc, OQ) === null) bc.LOI(`thiếu ${OQ} (sổ câu hỏi, giả định, phát hiện của bước 1)`);
  const GATE = ['G0', 'G1', 'G2', 'G3', 'G4', '—', '-'];
  for (const f of SO_DU_AN) {
    const t = docTep(goc, f);
    if (t === null) continue;
    kiemRuiRo(bc, f, t);
    const q = bangMarkdown(t, ['Q', 'Câu hỏi']);
    const asm = bangMarkdown(t, ['ASM', 'Nội dung']);
    if (!q) bc.LOI(`${f}: không có bảng câu hỏi (cột "Q", "Câu hỏi")`);
    for (const h of (q?.hang ?? []).filter((x) => !oMau(x['Câu hỏi']))) {
      if (ra.q.includes(h['Q'])) bc.LOI(`${f}:${h._dong}: ${h['Q']} lặp (mã Q không được trùng giữa hai sổ)`);
      ra.q.push(h['Q']);
      if (!/^Q-\d{3}$/.test(h['Q'])) bc.LOI(`${f}:${h._dong}: mã "${h['Q']}" sai định dạng Q-xxx`);
      const tt = (h['Trạng thái'] ?? '').trim();
      if (!['mở', 'đã quyết', 'bỏ'].includes(tt)) bc.LOI(`${f}:${h._dong}: trạng thái "${tt}" phải là mở / đã quyết / bỏ`);
      if (!GATE.includes((h['Chặn gate'] ?? '').trim())) bc.LOI(`${f}:${h._dong}: cột "Chặn gate" phải là G0–G4 hoặc "—"`);
      if (tt === 'đã quyết' && (oMau(h['Quyết định']) || oMau(h['Người quyết, ngày']))) bc.LOI(`${f}:${h._dong}: ${h['Q']} đã quyết mà thiếu quyết định hoặc người quyết`);
    }
    for (const h of (asm?.hang ?? []).filter((x) => !oMau(x['Nội dung']))) {
      if (ra.asm.includes(h['ASM'])) bc.LOI(`${f}:${h._dong}: ${h['ASM']} lặp (mã ASM không được trùng giữa hai sổ)`);
      ra.asm.push(h['ASM']);
      if (!/^ASM-\d{3}$/.test(h['ASM'])) bc.LOI(`${f}:${h._dong}: mã "${h['ASM']}" sai định dạng ASM-xxx`);
    }
  }
  return ra;
}

function kiemTrace(bc, goc, ma) {
  const f = path.join(goc, 'du-an', 'trace.csv');
  if (!fs.existsSync(f)) { bc.LOI('thiếu du-an/trace.csv'); return; }
  const co = new Set(docCsv(f).map((r) => r.id));
  const thieu = ma.filter((x) => x && !co.has(x));
  if (thieu.length) bc.LOI(`du-an/trace.csv thiếu ${thieu.length} dòng: ${thieu.slice(0, 20).join(' ')}${thieu.length > 20 ? ' …' : ''}`);
}

function kiemGiuCho(bc, goc) {
  // Bản đồ quy trình: quét md, đặc tả .bpmn.json và sơ đồ .drawio.svg ở mọi cấp (mã giữ chỗ nằm cả trong ghi chú sơ đồ).
  const quet = (rel) => {
    const d = path.join(goc, rel);
    if (!fs.existsSync(d)) return [];
    return fs.readdirSync(d).flatMap((f) => (fs.statSync(path.join(d, f)).isDirectory() ? quet(`${rel}/${f}`)
      : /\.(md|bpmn\.json|drawio\.svg)$/.test(f) ? [`${rel}/${f}`] : []));
  };
  const fileQt = quet(BD).filter((f) => f !== `${BD}/ban-do-quy-trinh.md`);
  for (const rel of [`${D}/uc-presales.md`, `${D}/quy-trinh-presales.md`, `${D}/man-presales.md`, `${D}/phap-ly.md`,
    `${D}/uc-phap-ly.md`, `${BD}/ban-do-quy-trinh.md`, ...fileQt, 'du-an/glossary.md', OQ]) {
    const t = docTep(goc, rel);
    const ds = t?.match(RE_GIU_CHO);
    if (ds?.length) bc.LOI(`${rel}: còn mã giữ chỗ ${[...new Set(ds)].join(' ')} — phiên chính thay bằng mã thật trước khi commit`);
  }
}

const PHAN = ['uc', 'quy-trinh', 'man', 'phap-ly', 'uc-phap-ly', 'ban-do'];

export function kiemDauVao({ goc, chi } = {}) {
  const bc = new BaoCao(`ĐẦU VÀO — 1-ba-init/0-dau-vao/ ↔ 0-inputs/ (bước 1)${chi ? ` — chỉ ${chi}` : ''}`);
  if (!fs.existsSync(path.join(goc, D))) { bc.TIN('chưa có 1-ba-init/0-dau-vao/, bỏ qua'); return bc; }
  // Phần không thuộc --chi vẫn chạy để lấy dữ liệu (mã UC, mã điều khoản, phát hiện) nhưng không báo.
  const im = new BaoCao('');
  const bao = (phan) => (!chi || chi === phan ? bc : im);
  const ph = docSoPhatHien(goc);
  const maPh = new Set((ph ?? []).map((p) => p['PH']));
  const cauHoi = kiemCauHoi(chi ? im : bc, goc);
  const maQ = new Set(cauHoi.q);
  if (!chi) {
    for (const d of ['0-inputs/presales/uc', '0-inputs/presales/quy-trinh', '0-inputs/presales/prototype', '0-inputs/phap-ly']) {
      if (!fs.existsSync(path.join(goc, d))) bc.LOI(`thiếu thư mục đầu vào bắt buộc ${d}`);
    }
    if (!fs.existsSync(path.join(goc, 'du-an', 'glossary.md'))) bc.LOI('thiếu du-an/glossary.md');
    kiemSoPhatHien(bc, ph, maQ);
  }
  const uc = kiemUcPresales(bao('uc'), goc);
  if (!chi) {
    for (const [m, n] of uc.dem) {
      if (n > 1 && !(ph ?? []).some((p) => tachDs(boMa(p['Đối tượng'])).includes(m))) {
        bc.LOI(`uc-presales.md: mã gốc ${m} lặp ${n} lần mà chưa có phát hiện (${OQ} mục 3)`);
      }
    }
  }
  const qt = (!chi || chi === 'quy-trinh') ? kiemQuyTrinh(bao('quy-trinh'), goc, uc.ma, maPh, chi) : { qp: [] };
  const man = (!chi || chi === 'man') ? kiemManPresales(bao('man'), goc, uc.ma, ph ?? [], chi) : [];
  const dk = (!chi || ['phap-ly', 'uc-phap-ly', 'ban-do'].includes(chi)) ? kiemPhapLy(bao('phap-ly'), goc) : new Map();
  if (!chi || chi === 'uc-phap-ly') kiemUcPhapLy(bao('uc-phap-ly'), goc, uc.ma, dk, maPh, maQ, chi);
  const bd = (!chi || chi === 'ban-do') ? kiemBanDo(bao('ban-do'), goc, uc.ma, dk, maPh, maQ, chi) : { qt: [] };
  if (!chi) {
    kiemTrace(bc, goc, [...qt.qp, ...bd.qt, ...man.map((m) => m.ma), ...maPh, ...cauHoi.q, ...cauHoi.asm]);
    kiemGiuCho(bc, goc);
  }
  return bc;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = thamSo(process.argv.slice(2));
  const goc = a.goc ? path.resolve(a.goc) : timGoc(process.cwd());
  if (a.chi && !PHAN.includes(a.chi)) { console.error(`--chi phải là ${PHAN.join(', ')}`); process.exit(2); }
  process.exit(kiemDauVao({ goc, chi: a.chi }).in() ? 1 : 0);
}
