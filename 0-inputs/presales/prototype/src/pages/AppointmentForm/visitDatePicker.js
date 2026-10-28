/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Visit date calendar (.lich1) — port of moLichHen + moLichLuoi in base/pm2-form.js.
 * Cờ armed bật TRƯỚC khi đặt vị trí ⇒ ngay lần bấm đầu lịch đã nằm dưới nút (bản HTML cũ bật cờ sau nên lần đầu lịch rơi ra ngoài màn hình). */
const WEEKDAY_SHORT = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const NAV_BUTTONS = [[-12, 'Năm trước', '&laquo;'], [-1, 'Tháng trước', '&lsaquo;'], [1, 'Tháng sau', '&rsaquo;'], [12, 'Năm sau', '&raquo;']];

export function createVisitDatePicker({ getDate, onPick }) {
  const cal = { el: null, month: null, armed: false, viewDate: new Date() };
  const navHtml = (x) => '<button type="button" class="date-picker-nav" data-buoc="' + x[0] + '" title="' + x[1] + '">' + x[2] + '</button>';
  const baseDate = () => (cal.armed && getDate() ? getDate() : cal.viewDate);
  const render = () => {
    const first = cal.month, offset = (first.getDay() + 6) % 7;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const current = new Date(baseDate()); current.setHours(0, 0, 0, 0);
    const cells = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(first.getFullYear(), first.getMonth(), 1 - offset + i);
      const classNames = ['date-picker-day'].concat(d.getMonth() !== first.getMonth() ? ['is-outside'] : [], d.getTime() === today.getTime() ? ['is-today'] : [], d.getTime() === current.getTime() ? ['is-selected'] : []);
      cells.push('<div class="' + classNames.join(' ') + '" data-t="' + d.getTime() + '"><span>' + d.getDate() + '</span></div>');
    }
    cal.el.innerHTML = '<div class="date-picker-head">' + navHtml(NAV_BUTTONS[0]) + navHtml(NAV_BUTTONS[1]) + '<div class="date-picker-title">Tháng ' + (first.getMonth() + 1) + ' — ' + first.getFullYear() + '</div>'
      + navHtml(NAV_BUTTONS[2]) + navHtml(NAV_BUTTONS[3]) + '</div><div class="date-picker-grid">' + WEEKDAY_SHORT.map((t) => '<div class="date-picker-weekday">' + t + '</div>').join('') + cells.join('') + '</div>';
  };
  const close = () => { if (cal.el) cal.el.classList.remove('is-open'); };
  const position = () => {
    const button = cal.armed ? document.getElementById('nutNgayHen') : null;
    if (!button) return;
    const n = button.getBoundingClientRect(), w = cal.el.offsetWidth, h = cal.el.offsetHeight;
    let x = n.left; if (x + w > innerWidth - 8) x = innerWidth - w - 8; if (x < 8) x = 8;
    let y = n.bottom + 6; if (y + h > innerHeight - 8 && n.top - h - 6 > 8) y = n.top - h - 6;
    cal.el.style.left = x + 'px'; cal.el.style.top = y + 'px';
  };
  const handleClick = (e) => {
    const nav = e.target.closest('.date-picker-nav');
    if (nav) { cal.month = new Date(cal.month.getFullYear(), cal.month.getMonth() + (+nav.dataset.buoc), 1); render(); return; }
    const cell = e.target.closest('.date-picker-day'); if (!cell) return;
    const d = new Date(+cell.dataset.t);
    if (cal.armed) { onPick(d); cal.armed = false; } else cal.viewDate = d;
    close();
  };
  const createPanel = () => {
    cal.el = document.createElement('div'); cal.el.className = 'date-picker';
    cal.el.addEventListener('mousedown', (x) => x.preventDefault());
    cal.el.addEventListener('click', handleClick);
    document.body.appendChild(cal.el);
    document.addEventListener('mousedown', (x) => { if (cal.el.classList.contains('is-open') && !x.target.closest('.date-picker') && !x.target.closest('.cal-date') && !x.target.closest('#nutNgayHen')) close(); });
    document.addEventListener('keydown', (x) => { if (x.key === 'Escape') close(); });
    window.addEventListener('resize', close);
  };
  return {
    open(e) {
      if (e) e.stopPropagation();
      cal.viewDate = getDate() || new Date();
      if (!cal.el) createPanel();
      cal.armed = true;
      if (cal.el.classList.contains('is-open')) close();
      else { const d = baseDate(); cal.month = new Date(d.getFullYear(), d.getMonth(), 1); render(); cal.el.classList.add('is-open'); position(); }
    },
  };
}
