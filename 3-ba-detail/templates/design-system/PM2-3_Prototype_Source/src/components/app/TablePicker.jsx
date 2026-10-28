/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Time and table picker for Create / Edit appointment and Counter registration — the SPECIFIC logic on top of the shared TableCalendar look.
 * other appointments = grey "Đã có lịch" blocks with their time only (no detail of other people),
 * 1 block being created: click a free spot to place it, drag ⠿ to move it, drag the right edge to change the duration,
 * hovering a free spot previews where the click puts the block, with its start ~ end on the ruler.
 * mountTablePicker keeps the API of the old picker so the React form and the DOM-driven counter page plug it in the same way. */
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import TableCalendar from './TableCalendar';
import { RESERVED_LABEL, fitDuration, fitReason, nearestFit, minutesToClock } from '@/lib/tableTimeline';
import { msg } from '@/lib/msg';   /* message theo mã */

const HELP = (min, max) => (
  <div className="timeline-help" role="note"><span className="timeline-help-icon" aria-hidden="true">i</span><div>
    <div className="timeline-help-title">Cách chọn giờ và buồng thăm gặp</div>
    {/* mỗi dòng mở đầu bằng icon đúng thao tác, thay cho số 1, 2, 3 */}
    <ul className="timeline-help-steps is-icons">
      <li><span className="timeline-help-act" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 9l10 4-4 2-2 4z" /><path d="M5 3v2M3 5h2M9.5 3.5 8 5M3.5 9.5 5 8" /></svg></span>
        <span><b>Bấm vào chỗ trống</b> trên hàng của buồng để đặt lịch (rê chuột để xem trước giờ). Đã đặt rồi thì chỉ kéo lịch đó để sửa</span></li>
      <li><span className="timeline-help-act is-grip" aria-hidden="true">⠿</span>
        <span><b>Kéo tay nắm</b> để dời giờ hoặc đổi sang buồng khác</span></li>
      <li><span className="timeline-help-act" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v16" /><path d="M3 12h6M6 9l-3 3 3 3M15 12h6M18 9l3 3-3 3" /></svg></span>
        <span><b>Kéo mép phải khối</b> để đổi thời lượng, từ {min} đến {max} phút</span></li>
    </ul></div></div>
);
/* draftLabel: chữ của lịch đang chọn — mặc định «Lịch đang tạo»; popup Đổi lịch truyền «Lịch đang đổi» */
const DRAFT_LABEL = 'Lịch đang tạo';
const legendOf = (draftLabel, hasReserved) => <>
  <span><i className="table-calendar-swatch is-busy" /> Đã có lịch</span>
  {hasReserved ? <span><i className="table-calendar-swatch is-reserved" /> {RESERVED_LABEL}</span> : null}
  <span><i className="table-calendar-swatch is-draft" /> {draftLabel}</span>
  <span><i className="table-calendar-swatch is-break" /> Nghỉ trưa</span>
</>;

