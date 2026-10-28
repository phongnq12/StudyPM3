/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Mẫu chạy thật của 5 control bổ sung theo Design System PM1 — gọi thẳng component trong src/components/app.
 * Chữ trong mẫu là dữ liệu minh hoạ theo nghiệp vụ PM2, câu thông báo gọi msg theo mã. */
import { useState } from 'react';
import AppSelect from '@/components/app/AppSelect';
import AppTreeSelect from '@/components/app/AppTreeSelect';
import AppStatCards from '@/components/app/AppStatCards';
import AppEmptyState from '@/components/app/AppEmptyState';
import AppImportExcel from '@/components/app/AppImportExcel';
import { AppButtonWithIcon } from '@/components/app/AppButton';
import { msg } from '@/lib/msg';

const col = { display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 420 };
const PLUS = '<path d="M12 5v14M5 12h14"/>';
const RETRY = '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>';
const BACK = '<path d="M19 12H5M12 19l-7-7 7-7"/>';

export function TreeSelectDemo() {
  const [v, setV] = useState();
  return <div style={col}><AppTreeSelect value={v} onChange={setV} placeholder="Chọn quầy hoặc buồng" treeDefaultExpandAll treeData={[
    { value: 'dnA', title: 'Dãy nhà A', children: [
      { value: 'Q01', title: 'Q01 — Quầy tiếp đón chính', children: [{ value: 'Q01-01', title: 'Q01-01 — Buồng số 1' }, { value: 'Q01-02', title: 'Q01-02 — Buồng số 2' }] },
      { value: 'Q02', title: 'Q02 — Quầy tiếp đón phụ', children: [{ value: 'Q02-01', title: 'Q02-01 — Buồng số 1' }] },
    ] },
    { value: 'dnB', title: 'Dãy nhà B', children: [{ value: 'Q03', title: 'Q03 — Quầy tiếp đón khu B' }] },
  ]} /></div>;
}

export function MultiSelectDemo() {
  const [v, setV] = useState(['Q01-01', 'Q01-02', 'Q01-04', 'Q02-02', 'Q02-03']);
  const options = ['Q01-01', 'Q01-02', 'Q01-04', 'Q01-05', 'Q02-02', 'Q02-03', 'Q02-04'].map((c) => ({ value: c, label: c + ' — Buồng số ' + c.slice(-2) }));
  return <div style={col}><AppSelect mode="multiple" value={v} onChange={setV} options={options} placeholder="Chọn buồng thăm gặp" maxTagCount={3} style={{ width: '100%' }} /></div>;
}

export function StatCardsDemo() {
  return <AppStatCards items={[
    { key: 'a', label: 'Lịch hẹn trong tuần', value: 1284, delta: '+12 so với tuần trước', tone: 'up' },
    { key: 'b', label: 'Chờ duyệt', value: 37, delta: '−5 so với hôm qua', tone: 'down' },
    { key: 'c', label: 'Buồng đang dùng', value: '9 / 12' },
  ]} />;
}

export function EmptyStatesDemo() {
  const box = { border: '1px solid var(--color-line)', borderRadius: 8, background: '#fff' };
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, width: '100%' }}>
    <div style={box}><AppEmptyState kind="empty" text={msg('I001-48', 'quầy tiếp đón', 'Tạo mới')} action={<AppButtonWithIcon className="btn btn-primary" iconRaw={PLUS}>Tạo mới</AppButtonWithIcon>} /></div>
    <div style={box}><AppEmptyState kind="forbidden" text={msg('SE001-07')} /></div>
    <div style={box}><AppEmptyState kind="error" text={msg('SE001-01', 'Tải dữ liệu')} action={<AppButtonWithIcon className="btn" iconRaw={RETRY}>Thử lại</AppButtonWithIcon>} /></div>
    <div style={box}><AppEmptyState kind="deleted" text={msg('E001-15', 'Lịch hẹn LH-2026-0914')} action={<AppButtonWithIcon className="btn" iconRaw={BACK}>Quay lại danh sách</AppButtonWithIcon>} /></div>
  </div>;
}

export function ImportExcelDemo() {
  return <div style={{ width: '100%', maxWidth: 720, border: '1px solid var(--color-line)', borderRadius: 8, background: '#fff', padding: 16 }}>
    <AppImportExcel fileName="DanhSachQuay_14102026.xlsx" percent={100}
      labels={{ template: 'Tải tệp mẫu, điền dữ liệu theo đúng cột', templateButton: 'Tải tệp mẫu', pick: 'Chọn tệp .xlsx, tối đa 10MB', dropHint: 'Bấm hoặc kéo tệp vào đây', preview: 'Xem trước 10 dòng đầu', errorCount: '{0} dòng lỗi', errorColumn: 'Lỗi' }}
      columns={[{ key: 'code', title: 'Mã quầy' }, { key: 'name', title: 'Tên quầy' }]}
      rows={[{ key: 1, code: 'Q04', name: 'Quầy tiếp đón khu C' }, { key: 2, code: '', name: 'Quầy phụ cổng 3', error: msg('E001-01', 'mã quầy') }, { key: 3, code: 'Q06', name: 'Quầy tiếp đón khu D' }]} />
  </div>;
}
