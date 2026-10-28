/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Export the filtered appointment list to Excel (exceljs 4.4.0, same file layout as PM1) */
import { toast } from '@/lib/legacyUi';
import { msg } from '@/lib/msg';
import { excelChunks } from '@/lib/excelChunks';
import { sourceLabel, statusLabel } from '@/data/appointmentStore';
import { routeTextOf } from '@/data/approvalRoute';
import { dormitoryOf, roomOf, studentCodeText, visitDateTimeText } from './listLogic';

const EXCEL_COLUMNS = [
  { title: 'STT', width: 6, value: (r, i) => i + 1 },
  { title: 'Mã lịch hẹn', width: 20, value: (r) => r.code },
  { title: 'Nguồn đăng ký', width: 22, value: (r) => sourceLabel(r.source) },
  { title: 'Luồng đăng ký', width: 34, value: (r) => routeTextOf(r) },   /* rà soát lịch ngoại lệ */
  { title: 'Ngày giờ hẹn', width: 18, value: (r) => visitDateTimeText(r) },
  { title: 'Người cai nghiện', width: 24, value: (r) => r.studentName },
  { title: 'Dãy nhà', width: 14, value: (r) => dormitoryOf(r) },
  { title: 'Phòng', width: 12, value: (r) => roomOf(r) },
  { title: 'Thân nhân đăng ký', width: 24, value: (r) => r.visitorName },
  { title: 'Quan hệ', width: 14, value: (r) => r.relationship },
  { title: 'Loại hình', width: 28, value: (r) => r.visitTypeName },
  { title: 'Buồng thăm gặp', width: 16, value: (r) => r.tableCode },
  { title: 'Quầy tiếp đón', width: 16, value: (r) => r.counterCode },
  { title: 'Số người', width: 12, value: (r) => r.visitorCount },
  { title: 'Thời lượng', width: 14, value: (r) => r.durationMinutes + ' phút' },
  { title: 'Trạng thái', width: 18, value: (r) => statusLabel(r.status) },
];

/* opt: { title, sheet, file } — màn Lịch hẹn gặp trực tiếp ngoại lệ đổi tiêu đề, tên sheet, tiền tố tên file */
export async function exportExcel(rows, opt = {}) {
  let ExcelJS;
  try { ExcelJS = (await import('exceljs')).default; } catch (e) { toast(msg('SE001-01', 'Xuất Excel'), 'is-error'); return; }
  const pad2 = (n) => String(n).padStart(2, 0);
  const d = new Date();
  const exportedAt = pad2(d.getDate()) + '/' + pad2(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes());
  const fileStamp = String(d.getFullYear()) + pad2(d.getMonth() + 1) + pad2(d.getDate()) + '_' + pad2(d.getHours()) + pad2(d.getMinutes()) + pad2(d.getSeconds());
  const columnCount = EXCEL_COLUMNS.length;
  const wb = new ExcelJS.Workbook();
  /* trên 1.000 dòng thì tách sheet, sheet sau lặp tiêu đề, STT đánh tiếp */
  for (const part of excelChunks(rows, opt.sheet || 'LichHenThamGapTrucTiep')) {
  const ws = wb.addWorksheet(part.name, { views: [{ state: 'frozen', xSplit: 0, ySplit: 4, topLeftCell: 'A5', showGridLines: false }] });
  ws.columns = EXCEL_COLUMNS.map((c) => ({ width: c.width }));
  ws.mergeCells(1, 1, 1, columnCount);
  const titleCell = ws.getCell(1, 1);
  titleCell.value = opt.title || 'DANH SÁCH LỊCH HẸN THĂM GẶP TRỰC TIẾP';
  titleCell.font = { size: 14, bold: true, color: { argb: 'FF055A96' } };   /* xanh PM2 đậm (main.jsx MAU_THUONG_HIEU) */
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  ws.getRow(1).height = 26;
  ws.mergeCells(2, 1, 2, columnCount);
  const dateCell = ws.getCell(2, 1);
  dateCell.value = 'Ngày kết xuất: ' + exportedAt;
  dateCell.font = { italic: true, color: { argb: 'FF6B7280' } };
  dateCell.alignment = { horizontal: 'center', vertical: 'middle' };
  const thin = { style: 'thin', color: { argb: 'FFD1D5DB' } };
  const border = { top: thin, left: thin, bottom: thin, right: thin };
  const headerRow = ws.getRow(4);
  EXCEL_COLUMNS.forEach((c, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = c.title; cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF076DB6' } };   /* xanh PM2 chủ đạo */
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }; cell.border = border;
  });
  headerRow.height = 28;
  ws.autoFilter = { from: { row: 4, column: 1 }, to: { row: 4, column: columnCount } };
  part.rows.forEach((r, i) => {
    const row = ws.getRow(5 + i);
    EXCEL_COLUMNS.forEach((c, j) => {
      const cell = row.getCell(j + 1); const v = c.value(r, part.offset + i);
      cell.value = (v === undefined || v === null) ? '' : v;
      cell.font = { name: 'Calibri', size: 11 };
      cell.alignment = { horizontal: j === 0 ? 'center' : 'left', vertical: 'middle' };
      cell.border = border;
      if (i % 2 === 1) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6F1FA' } };   /* xanh PM2 nền nhạt */
    });
  });
  }
  const buf = await wb.xlsx.writeBuffer();
  const url = URL.createObjectURL(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
  const a = document.createElement('a'); a.href = url; a.download = (opt.file || 'DanhSachLichHenThamGap_') + fileStamp + '.xlsx'; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  toast(msg('I001-11', rows.length, 'lịch hẹn'));
}
