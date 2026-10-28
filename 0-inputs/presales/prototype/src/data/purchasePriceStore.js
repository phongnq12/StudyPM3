/* PM3 · Kho dữ liệu Giá nhập theo nhà cung cấp — chạy bằng localStorage như các store của Prototype PM2.
 * Gồm: nhà cung cấp, mặt hàng, cặp mặt hàng theo nhà cung cấp, phiên bản giá bán, đợt giá nhập, dòng giá nhập, phiếu đề xuất giá bán, lịch sử thay đổi.
 * Một đợt = một nhà cung cấp, một căn cứ (tệp bắt buộc), một khoảng hiệu lực chung, nhiều dòng — mỗi mặt hàng một dòng.
 * Dòng mới được bắt đầu trong hiệu lực của dòng cũ cùng cặp và thay thế dòng cũ từ ngày bắt đầu.
 * Hiệu lực, giá nhập hiện hành, giá bán hiện hành, trạng thái khóa là giá trị dẫn xuất — tính lúc đọc, không lưu.
 * Mọi xử lý ngày dùng dayjs; ngày lưu dạng YYYY-MM-DD. */
import dayjs from 'dayjs';
import { currentAccount } from './accountStore';
import { pushNotification } from './pm3NotificationStore';
import {
  PRODUCTS, PURCHASE_PRICE_BATCHES, PURCHASE_PRICE_LINES, SALE_PRICE_PROPOSALS, SALE_PRICE_VERSIONS, SUPPLIERS, SUPPLIER_PRODUCTS,
} from './seed/PM3_PurchasePrice_Data';

const STORAGE_KEY = 'pm3_gia_nhap_v4';   /* v4: mô hình đợt giá nhập, dòng thay thế */
const ISO = 'YYYY-MM-DD';

/* ── Nhãn hiển thị theo mã tiếng Anh ── */
export const EFFECT = { UPCOMING: 'Khai trước', CURRENT: 'Hiện hành', REPLACED: 'Đã thay thế', EXPIRED: 'Hết hiệu lực' };
export const EFFECT_CLASS = { UPCOMING: 'tag-approved', CURRENT: 'tag-completed', REPLACED: 'tag-draft', EXPIRED: 'tag-cancelled' };
export const DECISION = { AUTO_PROPOSAL: 'Tự sinh đề xuất', CREATE_PROPOSAL: 'Tạo đề xuất', KEEP_CURRENT: 'Giữ giá bán hiện hành' };
export const PROPOSAL_KIND = { REQUIRED: 'Bắt buộc', OPTIONAL: 'Tùy chọn' };
export const PROPOSAL_STATUS = { DRAFT: 'Nháp', PENDING_APPROVAL: 'Chờ duyệt', APPROVED: 'Đã duyệt', REJECTED: 'Từ chối', REPLACED: 'Đã thay thế' };
export const PROPOSAL_STATUS_CLASS = { DRAFT: 'tag-draft', PENDING_APPROVAL: 'tag-pending-approval', APPROVED: 'tag-approved', REJECTED: 'tag-rejected', REPLACED: 'tag-cancelled' };
export const RECEIPT_STATUS = { APPROVED: 'Đã duyệt', PENDING_APPROVAL: 'Chờ duyệt', DRAFT: 'Nháp' };
export const RECEIPT_STATUS_CLASS = { APPROVED: 'tag-approved', PENDING_APPROVAL: 'tag-pending-approval', DRAFT: 'tag-draft' };
/* Khóa nhập kho chỉ khi không có giá nhập hiện hành; chờ duyệt giá bán chỉ khóa đặt hàng */
export const LOCK = {
  EXPIRED_PURCHASE: 'Khóa — hết hiệu lực giá nhập',
  SALE_NOT_APPROVED: 'Khóa đặt hàng — giá bán chưa được duyệt',
  PENDING_PRICE: 'Khóa đặt hàng — đang chờ duyệt giá',
  OPEN: 'Mở',
};
export const LOCK_CLASS = { EXPIRED_PURCHASE: 'tag-rejected', SALE_NOT_APPROVED: 'tag-rejected', PENDING_PRICE: 'tag-pending-approval', OPEN: 'tag-completed' };
const OPEN_PROPOSAL = ['DRAFT', 'PENDING_APPROVAL'];
const BLOCK_DELETE_PROPOSAL = ['PENDING_APPROVAL', 'APPROVED', 'REPLACED'];

