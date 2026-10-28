/* PM3 · Giá nhập theo nhà cung cấp — DỮ LIỆU MẪU, khoá tiếng Anh, khuôn { items, pagination } như seed của PM2.
 * Ngày tính tương đối từ hôm nay (dayjs) để Khai trước / Hiện hành / Hết hiệu lực luôn đúng khi mở Prototype.
 * Màn hình luôn hiện nhãn tiếng Việt; enum ở đây là mã tiếng Anh. */
import dayjs from 'dayjs';

const day = (offset) => dayjs().startOf('day').add(offset, 'day').format('YYYY-MM-DD');
const at = (offset, hour = 9) => dayjs().startOf('day').add(offset, 'day').hour(hour).format('YYYY-MM-DDTHH:mm:ss');
const page = (items) => ({ items, pagination: { page: 1, pageSize: items.length, total: items.length } });

export const SUPPLIERS = page([
  { id: 'NCC01', code: 'NCC01', name: 'Công ty TNHH Thực phẩm An Phát', isActive: true, isDeleted: false },
  { id: 'NCC02', code: 'NCC02', name: 'Công ty CP Nước uống Sông Lam', isActive: true, isDeleted: false },
  { id: 'NCC03', code: 'NCC03', name: 'Hộ kinh doanh Minh Tâm', isActive: true, isDeleted: false },
  { id: 'NCC04', code: 'NCC04', name: 'Công ty TNHH Hóa phẩm Hưng Thịnh', isActive: true, isDeleted: false },
  { id: 'NCC05', code: 'NCC05', name: 'Cửa hàng tạp hóa Bình An', isActive: false, isDeleted: false },
  { id: 'NCC06', code: 'NCC06', name: 'Công ty TNHH Vật tư Phúc Lộc', isActive: true, isDeleted: false },   /* chưa có mặt hàng nào đang hoạt động */
]);

export const PRODUCTS = page([
  { id: 'MH001', code: 'MH001', name: 'Mì gói tôm chua cay 75g', unit: 'Gói', group: 'Lương thực', isActive: true, isDeleted: false },
  { id: 'MH002', code: 'MH002', name: 'Nước suối 500ml', unit: 'Chai', group: 'Thực phẩm', isActive: true, isDeleted: false },
  { id: 'MH003', code: 'MH003', name: 'Bàn chải đánh răng lông mềm', unit: 'Cái', group: 'Đồ dùng sinh hoạt thiết yếu', isActive: true, isDeleted: false },
  { id: 'MH004', code: 'MH004', name: 'Kem đánh răng 180g', unit: 'Tuýp', group: 'Đồ dùng sinh hoạt thiết yếu', isActive: true, isDeleted: false },
  { id: 'MH005', code: 'MH005', name: 'Sữa tươi hộp 180ml', unit: 'Hộp', group: 'Thực phẩm', isActive: true, isDeleted: false },
  { id: 'MH006', code: 'MH006', name: 'Bánh quy bơ 140g', unit: 'Gói', group: 'Thực phẩm', isActive: true, isDeleted: false },
  { id: 'MH007', code: 'MH007', name: 'Xà phòng tắm 90g', unit: 'Bánh', group: 'Đồ dùng sinh hoạt thiết yếu', isActive: true, isDeleted: false },
  { id: 'MH008', code: 'MH008', name: 'Dầu gội đầu 170ml', unit: 'Chai', group: 'Đồ dùng sinh hoạt thiết yếu', isActive: true, isDeleted: false },
  { id: 'MH009', code: 'MH009', name: 'Khăn mặt bông', unit: 'Cái', group: 'Đồ dùng sinh hoạt thiết yếu', isActive: true, isDeleted: false },
  { id: 'MH010', code: 'MH010', name: 'Lương khô 70g', unit: 'Thanh', group: 'Lương thực', isActive: false, isDeleted: false },
]);

