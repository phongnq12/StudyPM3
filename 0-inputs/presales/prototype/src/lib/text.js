/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Shared text helpers — search WITHOUT accents, case-insensitive, đ matches d.
 * Plain JS (no JSX) so the UIUX gate can import it directly in Node. */
export function normalizeSearchText(value) {
  return String(value == null ? '' : value)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase().trim();
}
