#!/usr/bin/env node
// Cổng máy bước 6 (/ba-chuc-nang, ba-erd): kiểm 2-ba-overview/3-erd/erd-CN-xx-<slug>.md với erd-overview, bảng bước PROC của
// CN, biểu mẫu luật và trường màn presales trong phạm vi. Theo templates/3-erd/erd-chuc-nang.md và
// .claude/skills/ba-erd/checklist.md (dòng 1, 2, 3, 4, 5, 7, 11, 14, 15). Dòng G2 kiểm được: 3.
// Dùng: node kit/tools/ba-verify/erd-check.mjs --chuc-nang CN-xx [--goc <repo>]
// Chưa có ERD của CN → bỏ qua (chưa tới bước 6).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BaoCao, oMau, thamSo, timGoc } from './lib.mjs';
import { bangMuc, boMa, docTep, phamViCn, thuc } from './mapping.mjs';

const D0 = '1-ba-init/0-dau-vao';
const D2 = '2-ba-overview/2-business-process';
const D3 = '2-ba-overview/3-erd';
const MUC = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
const COT_BAT_BUOC = ['Kiểu nghiệp vụ', 'Bắt buộc', 'Phân loại', 'Căn cứ', 'Nguồn'];
const THAO_TAC = ['Tạo', 'Đọc', 'Sửa', 'Xóa'];
const RE_O_CRUD = /^(được|không|n\/a \(.+\)|\[CẦN XÁC NHẬN: Q-\d+\])$/;
const COT_VALIDATION = ['Kiểu', 'Bắt buộc', 'Giới hạn', 'Giá trị biên', 'Thông báo khi sai'];
const RE_DB = /varchar|nvarchar|\bint\(|khóa ngoại|khóa chính|\bPK\b|\bFK\b|\bindex\b|foreign key|primary key/iu;
const RE_O_MA_TRAN = /^(?:[TĐSX](?:\s*,\s*[TĐSX])*|—|-)?$/u;
const chuan = (s) => (s || '').replace(/`/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
const dsTep = (goc, d, loc) => (fs.existsSync(path.join(goc, d)) ? fs.readdirSync(path.join(goc, d)).filter(loc).sort() : []);

// ENT trong erd-overview mục 1: ENT → { ten, cn, vongDoi }.
export function entOverview(goc) {
  const t = docTep(goc, `${D3}/erd-overview.md`) ?? '';
  return new Map(thuc(bangMuc(t, 1, ['ENT', 'Tên']), 'ENT').map((h) => [boMa(h['ENT']), {
    ten: (h['Tên'] || '').trim(), cn: boMa(h['CN sở hữu']), vongDoi: /^Có/i.test((h['Có vòng đời'] || '').trim()),
  }]));
}

// Bảng bước của mọi PROC thuộc CN: [{ ma, du_lieu, vt }].
export function buocCn(goc, dongCn) {
  const ra = [];
  for (const p of (dongCn?.['PROC'] || '').match(/PROC-\d+/g) ?? []) {
    const f = dsTep(goc, D2, (x) => x.startsWith(`${p}-`) && x.endsWith('.md'))[0];
    if (!f) continue;
    for (const h of thuc(bangMuc(docTep(goc, `${D2}/${f}`), 'Bảng bước', ['Bước', 'Dữ liệu']), 'Bước')) {
      const k = Object.keys(h).find((x) => x.startsWith('Dữ liệu'));
      ra.push({ ma: boMa(h['Bước']), duLieu: h[k] || '', vt: `${D2}/${f}:${h._dong}` });
    }
  }
  return ra;
}

export function kiemErd({ goc, chucNang } = {}) {
  const cn = chucNang;
  const bc = new BaoCao(`ERD CHỨC NĂNG — ${D3}/erd-${cn}-*.md (bước 6)`);
  const tep = dsTep(goc, D3, (f) => f.startsWith(`erd-${cn}-`) && f.endsWith('.md'))[0];
  if (!tep) { bc.TIN(`chưa có ERD của ${cn}, bỏ qua`); return bc; }
  const rel = `${D3}/${tep}`;
  const t = docTep(goc, rel);
  const ctx = phamViCn(goc, cn);
  if (!ctx) { bc.LOI(`${cn} không có trong danh-muc-chuc-nang.md`); return bc; }
  const { pv, dongCn } = ctx;

  for (const m of MUC) if (!new RegExp(`^##\\s+${m}\\.\\s`, 'm').test(t)) bc.LOI(`${rel}: thiếu mục ${m}`);
  const ov = entOverview(goc);
  if (!ov.size) bc.LOI(`chưa có ENT nào ở ${D3}/erd-overview.md mục 1`);
  const soHuu = [...ov].filter(([, v]) => v.cn === cn).map(([k]) => k);
  const dai = boMa(dongCn['Dải ID']).match(/^(\d{3})\s*[–-]\s*(\d{3})$/);

  // Mục 3: danh sách thực thể khớp overview (checklist 1, 2).
  const muc3 = new Set();
  for (const h of thuc(bangMuc(t, 3, ['ENT', 'Tên', 'Vai trò']), 'ENT')) {
    const e = boMa(h['ENT']);
    const vt = `${rel}:${h._dong}`;
    const vaiTro = (h[Object.keys(h).find((k) => k.startsWith('Vai trò'))] || '').trim();
    muc3.add(e);
    if (!ov.has(e)) { bc.LOI(`${vt}: ${e} không có ở erd-overview.md mục 1 (ENT mới phải thêm dòng overview)`); continue; }
    if (boMa(h['CN sở hữu']) !== ov.get(e).cn) bc.LOI(`${vt}: ${e} CN sở hữu ghi "${boMa(h['CN sở hữu'])}", overview ghi ${ov.get(e).cn}`);
    if (/sở hữu|mới/.test(vaiTro) && ov.get(e).cn !== cn) bc.LOI(`${vt}: ${e} là của ${ov.get(e).cn}, ${cn} chỉ được dẫn`);
    if (vaiTro === 'dẫn' && ov.get(e).cn === cn) bc.LOI(`${vt}: ${e} do ${cn} sở hữu, vai trò phải là "sở hữu"`);
    if (vaiTro === 'mới' && dai) {
      const so = Number(e.match(/\d+$/)[0]);
      if (so < Number(dai[1]) || so > Number(dai[2])) bc.LOI(`${vt}: ENT mới ${e} ngoài dải ID ${dongCn['Dải ID']} của ${cn}`);
    }
  }
  for (const e of soHuu) if (!muc3.has(e)) bc.LOI(`${rel} mục 3: thiếu ${e} (${cn} sở hữu theo erd-overview.md)`);

  // Mục 4: data dictionary chỉ cho ENT sở hữu; đủ cột; trạng thái cho ENT có vòng đời (checklist 1, 7, 14).
  const muc4 = t.match(/^## 4\.[\s\S]*?(?=^## 5\.)/m)?.[0] ?? '';
  const thuocTinh = new Set();
  const nhap = []; // thuộc tính người dùng nhập trên màn (Nguồn có MP-) → phải có dòng ở mục 10
  const mucCon = [...muc4.matchAll(/^###\s+(ENT-\d+)/gm)].map((m) => m[1]);
  for (const e of mucCon) {
    if (!soHuu.includes(e)) bc.LOI(`${rel} mục 4: data dictionary của ${e} không do ${cn} sở hữu (chỉ dẫn ID)`);
    const hang = thuc(bangMuc(t, e, ['Thuộc tính', 'Kiểu']), 'Thuộc tính');
    if (!hang.length) bc.LOI(`${rel} mục 4: ${e} chưa có thuộc tính`);
    for (const h of hang) {
      thuocTinh.add(chuan(h['Thuộc tính']));
      if (/MP-\d+/.test(h['Nguồn'] || '')) nhap.push({ ma: `${e}.${(h['Thuộc tính'] || '').trim()}`, vt: `${rel}:${h._dong}` });
      for (const c of COT_BAT_BUOC) if (oMau(h[c])) bc.LOI(`${rel}:${h._dong}: ${e} "${h['Thuộc tính']}" thiếu ${c}`);
    }
    if (ov.get(e)?.vongDoi) {
      const tt = hang.filter((h) => chuan(h['Thuộc tính']) === 'trạng thái').length;
      if (tt !== 1) bc.LOI(`${rel} mục 4: ${e} có vòng đời phải có đúng một thuộc tính "Trạng thái" (đang có ${tt})`);
    }
  }
  for (const e of soHuu) if (!mucCon.includes(e)) bc.LOI(`${rel} mục 4: thiếu mục con "### ${e}"`);
  if (RE_DB.test(muc4)) bc.CANH(`${rel} mục 4: có thuật ngữ, kiểu database (bảng, khóa, varchar…)`);
  if (soHuu.length && !soHuu.some((e) => ov.get(e).vongDoi) && !/không áp dụng/i.test(t.match(/^## 1\.[\s\S]*?(?=^## 2\.)/m)?.[0] ?? '')) {
    bc.LOI(`${rel} mục 1: ${cn} không có ENT có vòng đời, phải ghi "không áp dụng" kèm lý do`);
  }

  // G2-3, checklist 3: "Dữ liệu chạm tới" của bảng bước là ENT, hoặc có dòng ở bảng danh từ mục 3.
  const tenEnt = new Map([...ov].map(([k, v]) => [chuan(v.ten), k]));
  const danhTu = new Set(thuc(bangMuc(t, 3, ['Danh từ', 'Xử lý']), 'Danh từ').map((h) => chuan(h['Danh từ'])));
  const buoc = buocCn(goc, dongCn);
  for (const b of buoc) {
    for (const x of b.duLieu.split(/[;,]/).map((s) => s.trim()).filter(Boolean)) {
      if (/không chạm dữ liệu|^—$|^-$|^n\/a$/i.test(x)) continue;
      const id = x.match(/ENT-\d+/)?.[0];
      if (id ? ov.has(id) : (tenEnt.has(chuan(x)) || danhTu.has(chuan(x)))) continue;
      bc.LOI(`${b.vt}: ${b.ma} chạm "${x}" không là ENT ở erd-overview và không có lý do ở ${rel} mục 3`);
    }
  }

  // Checklist 15: ma trận bước × thực thể đủ bước, ô hợp lệ, ENT sở hữu có bước tạo.
  const bMt = bangMuc(t, 7, ['Bước']);
  const dongMt = new Set();
  const coTao = new Set();
  for (const h of thuc(bMt, 'Bước')) {
    const ma = (h['Bước'] || '').match(/PROC-\d+\.\d+/)?.[0];
    if (!ma) continue;
    dongMt.add(ma);
    for (const [k, v] of Object.entries(h)) {
      const e = k.match(/^ENT-\d+/)?.[0];
      if (!e) continue;
      if (!RE_O_MA_TRAN.test((v || '').trim())) bc.LOI(`${rel}:${h._dong}: ô ${ma} × ${e} là "${v}", chỉ dùng T, Đ, S, X`);
      if (/T/.test(v || '')) coTao.add(e);
    }
  }
  for (const b of buoc) if (!dongMt.has(b.ma)) bc.LOI(`${rel} mục 7: thiếu dòng ${b.ma} trong ma trận bước × thực thể`);
  for (const x of dongMt) if (!buoc.some((b) => b.ma === x)) bc.LOI(`${rel} mục 7: ${x} không phải bước của ${cn}`);
  for (const e of soHuu) if (!coTao.has(e)) bc.CANH(`${e} (${cn} sở hữu) không có bước tạo (T) trong ma trận: ghi lý do dưới bảng`);

  // Checklist 4, 5: trường biểu mẫu luật và trường màn presales trong phạm vi có trong ERD hoặc có phát hiện.
  // Có trong ERD: tên thuộc tính trùng nhãn, hoặc nhãn được dẫn trong dấu nháy ('<nhãn>') ở cột Nguồn, bảng danh từ.
  const chuErd = chuan(t);
  const coTrongErd = (x) => thuocTinh.has(chuan(x)) || danhTu.has(chuan(x)) || chuErd.includes(`'${chuan(x)}'`);
  const tPl = docTep(goc, `${D0}/phap-ly.md`) ?? '';
  for (const h of thuc(bangMuc(tPl, 3, ['Mã điều khoản', 'Tên biểu mẫu']), 'Mã điều khoản')) {
    const d = boMa(h['Mã điều khoản']);
    if (!pv.dk.includes(d)) continue;
    const truong = (h[Object.keys(h).find((k) => k.startsWith('Các trường'))] || '').split(/[;,]/).map((s) => s.trim()).filter(Boolean);
    for (const x of truong) if (!coTrongErd(x)) bc.LOI(`trường "${x}" của biểu mẫu ${d} không có trong ${rel}`);
  }
  let man = [];
  try { man = JSON.parse(docTep(goc, `${D0}/man-presales.json`) ?? '{}').man ?? []; } catch { bc.CANH(`không đọc được ${D0}/man-presales.json`); }
  const soPh = chuan(docTep(goc, `${D0}/so-phat-hien.md`) ?? '');
  for (const m of man.filter((x) => pv.man.includes(x.ma))) {
    for (const f of m.truong ?? []) {
      const nhan = chuan(f.nhan);
      if (!nhan || coTrongErd(f.nhan)) continue;
      const coPh = soPh.split('\n').some((d) => d.includes(chuan(m.ma)) && d.includes(nhan));
      if (!coPh) bc.LOI(`trường "${f.nhan}" của ${m.ma} không có trong ${rel} và không có dòng sổ phát hiện`);
    }
  }

  bc.TIN(`${soHuu.length} ENT sở hữu, ${thuocTinh.size} thuộc tính, ${buoc.length} bước`);

  // Mục 9: ma trận CRUD × vai trò — mỗi ENT của mục 3 đủ Tạo, Đọc, Sửa, Xóa; ô hợp lệ, không trống.
  const bCrud = bangMuc(t, 9, ['ENT', 'Thao tác']);
  if (!bCrud) bc.LOI(`${rel} mục 9: không thấy ma trận CRUD × vai trò (cột ENT, Thao tác, ACT-xx)`);
  else {
    if (!bCrud.cot.some((c) => /^ACT-\d+/.test(c))) bc.LOI(`${rel} mục 9: ma trận chưa có cột ACT-xx nào`);
    const daCo = new Set();
    for (const h of thuc(bCrud, 'ENT')) {
      const e = h['ENT'].match(/ENT-\d+/)?.[0];
      const tt = (h['Thao tác'] || '').trim();
      if (!e) continue;
      if (!THAO_TAC.includes(tt)) bc.LOI(`${rel}:${h._dong}: ${e} thao tác "${tt}" phải là ${THAO_TAC.join(' / ')}`);
      daCo.add(`${e}|${tt}`);
      for (const [k, v] of Object.entries(h)) {
        if (!/^ACT-\d+/.test(k)) continue;
        if (!RE_O_CRUD.test((v || '').trim())) bc.LOI(`${rel}:${h._dong}: ô ${e} ${tt} × ${k.split(' ')[0]} là "${(v || '').trim() || '(trống)'}", phải là được / không / n/a (<lý do>) / [CẦN XÁC NHẬN: Q-xxx]`);
      }
    }
    for (const e of muc3) for (const tt of THAO_TAC) if (!daCo.has(`${e}|${tt}`)) bc.LOI(`${rel} mục 9: thiếu dòng ${e} × ${tt}`);
  }

  // Mục 10: kiểm dữ liệu nhập — mỗi thuộc tính nhập trên màn có một dòng, đủ 5 thuộc tính validation.
  const bVal = bangMuc(t, 10, ['Thuộc tính', 'Kiểu']);
  if (!bVal) bc.LOI(`${rel} mục 10: không thấy bảng kiểm dữ liệu nhập`);
  else {
    const coDong = new Set();
    for (const h of thuc(bVal, 'Thuộc tính')) {
      const ma = (h['Thuộc tính'] || '').trim();
      coDong.add(chuan(ma));
      if (!/^ENT-\d+\./.test(ma)) bc.LOI(`${rel}:${h._dong}: thuộc tính "${ma}" phải ghi dạng ENT-xxx.<tên>`);
      for (const c of COT_VALIDATION) {
        const v = (Object.entries(h).find(([k]) => k.startsWith(c))?.[1] || '').trim();
        if (!v || v === '—' || /^<.*>$/.test(v)) bc.LOI(`${rel}:${h._dong}: ${ma} thiếu "${c}"`);
      }
    }
    for (const x of nhap) if (!coDong.has(chuan(x.ma))) bc.LOI(`${x.vt}: ${x.ma} nhập trên màn mà chưa có dòng ở mục 10 (kiểm dữ liệu nhập)`);
  }
  return bc;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = thamSo(process.argv.slice(2));
  const goc = a.goc ? path.resolve(a.goc) : timGoc(process.cwd());
  if (!/^CN-\d{2}$/.test(a['chuc-nang'] ?? '')) { console.error('cần --chuc-nang CN-xx'); process.exit(2); }
  process.exit(kiemErd({ goc, chucNang: a['chuc-nang'] }).in() ? 1 : 0);
}
