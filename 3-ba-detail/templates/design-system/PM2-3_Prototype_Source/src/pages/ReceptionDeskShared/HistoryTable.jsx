/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Lịch sử thao tác dạng dòng hoạt động — khuôn activity feed kiểu GitHub, Jira, Linear: mới nhất trên cùng.
 * Mỗi mốc: chấm màu theo loại thao tác · Thao tác + trạng thái trước → sau · người thực hiện, vai trò · thời điểm bên phải
 * · khối «Lý do, ý kiến» và khối «Nội dung thay đổi» (mỗi trường 1 dòng: Trường | Trước → Sau), quá 2 trường thì gập kèm Xem thêm.
 * Không phân trang: hiện 10 mốc, nút Xem thêm tải thêm 10, cuộn tới cuối danh sách thì tự tải.
 * renderStatus(code) vẽ tag trạng thái của loại bản ghi sở hữu lịch sử. */
import { useEffect, useRef, useState } from 'react';
import { AppButton } from '@/components/app/AppButton';
import { HistoryAction, isDestructiveAction } from '@/lib/historyAction';
import { msg } from '@/lib/msg';
import { Svg } from '@/lib/icons';
import './HistoryTable.css';

const STEP = 10;            /* số mốc mỗi lần tải */
const ARROW = '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>';   /* mũi tên icon 16px thay ký tự → */
const Arrow = ({ label }) => <span className="change-arrow" role="img" aria-label={label}><Svg raw={ARROW} /></span>;
const FOLD = 2;             /* số trường hiện sẵn trong Nội dung thay đổi */
const toTimestamp = (s) => { const m = /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})(?::(\d{2}))?/.exec(s) || []; return +new Date(+m[3], +m[2] - 1, +m[1], +m[4], +m[5], +(m[6] || 0)) || 0; };
/* thao tác của Hệ thống · Tự động là mốc phụ ⇒ hiện rút gọn, chi tiết gập sau nút Xem chi tiết */
const isAutoRow = (r) => r.actorName === 'Hệ thống' || r.actorRole === 'Tự động';
const toneOf = (action) => (isDestructiveAction(action) ? 'is-danger' : /^(Tạo|Thêm)/i.test(String(action || '').trim()) ? 'is-create' : 'is-update');

function ChangeList({ changes: all }) {
  const [open, setOpen] = useState(false);
  /* giá trị cũ trùng giá trị mới thì không phải thay đổi ⇒ không hiện */
  const changes = all.filter((c) => String(c[1] ?? '').trim() !== String(c[2] ?? '').trim());
  if (!changes.length) return null;
  const shown = open ? changes : changes.slice(0, FOLD);
  const hidden = changes.length - FOLD;
  return (
    <div className="tl-section">
      <div className="tl-section-title">Nội dung thay đổi</div>
      <dl className="tl-changes">
        {shown.map((change, idx) => (
          <div className="tl-change" key={idx}>
            <dt className="tl-field">{change[0]}</dt>
            <dd className="tl-value">
              {change[1] && change[1] !== '—' ? <span className="change-old">{change[1]}</span> : <span className="change-empty">Trống</span>}<Arrow label="đổi thành" />   {/* trước đó trống ⇒ «Trống → giá trị mới» */}
              <span className="change-new">{change[2] || '—'}</span>
            </dd>
          </div>))}
      </dl>
      {hidden > 0 && <AppButton className="tl-more" aria-expanded={String(open)} onClick={() => setOpen((x) => !x)}>{open ? 'Thu gọn' : 'Xem thêm ' + hidden + ' thay đổi'}</AppButton>}
    </div>
  );
}

