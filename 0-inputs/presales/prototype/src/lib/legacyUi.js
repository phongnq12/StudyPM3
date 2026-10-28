/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Shared page behaviours ported from base/pm2-base.js + the common script block of the HTML prototype.
 * - installTooltip : tooltip only when text is truncated (CSS ellipsis, line-clamp, or [data-full] set by code) + data-tip for icon buttons
 * - applyDataFe : data-fe attribute from DATA_FE; App* components that set data-fe themselves are kept
 * - installHints : hint bubble for [data-nhac]
 * - toast : top message (antd message look), close button is an AppButton
 * Rules: section 6 */
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { StyleProvider } from '@ant-design/cssinjs';
import { AppButtonWithIcon } from '@/components/app/AppButton';
import { keyHtml } from '@/lib/richText';
import { msg } from './msg.js';

export const DATA_FE = [
  ['.tooltip', 'Tooltip'], ['.dlg', 'Modal'], ['.pager', 'Pagination'], ['.tabs', 'AppTabs'], ['.tag', 'Tag'],
  ['details', 'Collapse'], ['.compare', 'AppDateRangePicker'], ['.filter-select', 'AppSelect'], ['select', 'AppSelect'],
  ['textarea', 'AppTextArea'], ['input[type=number]', 'AppInputNumber'], ['input[type=checkbox]', 'Checkbox'],
  ['input[type=radio]', 'Radio'], ['.compare input', 'AppDateRangePicker:input'],
  ['input[id*=Gio]:not(.filter-select-input), input[id$=Tu], input[id$=Den], input[id^=nlTu], input[id^=nlDen]', 'TimePicker'],
  ['input[type=text]:not(.filter-select-input), input:not([type]):not(.filter-select-input)', 'AppInput'], ['.field', 'Form.Item'],
  ['.grid', 'Custom:ScheduleGrid'], ['.slot-grid', 'Custom:SlotGrid'], ['table', 'Table'], ['#vungToast, #toast', 'message'],
];

export function applyDataFe(root) {
  const scope = root && root.querySelectorAll ? root : document;
  DATA_FE.forEach(([selector, name]) => { scope.querySelectorAll(selector).forEach((node) => { if (!node.hasAttribute('data-fe')) node.setAttribute('data-fe', name); }); });
  scope.querySelectorAll('button:not([data-fe]), [role=button]:not([data-fe])').forEach((node) => {
    if (node.closest('.slot-grid, .grid')) return;
    const hasIcon = !!node.querySelector('svg'), hasText = (node.textContent || '').replace(/\s+/g, '').length > 0;
    node.setAttribute('data-fe', hasIcon ? 'AppButtonWithIcon' + (hasText ? '' : ':isOnlyIcon') : 'AppButton');
  });
}

