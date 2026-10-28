/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Thẻ số liệu — hàng thẻ nhãn · giá trị · so sánh, đối chiếu Design System PM1.
 * Lưới tự xuống dòng (mỗi thẻ rộng tối thiểu 240px), số định dạng dấu chấm hàng nghìn.
 * items: [{ key, label, value, delta?, tone?: 'up' | 'down' | 'flat' }] */
import './AppPm1Controls.css';

const fmt = (v) => (typeof v === 'number' ? v.toLocaleString('vi-VN') : v);

/**
 * Thuộc tính của AppStatCards (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {array} props.items - Danh sách thẻ `{ key, label, value, delta, tone }`, giá trị số định dạng dấu chấm hàng nghìn, `tone` nhận `up`, `down` hoặc `flat`.
 */
export default function AppStatCards({ items = [] }) {
  return <div className="app-stat-cards" data-fe="AppStatCards">
    {items.map((it) => <div key={it.key} className="app-stat">
      <div className="app-stat-label">{it.label}</div>
      <div className="app-stat-value">{fmt(it.value)}</div>
      {it.delta ? <div className={'app-stat-delta is-' + (it.tone || 'flat')}>{it.delta}</div> : null}
    </div>)}
  </div>;
}
