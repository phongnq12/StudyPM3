/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* nối chữ đỏ .field-error với ô nhập (aria-invalid + aria-describedby) để trình đọc màn hình đọc được lỗi.
 * Chữ đỏ dựng ở nhiều nơi (React và engine.js dựng DOM) ⇒ canh 1 chỗ bằng MutationObserver thay vì sửa từng màn. */
/* nhóm lựa chọn (role=radiogroup) nhận aria trên khung nhóm, ⛔ trên từng nút con */
const CONTROL = 'input:not([type=hidden]):not([type=checkbox]):not([type=radio]), textarea, select, [role=combobox], [role=radiogroup]';
const MARK = 'data-fe-link';
let seq = 0;

const isShown = (el) => !!(el.textContent || '').trim() && (el.classList.contains('on') || el.classList.contains('is-visible') || el.offsetParent !== null);

/* ô của 1 chữ đỏ = các ô trong tổ tiên gần nhất chỉ chứa đúng 1 chữ đỏ (đi lên tối đa 4 tầng) */
function controlsOf(errorEl) {
  let node = errorEl.parentElement;
  for (let depth = 0; node && depth < 4; depth++, node = node.parentElement) {
    if (node.querySelectorAll('.field-error').length > 1) return [];
    const found = [...node.querySelectorAll(CONTROL)].filter((c) => !c.closest('.field-error') && !c.parentElement.closest('[role=radiogroup]'));
    if (found.length) return found;
  }
  /* ô lồng sâu hơn 4 tầng (vd ô tra cứu thân nhân) ⇒ dò theo quy ước tên chỗ báo lỗi {mã ô}Loi */
  const own = errorEl.id && /Loi$/.test(errorEl.id) ? document.getElementById(errorEl.id.replace(/Loi$/, '')) : null;
  if (own) { if (own.matches(CONTROL + ', button')) return [own]; const inner = own.querySelector(CONTROL); if (inner) return [inner]; }
  return [];
}

function unlink(control) {
  const ids = (control.getAttribute(MARK) || '').split(' ').filter(Boolean);
  if (!ids.length) return;
  const rest = (control.getAttribute('aria-describedby') || '').split(' ').filter((t) => t && !ids.includes(t));
  if (rest.length) control.setAttribute('aria-describedby', rest.join(' ')); else control.removeAttribute('aria-describedby');
  control.removeAttribute('aria-invalid');
  control.removeAttribute(MARK);
}

function link(control, errorId) {
  const own = (control.getAttribute(MARK) || '').split(' ').filter(Boolean);
  const described = (control.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
  if (!described.includes(errorId)) described.push(errorId);
  if (!own.includes(errorId)) own.push(errorId);
  control.setAttribute('aria-describedby', described.join(' '));
  control.setAttribute('aria-invalid', 'true');
  control.setAttribute(MARK, own.join(' '));
}

export function syncFieldErrors(root = document) {
  const wanted = new Map();
  const shownErrors = [];
  for (const err of root.querySelectorAll('.field-error')) {
    if (!isShown(err)) continue;
    if (!err.id) err.id = 'fe-auto-' + (++seq);
    shownErrors.push(err);
    for (const c of controlsOf(err)) wanted.set(c, [...(wanted.get(c) || []), err.id]);
  }
  for (const c of root.querySelectorAll('[' + MARK + ']')) if (!wanted.has(c)) unlink(c);
  for (const [c, ids] of wanted) {
    const stale = (c.getAttribute(MARK) || '').split(' ').filter((t) => t && !ids.includes(t));
    if (stale.length) unlink(c);
    for (const id of ids) link(c, id);
  }
  return shownErrors;
}

/* có chữ đỏ MỚI hiện mà chữ đỏ đầu tiên nằm ngoài khung nhìn ⇒ cuộn tới đó (giữa khung) và đặt con trỏ vào ô.
 * Ô đang nằm trong khung nhìn thì không cuộn (rời ô bắt buộc còn trống chỉ hiện lỗi tại chỗ). Vùng cuộn là khung .shell, trừ phần đầu màn ghim. */
let prevShown = new Set();
function scrollToFirstNewError(shownErrors) {
  const now = new Set(shownErrors.map((e) => e.id));
  const hasNew = shownErrors.some((e) => !prevShown.has(e.id));
  prevShown = now;
  if (!hasNew || !shownErrors.length) return;
  /* chỉ cuộn tới chữ đỏ đang hiện thật trên màn — chữ đỏ ở bước đang ẩn vẫn mang lớp .on nhưng không có chỗ để cuộn tới */
  const visible = shownErrors.filter((e) => e.offsetParent !== null);
  if (!visible.length) return;
  const first = visible[0];
  const box = first.closest('.shell') || document.documentElement;
  const b = box.getBoundingClientRect(), r = first.getBoundingClientRect();
  const pinned = [...box.querySelectorAll(':scope > .bc, :scope > .page-head, :scope > .shell-head, :scope > .status-bar, :scope > div > .page-head:first-child')].reduce((h, e) => Math.max(h, e.getBoundingClientRect().bottom - b.top), 0);
  const inView = r.top >= b.top + pinned && r.bottom <= b.bottom;
  if (inView) return;
  const control = controlsOf(first)[0];
  (control || first).scrollIntoView({ block: 'center', behavior: 'smooth' });
  if (control && typeof control.focus === 'function') control.focus({ preventScroll: true });
}

export function installFieldErrorA11y() {
  let pending = false;
  const run = () => { pending = false; scrollToFirstNewError(syncFieldErrors()); };
  /* bỏ qua đợt đổi do chính hàm này ghi thuộc tính aria, tránh vòng lặp */
  const obs = new MutationObserver((list) => {
    if (pending || list.every((m) => m.type === 'attributes' && m.attributeName !== 'class')) return;
    pending = true; requestAnimationFrame(run);
  });
  obs.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['class', 'aria-describedby', 'aria-invalid', MARK] });
}
