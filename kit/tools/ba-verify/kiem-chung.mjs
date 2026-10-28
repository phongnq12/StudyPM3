#!/usr/bin/env node
// Nhóm C ở G4 — kiểm chứng bằng sản xuất thử (ba-gate, kit/templates/ho-so/kiem-chung.schema.md). Agent quality-reviewer chạy
// từng chế độ và trả JSON; phiên chính ghi nguyên văn vào chuc-nang/CN-xx/kiem-chung/. Script này tính đạt / không đạt từ
// con số, không tin kết luận của agent, và đối chiếu "đã rà" với tổng số thật để bắt agent rà thiếu.
//   C1 test sinh được · C2 không phải đoán · C3 hai bên hiểu giống nhau · C4 đảo ngược ma trận
// Dòng G4 kiểm được: 17, 18, 19, 20.
// Dùng: node kit/tools/ba-verify/kiem-chung.mjs --chuc-nang CN-xx [--goc <repo>] [--so-voi <ket-qua.json>] [--xuat]
//   --so-voi: so kết quả với lần chạy đã biết (kiểm tính ổn định, evals/kiem-chung/); --xuat: in JSON kết quả.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BaoCao, thamSo, timGoc } from './lib.mjs';
import { bangMuc, boMa, docTep, thuc } from './mapping.mjs';
import { dsUcCn, nhanh } from './uc-check.mjs';

const ma = (s, tien) => (s || '').match(new RegExp(`${tien}-\\d+(?:\\.\\d+)?`, 'g')) ?? [];
const dsTep = (goc, d, loc) => (fs.existsSync(path.join(goc, d)) ? fs.readdirSync(path.join(goc, d)).filter(loc).sort() : []);

// Điều đúng theo tài liệu BA: REQ loại S, UC, AC, nhánh, và ba ma trận để so với C4.
export function duLieuBa(goc, cn) {
  const brd = dsTep(goc, '2-ba-overview/1-brd', (x) => x.startsWith(`brd-${cn}-`) && x.endsWith('.md'))[0];
  const req = brd ? thuc(bangMuc(docTep(goc, `2-ba-overview/1-brd/${brd}`), 5, ['ID', 'Căn cứ']), 'ID').map((h) => boMa(h['ID'])) : [];
  const uc = dsUcCn(goc, cn);
  const ac = [];
  const khoaNhanh = [];
  const buocUc = {};
  const trUc = {};
  for (const u of uc) {
    for (const h of thuc(bangMuc(u.t, 10, ['AC', 'Phủ']), 'AC')) ac.push(`${u.id}/${h['AC'].trim()}`);
    khoaNhanh.push(`${u.id}|chinh`);
    for (const so of [6, 7]) for (const n of nhanh(u.t, so)) khoaNhanh.push(`${u.id}|${n.ma}`);
    for (const b of ma(u.m1.get('Bước quy trình'), 'PROC')) buocUc[b] = u.id;
    for (const h of thuc(bangMuc(u.t, 8, ['Thực thể', 'TR']), 'Thực thể')) for (const x of ma(h['TR'], 'TR')) trUc[x] = u.id;
  }
  const quyen = new Set();
  const rules = dsTep(goc, '2-ba-overview/6-business-rules', (x) => x.startsWith(`rules-${cn}-`) && x.endsWith('.md'))[0];
  if (rules) {
    for (const h of thuc(bangMuc(docTep(goc, `2-ba-overview/6-business-rules/${rules}`), 6, ['UC', 'Hành động']), 'UC')) {
      const u = ma(h['UC'], 'UC')[0];
      for (const [k, v] of Object.entries(h)) {
        const a = k.match(/^ACT-\d+/)?.[0];
        if (u && a && (v || '').trim() === '✔') quyen.add(`${u}|${(h['Hành động'] || '').trim()}|${a}`);
      }
    }
  }
  return { req, uc: uc.map((u) => u.id), ac, khoaNhanh, buocUc, trUc, quyen };
}

function docJson(bc, thuMuc, ten) {
  const f = path.join(thuMuc, ten);
  if (!fs.existsSync(f)) { bc.LOI(`thiếu ${ten}`); return null; }
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { bc.LOI(`${ten}: không phải JSON hợp lệ (${e.message})`); return null; }
}
const thieu = (canCo, daRa) => canCo.filter((x) => !daRa.includes(x));
const tom = (ds) => `${ds.slice(0, 8).join(', ')}${ds.length > 8 ? ` … (+${ds.length - 8})` : ''}`;

