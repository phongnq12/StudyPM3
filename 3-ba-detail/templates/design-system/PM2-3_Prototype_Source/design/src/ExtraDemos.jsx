/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Mẫu chạy thật của 14 control bổ sung — gọi thẳng component trong src/components/app, không dựng lại markup.
 * Chữ trong mẫu là dữ liệu minh hoạ, chưa màn PM2 nào dùng các control này. */
import { useState } from 'react';
import AppRadioGroup from '@/components/app/AppRadioGroup';
import AppCheckboxGroup from '@/components/app/AppCheckboxGroup';
import AppNumberInput from '@/components/app/AppNumberInput';
import AppSegmented from '@/components/app/AppSegmented';
import AppAvatar, { AppAvatarGroup } from '@/components/app/AppAvatar';
import AppBadge from '@/components/app/AppBadge';
import AppProgress from '@/components/app/AppProgress';
import AppSpinner from '@/components/app/AppSpinner';
import AppSkeleton from '@/components/app/AppSkeleton';
import AppDivider from '@/components/app/AppDivider';
import AppAccordion from '@/components/app/AppAccordion';
import AppDrawer from '@/components/app/AppDrawer';
import AppPopover from '@/components/app/AppPopover';
import AppLink from '@/components/app/AppLink';
import { AppButton, AppButtonWithIcon } from '@/components/app/AppButton';
import AppMediaGallery from '@/components/app/AppMediaGallery';
import AppTree from '@/components/app/AppTree';
import { Breadcrumb } from '@/layout/AppLayout';                   /* đúng breadcrumb của khung trang */
import { appointmentsLayout, operationsLayout, DIRECT_LIST_LABEL } from '@/layout/menuConfig';
import { MENU_LABEL as COUNTER_MENU, LIST_URL as COUNTER_URL } from '@/pages/ReceptionDeskShared/config';
import { ROUTES } from '@/routes';

