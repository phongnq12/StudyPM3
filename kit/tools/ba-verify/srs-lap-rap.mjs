#!/usr/bin/env node
// Cổng máy bước 12 (/ba-chuc-nang, ba-srs): lắp ráp và kiểm 3-ba-detail/SRS/modules/CN-xx-<slug>.md. Sinh mục 3 (UC, năm dòng
// dẫn đúng mẫu /ba-export --dong-goi), 4 (ENT), 5 (BR), 6 (SCR), 12 (truy vết) từ các layer của CN; kiểm đủ heading,
// ID dẫn có thật, không còn {BR?}, bảng chênh lệch có mọi UC presales không Giữ và UC thêm mới của CN, dòng CN ở
// 3-ba-detail/SRS/srs.md chương 10. Theo templates/SRS/srs-module.md, .claude/skills/ba-srs/method.md mục 3 (T1).
// Dòng G4 kiểm được: 1 (cổng máy bước 12), 10 (phần máy của bảng chênh lệch); góp vào 5 (ID dẫn có thật).
// Dùng: node kit/tools/ba-verify/srs-lap-rap.mjs --chuc-nang CN-xx [--goc <repo>] [--ghi]
//   --ghi: ghi đè mục 3, 4, 5, 6, 12 (giữ phần agent viết). Không --ghi: chỉ kiểm, kể cả các mục đó đã sinh lại chưa.
// Chưa có SRS module của CN → bỏ qua (chưa tới bước 12).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BaoCao, RE_CAN_XAC_NHAN, bangMarkdown, thamSo, timGoc } from './lib.mjs';
import { bangMuc, boMa, docTep, thuc } from './mapping.mjs';

