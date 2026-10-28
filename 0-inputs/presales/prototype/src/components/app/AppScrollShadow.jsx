/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Bóng cuộn — vùng cuộn ngang (bảng rộng, dải thẻ) hiện bóng mờ ở mép còn nội dung bị che, hết thì bóng tắt.
 * Bóng chỉ báo hiệu, không chặn bấm. Tự đo lại khi cuộn và khi đổi cỡ cửa sổ. */
import { useEffect, useRef, useState } from 'react';
import './AppExtraControls.css';

/**
 * Thuộc tính của AppScrollShadow (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {ReactNode} props.children - Nội dung cuộn ngang bên trong vùng có bóng mép.
 * @param {string} props.label - Nhãn của vùng cuộn cho trình đọc màn hình.
 * @param {string} props.className - Lớp CSS thêm vào khung ngoài, nối sau lớp `app-scroll-shadow`.
 */
export default function AppScrollShadow({ children, label, className = '' }) {
  const box = useRef(null);
  const [edge, setEdge] = useState({ start: false, end: false });
  useEffect(() => {
    const el = box.current; if (!el) return undefined;
    const measure = () => setEdge({ start: el.scrollLeft > 1, end: el.scrollLeft + el.clientWidth < el.scrollWidth - 1 });
    measure();
    el.addEventListener('scroll', measure, { passive: true }); window.addEventListener('resize', measure);
    return () => { el.removeEventListener('scroll', measure); window.removeEventListener('resize', measure); };
  }, []);
  return <div className={'app-scroll-shadow' + (edge.start ? ' is-start' : '') + (edge.end ? ' is-end' : '') + (className ? ' ' + className : '')}>
    <div className="app-scroll-shadow-body" ref={box} tabIndex={0} role="region" aria-label={label}>{children}</div>
  </div>;
}
