/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Ô khoảng giờ [ HH:mm → HH:mm ] — cùng khuôn ô khoảng ngày màn Danh sách lịch hẹn (.date-range · .range-input · .range-arrow, styles/base.css + pm1-look.css).
 * Bấm vào 1 nửa ⇒ mở bảng chọn giờ ngay dưới ô (cột Giờ 00–23 · cột Phút bước 5, như ô khoảng ngày mở lịch); vẫn gõ tay được.
 * Ô không tự chuẩn hoá giá trị: màn truyền giá trị đã chuẩn hoá qua onChange(edge, value). */
import { useEffect, useRef, useState } from 'react';
import useFixedPanel from '@/lib/useFixedPanel';
import './TimeRangeInput.css';

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));
const split = (v) => (/^\d{2}:\d{2}$/.test(v || '') ? [v.slice(0, 2), v.slice(3, 5)] : ['', '']);

/**
 * Thuộc tính của TimeRangeInput (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {string} props.from - Giờ bắt đầu dạng `HH:mm` hiện ở nửa trái, sai dạng thì bảng chọn không đánh dấu ô nào.
 * @param {string} props.to - Giờ kết thúc dạng `HH:mm` hiện ở nửa phải, sai dạng thì bảng chọn không đánh dấu ô nào.
 * @param {function} props.onChange - Gọi khi gõ hoặc chọn giờ, nhận nửa đang sửa (`from` hoặc `to`) và chuỗi giá trị mới chưa chuẩn hoá.
 * @param {boolean} props.disabled - Khoá cả 2 ô nhập, thêm lớp `is-disabled` và đóng bảng chọn giờ đang mở.
 * @param {boolean} props.invalid - Bật viền lỗi bằng lớp `input-border-error` cho khung khoảng giờ.
 * @param {string} props.idPrefix - Tiền tố id, sinh id `{tiền tố}-from`, `{tiền tố}-to` và `{tiền tố}-panel`, bỏ trống thì không gán id.
 * @param {string} props.labelFrom - Nhãn đọc và title của ô giờ bắt đầu, cũng là nhãn bảng chọn khi đang chọn giờ bắt đầu.
 * @param {string} props.labelTo - Nhãn đọc và title của ô giờ kết thúc, cũng là nhãn bảng chọn khi đang chọn giờ kết thúc.
 */
export default function TimeRangeInput({ from, to, onChange, disabled, invalid, idPrefix, labelFrom, labelTo }) {
  const [open, setOpen] = useState(null);   /* 'from' | 'to' | null */
  const box = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (box.current && !box.current.contains(e.target)) setOpen(null); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(null); };
    document.addEventListener('mousedown', onDown); document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);
  useEffect(() => { if (disabled) setOpen(null); }, [disabled]);
  const field = useRef(null);
  const panel = useFixedPanel(!!open && !disabled, field, open === 'to' ? 'right' : 'left');   /* bảng chọn kiểu fixed, không bị khung cha cắt */
  /* Mở bảng ⇒ cuộn giờ, phút đang chọn vào giữa cột (không cuộn cả trang) */
  useEffect(() => {
    if (!open || !box.current) return;
    box.current.querySelectorAll('.time-panel-col').forEach((col) => {
      const cell = col.querySelector('.is-selected');
      if (cell) col.scrollTop = cell.offsetTop - col.clientHeight / 2 + cell.clientHeight / 2;
    });
  }, [open]);

  const value = open === 'from' ? from : to;
  const [hh, mm] = split(value);
  const pick = (h, m) => {
    onChange(open, h + ':' + m);
    if (open === 'from' && m !== null) setOpen('to');   /* chọn xong giờ bắt đầu ⇒ chuyển sang giờ kết thúc, như ô khoảng ngày */
  };
  const half = (edge, v, label) => (
    <input type="text" className={'range-input time-range-input' + (open === edge ? ' is-active' : '')} id={idPrefix ? idPrefix + '-' + edge : undefined} maxLength={5} placeholder="HH:mm"
      inputMode="numeric" autoComplete="off" aria-label={label} title={label} value={v} disabled={disabled}
      onFocus={() => !disabled && setOpen(edge)} onClick={() => !disabled && setOpen(edge)}
      onChange={(e) => onChange(edge, e.target.value)} />
  );
  return (
    <div className="time-range-wrap" ref={box}>
      <div ref={field} className={'date-range time-range' + (disabled ? ' is-disabled' : '') + (invalid ? ' input-border-error' : '')} data-fe="TimeRangeInput">
        {half('from', from, labelFrom)}
        <svg className="range-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        {half('to', to, labelTo)}
      </div>
      {open && !disabled ? (
        <div ref={panel} className={'time-panel time-panel-' + open} role="listbox" aria-label={open === 'from' ? labelFrom : labelTo} id={idPrefix ? idPrefix + '-panel' : undefined}>
          <div className="time-panel-col">
            <div className="time-panel-head">Giờ</div>
            {HOURS.map((h) => <button type="button" key={h} className={'time-panel-cell' + (h === hh ? ' is-selected' : '')} data-h={h}
              onMouseDown={(e) => e.preventDefault()} onClick={() => { onChange(open, h + ':' + (mm || '00')); }}>{h}</button>)}
          </div>
          <div className="time-panel-col">
            <div className="time-panel-head">Phút</div>
            {MINUTES.map((m) => <button type="button" key={m} className={'time-panel-cell' + (m === mm ? ' is-selected' : '')} data-m={m}
              onMouseDown={(e) => e.preventDefault()} onClick={() => pick(hh || '00', m)}>{m}</button>)}
          </div>
        </div>
      ) : null}
    </div>
  );
}
