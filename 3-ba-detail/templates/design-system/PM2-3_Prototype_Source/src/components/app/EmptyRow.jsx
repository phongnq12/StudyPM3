/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Dòng rỗng của bảng danh sách — 1 khuôn cho mọi danh sách.
 * Màn chưa có bản ghi nào ⇒ I001-27 «Chưa có {đối tượng} nào» · có bản ghi mà bộ lọc không ra ⇒ I001-28
 * Chữ nằm giữa PHẦN KHUNG ĐANG NHÌN THẤY (dính theo khung cuộn), không giữa cả bảng — bảng nhiều cột rộng hơn khung thì chữ không bị lệch phải */
import { msg } from '@/lib/msg';

/**
 * Thuộc tính của EmptyRow (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {number} props.colSpan - Số cột ô rỗng trải ngang, thường bằng số cột của bảng.
 * @param {string} props.entity - Tên đối tượng ghép vào câu `I001-27` khi danh sách chưa có bản ghi nào.
 * @param {boolean} props.hasRecords - Có bản ghi mà bộ lọc không ra thì hiện câu `I001-28`, ngược lại hiện câu `I001-27`.
 */
export default function EmptyRow({ colSpan, entity, hasRecords }) {
  return <tr><td colSpan={colSpan} className="empty-state"><span className="empty-state-text">{hasRecords ? msg('I001-28') : msg('I001-27', entity)}</span></td></tr>;
}
