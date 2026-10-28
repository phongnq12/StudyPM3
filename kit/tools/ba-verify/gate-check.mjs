#!/usr/bin/env node
// Phần máy của gate (kit/standards/gate-procedure.md mục 3, kit/thiet-ke/thiet-ke-kit.md mục 7): đọc hồ sơ gate, khóa bước
// sau, phát hiện gate mất hiệu lực, chạy phần máy của một gate, đặt hoặc lùi trạng thái dat-Gx trong trace.csv.
//
// Dùng: node kit/tools/ba-verify/gate-check.mjs [--goc <repo>] [--chuc-nang CN-xx] [việc]
//   (không việc)   bảng trạng thái các gate của tầng: dự án (G0) hoặc chức năng (G0 ở main, G1–G4)
//   --can Gx       khóa: thoát 1 khi Gx hoặc một gate trước nó chưa ĐẠT, hoặc đã mất hiệu lực
//   --pham-vi Gx   danh sách file trong phạm vi gate (đưa cho reviewer, ghi hồ sơ mục 1)
//   --may Gx       phần máy của gate: cổng máy check-all, gate trước còn hiệu lực, Q `mở` chặn Gx, không sửa 0-inputs/,
//                  kiểm riêng của Gx;
//                  liệt kê dòng "Máy" của checklist-Gx chưa có script (reviewer chấm thay). Thoát 1 khi còn LỖI
//   --dat Gx       sau khi gate ĐẠT, trước commit hồ sơ: kiểm hồ sơ (ĐẠT, commit = HEAD), đặt dat-Gx trong trace.csv
//   --lui          gate mất hiệu lực → trạng thái trong trace.csv lùi về gate cao nhất còn hiệu lực
//
// Hồ sơ gate: du-an/G0.md, chuc-nang/CN-xx/Gx.md (kit/templates/ho-so/gate.md); script đọc bảng đầu: Gate, Kết luận,
// Commit đã kiểm. Mất hiệu lực: có file trong phạm vi gate đổi (kể cả chưa commit, kể cả file mới) sau commit đã kiểm;
// gate đó và mọi gate sau mất hiệu lực. Phạm vi gate chức năng chỉ gồm file của chức năng: file trong cột `file` của
// chuc-nang/CN-xx/trace.csv, file có mã CN-xx trong đường dẫn, file nhánh đã đổi so với main. Trên nhánh chức năng, G0
// chỉ kiểm hồ sơ ĐẠT (chức năng được thêm dòng vào overview; sửa cấu trúc overview → chạy lại G0 ở nhánh dự án).
//
// Kit v3 (skill ba-gate 0.1.0): G0 sau /ba-overview (bước 1 + sáu lớp + điền ngược + danh mục chức năng); G1 = UC chi tiết
// của CN; G2 = prototype + đặc tả màn của CN; G3, G4 dành cho SRS, chưa dùng ở kit này (giữ khả năng trong script).
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { kiemKiemChung } from './kiem-chung.mjs';
import { bangMarkdown, BaoCao, BUOC, docCsv, dongNoiDung, duyetBuoc, duyetFile, mucMarkdown, oMau, RE_CAN_XAC_NHAN, SO_DU_AN, tachDs, thamSo, timGoc } from './lib.mjs';

const day = path.dirname(fileURLToPath(import.meta.url));
export const GATE = ['G0', 'G1', 'G2', 'G3', 'G4'];
// Gate chưa dùng ở kit này (dành cho SRS): vẫn đọc hồ sơ, vẫn chạy được, chỉ ghi chú khi in bảng trạng thái.
export const CHUA_DUNG = ['G3', 'G4'];

// Phạm vi mỗi gate: thư mục, file layer của các bước trong gate (kit/standards/gate-procedure.md mục 3; skill ba-gate).
export const PHAM_VI = {
  G0: ['1-ba-init', '2-ba-overview/1-brd', '2-ba-overview/2-business-process', '2-ba-overview/3-erd',
    '2-ba-overview/4-state-machine', '2-ba-overview/5-actor-usecase', '2-ba-overview/6-business-rules',
    '2-ba-overview/assumption_log.md', 'du-an/glossary.md'],
  G1: ['chuc-nang/{cn}', '3-ba-detail/use-case'],
  G2: ['3-ba-detail/Prototype', '3-ba-detail/Screens'],
  G3: ['3-ba-detail/SRS'],
  G4: ['3-ba-detail/SRS'],
};
// Bỏ khỏi phạm vi: template; sổ, trace, hồ sơ gate của CN (đổi ở mọi gate, không phải tài liệu được kiểm).
export const LOAI_TRU = {
  G0: ['1-ba-init/templates'],
  CN: ['chuc-nang/{cn}/trace.csv', 'chuc-nang/{cn}/open-questions.md', 'chuc-nang/{cn}/kiem-chung',
    ...GATE.map((g) => `chuc-nang/{cn}/${g}.md`)],
};

