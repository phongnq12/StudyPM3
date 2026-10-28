/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Xuất Excel trên 1.000 dòng thì tách sheet — mỗi sheet tối đa EXCEL_SHEET_ROWS dòng dữ liệu, sheet sau lặp lại tiêu đề.
 * Tên sheet: tên gốc, rồi «tên gốc_2», «tên gốc_3»… (Excel giới hạn 31 ký tự). STT đánh tiếp nối giữa các sheet (offset). */
export const EXCEL_SHEET_ROWS = 1000;

export function excelChunks(list, baseName, size = EXCEL_SHEET_ROWS) {
  const parts = [];
  for (let start = 0; start < Math.max(list.length, 1); start += size) {
    const no = parts.length + 1;
    const suffix = no === 1 ? '' : '_' + no;
    parts.push({ name: baseName.slice(0, 31 - suffix.length) + suffix, rows: list.slice(start, start + size), offset: start });
  }
  return parts;
}