const col = { display: 'flex', flexDirection: 'column', gap: 16 };
const row = { display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' };

export function RadioGroupDemo() {
  const [v, setV] = useState('direct');
  return <div style={col}>
    <AppRadioGroup name="sdHinhThuc" label="Hình thức thăm gặp" value={v} onChange={setV} options={[{ value: 'direct', label: 'Trực tiếp' }, { value: 'video', label: 'Gọi điện có hình ảnh' }, { value: 'other', label: 'Khác', disabled: true }]} />
    <AppRadioGroup name="sdHinhThuc2" label="Hình thức thăm gặp (dọc)" vertical value={v} onChange={setV} options={[{ value: 'direct', label: 'Trực tiếp' }, { value: 'video', label: 'Gọi điện có hình ảnh' }]} />
  </div>;
}
export function CheckboxGroupDemo() {
  const [v, setV] = useState(['T4']);
  return <AppCheckboxGroup label="Ngày thăm trong tuần" value={v} onChange={setV} options={['T2', 'T3', 'T4', 'T5', 'T6'].map((d) => ({ value: d, label: d }))} />;
}
export function NumberInputDemo() {
  const [v, setV] = useState(3);
  return <div style={row}><AppNumberInput id="sdSoNguoi" label="Số người đi cùng" value={v} onChange={setV} min={0} max={5} /><AppNumberInput label="Ô số khoá" value={2} disabled /></div>;
}
export function SegmentedDemo() {
  const [v, setV] = useState('list');
  return <AppSegmented value={v} onChange={setV} items={[{ key: 'list', label: 'Danh sách', iconRaw: '<path d="M3 6h18M3 12h18M3 18h18"/>' }, { key: 'cal', label: 'Lịch theo buồng', icon: 'calendar' }]} />;
}
export function AvatarDemo() {
  return <div style={row}><AppAvatar name="Nguyễn Thùy Trang" size="sm" /><AppAvatar name="Nguyễn Thùy Trang" /><AppAvatar name="Lê Văn An" size="lg" /><AppAvatarGroup names={['Nguyễn Văn Bình', 'Trần Thị Cúc', 'Lê Văn Dũng', 'Phạm Thị Hà', 'Hoàng Văn Khánh', 'Vũ Thị Lan']} /></div>;
}
export function BadgeDemo() {
  return <div style={row}>
    {/* bỏ nhãn tự đặt «n thông báo chưa đọc» (không có trong Message List) — AppBadge tự đọc con số */}
    <AppBadge count={3}><AppButtonWithIcon className="form-btn" icon="bell">Thông báo</AppButtonWithIcon></AppBadge>
    <AppBadge count={128}><AppButtonWithIcon className="form-btn" icon="bell">Thông báo</AppButtonWithIcon></AppBadge>
    <AppBadge dot label="Có mục mới"><AppButtonWithIcon className="form-btn" icon="file">Tài liệu</AppButtonWithIcon></AppBadge>
    {/* số đếm nằm TRONG nút, sau chữ — dùng lại khuôn số đếm của tab trạng thái (.tab-count) */}
    <AppButtonWithIcon className="form-btn" icon="bell" aria-label="Thông báo, 3 chưa đọc">Thông báo <span className="tab-count tone-brand">3</span></AppButtonWithIcon>
  </div>;
}
/* Breadcrumb — gọi đúng component của khung trang. Mục cuối là màn hiện tại, chữ đậm, không bấm */
const noop = () => {};   /* mẫu: bấm không rời trang Design System */
export function BreadcrumbDemo() {
  return <div style={col}>
    {/* Đủ tầng như màn thật: Tổng quan › nhóm menu › màn danh sách › màn con. Màn con (Tạo, Chi tiết, Chỉnh sửa, Lịch theo buồng) thêm 1 cấp, cấp danh sách bấm được */}
    <div className="sd-muted">Màn danh sách</div>
    <Breadcrumb items={bcDemo(BC_SAMPLES.list)} />
    <div className="sd-muted">Màn con: Tạo mới</div>
    <Breadcrumb items={bcDemo(BC_SAMPLES.create)} />
    <div className="sd-muted">Màn con: Chi tiết</div>
    <Breadcrumb items={bcDemo(BC_SAMPLES.detail)} />{/* cấp cuối không kèm mã, mã nằm ở tiêu đề màn */}
    <div className="sd-muted">Màn con: chế độ xem riêng (Lịch theo buồng)</div>
    <Breadcrumb items={bcDemo(BC_SAMPLES.grid)} />
  </div>;
}
/* 20/10/2026: mẫu breadcrumb gọi thẳng hàm khung và hằng tên menu của màn thật ⇒ đổi menu thì mẫu tự đổi theo, không gõ cứng tên cấp.
 * Tên cấp cuối là tên màn con, lấy đúng chữ màn thật đang dùng. ExamplesF.jsx dùng lại bộ này. */
export const BC_SAMPLES = (() => {
  const ops = operationsLayout(COUNTER_MENU).breadcrumb;
  const appt = appointmentsLayout(DIRECT_LIST_LABEL).breadcrumb;
  const apptList = { label: DIRECT_LIST_LABEL, href: ROUTES.appointmentList };
  return {
    list: [...ops, { label: COUNTER_MENU }],
    create: [...ops, { label: COUNTER_MENU, href: COUNTER_URL }, { label: 'Tạo quầy tiếp đón' }],
    detail: [...appt, apptList, { label: 'Chi tiết lịch hẹn' }],
    grid: [...appt, apptList, { label: 'Lịch theo buồng' }],
  };
})();
/* bấm mẫu không rời trang Design System: cấp trên đổi href sang hàm rỗng, cấp cuối chỉ có nhãn */
export const bcDemo = (items, href) => items.map((b, i) => (i === items.length - 1 ? { label: b.label } : href ? { label: b.label, href } : { label: b.label, onClick: noop }));
/* chuỗi code hiển thị kèm mẫu, sinh từ cùng dữ liệu */
export const bcCode = (items, attr = 'onClick') => '<Breadcrumb items={[' + items.map((b, i) => "{ label: '" + b.label + "'" + (i === items.length - 1 ? '' : ', ' + attr) + ' }').join(', ') + ']} />';
/* Ảnh và video — dữ liệu minh hoạ, chưa có tệp thật nên video hiện ô giữ chỗ */
const posterSvg = (t) => 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180"><rect width="320" height="180" fill="#1E293B"/><circle cx="110" cy="80" r="26" fill="#475569"/><rect x="74" y="112" width="72" height="40" rx="20" fill="#475569"/><circle cx="220" cy="80" r="26" fill="#64748B"/><rect x="184" y="112" width="72" height="40" rx="20" fill="#64748B"/><text x="12" y="22" fill="#CBD5E1" font-family="Arial" font-size="12">' + t + '</text></svg>');
export function MediaDemo() {
  return <AppMediaGallery id="sdMediaXem" items={[
    { key: 'v1', type: 'video', poster: posterSvg('LH-2026-0012 · 09:15'), title: 'Bản ghi cuộc gọi LH-2026-0012', meta: 'Thứ Tư, 14/10/2026 · 09:15 ~ 09:30', duration: '15:02' },
    { key: 'v2', type: 'video', title: 'Bản ghi cuộc gọi LH-2026-0013', meta: 'Thứ Tư, 14/10/2026 · 10:00 ~ 10:20', duration: '20:00' },
    /* ảnh theo nghiệp vụ có thật của PM2 — giám sát cuộc gọi video (AppMediaGallery.jsx dòng 2), bỏ ảnh check-in và giấy tờ */
    { key: 'i1', type: 'image', src: posterSvg('Ảnh cuộc gọi LH-2026-0012'), title: 'Ảnh cuộc gọi LH-2026-0012', meta: 'Thứ Tư, 14/10/2026 · 09:20' },
    { key: 'i2', type: 'image', title: 'Ảnh cuộc gọi LH-2026-0013', meta: 'Chưa tải tệp' },
  ]} />;
}
/* Cây thư mục, cây tổ chức — dữ liệu minh hoạ theo danh mục tài nguyên PM2 */
export function TreeDemo() {
  const [picked, setPicked] = useState('q01');
  return <div style={col}>
    <AppTree defaultExpandedKeys={['cs', 'dnA', 'q01']} selectedKeys={[picked]} onSelect={(k) => k && setPicked(k)} treeData={[
      { key: 'cs', title: 'Cơ sở cai nghiện', children: [
        { key: 'dnA', title: 'Dãy nhà A', children: [
          { key: 'q01', title: 'Q01 — Quầy tiếp đón chính', children: [{ key: 'b1', title: 'Q01-01 — Buồng số 1' }, { key: 'b2', title: 'Q01-02 — Buồng số 2' }] },
          { key: 'q02', title: 'Q02 — Quầy tiếp đón phụ', children: [{ key: 'b3', title: 'Q02-01 — Buồng số 1' }] },
        ] },
        { key: 'dnB', title: 'Dãy nhà B', children: [{ key: 'q03', title: 'Q03 — Quầy tiếp đón khu B' }] },
      ] },
    ]} />
  </div>;
}
export function ProgressDemo() {
  return <div style={col}><AppProgress label="Quỹ thăm đã dùng trong tháng" value={2} max={4} /><AppProgress label="Sức chứa buồng" value={9} max={10} tone="warn" /><AppProgress label="Đồng bộ dữ liệu" value={100} max={100} tone="ok" /></div>;
}
export function SpinnerDemo() {
  return <div style={row}><AppSpinner text="Đang tải" /><AppSpinner size="lg" /></div>;
}
export function SkeletonDemo() {
  return <div style={{ maxWidth: 420 }}><AppSkeleton lines={4} /></div>;
}
export function DividerDemo() {
  return <div style={col}><span>Nội dung nhóm 1</span><AppDivider /><span>Nội dung nhóm 2</span><AppDivider label="Hoặc" /><span>Nội dung nhóm 3</span></div>;
}
export function AccordionDemo() {
  return <AppAccordion items={[{ key: 'a', title: 'Ai được đăng ký thăm gặp?', open: true, children: 'Thân nhân có tên trong danh sách thân nhân của người cai nghiện.' }, { key: 'b', title: 'Mỗi tháng được thăm mấy lần?', children: 'Theo quỹ thăm cấu hình của cơ sở.' }]} />;
}
export function DrawerDemo() {
  const [open, setOpen] = useState(false);
  return <div>
    <AppButtonWithIcon className="form-btn" icon="view" onClick={() => setOpen(true)}>Mở ngăn kéo</AppButtonWithIcon>
    <AppDrawer open={open} id="sdDrawer" title="Thông tin nhanh" onClose={() => setOpen(false)} footer={<><AppButton className="form-btn" onClick={() => setOpen(false)}>Đóng</AppButton></>}>
      Nội dung xem nhanh của 1 bản ghi, không rời màn danh sách.
    </AppDrawer>
  </div>;
}
export function PopoverDemo() {
  return <AppPopover id="sdPopover" triggerLabel="Quy định quỹ thăm" triggerIcon="file" title="Quỹ thăm trong tháng">Mỗi người cai nghiện có số lượt thăm tối đa trong tháng theo cấu hình của cơ sở.</AppPopover>;
}
export function LinkDemo() {
  return <div style={col}>
    <span>Xem <AppLink href="#/rules">Bộ luật UI/UX</AppLink> trước khi dựng màn.</span>
    <span><AppLink href="https://trangnt5-pm2-prototype.web.app" external>Mở Prototype PM2</AppLink></span>
    <span><AppLink href="#/rules" disabled>Liên kết khoá</AppLink></span>
  </div>;
}
