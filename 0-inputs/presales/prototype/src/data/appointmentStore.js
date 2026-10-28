/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Appointment store — the ONLY place that knows the legacy (short Vietnamese) keys.
 * The HTML prototype still runs side by side and shares 4 localStorage keys, whose records use the legacy shape.
 * Pages work with the English model of FE Conventions section 5 (status = enum code, dates ISO yyyy-mm-dd).
 * Remove the legacy half of this file when the HTML prototype is archived. */
import { APPOINTMENT_SOURCE, APPOINTMENT_STATUS, WEB06_APPOINTMENTS, appointmentToLegacy, START_EMPTY } from './legacyData';
import { LEGACY_TABLE_MAP } from './visitTableStore';
import { shiftsOfDate } from './visitConfigStore';

/* Lịch mẫu còn mã buồng cũ TC01-xx / TC02-xx của phòng cũ ⇒ đổi sang mã buồng mới của quầy khi nạp */
export const currentTableCode = (code) => { const c = String(code == null ? '' : code).trim(); return LEGACY_TABLE_MAP[c] || code; };

export const STORAGE_KEYS = {
  created: 'pm2_lich_hen_moi',          // Appointment[] created on Create / Counter screens
  edited: 'pm2_lich_hen_sua',           // { [code]: partial Appointment + savedAt }
  adjusted: 'pm2_lich_hen_dieu_chinh',  // { [code]: { visitDate, visitTime, tableCode, reason, savedAt } }
  editing: 'pm2_lich_hen_dang_sua',     // Appointment being edited (list -> edit screen hand-off)
};

const STATUS_BY_LABEL = Object.fromEntries(Object.entries(APPOINTMENT_STATUS).map(([k, v]) => [v.label, k]));
const SOURCE_BY_LABEL = Object.fromEntries(Object.entries(APPOINTMENT_SOURCE).map(([k, v]) => [v.label, k]));
export const statusLabel = (code) => (APPOINTMENT_STATUS[code] ? APPOINTMENT_STATUS[code].label : code);
export const sourceLabel = (code) => (APPOINTMENT_SOURCE[code] ? APPOINTMENT_SOURCE[code].label : code);

/* dates: legacy dd/mm/yyyy <-> ISO yyyy-mm-dd */
export const toIsoDate = (dmy) => (/^\d{2}\/\d{2}\/\d{4}$/.test(dmy || '') ? dmy.split('/').reverse().join('-') : dmy);
export const toDisplayDate = (iso) => (/^\d{4}-\d{2}-\d{2}$/.test(iso || '') ? iso.split('-').reverse().join('/') : iso);

/* legacy field -> English field for plain 1-to-1 copies (prototype-only extras included) */
const SIMPLE = {
  ma: 'code', cccd: 'studentCitizenId', hn: 'studentName', tn: 'visitorName', them: 'companionCount', qh: 'relationship',
  lh: 'visitTypeName', vt: 'tableCode', quay: 'counterCode', sn: 'visitorCount', tl: 'durationMinutes',
  daCheckIn: 'checkedIn', moi: 'isNew', lyDo: 'reason', ghiChuCB: 'staffNote', ghiChuTN: 'relativeNote', luc: 'savedAt',
  nguoiTao: 'createdByKey',   /* tài khoản cán bộ tạo lịch — nhận thông báo Phê duyệt / Từ chối */
  luong: 'approvalRoute', lyDoXinDuyet: 'exemptionReason', cccdTN: 'visitorCitizenId', lechNgay: 'dayOffset', guiLai: 'resubmitted',   /* luồng đăng ký · lý do xin duyệt · CCCD thân nhân — thiếu thì toLegacy bỏ mất khi lưu */
  sdtTN: 'visitorPhone', taiLieu: 'attachments',
  nhanTB: 'notifyRecipients',   /* mục chọn thông báo của lịch hẹn { VISIT_TEAM: [mã cán bộ], EXTRA: [mã cán bộ] } — thiếu khoá này thì toLegacy bỏ mất khi lưu */
  lanDuyet: 'approvalRounds', lucGuiDuyet: 'submittedAt', lyDoTuChoi: 'rejectReason', nguoiTuChoi: 'rejectedBy', lucTuChoi: 'rejectedAt',   /* lộ trình duyệt nhiều lần: các lần đã từ chối + lần hiện tại */   /* đơn ngoại lệ: số điện thoại thân nhân · tài liệu đính kèm [{ name, size }] — màn Sửa và Xem đọc lại */
};
const UI_FLAGS = { cls: 'rowState', vuot: 'isOverVisitorLimit' };   // legacy display flag -> key under `ui` (Prototype only; legacy hm was never read, dropped)