/* ── Định dạng ── */
export const todayIso = () => dayjs().format(ISO);
export const dateText = (iso) => (iso ? dayjs(iso).format('DD/MM/YYYY') : '');
export const dateTimeText = (iso) => (iso ? dayjs(iso).format('DD/MM/YYYY HH:mm') : '');
export const moneyText = (n) => (n == null || n === '' ? '' : String(Math.round(Number(n))).replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
export const priceText = (n) => (n == null || n === '' ? '' : moneyText(n) + 'đ');

/* ── Đọc, ghi ── */
function seedDb() {
  const clone = (x) => JSON.parse(JSON.stringify(x.items));
  const lines = clone(PURCHASE_PRICE_LINES).map((l) => ({ isDeleted: false, replacesCode: '', ...l }));
  const proposals = clone(SALE_PRICE_PROPOSALS).map((p) => ({ ...p, refPurchasePrice: (lines.find((l) => l.code === p.lineCode) || {}).price ?? null }));
  const history = {};
  const push = (code, row) => { (history[code] = history[code] || []).push(row); };
  lines.forEach((l) => push(l.code, { at: l.createdAt, actorName: l.createdBy.name, actorRole: l.createdBy.role, action: 'Tạo',
    content: 'Tạo dòng giá nhập ' + priceText(l.price) + ', hiệu lực ' + dateText(l.fromDate) + ' – ' + dateText(l.toDate) + ', đợt ' + l.batchCode + '. Quyết định giá bán: ' + DECISION[l.decision] }));
  lines.filter((l) => l.replacesCode).forEach((l) => push(l.replacesCode, { at: l.createdAt, actorName: l.createdBy.name, actorRole: l.createdBy.role, action: 'Thay thế',
    content: replacedText(l) }));
  const maxNo = (list, key) => Math.max(0, ...list.map((x) => Number(String(x[key]).replace(/\D/g, '')) || 0));
  const batches = clone(PURCHASE_PRICE_BATCHES).map((b) => ({ isDeleted: false, ...b }));
  return {
    seededOn: todayIso(),
    suppliers: clone(SUPPLIERS), products: clone(PRODUCTS), pairs: clone(SUPPLIER_PRODUCTS),
    saleVersions: clone(SALE_PRICE_VERSIONS), batches, lines, proposals, history,
    nextBatchNo: maxNo(batches, 'code') + 1, nextLineNo: maxNo(lines, 'code') + 1, nextProposalNo: maxNo(proposals, 'id') + 1,
  };
}

/* Dữ liệu đã lưu từ hôm trước ⇒ dời mọi mốc ngày theo số ngày đã trôi, để các dòng giữ đúng hiệu lực như lúc nạp */
function shiftDays(db) {
  const diff = dayjs().startOf('day').diff(dayjs(db.seededOn), 'day');
  if (!diff) return db;
  const d = (v) => (v ? dayjs(v).add(diff, 'day').format(v.length > 10 ? 'YYYY-MM-DDTHH:mm:ss' : ISO) : v);
  db.lines.forEach((l) => { l.fromDate = d(l.fromDate); l.toDate = d(l.toDate); l.createdAt = d(l.createdAt); (l.receipts || []).forEach((r) => { r.date = d(r.date); }); });
  db.batches.forEach((b) => { b.fromDate = d(b.fromDate); b.toDate = d(b.toDate); b.createdAt = d(b.createdAt); });
  db.saleVersions.forEach((v) => { v.effectiveDate = d(v.effectiveDate); });
  db.proposals.forEach((p) => { p.proposedAt = d(p.proposedAt); });
  Object.values(db.history).forEach((rows) => rows.forEach((r) => { r.at = d(r.at); }));
  db.seededOn = todayIso();
  writeDb(db);
  return db;
}

export function readDb() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) return shiftDays(JSON.parse(s));
  } catch (e) { /* trình duyệt chặn lưu ⇒ dùng mẫu */ }
  const db = seedDb();
  writeDb(db);
  return db;
}
export function writeDb(db) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); return true; } catch (e) { return false; } }

