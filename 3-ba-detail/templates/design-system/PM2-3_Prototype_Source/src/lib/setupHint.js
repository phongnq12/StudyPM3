/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Câu hướng dẫn cài đặt I001-94 — 1 nguồn cho component SetupHint (React) và engine dựng HTML.
 * «Chưa có {0} nào. Vui lòng cài đặt tại {1}» — {1} là LINK mở thẳng màn cài đặt. */
import { msg } from './msg.js';
import { readCounters } from '../data/receptionDeskStore.js';
import { ROUTES, receptionDeskEditPath } from '../routes.js';

/* E001-25 «… bổ sung **{dãy}** vào **{quầy}** …» — {quầy} thành LINK: quầy Hoạt động ⇒ link Sửa quầy đó (nơi thêm dãy nhà),
 * chưa có quầy nào ⇒ link Cài đặt quầy tiếp đón. Câu trong Message List giữ nguyên. */
export function noCounterParts(dormName) {
  const MOC_Q = '\u0003';
  const [truoc, sau = ''] = msg('E001-25', dormName, MOC_Q).split(MOC_Q);
  const active = readCounters().filter((c) => c.status === 'ACTIVE');
  const links = active.length ? active.map((c) => ({ text: c.code + ' — ' + c.name, href: receptionDeskEditPath(c.code) }))
    : [{ text: 'quầy tiếp đón đang hoạt động', href: ROUTES.receptionDeskList }];
  return { truoc: truoc.replace(/\*\*$/, ''), sau: sau.replace(/^\*\*/, ''), links };
}

const MOC = '\u0001';   /* chỗ cắt câu để chèn link vào vị trí {1} */
export const setupHintParts = (what) => { const [truoc, sau = ''] = msg('I001-94', what, MOC).split(MOC); return { truoc, sau }; };
export const setupHintText = (what, screen) => msg('I001-94', what, screen);
/* câu khác I001-94 (vd I001-79): giữ nguyên chữ, cụm `phrase` trong câu thành link tới nơi cài đặt */
export const linkInMsg = (code, phrase, ...args) => { const t = msg(code, ...args); const i = t.indexOf(phrase);
  return i < 0 ? { truoc: t, link: '', sau: '' } : { truoc: t.slice(0, i), link: phrase, sau: t.slice(i + phrase.length) }; };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const setupHintHtml = (what, screen, to) => {
  const { truoc, sau } = setupHintParts(what);
  return esc(truoc) + '<a class="setup-hint-link" href="' + esc(to) + '">' + esc(screen) + '</a>' + esc(sau);
};