/* Legacy record (full or partial) -> English. Only keys present in the input appear in the output. */
export function fromLegacy(x) {
  if (!x) return x;
  const a = {};
  for (const [k, v] of Object.entries(x)) {
    if (k === 'vt') a.tableCode = currentTableCode(v);
    else if (SIMPLE[k]) a[SIMPLE[k]] = v;
    else if (k === 'dat') a.createdAt = toIsoDate(v);
    else if (k === 'nguon') a.source = SOURCE_BY_LABEL[v] || v;
    else if (k === 'tt') a.status = STATUS_BY_LABEL[v] || v;
    else if (k === 'ns') a.studentBirthDate = toIsoDate(v);
    else if (k === 'ngay') { const [d, t] = String(v || '').split(' '); a.visitDate = toIsoDate(d); a.visitTime = t || ''; }
    else if (k === 'hs') { const [c, team] = String(v || '').split(' · '); a.studentCode = c; a.teamName = team || ''; }
    else if (k === 'dsThem') a.companions = (v || []).map((s) => { const [name, relationship, citizenId] = String(s).split(' · '); return { name, relationship: relationship || '', citizenId: citizenId || '' }; });
    else if (k === 'doiChieu') a.documentChecks = v;   /* kết quả đối chiếu giấy tờ từng người lúc đăng ký tại quầy */
    else if (k in UI_FLAGS) { a.ui = a.ui || {}; a.ui[UI_FLAGS[k]] = k === 'vuot' ? !!v : v; }
    else if (k === 'hm') { /* dropped */ }
    else { a.extra = a.extra || {}; a.extra[k] = v; }   // unknown legacy field: carried through untouched
  }
  if (x.dsThem === undefined && x.ma !== undefined) a.isCompanionsAbsent = true;
  return a;
}

/* English record (full or partial) -> legacy. Inverse of fromLegacy. */
export function toLegacy(a) {
  if (!a) return a;
  const x = {};
  const INV = Object.fromEntries(Object.entries(SIMPLE).map(([k, v]) => [v, k]));
  for (const [k, v] of Object.entries(a)) {
    if (INV[k]) x[INV[k]] = v;
    else if (k === 'createdAt') x.dat = toDisplayDate(v);
    else if (k === 'source') x.nguon = sourceLabel(v);
    else if (k === 'status') x.tt = statusLabel(v);
    else if (k === 'studentBirthDate') x.ns = toDisplayDate(v);
    else if (k === 'companions') x.dsThem = (v || []).map((c) => (c.citizenId ? c.name + ' · ' + (c.relationship || '') + ' · ' + c.citizenId : (c.relationship ? c.name + ' · ' + c.relationship : c.name)));   /* giữ căn cước người đi cùng */
    else if (k === 'documentChecks') x.doiChieu = v;
    else if (k === 'ui') { if ('rowState' in v) x.cls = v.rowState; if (v.isOverVisitorLimit) x.vuot = 1; }
    else if (k === 'extra') Object.assign(x, v);
    else if ((k === 'visitDate' || k === 'visitTime') && !('ngay' in x)) x.ngay = toDisplayDate(a.visitDate || '') + (a.visitTime ? ' ' + a.visitTime : '');
    else if ((k === 'studentCode' || k === 'teamName') && !('hs' in x) && a.studentCode !== undefined) x.hs = a.teamName ? a.studentCode + ' · ' + a.teamName : a.studentCode;
  }
  return x;
}

