#!/usr/bin/env node
// Kiểm truy vết theo kit/standards/id-convention.md: du-an/trace.csv, chuc-nang/CN-xx/trace.csv ↔ tài liệu.
//  - trace.csv: id có, không lặp (kể cả giữa các file), đúng định dạng, trạng thái hợp lệ, cột file trỏ tệp có thật,
//    lien_ket trỏ ID có thật, chuc_nang khớp thư mục chức năng, mã gốc PS:/PL: có trong danh mục đầu vào;
//  - ID nhắc trong 1-ba-init/, 2-ba-overview/, 3-ba-detail/, du-an/, chuc-nang/ phải có trong trace.csv;
//  - đếm [CẦN XÁC NHẬN]: cảnh báo; --gate approve → lỗi (cổng trước G4).
// Kiểm độ phủ giữa các layer (TR → UC, SCR → UC…) thuộc checklist gate, viết cùng các bước 6–12.
// Dùng: node kit/tools/ba-verify/trace-check.mjs [--goc <repo>] [--chuc-nang CN-xx] [--gate approve]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bangMarkdown, BaoCao, CAN_XAC_NHAN, docTruyVet, dongNoiDung, duyetBuoc, duyetFile, oMau, RE_CAN_XAC_NHAN, RE_ID, tachDs, thamSo, tienTo, timGoc, TRANG_THAI } from './lib.mjs';

