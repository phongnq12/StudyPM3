/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Ô chọn ngày giờ [ dd/MM/yyyy HH:mm ] — định nghĩa sẵn cho màn cần cả ngày lẫn giờ.
 * Kiểu 1 ô + bảng chọn (MUI DateTimePicker bản desktop, Ant Design DatePicker showTime): lịch 1 tháng bên trái, cột Giờ · Phút bên phải, chân bảng «Bây giờ».
 * Chọn là ghi nhận ngay, bấm ra ngoài là đóng — không cần nút xác nhận.
 * Ghép đúng 2 mảnh PM2 đang có: lịch .date-picker-* (styles/base.css, như ô Ngày hẹn) và cột .time-panel-* (TimeRangeInput) — không vẽ kiểu mới.
 * Vẫn gõ tay được; ô không tự chuẩn hoá giá trị, màn nhận chuỗi qua onChange(value) rồi tự kiểm (như TimeRangeInput). */
import { useEffect, useRef, useState } from 'react';
import useFixedPanel from '@/lib/useFixedPanel';
import './TimeRangeInput.css';
import './DateTimeInput.css';

const pad = (n) => String(n).padStart(2, '0');
const HOURS = Array.from({ length: 24 }, (_, i) => pad(i));
const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
/* «dd/MM/yyyy HH:mm» ⇒ { y, m, d, hh, mm }; sai dạng thì null */
const parse = (v) => {
  const x = /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?$/.exec(String(v || '').trim());
  if (!x) return null;
  const d = new Date(+x[3], +x[2] - 1, +x[1]);
  if (d.getMonth() !== +x[2] - 1) return null;
  return { date: d, hh: x[4] || '', mm: x[5] || '' };
};
const format = (date, hh, mm) => pad(date.getDate()) + '/' + pad(date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + (hh || '00') + ':' + (mm || '00');
const sameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/**
 * Thuộc tính của DateTimeInput (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {string} props.value - Ngày giờ dạng `dd/MM/yyyy HH:mm` hiện trong ô, sai dạng thì bảng chọn không đánh dấu ngày và giờ nào.
 * @param {function} props.onChange - Gọi khi gõ, chọn ngày, chọn giờ phút hoặc bấm «Bây giờ», nhận chuỗi giá trị mới chưa chuẩn hoá.
 * @param {boolean} props.disabled - Khoá ô nhập, thêm lớp `is-disabled` và đóng bảng chọn đang mở.
 * @param {boolean} props.invalid - Bật viền lỗi bằng lớp `input-border-error` cho ô.
 * @param {string} props.id - Id của ô nhập, bảng chọn nhận id `{id}-panel`, bỏ trống thì không gán id.
 * @param {string} props.label - Nhãn đọc và title của ô, cũng là nhãn của bảng chọn.
 * @param {number} props.minuteStep - Bước của cột Phút, mặc định 5 như ô khoảng giờ.
 * @param {string} props.placeholder - Chữ gợi ý khi ô trống, mặc định `dd/MM/yyyy HH:mm`.
 */
export default function DateTimeInput({ value, onChange, disabled, invalid, id, label, minuteStep = 5, placeholder = 'dd/MM/yyyy HH:mm' }) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(null);
  const box = useRef(null);
  const field = useRef(null);
  const cur = parse(value);
  const minutes = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => pad(i * minuteStep));
  const show = () => { if (disabled) return; const base = cur ? cur.date : new Date(); setMonth(new Date(base.getFullYear(), base.getMonth(), 1)); setOpen(true); };
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (box.current && !box.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown); document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);
  useEffect(() => { if (disabled) setOpen(false); }, [disabled]);
  const panel = useFixedPanel(open && !!month, field);   /* bảng chọn kiểu fixed, không bị khung cha cắt */
  /* mở bảng ⇒ cuộn giờ, phút đang chọn vào giữa cột (không cuộn cả trang) */
  useEffect(() => {
    if (!open || !box.current) return;
    box.current.querySelectorAll('.time-panel-col').forEach((col) => {
      const cell = col.querySelector('.is-selected');
      if (cell) col.scrollTop = cell.offsetTop - col.clientHeight / 2 + cell.clientHeight / 2;
    });
  }, [open]);

  const pickDay = (d) => onChange(format(d, cur ? cur.hh : '', cur ? cur.mm : ''));
  const pickTime = (hh, mm) => onChange(format(cur ? cur.date : new Date(), hh, mm));
  const now = () => { const n = new Date(); onChange(format(n, pad(n.getHours()), pad(n.getMinutes() - (n.getMinutes() % minuteStep)))); };
  const step = (n) => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + n, 1));

  const days = [];
  if (month) {
    const offset = (month.getDay() + 6) % 7;
    for (let i = 0; i < 42; i++) days.push(new Date(month.getFullYear(), month.getMonth(), 1 - offset + i));
  }
  const today = new Date();
  return (
    <div className="datetime-wrap" ref={box} data-fe="DateTimeInput">
      <div ref={field} className={'text-input date-input datetime-input' + (disabled ? ' is-disabled' : '') + (invalid ? ' input-border-error' : '')}>
        <input type="text" id={id} value={value || ''} placeholder={placeholder} aria-label={label} title={label} maxLength={16} inputMode="numeric" autoComplete="off"
          disabled={disabled} onFocus={show} onClick={show} onChange={(e) => onChange(e.target.value)} />
        <svg className="date-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" onClick={show}>
          <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18M12 14v3l2 1" />
        </svg>
      </div>
      {open && month ? (
        <div ref={panel} className="datetime-panel" role="dialog" aria-label={label} id={id ? id + '-panel' : undefined} onMouseDown={(e) => { if (e.target.tagName !== 'INPUT') e.preventDefault(); }}>
          <div className="datetime-body">
            <div className="date-picker is-open datetime-calendar">
              <div className="date-picker-head">
                <button type="button" className="date-picker-nav" title="Năm trước" onClick={() => step(-12)}>&laquo;</button>
                <button type="button" className="date-picker-nav" title="Tháng trước" onClick={() => step(-1)}>&lsaquo;</button>
                <div className="date-picker-title">{'Tháng ' + (month.getMonth() + 1) + ' — ' + month.getFullYear()}</div>
                <button type="button" className="date-picker-nav" title="Tháng sau" onClick={() => step(1)}>&rsaquo;</button>
                <button type="button" className="date-picker-nav" title="Năm sau" onClick={() => step(12)}>&raquo;</button>
              </div>
              <div className="date-picker-grid">
                {WEEKDAYS.map((t) => <div key={t} className="date-picker-weekday">{t}</div>)}
                {days.map((d) => (
                  <div key={d.getTime()} className={'date-picker-day' + (d.getMonth() !== month.getMonth() ? ' is-outside' : '') + (sameDay(d, today) ? ' is-today' : '') + (cur && sameDay(d, cur.date) ? ' is-selected' : '')}
                    onClick={() => pickDay(d)}><span>{d.getDate()}</span></div>
                ))}
              </div>
            </div>
            <div className="datetime-times">
              <div className="time-panel-col">
                <div className="time-panel-head">Giờ</div>
                {HOURS.map((h) => <button type="button" key={h} className={'time-panel-cell' + (cur && h === cur.hh ? ' is-selected' : '')} onClick={() => pickTime(h, cur && cur.mm ? cur.mm : '00')}>{h}</button>)}
              </div>
              <div className="time-panel-col">
                <div className="time-panel-head">Phút</div>
                {minutes.map((m) => <button type="button" key={m} className={'time-panel-cell' + (cur && m === cur.mm ? ' is-selected' : '')} onClick={() => pickTime(cur && cur.hh ? cur.hh : '00', m)}>{m}</button>)}
              </div>
            </div>
          </div>
          {/* chọn ngày, giờ, phút là ghi nhận ngay; bấm ra ngoài hoặc Esc là đóng — KHÔNG có nút «Xong» */}
          <div className="datetime-foot">
            <button type="button" className="datetime-now" onClick={now}>Bây giờ</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
