#!/usr/bin/env node
// Cổng máy: chạy mọi kiểm tra của ba-verify trên repo dự án. Thoát 1 nếu còn LỖI.
// Dùng: node kit/tools/ba-verify/check-all.mjs [--goc <repo>] [--chuc-nang CN-xx] [--gate approve]
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { BaoCao, duyetBuoc, duyetFile, thamSo, timGoc } from './lib.mjs';
import { kiemDauVao, kiemRuiRo } from './dau-vao-check.mjs';
import { kiemMapping } from './map-check.mjs';
import { kiemMappingCn } from './mapping.mjs';
import { kiemBrd } from './brd-check.mjs';
import { kiemRules } from './rules-check.mjs';
import { kiemBrief } from './brief-check.mjs';
import { kiemErd } from './erd-check.mjs';
import { kiemState } from './state-check.mjs';
import { kiemSrs } from './srs-lap-rap.mjs';
import { kiemUc } from './uc-check.mjs';
import { kiemTruyVet } from './trace-check.mjs';
import { kiemThuatNgu } from './term-check.mjs';
import { trangThaiGate } from './gate-check.mjs';

const a = thamSo(process.argv.slice(2));
const goc = a.goc ? path.resolve(a.goc) : timGoc(process.cwd());
const day = path.dirname(fileURLToPath(import.meta.url));
let loi = 0;

loi += kiemDauVao({ goc }).in();
loi += kiemMapping({ goc }).in();
if (a['chuc-nang']) {
  const cn = { goc, chucNang: a['chuc-nang'] };
  const fQ = path.join(goc, 'chuc-nang', a['chuc-nang'], 'open-questions.md');
  if (fs.existsSync(fQ)) {
    const bcQ = new BaoCao(`CÂU HỎI, GIẢ ĐỊNH — chuc-nang/${a['chuc-nang']}/open-questions.md`);
    kiemRuiRo(bcQ, path.relative(goc, fQ), fs.readFileSync(fQ, 'utf8'));
    loi += bcQ.in();
  }
  for (const kiem of [kiemBrief, kiemBrd, kiemMappingCn, kiemErd, kiemState, kiemUc, kiemRules, kiemSrs]) loi += kiem(cn).in();
}
loi += kiemTruyVet({ goc, chucNang: a['chuc-nang'], gate: a.gate }).in();
loi += kiemThuatNgu({ goc }).in();

const coMermaid = duyetBuoc(goc, ['.md'])
  .filter((f) => fs.readFileSync(f, 'utf8').includes('```mermaid'));
console.log('== SƠ ĐỒ MERMAID');
if (!coMermaid.length) console.log('   không có sơ đồ');
else if (!fs.existsSync(path.join(day, 'node_modules', 'mermaid'))) {
  console.log(`   BỎ QUA ${coMermaid.length} tệp có sơ đồ — chưa cài phụ thuộc: cd kit/tools/ba-verify && npm install`);
} else {
  for (const f of coMermaid) {
    const r = spawnSync(process.execPath, [path.join(day, 'mmcheck.mjs'), f], { encoding: 'utf8' });
    const sai = r.status !== 0;
    console.log(`   ${sai ? 'LỖI' : 'OK '} ${path.relative(goc, f)}`);
    if (sai) { loi++; console.log((r.stdout || r.stderr).split('\n').filter((x) => x.includes('❌')).map((x) => `     ${x.trim()}`).join('\n')); }
  }
}

// Quy trình nghiệp vụ: BPMN 2.0 bằng draw.io theo skill ba-bpmn (kiểm bằng bpmn_lint.py).
const lintBpmn = path.join(goc, '.claude', 'skills', 'ba-bpmn', 'scripts', 'bpmn_lint.py');
function lintSoDo(thuMuc, ds, them) {
  const r = spawnSync('python3', ['-I', lintBpmn, ...ds.map((x) => path.join(thuMuc, x)), ...them], { encoding: 'utf8' });
  if (r.error) { console.log('   BỎ QUA — không chạy được python3'); return; }
  const dong = (r.stdout || '').trim().split('\n');
  const ket = dong.pop();
  console.log(`   ${r.status === 0 ? 'OK ' : 'LỖI'} ${ds.join(', ')} — ${ket}`);
  dong.filter((x) => x.startsWith('Chặn merge')).forEach((x) => console.log(`     ${x}`));
  if (r.status !== 0) loi++;
}

