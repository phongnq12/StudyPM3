/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Table calendar — ONE shared look for the 3 places that show tables over time:
 * tab "Lịch theo buồng" of the list (ListCalendar.jsx) · time and table picker of Create / Edit and Counter registration (TablePicker.jsx).
 * Only the screen-specific logic differs and comes in through props; the drawing, dragging and zoom live here.
 * rows = tables, time runs horizontally over WORKING HOURS only, lunch is a narrow hatched band,
 * morning / afternoon title bars, ruler with 5-minute marks and 15-minute labels,
 * zoom − / +, blocks shorten their content when narrow, the hover hint (data-nhac) shows the full detail,
 * drag by the ⠿ grip (6px threshold, Esc cancels), drag the right edge to change the duration,
 * while dragging or hovering a free spot the ruler marks the exact start ~ end. */
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { hideHint } from '@/lib/legacyUi';
import { RichText } from '@/lib/richText';
import { TIMELINE_STEP_MINUTES, minutesToClock, workingAxis } from '@/lib/tableTimeline';
import './TableCalendar.css';

const ZOOM_LEVELS = [{ px: 4, label: 'Thu nhỏ' }, { px: 8, label: 'Vừa' }, { px: 12, label: 'Phóng to' }];
const ZOOM_DEFAULT = 1;
const ZOOM_STORAGE_KEY = 'pm2_table_calendar_zoom';
const DRAG_THRESHOLD_PX = 6;
const NAME_COLUMN_PX = 140;
const snap = (m) => Math.round(m / TIMELINE_STEP_MINUTES) * TIMELINE_STEP_MINUTES;
const TICK_LABEL_PX = 38;   /* bề rộng 1 nhãn giờ «HH:MM» kèm lề */
const LABEL_COLUMN_PX = 140, AUTO_SCROLL_EDGE_PX = 56, AUTO_SCROLL_MAX_STEP = 18;   /* cột tên buồng · vùng sát mép kích tự cuộn · px mỗi khung hình */
/* kéo khối vào trọn 1 ca: ca chứa giờ bắt đầu, rơi vào nghỉ trưa thì ca gần hơn — kéo qua lại sáng/chiều không bị báo «Ngoài giờ» */
const fitIntoShift = (parts, start, duration) => {
  const work = parts.filter((p) => !p.isBreak); if (!work.length) return start;
  const p = work.find((q) => start >= q.from && start < q.to) || work.reduce((best, q) => (Math.min(Math.abs(start - q.from), Math.abs(start - q.to)) < Math.min(Math.abs(start - best.from), Math.abs(start - best.to)) ? q : best));
  return Math.max(p.from, Math.min(p.to - duration, start));
};
const range = (start, duration) => minutesToClock(start) + ' ~ ' + minutesToClock(start + duration);
const readZoom = () => { try { const raw = localStorage.getItem(ZOOM_STORAGE_KEY); const v = raw == null ? NaN : +raw; return v >= 0 && v < ZOOM_LEVELS.length ? v : ZOOM_DEFAULT; } catch (e) { return ZOOM_DEFAULT; } };
const saveZoom = (v) => { try { localStorage.setItem(ZOOM_STORAGE_KEY, String(v)); } catch (e) { /* zoom only for this visit */ } };

const NO_DRAG_ICON = <svg className="table-calendar-no-drag" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-label="Không dời được"><circle cx="12" cy="12" r="9" /><path d="M5.6 5.6l12.8 12.8" /></svg>;

/* closed parts of 1 row = working time of the axis that its own room does not open */
function closedIntervals(row, workParts) {
  const out = [];
  workParts.forEach((p) => {
    let cursor = p.from;
    row.shifts.slice().sort((a, b) => a.open - b.open).forEach((s) => { const a = Math.max(s.open, p.from), b = Math.min(s.close, p.to); if (a < b) { if (a > cursor) out.push([cursor, a]); cursor = Math.max(cursor, b); } });
    if (cursor < p.to) out.push([cursor, p.to]);
  });
  return out;
}

