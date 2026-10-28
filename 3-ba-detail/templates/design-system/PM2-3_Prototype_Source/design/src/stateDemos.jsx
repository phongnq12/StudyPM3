/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* stateDemos.jsx — nhóm «Trạng thái theo thao tác» của site Design System (14/10/2026).
 * Mẫu cho lớp CSS dùng chung CHỈ HIỆN khi có dữ liệu hoặc thao tác (cổng_DesignCoverage.cjs đọc mã nguồn bắt được, DOM lúc đo không thấy).
 * Gọi thẳng hàm, hằng, component thật của màn; chỗ màn dựng markup ngay trong JSX thì chép nguyên markup, ghi rõ file nguồn ở «Cách dùng».
 * Tách file riêng để không sửa chồng catalog.jsx khi nhiều phiên cùng làm. Tên tiếng Anh (luật). */
import { useEffect, useRef } from 'react';
import { AppButtonWithIcon } from '@/components/app/AppButton';
import AppTag from '@/components/app/AppTag';
import AppTable from '@/components/app/AppTable';
import AppCounterInput from '@/components/app/AppCounterInput';
import AppointmentStatusTag from '@/components/app/AppointmentStatusTag';
import { Svg } from '@/lib/icons';
import { RichText } from '@/lib/richText';
import { msg, msgParts } from '@/lib/msg';
import { RELATIONSHIP_TAG_CLASS, MAX_VISITORS, OVER_LIMIT_WARNING } from '@/pages/AppointmentList/listLogic';
import { monthHtml } from '@/pages/AppointmentList/widgets';
import { createVisitDatePicker } from '@/pages/AppointmentForm/visitDatePicker';
import { STATUS_CLASS as FORM_STATUS_CLASS } from '@/pages/AppointmentForm/formConfig';
import { statusLabel } from '@/data/appointmentStore';
import { ACCOUNTS } from '@/data/accountStore';
import HistoryTable from '@/pages/ReceptionDeskShared/HistoryTable';

/* AppointmentList.jsx WARNING_ICON (icon tam giác cảnh báo cột Số người) */
const WARNING_ICON = '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>';

function StateTagsDemo() {
  const rel = [...new Set(Object.values(RELATIONSHIP_TAG_CLASS))].map((c) => [c, Object.keys(RELATIONSHIP_TAG_CLASS).find((k) => RELATIONSHIP_TAG_CLASS[k] === c)]);
  return <div className="sd-col">
    <div className="sd-label">Tình trạng khen thưởng, kỷ luật (popup Xem chi tiết ở màn Chi tiết lịch hẹn)</div>
    <div className="sd-row">
      <span><span className="tag-applied">Đã áp dụng tuần này (42)</span><div className="tag-applied-sub">Không dùng lại được ở tuần khác</div></span>
      <span><span className="tag-applied tag-discipline">Đang áp dụng · tuần 1/2</span><div className="tag-applied-sub">Còn 1 tuần bị trừ</div></span>
      <span><span className="tag-applied tag-expired">Đã hết kỷ luật</span><div className="tag-applied-sub">Đã áp dụng xong 2/2 tuần</div></span>
    </div>
    <div className="sd-label">Tag quan hệ thân nhân (mỗi nhóm quan hệ 1 màu)</div>
    <div className="sd-row">{rel.map(([c, k]) => <AppTag key={c} className={'tag ' + c}>{k}</AppTag>)}</div>
    <div className="sd-label">Tag trạng thái trên form Tạo, Sửa lịch hẹn</div>
    <div className="sd-row">{Object.keys(FORM_STATUS_CLASS).map((s) => <span key={s} className={'tag-status ' + FORM_STATUS_CLASS[s]}>{statusLabel(s)}</span>)}</div>
  </div>;
}

function OverLimitDemo() {
  const n = MAX_VISITORS + 1;
  return <span className="visitor-count"><span className="ic-over-limit" data-nhac={OVER_LIMIT_WARNING.replace('{0}', n).replace('{1}', n - MAX_VISITORS).replace('{2}', MAX_VISITORS)}><Svg raw={WARNING_ICON} /></span>{n}</span>;
}

function SelectableTableDemo() {
  const columns = [{ key: 'code', title: 'Mã quầy', render: (r) => r.code }, { key: 'name', title: 'Tên quầy', render: (r) => r.name }];
  const rows = [{ code: 'Q01', name: 'Quầy tiếp đón số 1' }, { code: 'Q02', name: 'Quầy tiếp đón số 2' }];
  return <div className="sd-scroll-x"><AppTable rowKey="code" columns={columns} dataSource={rows} rowSelection={{ selectedRowKeys: ['Q01'], onChange: () => {} }} /></div>;
}