/* ── Tra cứu ── */
export const pairOf = (db, pairId) => db.pairs.find((p) => p.id === pairId) || null;
export const productOf = (db, pair) => (pair ? db.products.find((p) => p.id === pair.productId) : null) || null;
export const supplierOf = (db, pair) => (pair ? db.suppliers.find((s) => s.id === pair.supplierId) : null) || null;
export const supplierById = (db, id) => db.suppliers.find((s) => s.id === id) || null;
/* dòng chưa xóa */
export const liveLines = (db) => db.lines.filter((l) => !l.isDeleted);
export const findLine = (db, code) => db.lines.find((l) => l.code === code && !l.isDeleted) || null;
export const batchOf = (db, batchCode) => db.batches.find((b) => b.code === batchCode) || null;
export const linesOfBatch = (db, batchCode) => liveLines(db).filter((l) => l.batchCode === batchCode);
const linesOfPair = (db, pairId, exceptCode) => liveLines(db).filter((l) => l.pairId === pairId && l.code !== exceptCode);

/* cặp đang hoạt động, có mặt hàng và nhà cung cấp đang hoạt động */
export function isPairUsable(db, pairId) {
  const pair = pairOf(db, pairId); if (!pair || !pair.isActive || pair.isDeleted) return false;
  const product = productOf(db, pair), supplier = supplierOf(db, pair);
  return !!product && product.isActive && !product.isDeleted && !!supplier && supplier.isActive && !supplier.isDeleted;
}
export const usablePairsOfSupplier = (db, supplierId) => db.pairs.filter((p) => p.supplierId === supplierId && isPairUsable(db, p.id));
/* «Mã hàng · Tên hàng — Nhà cung cấp» */
export function pairLabel(db, pairId) {
  const pair = pairOf(db, pairId), product = productOf(db, pair), supplier = supplierOf(db, pair);
  return product && supplier ? product.code + ' · ' + product.name + ' — ' + supplier.name : '';
}

/* Giá nhập hiện hành của cặp: dòng có ngày bắt đầu muộn nhất không sau hôm nay, khi hôm nay chưa qua ngày kết thúc của dòng đó */
export function currentLineOf(db, pairId, today = todayIso()) {
  const latest = linesOfPair(db, pairId).filter((l) => l.fromDate <= today).sort((a, b) => (a.fromDate < b.fromDate ? 1 : -1))[0];
  return latest && today <= latest.toDate ? latest : null;
}

/* Hiệu lực của dòng so với hôm nay, tính cả hai đầu — xét theo thứ tự, ra đúng 1 */
export function effectOf(db, line, today = todayIso()) {
  if (today < line.fromDate) return 'UPCOMING';
  if (today > line.toDate) return 'EXPIRED';
  if (linesOfPair(db, line.pairId, line.code).some((l) => l.fromDate > line.fromDate && l.fromDate <= today)) return 'REPLACED';
  return 'CURRENT';
}

