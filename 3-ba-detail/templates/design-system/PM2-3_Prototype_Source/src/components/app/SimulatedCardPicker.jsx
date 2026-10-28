/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Bảng chọn thẻ giả lập — bấm «Giả lập quẹt thẻ» thì chọn 1 thân nhân mẫu thay cho đầu đọc thẻ.
 * Mỗi thân nhân kèm người cai nghiện và kết quả điều kiện thăm gặp, để người test chọn đúng ca cần thử. Dùng chung ở Tạo lịch hẹn và Đăng ký tại quầy */
import { RELATIVES } from '@/data/legacyData';
import { checkVisitEligibility } from '@/lib/visitEligibility';
import { RichText } from '@/lib/richText';
import { AppButton } from '@/components/app/AppButton';
import AppTable from '@/components/app/AppTable';

/* popup đủ rộng để đọc trọn lý do điều kiện, không cuộn ngang — đặt thẳng lên khung popup nên màn nào mở cũng như nhau */
export const PICKER_DIALOG_STYLE = { width: 'min(1200px, 94vw)', maxWidth: 'none' };

const COLUMNS = (onPick) => [
  { key: 'citizenId', title: 'Số căn cước', render: (r) => <b>{r.citizenId}</b> },
  { key: 'fullName', title: 'Thân nhân', render: (r) => <><b>{r.fullName}</b><div className="status-note">{r.phoneNumber}</div></> },
  { key: 'students', title: 'Người cai nghiện · điều kiện thăm gặp', className: 'cell-wrap', render: (r) => (r.students || []).map((st) => {
    const c = checkVisitEligibility(st);
    return (
      <div key={st.studentCode || st.fullName} className="status-note">
        <b>{st.fullName}</b>{' — ' + (st.studentCode || '') + ': '}
        {c.ok ? 'Đủ điều kiện thăm gặp' : <><b>{'Điều kiện ' + c.condition}</b>{' · '}<RichText text={c.reason} /></>}
      </div>
    );
  }) },
  { key: 'pick', title: '', render: (r) => <AppButton className="form-btn form-btn-primary" onClick={() => onPick(r.citizenId)}>Chọn</AppButton> },
];

export default function SimulatedCardPicker({ onPick }) {
  return <AppTable tableClassName="people-table card-picker-table" tableId="bangTheGiaLap" rowKey="citizenId" columns={COLUMNS(onPick)} dataSource={RELATIVES} />;
}
