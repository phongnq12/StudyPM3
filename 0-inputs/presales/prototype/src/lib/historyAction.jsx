/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Cột Thao tác của Lịch sử thao tác — hành động phá huỷ (Xóa, Hủy, Trả lại, Thu hồi) tô màu lỗi, còn lại chữ trơn (như PM1) */
const DESTRUCTIVE = /^(Xóa|Xoá|Hủy|Huỷ|Trả lại|Thu hồi)/i;
export const isDestructiveAction = (text) => DESTRUCTIVE.test(String(text || '').trim());
export const HistoryAction = ({ text }) => (isDestructiveAction(text) ? <span className="history-action is-danger">{text}</span> : text);
