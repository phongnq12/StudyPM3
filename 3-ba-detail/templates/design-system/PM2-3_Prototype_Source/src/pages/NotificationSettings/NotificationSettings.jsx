/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Quản trị & Báo cáo · Cài đặt thông báo (Sổ BA PM2).
 * Tab theo chức năng (hiện có Thăm gặp trực tiếp, thêm tab = thêm 1 dòng FUNCTION_TABS của kho) + tab Lịch sử thao tác.
 * Mỗi tab chức năng chia nhóm, mỗi nhóm 1 bảng. Dữ liệu khởi tạo sẵn: không Thêm, không Xóa — chỉ Sửa (popup) và Bật/Tắt.
 * Quyền: Cán bộ Tổ thăm gặp, Cán bộ Tổ tham mưu xem và sửa · Trưởng cơ sở không vào màn (accountStore SCREEN_ACCESS.notificationSettings). */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Switch } from 'antd';
import AppLayout from '@/layout/AppLayout';
import { operationsLayout } from '@/layout/menuConfig';   /* thuộc nhóm Vận hành Cơ sở */
import { Svg } from '@/lib/icons';
import { toast } from '@/lib/legacyUi';
import { msg, msgParts } from '@/lib/msg';
import DialogIcon from '@/components/app/DialogIcon';   /* hộp xác nhận bật/tắt */
import { RichText, key } from '@/lib/richText';
import { AppButton, AppButtonWithIcon } from '@/components/app/AppButton';
import AppTabs from '@/components/app/AppTabs';
import AppTable from '@/components/app/AppTable';
import AppModal from '@/components/app/AppModal';
import AppSelect from '@/components/app/AppSelect';
import AppCounterInput from '@/components/app/AppCounterInput';   /* ô có bộ đếm dùng chung «n / max» */
import DialogCloseButton from '@/components/app/DialogCloseButton';
import HistoryTable from '@/pages/ReceptionDeskShared/HistoryTable';
import { can, SCREEN_NOTIFICATION_SETTINGS } from '@/data/accountStore';
import {
  BODY_MAX, FUNCTION_TABS, GROUPS, exampleOf, pairedRowsOf, SEND_TYPE_LABELS, TEMPLATE_VARIABLES, TIME_ANCHOR, TIME_UNITS, TITLE_MAX, invalidVariables, variablesOf,
  onNotificationSettingsChange, readNotificationSettings, readNotificationSettingsHistory, sendTypeOptions, timeConditionText, updateNotificationSetting,
} from '@/data/notificationSettingsStore';
import '@/styles/form.css';
import './NotificationSettings.css';

const SCREEN = 'Cài đặt thông báo';
const HISTORY_TAB = 'history';
const LOCKED_TIP = 'Thông báo bắt buộc, không tắt được';
const EDIT_ICON = 'edit';

/* bản nháp của popup: số lưu dạng chữ để ô trống được */
const toDraft = (r) => ({ sendType: r.sendType, offset: r.offset == null ? '' : String(r.offset), unit: r.unit || 'MINUTE', holdHours: r.holdHours == null ? '' : String(r.holdHours), contents: r.contents.map((x) => ({ ...x })), enabled: !!r.enabled });
/* chữ có biến {…} ⇒ biến hiện dạng chip nhạt để người quản trị nhận ra (BRD-WEB-03b 6.4) */
/* Mỗi thông báo có mục Ví dụ để Dev và QC hiểu ý BA — dựng từ khuôn đang hiển thị, dữ liệu minh họa */
function ExampleBox({ code, content }) {
  const ex = exampleOf(code, content);
  return <div className="ns-example" data-example>
    <div className="ns-example-label">Ví dụ (dữ liệu minh họa)</div>
    <div className="ns-example-title"><RichText text={ex.title} /></div>
    <div className="ns-example-body"><RichText text={ex.body} /></div>
  </div>;
}
const withVariableChips = (text) => String(text || '').split(/(\{[^{}\s]*\})/).map((part, i) => (/^\{[^{}\s]*\}$/.test(part) ? <span className="ns-var" key={i}>{part}</span> : part));
/* Gửi khi nào gộp 1 dòng — «Gửi ngay khi phát sinh» · «Trước giờ hẹn 24 giờ» · «Sau giờ hẹn 15 phút» */
const sendWhenText = (r) => (r.sendType === 'IMMEDIATE' ? SEND_TYPE_LABELS.IMMEDIATE : timeConditionText(r));
/* nhãn người nhận gắn vào câu lỗi khi sự kiện có nhiều người nhận */
const whoOf = (row, x) => (row.contents.length > 1 ? ' cho ' + x.recipient.toLowerCase() : '');