/* block content by width: full (3 lines) · name + time · time only · nothing (the hover hint still has everything) */
function BlockBody({ item, width, onGripDown, onResizeDown }) {
  const c = item.content || {};
  const level = width >= 150 ? 3 : width >= 84 ? 2 : width >= 44 ? 1 : 0;
  const time = range(item.start, item.duration);
  return <>
    {item.movable && width >= 36 ? <button type="button" className="table-calendar-grip" title="Kéo để dời giờ hoặc đổi buồng" aria-label={'Kéo để dời ' + (c.title || '')} onPointerDown={onGripDown}>⠿</button> : null}
    {!level && item.variant !== 'record' && width >= 26 ? <span className="table-calendar-text is-tiny">{c.title}</span> : null}
    {level ? <span className="table-calendar-text">
      {level >= 2 ? <b>{item.movable || item.variant !== 'record' ? null : NO_DRAG_ICON}<span className="table-calendar-name">{c.title}</span></b> : null}
      {level === 1 && item.variant !== 'record' ? <><b className="table-calendar-time-start">{c.title}</b><span className="table-calendar-line">{minutesToClock(item.start) + '~' + minutesToClock(item.start + item.duration)}</span></>
        : level === 1 ? <><b className="table-calendar-time-start">{minutesToClock(item.start)}</b><span className="table-calendar-line">{'~ ' + minutesToClock(item.start + item.duration)}</span></>
        : <span className="table-calendar-line">{level >= 2 && c.line ? time + ' - ' + c.line : time}</span>}
      {level >= 3 && c.status ? <span className={'tag tag-dot ' + (c.statusClass || '')}>{c.status}</span> : null}
    </span> : null}
    {item.resizable ? <span className="table-calendar-resize" title="Kéo để đổi thời lượng" onPointerDown={onResizeDown} /> : null}
  </>;
}

/**
 * Thuộc tính của TableCalendar (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {array} props.rows - Danh sách buồng, mỗi dòng `{ code, label, shifts, group, unassigned }`, giờ mở cửa các dòng dựng nên trục giờ làm việc.
 * @param {array} props.items - Danh sách khối lịch, mỗi khối có `key`, `tableCode`, `start`, `duration`, `variant`, `movable`, `resizable` và `content` để vẽ lên dòng buồng.
 * @param {number} props.now - Phút hiện tại trong ngày, nằm trong trục thì vẽ vạch giờ hiện tại và nhãn giờ trên thước.
 * @param {number} props.pastUntil - Phút trong ngày mà phần trục trước đó được phủ lớp đã qua giờ hiện tại.
 * @param {number} props.minDuration - Thời lượng nhỏ nhất (phút) khi kéo mép phải để đổi thời lượng khối.
 * @param {number} props.maxDuration - Thời lượng lớn nhất (phút) khi kéo mép phải để đổi thời lượng khối.
 * @param {string} props.cornerLabel - Chữ ở ô góc trên trái, đứng đầu cột tên buồng.
 * @param {function} props.validate - Gọi khi đang kéo, nhận khối, mã buồng, phút bắt đầu, thời lượng và kiểu kéo, trả về lý do không hợp lệ hoặc chuỗi rỗng.
 * @param {function} props.onMove - Gọi khi thả khối ở chỗ hợp lệ khác chỗ cũ, nhận khối, `{ tableCode, start, duration }` mới và kiểu kéo `move` hoặc `resize`.
 * @param {function} props.onInvalidDrop - Gọi khi thả ra ngoài lịch, thả chỗ không hợp lệ hoặc bấm Esc, nhận lý do và kiểu kéo (`cancel` khi bấm Esc).
 * @param {function} props.onEmptyClick - Gọi khi bấm vào chỗ trống trên dòng buồng, nhận mã buồng, phút tại điểm bấm và `closed` nếu bấm vào vùng nghỉ trưa hoặc ngoài giờ.
 * @param {function} props.ghostAt - Gọi khi rê chuột trên chỗ trống, nhận mã buồng và phút, trả về `{ tableCode, start, duration, reason }` để vẽ khối gợi ý hoặc `null` để ẩn.
 * @param {ReactNode} props.legend - Nội dung chú giải hiện ở thanh công cụ, bên trái nút thu phóng.
 * @param {string} props.notice - Câu thông báo hiện trên lưới lịch, hỗ trợ chữ in đậm, rỗng thì không hiện.
 * @param {number} props.initialScrollMinute - Phút cần cuộn tới khi mở lịch, đổi `scrollKey` hoặc đổi mức thu phóng, bỏ trống thì cuộn về đầu trục.
 * @param {string} props.scrollKey - Khoá cuộn, đổi giá trị thì lịch cuộn lại tới `initialScrollMinute`.
 * @param {number | string} props.maxHeight - Chiều cao tối đa của vùng cuộn lịch, bỏ trống thì không giới hạn.
 */