/* Mặt hàng theo nhà cung cấp (cặp) */
export const SUPPLIER_PRODUCTS = page([
  { id: 'SP01', productId: 'MH001', supplierId: 'NCC01', isActive: true, isDeleted: false },
  { id: 'SP02', productId: 'MH002', supplierId: 'NCC02', isActive: true, isDeleted: false },
  { id: 'SP03', productId: 'MH003', supplierId: 'NCC04', isActive: true, isDeleted: false },
  { id: 'SP04', productId: 'MH004', supplierId: 'NCC04', isActive: true, isDeleted: false },
  { id: 'SP05', productId: 'MH005', supplierId: 'NCC01', isActive: true, isDeleted: false },
  { id: 'SP06', productId: 'MH006', supplierId: 'NCC03', isActive: true, isDeleted: false },
  { id: 'SP07', productId: 'MH007', supplierId: 'NCC04', isActive: true, isDeleted: false },
  { id: 'SP08', productId: 'MH008', supplierId: 'NCC03', isActive: true, isDeleted: false },
  { id: 'SP09', productId: 'MH009', supplierId: 'NCC03', isActive: true, isDeleted: false },   /* chưa có giá bán hiện hành */
  { id: 'SP10', productId: 'MH002', supplierId: 'NCC03', isActive: true, isDeleted: false },   /* đang có phiếu Chờ duyệt */
  { id: 'SP11', productId: 'MH001', supplierId: 'NCC05', isActive: true, isDeleted: false },   /* nhà cung cấp ngừng hoạt động */
  { id: 'SP12', productId: 'MH010', supplierId: 'NCC01', isActive: true, isDeleted: false },   /* mặt hàng ngừng hoạt động */
  { id: 'SP13', productId: 'MH010', supplierId: 'NCC06', isActive: true, isDeleted: false },   /* mặt hàng ngừng hoạt động */
  { id: 'SP14', productId: 'MH005', supplierId: 'NCC06', isActive: false, isDeleted: false },  /* cặp ngừng hoạt động */
  { id: 'SP15', productId: 'MH006', supplierId: 'NCC01', isActive: true, isDeleted: false },
  { id: 'SP16', productId: 'MH008', supplierId: 'NCC01', isActive: true, isDeleted: false },   /* chưa có giá bán, chưa có dòng giá nhập */
  { id: 'SP17', productId: 'MH004', supplierId: 'NCC03', isActive: true, isDeleted: false },   /* có giá bán, chưa có dòng giá nhập */
]);

/* Phiên bản giá bán đã duyệt của từng cặp */
export const SALE_PRICE_VERSIONS = page([
  { id: 'GB-SP01-1', pairId: 'SP01', versionNo: 1, price: 5000, effectiveDate: day(-200), status: 'APPROVED' },
  { id: 'GB-SP01-2', pairId: 'SP01', versionNo: 2, price: 5500, effectiveDate: day(-60), status: 'APPROVED' },
  { id: 'GB-SP02-1', pairId: 'SP02', versionNo: 1, price: 4000, effectiveDate: day(-100), status: 'APPROVED' },
  { id: 'GB-SP03-1', pairId: 'SP03', versionNo: 1, price: 12000, effectiveDate: day(-160), status: 'APPROVED' },
  { id: 'GB-SP04-1', pairId: 'SP04', versionNo: 1, price: 26000, effectiveDate: day(-150), status: 'APPROVED' },
  { id: 'GB-SP05-1', pairId: 'SP05', versionNo: 1, price: 9000, effectiveDate: day(-90), status: 'APPROVED' },
  { id: 'GB-SP06-1', pairId: 'SP06', versionNo: 1, price: 18000, effectiveDate: day(-120), status: 'APPROVED' },
  { id: 'GB-SP07-1', pairId: 'SP07', versionNo: 1, price: 11000, effectiveDate: day(-80), status: 'APPROVED' },
  { id: 'GB-SP08-1', pairId: 'SP08', versionNo: 1, price: 22000, effectiveDate: day(-70), status: 'APPROVED' },
  { id: 'GB-SP10-1', pairId: 'SP10', versionNo: 1, price: 4500, effectiveDate: day(-100), status: 'APPROVED' },
  { id: 'GB-SP11-1', pairId: 'SP11', versionNo: 1, price: 5000, effectiveDate: day(-300), status: 'APPROVED' },
  { id: 'GB-SP15-1', pairId: 'SP15', versionNo: 1, price: 18000, effectiveDate: day(-30), status: 'APPROVED' },
  { id: 'GB-SP17-1', pairId: 'SP17', versionNo: 1, price: 27000, effectiveDate: day(-50), status: 'APPROVED' },
]);