// Số chữ số tạm theo id-convention (chờ chốt ở thiết kế mục 12, việc 4).
// Q, ASM, PH, SCR nhận 3–4 chữ số: dải chức năng từ CN-19 (1001–1550) và khối mở rộng từ 2001 .
const DINH_DANG = {
  CN: /^CN-\d{2}$/, MP: /^MP-\d{3}$/, QP: /^QP-\d{2}(\.\d{2})?$/, PH: /^PH-\d{3,4}$/, REQ: /^REQ-\d{3}$/, PROC: /^PROC-\d{2}(\.\d{2})?$/,
  QT: /^QT-\d{2}$/,
  ENT: /^ENT-\d{3}$/, ST: /^ST-\d{3}$/, TR: /^TR-\d{3}$/, ACT: /^ACT-\d{2}$/, UC: /^UC-\d{3}$/, UCWBS: /^[A-Z][A-Z0-9]+\.(?:WEB|APP|KIOSK|API|JOB)(?:\.\d{2}){3}$/, BR: /^BR-(?:\d{3}|[A-Z]\d{2})$/,
  SCR: /^SCR-\d{3,4}$/, CR: /^CR-\d{3}$/, Q: /^Q-\d{3,4}$/, ASM: /^ASM-\d{3,4}$/,
};
// Bước của quy trình (PROC-xx.yy, QP-xx.yy) không có dòng riêng trong trace.csv: tính theo dòng của quy trình cha.
const laBuoc = (id, co) => /^(?:PROC|QP)-\d{2}\.\d{2}$/.test(id) && co.has(id.replace(/\.\d{2}$/, ''));
const doc = (goc, rel) => {
  const f = path.join(goc, rel);
  return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null;
};
const cot = (text, tieuDe, ten) => new Set((bangMarkdown(text ?? '', tieuDe)?.hang ?? [])
  .map((h) => (h[ten] ?? '').replace(/`/g, '').trim()).filter((x) => !oMau(x)));

export function kiemTruyVet({ goc, chucNang, gate } = {}) {
  const bc = new BaoCao('TRUY VẾT — trace.csv ↔ tài liệu');
  if (!fs.existsSync(path.join(goc, 'du-an', 'trace.csv'))) { bc.LOI('không thấy du-an/trace.csv'); return bc; }
  const tatCa = docTruyVet(goc);
  const hang = chucNang ? tatCa.filter((r) => r.chuc_nang === chucNang) : tatCa;
  const theoId = new Map();
  const maPs = cot(doc(goc, '1-ba-init/0-dau-vao/uc-presales.md'), ['Mã gốc', 'Tên'], 'Mã gốc');
  const maPl = cot(doc(goc, '1-ba-init/0-dau-vao/phap-ly.md'), ['Mã điều khoản', 'Văn bản'], 'Mã điều khoản');

  // ---- 1. Bản thân trace.csv
  for (const r of tatCa) {
    if (!r.id) { bc.LOI(`${r._tep} dòng ${r._dong}: thiếu id`); continue; }
    if (theoId.has(r.id)) bc.LOI(`${r.id} lặp: ${theoId.get(r.id)._tep} dòng ${theoId.get(r.id)._dong} và ${r._tep} dòng ${r._dong}`);
    theoId.set(r.id, r);
  }
  for (const r of hang) {
    if (!r.id) continue;
    const tt = tienTo(r.id);
    if (!DINH_DANG[tt]) bc.LOI(`${r.id}: tiền tố ${tt} không có trong id-convention`);
    else if (!DINH_DANG[tt].test(r.id)) bc.LOI(`${r.id}: sai định dạng số (kit/standards/id-convention.md)`);
    if (!TRANG_THAI.includes(r.trang_thai)) bc.LOI(`${r.id}: trạng thái "${r.trang_thai}" không hợp lệ`);
    if (r.file && !fs.existsSync(path.join(goc, r.file.split('#')[0]))) bc.LOI(`${r.id}: cột file trỏ tới ${r.file} không tồn tại`);
    const thuMuc = r._tep.match(/^chuc-nang\/(CN-\d{2})/)?.[1];
    if (thuMuc && r.chuc_nang !== thuMuc) bc.LOI(`${r.id}: nằm trong ${r._tep} nhưng cột chuc_nang ghi "${r.chuc_nang}"`);
    if (!thuMuc && r.chuc_nang) bc.LOI(`${r.id}: nằm trong du-an/trace.csv nhưng cột chuc_nang ghi "${r.chuc_nang}"`);
    for (const lk of tachDs(r.lien_ket)) {
      if (!DINH_DANG[tienTo(lk)]) continue;
      if (!theoId.has(lk) && !laBuoc(lk, theoId)) bc.LOI(`${r.id}: lien_ket trỏ tới ${lk} không có trong trace.csv`);
      else if (theoId.get(lk)?.trang_thai === 'deprecated' && r.trang_thai !== 'deprecated') bc.CANH(`${r.id} còn liên kết tới ${lk} đã deprecated`);
    }
    for (const x of tachDs(r.nguon)) {
      if (/^PS:/i.test(x) && maPs.size && !maPs.has(x.slice(3).trim())) bc.CANH(`${r.id}: mã gốc ${x} không có trong 1-ba-init/0-dau-vao/uc-presales.md`);
      if (/^PL:/i.test(x) && maPl.size && !maPl.has(x.slice(3).trim())) bc.CANH(`${r.id}: mã điều khoản ${x} không có trong 1-ba-init/0-dau-vao/phap-ly.md`);
    }
  }

  // ---- 2. ID nhắc trong tài liệu phải có trong trace.csv
  const tep = [...duyetBuoc(goc, ['.md']), ...['du-an', 'chuc-nang'].flatMap((d) => duyetFile(path.join(goc, d), ['.md']))];
  const treo = new Map();
  for (const f of tep) {
    const rel = path.relative(goc, f);
    for (const { so, chu } of dongNoiDung(fs.readFileSync(f, 'utf8'))) {
      for (const id of chu.match(RE_ID) || []) {
        if (theoId.has(id)) continue;
        if (laBuoc(id, theoId)) continue;
        if (!treo.has(id)) treo.set(id, `${rel}:${so}`);
      }
    }
  }
  for (const [id, noi] of treo) bc.LOI(`${id} được nhắc ở ${noi} nhưng không có trong trace.csv`);

  // ---- 3. [CẦN XÁC NHẬN]: cảnh báo; --gate approve là lỗi. Có --chuc-nang thì chỉ đếm tệp của chức năng.
  const tepCn = chucNang ? new Set(hang.map((r) => r.file).filter(Boolean)) : null;
  const dem = new Map();
  for (const f of tep) {
    const rel = path.relative(goc, f);
    if (tepCn && !tepCn.has(rel) && !rel.startsWith(`chuc-nang/${chucNang}`)) continue;
    let n = 0;
    for (const { chu } of dongNoiDung(fs.readFileSync(f, 'utf8'))) n += (chu.match(RE_CAN_XAC_NHAN) || []).length;
    if (n) dem.set(rel, n);
  }
  const tong = [...dem.values()].reduce((a, b) => a + b, 0);
  bc.TIN(`${hang.length} dòng trace${chucNang ? ` thuộc ${chucNang}` : ''}, ${tep.length} tệp, ${tong} chỗ ${CAN_XAC_NHAN}`);
  if (tong) {
    const ds = [...dem].map(([f, n]) => `${f} (${n})`).join(', ');
    if (gate === 'approve') bc.LOI(`còn ${tong} chỗ ${CAN_XAC_NHAN} — phải đóng hết trước G4: ${ds}`);
    else bc.CANH(`còn ${tong} chỗ ${CAN_XAC_NHAN}: ${ds}`);
  }
  return bc;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = thamSo(process.argv.slice(2));
  const goc = a.goc ? path.resolve(a.goc) : timGoc(process.cwd());
  process.exit(kiemTruyVet({ goc, chucNang: a['chuc-nang'], gate: a.gate }).in() ? 1 : 0);
}