// Dòng "Máy" của checklist-Gx đã có script kiểm (gate-check --may hoặc check-all). Dòng "Máy" khác: reviewer chấm thay
// tới khi có script. Số dòng theo .claude/skills/ba-gate/checklist-Gx.md.
const MAY_DA_CO = {
  G0: {
    1: 'check-all: dau-vao-check', 2: 'check-all: dau-vao-check (bản đồ mục 6)', 3: 'check-all: dau-vao-check (uc-phap-ly)',
    4: 'check-all: dau-vao-check (man-presales)', 5: 'check-all + gate-check: bpmn_lint', 10: 'gate-check: kiem_business_layer.py',
    15: 'gate-check: danh-muc-chuc-nang', 16: 'gate-check: danh-muc-chuc-nang', 17: 'gate-check: danh-muc-chuc-nang',
    18: 'gate-check: trạng thái lớp, kiem_business_layer.py', 19: 'gate-check: kiem_business_layer.py (GD có trong sổ)',
    22: 'gate-check: Q mở chặn G0', 23: 'check-all: term-check',
  },
  G1: {
    1: 'gate-check: check-all --chuc-nang', 2: 'gate-check: G0 còn hiệu lực', 3: 'gate-check: UC của module có file',
    4: 'gate-check: UC ngoài module', 15: 'gate-check: PH của CN', 16: 'gate-check: Q mở chặn G1', 17: 'check-all: term-check',
    19: 'gate-check: trang_thai UC, [CẦN BA CHỐT]',
  },
  G2: {
    1: 'gate-check: check-all --chuc-nang', 2: 'gate-check: G1 còn hiệu lực', 3: 'gate-check: có trang, có SCR của CN',
    15: 'gate-check: Q mở chặn G2', 16: 'check-all: term-check',
  },
  G3: { 2: 'gate-check: G1, G2 còn hiệu lực', 15: 'check-all: term-check' },
  G4: {
    1: 'check-all --chuc-nang: srs-lap-rap', 10: 'check-all --chuc-nang: srs-lap-rap (đối chiếu uc-overview)',
    17: 'gate-check: kiem-chung C1', 18: 'gate-check: kiem-chung C2', 19: 'gate-check: kiem-chung C3',
    20: 'gate-check: kiem-chung C4', 2: 'gate-check: G1–G3 còn hiệu lực', 3: 'gate-check: [CẦN XÁC NHẬN] của CN', 4: 'gate-check: Q mở của CN', 5: 'check-all: trace-check',
  },
};

const git = (goc, args) => {
  const r = spawnSync('git', args, { cwd: goc, encoding: 'utf8' });
  return r.status === 0 ? r.stdout : null;
};
const docTep = (goc, rel) => {
  const f = path.join(goc, rel);
  return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null;
};
const hom = () => new Date().toISOString().slice(0, 10);

// File đổi từ commit `tu` tới cây làm việc (gồm chưa commit, file mới chưa track) trong các đường dẫn.
function thayDoi(goc, tu, ds) {
  const ra = new Map();
  for (const d of (git(goc, ['diff', '--name-only', '--relative', tu, '--', ...ds]) ?? '').split('\n')) if (d) ra.set(d, true);
  for (const d of (git(goc, ['ls-files', '--others', '--exclude-standard', '--', ...ds]) ?? '').split('\n')) if (d) ra.set(d, true);
  return [...ra.keys()].sort();
}

const coMain = (goc) => git(goc, ['rev-parse', '--verify', '--quiet', 'main']) !== null;

// File thuộc chức năng (để gate chức năng không mất hiệu lực vì file của chức năng khác).
export function fileCuaCn(goc, cn) {
  const ra = new Set([`chuc-nang/${cn}/brief.md`]);
  const fTv = path.join(goc, 'chuc-nang', cn, 'trace.csv');
  if (fs.existsSync(fTv)) for (const r of docCsv(fTv)) for (const x of tachDs(r.file)) ra.add(x.split('#')[0].trim());
  // Ba thư mục bước (file có mã CN trong đường dẫn: use-case/CN-xx-…, Screens/CN-xx-…, Prototype/app/src/pages/CN-xx/…)
  // và thư mục chuc-nang/CN-xx/.
  for (const f of [...duyetBuoc(goc, ['']), ...duyetFile(path.join(goc, 'chuc-nang', cn), [''])]) {
    const rel = path.relative(goc, f).split(path.sep).join('/');
    if (rel.includes(cn)) ra.add(rel);
  }
  const goc0 = coMain(goc) ? git(goc, ['merge-base', 'main', 'HEAD'])?.trim() : null;
  if (goc0) for (const x of thayDoi(goc, goc0, BUOC)) ra.add(x);
  return ra;
}

function phamVi(goc, g, cn) {
  const thay = (p) => p.replace('{cn}', cn ?? '');
  const ds = PHAM_VI[g].map(thay);
  const bo = [...(LOAI_TRU[g] ?? []), ...(g === 'G0' ? [] : LOAI_TRU.CN)].map(thay);
  const khop = (f, p) => f === p || f.startsWith(`${p}/`);
  const trongDs = (f) => ds.some((p) => khop(f, p)) && !bo.some((p) => khop(f, p));
  if (g === 'G0') return { ds, trong: trongDs };
  const cua = fileCuaCn(goc, cn);
  return { ds, trong: (f) => trongDs(f) && cua.has(f) };
}

export function dsPhamVi(goc, g, cn) {
  const pv = phamVi(goc, g, cn);
  const co = (git(goc, ['ls-files', '--cached', '--others', '--exclude-standard', '--', ...pv.ds]) ?? '').split('\n');
  return co.filter((f) => f && pv.trong(f) && fs.existsSync(path.join(goc, f))).sort();
}

export const tepHoSo = (g, cn) => (g === 'G0' ? 'du-an/G0.md' : `chuc-nang/${cn}/${g}.md`);

