/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Table timeline — shared DATA helpers (axis of working hours, config of 1 counter on 1 day, fit checks).
 * The drawing lives in src/components/app/TableCalendar.jsx (1 shared look) and TablePicker.jsx (create / counter logic).
 * Giờ của ngày theo WEB-54 (shiftsOfDate), buồng theo quầy (tablesOfCounter), đệm giữa 2 lịch theo thứ của ngày (breakMinutesOfDate), thời lượng C04 (durationOptions) —.
 * Quầy của người cai nghiện = quầy Hoạt động đang giữ dãy nhà của người đó. */
import { breakMinutesOfDate, durationOptions, shiftsOfDate } from '@/data/visitConfigStore';
import { findTable, tablesOfCounter } from '@/data/visitTableStore';
import { counterOfDormitory, readCounters } from '@/data/receptionDeskStore';
import { dormitoryName, dormitoryOfStudent } from '@/data/dormitoryStore';
import { msg } from './msg.js';   /* message theo mã */

export const TIMELINE_STEP_MINUTES = 5;
/* Chữ của khoảng suất riêng trên lưới */
export const RESERVED_LABEL = 'Suất riêng';

/* Thời lượng dùng cho timelineConfig — giờ nghỉ đi theo ngày nên nằm trong room (counterRoom) */
export const bookingSettings = () => ({ durationMinutes: durationOptions() });

/* Dãy nhà và quầy tiếp đón của người cai nghiện — counter null khi dãy chưa thuộc quầy nào hoặc quầy không Hoạt động */
export function studentResource(studentCode) {
  const dormitoryCode = dormitoryOfStudent(studentCode);
  const owner = counterOfDormitory(dormitoryCode);
  return { dormitoryCode, dormitoryName: dormitoryName(dormitoryCode), counter: owner && owner.status === 'ACTIVE' ? owner : null };
}
export const counterLabel = (c) => (c ? c.code + ' — ' + c.name : '');
/* không chỗ nào chỉ hiện mã: «Mã — Tên» của buồng / quầy theo mã (không tìm thấy thì trả nguyên chữ, vd «Chưa xếp buồng») */
export const tableLabel = (code) => { const t = code ? findTable(String(code).trim()) : null; return t ? t.code + ' — ' + t.name : (code || ''); };
export const counterLabelOf = (code) => { const c = code ? readCounters().find((x) => x.code === code) : null; return c ? counterLabel(c) : (code || ''); };
/* #25 · #26 bộ chuỗi đã duyệt */
/* {Quầy hiện tại} = quầy tiếp đón đang Hoạt động. Nhiều quầy Hoạt động thì nối bằng «hoặc» */
export const noCounterMessage = (dormName) => {
  const active = readCounters().filter((c) => c.status === 'ACTIVE').map(counterLabel);
  return msg('E001-25', dormName, active.length ? active.join(' hoặc ') : 'quầy tiếp đón đang hoạt động');
};
export const counterFullMessage = (counterName) => msg('W001-07', counterName);

/* "Phòng" dựng theo quầy cho timelineConfig: ca của ngày theo WEB-54, buồng Hoạt động của quầy.
 * allowReserved: Đăng ký tại quầy được dùng suất riêng; nguồn App và cán bộ đặt hộ thì khoảng giờ khóa của buồng giữ riêng là bận */
export function counterRoom(counter, date, allowReserved) {
  const ranges = (counter && counter.reservedRanges) || [];
  return {
    code: counter ? counter.code : '', name: counterLabel(counter),
    shifts: date ? shiftsOfDate(date) : [],
    breakMinutes: date ? breakMinutesOfDate(date) : 0,
    tables: counter ? tablesOfCounter(counter.code, true).map((t) => ({
      code: t.code, name: t.name,
      busySlots: allowReserved ? [] : ranges.filter((r) => r.from && r.to && (r.tableCodes || []).indexOf(t.code) >= 0).map((r) => ({ from: r.from, to: r.to, reserved: true })),
    })) : [],
  };
}
/* lưới chọn buồng gồm buồng của quầy đã chọn (trên đầu) và buồng của các quầy Hoạt động khác (bên dưới, chọn được).
 * Mỗi buồng mang counterCode và group (nhãn quầy) để lưới nhóm theo quầy và nơi gọi đổi quầy khi chọn buồng của quầy khác */