/* Dòng cũ mà một dòng bắt đầu ngày fromDate sẽ thay thế: dòng còn hiệu lực tại ngày đó, bắt đầu muộn nhất */
export const replaceTargetOf = (db, pairId, fromDate, exceptCode) => (fromDate ? linesOfPair(db, pairId, exceptCode)
  .filter((l) => l.fromDate < fromDate && fromDate <= l.toDate).sort((a, b) => (a.fromDate < b.fromDate ? 1 : -1))[0] || null : null);
/* Ngày bắt đầu muộn nhất của các dòng còn lại cùng cặp — dòng mới phải bắt đầu sau ngày này */
export const latestStartOf = (db, pairId, exceptCode) => linesOfPair(db, pairId, exceptCode).reduce((m, l) => (l.fromDate > m ? l.fromDate : m), '');
/* Dòng mà line đang thay thế · dòng đang thay thế line */
export const replacesOf = (db, line) => (line.replacesCode ? findLine(db, line.replacesCode) : null);
export const replacedByOf = (db, line) => liveLines(db).find((l) => l.replacesCode === line.code) || null;
function replacedText(newLine) { return 'Bị thay thế bởi dòng giá nhập ' + newLine.code + ' (' + priceText(newLine.price) + ') từ ' + dateText(newLine.fromDate) + ', đợt ' + newLine.batchCode; }

/* Giá bán hiện hành của cặp: phiên bản Đã duyệt có ngày hiệu lực mới nhất không sau hôm nay */
export function currentSaleOf(db, pairId, today = todayIso()) {
  return db.saleVersions.filter((v) => v.pairId === pairId && v.status === 'APPROVED' && v.effectiveDate <= today)
    .sort((a, b) => (a.effectiveDate < b.effectiveDate ? 1 : a.effectiveDate > b.effectiveDate ? -1 : b.versionNo - a.versionNo))[0] || null;
}
export const saleVersionOf = (db, id) => (id ? db.saleVersions.find((v) => v.id === id) : null) || null;

export const proposalsOfLine = (db, code) => db.proposals.filter((p) => p.lineCode === code).sort((a, b) => b.versionNo - a.versionNo || (a.proposedAt < b.proposedAt ? 1 : -1));
export const latestProposalOf = (db, code) => proposalsOfLine(db, code)[0] || null;
/* phiếu Nháp hoặc Chờ duyệt của cặp, ở bất kỳ dòng nào */
export const openProposalOfPair = (db, pairId) => db.proposals.find((p) => p.pairId === pairId && OPEN_PROPOSAL.includes(p.status)) || null;

/* Trạng thái khóa của cặp — xét theo thứ tự, ra đúng 1 */
export function lockStateOf(db, pairId, today = todayIso()) {
  const current = currentLineOf(db, pairId, today);
  if (!current) return 'EXPIRED_PURCHASE';
  const props = proposalsOfLine(db, current.code);
  const requiredFailed = props.some((p) => p.kind === 'REQUIRED' && p.status === 'REJECTED') || current.requiredDraftDeleted;
  if (requiredFailed && !current.saleVersionId) return 'SALE_NOT_APPROVED';
  if (props.some((p) => OPEN_PROPOSAL.includes(p.status))) return 'PENDING_PRICE';
  return 'OPEN';
}

