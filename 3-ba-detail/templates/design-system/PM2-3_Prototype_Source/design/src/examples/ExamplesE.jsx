/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Ví dụ kiểu HeroUI cho date-time (học DatePicker của HeroUI: Disabled · Controlled · Validation, thêm bước phút của PM2). Mỗi ví dụ chạy component thật, code bên dưới khớp đúng phần render. */
import { useState } from 'react';
import DateTimeInput from '@/components/app/DateTimeInput';
import { msg } from '@/lib/msg';

const box = { maxWidth: 240 };

/* ── date-time ── */
function DateTimeDisabled() { return <div style={box}><DateTimeInput id="ex-date-time-1" label="Thời điểm hẹn" value="15/10/2026 08:30" disabled onChange={() => {}} /></div>; }
function DateTimeControlled() {
  const [v, setV] = useState('15/10/2026 08:30');
  return <div style={box}><DateTimeInput id="ex-date-time-2" label="Thời điểm hẹn" value={v} onChange={setV} /><div className="sd-muted" style={{ marginTop: 6 }}>Giá trị: {v || '—'}</div></div>;
}
function DateTimeValidation() {
  const [v, setV] = useState('');
  return <div style={box}><DateTimeInput id="ex-date-time-3" label="Thời điểm hẹn" value={v} invalid={!v} onChange={setV} />
    {!v && <span className="field-error on">{msg('E001-02', 'thời điểm hẹn')}</span>}</div>;
}
function DateTimeStep() { const [v, setV] = useState('15/10/2026 08:15'); return <div style={box}><DateTimeInput id="ex-date-time-4" label="Thời điểm hẹn" value={v} minuteStep={15} onChange={setV} /></div>; }

export default {
  'date-time': [
    { title: 'Khoá', desc: 'Bật disabled cho chế độ chỉ xem, ô khoá và bảng chọn không mở.', Demo: DateTimeDisabled,
      code: '<DateTimeInput id="thoiDiem" label="Thời điểm hẹn" value="15/10/2026 08:30" disabled onChange={() => {}} />' },
    { title: 'Điều khiển giá trị', desc: 'Giá trị do màn giữ qua value và onChange, chọn ngày, giờ, phút là ghi nhận ngay.', Demo: DateTimeControlled,
      code: "const [v, setV] = useState('15/10/2026 08:30')\n<DateTimeInput id=\"thoiDiem\" label=\"Thời điểm hẹn\" value={v} onChange={setV} />" },
    { title: 'Báo lỗi bỏ trống', desc: 'Ô bắt buộc chưa chọn thì bật invalid và hiện chữ đỏ E001-02 dưới ô.', Demo: DateTimeValidation,
      code: "<DateTimeInput id=\"thoiDiem\" label=\"Thời điểm hẹn\" value={v} invalid={!v} onChange={setV} />\n{!v && <span className=\"field-error on\">{msg('E001-02', 'thời điểm hẹn')}</span>}" },
    { title: 'Bước phút 15', desc: 'Đổi minuteStep khi nghiệp vụ chỉ hẹn theo mốc 15 phút, mặc định là 5.', Demo: DateTimeStep,
      code: '<DateTimeInput id="thoiDiem" label="Thời điểm hẹn" value={v} minuteStep={15} onChange={setV} />' },
  ],
};
