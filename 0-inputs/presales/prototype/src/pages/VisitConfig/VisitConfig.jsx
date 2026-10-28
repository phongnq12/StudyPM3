/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* WEB-54 — tab lưu riêng; lịch ngoài khung giờ mới ⇒ hỏi rồi hủy qua lib/resourceImpact */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes';
import AppLayout from '@/layout/AppLayout';
import { operationsLayout } from '@/layout/menuConfig';
import { Svg } from '@/lib/icons';
import { toast } from '@/lib/legacyUi';
import { msg, msgParts } from '@/lib/msg';
import { RichText } from '@/lib/richText';
import { AppButton, AppButtonWithIcon } from '@/components/app/AppButton';
import { PageHeadActions, PageFooter } from '@/components/app/PageActions';
import AppTabs from '@/components/app/AppTabs';
import AppTable from '@/components/app/AppTable';
import AppModal from '@/components/app/AppModal';
import DialogCloseButton from '@/components/app/DialogCloseButton';
import TimeRangeInput from '@/components/app/TimeRangeInput';
import { useLeaveGuard } from '@/components/app/LeaveGuard';
import { Switch } from 'antd';
import {
  C04_DURATION, WEEKDAYS, readDirectConfig, writeDirectConfig,
} from '@/data/visitConfigStore';
import { REASON_TIME_FRAME, affectedByConfig, cancelAppointments } from '@/lib/resourceImpact';
import '@/styles/form.css';
import './VisitConfig.css';
import DialogIcon from '@/components/app/DialogIcon';
import NoteBox from '@/components/app/NoteBox';
import AppTag from '@/components/app/AppTag';

const SCREEN = 'Cấu hình thời gian';
const SCREEN_EDIT = 'Chỉnh sửa cấu hình thời gian';
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const toMin = (t) => (+t.slice(0, 2)) * 60 + (+t.slice(3, 5));
/* Ô giờ nhận chữ số và tự chèn dấu hai chấm: 0730 ⇒ 07:30 (cùng cách ô giờ màn Quầy) */
function normalizeTimeInput(value) {
  let s = String(value || '').replace(/[^0-9]/g, '').slice(0, 4);
  if (s.length > 2) s = s.slice(0, 2) + ':' + s.slice(2);
  return s;
}
const WARNING_ICON = '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>';
const SHIFTS = [['morning', 'ca sáng'], ['afternoon', 'ca chiều']];
const DEFAULT_SHIFTS = { morning: { from: '07:30', to: '11:00' }, afternoon: { from: '13:30', to: '17:00' } };   /* = mặc định visitConfigStore */
/* Giới hạn thời lượng: chỉ xem, số từ C04 */
const DURATION_FIELDS = [
  ['Thời lượng tối thiểu (phút)', C04_DURATION.minMinutes],
  ['Thời lượng tối đa (phút)', C04_DURATION.maxMinutes],
  ['Bước tăng (phút)', C04_DURATION.stepMinutes],
  ['Thời gian gia hạn tối đa (phút)', C04_DURATION.extendMaxMinutes],
  ['Số lần gia hạn tối đa', C04_DURATION.extendMaxTimes],
];   /* bỏ 2 ô cảnh báo */
const BOOKING_FIELDS = [];   /* bỏ khung Thời hạn đặt lịch */
const LABEL_BREAK = 'Giờ nghỉ giữa các ca (phút)';
/* "Vui lòng nhập {tên trường}": tên trường viết thường chữ đầu, bỏ hậu tố đơn vị */
const requiredText = (label) => msg('E001-01', label.replace(/\s*\([^)]*\)$/, '').replace(/^./, (c) => c.toLowerCase()));

