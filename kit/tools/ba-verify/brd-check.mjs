#!/usr/bin/env node
// Cổng máy bước 4 (/ba-chuc-nang, ba-brd): kiểm 2-ba-overview/1-brd/brd-CN-xx-<slug>.md với brief, brd-overview, ba danh mục;
// sinh mục 8 "Ma trận nguồn → REQ". Theo templates/1-brd/brd-chuc-nang.md và .claude/skills/ba-brd/checklist.md
// (dòng 1, 3, 4, 5, 6, 7, 8, 9, 13, 15). Dòng G1 góp vào: 1 (cổng máy bước 4).
// Dùng: node kit/tools/ba-verify/brd-check.mjs --chuc-nang CN-xx [--goc <repo>] [--ghi]
//   --ghi: ghi đè mục 8 từ mục 4.3, 5 và phạm vi. Không --ghi: chỉ kiểm, kể cả mục 8 đã sinh lại chưa.
// Chưa có BRD của CN → bỏ qua (chưa tới bước 4).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BaoCao, oMau, thamSo, timGoc } from './lib.mjs';
import { bangMuc, boMa, docTep, dsO, phamViCn, thuc } from './mapping.mjs';

const D1 = '2-ba-overview/1-brd';
const MUC = ['1', '2', '3', '4', '5', '6', '7', '8'];
const CAN_CU = ['pháp lý', 'presales', 'phát sinh'];
// Loại điều khoản phải có REQ hoặc lý do ở mục 4.3 (method ba-brd mục 3).
const LOAI_BAT_BUOC = ['thủ tục', 'thời hạn', 'thẩm quyền', 'điều kiện'];
// REQ nhắc giao diện, công nghệ (checklist 13) và chữ của ưu tiên, báo giá (checklist 15).
const RE_GIAO_DIEN = /màn hình|\bnút\b|\bbấm\b|\bclick\b|popup|\bform\b|\btab\b|bảng dữ liệu|\bMP-\d+|\bSCR-\d+/iu;
const RE_BAO_GIA = /ngoài báo giá|ngày công|ước lượng|\bMoSCoW\b|\bMust\b|\bShould\b/iu;
const maReq = (s) => (s || '').match(/REQ-\d+/g) ?? [];
const nguonMa = (s, tien) => [...(s || '').matchAll(new RegExp(`${tien}:\\s*\`?([^;\`]+?)\`?\\s*(?:;|$)`, 'g'))].map((m) => m[1].trim());

// Mục 8 sinh từ phạm vi, mục 5 (Nguồn) và mục 4.3.
function sinhMuc8(pv, reqCua, lyDo, loaiDk, ucMuc4) {
  const dong = [];
  for (const u of pv.uc) {
    const ld = lyDo.get(`PS:${u}`) ?? (ucMuc4.get(u) === 'mục 4.2' ? 'ngoài phạm vi (mục 4.2)' : 'n/a');
    dong.push([`\`PS:${u}\``, [...(reqCua.get(`PS:${u}`) ?? [])].join('; ') || 'n/a', ld]);
  }
  for (const d of pv.dk) {
    if (!LOAI_BAT_BUOC.some((l) => (loaiDk.get(d) || '').startsWith(l))) continue;
    dong.push([`\`PL:${d}\``, [...(reqCua.get(`PL:${d}`) ?? [])].join('; ') || 'n/a', lyDo.get(`PL:${d}`) ?? 'n/a']);
  }
  return ['## 8. Ma trận nguồn → REQ (script sinh)',
    `Sinh bằng \`node kit/tools/ba-verify/brd-check.mjs --chuc-nang <CN> --ghi\` từ mục 4.2, 4.3, 5 và brief. Không viết tay.`,
    '', '| Nguồn (mã gốc / điều khoản) | REQ | Lý do (mục 4.3) |', '| --- | --- | --- |',
    ...dong.map((h) => `| ${h.join(' | ')} |`)].join('\n');
}

