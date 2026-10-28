/* Ô chọn một ngày theo mẫu `schedule-fields` của design system: nút .date-input có icon lịch, bấm mở bảng .date-picker
 * (lịch 1 tháng, tuần bắt đầu Thứ Hai, 4 nút năm/tháng trước sau), kèm link «Chọn ngày hôm nay» tùy chọn.
 * Giá trị vào/ra là chuỗi YYYY-MM-DD; hiển thị theo khuôn «Thứ, dd/mm/yyyy». Mọi xử lý ngày dùng dayjs. */
import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { AppButtonWithIcon } from '@/components/app/AppButton';
import useFixedPanel from '@/lib/useFixedPanel';

const ISO = 'YYYY-MM-DD';
const WEEKDAY_SHORT = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const WEEKDAY_NAMES = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
const NAV = [[-12, 'Năm trước', '«'], [-1, 'Tháng trước', '‹'], [1, 'Tháng sau', '›'], [12, 'Năm sau', '»']];

export const dateLabel = (iso) => { const d = dayjs(iso, ISO); return WEEKDAY_NAMES[d.day()] + ', ' + d.format('DD/MM/YYYY'); };

export default function DateField({ id, value, onChange, placeholder = 'Chọn ngày', hasError = false, todayLink = false, error = null }) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => dayjs(value || undefined).startOf('month'));
  const anchorRef = useRef(null);
  const panelRef = useFixedPanel(open, anchorRef);

  useEffect(() => {
    if (!open) return undefined;
    const outside = (e) => { if (!e.target.closest('.date-picker') && !(anchorRef.current && anchorRef.current.contains(e.target))) setOpen(false); };
    const esc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', outside); document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', outside); document.removeEventListener('keydown', esc); };
  }, [open]);

  const toggle = () => { if (!open) setMonth(dayjs(value || undefined).startOf('month')); setOpen((x) => !x); };
  const pick = (iso) => { onChange(iso); setOpen(false); };

  /* 42 ô = 6 tuần, ô đầu là Thứ Hai của tuần chứa ngày 1 */
  const first = month.subtract((month.day() + 6) % 7, 'day');
  const today = dayjs().format(ISO);
  const cells = Array.from({ length: 42 }, (_, i) => first.add(i, 'day'));

  return <div className="date-row">
    <span ref={anchorRef} style={{ width: '100%' }}>
      <AppButtonWithIcon htmlType="button" id={id} className={'text-input date-input' + (hasError ? ' input-border-error' : '')} onClick={toggle}
        icon="calendar" iconClassName="date-icon" aria-haspopup="dialog" aria-expanded={open}>
        <span style={value ? undefined : { color: 'var(--color-ink-4)' }}>{value ? dateLabel(value) : placeholder}</span>
      </AppButtonWithIcon>
    </span>
    {error}
    {todayLink && <a className="quick-link" href="#" onClick={(e) => { e.preventDefault(); pick(today); }}>Chọn ngày hôm nay</a>}
    {open && <div ref={panelRef} className="date-picker is-open" role="dialog" aria-label="Chọn ngày" onMouseDown={(e) => e.preventDefault()}>
      <div className="date-picker-head">
        {NAV.slice(0, 2).map(([step, title, text]) => <button key={step} type="button" className="date-picker-nav" title={title} aria-label={title} onClick={() => setMonth((m) => m.add(step, 'month'))}>{text}</button>)}
        <div className="date-picker-title">{'Tháng ' + (month.month() + 1) + ' — ' + month.year()}</div>
        {NAV.slice(2).map(([step, title, text]) => <button key={step} type="button" className="date-picker-nav" title={title} aria-label={title} onClick={() => setMonth((m) => m.add(step, 'month'))}>{text}</button>)}
      </div>
      <div className="date-picker-grid">
        {WEEKDAY_SHORT.map((t) => <div key={t} className="date-picker-weekday">{t}</div>)}
        {cells.map((d) => {
          const iso = d.format(ISO);
          const cls = ['date-picker-day', d.month() !== month.month() ? 'is-outside' : '', iso === today ? 'is-today' : '', iso === value ? 'is-selected' : ''].filter(Boolean).join(' ');
          return <div key={iso} className={cls} data-date={iso} onClick={() => pick(iso)}><span>{d.date()}</span></div>;
        })}
      </div>
    </div>}
  </div>;
}