/* Cấu hình đã lưu ⇒ bản nháp trên form: số đổi sang chữ để ô nhập giữ được giá trị trống */
function toDraft(cfg) {
  const str = (v) => (v === null || v === undefined ? '' : String(v));
  const order = WEEKDAYS.map((w) => w.dow);
  return {
    days: order.map((dow) => {
      const d = cfg.days.find((x) => x.dow === dow) || { dow, enabled: false, morning: {}, afternoon: {} };
      return { dow, enabled: !!d.enabled, morning: { from: str((d.morning || {}).from), to: str((d.morning || {}).to) }, afternoon: { from: str((d.afternoon || {}).from), to: str((d.afternoon || {}).to) }, breakMinutes: str(d.breakMinutes ?? 0) };
    }),
    booking: Object.fromEntries(BOOKING_FIELDS.map(([k]) => [k, str(cfg.booking[k])])),
  };
}
function toConfig(draft, saved) {
  const time = (v) => (TIME_PATTERN.test(v) ? v : '');
  return {
    ...saved,
    days: draft.days.map((d) => ({ dow: d.dow, enabled: d.enabled, morning: { from: time(d.morning.from), to: time(d.morning.to) }, afternoon: { from: time(d.afternoon.from), to: time(d.afternoon.to) }, breakMinutes: +d.breakMinutes || 0 })),
    booking: Object.fromEntries(BOOKING_FIELDS.map(([k]) => [k, +draft.booking[k]])),
  };
}
/* Khóa lỗi: d{dow}.{ca}.{from|to} · d{dow}.day · d{dow}.break · booking.{k} */
function validate(draft) {
  const errors = {};
  draft.days.forEach((d) => {
    if (!d.enabled) return;
    const label = WEEKDAYS.find((w) => w.dow === d.dow).label;
    const filled = {};
    SHIFTS.forEach(([shift, name]) => {
      const s = d[shift], key = 'd' + d.dow + '.' + shift + '.';
      const fromOk = TIME_PATTERN.test(s.from), toOk = TIME_PATTERN.test(s.to);
      if (!s.from && !s.to) return;
      if (!fromOk || !toOk) {
        const text = msg('E001-01', 'đủ giờ bắt đầu và giờ kết thúc ' + name + ' theo dạng HH:mm');
        if (!fromOk) errors[key + 'from'] = text;
        if (!toOk) errors[key + 'to'] = text;
        filled[shift] = 'bad';
      } else if (toMin(s.to) <= toMin(s.from)) {
        errors[key + 'to'] = msg('E001-17', 'Giờ kết thúc', 'sau', 'giờ bắt đầu');   /* MSG-WEB-50-03 */
        filled[shift] = 'bad';
      } else filled[shift] = 'ok';
    });
    /* 1 ca là đủ ⇒ lỗi hiện ở cả 2 ô ca */
    if (!filled.morning && !filled.afternoon) {
      const text = msg('E001-01', 'ít nhất một ca cho ' + label);
      errors['d' + d.dow + '.morning.from'] = text;
      errors['d' + d.dow + '.afternoon.from'] = text;
    }
    if (filled.morning === 'ok' && filled.afternoon === 'ok' && toMin(d.afternoon.from) < toMin(d.morning.to)) {
      errors['d' + d.dow + '.afternoon.from'] = msg('E001-17', 'Ca chiều', 'bắt đầu sau khi', 'ca sáng kết thúc');
    }
    const b = String(d.breakMinutes).trim(), kb = 'd' + d.dow + '.break';
    if (b === '') errors[kb] = requiredText(LABEL_BREAK);
    else if (+b < 0 || +b > 60) errors[kb] = 'Giờ nghỉ giữa các ca từ 0 đến 60 phút';
    else if (!Number.isInteger(+b) || +b % 5 !== 0) errors[kb] = 'Giờ nghỉ giữa các ca phải là bội số của 5';
  });
  BOOKING_FIELDS.forEach(([k, label]) => { if (String(draft.booking[k]).trim() === '') errors['booking.' + k] = requiredText(label); });
  return errors;
}