export function docHoSo(goc, g, cn) {
  const rel = tepHoSo(g, cn);
  const t = docTep(goc, rel);
  if (t === null) return { rel, co: false };
  const h = bangMarkdown(t, ['Gate', 'Kết luận', 'Commit'])?.hang?.[0];
  if (!h) return { rel, co: true, loi: 'không có bảng đầu (cột Gate, Kết luận, Commit đã kiểm)' };
  const lay = (k) => (Object.entries(h).find(([c]) => c.startsWith(k))?.[1] ?? '').replace(/[`*]/g, '').trim();
  const kl = lay('Kết luận').toUpperCase().replace(/\s+/g, ' ');
  const ketLuan = ['ĐẠT', 'KHÔNG ĐẠT'].includes(kl) ? kl : null;
  const ra = { rel, co: true, gate: lay('Gate'), ketLuan, commit: lay('Commit'), ngay: lay('Ngày') };
  if (ra.gate !== g) ra.loi = `cột Gate ghi "${ra.gate}", phải là ${g}`;
  else if (!ketLuan) ra.loi = `Kết luận "${lay('Kết luận')}" phải là ĐẠT hoặc KHÔNG ĐẠT`;
  else if (!/^[0-9a-f]{7,40}$/i.test(ra.commit)) ra.loi = `Commit đã kiểm "${ra.commit}" không phải mã commit`;
  return ra;
}

// Trạng thái các gate của tầng. cn null: tầng dự án (chỉ G0). Mỗi phần tử: { g, tt, ly_do, doi, hs }.
// tt: 'ĐẠT' | 'KHÔNG ĐẠT' | 'MẤT HIỆU LỰC' | 'chưa chạy' | 'hồ sơ lỗi' | 'không kiểm được'.
export function trangThaiGate(goc, cn = null) {
  const ds = cn ? GATE : ['G0'];
  const ra = [];
  let gay = null;
  for (const g of ds) {
    const hs = docHoSo(goc, g, cn);
    const m = { g, hs, doi: [] };
    if (!hs.co) Object.assign(m, { tt: 'chưa chạy', ly_do: `chưa có ${hs.rel}` });
    else if (hs.loi) Object.assign(m, { tt: 'hồ sơ lỗi', ly_do: `${hs.rel}: ${hs.loi}` });
    else if (hs.ketLuan === 'KHÔNG ĐẠT') Object.assign(m, { tt: 'KHÔNG ĐẠT', ly_do: `${hs.rel} kết luận KHÔNG ĐẠT` });
    else if (g === 'G0' && cn) Object.assign(m, { tt: 'ĐẠT', ly_do: `${hs.rel} (trên nhánh chức năng chỉ kiểm hồ sơ)` });
    else {
      const c = git(goc, ['rev-parse', '--verify', '--quiet', `${hs.commit}^{commit}`])?.trim();
      if (!c) Object.assign(m, { tt: 'không kiểm được', ly_do: `commit ${hs.commit} trong ${hs.rel} không có trong repo` });
      else if (spawnSync('git', ['merge-base', '--is-ancestor', c, 'HEAD'], { cwd: goc }).status !== 0) {
        Object.assign(m, { tt: 'không kiểm được', ly_do: `commit ${hs.commit} không nằm trong lịch sử nhánh hiện tại` });
      } else {
        const pv = phamVi(goc, g, cn);
        m.doi = thayDoi(goc, c, pv.ds).filter(pv.trong);
        Object.assign(m, m.doi.length
          ? { tt: 'MẤT HIỆU LỰC', ly_do: `${m.doi.length} file trong phạm vi đổi sau commit ${hs.commit}` }
          : { tt: 'ĐẠT', ly_do: `${hs.rel}, commit ${hs.commit}${hs.ngay ? `, ${hs.ngay}` : ''}` });
      }
    }
    // Gate trước không còn ĐẠT → gate sau đang ĐẠT cũng mất hiệu lực.
    if (gay && m.tt === 'ĐẠT') Object.assign(m, { tt: 'MẤT HIỆU LỰC', ly_do: `${gay} không còn ĐẠT` });
    if (m.tt !== 'ĐẠT' && !gay) gay = g;
    ra.push(m);
  }
  return ra;
}

export function kiemCan(goc, g, cn) {
  const ds = trangThaiGate(goc, cn);
  const den = ds.slice(0, ds.findIndex((m) => m.g === g) + 1);
  const chua = den.filter((m) => m.tt !== 'ĐẠT');
  return { dat: chua.length === 0, chua };
}

function dongBang(text, cot) {
  return (bangMarkdown(text ?? '', cot)?.hang ?? []).filter((h) => !oMau(h[cot[0]]));
}

// ---- Kit v3: sáu lớp, danh mục chức năng (G0); UC của CN (G1); giao diện của CN (G2) ----------------------------------
export const TEP_DANH_MUC_CN = '2-ba-overview/5-actor-usecase/danh-muc-chuc-nang.md';
const TEP_BAN_DO = '1-ba-init/0-dau-vao/ban-do-quy-trinh/ban-do-quy-trinh.md';
const LOP = [
  ['2-ba-overview/1-brd', ['BRD']], ['2-ba-overview/2-business-process', ['QT']], ['2-ba-overview/3-erd', ['ERD']],
  ['2-ba-overview/4-state-machine', ['SM']], ['2-ba-overview/5-actor-usecase', ['UCD', 'UCL']],
  ['2-ba-overview/6-business-rules', ['BR']],
];
const RE_TAI_LIEU = /^(BRD|QT|ERD|SM|UCD|UCL|TRACE|BR)_.+_v\d+\.md$/;
const RE_UC_WBS = /^([A-Z][A-Z0-9]*)\.(WEB|APP|KIOSK|API|JOB)\.(\d{2})\.(\d{2})\.(\d{2})$/;
// Mã module `<MA>.WEB.03`. Module trải nhiều nền tảng giữ cùng số module (00_quy_uoc_chung.md mục 8.2): khóa module bỏ
// nền tảng, `<MA>.03`.
const RE_MODULE = /([A-Z][A-Z0-9]*)\.(?:WEB|APP|KIOSK|API|JOB)\.(\d{2})(?!\.\d|\d)/g;
const sach = (s) => (s ?? '').replace(/<[^>]+>/g, '').replace(/[`*]/g, '').trim();
const tepTrong = (goc, rel, re) => {
  const d = path.join(goc, rel);
  return fs.existsSync(d) && fs.statSync(d).isDirectory() ? fs.readdirSync(d).filter((f) => re.test(f)).sort() : [];
};
const layCot = (h, k) => sach(Object.entries(h).find(([c]) => c.startsWith(k))?.[1]);

// UC của lớp 5: mã WBS 5 cấp ở cột No của UCL_*.md mục 3 (bỏ dòng ⊘). Map mã → { module, tep, dong }.
export function docUcl(goc) {
  const ra = new Map();
  for (const f of tepTrong(goc, '2-ba-overview/5-actor-usecase', /^UCL_.+\.md$/)) {
    const rel = `2-ba-overview/5-actor-usecase/${f}`;
    for (const h of bangMarkdown(docTep(goc, rel), ['No', 'Group'])?.hang ?? []) {
      const m = sach(h.No).match(RE_UC_WBS);
      if (m && !Object.values(h).join(' ').includes('⊘')) ra.set(m[0], { module: `${m[1]}.${m[3]}`, tep: rel, dong: h._dong });
    }
  }
  return ra;
}

// Danh mục chức năng (template 2-ba-overview/templates/5-actor-usecase/danh_muc_chuc_nang.md): mục 1 bảng CN, mục 2 QT → CN.
export function docDanhMucCn(goc) {
  const t = docTep(goc, TEP_DANH_MUC_CN);
  if (t === null) return null;
  const cn = dongBang(t, ['CN', 'Tên', 'Module']).map((h) => {
    const day = layCot(h, 'Dải ID').match(/(\d+)\s*[–-]\s*(\d+)/);
    return {
      ma: layCot(h, 'CN'), dong: h._dong, module: [...new Set([...layCot(h, 'Module').matchAll(RE_MODULE)].map((m) => `${m[1]}.${m[2]}`))],
      qt: [...new Set(layCot(h, 'QT').match(/QT-\d+/g) ?? [])], phuThuoc: [...new Set(layCot(h, 'Phụ thuộc').match(/CN-\d{2}/g) ?? [])],
      thuTu: Number(layCot(h, 'Thứ tự').match(/\d+/)?.[0] ?? NaN), day: day ? [Number(day[1]), Number(day[2])] : null,
    };
  });
  const qt = dongBang(t, ['QT', 'CN chạm tới']).map((h) => ({
    ma: sach(h.QT).match(/QT-\d+/)?.[0] ?? sach(h.QT), dong: h._dong, cn: [...new Set(layCot(h, 'CN chạm tới').match(/CN-\d{2}/g) ?? [])],
    ghiChu: layCot(h, 'Ghi chú'),
  }));
  return { cn, qt };
}

function kiemDanhMucCn(goc, bc) {
  const F = TEP_DANH_MUC_CN;
  const dm = docDanhMucCn(goc);
  if (!dm) { bc.LOI(`chưa có ${F} (đợt 5b: /ba-overview --lop cat-cn)`); return; }
  if (!dm.cn.length) { bc.LOI(`${F}: mục 1 không có dòng chức năng`); return; }
  const theoMa = new Map();
  for (const c of dm.cn) {
    if (!/^CN-\d{2}$/.test(c.ma)) bc.LOI(`${F}:${c.dong}: mã "${c.ma}" không đúng dạng CN-xx`);
    else if (theoMa.has(c.ma)) bc.LOI(`${F}:${c.dong}: ${c.ma} lặp`);
    theoMa.set(c.ma, c);
    if (c.module.length !== 1) bc.LOI(`${F}:${c.dong}: ${c.ma} phải ứng đúng một module WBS (đang có: ${c.module.join(', ') || 'không có'})`);
    if (!c.day) bc.LOI(`${F}:${c.dong}: ${c.ma} chưa có dải ID dạng <đầu>–<cuối>`);
    else if (c.day[0] < 101 || c.day[1] < c.day[0]) bc.LOI(`${F}:${c.dong}: ${c.ma} dải ID ${c.day.join('–')} sai (tầng chức năng từ 101, đầu ≤ cuối)`);
    if (Number.isNaN(c.thuTu)) bc.LOI(`${F}:${c.dong}: ${c.ma} chưa có thứ tự làm`);
  }
  // Module thuộc đúng một CN; dải ID không chồng nhau.
  const cnCuaModule = new Map();
  for (const c of dm.cn) for (const k of c.module) cnCuaModule.set(k, [...(cnCuaModule.get(k) ?? []), c.ma]);
  for (const [k, ds] of cnCuaModule) if (ds.length > 1) bc.LOI(`${F}: module ${k} ở nhiều CN: ${ds.join(', ')}`);
  const coDay = dm.cn.filter((c) => c.day).sort((a, b) => a.day[0] - b.day[0]);
  for (let i = 1; i < coDay.length; i++) {
    if (coDay[i].day[0] <= coDay[i - 1].day[1]) bc.LOI(`${F}: dải ID ${coDay[i - 1].ma} (${coDay[i - 1].day.join('–')}) chồng ${coDay[i].ma} (${coDay[i].day.join('–')})`);
  }
  // Phụ thuộc: có thật, không vòng, thứ tự làm sau CN mình phụ thuộc.
  for (const c of dm.cn) {
    for (const d of c.phuThuoc) {
      const x = theoMa.get(d);
      if (!x || d === c.ma) bc.LOI(`${F}:${c.dong}: ${c.ma} phụ thuộc ${d} không có trong danh mục hoặc là chính nó`);
      else if (!(x.thuTu < c.thuTu)) bc.LOI(`${F}:${c.dong}: ${c.ma} (thứ tự ${c.thuTu}) phụ thuộc ${d} (thứ tự ${x.thuTu}): CN phụ thuộc phải làm trước`);
    }
  }
  const mau = new Map();
  const di = (ma, duong) => {
    if (mau.get(ma) === 2) return;
    if (mau.get(ma) === 1) { bc.LOI(`${F}: phụ thuộc vòng ${[...duong.slice(duong.indexOf(ma)), ma].join(' → ')}`); return; }
    mau.set(ma, 1);
    for (const d of theoMa.get(ma)?.phuThuoc ?? []) if (theoMa.has(d) && d !== ma) di(d, [...duong, ma]);
    mau.set(ma, 2);
  };
  for (const c of dm.cn) di(c.ma, []);
  // Mỗi UC của UCL thuộc đúng một CN (qua module); CN có UC; CN quá lớn.
  const ucl = docUcl(goc);
  if (!ucl.size) bc.LOI('không đọc được UC nào ở 2-ba-overview/5-actor-usecase/UCL_*.md mục 3 (cột No, mã WBS 5 cấp)');
  const dem = new Map();
  const moCoi = new Map();
  for (const [ma, v] of ucl) {
    const ds = cnCuaModule.get(v.module) ?? [];
    if (!ds.length) moCoi.set(v.module, [...(moCoi.get(v.module) ?? []), ma]);
    for (const x of ds) dem.set(x, (dem.get(x) ?? 0) + 1);
  }
  for (const [k, ds] of moCoi) bc.LOI(`${ds.length} UC của module ${k} không thuộc CN nào (ví dụ ${ds.slice(0, 3).join(', ')})`);
  for (const c of dm.cn) {
    const n = dem.get(c.ma) ?? 0;
    if (ucl.size && !n) bc.LOI(`${F}:${c.dong}: ${c.ma} không có UC nào trong UCL`);
    if (n > 30) bc.CANH(`${F}:${c.dong}: ${c.ma} có ${n} UC (trên 30): cân nhắc tách theo chức năng WBS`);
  }
  // QT ↔ CN: mỗi QT của bản đồ có dòng ở mục 2; khớp hai đầu với cột "QT liên quan" của mục 1.
  const banDo = new Set((bangMarkdown(docTep(goc, TEP_BAN_DO) ?? '', ['Mã', 'Tên', 'Trigger'])?.hang ?? [])
    .map((h) => sach(h['Mã']).match(/^QT-\d+$/)?.[0]).filter(Boolean));
  const qtDong = new Map(dm.qt.map((q) => [q.ma, q]));
  for (const q of banDo) {
    const r = qtDong.get(q);
    if (!r) bc.LOI(`${F}: mục 2 thiếu ${q} (mỗi QT của bản đồ đã chốt ghi các CN chạm tới)`);
    else if (!r.cn.length && oMau(r.ghiChu)) bc.LOI(`${F}:${r.dong}: ${q} không chạm CN nào mà chưa ghi lý do`);
  }
  for (const r of dm.qt) {
    if (banDo.size && !banDo.has(r.ma)) bc.LOI(`${F}:${r.dong}: ${r.ma} không có trong bản đồ quy trình đã chốt`);
    for (const x of r.cn) {
      if (!theoMa.has(x)) bc.LOI(`${F}:${r.dong}: ${r.ma} ghi ${x} không có ở mục 1`);
      else if (!theoMa.get(x).qt.includes(r.ma)) bc.LOI(`${F}:${r.dong}: ${r.ma} ghi ${x}, nhưng dòng ${x} ở mục 1 không có ${r.ma} ở cột "QT liên quan"`);
    }
  }
  for (const c of dm.cn) {
    for (const q of c.qt) if (!qtDong.get(q)?.cn.includes(c.ma)) bc.LOI(`${F}:${c.dong}: ${c.ma} ghi ${q}, nhưng mục 2 dòng ${q} không có ${c.ma}`);
  }
  bc.TIN(`${F}: ${dm.cn.length} CN, ${ucl.size} UC, ${banDo.size} QT của bản đồ`);
}

// G0: tài liệu sáu lớp ≥ Chờ review, không còn [CẦN BA CHỐT]; kiem_business_layer.py; sơ đồ QT lớp 2; danh mục CN.
function kiemTangDuAn(goc, bc) {
  for (const [d, loai] of LOP) {
    const tep = tepTrong(goc, d, RE_TAI_LIEU);
    for (const l of loai) if (!tep.some((f) => f.startsWith(`${l}_`))) bc.LOI(`${d}/: chưa có tài liệu ${l}_<MA>_<PV>_vNN.md`);
    for (const f of tep) {
      const rel = `${d}/${f}`;
      const t = docTep(goc, rel);
      const m = t.match(/\|\s*Phiên bản(?: hiện tại)?\s*·\s*Trạng thái\s*\|\s*([^|\n]+)\|/);
      const tt = m ? sach(m[1].split('·').at(-1)) : '';
      if (!/^(Chờ review|Đã duyệt)/.test(tt)) bc.LOI(`${rel}: trạng thái "${tt || 'không đọc được'}"; G0 cần Chờ review hoặc Đã duyệt`);
      const n = t.replace(/<!--[\s\S]*?-->/g, '').split('\n').filter((x) => x.includes('[CẦN BA CHỐT]')).length;
      if (n) bc.LOI(`${rel}: còn ${n} dòng có [CẦN BA CHỐT]`);
    }
  }
  const py = path.join(goc, '.claude', 'skills', 'ba-overview', 'scripts', 'kiem_business_layer.py');
  if (!fs.existsSync(py)) bc.CANH('không có kiem_business_layer.py: dòng G0 dùng script này do reviewer chấm thay');
  else {
    const r = spawnSync('python3', ['-I', py, path.join(goc, '2-ba-overview')], { cwd: goc, encoding: 'utf8' });
    if (r.error) bc.LOI('không chạy được python3 cho kiem_business_layer.py');
    else if (r.status !== 0) {
      const chan = (mucMarkdown(r.stdout ?? '', /^Chặn/) ?? '').split('\n').filter((x) => x.startsWith('- '));
      bc.LOI(`kiem_business_layer.py còn lỗi Chặn${chan.length ? `:\n${chan.map((x) => `       ${x}`).join('\n')}` : ''}`);
    } else bc.TIN('kiem_business_layer.py: không có lỗi Chặn');
  }
  // Sơ đồ quy trình lớp 2: mỗi QT của bản đồ một QT_<MA>_<PV>_<QT-nn>.drawio.svg, đạt bpmn_lint.
  const dQt = '2-ba-overview/2-business-process';
  const svg = tepTrong(goc, dQt, /^QT_.+\.drawio\.svg$/);
  const banDo = (bangMarkdown(docTep(goc, TEP_BAN_DO) ?? '', ['Mã', 'Tên', 'Trigger'])?.hang ?? [])
    .map((h) => sach(h['Mã']).match(/^QT-\d+$/)?.[0]).filter(Boolean);
  const thieu = banDo.filter((q) => !svg.some((f) => f.endsWith(`_${q}.drawio.svg`)));
  if (thieu.length) bc.LOI(`${dQt}/: ${thieu.length} QT chưa có sơ đồ QT_<MA>_<PV>_<QT-nn>.drawio.svg: ${thieu.join(', ')}`);
  const lint = path.join(goc, '.claude', 'skills', 'ba-bpmn', 'scripts', 'bpmn_lint.py');
  if (svg.length && fs.existsSync(lint)) {
    const r = spawnSync('python3', ['-I', lint, ...svg.map((f) => path.join(goc, dQt, f))], { encoding: 'utf8' });
    if (r.error) bc.LOI('không chạy được python3 cho bpmn_lint.py');
    else if (r.status !== 0) {
      const chan = (r.stdout ?? '').split('\n').filter((x) => x.startsWith('Chặn merge'));
      bc.LOI(`bpmn_lint sơ đồ lớp 2 còn lỗi Chặn merge:\n${chan.map((x) => `       ${x}`).join('\n')}`);
    } else bc.TIN(`bpmn_lint ${svg.length} sơ đồ lớp 2: đạt`);
  }
  kiemDanhMucCn(goc, bc);
}

// G1: mỗi UC của module có đúng một file 3-ba-detail/use-case/CN-xx-<slug>/<mã UC WBS>-<slug>.md, `id` khớp; không UC
// ngoài module.
function kiemUcCn(goc, cn, bc) {
  const c = docDanhMucCn(goc)?.cn.find((x) => x.ma === cn);
  if (!c) { bc.LOI(`${cn} không có trong ${TEP_DANH_MUC_CN}`); return; }
  const mod = new Set(c.module);
  const ucl = docUcl(goc);
  const cua = [...ucl].filter(([, v]) => mod.has(v.module)).map(([k]) => k);
  if (!cua.length) bc.LOI(`${cn}: không thấy UC nào của module ${c.module.join(', ')} trong UCL_*.md`);
  const thuMuc = tepTrong(goc, '3-ba-detail/use-case', new RegExp(`^${cn}-`));
  if (!thuMuc.length) { bc.LOI(`chưa có thư mục 3-ba-detail/use-case/${cn}-<slug>/`); return; }
  if (thuMuc.length > 1) bc.LOI(`${cn} có ${thuMuc.length} thư mục UC: ${thuMuc.join(', ')} (chỉ một)`);
  const coMa = new Map();
  for (const d of thuMuc) {
    for (const f of tepTrong(goc, `3-ba-detail/use-case/${d}`, /\.md$/)) {
      const rel = `3-ba-detail/use-case/${d}/${f}`;
      const ma = f.match(/^([A-Z][A-Z0-9]*\.(?:WEB|APP|KIOSK|API|JOB)\.\d{2}\.\d{2}\.\d{2})-/)?.[1];
      if (!ma) { bc.CANH(`${rel}: tên file không bắt đầu bằng mã UC WBS`); continue; }
      if (!ucl.has(ma)) bc.LOI(`${rel}: ${ma} không có trong UCL (lớp 5)`);
      else if (!mod.has(ucl.get(ma).module)) bc.LOI(`${rel}: ${ma} thuộc module khác, không phải UC của ${cn}`);
      if (coMa.has(ma)) bc.LOI(`${rel}: ${ma} đã có file ${coMa.get(ma)}`);
      else coMa.set(ma, rel);
      const t = docTep(goc, rel);
      const id = (t.match(/^id:\s*([^\s#]+)/m)?.[1] ?? '').replace(/["']/g, '');
      if (id !== ma) bc.LOI(`${rel}: trường id "${id}" khác mã ${ma} ở tên file`);
      const tt = (t.match(/^trang_thai:\s*([^\s#]+)/m)?.[1] ?? '').replace(/["']/g, '');
      if (!['cho-duyet', 'da-chot'].includes(tt)) bc.LOI(`${rel}: trang_thai "${tt}"; G1 cần cho-duyet hoặc da-chot`);
      const n = t.split('\n').filter((x) => x.includes('[CẦN BA CHỐT]')).length;
      if (n) bc.LOI(`${rel}: còn ${n} dòng có [CẦN BA CHỐT]`);
    }
  }
  const thieu = cua.filter((ma) => !coMa.has(ma));
  if (thieu.length) bc.LOI(`${thieu.length}/${cua.length} UC của ${cn} chưa có file: ${thieu.join(', ')}`);
  else if (cua.length) bc.TIN(`${cn}: ${cua.length}/${cua.length} UC của module có file`);
}

// G2: có trang prototype, ghi chú prototype, đặc tả màn của CN. Phủ UC ↔ màn, luồng bấm, build: reviewer, checklist bước.
function kiemGiaoDienCn(goc, cn, bc) {
  const trang = path.join(goc, '3-ba-detail', 'Prototype', 'app', 'src', 'pages', cn);
  if (!duyetFile(trang, ['']).length) bc.LOI(`chưa có trang của ${cn} ở 3-ba-detail/Prototype/app/src/pages/${cn}/`);
  if (!tepTrong(goc, '3-ba-detail/Prototype', new RegExp(`^${cn}-`)).length) bc.LOI(`chưa có thư mục ghi chú 3-ba-detail/Prototype/${cn}-<slug>/`);
  const scr = tepTrong(goc, '3-ba-detail/Screens', new RegExp(`^${cn}-`))
    .flatMap((d) => tepTrong(goc, `3-ba-detail/Screens/${d}`, /^SCR-\d+.*\.md$/));
  if (!scr.length) bc.LOI(`chưa có đặc tả màn SCR-xxx ở 3-ba-detail/Screens/${cn}-<slug>/`);
  else bc.TIN(`${cn}: ${scr.length} đặc tả màn`);
}

// Phần máy của gate g. Trả về BaoCao (LỖI → gate KHÔNG ĐẠT).
export function kiemMay(goc, g, cn, { chayCheckAll = true } = {}) {
  const bc = new BaoCao(`GATE ${g}${cn ? ` — ${cn}` : ' — dự án'}: phần máy`);
  if (chayCheckAll) {
    const r = spawnSync(process.execPath, [path.join(day, 'check-all.mjs'), '--goc', goc, ...(cn ? ['--chuc-nang', cn] : [])],
      { encoding: 'utf8' });
    process.stdout.write(r.stdout ?? '');
    if (r.status !== 0) bc.LOI('cổng máy check-all.mjs chưa đạt (chi tiết ở trên)');
    else bc.TIN('cổng máy check-all.mjs: đạt');
  }
  const tt = trangThaiGate(goc, cn);
  for (const m of tt.slice(0, tt.findIndex((x) => x.g === g))) {
    if (m.tt !== 'ĐẠT') bc.LOI(`${m.g} ${m.tt}: ${m.ly_do}${m.doi.length ? ` — ${m.doi.slice(0, 10).join(', ')}` : ''}`);
  }
  // Tầng dự án có hai sổ: bước 1 (1-ba-init/) và từ bước 2 (du-an/).
  for (const fQ of cn ? [`chuc-nang/${cn}/open-questions.md`] : SO_DU_AN) {
    for (const h of dongBang(docTep(goc, fQ), ['Q', 'Câu hỏi'])) {
      const mo = (h['Trạng thái'] ?? '').trim() === 'mở';
      if (mo && (h['Chặn gate'] ?? '').trim() === g) bc.LOI(`${fQ}:${h._dong}: ${h['Q']} còn mở, chặn ${g}`);
      else if (mo && g === 'G4' && cn) bc.LOI(`${fQ}:${h._dong}: ${h['Q']} còn mở (G4: không còn Q mở của chức năng)`);
    }
  }
  // chung-9: không sửa, xóa tệp có sẵn trong 0-inputs/ (trừ answers-*.md) so với điểm tách nhánh khỏi main.
  const goc0 = coMain(goc) ? git(goc, ['merge-base', 'main', 'HEAD'])?.trim() : null;
  if (goc0) {
    for (const f of (git(goc, ['diff', '--name-only', '--relative', '--diff-filter=MDR', goc0, '--', '0-inputs']) ?? '').split('\n')) {
      if (f && !/^0-inputs\/answers-[^/]*\.md$/.test(f)) bc.LOI(`${f}: tệp trong 0-inputs/ bị sửa hoặc xóa (CLAUDE.md luật 10)`);
    }
  }
  if (g === 'G0') kiemTangDuAn(goc, bc);
  if (g === 'G1' && cn) {
    // Phát hiện (open-questions mục 3) của CN còn mở mà chưa có Q.
    for (const fQ of [...SO_DU_AN, `chuc-nang/${cn}/open-questions.md`]) {
      for (const h of dongBang(docTep(goc, fQ), ['PH', 'Đối tượng'])) {
        if ((h['Chức năng'] ?? '').includes(cn) && (h['Trạng thái'] ?? '').trim() === 'mở' && !/Q-\d+/.test(h['Q liên quan'] ?? '')) {
          bc.LOI(`${fQ}:${h._dong}: ${h['PH']} của ${cn} còn mở mà chưa có Q`);
        }
      }
    }
    kiemUcCn(goc, cn, bc);
  }
  if (g === 'G2' && cn) kiemGiaoDienCn(goc, cn, bc);
  if (g === 'G4' && cn) {
    let n = 0;
    for (const f of fileCuaCn(goc, cn)) {
      const t = docTep(goc, f);
      if (t && /\.md$/.test(f)) n += (dongNoiDung(t).match(RE_CAN_XAC_NHAN) ?? []).length;
    }
    if (n) bc.LOI(`còn ${n} chỗ [CẦN XÁC NHẬN] trong file của ${cn}`);
    // Nhóm C (C1–C4): script tính đạt từ JSON của agent. Chỉ chạy khi nhóm A (cổng máy) đã đạt.
    if (bc.loi.length) bc.CANH('nhóm A chưa đạt: chưa chạy nhóm C (kiem-chung)');
    else {
      const kc = kiemKiemChung({ goc, chucNang: cn });
      kc.in();
      if (kc.loi.length) bc.LOI(`nhóm C chưa đạt: ${['C1', 'C2', 'C3', 'C4'].filter((c) => !kc.kq[c]).join(', ')}`);
    }
  }
  // Checklist của repo dự án; không có (ca thử) thì của bộ kit chứa script này.
  const fCl = [goc, path.join(day, '..', '..')].map((x) => path.join(x, '.claude', 'skills', 'ba-gate', `checklist-${g}.md`))
    .find((f) => fs.existsSync(f));
  if (fCl) {
    const chua = dongBang(fs.readFileSync(fCl, 'utf8'), ['#', 'Kiểm', 'Ai kiểm'])
      .filter((h) => /Máy/.test(h['Ai kiểm']) && !MAY_DA_CO[g]?.[Number(h['#'])]);
    if (chua.length) bc.CANH(`dòng "Máy" chưa có script, reviewer chấm thay: ${chua.map((h) => `#${h['#']}`).join(', ')}`);
  }
  return bc;
}

function ghiCsv(f, hang) {
  const dau = fs.readFileSync(f, 'utf8').replace(/^﻿/, '').split(/\r?\n/)[0];
  const cot = dau.split(',').map((x) => x.trim());
  const o = (s) => (/[",\n]/.test(s ?? '') ? `"${String(s).replace(/"/g, '""')}"` : (s ?? ''));
  fs.writeFileSync(f, `${[dau, ...hang.map((r) => cot.map((c) => o(r[c])).join(','))].join('\n')}\n`);
}

const tepTrace = (goc, cn) => path.join(goc, ...(cn ? ['chuc-nang', cn, 'trace.csv'] : ['du-an', 'trace.csv']));
const BAC = { draft: 0, 'dat-G0': 1, 'dat-G1': 1, 'dat-G2': 2, 'dat-G3': 3, 'dat-G4': 4 };

// Đặt dat-Gx sau khi gate ĐẠT. Trả về { loi, so } (loi: lý do không đặt được).
export function datTrangThai(goc, g, cn) {
  const hs = docHoSo(goc, g, cn);
  if (!hs.co) return { loi: `chưa có ${hs.rel}` };
  if (hs.loi) return { loi: `${hs.rel}: ${hs.loi}` };
  if (hs.ketLuan !== 'ĐẠT') return { loi: `${hs.rel} kết luận ${hs.ketLuan}` };
  const head = git(goc, ['rev-parse', 'HEAD'])?.trim() ?? '';
  if (!head.startsWith(hs.commit.toLowerCase())) return { loi: `Commit đã kiểm ${hs.commit} khác HEAD ${head.slice(0, 7)}: gate phải kiểm đúng commit đang có` };
  const m = trangThaiGate(goc, cn).find((x) => x.g === g);
  if (m.tt !== 'ĐẠT') return { loi: `${g} ${m.tt}: ${m.ly_do}` };
  const f = tepTrace(goc, cn);
  if (!fs.existsSync(f)) return { loi: `không thấy ${path.relative(goc, f)}` };
  const hang = docCsv(f);
  const bac = g === 'G0' ? 1 : Number(g[1]);
  let so = 0;
  for (const r of hang) {
    if (r.trang_thai in BAC && BAC[r.trang_thai] < bac) { r.trang_thai = `dat-${g}`; r.cap_nhat = hom(); so++; }
  }
  ghiCsv(f, hang);
  return { so };
}

// Gate mất hiệu lực → dat-Gx lùi về gate cao nhất còn ĐẠT (không có thì draft).
export function luiTrangThai(goc, cn) {
  const tt = trangThaiGate(goc, cn);
  const conDat = tt.filter((m, i) => tt.slice(0, i + 1).every((x) => x.tt === 'ĐẠT')).map((m) => m.g);
  const cao = cn ? conDat.filter((g) => g !== 'G0').at(-1) : conDat.at(-1);
  const ve = cao ? `dat-${cao}` : 'draft';
  const f = tepTrace(goc, cn);
  if (!fs.existsSync(f)) return { so: 0, ve };
  const hang = docCsv(f);
  let so = 0;
  for (const r of hang) {
    if (r.trang_thai in BAC && r.trang_thai !== 'draft' && BAC[r.trang_thai] > (BAC[ve] ?? 0)) {
      r.trang_thai = ve; r.cap_nhat = hom(); so++;
    }
  }
  if (so) ghiCsv(f, hang);
  return { so, ve };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = thamSo(process.argv.slice(2));
  const goc = a.goc ? path.resolve(a.goc) : timGoc(process.cwd());
  const cn = a['chuc-nang'] ?? null;
  const gateHop = (x) => (GATE.includes(x) && (cn ? true : x === 'G0') ? x : null);
  for (const k of ['can', 'pham-vi', 'may', 'dat']) {
    if (a[k] !== undefined && !gateHop(a[k])) {
      console.error(`--${k} cần một gate ${cn ? 'G0–G4' : 'G0 (tầng dự án; gate chức năng cần --chuc-nang CN-xx)'}`);
      process.exit(2);
    }
  }
  if (cn && !/^CN-\d{2}$/.test(cn)) { console.error('--chuc-nang phải dạng CN-xx'); process.exit(2); }
  if (git(goc, ['rev-parse', '--git-dir']) === null) { console.error('không phải repo git'); process.exit(2); }

  if (a.can) {
    const k = kiemCan(goc, a.can, cn);
    if (k.dat) { console.log(`ĐƯỢC CHẠY: ${a.can} và các gate trước đều ĐẠT, còn hiệu lực`); process.exit(0); }
    console.log(`KHÓA: chưa qua ${a.can}`);
    for (const m of k.chua) console.log(`  - ${m.g} ${m.tt}: ${m.ly_do}${m.doi.length ? ` — ${m.doi.slice(0, 10).join(', ')}` : ''}`);
    process.exit(1);
  }
  if (a['pham-vi']) { for (const f of dsPhamVi(goc, a['pham-vi'], cn)) console.log(f); process.exit(0); }
  if (a.may) process.exit(kiemMay(goc, a.may, cn).in() ? 1 : 0);
  if (a.dat) {
    const r = datTrangThai(goc, a.dat, cn);
    if (r.loi) { console.log(`KHÔNG ĐẶT ĐƯỢC dat-${a.dat}: ${r.loi}`); process.exit(1); }
    console.log(`Đã đặt dat-${a.dat} cho ${r.so} dòng ${path.relative(goc, tepTrace(goc, cn))}`);
    process.exit(0);
  }
  if (a.lui) {
    const r = luiTrangThai(goc, cn);
    console.log(r.so ? `Lùi ${r.so} dòng về ${r.ve}` : `Không có dòng phải lùi (gate cao nhất còn ĐẠT: ${r.ve})`);
    process.exit(0);
  }
  const nhanh = git(goc, ['branch', '--show-current'])?.trim() || '(không ở nhánh nào)';
  console.log(`== GATE — ${cn ?? 'tầng dự án'} (nhánh ${nhanh})`);
  for (const m of trangThaiGate(goc, cn)) {
    console.log(`   ${m.g}  ${m.tt.padEnd(16)} ${m.ly_do}${CHUA_DUNG.includes(m.g) && m.tt === 'chưa chạy' ? ' (chưa dùng ở kit này)' : ''}`);
    for (const f of m.doi.slice(0, 10)) console.log(`         đổi: ${f}`);
    if (m.doi.length > 10) console.log(`         … và ${m.doi.length - 10} file`);
  }
}
