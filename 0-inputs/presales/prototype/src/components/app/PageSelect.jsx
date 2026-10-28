/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Ô «Chọn trang» cạnh chữ «Trang X/Y» ở mọi thanh phân trang: dùng ô chọn có tìm chung;
 * không có nút xoá vì danh sách luôn ở 1 trang (noClear); pick vẫn giữ trang đang xem nếu nhận giá trị rỗng. */
import { useEffect, useState } from 'react';
import SearchableSelect from '@/components/app/AppSearchSelect';

/**
 * Thuộc tính của PageSelect (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {string} props.id - Mã định danh chuyển tới ô chọn có tìm bên trong.
 * @param {number} props.current - Số trang đang xem, hiện làm giá trị đã chọn của ô.
 * @param {number} props.total - Tổng số trang, ô liệt kê từ 1 tới số này và luôn có ít nhất 1 trang.
 * @param {function} props.onChange - Gọi khi người dùng chọn 1 trang khác trang đang xem, nhận số trang mới.
 */
export default function PageSelect({ id, current, total, onChange }) {
  const pages = Math.max(total, 1);
  const [value, setValue] = useState(String(current));
  useEffect(() => { setValue(String(current)); }, [current, pages]);
  /* lựa chọn đầu rỗng là câu gợi ý (ô chọn có tìm coi lựa chọn đầu rỗng là «chưa chọn», không đưa vào danh sách) */
  const options = [{ value: '', label: 'Chọn trang' }].concat(Array.from({ length: pages }, (_, i) => ({ value: String(i + 1), label: String(i + 1) })));
  const pick = (v) => {
    const n = parseInt(v, 10);
    if (!n) { setValue(''); setTimeout(() => setValue(String(current)), 0); return; }   /* x ⇒ về lại trang đang xem */
    setValue(String(n));
    if (n !== current) onChange(n);
  };
  return <span className="pg-page-select"><SearchableSelect id={id} options={options} value={value} onChange={pick} noClear /></span>;   /* luôn ở 1 trang ⇒ không có nút xoá */
}
