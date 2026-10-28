/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* AppFilterDropdown — filter dropdown in PM1 style (.fdd): type to filter items, accent-insensitive search.
 * Same DOM as the HTML prototype; used by the appointment list and the reception desk list. */
import { useEffect, useRef, useState } from 'react';
import { AppButton } from '@/components/app/AppButton';
import { normalizeSearchText } from '@/lib/text';
import { msg } from '@/lib/msg';

const closeIcon = (width) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={width} strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>;

/**
 * Thuộc tính của AppFilterDropdown (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {string} props.id - Hậu tố id, sinh id `dd{id}` cho khối, `chu{id}` cho chữ hiển thị và `o{id}` cho ô gõ lọc.
 * @param {string} props.ariaLabel - Nhãn đọc của ô gõ lọc.
 * @param {string} props.placeholder - Chữ hiện ở ô khi chưa chọn giá trị nào.
 * @param {array} props.items - Danh sách chuỗi lựa chọn, lọc theo từ khoá gõ vào không phân biệt dấu.
 * @param {string} props.value - Mục đang chọn, được hiện trong ô và đánh dấu `is-selected` trong danh sách.
 * @param {boolean} props.open - Mở bảng lựa chọn và cho gõ lọc, đóng thì xóa từ khoá đã gõ.
 * @param {function} props.onOpen - Gọi khi bấm vào ô, nhận sự kiện click.
 * @param {function} props.onPick - Gọi khi bấm 1 mục trong danh sách, nhận chuỗi của mục đó.
 * @param {function} props.onClear - Gọi khi bấm nút Xóa lựa chọn, không nhận đối số.
 */
export function AppFilterDropdown({ id, ariaLabel, placeholder, items, value, open, onOpen, onPick, onClear }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  useEffect(() => { if (!open) setQuery(''); else setTimeout(() => inputRef.current && inputRef.current.focus(), 0); }, [open]);
  const keyword = normalizeSearchText(query.trim());
  const visible = items.filter((m) => !keyword || normalizeSearchText(m).indexOf(keyword) >= 0);
  const classNames = ['filter-select', open && 'is-open', open && keyword.length > 0 && 'has-text', value && 'has-value'].filter(Boolean).join(' ');
  return (
    <div className={classNames} id={'dd' + id}>
      <div className="filter-select-box" onClick={onOpen}>
        <span className="filter-select-text" id={'chu' + id}>{value || placeholder}</span>
        <input ref={inputRef} type="text" className="filter-select-input" id={'o' + id} aria-label={ariaLabel} autoComplete="off" readOnly={!open}
          value={open ? query : ''} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <AppButton htmlType="button" className="filter-select-clear" title="Xóa lựa chọn" onClick={(e) => { e.stopPropagation(); e.preventDefault(); onClear(); }}>{closeIcon('3')}</AppButton>
      <svg className="filter-select-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
      <div className={'filter-select-panel' + (open && visible.length === 0 ? ' is-empty' : '')}>
        <div className="filter-select-list">
          {items.map((m) => (
            <div key={m} className={'filter-select-item' + (m === value ? ' is-selected' : '')} style={open && keyword && visible.indexOf(m) < 0 ? { display: 'none' } : undefined} onClick={() => onPick(m)}>{m}</div>
          ))}
        </div>
        <div className="filter-select-empty">{msg('I001-28')}</div>   {/* I001-28 dùng chung cho lọc và tìm */}
      </div>
    </div>
  );
}