// Bản đồ quy trình dựng ngược của bước 1: cap-0/ (luồng chính), cap-1/ (bản đồ tổng, bắt buộc — dau-vao-check kiểm có
// tệp), cap-2/QT-nn-<slug>/ (luồng UC từng QT, kiểm như cấp 2, không có bảng bước).
const thuMucBanDo = path.join(goc, '1-ba-init', '0-dau-vao', 'ban-do-quy-trinh');
if (fs.existsSync(thuMucBanDo)) {
  console.log('== SƠ ĐỒ BPMN (1-ba-init/0-dau-vao/ban-do-quy-trinh)');
  if (!fs.existsSync(lintBpmn)) console.log('   BỎ QUA — chưa có skill ba-bpmn');
  else {
    const svgTrong = (d) => (fs.existsSync(d) ? fs.readdirSync(d).filter((f) => f.endsWith('.drawio.svg')) : []);
    for (const [cap, them] of [['cap-1', ['--cap', '1']], ['cap-0', ['--cap', '0']]]) {
      const d = path.join(thuMucBanDo, cap);
      if (svgTrong(d).length) lintSoDo(d, svgTrong(d), them);
    }
    const d2 = path.join(thuMucBanDo, 'cap-2');
    for (const q of fs.existsSync(d2) ? fs.readdirSync(d2).filter((f) => /^QT-\d{2}-/.test(f)) : []) {
      if (svgTrong(path.join(d2, q)).length) lintSoDo(path.join(d2, q), svgTrong(path.join(d2, q)), []);
    }
  }
}

const thuMucQt = path.join(goc, '2-ba-overview', '2-business-process');
console.log('== SƠ ĐỒ BPMN (2-ba-overview/2-business-process)');
if (!fs.existsSync(thuMucQt)) console.log('   chưa có thư mục');
else {
  const tep = fs.readdirSync(thuMucQt);
  const md = tep.filter((f) => f.endsWith('.md'));
  for (const f of md) {
    const nd = fs.readFileSync(path.join(thuMucQt, f), 'utf8');
    if (/```mermaid\s*\n\s*(flowchart|graph)/.test(nd)) {
      loi++; console.log(`   LỖI ${f}: sơ đồ quy trình vẽ bằng Mermaid; phải vẽ BPMN 2.0 bằng draw.io (skill ba-bpmn)`);
    }
    const ma = f.match(/^(PROC-\d+)-/);
    if (ma && !tep.some((x) => x.startsWith(ma[1] + '-') && x.endsWith('.drawio.svg'))) {
      loi++; console.log(`   LỖI ${f}: chưa có sơ đồ BPMN ${ma[1]}-*.drawio.svg`);
    }
  }
  const svg = tep.filter((f) => f.endsWith('.drawio.svg'));
  if (!svg.length) console.log('   không có sơ đồ');
  else if (!fs.existsSync(lintBpmn)) console.log('   BỎ QUA — chưa có skill ba-bpmn');
  else {
    const chay = (ds, them) => lintSoDo(thuMucQt, ds, them);
    const tong = svg.filter((f) => f.startsWith('process-overview'));
    if (tong.length) chay(tong, ['--cap', '1']);
    for (const f of svg.filter((x) => /^PROC-\d+-/.test(x))) {
      const bang = md.find((m) => m === f.replace(/\.drawio\.svg$/, '.md'));
      chay([f], bang ? ['--bang-buoc', path.join(thuMucQt, bang)] : []);
    }
  }
}

// Trạng thái gate: chỉ báo (mất hiệu lực không phải lỗi của cổng máy; lệnh của bước sau tự khóa bằng gate-check --can).
if (spawnSync('git', ['rev-parse', '--git-dir'], { cwd: goc }).status === 0) {
  console.log(`== GATE (${a['chuc-nang'] ?? 'tầng dự án'})`);
  for (const m of trangThaiGate(goc, a['chuc-nang'] ?? null)) {
    console.log(`   ${['MẤT HIỆU LỰC', 'hồ sơ lỗi', 'không kiểm được'].includes(m.tt) ? 'CẢNH BÁO ' : ''}${m.g} ${m.tt}: ${m.ly_do}`);
  }
}

console.log(loi ? `\nCỔNG MÁY: CHƯA ĐẠT — ${loi} lỗi` : '\nCỔNG MÁY: ĐẠT');
process.exit(loi ? 1 : 0);