/* Lịch khoảng ngày đang mở, đã chọn từ ngày 10 đến ngày 16 tháng này — gọi monthHtml thật của DateRange (widgets.jsx), hiện tĩnh trong khối */
function RangeCalendarDemo() {
  const now = new Date(), left = new Date(now.getFullYear(), now.getMonth(), 1);
  const cal = { open: true, side: 'from', from: new Date(left.getFullYear(), left.getMonth(), 10), to: new Date(left.getFullYear(), left.getMonth(), 16), hover: null, left };
  return <div className="calendar is-open" style={{ position: 'static', display: 'inline-flex' }}
    dangerouslySetInnerHTML={{ __html: monthHtml(cal, left, true) + monthHtml(cal, new Date(left.getFullYear(), left.getMonth() + 1, 1), false) }} />;
}

/* Bong bóng chú thích chữ bị cắt — khuôn của installTooltip trong lib/legacyUi.js: .tooltip + .placement-top|bottom > .tooltip-text */
function TooltipDemo() {
  const text = 'Thân nhân mang theo giấy tờ tuỳ thân và giấy xác nhận tạm trú bản gốc khi đến quầy tiếp đón';
  return <div className="sd-row">{['placement-top', 'placement-bottom'].map((pl) => <div key={pl} className={'tooltip is-visible ' + pl} style={{ position: 'relative' }}><span className="tooltip-text">{text}</span></div>)}</div>;
}

function LookupNotFoundDemo() {
  return <div className="sd-col">
    <div className="lookup-not-found"><div className="lookup-not-found-title"><RichText text={msg('E001-11', 'thân nhân')} /></div></div>
    <div className="lookup-not-found"><div className="lookup-not-found-desc">{msg('I001-76', 'Nguyễn Văn X')}</div></div>
  </div>;
}

/* Lịch chọn ngày thăm: gọi createVisitDatePicker thật rồi chuyển khung lịch (gắn ở body) vào khối mẫu, hiện tĩnh */
function VisitDatePickerDemo() {
  const box = useRef(null);
  useEffect(() => {
    const picker = createVisitDatePicker({ getDate: () => new Date(), onPick: () => {} });
    picker.open();
    const el = document.querySelector('body > .date-picker');
    if (el && box.current) { box.current.appendChild(el); el.style.position = 'static'; el.style.display = 'block'; }
    return () => { if (el) el.remove(); };
  }, []);
  return <div ref={box} />;
}

/* Bộ đếm ký tự sắp chạm trần (≥ 90%): màn Đăng ký tại quầy bật lớp is-near-limit lên bộ đếm của AppCounterInput (engine.js) */
function NearLimitDemo() {
  useEffect(() => { const c = document.getElementById('sdDemGanTran'); if (c) c.classList.add('is-near-limit'); });
  return <AppCounterInput multiline className="ta" aria-label="Ghi chú" counterId="sdDemGanTran" maxLength={100} defaultValue={'Thân nhân mang theo giấy tờ tuỳ thân và giấy xác nhận tạm trú bản gốc'.padEnd(92, '.')} />;
}

function BulkConfirmDemo() {
  const codes = ['LH-2026-0914', 'LH-2026-0915', 'LH-2026-0916'];
  return <div className="dlg-b"><div className="bulk-confirm"><RichText text={msgParts('C001-15', codes.length, statusLabel('PENDING_APPROVAL')).body} />
    <div className="bulk-confirm-codes">{codes.join(' · ')}</div>Lý do phê duyệt bên dưới áp dụng chung cho cả {codes.length} lịch hẹn.</div></div>;
}

function StatusBarDemo() {
  return <div className="status-bar">
    <AppButtonWithIcon className="page-head-back" title="Quay lại danh sách" aria-label="Quay lại" icon="back" />
    <div className="dt-chu"><div className="dt-row1"><h2 className="dt-title">Lịch hẹn <span>LH-2026-0914</span></h2><AppointmentStatusTag status="APPROVED" /></div></div>
  </div>;
}