const file = (name, size = 245760) => ({ name, size });
/* phiếu nhập mẫu dùng dòng giá: { no, date, warehouse, status (APPROVED · PENDING_APPROVAL · DRAFT), quantity, hasSalePrice } */
/* hasSalePrice false: lô nhập khi dòng giá nhập chưa có phiên bản giá bán đã duyệt — chưa bán được */
const receipt = (no, offset, warehouse, status, quantity, hasSalePrice = true) => ({ no: 'PN-2026-' + no, date: day(offset), warehouse, status, quantity, hasSalePrice });
const KHO_A = 'Kho căng tin khu A', KHO_TONG = 'Kho tổng';
const MANAGER = { name: 'Nguyễn Văn Hùng', role: 'Người phụ trách căng tin' };

/* Đợt giá nhập — một nhà cung cấp, một căn cứ (tệp bắt buộc), một khoảng hiệu lực chung, nhiều dòng */
const batch = (code, supplierId, refNo, fileName, from, to, createdOffset) => ({ code, supplierId, refNo, file: file(fileName), fromDate: day(from), toDate: day(to), note: '', createdBy: MANAGER, createdAt: at(createdOffset) });
export const PURCHASE_PRICE_BATCHES = page([
  batch('DGN-0001', 'NCC01', 'HĐ 05/2026/AP', 'HopDong_05-2026_AnPhat.pdf', -200, -61, -205),
  batch('DGN-0002', 'NCC01', 'PL 01 HĐ 05/2026/AP', 'PhuLuc01_HopDong_AnPhat.pdf', -60, 120, -64),
  batch('DGN-0003', 'NCC01', 'HĐ 06/2026/AP', 'HopDong_06-2026_AnPhat.pdf', -90, -1, -92),
  batch('DGN-0004', 'NCC01', 'BG 21/AP', 'BaoGia_21_AnPhat.pdf', -30, 100, -33),
  batch('DGN-0005', 'NCC02', 'HĐ 11/2026/SL', 'HopDong_11-2026_SongLam.pdf', -100, 60, -104),
  batch('DGN-0006', 'NCC02', 'BG 02/SL', 'BaoGia_02_SongLam.pdf', 61, 240, -6),
  batch('DGN-0007', 'NCC04', 'HĐ 07/2026/HT', 'HopDong_07-2026_HungThinh.pdf', -150, 60, -154),
  batch('DGN-0008', 'NCC04', 'BG 04/HT', 'BaoGia_04_HungThinh.pdf', -150, 30, -152),
  batch('DGN-0009', 'NCC04', 'BG 07/HT', 'BaoGia_07_HungThinh.pdf', -80, 100, -82),
  batch('DGN-0010', 'NCC03', 'HĐ 02/2026/MT', 'HopDong_02-2026_MinhTam.pdf', -120, 200, -125),
  batch('DGN-0011', 'NCC03', 'HĐ 03/2026/MT', 'HopDong_03-2026_MinhTam.pdf', -70, 150, -8),
  batch('DGN-0012', 'NCC03', 'BG 11/MT', 'BaoGia_11_MinhTam.pdf', -100, 100, -5),
  batch('DGN-0013', 'NCC05', 'HĐ 01/2026/BA', 'HopDong_01-2026_BinhAn.pdf', -300, -201, -305),
  batch('DGN-0014', 'NCC04', 'BG 15/HT', 'BaoGia_15_HungThinh.pdf', 101, 250, -2),
  batch('DGN-0015', 'NCC04', 'PL 02 HĐ 07/2026/HT', 'PhuLuc02_HopDong_HungThinh.pdf', -10, 150, -12),
  batch('DGN-0016', 'NCC01', 'PL 02 HĐ 05/2026/AP', 'PhuLuc02_HopDong_AnPhat.pdf', 15, 200, -1),
]);

/* Dòng giá nhập — decision: AUTO_PROPOSAL (Tự sinh đề xuất) · CREATE_PROPOSAL (Tạo đề xuất) · KEEP_CURRENT (Giữ giá bán hiện hành).
 * batchCode: đợt chứa dòng · replacesCode: dòng cũ cùng cặp mà dòng này thay thế (ngày bắt đầu nằm trong hiệu lực dòng cũ).
 * receipts: phiếu nhập có dòng hàng nhập trỏ về dòng (mỗi phiếu 1 dòng hàng) · orderLineCount: số dòng đặt hàng */
const ln = (code, batchCode, pairId, price, from, to, decision, decisionReason, saleVersionId, receipts, orderLineCount, createdOffset, replacesCode = '') => ({
  code, batchCode, pairId, price, fromDate: day(from), toDate: day(to), replacesCode, decision, decisionReason, saleVersionId, receipts, orderLineCount, createdBy: MANAGER, createdAt: at(createdOffset) });
