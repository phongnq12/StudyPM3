/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Đề xuất lịch thay thế khi hủy do sự cố của cơ sở (BRD-WEB-06 «Gợi ý xếp lại»):
 * tìm khung giờ trống GẦN NHẤT trong 7 ngày tới cho 1 lịch hẹn, cùng quầy của lịch, cùng thời lượng.
 * Dùng lại bộ dựng lịch của popup Điều chỉnh (counterRoom · timelineConfig · fitsTimeline) nên giờ ca, giờ nhận lịch cuối, suất riêng, đệm giữa lịch giống hệt màn khác.
 * Chỉ đề xuất trong thông báo, KHÔNG tạo lịch mới. Không tìm được ⇒ null. */
import { findCounter } from '@/data/receptionDeskStore';
import { counterCodeOf } from '@/lib/resourceImpact';
import { bookedFrom, bookingSettings, counterRoom, fitDuration, fitsTimeline, lastStartOf, minutesToClock, studentResource, timelineConfig, usesReserved, TIMELINE_STEP_MINUTES } from '@/lib/tableTimeline';
import { HOLDS_NO_RESOURCE } from '@/pages/AppointmentList/listLogic';

export const PROPOSAL_DAYS = 7;
const pad2 = (n) => String(n).padStart(2, '0');
const iso = (d) => d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());

/* record: lịch đang hủy (mô hình tiếng Anh) · appointments: mọi lịch để tính buồng bận (buildAppointments) ⇒ { visitDate, visitTime, tableCode, durationMinutes } | null */
export function findAlternativeSlot(record, appointments) {
  if (!record) return null;
  const counter = findCounter(counterCodeOf(record)) || studentResource(record.studentCode).counter;
  if (!counter) return null;
  const duration = +record.durationMinutes || 45, today = new Date();
  for (let dayIndex = 0; dayIndex <= PROPOSAL_DAYS; dayIndex++) {
    const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() + dayIndex), dayIso = iso(day);
    const room = counterRoom(counter, day, usesReserved(record.source));
    if (!room.shifts.length || !room.tables.length) continue;
    const cfg = timelineConfig(room, duration, bookingSettings(), bookedFrom(appointments || [], dayIso, HOLDS_NO_RESOURCE, record.code), dayIndex === 0 ? 0 : 1);
    let best = null;
    cfg.shifts.forEach((sh) => {
      for (let s = Math.max(sh.open, cfg.minStart == null ? sh.open : cfg.minStart); s <= lastStartOf(sh); s += TIMELINE_STEP_MINUTES) {
        if (best && s >= best.start) break;
        /* khung đang hủy (cùng ngày, cùng giờ, cùng buồng) không đề xuất lại */
        const t = cfg.tables.find((x) => !(dayIso === record.visitDate && minutesToClock(s) === String(record.visitTime || '').slice(0, 5) && x.code === record.tableCode)
          && fitsTimeline(cfg, x.code, s, s + fitDuration(cfg, s, duration)));
        if (t) { best = { start: s, tableCode: t.code, duration: fitDuration(cfg, s, duration) }; break; }
      }
    });
    if (best) return { visitDate: dayIso, visitTime: minutesToClock(best.start), tableCode: best.tableCode, durationMinutes: best.duration };
  }
  return null;
}
