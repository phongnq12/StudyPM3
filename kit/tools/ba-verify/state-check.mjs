#!/usr/bin/env node
// Cổng máy bước 7 (/ba-chuc-nang, ba-state): kiểm 2-ba-overview/4-state-machine/ENT-xxx-<slug>.md của ENT do CN sở hữu và có
// vòng đời (erd-overview mục 1). Theo templates/4-state-machine/state-machine.md và .claude/skills/ba-state/checklist.md
// (dòng 1, 3, 5, 10, 12, 13, 17). Dòng G2 kiểm được: 16 (liên kết vòng đời khớp hai đầu).
// Dùng: node kit/tools/ba-verify/state-check.mjs --chuc-nang CN-xx [--goc <repo>]
// CN không có ENT có vòng đời và không có file vòng đời → bỏ qua.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BaoCao, RE_MA_DIEU_KHOAN, bangMarkdown, oMau, thamSo, timGoc } from './lib.mjs';
import { bangMuc, boMa, docTep, phamViCn, thuc } from './mapping.mjs';
import { buocCn, entOverview } from './erd-check.mjs';

const D3 = '2-ba-overview/3-erd';
const D4 = '2-ba-overview/4-state-machine';
const MUC = ['1', '2', '3', '4', '5', '6', '7', '8'];
const dsTep = (goc, d, loc) => (fs.existsSync(path.join(goc, d)) ? fs.readdirSync(path.join(goc, d)).filter(loc).sort() : []);
const maSt = (s) => (s || '').match(/ST-\d+/g) ?? [];