export default function VisitConfig() {
  const L = operationsLayout(SCREEN);
  const [saved, setSaved] = useState(readDirectConfig);
  const [draft, setDraft] = useState(() => toDraft(saved));
  /* chế độ Sửa theo URL …/chinh-sua như màn Sửa Quầy */
  const go = useNavigate();
  const editing = useLocation().pathname.replace(/\/$/, '') === ROUTES.visitConfigEdit;
  useEffect(() => { setDraft(toDraft(readDirectConfig())); setErrors({}); }, [editing]);
  const [errors, setErrors] = useState({});
  const [scrollRequest, setScrollRequest] = useState(0);
  const [impact, setImpact] = useState(null);   /* { cfg, list } chờ xác nhận hủy lịch */
  const saving = useRef(false);

  useLayoutEffect(() => {
    if (!scrollRequest) return;
    const first = document.querySelector('.vc-page .field-error.on');
    if (first) first.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [scrollRequest]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(toDraft(saved));
  /* hộp rời trang dùng chung */
  const guard = useLeaveGuard(editing && dirty, 'dlgVcBoThayDoi');
  const clearError = (...keys) => setErrors((x) => { if (!keys.some((k) => x[k])) return x; const n = { ...x }; keys.forEach((k) => { delete n[k]; }); return n; });
  const setDay = (dow, fn) => setDraft((x) => ({ ...x, days: x.days.map((d) => (d.dow === dow ? fn(d) : d)) }));
  const setTime = (dow, shift, edge, value) => {
    setDay(dow, (d) => ({ ...d, [shift]: { ...d[shift], [edge]: normalizeTimeInput(value) } }));
    const dayKeys = ['d' + dow + '.morning.from', 'd' + dow + '.afternoon.from']
      .filter((k) => String(errors[k] || '').indexOf(msg('E001-01', 'ít nhất một ca')) === 0);
    clearError('d' + dow + '.' + shift + '.' + edge, ...dayKeys);
  };
  const setBreak = (dow, value) => { setDay(dow, (d) => ({ ...d, breakMinutes: value })); clearError('d' + dow + '.break'); };

  const startEdit = () => go(ROUTES.visitConfigEdit);
  const leaveEdit = () => go(ROUTES.visitConfig);
  const cancelEdit = () => guard.attempt(leaveEdit);

  /* lưu cấu hình trước, lưu được mới hủy lịch */
  const commit = (cfg, toCancel) => {
    if (!writeDirectConfig(cfg)) { saving.current = false; setImpact(null); toast(msg('SE001-01', 'lưu cấu hình thăm gặp trực tiếp'), 'is-error'); return; }
    const cancelled = toCancel && toCancel.length ? cancelAppointments(toCancel, REASON_TIME_FRAME) : 0;
    const next = readDirectConfig();
    setSaved(next); setDraft(toDraft(next)); setErrors({}); setImpact(null); go(ROUTES.visitConfig);
    toast(msg('I001-03', 'cấu hình thăm gặp trực tiếp') + (cancelled ? ' và hủy ' + cancelled + ' lịch hẹn' : ''));
    saving.current = false;
  };
  const save = () => {
    if (saving.current) return;
    saving.current = true;
    const found = validate(draft);
    setErrors(found);
    if (Object.keys(found).length) { saving.current = false; setScrollRequest((n) => n + 1); return; }
    const cfg = toConfig(draft, saved);
    const list = affectedByConfig(cfg);
    if (!list.length) { commit(cfg, null); return; }
    setImpact({ cfg, list });
  };
  const confirmImpact = () => {
    if (!impact || saving.current === 'confirm') return;
    saving.current = 'confirm';
    commit(impact.cfg, impact.list);
  };
  const closeImpact = () => { if (saving.current === 'confirm') return; setImpact(null); saving.current = false; };

  const readOnly = !editing;
  const errorText = (k) => <span className={'field-error' + (errors[k] ? ' on' : '')}>{errors[k] || ''}</span>;
  const invalid = (k) => (errors[k] ? ' input-border-error' : '');
  const dayLabel = (dow) => WEEKDAYS.find((w) => w.dow === dow).label;
  /* 1 ca = 1 ô khoảng giờ; chữ đỏ của 2 khóa from/to hiện dưới đúng ô ca đó (cùng câu thì chỉ hiện 1 lần) */
  const shiftCell = (shift, name) => (d) => {
    if (!d.enabled) return <span className="vc-off">Không thăm gặp</span>;
    /* chế độ xem hiện giá trị bằng chữ, không dùng ô bị khoá */
    if (readOnly) return <span className="vc-text">{d[shift].from && d[shift].to ? d[shift].from + ' - ' + d[shift].to : '—'}</span>;
    const kf = 'd' + d.dow + '.' + shift + '.from', kt = 'd' + d.dow + '.' + shift + '.to';
    const msg = errors[kf] || errors[kt] || '';
    return <>
      <TimeRangeInput from={d[shift].from} to={d[shift].to} disabled={readOnly} invalid={!!msg} idPrefix={'vc-' + d.dow + '-' + shift}
        labelFrom={'Giờ bắt đầu ' + name + ' ' + dayLabel(d.dow)} labelTo={'Giờ kết thúc ' + name + ' ' + dayLabel(d.dow)}
        onChange={(edge, value) => setTime(d.dow, shift, edge, value)} />
      <span className={'field-error' + (msg ? ' on' : '')}>{msg}</span>
    </>;
  };
  /* bật lại 1 thứ mà cả 2 ca đều trống ⇒ điền giờ mặc định của store */
  const toggleDay = (dow, on) => {
    setDay(dow, (x) => {
      const empty = !x.morning.from && !x.morning.to && !x.afternoon.from && !x.afternoon.to;
      return on && empty ? { ...x, enabled: on, morning: { ...DEFAULT_SHIFTS.morning }, afternoon: { ...DEFAULT_SHIFTS.afternoon } } : { ...x, enabled: on };
    });
    if (!on) setErrors((x) => Object.fromEntries(Object.entries(x).filter(([k]) => k.indexOf('d' + dow + '.') !== 0)));
  };
  const dayColumns = [
    { key: 'dow', title: 'Thứ', thStyle: { width: '140px' }, render: (d) => <b>{dayLabel(d.dow)}</b> },
    { key: 'enabled', title: 'Thăm gặp', thStyle: { width: '120px' }, render: (d) => (readOnly ? <span className="vc-switch"><AppTag className={'tag catalog-status ' + (d.enabled ? 'tag-active' : 'tag-inactive')}>{d.enabled ? 'Bật' : 'Tắt'}</AppTag></span> :   /* như canvas tham khảo */
      <span className="vc-switch"><Switch checked={d.enabled} disabled={readOnly} aria-label={'Thăm gặp ' + dayLabel(d.dow)} data-no-tooltip data-fe="Switch"
        onChange={(on) => toggleDay(d.dow, on)} /></span>
    ) },
    { key: 'morning', title: 'Ca sáng', render: shiftCell('morning', 'ca sáng') },
    { key: 'afternoon', title: 'Ca chiều', render: shiftCell('afternoon', 'ca chiều') },
    { key: 'breakMinutes', title: LABEL_BREAK, thStyle: { width: '220px' }, render: (d) => {
      if (!d.enabled) return <span className="vc-off">Không thăm gặp</span>;
      if (readOnly) return <span className="vc-text">{d.breakMinutes === '' || d.breakMinutes == null ? '—' : d.breakMinutes}</span>;
      const k = 'd' + d.dow + '.break';
      return <>
        <input className={'text-input' + invalid(k)} type="number" min="0" max="60" step="5" value={d.breakMinutes} disabled={readOnly}
          aria-label={LABEL_BREAK + ' ' + dayLabel(d.dow)} onChange={(e) => setBreak(d.dow, e.target.value)} />
        {errorText(k)}
      </>;
    } },
  ];

  /* Xem có Chỉnh sửa, Sửa chỉ có Lưu */
  const pageActions = editing
    ? [{ id: 'vcLuu', label: 'Lưu', className: 'form-btn form-btn-primary', onClick: save, iconRaw: '<polyline points="20 6 9 17 4 12"/>' }]
    : [{ id: 'vcChinhSua', label: 'Chỉnh sửa', className: 'form-btn form-btn-primary', onClick: startEdit, iconRaw: '<path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>' }];

  const content = <>
    <div className="card">
      <h2 className="card-title">Khung giờ thăm gặp</h2>
      <AppTable tableClassName="vc-days" rowKey="dow" columns={dayColumns} dataSource={draft.days} />
      <NoteBox id="luuYKhungGio" items={[
        <>Đối với các ngày được <b>bật thăm gặp</b> thì bắt buộc có thông tin <b>ít nhất 1 ca</b> (<b>Ca sáng</b> hoặc <b>Ca chiều</b>) và <b>Giờ nghỉ giữa các ca</b></>,
        <><b>Giờ nghỉ giữa các ca:</b> Số phút đệm giữa 2 lịch liên tiếp trên cùng 1 buồng, cài riêng từng thứ, áp dụng chung cho mọi quầy</>,
      ]} />
    </div>

    <div className="card">
      <h2 className="card-title">Giới hạn thời lượng</h2>
      {/* số liệu đồng bộ từ C04, không sửa được ở mọi chế độ ⇒ dựng nhãn và giá trị như màn Xem chi tiết */}
      <div className="vc-info" id="vcThoiLuong">
        {DURATION_FIELDS.map(([label, value]) => [
          <div className="vc-info-label" key={label + 'l'}>{label}</div>,
          <div className="vc-info-value" key={label + 'v'}>{value || '—'}</div>,
        ])}
      </div>
      {/* khung Lưu ý tông xám 1 dòng — thông tin nguồn số liệu, không phải quy tắc nhập liệu */}
      <NoteBox id="luuYThoiLuong" line="Thông tin giới hạn thời lượng được đồng bộ từ cài đặt tại C04" />
    </div>

    <PageFooter actions={pageActions} />
  </>;

  return (
    <AppLayout menu={L.menu} sidebar={L.sidebar} breadcrumb={editing
      ? [...L.breadcrumb, { label: SCREEN, href: ROUTES.visitConfig }, { label: SCREEN_EDIT }]
      : [...L.breadcrumb, { label: SCREEN }]}>
      <div className="vc-page">
        <div className="page-head">
          {editing ? <AppButtonWithIcon className="page-head-back" id="vcQuayLai" onClick={cancelEdit} title="Quay lại" aria-label="Quay lại" iconRaw={'<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>'} /> : null}
          <div className="page-head-text">
            <h1 id="tieuDe">{editing ? SCREEN_EDIT : SCREEN}</h1>
          </div>
          <PageHeadActions actions={pageActions} />
        </div>

        <AppTabs activeKey="direct" onChange={() => {}} items={[{ key: 'direct', id: 'vcTabTrucTiep', label: 'Thăm gặp trực tiếp', children: content }]} />
      </div>

      {guard.dialog}

      <AppModal id="dlgVcHuyLich" open={!!impact} onClose={closeImpact} labelledBy="dlgVcHuyLichTieuDe" dlgStyle={{ width: '520px' }}>
        <div className="dlg-h"><h3 id="dlgVcHuyLichTieuDe" className="dlg-t"><DialogIcon level="warn" /><RichText text={msgParts('C001-19').title} /></h3><DialogCloseButton onClick={closeImpact} /></div>
        <div className="dlg-b"><div><RichText text={msgParts('C001-19', impact ? impact.list.length : 0).body} /></div></div>
        <div className="dlg-f">
          <AppButton className="form-btn" onClick={closeImpact}>Hủy</AppButton>
          <AppButton className="form-btn form-btn-danger" id="vcLuuHuyLich" onClick={confirmImpact}>Lưu và hủy lịch</AppButton>
        </div>
      </AppModal>
    </AppLayout>
  );
}
