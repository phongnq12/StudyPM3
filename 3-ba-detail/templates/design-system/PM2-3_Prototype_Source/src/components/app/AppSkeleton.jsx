/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Khung chờ tải — giữ chỗ đúng hình nội dung sắp hiện để màn không nhảy bố cục.
 * lines: số dòng · dòng cuối ngắn 60% cho giống đoạn văn. */
import './AppExtraControls.css';

/**
 * Thuộc tính của AppSkeleton (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {number} props.lines - Số dòng giữ chỗ, từ 2 dòng trở lên thì dòng cuối ngắn 60%.
 * @param {string} props.label - Nhãn cho trình đọc màn hình.
 */
export default function AppSkeleton({ lines = 3, label = 'Đang tải nội dung' }) {
  return <div className="app-skeleton" role="status" aria-label={label} aria-busy="true">
    {Array.from({ length: lines }, (_, i) => <span key={i} className="app-skeleton-line" style={{ width: i === lines - 1 && lines > 1 ? '60%' : '100%' }} />)}
  </div>;
}