/* E001-44 (BRD MSG-WEB-58-01): nêu tên biến sai + danh sách biến dùng được của sự kiện */
const badVariableText = (row, text) => msg('E001-44', invalidVariables(row.code, text).join(', '), variablesOf(row.code).map((v) => '{' + v + '}').join(', '));

function validate(row, d) {
  const e = {};
  if (!d.sendType) e.sendType = msg('E001-02', 'gửi khi nào');
  if (d.sendType && d.sendType !== 'IMMEDIATE') {
    const s = String(d.offset).trim();
    if (s === '') e.offset = msg('E001-01', 'mốc thời gian');
    else if (!/^\d+$/.test(s) || +s < 1) e.offset = msg('E001-17', 'Mốc thời gian', 'là số nguyên lớn hơn hoặc bằng', '1');
    if (!d.unit) e.unit = msg('E001-02', 'đơn vị thời gian');
  }
  /* số giờ giữ chỗ của dòng Tự hủy */
  if (row.holdHours != null) {
    const h = String(d.holdHours).trim();
    if (h === '') e.holdHours = msg('E001-01', 'số giờ giữ chỗ');
    else if (!/^\d+$/.test(h) || +h < 1) e.holdHours = msg('E001-17', 'Số giờ giữ chỗ', 'là số nguyên lớn hơn hoặc bằng', '1');
  }
  d.contents.forEach((x, i) => {
    const who = whoOf(row, x);
    if (!x.title.trim()) e['title' + i] = msg('E001-01', 'tiêu đề thông báo' + who);
    else if (x.title.length > TITLE_MAX) e['title' + i] = msg('E001-05', 'Tiêu đề thông báo', TITLE_MAX);
    else if (invalidVariables(row.code, x.title).length) e['title' + i] = badVariableText(row, x.title);
    if (!x.body.trim()) e['body' + i] = msg('E001-01', 'nội dung thông báo' + who);
    else if (x.body.length > BODY_MAX) e['body' + i] = msg('E001-05', 'Nội dung thông báo', BODY_MAX);
    else if (invalidVariables(row.code, x.body).length) e['body' + i] = badVariableText(row, x.body);
  });
  return e;
}

