/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* WEB-06 · "Lịch theo buồng" — the SPECIFIC logic of the list tab on top of the shared TableCalendar look.
 * only moves existing appointments, full detail on each block (name · time - visitor · status chip, colour of the status tag).
 * Drag ⠿ to move (time or table), drag the right edge to change the duration (10–45); a valid drop asks the parent to confirm with a reason
 * (onRequestMove), an invalid drop reverts with a short toast. Clicking empty space does nothing — no new appointment here.
 * Vắng mặt, Đã kết thúc and the other statuses of HOLDS_NO_RESOURCE release the table and are not drawn.
 * Từ chối duyệt vẫn giữ buồng ⇒ vẫn vẽ trên lịch tới khi Hủy. */
import { statusLabel } from '@/data/appointmentStore';
import { durationOptions, breakMinutesOfDate, shiftsOfDate } from '@/data/visitConfigStore';
import { tablesOfCounter } from '@/data/visitTableStore';
import { toast } from '@/lib/legacyUi';
import { msg } from '@/lib/msg';
import { RESERVED_LABEL, activeCounters, clockToMinutes, counterLabel, minutesToClock, usesReserved } from '@/lib/tableTimeline';
import TableCalendar from '@/components/app/TableCalendar';
import SetupHint from '@/components/app/SetupHint';
import { ROUTES } from '@/routes';
import { HOLDS_NO_RESOURCE, STATUS_CLASS, formatDate, gridTooltip, isDraggable, visitDateText } from './listLogic';

const DEFAULT_DURATION = 45;            /* same fallback as the list (adjustDuration / gridTooltip) */
const UNASSIGNED_ROW = '';               /* tableCode of the "Chưa xếp buồng" row */
const MIN_DURATION = Math.min(...durationOptions());
const MAX_DURATION = Math.max(...durationOptions());

/* buồng Hoạt động nhóm theo quầy Hoạt động, ca của ngày đang xem theo WEB-54, khoảng suất riêng của quầy
 * firstCounter: quầy đang chọn ở ô lọc Quầy tiếp đón ⇒ nhóm buồng của quầy đó lên đầu, các quầy khác giữ thứ tự cũ bên dưới */
function calendarTables(date, firstCounter) {
  const gap = breakMinutesOfDate(date);
  const shifts = shiftsOfDate(date).map((s) => ({ name: s.name, open: clockToMinutes(s.openTime), close: clockToMinutes(s.closeTime) }));
  const counters = activeCounters();
  const ordered = firstCounter ? counters.filter((c) => c.code === firstCounter).concat(counters.filter((c) => c.code !== firstCounter)) : counters;
  return ordered.flatMap((c) => tablesOfCounter(c.code, true).map((t) => ({
    code: t.code, label: t.code + ' — ' + t.name, group: counterLabel(c), shifts, gap,
    reserved: (c.reservedRanges || []).filter((r) => r.from && r.to && (r.tableCodes || []).indexOf(t.code) >= 0).map((r) => [clockToMinutes(r.from), clockToMinutes(r.to)]),
  })));
}

const durationOf = (r) => (+r.durationMinutes || DEFAULT_DURATION);
const startOf = (r) => clockToMinutes(r.visitTime || '00:00');

/* why the record cannot go to [start, start+duration) on tableCode; '' = it fits */
function blockReason(tables, dayItems, record, tableCode, start, duration, dayState) {
  const end = start + duration;
  const table = tables.find((t) => t.code === tableCode);
  if (!table) return 'Chưa chọn buồng thăm gặp';
  const gap = table.gap || 0;
  if (dayState.isPast || (dayState.nowMinutes != null && start < dayState.nowMinutes)) return 'Giờ đã qua';
  if (!table.shifts.some((s) => start >= s.open && end <= s.close)) return msg('I001-75');
  if (!usesReserved(record.source) && table.reserved.some(([a, b]) => start < b && a < end)) return RESERVED_LABEL;
  const hit = dayItems.find((x) => x.code !== record.code && x.tableCode === tableCode && startOf(x) < end + gap && startOf(x) + durationOf(x) + gap > start);
  return hit ? 'Trùng lịch ' + hit.code : '';
}

