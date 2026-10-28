#!/usr/bin/env node
// Duyệt prototype presales, lập danh sách màn (MP-xxx), trường, nút, đường đi giữa các màn; chụp ảnh từng màn.
// Bước 1 (/ba-init). Kết quả: 1-ba-init/0-dau-vao/man-presales.json (1-ba-init/templates/man-presales.schema.md)
// và ảnh 1-ba-init/0-dau-vao/man-presales/MP-xxx.png. Chạy lại cho ra cùng mã MP khi prototype không đổi.
//
// Dùng: node kit/tools/ba-verify/quet-prototype.mjs [--goc <repo>] [--nguon 0-inputs/presales/prototype] [--ra 1-ba-init/0-dau-vao]
//         [--tu dist|link|html] [--toi-da 200] [--bam-ca-nut-ghi] [--tinh] [--doi-vai "<nhãn nút đổi vai>"]
//   --tu: chọn dạng khi thư mục nguồn có nhiều dạng (mặc định: dòng "Duyệt bằng" của nguon.md; trống thì dist, rồi
//         link, rồi html).
//   --toi-da: số route tối đa (app). --bam-ca-nut-ghi: bấm thử cả nút có thể ghi dữ liệu (xem NUT_GHI).
//   --tinh: chỉ dạng html — không dùng trình duyệt, đọc HTML tĩnh (không có ảnh, không thấy màn sinh bằng JS).
//   --nhanh: app — chỉ bấm mục trong khung điều hướng và dòng đầu bảng (để tìm route); không bấm nút trong nội dung,
//         nên không ghi popup. Dùng khi cần danh sách màn chính gấp; chạy lại không --nhanh để bổ sung popup.
//   --doi-vai: app (dist, link) có nút chọn vai trò mà vai không giữ qua lần tải lại trang. Script bấm nút có nhãn
//         (hoặc title) này, lấy danh sách vai trong menu thả xuống, rồi duyệt lần lượt từng vai: mỗi lần mở route thì
//         tải trang gốc, chọn lại vai, chuyển route trong app (pushState) thay vì tải lại. Route đã duyệt ở vai trước
//         chỉ dò liên kết, không thành màn lần nữa; mỗi màn ghi `vai` đã duyệt.
// Cần: cd kit/tools/ba-verify && npm install. Trình duyệt: Chromium của Playwright; không mở được thì Chrome, Edge đã cài.
//
// Dạng prototype trong thư mục nguồn (1-ba-init/templates/nguon-prototype.md):
//   dist     : bản build của app (dist/, build/ hoặc out/ có index.html). Script mở server cục bộ, trả index.html cho
//              mọi route không phải tệp (SPA). Ưu tiên khi có: cố định, không phụ thuộc link còn sống.
//   link     : nguon.md ghi link đã deploy (Firebase Hosting, Vercel…). Duyệt bản đang chạy.
//   html     : các tệp HTML tĩnh. Mỗi tệp một màn chính.
//   ma-nguon/: mã nguồn app (tùy chọn). KHÔNG chạy; chỉ đọc khai báo route (react-router, Next.js) để mở cả route
//              không có liên kết tới, và báo route có trong mã mà không mở được (route_chua_mo).
// Có cả dist và link: duyệt dist; với link chỉ dò route (không chụp), route có ở một bên → lech_nguon. Chỉ so danh
// sách route, không so nội dung từng màn.
//
// Màn của app (dist, link): mỗi route một màn chính (đoạn đường dẫn là số, uuid, mã sinh tự động coi là tham số :id);
//   mỗi tab trừ tab đầu; mỗi popup mở ra khi bấm một nút trên màn chính. Liên kết và mục menu trong khung điều hướng
//   (nav, aside, header) ghi vào `menu`, liên kết và nút trong nội dung ghi vào `di_toi` của màn.
// Màn của HTML tĩnh: màn chính (tải trang), mỗi tab trừ tab đầu, mỗi popup có sẵn trong HTML.
//   tab   : phần tử role="tab" hoặc data-bs-toggle / data-toggle = tab|pill; khung nội dung lấy từ aria-controls
//           hoặc href/data-bs-target dạng #id.
//   popup : <dialog>, role="dialog", .modal; nút mở là phần tử trỏ tới #id của popup.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { bangMarkdown, duyetFile, thamSo, timGoc } from './lib.mjs';

const CHON_TAB = '[role="tab"], [data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-toggle="tab"], [data-toggle="pill"]';
const CHON_POPUP = 'dialog, [role="dialog"], [role="alertdialog"], .modal';
const CHON_TRUONG = 'input, select, textarea';
const BO_KIEU = ['hidden', 'submit', 'button', 'reset', 'image'];
const CHON_NUT = 'button, input[type="submit"], input[type="button"], input[type="reset"], a.btn, [role="button"]';

// App: thêm mẫu của Ant Design, MUI, Bootstrap 5 hay gặp ở prototype React.
const CHON_TAB_APP = '[role="tab"], .ant-tabs-tab, .MuiTab-root, [data-bs-toggle="tab"], [data-bs-toggle="pill"]';
const CHON_POPUP_APP = 'dialog[open], [role="dialog"], [role="alertdialog"], .modal.show, .ant-modal-wrap, .ant-drawer-open, .MuiDialog-root, .MuiDrawer-modal';
const CHON_BAM = 'button, [role="button"], [role="menuitem"], a, input[type="button"], .ant-menu-item, .ant-menu-submenu-title';
const CHON_KHUNG_DH = 'nav, aside, header, [role="navigation"], [role="menubar"], [role="menu"], .ant-menu, .ant-layout-sider';
const CHON_NOI_DUNG = 'main, [role="main"], .ant-layout-content, #main-content';
// Nút có thể ghi dữ liệu thật hoặc gây tác dụng ngoài trang: không bấm thử (trừ --bam-ca-nut-ghi). Popup của chúng
// (nếu có) không được ghi nhận; agent đối chiếu ảnh, ghi mục 3 man-presales.md khi thấy thiếu.
const NUT_GHI = ['lưu', 'gửi', 'nộp', 'ký', 'xóa', 'xoá', 'đăng xuất', 'thoát', 'in', 'tải xuống', 'tải lên', 'xuất',
  'nhập file', 'save', 'submit', 'delete', 'remove', 'logout', 'log out', 'sign out', 'print', 'download', 'upload',
  'export', 'import'];
const RE_NUT_GHI = new RegExp(`^(${NUT_GHI.join('|')})(?=$|[^\\p{L}])`, 'iu');
const TOI_DA_NUT = 40;
const THU_MUC_DIST = ['dist', 'build', 'out'];
const THU_MUC_MA_NGUON = 'ma-nguon';
const TEP_NGUON = 'nguon.md';

const gon = (s) => (s || '').replace(/\s+/g, ' ').trim();