let tooltipInstalled = false;
export function installTooltip(descriptions) {
  if (tooltipInstalled) return; tooltipInstalled = true;
  let bubble = null, target = null;
  const ensureBubble = () => { if (!bubble) { bubble = document.createElement('div'); bubble.className = 'tooltip'; document.body.appendChild(bubble); } return bubble; };
  const show = (element, text) => {
    /* chữ bọc trong .tooltip-text để cắt 8 dòng (góp ý Designer) mà không cắt mũi tên ::after của khung */
    const o = ensureBubble(); o.textContent = ''; const t = document.createElement('span'); t.className = 'tooltip-text'; t.textContent = text; o.appendChild(t);
    const b = element.getBoundingClientRect(), n = o.getBoundingClientRect();
    const above = b.top - n.height - 10 > 0;
    o.classList.toggle('placement-top', above); o.classList.toggle('placement-bottom', !above);
    o.style.left = Math.max(8, Math.min(b.left + b.width / 2 - n.width / 2, innerWidth - n.width - 8)) + 'px';
    o.style.top = (above ? b.top - n.height - 10 : b.bottom + 10) + 'px';
    o.classList.add('is-visible'); target = element;
  };
  /* rê chuột: trễ 400ms mới hiện để lướt qua hàng nút không nhấp nháy (như PM1) */
  let timer = null, pending = null;
  const later = (el, text) => { if (target === el || pending === el) return; clearTimeout(timer); pending = el; timer = setTimeout(() => { pending = null; show(el, text); }, 400); };
  const hide = () => { clearTimeout(timer); pending = null; if (bubble) bubble.classList.remove('is-visible'); target = null; };
  const isTruncated = (e) => {
    const cs = getComputedStyle(e);
    if (cs.textOverflow === 'ellipsis' && e.scrollWidth > e.clientWidth + 1) return true;
    return cs.webkitLineClamp && cs.webkitLineClamp !== 'none' && e.scrollHeight > e.clientHeight + 1;
  };
  const findTruncated = (t) => { for (let e = t, i = 0; e && e !== document.body && i < 5; e = e.parentElement, i++) if (e.nodeType === 1 && isTruncated(e)) return e; return null; };
  document.addEventListener('mouseover', (ev) => {
    if (!ev.target.closest || ev.target.closest('[data-nhac]')) return;
    if (ev.target.closest('[data-no-tooltip]')) { hide(); return; }   /* vùng không dùng tooltip, ví dụ thông báo */
    const full = ev.target.closest('[data-full]');   /* chữ rút gọn bằng code (cắt 200 ký tự, +N người) ⇒ hiện nội dung đầy đủ */
    if (full && full.getAttribute('data-full')) { later(full, full.getAttribute('data-full')); return; }
    const cut = findTruncated(ev.target);
    if (cut) { const text = (cut.innerText || cut.textContent || '').replace(/\s+/g, ' ').trim(); if (text) { later(cut, text); return; } }
    const icon = ev.target.closest('[data-tip]');
    if (icon && !(icon.innerText || '').replace(/\s+/g, '').length) { later(icon, icon.getAttribute('data-tip')); return; }
    hide();
  });
  /* bàn phím Tab tới nút icon hoặc chữ rút gọn ⇒ hiện ngay, rời focus thì ẩn (WCAG 1.4.13) */
  document.addEventListener('focusin', (ev) => {
    const n = ev.target; if (!n || !n.closest || !n.matches(':focus-visible')) return;
    const full = n.closest('[data-full]'); if (full && full.getAttribute('data-full')) { show(full, full.getAttribute('data-full')); return; }
    if (n.getAttribute('data-tip') && !(n.innerText || '').replace(/\s+/g, '').length) show(n, n.getAttribute('data-tip'));
  });
  document.addEventListener('focusout', hide);
  /* WCAG 1.4.13: Escape tắt tooltip đang hiện, focus giữ nguyên. Bắt ở pha capture của window và chặn lan
 * để Escape lần đầu chỉ tắt tooltip, không đóng luôn hộp thoại phía sau; không có tooltip thì Escape đi tiếp như cũ */
  window.addEventListener('keydown', (ev) => {
    if (ev.key !== 'Escape') return;
    if (!(bubble && bubble.classList.contains('is-visible'))) { clearTimeout(timer); pending = null; return; }
    hide(); ev.stopImmediatePropagation(); ev.preventDefault();
  }, true);
  document.addEventListener('mouseout', (ev) => { const cur = target || pending; if (cur && (!ev.relatedTarget || !cur.contains(ev.relatedTarget))) hide(); });
  document.addEventListener('scroll', hide, true);
  const tipOf = (n) => {
    if (n.closest('.dlg-h') && n.classList.contains('ib')) return 'Đóng';
    if (n.classList.contains('record-code-link')) return n.closest('.reward-discipline-code') ? 'Xem chi tiết kỷ luật' : 'Xem chi tiết khen thưởng';
    const text = ((n.innerText || n.textContent || '').replace(/\s+/g, ' ').trim()) || (n.getAttribute('aria-label') || '').trim();
    if (/^Hàng loạt/.test(text)) return 'Thao tác hàng loạt với các lịch hẹn đã chọn';
    if (n.classList.contains('tab-n')) return 'Xem ' + text.charAt(0).toLowerCase() + text.slice(1);
    return descriptions[text] || text;
  };
  const attachTips = (scope) => {
    scope.querySelectorAll('button, [role=button], a[onclick], a[data-onclick]').forEach((n) => {
      if (n.getAttribute('data-nhac')) { n.removeAttribute('title'); return; }
      const tipText = n.getAttribute('title') || n.getAttribute('data-tip') || tipOf(n) || (n.textContent || '').replace(/\s+/g, ' ').trim();
      if (tipText) n.setAttribute('data-tip', tipText);
      if (n.hasAttribute('title')) n.removeAttribute('title');
    });
    scope.querySelectorAll('[title]').forEach((n) => { if (!(n instanceof SVGElement)) n.removeAttribute('title'); });
  };
  const run = () => { attachTips(document); applyDataFe(document); };
  run();
  new MutationObserver(run).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['title'] });
}