/* entity: đối tượng của câu rỗng I001-27 */
export default function HistoryTable({ history, renderStatus, entity = 'lịch sử thao tác' }) {
  const [count, setCount] = useState(STEP);
  const [openAuto, setOpenAuto] = useState(() => new Set());   /* mốc tự động đang mở chi tiết */
  const toggleAuto = (key) => setOpenAuto((s) => { const n = new Set(s); if (n.has(key)) n.delete(key); else n.add(key); return n; });
  const sentinel = useRef(null);
  const sorted = history.map((row, i) => ({ row, i })).sort((a, b) => toTimestamp(b.row.at) - toTimestamp(a.row.at) || b.i - a.i).map((x) => x.row);
  const rows = sorted.slice(0, count);
  const more = sorted.length - rows.length;
  /* cuộn tới mốc cuối ⇒ tự tải thêm 10 (khung .shell là vùng cuộn) */
  useEffect(() => {
    const el = sentinel.current;
    if (!el || more <= 0 || typeof IntersectionObserver !== 'function') return undefined;
    const io = new IntersectionObserver((entries) => { if (entries.some((e) => e.isIntersecting)) setCount((c) => c + STEP); }, { root: el.closest('.shell'), rootMargin: '0px 0px 120px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [more, count]);
  return (
    <div className="tl-wrap">
      <ol className="timeline" id="bangLichSu" aria-label="Lịch sử thao tác">
        {!rows.length && <li className="tl-empty">{msg('I001-27', entity)}</li>}
        {rows.map((r, idx) => {
          /* trạng thái trước trùng trạng thái sau ⇒ chỉ hiện 1 tag, không vẽ mũi tên */
          const before = r.statusBefore && r.statusBefore !== r.statusAfter ? renderStatus(r.statusBefore) : null;
          const after = r.statusAfter ? renderStatus(r.statusAfter) : null;
          const key = r.at + r.action + idx, auto = isAutoRow(r), opened = openAuto.has(key);
          const hasDetail = !!(r.reason || r.note || (r.changes && r.changes.some((c) => String(c[1] ?? '').trim() !== String(c[2] ?? '').trim())));
          return (
            <li className={'tl-item ' + toneOf(r.action) + (auto ? ' is-auto' : '')} key={key}>
              <span className="tl-rail" aria-hidden="true" />
              <span className="tl-dot" aria-hidden="true" />
              <div className="tl-body">
                <div className="tl-head">
                  <span className="tl-action"><HistoryAction text={r.action} /></span>
                  {auto && <span className="tl-auto">{[r.actorName, r.actorRole].filter(Boolean).join(' · ')}</span>}
                  {(before || after) && <span className="tl-status">{before}{before && after ? <Arrow label="chuyển sang" /> : null}{after}</span>}
                  <time className="tl-time">{r.at}</time>
                </div>
                {!auto && <div className="tl-meta"><span className="person-title">{r.actorName}</span>{r.actorRole ? <span className="person-role">{r.actorRole}</span> : null}</div>}
                {auto && hasDetail && <AppButton className="tl-more" aria-expanded={String(opened)} onClick={() => toggleAuto(key)}>{opened ? 'Thu gọn' : 'Xem chi tiết'}</AppButton>}
                {hasDetail && (!auto || opened) ? (
                  <div className="tl-card">
                    {r.reason ? <div className="tl-section"><div className="tl-section-title">Lý do, ý kiến</div><p className="tl-reason">{r.reason}</p></div> : null}
                    {r.changes && r.changes.length ? <ChangeList changes={r.changes} /> : null}
                    {r.note ? <div className="tl-section tl-note"><div className="tl-section-title">Ghi chú hệ thống</div><p className="tl-reason">{r.note}</p></div> : null}   {/* */}
                  </div>) : null}
              </div>
            </li>
          );
        })}
      </ol>
      {more > 0 && <div className="tl-loadmore" ref={sentinel}>
        <AppButton className="btn" id="lsXemThem" onClick={() => setCount((c) => c + STEP)}>{'Xem thêm ' + Math.min(STEP, more) + ' thao tác'}</AppButton>
        <span className="tl-count">{'Đang hiện ' + rows.length + '/' + sorted.length}</span>
      </div>}
    </div>
  );
}