export default function TableCalendar({
  rows, items, now = null, pastUntil = null, minDuration = 10, maxDuration = 45, cornerLabel = 'Buồng thăm gặp',
  validate, onMove, onInvalidDrop, onEmptyClick, ghostAt, legend = null, notice = '', initialScrollMinute = null, scrollKey = '', maxHeight,
}) {
  const [zoom, setZoom] = useState(readZoom);
  const px = ZOOM_LEVELS[zoom].px;
  const axis = workingAxis(rows.flatMap((r) => r.shifts), px);
  const workParts = axis.parts.filter((p) => !p.isBreak), breakParts = axis.parts.filter((p) => p.isBreak);
  const x = axis.x;
  const scrollRef = useRef(null), dragRef = useRef(null);
  const [preview, setPreview] = useState(null);   /* { key, tableCode, start, duration, reason } while dragging */
  const [ghost, setGhost] = useState(null);       /* { tableCode, start, duration, reason } while hovering a free spot */
  /* phần trục đang nhìn thấy (toạ độ làn) — nhãn giờ bị cột tên buồng hoặc mép khung che 1 phần thì ẩn hẳn, không hiện nửa chữ */
  const [view, setView] = useState({ left: 0, right: Infinity });
  const viewRaf = useRef(0);
  const readView = () => { const el = scrollRef.current; if (el) setView({ left: el.scrollLeft, right: el.scrollLeft + el.clientWidth - LABEL_COLUMN_PX }); };
  const onScrollView = () => { if (viewRaf.current) return; viewRaf.current = requestAnimationFrame(() => { viewRaf.current = 0; readView(); }); };
  useEffect(() => { window.addEventListener('resize', onScrollView); return () => { window.removeEventListener('resize', onScrollView); if (viewRaf.current) cancelAnimationFrame(viewRaf.current); }; }, []);

  /* open / new day / zoom: bring the wanted time into view */
  useLayoutEffect(() => {
    const el = scrollRef.current; if (!el) return;
    const target = initialScrollMinute != null ? Math.max(axis.from, Math.min(axis.to, initialScrollMinute)) : axis.from;
    el.scrollLeft = Math.max(0, x(target) - 120);
    readView();
  }, [scrollKey, zoom]);

  const live = useRef({}); live.current = { validate, onMove, onInvalidDrop, items, axis, px };
  const stopDrag = () => {
    const drag = dragRef.current;
    if (drag) { window.removeEventListener('pointermove', drag.onMove); window.removeEventListener('pointerup', drag.onUp); if (drag.raf) cancelAnimationFrame(drag.raf); }
    document.body.classList.remove('is-table-calendar-dragging');
    dragRef.current = null; setPreview(null);
  };
  /* sát mép khung khi đang kéo ⇒ tự cuộn, mỗi khung hình tính lại chỗ thả theo vị trí chuột cuối */
  const autoScroll = () => {
    const drag = dragRef.current, el = scrollRef.current; if (!drag || !drag.live || !el || !drag.lastEvent) { if (drag) drag.raf = 0; return; }
    const r = el.getBoundingClientRect(), cx = drag.lastEvent.clientX, left = r.left + LABEL_COLUMN_PX;
    const step = cx > r.right - AUTO_SCROLL_EDGE_PX ? Math.min(AUTO_SCROLL_MAX_STEP, (cx - (r.right - AUTO_SCROLL_EDGE_PX)) / 2 + 4)
      : cx < left + AUTO_SCROLL_EDGE_PX ? -Math.min(AUTO_SCROLL_MAX_STEP, ((left + AUTO_SCROLL_EDGE_PX) - cx) / 2 + 4) : 0;
    if (step && drag.kind !== 'resize') { const before = el.scrollLeft; el.scrollLeft += step; if (el.scrollLeft !== before) moveDrag(drag.lastEvent, true); }
    drag.raf = requestAnimationFrame(autoScroll);
  };
  const moveDrag = (e, fromScroll) => {
    const drag = dragRef.current; if (!drag) return;
    if (!fromScroll) drag.lastEvent = { clientX: e.clientX, clientY: e.clientY };
    if (!drag.live) { if (Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) < DRAG_THRESHOLD_PX) return; drag.live = true; document.body.classList.add('is-table-calendar-dragging'); setGhost(null); if (!drag.raf) drag.raf = requestAnimationFrame(autoScroll); }
    hideHint();
    const L = live.current, it = drag.item;
    let target;
    if (drag.kind === 'resize') {
      const duration = Math.min(maxDuration, Math.max(minDuration, snap(it.duration + (e.clientX - drag.x0) / L.px)));
      target = { tableCode: it.tableCode, start: it.start, duration };
    } else {
      const lane = document.elementsFromPoint(e.clientX, e.clientY).map((n) => n.closest && n.closest('.table-calendar-lane')).find(Boolean);
      if (!lane) { drag.target = null; setPreview({ key: it.key, outside: true }); return; }
      const start = fitIntoShift(L.axis.parts, snap(L.axis.minuteAt(e.clientX - lane.getBoundingClientRect().left - drag.offsetPx)), it.duration);
      target = { tableCode: lane.dataset.table, start, duration: it.duration };
    }
    target.reason = L.validate ? L.validate(it, target.tableCode, target.start, target.duration, drag.kind) : '';
    drag.target = target;
    setPreview({ key: it.key, ...target });
  };
  const endDrag = () => {
    const drag = dragRef.current; stopDrag();
    if (!drag || !drag.live) return;
    const t = drag.target, it = drag.item, L = live.current;
    if (!t) { if (L.onInvalidDrop) L.onInvalidDrop('thả ngoài lịch theo buồng', drag.kind); return; }
    if (t.tableCode === (it.tableCode || '') && t.start === it.start && t.duration === it.duration) return;   /* back to the same place */
    if (t.reason) { if (L.onInvalidDrop) L.onInvalidDrop(t.reason, drag.kind); return; }
    if (L.onMove) L.onMove(it, { tableCode: t.tableCode, start: t.start, duration: t.duration }, drag.kind);
  };
  const startDrag = (e, item, kind) => {
    if (e.button !== 0 || dragRef.current) return;
    e.preventDefault(); e.stopPropagation();
    const blockRect = e.currentTarget.closest('.table-calendar-block').getBoundingClientRect();
    const drag = { kind, item, x0: e.clientX, y0: e.clientY, live: false, target: null, offsetPx: e.clientX - blockRect.left, raf: 0, lastEvent: null, onMove: (ev) => moveDrag(ev), onUp: endDrag };
    dragRef.current = drag;
    window.addEventListener('pointermove', drag.onMove); window.addEventListener('pointerup', drag.onUp);
  };
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape' && dragRef.current) { const wasLive = dragRef.current.live; stopDrag(); if (wasLive && live.current.onInvalidDrop) live.current.onInvalidDrop('', 'cancel'); } };
    document.addEventListener('keydown', h); return () => { document.removeEventListener('keydown', h); if (dragRef.current) stopDrag(); };
  }, []);

  /* hover a free spot (screens that create): show where a click would put the block */
  const minuteOfEvent = (e, lane) => axis.minuteAt(e.clientX - lane.getBoundingClientRect().left);
  const onLaneMove = (e) => {
    if (!ghostAt || dragRef.current) return;
    const lane = e.currentTarget;
    if (e.target.closest('.table-calendar-block, .table-calendar-break, .table-calendar-closed')) { if (ghost) setGhost(null); return; }
    const g = ghostAt(lane.dataset.table, minuteOfEvent(e, lane));
    if (!g) { if (ghost) setGhost(null); return; }
    if (!ghost || ghost.tableCode !== g.tableCode || ghost.start !== g.start || ghost.duration !== g.duration || ghost.reason !== g.reason) setGhost(g);
  };
  const onLaneClick = (e) => {
    if (!onEmptyClick || e.target.closest('.table-calendar-block')) return;
    const lane = e.currentTarget;
    onEmptyClick(lane.dataset.table, minuteOfEvent(e, lane), e.target.closest('.table-calendar-break, .table-calendar-closed') ? 'closed' : '');
    setGhost(null);
  };

  /* ruler */
  const marks = [], labels = [], vlines = [];
  workParts.forEach((p, i) => {
    for (let m = p.from; m <= p.to; m += TIMELINE_STEP_MINUTES) {
      const isLast = i === workParts.length - 1 && m === p.to, isFirst = i === 0 && m === p.from;
      if (m === p.to && !isLast) continue;
      const kind = m % 60 === 0 ? 'is-hour' : m % 30 === 0 ? 'is-half' : m % 15 === 0 ? 'is-quarter' : 'is-five';
      marks.push(<i key={'m' + m} className={'table-calendar-mark ' + kind} style={{ left: x(m) + 'px' }} />);
      const lx = x(m), box = isLast ? [lx - TICK_LABEL_PX, lx] : isFirst ? [lx, lx + TICK_LABEL_PX] : [lx - TICK_LABEL_PX / 2, lx + TICK_LABEL_PX / 2];
      const cut = box[0] < view.left - 0.5 || box[1] > view.right + 0.5;
      if (!cut && kind !== 'is-five' && (kind !== 'is-quarter' || px >= 8)) labels.push(<span key={'l' + m} className={'table-calendar-tick ' + kind + (isLast ? ' is-end' : isFirst ? ' is-start' : '')} style={{ left: x(m) + 'px' }}>{minutesToClock(m)}</span>);
      if (kind !== 'is-five' || px >= 8) vlines.push(m);
    }
  });
  const rulerMark = preview && !preview.outside ? preview : ghost;
  const showNow = now != null && now >= axis.from && now <= axis.to;
  const pastEnd = pastUntil == null ? null : Math.min(Math.max(pastUntil, axis.from), axis.to);
  const draggedItem = preview ? items.find((it) => it.key === preview.key) : null;

  return (
    <div className="table-calendar">
      <div className="table-calendar-toolbar">
        <div className="table-calendar-legend">{legend}</div>
        <div className="table-calendar-zoom" role="group" aria-label="Thu phóng lịch">
          <button type="button" className="table-calendar-zoom-btn" disabled={zoom === 0} title="Thu nhỏ để xem cả ngày" aria-label="Thu nhỏ" onClick={() => { const v = zoom - 1; setZoom(v); saveZoom(v); }}>−</button>
          <span className="table-calendar-zoom-label">{ZOOM_LEVELS[zoom].label}</span>
          <button type="button" className="table-calendar-zoom-btn" disabled={zoom === ZOOM_LEVELS.length - 1} title="Phóng to để chỉnh từng 5 phút" aria-label="Phóng to" onClick={() => { const v = zoom + 1; setZoom(v); saveZoom(v); }}>+</button>
        </div>
      </div>
      {notice ? <div className="table-calendar-notice" role="status"><RichText text={notice} /></div> : null}      <div className="table-calendar-scroll" ref={scrollRef} onScroll={onScrollView} style={maxHeight ? { maxHeight } : undefined}>
        <div className="table-calendar-inner" style={{ width: axis.width + 'px' }}>
          <div className="table-calendar-head">
            <div className="table-calendar-corner">{cornerLabel}</div>
            <div className="table-calendar-ruler" style={{ width: axis.width + 'px' }}>
              {axis.parts.map((p) => (p.isBreak
                ? <span key={'b' + p.from} className="table-calendar-shift-break" style={{ left: p.left + 'px', width: p.width + 'px' }} title={'Nghỉ trưa ' + range(p.from, p.to - p.from)} />
                : <span key={'s' + p.from} className={'table-calendar-shift is-shift-' + (p.index % 2 ? 'afternoon' : 'morning')} style={{ left: p.left + 'px', width: p.width + 'px' }}>
                  <span className="table-calendar-shift-label">{(p.name || 'Khung giờ') + ' · ' + range(p.from, p.to - p.from)}</span></span>))}
              {marks}{labels}
              {rulerMark ? <span className={'table-calendar-ruler-mark' + (rulerMark.reason ? ' is-invalid' : '')} style={{ left: x(rulerMark.start) + 'px', width: Math.max(2, x(rulerMark.start + rulerMark.duration) - x(rulerMark.start)) + 'px' }}>
                <span className="table-calendar-ruler-time">{range(rulerMark.start, rulerMark.duration)}</span></span> : null}
              {showNow ? <span className="table-calendar-now-tag" style={{ left: x(now) + 'px' }}>{minutesToClock(now)}</span> : null}
            </div>
          </div>
          {rows.map((row, rowIndex) => {
            const rowItems = items.filter((it) => (it.tableCode || '') === row.code);
            /* row.group: tên nhóm (quầy) — dòng tiêu đề nhóm hiện trước buồng đầu tiên của nhóm */
            const groupHead = row.group && (rowIndex === 0 || rows[rowIndex - 1].group !== row.group)
              ? <div className="table-calendar-group"><span className="table-calendar-group-name">{row.group}</span></div> : null;
            return (
              <Fragment key={row.code || 'unassigned'}>{groupHead}
              <div className={'table-calendar-row' + (row.unassigned ? ' is-unassigned' : '')}>
                <div className="table-calendar-table-name">{row.label || row.code}</div>
                <div className="table-calendar-lane" data-table={row.code} style={{ width: axis.width + 'px' }} onPointerMove={onLaneMove} onPointerLeave={() => ghost && setGhost(null)} onClick={onLaneClick}>
                  {vlines.map((m) => <i key={m} className={'table-calendar-vline' + (m % 30 === 0 ? '' : m % 15 === 0 ? ' is-quarter' : ' is-five')} style={{ left: x(m) + 'px' }} />)}
                  {breakParts.map((p) => <div key={'break-' + p.from} className="table-calendar-break" style={{ left: p.left + 'px', width: p.width + 'px' }} title={'Nghỉ trưa ' + range(p.from, p.to - p.from)} />)}
                  {row.unassigned ? null : closedIntervals(row, workParts).map(([a, b]) => <div key={a} className="table-calendar-closed" style={{ left: x(a) + 'px', width: (x(b) - x(a)) + 'px' }} title="Ngoài giờ thăm gặp">Ngoài giờ</div>)}
                  {pastEnd != null && pastEnd > axis.from ? <div className="table-calendar-past" style={{ left: 0, width: x(pastEnd) + 'px' }} title="Đã qua giờ hiện tại" /> : null}
                  {showNow ? <div className="table-calendar-now" style={{ left: x(now) + 'px' }} /> : null}
                  {rowItems.map((it) => {
                    const width = Math.max(4, x(it.start + it.duration) - x(it.start) - 2);
                    const isSource = preview && preview.key === it.key;
                    return <div key={it.key} className={'table-calendar-block is-' + it.variant + (it.blockClass ? ' ' + it.blockClass : '') + (it.movable ? '' : ' is-locked') + (isSource ? ' is-drag-source' : '')}
                      data-code={it.code || undefined} data-nhac={it.hint || undefined} style={{ left: x(it.start) + 'px', width: width + 'px' }}>
                      <BlockBody item={it} width={width} onGripDown={(e) => startDrag(e, it, 'move')} onResizeDown={(e) => startDrag(e, it, 'resize')} />
                    </div>;
                  })}
                  {ghost && !preview && ghost.tableCode === row.code ? (
                    <div className={'table-calendar-block table-calendar-ghost' + (ghost.reason ? ' is-invalid' : '')}
                      style={{ left: x(ghost.start) + 'px', width: Math.max(4, x(ghost.start + ghost.duration) - x(ghost.start) - 2) + 'px' }}>
                      <span className="table-calendar-text"><span className="table-calendar-line"><RichText text={ghost.reason || 'Bấm để đặt ' + range(ghost.start, ghost.duration)} /></span></span>
                    </div>) : null}
                  {draggedItem && preview.tableCode === row.code && !preview.outside ? (
                    <div className={'table-calendar-block table-calendar-preview is-' + draggedItem.variant + (draggedItem.blockClass ? ' ' + draggedItem.blockClass : '') + (preview.reason ? ' is-invalid' : '')}
                      style={{ left: x(preview.start) + 'px', width: Math.max(4, x(preview.start + preview.duration) - x(preview.start) - 2) + 'px' }}>
                      <span className="table-calendar-text">
                        <b><span className="table-calendar-name">{range(preview.start, preview.duration)}</span></b>
                        <span className="table-calendar-reason"><RichText text={preview.reason || preview.duration + ' phút · thả để lưu'} /></span>
                      </span>
                    </div>) : null}
                </div>
              </div></Fragment>);
          })}
        </div>
      </div>
    </div>
  );
}

export { NAME_COLUMN_PX };