export const receiptCount = (line) => (line.receipts || []).length;
export const hasUsage = (line) => receiptCount(line) > 0 || (line.orderLineCount || 0) > 0;
export const draftOfLine = (db, code) => db.proposals.find((p) => p.lineCode === code && p.status === 'DRAFT') || null;
/* Lý do không sửa được (rỗng = sửa được) — chỉ sửa khi phiếu đề xuất gắn dòng còn Nháp và dòng chưa phát sinh */
export function editBlockReason(db, line) {
  const effect = effectOf(db, line);
  if (effect === 'EXPIRED') return 'Không sửa được vì dòng đã hết hiệu lực';
  if (effect === 'REPLACED') return 'Không sửa được vì dòng đã bị thay thế';
  if (hasUsage(line)) return 'Không sửa được vì dòng đã phát sinh phiếu nhập hoặc đơn hàng';
  if (!draftOfLine(db, line.code)) {
    const latest = latestProposalOf(db, line.code);
    if (!latest || line.decision === 'KEEP_CURRENT') return 'Không sửa được vì dòng giữ giá bán hiện hành, không có phiếu đề xuất giá bán Nháp';
    return 'Không sửa được vì phiếu đề xuất giá bán gắn dòng đang ở trạng thái ' + PROPOSAL_STATUS[latest.status];
  }
  return '';
}
/* Lý do không xóa được (rỗng = xóa được) */
export function deleteBlockReason(db, line) {
  if (hasUsage(line)) return 'Không xóa được vì dòng đã phát sinh phiếu nhập hoặc đơn hàng';
  const blocking = proposalsOfLine(db, line.code).find((p) => BLOCK_DELETE_PROPOSAL.includes(p.status));
  if (blocking) return 'Không xóa được vì phiếu đề xuất giá bán gắn dòng đang ở trạng thái ' + PROPOSAL_STATUS[blocking.status];
  return '';
}

/* Lỗi của một dòng trong đợt khi lưu, đọc trên dữ liệu mới nhất (rỗng = đạt) — thứ tự: ngày bắt đầu → phiếu treo → cặp còn hoạt động */
export function batchRowIssue(db, pairId, fromDate, exceptCode) {
  const latest = latestStartOf(db, pairId, exceptCode);
  if (latest && fromDate <= latest) return startRuleText(latest);
  const open = openProposalOfPair(db, pairId);
  if (open && open.lineCode !== exceptCode) return 'Mặt hàng đang có phiếu đề xuất giá bán ở trạng thái ' + PROPOSAL_STATUS[open.status];
  if (!isPairUsable(db, pairId)) return 'Mặt hàng hoặc nhà cung cấp đã ngừng hoạt động hoặc bị xóa. Vui lòng tải lại và chọn mặt hàng khác';
  return '';
}
export const startRuleText = (latest) => 'Hiệu lực từ ngày phải sau ngày ' + dateText(latest) + ' — ngày bắt đầu của dòng giá nhập mới nhất của mặt hàng';

/* ── Ghi ── */
const nowIso = () => dayjs().format('YYYY-MM-DDTHH:mm:ss');
function log(db, code, action, content, reason) {
  const a = currentAccount();
  (db.history[code] = db.history[code] || []).push({ at: nowIso(), actorName: a.name, actorRole: a.role, action, content, reason: reason || '' });
}
const nextVersionNo = (db, pairId) => Math.max(0, ...db.saleVersions.filter((v) => v.pairId === pairId).map((v) => v.versionNo), ...db.proposals.filter((p) => p.pairId === pairId).map((p) => p.versionNo)) + 1;
/* Dòng đang có phiếu Nháp ⇒ cập nhật phiếu đó (giá nhập tham chiếu mới, loại mới); chưa có ⇒ tạo phiếu Nháp mới. Trả câu cho lịch sử */
function upsertDraft(db, line, kind) {
  const draft = draftOfLine(db, line.code);
  if (draft) {
    Object.assign(draft, { kind, refPurchasePrice: line.price, proposedAt: todayIso() });
    return 'cập nhật phiếu đề xuất giá bán Nháp V' + draft.versionNo + ' (' + PROPOSAL_KIND[kind] + ', giá nhập tham chiếu ' + priceText(line.price) + ')';
  }
  const id = 'DX-' + String(db.nextProposalNo++).padStart(4, '0');
  const versionNo = nextVersionNo(db, line.pairId);
  db.proposals.push({ id, lineCode: line.code, pairId: line.pairId, versionNo, kind, status: 'DRAFT', proposedPrice: null, refPurchasePrice: line.price, proposedAt: todayIso() });
  return 'sinh phiếu đề xuất giá bán Nháp V' + versionNo + ' (' + PROPOSAL_KIND[kind] + ')';
}

