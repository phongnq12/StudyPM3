#!/usr/bin/env node
// Cổng máy bước 2, phần 2 (/ba-overview): kiểm bản đồ quy trình, ma trận UC presales × PROC và danh mục chức năng
// với ba danh mục đầu vào. Theo templates/2-business-process/ (process-overview.md, ma-tran-uc-proc.md,
// danh-muc-chuc-nang.md) và .claude/skills/ba-process/method.md phần A; bảng chốt khung ở 2-ba-overview/5-actor-usecase/uc-overview.md
// mục 1 (phần 4). Dòng G0 kiểm được: 1, 2, 3, 8, 9.
// Dùng: node kit/tools/ba-verify/map-check.mjs [--goc <repo>]
// Chưa có 2-ba-overview/2-business-process/process-overview.md → bỏ qua (chưa chạy /ba-overview).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BaoCao, bangMarkdown, docTruyVet, oMau, thamSo, timGoc } from './lib.mjs';

const D0 = '1-ba-init/0-dau-vao';
const D2 = '2-ba-overview/2-business-process';
const CO_TOI_DA = { proc: 3, uc: 15 };

const docTep = (goc, rel) => {
  const f = path.join(goc, rel);
  return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null;
};
const boMa = (s) => (s || '').replace(/`/g, '').replace(/\[ASM-(?:\d+|T\d+)\]/g, '').trim();
// Danh sách trong ô, cách nhau bằng ";" (mã gốc có thể chứa dấu phẩy nên không tách theo ",").
const dsO = (s) => (s || '').split(';').map(boMa).filter((x) => x && x !== '—' && x !== '-' && !/^n\/a$/i.test(x));
const maProc = (s) => (s || '').match(/PROC-\d+/g) ?? [];

// Bảng trong mục "<so>." của file; _dong là số dòng thật trong file.
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
// Bỏ dòng ví dụ còn nguyên chữ mẫu của template.
const thuc = (b, cot) => (b?.hang ?? []).filter((h) => !oMau(h[cot]));

// Đồ thị phụ thuộc có vòng: trả về một vòng (mảng CN) hoặc null.
function timVong(ke) {
  const mau = new Map();
  const ngan = [];
  const di = (u) => {
    mau.set(u, 1); ngan.push(u);
    for (const v of ke.get(u) ?? []) {
      if (mau.get(v) === 1) return [...ngan.slice(ngan.indexOf(v)), v];
      if (!mau.has(v)) { const r = di(v); if (r) return r; }
    }
    mau.set(u, 2); ngan.pop();
    return null;
  };
  for (const u of ke.keys()) if (!mau.has(u)) { const r = di(u); if (r) return r; }
  return null;
}

// uc-overview.md mục 1: mỗi UC presales đúng một dòng, đúng thứ tự; CN, PROC khớp danh mục chức năng và ma trận.
function kiemBangChot(bc, goc, ucHang, chinh, ucCuaCn) {
  const rel = '2-ba-overview/5-actor-usecase/uc-overview.md';
  const t = docTep(goc, rel);
  if (!t) return;
  const hang = thuc(bangMuc(t, 1, ['Mã gốc', 'CN', 'PROC']), 'Mã gốc');
  const thuTu = ucHang.map((h) => boMa(h['Mã gốc']));
  const dem = new Map();
  for (const h of hang) {
    const ma = boMa(h['Mã gốc']);
    dem.set(ma, (dem.get(ma) ?? 0) + 1);
    if (!thuTu.includes(ma)) { bc.LOI(`${rel}:${h._dong}: mã gốc "${ma}" không có trong uc-presales.md`); continue; }
    const cn = ucCuaCn.get(ma) ?? '—';
    const cnGhi = /^n\/a$/i.test(boMa(h['CN'])) ? '—' : boMa(h['CN']);
    if (cnGhi !== cn) bc.LOI(`${rel}:${h._dong}: "${ma}" CN ghi "${cnGhi || '(trống)'}", danh mục chức năng ghi ${cn}`);
    const p = chinh.get(ma);
    if (p && !maProc(h['PROC']).includes(p)) bc.LOI(`${rel}:${h._dong}: "${ma}" PROC không khớp PROC chính ${p} của ma trận`);
  }
  for (const ma of thuTu) {
    if (!dem.has(ma)) bc.LOI(`${rel} mục 1: thiếu dòng UC presales "${ma}"`);
    else if (dem.get(ma) > 1) bc.LOI(`${rel} mục 1: UC presales "${ma}" có ${dem.get(ma)} dòng`);
  }
  const daGhi = hang.map((h) => boMa(h['Mã gốc'])).filter((x, i, a) => thuTu.includes(x) && a.indexOf(x) === i);
  if (daGhi.join('|') !== thuTu.filter((x) => daGhi.includes(x)).join('|')) bc.CANH(`${rel} mục 1: thứ tự khác uc-presales.md`);
}

export function kiemMapping({ goc } = {}) {
  const bc = new BaoCao('QUY TRÌNH TỔNG, CHỨC NĂNG — 2-ba-overview/2-business-process/ (bước 2, phần 2)');
  const tPo = docTep(goc, `${D2}/process-overview.md`);
  if (!tPo) { bc.TIN('chưa có process-overview.md, bỏ qua'); return bc; }
  const tUc = docTep(goc, `${D0}/uc-presales.md`);
  const tPl = docTep(goc, `${D0}/phap-ly.md`);
  const tMan = docTep(goc, `${D0}/man-presales.md`);
  const tMt = docTep(goc, `${D2}/ma-tran-uc-proc.md`);
  const tDm = docTep(goc, `${D2}/danh-muc-chuc-nang.md`);
  if (!tUc) { bc.LOI(`thiếu ${D0}/uc-presales.md`); return bc; }
  if (!tMt) bc.LOI(`thiếu ${D2}/ma-tran-uc-proc.md`);
  if (!tDm) bc.LOI(`thiếu ${D2}/danh-muc-chuc-nang.md`);

  // ---- Đầu vào
  const ucHang = thuc(bangMuc(tUc, 1, ['Mã gốc', 'Tên']), 'Mã gốc');
  const ucCn = new Map(ucHang.map((h) => [boMa(h['Mã gốc']), boMa(h['Chức năng'])]));
  const dk = new Map(thuc(tPl && bangMuc(tPl, 2, ['Mã điều khoản', 'Loại']), 'Mã điều khoản')
    .map((h) => [boMa(h['Mã điều khoản']), h['Loại'] || '']));
  const man = thuc(tMan && bangMuc(tMan, 2, ['Mã màn', 'UC presales']), 'Mã màn')
    .map((h) => ({ ma: boMa(h['Mã màn']), uc: dsO(h['UC presales']) }));
  const dsMan = new Set(man.map((m) => m.ma));

  // ---- process-overview mục 2: danh mục PROC
  const po = `${D2}/process-overview.md`;
  const bProc = bangMuc(tPo, 2, ['PROC', 'Trigger', 'Kết quả']);
  if (!bProc) bc.LOI(`${po} mục 2: không thấy bảng danh mục quy trình`);
  const proc = new Map();
  for (const h of thuc(bProc, 'PROC')) {
    const ma = boMa(h['PROC']);
    if (!/^PROC-\d{2}$/.test(ma)) { bc.LOI(`${po}:${h._dong}: mã "${ma}" sai dạng PROC-xx`); continue; }
    if (proc.has(ma)) bc.LOI(`${po}:${h._dong}: ${ma} lặp`);
    for (const c of ['Tên', 'Trigger', 'Kết quả', 'Actor chính']) {
      if (oMau(h[c])) bc.LOI(`${po}:${h._dong}: ${ma} thiếu ${c}`);
    }
    const canCu = h['Căn cứ'] || '';
    const ps = [...canCu.matchAll(/PS:\s*`?([^;`]+)`?/g)].map((m) => m[1].trim());
    const pl = [...canCu.matchAll(/PL:\s*`?([^;`\s]+)`?/g)].map((m) => m[1].trim());
    if (!ps.length && !pl.length) bc.LOI(`${po}:${h._dong}: ${ma} không có căn cứ (PL:<mã điều khoản> hoặc PS:<mã gốc>)`);
    for (const x of ps) if (!ucCn.has(x)) bc.LOI(`${po}:${h._dong}: ${ma} căn cứ PS:${x} không có trong uc-presales.md`);
    for (const x of pl) if (!dk.has(x)) bc.LOI(`${po}:${h._dong}: ${ma} căn cứ PL:${x} không có trong phap-ly.md`);
    proc.set(ma, { dong: h._dong, cn: boMa(h['CN']), pl });
  }
  bc.TIN(`${proc.size} PROC, ${ucHang.length} UC presales`);

  // Mục 3: chuyển giao trỏ PROC có thật.
  for (const h of bangMuc(tPo, 3, ['Từ PROC', 'Đến PROC'])?.hang ?? []) {
    for (const c of Object.keys(h).filter((k) => k.startsWith('Từ PROC') || k.startsWith('Đến PROC'))) {
      for (const x of maProc(h[c])) if (!proc.has(x)) bc.LOI(`${po}:${h._dong}: chuyển giao trỏ ${x} không có ở mục 2`);
    }
  }

  // G0-3: mỗi điều khoản loại thủ tục gắn PROC hoặc có lý do ở mục 7.
  const dkGan = new Set([...proc.values()].flatMap((p) => p.pl));
  const dkLyDo = new Set(thuc(bangMuc(tPo, 7, ['Mã điều khoản']), 'Mã điều khoản').map((h) => boMa(h['Mã điều khoản'])));
  for (const [ma, loai] of dk) {
    if (loai.trim().startsWith('thủ tục') && !dkGan.has(ma) && !dkLyDo.has(ma)) {
      bc.LOI(`điều khoản thủ tục ${ma} không gắn PROC nào và không có lý do ở ${po} mục 7`);
    }
  }

  // ---- Ma trận UC presales × PROC (G0-1)
  const chinh = new Map(); // mã gốc → PROC chính
  if (tMt) {
    const mt = `${D2}/ma-tran-uc-proc.md`;
    const bMt = bangMuc(tMt, 1, ['Mã gốc', 'PROC chính']);
    if (!bMt) bc.LOI(`${mt} mục 1: không thấy bảng UC presales → PROC`);
    const daThay = new Set();
    const procCoUc = new Set();
    for (const h of thuc(bMt, 'Mã gốc')) {
      const ma = boMa(h['Mã gốc']);
      if (!ucCn.has(ma)) { bc.LOI(`${mt}:${h._dong}: mã gốc "${ma}" không có trong uc-presales.md`); continue; }
      if (daThay.has(ma)) bc.LOI(`${mt}:${h._dong}: mã gốc "${ma}" lặp`);
      daThay.add(ma);
      const pc = maProc(h['PROC chính']);
      const pp = maProc(h['PROC phụ']);
      if (pc.length > 1) bc.LOI(`${mt}:${h._dong}: "${ma}" có hơn một PROC chính`);
      if (!pc.length && oMau(h['Lý do nếu không gắn'])) bc.LOI(`${mt}:${h._dong}: "${ma}" không có PROC chính và không có lý do`);
      for (const x of [...pc, ...pp]) {
        if (!proc.has(x)) bc.LOI(`${mt}:${h._dong}: "${ma}" gắn ${x} không có ở process-overview.md mục 2`);
        procCoUc.add(x);
      }
      if (pc.length) chinh.set(ma, pc[0]);
    }
    for (const ma of ucCn.keys()) if (!daThay.has(ma)) bc.LOI(`${mt}: UC presales "${ma}" chưa có dòng ở mục 1`);
    // Chiều ngược: PROC không UC nào gắn → phải ở mục 2 kèm căn cứ điều khoản.
    const khongUc = new Set(thuc(bangMuc(tMt, 2, ['PROC']), 'PROC').flatMap((h) => maProc(h['PROC'])));
    for (const x of proc.keys()) {
      if (!procCoUc.has(x) && !khongUc.has(x)) bc.LOI(`${mt}: ${x} không có UC presales nào và không có ở mục 2`);
    }
    bc.TIN(`ma trận: ${chinh.size}/${ucCn.size} UC presales gắn PROC chính`);
  }

  // ---- Danh mục chức năng (G0-2, 8, 9)
  if (tDm) {
    const dm = `${D2}/danh-muc-chuc-nang.md`;
    const bDm = bangMuc(tDm, 1, ['CN', 'PROC', 'UC presales']);
    if (!bDm) bc.LOI(`${dm} mục 1: không thấy bảng danh mục`);
    const cn = new Map();
    const procCn = new Map();
    for (const h of thuc(bDm, 'CN')) {
      const ma = boMa(h['CN']);
      if (!/^CN-\d{2}$/.test(ma)) { bc.LOI(`${dm}:${h._dong}: mã "${ma}" sai dạng CN-xx`); continue; }
      if (cn.has(ma)) bc.LOI(`${dm}:${h._dong}: ${ma} lặp`);
      const dsProc = maProc(h['PROC']);
      if (!dsProc.length) bc.LOI(`${dm}:${h._dong}: ${ma} không có PROC`);
      for (const p of dsProc) {
        if (!proc.has(p)) bc.LOI(`${dm}:${h._dong}: ${ma} gồm ${p} không có ở process-overview.md mục 2`);
        if (procCn.has(p)) bc.LOI(`${dm}:${h._dong}: ${p} nằm ở cả ${procCn.get(p)} và ${ma}`);
        else procCn.set(p, ma);
      }
      cn.set(ma, {
        dong: h._dong, proc: dsProc, uc: dsO(h['UC presales']), man: dsO(h['MP']), dk: dsO(h['Điều khoản']),
        phuThuoc: (h['Phụ thuộc CN'] || '').match(/CN-\d+/g) ?? [], thuTu: Number(boMa(h['Thứ tự'])), dai: boMa(h['Dải ID']),
      });
    }
    bc.TIN(`${cn.size} CN`);

    for (const [p, v] of proc) {
      if (!procCn.has(p)) bc.LOI(`${p} không thuộc CN nào trong ${dm}`);
      else if (v.cn !== procCn.get(p)) bc.LOI(`${po}:${v.dong}: ${p} ghi CN "${v.cn || '(trống)'}", ${dm} ghi ${procCn.get(p)}`);
    }

    // UC presales của CN = UC có PROC chính thuộc CN; cột "Chức năng" của uc-presales.md khớp.
    const ucCuaCn = new Map();
    for (const [ma, p] of chinh) if (procCn.has(p)) ucCuaCn.set(ma, procCn.get(p));
    const daGan = new Map();
    for (const [ma, c] of cn) {
      for (const u of c.uc) {
        if (!ucCn.has(u)) { bc.LOI(`${dm}:${c.dong}: ${ma} gồm UC presales "${u}" không có trong uc-presales.md`); continue; }
        if (daGan.has(u)) bc.LOI(`${dm}:${c.dong}: UC presales "${u}" nằm ở cả ${daGan.get(u)} và ${ma}`);
        else daGan.set(u, ma);
        if (ucCuaCn.has(u) && ucCuaCn.get(u) !== ma) {
          bc.LOI(`${dm}:${c.dong}: UC presales "${u}" ở ${ma} nhưng PROC chính ${chinh.get(u)} thuộc ${ucCuaCn.get(u)}`);
        }
      }
      for (const m of c.man) if (!dsMan.has(m)) bc.LOI(`${dm}:${c.dong}: ${ma} gồm ${m} không có trong man-presales.md`);
      const manCan = man.filter((m) => m.uc.some((u) => c.uc.includes(u))).map((m) => m.ma);
      const thieuMan = manCan.filter((m) => !c.man.includes(m));
      if (thieuMan.length) bc.CANH(`${dm}:${c.dong}: ${ma} thiếu màn của UC presales trong CN: ${thieuMan.join(', ')}`);
      for (const x of c.dk) if (!dk.has(x)) bc.LOI(`${dm}:${c.dong}: ${ma} dẫn điều khoản ${x} không có trong phap-ly.md`);
      if (c.proc.length > CO_TOI_DA.proc || c.uc.length > CO_TOI_DA.uc) {
        bc.CANH(`${ma} vượt cỡ: ${c.proc.length} PROC, ${c.uc.length} UC presales (tối đa ${CO_TOI_DA.proc} PROC, khoảng ${CO_TOI_DA.uc} UC)`);
      }
    }
    kiemBangChot(bc, goc, ucHang, chinh, daGan);
    for (const [u, c] of ucCuaCn) if (!daGan.has(u)) bc.LOI(`${dm}: UC presales "${u}" (PROC chính thuộc ${c}) chưa nằm trong CN nào`);
    for (const [u, c] of ucCn) {
      const dung = daGan.get(u);
      if (dung && c !== dung) bc.LOI(`${D0}/uc-presales.md: "${u}" cột Chức năng ghi "${c || '(trống)'}", danh mục chức năng ghi ${dung}`);
    }

    // Phụ thuộc không vòng; CN được phụ thuộc làm trước.
    const ke = new Map([...cn].map(([ma, c]) => [ma, c.phuThuoc.filter((x) => x !== ma)]));
    for (const [ma, c] of cn) {
      for (const x of c.phuThuoc) {
        if (!cn.has(x)) bc.LOI(`${dm}:${c.dong}: ${ma} phụ thuộc ${x} không có trong danh mục`);
        else if (Number.isFinite(c.thuTu) && Number.isFinite(cn.get(x).thuTu) && cn.get(x).thuTu >= c.thuTu) {
          bc.LOI(`${dm}:${c.dong}: ${ma} (thứ tự ${c.thuTu}) phụ thuộc ${x} (thứ tự ${cn.get(x).thuTu}) mà ${x} không làm trước`);
        }
      }
      if (!Number.isFinite(c.thuTu) || c.thuTu < 1) bc.LOI(`${dm}:${c.dong}: ${ma} thiếu thứ tự làm`);
    }
    const vong = timVong(ke);
    if (vong) bc.LOI(`${dm}: phụ thuộc chức năng có vòng: ${vong.join(' → ')}`);

    // Dải ID: dạng "aaa–bbb", không chồng nhau; chồng số tầng dự án đã dùng → cảnh báo.
    const dai = [];
    for (const [ma, c] of cn) {
      const m = c.dai.match(/^(\d{3})\s*[–-]\s*(\d{3})$/);
      if (!m) { bc.LOI(`${dm}:${c.dong}: ${ma} thiếu dải ID hoặc sai dạng "001–050"`); continue; }
      const [tu, den] = [Number(m[1]), Number(m[2])];
      if (tu > den) { bc.LOI(`${dm}:${c.dong}: ${ma} dải ID ${c.dai} ngược`); continue; }
      for (const d of dai) if (tu <= d.den && d.tu <= den) bc.LOI(`${dm}:${c.dong}: dải ID của ${ma} chồng dải của ${d.ma}`);
      dai.push({ ma, tu, den });
    }
    const soDuAn = docTruyVet(goc).filter((r) => r._tep === path.join('du-an', 'trace.csv'))
      .map((r) => (r.id || '').match(/^[A-Z]+-(\d{3})$/)).filter(Boolean).map((m) => Number(m[1]));
    for (const d of dai) {
      const trung = soDuAn.filter((n) => n >= d.tu && n <= d.den);
      if (trung.length) bc.CANH(`dải ID của ${d.ma} chồng số tầng dự án đã dùng trong du-an/trace.csv (${[...new Set(trung)].slice(0, 5).join(', ')}…)`);
    }
  }
  return bc;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = thamSo(process.argv.slice(2));
  const goc = a.goc ? path.resolve(a.goc) : timGoc(process.cwd());
  process.exit(kiemMapping({ goc }).in() ? 1 : 0);
}
