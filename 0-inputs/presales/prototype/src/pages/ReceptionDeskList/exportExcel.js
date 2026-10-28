/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Export the filtered reception counter list — port of xuatExcelChung + XL_COT of the HTML version (same exceljs 4.4.0, PM1 file layout)
 * thêm sheet 2 «BuongThamGap» — buồng của các quầy đang xuất (dời từ màn Buồng thăm gặp đã bỏ), cột Quầy hiện Mã — Tên */
import { toast } from '@/lib/legacyUi';
import { msg } from '@/lib/msg';
import { excelChunks } from '@/lib/excelChunks';
import { dormitoryLabel } from '@/data/dormitoryStore';
import { readTables, tableStatusLabel } from '@/data/visitTableStore';
import { statusLabel } from '@/pages/ReceptionDeskShared/counterLogic';

const EXCEL_COLUMNS = [
  { header: 'STT', width: 6, value: (c, i) => i + 1 },
  { header: 'Mã quầy', width: 12, value: (c) => c.code },
  { header: 'Tên quầy', width: 30, value: (c) => c.name },
  { header: 'Dãy nhà phục vụ', width: 40, value: (c) => (c.dormitoryCodes || []).map(dormitoryLabel).join('; ') },
  { header: 'Đã dùng hôm nay', width: 16, value: (c) => (c.todayBookedCount ? c.todayCheckedInCount + '/' + c.todayBookedCount : '') },
  { header: 'Trạng thái', width: 16, value: (c) => statusLabel(c.status) },
];
const TABLE_COLUMNS = [
  { header: 'STT', width: 6, value: (t, i) => i + 1 },
  { header: 'Mã buồng', width: 12, value: (t) => t.code },
  { header: 'Tên hiển thị', width: 30, value: (t) => t.name },
  { header: 'Quầy', width: 36, value: (t) => t.counterText },
  { header: 'Số chỗ ngồi cho thân nhân', width: 16, value: (t) => t.seats },
  { header: 'Có vách ngăn', width: 14, value: (t) => (t.hasPartition ? 'Có' : '') },
  { header: 'Trạng thái', width: 16, value: (t) => tableStatusLabel(t.status) },
];

/* 1 sheet cùng khuôn PM1: tiêu đề · ngày kết xuất · tiêu đề cột dòng 4 · dữ liệu từ dòng 5 */
/* trên 1.000 dòng thì tách sheet, sheet sau lặp tiêu đề, STT đánh tiếp */
function writeSheet(wb, sheetName, title, columns, fullList, exportedAt) {
  for (const part of excelChunks(fullList, sheetName)) writePart(wb, part.name, title, columns, part.rows, part.offset, exportedAt);
}
function writePart(wb, sheetName, title, columns, list, offset, exportedAt) {
  const columnCount = columns.length;
  const ws = wb.addWorksheet(sheetName, { views: [{ state: 'frozen', xSplit: 0, ySplit: 4, topLeftCell: 'A5', showGridLines: false }] });
  ws.columns = columns.map((c) => ({ width: c.width }));
  ws.mergeCells(1, 1, 1, columnCount);
  const titleCell = ws.getCell(1, 1);
  titleCell.value = title; titleCell.font = { size: 14, bold: true, color: { argb: 'FF055A96' } };   /* xanh PM2 đậm (main.jsx MAU_THUONG_HIEU) */
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' }; ws.getRow(1).height = 26;
  ws.mergeCells(2, 1, 2, columnCount);
  const dateCell = ws.getCell(2, 1);
  dateCell.value = 'Ngày kết xuất: ' + exportedAt; dateCell.font = { italic: true, color: { argb: 'FF6B7280' } };
  dateCell.alignment = { horizontal: 'center', vertical: 'middle' };
  const line = { style: 'thin', color: { argb: 'FFD1D5DB' } };
  const border = { top: line, left: line, bottom: line, right: line };
  const headerRow = ws.getRow(4);
  columns.forEach((c, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = c.header; cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF076DB6' } };   /* xanh PM2 chủ đạo */
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }; cell.border = border;
  });
  headerRow.height = 28;
  ws.autoFilter = { from: { row: 4, column: 1 }, to: { row: 4, column: columnCount } };
  list.forEach((record, i) => {
    const row = ws.getRow(5 + i);
    columns.forEach((c, j) => {
      const cell = row.getCell(j + 1);
      const v = c.value(record, offset + i);
      cell.value = (v === undefined || v === null) ? '' : v;
      cell.font = { name: 'Calibri', size: 11 };
      cell.alignment = { horizontal: j === 0 ? 'center' : 'left', vertical: 'middle' }; cell.border = border;
      if (i % 2 === 1) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6F1FA' } };   /* xanh PM2 nền nhạt */
    });
  });
}

export async function exportCountersExcel(list) {
  let ExcelJS;
  try { ExcelJS = (await import('exceljs')).default; } catch (e) { toast(msg('SE001-01', 'xuất Excel'), 'is-error'); return; }
  const pad = (n) => String(n).padStart(2, 0);
  const d = new Date();
  const exportedAt = pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  const fileStamp = String(d.getFullYear()) + pad(d.getMonth() + 1) + pad(d.getDate()) + '_' + pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds());
  const wb = new ExcelJS.Workbook();
  writeSheet(wb, 'QuayTiepDon', 'DANH SÁCH QUẦY TIẾP ĐÓN', EXCEL_COLUMNS, list, exportedAt);
  const byCode = Object.fromEntries(list.map((c) => [c.code, c]));
  const tables = readTables().filter((t) => byCode[t.counterCode])
    .sort((a, b) => list.indexOf(byCode[a.counterCode]) - list.indexOf(byCode[b.counterCode]) || a.code.localeCompare(b.code))
    .map((t) => ({ ...t, counterText: t.counterCode + ' — ' + byCode[t.counterCode].name }));
  writeSheet(wb, 'BuongThamGap', 'DANH SÁCH BUỒNG THĂM GẶP', TABLE_COLUMNS, tables, exportedAt);
  const buf = await wb.xlsx.writeBuffer();
  const url = URL.createObjectURL(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
  const a = document.createElement('a');
  a.href = url; a.download = 'DanhSachQuayTiepDon_' + fileStamp + '.xlsx'; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  toast(msg('I001-11', list.length, 'quầy tiếp đón'));
}
