/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Thanh tiến độ — tỷ lệ đã dùng / tổng (quỹ lượt, sức chứa, tiến độ xử lý).
 * tone: brand (mặc định) · ok · warn. Chữ đầu thanh: nhãn bên trái, «value / max» bên phải. */
import './AppExtraControls.css';

/**
 * Thuộc tính của AppProgress (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {string} props.label - Nhãn bên trái phía trên thanh, đồng thời là nhãn của thanh cho trình đọc màn hình.
 * @param {number} props.value - Giá trị đã đạt, chia cho `max` ra phần trăm tô đầy, giới hạn trong 0 tới 100.
 * @param {number} props.max - Giá trị tổng, bằng 0 hoặc nhỏ hơn thì thanh để trống.
 * @param {'brand' | 'ok' | 'warn'} props.tone - Tông màu thanh: `brand` màu chủ đạo, `ok` hoặc `warn`.
 * @param {boolean} props.showValue - Hiện chữ `value / max` ở bên phải phía trên thanh.
 */
export default function AppProgress({ label, value = 0, max = 100, tone = 'brand', showValue = true }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, Math.round((value / max) * 100))) : 0;
  return <div className={'app-progress' + (tone !== 'brand' ? ' is-' + tone : '')}>
    {label || showValue ? <div className="app-progress-head"><span>{label}</span>{showValue ? <b>{value + ' / ' + max}</b> : null}</div> : null}
    <div className="app-progress-track" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}>
      <div className="app-progress-fill" style={{ width: pct + '%' }} />
    </div>
  </div>;
}