export function kiemKiemChung({ goc, chucNang } = {}) {
  const cn = chucNang;
  const bc = new BaoCao(`NHÓM C — chuc-nang/${cn}/kiem-chung/ (G4, kiểm chứng bằng sản xuất thử)`);
  const thuMuc = path.join(goc, 'chuc-nang', cn, 'kiem-chung');
  const kq = { C1: false, C2: false, C3: false, C4: false, so_lieu: {} };
  if (!fs.existsSync(thuMuc)) { bc.LOI(`chưa có thư mục chuc-nang/${cn}/kiem-chung/ (chưa chạy nhóm C)`); return Object.assign(bc, { kq }); }
  const ba = duLieuBa(goc, cn);
  bc.TIN(`tài liệu BA: ${ba.req.length} REQ, ${ba.uc.length} UC, ${ba.ac.length} AC, ${ba.khoaNhanh.length} nhánh`);

  // C1: mọi REQ và mọi AC sinh được ca kiểm thử.
  const c1 = docJson(bc, thuMuc, 'C1-qc.json');
  if (c1) {
    const daRa = c1.da_ra ?? [];
    const sot = thieu([...ba.req, ...ba.ac], daRa);
    const khong = c1.khong_sinh_duoc ?? [];
    if (sot.length) bc.LOI(`C1: agent chưa rà hết — thiếu ${sot.length}/${ba.req.length + ba.ac.length}: ${tom(sot)}`);
    for (const x of khong) bc.LOI(`C1: ${x.id} không sinh được ca kiểm thử — ${x.ly_do ?? '(không ghi lý do)'}`);
    kq.C1 = !sot.length && !khong.length;
    kq.so_lieu.C1 = { da_ra: daRa.length, khong_sinh_duoc: khong.length };
  }
  // C2: không giả định nào ảnh hưởng hành vi nghiệp vụ.
  const c2 = docJson(bc, thuMuc, 'C2-dev.json');
  if (c2) {
    const sot = thieu(ba.uc, c2.da_ra ?? []);
    const gd = (c2.gia_dinh ?? []).filter((x) => x.anh_huong_nghiep_vu === true);
    if (sot.length) bc.LOI(`C2: agent chưa rà hết — thiếu UC: ${tom(sot)}`);
    for (const x of gd) bc.LOI(`C2: ${x.id} Dev phải tự đoán: ${x.noi_dung}`);
    kq.C2 = !sot.length && !gd.length;
    kq.so_lieu.C2 = { gia_dinh_nghiep_vu: gd.length, gia_dinh_khac: (c2.gia_dinh ?? []).length - gd.length };
  }
  // C3: hai bản diễn giải phủ cùng tập nhánh, phiên so sánh không thấy khác.
  const d1 = docJson(bc, thuMuc, 'C3-dien-giai-1.json');
  const d2 = docJson(bc, thuMuc, 'C3-dien-giai-2.json');
  const so = docJson(bc, thuMuc, 'C3-so-sanh.json');
  if (d1 && d2 && so) {
    const khoa = (d) => (d.hanh_vi ?? []).map((x) => `${x.id}|${x.nhanh}`);
    let dat = true;
    for (const [ten, d] of [['bản 1', d1], ['bản 2', d2]]) {
      const sot = thieu(ba.khoaNhanh, khoa(d));
      if (sot.length) { dat = false; bc.LOI(`C3 ${ten}: chưa diễn giải ${sot.length} nhánh: ${tom(sot)}`); }
    }
    for (const x of so.khac ?? []) { dat = false; bc.LOI(`C3: ${x.id} ${x.nhanh} hai bên hiểu khác — "${x.ban_1}" ≠ "${x.ban_2}"`); }
    kq.C3 = dat;
    kq.so_lieu.C3 = { khac: (so.khac ?? []).length };
  }
  // C4: ma trận dựng ngược từ mô tả hành vi trùng ma trận BA đã điền.
  const c4 = docJson(bc, thuMuc, 'C4-dao-nguoc.json');
  if (c4) {
    let lech = 0;
    const soMap = (ten, baMap, agMap) => {
      for (const k of new Set([...Object.keys(baMap), ...Object.keys(agMap ?? {})])) {
        if (baMap[k] !== (agMap ?? {})[k]) { lech++; bc.LOI(`C4 ${ten}: ${k} — BA ghi ${baMap[k] ?? '(không có)'}, dựng ngược ra ${(agMap ?? {})[k] ?? '(không có)'}`); }
      }
    };
    soMap('bước → UC', ba.buocUc, c4.buoc_uc);
    soMap('TR → UC', ba.trUc, c4.tr_uc);
    const agQuyen = new Set((c4.quyen ?? []).filter((x) => x.o === '✔').map((x) => `${x.uc}|${x.hanh_dong}|${x.act}`));
    for (const k of ba.quyen) if (!agQuyen.has(k)) { lech++; bc.LOI(`C4 quyền: ${k} — BA cho phép, dựng ngược không thấy`); }
    for (const k of agQuyen) if (!ba.quyen.has(k)) { lech++; bc.LOI(`C4 quyền: ${k} — dựng ngược thấy, BA không cho phép`); }
    kq.C4 = lech === 0;
    kq.so_lieu.C4 = { lech };
  }
  for (const c of ['C1', 'C2', 'C3', 'C4']) bc.TIN(`${c}: ${kq[c] ? 'ĐẠT' : 'KHÔNG ĐẠT'}`);
  return Object.assign(bc, { kq });
}

// Kiểm tính ổn định: so kết quả với lần chạy đã biết; lệch là dấu hiệu prompt hoặc model cần hiệu chỉnh.
export function soVoi(bc, kq, fMongDoi) {
  const md = JSON.parse(fs.readFileSync(fMongDoi, 'utf8'));
  for (const c of ['C1', 'C2', 'C3', 'C4']) {
    if (c in md && md[c] !== kq[c]) bc.LOI(`ổn định: ${c} lần này ${kq[c] ? 'ĐẠT' : 'KHÔNG ĐẠT'}, mong đợi ${md[c] ? 'ĐẠT' : 'KHÔNG ĐẠT'}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = thamSo(process.argv.slice(2));
  const goc = a.goc ? path.resolve(a.goc) : timGoc(process.cwd());
  if (!/^CN-\d{2}$/.test(a['chuc-nang'] ?? '')) { console.error('cần --chuc-nang CN-xx'); process.exit(2); }
  const bc = kiemKiemChung({ goc, chucNang: a['chuc-nang'] });
  if (a['so-voi']) soVoi(bc, bc.kq, path.resolve(a['so-voi']));
  if (a.xuat) console.log(JSON.stringify(bc.kq, null, 2));
  process.exit(bc.in() ? 1 : 0);
}