/* Display strings used by several pages */
export const visitDateText = (r) => toDisplayDate(r.visitDate || '');
export const visitDateTimeText = (r) => visitDateText(r) + (r.visitTime ? ' ' + r.visitTime : '');

/* Object.assign of a partial record, with prototype-only groups (ui, extra) merged key by key */
export function mergeRecord(base, patch) {
  const out = Object.assign({}, base, patch);
  for (const group of ['ui', 'extra']) if (base[group] && patch[group]) out[group] = { ...base[group], ...patch[group] };
  return out;
}

/* Default: a broken or blocked store reads as the fallback.
 * { strict: true }: a broken JSON value throws, exactly like JSON.parse(localStorage.getItem(k) || '[]') of the HTML prototype —
 * used where the HTML page lets that error abort the whole block (and shows its own error toast). */
const read = (key, fallback, opts) => {
  let s; try { s = localStorage.getItem(key); } catch (e) { if (opts && opts.strict) throw e; return fallback; }
  if (!s) return fallback;
  if (opts && opts.strict) return JSON.parse(s);
  try { return JSON.parse(s); } catch (e) { return fallback; }
};
const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (e) { return false; } };

/* Seed data (English, straight from the shared data file) */
const SEED_ITEMS = START_EMPTY ? [] : WEB06_APPOINTMENTS.items;
export const seedAppointments = () => structuredClone(SEED_ITEMS).map((a) => ({ ...a, tableCode: currentTableCode(a.tableCode) }));
/* Same seed as the HTML prototype sees it (legacy adapter applied, then converted back) — keeps ui flags identical */
export const seedAsLegacyRoundTrip = () => withSeedDates(fitSeedToFrame(SEED_ITEMS.map((a) => fromLegacy(appointmentToLegacy(a)))));

/* Ngày THĂM GẶP thứ n tính từ hôm nay theo cấu hình WEB-54 đang dùng (thứ được bật Cho phép thăm gặp): 0 = hôm nay, 1 = ngày thăm gặp kế tiếp, -1 = liền trước.
 * Cấu hình tắt hết thì đếm theo ngày lịch. Là NGUỒN DUY NHẤT tính ngày lịch mẫu cho Danh sách, Chi tiết, Tạo mới. */
export function visitDayAt(today, n) {
  const d = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (!n) return d;
  const step = n > 0 ? 1 : -1; let left = Math.abs(n);
  for (let i = 0; i < 400 && left > 0; i++) { d.setDate(d.getDate() + step); if (shiftsOfDate(d).length) left--; }
  return left > 0 ? new Date(today.getFullYear(), today.getMonth(), today.getDate() + n) : d;
}
const isoDay = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
function withSeedDates(list) {
  const today = new Date();
  list.forEach((a, i) => { a.visitDate = isoDay(a.dayOffset !== undefined && a.dayOffset !== '' ? visitDayAt(today, +a.dayOffset) : new Date(today.getFullYear(), today.getMonth(), today.getDate() + (i % 7))); a.visitTime = a.visitTime || '08:00'; });
  return list;
}

/* thiết kế tạm: lịch mẫu CHƯA THỰC HIỆN nằm ngoài khung WEB-54 mặc định (Thứ Tư–Sáu · 08:00–11:00 · 14:00–17:00)
 * được dời vào khung khi nạp — đổi dayOffset sang ngày có ca gần nhất về sau, giờ kéo vào trong ca; giữ trạng thái, buồng, thời lượng.
 * Ngày đích trùng buồng và giờ với lịch khác thì lùi tiếp sang ngày có ca sau đó. */
