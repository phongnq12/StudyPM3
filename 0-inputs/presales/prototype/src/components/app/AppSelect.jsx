/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* AppSelect — bọc antd Select như PM1. Giao diện antd NGUYÊN BẢN (không reset) theo chốt giống PM1 —
 * PM1 dùng AppSelect cho ô "Chọn số bản ghi": options 10/20/50/100, showSearch:false, allowClear:false.
 * width: giữ đúng bề rộng ô cũ để phần còn lại của bố cục không xô lệch.
 * Chọn nhiều (mode multiple/tags): mặc định maxTagCount="responsive" — tag giữ trên 1 dòng, phần dư gom thành «+N»,
 * di chuột vào «+N» hiện đủ tên qua data-full. Góp ý Designer: không giới hạn thì ô cao tràn. */
import { Select } from 'antd';

const labelOf = (o) => (typeof o.label === 'string' ? o.label : String(o.value));
const restTag = (omitted) => <span className="app-select-rest" data-full={omitted.map(labelOf).join(', ')}>{'+' + omitted.length}</span>;

/**
 * Thuộc tính của AppSelect (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {string} props.className - Lớp bổ sung, ghép sau lớp `app-select` của Select antd.
 * @param {number | string} props.width - Bề rộng ô chọn, đặt vào `style.width` và bị ghi đè nếu `style` có `width`.
 * @param {object} props.style - Style bổ sung của ô chọn, trộn sau `width`.
 */
export default function AppSelect({ className = '', width, style, ...rest }) {
  /* tên đọc: aria-label truyền vào > placeholder > ô số bản ghi (WCAG 4.1.2) */
  const ariaLabel = rest['aria-label'] || rest.placeholder || (rest.options === PAGE_SIZE_OPTIONS ? 'Số bản ghi trên 1 trang' : undefined);
  const multi = rest.mode === 'multiple' || rest.mode === 'tags';
  const tagLimit = multi ? { maxTagCount: 'responsive', maxTagPlaceholder: restTag } : {};
  return <Select className={'app-select ' + className} style={{ width, ...style }} data-fe="AppSelect" {...tagLimit} {...rest} aria-label={ariaLabel} />;
}

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100].map((v) => ({ label: String(v), value: v }));
