/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Custom block drawn as HTML string exactly like the original (same DOM => pixel match), clicks via event delegation:
 * datePickerHtml · single-day calendar (.lich1) of the visit date field */

/* monthStart = day 1 of the month on screen · selected = currently selected day */
export function datePickerHtml(monthStart, selected) {
  const title = 'Tháng ' + (monthStart.getMonth() + 1) + ' — ' + monthStart.getFullYear();
  let h = '<div class="date-picker-head">'
    + '<button type="button" class="date-picker-nav" data-buoc="-12" title="Năm trước">&laquo;</button>'
    + '<button type="button" class="date-picker-nav" data-buoc="-1" title="Tháng trước">&lsaquo;</button>'
    + '<div class="date-picker-title">' + title + '</div>'
    + '<button type="button" class="date-picker-nav" data-buoc="1" title="Tháng sau">&rsaquo;</button>'
    + '<button type="button" class="date-picker-nav" data-buoc="12" title="Năm sau">&raquo;</button>'
    + '</div><div class="date-picker-grid">';
  ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].forEach((day) => { h += '<div class="date-picker-weekday">' + day + '</div>'; });
  const offset = (monthStart.getDay() + 6) % 7;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const picked = new Date(selected); picked.setHours(0, 0, 0, 0);
  for (let i = 0; i < 42; i++) {
    const d = new Date(monthStart.getFullYear(), monthStart.getMonth(), 1 - offset + i);
    const classes = ['date-picker-day'];
    if (d.getMonth() !== monthStart.getMonth()) classes.push('is-outside');
    if (d.getTime() === today.getTime()) classes.push('is-today');
    if (d.getTime() === picked.getTime()) classes.push('is-selected');
    h += '<div class="' + classes.join(' ') + '" data-t="' + d.getTime() + '"><span>' + d.getDate() + '</span></div>';
  }
  return h + '</div>';
}
