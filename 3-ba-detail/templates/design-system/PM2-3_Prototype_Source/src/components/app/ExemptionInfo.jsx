/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Đơn ngoại lệ dạng XEM (nhãn · giá trị) — 1 nguồn nhãn và thứ tự cho màn Sửa, Xem, popup gửi duyệt lại.
 * Thứ tự và chữ nhãn lấy NGUYÊN theo màn Tạo (Đăng ký tại quầy · blocks.jsx ExemptionCard + bước 2).
 * info: kết quả exemptionInfoOf (data/exemptionResend.js) */
import { sizeText } from '@/components/app/AttachmentField';
import AppLink from '@/components/app/AppLink';
import '@/components/app/AttachmentField.css';
import './ExemptionInfo.css';

const Empty = () => <span style={{ color: 'var(--color-ink-4)' }}>—</span>;

/* Thân nhân đi cùng: mỗi người 1 dòng — họ tên, căn cước, quan hệ (nhãn cột theo màn Tạo) */
export function CompanionView({ list }) {
  if (!list || !list.length) return <Empty />;
  return (
    <table className="people-table exempt-companion-view">
      <thead><tr><th>Họ tên thân nhân</th><th>Số căn cước công dân</th><th>Quan hệ với người cai nghiện</th></tr></thead>
      <tbody>{list.map((c, i) => <tr key={i}><td>{c.name || '—'}</td><td>{c.citizenId || '—'}</td><td>{c.relationship || '—'}</td></tr>)}</tbody>
    </table>
  );
}
/* A1: chế độ Xem cho tải tệp đính kèm về, theo Design System PM1 — tên tệp là liên kết kèm icon tải về.
 * Prototype không lưu tệp thật (AttachmentField chỉ giữ tên và dung lượng) ⇒ bấm thì tải 1 tệp mẫu cùng tên. Quyền tải: ai xem được màn Chi tiết thì tải được (trả lời 19/10/2026). */
const ICON_DOWNLOAD = '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>';
const sampleUrl = (f) => URL.createObjectURL(new Blob(['Tệp mẫu Prototype PM2 — ' + f.name + ' (' + sizeText(f.size || 0) + ')'], { type: 'text/plain;charset=utf-8' }));
export function AttachmentView({ list }) {
  if (!list || !list.length) return <Empty />;
  return <ul className="attach-list">{list.map((f, i) => <li key={f.name + i}>
    <span className="attach-name"><AppLink className="app-link attach-download" href="#" download={f.name} title={'Tải về ' + f.name} aria-label={'Tải về ' + f.name}
      onClick={(e) => { e.currentTarget.href = sampleUrl(f); }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICON_DOWNLOAD }} />{f.name}</AppLink></span>
    <span className="attach-size">{sizeText(f.size || 0)}</span></li>)}</ul>;
}

/* hàng của đơn — ĐÚNG thứ tự màn Tạo. skip: nhãn đang là ô nhập ở màn gọi (vd Lý do xin duyệt, Tài liệu đính kèm ở màn Sửa) */
export function exemptionRows(info, skip = []) {
  const student = [info.studentName, info.studentCode].filter(Boolean).join(' — ');
  return [
    ['Họ tên thân nhân', info.visitorName],
    ['Số căn cước công dân', info.visitorCitizenId],
    ['Số điện thoại', info.visitorPhone],
    ['Người cai nghiện được thăm', student],
    ['Quan hệ với người cai nghiện', info.relationship],
    ['Thân nhân đi cùng', <CompanionView list={info.companions} />],
    ['Lý do xin duyệt', info.exemptionReason],
    ['Tài liệu đính kèm', <AttachmentView list={info.attachments} />],
  ].filter((r) => skip.indexOf(r[0]) < 0);
}
/* thông tin bước 2 — thứ tự màn Tạo: Loại hình · Dãy nhà · Quầy · Ngày · Khung giờ · Buồng */
export const scheduleRows = (info) => [
  ['Loại hình thăm gặp', info.visitTypeName], ['Dãy nhà', info.dormitoryName], ['Quầy tiếp đón', info.counterName],
  ['Ngày thăm gặp', info.visitDayLabel], ['Khung giờ', info.timeSlotLabel], ['Buồng thăm gặp', info.tableCode],
];

/* khối nhãn · giá trị, cùng lớp .adjust của màn Chi tiết */
export function ExemptionInfoGrid({ id, rows }) {
  return (
    <div className="adjust exempt-info" id={id}>
      {rows.map(([label, value]) => [
        <div className="adjust-label" key={label + 'l'}>{label}</div>,
        <div className="adjust-value" key={label + 'v'}>{value === '' || value == null ? <Empty /> : value}</div>,
      ])}
    </div>
  );
}

/* Kết quả đối chiếu giấy tờ từng người (bước 3 màn Tạo) — bảng của màn Chi tiết */
export function DocumentCheckTable({ id, checks }) {
  return (
    <table className="people-table exempt-check-view" id={id}>
      <thead><tr><th>Thân nhân</th><th>Vai trò</th><th>Kết quả</th><th>Thời điểm</th><th>Cán bộ quầy</th></tr></thead>
      <tbody>{checks.map((v, i) => (
        <tr key={i}><td>{v.fullName}</td><td>{v.isRegistrant ? 'Thân nhân đăng ký' : 'Thân nhân đi cùng'}</td><td>{v.result}</td><td>{v.at}</td><td>{v.by}</td></tr>))}</tbody>
    </table>
  );
}

/* Lộ trình duyệt — mỗi lần gửi duyệt 1 khối «Lần n», lần hiện tại cuối cùng.
 * rounds: roundsOf(record) (data/exemptionResend.js) · exemption: đơn ngoại lệ thì có Lý do xin duyệt, Tài liệu đính kèm · statusNode(code): thẻ trạng thái của lần hiện tại */
export function ApprovalRounds({ rounds, exemption, statusNode }) {
  return (
    <div className="approval-rounds">
      {rounds.map((x, i) => {
        const rows = [
          ...(exemption ? [['Lý do xin duyệt', x.requestReason], ['Tài liệu đính kèm', <AttachmentView list={x.attachments} />]] : []),
          ...(x.isCurrent ? [['Trạng thái', statusNode ? statusNode(x.status) : x.status]] : []),
          ...(x.rejectReason || !x.isCurrent ? [['Lý do từ chối', x.rejectReason], ['Người duyệt', x.rejectedBy], ['Thời điểm', x.rejectedAt]] : []),
        ];
        return (
          <div className="approval-round" key={i} data-lan={i + 1}>
            <div className="section-title">{'Lần ' + (i + 1)}</div>
            <ExemptionInfoGrid id={'dcLanDuyet' + (i + 1)} rows={rows} />
          </div>
        );
      })}
    </div>
  );
}