const NOT_STARTED_SEED = ['DRAFT', 'PENDING_APPROVAL', 'PENDING_HEAD_APPROVAL', 'APPROVED', 'CHECKED_IN'];
const toMinute = (t) => { const m = /^(\d{1,2}):(\d{2})/.exec(String(t || '')); return m ? +m[1] * 60 + +m[2] : NaN; };
const toClock = (n) => String(Math.floor(n / 60)).padStart(2, '0') + ':' + String(n % 60).padStart(2, '0');
function fitSeedToFrame(list) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const dayAt = (offset) => visitDayAt(today, offset);   /* dayOffset = ngày thăm gặp thứ n, KHÔNG phải ngày lịch */
  /* [offset, tableCode, start, end] của lịch đang giữ buồng — sẵn có lịch Đang diễn ra (không dời) */
  const placed = list.filter((a) => a.status === 'IN_PROGRESS' && a.dayOffset !== undefined && a.visitTime)
    .map((a) => [+a.dayOffset, a.tableCode, toMinute(a.visitTime), toMinute(a.visitTime) + (+a.durationMinutes || 45)]);
  const clash = (offset, table, s, e) => !!table && placed.some((p) => p[0] === offset && p[1] === table && p[2] < e && s < p[3]);
  list.forEach((a) => {
    if (a.dayOffset === undefined || a.dayOffset === '' || NOT_STARTED_SEED.indexOf(a.status) < 0) return;
    const dur = +a.durationMinutes || 45;
    let offset = +a.dayOffset, time = a.visitTime;
    const fitTime = (shifts) => {
      if (!time) return '';
      const s = toMinute(time);
      if (shifts.some((sh) => s >= toMinute(sh.openTime) && s + dur <= toMinute(sh.closeTime))) return time;
      /* giờ cũ kẹp vào từng ca, lấy chỗ gần giờ cũ nhất */
      const options = shifts.map((sh) => Math.max(toMinute(sh.openTime), Math.min(toMinute(sh.closeTime) - dur, s)));
      return toClock(options.reduce((b, c) => (Math.abs(c - s) < Math.abs(b - s) ? c : b), options[0]));
    };
    for (let tries = 0; tries < 21; tries++, offset++) {
      const shifts = shiftsOfDate(dayAt(offset));
      if (!shifts.length) continue;
      const t = fitTime(shifts), s = toMinute(t);
      if (t && clash(offset, a.tableCode, s, s + dur)) continue;
      a.dayOffset = offset; a.visitTime = t;
      if (t && a.status !== 'DRAFT') placed.push([offset, a.tableCode, s, s + dur]);
      return;
    }
  });
  return list;
}

export const readCreated = (opts) => read(STORAGE_KEYS.created, [], opts).map(fromLegacy);
export const writeCreated = (list) => write(STORAGE_KEYS.created, list.map(toLegacy));
export const readEdited = (opts) => Object.fromEntries(Object.entries(read(STORAGE_KEYS.edited, {}, opts)).map(([k, v]) => [k, fromLegacy(v)]));
export const writeEdited = (map) => write(STORAGE_KEYS.edited, Object.fromEntries(Object.entries(map).map(([k, v]) => [k, toLegacy(v)])));
export const readAdjusted = (opts) => Object.fromEntries(Object.entries(read(STORAGE_KEYS.adjusted, {}, opts)).map(([k, v]) => [k, fromLegacy(v)]));
export const writeAdjusted = (map) => write(STORAGE_KEYS.adjusted, Object.fromEntries(Object.entries(map).map(([k, v]) => [k, toLegacy(v)])));
export const readEditing = () => fromLegacy(read(STORAGE_KEYS.editing, null));
export const writeEditing = (a) => write(STORAGE_KEYS.editing, toLegacy(a));

