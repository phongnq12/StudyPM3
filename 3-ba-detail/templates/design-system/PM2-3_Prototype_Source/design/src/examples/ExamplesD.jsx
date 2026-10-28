/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Ví dụ kiểu HeroUI cho notebox, setup-hint, spinner, skeleton, empty-states, confirm, drawer, popover, import-excel, link, kbd. Mỗi ví dụ chạy component thật, code bên dưới khớp đúng phần render. */
import { useState } from 'react';
import NoteBox from '@/components/app/NoteBox';
import SetupHint from '@/components/app/SetupHint';
import AppSpinner from '@/components/app/AppSpinner';
import AppSkeleton from '@/components/app/AppSkeleton';
import AppEmptyState from '@/components/app/AppEmptyState';
import AppModal from '@/components/app/AppModal';
import DialogIcon from '@/components/app/DialogIcon';
import DialogCloseButton from '@/components/app/DialogCloseButton';
import AppDrawer from '@/components/app/AppDrawer';
import AppPopover from '@/components/app/AppPopover';
import AppImportExcel from '@/components/app/AppImportExcel';
import AppLink from '@/components/app/AppLink';
import AppKbd from '@/components/app/AppKbd';
import RelativeDetailBody from '@/components/app/RelativeDetailBody';
import { AppButton, AppButtonWithIcon } from '@/components/app/AppButton';
import { msg, msgParts } from '@/lib/msg';
import { RichText } from '@/lib/richText';
import { linkInMsg } from '@/lib/setupHint';

const box = { border: '1px solid var(--color-line)', borderRadius: 8, background: '#fff', width: '100%', maxWidth: 420 };

/* ---------- notebox ---------- */
function NoteOneItem() { return <NoteBox id="ex-notebox-1" items={['Giờ nghỉ giữa các ca tính bằng phút']} />; }
function NoteBold() {
  return <NoteBox id="ex-notebox-2" items={[
    <><b>Giờ nghỉ giữa các ca:</b> Số phút đệm giữa 2 lịch liên tiếp trên cùng 1 buồng, cài riêng từng thứ, áp dụng chung cho mọi quầy</>,
  ]} />;
}
function NoteTitle() { return <NoteBox id="ex-notebox-3" title="Ghi chú" items={['Đối với các ngày được bật thăm gặp thì bắt buộc có thông tin ít nhất 1 ca']} />; }
function NoteLine() { return <NoteBox id="ex-notebox-4" line="Thông tin giới hạn thời lượng được đồng bộ từ cài đặt tại C04" />; }

/* ---------- setup-hint ---------- */
function HintInline() { return <SetupHint inline id="ex-setup-hint-1" what="buồng thăm gặp" screen="Cài đặt quầy tiếp đón" to="#" />; }
function HintParts() { return <SetupHint id="ex-setup-hint-2" parts={linkInMsg('I001-79', 'khai buồng cho quầy')} to="#" />; }
function HintClick() {
  const [count, setCount] = useState(0);
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <SetupHint id="ex-setup-hint-3" parts={linkInMsg('I001-79', 'khai buồng cho quầy')} to="#" onLinkClick={() => setCount(count + 1)} />
    <span className="sd-muted">Số lần bấm link: {count}</span>
  </div>;
}

/* ---------- spinner ---------- */
function SpinDefault() { return <AppSpinner />; }
function SpinLgText() { return <AppSpinner size="lg" text="Đang tải" />; }
function SpinLabel() { return <AppSpinner size="lg" label="Đang tải nội dung" />; }

/* ---------- skeleton ---------- */
function SkelDefault() { return <div style={{ maxWidth: 420 }}><AppSkeleton /></div>; }
function SkelOne() { return <div style={{ maxWidth: 420 }}><AppSkeleton lines={1} /></div>; }
function SkelLabel() { return <div style={{ maxWidth: 420 }}><AppSkeleton lines={2} label="Đang tải" /></div>; }