/* decision: { type: 'AUTO_PROPOSAL' | 'CREATE_PROPOSAL' | 'KEEP_CURRENT', reason } — áp lên dòng, sinh phiếu nếu cần; trả câu mô tả cho lịch sử */
function applyDecision(db, line, decision) {
  line.decision = decision.type;
  line.decisionReason = decision.reason || '';
  line.requiredDraftDeleted = false;
  if (decision.type === 'AUTO_PROPOSAL') { line.saleVersionId = null; return upsertDraft(db, line, 'REQUIRED'); }
  if (decision.type === 'CREATE_PROPOSAL') { line.saleVersionId = null; return upsertDraft(db, line, 'OPTIONAL'); }
  const sale = currentSaleOf(db, line.pairId);
  line.saleVersionId = sale ? sale.id : null;
  const draft = draftOfLine(db, line.code);
  if (draft) db.proposals = db.proposals.filter((p) => p !== draft);
  return 'giữ giá bán hiện hành' + (sale ? ' ' + priceText(sale.price) : '') + (draft ? '; xóa phiếu đề xuất giá bán Nháp V' + draft.versionNo + ' đang gắn dòng' : '');
}

/* Gắn liên kết thay thế cho dòng theo ngày bắt đầu hiện tại; ghi lịch sử «Thay thế» lên dòng cũ */
function linkReplace(db, line) {
  const target = replaceTargetOf(db, line.pairId, line.fromDate, line.code);
  line.replacesCode = target ? target.code : '';
  if (target) log(db, target.code, 'Thay thế', replacedText(line));
}

/* header: { supplierId, fromDate, toDate, refNo, file } · rows: [{ pairId, price, decision: { type, reason } }]
 * Ghi một lần cả đợt; trả { batch, lines } hoặc null khi không ghi được */
export function createBatch(header, rows) {
  const db = readDb();
  const a = currentAccount();
  const batch = {
    code: 'DGN-' + String(db.nextBatchNo++).padStart(4, '0'), supplierId: header.supplierId, refNo: header.refNo || '', file: header.file,
    fromDate: header.fromDate, toDate: header.toDate, note: '', createdBy: { name: a.name, role: a.role }, createdAt: nowIso(), isDeleted: false,
  };
  db.batches.push(batch);
  const lines = rows.map((r) => {
    const line = {
      code: 'GN-' + String(db.nextLineNo++).padStart(4, '0'), batchCode: batch.code, pairId: r.pairId, price: r.price, fromDate: batch.fromDate, toDate: batch.toDate,
      replacesCode: '', decision: r.decision.type, decisionReason: '', saleVersionId: null, receipts: [], orderLineCount: 0,
      createdBy: { name: a.name, role: a.role }, createdAt: nowIso(), isDeleted: false,
    };
    linkReplace(db, line);
    db.lines.push(line);
    const effectText = applyDecision(db, line, r.decision);
    log(db, line.code, 'Tạo', 'Tạo dòng giá nhập ' + priceText(line.price) + ', hiệu lực ' + dateText(line.fromDate) + ' – ' + dateText(line.toDate) + ', đợt ' + batch.code
      + (line.replacesCode ? ', thay thế dòng ' + line.replacesCode : '') + '. Quyết định giá bán: ' + DECISION[line.decision] + ', ' + effectText, line.decisionReason);
    return line;
  });
  if (!writeDb(db)) return null;
  const supplier = supplierById(db, batch.supplierId);
  pushNotification({
    recipientKey: 'ACCOUNTANT', recordCode: batch.code, actionUrl: '/hang-hoa/gia-nhap',
    title: 'Đã tạo đợt giá nhập **' + batch.code + ' — ' + (supplier ? supplier.name : '') + '**: ' + lines.length + ' mặt hàng, hiệu lực ' + dateText(batch.fromDate) + ' – ' + dateText(batch.toDate),
    body: a.name + ' · ' + a.role,
  });
  return { batch, lines };
}

