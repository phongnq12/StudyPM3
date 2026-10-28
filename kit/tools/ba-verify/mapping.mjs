#!/usr/bin/env node
// Cổng máy bước 5 (/ba-chuc-nang, ba-process phần B): sinh và kiểm 2-ba-overview/2-business-process/mapping-CN-xx.md từ bảng
// bước của các PROC-xx-<slug>.md thuộc CN. Theo templates/2-business-process/mapping.md, business-process.md và
// .claude/skills/ba-process/method.md B1, B9. Dòng G1 kiểm được: 2 (độ phủ 100%).
// Dùng: node kit/tools/ba-verify/mapping.mjs --chuc-nang CN-xx [--goc <repo>] [--ghi]
//   --ghi: ghi đè mục 1–7 của mapping-CN-xx.md (giữ mục 8). Không --ghi: chỉ kiểm, kể cả mục 1–7 đã sinh lại chưa.
// Chưa có PROC chi tiết nào của CN → bỏ qua (chưa tới bước 5).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BaoCao, RE_MA_DIEU_KHOAN, bangMarkdown, oMau, thamSo, timGoc } from './lib.mjs';

const D0 = '1-ba-init/0-dau-vao';
const D2 = '2-ba-overview/2-business-process';
const LOAI = ['hệ thống', 'thủ công', 'hệ thống ngoài'];
const MUC_SINH = 7;

