/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Tag trạng thái danh mục Nháp · Hoạt động · Vô hiệu hóa — 1 bảng màu cho Quầy tiếp đón và Buồng thăm gặp, dùng ở Danh sách, Chi tiết, tiêu đề màn Sửa.
 * Nháp cùng nhãn với lịch hẹn ⇒ lấy đúng tag Nháp của màn mẫu Lịch hẹn (.tag-draft, styles/base.css: nền trắng, viền đứt).
 * Hoạt động · Vô hiệu hóa không có ở màn mẫu ⇒ màu khai ở styles/base.css, trùng màu chấm tab trạng thái của 2 danh sách. */
import AppTag from '@/components/app/AppTag';
import './CatalogStatusTag.css';

export const CATALOG_STATUS_CLASS = { DRAFT: 'tag-draft', ACTIVE: 'tag-active', INACTIVE: 'tag-inactive' };

/**
 * Thuộc tính của CatalogStatusTag (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {'DRAFT' | 'ACTIVE' | 'INACTIVE'} props.status - Trạng thái danh mục quyết định màu: `DRAFT` lớp `tag-draft`, `ACTIVE` lớp `tag-active`, `INACTIVE` lớp `tag-inactive`.
 * @param {string} props.label - Chữ hiển thị trong tag, truyền nguyên văn từ nơi gọi.
 * @param {string} props.className - Lớp CSS thêm vào sau các lớp `tag tag-dot catalog-status`.
 */
export default function CatalogStatusTag({ status, label, className = '' }) {
  return <AppTag className={'tag tag-dot catalog-status ' + (CATALOG_STATUS_CLASS[status] || '') + (className ? ' ' + className : '')}>{label}</AppTag>;
}