/* ---------- empty-states ---------- */
const PLUS = '<path d="M12 5v14M5 12h14"/>';
function EmptyDefault() {
  return <div style={box}><AppEmptyState text={msg('I001-48', 'quầy tiếp đón', 'Tạo mới')} action={<AppButtonWithIcon className="btn btn-primary" iconRaw={PLUS}>Tạo mới</AppButtonWithIcon>} /></div>;
}
function EmptyErrorNoAction() { return <div style={box}><AppEmptyState kind="error" text={msg('SE001-01', 'Tải dữ liệu')} /></div>; }
function EmptyDeletedNoAction() { return <div style={box}><AppEmptyState kind="deleted" text={msg('E001-15', 'Lịch hẹn LH-2026-0914')} /></div>; }

/* ---------- confirm ---------- */
function ConfirmIcons() { return <div className="sd-row"><DialogIcon level="warn" /><DialogIcon level="danger" /></div>; }
function ConfirmClose() {
  const [count, setCount] = useState(0);
  return <div className="sd-row"><DialogCloseButton onClick={() => setCount(count + 1)} /><span className="sd-muted">Số lần bấm: {count}</span></div>;
}
function ConfirmLeave() {
  const [open, setOpen] = useState(false);
  const p = msgParts('C001-03');
  return <>
    <AppButton className="btn" onClick={() => setOpen(true)}>Mở hộp Rời trang</AppButton>
    <AppModal id="ex-confirm-3" open={open} onClose={() => setOpen(false)} labelledBy="ex-confirm-3-title">
      <div className="dlg-h"><h3 id="ex-confirm-3-title" className="dlg-t"><DialogIcon level="warn" />{p.title}</h3><DialogCloseButton onClick={() => setOpen(false)} /></div>
      <div className="dlg-b"><RichText text={p.body} /></div>
      <div className="dlg-f"><AppButton className="btn" onClick={() => setOpen(false)}>{p.cancel}</AppButton><AppButton className="btn btn-primary" onClick={() => setOpen(false)}>{p.ok}</AppButton></div>
    </AppModal>
  </>;
}
function ConfirmDeleteTable() {
  const [open, setOpen] = useState(false);
  const p = msgParts('C001-01', 'buồng thăm gặp', 'Q01-01 — Buồng số 1');
  return <>
    <AppButton className="btn" onClick={() => setOpen(true)}>Mở hộp Xóa buồng</AppButton>
    <AppModal id="ex-confirm-4" open={open} onClose={() => setOpen(false)} labelledBy="ex-confirm-4-title">
      <div className="dlg-h"><h3 id="ex-confirm-4-title" className="dlg-t"><DialogIcon level="danger" />{p.title}</h3><DialogCloseButton onClick={() => setOpen(false)} /></div>
      <div className="dlg-b"><RichText text={p.body} /></div>
      <div className="dlg-f"><AppButton className="btn" onClick={() => setOpen(false)}>{p.cancel}</AppButton><AppButton className="btn btn-danger" onClick={() => setOpen(false)}>{p.ok}</AppButton></div>
    </AppModal>
  </>;
}

/* ---------- drawer ---------- */
function DrawerNoFoot() {
  const [open, setOpen] = useState(false);
  return <>
    <AppButtonWithIcon className="form-btn" icon="view" onClick={() => setOpen(true)}>Mở ngăn kéo</AppButtonWithIcon>
    <AppDrawer open={open} id="ex-drawer-1" title="Thông tin nhanh" onClose={() => setOpen(false)}>Nội dung xem nhanh của 1 bản ghi, không rời màn danh sách.</AppDrawer>
  </>;
}
const RELATIVE = { fullName: 'Nguyễn Văn An', relationship: 'Bố', citizenId: '001080012345', birthDate: '1975-05-20', phone: '0912345678', address: 'Hà Nội' };
function DrawerRelative() {
  const [open, setOpen] = useState(false);
  return <>
    <AppButtonWithIcon className="form-btn" icon="view" onClick={() => setOpen(true)}>Xem thân nhân</AppButtonWithIcon>
    <AppDrawer open={open} id="ex-drawer-2" title="Thông tin thân nhân" onClose={() => setOpen(false)}
      footer={<AppButton className="form-btn" onClick={() => setOpen(false)}>Quay lại</AppButton>}>
      <RelativeDetailBody relative={RELATIVE} />
    </AppDrawer>
  </>;
}
function DrawerTwoButtons() {
  const [open, setOpen] = useState(false);
  return <>
    <AppButtonWithIcon className="form-btn" icon="edit" onClick={() => setOpen(true)}>Sửa nhanh</AppButtonWithIcon>
    <AppDrawer open={open} id="ex-drawer-3" title="Ghi chú" onClose={() => setOpen(false)}
      footer={<><AppButton className="form-btn" onClick={() => setOpen(false)}>Hủy</AppButton><AppButton className="btn btn-primary" onClick={() => setOpen(false)}>Lưu</AppButton></>}>
      <textarea className="text-input" rows={4} style={{ width: '100%' }} aria-label="Ghi chú" />
    </AppDrawer>
  </>;
}