export const PURCHASE_PRICE_LINES = page([
  ln('GN-0001', 'DGN-0001', 'SP01', 4200, -200, -61, 'AUTO_PROPOSAL', '', 'GB-SP01-1', [receipt('0003', -190, KHO_TONG, 'APPROVED', 400), receipt('0011', -150, KHO_A, 'APPROVED', 300), receipt('0019', -100, KHO_A, 'APPROVED', 350)], 5, -205),
  /* Hiện hành, đã có dòng khai trước GN-0003 thay thế từ ngày +15 */
  ln('GN-0002', 'DGN-0002', 'SP01', 4800, -60, 120, 'CREATE_PROPOSAL', 'Điều chỉnh giá bán theo mặt bằng giá chung của nhà cung cấp', 'GB-SP01-2', [receipt('0031', -40, KHO_A, 'APPROVED', 300), receipt('0042', -2, KHO_A, 'PENDING_APPROVAL', 250)], 2, -64),
  /* Đợt DGN-0016 — 3 dòng khai trước: thay thế có phiếu Nháp (sửa được) · giữ giá bán (không sửa, xóa được) · thay thế có phiếu tùy chọn Nháp */
  ln('GN-0003', 'DGN-0016', 'SP01', 5800, 15, 200, 'AUTO_PROPOSAL', '', null, [], 0, -1, 'GN-0002'),
  ln('GN-0018', 'DGN-0016', 'SP05', 7600, 15, 200, 'KEEP_CURRENT', 'Giá nhập mới vẫn thấp hơn giá bán hiện hành', 'GB-SP05-1', [], 0, -1),
  ln('GN-0019', 'DGN-0016', 'SP15', 16000, 15, 200, 'CREATE_PROPOSAL', 'Đề xuất điều chỉnh giá bán theo hợp đồng mới', null, [], 0, -1, 'GN-0020'),
  ln('GN-0010', 'DGN-0003', 'SP05', 7000, -90, -1, 'KEEP_CURRENT', 'Giá bán hiện hành đã bao gồm chi phí vận chuyển', 'GB-SP05-1', [receipt('0021', -80, KHO_A, 'APPROVED', 200), receipt('0033', -30, KHO_TONG, 'APPROVED', 150)], 2, -92),
  ln('GN-0020', 'DGN-0004', 'SP15', 14500, -30, 100, 'KEEP_CURRENT', 'Giá bán hiện hành vẫn bù đủ chi phí', 'GB-SP15-1', [receipt('0045', -20, KHO_A, 'APPROVED', 120)], 1, -33),
  ln('GN-0004', 'DGN-0005', 'SP02', 3200, -100, 60, 'AUTO_PROPOSAL', '', 'GB-SP02-1', [receipt('0012', -95, KHO_TONG, 'APPROVED', 600), receipt('0036', -20, KHO_A, 'DRAFT', 240)], 3, -104),
  /* Khai trước liền ngày sau GN-0004 — không thay thế dòng nào */
  ln('GN-0005', 'DGN-0006', 'SP02', 3500, 61, 240, 'KEEP_CURRENT', 'Giá bán hiện hành vẫn cao hơn giá nhập mới', 'GB-SP02-1', [], 0, -6),
  /* Đã thay thế: GN-0008 bắt đầu ngày -10, đang chờ duyệt giá bán, đã có lô nhập chưa có giá bán */
  ln('GN-0006', 'DGN-0007', 'SP04', 20000, -150, 60, 'AUTO_PROPOSAL', '', 'GB-SP04-1', [receipt('0005', -140, KHO_TONG, 'APPROVED', 120), receipt('0014', -110, KHO_A, 'APPROVED', 80), receipt('0024', -60, KHO_A, 'APPROVED', 100)], 4, -154),
  ln('GN-0008', 'DGN-0015', 'SP04', 27000, -10, 150, 'AUTO_PROPOSAL', '', null, [receipt('0047', -5, KHO_TONG, 'APPROVED', 60, false)], 0, -12, 'GN-0006'),
  /* Phiếu bắt buộc bị từ chối */
  ln('GN-0009', 'DGN-0008', 'SP03', 13000, -150, 30, 'AUTO_PROPOSAL', '', null, [], 0, -152),
  ln('GN-0012', 'DGN-0009', 'SP07', 8500, -80, 100, 'KEEP_CURRENT', 'Giá nhập không đổi so với kỳ trước', 'GB-SP07-1', [receipt('0038', -10, KHO_A, 'APPROVED', 90)], 0, -82),
  /* Khai trước liền ngày, có phiếu Nháp Bắt buộc — sửa được */
  ln('GN-0016', 'DGN-0014', 'SP07', 12000, 101, 250, 'AUTO_PROPOSAL', '', null, [], 0, -2),
  ln('GN-0011', 'DGN-0010', 'SP06', 14000, -120, 200, 'AUTO_PROPOSAL', '', 'GB-SP06-1', [], 4, -125),
  ln('GN-0013', 'DGN-0011', 'SP08', 17000, -70, 150, 'CREATE_PROPOSAL', 'Đề xuất tăng giá bán theo giá thị trường', null, [], 0, -8),
  ln('GN-0014', 'DGN-0012', 'SP10', 4800, -100, 100, 'AUTO_PROPOSAL', '', null, [], 0, -5),
  ln('GN-0015', 'DGN-0013', 'SP11', 4000, -300, -201, 'KEEP_CURRENT', 'Giá bán hiện hành vẫn cao hơn giá nhập', 'GB-SP11-1', [receipt('0001', -290, KHO_TONG, 'APPROVED', 500), receipt('0002', -260, KHO_A, 'APPROVED', 300), receipt('0004', -230, KHO_A, 'APPROVED', 300)], 7, -305),
]);

