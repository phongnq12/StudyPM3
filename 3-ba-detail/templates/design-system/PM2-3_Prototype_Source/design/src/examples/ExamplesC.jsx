/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Ví dụ kiểu HeroUI cho table, status-tags, tabs, page-select, avatar, count-badge, progress, accordion, tree, scroll-shadow, color-swatch. Mỗi ví dụ chạy component thật, code bên dưới khớp đúng phần render. */
import { useState } from 'react';
import AppTable from '@/components/app/AppTable';
import EmptyRow from '@/components/app/EmptyRow';
import CatalogStatusTag from '@/components/app/CatalogStatusTag';
import AppointmentStatusTag from '@/components/app/AppointmentStatusTag';
import AppTag from '@/components/app/AppTag';
import AppTabs from '@/components/app/AppTabs';
import PageSelect from '@/components/app/PageSelect';
import AppAvatar, { AppAvatarGroup } from '@/components/app/AppAvatar';
import AppBadge from '@/components/app/AppBadge';
import AppProgress from '@/components/app/AppProgress';
import AppAccordion from '@/components/app/AppAccordion';
import AppTree from '@/components/app/AppTree';
import AppScrollShadow from '@/components/app/AppScrollShadow';
import AppColorSwatch from '@/components/app/AppColorSwatch';
import { AppButton, AppButtonWithIcon } from '@/components/app/AppButton';