/* canMove: màn đang mở có quyền Điều chỉnh (màn ngoại lệ không kéo thả) */
export default function ListCalendar({ appointments, date, visible, onRequestMove, canMove = true, firstCounter = '' }) {
  const dateText = formatDate(date);
  const now = new Date(), todayText = formatDate(now);
  const isToday = dateText === todayText;
  const dayState = {
    isPast: new Date(date.getFullYear(), date.getMonth(), date.getDate()) < new Date(now.getFullYear(), now.getMonth(), now.getDate()),
    nowMinutes: isToday ? now.getHours() * 60 + now.getMinutes() : null,
  };
  const dayItems = appointments.filter((x) => HOLDS_NO_RESOURCE.indexOf(x.status) < 0 && visitDateText(x) === dateText && x.visitTime);
  const hasUnassigned = dayItems.some((x) => !x.tableCode);
  const tables = calendarTables(date, firstCounter);
  const rows = (hasUnassigned ? [{ code: UNASSIGNED_ROW, label: 'Chưa xếp buồng', unassigned: true, shifts: [] }] : []).concat(tables);

  const items = dayItems.map((r) => {
    const movable = canMove && isDraggable(r), tagClass = 'tag-' + (STATUS_CLASS[r.status] || 'other');
    return {
      key: r.code, code: r.code, tableCode: r.tableCode || UNASSIGNED_ROW, start: startOf(r), duration: durationOf(r), variant: 'record', blockClass: tagClass,
      movable, resizable: movable && !!r.tableCode, hint: gridTooltip(r), record: r,
      content: { title: r.studentName, line: r.visitorName || '', status: statusLabel(r.status), statusClass: tagClass },
    };
  });

  const validate = (item, tableCode, start, duration, kind) => {
    const r = item.record;
    if (kind !== 'resize') return blockReason(tables, dayItems, r, tableCode, start, duration, dayState);
    /* a block that already started may still be stretched: only the end must be after now */
    const reason = blockReason(tables, dayItems, r, tableCode, start, duration, { isPast: false, nowMinutes: null });
    if (reason) return reason;
    return dayState.isPast || (dayState.nowMinutes != null && start + duration <= dayState.nowMinutes) ? 'Giờ đã qua' : '';
  };

  /* chưa có buồng nào ⇒ để trống lưới, hướng dẫn kèm link sang màn Buồng thăm gặp */
  if (!tables.length) return <SetupHint id="huongDanCaiDatBan" what="buồng thăm gặp" screen="Cài đặt quầy tiếp đón" to={ROUTES.receptionDeskList} />;
  /* Ngày đang xem không có lịch nào ⇒ thay cả lưới bằng câu I001-27, không hiện lưới buồng trống */
  if (!items.length) return <div className="table-calendar-empty" id="lichTrongNgay" role="status">{msg('I001-27', 'lịch hẹn')}</div>;

  return (
    <TableCalendar rows={rows} items={items} now={dayState.nowMinutes} pastUntil={dayState.isPast ? 24 * 60 : dayState.nowMinutes}
      minDuration={MIN_DURATION} maxDuration={MAX_DURATION} cornerLabel="Buồng thăm gặp"
      initialScrollMinute={dayState.nowMinutes} scrollKey={dateText + (visible ? '1' : '0')}
      validate={validate}
      onMove={(item, t, kind) => onRequestMove({ code: item.code, time: minutesToClock(t.start), table: t.tableCode, ...(kind === 'resize' ? { duration: t.duration } : {}) })}
      onInvalidDrop={(reason, kind) => (kind === 'cancel' ? toast(msg('I001-72'))
        : toast(msg(kind === 'resize' ? 'E001-22' : 'E001-21', reason), 'is-warning'))} />
  );
}