/* Hint bubble for [data-nhac] */
let hintBubble = null, hintTarget = null;
export function showHint(element) {
  const text = element.getAttribute('data-nhac'); if (!text || !hintBubble) return;
  hintBubble.textContent = text;
  hintBubble.classList.toggle('is-compact', !!element.closest('.table-calendar'));   /* thẻ gợi ý của lịch theo buồng: chữ bằng chữ tag */
  const b = element.getBoundingClientRect(), n = hintBubble.getBoundingClientRect();
  const above = b.top - n.height - 10 > 0;
  hintBubble.classList.toggle('placement-top', above); hintBubble.classList.toggle('placement-bottom', !above);
  let left = b.left + b.width / 2 - n.width / 2;
  left = Math.max(8, Math.min(left, innerWidth - n.width - 8));
  hintBubble.style.left = left + 'px';
  hintBubble.style.top = (above ? b.top - n.height - 10 : b.bottom + 10) + 'px';
  hintBubble.classList.add('is-visible'); hintTarget = element;
}
export function hideHint() { if (hintBubble) hintBubble.classList.remove('is-visible'); hintTarget = null; }
let hintsInstalled = false;
export function installHints() {
  if (hintsInstalled) return; hintsInstalled = true;
  hintBubble = document.createElement('div'); hintBubble.className = 'tooltip'; document.body.appendChild(hintBubble);
  document.addEventListener('mouseover', (e) => { const v = e.target.closest && e.target.closest('[data-nhac]'); if (v) showHint(v); });
  document.addEventListener('mouseout', (e) => {
    const v = e.target.closest && e.target.closest('[data-nhac]'); if (!v) return;
    const to = e.relatedTarget;
    if (to && v.contains(to)) return;
    if (to && (to === hintBubble || hintBubble.contains(to))) return;
    hideHint();
  });
  document.addEventListener('scroll', () => {
    if (!hintTarget) return;
    const b = hintTarget.getBoundingClientRect();
    if (b.bottom < 0 || b.top > innerHeight) { hideHint(); return; }
    showHint(hintTarget);
  }, true);
}

const TOAST_ICONS = {
  'is-success': '<path d="M22 11.1V12a10 10 0 1 1-5.9-9.1"/><polyline points="22 4 12 14.01 9 11.01"/>',
  'is-error': '<circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/>',
  'is-warning': '<path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
};
/* type: 'is-success' (default) · 'is-error' · 'is-warning' — values are CSS class names (Prototype_Conventions/CSS_Class_Mapping.md) */
/* Delay counted from the moment the page scripts of the HTML prototype run (domInteractive of this document),
 * so a timer set on page load fires at the same moment as in the HTML prototype even though React mounts later. */
export function delayFromPageStart(ms) {
  const nav = performance.getEntriesByType('navigation')[0];
  return Math.max(0, (nav ? nav.domInteractive : 0) + ms - performance.now());
}

export function toast(text, type) {
  const region = document.getElementById('vungToast'); if (!region) return null;
  const kind = TOAST_ICONS[type] ? type : 'is-success';
  const e = document.createElement('div');
  e.className = 'tmsg ' + kind;
  e.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
    + TOAST_ICONS[kind] + '</svg><span>' + keyHtml(text) + '</span><span class="tmsg-x-slot"></span>';   /* thoát HTML rồi in đậm key */
  region.appendChild(e);
  const slot = e.querySelector('.tmsg-x-slot'); slot.style.display = 'contents'; const root = createRoot(slot);
  root.render(createElement(StyleProvider, { layer: true }, createElement(AppButtonWithIcon, { className: 'tmsg-x', 'aria-label': 'Đóng', 'data-tip': 'Đóng', onClick: () => close(), iconRaw: '<path d="M18 6 6 18M6 6l12 12"/>' })));
  let timer = null;
  const close = () => { if (timer) { clearTimeout(timer); timer = null; } e.classList.add('is-closed'); setTimeout(() => { root.unmount(); e.remove(); }, 220); };
  const restart = () => { if (timer) clearTimeout(timer); timer = setTimeout(close, 5000); };   /* toast hiện 5 giây */
  restart();
  e.addEventListener('mouseenter', () => { if (timer) { clearTimeout(timer); timer = null; } });
  e.addEventListener('mouseleave', restart);
  return e;
}
export const notifyInDevelopment = () => toast(msg('W001-09'), 'is-warning');
