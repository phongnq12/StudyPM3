/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Custom blocks of the list screen, ported from the HTML page (no antd component matches the agreed look):
 * FilterDropdown · PM1-style filter select (.fdd), type to filter, accent-insensitive
 * DateRange · date range box (.khoang) + 2-month calendar (.lich)
 * OneDateCalendar · single-date calendar (.lich1) for the grid view and the Adjust popup
 * Calendars are HTML strings identical to the original (same DOM => pixel parity); clicks are delegated. */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AppButton } from '@/components/app/AppButton';
import { formatDate, parseDisplayDate } from './listLogic';

const svgX = (w) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>;

/* ───────── FilterDropdown ───────── */
/* ───────── DateRange: 2-month calendar ───────── */
const toDate = (v) => { const t = parseDisplayDate(v); return t === null ? null : new Date(t); };
/* cal = { open, side: 'from'|'to', from, to, hover, left } */
export function monthHtml(cal, first, isLeft) {   /* xuất cho site Design System vẽ lịch đang mở */
  const title = 'Th ' + String(first.getMonth() + 1).padStart(2, '0') + '&nbsp;&nbsp;' + first.getFullYear();
  const navButton = (step, text, hidden) => '<button type="button" class="calendar-nav' + (hidden ? ' is-invisible' : '') + '" data-buoc="' + step + '">' + text + '</button>';
  let h = '<div class="calendar-month"><div class="calendar-head">' + navButton(-12, '&laquo;', !isLeft) + navButton(-1, '&lsaquo;', !isLeft)
    + '<div class="calendar-title">' + title + '</div>' + navButton(1, '&rsaquo;', isLeft) + navButton(12, '&raquo;', isLeft) + '</div><div class="calendar-grid">';
  ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].forEach((t) => { h += '<div class="calendar-weekday">' + t + '</div>'; });
  const offset = (first.getDay() + 6) % 7;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const from = cal.from ? cal.from.getTime() : null;
  let to = cal.to ? cal.to.getTime() : null;
  if (cal.side === 'to' && from !== null && cal.hover !== null && cal.hover >= from) to = cal.hover;
  for (let i = 0; i < 42; i++) {
    const d = new Date(first.getFullYear(), first.getMonth(), 1 - offset + i); const t = d.getTime(); const classes = ['calendar-day'];
    if (d.getMonth() !== first.getMonth()) classes.push('is-outside');
    if (t === today.getTime() && d.getMonth() === first.getMonth()) classes.push('is-today');
    if (from !== null && t === from) classes.push('is-range-start');
    if (to !== null && t === to) classes.push('is-range-end');
    if (from !== null && to !== null && t > from && t < to) classes.push('is-in-range');
    h += '<div class="' + classes.join(' ') + '" data-t="' + t + '"><span>' + d.getDate() + '</span></div>';
  }
  return h + '</div></div>';
}