/* ---------- popover ---------- */
function PopTextOnly() {
  return <AppPopover id="ex-popover-1" triggerLabel="Giờ nghỉ giữa các ca">Số phút đệm giữa 2 lịch liên tiếp trên cùng 1 buồng, cài riêng từng thứ, áp dụng chung cho mọi quầy.</AppPopover>;
}
function PopList() {
  return <AppPopover id="ex-popover-2" triggerLabel="Lưu ý" title="Khung giờ thăm gặp">
    <ul style={{ margin: 0, paddingLeft: 18 }}>
      <li>Đối với các ngày được bật thăm gặp thì bắt buộc có thông tin ít nhất 1 ca</li>
      <li>Giờ nghỉ giữa các ca tính bằng phút</li>
    </ul>
  </AppPopover>;
}
function PopIconKbd() {
  return <AppPopover id="ex-popover-3" triggerLabel="Phím tắt" triggerIcon="file" title="Phím tắt">
    <span>Đóng hộp thoại: <AppKbd keys={['Esc']} /></span>
  </AppPopover>;
}

/* ---------- import-excel ---------- */
const IMPORT_LABELS = { template: 'Tải tệp mẫu, điền dữ liệu theo đúng cột', templateButton: 'Tải tệp mẫu', pick: 'Chọn tệp .xlsx, tối đa 10MB', dropHint: 'Bấm hoặc kéo tệp vào đây', preview: 'Xem trước 10 dòng đầu', errorCount: '{0} dòng lỗi', errorColumn: 'Lỗi' };
const IMPORT_COLS = [{ key: 'code', title: 'Mã quầy' }, { key: 'name', title: 'Tên quầy' }];
const IMPORT_OK = [{ key: 1, code: 'Q04', name: 'Quầy tiếp đón khu C' }, { key: 2, code: 'Q06', name: 'Quầy tiếp đón khu D' }];
const IMPORT_ERR = [{ key: 1, code: 'Q04', name: 'Quầy tiếp đón khu C' }, { key: 2, code: '', name: 'Quầy phụ cổng 3', error: msg('E001-01', 'mã quầy') }];
const wide = { width: '100%', maxWidth: 720, border: '1px solid var(--color-line)', borderRadius: 8, background: '#fff', padding: 16 };
function ImportEmpty() { return <div style={wide}><AppImportExcel labels={IMPORT_LABELS} columns={IMPORT_COLS} /></div>; }
function ImportReading() { return <div style={wide}><AppImportExcel labels={IMPORT_LABELS} fileName="DanhSachQuay_14102026.xlsx" percent={45} columns={IMPORT_COLS} /></div>; }
function ImportValid() { return <div style={wide}><AppImportExcel labels={IMPORT_LABELS} fileName="DanhSachQuay_14102026.xlsx" percent={100} columns={IMPORT_COLS} rows={IMPORT_OK} /></div>; }
function ImportInModal() {
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState();
  const rows = fileName ? IMPORT_ERR : [];
  const errorCount = rows.filter((r) => r.error).length;
  return <>
    <AppButtonWithIcon className="form-btn" icon="file" onClick={() => setOpen(true)}>Nhập khẩu Excel</AppButtonWithIcon>
    <AppModal id="ex-import-excel-4" open={open} onClose={() => setOpen(false)} labelledBy="ex-import-excel-4-title" dlgStyle={{ width: 720 }}>
      <div className="dlg-h"><h3 id="ex-import-excel-4-title" className="dlg-t">Nhập khẩu Excel</h3><DialogCloseButton onClick={() => setOpen(false)} /></div>
      <div className="dlg-b"><AppImportExcel labels={IMPORT_LABELS} fileName={fileName} percent={fileName ? 100 : undefined} columns={IMPORT_COLS} rows={rows} onPick={(f) => setFileName(f ? f.name : undefined)} /></div>
      <div className="dlg-f"><AppButton className="btn" onClick={() => setOpen(false)}>Hủy</AppButton><AppButton className="btn btn-primary" disabled={!rows.length || errorCount > 0} onClick={() => setOpen(false)}>Nhập dữ liệu</AppButton></div>
    </AppModal>
  </>;
}