export function allCountersRoom(counter, date, allowReserved) {
  const list = (counter ? [counter] : []).concat(activeCounters().filter((c) => !counter || c.code !== counter.code));
  return { ...counterRoom(counter, date, allowReserved), tables: list.flatMap((c) => counterRoom(c, date, allowReserved).tables.map((t) => ({ ...t, counterCode: c.code, group: counterLabel(c) }))) };
}
/* Quầy Hoạt động — Lịch theo buồng nhóm buồng theo quầy */
export const activeCounters = () => readCounters().filter((c) => c.status === 'ACTIVE');
/* Lịch nguồn App và cán bộ đặt hộ không dùng suất riêng; Đăng ký tại quầy được dùng */
export const usesReserved = (source) => source === 'COUNTER';

const pad2 = (n) => String(n).padStart(2, '0');
export const BREAK_BAND_PX = 28;

/* Axis that shows only working hours: the shifts sit side by side and the time between 2 shifts collapses into a narrow "Nghỉ trưa" band.
 * x(minute) → px from the lane start · minuteAt(px) → minute (inside a band: the nearer shift edge) · parts: [{ from, to, left, width, isBreak, name, index }] */
export function workingAxis(shifts, pxPerMinute) {
  const segs = [];
  shifts.map((s) => [s.open, s.close, s.name || '']).sort((a, b) => a[0] - b[0]).forEach(([a, b, name]) => {
    const last = segs[segs.length - 1];
    if (last && a <= last[1]) last[1] = Math.max(last[1], b); else segs.push([a, b, name]);
  });
  const parts = []; let offset = 0;
  segs.forEach(([a, b, name], i) => {
    if (i) { parts.push({ from: segs[i - 1][1], to: a, left: offset, width: BREAK_BAND_PX, isBreak: true }); offset += BREAK_BAND_PX; }
    parts.push({ from: a, to: b, left: offset, width: (b - a) * pxPerMinute, isBreak: false, name, index: parts.filter((q) => !q.isBreak).length }); offset += (b - a) * pxPerMinute;
  });
  const from = segs.length ? segs[0][0] : 0, to = segs.length ? segs[segs.length - 1][1] : 0;
  const x = (m) => {
    if (m <= from) return 0;
    if (m >= to) return offset;
    const p = parts.find((q) => m >= q.from && m <= q.to);
    return p.left + p.width * (m - p.from) / (p.to - p.from);
  };
  const minuteAt = (px) => {
    if (px <= 0) return from;
    const p = parts.find((q) => px >= q.left && px <= q.left + q.width);
    if (!p) return to;
    if (p.isBreak) return px - p.left < p.width / 2 ? p.from : p.to;
    return p.from + (px - p.left) / pxPerMinute;
  };
  return { parts, from, to, width: offset, x, minuteAt };
}
export const minutesToClock = (m) => pad2(Math.floor(m / 60)) + ':' + pad2(m % 60);
export const clockToMinutes = (t) => { const p = String(t).split(':'); return (+p[0]) * 60 + (+p[1]); };

/* Config of 1 room on 1 day.
 * bookedIntervals(tableCode) → [[start, end], …] in minutes of appointments already holding that table on that day
 * dayCompare → < 0 the day is over (nothing bookable) · 0 today (times before now not bookable) · > 0 a later day */
export function timelineConfig(room, duration, bookingConfig, bookedIntervals, dayCompare) {
  const isToday = dayCompare === 0, isPast = dayCompare < 0;
  const now = new Date(), nowMinutes = now.getHours() * 60 + now.getMinutes();
  return {
    shifts: room.shifts.map((s) => ({ name: s.name, open: clockToMinutes(s.openTime), close: clockToMinutes(s.closeTime) })),
    /* busy: [from, to] lịch đã đặt (khi kiểm cộng đệm 2 phía) · [from, to, 'reserved'] suất riêng (không cộng đệm) */
    tables: room.tables.map((t) => ({
      code: t.code, name: t.name, counterCode: t.counterCode || room.code, group: t.group || '',
      busy: t.busySlots.map((b) => [clockToMinutes(b.from), clockToMinutes(b.to)].concat(b.reserved ? ['reserved'] : [])).concat(bookedIntervals ? bookedIntervals(t.code) : []),
    })),
    breakMinutes: room.breakMinutes || 0,
    now: isToday ? nowMinutes : null,
    minStart: isPast ? 24 * 60 : isToday ? Math.ceil(nowMinutes / TIMELINE_STEP_MINUTES) * TIMELINE_STEP_MINUTES : null,
    duration: +duration,
    minDuration: Math.min(...bookingConfig.durationMinutes),
    maxDuration: Math.max(...bookingConfig.durationMinutes),
  };
}