// Đọc một file vòng đời: CN sở hữu, ST, TR, liên kết mục 7.
function docVongDoi(goc, rel) {
  const t = docTep(goc, rel);
  const dau = thuc(bangMarkdown(t.split(/^## 1\./m)[0], ['CN sở hữu']), 'CN sở hữu')[0];
  const st = new Map(thuc(bangMuc(t, 3, ['ST', 'Tên']), 'ST').map((h) => [boMa(h['ST']), h]));
  const tr = new Map(thuc(bangMuc(t, 4, ['TR', 'Từ', 'Đến']), 'TR').map((h) => [boMa(h['TR']), h]));
  const lk = thuc(bangMuc(t, 7, ['TR ở đây']), 'TR ở đây');
  return { t, cn: boMa(dau?.['CN sở hữu']), st, tr, lk };
}

export function kiemState({ goc, chucNang } = {}) {
  const cn = chucNang;
  const bc = new BaoCao(`VÒNG ĐỜI — ${D4}/ENT-xxx-*.md của ${cn} (bước 7)`);
  const ov = entOverview(goc);
  const can = [...ov].filter(([, v]) => v.cn === cn && v.vongDoi).map(([k]) => k);
  const tepEnt = new Map(dsTep(goc, D4, (f) => /^ENT-\d+-.*\.md$/.test(f)).map((f) => [f.match(/^ENT-\d+/)[0], `${D4}/${f}`]));
  const cuaCn = [...tepEnt].filter(([, r]) => docVongDoi(goc, r).cn === cn);
  if (!can.length && !cuaCn.length) { bc.TIN(`${cn} không có ENT có vòng đời, bỏ qua`); return bc; }
  const ctx = phamViCn(goc, cn);
  const buoc = new Set(buocCn(goc, ctx?.dongCn).map((b) => b.ma));

  // Checklist 1: đúng tập ENT có vòng đời của CN.
  for (const e of can) if (!tepEnt.has(e)) bc.LOI(`${e} (${cn} sở hữu, có vòng đời) chưa có ${D4}/${e}-<slug>.md`);
  for (const [e, r] of cuaCn) {
    if (!can.includes(e)) bc.LOI(`${r}: ${e} không phải ENT ${cn} sở hữu có vòng đời theo erd-overview.md`);
  }

  for (const e of can.filter((x) => tepEnt.has(x))) {
    const rel = tepEnt.get(e);
    const v = docVongDoi(goc, rel);
    for (const m of MUC) if (!new RegExp(`^##\\s+${m}\\.\\s`, 'm').test(v.t)) bc.LOI(`${rel}: thiếu mục ${m}`);
    if (v.cn !== cn) bc.LOI(`${rel}: bảng đầu ghi CN sở hữu "${v.cn}", erd-overview ghi ${cn}`);

    // Checklist 3: ST có nguồn; có đầu, kết thúc.
    const dauSt = new Set();
    const ketThuc = new Set();
    for (const [s, h] of v.st) {
      if (!/^ST-\d{3}$/.test(s)) bc.LOI(`${rel}:${h._dong}: mã "${s}" sai dạng ST-xxx`);
      if (oMau(h['Nguồn'])) bc.LOI(`${rel}:${h._dong}: ${s} thiếu nguồn`);
      const loai = (h[Object.keys(h).find((k) => k.startsWith('Đầu'))] || '').trim();
      if (/đầu/.test(loai)) dauSt.add(s);
      if (/kết thúc/.test(loai)) ketThuc.add(s);
    }
    if (!v.st.size) bc.LOI(`${rel} mục 3: chưa có trạng thái`);
    if (v.st.size && !ketThuc.size) bc.LOI(`${rel} mục 3: không có trạng thái kết thúc`);

    // Checklist 5: TR trỏ ST có thật, sự kiện là bước PROC, thời hạn kèm điều khoản, TR khác hoặc hệ thống; có actor.
    const ke = new Map([...v.st.keys()].map((s) => [s, new Set()]));
    for (const [x, h] of v.tr) {
      const vt = `${rel}:${h._dong}`;
      if (!/^TR-\d{3}$/.test(x)) bc.LOI(`${vt}: mã "${x}" sai dạng TR-xxx`);
      const tu = maSt(h['Từ']);
      const den = maSt(h['Đến']);
      const tuBatDau = /bắt đầu|\[\*\]/i.test(h['Từ'] || '');
      if (!tu.length && !tuBatDau) bc.LOI(`${vt}: ${x} cột Từ phải là ST-xxx hoặc "(bắt đầu)"`);
      if (den.length !== 1) bc.LOI(`${vt}: ${x} cột Đến phải là đúng một ST-xxx`);
      for (const s of [...tu, ...den]) if (!v.st.has(s)) bc.LOI(`${vt}: ${x} trỏ ${s} không có ở mục 3`);
      if (tuBatDau) den.forEach((s) => dauSt.add(s));
      for (const s of tu) if (ke.has(s) && den[0]) ke.get(s).add(den[0]);
      const sk = h[Object.keys(h).find((k) => k.startsWith('Sự kiện'))] || '';
      const pb = sk.match(/PROC-\d+\.\d+/g) ?? [];
      for (const p of pb) if (!buoc.has(p)) bc.LOI(`${vt}: ${x} sự kiện ${p} không là bước PROC của ${cn}`);
      const thoiHan = /quá|hạn/i.test(sk) && (sk.split(/[\s`;,()]+/).some((w) => RE_MA_DIEU_KHOAN.test(w.replace(/^PL:/, ''))) || /\[CẦN XÁC NHẬN/.test(sk));
      if (!pb.length && !thoiHan && !/TR-\d+|Hệ thống/i.test(sk)) {
        bc.LOI(`${vt}: ${x} sự kiện phải là bước PROC-xx.yy, thời hạn kèm mã điều khoản, TR của ENT khác hoặc sự kiện hệ thống`);
      }
      if (oMau(h['Actor'])) bc.LOI(`${vt}: ${x} thiếu actor`);
    }

    // Checklist 10: tới được từ trạng thái đầu; thoát được (trừ kết thúc).
    if (v.st.size && !dauSt.size) bc.LOI(`${rel}: không có trạng thái đầu (cột Đầu / kết thúc, hoặc TR từ "(bắt đầu)")`);
    const toi = new Set(dauSt);
    const hang = [...dauSt];
    while (hang.length) for (const s of ke.get(hang.pop()) ?? []) if (!toi.has(s)) { toi.add(s); hang.push(s); }
    for (const s of v.st.keys()) {
      if (dauSt.size && !toi.has(s)) bc.LOI(`${rel}: ${s} không tới được từ trạng thái đầu`);
      if (!ketThuc.has(s) && !(ke.get(s)?.size)) bc.LOI(`${rel}: ${s} không thoát được và không phải trạng thái kết thúc`);
    }

    // Checklist 12: bảng thao tác phủ mọi ST.
    const stThaoTac = new Set(thuc(bangMuc(v.t, 6, ['Trạng thái']), 'Trạng thái').flatMap((h) => maSt(h['Trạng thái'])));
    for (const s of v.st.keys()) if (!stThaoTac.has(s)) bc.LOI(`${rel} mục 6: thiếu dòng ${s} trong bảng thao tác theo trạng thái`);

    // Checklist 13, G2-16: liên kết vòng đời khớp hai đầu khi đầu kia đã có file; chưa có thì "chờ CN-yy" kèm Q.
    for (const h of v.lk) {
      const vt = `${rel}:${h._dong}`;
      const trDay = (h['TR ở đây'] || '').match(/TR-\d+/)?.[0];
      if (trDay && !v.tr.has(trDay)) bc.LOI(`${vt}: liên kết dẫn ${trDay} không có ở mục 4`);
      const kia = (h[Object.keys(h).find((k) => k.startsWith('ENT khác'))] || '').match(/ENT-\d+/)?.[0];
      const trKia = (h['TR bên đó'] || '').match(/TR-\d+/)?.[0];
      if (!kia) { bc.LOI(`${vt}: liên kết thiếu ENT khác`); continue; }
      if (!tepEnt.has(kia)) {
        if (!/chờ\s+CN-\d+/i.test(h['TR bên đó'] || '') || !/Q-\d+/.test(Object.values(h).join(' '))) {
          bc.LOI(`${vt}: ${kia} chưa có file vòng đời: cột TR bên đó ghi "chờ CN-yy" kèm Q`);
        }
        continue;
      }
      const vk = docVongDoi(goc, tepEnt.get(kia));
      if (!trKia || !vk.tr.has(trKia)) { bc.LOI(`${vt}: TR bên đó "${h['TR bên đó'] || ''}" không có ở ${tepEnt.get(kia)} mục 4`); continue; }
      const nguoc = vk.lk.some((x) => (x['TR ở đây'] || '').includes(trKia) && (x['TR bên đó'] || '').includes(trDay ?? '§')
        && (x[Object.keys(x).find((k) => k.startsWith('ENT khác'))] || '').includes(e));
      if (!nguoc) {
        const qKhacCn = vk.cn !== cn && /Q-\d+/.test(Object.values(h).join(' '));
        if (qKhacCn) bc.CANH(`${vt}: ${tepEnt.get(kia)} (${vk.cn}) chưa có dòng liên kết ngược; đã có câu hỏi`);
        else bc.LOI(`${vt}: ${tepEnt.get(kia)} mục 7 thiếu dòng ngược ${trKia} ↔ ${e} ${trDay}`);
      }
    }

    // Checklist 17: miền giá trị thuộc tính "Trạng thái" trong ERD khớp danh sách ST.
    const erd = dsTep(goc, D3, (f) => f.startsWith(`erd-${cn}-`) && f.endsWith('.md'))[0];
    if (erd) {
      const tt = thuc(bangMuc(docTep(goc, `${D3}/${erd}`), e, ['Thuộc tính', 'Miền giá trị']), 'Thuộc tính')
        .find((h) => (h['Thuộc tính'] || '').trim().toLowerCase() === 'trạng thái');
      if (tt) {
        const mien = new Set(maSt(tt['Miền giá trị']));
        const thieu = [...v.st.keys()].filter((s) => !mien.has(s));
        const thua = [...mien].filter((s) => !v.st.has(s));
        if (thieu.length || thua.length) {
          bc.LOI(`${D3}/${erd}: miền giá trị "Trạng thái" của ${e} lệch vòng đời${thieu.length ? `, thiếu ${thieu.join(', ')}` : ''}${thua.length ? `, thừa ${thua.join(', ')}` : ''}`);
        }
      }
    }
    bc.TIN(`${e}: ${v.st.size} trạng thái, ${v.tr.size} TR, ${v.lk.length} liên kết`);
  }
  return bc;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = thamSo(process.argv.slice(2));
  const goc = a.goc ? path.resolve(a.goc) : timGoc(process.cwd());
  if (!/^CN-\d{2}$/.test(a['chuc-nang'] ?? '')) { console.error('cần --chuc-nang CN-xx'); process.exit(2); }
  process.exit(kiemState({ goc, chucNang: a['chuc-nang'] }).in() ? 1 : 0);
}