function TablePicker({ config, value, notice, onPlace, onNotice }) {
  /* buồng nhóm theo quầy: t.group = quầy của buồng (lưới có nhiều quầy), không có thì config.groupLabel */
  const rows = config.tables.map((t) => ({ code: t.code, label: t.name ? t.code + ' — ' + t.name : t.code, shifts: config.shifts, group: t.group || config.groupLabel || '' }));
  const draftLabel = config.draftLabel || DRAFT_LABEL;
  const items = [];
  config.tables.forEach((t) => t.busy.forEach(([a, b, kind], i) => {
    const title = kind === 'reserved' ? RESERVED_LABEL : 'Đã có lịch';
    items.push({
      key: 'busy-' + t.code + '-' + i, tableCode: t.code, start: a, duration: b - a, variant: 'busy', blockClass: kind === 'reserved' ? 'is-reserved' : '', movable: false, resizable: false,
      content: { title, line: '' }, hint: title + (config.dayText ? ' ' + config.dayText : '') + ' · ' + minutesToClock(a) + ' ~ ' + minutesToClock(b),
    });
  }));
  if (value) items.push({
    key: 'draft', tableCode: value.tableCode, start: value.start, duration: value.end - value.start, variant: 'draft', movable: true, resizable: true,
    content: { title: draftLabel, line: (value.end - value.start) + ' phút' }, hint: draftLabel + (config.dayText ? ' ' + config.dayText : '') + ' · ' + minutesToClock(value.start) + ' ~ ' + minutesToClock(value.end),
  });
  const reasonFor = (tableCode, start, duration) => fitReason(config, tableCode, start, start + duration);
  const ghostAt = (tableCode, minute) => {
    const clicked = Math.floor(minute / 5) * 5;
    const start = nearestFit(config, tableCode, clicked, config.duration);
    return start == null ? { tableCode, start: clicked, duration: config.duration, reason: reasonFor(tableCode, clicked, fitDuration(config, clicked, config.duration)) || 'Không đủ ' + config.duration + ' phút trống' }
      : { tableCode, start, duration: fitDuration(config, start, config.duration), reason: '' };
  };
  /* kéo khối: cuối ca rút thời lượng về phần còn lại · giãn khối: giữ nguyên độ dài người dùng kéo */
  const vuaCa = (start, duration, kind) => (kind === 'resize' ? duration : fitDuration(config, start, duration));
  return (
    <>
      {HELP(config.minDuration, config.maxDuration)}
      <TableCalendar rows={rows} items={items} now={config.now} pastUntil={config.minStart} minDuration={config.minDuration} maxDuration={config.maxDuration}
        legend={legendOf(draftLabel, items.some((it) => it.blockClass === 'is-reserved'))} notice={notice} maxHeight="460px" scrollKey={config.scrollKey || ''}
        initialScrollMinute={value ? value.start : config.now != null ? config.now : null}
        validate={(item, tableCode, start, duration, kind) => reasonFor(tableCode, start, vuaCa(start, duration, kind))}
        onMove={(item, t, kind) => { const d = vuaCa(t.start, t.duration, kind); onPlace({ start: t.start, end: t.start + d, tableCode: t.tableCode, duration: d }); }}
        onInvalidDrop={(reason, kind) => onNotice(kind === 'cancel' ? msg('I001-72') : msg(kind === 'resize' ? 'E001-22' : 'E001-21', reason + '. Lịch được giữ ở vị trí cũ'))}
        onEmptyClick={value ? undefined : (tableCode, minute, where) => {
          if (where === 'closed') { onNotice(msg('E001-37')); return; }
          const g = ghostAt(tableCode, minute);
          if (g.reason) { onNotice(msg('E001-38', g.reason)); return; }
          onPlace({ start: g.start, end: g.start + g.duration, tableCode, duration: g.duration });
        }}
        ghostAt={value ? undefined : ghostAt} />
    </>
  );
}

/* mount into a plain DOM element: { update(config), setValue(value), destroy } — same contract as the old mountTableTimeline */
export function mountTablePicker(host, initialConfig, { onChange } = {}) {
  let config = initialConfig, value = initialConfig.value || null, notice = '';
  const root = createRoot(host);
  const render = () => flushSync(() => root.render(<TablePicker config={config} value={value} notice={notice}
    onPlace={(v) => {
      value = { start: v.start, end: v.end, tableCode: v.tableCode }; notice = ''; render();
      /* kèm quầy của buồng vừa chọn ⇒ nơi gọi đổi Quầy tiếp đón khi buồng thuộc quầy khác */
      const table = config.tables.find((t) => t.code === v.tableCode);
      if (onChange) onChange({ ...value, duration: v.duration, counterCode: table ? table.counterCode || '' : '' });
    }}
    onNotice={(text) => { notice = text; render(); }} />));
  /* render after the caller's own React commit (the form mounts this inside a layout effect) */
  queueMicrotask(render);
  return {
    update(next) {
      const hasValue = Object.prototype.hasOwnProperty.call(next, 'value');
      config = { ...config, ...next, scrollKey: (config.scrollKey || 0) + 1 };   /* new counter / day / duration: scroll again to the block or now */
      if (hasValue) value = next.value || null;
      else if (value) {
        const end = value.start + fitDuration(config, value.start, config.duration);
        if (!fitReason(config, value.tableCode, value.start, end)) value = { ...value, end };
        else { value = null; notice = msg('E001-36', config.duration);   /* theo mã */ if (onChange) onChange(null); }
      }
      queueMicrotask(render);
    },
    setValue(v) { value = v || null; notice = ''; queueMicrotask(render); },
    destroy() { queueMicrotask(() => root.unmount()); },
  };
}
