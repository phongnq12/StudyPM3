/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Dữ liệu mẫu riêng của trang Design System (localStorage của chính trang này, khác origin Prototype nên không đụng dữ liệu Prototype).
 * Đủ để control chạy thật: 1 quầy Hoạt động có 3 buồng và 1 suất riêng ⇒ lưới lịch theo buồng, ô chọn buồng, thẻ trạng thái có dữ liệu. */
const SEED_VERSION = 'sd-seed-2026-10-10';
export function seedDesignData() {
  try {
    if (localStorage.getItem('sd-seed') === SEED_VERSION) return;
    const now = new Date().toISOString();
    localStorage.setItem('pm2.currentAccount', 'VISIT_TEAM_STAFF');
    localStorage.setItem('pm2_quay_tiep_don_ds_v4', JSON.stringify([
      { code: 'Q01', name: 'Quầy tiếp đón chính', phone: '', note: '', dormitoryCodes: [], status: 'ACTIVE', reservedRanges: [{ from: '08:00', to: '09:00', tableCodes: ['Q01-01'] }], createdAt: now, updatedAt: now },
    ]));
    localStorage.setItem('pm2_ban_tham_gap_v1', JSON.stringify([
      { code: 'Q01-01', counterCode: 'Q01', name: 'Buồng số 1', seats: 3, hasPartition: true, note: '', status: 'ACTIVE', legacyCode: '', createdAt: now },
      { code: 'Q01-02', counterCode: 'Q01', name: 'Buồng số 2', seats: 3, hasPartition: true, note: '', status: 'ACTIVE', legacyCode: '', createdAt: now },
      { code: 'Q01-03', counterCode: 'Q01', name: 'Buồng số 3', seats: 2, hasPartition: false, note: '', status: 'INACTIVE', legacyCode: '', createdAt: now },
    ]));
    localStorage.setItem('sd-seed', SEED_VERSION);
  } catch { /* trình duyệt chặn lưu trữ: control vẫn hiện, chỉ thiếu dữ liệu mẫu */ }
}
