#!/usr/bin/env node
// Cổng máy bước 8 (/ba-chuc-nang, ba-usecase): kiểm mọi 3-ba-detail/use-case/UC-xxx-<slug>.md của một CN với bảng bước
// PROC, vòng đời, uc-overview, BRD. Theo templates/5-actor-usecase/use-case.md và .claude/skills/ba-usecase/checklist.md
// (dòng 1, 3, 5, 9, 10, 12, 13, 14, 16, 17, 19, 20, 24, 25, 26). Dòng G2 kiểm được: 5, 6, 9, 13.
// Dùng: node kit/tools/ba-verify/uc-check.mjs --chuc-nang CN-xx [--goc <repo>]
// Chưa có UC nào của CN → bỏ qua (chưa tới bước 8).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BaoCao, bangMarkdown, oMau, thamSo, timGoc } from './lib.mjs';
import { bangMuc, boMa, chuMuc, docTep, phamViCn, thuc } from './mapping.mjs';

const D1 = '2-ba-overview/1-brd';
const D2 = '2-ba-overview/2-business-process';
const D3 = '2-ba-overview/3-erd';
const D4 = '2-ba-overview/4-state-machine';
const D5 = '2-ba-overview/5-actor-usecase';
const SO_MUC = 11;
const QUYET_DINH = ['Giữ', 'Làm rõ', 'Tách', 'Gộp', 'Mở rộng', 'Bỏ', 'Thêm mới'];
const COT_LUONG = ['Bước', 'Tác nhân', 'Mô tả', 'Bước PROC', 'Màn hình', 'Thông báo', 'Nguồn'];
const RE_CUOI_NGOAI_LE = /^\((quay về bước \d+|dừng UC|chuyển sang UC-\d+[^)]*)\) · dữ liệu đã nhập: (giữ|xóa) · bản ghi: (không tạo|không đổi|hoàn tác: .+)$/;
const ma = (s, tien) => (s || '').match(new RegExp(`${tien}-\\d+(?:\\.\\d+)?`, 'g')) ?? [];
const dsTep = (goc, d, loc) => (fs.existsSync(path.join(goc, d)) ? fs.readdirSync(path.join(goc, d)).filter(loc).sort() : []);
// Ô chưa điền (trống, "—", chữ mẫu "<…>"); khác `n/a` là giá trị hợp lệ "chắc chắn không có".
const chuaDien = (s) => { const x = (s || '').trim(); return !x || x === '—' || /^<.*>$/.test(x); };
export const muc1 = (t) => new Map(thuc(bangMuc(t, 1, ['Mục', 'Nội dung']), 'Mục').map((h) => [h['Mục'].trim(), (h['Nội dung'] || '').trim()]));

