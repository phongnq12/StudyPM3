#!/usr/bin/env node
// Chỉ số theo dõi chất lượng spec (thiết kế mục 12 việc 9; hợp đồng S9). Không phải cổng chặn: số để BA lead quyết
// kéo stakeholder vào sớm hơn hay bổ sung góc review.
//   - Tồn đọng: Q theo trạng thái và mức rủi ro; ASM theo trạng thái; tỷ lệ tồn đọng hóa ra sai = ASM sai / (đã xác nhận + sai).
//   - Số lần chạy gate: số commit đổi hồ sơ gate (chạy lại = mất hiệu lực hoặc không đạt).
//   - Số lần sửa spec vì prototype: commit có "(từ prototype)" (quy ước ba-chuc-nang).
// Dùng: node kit/tools/ba-verify/chi-so.mjs [--goc <repo>] [--chuc-nang CN-xx] [--json]
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { SO_DU_AN, bangMarkdown, oMau, thamSo, timGoc } from './lib.mjs';

const git = (goc, args) => {
  const r = spawnSync('git', args, { cwd: goc, encoding: 'utf8' });
  return r.status === 0 ? r.stdout : '';
};
const dem = (s) => s.split('\n').filter(Boolean).length;

function tonDong(t) {
  const q = (bangMarkdown(t, ['Q', 'Câu hỏi'])?.hang ?? []).filter((h) => !oMau(h['Câu hỏi']));
  const asm = (bangMarkdown(t, ['ASM', 'Nội dung'])?.hang ?? []).filter((h) => !oMau(h['Nội dung']));
  const tt = (h) => (h['Trạng thái'] ?? '').trim();
  const moTheoRuiRo = {};
  for (const h of q.filter((x) => tt(x) === 'mở')) {
    const m = (h['Mức rủi ro'] ?? '').trim() || 'chưa ghi';
    moTheoRuiRo[m] = (moTheoRuiRo[m] ?? 0) + 1;
  }
  const xn = asm.filter((h) => tt(h) === 'đã xác nhận').length;
  const sai = asm.filter((h) => tt(h) === 'sai').length;
  return {
    q: q.length, q_mo: q.filter((h) => tt(h) === 'mở').length, q_da_quyet: q.filter((h) => tt(h) === 'đã quyết').length,
    q_mo_theo_rui_ro: moTheoRuiRo,
    asm: asm.length, asm_mo: asm.filter((h) => tt(h) === 'mở').length, asm_xac_nhan: xn, asm_sai: sai,
    ty_le_sai: xn + sai ? Math.round((sai / (xn + sai)) * 100) : null,
  };
}

function congDong(ds) {
  if (!ds.length) return {};
  const ra = {};
  for (const d of ds) {
    for (const [k, v] of Object.entries(d)) {
      if (typeof v === 'number') ra[k] = (ra[k] ?? 0) + v;
      else if (v && typeof v === 'object') { ra[k] ??= {}; for (const [m, n] of Object.entries(v)) ra[k][m] = (ra[k][m] ?? 0) + n; }
    }
  }
  ra.ty_le_sai = ra.asm_xac_nhan + ra.asm_sai ? Math.round((ra.asm_sai / (ra.asm_xac_nhan + ra.asm_sai)) * 100) : null;
  return ra;
}

export function chiSo(goc, cn) {
  const tang = cn ? path.join('chuc-nang', cn) : 'du-an';
  // Tầng dự án: cộng hai sổ (bước 1 ở 1-ba-init/, từ bước 2 ở du-an/).
  const ds = (cn ? [path.join(tang, 'open-questions.md')] : SO_DU_AN).map((f) => path.join(goc, f)).filter((f) => fs.existsSync(f));
  const ra = { tang: cn ?? 'dự án', ...congDong(ds.map((f) => tonDong(fs.readFileSync(f, 'utf8')))) };
  const gate = {};
  for (const g of cn ? ['G1', 'G2', 'G3', 'G4'] : ['G0']) {
    const n = dem(git(goc, ['log', '--format=%H', '--', path.join(tang, `${g}.md`)]));
    if (n) gate[g] = n;
  }
  ra.so_lan_chay_gate = gate;
  ra.sua_vi_prototype = dem(git(goc, ['log', '--format=%H', '-F', '--grep=(từ prototype)', ...(cn ? [`--grep=spec(${cn}/`, '--all-match'] : [])]));
  return ra;
}

function inBang(ds) {
  const dong = ['| Tầng | Q (mở / đã quyết) | Q mở theo rủi ro | ASM (mở / đã xác nhận / sai) | Tồn đọng hóa ra sai | Lần chạy gate | Sửa vì prototype |',
    '| --- | --- | --- | --- | --- | --- | --- |'];
  for (const x of ds) {
    const rr = Object.entries(x.q_mo_theo_rui_ro ?? {}).map(([k, v]) => `${k} ${v}`).join(', ') || 'n/a';
    const gate = Object.entries(x.so_lan_chay_gate).map(([k, v]) => `${k}: ${v}`).join(', ') || 'n/a';
    dong.push(`| ${x.tang} | ${x.q ?? 0} (${x.q_mo ?? 0} / ${x.q_da_quyet ?? 0}) | ${rr} | ${x.asm ?? 0} (${x.asm_mo ?? 0} / ${x.asm_xac_nhan ?? 0} / ${x.asm_sai ?? 0}) | ${x.ty_le_sai === null || x.ty_le_sai === undefined ? 'n/a' : `${x.ty_le_sai}%`} | ${gate} | ${x.sua_vi_prototype} |`);
  }
  return dong.join('\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = thamSo(process.argv.slice(2));
  const goc = a.goc ? path.resolve(a.goc) : timGoc(process.cwd());
  const dsCn = a['chuc-nang'] ? [a['chuc-nang']]
    : (fs.existsSync(path.join(goc, 'chuc-nang')) ? fs.readdirSync(path.join(goc, 'chuc-nang')).filter((x) => /^CN-\d{2}$/.test(x)).sort() : []);
  const ds = [...(a['chuc-nang'] ? [] : [chiSo(goc, null)]), ...dsCn.map((c) => chiSo(goc, c))];
  console.log(a.json ? JSON.stringify(ds, null, 2) : inBang(ds));
}
