#!/usr/bin/env node
// Cổng máy bước 9 (/ba-chuc-nang, ba-rules): kiểm 2-ba-overview/6-business-rules/rules-CN-xx-<slug>.md với UC, vòng đời, PROC
// của CN và rules-overview. Theo templates/6-business-rules/rules-chuc-nang.md và .claude/skills/ba-rules/checklist.md
// (dòng 1, 2, 3, 4, 13, 17, 20). Dòng G2 kiểm được: 7 (gateway, điều kiện TR, {BR?} có BR), 21 (tham số ở mục 7).
// Dùng: node kit/tools/ba-verify/rules-check.mjs --chuc-nang CN-xx [--goc <repo>]
// Chưa có file rule của CN → bỏ qua (chưa tới bước 9).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BaoCao, RE_CAN_XAC_NHAN, bangMarkdown, oMau, thamSo, timGoc } from './lib.mjs';
import { bangMuc, boMa, docTep, thuc } from './mapping.mjs';

const D2 = '2-ba-overview/2-business-process';
const D4 = '2-ba-overview/4-state-machine';
const D5 = '2-ba-overview/5-actor-usecase';
const D6 = '2-ba-overview/6-business-rules';
const MUC = ['1', '2', '3', '4', '5', '6', '7', '8'];
const LOAI = ['ràng buộc', 'tính toán', 'suy diễn', 'phân quyền', 'thời hạn', 'kiểm liên trường'];
const O_QUYEN = ['✔', '—', '-', '?'];
const RE_CXN = new RegExp(RE_CAN_XAC_NHAN.source);
const ma = (s, tien) => (s || '').match(new RegExp(`${tien}-\\d+(?:\\.\\d+)?`, 'g')) ?? [];
const dsTep = (goc, d, loc) => (fs.existsSync(path.join(goc, d)) ? fs.readdirSync(path.join(goc, d)).filter(loc).sort() : []);