export default function NotificationSettings() {
  const L = operationsLayout(SCREEN);
  const [rows, setRows] = useState(readNotificationSettings);
  const [history, setHistory] = useState(readNotificationSettingsHistory);
  useEffect(() => onNotificationSettingsChange(() => { setRows(readNotificationSettings()); setHistory(readNotificationSettingsHistory()); }), []);
  const [tab, setTab] = useState(FUNCTION_TABS[0].key);
  const [editing, setEditing] = useState(null);   /* dòng đang sửa */
  const [draft, setDraft] = useState(null);
  const [errors, setErrors] = useState({});
  const canEdit = can(SCREEN_NOTIFICATION_SETTINGS, 'edit');
  const fieldRefs = useRef({});        /* 'title0' | 'body0' | … ⇒ ô nhập */
  const lastFocused = useRef(null);    /* ô vừa focus gần nhất — chưa có thì chèn vào ô nội dung đầu tiên */
  const pendingCaret = useRef(null);   /* { key, pos } đặt lại con trỏ sau khi chữ đã vẽ lại */
  useLayoutEffect(() => {
    const p = pendingCaret.current; if (!p) return; pendingCaret.current = null;
    const el = fieldRefs.current[p.key]; if (el) { el.focus(); el.setSelectionRange(p.pos, p.pos); }
  }, [draft]);
  /* bấm chip biến ⇒ chèn vào vị trí con trỏ của ô vừa focus (BRD-WEB-03b 6.4) */
  const insertVariable = (name) => {
    const k = lastFocused.current || 'body0', el = fieldRefs.current[k]; if (!el) return;
    const field = k.replace(/\d+$/, ''), i = +k.replace(/^\D+/, ''), token = '{' + name + '}';
    const value = el.value, max = field === 'title' ? TITLE_MAX : BODY_MAX;
    const start = el.selectionStart == null ? value.length : el.selectionStart, end = el.selectionEnd == null ? start : el.selectionEnd;
    const next = (value.slice(0, start) + token + value.slice(end)).slice(0, max);
    pendingCaret.current = { key: k, pos: Math.min(start + token.length, next.length) };
    setContent(i, field, next);
  };

  const [viewing, setViewing] = useState(null);   /* popup Chi tiết thông báo */
  const openView = (r) => setViewing(r.code);
  const closeView = () => setViewing(null);
  const openEdit = (r) => { lastFocused.current = null; setEditing(r); setDraft(toDraft(r)); setErrors({}); };
  const closeEdit = () => { setEditing(null); setDraft(null); setErrors({}); };
  const clearError = (k) => setErrors((x) => { if (!x[k]) return x; const n = { ...x }; delete n[k]; return n; });
  const setField = (k, v) => { setDraft((x) => ({ ...x, [k]: v })); clearError(k); };
  const setContent = (i, field, v) => { setDraft((x) => ({ ...x, contents: x.contents.map((c, j) => (j === i ? { ...c, [field]: v } : c)) })); clearError(field + i); };
  /* đổi bật/tắt ⇒ hộp xác nhận C001-20, kèm cảnh báo W001-21 cho dòng đi cặp đang khác trạng thái */
  const [confirmToggle, setConfirmToggle] = useState(null);   /* { row, on, run } */
  const askToggle = (r, on, run) => setConfirmToggle({ row: r, on, run });
  const save = (skipConfirm) => {
    const found = validate(editing, draft);
    setErrors(found);
    if (Object.keys(found).length) return;
    if (!skipConfirm && !editing.locked && !!draft.enabled !== !!editing.enabled) { askToggle(editing, !!draft.enabled, () => save(true)); return; }
    const next = { sendType: draft.sendType, offset: draft.sendType === 'IMMEDIATE' ? null : +draft.offset, unit: draft.unit, ...(editing.holdHours != null ? { holdHours: +draft.holdHours } : {}), contents: draft.contents.map((x) => ({ recipient: x.recipient, title: x.title.trim(), body: x.body.trim() })), enabled: editing.locked ? true : draft.enabled };
    if (!updateNotificationSetting(editing.code, next)) { toast(msg('SE001-01', 'lưu cài đặt thông báo'), 'is-error'); return; }
    toast(msg('I001-03', 'thông báo ' + key(editing.code)));
    closeEdit();
  };
  const toggle = (r, on, confirmed) => {
    if (r.locked || !canEdit) return;
    if (!confirmed) { askToggle(r, on, () => toggle(r, on, true)); return; }
    if (!updateNotificationSetting(r.code, { enabled: on })) { toast(msg('SE001-01', 'lưu cài đặt thông báo'), 'is-error'); return; }
    toast(msg('I001-03', 'thông báo ' + key(r.code)));
  };

  const columns = [
    { key: 'index', title: 'STT', className: 'col-index', thStyle: { width: '56px' }, render: (r, i) => i + 1 },
    { key: 'code', title: 'Mã thông báo', thStyle: { width: '300px' }, render: (r) => (
      <span className="ns-code">{r.code}</span>) },   /* mã là chữ thường, vào Chi tiết bằng nút Xem chi tiết */
    { key: 'name', title: 'Tên thông báo', render: (r) => <span className="ns-name">{r.name}</span> },
    { key: 'sendType', title: 'Gửi khi nào', thStyle: { width: '220px' }, render: (r) => sendWhenText(r) },
    { key: 'enabled', title: 'Bật/Tắt', thStyle: { width: '96px' }, render: (r) => (
      <span className={'ns-switch' + (r.locked ? ' is-locked' : '')} data-tip={r.locked ? LOCKED_TIP : undefined}>
        <Switch checked={!!r.enabled} disabled={r.locked || !canEdit} aria-label={'Bật hoặc tắt thông báo ' + r.code} data-no-tooltip={r.locked ? undefined : true}
          onChange={(on) => toggle(r, on)} />
      </span>) },
    { key: 'actions', title: 'Thao tác', className: 'col-act', thStyle: { width: '96px' }, render: (r) => (
      <div className="acts">
        <AppButtonWithIcon className="ib ib-view" title="Xem chi tiết" aria-label={'Xem chi tiết thông báo ' + r.code} icon="view" onClick={() => openView(r)} />
        {canEdit && <AppButtonWithIcon className="ib ib-edit" title="Chỉnh sửa" aria-label={'Chỉnh sửa thông báo ' + r.code} icon={EDIT_ICON} onClick={() => openEdit(r)} />}
      </div>) },
  ];

  const tabContent = (tabKey) => GROUPS.filter((g) => g.tab === tabKey).map((g, gi) => (
    <div className="card" key={g.key} id={'nhom-' + g.key}>
      <h2 className="card-title">{g.title}</h2>
      <div className="ns-table-wrap">
        <AppTable tableClassName="ns-table" tableId={'bang-' + g.key} rowKey="code" columns={columns} dataSource={rows.filter((r) => r.tab === tabKey && r.group === g.key)} />
      </div>
    </div>));

  const items = FUNCTION_TABS.map((t) => ({ key: t.key, id: 'nsTab-' + t.key, label: t.label, children: tabContent(t.key) }))
    .concat([{ key: HISTORY_TAB, id: 'nsTabLichSu', label: 'Lịch sử thao tác', children: (
      <div className="card"><HistoryTable history={history} renderStatus={() => null} /></div>) }]);

  const row = editing, d = draft;
  const vr = viewing ? rows.find((x) => x.code === viewing) : null;   /* đọc lại kho ⇒ sửa xong mở Xem thấy bản mới */
  const err = (k) => <span className={'field-error' + (errors[k] ? ' on' : '')} id={'nsLoi-' + k}>{errors[k] ? <RichText text={errors[k]} /> : ''}</span>;
  const timed = d && d.sendType && d.sendType !== 'IMMEDIATE';
  const groupTitle = row ? (GROUPS.find((g) => g.key === row.group) || {}).title : '';

  return (
    <AppLayout menu={L.menu} sidebar={L.sidebar} breadcrumb={[...L.breadcrumb, { label: SCREEN }]}
      overlays={
        <>
        <AppModal id="dlgXacNhanBatTat" open={!!confirmToggle} onClose={() => setConfirmToggle(null)} labelledBy="dlgXacNhanBatTatTieuDe">
          {confirmToggle && (() => { const part = msgParts('C001-20', confirmToggle.on ? 'bật' : 'tắt', confirmToggle.row.name, confirmToggle.on ? 'Bật' : 'Tắt');
            const diff = pairedRowsOf(confirmToggle.row.code).filter((p) => !!p.row.enabled !== confirmToggle.on);
            return <>
              <div className="dlg-h"><h3 id="dlgXacNhanBatTatTieuDe" className="dlg-t"><DialogIcon level="warn" /><RichText text={part.title} /></h3><DialogCloseButton onClick={() => setConfirmToggle(null)} /></div>
              <div className="dlg-b"><div className="dlg-text"><RichText text={part.body} /></div>
                {diff.map((p) => <div className="eff is-warning" key={p.code} data-pair={p.code}><RichText text={msg('W001-21', p.row.name, p.usedFor, p.row.enabled ? 'Bật' : 'Tắt')} /></div>)}</div>
              <div className="dlg-f"><AppButton className="btn" id="dlgBatTatHuy" onClick={() => setConfirmToggle(null)}>{part.cancel || 'Hủy'}</AppButton>
                <AppButton className="btn btn-primary" id="dlgBatTatXacNhan" onClick={() => { const run = confirmToggle.run; setConfirmToggle(null); run(); }}>{part.ok || 'Xác nhận'}</AppButton></div>
            </>; })()}
        </AppModal>
        <AppModal id="dlgXemThongBao" open={!!vr} onClose={closeView} labelledBy="dlgXemThongBaoTieuDe" dlgStyle={{ width: '960px', maxWidth: 'calc(100vw - 40px)' }}>
          <div className="dlg-h"><h3 id="dlgXemThongBaoTieuDe" className="dlg-t">Chi tiết thông báo</h3><DialogCloseButton onClick={closeView} /></div>
          {vr && <div className="dlg-b ns-dlg">
            <div className="ns-view" id="nsXemThongTin">
              <div className="ns-view-label">Mã thông báo</div><div className="ns-view-value ns-code">{vr.code}</div>
              <div className="ns-view-label">Tên thông báo</div><div className="ns-view-value">{vr.name}</div>
              <div className="ns-view-label">Nhóm</div><div className="ns-view-value">{(GROUPS.find((g) => g.key === vr.group) || {}).title}</div>
              <div className="ns-view-label">Gửi cho</div><div className="ns-view-value">{vr.recipients}</div>
              <div className="ns-view-label">Thao tác kích hoạt</div><div className="ns-view-value">{vr.trigger}</div>
              <div className="ns-view-label">Gửi khi nào</div><div className="ns-view-value">{sendWhenText(vr)}</div>
              <div className="ns-view-label">Trạng thái</div><div className="ns-view-value">{vr.enabled ? 'Bật' : 'Tắt'}{vr.locked ? ' (' + LOCKED_TIP.charAt(0).toLowerCase() + LOCKED_TIP.slice(1) + ')' : ''}</div>
            </div>
            <div className="ns-view-section">Nội dung thông báo</div>
            {vr.contents.map((x) => (
              <div className="ns-recipient" key={x.recipient} data-recipient={x.recipient}>
                <div className="ns-recipient-label">Gửi cho: {x.recipient}</div>
                <div className="ns-title">{withVariableChips(x.title)}</div>
                <div className="ns-body">{withVariableChips(x.body)}</div>
                <ExampleBox code={vr.code} content={x} />
              </div>))}
          </div>}
          <div className="dlg-f">
            <AppButton className="form-btn" onClick={closeView}>Quay lại</AppButton>
            {canEdit && vr && <AppButton className="form-btn form-btn-primary" id="nsXemChinhSua" onClick={() => { const r = vr; closeView(); openEdit(r); }}>Chỉnh sửa</AppButton>}
          </div>
        </AppModal>
        <AppModal id="dlgSuaThongBao" open={!!row} onClose={closeEdit} labelledBy="dlgSuaThongBaoTieuDe" dlgStyle={{ width: '1080px', maxWidth: 'calc(100vw - 40px)' }}>
          <div className="dlg-h"><h3 id="dlgSuaThongBaoTieuDe" className="dlg-t">Sửa thông báo</h3><DialogCloseButton onClick={closeEdit} /></div>
          {row && d && <div className="dlg-b ns-dlg">
            <div className="ns-view">
              <div className="ns-view-label">Mã thông báo</div><div className="ns-view-value ns-code">{row.code}</div>
              <div className="ns-view-label">Tên thông báo</div><div className="ns-view-value">{row.name}</div>
              <div className="ns-view-label">Nhóm</div><div className="ns-view-value">{groupTitle}</div>
              <div className="ns-view-label">Gửi cho</div><div className="ns-view-value">{row.recipients}</div>
              <div className="ns-view-label">Thao tác kích hoạt</div><div className="ns-view-value">{row.trigger}</div>
              {row.immediateOnly && <><div className="ns-view-label">Gửi khi nào</div><div className="ns-view-value">{SEND_TYPE_LABELS.IMMEDIATE}</div></>}
            </div>
            <div className="form-grid">
              {!row.immediateOnly && <div className="field span-6">
                <label className="field-label" htmlFor="nsGuiKhi">Gửi khi nào<span className="required-mark">*</span></label>
                <AppSelect id="nsGuiKhi" value={d.sendType} options={sendTypeOptions(row)} showSearch={false} allowClear={false} status={errors.sendType ? 'error' : undefined}
                  onChange={(v) => setField('sendType', v)} />
                {err('sendType')}
              </div>}
              {timed && <div className="field span-6">
                <label className="field-label" htmlFor="nsMoc">Mốc thời gian<span className="required-mark">*</span></label>
                <div className="ns-offset">
                  <input id="nsMoc" className={'text-input' + (errors.offset ? ' input-border-error' : '')} type="number" min="1" step="1" value={d.offset}
                    onChange={(e) => setField('offset', e.target.value)} />
                  <AppSelect id="nsDonVi" width={96} value={d.unit} options={TIME_UNITS.map((u) => ({ value: u.value, label: u.label }))} showSearch={false} allowClear={false}
                    onChange={(v) => setField('unit', v)} />
                  <span className="ns-anchor">{(d.sendType === 'BEFORE' ? 'trước ' : 'sau ') + TIME_ANCHOR}</span>
                </div>
                {err('offset')}{err('unit')}
              </div>}
              {row.holdHours != null && <div className="field span-6">   {/* */}
                <label className="field-label" htmlFor="nsGiuCho">Số giờ giữ chỗ<span className="required-mark">*</span></label>
                <div className="ns-offset">
                  <input id="nsGiuCho" className={'text-input' + (errors.holdHours ? ' input-border-error' : '')} type="number" min="1" step="1" value={d.holdHours}
                    onChange={(e) => setField('holdHours', e.target.value)} />
                  <span className="ns-anchor">giờ kể từ lúc từ chối</span>
                </div>
                {err('holdHours')}
              </div>}
              <div className="ns-compose span-12">
              <div className="ns-compose-fields">
              {d.contents.map((x, i) => (
                <div className="ns-recipient span-12" key={x.recipient} data-recipient={x.recipient}>
                  <div className="ns-recipient-label">Gửi cho: {x.recipient}</div>
                  <div className="field">
                    <label className="field-label" htmlFor={'nsTieuDe' + i}>Tiêu đề thông báo<span className="required-mark">*</span></label>
                    <AppCounterInput id={'nsTieuDe' + i} counterId={'nsDemTieuDe' + i} ref={(el) => { fieldRefs.current['title' + i] = el; }} onFocus={() => { lastFocused.current = 'title' + i; }} className={errors['title' + i] ? 'input-border-error' : ''} maxLength={TITLE_MAX} value={x.title} onChange={(e) => setContent(i, 'title', e.target.value)} />
                    {err('title' + i)}
                  </div>
                  <div className="field">
                    <label className="field-label" htmlFor={'nsNoiDung' + i}>Nội dung thông báo<span className="required-mark">*</span></label>
                    <AppCounterInput multiline id={'nsNoiDung' + i} counterId={'nsDemNoiDung' + i} ref={(el) => { fieldRefs.current['body' + i] = el; }} onFocus={() => { lastFocused.current = 'body' + i; }} className={errors['body' + i] ? 'input-border-error' : ''} rows={4} maxLength={BODY_MAX} value={x.body} onChange={(e) => setContent(i, 'body', e.target.value)} error={err('body' + i)} />
                  </div>
                  <ExampleBox code={row.code} content={x} />
                </div>))}
              </div>
              <aside className="ns-vars" id="nsBienThayThe" aria-label="Biến thay thế">
                <div className="ns-vars-title">Biến thay thế</div>
                <div className="ns-vars-hint">Bấm để chèn vào vị trí con trỏ</div>
                <div className="ns-vars-list">{variablesOf(row.code).map((v) => (
                  <button type="button" className="ns-var-chip" key={v} data-var={v} data-no-tooltip onMouseDown={(e) => e.preventDefault()} onClick={() => insertVariable(v)}>
                    <span className="ns-var">{'{' + v + '}'}</span><span className="ns-var-name">{TEMPLATE_VARIABLES[v]}</span>
                  </button>))}</div>
              </aside>
              </div>
              <div className="field span-12">
                <label className="field-label">Trạng thái</label>
                <span className={'ns-switch' + (row.locked ? ' is-locked' : '')} data-tip={row.locked ? LOCKED_TIP : undefined}>
                  <Switch id="nsTrangThai" checked={row.locked ? true : d.enabled} disabled={!!row.locked} aria-label="Trạng thái thông báo" onChange={(on) => setField('enabled', on)} />
                  <span className="ns-switch-text">{(row.locked || d.enabled) ? 'Bật' : 'Tắt'}</span>
                </span>
              </div>
            </div>
          </div>}
          <div className="dlg-f">
            <AppButton className="form-btn" onClick={closeEdit}>Hủy</AppButton>
            <AppButton className="form-btn form-btn-primary" id="nsLuu" onClick={() => save()}>Lưu</AppButton>
          </div>
        </AppModal>
        </>
      }>
      <div className="ns-page">
        <div className="page-head">
          <div className="page-head-text">
            <h1 id="tieuDe">{SCREEN}</h1>
          </div>
        </div>
        <AppTabs activeKey={tab} onChange={setTab} items={items} />
      </div>
    </AppLayout>
  );
}