const D = {
  brd: '2-ba-overview/1-brd', qt: '2-ba-overview/2-business-process', erd: '2-ba-overview/3-erd', vd: '2-ba-overview/4-state-machine',
  uc: '2-ba-overview/5-actor-usecase', br: '2-ba-overview/6-business-rules', scr: '3-ba-detail/Screens', srs: '3-ba-detail/SRS',
};
const MUC = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];
const MUC_SINH = { 3: 'Yêu cầu chức năng theo UC', 4: 'Yêu cầu dữ liệu', 5: 'Quy tắc nghiệp vụ', 6: 'Giao diện người dùng', 12: 'Bảng truy vết' };
const RE_ID = (tien) => new RegExp(`(?<![\\p{L}\\d-])${tien}-\\d+(?:\\.\\d+)?(?![\\p{L}\\d])`, 'gu');
const ids = (s, tien) => [...new Set((s || '').match(RE_ID(tien)) ?? [])];
const sapXep = (a) => [...a].sort();
const dsTep = (goc, d, loc) => (fs.existsSync(path.join(goc, d)) ? fs.readdirSync(path.join(goc, d)).filter(loc).sort() : []);
const dongBang = (nd, nhan) => nd.match(new RegExp(`^\\|\\s*${nhan}\\s*\\|([^\\n]*)$`, 'm'))?.[1] ?? '';
const tieuDe = (nd, id) => (nd.match(/^#\s+(.*)$/m)?.[1] ?? id).replace(new RegExp(`^${id}\\s*[—–-]?\\s*`), '').trim();
// Nội dung mục "## <so>." (không gồm heading) tới "## " kế tiếp.
const muc = (t, so) => t.match(new RegExp(`^## ${so}\\.[^\\n]*\\n([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, 'm'));

// Thu thập đối tượng của CN từ các layer.
function thuThap(goc, cn) {
  const tDm = docTep(goc, `${D.qt}/danh-muc-chuc-nang.md`) ?? '';
  const dongCn = thuc(bangMuc(tDm, 1, ['CN', 'PROC']), 'CN').find((h) => boMa(h['CN']) === cn);
  // Bước PROC theo thứ tự luồng (thứ tự PROC trong danh mục, rồi thứ tự bảng bước); REQ của từng bước.
  const buoc = [];
  for (const p of ids(dongCn?.['PROC'], 'PROC')) {
    const f = dsTep(goc, D.qt, (x) => x.startsWith(`${p}-`) && x.endsWith('.md'))[0];
    if (!f) continue;
    for (const h of thuc(bangMuc(docTep(goc, `${D.qt}/${f}`), 'Bảng bước', ['Bước', 'REQ']), 'Bước')) {
      buoc.push({ ma: boMa(h['Bước']), req: ids(h['REQ'], 'REQ') });
    }
  }
  // Vòng đời: TR → (Từ, Đến).
  const tr = new Map();
  const entVd = new Map();
  for (const f of dsTep(goc, D.vd, (x) => /^ENT-\d+-.*\.md$/.test(x))) {
    const nd = docTep(goc, `${D.vd}/${f}`);
    entVd.set(f.match(/^ENT-\d+/)[0], `${D.vd}/${f}`);
    for (const h of thuc(bangMuc(nd, 4, ['TR', 'Từ', 'Đến']), 'TR')) {
      tr.set(boMa(h['TR']), { tu: ids(h['Từ'], 'ST')[0], den: ids(h['Đến'], 'ST')[0] });
    }
  }
  // UC của CN.
  const uc = new Map();
  for (const f of dsTep(goc, D.uc, (x) => /^UC-\d+-.*\.md$/.test(x))) {
    const rel = `${D.uc}/${f}`;
    const nd = docTep(goc, rel);
    if (ids(dongBang(nd, 'Chức năng'), 'CN')[0] !== cn) continue;
    const id = f.match(/^UC-\d+/)[0];
    uc.set(id, {
      id, rel, nd, ten: tieuDe(nd, id), req: ids(dongBang(nd, 'REQ phục vụ'), 'REQ'),
      buoc: ids(dongBang(nd, 'Bước quy trình'), 'PROC'), br: ids(nd, 'BR'), scr: ids(dongBang(nd, 'Màn'), 'SCR'),
      tr: ids(nd, 'TR'), ent: ids(nd, 'ENT'),
    });
  }
  // SCR của CN (mục 1 cột CN); gắn UC theo cột "UC (bước)".
  const scr = new Map();
  for (const f of dsTep(goc, D.scr, (x) => /^SCR-\d+-.*\.md$/.test(x) && !x.startsWith('SCR-000'))) {
    const rel = `${D.scr}/${f}`;
    const nd = docTep(goc, rel);
    const h = thuc(bangMuc(nd, 1, ['SCR', 'CN']), 'SCR')[0];
    if (!h || boMa(h['CN']) !== cn) continue;
    const id = f.match(/^SCR-\d+/)[0];
    const ucs = ids(Object.entries(h).find(([k]) => k.startsWith('UC'))?.[1], 'UC');
    scr.set(id, { id, rel, ten: tieuDe(nd, id), uc: ucs });
    for (const u of ucs) if (uc.has(u) && !uc.get(u).scr.includes(id)) uc.get(u).scr.push(id);
  }
  // Thứ tự UC theo bước đầu tiên của UC trong luồng; UC không bước nào xếp cuối theo mã.
  const viTri = new Map(buoc.map((b, i) => [b.ma, i]));
  const thuTuUc = [...uc.values()].sort((a, b) => {
    const va = Math.min(...a.buoc.map((x) => viTri.get(x) ?? 1e9), 1e9);
    const vb = Math.min(...b.buoc.map((x) => viTri.get(x) ?? 1e9), 1e9);
    return va - vb || a.id.localeCompare(b.id);
  });
  // ENT: ERD chức năng mục 3.
  const tepErd = dsTep(goc, D.erd, (x) => x.startsWith(`erd-${cn}-`) && x.endsWith('.md'))[0];
  const ent = thuc(tepErd && bangMuc(docTep(goc, `${D.erd}/${tepErd}`), 3, ['ENT', 'Tên']), 'ENT').map((h) => ({
    id: boMa(h['ENT']), ten: (h['Tên'] || '').trim(), cnSoHuu: ids(h['CN sở hữu'], 'CN')[0],
    vaiTro: (Object.entries(h).find(([k]) => k.startsWith('Vai trò'))?.[1] || '').trim(),
  }));
  // BR: riêng (mục 3), chung áp dụng (mục 2); loại BR chung từ rules-overview.
  const tepBr = dsTep(goc, D.br, (x) => x.startsWith(`rules-${cn}-`) && x.endsWith('.md'))[0];
  const tBr = tepBr ? docTep(goc, `${D.br}/${tepBr}`) : '';
  const tOvBr = docTep(goc, `${D.br}/rules-overview.md`) ?? '';
  const loaiChung = new Map(thuc(bangMuc(tOvBr, 1, ['BR', 'Loại']), 'BR').map((h) => [boMa(h['BR']), (h['Loại'] || '').trim()]));
  const brRieng = thuc(bangMuc(tBr, 3, ['BR', 'Loại']), 'BR').map((h) => ({ id: boMa(h['BR']), loai: (h['Loại'] || '').trim() }));
  const brChung = thuc(bangMuc(tBr, 2, ['BR']), 'BR').map((h) => ({ id: boMa(h['BR']), loai: loaiChung.get(boMa(h['BR'])) || '' }));
  // REQ của CN: BRD chức năng mục 5.
  const tepBrd = dsTep(goc, D.brd, (x) => x.startsWith(`brd-${cn}-`) && x.endsWith('.md'))[0];
  const req = thuc(tepBrd && bangMuc(docTep(goc, `${D.brd}/${tepBrd}`), 5, ['ID']), 'ID').map((h) => boMa(h['ID']));
  return {
    dongCn, buoc, tr, entVd, uc, thuTuUc, scr, ent, tepErd, brRieng, brChung, tepBr, req, tepBrd,
  };
}

// Sinh nội dung mục 3, 4, 5, 6, 12 (không gồm heading).
function sinh(cn, d) {
  const ra = {};
  const bang = (dau, hang) => [`| ${dau.join(' | ')} |`, `| ${dau.map(() => '---').join(' | ')} |`, ...hang.map((h) => `| ${h.join(' | ')} |`)].join('\n');
  const ds = (a) => (a.length ? sapXep(a).join(', ') : '—');
  ra[3] = ['Mỗi UC một mục, thứ tự theo luồng nghiệp vụ; năm dòng dẫn đúng mẫu.', '',
    ...d.thuTuUc.flatMap((u) => {
      const k = [`### ${u.id} ${u.ten}`, `- Luồng: dẫn ${u.id} (${u.rel})`, `- Rule áp dụng: ${ds(u.br)}`,
        `- Màn hình: ${ds(u.scr)}`, `- Tiêu chí nghiệm thu: dẫn ${u.id} mục 10`, `- REQ đáp ứng: ${ds(u.req)}`];
      const trUc = sapXep(u.tr.filter((x) => d.tr.has(x)));
      if (trUc.length) {
        k.push(`- Trạng thái dữ liệu: ${trUc.map((x) => `${x} (${d.tr.get(x).tu ? `${d.tr.get(x).tu} ` : ''}→ ${d.tr.get(x).den ?? '?'})`).join(', ')}`);
      }
      return k;
    })].join('\n');
  ra[4] = bang(['ENT', 'Tên', 'Quan hệ với CN', 'Data dictionary', 'Vòng đời'], d.ent.map((e) => {
    const soHuu = e.cnSoHuu === cn || /sở hữu|mới/.test(e.vaiTro);
    return [e.id, e.ten, soHuu ? 'sở hữu' : `dẫn từ ${e.cnSoHuu ?? '—'}`,
      soHuu ? `${D.erd}/${d.tepErd} mục 4` : `${D.erd}/erd-overview.md`, d.entVd.get(e.id) ?? '—'];
  }));
  ra[5] = bang(['BR', 'Loại', 'Phạm vi (riêng / chung)', 'File'], [
    ...d.brRieng.map((b) => [b.id, b.loai, 'riêng', `${D.br}/${d.tepBr}`]),
    ...d.brChung.map((b) => [b.id, b.loai, 'chung', `${D.br}/rules-overview.md`]),
  ]);
  ra[6] = `${bang(['SCR', 'Tên', 'UC', 'File'], [...d.scr.values()].map((s) => [s.id, s.ten, ds(s.uc), s.rel]))}\n\nQuy ước chung: ${D.scr}/SCR-000-quy-uoc-chung.md.`;
  ra[12] = bang(['REQ', 'Bước PROC', 'UC', 'BR', 'SCR', 'ENT'], d.req.map((r) => {
    const ucR = d.thuTuUc.filter((u) => u.req.includes(r));
    const gom = (k) => ds([...new Set(ucR.flatMap((u) => u[k]))]);
    return [r, ds(d.buoc.filter((b) => b.req.includes(r)).map((b) => b.ma)), ds(ucR.map((u) => u.id)), gom('br'), gom('scr'), gom('ent')];
  }));
  return ra;
}