export function DateRange({ dateFrom, dateTo, onChange, onClear }) {
  const [cal, setCal] = useState(null);           /* null = calendar never opened (the HTML page creates it lazily) */
  const elRef = useRef(null), boxRef = useRef(null);
  const isOpen = cal && cal.open;
  const openCalendar = (side) => {
    const from = toDate(dateFrom), to = toDate(dateTo);
    const anchor = (side === 'to' ? to : from) || from || new Date();
    let left = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
    if (side === 'to' && to && from && to.getMonth() !== from.getMonth()) left = new Date(to.getFullYear(), to.getMonth() - 1, 1);
    setCal({ open: true, side, from, to, hover: null, left });
  };
  const close = () => setCal((x) => (x && x.open ? { ...x, open: false } : x));
  useEffect(() => {
    if (!cal) return undefined;
    const onMouseDown = (e) => { if (!e.target.closest('.calendar') && !e.target.closest('.date-range')) close(); };
    const onKeyDown = (e) => { if (e.key === 'Escape') close(); };
    const scroller = document.querySelector('.main > .shell') || document.querySelector('.main');   /* khung .shell tự cuộn */
    document.addEventListener('mousedown', onMouseDown); document.addEventListener('keydown', onKeyDown); window.addEventListener('resize', close); if (scroller) scroller.addEventListener('scroll', close);
    return () => { document.removeEventListener('mousedown', onMouseDown); document.removeEventListener('keydown', onKeyDown); window.removeEventListener('resize', close); if (scroller) scroller.removeEventListener('scroll', close); };
  }, [!!cal]);
  useLayoutEffect(() => {
    if (!isOpen || !elRef.current || !boxRef.current) return;
    const box = boxRef.current.getBoundingClientRect(), el = elRef.current;
    const w = el.offsetWidth, h = el.offsetHeight;
    let x = box.right - w; if (x < 8) x = 8;
    let y = box.bottom + 6; if (y + h > window.innerHeight - 8 && box.top - h - 6 > 8) y = box.top - h - 6;
    el.style.left = x + 'px'; el.style.top = y + 'px';
  }, [isOpen, cal && cal.left]);
  const onClick = (e) => {
    const nav = e.target.closest('.calendar-nav');
    if (nav) { setCal({ ...cal, left: new Date(cal.left.getFullYear(), cal.left.getMonth() + (+nav.dataset.buoc), 1) }); return; }
    const cell = e.target.closest('.calendar-day'); if (!cell) return;
    const d = new Date(+cell.dataset.t);
    if (cal.side === 'from' || (cal.from && d < cal.from)) { setCal({ ...cal, from: d, to: null, side: 'to' }); return; }
    onChange(cal.from ? formatDate(cal.from) : '', formatDate(d));   /* đã xoá khoảng ngày rồi chọn «Đến ngày» ⇒ from null, cấm formatDate(null) */
    setCal({ ...cal, to: d, open: false });
  };
  const onHover = (e) => { const cell = e.target.closest('.calendar-day'); const t = cell ? +cell.dataset.t : null; if (t !== cal.hover) setCal({ ...cal, hover: t }); };
  const hasValue = !!(dateFrom || dateTo);
  return (
    <div className="filter-cell filter-date-range">
      <div className={'date-range' + (hasValue ? ' has-text' : '')} title="Lọc theo NGÀY HẸN — chọn khoảng từ ngày đến ngày" ref={boxRef}>
        <input type="text" className={'range-input' + (isOpen && cal.side === 'from' ? ' is-current' : '')} id="ngayTu" readOnly placeholder="Từ ngày" aria-label="Ngày hẹn từ ngày" title="Ngày hẹn — từ ngày" value={dateFrom} onClick={() => openCalendar('from')} />
        <svg className="range-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        <input type="text" className={'range-input' + (isOpen && cal.side === 'to' ? ' is-current' : '')} id="ngayDen" readOnly placeholder="Đến ngày" aria-label="Ngày hẹn đến ngày" title="Ngày hẹn — đến ngày" value={dateTo} onClick={() => openCalendar('to')} />
        <AppButton htmlType="button" className="filter-clear range-clear" title="Xóa khoảng ngày" onClick={onClear}>{svgX('2.5')}</AppButton>
        <svg className="range-cal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" onClick={() => openCalendar('from')}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
      </div>
      {cal && createPortal(
        <div ref={elRef} className={'calendar' + (isOpen ? ' is-open' : '')} onMouseDown={(e) => e.preventDefault()} onClick={onClick} onMouseOver={onHover}
          dangerouslySetInnerHTML={{ __html: monthHtml(cal, cal.left, true) + monthHtml(cal, new Date(cal.left.getFullYear(), cal.left.getMonth() + 1, 1), false) }} />,
        document.body)}
    </div>
  );
}

