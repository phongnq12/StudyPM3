/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Ví dụ kiểu HeroUI cho radio-group, checkbox-group, number-input, tree-select, buttons, icon-buttons, segmented, toolbar. Mỗi ví dụ chạy component thật, code bên dưới khớp đúng phần render. */
import { useState } from 'react';
import AppRadioGroup from '@/components/app/AppRadioGroup';
import AppCheckboxGroup from '@/components/app/AppCheckboxGroup';
import AppNumberInput from '@/components/app/AppNumberInput';
import AppTreeSelect from '@/components/app/AppTreeSelect';
import AppSegmented from '@/components/app/AppSegmented';
import AppToolbar from '@/components/app/AppToolbar';
import { AppButton, AppButtonWithIcon } from '@/components/app/AppButton';
import { COUNTER_ICONS } from '@/pages/ReceptionDeskShared/config';

const row = { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' };
const box = { width: '100%', maxWidth: 420 };

/* ── radio-group ── */
const HINH_THUC = [{ value: 'direct', label: 'Trực tiếp' }, { value: 'video', label: 'Gọi điện có hình ảnh' }];
const LOAI_HINH = [{ value: 'tructiep', label: 'Thăm gặp trực tiếp' }, { value: 'tructuyen', label: 'Thăm gặp trực tuyến' }, { value: 'goidien', label: 'Gọi điện thường kỳ' }];

function RadioDefault() {
  const [value, setValue] = useState('direct');
  return <AppRadioGroup name="ex-radio-group-1" label="Hình thức thăm gặp" value={value} onChange={setValue} options={HINH_THUC} />;
}
function RadioEmpty() {
  const [value, setValue] = useState();
  return <AppRadioGroup name="ex-radio-group-2" label="Hình thức thăm gặp" value={value} onChange={setValue} options={HINH_THUC} />;
}
function RadioDisabled() {
  return <AppRadioGroup name="ex-radio-group-3" label="Hình thức thăm gặp" value="video" disabled options={HINH_THUC} />;
}
function RadioVertical() {
  const [value, setValue] = useState('tructiep');
  return <AppRadioGroup name="ex-radio-group-4" label="Loại hình thăm gặp" vertical value={value} onChange={setValue} options={LOAI_HINH} />;
}

/* ── checkbox-group ── */
const NGAY = ['T2', 'T3', 'T4', 'T5', 'T6'].map((d) => ({ value: d, label: d }));

function CheckboxDefault() {
  const [value, setValue] = useState(['T2', 'T4']);
  return <AppCheckboxGroup label="Ngày thăm trong tuần" value={value} onChange={setValue} options={NGAY} />;
}
function CheckboxEmpty() {
  const [value, setValue] = useState([]);
  return <AppCheckboxGroup label="Ngày thăm trong tuần" value={value} onChange={setValue} options={NGAY} />;
}
function CheckboxOneOff() {
  const [value, setValue] = useState(['T3']);
  return <AppCheckboxGroup label="Ngày thăm trong tuần" value={value} onChange={setValue} options={[{ value: 'T2', label: 'T2' }, { value: 'T3', label: 'T3' }, { value: 'T4', label: 'T4', disabled: true }, { value: 'T5', label: 'T5' }]} />;
}
function CheckboxDisabled() {
  return <AppCheckboxGroup label="Ngày thăm trong tuần" value={['T2', 'T5']} disabled options={NGAY} />;
}
function CheckboxVertical() {
  const [value, setValue] = useState(['tructiep']);
  return <AppCheckboxGroup label="Loại hình thăm gặp" vertical value={value} onChange={setValue} options={LOAI_HINH} />;
}

/* ── number-input ── */
function NumberDefault() {
  const [value, setValue] = useState(0);
  return <AppNumberInput id="ex-number-input-1" label="Số thân nhân tham gia" value={value} onChange={setValue} />;
}
function NumberAtMin() {
  const [value, setValue] = useState(1);
  return <AppNumberInput id="ex-number-input-2" label="Số thân nhân tham gia" value={value} onChange={setValue} min={1} max={5} />;
}
function NumberAtMax() {
  const [value, setValue] = useState(5);
  return <AppNumberInput id="ex-number-input-3" label="Số người đi cùng" value={value} onChange={setValue} min={0} max={5} />;
}

/* ── tree-select ── (cây lấy đúng từ Mẫu thật TreeSelectDemo) */
const TREE = [
  { value: 'dnA', title: 'Dãy nhà A', children: [
    { value: 'Q01', title: 'Q01 — Quầy tiếp đón chính', children: [{ value: 'Q01-01', title: 'Q01-01 — Buồng số 1' }, { value: 'Q01-02', title: 'Q01-02 — Buồng số 2' }] },
    { value: 'Q02', title: 'Q02 — Quầy tiếp đón phụ', children: [{ value: 'Q02-01', title: 'Q02-01 — Buồng số 1' }] },
  ] },
  { value: 'dnB', title: 'Dãy nhà B', children: [{ value: 'Q03', title: 'Q03 — Quầy tiếp đón khu B' }] },
];

function TreeDefault() {
  const [value, setValue] = useState();
  return <div style={box}><AppTreeSelect treeData={TREE} value={value} onChange={setValue} placeholder="Chọn quầy hoặc buồng" /></div>;
}
function TreePreset() {
  const [value, setValue] = useState('Q01-02');
  return <div style={box}><AppTreeSelect treeData={TREE} value={value} onChange={setValue} placeholder="Chọn quầy hoặc buồng" /></div>;
}
function TreeMultiple() {
  const [value, setValue] = useState(['Q01', 'Q02-01']);
  return <div style={box}><AppTreeSelect multiple treeData={TREE} value={value} onChange={setValue} placeholder="Chọn buồng thăm gặp" /></div>;
}
function TreeDisabled() {
  return <div style={box}><AppTreeSelect treeData={TREE} value="Q03" placeholder="Chọn quầy hoặc buồng" disabled /></div>;
}

/* ── buttons ── (icon và chữ lấy từ các màn PM2) */
const ICON_SAVE = '<polyline points="20 6 9 17 4 12"/>';
const ICON_CREATE = '<path d="M12 5v14M5 12h14"/>';
const ICON_REMOVE = '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>';
const ICON_DOWN = '<path d="m6 9 6 6 6-6"/>';

function BtnDialog() {
  return <div style={row}><AppButton className="btn">Hủy</AppButton><AppButton className="btn btn-danger">Xóa lịch hẹn</AppButton></div>;
}
function BtnLoadingTry() {
  const [loading, setLoading] = useState(false);
  const run = () => { setLoading(true); setTimeout(() => setLoading(false), 1500); };
  return <AppButtonWithIcon className="form-btn form-btn-primary" iconRaw={ICON_SAVE} loading={loading} onClick={run}>Lưu và kích hoạt</AppButtonWithIcon>;
}
function BtnListDisabled() {
  return <AppButtonWithIcon className="btn btn-primary" iconRaw={ICON_CREATE} disabled>Tạo mới</AppButtonWithIcon>;
}
function BtnOutlineDanger() {
  return <AppButtonWithIcon className="form-btn form-btn-danger is-outline" iconRaw={ICON_REMOVE}>Xóa</AppButtonWithIcon>;
}
function BtnIconAfter() {
  const [open, setOpen] = useState(false);
  return <AppButtonWithIcon className="btn" iconRaw={ICON_DOWN} iconAfter iconClassName={open ? 'is-up' : undefined} onClick={() => setOpen((x) => !x)}>Tìm kiếm mở rộng</AppButtonWithIcon>;
}
function BtnPager() {
  const [page, setPage] = useState(1);
  return <div style={row}>
    <AppButtonWithIcon className="pg-nav" icon="chevLeft" disabled={page <= 1} onClick={() => setPage(page - 1)}>Trang trước</AppButtonWithIcon>
    <span>{page} / 3</span>
    <AppButtonWithIcon className="pg-nav" icon="chevRight" iconAfter disabled={page >= 3} onClick={() => setPage(page + 1)}>Trang sau</AppButtonWithIcon>
  </div>;
}

/* ── icon-buttons ── (title và lớp lấy từ ReceptionDeskShared/config.js, ReceptionDeskDetail, NotificationSettings) */
function IbView() {
  return <AppButtonWithIcon className="ib ib-view" title="Xem chi tiết" icon="view" />;
}
function IbAriaLabel() {
  return <AppButtonWithIcon className="ib ib-edit" title="Chỉnh sửa" aria-label="Chỉnh sửa quầy tiếp đón Q01" iconRaw={COUNTER_ICONS.edit} />;
}
function IbDanger() {
  return <AppButtonWithIcon className="ib ib-danger dg" title="Xóa buồng thăm gặp" iconRaw={COUNTER_ICONS.delete} />;
}
function IbWarn() {
  return <AppButtonWithIcon className="ib ib-warn" title="Vô hiệu hóa" icon="prohibit" />;
}
function IbDisabled() {
  return <AppButtonWithIcon className="ib ib-approve" title="Kích hoạt" iconRaw={COUNTER_ICONS.activate} disabled />;
}

/* ── segmented ── (chữ, icon, title lấy từ màn Danh sách lịch hẹn) */
const ICON_TABLE = '<path d="M3 3h18v18H3zM3 9h18M3 15h18"/>';

function SegDefault() {
  const [value, setValue] = useState('list');
  return <AppSegmented value={value} onChange={setValue} items={[{ key: 'list', label: 'Danh sách', iconRaw: ICON_TABLE }, { key: 'cal', label: 'Lịch theo buồng', icon: 'calendar' }]} />;
}
function SegSecond() {
  const [value, setValue] = useState('cal');
  return <AppSegmented value={value} onChange={setValue} items={[{ key: 'list', label: 'Danh sách', iconRaw: ICON_TABLE }, { key: 'cal', label: 'Lịch theo buồng', icon: 'calendar' }]} />;
}
function SegTitle() {
  const [value, setValue] = useState('list');
  return <AppSegmented label="Màn con" value={value} onChange={setValue} items={[{ key: 'list', label: 'Danh sách', iconRaw: ICON_TABLE, title: 'Danh sách lịch hẹn dạng bảng' }, { key: 'cal', label: 'Lịch theo buồng', icon: 'calendar', title: 'Lưới thời gian theo buồng thăm gặp' }]} />;
}

/* ── toolbar ── */
const ICON_EXCEL = '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>';

function TbOneGroup() {
  return <AppToolbar label="Thao tác với danh sách" groups={[
    [<AppButtonWithIcon key="a" className="btn btn-primary" iconRaw={ICON_CREATE}>Tạo mới</AppButtonWithIcon>, <AppButtonWithIcon key="b" className="btn" iconRaw={ICON_EXCEL}>Xuất Excel</AppButtonWithIcon>],
  ]} />;
}
function TbThreeGroups() {
  return <AppToolbar label="Thao tác với danh sách" groups={[
    [<AppButtonWithIcon key="a" className="btn btn-primary" iconRaw={ICON_CREATE}>Tạo mới</AppButtonWithIcon>],
    [<AppButtonWithIcon key="b" className="btn" iconRaw={ICON_EXCEL}>Xuất Excel</AppButtonWithIcon>],
    [<AppButtonWithIcon key="c" className="btn btn-danger-ghost" iconRaw={ICON_REMOVE}>Xóa đã chọn</AppButtonWithIcon>],
  ]} />;
}
function TbWithDisabled() {
  return <AppToolbar label="Thao tác với danh sách" groups={[
    [<AppButtonWithIcon key="a" className="btn btn-primary" iconRaw={ICON_CREATE}>Tạo mới</AppButtonWithIcon>, <AppButtonWithIcon key="b" className="btn btn-danger-ghost" iconRaw={ICON_REMOVE} disabled>Xóa đã chọn</AppButtonWithIcon>],
    [<AppButtonWithIcon key="c" className="btn" iconRaw={ICON_EXCEL}>Xuất Excel</AppButtonWithIcon>],
  ]} />;
}
function TbIconOnly() {
  return <AppToolbar label="Thao tác với quầy tiếp đón" groups={[
    [<AppButtonWithIcon key="a" className="ib ib-view" title="Xem chi tiết" iconRaw={COUNTER_ICONS.view} />, <AppButtonWithIcon key="b" className="ib ib-edit" title="Chỉnh sửa" iconRaw={COUNTER_ICONS.edit} />],
    [<AppButtonWithIcon key="c" className="ib ib-danger dg" title="Xóa quầy tiếp đón" iconRaw={COUNTER_ICONS.delete} />],
  ]} />;
}

export default {
  'radio-group': [
    { title: 'Mặc định', desc: 'Hai lựa chọn xếp ngang, đã chọn sẵn 1 giá trị.', Demo: RadioDefault, code: '<AppRadioGroup name="ex-radio-group-1" label="Hình thức thăm gặp" value={value} onChange={setValue} options={[{ value: \'direct\', label: \'Trực tiếp\' }, { value: \'video\', label: \'Gọi điện có hình ảnh\' }]} />' },
    { title: 'Chưa chọn', desc: 'Không truyền giá trị ban đầu nên chưa ô nào được tick.', Demo: RadioEmpty, code: '<AppRadioGroup name="ex-radio-group-2" label="Hình thức thăm gặp" value={value} onChange={setValue} options={[{ value: \'direct\', label: \'Trực tiếp\' }, { value: \'video\', label: \'Gọi điện có hình ảnh\' }]} />  // useState() rỗng' },
    { title: 'Khoá cả nhóm', desc: 'Dùng ở màn xem chi tiết hoặc khi trường không được sửa.', Demo: RadioDisabled, code: '<AppRadioGroup name="ex-radio-group-3" label="Hình thức thăm gặp" value="video" disabled options={[{ value: \'direct\', label: \'Trực tiếp\' }, { value: \'video\', label: \'Gọi điện có hình ảnh\' }]} />' },
    { title: 'Xếp dọc', desc: 'Nhãn dài thì xếp các lựa chọn theo cột.', Demo: RadioVertical, code: '<AppRadioGroup name="ex-radio-group-4" label="Loại hình thăm gặp" vertical value={value} onChange={setValue} options={[{ value: \'tructiep\', label: \'Thăm gặp trực tiếp\' }, { value: \'tructuyen\', label: \'Thăm gặp trực tuyến\' }, { value: \'goidien\', label: \'Gọi điện thường kỳ\' }]} />' },
  ],
  'checkbox-group': [
    { title: 'Mặc định', desc: 'Nhiều giá trị được tích sẵn, bấm để thêm hoặc bớt.', Demo: CheckboxDefault, code: '<AppCheckboxGroup label="Ngày thăm trong tuần" value={value} onChange={setValue} options={[\'T2\', \'T3\', \'T4\', \'T5\', \'T6\'].map((d) => ({ value: d, label: d }))} />  // useState([\'T2\', \'T4\'])' },
    { title: 'Chưa tích ô nào', desc: 'Giá trị ban đầu là mảng rỗng.', Demo: CheckboxEmpty, code: '<AppCheckboxGroup label="Ngày thăm trong tuần" value={value} onChange={setValue} options={[\'T2\', \'T3\', \'T4\', \'T5\', \'T6\'].map((d) => ({ value: d, label: d }))} />  // useState([])' },
    { title: 'Khoá riêng 1 lựa chọn', desc: 'Lựa chọn có disabled thì khoá riêng ô đó, các ô khác vẫn bấm được.', Demo: CheckboxOneOff, code: '<AppCheckboxGroup label="Ngày thăm trong tuần" value={value} onChange={setValue} options={[{ value: \'T2\', label: \'T2\' }, { value: \'T3\', label: \'T3\' }, { value: \'T4\', label: \'T4\', disabled: true }, { value: \'T5\', label: \'T5\' }]} />' },
    { title: 'Khoá cả nhóm', desc: 'Hiện giá trị đã chọn nhưng không cho sửa.', Demo: CheckboxDisabled, code: '<AppCheckboxGroup label="Ngày thăm trong tuần" value={[\'T2\', \'T5\']} disabled options={[\'T2\', \'T3\', \'T4\', \'T5\', \'T6\'].map((d) => ({ value: d, label: d }))} />' },
    { title: 'Xếp dọc', desc: 'Nhãn dài thì xếp các lựa chọn theo cột.', Demo: CheckboxVertical, code: '<AppCheckboxGroup label="Loại hình thăm gặp" vertical value={value} onChange={setValue} options={[{ value: \'tructiep\', label: \'Thăm gặp trực tiếp\' }, { value: \'tructuyen\', label: \'Thăm gặp trực tuyến\' }, { value: \'goidien\', label: \'Gọi điện thường kỳ\' }]} />' },
  ],
  'number-input': [
    { title: 'Mặc định', desc: 'Không truyền min max thì khoảng là 0 tới 999, đang ở 0 nên nút giảm khoá.', Demo: NumberDefault, code: '<AppNumberInput id="ex-number-input-1" label="Số thân nhân tham gia" value={value} onChange={setValue} />' },
    { title: 'Chạm mức sàn', desc: 'Giá trị bằng min thì nút giảm khoá, gõ thấp hơn rồi rời ô thì kẹp về min.', Demo: NumberAtMin, code: '<AppNumberInput id="ex-number-input-2" label="Số thân nhân tham gia" value={value} onChange={setValue} min={1} max={5} />' },
    { title: 'Chạm mức trần', desc: 'Giá trị bằng max thì nút tăng khoá, gõ vượt thì ô giữ ở max.', Demo: NumberAtMax, code: '<AppNumberInput id="ex-number-input-3" label="Số người đi cùng" value={value} onChange={setValue} min={0} max={5} />' },  ],
  'tree-select': [
    { title: 'Mặc định', desc: 'Cây thu gọn, gõ để tìm theo tên nhánh.', Demo: TreeDefault, code: '<AppTreeSelect treeData={TREE} value={value} onChange={setValue} placeholder="Chọn quầy hoặc buồng" />' },
    { title: 'Có sẵn giá trị', desc: 'Màn chỉnh sửa mở ra với nhánh đã chọn từ trước.', Demo: TreePreset, code: '<AppTreeSelect treeData={TREE} value={value} onChange={setValue} placeholder="Chọn quầy hoặc buồng" />  // useState(\'Q01-02\')' },
    { title: 'Chọn nhiều', desc: 'Tích ô để chọn nhiều nhánh, chọn đủ nhánh con thì chỉ hiện nút cha.', Demo: TreeMultiple, code: '<AppTreeSelect multiple treeData={TREE} value={value} onChange={setValue} placeholder="Chọn buồng thăm gặp" />' },
    { title: 'Khoá', desc: 'Thuộc tính disabled đi thẳng xuống antd TreeSelect qua phần còn lại.', Demo: TreeDisabled, code: '<AppTreeSelect treeData={TREE} value="Q03" placeholder="Chọn quầy hoặc buồng" disabled />' },
  ],
  buttons: [
    { title: 'Nút chữ trần trong hộp thoại', desc: 'Nút trong popup không có icon, cặp Hủy và xác nhận phá hủy màu đỏ.', Demo: BtnDialog, code: '<AppButton className="btn">Hủy</AppButton>\n<AppButton className="btn btn-danger">Xóa lịch hẹn</AppButton>' },
    { title: 'Bấm thử đang xử lý', desc: 'Bấm nút để thấy vòng xoay thế chỗ icon và nút khoá trong lúc chờ.', Demo: BtnLoadingTry, code: '<AppButtonWithIcon className="form-btn form-btn-primary" iconRaw={ICON_SAVE} loading={loading} onClick={run}>Lưu và kích hoạt</AppButtonWithIcon>' },
    { title: 'Nút danh sách đang khoá', desc: 'Nút chính ở đầu màn danh sách khi chưa đủ điều kiện thao tác.', Demo: BtnListDisabled, code: '<AppButtonWithIcon className="btn btn-primary" iconRaw={ICON_CREATE} disabled>Tạo mới</AppButtonWithIcon>' },
    { title: 'Viền đỏ phá hủy trên form', desc: 'Thao tác xóa đặt ngay trên trang dùng viền đỏ, không dùng đỏ đặc.', Demo: BtnOutlineDanger, code: '<AppButtonWithIcon className="form-btn form-btn-danger is-outline" iconRaw={ICON_REMOVE}>Xóa</AppButtonWithIcon>' },
    { title: 'Icon đứng sau chữ', desc: 'iconAfter đặt icon sau chữ, bấm để xoay mũi tên như nút Tìm kiếm mở rộng.', Demo: BtnIconAfter, code: '<AppButtonWithIcon className="btn" iconRaw={ICON_DOWN} iconAfter iconClassName={open ? \'is-up\' : undefined} onClick={() => setOpen((x) => !x)}>Tìm kiếm mở rộng</AppButtonWithIcon>' },
    { title: 'Nút chuyển trang', desc: 'Cặp Trang trước và Trang sau tự khoá ở trang đầu và trang cuối.', Demo: BtnPager, code: '<AppButtonWithIcon className="pg-nav" icon="chevLeft" disabled={page <= 1} onClick={() => setPage(page - 1)}>Trang trước</AppButtonWithIcon>\n<AppButtonWithIcon className="pg-nav" icon="chevRight" iconAfter disabled={page >= 3} onClick={() => setPage(page + 1)}>Trang sau</AppButtonWithIcon>' },
  ],
  'icon-buttons': [
    { title: 'Mặc định', desc: 'Nút chỉ có icon, title vừa là tooltip vừa là tên đọc màn hình.', Demo: IbView, code: '<AppButtonWithIcon className="ib ib-view" title="Xem chi tiết" icon="view" />' },
    { title: 'Tên đọc riêng', desc: 'Truyền aria-label để trình đọc màn hình nói rõ đối tượng của dòng.', Demo: IbAriaLabel, code: '<AppButtonWithIcon className="ib ib-edit" title="Chỉnh sửa" aria-label="Chỉnh sửa quầy tiếp đón Q01" iconRaw={COUNTER_ICONS.edit} />' },
    { title: 'Thao tác nguy hiểm', desc: 'Thêm lớp dg cho thao tác phá hủy.', Demo: IbDanger, code: '<AppButtonWithIcon className="ib ib-danger dg" title="Xóa buồng thăm gặp" iconRaw={COUNTER_ICONS.delete} />' },
    { title: 'Tông cảnh báo', desc: 'Lớp ib-warn cho thao tác vô hiệu hóa.', Demo: IbWarn, code: '<AppButtonWithIcon className="ib ib-warn" title="Vô hiệu hóa" icon="prohibit" />' },
    { title: 'Khoá', desc: 'Nút icon bị khoá khi dòng chưa đủ điều kiện thao tác.', Demo: IbDisabled, code: '<AppButtonWithIcon className="ib ib-approve" title="Kích hoạt" iconRaw={COUNTER_ICONS.activate} disabled />' },
  ],
  segmented: [
    { title: 'Mặc định', desc: 'Hai chế độ xem, đang ở đoạn đầu.', Demo: SegDefault, code: '<AppSegmented value={value} onChange={setValue} items={[{ key: \'list\', label: \'Danh sách\', iconRaw: ICON_TABLE }, { key: \'cal\', label: \'Lịch theo buồng\', icon: \'calendar\' }]} />' },
    { title: 'Mở sẵn đoạn thứ 2', desc: 'Giá trị ban đầu là khoá của đoạn sau.', Demo: SegSecond, code: '<AppSegmented value={value} onChange={setValue} items={[{ key: \'list\', label: \'Danh sách\', iconRaw: ICON_TABLE }, { key: \'cal\', label: \'Lịch theo buồng\', icon: \'calendar\' }]} />  // useState(\'cal\')' },
    { title: 'Có tooltip và tên đọc riêng', desc: 'Mỗi đoạn có title giải thích, thanh có label riêng như màn Danh sách lịch hẹn.', Demo: SegTitle, code: '<AppSegmented label="Màn con" value={value} onChange={setValue} items={[{ key: \'list\', label: \'Danh sách\', iconRaw: ICON_TABLE, title: \'Danh sách lịch hẹn dạng bảng\' }, { key: \'cal\', label: \'Lịch theo buồng\', icon: \'calendar\', title: \'Lưới thời gian theo buồng thăm gặp\' }]} />' },
  ],
  toolbar: [
    { title: 'Một nhóm', desc: 'Các nút cùng nhóm, không có vạch ngăn.', Demo: TbOneGroup, code: '<AppToolbar label="Thao tác với danh sách" groups={[\n  [<AppButtonWithIcon key="a" className="btn btn-primary" iconRaw={ICON_CREATE}>Tạo mới</AppButtonWithIcon>, <AppButtonWithIcon key="b" className="btn" iconRaw={ICON_EXCEL}>Xuất Excel</AppButtonWithIcon>],\n]} />' },
    { title: 'Ba nhóm', desc: 'Mỗi nhóm ngăn nhau bằng vạch dọc.', Demo: TbThreeGroups, code: '<AppToolbar label="Thao tác với danh sách" groups={[\n  [<AppButtonWithIcon key="a" className="btn btn-primary" iconRaw={ICON_CREATE}>Tạo mới</AppButtonWithIcon>],\n  [<AppButtonWithIcon key="b" className="btn" iconRaw={ICON_EXCEL}>Xuất Excel</AppButtonWithIcon>],\n  [<AppButtonWithIcon key="c" className="btn btn-danger-ghost" iconRaw={ICON_REMOVE}>Xóa đã chọn</AppButtonWithIcon>],\n]} />' },
    { title: 'Có nút khoá', desc: 'Mũi tên trái phải bỏ qua nút đang khoá.', Demo: TbWithDisabled, code: '<AppToolbar label="Thao tác với danh sách" groups={[\n  [<AppButtonWithIcon key="a" className="btn btn-primary" iconRaw={ICON_CREATE}>Tạo mới</AppButtonWithIcon>, <AppButtonWithIcon key="b" className="btn btn-danger-ghost" iconRaw={ICON_REMOVE} disabled>Xóa đã chọn</AppButtonWithIcon>],\n  [<AppButtonWithIcon key="c" className="btn" iconRaw={ICON_EXCEL}>Xuất Excel</AppButtonWithIcon>],\n]} />' },
    { title: 'Nút chỉ có icon', desc: 'Gom nút icon của 1 đối tượng vào thanh, mỗi nút có title.', Demo: TbIconOnly, code: '<AppToolbar label="Thao tác với quầy tiếp đón" groups={[\n  [<AppButtonWithIcon key="a" className="ib ib-view" title="Xem chi tiết" iconRaw={COUNTER_ICONS.view} />, <AppButtonWithIcon key="b" className="ib ib-edit" title="Chỉnh sửa" iconRaw={COUNTER_ICONS.edit} />],\n  [<AppButtonWithIcon key="c" className="ib ib-danger dg" title="Xóa quầy tiếp đón" iconRaw={COUNTER_ICONS.delete} />],\n]} />' },
  ],
};
