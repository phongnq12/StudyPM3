/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Ô CHỌN CÓ TÌM — 1 bản DUY NHẤT cho mọi màn (gộp bản chép trong CounterRegistration/engine.js).
 * Type-to-search select — straight port of ganTim in base/pm2-form.js.
 * Attaches to the REAL <select> (kept like the HTML page): adds an input .tim-o inside .o-chon and a list .tim-ds at the end of body.
 * Picking an item sets selectedIndex then fires change (React receives it via the select's onChange). */

/* strip accents WITHOUT trimming — same as the normalizeSearchText the HTML page declares last */
import { addLookupClear } from '@/lib/lookupClear';
import { msg } from '@/lib/msg';
import './searchSelect.css';   /* CSS danh sách xổ xuống đi theo hàm — màn nào gắn ô có tìm cũng có kiểu */

const normalizeKeepSpaces = (t) => String(t).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();

export function attachSearch(select) {
  if (!select || select.dataset.daGanTim) return;
  select.dataset.daGanTim = '1';
  const wrapper = select.closest('.select-field') || select.parentElement;
  wrapper.classList.add('lookup-wrap');
  const input = document.createElement('input');
  input.type = 'text'; input.className = 'text-input lookup-input'; input.autocomplete = 'off';
  const list = document.createElement('div');
  list.className = 'lookup-list';
  /* tên đọc cho trình đọc màn hình (WCAG 4.1.2): nhãn đã có thì giữ, chưa có thì lấy option đầu «Chọn …» */
  /* tên đặt sẵn (aria-label, label) giữ nguyên; chưa có thì theo option đầu và đổi theo khi danh sách đổi (khoá «Chọn … trước» ⇒ mở «Chọn …») */
  const fixedName = (!select.dataset.autoName && select.getAttribute('aria-label')) || (select.labels && select.labels[0] && select.labels[0].textContent.trim()) || '';
  const applyName = () => {
    const name = fixedName || (select.options[0] ? select.options[0].text.trim() : '');
    if (!name) return;
    for (const el of fixedName ? [input] : [select, input]) { el.setAttribute('aria-label', name); if (!fixedName) el.dataset.autoName = '1'; }
    if (fixedName && !select.getAttribute('aria-label')) select.setAttribute('aria-label', name);
  };
  applyName();
  wrapper.appendChild(input);
  document.body.appendChild(list);
  /* nút xoá như ô lọc · ô luôn phải có giá trị (data-no-clear, vd Chọn trang) thì không có nút xoá */
  const markClear = select.hasAttribute('data-no-clear') ? () => {} : addLookupClear(wrapper, select);
  const openList = () => { wrapper.classList.add('is-open'); list.classList.add('is-open'); };
  const closeList = () => { wrapper.classList.remove('is-open'); list.classList.remove('is-open'); };

  function position() {
    const b = input.getBoundingClientRect();
    list.style.width = b.width + 'px'; list.style.left = b.left + 'px';
    const height = list.offsetHeight || 200;
    if (innerHeight - b.bottom - 8 >= Math.min(height, 320)) { list.style.top = (b.bottom + 4) + 'px'; list.style.bottom = 'auto'; }
    else { list.style.top = 'auto'; list.style.bottom = (innerHeight - b.top + 4) + 'px'; }
  }
  function follow() {
    if (!list.classList.contains('is-open')) return;
    const b = input.getBoundingClientRect();
    if (b.bottom < 0 || b.top > innerHeight) { closeList(); return; }
    position();
  }
  addEventListener('scroll', follow, true);
  addEventListener('resize', follow);

  function sync() {
    const opt = select.options[select.selectedIndex];
    const text = opt ? opt.textContent.trim() : '';
    /* câu gợi ý luôn theo lựa chọn đầu, kể cả khi đang có giá trị: danh sách đổi mà không gán lại
 * thì bấm x xoá sẽ hiện câu của danh sách cũ */
    input.placeholder = select.options[0] ? select.options[0].textContent.trim() : '';
    applyName();
    input.value = select.selectedIndex <= 0 ? '' : text;
    input.disabled = select.disabled;
    if (select.disabled) input.value = '';
    markClear();
  }
  sync();
  select.addEventListener('change', sync);
  new MutationObserver(sync).observe(select, { childList: true, attributes: true, attributeFilter: ['disabled'] });
  select.__syncSearch = sync;

  function render(filter) {
    const key = normalizeKeepSpaces(filter || '');
    let count = 0, lastGroup = null;
    list.innerHTML = '';
    [...select.options].forEach((opt, i) => {
      if (i === 0 && !opt.value) return;
      const text = opt.textContent.trim();
      const group = opt.dataset ? opt.dataset.nhom : null;
      const at = normalizeKeepSpaces(text).indexOf(key);
      if (key && at < 0) return;
      count++;
      if (group && group !== lastGroup) { const h = document.createElement('div'); h.className = 'lookup-group'; h.textContent = group; list.appendChild(h); lastGroup = group; }
      const item = document.createElement('div');
      item.className = 'lookup-item' + (i === select.selectedIndex ? ' is-selected' : '');
      if (key && at >= 0) {
        const b = document.createElement('b'); b.textContent = text.slice(at, at + key.length);
        item.append(document.createTextNode(text.slice(0, at)), b, document.createTextNode(text.slice(at + key.length)));
      } else item.textContent = text;
      item.addEventListener('mousedown', (ev) => {
        ev.preventDefault();
        select.selectedIndex = i;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        sync(); closeList();
      });
      list.appendChild(item);
    });
    if (!count) { const empty = document.createElement('div'); empty.className = 'lookup-empty'; empty.textContent = msg('I001-28');   /* I001-28 dùng chung cho lọc và tìm */ list.appendChild(empty); }
  }

  input.addEventListener('focus', () => { if (select.disabled) return; input.select(); render(''); openList(); position(); });
  /* đã chọn xong ô vẫn giữ focus ⇒ bấm lại không phát focus ⇒ mở lại danh sách tại đây để chọn giá trị khác */
  input.addEventListener('mousedown', () => { if (select.disabled || document.activeElement !== input || list.classList.contains('is-open')) return; render(''); openList(); position(); });
  input.addEventListener('input', () => { render(input.value); openList(); position(); });
  input.addEventListener('blur', () => { closeList(); sync(); });
  input.addEventListener('keydown', (e) => {
    const items = [...list.querySelectorAll('.lookup-item')];
    let i = items.findIndex((x) => x.classList.contains('is-highlighted'));
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!list.classList.contains('is-open')) { render(''); openList(); position(); return; }
      if (i >= 0) items[i].classList.remove('is-highlighted');
      i = e.key === 'ArrowDown' ? Math.min(i + 1, items.length - 1) : Math.max(i - 1, 0);
      if (items[i]) { items[i].classList.add('is-highlighted'); items[i].scrollIntoView({ block: 'nearest' }); }
      return;
    }
    if (e.key === 'Enter') { e.preventDefault(); const c = items[i] || items[0]; if (c) c.dispatchEvent(new MouseEvent('mousedown')); input.blur(); return; }
    if (e.key === 'Escape') { closeList(); input.blur(); }
  });
}