/* Phiếu đề xuất giá bán gắn dòng — kind: REQUIRED (Bắt buộc) · OPTIONAL (Tùy chọn)
 * status: DRAFT · PENDING_APPROVAL · APPROVED · REJECTED · REPLACED. Mỗi cặp tối đa 1 phiếu Nháp hoặc Chờ duyệt */
export const SALE_PRICE_PROPOSALS = page([
  { id: 'DX-0001', lineCode: 'GN-0001', pairId: 'SP01', versionNo: 1, kind: 'REQUIRED', status: 'REPLACED', proposedPrice: 5000, proposedAt: day(-204) },
  { id: 'DX-0002', lineCode: 'GN-0002', pairId: 'SP01', versionNo: 2, kind: 'OPTIONAL', status: 'APPROVED', proposedPrice: 5500, proposedAt: day(-63) },
  { id: 'DX-0003', lineCode: 'GN-0004', pairId: 'SP02', versionNo: 1, kind: 'REQUIRED', status: 'APPROVED', proposedPrice: 4000, proposedAt: day(-103) },
  { id: 'DX-0004', lineCode: 'GN-0006', pairId: 'SP04', versionNo: 1, kind: 'REQUIRED', status: 'APPROVED', proposedPrice: 26000, proposedAt: day(-153) },
  { id: 'DX-0005', lineCode: 'GN-0008', pairId: 'SP04', versionNo: 2, kind: 'REQUIRED', status: 'PENDING_APPROVAL', proposedPrice: 29000, proposedAt: day(-11) },
  { id: 'DX-0006', lineCode: 'GN-0009', pairId: 'SP03', versionNo: 2, kind: 'REQUIRED', status: 'REJECTED', proposedPrice: 15000, proposedAt: day(-151) },
  { id: 'DX-0007', lineCode: 'GN-0011', pairId: 'SP06', versionNo: 1, kind: 'REQUIRED', status: 'APPROVED', proposedPrice: 18000, proposedAt: day(-124) },
  { id: 'DX-0008', lineCode: 'GN-0013', pairId: 'SP08', versionNo: 2, kind: 'OPTIONAL', status: 'PENDING_APPROVAL', proposedPrice: 23000, proposedAt: day(-8) },
  { id: 'DX-0009', lineCode: 'GN-0014', pairId: 'SP10', versionNo: 2, kind: 'REQUIRED', status: 'PENDING_APPROVAL', proposedPrice: 5500, proposedAt: day(-5) },
  { id: 'DX-0010', lineCode: 'GN-0016', pairId: 'SP07', versionNo: 2, kind: 'REQUIRED', status: 'DRAFT', proposedPrice: null, proposedAt: day(-2) },
  { id: 'DX-0011', lineCode: 'GN-0003', pairId: 'SP01', versionNo: 3, kind: 'REQUIRED', status: 'DRAFT', proposedPrice: null, proposedAt: day(-1) },
  { id: 'DX-0012', lineCode: 'GN-0019', pairId: 'SP15', versionNo: 2, kind: 'OPTIONAL', status: 'DRAFT', proposedPrice: null, proposedAt: day(-1) },
]);