export function kiemBrd({ goc, chucNang, ghi = false } = {}) {
  const cn = chucNang;
  const bc = new BaoCao(`BRD CHỨC NĂNG — ${D1}/brd-${cn}-*.md (bước 4)`);
  const thuMuc = path.join(goc, D1);
  const tep = fs.existsSync(thuMuc) ? fs.readdirSync(thuMuc).find((f) => f.startsWith(`brd-${cn}-`) && f.endsWith('.md')) : null;
  if (!tep) { bc.TIN(`chưa có BRD của ${cn}, bỏ qua`); return bc; }
  const rel = `${D1}/${tep}`;
  const t = docTep(goc, rel);
  const ctx = phamViCn(goc, cn);
  if (!ctx) { bc.LOI(`${cn} không có trong danh-muc-chuc-nang.md`); return bc; }
  const { pv, dsUc, dsDk, loaiDk } = ctx;
  bc.TIN(`phạm vi theo ${pv.tu}: ${pv.uc.length} UC presales, ${pv.dk.length} điều khoản`);

  // Checklist 1: đủ 8 mục, mục 1 có CN đúng.
  for (const m of MUC) if (!new RegExp(`^##\\s+${m}\\.\\s`, 'm').test(t)) bc.LOI(`${rel}: thiếu mục ${m}`);
  const tt = thuc(bangMuc(t, 1, ['CN']), 'CN')[0];
  if (tt && boMa(tt['CN']) !== cn) bc.LOI(`${rel} mục 1: CN ghi "${boMa(tt['CN'])}", file là của ${cn}`);

  // REQ loại B của overview.
  const tOv = docTep(goc, `${D1}/brd-overview.md`) ?? '';
  const reqB = new Set((tOv.match(/^\|\s*(REQ-\d+)\s*\|/gm) ?? []).map((x) => x.match(/REQ-\d+/)[0]));

  // Checklist 3: mục tiêu dẫn REQ loại B có thật.
  for (const h of bangMuc(t, 3, ['REQ'])?.hang ?? []) {
    for (const r of maReq(Object.values(h).join(' '))) if (!reqB.has(r)) bc.LOI(`${rel}:${h._dong}: mục tiêu dẫn ${r} không có trong brd-overview.md`);
  }

  // Mục 5: REQ loại S.
  const reqCua = new Map(); // "PS:x" / "PL:x" → Set REQ
  const dsReq = new Set();
  const bReq = bangMuc(t, 5, ['ID', 'Nội dung', 'Căn cứ']);
  if (!bReq) bc.LOI(`${rel} mục 5: không thấy bảng REQ (cột ID, Nội dung, Căn cứ)`);
  for (const h of thuc(bReq, 'ID')) {
    const id = boMa(h['ID']);
    const vt = `${rel}:${h._dong}`;
    if (!/^REQ-\d{3}$/.test(id)) { bc.LOI(`${vt}: ID "${id}" sai dạng REQ-xxx`); continue; }
    if (dsReq.has(id)) bc.LOI(`${vt}: ${id} lặp`);
    dsReq.add(id);
    if (reqB.has(id)) bc.LOI(`${vt}: ${id} là REQ loại B của overview, không viết lại ở BRD chức năng`);
    if ((h['Loại'] || '').trim() !== 'S') bc.LOI(`${vt}: ${id} Loại phải là S`);
    const canCu = (h['Căn cứ'] || '').trim();
    if (!CAN_CU.includes(canCu)) bc.LOI(`${vt}: ${id} căn cứ "${canCu || '(trống)'}" không thuộc ${CAN_CU.join(' / ')}`);
    const ps = nguonMa(h['Nguồn'], 'PS');
    const pl = nguonMa(h['Nguồn'], 'PL');
    if (canCu === 'pháp lý' && !pl.length) bc.LOI(`${vt}: ${id} căn cứ pháp lý mà không dẫn PL:<mã điều khoản>`);
    if (canCu !== 'phát sinh' && !ps.length && !pl.length) bc.LOI(`${vt}: ${id} không có nguồn PS: hoặc PL:`);
    if (canCu === 'phát sinh' && !/\[SRC:|Q-\d+/.test(h['Nguồn'] || '')) bc.LOI(`${vt}: ${id} phát sinh phải có [SRC] hoặc câu hỏi phạm vi`);
    for (const u of ps) {
      if (!dsUc.has(u)) bc.LOI(`${vt}: ${id} nguồn PS:${u} không có trong uc-presales.md`);
      else if (!pv.uc.includes(u)) bc.LOI(`${vt}: ${id} dẫn PS:${u} ngoài phạm vi ${pv.tu}`);
      if (!reqCua.has(`PS:${u}`)) reqCua.set(`PS:${u}`, new Set());
      reqCua.get(`PS:${u}`).add(id);
    }
    for (const d of pl) {
      if (!dsDk.has(d)) bc.LOI(`${vt}: ${id} nguồn PL:${d} không có trong phap-ly.md`);
      else if (!pv.dk.includes(d)) bc.LOI(`${vt}: ${id} dẫn PL:${d} ngoài phạm vi ${pv.tu}`);
      if (!reqCua.has(`PL:${d}`)) reqCua.set(`PL:${d}`, new Set());
      reqCua.get(`PL:${d}`).add(id);
    }
    const mucTieu = maReq(h['Mục tiêu phục vụ']);
    if (!mucTieu.length) bc.LOI(`${vt}: ${id} thiếu mục tiêu phục vụ (REQ loại B)`);
    for (const r of mucTieu) if (!reqB.has(r)) bc.LOI(`${vt}: ${id} phục vụ ${r} không có trong brd-overview.md`);
    if (RE_GIAO_DIEN.test(h['Nội dung'] || '')) bc.CANH(`${vt}: ${id} nhắc màn, nút, bảng dữ liệu (viết theo nhu cầu nghiệp vụ)`);
  }
  if (RE_BAO_GIA.test(t)) bc.CANH(`${rel}: có chữ ưu tiên, "ngoài báo giá" hoặc ước lượng công`);

  // Mục 4.1, 4.2: mỗi UC presales trong phạm vi rơi vào đúng một dòng.
  const ucMuc4 = new Map();
  const ghiUc = (u, noi, vt) => {
    if (ucMuc4.has(u)) bc.LOI(`${vt}: UC presales "${u}" đã ở ${ucMuc4.get(u)}`);
    else ucMuc4.set(u, noi);
  };
  for (const h of thuc(bangMuc(t, '4.1', ['Năng lực']), 'Năng lực nghiệp vụ')) {
    for (const u of dsO(h['UC presales'])) ghiUc(u, 'mục 4.1', `${rel}:${h._dong}`);
    for (const r of maReq(h['REQ'])) if (!dsReq.has(r)) bc.LOI(`${rel}:${h._dong}: mục 4.1 dẫn ${r} không có ở mục 5`);
  }
  const b42 = bangMuc(t, '4.2', ['Nội dung']);
  const hang42 = thuc(b42, 'Nội dung');
  if (!hang42.length) bc.LOI(`${rel} mục 4.2: chưa có dòng ngoài phạm vi nào`);
  for (const h of hang42) {
    const ma = Object.entries(h).find(([k]) => k.startsWith('Mã gốc'))?.[1];
    for (const u of dsO(ma).filter((x) => dsUc.has(x))) ghiUc(u, 'mục 4.2', `${rel}:${h._dong}`);
    if (oMau(h['Nguồn quyết định'])) bc.LOI(`${rel}:${h._dong}: mục 4.2 thiếu nguồn quyết định`);
  }
  for (const u of pv.uc) if (!ucMuc4.has(u)) bc.LOI(`${rel} mục 4: UC presales "${u}" trong phạm vi chưa ở mục 4.1 hoặc 4.2`);

  // Mục 4.3: nguồn không thành REQ.
  const lyDo = new Map();
  for (const h of bangMuc(t, '4.3', ['Nguồn', 'Lý do'])?.hang ?? []) {
    const n = (h['Nguồn'] || '').replace(/`/g, '').trim();
    if (oMau(n)) continue;
    if (!/^P[SL]:/.test(n)) { bc.LOI(`${rel}:${h._dong}: mục 4.3 nguồn "${n}" phải dạng PS:<mã gốc> hoặc PL:<mã>`); continue; }
    if (oMau(h['Lý do'])) bc.LOI(`${rel}:${h._dong}: mục 4.3 "${n}" thiếu lý do`);
    lyDo.set(n.replace(/:\s+/, ':'), (h['Lý do'] || '').trim());
  }

  // Checklist 6, 7: độ phủ nguồn → REQ.
  for (const u of pv.uc) {
    if (ucMuc4.get(u) === 'mục 4.2') continue;
    if (!reqCua.has(`PS:${u}`) && !lyDo.has(`PS:${u}`)) bc.LOI(`UC presales "${u}" trong phạm vi không có REQ và không có lý do ở mục 4.3`);
  }
  for (const d of pv.dk) {
    if (!LOAI_BAT_BUOC.some((l) => (loaiDk.get(d) || '').startsWith(l))) continue;
    if (!reqCua.has(`PL:${d}`) && !lyDo.has(`PL:${d}`)) bc.LOI(`điều khoản ${d} (${loaiDk.get(d)}) trong phạm vi không có REQ và không có lý do ở mục 4.3`);
  }

  // Mục 8: sinh, ghi hoặc so.
  const sinh = sinhMuc8(pv, reqCua, lyDo, loaiDk, ucMuc4).replace('<CN>', cn);
  // Mục 8 chạy tới heading cấp 2 kế tiếp (mục 9 Rủi ro) hoặc hết file.
  const RE_MUC8 = /^## 8\.[\s\S]*?(?=^## \d|(?![\s\S]))/m;
  const cu = t.match(RE_MUC8)?.[0]?.trim() ?? '';
  if (ghi) {
    const moi = RE_MUC8.test(t) ? t.replace(RE_MUC8, `${sinh}\n\n`).replace(/\n{3,}/g, '\n\n') : `${t.trimEnd()}\n\n${sinh}\n`;
    fs.writeFileSync(path.join(goc, rel), moi);
    bc.TIN(`đã ghi ${rel} mục 8`);
  } else if (cu !== sinh.trim()) {
    bc.LOI(`${rel} mục 8 khác mục 4.3, 5 hiện tại (sửa tay hoặc chưa sinh lại): chạy brd-check.mjs --chuc-nang ${cn} --ghi`);
  }
  bc.TIN(`${dsReq.size} REQ`);
  return bc;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = thamSo(process.argv.slice(2));
  const goc = a.goc ? path.resolve(a.goc) : timGoc(process.cwd());
  if (!/^CN-\d{2}$/.test(a['chuc-nang'] ?? '')) { console.error('cần --chuc-nang CN-xx'); process.exit(2); }
  process.exit(kiemBrd({ goc, chucNang: a['chuc-nang'], ghi: !!a.ghi }).in() ? 1 : 0);
}
