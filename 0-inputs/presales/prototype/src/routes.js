/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Routes — PM2 keeps the 2-level page path /{group}/{feature}; record sub-pages follow PM1: tao-moi · :id · :id/chinh-sua.
 * No trailing slash (PM1: 0/545 routes). Single source for route patterns and record links.
 * Rules: Prototype_Conventions/Naming_Conventions.md §③ */
export const ROUTES = {
  login: '/dang-nhap',   /* cùng đường dẫn với PM1 */
  /* PM3 · Hàng hóa và giá — Giá nhập theo nhà cung cấp */
  purchasePriceList: '/hang-hoa/gia-nhap',
  purchasePriceCreate: '/hang-hoa/gia-nhap/tao-moi',
  purchasePriceDetail: '/hang-hoa/gia-nhap/:id',
  purchasePriceEdit: '/hang-hoa/gia-nhap/:id/chinh-sua',
  overview: '/tong-quan',
  appointmentList: '/lich-hen/tham-gap-truc-tiep',
  exceptionList: '/lich-hen/gap-truc-tiep-ngoai-le',   /* đơn ngoại lệ chờ Trưởng cơ sở duyệt, tạo tại quầy */
  appointmentCreate: '/lich-hen/tham-gap-truc-tiep/tao-moi',
  appointmentCalendar: '/lich-hen/tham-gap-truc-tiep/lich-theo-buong',   /* Lịch theo buồng là màn riêng */
  exceptionCalendar: '/lich-hen/gap-truc-tiep-ngoai-le/lich-theo-buong',
  appointmentDetail: '/lich-hen/tham-gap-truc-tiep/:id',
  appointmentEdit: '/lich-hen/tham-gap-truc-tiep/:id/chinh-sua',
  exceptionDetail: '/lich-hen/gap-truc-tiep-ngoai-le/:id',             /* Chi tiết, Chỉnh sửa đơn ngoại lệ là màn riêng của module ngoại lệ */
  exceptionEdit: '/lich-hen/gap-truc-tiep-ngoai-le/:id/chinh-sua',
  counterRegistration: '/tiep-don/dang-ky-luot-tai-quay',
  receptionDeskList: '/tiep-don/quay-tiep-don',
  receptionDeskCreate: '/tiep-don/quay-tiep-don/tao-moi',
  receptionDeskEdit: '/tiep-don/quay-tiep-don/:id/chinh-sua',
  receptionDeskDetail: '/tiep-don/quay-tiep-don/:id',
  visitConfig: '/van-hanh-co-so/cau-hinh-thoi-gian',
  visitConfigEdit: '/van-hanh-co-so/cau-hinh-thoi-gian/chinh-sua',
  notificationList: '/quan-tri/thong-bao',
  notificationSettings: '/quan-tri/cai-dat-thong-bao',
};

const withId = (pattern, id) => pattern.replace(':id', encodeURIComponent(id));
export const appointmentDetailPath = (code) => withId(ROUTES.appointmentDetail, code);
export const appointmentEditPath = (code) => withId(ROUTES.appointmentEdit, code);
export const exceptionDetailPath = (code) => withId(ROUTES.exceptionDetail, code);
export const exceptionEditPath = (code) => withId(ROUTES.exceptionEdit, code);
export const receptionDeskEditPath = (code) => withId(ROUTES.receptionDeskEdit, code);
export const purchasePriceDetailPath = (code) => withId(ROUTES.purchasePriceDetail, code);
export const purchasePriceEditPath = (code) => withId(ROUTES.purchasePriceEdit, code);
export const receptionDeskDetailPath = (code) => withId(ROUTES.receptionDeskDetail, code);

/* Record id of the current page: /{group}/{feature}/:id or /{group}/{feature}/:id/chinh-sua — null on list / create pages */
export function readRouteId() {
  const parts = location.pathname.split('/').filter(Boolean);
  if (parts[parts.length - 1] === 'chinh-sua') parts.pop();
  return parts.length === 3 && parts[2] !== 'tao-moi' && parts[2] !== 'lich-theo-buong' ? decodeURIComponent(parts[2]) : null;
}
