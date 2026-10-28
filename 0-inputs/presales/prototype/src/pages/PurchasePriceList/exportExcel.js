/* PM3 · Xuất Excel danh sách giá nhập — toàn bộ dòng khớp bộ lọc hiện hành (không chỉ trang đang xem).
 * Cùng khuôn tệp với màn mẫu Quầy tiếp đón: tiêu đề · ngày xuất · tiêu đề cột dòng 4 · dữ liệu từ dòng 5; trên 1.000 dòng thì tách sheet. */
import dayjs from 'dayjs';
import { toast } from '@/lib/legacyUi';
import { excelChunks } from '@/lib/excelChunks';
import { DECISION, EFFECT, PROPOSAL_STATUS, dateText, priceText } from '@/data/purchasePriceStore';

/* row: dòng đã dựng sẵn ở màn Danh sách (kèm product, supplier, batch, effect, replaces, replacedBy, latestProposal) */
const replaceNote = (r) => [r.replaces ? 'Thay thế dòng ' + r.replaces.code + ' (' + priceText(r.replaces.price) + ') từ ' + dateText(r.fromDate) : '',
  r.replacedBy ? 'Bị thay thế bởi dòng ' + r.replacedBy.code + ' (' + priceText(r.replacedBy.price) + ') từ ' + dateText(r.replacedBy.fromDate) : ''].filter(Boolean).join('; ');
const EXCEL_COLUMNS = [
  { header: 'STT', width: 6, value: (r, i) => i + 1 },
  { header: 'Mã hàng', width: 12, value: (r) => (r.product ? r.product.code : '') },
  { header: 'Tên hàng', width: 32, value: (r) => (r.product ? r.product.name : '') },
  { header: 'Nhà cung cấp', width: 34, value: (r) => (r.supplier ? r.supplier.name : '') },
  { header: 'Mã đợt', width: 12, value: (r) => r.batchCode },
  { header: 'Giá nhập', width: 14, value: (r) => r.price, numFmt: '#,##0' },
  { header: 'Hiệu lực từ', width: 14, value: (r) => dateText(r.fromDate) },
  { header: 'Hiệu lực đến', width: 14, value: (r) => dateText(r.toDate) },
  { header: 'Hiệu lực', width: 14, value: (r) => EFFECT[r.effect] },
  { header: 'Thay thế / Bị thay thế', width: 44, value: replaceNote },
  { header: 'Quyết định giá bán', width: 24, value: (r) => DECISION[r.decision] },
  { header: 'Lý do quyết định', width: 40, value: (r) => r.decisionReason || '' },
  { header: 'Số hiệu căn cứ', width: 22, value: (r) => (r.batch ? r.batch.refNo : '') },
  { header: 'Phiếu đề xuất', width: 16, value: (r) => (r.latestProposal ? PROPOSAL_STATUS[r.latestProposal.status] : '') },
];

function writePart(wb, sheetName, list, offset, exportedAt) {
  const columnCount = EXCEL_COLUMNS.length;
  const ws = wb.addWorksheet(sheetName, { views: [{ state: 'frozen', xSplit: 0, ySplit: 4, topLeftCell: 'A5', showGridLines: false }] });
  ws.columns = EXCEL_COLUMNS.map((c) => ({ width: c.width }));
  ws.mergeCells(1, 1, 1, columnCount);
  const titleCell = ws.getCell(1, 1);
  titleCell.value = 'DANH SÁCH GIÁ NHẬP THEO NHÀ CUNG CẤP'; titleCell.font = { size: 14, bold: true, color: { argb: 'FF055A96' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' }; ws.getRow(1).height = 26;
  ws.mergeCells(2, 1, 2, columnCount);
  const dateCell = ws.getCell(2, 1);
  dateCell.value = 'Ngày xuất: ' + exportedAt; dateCell.font = { italic: true, color: { argb: 'FF6B7280' } };
  dateCell.alignment = { horizontal: 'center', vertical: 'middle' };
  const line = { style: 'thin', color: { argb: 'FFD1D5DB' } };
  const border = { top: line, left: line, bottom: line, right: line };
  const headerRow = ws.getRow(4);
  EXCEL_COLUMNS.forEach((c, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = c.header; cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF076DB6' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }; cell.border = border;
  });
  headerRow.height = 28;
  ws.autoFilter = { from: { row: 4, column: 1 }, to: { row: 4, column: columnCount } };
  list.forEach((record, i) => {
    const row = ws.getRow(5 + i);
    EXCEL_COLUMNS.forEach((c, j) => {
      const cell = row.getCell(j + 1);
      const v = c.value(record, offset + i);
      cell.value = v == null ? '' : v;
      cell.font = { name: 'Calibri', size: 11 };
      if (c.numFmt) cell.numFmt = c.numFmt;
      cell.alignment = { horizontal: j === 0 ? 'center' : c.numFmt ? 'right' : 'left', vertical: 'middle' }; cell.border = border;
      if (i % 2 === 1) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6F1FA' } };
    });
  });
}

export async function exportPurchasePriceExcel(list) {
  if (!list.length) { toast('Không có dữ liệu để xuất', 'is-warning'); return; }
  let ExcelJS;
  try { ExcelJS = (await import('exceljs')).default; } catch (e) { toast('Không thể xuất Excel. Lý do: không tải được thư viện tạo tệp', 'is-error'); return; }
  const now = dayjs();
  const wb = new ExcelJS.Workbook();
  for (const part of excelChunks(list, 'GiaNhap')) writePart(wb, part.name, part.rows, part.offset, now.format('DD/MM/YYYY HH:mm'));
  const buf = await wb.xlsx.writeBuffer();
  const url = URL.createObjectURL(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
  const a = document.createElement('a');
  a.href = url; a.download = 'DanhSachGiaNhap_' + now.format('DDMMYYYY_HHmm') + '.xlsx'; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  toast('Đã xuất ' + list.length + ' dòng giá nhập');
}
