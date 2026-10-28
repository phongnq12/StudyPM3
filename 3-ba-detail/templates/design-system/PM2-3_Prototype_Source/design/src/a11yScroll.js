/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Vùng cuộn của site (main, bảng Markdown rộng) Tab tới được để cuộn bằng phím — WCAG 2.1.1, axe scrollable-region-focusable.
 * Gắn bằng MutationObserver vì bảng Markdown và trang đổi theo định tuyến hash, không phải sửa từng chỗ dựng bảng. */
const SELECTOR = 'main.main, main.main > .shell, .sd-md-table';   /* .shell tự cuộn từ (đầu màn ghim) */

function mark(root) {
  for (const el of root.querySelectorAll ? root.querySelectorAll(SELECTOR) : []) {
    if (el.hasAttribute('tabindex')) continue;
    el.setAttribute('tabindex', '0');
    if (el.classList.contains('sd-md-table')) { el.setAttribute('role', 'region'); el.setAttribute('aria-label', 'Bảng nội dung'); }
  }
}

export function installScrollableFocus() {
  mark(document);
  new MutationObserver((list) => { for (const m of list) for (const n of m.addedNodes) if (n.nodeType === 1) { if (n.matches && n.matches(SELECTOR)) mark(n.parentNode || document); mark(n); } })
    .observe(document.body, { childList: true, subtree: true });
}