/* Dọn dữ liệu sai 1 lần mỗi phiên bản (lỗi LH-2026-0923: lịch không có buồng):
 * xoá lịch TỰ TẠO đã gửi đi (không phải Nháp) mà không có buồng thật (mã TCxx-yy), kèm bản sửa và bản điều chỉnh của nó.
 * Nháp chưa chọn buồng và lịch mẫu giữ nguyên. Muốn dọn lại lần nữa thì tăng CLEANUP_VERSION. */
/* Xoá SẠCH data cũ trong trình duyệt 1 lần khi data mẫu dựng lại: lịch tự tạo, bản sửa, điều chỉnh, trạng thái, lịch sử, thông báo.
 * Muốn xoá lại lần nữa thì đổi RESET_VERSION. */
const RESET_VERSION = '2026-10-09-du-lieu-trong', RESET_KEY = 'pm2_reset_du_lieu';   /* xoá cả quầy, buồng, cấu hình giờ đã lưu (cấu hình về mặc định) */
(function resetOldData() {
  try {
    if (localStorage.getItem(RESET_KEY) === RESET_VERSION) return;
    [STORAGE_KEYS.created, STORAGE_KEYS.edited, STORAGE_KEYS.adjusted, STORAGE_KEYS.editing, 'pm2_lich_su_thao_tac', 'pm2_lich_hen_trang_thai', 'pm2.notifications.v2', 'pm2_khen_thuong_da_ap_dung', 'pm2_quay_tiep_don_ds_v4', 'pm2_ban_tham_gap_v1', 'pm2_cau_hinh_khung_gio_v1', 'pm2.notificationSettings.v1'].forEach((k) => localStorage.removeItem(k));
    localStorage.setItem(RESET_KEY, RESET_VERSION);
  } catch (e) { /* trình duyệt chặn bộ nhớ: bỏ qua */ }
})();

/* CẢNH BÁO lịch "Cần đổi giờ khác" (buồng đổi quầy, không còn buồng trống cùng giờ) cố ý để buồng rỗng —
 * tăng mã dưới đây sẽ xóa luôn các lịch đó. Muốn dọn lại thì phải loại các lịch có lịch sử "Cần đổi giờ khác" trước */
const CLEANUP_VERSION = '2026-10-06-ban-rong';
const CLEANUP_KEY = 'pm2_don_du_lieu';
(function cleanupTablelessAppointments() {
  try {
    if (localStorage.getItem(CLEANUP_KEY) === CLEANUP_VERSION) return;
    const edited = readEdited(), adjusted = readAdjusted();
    const tableOf = (a) => String((adjusted[a.code] || {}).tableCode || (edited[a.code] || {}).tableCode || a.tableCode || '').trim();
    const statusOf = (a) => (edited[a.code] || {}).status || a.status;
    const created = readCreated();
    const bad = created.filter((a) => statusOf(a) !== 'DRAFT' && !/^(TC|Q)\d/.test(tableOf(a))).map((a) => a.code);
    if (bad.length) {
      /* xoá trên dữ liệu thô: chỉ bỏ đúng mã sai, không chuyển đổi lại các bản ghi khác */
      write(STORAGE_KEYS.created, read(STORAGE_KEYS.created, []).filter((x) => bad.indexOf(x.ma) < 0));
      const rawEdited = read(STORAGE_KEYS.edited, {}), rawAdjusted = read(STORAGE_KEYS.adjusted, {});
      bad.forEach((c) => { delete rawEdited[c]; delete rawAdjusted[c]; });
      write(STORAGE_KEYS.edited, rawEdited); write(STORAGE_KEYS.adjusted, rawAdjusted);
      console.info('[PM2] Đã dọn ' + bad.length + ' lịch không có buồng: ' + bad.join(', '));
    }
    localStorage.setItem(CLEANUP_KEY, CLEANUP_VERSION);
  } catch (e) { /* trình duyệt chặn bộ nhớ: bỏ qua, không làm hỏng trang */ }
})();
