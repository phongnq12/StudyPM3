/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Mẫu chạy thật của 4 control bổ sung gọi thẳng component trong src/components/app.
 * Tách file riêng khỏi ExtraDemos.jsx để không sửa chồng file phiên khác đang thêm mẫu. Chữ trong mẫu là dữ liệu minh hoạ. */
import AppScrollShadow from '@/components/app/AppScrollShadow';
import AppKbd from '@/components/app/AppKbd';
import AppToolbar from '@/components/app/AppToolbar';
import AppColorSwatch from '@/components/app/AppColorSwatch';
import { AppButtonWithIcon } from '@/components/app/AppButton';

export function ScrollShadowDemo() {
  const cols = Array.from({ length: 12 }, (_, i) => 'Cột ' + (i + 1));
  /* dải thẻ rộng cố định 1100px để luôn tràn khung 520px (lớp .sd-table của site ép min-width 0 nên không dùng được cho mẫu tràn) */
  return <div style={{ maxWidth: 520 }}>
    <AppScrollShadow label="Dải mẫu cuộn ngang">
      <div style={{ display: 'flex', gap: 8, width: 1100, padding: '4px 0' }}>{cols.map((c) => <span key={c} style={{ flex: '0 0 84px', padding: '8px 10px', border: '1px solid var(--color-line)', borderRadius: 8, fontSize: 13 }}>{c}</span>)}</div>
    </AppScrollShadow>
  </div>;
}
export function KbdDemo() {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    <span>Lưu nhanh: <AppKbd keys={['Ctrl', 'S']} /></span>
    <span>Đóng hộp thoại: <AppKbd keys={['Esc']} /></span>
    <span>Đi giữa các nút trong thanh công cụ: <AppKbd keys={['←']} /> <AppKbd keys={['→']} /></span>
  </div>;
}
export function ToolbarDemo() {
  return <AppToolbar label="Thao tác với danh sách" groups={[
    [<AppButtonWithIcon key="a" className="form-btn" icon="plus">Thêm</AppButtonWithIcon>, <AppButtonWithIcon key="b" className="form-btn" icon="edit">Sửa</AppButtonWithIcon>],
    [<AppButtonWithIcon key="c" className="form-btn" icon="file">Xuất Excel</AppButtonWithIcon>],
  ]} />;
}
export function ColorSwatchDemo() {
  return <AppColorSwatch colors={[
    { name: 'Chủ đạo', token: '--color-brand' }, { name: 'Thành công', token: '--color-ok' }, { name: 'Cảnh báo', token: '--color-warn' },
    { name: 'Lỗi', token: '--color-err' }, { name: 'Thông tin', token: '--color-info' }, { name: 'Chữ chính', token: '--color-ink-1' },
  ]} />;
}
