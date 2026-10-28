/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Pure logic of the appointment form — ported from base/pm2-form.js and the script blocks of the 2 HTML pages */
import { readCreated, readAdjusted, readEdited, readEditing, seedAsLegacyRoundTrip, toIsoDate } from '@/data/appointmentStore';
import { MESSAGES } from './formConfig';

export const WEEKDAY_NAMES = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
const pad2 = (n) => String(n).padStart(2, '0');
export const formatDate = (d) => pad2(d.getDate()) + '/' + pad2(d.getMonth() + 1) + '/' + d.getFullYear();
export const visitDateLabel = (d) => WEEKDAY_NAMES[d.getDay()] + ', ' + formatDate(d);

export const toMinutes = (hhmm) => { const p = String(hhmm).split(':'); return (+p[0]) * 60 + (+p[1]); };
export const toHhmm = (minutes) => { const h = Math.floor(minutes / 60), m = minutes % 60; return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m; };

/* field name mid-sentence is lower-cased, except abbreviations · first item after ":" is capitalised */
export function midSentence(name) {
  const t = String(name || '');
  if (!t) return t;
  const word = t.split(' ')[0];
  if (word.length > 1 && word === word.toUpperCase()) return t;
  return t.charAt(0).toLocaleLowerCase('vi') + t.slice(1);
}
export const afterColon = (list) => list.map((t, i) => { const x = midSentence(t); return i === 0 ? x.charAt(0).toLocaleUpperCase('vi') + x.slice(1) : x; });

export const initials = (name) => { const p = String(name).trim().split(/\s+/); return (p.length >= 2 ? p[p.length - 2][0] + p[p.length - 1][0] : p[0].slice(0, 2)).toUpperCase(); };

export const messageText = (code, params) => Object.keys(params || {}).reduce((text, key) => text.split('{' + key + '}').join(params[key]), MESSAGES[code] || code);

/* bỏ Chờ check-in — lịch tự duyệt luôn vào Đã duyệt, thân nhân check-in sau tại quầy */
export function initialStatus() {
  return 'APPROVED';
}

/* next code — counts both seed records (highest 921) and saved records */
export function nextCode() {
  let max = 921;
  try { readCreated().forEach((r) => { const m = /LH-\d{4}-(\d+)/.exec(r.code || ''); if (m && +m[1] > max) max = +m[1]; }); } catch (e) { /* broken storage still yields a code */ }
  return 'LH-2026-' + String(max + 1).padStart(4, '0');
}

/* Appointment to edit by the route id /:id — prefer the record handed over by the List screen, else merge seed data (dates spread) with the 3 stores */
export function loadAppointmentForEdit(code) {
  const created = readCreated();
  const fromCreated = created.some((x) => x.code === code);
  const handedOver = readEditing();
  let record = handedOver && handedOver.code === code ? handedOver : null;
  if (!record) {
    const today = new Date();
    const seed = seedAsLegacyRoundTrip();   /* ngày đã gán theo ngày thăm gặp WEB-54 — cùng nguồn với Danh sách */
    record = created.find((x) => x.code === code) || seed.find((x) => x.code === code);
    if (!record) return { record: null, fromCreated };
    record = JSON.parse(JSON.stringify(record));
    const edited = readEdited()[code]; if (edited) Object.assign(record, edited);
    const adjusted = readAdjusted()[code]; if (adjusted) { record.visitDate = adjusted.visitDate; record.visitTime = adjusted.visitTime; record.tableCode = adjusted.tableCode; if (adjusted.counterCode) record.counterCode = adjusted.counterCode; }
  }
  return { record: JSON.parse(JSON.stringify(record)), fromCreated };
}