// Các bảng nhánh của mục 6 hoặc 7: [{ ma, ten, hang }] theo heading "### <mã> — <tên>".
export function nhanh(t, so) {
  const nd = chuMuc(t, so);
  const ra = [];
  const khoi = nd.split(/^### /m).slice(1);
  for (const k of khoi) {
    const tieuDe = k.split('\n')[0];
    const m = tieuDe.match(/^(\S+)\s+—\s+(.*)$/);
    const b = bangMarkdown(k, ['Bước', 'Tác nhân']);
    ra.push({ ma: m ? m[1] : tieuDe.trim(), ten: m ? m[2] : '', hang: b?.hang ?? [] });
  }
  return ra;
}

// UC của một CN: [{ id, rel, t, m1 }] theo dòng "Chức năng" ở mục 1.
export function dsUcCn(goc, cn) {
  const ra = [];
  for (const f of dsTep(goc, D5, (x) => /^UC-\d+-.*\.md$/.test(x))) {
    const rel = `${D5}/${f}`;
    const t = docTep(goc, rel);
    const m1 = muc1(t);
    if ((m1.get('Chức năng') || '').match(/CN-\d+/)?.[0] === cn) ra.push({ id: f.match(/^UC-\d+/)[0], rel, t, m1 });
  }
  return ra;
}

export function kiemUc({ goc, chucNang } = {}) {
  const cn = chucNang;
  const bc = new BaoCao(`USE CASE — ${D5}/UC-xxx-*.md của ${cn} (bước 8)`);
  const uc = dsUcCn(goc, cn);
  if (!uc.length) { bc.TIN(`chưa có UC nào của ${cn}, bỏ qua`); return bc; }
  const ctx = phamViCn(goc, cn);
  if (!ctx) { bc.LOI(`${cn} không có trong danh-muc-chuc-nang.md`); return bc; }

  // Bảng bước PROC của CN: thứ tự và loại.
  const buoc = new Map(); // PROC-xx.yy → { loai, thuTu }
  let thuTu = 0;
  for (const p of ma(ctx.dongCn['PROC'], 'PROC')) {
    const f = dsTep(goc, D2, (x) => x.startsWith(`${p}-`) && x.endsWith('.md'))[0];
    if (!f) continue;
    for (const h of thuc(bangMuc(docTep(goc, `${D2}/${f}`), 'Bảng bước', ['Bước', 'Loại']), 'Bước')) {
      buoc.set(boMa(h['Bước']), { loai: (h['Loại'] || '').trim(), thuTu: thuTu++ });
    }
  }
  // ACT có thật, ENT, TR của CN.
  const act = new Set((docTep(goc, `${D5}/actors.md`) ?? '').match(/ACT-\d+/g) ?? []);
  const ent = new Set((docTep(goc, `${D3}/erd-overview.md`) ?? '').match(/ENT-\d+/g) ?? []);
  const trCn = new Map(); // TR → file vòng đời
  for (const f of dsTep(goc, D4, (x) => /^ENT-\d+-.*\.md$/.test(x))) {
    const nd = docTep(goc, `${D4}/${f}`);
    const dau = bangMarkdown(nd.split(/^## 1\./m)[0], ['CN sở hữu']);
    if (!thuc(dau, 'CN sở hữu').some((h) => boMa(h['CN sở hữu']) === cn)) continue;
    for (const h of thuc(bangMuc(nd, 4, ['TR']), 'TR')) trCn.set(boMa(h['TR']), `${D4}/${f}`);
  }
  // REQ của CN và REQ pháp lý theo UC presales.
  const brd = dsTep(goc, D1, (x) => x.startsWith(`brd-${cn}-`) && x.endsWith('.md'))[0];
  const tBrd = brd ? docTep(goc, `${D1}/${brd}`) : '';
  const reqCn = new Set();
  const reqKiemThu = new Set();
  const ucPhapLy = new Set();
  for (const h of thuc(tBrd && bangMuc(tBrd, 5, ['ID', 'Căn cứ']), 'ID')) {
    reqCn.add(boMa(h['ID']));
    if (/kiểm thử/i.test(h['Kiểm chứng'] || '')) reqKiemThu.add(boMa(h['ID']));
    if ((h['Căn cứ'] || '').trim() === 'pháp lý') {
      for (const m of (h['Nguồn'] || '').matchAll(/PS:\s*`?([^;`]+?)`?\s*(?:;|$)/g)) ucPhapLy.add(m[1].trim());
    }
  }

  const buocCuaUc = new Map(); // PROC-xx.yy → [UC]
  const reqCoUc = new Set();
  const trTrongHau = new Set();
  for (const u of uc) {
    const { id, rel, t, m1 } = u;
    // Dòng 26: đủ heading, không còn khối hướng dẫn.
    for (let i = 1; i <= SO_MUC; i++) if (!new RegExp(`^##\\s+${i}\\.\\s`, 'm').test(t)) bc.LOI(`${rel}: thiếu mục ${i}`);
    if (/^>\s/m.test(t)) bc.LOI(`${rel}: còn khối \`>\` hướng dẫn của template`);
    // Dòng 5: mục 1.
    if (m1.get('UC') !== id) bc.LOI(`${rel} mục 1: dòng UC ghi "${m1.get('UC') || '(trống)'}", tên file là ${id}`);
    for (const k of ['UC presales gốc', 'REQ phục vụ', 'Bước quy trình', 'Màn', 'Tác nhân chính', 'Permission key', 'Phạm vi dữ liệu', 'Bên nhận kết quả']) {
      if (chuaDien(m1.get(k))) bc.LOI(`${rel} mục 1: thiếu "${k}"`);
    }
    for (const r of ma(m1.get('REQ phục vụ'), 'REQ')) {
      reqCoUc.add(r);
      if (reqCn.size && !reqCn.has(r)) bc.LOI(`${rel} mục 1: ${r} không có trong BRD của ${cn}`);
    }
    const tacNhan = m1.get('Tác nhân chính') || '';
    const laHeThong = /^Hệ thống/.test(tacNhan);
    for (const a of ma(tacNhan, 'ACT')) if (act.size && !act.has(a)) bc.LOI(`${rel} mục 1: ${a} không có trong actors.md`);
    if (!laHeThong && !ma(tacNhan, 'ACT').length && !oMau(tacNhan)) bc.CANH(`${rel} mục 1: tác nhân chính "${tacNhan}" không có mã ACT`);
    if (laHeThong && (!m1.has('Đơn vị xử lý (tác nhân hệ thống)') || !m1.has('Kích hoạt thủ công khi test (tác nhân hệ thống)'))) {
      bc.LOI(`${rel} mục 1: tác nhân hệ thống phải có dòng "Đơn vị xử lý" và "Kích hoạt thủ công khi test"`);
    }
    if (!laHeThong && [...m1.keys()].some((k) => k.startsWith('Đơn vị xử lý'))) bc.CANH(`${rel} mục 1: tác nhân người còn dòng "Đơn vị xử lý" (xóa)`);
    if (/^\s*`?n\/a`?\s*$/.test(m1.get('Permission key') || '') && /endpoint|hệ thống ngoài/i.test(tacNhan + (m1.get('Bên nhận kết quả') || ''))) {
      bc.CANH(`${rel} mục 1: hệ thống ngoài gọi vào không được có permission key n/a`);
    }
    const dsBuoc = ma(m1.get('Bước quy trình'), 'PROC');
    for (const b of dsBuoc) {
      if (!buoc.has(b)) { bc.LOI(`${rel} mục 1: bước ${b} không có trong PROC của ${cn}`); continue; }
      if (!buocCuaUc.has(b)) buocCuaUc.set(b, []);
      buocCuaUc.get(b).push(id);
    }

    // Luồng chính: START, END, nguồn, thứ tự bước PROC.
    const chinh = thuc(bangMuc(t, 5, ['Bước', 'Tác nhân']), 'Bước');
    if (!chinh.length) { bc.LOI(`${rel} mục 5: không thấy bảng luồng chính`); continue; }
    if (chinh[0]['Bước'] !== 'START') bc.LOI(`${rel} mục 5: dòng đầu phải là START`);
    if (chinh.at(-1)['Bước'] !== 'END') bc.LOI(`${rel} mục 5: dòng cuối phải là END`);
    const buocChinh = new Map(chinh.map((h) => [h['Bước'], h]));
    let truoc = -1;
    for (const h of chinh) {
      if (['START', 'END'].includes(h['Bước'])) continue;
      if (/\bnếu\b[\s\S]*\bthì\b/i.test(h['Mô tả'] || '')) bc.LOI(`${rel}:${h._dong}: luồng chính bước ${h['Bước']} có nhánh rẽ ("nếu… thì…")`);
      const p = ma(h['Bước PROC'], 'PROC')[0];
      if (p && buoc.has(p)) {
        if (buoc.get(p).thuTu < truoc) bc.LOI(`${rel}:${h._dong}: luồng chính bước ${h['Bước']} trỏ ${p} ngược thứ tự bảng bước PROC`);
        truoc = Math.max(truoc, buoc.get(p).thuTu);
      }
    }
    // Dòng 10, 25: ô Nguồn trống, ô trống, "như trên".
    const kiemO = (hang, noi, boQuaCuoi) => {
      hang.forEach((h, i) => {
        if (['START', 'END'].includes(h['Bước'])) return;
        if (boQuaCuoi && i === hang.length - 1) return;
        if (oMau(h['Nguồn'])) bc.LOI(`${rel}:${h._dong}: ${noi} bước ${h['Bước']} trống ô Nguồn`);
        for (const c of COT_LUONG) if (!(h[c] || '').trim()) { bc.CANH(`${rel}:${h._dong}: ${noi} bước ${h['Bước']} trống ô ${c} (ghi n/a nếu không có)`); break; }
        if (/như trên/i.test(Object.values(h).join(' '))) bc.CANH(`${rel}:${h._dong}: ${noi} bước ${h['Bước']} ghi "như trên"`);
        if (/\b(BR|REQ|ENT|TR|ST|UC|SCR)-\d+(?:\.\d+)?\s*(?:[;,|)]|$)/.test(h['Nguồn'] || '')) bc.CANH(`${rel}:${h._dong}: ${noi} bước ${h['Bước']} dẫn mã trơ không kèm tên`);
      });
    };
    kiemO(chinh, 'luồng chính', false);

    // Dòng 13, 14, 16: nhánh thay thế, ngoại lệ.
    const maNhanh = [];
    for (const [so, loai, chu] of [[6, 'thay thế', 'A'], [7, 'ngoại lệ', 'E']]) {
      for (const n of nhanh(t, so)) {
        const m = n.ma.match(new RegExp(`^(\\d+)\\.${chu}\\d+$`));
        if (!m) { bc.LOI(`${rel} mục ${so}: nhánh "${n.ma}" sai dạng <bước>.${chu}<n>`); continue; }
        maNhanh.push(n.ma);
        const goc0 = buocChinh.get(m[1]);
        if (!goc0) { bc.LOI(`${rel} mục ${so}: nhánh ${n.ma} rẽ từ bước ${m[1]} không có trong luồng chính`); continue; }
        const dau = n.hang[0];
        if (!dau || dau['Bước'] !== m[1]) { bc.LOI(`${rel} mục ${so}: nhánh ${n.ma} dòng đầu phải là bước gốc ${m[1]}`); continue; }
        for (const c of COT_LUONG.slice(1, 6)) {
          if ((dau[c] || '').trim() !== (goc0[c] || '').trim()) { bc.LOI(`${rel}:${dau._dong}: nhánh ${n.ma} dòng đầu khác luồng chính ở cột ${c} (chép y nguyên)`); break; }
        }
        for (const h of n.hang.slice(1)) {
          if (h['Bước'] && !h['Bước'].startsWith(`${n.ma}.`)) bc.LOI(`${rel}:${h._dong}: bước "${h['Bước']}" không thuộc nhánh ${n.ma}`);
        }
        if (chu === 'E') {
          const cuoi = n.hang.at(-1);
          if (!cuoi || cuoi['Bước'] || !RE_CUOI_NGOAI_LE.test((cuoi['Mô tả'] || '').trim())) {
            bc.LOI(`${rel} mục 7: nhánh ${n.ma} dòng cuối phải là "(<kết thúc>) · dữ liệu đã nhập: … · bản ghi: …"`);
          }
        }
        kiemO(n.hang.slice(1), `nhánh ${n.ma}`, chu === 'E');
      }
    }
    // Dòng 17: chín câu soát.
    const soat = t.match(/\*\*Đã soát:\*\*([\s\S]*?)(?:\n\n|\n##|$)/);
    if (!soat) bc.LOI(`${rel} mục 7: thiếu dòng "Đã soát"`);
    else for (let i = 1; i <= 9; i++) if (!new RegExp(`#${i}\\b`).test(soat[1])) bc.LOI(`${rel} mục 7: "Đã soát" thiếu câu #${i}`);

    // Dòng 12: {BR?} trong luồng phải có ở mục 9.
    const brChua = (chuMuc(t, 5) + chuMuc(t, 6) + chuMuc(t, 7) + chuMuc(t, 4)).match(/\{BR\?\}/g)?.length ?? 0;
    const brMuc9 = chuMuc(t, 9).match(/\{BR\?\}/g)?.length ?? 0;
    if (brChua && !brMuc9) bc.LOI(`${rel}: có ${brChua} {BR?} trong luồng mà mục 9 chưa gom`);

    // Dòng 19: hậu điều kiện.
    for (const h of thuc(bangMuc(t, 8, ['Thực thể', 'TR']), 'Thực thể')) {
      if (/^Ngoại lệ/.test(h['Thực thể'])) continue;
      for (const e of ma(h['Thực thể'], 'ENT')) if (ent.size && !ent.has(e)) bc.LOI(`${rel}:${h._dong}: hậu điều kiện ${e} không có trong erd-overview.md`);
      for (const x of ma(h['TR'], 'TR')) trTrongHau.add(x);
    }
    if (!/^\|\s*Ngoại lệ\s*\|/m.test(chuMuc(t, 8))) bc.LOI(`${rel} mục 8: thiếu dòng "Ngoại lệ"`);

    // Dòng 20: tiêu chí nghiệm thu phủ luồng chính, mọi nhánh, phân quyền.
    const dsAc = thuc(bangMuc(t, 10, ['AC', 'Phủ']), 'AC');
    const phu = dsAc.map((h) => h['Phủ'] || '').join(' | ');
    for (const h of dsAc) {
      if (/(^|\s)hoặc(\s|$)/i.test(h['Thì'] || '')) bc.LOI(`${rel}:${h._dong}: ${h['AC']} cột "Thì" có nhiều kết quả ("hoặc") — tách thành nhiều tiêu chí`);
    }
    if (!/Luồng chính/i.test(phu)) bc.LOI(`${rel} mục 10: không tiêu chí nào phủ luồng chính`);
    for (const n of maNhanh) if (!new RegExp(`(^|[^\\d.])${n.replace('.', '\\.')}(?![\\d.])`).test(phu)) bc.LOI(`${rel} mục 10: không tiêu chí nào phủ nhánh ${n}`);
    if (!laHeThong && !/Phân quyền/i.test(phu)) bc.LOI(`${rel} mục 10: không tiêu chí nào phủ phân quyền`);
  }

  // Mỗi REQ kiểm chứng bằng kiểm thử có kịch bản: nằm trong "REQ phục vụ" của ít nhất một UC (có tiêu chí nghiệm thu).
  for (const r of reqKiemThu) if (!reqCoUc.has(r)) bc.LOI(`${r} (kiểm chứng: kiểm thử) chưa có UC nào phục vụ — không có kịch bản Cho — Khi — Thì`);

  // Dòng 3 (G2-5): mỗi bước hệ thống thuộc đúng một UC.
  for (const [b, v] of buoc) {
    if (v.loai !== 'hệ thống') continue;
    const ds = buocCuaUc.get(b) ?? [];
    if (!ds.length) bc.LOI(`bước hệ thống ${b} chưa thuộc UC nào của ${cn}`);
    else if (ds.length > 1) bc.LOI(`bước hệ thống ${b} thuộc nhiều UC: ${ds.join(', ')}`);
  }
  for (const [b, ds] of buocCuaUc) if (buoc.get(b)?.loai && buoc.get(b).loai !== 'hệ thống') bc.CANH(`${ds.join(', ')} gom bước ${b} loại "${buoc.get(b).loai}"`);
  // G2-6: mỗi TR của vòng đời CN nằm trong hậu điều kiện ít nhất một UC (trừ TR theo lịch có UC hệ thống).
  for (const [x, f] of trCn) if (!trTrongHau.has(x)) bc.LOI(`${f}: ${x} không nằm trong hậu điều kiện UC nào của ${cn}`);

  // Dòng 1 (G2-9): bảng chốt uc-overview cho UC presales trong phạm vi.
  const tOv = docTep(goc, `${D5}/uc-overview.md`);
  if (!tOv) bc.LOI(`thiếu ${D5}/uc-overview.md`);
  else {
    const chot = new Map(thuc(bangMuc(tOv, 1, ['Mã gốc', 'Quyết định']), 'Mã gốc').map((h) => [boMa(h['Mã gốc']), h]));
    const idUc = new Set(uc.map((u) => u.id));
    for (const g of ctx.pv.uc) {
      const h = chot.get(g);
      if (!h) { bc.LOI(`uc-overview.md mục 1: thiếu dòng UC presales "${g}"`); continue; }
      const qd = (h['Quyết định'] || '').trim();
      if (!QUYET_DINH.includes(qd)) { bc.LOI(`uc-overview.md:${h._dong}: "${g}" quyết định "${qd || '(trống)'}" không thuộc ${QUYET_DINH.join(' / ')}`); continue; }
      if (qd === 'Bỏ' && ucPhapLy.has(g)) bc.LOI(`uc-overview.md:${h._dong}: "${g}" phục vụ REQ pháp lý, không được Bỏ`);
      if (qd !== 'Bỏ') for (const k of ma(h['UC kit'], 'UC')) if (!idUc.has(k)) bc.LOI(`uc-overview.md:${h._dong}: "${g}" trỏ ${k} chưa có file UC của ${cn}`);
      if (qd !== 'Giữ' && qd !== 'Làm rõ' && oMau(h['Lý do'])) bc.LOI(`uc-overview.md:${h._dong}: "${g}" quyết định ${qd} thiếu lý do`);
    }
  }
  bc.TIN(`${uc.length} UC; ${buocCuaUc.size}/${[...buoc.values()].filter((v) => v.loai === 'hệ thống').length} bước hệ thống được gom; ${trCn.size} TR của CN`);
  return bc;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = thamSo(process.argv.slice(2));
  const goc = a.goc ? path.resolve(a.goc) : timGoc(process.cwd());
  if (!/^CN-\d{2}$/.test(a['chuc-nang'] ?? '')) { console.error('cần --chuc-nang CN-xx'); process.exit(2); }
  process.exit(kiemUc({ goc, chucNang: a['chuc-nang'] }).in() ? 1 : 0);
}