/* input: { price, fromDate, toDate } · decision null ⇒ giá không đổi, giữ quyết định cũ */
export function updateLine(code, input, decision) {
  const db = readDb();
  const line = findLine(db, code); if (!line) return null;
  const changes = [];
  const track = (label, before, after) => { if (before !== after) changes.push(label + ': ' + (before || '—') + ' → ' + (after || '—')); };
  track('Giá nhập', priceText(line.price), priceText(input.price));
  track('Hiệu lực từ', dateText(line.fromDate), dateText(input.fromDate));
  track('Hiệu lực đến', dateText(line.toDate), dateText(input.toDate));
  const fromChanged = line.fromDate !== input.fromDate;
  Object.assign(line, { price: input.price, fromDate: input.fromDate, toDate: input.toDate });
  if (fromChanged) {
    const before = line.replacesCode;
    linkReplace(db, line);
    if (before !== line.replacesCode) changes.push('Thay thế dòng: ' + (before || '—') + ' → ' + (line.replacesCode || '—'));
  }
  if (decision) {
    const before = DECISION[line.decision];
    const effectText = applyDecision(db, line, decision);
    changes.push(before === DECISION[line.decision] ? 'Quyết định giá bán giữ «' + before + '», ' + effectText : 'Quyết định giá bán: ' + before + ' → ' + DECISION[line.decision] + ', ' + effectText);
  }
  log(db, code, 'Cập nhật', changes.join('; ') || 'Không đổi nội dung', decision ? line.decisionReason : '');
  if (!writeDb(db)) return null;
  const pair = pairOf(db, line.pairId), product = productOf(db, pair), supplier = supplierOf(db, pair);
  const a = currentAccount();
  pushNotification({
    recipientKey: 'ACCOUNTANT', recordCode: line.code, actionUrl: '/hang-hoa/gia-nhap/' + encodeURIComponent(line.code),
    title: 'Đã cập nhật dòng giá nhập **' + (product ? product.name : '') + ' — ' + (supplier ? supplier.name : '') + '**: ' + moneyText(line.price) + 'đ, hiệu lực ' + dateText(line.fromDate) + ' – ' + dateText(line.toDate),
    body: a.name + ' · ' + a.role,
  });
  return line;
}

/* Xóa mềm dòng kèm phiếu Nháp gắn dòng; đợt hết dòng thì xóa mềm theo; trả false nếu không ghi được */
export function deleteLine(code, reason) {
  const db = readDb();
  const line = findLine(db, code); if (!line) return false;
  const a = currentAccount();
  const drafts = db.proposals.filter((p) => p.lineCode === code && p.status === 'DRAFT');
  const old = replacesOf(db, line);
  Object.assign(line, { isDeleted: true, deletedBy: { name: a.name, role: a.role }, deletedAt: nowIso() });
  db.proposals = db.proposals.filter((p) => !(p.lineCode === code && p.status === 'DRAFT'));
  log(db, code, 'Xóa', 'Xóa dòng giá nhập ' + priceText(line.price) + ', hiệu lực ' + dateText(line.fromDate) + ' – ' + dateText(line.toDate)
    + (drafts.length ? '; xóa kèm phiếu đề xuất giá bán Nháp gắn dòng' : ''), reason);
  if (old) log(db, old.code, 'Thay thế', 'Dòng giá nhập ' + code + ' thay thế dòng này đã bị xóa — dòng tính lại hiệu lực');
  const batch = batchOf(db, line.batchCode);
  if (batch && !linesOfBatch(db, batch.code).length) Object.assign(batch, { isDeleted: true, deletedAt: nowIso() });
  return writeDb(db);
}

export const historyOf = (db, code) => (db.history[code] || []).slice().sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0));