/* ---------- link ---------- */
function LinkDefault() { return <AppLink href="#">Cài đặt quầy tiếp đón</AppLink>; }
function LinkExternalInText() {
  return <span>Thử ở màn <AppLink href="https://trangnt5-pm2-prototype.web.app/tiep-don/quay-tiep-don/tao-moi" external>Tạo quầy</AppLink></span>;
}
function LinkDisabledInText() { return <span>Vui lòng cài đặt tại <AppLink href="#" disabled>Cài đặt quầy tiếp đón</AppLink></span>; }

/* ---------- kbd ---------- */
function KbdSingle() { return <AppKbd keys={['Esc']} />; }
function KbdTwo() { return <AppKbd keys={['Shift', 'Tab']} />; }
function KbdThree() { return <AppKbd keys={['Ctrl', 'Shift', 'Tab']} />; }

export default {
  notebox: [
    { title: 'Mặc định 1 ý', desc: 'Khung xanh tiêu đề Lưu ý với đúng 1 gạch đầu dòng.', Demo: NoteOneItem, code: "<NoteBox id=\"ex-notebox-1\" items={['Giờ nghỉ giữa các ca tính bằng phút']} />" },
    { title: 'Từ khoá in đậm', desc: 'Mỗi ý nhận JSX nên in đậm được từ khoá như màn Cấu hình thời gian.', Demo: NoteBold, code: "<NoteBox id=\"ex-notebox-2\" items={[\n  <><b>Giờ nghỉ giữa các ca:</b> Số phút đệm giữa 2 lịch liên tiếp trên cùng 1 buồng, cài riêng từng thứ, áp dụng chung cho mọi quầy</>,\n]} />" },
    { title: 'Đổi tiêu đề', desc: 'Truyền title để thay chữ Lưu ý mặc định.', Demo: NoteTitle, code: "<NoteBox id=\"ex-notebox-3\" title=\"Ghi chú\" items={['Đối với các ngày được bật thăm gặp thì bắt buộc có thông tin ít nhất 1 ca']} />" },
    { title: 'Một dòng tông xám', desc: 'Truyền line cho câu thông tin vô hại, khung chuyển xám và bỏ qua items.', Demo: NoteLine, code: '<NoteBox id="ex-notebox-4" line="Thông tin giới hạn thời lượng được đồng bộ từ cài đặt tại C04" />' },
  ],
  'setup-hint': [
    { title: 'Gọn trong dòng', desc: 'Bật inline để đặt dưới 1 ô form như màn Tạo lịch hẹn.', Demo: HintInline, code: '<SetupHint inline id="ex-setup-hint-1" what="buồng thăm gặp" screen="Cài đặt quầy tiếp đón" to="#" />' },
    { title: 'Câu khác I001-94', desc: 'Truyền parts cắt sẵn từ linkInMsg để biến 1 cụm trong câu thành link.', Demo: HintParts, code: "<SetupHint id=\"ex-setup-hint-2\" parts={linkInMsg('I001-79', 'khai buồng cho quầy')} to=\"#\" />" },
    { title: 'Bấm link không chuyển trang', desc: 'Truyền onLinkClick khi link chỉ đổi bước hoặc đổi tab trong cùng màn.', Demo: HintClick, code: "<SetupHint id=\"ex-setup-hint-3\" parts={linkInMsg('I001-79', 'khai buồng cho quầy')} to=\"#\" onLinkClick={() => setCount(count + 1)} />" },
  ],
  spinner: [
    { title: 'Mặc định', desc: 'Cỡ md không chữ, trình đọc màn hình đọc nhãn Đang tải.', Demo: SpinDefault, code: '<AppSpinner />' },
    { title: 'Cỡ lớn kèm chữ', desc: 'Dùng cho vùng lớn đang chờ, chữ hiện cạnh vòng xoay.', Demo: SpinLgText, code: '<AppSpinner size="lg" text="Đang tải" />' },
    { title: 'Nhãn đọc màn hình riêng', desc: 'Không có chữ hiện thì đặt label để trình đọc màn hình nói rõ đang tải gì.', Demo: SpinLabel, code: '<AppSpinner size="lg" label="Đang tải nội dung" />' },
  ],
  skeleton: [
    { title: 'Mặc định', desc: 'Ba dòng giữ chỗ, dòng cuối ngắn như đoạn văn.', Demo: SkelDefault, code: '<AppSkeleton />' },
    { title: 'Một dòng', desc: 'Chỉ 1 dòng thì giữ trọn chiều rộng, hợp cho 1 ô giá trị.', Demo: SkelOne, code: '<AppSkeleton lines={1} />' },
    { title: 'Đổi nhãn đọc màn hình', desc: 'Truyền label khi nội dung chờ tải cần gọi tên khác.', Demo: SkelLabel, code: '<AppSkeleton lines={2} label="Đang tải" />' },
  ],
  'empty-states': [
    { title: 'Mặc định', desc: 'Bỏ kind thì là loại empty, kèm nút tạo mới.', Demo: EmptyDefault, code: "<AppEmptyState text={msg('I001-48', 'quầy tiếp đón', 'Tạo mới')} action={<AppButtonWithIcon className=\"btn btn-primary\" iconRaw={PLUS}>Tạo mới</AppButtonWithIcon>} />" },
    { title: 'Tải lỗi không nút', desc: 'Loại error mang vai trò cảnh báo, bỏ action khi không thử lại được.', Demo: EmptyErrorNoAction, code: "<AppEmptyState kind=\"error\" text={msg('SE001-01', 'Tải dữ liệu')} />" },
    { title: 'Bản ghi không còn, không nút', desc: 'Loại deleted đứng riêng khi màn đã có nút quay lại ở chỗ khác.', Demo: EmptyDeletedNoAction, code: "<AppEmptyState kind=\"deleted\" text={msg('E001-15', 'Lịch hẹn LH-2026-0914')} />" },
  ],
  confirm: [
    { title: 'Icon theo mức rủi ro', desc: 'DialogIcon mức warn màu cam và mức danger màu đỏ.', Demo: ConfirmIcons, code: '<DialogIcon level="warn" />\n<DialogIcon level="danger" />' },
    { title: 'Nút X đứng riêng', desc: 'DialogCloseButton mặc định có chữ gợi ý Đóng.', Demo: ConfirmClose, code: '<DialogCloseButton onClick={() => setCount(count + 1)} />' },
    { title: 'Hộp Rời trang mức cam', desc: 'Câu C001-03 có ảnh hưởng nên gắn icon warn, nút lấy từ msgParts.', Demo: ConfirmLeave, code: "const p = msgParts('C001-03');\n<AppModal id=\"ex-confirm-3\" open={open} onClose={() => setOpen(false)} labelledBy=\"ex-confirm-3-title\">\n  <div className=\"dlg-h\"><h3 id=\"ex-confirm-3-title\" className=\"dlg-t\"><DialogIcon level=\"warn\" />{p.title}</h3><DialogCloseButton onClick={() => setOpen(false)} /></div>\n  <div className=\"dlg-b\"><RichText text={p.body} /></div>\n  <div className=\"dlg-f\"><AppButton className=\"btn\" onClick={() => setOpen(false)}>{p.cancel}</AppButton><AppButton className=\"btn btn-primary\" onClick={() => setOpen(false)}>{p.ok}</AppButton></div>\n</AppModal>" },
    { title: 'Hộp Xóa buồng mức đỏ', desc: 'Thao tác không hoàn tác gắn icon danger và nút btn-danger.', Demo: ConfirmDeleteTable, code: "const p = msgParts('C001-01', 'buồng thăm gặp', 'Q01-01 — Buồng số 1');\n<AppModal id=\"ex-confirm-4\" open={open} onClose={() => setOpen(false)} labelledBy=\"ex-confirm-4-title\">\n  <div className=\"dlg-h\"><h3 id=\"ex-confirm-4-title\" className=\"dlg-t\"><DialogIcon level=\"danger\" />{p.title}</h3><DialogCloseButton onClick={() => setOpen(false)} /></div>\n  <div className=\"dlg-b\"><RichText text={p.body} /></div>\n  <div className=\"dlg-f\"><AppButton className=\"btn\" onClick={() => setOpen(false)}>{p.cancel}</AppButton><AppButton className=\"btn btn-danger\" onClick={() => setOpen(false)}>{p.ok}</AppButton></div>\n</AppModal>" },
  ],
  drawer: [
    { title: 'Không có chân', desc: 'Bỏ footer khi ngăn kéo chỉ để xem, đóng bằng nút X hoặc Esc.', Demo: DrawerNoFoot, code: '<AppDrawer open={open} id="ex-drawer-1" title="Thông tin nhanh" onClose={() => setOpen(false)}>Nội dung xem nhanh của 1 bản ghi, không rời màn danh sách.</AppDrawer>' },
    { title: 'Xem chi tiết thân nhân', desc: 'Thân ngăn kéo chứa khối thông tin thật, chân có nút Quay lại.', Demo: DrawerRelative, code: '<AppDrawer open={open} id="ex-drawer-2" title="Thông tin thân nhân" onClose={() => setOpen(false)}\n  footer={<AppButton className="form-btn" onClick={() => setOpen(false)}>Quay lại</AppButton>}>\n  <RelativeDetailBody relative={RELATIVE} />\n</AppDrawer>' },
    { title: 'Sửa nhanh có 2 nút', desc: 'Chân nhận nhiều nút như thanh nút chân trang.', Demo: DrawerTwoButtons, code: '<AppDrawer open={open} id="ex-drawer-3" title="Ghi chú" onClose={() => setOpen(false)}\n  footer={<><AppButton className="form-btn" onClick={() => setOpen(false)}>Hủy</AppButton><AppButton className="btn btn-primary" onClick={() => setOpen(false)}>Lưu</AppButton></>}>\n  <textarea className="text-input" rows={4} style={{ width: \'100%\' }} aria-label="Ghi chú" />\n</AppDrawer>' },
  ],
  popover: [
    { title: 'Chỉ có chữ', desc: 'Không title và không icon, hộp nổi chỉ giải thích 1 câu.', Demo: PopTextOnly, code: '<AppPopover id="ex-popover-1" triggerLabel="Giờ nghỉ giữa các ca">Số phút đệm giữa 2 lịch liên tiếp trên cùng 1 buồng, cài riêng từng thứ, áp dụng chung cho mọi quầy.</AppPopover>' },
    { title: 'Tiêu đề và danh sách', desc: 'Có title thì in dòng tiêu đề, thân chứa được danh sách.', Demo: PopList, code: '<AppPopover id="ex-popover-2" triggerLabel="Lưu ý" title="Khung giờ thăm gặp">\n  <ul style={{ margin: 0, paddingLeft: 18 }}>\n    <li>Đối với các ngày được bật thăm gặp thì bắt buộc có thông tin ít nhất 1 ca</li>\n    <li>Giờ nghỉ giữa các ca tính bằng phút</li>\n  </ul>\n</AppPopover>' },
    { title: 'Có icon, chứa phím tắt', desc: 'triggerIcon thêm icon lên nút mở, thân chứa được control khác.', Demo: PopIconKbd, code: "<AppPopover id=\"ex-popover-3\" triggerLabel=\"Phím tắt\" triggerIcon=\"file\" title=\"Phím tắt\">\n  <span>Đóng hộp thoại: <AppKbd keys={['Esc']} /></span>\n</AppPopover>" },
  ],
  'import-excel': [
    { title: 'Chưa chọn tệp', desc: 'Chỉ hiện bước 1 và bước 2 khi chưa có fileName và rows.', Demo: ImportEmpty, code: '<AppImportExcel labels={IMPORT_LABELS} columns={IMPORT_COLS} />' },
    { title: 'Đang đọc tệp', desc: 'Truyền percent là số thì hiện thanh tiến độ.', Demo: ImportReading, code: '<AppImportExcel labels={IMPORT_LABELS} fileName="DanhSachQuay_14102026.xlsx" percent={45} columns={IMPORT_COLS} />' },
    { title: 'Xem trước không lỗi', desc: 'Mọi dòng hợp lệ nên không có số dòng lỗi cạnh tiêu đề bước 3.', Demo: ImportValid, code: '<AppImportExcel labels={IMPORT_LABELS} fileName="DanhSachQuay_14102026.xlsx" percent={100} columns={IMPORT_COLS} rows={IMPORT_OK} />' },
    { title: 'Trong hộp thoại', desc: 'Chọn tệp để thấy dòng lỗi, nút Nhập dữ liệu chỉ bấm được khi 0 dòng lỗi.', Demo: ImportInModal, code: "<AppModal id=\"ex-import-excel-4\" open={open} onClose={() => setOpen(false)} labelledBy=\"ex-import-excel-4-title\" dlgStyle={{ width: 720 }}>\n  <div className=\"dlg-h\"><h3 id=\"ex-import-excel-4-title\" className=\"dlg-t\">Nhập khẩu Excel</h3><DialogCloseButton onClick={() => setOpen(false)} /></div>\n  <div className=\"dlg-b\"><AppImportExcel labels={IMPORT_LABELS} fileName={fileName} percent={fileName ? 100 : undefined} columns={IMPORT_COLS} rows={rows} onPick={(f) => setFileName(f ? f.name : undefined)} /></div>\n  <div className=\"dlg-f\"><AppButton className=\"btn\" onClick={() => setOpen(false)}>Hủy</AppButton><AppButton className=\"btn btn-primary\" disabled={!rows.length || errorCount > 0} onClick={() => setOpen(false)}>Nhập dữ liệu</AppButton></div>\n</AppModal>" },
  ],
  link: [
    { title: 'Mặc định', desc: 'Liên kết đứng riêng mở màn trong cùng tab.', Demo: LinkDefault, code: '<AppLink href="#">Cài đặt quầy tiếp đón</AppLink>' },
    { title: 'Mở tab mới trong câu', desc: 'Bật external thì có icon mũi tên ra ngoài và rel an toàn.', Demo: LinkExternalInText, code: '<span>Thử ở màn <AppLink href="https://trangnt5-pm2-prototype.web.app/tiep-don/quay-tiep-don/tao-moi" external>Tạo quầy</AppLink></span>' },
    { title: 'Khoá trong câu', desc: 'Bật disabled thì bỏ href nên không bấm đi được.', Demo: LinkDisabledInText, code: '<span>Vui lòng cài đặt tại <AppLink href="#" disabled>Cài đặt quầy tiếp đón</AppLink></span>' },
  ],
  kbd: [
    { title: 'Một phím', desc: 'Mảng 1 phần tử vẽ 1 thẻ kbd, không có dấu cộng.', Demo: KbdSingle, code: "<AppKbd keys={['Esc']} />" },
    { title: 'Tổ hợp 2 phím', desc: 'Hai phím nối nhau bằng dấu cộng.', Demo: KbdTwo, code: "<AppKbd keys={['Shift', 'Tab']} />" },
    { title: 'Tổ hợp 3 phím', desc: 'Số phím không giới hạn, mỗi phím 1 thẻ kbd.', Demo: KbdThree, code: "<AppKbd keys={['Ctrl', 'Shift', 'Tab']} />" },
  ],
};