/* bookedIntervals for timelineConfig: appointments of that day that hold a table (statuses in holdsNoResource do not), except excludeCode (the one being edited) */
export const bookedFrom = (appointments, isoDay, holdsNoResource, excludeCode) => (tableCode) => appointments
  .filter((a) => a.code !== excludeCode && a.tableCode === tableCode && a.visitDate === isoDay && a.visitTime && holdsNoResource.indexOf(a.status) < 0)
  .map((a) => { const s = clockToMinutes(String(a.visitTime).slice(0, 5)); return [s, s + (+a.durationMinutes || 45)]; });

export const shiftOf =(config, start, end) => config.shifts.find((s) => start >= s.open && end <= s.close) || null;

/* nhận lịch muộn nhất của ca = giờ kết thúc − 15 phút · cuối ca không đủ thời lượng đã chọn thì rút về số phút còn lại (≥ 15) */
export const LAST_START_BEFORE_CLOSE = 15;
export const lastStartOf = (shift) => shift.close - LAST_START_BEFORE_CLOSE;
export function fitDuration(config, start, duration) {
  const sh = config.shifts.find((s) => start >= s.open && start <= lastStartOf(s));
  return sh ? Math.min(+duration, sh.close - start) : +duration;
}

/* why the block [start, end) cannot go on the table — '' when it fits: inside 1 shift, not in the past, no overlap with an existing appointment */
export function fitReason(config, tableCode, start, end) {
  const table = config.tables.find((t) => t.code === tableCode);
  if (!table || end <= start) return 'Chưa chọn buồng thăm gặp';
  if (config.minStart != null && config.minStart >= 24 * 60) return 'Ngày thăm gặp đã qua';
  if (config.minStart != null && start < config.minStart) return 'Giờ đã qua';
  const sh = shiftOf(config, start, end);
  if (!sh) return msg('I001-75');
  if (start > lastStartOf(sh)) return 'Sau giờ nhận lịch cuối của ca (' + minutesToClock(lastStartOf(sh)) + ')';
  if (table.busy.some(([from, to, kind]) => kind === 'reserved' && start < to && from < end)) return RESERVED_LABEL;
  const gap = config.breakMinutes || 0;
  return table.busy.some(([from, to, kind]) => kind !== 'reserved' && start < to + gap && from - gap < end) ? 'Buồng ' + tableCode + ' đã có lịch giờ này' : '';
}

/* the block [start, end) fits on the table */
export const fitsTimeline = (config, tableCode, start, end) => !fitReason(config, tableCode, start, end);

/* nearest start (5-minute steps, at most 1 duration away) where the block fits — clicking right next to a busy block still works */
export function nearestFit(config, tableCode, start, duration) {
  for (let d = 0; d <= duration; d += TIMELINE_STEP_MINUTES) {
    for (const s of d ? [start - d, start + d] : [start]) if (fitsTimeline(config, tableCode, s, s + fitDuration(config, s, duration))) return s;
  }
  return null;
}

/* Quầy còn ít nhất 1 chỗ đặt được thời lượng ngắn nhất trong các ca của ngày — không còn thì báo #26 */
export function hasAnyFit(config) {
  const d = config.minDuration;
  return config.tables.some((t) => config.shifts.some((sh) => {
    for (let s = Math.max(sh.open, config.minStart == null ? sh.open : config.minStart); s <= lastStartOf(sh); s += TIMELINE_STEP_MINUTES) if (fitsTimeline(config, t.code, s, s + fitDuration(config, s, d))) return true;
    return false;
  }));
}
