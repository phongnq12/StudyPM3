/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Hộp «Hủy lịch hẹn» dùng chung cho Danh sách lịch hẹn và Chi tiết lịch hẹn — cùng 1 thao tác thì cùng 1 hộp.
 * Nội dung lấy nguyên từ hộp dlgHuy của Danh sách: lý do hủy (bắt buộc) · hệ quả theo lý do · ghi chú (bắt buộc, 1000 ký tự) · gửi thông báo cho thân nhân.
 * Nút xác nhận đỏ đặc: hành động phá hủy chỉ dùng đỏ đặc ở bước xác nhận cuối.
 * Danh sách lý do: dữ liệu khởi tạo WEB-38 tại BRD-WEB-03a mục 4.3, giữ thêm «Lý do phát sinh khác»,
 * thêm 2 lý do do cơ sở của («Buồng / Quầy ngừng hoạt động» · «Thay đổi khung giờ thăm gặp»).
 * · Bỏ TN_KHONGDEN: BRD-WEB-03a ghi «Không cho cán bộ chọn thủ công» (hệ thống tự sinh khi quá giờ hẹn).
 * · Hoàn quỹ: hủy LUÔN hoàn lượt, không phụ thuộc lý do — cột Hoàn quỹ của BRD không áp dụng.
 * · Hạn hủy tối thiểu: theo BRD. Lý do đã quá hạn hủy thì không chọn được (F11). Bỏ F09 Tính ngưỡng hủy quá mức. */
import { useEffect, useState } from 'react';
import AppModal from '@/components/app/AppModal';
import { AppButton } from '@/components/app/AppButton';
import DialogCloseButton from '@/components/app/DialogCloseButton';
import AppSearchSelect from '@/components/app/AppSearchSelect';
import { Svg } from '@/lib/icons';
import './CancelAppointmentDialog.css';
import DialogIcon from '@/components/app/DialogIcon';
import { msg, msgParts } from '@/lib/msg';
import NotifyRecipientsField from './NotifyRecipientsField';
import AppCounterInput from './AppCounterInput';   /* ô có bộ đếm dùng chung «n / max» */   /* thay ô tích «Gửi thông báo cho thân nhân» (sửa) */
import { defaultRecipients, notifyMissing } from '@/data/notificationStore';
import NoteBox from './NoteBox';   /* Lưu ý hoàn lượt thay khối Hệ quả */
import { NOTIFICATION_CODES } from '@/data/notificationSettingsStore';

/* [mã, tên hiển thị, bên hủy, tính vào ngưỡng hủy quá mức, hạn hủy tối thiểu trước giờ hẹn (giờ)]
 * Cột 4 và cột 5 giữ trong dữ liệu nhưng KHÔNG còn ai đọc: ngưỡng hủy đã bỏ nên hạn hủy F11 cũng bỏ — hủy lúc nào cũng chọn được mọi lý do */
export const CANCEL_REASON_ROWS = [
  ['TN_BANVIEC', 'Thân nhân bận việc đột xuất', 'Thân nhân', true, 24],
  ['TN_OMDAU', 'Thân nhân ốm đau', 'Thân nhân', false, 0],
  ['TN_PHUONGTIEN', 'Thân nhân không sắp xếp được phương tiện', 'Thân nhân', true, 12],
  ['NN_OMDAU', 'Người nghiện ốm đau, đang điều trị', 'Cán bộ cơ sở', false, 0],
  ['NN_KYLUAT', 'Người nghiện đang bị kỷ luật, hạn chế liên lạc', 'Cán bộ cơ sở', false, 0],
  ['CS_DOTXUAT', 'Cơ sở có công việc đột xuất', 'Cán bộ cơ sở', false, 0],
  ['CS_SUCO', 'Sự cố tại phân khu hoặc buồng gọi', 'Cán bộ cơ sở', false, 0],
  ['CS_THIENTAI', 'Thiên tai, dịch bệnh, tình huống bất khả kháng', 'Cán bộ cơ sở', false, 0],
  /* 2 giá trị do cơ sở thêm vào danh mục C04. Mã CS_NGUNGQUAY, CS_DOIKHUNGGIO do AI đặt — nguồn chỉ có tên hiển thị */
  ['CS_NGUNGQUAY', 'Buồng / Quầy ngừng hoạt động', 'Cán bộ cơ sở', false, 0],
  ['CS_DOIKHUNGGIO', 'Thay đổi khung giờ thăm gặp', 'Cán bộ cơ sở', false, 0],
  ['KHAC', 'Lý do khác', 'Cán bộ cơ sở', false, 0],
  ['PHATSINH_KHAC', 'Lý do phát sinh khác', 'Cán bộ cơ sở', false, 0],
];
export const CANCEL_REASONS = [['', '— Chọn lý do —']].concat(CANCEL_REASON_ROWS.map((x) => [x[0], x[1]]));
const WARNING_ICON = '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>';


