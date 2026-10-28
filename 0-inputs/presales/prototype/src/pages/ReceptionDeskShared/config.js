/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Shared config of the reception counter pages (WEB-02) */
import { operationsLayout } from '@/layout/menuConfig';

export const LIST_URL = '/tiep-don/quay-tiep-don';
export const MENU_LABEL = 'Cài đặt quầy tiếp đón';
/* Frame of the Vận hành Cơ sở group; extra = breadcrumb items after the group */
export function counterLayout(extra) {
  const L = operationsLayout(MENU_LABEL);
  return { menu: L.menu, sidebar: L.sidebar, breadcrumb: [...L.breadcrumb, ...extra] };
}

/* Tooltip text by button label */
export const RECEPTION_DESCRIPTIONS = {
  'Xuất Excel': 'Tải danh sách quầy tiếp đón đang lọc ra file Excel',
  'Tạo mới': 'Khai báo quầy tiếp đón mới',
  'Đóng': 'Đóng cửa sổ này',
  'Hủy': 'Hủy thao tác, không lưu thay đổi',
  'Quay lại': 'Quay lại, không thực hiện thao tác',
  'Trang trước': 'Xem trang trước',
  'Trang sau': 'Xem trang sau',
};

/* Icon paths of the counter pages */
export const COUNTER_ICONS = {
  view: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  edit: '<path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  activate: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  deactivate: '<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>',
  delete: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"/>',
  desk: '<path d="M2 20h20M4 20V8h16v12M8 8V4h8v4"/>',
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
  warning: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
};

export const STATUS_CLASS = { DRAFT: 'tag-draft', ACTIVE: 'tag-active', INACTIVE: 'tag-inactive' };

/* Row / page actions by status (spec WEB-02 · Knowhow C.1 điều 7) — delete is further limited to counters without appointments */
export const ACTIONS_BY_STATUS = { DRAFT: ['view', 'edit', 'activate', 'delete'], ACTIVE: ['view', 'edit', 'deactivate'], INACTIVE: ['view', 'edit', 'activate'] };
export const ACTION_CONFIG = {
  view: { label: 'Xem chi tiết', tone: 'view' },
  edit: { label: 'Chỉnh sửa', tone: 'edit' },
  activate: { label: 'Kích hoạt', tone: 'approve' },
  deactivate: { label: 'Vô hiệu hóa', tone: 'warn' },
  delete: { label: 'Xóa quầy tiếp đón', tone: 'danger', danger: true },
};