const row = { display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' };
const col = { display: 'flex', flexDirection: 'column', gap: 16 };

/* ---------- table ---------- */
const DESK_ROWS = [{ code: 'Q01', name: 'Quầy tiếp đón chính' }, { code: 'Q02', name: 'Quầy phụ Cổng 2' }];
const DESK_COLS = [
  { key: 'stt', title: 'STT', thStyle: { width: '60px' }, render: (r, i) => i + 1 },
  { key: 'code', title: 'Mã quầy', thStyle: { width: '120px' }, className: 'cell-code' },
  { key: 'name', title: 'Tên quầy', thStyle: { width: '260px' } },
];
function TableBasicDemo() {
  return <div className="card sd-scroll-x" tabIndex={0} role="region" aria-label="Bảng mẫu cuộn ngang"><AppTable rowKey="code" columns={DESK_COLS} dataSource={DESK_ROWS} /></div>;
}
function TableSelectDemo() {
  const [keys, setKeys] = useState([]);
  return <div className="card sd-scroll-x" tabIndex={0} role="region" aria-label="Bảng mẫu cuộn ngang"><AppTable rowKey="code" columns={DESK_COLS} dataSource={DESK_ROWS} rowSelection={{ selectedRowKeys: keys, onChange: setKeys }} /></div>;
}
function TableEmptyNoRecordDemo() {
  return <div className="card sd-scroll-x" tabIndex={0} role="region" aria-label="Bảng mẫu cuộn ngang"><AppTable rowKey="code" columns={DESK_COLS} dataSource={[]} emptyRow={<EmptyRow colSpan={3} entity="buồng thăm gặp" hasRecords={false} />} /></div>;
}
function TableEmptyFilteredDemo() {
  return <div className="card sd-scroll-x" tabIndex={0} role="region" aria-label="Bảng mẫu cuộn ngang"><AppTable rowKey="code" columns={DESK_COLS} dataSource={[]} emptyRow={<EmptyRow colSpan={3} entity="quầy tiếp đón" hasRecords />} /></div>;
}
function TableOffsetDemo() {
  return <div className="card sd-scroll-x" tabIndex={0} role="region" aria-label="Bảng mẫu cuộn ngang"><AppTable rowKey="code" columns={DESK_COLS} dataSource={DESK_ROWS} indexOffset={20} /></div>;
}
function TableRowClassDemo() {
  return <div className="card sd-scroll-x" tabIndex={0} role="region" aria-label="Bảng mẫu cuộn ngang"><AppTable rowKey="code" columns={DESK_COLS} dataSource={DESK_ROWS} rowClassName={(r) => (r.code === 'Q02' ? 'row-new' : '')} /></div>;
}

/* ---------- status-tags ---------- */
function CatalogSingleDemo() { return <CatalogStatusTag status="ACTIVE" label="Hoạt động" />; }
function PendingPairDemo() {
  return <div style={row}><AppointmentStatusTag status="PENDING_APPROVAL" /><AppointmentStatusTag status="PENDING_HEAD_APPROVAL" /></div>;
}
function RelationshipTagDemo() {
  return <div style={row}><AppTag className="tag tag-relationship-spouse">Vợ</AppTag><AppTag className="tag tag-relationship-mother">Mẹ</AppTag><AppTag className="tag tag-relationship-father">Bố</AppTag><AppTag className="tag tag-relationship-sibling">Anh</AppTag><AppTag className="tag tag-relationship-child">Con</AppTag></div>;
}
function VisitTypeTagDemo() { return <AppTag className="tag tag-visit-standard">Thăm gặp trực tiếp tiêu chuẩn</AppTag>; }
function HiddenTagDemo() {
  const [hidden, setHidden] = useState(false);
  return <div style={col}><label className="chk"><input type="checkbox" checked={hidden} onChange={(e) => setHidden(e.target.checked)} /> hidden</label>
    <div style={row}><AppointmentStatusTag status="APPROVED" id="ex-status-tags-5" hidden={hidden} /></div></div>;
}

/* ---------- tabs ---------- */
function TabsBasicDemo() {
  const [k, setK] = useState('1');
  return <AppTabs activeKey={k} onChange={setK} items={[
    { key: '1', id: 'ex-tabs-1a', label: 'Thông tin quầy', children: <p className="sd-pad">Nội dung tab Thông tin quầy</p> },
    { key: '2', id: 'ex-tabs-1b', label: 'Lịch sử thao tác', children: <p className="sd-pad">Nội dung tab Lịch sử thao tác</p> }]} />;
}
function TabsSingleDemo() {
  return <AppTabs activeKey="direct" onChange={() => {}} items={[{ key: 'direct', id: 'ex-tabs-2', label: 'Thăm gặp trực tiếp', children: <p className="sd-pad">Nội dung tab Thăm gặp trực tiếp</p> }]} />;
}
const DETAIL_TABS = ['Thông tin quầy', 'Buồng thăm gặp', 'Suất riêng', 'Tình hình sử dụng', 'Lịch sử thao tác'];
function TabsManyDemo() {
  const [k, setK] = useState('1');
  return <AppTabs activeKey={k} onChange={setK} items={DETAIL_TABS.map((label, i) => ({ key: String(i + 1), id: 'ex-tabs-3-' + (i + 1), label, children: <p className="sd-pad">{'Nội dung tab ' + label}</p> }))} />;
}
const APPT_TABS = ['Thông tin lịch hẹn', 'Người cai nghiện và thân nhân', 'Lịch sử thao tác'];
function TabsPresetDemo() {
  const [k, setK] = useState('3');
  return <AppTabs activeKey={k} onChange={setK} items={APPT_TABS.map((label, i) => ({ key: String(i + 1), id: 'ex-tabs-4-' + (i + 1), label, children: <p className="sd-pad">{'Nội dung tab ' + label}</p> }))} />;
}

/* ---------- page-select ---------- */
function PageBasicDemo() { const [value, setValue] = useState(1); return <PageSelect id="ex-page-select-1" current={value} total={5} onChange={setValue} />; }
function PageOneDemo() { const [value, setValue] = useState(1); return <PageSelect id="ex-page-select-2" current={value} total={1} onChange={setValue} />; }
function PageZeroDemo() { const [value, setValue] = useState(1); return <PageSelect id="ex-page-select-3" current={value} total={0} onChange={setValue} />; }
function PageManyDemo() { const [value, setValue] = useState(25); return <PageSelect id="ex-page-select-4" current={value} total={50} onChange={setValue} />; }

/* ---------- avatar ---------- */
function AvatarBasicDemo() { return <AppAvatar name="Nguyễn Thùy Linh" />; }
function AvatarTitleDemo() { return <AppAvatar name="Nguyễn Thùy Linh" title="Cán bộ Tổ thăm gặp" />; }
function AvatarNoNameDemo() { return <AppAvatar name="" size="sm" />; }
function AvatarGroupSmallDemo() { return <AppAvatarGroup names={['Nguyễn Văn Bình', 'Trần Thị Cúc', 'Lê Văn Dũng', 'Phạm Thị Hà']} max={2} size="sm" />; }
function AvatarGroupFitDemo() { return <AppAvatarGroup names={['Nguyễn Văn Bình', 'Trần Thị Cúc', 'Lê Văn Dũng']} max={4} size="lg" />; }

/* ---------- count-badge ---------- */
function BadgeZeroDemo() { return <AppBadge count={0}><AppButtonWithIcon className="form-btn" icon="bell">Thông báo</AppButtonWithIcon></AppBadge>; }
function BadgeMaxDemo() { return <AppBadge count={12} max={9}><AppButtonWithIcon className="form-btn" icon="bell">Thông báo</AppButtonWithIcon></AppBadge>; }
function BadgeAtMaxDemo() { return <AppBadge count={99}><AppButtonWithIcon className="form-btn" icon="bell">Thông báo</AppButtonWithIcon></AppBadge>; }
function BadgeDotDefaultDemo() { return <AppBadge dot><AppButtonWithIcon className="form-btn" icon="bell">Thông báo</AppButtonWithIcon></AppBadge>; }
function BadgeLiveDemo() {
  const [n, setN] = useState(0);
  return <div style={row}><AppBadge count={n}><AppButtonWithIcon className="form-btn" icon="bell">Thông báo</AppButtonWithIcon></AppBadge>
    <AppButton className="form-btn" onClick={() => setN(n + 1)}>+1</AppButton><AppButton className="form-btn" onClick={() => setN(0)}>0</AppButton></div>;
}

/* ---------- progress ---------- */
function ProgressBasicDemo() { return <AppProgress label="Đồng bộ dữ liệu" value={40} />; }
function ProgressNoValueDemo() { return <AppProgress label="Quỹ thăm đã dùng trong tháng" value={3} max={4} showValue={false} />; }
function ProgressZeroMaxDemo() { return <AppProgress label="Quỹ thăm đã dùng trong tháng" value={0} max={0} />; }
function ProgressOverDemo() { return <AppProgress label="Sức chứa buồng" value={12} max={10} tone="warn" />; }
function ProgressLiveDemo() {
  const [value, setValue] = useState(1);
  return <div style={col}><AppProgress label="Quỹ thăm đã dùng trong tháng" value={value} max={4} tone={value >= 4 ? 'warn' : 'brand'} />
    <div style={row}><AppButton className="form-btn" onClick={() => setValue(Math.max(0, value - 1))}>-1</AppButton><AppButton className="form-btn" onClick={() => setValue(Math.min(4, value + 1))}>+1</AppButton></div></div>;
}

/* ---------- accordion ---------- */
function AccordionClosedDemo() {
  return <AppAccordion items={[{ key: 'a', title: 'Ai được đăng ký thăm gặp?', children: 'Thân nhân có tên trong danh sách thân nhân của người cai nghiện.' }]} />;
}
function AccordionAllOpenDemo() {
  return <AppAccordion items={[{ key: 'a', title: 'Ai được đăng ký thăm gặp?', open: true, children: 'Thân nhân có tên trong danh sách thân nhân của người cai nghiện.' }, { key: 'b', title: 'Mỗi tháng được thăm mấy lần?', open: true, children: 'Theo quỹ thăm cấu hình của cơ sở.' }]} />;
}
function AccordionRichDemo() {
  return <AppAccordion items={[{ key: 'b', title: 'Mỗi tháng được thăm mấy lần?', open: true, children: <AppProgress label="Quỹ thăm đã dùng trong tháng" value={2} max={4} /> }]} />;
}

/* ---------- tree ---------- */
const DESK_TREE = [
  { key: 'dnA', title: 'Dãy nhà A', children: [
    { key: 'q01', title: 'Q01 — Quầy tiếp đón chính', children: [{ key: 'b1', title: 'Q01-01 — Buồng số 1' }, { key: 'b2', title: 'Q01-02 — Buồng số 2' }] },
    { key: 'q02', title: 'Q02 — Quầy tiếp đón phụ', children: [{ key: 'b3', title: 'Q02-01 — Buồng số 1' }] },
  ] },
  { key: 'dnB', title: 'Dãy nhà B', children: [{ key: 'q03', title: 'Q03 — Quầy tiếp đón khu B' }] },
];
function TreeCollapsedDemo() { return <AppTree treeData={DESK_TREE} />; }
function TreeExpandAllDemo() { return <AppTree treeData={DESK_TREE} defaultExpandAll />; }
function TreePartialDemo() { return <AppTree treeData={DESK_TREE} defaultExpandedKeys={['dnB']} />; }
function TreeSelectDemo() {
  const [picked, setPicked] = useState('b2');
  return <AppTree treeData={DESK_TREE} defaultExpandAll selectedKeys={[picked]} onSelect={(k) => k && setPicked(k)} />;
}

/* ---------- scroll-shadow ---------- */
function ScrollFitDemo() {
  const cols = ['Cột 1', 'Cột 2', 'Cột 3'];
  return <div style={{ maxWidth: 520 }}><AppScrollShadow label="Dải mẫu vừa khung">
    <div style={{ display: 'flex', gap: 8, padding: '4px 0' }}>{cols.map((c) => <span key={c} style={{ flex: '0 0 84px', padding: '8px 10px', border: '1px solid var(--color-line)', borderRadius: 8, fontSize: 13 }}>{c}</span>)}</div>
  </AppScrollShadow></div>;
}
const STATUS_STRIP = ['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'CHECKED_IN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ABSENT', 'REJECTED'];
function ScrollTagsDemo() {
  return <div style={{ maxWidth: 320 }}><AppScrollShadow label="Dải tag trạng thái lịch hẹn">
    <div style={{ display: 'flex', gap: 8, width: 'max-content', padding: '4px 0' }}>{STATUS_STRIP.map((s) => <AppointmentStatusTag key={s} status={s} />)}</div>
  </AppScrollShadow></div>;
}
const WIDE_COLS = [
  { key: 'stt', title: 'STT', thStyle: { width: '60px' }, render: (r, i) => i + 1 },
  { key: 'code', title: 'Mã quầy', thStyle: { width: '160px' }, className: 'cell-code' },
  { key: 'name', title: 'Tên quầy', thStyle: { width: '360px' } },
  { key: 'status', title: 'Trạng thái', thStyle: { width: '180px' }, render: (r) => <CatalogStatusTag status={r.status} label={r.status === 'ACTIVE' ? 'Hoạt động' : 'Nháp'} /> },
];
const WIDE_ROWS = [{ code: 'Q01', name: 'Quầy tiếp đón chính', status: 'ACTIVE' }, { code: 'Q02', name: 'Quầy phụ Cổng 2', status: 'DRAFT' }];
function ScrollTableDemo() {
  return <div style={{ maxWidth: 520 }}><AppScrollShadow label="Bảng quầy tiếp đón">
    <div style={{ width: 760 }}><AppTable rowKey="code" columns={WIDE_COLS} dataSource={WIDE_ROWS} /></div>
  </AppScrollShadow></div>;
}

/* ---------- color-swatch ---------- */
const ONE_COLOR = [{ name: 'Chủ đạo', token: '--color-brand' }];
const STATUS_BG_COLORS = [{ name: 'Nền thành công', token: '--color-ok-bg' }, { name: 'Nền cảnh báo', token: '--color-warn-bg' }, { name: 'Nền lỗi', token: '--color-err-bg' }, { name: 'Nền thông tin', token: '--color-info-bg' }];
const INK_COLORS = [{ name: 'Chữ chính', token: '--color-ink-1' }, { name: 'Chữ cấp 2', token: '--color-ink-2' }, { name: 'Chữ cấp 3', token: '--color-ink-3' }, { name: 'Chữ cấp 4', token: '--color-ink-4' }];
const ROW_COLORS = [{ name: 'Dòng rê chuột', token: '--color-row-hover' }, { name: 'Dòng quá giờ chưa check-in', token: '--color-row-late' }, { name: 'Dòng đang diễn ra', token: '--color-row-live' }];
function SwatchOneDemo() { return <AppColorSwatch colors={ONE_COLOR} />; }
function SwatchStatusBgDemo() { return <AppColorSwatch colors={STATUS_BG_COLORS} />; }
function SwatchInkDemo() { return <AppColorSwatch colors={INK_COLORS} />; }
function SwatchRowDemo() { return <AppColorSwatch colors={ROW_COLORS} />; }

export default {
  table: [
    { title: 'Mặc định', desc: 'Bảng tối giản chỉ có cột và dòng dữ liệu.', Demo: TableBasicDemo, code: '<AppTable rowKey="code" columns={DESK_COLS} dataSource={DESK_ROWS} />' },
    { title: 'Ô tích chọn dòng', desc: 'Dùng khi danh sách có thao tác hàng loạt như màn Lịch hẹn.', Demo: TableSelectDemo, code: '<AppTable rowKey="code" columns={DESK_COLS} dataSource={DESK_ROWS} rowSelection={{ selectedRowKeys: keys, onChange: setKeys }} />' },
    { title: 'Chưa có bản ghi', desc: 'Danh sách chưa có bản ghi nào thì dòng rỗng hiện câu I001-27.', Demo: TableEmptyNoRecordDemo, code: '<AppTable rowKey="code" columns={DESK_COLS} dataSource={[]} emptyRow={<EmptyRow colSpan={3} entity="buồng thăm gặp" hasRecords={false} />} />' },
    { title: 'Lọc không ra kết quả', desc: 'Có bản ghi mà bộ lọc không ra thì dòng rỗng hiện câu I001-28.', Demo: TableEmptyFilteredDemo, code: '<AppTable rowKey="code" columns={DESK_COLS} dataSource={[]} emptyRow={<EmptyRow colSpan={3} entity="quầy tiếp đón" hasRecords />} />' },
    { title: 'Đánh số theo trang', desc: 'Bảng ở trang sau cộng thêm số dòng của các trang trước vào cột STT.', Demo: TableOffsetDemo, code: '<AppTable rowKey="code" columns={DESK_COLS} dataSource={DESK_ROWS} indexOffset={20} />' },
    { title: 'Tô dòng vừa tạo', desc: 'Gắn lớp riêng cho dòng vừa thêm để người dùng nhận ra.', Demo: TableRowClassDemo, code: "<AppTable rowKey=\"code\" columns={DESK_COLS} dataSource={DESK_ROWS} rowClassName={(r) => (r.code === 'Q02' ? 'row-new' : '')} />" },
  ],
  'status-tags': [
    { title: 'Mặc định', desc: 'Một tag trạng thái danh mục đứng riêng như ở tiêu đề màn Chi tiết.', Demo: CatalogSingleDemo, code: '<CatalogStatusTag status="ACTIVE" label="Hoạt động" />' },
    { title: 'Hai trạng thái chờ duyệt', desc: 'Chờ duyệt và chờ lãnh đạo duyệt dùng chung 1 màu.', Demo: PendingPairDemo, code: '<AppointmentStatusTag status="PENDING_APPROVAL" />\n<AppointmentStatusTag status="PENDING_HEAD_APPROVAL" />' },
    { title: 'Tag quan hệ thân nhân', desc: 'Màu theo quan hệ với người cai nghiện như cột Quan hệ ở Danh sách lịch hẹn.', Demo: RelationshipTagDemo, code: '<AppTag className="tag tag-relationship-spouse">Vợ</AppTag>\n<AppTag className="tag tag-relationship-mother">Mẹ</AppTag>\n<AppTag className="tag tag-relationship-father">Bố</AppTag>\n<AppTag className="tag tag-relationship-sibling">Anh</AppTag>\n<AppTag className="tag tag-relationship-child">Con</AppTag>' },
    { title: 'Tag loại hình thăm gặp', desc: 'Loại hình tiêu chuẩn có màu riêng giống cột Loại hình ở Danh sách lịch hẹn.', Demo: VisitTypeTagDemo, code: '<AppTag className="tag tag-visit-standard">Thăm gặp trực tiếp tiêu chuẩn</AppTag>' },
    { title: 'Ẩn tag', desc: 'Tag vẫn nằm trong DOM nhưng không hiện khi bật hidden.', Demo: HiddenTagDemo, code: '<AppointmentStatusTag status="APPROVED" id="ex-status-tags-5" hidden={hidden} />' },
  ],
  tabs: [
    { title: 'Mặc định', desc: 'Hai tab, bấm để chuyển nội dung.', Demo: TabsBasicDemo, code: "<AppTabs activeKey={k} onChange={setK} items={[\n  { key: '1', id: 'ex-tabs-1a', label: 'Thông tin quầy', children: … },\n  { key: '2', id: 'ex-tabs-1b', label: 'Lịch sử thao tác', children: … }]} />" },
    { title: 'Một tab duy nhất', desc: 'Màn chỉ có 1 hình thức nhưng vẫn giữ thanh tab như màn Cấu hình thăm gặp.', Demo: TabsSingleDemo, code: "<AppTabs activeKey=\"direct\" onChange={() => {}} items={[{ key: 'direct', id: 'ex-tabs-2', label: 'Thăm gặp trực tiếp', children: … }]} />" },
    { title: 'Nhiều tab', desc: 'Năm tab như màn Chi tiết quầy tiếp đón.', Demo: TabsManyDemo, code: "<AppTabs activeKey={k} onChange={setK} items={DETAIL_TABS.map((label, i) => ({ key: String(i + 1), id: 'ex-tabs-3-' + (i + 1), label, children: … }))} />" },
    { title: 'Mở sẵn tab khác tab đầu', desc: 'Khoá ban đầu của activeKey quyết định tab mở khi vào màn.', Demo: TabsPresetDemo, code: "const [k, setK] = useState('3');\n<AppTabs activeKey={k} onChange={setK} items={APPT_TABS.map((label, i) => ({ key: String(i + 1), id: 'ex-tabs-4-' + (i + 1), label, children: … }))} />" },
  ],
  'page-select': [
    { title: 'Mặc định', desc: 'Năm trang, chọn số trang để nhảy tới.', Demo: PageBasicDemo, code: '<PageSelect id="ex-page-select-1" current={value} total={5} onChange={setValue} />' },
    { title: 'Chỉ 1 trang', desc: 'Danh sách 1 trang vẫn hiện ô với số 1.', Demo: PageOneDemo, code: '<PageSelect id="ex-page-select-2" current={value} total={1} onChange={setValue} />' },
    { title: 'Tổng số trang bằng 0', desc: 'Danh sách rỗng thì ô vẫn liệt kê ít nhất 1 trang.', Demo: PageZeroDemo, code: '<PageSelect id="ex-page-select-3" current={value} total={0} onChange={setValue} />' },
    { title: 'Nhiều trang', desc: 'Năm mươi trang, gõ số vào ô để tìm nhanh.', Demo: PageManyDemo, code: '<PageSelect id="ex-page-select-4" current={value} total={50} onChange={setValue} />' },
  ],
  avatar: [
    { title: 'Mặc định', desc: 'Cỡ md, chữ cái đầu của tên.', Demo: AvatarBasicDemo, code: '<AppAvatar name="Nguyễn Thùy Linh" />' },
    { title: 'Chữ gợi ý riêng', desc: 'Rê chuột hiện chữ title thay cho họ tên.', Demo: AvatarTitleDemo, code: '<AppAvatar name="Nguyễn Thùy Linh" title="Cán bộ Tổ thăm gặp" />' },
    { title: 'Chưa có tên', desc: 'Họ tên rỗng thì avatar hiện dấu hỏi và ẩn khỏi trình đọc màn hình.', Demo: AvatarNoNameDemo, code: '<AppAvatar name="" size="sm" />' },
    { title: 'Nhóm vượt ngưỡng', desc: 'Nhóm cỡ nhỏ chỉ hiện 2 người, phần còn lại gộp thành +n.', Demo: AvatarGroupSmallDemo, code: "<AppAvatarGroup names={['Nguyễn Văn Bình', 'Trần Thị Cúc', 'Lê Văn Dũng', 'Phạm Thị Hà']} max={2} size=\"sm\" />" },
    { title: 'Nhóm trong ngưỡng', desc: 'Số người không vượt max thì không có ô +n.', Demo: AvatarGroupFitDemo, code: "<AppAvatarGroup names={['Nguyễn Văn Bình', 'Trần Thị Cúc', 'Lê Văn Dũng']} max={4} size=\"lg\" />" },
  ],
  'count-badge': [
    { title: 'Số đếm bằng 0', desc: 'Không có mục mới thì huy hiệu tự ẩn.', Demo: BadgeZeroDemo, code: '<AppBadge count={0}><AppButtonWithIcon className="form-btn" icon="bell">Thông báo</AppButtonWithIcon></AppBadge>' },
    { title: 'Ngưỡng tự đặt', desc: 'Vượt max thì hiện dạng max+.', Demo: BadgeMaxDemo, code: '<AppBadge count={12} max={9}><AppButtonWithIcon className="form-btn" icon="bell">Thông báo</AppButtonWithIcon></AppBadge>' },
    { title: 'Đúng bằng ngưỡng', desc: 'Số bằng max vẫn hiện nguyên số.', Demo: BadgeAtMaxDemo, code: '<AppBadge count={99}><AppButtonWithIcon className="form-btn" icon="bell">Thông báo</AppButtonWithIcon></AppBadge>' },
    { title: 'Chấm không nhãn', desc: 'Bật dot mà không truyền label thì trình đọc màn hình đọc câu mặc định.', Demo: BadgeDotDefaultDemo, code: '<AppBadge dot><AppButtonWithIcon className="form-btn" icon="bell">Thông báo</AppButtonWithIcon></AppBadge>' },
    { title: 'Đổi số khi bấm', desc: 'Bấm thử để thấy huy hiệu hiện khi số lớn hơn 0 và ẩn khi về 0.', Demo: BadgeLiveDemo, code: '<AppBadge count={n}><AppButtonWithIcon className="form-btn" icon="bell">Thông báo</AppButtonWithIcon></AppBadge>' },
  ],
  progress: [
    { title: 'Mặc định', desc: 'Không truyền max thì tổng là 100.', Demo: ProgressBasicDemo, code: '<AppProgress label="Đồng bộ dữ liệu" value={40} />' },
    { title: 'Ẩn số liệu', desc: 'Chỉ giữ nhãn và thanh khi con số không cần thiết.', Demo: ProgressNoValueDemo, code: '<AppProgress label="Quỹ thăm đã dùng trong tháng" value={3} max={4} showValue={false} />' },
    { title: 'Tổng bằng 0', desc: 'Chưa cấu hình tổng thì thanh để trống.', Demo: ProgressZeroMaxDemo, code: '<AppProgress label="Quỹ thăm đã dùng trong tháng" value={0} max={0} />' },
    { title: 'Vượt tổng', desc: 'Giá trị lớn hơn tổng thì thanh dừng ở mức đầy.', Demo: ProgressOverDemo, code: '<AppProgress label="Sức chứa buồng" value={12} max={10} tone="warn" />' },
    { title: 'Đổi tông theo giá trị', desc: 'Bấm thử để thấy thanh chuyển sang tông cảnh báo khi dùng hết quỹ.', Demo: ProgressLiveDemo, code: "<AppProgress label=\"Quỹ thăm đã dùng trong tháng\" value={value} max={4} tone={value >= 4 ? 'warn' : 'brand'} />" },
  ],
  accordion: [
    { title: 'Mặc định', desc: 'Một mục, đóng sẵn, bấm tiêu đề để mở.', Demo: AccordionClosedDemo, code: "<AppAccordion items={[{ key: 'a', title: 'Ai được đăng ký thăm gặp?', children: 'Thân nhân có tên trong danh sách thân nhân của người cai nghiện.' }]} />" },
    { title: 'Mở sẵn mọi mục', desc: 'Mỗi mục có open thì mở sẵn khi hiện.', Demo: AccordionAllOpenDemo, code: "<AppAccordion items={[\n  { key: 'a', title: 'Ai được đăng ký thăm gặp?', open: true, children: 'Thân nhân có tên trong danh sách thân nhân của người cai nghiện.' },\n  { key: 'b', title: 'Mỗi tháng được thăm mấy lần?', open: true, children: 'Theo quỹ thăm cấu hình của cơ sở.' }]} />" },
    { title: 'Nội dung là phần tử', desc: 'Thân mục nhận được control khác thay cho chữ.', Demo: AccordionRichDemo, code: "<AppAccordion items={[{ key: 'b', title: 'Mỗi tháng được thăm mấy lần?', open: true, children: <AppProgress label=\"Quỹ thăm đã dùng trong tháng\" value={2} max={4} /> }]} />" },
  ],
  tree: [
    { title: 'Mặc định', desc: 'Mọi nhánh đóng, bấm mũi tên để mở từng cấp.', Demo: TreeCollapsedDemo, code: '<AppTree treeData={DESK_TREE} />' },
    { title: 'Mở sẵn mọi nhánh', desc: 'Cây nhỏ thì mở hết để thấy toàn bộ cấp.', Demo: TreeExpandAllDemo, code: '<AppTree treeData={DESK_TREE} defaultExpandAll />' },
    { title: 'Mở sẵn 1 nhánh', desc: 'Chỉ mở nhánh cần chú ý khi hiện cây.', Demo: TreePartialDemo, code: "<AppTree treeData={DESK_TREE} defaultExpandedKeys={['dnB']} />" },
    { title: 'Chọn 1 nút', desc: 'Nút đang chọn giữ ở state, bấm nút khác để đổi.', Demo: TreeSelectDemo, code: '<AppTree treeData={DESK_TREE} defaultExpandAll selectedKeys={[picked]} onSelect={(k) => k && setPicked(k)} />' },
  ],
  'scroll-shadow': [
    { title: 'Nội dung vừa khung', desc: 'Không có phần bị che thì không hiện bóng.', Demo: ScrollFitDemo, code: '<AppScrollShadow label="Dải mẫu vừa khung">…</AppScrollShadow>' },
    { title: 'Dải tag trạng thái', desc: 'Dải tag dài trong khung hẹp, cuộn để xem hết.', Demo: ScrollTagsDemo, code: '<AppScrollShadow label="Dải tag trạng thái lịch hẹn">{STATUS_STRIP.map((s) => <AppointmentStatusTag key={s} status={s} />)}</AppScrollShadow>' },
    { title: 'Bọc bảng rộng', desc: 'Bảng rộng hơn khung thì bóng báo còn cột ở mép phải.', Demo: ScrollTableDemo, code: '<AppScrollShadow label="Bảng quầy tiếp đón"><AppTable rowKey="code" columns={WIDE_COLS} dataSource={WIDE_ROWS} /></AppScrollShadow>' },
  ],
  'color-swatch': [
    { title: 'Mặc định', desc: 'Một màu, mã màu đọc từ CSS thật.', Demo: SwatchOneDemo, code: "<AppColorSwatch colors={[{ name: 'Chủ đạo', token: '--color-brand' }]} />" },
    { title: 'Nền trạng thái', desc: 'Các màu nền đi kèm thông báo thành công, cảnh báo, lỗi, thông tin.', Demo: SwatchStatusBgDemo, code: "<AppColorSwatch colors={[{ name: 'Nền thành công', token: '--color-ok-bg' }, { name: 'Nền cảnh báo', token: '--color-warn-bg' }, { name: 'Nền lỗi', token: '--color-err-bg' }, { name: 'Nền thông tin', token: '--color-info-bg' }]} />" },
    { title: 'Thang màu chữ', desc: 'Bốn cấp màu chữ từ đậm tới nhạt.', Demo: SwatchInkDemo, code: "<AppColorSwatch colors={[{ name: 'Chữ chính', token: '--color-ink-1' }, { name: 'Chữ cấp 2', token: '--color-ink-2' }, { name: 'Chữ cấp 3', token: '--color-ink-3' }, { name: 'Chữ cấp 4', token: '--color-ink-4' }]} />" },
    { title: 'Màu dòng bảng', desc: 'Màu nền dòng khi rê chuột, quá giờ chưa check-in và đang diễn ra.', Demo: SwatchRowDemo, code: "<AppColorSwatch colors={[{ name: 'Dòng rê chuột', token: '--color-row-hover' }, { name: 'Dòng quá giờ chưa check-in', token: '--color-row-late' }, { name: 'Dòng đang diễn ra', token: '--color-row-live' }]} />" },
  ],
};