/* Góc tài khoản đang mở «Đăng nhập tài khoản khác» + chuông có số chưa đọc — AppLayout.jsx, NotificationBell.jsx */
function HeaderStatesDemo() {
  return <div style={{ background: '#B91C1C', borderRadius: 8, padding: '10px 16px', minHeight: 260, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', gap: 16 }}>
    <div className="bell" role="button" aria-label="Thông báo"><Svg name="bell" linejoin={null} /><span className="bell-dot">3</span></div>
    <div className="acct is-open">
      <div className="acct-av">{ACCOUNTS[0].initials}</div>
      <div><div className="acct-n">{ACCOUNTS[0].name}</div><div className="acct-r">{ACCOUNTS[0].role}</div></div>
      <Svg raw={'<path d="m6 9 6 6 6-6"/>'} className="acct-car" />
      <div className="acct-menu" role="menu">
        <button type="button" className="acct-mi" role="menuitem"><Svg raw={'<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="m10 17 5-5-5-5"/><path d="M15 12H3"/>'} />Đăng nhập tài khoản khác</button>
        {ACCOUNTS.slice(1).map((a) => <button type="button" key={a.key} className="acct-mi acct-mi-account" role="menuitem"><span className="acct-mi-av">{a.initials}</span><span><b>{a.name}</b><br /><small>{a.role}</small></span></button>)}
      </div>
    </div>
  </div>;
}

/* Mốc lịch sử do Hệ thống · Tự động: hiện rút gọn .tl-item.is-auto + nhãn .tl-auto, chi tiết gập sau nút Xem chi tiết — HistoryTable.jsx */
const AUTO_HISTORY = [
  { at: '10/10/2026 08:30:10', actorName: 'Lê Văn Hùng', actorRole: 'Trưởng cơ sở', action: 'Phê duyệt', statusBefore: 'PENDING', statusAfter: 'APPROVED', changes: [], reason: '' },
  { at: '10/10/2026 18:00:00', actorName: 'Hệ thống', actorRole: 'Tự động', action: 'Hủy lịch', statusBefore: 'APPROVED', statusAfter: 'CANCELLED', changes: [], reason: 'Quá giờ hẹn mà thân nhân chưa check-in' },
];
const AUTO_STATUS = { PENDING: ['pending', 'Chờ duyệt'], APPROVED: ['approved', 'Đã duyệt'], CANCELLED: ['cancelled', 'Đã hủy'] };
function HistoryAutoDemo() {
  return <div className="sd-col-wide"><HistoryTable history={AUTO_HISTORY} renderStatus={(s) => <AppTag className={'tag tag-dot tag-' + AUTO_STATUS[s][0]}>{AUTO_STATUS[s][1]}</AppTag>} /></div>;
}

/* Thanh chân form ẩn: giữ nút cho engine, có khoảng đẩy .form-footer-spacer — CounterRegistration.jsx */
function HiddenFooterDemo() {
  return <div className="sd-col-wide"><div className="sd-muted">Trong khung trang, thanh này bị ẩn (1 thanh nút duy nhất ở đầu màn). Mẫu đặt ngoài khung để xem bố cục.</div>
    <div className="form-footer" style={{ display: 'flex' }}><AppButtonWithIcon className="form-btn">Quay lại</AppButtonWithIcon><div className="form-footer-spacer" /><AppButtonWithIcon className="form-btn form-btn-primary">Tiếp tục</AppButtonWithIcon></div></div>;
}

export const STATE_ITEMS = [
  { id: 'state-tags', name: 'Tag theo tình trạng: khen thưởng, kỷ luật, quan hệ, trạng thái form', aliases: 'tag applied discipline expired relationship quan hệ kỷ luật khen thưởng tag-status', rules: ['UX-A3'], demo: () => <StateTagsDemo />,
    code: "// AppointmentDetail.jsx: <span className=\"tag-applied tag-discipline\">…</span><div className=\"tag-applied-sub\">…</div>\n// listLogic.js RELATIONSHIP_TAG_CLASS · formConfig.js STATUS_CLASS (tag-status is-pending · is-approved · is-running · is-cancelled · is-closed)" },
  { id: 'over-limit', name: 'Cảnh báo vượt số người trong ô bảng', aliases: 'visitor count over limit vượt số người cảnh báo', rules: [], demo: () => <OverLimitDemo />,
    code: "// AppointmentList.jsx cột Số người: <span className=\"visitor-count\"><span className=\"ic-over-limit\" data-nhac={OVER_LIMIT_WARNING…}><Svg raw={WARNING_ICON} /></span>{n}</span>" },
  { id: 'select-table', name: 'Bảng có cột ô tích chọn dòng', aliases: 'row selection chọn dòng ô tích col-select', rules: [], demo: () => <SelectableTableDemo />,
    code: '<AppTable rowKey="code" columns={…} dataSource={…} rowSelection={{ selectedRowKeys, onChange }} />  // cột chọn mang lớp col-select' },
  { id: 'range-calendar', name: 'Lịch khoảng ngày đang mở (đã chọn từ ngày, đến ngày)', aliases: 'calendar date range lịch khoảng ngày từ ngày đến ngày', rules: [], demo: () => <RangeCalendarDemo />,
    code: "// widgets.jsx DateRange: lịch 2 tháng vẽ bằng monthHtml(cal, tháng, isLeft) · .calendar-day .is-range-start .is-in-range .is-range-end .is-today · nút ẩn .calendar-nav.is-invisible" },
  { id: 'tooltip-bubble', name: 'Bong bóng chú thích chữ bị cắt', aliases: 'tooltip bong bóng chú thích placement', rules: ['UX-C3'], demo: () => <TooltipDemo />,
    code: "// lib/legacyUi.js installTooltip: <div class=\"tooltip is-visible placement-top|placement-bottom\"><span class=\"tooltip-text\">…</span></div> — tự chọn hướng theo chỗ trống" },
  { id: 'lookup-not-found', name: 'Không tìm thấy khi tra cứu', aliases: 'lookup not found không tìm thấy tra cứu', rules: [], demo: () => <LookupNotFoundDemo />,
    code: "// AppointmentForm.jsx · ExemptionFields.jsx: <div className=\"lookup-not-found\"><div className=\"lookup-not-found-title\">{msg('E001-11', …)}</div></div>" },
  { id: 'visit-date-picker', name: 'Lịch chọn ngày thăm', aliases: 'date picker lịch chọn ngày ngày thăm', rules: [], demo: () => <VisitDatePickerDemo />,
    code: "import { createVisitDatePicker } from '@/pages/AppointmentForm/visitDatePicker'  // .date-picker-day · .is-outside · .is-today" },
  { id: 'near-limit', name: 'Bộ đếm ký tự sắp chạm trần', aliases: 'counter near limit bộ đếm ký tự gần trần', rules: ['UX-L7'], demo: () => <NearLimitDemo />,
    code: "// CounterRegistration/engine.js: counter.classList.toggle('is-near-limit', n >= limit * 0.9 && n < limit)" },
  { id: 'bulk-confirm', name: 'Hộp duyệt nhiều lịch cùng lúc', aliases: 'bulk confirm duyệt hàng loạt nhiều lịch', rules: [], demo: () => <BulkConfirmDemo />,
    code: "// AppointmentList.jsx: <div className=\"bulk-confirm\">{msgParts('C001-15', …).body}<div className=\"bulk-confirm-codes\">…</div></div>" },
  { id: 'status-bar', name: 'Thanh trạng thái đầu màn Chi tiết', aliases: 'status bar đầu màn chi tiết lịch hẹn', rules: ['UX-L9'], demo: () => <StatusBarDemo />,
    code: '// AppointmentDetail.jsx: <div className="status-bar"> nút quay lại · .dt-chu (.dt-title + tag trạng thái)' },
  { id: 'header-states', name: 'Chuông có số chưa đọc và menu đổi tài khoản đang mở', aliases: 'bell dot chuông thông báo account menu đổi tài khoản', rules: [], demo: () => <HeaderStatesDemo />,
    code: '// NotificationBell.jsx: <span className="bell-dot">n</span> · AppLayout.jsx: .acct-mi.acct-mi-account > .acct-mi-av' },
  { id: 'history-auto', name: 'Mốc lịch sử do Hệ thống tự động (rút gọn, gập chi tiết)', aliases: 'history auto hệ thống tự động mốc phụ tl-auto is-auto xem chi tiết', rules: [], demo: () => <HistoryAutoDemo />,
    code: "// HistoryTable.jsx (QD-443): actorName 'Hệ thống' hoặc actorRole 'Tự động' ⇒ <li className=\"tl-item … is-auto\"> + <span className=\"tl-auto\">Hệ thống · Tự động</span>, chi tiết gập sau nút Xem chi tiết" },
  { id: 'hidden-footer', name: 'Thanh chân form ẩn (giữ nút cho luồng)', aliases: 'form footer spacer thanh chân ẩn', rules: [], demo: () => <HiddenFooterDemo />,
    code: '<div className="form-footer"><…Quay lại /><div className="form-footer-spacer" /><…Tiếp tục /></div>  // QD-393: .shell .form-footer bị ẩn' },
];