export function kiemRules({ goc, chucNang } = {}) {
  const cn = chucNang;
  const bc = new BaoCao(`RULE CHỨC NĂNG — ${D6}/rules-${cn}-*.md (bước 9)`);
  const tep = dsTep(goc, D6, (f) => f.startsWith(`rules-${cn}-`) && f.endsWith('.md'))[0];
  if (!tep) { bc.TIN(`chưa có file rule của ${cn}, bỏ qua`); return bc; }
  const rel = `${D6}/${tep}`;
  const t = docTep(goc, rel);

  // Checklist 1: đủ 8 mục.
  for (const m of MUC) if (!new RegExp(`^##\\s+${m}\\.\\s`, 'm').test(t)) bc.LOI(`${rel}: thiếu mục ${m}`);

  // Đối tượng của CN: UC (mục 1 "Chức năng"), TR (vòng đời có CN sở hữu), bước PROC (danh mục chức năng).
  const uc = new Map(); // UC-xxx → file
  for (const f of dsTep(goc, D5, (x) => /^UC-\d+-.*\.md$/.test(x))) {
    const nd = docTep(goc, `${D5}/${f}`);
    const dongCn = nd.match(/^\|\s*Chức năng\s*\|\s*(CN-\d+)/m);
    if (dongCn && dongCn[1] === cn) uc.set(f.match(/^UC-\d+/)[0], `${D5}/${f}`);
  }
  const tr = new Map(); // TR-xxx → { dk: điều kiện, vt }
  const tepVd = [];
  for (const f of dsTep(goc, D4, (x) => /^ENT-\d+-.*\.md$/.test(x))) {
    const r = `${D4}/${f}`;
    const nd = docTep(goc, r);
    const dau = bangMarkdown(nd.split(/^## 1\./m)[0], ['CN sở hữu']);
    if (!thuc(dau, 'CN sở hữu').some((h) => boMa(h['CN sở hữu']) === cn)) continue;
    tepVd.push(r);
    for (const h of thuc(bangMuc(nd, 4, ['TR', 'Điều kiện']), 'TR')) tr.set(boMa(h['TR']), { dk: h['Điều kiện'] || '', vt: `${r}:${h._dong}` });
  }
  const tDm = docTep(goc, `${D2}/danh-muc-chuc-nang.md`) ?? '';
  const dongCn = thuc(bangMuc(tDm, 1, ['CN', 'PROC']), 'CN').find((h) => boMa(h['CN']) === cn);
  const buoc = new Map(); // PROC-xx.yy → { rule, vt }
  for (const p of ma(dongCn?.['PROC'], 'PROC')) {
    const f = dsTep(goc, D2, (x) => x.startsWith(`${p}-`) && x.endsWith('.md'))[0];
    if (!f) continue;
    for (const h of thuc(bangMuc(docTep(goc, `${D2}/${f}`), 'Bảng bước', ['Bước', 'Rule']), 'Bước')) {
      buoc.set(boMa(h['Bước']), { rule: h['Rule'] || '', vt: `${D2}/${f}:${h._dong}` });
    }
  }
  bc.TIN(`${cn}: ${uc.size} UC, ${tr.size} TR, ${buoc.size} bước PROC`);

  // Rule chung.
  const tOv = docTep(goc, `${D6}/rules-overview.md`) ?? '';
  const brChung = new Set(thuc(bangMuc(tOv, 1, ['BR']), 'BR').map((h) => boMa(h['BR'])));
  const thamSoOv = new Set(thuc(bangMuc(tOv, 4, ['BR']), 'BR').map((h) => boMa(h['BR'])));

  // Nơi áp dụng của mọi BR (riêng và chung).
  const apDung = new Map(); // ID đối tượng → Set BR
  const ghiAp = (br, s, vt) => {
    const ds = [...ma(s, 'UC'), ...ma(s, 'TR'), ...ma(s, 'PROC')];
    if (!ds.length) bc.LOI(`${vt}: ${br} thiếu nơi áp dụng`);
    for (const x of ds) {
      const coThat = x.startsWith('UC') ? uc.has(x) : x.startsWith('TR') ? tr.has(x) : buoc.has(x);
      if (!coThat) bc.LOI(`${vt}: ${br} áp dụng tại ${x} không có trong ${cn}`);
      if (!apDung.has(x)) apDung.set(x, new Set());
      apDung.get(x).add(br);
    }
  };
  for (const h of thuc(bangMuc(t, 2, ['BR']), 'BR')) {
    const br = boMa(h['BR']);
    if (!brChung.has(br)) bc.LOI(`${rel}:${h._dong}: mục 2 dẫn ${br} không có ở rules-overview.md mục 1`);
    ghiAp(br, Object.entries(h).find(([k]) => k.startsWith('Áp dụng'))?.[1], `${rel}:${h._dong}`);
  }

  // Mục 3: BR riêng.
  const brRieng = new Map();
  const bBr = bangMuc(t, 3, ['BR', 'Loại', 'Phát biểu']);
  if (!bBr) bc.LOI(`${rel} mục 3: không thấy bảng BR (cột BR, Loại, Phát biểu)`);
  for (const h of thuc(bBr, 'BR')) {
    const br = boMa(h['BR']);
    const vt = `${rel}:${h._dong}`;
    if (!/^BR-\d{3}$/.test(br)) { bc.LOI(`${vt}: mã "${br}" sai dạng BR-xxx`); continue; }
    if (brRieng.has(br)) bc.LOI(`${vt}: ${br} lặp`);
    if (brChung.has(br)) bc.LOI(`${vt}: ${br} là rule chung, chỉ dẫn ở mục 2`);
    brRieng.set(br, h);
    if (oMau(h['Tên'])) bc.LOI(`${vt}: ${br} thiếu tên`);
    if (!LOAI.includes((h['Loại'] || '').trim())) bc.LOI(`${vt}: ${br} loại "${(h['Loại'] || '').trim() || '(trống)'}" không thuộc ${LOAI.join(' / ')}`);
    if (oMau(h['Phát biểu'])) bc.LOI(`${vt}: ${br} thiếu phát biểu`);
    if (oMau(h['Căn cứ'])) bc.LOI(`${vt}: ${br} thiếu căn cứ`);
    ghiAp(br, Object.entries(h).find(([k]) => k.startsWith('Áp dụng'))?.[1], vt);
  }
  const brCo = new Set([...brChung, ...brRieng.keys()]);

  // Checklist 3: không còn {BR?}; BR dẫn trong UC, vòng đời có thật.
  for (const [u, r] of uc) {
    const nd = docTep(goc, r);
    const con = (nd.match(/\{BR\?\}/g) ?? []).length;
    if (con) bc.LOI(`${r}: còn ${con} {BR?} chưa thay bằng mã BR`);
    for (const b of new Set(ma(nd, 'BR'))) if (!brCo.has(b)) bc.LOI(`${r}: dẫn ${b} không có ở rule của ${cn} hoặc rule chung`);
    if (!apDung.has(u) && /BR-\d+/.test(nd)) bc.CANH(`${u} dẫn BR nhưng không BR nào ghi ${u} ở "Áp dụng tại"`);
  }
  for (const r of tepVd) {
    const nd = docTep(goc, r);
    const con = (nd.match(/\{BR\?\}/g) ?? []).length;
    if (con) bc.LOI(`${r}: còn ${con} {BR?} chưa thay bằng mã BR`);
  }

  // Checklist 4: điều kiện TR và bước có rule đều có BR áp dụng.
  for (const [x, v] of tr) {
    if (oMau(v.dk)) continue;
    if (!apDung.has(x) && !ma(v.dk, 'BR').some((b) => brCo.has(b))) bc.LOI(`${v.vt}: ${x} có điều kiện mà không BR nào áp dụng`);
  }
  for (const [x, v] of buoc) {
    if (oMau(v.rule) || /không có|không chạm/i.test(v.rule)) continue;
    if (!apDung.has(x) && !ma(v.rule, 'BR').some((b) => brCo.has(b))) bc.LOI(`${v.vt}: ${x} có rule mà không BR nào áp dụng`);
  }

  // Checklist 20 (G2-21): tham số [CẦN XÁC NHẬN] có dòng mục 7 và rules-overview mục 4.
  const muc7 = new Set(thuc(bangMuc(t, 7, ['BR']), 'BR').map((h) => boMa(h['BR'])));
  for (const [br, h] of brRieng) {
    if (!RE_CXN.test(Object.values(h).join(' '))) continue;
    if (!muc7.has(br)) bc.CANH(`${br} có [CẦN XÁC NHẬN] mà không có dòng ở ${rel} mục 7`);
    if (!thamSoOv.has(br)) bc.CANH(`${br} có [CẦN XÁC NHẬN] mà không có dòng ở rules-overview.md mục 4`);
  }

  // Checklist 17: ma trận phân quyền phủ mọi UC; ô hợp lệ.
  const bQ = bangMuc(t, 6, ['UC', 'Hành động']);
  const ucCoQuyen = new Set();
  for (const h of thuc(bQ, 'UC')) {
    const u = ma(h['UC'], 'UC')[0];
    if (!u) continue;
    if (!uc.has(u)) bc.LOI(`${rel}:${h._dong}: ma trận phân quyền có ${u} không thuộc ${cn}`);
    ucCoQuyen.add(u);
    for (const [k, v] of Object.entries(h)) {
      if (!k.startsWith('ACT-')) continue;
      const o = (v || '').trim();
      if (!O_QUYEN.includes(o) && !/^\[CẦN XÁC NHẬN: Q-\d+\]$/.test(o)) bc.LOI(`${rel}:${h._dong}: ô ${u} × ${k.split(' ')[0]} là "${o || '(trống)'}", phải là ✔ / — / ? / [CẦN XÁC NHẬN: Q-xxx]`);
    }
  }
  for (const u of uc.keys()) if (!ucCoQuyen.has(u)) bc.LOI(`${rel} mục 6: ${u} chưa có dòng trong ma trận phân quyền`);

  bc.TIN(`${brRieng.size} BR riêng, ${apDung.size} đối tượng có BR áp dụng`);
  return bc;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = thamSo(process.argv.slice(2));
  const goc = a.goc ? path.resolve(a.goc) : timGoc(process.cwd());
  if (!/^CN-\d{2}$/.test(a['chuc-nang'] ?? '')) { console.error('cần --chuc-nang CN-xx'); process.exit(2); }
  process.exit(kiemRules({ goc, chucNang: a['chuc-nang'] }).in() ? 1 : 0);
}