export function kiemSrs({ goc, chucNang, ghi = false } = {}) {
  const cn = chucNang;
  const bc = new BaoCao(`SRS MODULE — ${D.srs}/modules/${cn}-*.md (bước 12)`);
  const tep = dsTep(goc, `${D.srs}/modules`, (x) => x.startsWith(`${cn}-`) && x.endsWith('.md'))[0];
  if (!tep) { bc.TIN(`chưa có SRS module của ${cn}, bỏ qua`); return bc; }
  const rel = `${D.srs}/modules/${tep}`;
  let t = docTep(goc, rel);
  const d = thuThap(goc, cn);
  if (!d.dongCn) { bc.LOI(`${cn} không có trong danh-muc-chuc-nang.md`); return bc; }
  bc.TIN(`${cn}: ${d.uc.size} UC, ${d.req.length} REQ, ${d.brRieng.length} BR riêng, ${d.brChung.length} BR chung, ${d.scr.size} SCR, ${d.ent.length} ENT`);

  // Đủ heading (checklist 2).
  if (!/^## Đọc nhanh/m.test(t)) bc.LOI(`${rel}: thiếu bảng "Đọc nhanh"`);
  for (const m of MUC) if (!new RegExp(`^## ${m}\\.\\s`, 'm').test(t)) bc.LOI(`${rel}: thiếu mục ${m}`);

  // Mục sinh: ghi hoặc so.
  const moi = sinh(cn, d);
  for (const [so, ten] of Object.entries(MUC_SINH)) {
    const nd = moi[so].trim();
    const khop = muc(t, so);
    if (ghi) {
      const dau = `## ${so}. ${ten} (script sinh)\n${nd}\n\n`;
      t = khop ? t.replace(new RegExp(`^## ${so}\\.[^\\n]*\\n[\\s\\S]*?(?=^## |(?![\\s\\S]))`, 'm'), dau) : `${t.trimEnd()}\n\n${dau}`;
    } else if (!khop || khop[1].trim() !== nd) {
      bc.LOI(`${rel} mục ${so} khác các layer hiện tại (sửa tay hoặc chưa sinh lại): chạy srs-lap-rap.mjs --chuc-nang ${cn} --ghi`);
    }
  }
  if (ghi) {
    t = t.replace(/^(\|\s*CN-\d+\s*\|[^|\n]*\|[^|\n]*\|)\s*[^|\n]*?\s*(\|)/m, '$1 script $2');
    fs.writeFileSync(path.join(goc, rel), t.replace(/\n{3,}/g, '\n\n'));
    t = docTep(goc, rel);
    bc.TIN(`đã ghi ${rel} mục ${Object.keys(MUC_SINH).join(', ')}`);
  }

  // Không còn {BR?} (ở SRS và UC của CN); [CẦN XÁC NHẬN] trong SRS.
  if (/\{BR\?\}/.test(t)) bc.LOI(`${rel}: còn {BR?}`);
  for (const u of d.uc.values()) if (/\{BR\?\}/.test(u.nd)) bc.LOI(`${u.rel}: còn {BR?} (bước 9 chưa điền)`);
  if (new RegExp(RE_CAN_XAC_NHAN.source).test(t)) bc.CANH(`${rel}: còn [CẦN XÁC NHẬN] (chặn G4)`);

  // ID dẫn có thật (G4-5): UC, BR, SCR, ENT, REQ, TR, PROC bước.
  const coThat = {
    UC: new Set(dsTep(goc, D.uc, (x) => /^UC-\d+-/.test(x)).map((x) => x.match(/^UC-\d+/)[0])),
    SCR: new Set(['SCR-000', ...dsTep(goc, D.scr, (x) => /^SCR-\d+-/.test(x)).map((x) => x.match(/^SCR-\d+/)[0])]),
    BR: new Set([...d.brRieng.map((b) => b.id), ...ids(docTep(goc, `${D.br}/rules-overview.md`), 'BR'),
      ...dsTep(goc, D.br, (x) => /^rules-CN-/.test(x)).flatMap((x) => ids(docTep(goc, `${D.br}/${x}`), 'BR'))]),
    ENT: new Set([...d.ent.map((e) => e.id), ...ids(docTep(goc, `${D.erd}/erd-overview.md`), 'ENT')]),
    REQ: new Set([...d.req, ...ids(docTep(goc, `${D.brd}/brd-overview.md`), 'REQ'), ...ids(muc(t, 8)?.[1], 'REQ')]),
    TR: new Set(d.tr.keys()),
  };
  for (const [tien, tap] of Object.entries(coThat)) {
    for (const x of ids(t, tien)) if (!tap.has(x)) bc.LOI(`${rel}: dẫn ${x} không có thật`);
  }
  const buocCo = new Set(d.buoc.map((b) => b.ma));
  for (const x of ids(t, 'PROC').filter((y) => y.includes('.'))) if (!buocCo.has(x)) bc.CANH(`${rel}: dẫn ${x} không phải bước PROC của ${cn}`);

  // Độ phủ truy vết (G4-5, 6): REQ tới bước và UC.
  for (const r of d.req) {
    if (!d.buoc.some((b) => b.req.includes(r))) bc.CANH(`${r} chưa gắn bước PROC nào`);
    if (![...d.uc.values()].some((u) => u.req.includes(r))) bc.CANH(`${r} chưa có UC nào đáp ứng`);
  }

  // Bảng chênh lệch mục 10 (G4-10, phần máy): UC presales của CN có quyết định khác Giữ; UC thêm mới của CN.
  const tUco = docTep(goc, `${D.uc}/uc-overview.md`);
  if (tUco) {
    const m10 = muc(t, 10)?.[1] ?? '';
    for (const h of thuc(bangMuc(tUco, 1, ['Mã gốc', 'CN', 'Quyết định']), 'Mã gốc')) {
      if (boMa(h['CN']) !== cn) continue;
      const qd = (h['Quyết định'] || '').trim();
      if (!qd) { bc.LOI(`uc-overview.md: "${boMa(h['Mã gốc'])}" của ${cn} chưa có quyết định chốt`); continue; }
      if (qd === 'Giữ') continue;
      if (!m10.includes(`\`${boMa(h['Mã gốc'])}\``)) bc.LOI(`${rel} mục 10: thiếu \`${boMa(h['Mã gốc'])}\` (${qd} ở uc-overview.md)`);
    }
    for (const h of thuc(bangMuc(tUco, 2, ['UC kit', 'CN']), 'UC kit')) {
      if (boMa(h['CN']) !== cn) continue;
      for (const u of ids(h['UC kit'], 'UC')) if (!ids(m10, 'UC').includes(u)) bc.LOI(`${rel} mục 10: thiếu ${u} (Thêm mới ở uc-overview.md mục 2)`);
    }
  }

  // Dòng CN ở SRS chung chương 10.
  const tSrs = docTep(goc, `${D.srs}/srs.md`);
  const dongSrs = tSrs && thuc(bangMarkdown(muc(tSrs, 10)?.[1] ?? '', ['CN', 'SRS module']), 'CN').find((h) => boMa(h['CN']) === cn);
  if (!dongSrs) bc.LOI(`${D.srs}/srs.md chương 10: không có dòng ${cn}`);
  else if (!(dongSrs['SRS module'] || '').includes(`modules/${tep}`)) bc.LOI(`${D.srs}/srs.md chương 10: dòng ${cn} chưa trỏ ${rel}`);
  else if (/chưa/.test(dongSrs['Trạng thái'] || '')) bc.CANH(`${D.srs}/srs.md chương 10: dòng ${cn} trạng thái "${dongSrs['Trạng thái']}"`);
  return bc;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = thamSo(process.argv.slice(2));
  const goc = a.goc ? path.resolve(a.goc) : timGoc(process.cwd());
  if (!/^CN-\d{2}$/.test(a['chuc-nang'] ?? '')) { console.error('cần --chuc-nang CN-xx'); process.exit(2); }
  process.exit(kiemSrs({ goc, chucNang: a['chuc-nang'], ghi: !!a.ghi }).in() ? 1 : 0);
}