/* ───────── OneDateCalendar: single date (.lich1), placed under its trigger button ───────── */
function singleMonthHtml(month, selectedDate) {
  let h = '<div class="date-picker-head">'
    + '<button type="button" class="date-picker-nav" data-buoc="-12" title="Năm trước">&laquo;</button>'
    + '<button type="button" class="date-picker-nav" data-buoc="-1" title="Tháng trước">&lsaquo;</button>'
    + '<div class="date-picker-title">' + 'Tháng ' + (month.getMonth() + 1) + ' — ' + month.getFullYear() + '</div>'
    + '<button type="button" class="date-picker-nav" data-buoc="1" title="Tháng sau">&rsaquo;</button>'
    + '<button type="button" class="date-picker-nav" data-buoc="12" title="Năm sau">&raquo;</button>'
    + '</div><div class="date-picker-grid">';
  ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].forEach((t) => { h += '<div class="date-picker-weekday">' + t + '</div>'; });
  const offset = (month.getDay() + 6) % 7;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const selected = new Date(selectedDate); selected.setHours(0, 0, 0, 0);
  for (let i = 0; i < 42; i++) {
    const d = new Date(month.getFullYear(), month.getMonth(), 1 - offset + i); const classes = ['date-picker-day'];
    if (d.getMonth() !== month.getMonth()) classes.push('is-outside');
    if (d.getTime() === today.getTime()) classes.push('is-today');
    if (d.getTime() === selected.getTime()) classes.push('is-selected');
    h += '<div class="' + classes.join(' ') + '" data-t="' + d.getTime() + '"><span>' + d.getDate() + '</span></div>';
  }
  return h + '</div>';
}

/* state = { open, target: 'grid'|'adjust', month } owned by the screen (1 calendar shared by 2 places, as in the HTML page) */
export function OneDateCalendar({ state, setState, selectedDateOf, onPick }) {
  const elRef = useRef(null);
  const close = () => setState((x) => (x && x.open ? { ...x, open: false } : x));
  useEffect(() => {
    if (!state) return undefined;
    const onMouseDown = (x) => { if (!x.target.closest('.date-picker') && !x.target.closest('.cal-date')) close(); };
    const onKeyDown = (x) => { if (x.key === 'Escape') close(); };
    document.addEventListener('mousedown', onMouseDown); document.addEventListener('keydown', onKeyDown); window.addEventListener('resize', close);
    return () => { document.removeEventListener('mousedown', onMouseDown); document.removeEventListener('keydown', onKeyDown); window.removeEventListener('resize', close); };
  }, [!!state]);
  useLayoutEffect(() => {
    if (!state || !state.open || !elRef.current) return;
    const trigger = document.getElementById(state.target === 'adjust' ? 'nutNgayDC' : 'nutNgayLuoi'); if (!trigger) return;
    const n = trigger.getBoundingClientRect(), el = elRef.current, w = el.offsetWidth, h = el.offsetHeight;
    let x = n.left; if (x + w > innerWidth - 8) x = innerWidth - w - 8; if (x < 8) x = 8;
    let y = n.bottom + 6; if (y + h > innerHeight - 8 && n.top - h - 6 > 8) y = n.top - h - 6;
    el.style.left = x + 'px'; el.style.top = y + 'px';
  }, [state && state.open, state && state.month, state && state.target]);
  if (!state) return null;
  const onClick = (e) => {
    const nav = e.target.closest('.date-picker-nav');
    if (nav) { setState({ ...state, month: new Date(state.month.getFullYear(), state.month.getMonth() + (+nav.dataset.buoc), 1) }); return; }
    const cell = e.target.closest('.date-picker-day'); if (!cell) return;
    onPick(state.target, new Date(+cell.dataset.t));
    setState({ ...state, open: false });
  };
  return createPortal(
    <div ref={elRef} className={'date-picker' + (state.target === 'adjust' ? ' date-picker-blue' : '') + (state.open ? ' is-open' : '')} onMouseDown={(e) => e.preventDefault()} onClick={onClick}
      dangerouslySetInnerHTML={{ __html: singleMonthHtml(state.month, selectedDateOf(state.target)) }} />,
    document.body);
}
