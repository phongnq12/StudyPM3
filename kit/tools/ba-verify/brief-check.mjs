#!/usr/bin/env node
// Cổng máy bước 3 (/ba-chuc-nang, khởi động): kiểm chuc-nang/CN-xx/brief.md với dòng CN-xx của danh mục chức năng,
// uc-presales, man-presales, phap-ly, process-overview, erd-overview. Theo kit/templates/ho-so/brief-chuc-nang.md và
// .claude/skills/ba-chuc-nang/checklist.md (dòng 1–6, 8). Dòng G1 góp vào: 11 (phạm vi brief).
// Dùng: node kit/tools/ba-verify/brief-check.mjs --chuc-nang CN-xx [--goc <repo>]
// Chưa có brief của CN → bỏ qua (chưa tới bước 3).
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BaoCao, bangMarkdown, oMau, thamSo, timGoc } from './lib.mjs';
import { bangMuc, boMa, chuMuc, docTep, dsO, thuc } from './mapping.mjs';

const D0 = '1-ba-init/0-dau-vao';
const D2 = '2-ba-overview/2-business-process';
const SO_MUC = 12;
const chuan = (s) => (s || '').replace(/<br\s*\/?>/gi, ' ').replace(/`/g, '').replace(/\s+/g, ' ').trim();
const ma = (s, tien) => (s || '').match(new RegExp(`${tien}-\\d+`, 'g')) ?? [];
const daiId = (s) => (s || '').replace(/\s/g, '').replace(/-/g, '–');

// So hai tập: phần thiếu (có ở danh mục, không có ở brief) là lỗi; phần thừa là lỗi trừ khi được phép.
function soTap(bc, ten, rel, danhMuc, brief, { thuaDuoc = () => false } = {}) {
  for (const x of danhMuc) if (!brief.has(x)) bc.LOI(`${rel} ${ten}: thiếu ${x} của dòng CN trong danh mục chức năng`);
  for (const x of brief) if (!danhMuc.has(x) && !thuaDuoc(x)) bc.LOI(`${rel} ${ten}: ${x} không thuộc dòng CN trong danh mục chức năng`);
}

export function kiemBrief({ goc, chucNang } = {}) {
  const cn = chucNang;
  const rel = `chuc-nang/${cn}/brief.md`;
  const bc = new BaoCao(`BRIEF — ${rel} (bước 3)`);
  const t = docTep(goc, rel);
  if (!t) { bc.TIN(`chưa có brief của ${cn}, bỏ qua`); return bc; }
  const tDm = docTep(goc, `${D2}/danh-muc-chuc-nang.md`);
  const dong = tDm && thuc(bangMuc(tDm, 1, ['CN', 'PROC']), 'CN').find((h) => boMa(h['CN']) === cn);
  if (!dong) { bc.LOI(`${cn} không có trong ${D2}/danh-muc-chuc-nang.md`); return bc; }

  // Dòng 1: đủ 12 mục.
  for (let m = 1; m <= SO_MUC; m++) if (!new RegExp(`^##\\s+${m}\\.\\s`, 'm').test(t)) bc.LOI(`${rel}: thiếu mục ${m}`);
  const dau = thuc(bangMarkdown(t.split(/^## 1\./m)[0], ['CN']), 'CN')[0];
  if (dau && boMa(dau['CN']) !== cn) bc.LOI(`${rel}: bảng đầu ghi CN "${boMa(dau['CN'])}", file là của ${cn}`);

  // Dòng 2: mục 3 = UC presales của dòng CN, chép nguyên văn.
  const uc = new Map(thuc(bangMuc(docTep(goc, `${D0}/uc-presales.md`) ?? '', 1, ['Mã gốc', 'Tên']), 'Mã gốc')
    .map((h) => [boMa(h['Mã gốc']), h]));
  const h3 = thuc(bangMuc(t, 3, ['Mã gốc']), 'Mã gốc');
  soTap(bc, 'mục 3', rel, new Set(dsO(dong['UC presales'])), new Set(h3.map((h) => boMa(h['Mã gốc']))));
  for (const h of h3) {
    const goc3 = uc.get(boMa(h['Mã gốc']));
    if (!goc3) { bc.LOI(`${rel}:${h._dong}: mã gốc "${boMa(h['Mã gốc'])}" không có trong uc-presales.md`); continue; }
    const ten = Object.entries(h).find(([k]) => k.startsWith('Tên'))?.[1];
    if (chuan(ten) !== chuan(goc3[Object.keys(goc3).find((k) => k.startsWith('Tên'))])) {
      bc.LOI(`${rel}:${h._dong}: tên của "${boMa(h['Mã gốc'])}" khác nguyên văn uc-presales.md`);
    }
  }

  // Dòng 3: mục 4 = PROC của dòng CN; trigger, kết quả khớp process-overview.
  const po = new Map(thuc(bangMuc(docTep(goc, `${D2}/process-overview.md`) ?? '', 2, ['PROC', 'Trigger']), 'PROC')
    .map((h) => [boMa(h['PROC']), h]));
  const h4 = thuc(bangMuc(t, 4, ['PROC', 'Trigger']), 'PROC');
  soTap(bc, 'mục 4', rel, new Set(ma(dong['PROC'], 'PROC')), new Set(h4.flatMap((h) => ma(h['PROC'], 'PROC'))));
  for (const h of h4) {
    const p = ma(h['PROC'], 'PROC')[0];
    const o = po.get(p);
    if (!o) continue;
    for (const c of ['Trigger', 'Kết quả']) {
      if (chuan(h[c]) !== chuan(o[c])) bc.LOI(`${rel}:${h._dong}: ${p} ${c} khác process-overview.md`);
    }
  }

  // Dòng 4: mục 5 = MP của dòng CN; vị trí khớp man-presales.
  const man = new Map(thuc(bangMuc(docTep(goc, `${D0}/man-presales.md`) ?? '', 2, ['Mã màn']), 'Mã màn')
    .map((h) => [boMa(h['Mã màn']), h]));
  const h5 = thuc(bangMuc(t, 5, ['MP']), 'MP');
  soTap(bc, 'mục 5', rel, new Set(ma(dong['MP'], 'MP')), new Set(h5.flatMap((h) => ma(h['MP'], 'MP'))));
  for (const h of h5) {
    const m = ma(h['MP'], 'MP')[0];
    const o = man.get(m);
    if (!o) { bc.LOI(`${rel}:${h._dong}: ${m} không có trong man-presales.md`); continue; }
    if (h['Vị trí'] !== undefined && chuan(h['Vị trí']) !== chuan(o['Vị trí'])) bc.LOI(`${rel}:${h._dong}: ${m} vị trí khác man-presales.md`);
  }

  // Dòng 5: mục 6 có mọi điều khoản của dòng CN (cho phép tách tới khoản, điểm); thêm điều khoản ngoài danh mục là
  // cảnh báo (template cho thêm điều khoản thẩm quyền, thời hạn, biểu mẫu chi phối PROC).
  const pl = new Map(thuc(bangMuc(docTep(goc, `${D0}/phap-ly.md`) ?? '', 2, ['Mã điều khoản']), 'Mã điều khoản')
    .map((h) => [boMa(h['Mã điều khoản']), (h['Loại'] || '').trim()]));
  const h6 = thuc(bangMuc(t, 6, ['Mã điều khoản']), 'Mã điều khoản').map((h) => ({ ma: boMa(h['Mã điều khoản']), dong: h._dong }));
  const dkDm = dsO(dong['Điều khoản']);
  const thuoc = (x, d) => x === d || x.startsWith(`${d}.`);
  for (const d of dkDm) if (!h6.some((x) => thuoc(x.ma, d))) bc.LOI(`${rel} mục 6: thiếu ${d} của dòng CN trong danh mục chức năng`);
  for (const x of h6) {
    if (!pl.has(x.ma)) bc.LOI(`${rel}:${x.dong}: điều khoản ${x.ma} không có trong phap-ly.md`);
    else if (!dkDm.some((d) => thuoc(x.ma, d))) bc.CANH(`${rel}:${x.dong}: điều khoản ${x.ma} (${pl.get(x.ma)}) ngoài cột Điều khoản của danh mục`);
  }

  // Dòng 6: ENT sở hữu khớp danh mục và erd-overview.
  const erd = thuc(bangMuc(docTep(goc, '2-ba-overview/3-erd/erd-overview.md') ?? '', 1, ['ENT', 'CN sở hữu']), 'ENT');
  const soHuuErd = new Set(erd.filter((h) => boMa(h['CN sở hữu']) === cn).map((h) => boMa(h['ENT'])));
  const soHuuDm = new Set(ma(dong['ENT sở hữu'], 'ENT'));
  const h7 = thuc(bangMuc(t, 7, ['ENT']), 'ENT');
  const soHuuBrief = new Set(h7.filter((h) => /sở hữu/.test(Object.entries(h).find(([k]) => k.startsWith('Quan hệ'))?.[1] || ''))
    .map((h) => boMa(h['ENT'])));
  soTap(bc, 'mục 7 (ENT sở hữu)', rel, soHuuDm, soHuuBrief);
  if (erd.length) for (const e of soHuuErd) if (!soHuuDm.has(e)) bc.LOI(`danh mục chức năng: ${cn} thiếu ${e} ở cột ENT sở hữu (erd-overview.md ghi ${cn} sở hữu)`);
  for (const h of h7) if (!erd.some((x) => boMa(x['ENT']) === boMa(h['ENT'])) && erd.length) bc.LOI(`${rel}:${h._dong}: ${boMa(h['ENT'])} không có trong erd-overview.md`);

  // Dòng 8: dải ID khớp danh mục (bảng đầu hoặc mục 10).
  const dai = daiId(boMa(dong['Dải ID']));
  if (oMau(dong['Dải ID'])) bc.LOI(`danh mục chức năng: ${cn} chưa có dải ID`);
  else {
    const muc10 = chuMuc(t, 10).replace(/-/g, '–').replace(/\s/g, '');
    const dauDai = dau ? daiId(boMa(dau['Dải ID'])) : '';
    if (dauDai && dauDai !== dai) bc.LOI(`${rel}: bảng đầu ghi dải ${dauDai}, danh mục ghi ${dai}`);
    if (!dauDai && !muc10.includes(dai)) bc.LOI(`${rel} mục 10: không có dải ${dai} của danh mục`);
  }
  bc.TIN(`${h3.length} UC presales, ${h4.length} PROC, ${h5.length} MP, ${h6.length} điều khoản, ${h7.length} ENT`);
  return bc;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = thamSo(process.argv.slice(2));
  const goc = a.goc ? path.resolve(a.goc) : timGoc(process.cwd());
  if (!/^CN-\d{2}$/.test(a['chuc-nang'] ?? '')) { console.error('cần --chuc-nang CN-xx'); process.exit(2); }
  process.exit(kiemBrief({ goc, chucNang: a['chuc-nang'] }).in() ? 1 : 0);
}