export const docTep = (goc, rel) => {
  const f = path.join(goc, rel);
  return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null;
};
export const boMa = (s) => (s || '').replace(/`/g, '').replace(/\[ASM-(?:\d+|T\d+)\]/g, '').replace(/^P[SL]:\s*/, '').trim();
export const dsO = (s) => (s || '').split(';').map(boMa).filter((x) => x && x !== '—' && x !== '-' && !/^n\/a$/i.test(x));
const maMp = (s) => (s || '').match(/MP-\d+/g) ?? [];
const maReq = (s) => (s || '').match(/REQ-\d+/g) ?? [];

// Bảng trong mục "<so>." (hoặc mục có tên chứa chuỗi) của file; _dong là số dòng thật trong file.
export function bangMuc(text, muc, cot) {
  const dong = text.split(/\r?\n/);
  const re = typeof muc === 'number' ? new RegExp(`^#{1,6}\\s+${muc}\\.?\\s`) : new RegExp(`^#{1,6}\\s+.*${muc}`);
  const bd = dong.findIndex((d) => re.test(d));
  if (bd < 0) return null;
  const cap = dong[bd].match(/^#+/)[0].length;
  let kt = dong.findIndex((d, i) => i > bd && /^#{1,6}\s/.test(d) && d.match(/^#+/)[0].length <= cap);
  if (kt < 0) kt = dong.length;
  const b = bangMarkdown(dong.slice(bd + 1, kt).join('\n'), cot);
  for (const h of b?.hang ?? []) h._dong += bd + 1;
  return b;
}
// Chữ của mục "<so>." (tới heading cùng cấp hoặc cao hơn).
export function chuMuc(text, so) {
  const dong = text.split(/\r?\n/);
  const bd = dong.findIndex((d) => new RegExp(`^#{1,6}\\s+${so}\\.?\\s`).test(d));
  if (bd < 0) return '';
  const cap = dong[bd].match(/^#+/)[0].length;
  let kt = dong.findIndex((d, i) => i > bd && /^#{1,6}\s/.test(d) && d.match(/^#+/)[0].length <= cap);
  return dong.slice(bd + 1, kt < 0 ? dong.length : kt).join('\n');
}
export const thuc = (b, cot) => (b?.hang ?? []).filter((h) => !oMau(h[cot]));

// Phạm vi của CN: brief (mục 3 UC presales, 5 MP, 6 điều khoản) hoặc dòng CN của danh mục; REQ từ BRD chức năng.
function phamVi(goc, cn, dongCn, dsUc, dsDk) {
  const brief = docTep(goc, `chuc-nang/${cn}/brief.md`);
  let uc, man, dk, tu;
  if (brief) {
    tu = `chuc-nang/${cn}/brief.md`;
    uc = [...chuMuc(brief, 3).matchAll(/`([^`]+)`/g)].map((m) => boMa(m[1])).filter((x) => dsUc.has(x));
    man = maMp(chuMuc(brief, 5));
    dk = chuMuc(brief, 6).split(/[\s|;,`]+/).map((x) => x.replace(/^PL:/, '')).filter((x) => RE_MA_DIEU_KHOAN.test(x) && dsDk.has(x));
  } else {
    tu = `${D2}/danh-muc-chuc-nang.md (chưa có brief)`;
    uc = dsO(dongCn['UC presales']);
    man = maMp(dongCn['MP']);
    dk = dsO(dongCn['Điều khoản']);
  }
  let req = [];
  const tepBrd = fs.existsSync(path.join(goc, '2-ba-overview/1-brd'))
    ? fs.readdirSync(path.join(goc, '2-ba-overview/1-brd')).find((f) => f.startsWith(`brd-${cn}-`) && f.endsWith('.md')) : null;
  if (tepBrd) {
    req = docTep(goc, `2-ba-overview/1-brd/${tepBrd}`).split(/\r?\n/)
      .map((d) => d.match(/^\|\s*(REQ-\d+)\s*\|/)).filter(Boolean).map((m) => m[1]);
  }
  const uniq = (a) => [...new Set(a)];
  return { tu, uc: uniq(uc), man: uniq(man), dk: uniq(dk), req: uniq(req) };
}

// Sinh nội dung mục 1–7.
function sinhMuc(buoc, pv, gan, lyDo, khoang) {
  const bang = (dau, hang) => [`| ${dau.join(' | ')} |`, `| ${dau.map(() => '---').join(' | ')} |`,
    ...hang.map((h) => `| ${h.join(' | ')} |`)].join('\n');
  const loaiNguon = [['UC presales', 'uc'], ['MP', 'man'], ['Điều khoản', 'dk'], ['REQ', 'req']];
  const doPhu = loaiNguon.map(([ten, k]) => {
    const tong = pv[k].length;
    const g = pv[k].filter((x) => gan[k].has(x)).length;
    const l = pv[k].filter((x) => !gan[k].has(x) && lyDo.has(x)).length;
    return [ten, tong, g, l, tong - g - l];
  });
  const sang = (k, hienThi) => pv[k].map((x) => [hienThi(x), gan[k].has(x) ? [...gan[k].get(x)].join('; ') : '—']);
  const muc = [
    ['1. Độ phủ (script sinh)', bang(['Nguồn', 'Trong phạm vi', 'Gắn bước', 'Có lý do (mục 8)', 'Thiếu'], doPhu)],
    ['2. UC presales → bước (script sinh)', bang(['Mã gốc', 'Bước'], sang('uc', (x) => `\`${x}\``))],
    ['3. MP → bước (script sinh)', bang(['MP', 'Bước'], sang('man', (x) => x))],
    ['4. Điều khoản → bước (script sinh)', bang(['Mã điều khoản', 'Bước'], sang('dk', (x) => x))],
    ['5. REQ → bước (script sinh)', bang(['REQ', 'Bước'], sang('req', (x) => x))],
    ['6. Bước → nguồn (script sinh)', bang(['Bước', 'Loại', 'Actor', 'REQ', 'UC presales', 'MP', 'Điều khoản'],
      buoc.map((b) => [b.ma, b.loai, b.actor, b.req.join('; '), b.uc.map((x) => `\`${x}\``).join('; '), b.man.join('; '), b.dk.join('; ')]))],
    ['7. Khoảng trống (script sinh)', khoang.length ? bang(['Loại', 'Đối tượng'], khoang) : 'Không có.'],
  ];
  return muc.map(([t, nd]) => `## ${t}\n${nd}`).join('\n\n');
}

// Đầu vào chung của các cổng máy tầng chức năng: dòng CN trong danh mục, ba danh mục, phạm vi theo brief.
// Trả về null khi chưa có danh mục chức năng hoặc CN không có trong đó.
export function phamViCn(goc, cn) {
  const tDm = docTep(goc, `${D2}/danh-muc-chuc-nang.md`);
  const dongCn = tDm && thuc(bangMuc(tDm, 1, ['CN', 'PROC']), 'CN').find((h) => boMa(h['CN']) === cn);
  if (!dongCn) return null;
  const dsUc = new Set(thuc(bangMuc(docTep(goc, `${D0}/uc-presales.md`) ?? '', 1, ['Mã gốc']), 'Mã gốc').map((h) => boMa(h['Mã gốc'])));
  const hangDk = thuc(bangMuc(docTep(goc, `${D0}/phap-ly.md`) ?? '', 2, ['Mã điều khoản']), 'Mã điều khoản');
  const loaiDk = new Map(hangDk.map((h) => [boMa(h['Mã điều khoản']), (h['Loại'] || '').trim()]));
  const dsDk = new Set(loaiDk.keys());
  return { dongCn, dsUc, dsDk, loaiDk, pv: phamVi(goc, cn, dongCn, dsUc, dsDk) };
}

// Mục 9 của PROC: mỗi bước Loại "hệ thống ngoài" có ít nhất một dòng; không ô trống (timeout, lỗi, thất bại giữa chừng).
const COT_NGOAI = ['Hệ thống ngoài', 'Dữ liệu gửi', 'Đồng bộ', 'Thời gian chờ', 'Khi lỗi', 'Thất bại giữa chừng', 'Thử lại', 'Nguồn'];
function kiemLoiGoiNgoai(bc, rel, t, hangBuoc) {
  const ngoai = hangBuoc.filter((h) => (h['Loại'] || '').trim() === 'hệ thống ngoài').map((h) => boMa(h['Bước']));
  const coMuc = /^##\s+9\.\s/m.test(t);
  if (!coMuc) { bc.LOI(`${rel}: thiếu mục 9 "Lời gọi hệ thống ngoài"`); return; }
  const bang = bangMuc(t, 9, ['Bước', 'Hệ thống ngoài']);
  const coDong = new Set();
  for (const h of thuc(bang, 'Bước')) {
    const ma = (h['Bước'] || '').match(/PROC-\d+\.\d+/)?.[0];
    if (!ma) continue;
    coDong.add(ma);
    if (!ngoai.includes(ma)) bc.CANH(`${rel}:${h._dong}: ${ma} có lời gọi hệ thống ngoài mà Loại ở bảng bước không phải "hệ thống ngoài"`);
    for (const c of COT_NGOAI) {
      const v = (Object.entries(h).find(([k]) => k.startsWith(c))?.[1] || '').trim();
      if (!v || v === '—' || /^<.*>$/.test(v)) bc.LOI(`${rel}:${h._dong}: ${ma} thiếu "${c}" (timeout, lỗi, thất bại giữa chừng phải nêu rõ)`);
    }
    const dongBo = (Object.entries(h).find(([k]) => k.startsWith('Đồng bộ'))?.[1] || '').trim();
    if (dongBo && !['đồng bộ', 'bất đồng bộ'].includes(dongBo)) bc.LOI(`${rel}:${h._dong}: ${ma} cột Đồng bộ "${dongBo}" phải là đồng bộ / bất đồng bộ`);
  }
  for (const ma of ngoai) if (!coDong.has(ma)) bc.LOI(`${rel} mục 9: bước ${ma} gọi hệ thống ngoài mà chưa có dòng xử lý lỗi`);
}

export function kiemMappingCn({ goc, chucNang, ghi = false } = {}) {
  const cn = chucNang;
  const bc = new BaoCao(`MAPPING — ${D2}/mapping-${cn}.md (bước 5)`);
  const tDm = docTep(goc, `${D2}/danh-muc-chuc-nang.md`);
  if (!tDm) { bc.TIN('chưa có danh-muc-chuc-nang.md, bỏ qua'); return bc; }
  const dongCn = thuc(bangMuc(tDm, 1, ['CN', 'PROC']), 'CN').find((h) => boMa(h['CN']) === cn);
  if (!dongCn) { bc.LOI(`${cn} không có trong danh-muc-chuc-nang.md`); return bc; }
  const dsProc = (dongCn['PROC'] || '').match(/PROC-\d+/g) ?? [];
  const tepD2 = fs.existsSync(path.join(goc, D2)) ? fs.readdirSync(path.join(goc, D2)) : [];
  const tepProc = new Map(dsProc.map((p) => [p, tepD2.find((f) => f.startsWith(`${p}-`) && f.endsWith('.md'))]));
  if (![...tepProc.values()].some(Boolean)) { bc.TIN(`chưa có PROC chi tiết nào của ${cn}, bỏ qua`); return bc; }

  const dsUc = new Set(thuc(bangMuc(docTep(goc, `${D0}/uc-presales.md`) ?? '', 1, ['Mã gốc']), 'Mã gốc').map((h) => boMa(h['Mã gốc'])));
  const dsMan = new Set(thuc(bangMuc(docTep(goc, `${D0}/man-presales.md`) ?? '', 2, ['Mã màn']), 'Mã màn').map((h) => boMa(h['Mã màn'])));
  const dsDk = new Set(thuc(bangMuc(docTep(goc, `${D0}/phap-ly.md`) ?? '', 2, ['Mã điều khoản']), 'Mã điều khoản').map((h) => boMa(h['Mã điều khoản'])));
  const pv = phamVi(goc, cn, dongCn, dsUc, dsDk);
  bc.TIN(`phạm vi theo ${pv.tu}: ${pv.uc.length} UC presales, ${pv.man.length} MP, ${pv.dk.length} điều khoản, ${pv.req.length} REQ`);

  // Bảng bước của mọi PROC.
  const buoc = [];
  for (const [p, f] of tepProc) {
    if (!f) { bc.LOI(`${p} thuộc ${cn} chưa có file ${D2}/${p}-<slug>.md`); continue; }
    const rel = `${D2}/${f}`;
    const tProc = docTep(goc, rel);
    const b = bangMuc(tProc, 'Bảng bước', ['Bước', 'Loại', 'Actor']);
    if (!b) { bc.LOI(`${rel}: không thấy bảng bước (cột Bước, Loại, Actor)`); continue; }
    for (const h of thuc(b, 'Bước')) {
      const ma = boMa(h['Bước']);
      const vt = `${rel}:${h._dong}`;
      if (!new RegExp(`^${p}\\.\\d{2}$`).test(ma)) { bc.LOI(`${vt}: bước "${ma}" sai dạng ${p}.yy`); continue; }
      const loai = (h['Loại'] || '').trim();
      const actor = (h['Actor'] || '').trim();
      const x = {
        ma, loai, actor, vt, req: maReq(h['REQ']), uc: dsO(h['UC presales']), man: maMp(h['MP']), dk: dsO(h['Điều khoản']),
      };
      if (!LOAI.includes(loai)) bc.LOI(`${vt}: ${ma} Loại "${loai || '(trống)'}" không thuộc ${LOAI.join(' / ')}`);
      if (oMau(actor)) bc.LOI(`${vt}: ${ma} thiếu Actor`);
      else if (/[;,]|\svà\s/.test(actor)) bc.LOI(`${vt}: ${ma} có hơn một actor "${actor}"`);
      for (const u of x.uc) if (!dsUc.has(u)) bc.LOI(`${vt}: ${ma} UC presales "${u}" không có trong uc-presales.md`);
      for (const m of x.man) if (!dsMan.has(m)) bc.LOI(`${vt}: ${ma} ${m} không có trong man-presales.md`);
      for (const d of x.dk) if (!dsDk.has(d)) bc.LOI(`${vt}: ${ma} điều khoản ${d} không có trong phap-ly.md`);
      buoc.push(x);
    }
    kiemLoiGoiNgoai(bc, rel, tProc, thuc(b, 'Bước'));
  }

  // Liên kết nguồn → bước; khoảng trống.
  const gan = { uc: new Map(), man: new Map(), dk: new Map(), req: new Map() };
  const khoang = [];
  for (const b of buoc) {
    for (const k of ['uc', 'man', 'dk', 'req']) {
      for (const v of b[k]) {
        if (!gan[k].has(v)) gan[k].set(v, new Set());
        gan[k].get(v).add(b.ma);
        if (k !== 'req' && !pv[k].includes(v)) khoang.push(['ngoài phạm vi brief', `${b.ma}: ${k === 'uc' ? `\`${v}\`` : v}`]);
      }
    }
    if (b.loai === 'hệ thống') {
      if (!b.req.length && !b.uc.length && !b.dk.length) {
        bc.LOI(`${b.vt}: ${b.ma} là bước hệ thống không có căn cứ (REQ, UC presales, Điều khoản)`);
        khoang.push(['bước không căn cứ', b.ma]);
      }
      if (!b.uc.length) khoang.push(['bước hệ thống không UC presales', b.ma]);
      if (!b.man.length && b.actor !== 'Hệ thống') khoang.push(['bước hệ thống không màn', b.ma]);
    }
    if (b.loai === 'thủ công' && !b.dk.length) bc.CANH(`${b.vt}: ${b.ma} bước thủ công không dẫn điều khoản (cần nguồn hiện trạng)`);
  }
  for (const [loai, doiTuong] of khoang) if (loai === 'ngoài phạm vi brief') bc.CANH(`${doiTuong} ngoài phạm vi ${pv.tu}`);

  // Mục 8: lý do không gắn bước.
  const relMap = `${D2}/mapping-${cn}.md`;
  const tMap = docTep(goc, relMap);
  const lyDo = new Set();
  if (tMap) {
    for (const h of bangMuc(tMap, 8, ['Nguồn', 'Lý do'])?.hang ?? []) {
      const nguon = Object.entries(h).find(([k]) => k.startsWith('Nguồn'))?.[1];
      const lydo = Object.entries(h).find(([k]) => k.startsWith('Lý do'))?.[1];
      if (oMau(nguon)) continue;
      if (oMau(lydo)) { bc.LOI(`${relMap}:${h._dong}: "${boMa(nguon)}" thiếu lý do`); continue; }
      lyDo.add(boMa(nguon));
    }
  }
  const tenNguon = { uc: 'UC presales', man: 'MP', dk: 'điều khoản', req: 'REQ' };
  for (const k of ['uc', 'man', 'dk', 'req']) {
    for (const v of pv[k]) {
      if (!gan[k].has(v) && !lyDo.has(v)) bc.LOI(`${tenNguon[k]} ${k === 'uc' ? `"${v}"` : v} trong phạm vi chưa gắn bước nào và không có lý do ở ${relMap} mục 8`);
    }
  }

  // Mục 1–7: sinh, ghi hoặc so.
  const sinh = sinhMuc(buoc, pv, gan, lyDo, khoang);
  const muc8 = tMap ? (tMap.match(/^## 8\.[\s\S]*$/m)?.[0] ?? '') : '';
  const dauFile = tMap ? tMap.split(/^## 1\./m)[0] : `# Mapping — ${cn} ${boMa(dongCn['Tên'])}\n\nMục 1–7 do \`node kit/tools/ba-verify/mapping.mjs --chuc-nang ${cn} --ghi\` sinh, không sửa tay. Agent viết mục 8.\n\n`;
  const muc8Moi = muc8 || '## 8. Không gắn bước (agent viết)\n| Nguồn (mã gốc / MP / điều khoản / REQ) | Lý do (thuộc CN khác / ngoài phạm vi / trùng / chờ câu hỏi) | Dẫn |\n| --- | --- | --- |\n';
  const moi = `${dauFile.trimEnd()}\n\n${sinh}\n\n${muc8Moi.trimEnd()}\n`;
  if (ghi) {
    fs.writeFileSync(path.join(goc, relMap), moi);
    bc.TIN(`đã ghi ${relMap} mục 1–${MUC_SINH}`);
  } else if (!tMap) {
    bc.LOI(`chưa có ${relMap}: chạy mapping.mjs --chuc-nang ${cn} --ghi`);
  } else {
    const cu = tMap.match(/^## 1\.[\s\S]*?(?=^## 8\.)/m)?.[0]?.trim() ?? '';
    if (cu !== sinh.trim()) bc.LOI(`${relMap} mục 1–${MUC_SINH} khác bảng bước hiện tại (sửa tay hoặc chưa sinh lại): chạy mapping.mjs --chuc-nang ${cn} --ghi`);
  }
  bc.TIN(`${buoc.length} bước; ${khoang.length} khoảng trống (mục 7)`);
  return bc;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = thamSo(process.argv.slice(2));
  const goc = a.goc ? path.resolve(a.goc) : timGoc(process.cwd());
  if (!/^CN-\d{2}$/.test(a['chuc-nang'] ?? '')) { console.error('cần --chuc-nang CN-xx'); process.exit(2); }
  process.exit(kiemMappingCn({ goc, chucNang: a['chuc-nang'], ghi: !!a.ghi }).in() ? 1 : 0);
}