export const cancelReasonLabel = (value) => (CANCEL_REASONS.find((x) => x[0] === value) || ['', ''])[1];

/**
 * Thuộc tính của CancelAppointmentDialog (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {boolean} props.open - Bật thì hiện hộp hủy lịch hẹn, mỗi lần mở xóa trắng lý do, ghi chú, lỗi và nạp lại người nhận thông báo.
 * @param {function} props.onClose - Gọi khi người dùng bấm Hủy, nút X, nhấn Esc hoặc bấm ra nền.
 * @param {function} props.onConfirm - Gọi khi hợp lệ, nhận object gồm `reason`, `reasonLabel`, `note`, `recipients` và `withProposal`.
 * @param {array} props.records - Các lịch hẹn đang hủy, dùng để nạp người nhận thông báo mặc định và kiểm thiếu người nhận.
 */
export default function CancelAppointmentDialog({ open, onClose, onConfirm, records = [] }) {
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [recipients, setRecipients] = useState({});
  const [errors, setErrors] = useState({});
  useEffect(() => { if (open) { setReason(''); setNote(''); setRecipients(defaultRecipients(NOTIFICATION_CODES.CANCELLED, records)); setErrors({}); } }, [open]);   /* nạp người chuẩn theo luồng */
  const options = CANCEL_REASONS.map(([value, label]) => ({ value, label }));
  const confirm = (withProposal) => {
    if (!reason) { setErrors({ lyDoLoi: msg('E001-02', 'lý do hủy') }); (document.getElementById('lyDo').parentElement.querySelector('.lookup-input') || document.getElementById('lyDo')).focus(); return; }
    if (!note.trim()) { setErrors({ huyGhiChuLoi: msg('E001-01', 'ghi chú') }); document.getElementById('huyGhiChu').focus(); return; }
    if (notifyMissing(NOTIFICATION_CODES.CANCELLED, records, recipients).length) return;
    onConfirm({ reason, reasonLabel: cancelReasonLabel(reason), note: note.trim(), recipients, withProposal: withProposal === true });   /* trả lý do, ghi chú, người nhận thông báo cho nơi gọi gửi và lưu */
  };
  const err = (id) => <span className={'field-error' + (errors[id] ? ' on' : '')} id={id}>{errors[id] || ''}</span>;
  return (
    <AppModal id="dlgHuy" open={open} onClose={onClose} dlgClassName="dlg dlg-notify">
      <div className="dlg-h"><h3 className="dlg-t"><DialogIcon level="danger" />{msgParts('C001-14').title}</h3><DialogCloseButton onClick={onClose} /></div>
      <div className="dlg-b">
        <div className="fld">
          <label>Lý do hủy<span className="required-mark">*</span></label>
          <AppSearchSelect id="lyDo" value={reason} hasErrorBorder={!!errors.lyDoLoi} onChange={(v) => { setReason(v); setErrors({}); }} options={options} />
          {err('lyDoLoi')}
        </div>
        {/* hoàn lượt là lưu ý, không phải hệ quả của lý do ⇒ 1 dòng Lưu ý; hủy luôn hoàn lượt nên hiện với mọi lý do */}
        <NoteBox id="hq" line="Hệ thống sẽ hoàn lại lượt thăm gặp tuần này cho người cai nghiện" />
        <div className="fld"><label>Ghi chú<span className="required-mark">*</span></label>
          <AppCounterInput multiline className={'ta' + (errors.huyGhiChuLoi ? ' input-border-error' : '')} id="huyGhiChu" counterId="demHuyGhiChu" maxLength={1000} placeholder="Nhập ghi chú cho lần hủy lịch hẹn này…" value={note} onChange={(e) => { setNote(e.target.value); setErrors({}); }} error={err('huyGhiChuLoi')} /></div>
        <NotifyRecipientsField id="huyNhanTB" code={NOTIFICATION_CODES.CANCELLED} records={records} value={recipients} onChange={setRecipients} />
      </div>
      <div className="dlg-f">
        {/* MSG-CF: nút đóng «Hủy» · nút thao tác «Xác nhận hủy lịch hẹn» để 2 chữ Hủy không đứng trần cạnh nhau */}
        <AppButton className="btn" onClick={onClose}>{msgParts('C001-14').cancel}</AppButton>
        <AppButton className="btn" id="btnXl" style={{ display: reason.indexOf('CS_') === 0 ? 'inline-flex' : 'none' }} onClick={() => confirm(true)}>Hủy và đề xuất lịch thay thế</AppButton>
        <AppButton className="btn btn-danger" id="nutXacNhanHuy" onClick={() => confirm(false)}>{msgParts('C001-14').ok}</AppButton>
      </div>
    </AppModal>
  );
}