function idDich(el) {
  const v = el.getAttribute('aria-controls') || el.getAttribute('data-bs-target') || el.getAttribute('data-target')
    || el.getAttribute('href') || '';
  const m = v.match(/^#?([\w-]+)$/);
  return m ? m[1] : null;
}

function nhanTruong(el, doc) {
  const id = el.getAttribute('id');
  if (id) {
    const lb = doc.querySelector(`label[for="${CSS.escape(id)}"]`);
    if (lb) return gon(lb.textContent);
  }
  const cha = el.closest('label');
  if (cha) return gon(cha.textContent);
  for (const a of ['aria-label', 'placeholder', 'title']) if (el.getAttribute(a)) return gon(el.getAttribute(a));
  const nhom = el.parentElement?.querySelector('label');
  if (nhom) return gon(nhom.textContent);
  return gon(el.getAttribute('name') || id || '');
}

function docTruong(goc_, doc, loaiTru) {
  const ra = [];
  for (const el of goc_.querySelectorAll(CHON_TRUONG)) {
    if (loaiTru.some((x) => x.contains(el))) continue;
    const loai = el.tagName === 'INPUT' ? (el.getAttribute('type') || 'text').toLowerCase() : el.tagName.toLowerCase();
    if (BO_KIEU.includes(loai)) continue;
    const nhan = nhanTruong(el, doc);
    ra.push({
      nhan: nhan.replace(/\s*\*\s*$/, ''),
      loai,
      bat_buoc: el.hasAttribute('required') || el.getAttribute('aria-required') === 'true' || /\*\s*$/.test(nhan),
      ten: el.getAttribute('name') || el.getAttribute('id') || '',
    });
  }
  return ra;
}

function docNut(goc_, loaiTru) {
  const ra = [];
  for (const el of goc_.querySelectorAll(CHON_NUT)) {
    if (loaiTru.some((x) => x.contains(el))) continue;
    const t = gon(el.tagName === 'INPUT' ? el.getAttribute('value') : el.textContent) || gon(el.getAttribute('aria-label'));
    if (t && !ra.includes(t)) ra.push(t);
  }
  return ra;
}

function tieuDe(goc_, doc, loaiTru = []) {
  for (const c of ['.modal-title', '.ant-modal-title', '.ant-drawer-title', '.MuiDialogTitle-root', 'h1', 'h2', 'h3', 'legend']) {
    const el = [...goc_.querySelectorAll(c)].find((x) => !loaiTru.some((l) => l.contains(x)) && gon(x.textContent));
    if (el) return gon(el.textContent);
  }
  return gon(doc.title);
}

// Cách mở phải duy nhất trong một vị trí (là khóa giữ mã MP khi chạy lại): trùng thì đánh số theo thứ tự.
function danhSoTrung(man) {
  const dem = new Map();
  for (const m of man) dem.set(m.cach_mo, (dem.get(m.cach_mo) ?? 0) + 1);
  const thu = new Map();
  for (const m of man) {
    if (dem.get(m.cach_mo) < 2) continue;
    const n = (thu.get(m.cach_mo) ?? 0) + 1;
    thu.set(m.cach_mo, n);
    m.cach_mo = `${m.cach_mo} (${n})`;
  }
  return man;
}

// Phân tích một trang HTML tĩnh (DOM của jsdom) thành các màn. Chưa cấp mã; đường đi giữa file trả về dạng đường dẫn file.
function phanTich(doc, fileRel, dsFile) {
  // Popup, kể cả popup lồng trong popup: mỗi popup một màn; màn ngoài không gồm phần của popup con.
  const popup = [...doc.querySelectorAll(CHON_POPUP)];
  const popupCha = (p) => popup.find((x) => x !== p && x.contains(p) && !popup.some((y) => y !== x && y !== p && x.contains(y) && y.contains(p)));
  const popupCon = (p) => popup.filter((x) => x !== p && p.contains(x));
  const popupNgoai = popup.filter((p) => !popupCha(p));
  // Tab gom theo nhóm (tablist cha, không có thì phần tử cha trực tiếp); tab đầu mỗi nhóm thuộc màn chứa nhóm đó.
  const nhom = new Map();
  for (const t of doc.querySelectorAll(CHON_TAB)) {
    const k = t.closest('[role="tablist"]') ?? t.parentElement;
    if (!nhom.has(k)) nhom.set(k, []);
    nhom.get(k).push(t);
  }
  const tabSau = [...nhom.values()].flatMap((ds) => ds.slice(1))
    .map((t) => ({ t, khung: idDich(t) ? doc.getElementById(idDich(t)) : null })).filter((x) => x.khung);
  const loaiTruChinh = [...popupNgoai, ...tabSau.map((x) => x.khung)];

  const lienKetFile = [];
  const themDich = (h) => {
    let x = (h || '').split('#')[0].split('?')[0];
    try { x = decodeURIComponent(x); } catch { /* giữ nguyên khi mã hóa hỏng */ }
    if (!x || /^[a-z]+:/i.test(x) || !/\.html?$/i.test(x)) return;
    const dich = path.posix.normalize(path.posix.join(path.posix.dirname(fileRel), x));
    if (dsFile.includes(dich) && dich !== fileRel && !lienKetFile.includes(dich)) lienKetFile.push(dich);
  };
  for (const a of doc.querySelectorAll('a[href]')) themDich(a.getAttribute('href'));
  // Điều hướng bằng JS trong thuộc tính onclick: location.href = '…', window.location = '…', location.assign('…').
  for (const el of doc.querySelectorAll('[onclick]')) {
    for (const m of el.getAttribute('onclick').matchAll(/location(?:\.href)?\s*=\s*['"]([^'"]+)['"]|location\.(?:assign|replace)\(\s*['"]([^'"]+)['"]/g)) {
      themDich(m[1] ?? m[2]);
    }
  }

  const man = [];
  man.push({
    vi_tri: fileRel, cach_mo: 'tải trang', tieu_de: tieuDe(doc.body ?? doc, doc, loaiTruChinh),
    truong: docTruong(doc.body ?? doc, doc, loaiTruChinh), nut: docNut(doc.body ?? doc, loaiTruChinh),
    _toi: lienKetFile, _mo: null,
  });
  for (const { t, khung } of tabSau) {
    man.push({
      vi_tri: fileRel, cach_mo: `tab: ${gon(t.textContent)}`, tieu_de: gon(t.textContent),
      truong: docTruong(khung, doc, popup), nut: docNut(khung, popup), _toi: [], _mo: { kieu: 'tab', nhan: gon(t.textContent) },
    });
  }
  const nhanPopup = (p) => {
    const id = p.getAttribute('id');
    const moi = id ? [...doc.querySelectorAll('[data-bs-target], [data-target], [href], [aria-controls]')]
      .find((el) => idDich(el) === id && !p.contains(el)) : null;
    return moi ? gon(moi.tagName === 'INPUT' ? moi.getAttribute('value') : moi.textContent) : (id ? `#${id}` : '');
  };
  for (const p of popup) {
    const chuoi = [];
    for (let x = p; x; x = popupCha(x)) chuoi.unshift(nhanPopup(x) || '?');
    man.push({
      vi_tri: fileRel, cach_mo: `popup: ${chuoi.join(' > ')}`, tieu_de: tieuDe(p, doc, popupCon(p)),
      truong: docTruong(p, doc, popupCon(p)), nut: docNut(p, popupCon(p)), _toi: [],
      _mo: { kieu: 'popup', id: p.getAttribute('id'), nhan: nhanPopup(p) },
    });
  }
  return danhSoTrung(man);
}

// ---------- Nhận dạng nguồn

export function nhanDangNguon(dNguon) {
  const dist = THU_MUC_DIST.map((d) => path.join(dNguon, d)).find((d) => fs.existsSync(path.join(d, 'index.html'))) ?? null;
  const fNguon = path.join(dNguon, TEP_NGUON);
  let link = null, chon = null;
  if (fs.existsSync(fNguon)) {
    const b = bangMarkdown(fs.readFileSync(fNguon, 'utf8'), ['Mục', 'Giá trị']);
    const gt = (muc) => (b?.hang.find((x) => x['Mục'].toLowerCase() === muc)?.['Giá trị'] || '').replace(/[<>`]/g, '').trim();
    if (/^https?:\/\//i.test(gt('link'))) link = gt('link');
    if (['dist', 'link', 'html'].includes(gt('duyệt bằng').toLowerCase())) chon = gt('duyệt bằng').toLowerCase();
  }
  const maNguon = fs.existsSync(path.join(dNguon, THU_MUC_MA_NGUON)) ? path.join(dNguon, THU_MUC_MA_NGUON) : null;
  const html = duyetFile(dNguon, ['.html', '.htm'], ['node_modules', '.git', ...THU_MUC_DIST, THU_MUC_MA_NGUON])
    .map((f) => path.relative(dNguon, f).split(path.sep).join('/'));
  return { dist, link, maNguon, html, chon };
}

const chuanRoute = (r) => `/${r.split('/').filter(Boolean).join('/')}`;

// Route khai báo trong mã nguồn: react-router (path: '/x', <Route path="/x">), Next.js (app/**/page, pages/**).
// Chỉ lấy đường dẫn tuyệt đối; route con khai báo tương đối không ghép được với route cha nên bỏ qua.
export function routeMaNguon(dMa) {
  const ra = new Set();
  const goi = duyetFile(dMa, ['package.json'], ['node_modules', '.git']).map((f) => fs.readFileSync(f, 'utf8'));
  const laNext = goi.some((t) => /"next"\s*:/.test(t));
  const doanNext = (s) => s.split('/').filter((x) => x && !/^\(.*\)$/.test(x) && !x.startsWith('@'))
    .map((x) => x.replace(/^\[\[?\.\.\.(.+?)\]?\]$/, ':$1*').replace(/^\[(.+)\]$/, ':$1'));
  for (const f of duyetFile(dMa, ['.js', '.jsx', '.ts', '.tsx'], ['node_modules', '.git', ...THU_MUC_DIST, '.next'])) {
    const rel = path.relative(dMa, f).split(path.sep).join('/');
    if (laNext) {
      const a = rel.match(/(?:^|\/)app\/((?:.*\/)?)page\.[jt]sx?$/);
      if (a) ra.add(chuanRoute(doanNext(a[1]).join('/')));
      const p = rel.match(/(?:^|\/)pages\/(.*)\.[jt]sx?$/);
      if (p && !/(^|\/)(_|api\/)/.test(p[1])) ra.add(chuanRoute(doanNext(p[1].replace(/(^|\/)index$/, '')).join('/')));
    }
    const t = fs.readFileSync(f, 'utf8');
    if (!/Route|createBrowserRouter|createHashRouter|useRoutes/.test(t)) continue;
    for (const m of t.matchAll(/\bpath\s*(?::|=)\s*\{?\s*['"`](\/[^'"`\s]*)['"`]/g)) ra.add(chuanRoute(m[1]));
  }
  return [...ra].sort();
}

// Đoạn đường dẫn là tham số: số, uuid, chuỗi hex dài, mã sinh tự động (Firebase: dài, có số, có chữ hoa và thường).
const laThamSo = (s) => /^\d+$/.test(s) || /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s)
  || /^[0-9a-f]{16,}$/i.test(s) || (/^[A-Za-z0-9_-]{16,}$/.test(s) && /\d/.test(s) && /[A-Z]/.test(s) && /[a-z]/.test(s));

// Khóa route của một URL cùng nguồn với app ('/ho-so/:id'); null khi khác nguồn hoặc là tệp (pdf, ảnh…).
export function khoaRoute(u, goc0) {
  let x;
  try { x = new URL(u, goc0.href); } catch { return null; }
  if (x.origin !== goc0.origin || !/^https?:$/.test(x.protocol)) return null;
  let p;
  if (x.hash.startsWith('#/')) p = x.hash.slice(1).split('?')[0];
  else {
    p = x.pathname;
    const tien = goc0.pathname.replace(/\/$/, '');
    if (tien && p.startsWith(tien)) p = p.slice(tien.length);
  }
  try { p = decodeURIComponent(p); } catch { /* giữ nguyên */ }
  p = p.replace(/\/index\.html?$/i, '/').replace(/\.html?$/i, '');
  if (/\.[a-z0-9]{2,5}$/i.test(p)) return null;
  return chuanRoute(p.split('/').map((s) => (laThamSo(s) ? ':id' : s)).join('/'));
}

const khopMau = (mau, r) => new RegExp(`^${mau.split('/').map((s) => (s.startsWith(':')
  ? (s.endsWith('*') ? '.*' : '[^/]+') : s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))).join('/')}$`).test(r);

// ---------- Trình duyệt, server cục bộ

async function moTrinhDuyet() {
  let pw;
  try { pw = await import('playwright'); } catch { return { loi: 'chưa cài playwright: cd kit/tools/ba-verify && npm install' }; }
  const loi = [];
  for (const kenh of [null, 'chrome', 'msedge']) {
    try {
      return { b: await pw.chromium.launch(kenh ? { channel: kenh } : {}), kenh: kenh ?? 'chromium' };
    } catch (e) { loi.push(`${kenh ?? 'chromium'}: ${e.message.split('\n')[0]}`); }
  }
  return { loi: loi.join('; ') };
}

const KIEU_TEP = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.map': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.txt': 'text/plain; charset=utf-8', '.wasm': 'application/wasm',
};

// Server tĩnh cho bản build SPA: tệp có thật thì trả tệp; bản build đặt base khác '/' (vd /app/) thì bỏ dần đoạn đầu
// tới khi gặp tệp; Next.js export: /x → x.html, x/index.html; còn lại trả index.html để router của app xử lý.
export function moServer(dGoc) {
  const goc = path.resolve(dGoc);
  const tep = (f) => f.startsWith(goc + path.sep) && fs.existsSync(f) && fs.statSync(f).isFile();
  const gui = (res, f) => {
    res.writeHead(200, { 'content-type': KIEU_TEP[path.extname(f).toLowerCase()] ?? 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  };
  const sv = http.createServer((req, res) => {
    let p = '/';
    try { p = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch { /* giữ '/' */ }
    const doan = p.split('/').filter(Boolean);
    for (let i = 0; i < doan.length; i++) {
      const f = path.join(goc, ...doan.slice(i));
      if (tep(f)) return gui(res, f);
    }
    for (const f of [path.join(goc, `${p}.html`), path.join(goc, p, 'index.html')]) if (tep(f)) return gui(res, f);
    if (path.extname(p) && !/\.html?$/i.test(p)) { res.writeHead(404); return res.end(); }
    return gui(res, path.join(goc, 'index.html'));
  });
  return new Promise((ok) => sv.listen(0, '127.0.0.1', () => ok(sv)));
}

// ---------- Duyệt app (chạy trong trình duyệt)

// Chạy trong trang. Phần tử bấm thử theo thứ tự DOM: bỏ phần tử ẩn, tab, phần tử nằm trong phần tử bấm khác, liên
// kết có href thật (đã lấy qua href), trùng nhãn. Thêm dòng đầu bảng có con trỏ bàn tay (thường mở màn chi tiết).
// i == null → trả nhãn; có i → trả phần tử thứ i.
const DS_BAM = ({ chonBam, chonTab, chonKhung, i }) => {
  const nhan = (el) => (el.innerText || el.getAttribute('aria-label') || el.getAttribute('title') || el.value || '')
    .replace(/\s+/g, ' ').trim().slice(0, 80);
  const hien = (el) => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
  const ra = [];
  const da = new Set();
  for (const el of document.querySelectorAll(chonBam)) {
    if (!hien(el) || el.disabled || el.closest(chonTab) || el.parentElement?.closest(chonBam)) continue;
    const href = el.tagName === 'A' ? (el.getAttribute('href') ?? '') : null;
    if (href && href !== '#' && !href.startsWith('javascript:')) continue;
    const t = nhan(el);
    const trongKhung = !!el.closest(chonKhung);
    const k = `${trongKhung ? 'K|' : ''}${t}`;
    if (!t || da.has(k)) continue;
    da.add(k);
    ra.push({ el, nhan: t, trongKhung });
  }
  for (const tr of document.querySelectorAll('tbody > tr:first-child')) {
    if (hien(tr) && getComputedStyle(tr).cursor === 'pointer') { ra.push({ el: tr, nhan: 'dòng đầu bảng', trongKhung: false }); break; }
  }
  return i == null ? ra.map(({ nhan: n, trongKhung }) => ({ nhan: n, trongKhung })) : (ra[i]?.el ?? null);
};

// Chạy trong trang. Tab trừ tab đầu mỗi nhóm. i == null → trả nhãn; có i → trả phần tử.
const DS_TAB = ({ chonTab, i }) => {
  const nhom = new Map();
  for (const t of document.querySelectorAll(chonTab)) {
    if (!t.getClientRects().length || t.parentElement?.closest(chonTab)) continue;
    const k = t.closest('[role="tablist"], .ant-tabs-nav-list') ?? t.parentElement;
    if (!nhom.has(k)) nhom.set(k, []);
    nhom.get(k).push(t);
  }
  const sau = [...nhom.values()].flatMap((ds) => ds.slice(1));
  return i == null ? sau.map((t) => (t.innerText || t.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim()) : (sau[i] ?? null);
};

// Chạy trong trang, với phần tử tab vừa bấm: HTML của khung nội dung đang hiện của tab đó.
const KHUNG_TAB = (t) => {
  const hien = (x) => x && x.getClientRects().length > 0;
  const id = t.getAttribute('aria-controls');
  if (id && hien(document.getElementById(id))) return document.getElementById(id).outerHTML;
  const chon = '[role="tabpanel"], .ant-tabs-tabpane-active, .tab-pane.active';
  for (let c = t.parentElement; c; c = c.parentElement) {
    const p = [...c.querySelectorAll(chon)].find(hien);
    if (p) return p.outerHTML;
  }
  return null;
};

// Chạy trong trang: URL, độ dài chữ, HTML các popup đang mở (lớp ngoài cùng).
const TRANG_THAI = (chonPopup) => {
  const hien = (x) => x.getClientRects().length > 0 && getComputedStyle(x).visibility !== 'hidden' && getComputedStyle(x).display !== 'none';
  const ds = [...document.querySelectorAll(chonPopup)].filter((x) => hien(x) && !x.parentElement?.closest(chonPopup));
  return { href: location.href, dai: document.body.innerText.length, popup: ds.map((x) => x.outerHTML) };
};

// Chạy trong trang: đánh dấu ô nhập, nút đang ẩn (tab chưa mở, phần thu gọn) để không tính vào màn đang xem.
const DANH_DAU_AN = (chon) => {
  for (const el of document.querySelectorAll(chon)) {
    if (el.getClientRects().length) el.removeAttribute('data-ba-an');
    else el.setAttribute('data-ba-an', '');
  }
};

// Chạy trong trang: mở các mục menu đang thu gọn trong khung điều hướng để thấy mục con.
const MO_RONG = (chonKhung) => {
  let n = 0;
  for (const el of document.querySelectorAll(`:is(${chonKhung}) [aria-expanded="false"]`)) {
    if (el.getClientRects().length) { el.click(); n++; }
  }
  return n;
};

// Mục trong menu thả xuống của nút đổi vai (Ant Design, MUI, role="menuitem").
const CHON_MUC_VAI = '[role="menuitem"], .ant-dropdown-menu-item, .MuiMenuItem-root';

// Chạy trong trang: mục vai đang hiện. Nhãn là dòng đầu của mục, bỏ phần sau " · " (dấu vai đang dùng thay đổi theo
// vai đang chọn). i == null → trả nhãn; có i → trả phần tử.
const DS_VAI = ({ chon, i }) => {
  const ds = [...document.querySelectorAll(chon)].filter((el) => el.getClientRects().length > 0);
  return i == null ? ds.map((el) => (el.innerText || '').split('\n')[0].split(' · ')[0].replace(/\s+/g, ' ').trim()) : (ds[i] ?? null);
};

async function taiTrang(trang, url) {
  await trang.goto(url, { waitUntil: 'load', timeout: 30000 });
  await trang.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
  await trang.waitForTimeout(300);
}

async function moMenuVai(trang, nut) {
  await trang.getByRole('button', { name: nut }).or(trang.getByTitle(nut, { exact: true })).first().click({ timeout: 3000 });
  await trang.waitForTimeout(300);
  return trang.evaluate(DS_VAI, { chon: CHON_MUC_VAI });
}

async function chonVai(trang, { nut, muc }) {
  const i = (await moMenuVai(trang, nut)).indexOf(muc);
  if (i < 0) throw new Error(`không thấy vai "${muc}" trong menu "${nut}"`);
  await (await trang.evaluateHandle(DS_VAI, { chon: CHON_MUC_VAI, i })).asElement().click({ timeout: 3000 });
  await trang.waitForTimeout(300);
}

// vai: { nut, muc, goc } — tải trang gốc, chọn vai, rồi chuyển tới url trong app để vai không bị đặt lại.
async function chuanBi(trang, url, vai = null) {
  if (!vai) await taiTrang(trang, url);
  else {
    await taiTrang(trang, vai.goc);
    await chonVai(trang, vai);
    await trang.evaluate((dich) => {
      if (location.href === dich) return;
      const d = new URL(dich);
      if (d.pathname === location.pathname && d.hash !== location.hash) location.hash = d.hash;
      else { history.pushState(null, '', dich); dispatchEvent(new PopStateEvent('popstate')); }
    }, url);
    await trang.waitForTimeout(300);
  }
  for (let k = 0; k < 3; k++) {
    if (!await trang.evaluate(MO_RONG, CHON_KHUNG_DH)) break;
    await trang.waitForTimeout(300);
  }
}

// Màn từ một đoạn HTML (trang hoặc popup): tiêu đề, trường, nút. Trang: chỉ phần nội dung (bỏ khung điều hướng).
function manTuHtml(JSDOM, html, laTrang) {
  const dom = new JSDOM(laTrang ? html : `<!DOCTYPE html><body>${html}</body>`);
  const doc = dom.window.document;
  globalThis.CSS ??= dom.window.CSS ?? { escape: (s) => s.replace(/["\\]/g, '\\$&') };
  const goc_ = (laTrang && doc.querySelector(CHON_NOI_DUNG)) || doc.body;
  const loaiTru = [...doc.querySelectorAll('[data-ba-an]'),
    ...(laTrang ? [...doc.querySelectorAll(CHON_POPUP_APP), ...(goc_ === doc.body ? doc.querySelectorAll(CHON_KHUNG_DH) : [])] : [])];
  return { tieu_de: tieuDe(goc_, doc, loaiTru), truong: docTruong(goc_, doc, loaiTru), nut: docNut(goc_, loaiTru) };
}

// Duyệt app từ goc0 (URL). chiDoRoute: chỉ dò route (để đối chiếu nguồn thứ hai): không chụp, không ghi tab, popup.
// vai: { nut, muc } (--doi-vai) — duyệt dưới vai này. boQua: route đã duyệt ở vai trước, chỉ dò liên kết, không trả về.
async function duyetApp(b, JSDOM, goc0, { routeHat = [], toiDa = 200, bamCaNutGhi = false, chiDoRoute = false, vai = null, boQua = new Set(), nhanh = false } = {}) {
  const trang = await b.newPage({ viewport: { width: 1366, height: 900 } });
  trang.on('dialog', (d) => d.dismiss().catch(() => {}));
  trang.context().on('page', (p) => p.close().catch(() => {}));
  if (vai) vai = { ...vai, goc: goc0.href };
  await chuanBi(trang, goc0.href, vai);
  const kieuHash = new URL(trang.url()).hash.startsWith('#/') || await trang.locator('a[href^="#/"]').count() > 0;
  const tien = goc0.pathname.replace(/\/$/, '');
  const urlCua = (r) => (kieuHash ? `${goc0.origin}${tien}/#${r}` : `${goc0.origin}${tien}${r}`);
  const cho = [];
  const daCo = new Map();
  let vuot = false;
  const them = (r, url) => {
    if (!r || daCo.has(r)) return;
    if (daCo.size >= toiDa) { vuot = true; return; }
    daCo.set(r, url);
    cho.push(r);
  };
  them(khoaRoute(trang.url(), goc0), trang.url());
  for (const r of routeHat) if (!/[:*]/.test(r)) them(r, urlCua(r));
  const menu = new Set();
  const chuyenHuong = {};
  const daThuKhung = new Set();
  const cfg = { chonBam: CHON_BAM, chonTab: CHON_TAB_APP, chonKhung: CHON_KHUNG_DH };
  const ra = [];

  while (cho.length) {
    const route = cho.shift();
    const url = daCo.get(route);
    const muc = { route, man: [], toi: [] };
    const chiDo = chiDoRoute || boQua.has(route);
    if (vai) process.stderr.write(`   [${vai.muc}] ${route}${boQua.has(route) ? ' (đã duyệt, chỉ dò liên kết)' : ''} — còn chờ ${cho.length}\n`);
    // Liên kết trong khung điều hướng tính vào menu kể cả khi trỏ route đang xem; trong nội dung chỉ tính route khác.
    const toi = (r, khung) => {
      if (!r) return;
      if (khung) menu.add(r);
      else if (r !== route && !muc.toi.includes(r)) muc.toi.push(r);
    };
    try {
      await chuanBi(trang, url, vai);
      const thuc = khoaRoute(trang.url(), goc0);
      if (thuc && thuc !== route) { chuyenHuong[route] = thuc; them(thuc, trang.url()); continue; }
      for (const a of await trang.$$eval('a[href]', (as, k) => as.map((x) => ({ href: x.href, khung: !!x.closest(k) })), CHON_KHUNG_DH)) {
        const r = khoaRoute(a.href, goc0);
        them(r, a.href);
        toi(r, a.khung);
      }
      if (!chiDo) {
        await trang.evaluate(DANH_DAU_AN, `${CHON_TRUONG}, ${CHON_NUT}`);
        muc.man.push({ ...manTuHtml(JSDOM, await trang.content(), true), cach_mo: 'tải trang', _anh: await trang.screenshot({ fullPage: true }) });
        const tab = await trang.evaluate(DS_TAB, { chonTab: CHON_TAB_APP });
        for (let i = 0; i < tab.length; i++) {
          const el = (await trang.evaluateHandle(DS_TAB, { chonTab: CHON_TAB_APP, i })).asElement();
          if (!el) continue;
          await el.click({ timeout: 3000 }).catch(() => {});
          await trang.waitForTimeout(400);
          const r = khoaRoute(trang.url(), goc0);
          if (r !== route) { them(r, trang.url()); toi(r, false); await chuanBi(trang, url, vai); continue; }
          await trang.evaluate(DANH_DAU_AN, `${CHON_TRUONG}, ${CHON_NUT}`);
          const khung = await el.evaluate(KHUNG_TAB);
          const m = khung ? manTuHtml(JSDOM, khung, false) : manTuHtml(JSDOM, await trang.content(), true);
          muc.man.push({ ...m, tieu_de: tab[i] || m.tieu_de, cach_mo: `tab: ${tab[i]}`, _anh: await trang.screenshot({ fullPage: true }) });
        }
        if (tab.length) await chuanBi(trang, url, vai);
      }
      // --nhanh: bấm mục khung điều hướng ngay trên trang, không tải lại (nhóm menu vừa mở giữ nguyên, lấy lại danh sách
      // sau mỗi lần bấm để thấy mục con); mục đổi route thì ghi route, ở lại trang mới bấm tiếp. Cuối cùng bấm dòng đầu
      // bảng của route (chưa duyệt) để tìm màn chi tiết. Không bấm nút trong nội dung, không ghi popup.
      const ds = nhanh ? [] : await trang.evaluate(DS_BAM, cfg);
      if (nhanh) {
        const thu = new Set();
        const duocBam = (x) => !thu.has(x.nhan) && !daThuKhung.has(x.nhan) && !(vai && x.nhan === vai.nut)
          && (bamCaNutGhi || !RE_NUT_GHI.test(x.nhan));
        for (let vong = 0; vong < 400; vong++) {
          const truoc = await trang.evaluate(DS_BAM, cfg);
          const i = truoc.findIndex((x) => x.trongKhung && duocBam(x));
          if (i < 0) break;
          const el = (await trang.evaluateHandle(DS_BAM, { ...cfg, i })).asElement();
          const nhan = truoc[i].nhan;
          thu.add(nhan);
          if (!el) continue;
          try { await el.click({ timeout: 3000 }); } catch { continue; }
          await trang.waitForTimeout(300);
          const r = khoaRoute(trang.url(), goc0);
          if (r && r !== route) { daThuKhung.add(nhan); them(r, trang.url()); toi(r, true); }
          else {
            // Không đổi route mà mục khung ít đi (nút thu gọn menu, mở popover che menu): bấm lại để trả về.
            const sau = await trang.evaluate(DS_BAM, cfg);
            if (sau.filter((x) => x.trongKhung).length < truoc.filter((x) => x.trongKhung).length) {
              await trang.keyboard.press('Escape').catch(() => {});
              const j = sau.findIndex((x) => x.trongKhung && x.nhan === nhan);
              const el2 = j < 0 ? null : (await trang.evaluateHandle(DS_BAM, { ...cfg, i: j })).asElement();
              if (el2) { await el2.click({ timeout: 3000 }).catch(() => {}); await trang.waitForTimeout(300); }
            }
          }
          // Mục con vừa hiện (nhóm menu mở ra) thường là liên kết có href: gom luôn.
          for (const a of await trang.$$eval('a[href]', (as, k) => as.map((x) => ({ href: x.href, khung: !!x.closest(k) })), CHON_KHUNG_DH)) {
            const r2 = khoaRoute(a.href, goc0);
            them(r2, a.href);
            toi(r2, a.khung);
          }
        }
        if (!boQua.has(route) && !chiDoRoute) {
          if (trang.url() !== url) await chuanBi(trang, url, vai);
          const j = (await trang.evaluate(DS_BAM, cfg)).findIndex((x) => x.nhan === 'dòng đầu bảng');
          const el = j < 0 ? null : (await trang.evaluateHandle(DS_BAM, { ...cfg, i: j })).asElement();
          if (el && await el.click({ timeout: 3000 }).then(() => true, () => false)) {
            await trang.waitForTimeout(400);
            const r = khoaRoute(trang.url(), goc0);
            if (r && r !== route) { them(r, trang.url()); toi(r, false); }
          }
        }
      }
      for (let i = 0, bam = 0; i < ds.length && bam < TOI_DA_NUT; i++) {
        const { nhan, trongKhung } = ds[i];
        // Route đã duyệt ở vai trước: chỉ bấm mục trong khung điều hướng để tìm route mới của vai này.
        if (boQua.has(route) && !trongKhung) continue;
        if (!bamCaNutGhi && RE_NUT_GHI.test(nhan)) continue;
        if (vai && nhan === vai.nut) continue;
        if (trongKhung && daThuKhung.has(nhan)) continue;
        if (trongKhung) daThuKhung.add(nhan);
        const el = (await trang.evaluateHandle(DS_BAM, { ...cfg, i })).asElement();
        if (!el) continue;
        bam++;
        const truoc = await trang.evaluate(TRANG_THAI, CHON_POPUP_APP);
        try { await el.click({ timeout: 3000 }); } catch { continue; }
        await trang.waitForTimeout(600);
        await trang.evaluate(DANH_DAU_AN, `${CHON_TRUONG}, ${CHON_NUT}`);
        const sau = await trang.evaluate(TRANG_THAI, CHON_POPUP_APP);
        const r = khoaRoute(sau.href, goc0);
        if (r && r !== route) { them(r, sau.href); toi(r, trongKhung); }
        else {
          // Mục menu không đổi route (trỏ route đang xem, hoặc chỉ mở menu con): thử lại ở route khác.
          if (trongKhung) daThuKhung.delete(nhan);
          if (!chiDo && sau.popup.length > truoc.popup.length) {
            muc.man.push({ ...manTuHtml(JSDOM, sau.popup.at(-1), false), cach_mo: `popup: ${nhan}`, _anh: await trang.screenshot() });
          }
        }
        if (sau.href !== truoc.href || sau.popup.length !== truoc.popup.length || sau.dai !== truoc.dai) await chuanBi(trang, url, vai);
      }
    } catch (e) {
      const loi = e.message.split('\n')[0];
      if (vai) process.stderr.write(`   LỖI duyệt ${route}: ${loi}\n`);
      if (muc.man.length) muc.man[0].loi = `bấm thử dừng giữa chừng: ${loi}`;
      else muc.man.push({ cach_mo: 'tải trang', tieu_de: '', truong: [], nut: [], _anh: null, loi: `Playwright: ${loi}` });
    }
    if (boQua.has(route)) continue;
    danhSoTrung(muc.man);
    ra.push(muc);
  }
  await trang.close();
  return { route: ra, menu: [...menu], chuyenHuong, vuot };
}

// ---------- Chính

export async function quetPrototype({ goc, nguon = '0-inputs/presales/prototype', ra = '1-ba-init/0-dau-vao', tinh = false,
  tu = null, toiDa = 200, bamCaNutGhi = false, doiVai = null, nhanh = false } = {}) {
  let JSDOM;
  try { ({ JSDOM } = await import('jsdom')); } catch {
    throw new Error('chưa cài phụ thuộc: cd kit/tools/ba-verify && npm install');
  }
  const dNguon = path.join(goc, nguon);
  if (!fs.existsSync(dNguon)) throw new Error(`không thấy ${nguon}`);
  const nd = nhanDangNguon(dNguon);
  const kieu = tu ?? nd.chon ?? (nd.dist ? 'dist' : nd.link ? 'link' : nd.html.length ? 'html' : null);
  if (!kieu) throw new Error(`${nguon} không có prototype: cần dist/ (bản build), ${TEP_NGUON} (link) hoặc tệp HTML — 1-ba-init/templates/nguon-prototype.md`);
  if (!['dist', 'link', 'html'].includes(kieu)) throw new Error('--tu phải là dist, link hoặc html');
  if (kieu === 'dist' && !nd.dist) throw new Error(`không có ${THU_MUC_DIST.join('/, ')}/ chứa index.html trong ${nguon}`);
  if (kieu === 'link' && !nd.link) throw new Error(`${nguon}/${TEP_NGUON} không có dòng "Link" là địa chỉ http(s)`);
  if (kieu !== 'html' && tinh) throw new Error('--tinh chỉ dùng cho prototype HTML tĩnh; app (dist, link) cần trình duyệt');
  if (kieu === 'html' && doiVai) throw new Error('--doi-vai chỉ dùng cho app (dist, link)');

  const dAnh = path.join(goc, ra, 'man-presales');
  const td = tinh ? { loi: 'chạy với --tinh' } : await moTrinhDuyet();
  const coPw = !td.loi;
  if (kieu !== 'html' && !coPw) {
    throw new Error(`prototype dạng ${kieu} cần trình duyệt, không mở được (${td.loi}). Cài Google Chrome, hoặc: cd kit/tools/ba-verify && npx playwright install chromium`);
  }
  const routeMa = nd.maNguon ? routeMaNguon(nd.maNguon) : [];
  const relDNguon = (d) => path.relative(goc, d).split(path.sep).join('/');
  // tatCa: [{ viTri, man: [{ vi_tri, cach_mo, …, _toi, _anh | _mo }], trang }]
  let tatCa = [];
  const phu = {};

  if (kieu === 'html') {
    for (const rel of nd.html) {
      const fAbs = path.join(dNguon, rel);
      let html = fs.readFileSync(fAbs, 'utf8');
      let trang = null, loi = null;
      if (coPw) {
        try {
          trang = await td.b.newPage({ viewport: { width: 1366, height: 900 } });
          await trang.goto(pathToFileURL(fAbs).href, { waitUntil: 'load' });
          await trang.waitForTimeout(300);
          html = await trang.content();
        } catch (e) { loi = `Playwright: ${e.message.split('\n')[0]}`; trang = null; }
      }
      const dom = new JSDOM(html);
      globalThis.CSS ??= dom.window.CSS ?? { escape: (s) => s.replace(/["\\]/g, '\\$&') };
      const man = phanTich(dom.window.document, rel, nd.html);
      for (const m of man) {
        m.doc_bang = trang ? 'playwright' : 'tinh';
        m.loi = loi;
      }
      tatCa.push({ viTri: rel, man, trang });
    }
    phu.duyet = relDNguon(dNguon);
  } else {
    let sv = null;
    const mo = async (k) => {
      if (k === 'link') return new URL(nd.link);
      sv = await moServer(nd.dist);
      return new URL(`http://127.0.0.1:${sv.address().port}/`);
    };
    try {
      const goc0 = await mo(kieu);
      let kq;
      if (!doiVai) kq = await duyetApp(td.b, JSDOM, goc0, { routeHat: routeMa, toiDa, bamCaNutGhi, nhanh });
      else {
        const t = await td.b.newPage({ viewport: { width: 1366, height: 900 } });
        await taiTrang(t, goc0.href);
        const dsVai = [...new Set((await moMenuVai(t, doiVai)).filter(Boolean))];
        await t.close();
        if (!dsVai.length) throw new Error(`bấm "${doiVai}" không thấy mục vai nào`);
        kq = { route: [], menu: [], chuyenHuong: {}, vuot: false };
        const boQua = new Set();
        for (const muc of dsVai) {
          const k = await duyetApp(td.b, JSDOM, goc0, { routeHat: routeMa, toiDa, bamCaNutGhi, vai: { nut: doiVai, muc }, boQua, nhanh });
          for (const r of k.route) { r.vai = muc; boQua.add(r.route); kq.route.push(r); }
          kq.menu.push(...k.menu);
          Object.assign(kq.chuyenHuong, k.chuyenHuong);
          kq.vuot ||= k.vuot;
        }
        kq.menu = [...new Set(kq.menu)];
        phu.vai = dsVai;
      }
      if (sv) { sv.close(); sv = null; }
      tatCa = kq.route.map((r) => ({
        viTri: r.route,
        man: r.man.map((m, j) => ({ ...m, vi_tri: r.route, vai: r.vai ?? null, _toi: j === 0 ? r.toi : [], doc_bang: 'playwright', loi: m.loi ?? null })),
      })).sort((x, y) => x.viTri.localeCompare(y.viTri));
      phu.duyet = kieu === 'link' ? nd.link : relDNguon(nd.dist);
      phu.menu = kq.menu;
      phu.chuyen_huong = kq.chuyenHuong;
      if (kq.vuot) phu.vuot_gioi_han = toiDa;
      // Nguồn thứ hai (có cả dist và link): dò route để đối chiếu.
      const khac = kieu === 'dist' ? (nd.link ? 'link' : null) : (nd.dist ? 'dist' : null);
      if (khac) {
        const goc1 = await mo(khac);
        const kq2 = await duyetApp(td.b, JSDOM, goc1, { routeHat: routeMa, toiDa, chiDoRoute: true });
        if (sv) { sv.close(); sv = null; }
        const a = new Set(tatCa.map((x) => x.viTri));
        const b2 = new Set(kq2.route.map((x) => x.route).filter((r) => !kq2.chuyenHuong[r]));
        phu.lech_nguon = [...[...a].filter((r) => !b2.has(r)).map((r) => ({ route: r, chi_co_o: kieu })),
          ...[...b2].filter((r) => !a.has(r)).map((r) => ({ route: r, chi_co_o: khac }))];
      }
    } finally { if (sv) sv.close(); }
  }

  // Cấp mã. Đã có man-presales.json (chạy lại, /ba-init --bo-sung): màn cũ giữ mã theo (vị trí, cách mở); màn mới cấp
  // tiếp sau số lớn nhất; màn cũ không còn trong prototype vẫn giữ trong danh sách, đánh dấu lỗi, để mã không bị dùng lại.
  // Chưa có: cấp theo thứ tự vị trí (bảng chữ cái), trong mỗi vị trí: màn chính, tab, popup.
  const fCu = path.join(goc, ra, 'man-presales.json');
  const cu = (fs.existsSync(fCu) ? JSON.parse(fs.readFileSync(fCu, 'utf8')).man : []).map((m) => ({ ...m, vi_tri: m.vi_tri ?? m.file }));
  const khoa = (m) => `${m.vi_tri}|${m.cach_mo}`;
  const maCu = new Map(cu.map((m) => [khoa(m), m.ma]));
  let so = Math.max(0, ...cu.map((m) => Number(m.ma.slice(3))));
  const maChinh = new Map();
  for (const { viTri, man } of tatCa) {
    for (const m of man) m.ma = maCu.get(khoa(m)) ?? `MP-${String(++so).padStart(3, '0')}`;
    maChinh.set(viTri, man[0].ma);
  }
  const conLai = new Set(tatCa.flatMap(({ man }) => man.map(khoa)));
  const daBo = cu.filter((m) => !conLai.has(khoa(m)))
    .map(({ file, ...m }) => ({ ...m, di_toi: [], anh: null, loi: 'không còn trong prototype presales' }));
  for (const { man } of tatCa) {
    man[0].di_toi = [...man.slice(1).map((m) => m.ma), ...man[0]._toi.map((f) => maChinh.get(f)).filter(Boolean)];
    for (const m of man.slice(1)) m.di_toi = [];
  }

  // Ảnh. App: đã chụp khi duyệt. HTML tĩnh: màn chính, rồi bấm tab, mở popup.
  if (coPw) fs.mkdirSync(dAnh, { recursive: true });
  for (const { man, trang } of tatCa) {
    for (const m of man) {
      const fAnh = path.join(dAnh, `${m.ma}.png`);
      const ghi = () => { m.anh = path.relative(goc, fAnh).split(path.sep).join('/'); };
      m.anh = null;
      if (m._anh) { fs.writeFileSync(fAnh, m._anh); ghi(); continue; }
      if (!trang) continue;
      try {
        if (m._mo?.kieu === 'tab') {
          await trang.getByRole('tab', { name: m._mo.nhan }).or(trang.getByText(m._mo.nhan, { exact: true })).first().click({ timeout: 2000 });
          await trang.waitForTimeout(200);
        } else if (m._mo?.kieu === 'popup') {
          const sel = m._mo.id ? `[data-bs-target="#${m._mo.id}"], [data-target="#${m._mo.id}"], [href="#${m._mo.id}"], [aria-controls="${m._mo.id}"]` : null;
          if (sel && await trang.locator(sel).count()) await trang.locator(sel).first().click({ timeout: 2000 });
          else if (m._mo.id) await trang.evaluate((id) => { const d = document.getElementById(id); if (d?.showModal) d.showModal(); else if (d) d.style.display = 'block'; }, m._mo.id);
          await trang.waitForTimeout(300);
        }
        await trang.screenshot({ path: fAnh, fullPage: true });
        ghi();
        if (m._mo?.kieu === 'popup') { await trang.keyboard.press('Escape'); await trang.reload({ waitUntil: 'load' }); }
      } catch (e) {
        m.loi = `không chụp được: ${e.message.split('\n')[0]}`;
      }
    }
    if (trang) await trang.close();
  }
  if (coPw) await td.b.close();

  const ketQua = {
    tao_luc: new Date().toISOString().slice(0, 19),
    nguon,
    kieu,
    duyet: phu.duyet,
    link: nd.link,
    so_vi_tri: tatCa.length,
    doc_bang: coPw ? `playwright (${td.kenh})` : `tinh (${td.loi})`,
    ...(kieu !== 'html' ? { menu: phu.menu.map((r) => maChinh.get(r)).filter(Boolean).sort() } : {}),
    ...(kieu !== 'html' && Object.keys(phu.chuyen_huong).length ? { chuyen_huong: phu.chuyen_huong } : {}),
    ...(phu.vai ? { vai: phu.vai } : {}),
    ...(nhanh ? { nhanh: true } : {}),
    route_ma_nguon: routeMa,
    route_chua_mo: routeMa.filter((r) => !phu.chuyen_huong?.[r] && !tatCa.some((x) => x.viTri === r || khopMau(r, x.viTri))),
    ...(phu.lech_nguon ? { lech_nguon: phu.lech_nguon } : {}),
    ...(phu.vuot_gioi_han ? { vuot_gioi_han: phu.vuot_gioi_han } : {}),
    man: [...tatCa.flatMap(({ man }) => man), ...daBo].map((m) => ({
      ma: m.ma, vi_tri: m.vi_tri, cach_mo: m.cach_mo, tieu_de: m.tieu_de, truong: m.truong, nut: m.nut,
      di_toi: m.di_toi, anh: m.anh, doc_bang: m.doc_bang, loi: m.loi, ...(m.vai ? { vai: m.vai } : {}),
    })).sort((x, y) => x.ma.localeCompare(y.ma)),
  };
  fs.mkdirSync(path.join(goc, ra), { recursive: true });
  fs.writeFileSync(path.join(goc, ra, 'man-presales.json'), `${JSON.stringify(ketQua, null, 2)}\n`);
  return ketQua;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = thamSo(process.argv.slice(2));
  const goc = a.goc ? path.resolve(a.goc) : timGoc(process.cwd());
  quetPrototype({
    goc, nguon: a.nguon, ra: a.ra, tinh: !!a.tinh, tu: a.tu ?? null,
    toiDa: a['toi-da'] ? Number(a['toi-da']) : 200, bamCaNutGhi: !!a['bam-ca-nut-ghi'],
    doiVai: typeof a['doi-vai'] === 'string' ? a['doi-vai'] : null, nhanh: !!a.nhanh,
  }).then((k) => {
    const loi = k.man.filter((m) => m.loi);
    console.log(`== DUYỆT PROTOTYPE PRESALES — ${k.kieu}: ${k.duyet}`);
    console.log(`   ${k.so_vi_tri} ${k.kieu === 'html' ? 'file HTML' : 'route'}, ${k.man.length} màn, đọc bằng ${k.doc_bang}`);
    if (k.vai) console.log(`   ${k.vai.length} vai: ${k.vai.join('; ')}`);
    console.log(`   ${k.man.filter((m) => m.anh).length} ảnh; ${loi.length} màn có lỗi`);
    for (const m of loi) console.log(`     - ${m.ma} ${m.vi_tri} (${m.cach_mo}): ${m.loi}`);
    if (k.route_ma_nguon.length) console.log(`   Mã nguồn: ${k.route_ma_nguon.length} route; chưa mở được: ${k.route_chua_mo.join(', ') || 'không'}`);
    if (k.lech_nguon?.length) console.log(`   Lệch dist ↔ link: ${k.lech_nguon.map((x) => `${x.route} (chỉ ${x.chi_co_o})`).join(', ')}`);
    if (k.vuot_gioi_han) console.log(`   CẢNH BÁO: dừng ở ${k.vuot_gioi_han} route (--toi-da), có thể còn route chưa duyệt`);
    console.log('   Ghi: 1-ba-init/0-dau-vao/man-presales.json');
  }).catch((e) => { console.error(`LỖI: ${e.message}`); process.exit(1); });
}
